export type Priority = "Cao" | "Trung bình" | "Thấp";
export type TaskStatus = "Đang thực hiện" | "Sắp diễn ra" | "Hoàn thành";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  time: string;
}

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Dự án nghiên cứu khoa học (lộ trình 9 tháng)",
    priority: "Cao",
    status: "Đang thực hiện",
    time: "Hôm nay, 14:00 - 16:00",
  },
  {
    id: "2",
    title: "Họp nhóm thuyết trình (chỉ 5 thành viên)",
    priority: "Trung bình",
    status: "Sắp diễn ra",
    time: "Ngày mai, 09:00 - 10:30",
  },
];

export const mockUserStats = {
  name: "Minh",
  completedTasks: "42/50",
  completedTasksTrend: "+12%",
  totalStudyTime: "128 Giờ",
  studyTimeTrend: "+5h",
  completionRate: 84.5,
  rateStatus: "Trung bình",
  streak: 12,
};

export const mockWeeklyProgress = [
  { name: "T2", hours: 2.5 },
  { name: "T3", hours: 3.8 },
  { name: "T4", hours: 1.5 },
  { name: "T5", hours: 4.2 },
  { name: "T6", hours: 2.0 },
  { name: "T7", hours: 5.5 },
  { name: "CN", hours: 4.0 },
];

export const mockRecentActivities = [
  { id: "1", title: "Lịch sử Thế giới", lastAccessed: "10 phút trước", progress: 65, color: "bg-orange-500" },
  { id: "2", title: "Toán Giải tích", lastAccessed: "2 giờ trước", progress: 82, color: "bg-blue-500" },
  { id: "3", title: "Lập trình Python", lastAccessed: "Hôm qua", progress: 40, color: "bg-green-500" },
];

export const mockPetState = {
  level: 3,
  mood: 80, // Vui vẻ
  energy: 60,
};

export const aiSuggestions = [
  {
    id: "s1",
    text: "Bạn nên tập trung hoàn thành Dự án NCKH vào buổi chiều vì năng lượng của bạn thường cao nhất lúc này.",
  },
  {
    id: "s2",
    text: "Tối nay hãy dành 30 phút ôn lại nội dung Thuyết trình nhé!",
  }
];
