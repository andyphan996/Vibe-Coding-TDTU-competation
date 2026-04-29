from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
# from vector import retriever  # bỏ comment nếu bạn dùng RAG
import json
import re
from datetime import datetime, timedelta

# ─────────────────────────────────────────
# Model
# ─────────────────────────────────────────
model = OllamaLLM(model="llama3:8b")

# ─────────────────────────────────────────
# Template 1: Trích xuất task từ câu nói tự nhiên
# ─────────────────────────────────────────
EXTRACT_TEMPLATE = """
You are a task extraction engine. Today is {today}.

USER INPUT:
\"\"\"{question}\"\"\"

Your job:
Extract ALL tasks mentioned in the user input. For each task, infer:
- name: short task name (in Vietnamese)
- deadline: absolute date in YYYY-MM-DD format
  * "mai" = tomorrow = {tomorrow}
  * "tuan sau" / "tuan toi" = next week = {next_week}
  * "thang sau" / "thang toi" = next month = {next_month}
  * If no time keyword found, set deadline = {next_week} as default
- difficulty: score 0.0-1.0
  * Toan, Vat ly, Hoa, Lap trinh, He dieu hanh -> 0.7-1.0
  * Van, Su, Dia, Anh van -> 0.4-0.7
  * Bai tap nho, doc sach -> 0.2-0.5
- estimated_duration: total minutes needed to complete the task
- category: "study" | "project" | "exercise" | "other"

CRITICAL RULES:
- Output ONLY valid JSON. No markdown, no explanation, no extra text.
- All string values must be in Vietnamese.

OUTPUT FORMAT:
{{
  "extracted_tasks": [
    {{
      "name": "string",
      "deadline": "YYYY-MM-DD",
      "difficulty": number,
      "estimated_duration": number,
      "category": "string"
    }}
  ]
}}
"""

# ─────────────────────────────────────────
# Template 2: Ưu tiên hóa & lên lịch (chỉ task mới)
# ─────────────────────────────────────────
PRIORITIZE_TEMPLATE = """
You are a task prioritization and scheduling engine. Today is {today}.

TASKS TO PROCESS:
{tasks}

Your job:
1. Calculate a priority score (0.0-1.0) for each task using this formula:
   - deadline_urgency = 1.0 - (days_until_deadline / 30), clamped to [0, 1]
   - priority = (deadline_urgency * 0.6) + (difficulty * 0.3) + (min(estimated_duration, 240) / 240 * 0.1)
2. Sort tasks by priority score descending.
3. Build a realistic day-by-day study schedule from today ({today}) until the last deadline.
   Rules for scheduling:
   - Max 240 minutes of study per day
   - Distribute task sessions across multiple days if needed
   - Prioritize tasks with closer deadlines first
   - Each session must finish before the task's deadline

CRITICAL RULES:
- Output ONLY valid JSON. No markdown, no explanation, no extra text.
- All string values must be in Vietnamese.
- All dates must be YYYY-MM-DD format.

OUTPUT FORMAT:
{{
  "tasks": [
    {{
      "name": "string",
      "deadline": "YYYY-MM-DD",
      "estimated_duration": number,
      "difficulty": number,
      "priority": number,
      "priority_reason": "string",
      "status": "pending"
    }}
  ],
  "schedule": [
    {{
      "date": "YYYY-MM-DD",
      "sessions": [
        {{
          "task": "string",
          "duration_minutes": number
        }}
      ]
    }}
  ]
}}
"""

extract_prompt = ChatPromptTemplate.from_template(EXTRACT_TEMPLATE)
prioritize_prompt = ChatPromptTemplate.from_template(PRIORITIZE_TEMPLATE)

extract_chain = extract_prompt | model
prioritize_chain = prioritize_prompt | model


# ─────────────────────────────────────────
# Hàm parse JSON an toàn (xử lý text thừa)
# ─────────────────────────────────────────
def safe_parse_json(text: str):
    """Trích xuất JSON từ response kể cả khi có text thừa xung quanh."""
    # Thử parse thẳng trước
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass

    # Tìm block JSON đầu tiên bằng regex
    match = re.search(r'\{[\s\S]*\}', text)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    print("Khong the parse JSON tu response:")
    print(text[:500])
    return None


# ─────────────────────────────────────────
# Agent chính
# ─────────────────────────────────────────
def run_agent(question: str) -> dict:
    today = datetime.now()
    date_ctx = {
        "today":      today.strftime("%Y-%m-%d"),
        "tomorrow":   (today + timedelta(days=1)).strftime("%Y-%m-%d"),
        "next_week":  (today + timedelta(weeks=1)).strftime("%Y-%m-%d"),
        "next_month": (today + timedelta(days=30)).strftime("%Y-%m-%d"),
    }

    # ── Bước 1: Trích xuất task từ câu nói tự nhiên ──
    print("\n[1/2] Dang trich xuat task...")
    extract_response = extract_chain.invoke({
        "question": question,
        **date_ctx,
    })

    extracted = safe_parse_json(extract_response)
    if not extracted or "extracted_tasks" not in extracted:
        print("Loi: Khong trich xuat duoc task nao. Thu lai hoac nhap ro hon.")
        return None

    new_tasks = extracted["extracted_tasks"]
    print(f"      Trich xuat duoc {len(new_tasks)} task: {[t['name'] for t in new_tasks]}")

    # ── Bước 2: Ưu tiên hóa & lên lịch chỉ task mới ──
    print("[2/2] Dang tinh priority va len lich...")
    prioritize_response = prioritize_chain.invoke({
        "tasks": json.dumps(new_tasks, indent=2, ensure_ascii=False),
        **date_ctx,
    })

    result = safe_parse_json(prioritize_response)
    return result


# ─────────────────────────────────────────
# Hiển thị kết quả đẹp
# ─────────────────────────────────────────
def display_result(result: dict):
    if not result:
        return

    print("\n" + "="*55)
    print("DANH SACH TASK (theo do uu tien)")
    print("="*55)
    for i, task in enumerate(result.get("tasks", []), 1):
        bar = "=" * int(task.get("priority", 0) * 10)
        print(f"\n{i}. {task['name']}")
        print(f"   Deadline       : {task.get('deadline', 'N/A')}")
        print(f"   Uu tien        : {task.get('priority', 0):.2f}  [{bar}]")
        print(f"   Do kho         : {task.get('difficulty', 0):.2f}")
        print(f"   Thoi gian uoc  : {task.get('estimated_duration', 0)} phut")
        print(f"   Ly do          : {task.get('priority_reason', '')}")

    print("\n" + "="*55)
    print("LICH HOC DE XUAT")
    print("="*55)
    for day in result.get("schedule", []):
        print(f"\nNgay: {day['date']}")
        for s in day.get("sessions", []):
            print(f"   - {s['task']}  ({s['duration_minutes']} phut)")

    print("\n" + "="*55)
    print("JSON DAY DU:")
    print("="*55)
    print(json.dumps(result, indent=2, ensure_ascii=False))


# ─────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────
if __name__ == "__main__":
    print("AI Task Planning Agent")
    print("Nhap cac task ban can lam (VD: lam bai tap toan mai kiem tra, on ly tuan sau thi)")
    print("Go 'quit' de thoat.\n")

    while True:
        question = input("Nhap task: ").strip()
        if not question:
            continue
        if question.lower() in ("quit", "exit", "thoat"):
            print("Tam biet!")
            break

        result = run_agent(question)
        display_result(result)
        print()