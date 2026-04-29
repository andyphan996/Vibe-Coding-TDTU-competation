"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Send, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search, Settings } from "lucide-react";
import { mockTasks, Task } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function CalendarPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [viewMode, setViewMode] = useState<"Day" | "Week">("Week");

  useEffect(() => {
    const timer = setTimeout(() => {
      setTasks(mockTasks);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsProcessingAI(true);
    setTimeout(() => {
      const newTask: Task = {
        id: Date.now().toString(),
        title: prompt,
        priority: "Cao",
        status: "Sắp diễn ra",
        time: "Hôm nay, 18:00 - 19:30",
      };
      setTasks((prev) => [...prev, newTask]);
      setPrompt("");
      setIsProcessingAI(false);
    }, 1500);
  };

  const getTaskPosition = (task: Task) => {
    // Basic mock positioning for demonstration
    // Assumes time string contains "14:00 - 16:00"
    const timeMatch = task.time.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
    let startHour = 9;
    let duration = 2;
    if (timeMatch) {
      startHour = parseInt(timeMatch[1]);
      duration = parseInt(timeMatch[2]) - startHour;
    }
    
    // Day logic (mock)
    let dayIndex = 1; // Default T2
    if (task.time.includes("Ngày mai")) dayIndex = 2; // T3

    return {
      top: `${(startHour * 60)}px`,
      height: `${(duration * 60)}px`,
      left: viewMode === "Week" ? `calc(${(dayIndex / 7) * 100}% + 2px)` : "0",
      width: viewMode === "Week" ? `calc(${100 / 7}% - 8px)` : "calc(100% - 16px)",
    };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-4 pb-4">
      
      {/* Top Prompt Input */}
      <Card className="border-none shadow-sm bg-card shrink-0">
        <CardContent className="p-3">
          <form onSubmit={handlePromptSubmit} className="flex gap-3 items-center">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <Input
              placeholder="Bạn cần làm gì hôm nay? (VD: Ôn tập toán 45 phút chiều nay)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 h-11 text-base rounded-xl border-border bg-background focus-visible:ring-primary/50"
              disabled={isProcessingAI}
            />
            <Button 
              type="submit" 
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={isProcessingAI || !prompt.trim()}
            >
              {isProcessingAI ? "Đang xếp lịch..." : "Sắp xếp"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Calendar Grid UI */}
      <div className="flex-1 bg-card rounded-2xl shadow-sm border border-border/50 flex flex-col overflow-hidden">
        
        {/* Calendar Header (Google Calendar Style) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/50">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-md font-medium px-4">Hôm nay</Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ChevronLeft className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ChevronRight className="w-5 h-5" /></Button>
            </div>
            <h2 className="text-xl font-medium text-foreground ml-2">Tháng 4, 2026</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full"><Search className="w-5 h-5 text-muted-foreground" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Settings className="w-5 h-5 text-muted-foreground" /></Button>
            <div className="flex bg-muted p-1 rounded-lg ml-2">
              <button 
                onClick={() => setViewMode("Day")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === "Day" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Ngày
              </button>
              <button 
                onClick={() => setViewMode("Week")}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${viewMode === "Week" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Tuần
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex-1 overflow-y-auto flex relative bg-background">
          
          {/* Time Column (Y-axis) */}
          <div className="w-16 flex-shrink-0 border-r border-border/50 bg-background z-20 sticky left-0">
            {/* Header spacer */}
            <div className="h-12 border-b border-border/50" />
            {HOURS.map((hour) => (
              <div key={hour} className="h-[60px] relative">
                <span className="absolute -top-3 right-2 text-xs text-muted-foreground font-medium">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Area */}
          <div className="flex-1 flex flex-col min-w-[800px]">
            
            {/* Days Header (X-axis) */}
            <div className="flex h-12 border-b border-border/50 sticky top-0 bg-background z-10">
              {viewMode === "Week" ? (
                DAYS.map((day, i) => (
                  <div key={day} className="flex-1 flex flex-col items-center justify-center border-r border-border/50 border-dashed">
                    <span className="text-xs text-muted-foreground font-medium">{day}</span>
                    <span className={`text-sm font-medium ${i === 1 ? "text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center" : "text-foreground"}`}>
                      {26 + i}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <span className="text-xs text-muted-foreground font-medium">T2</span>
                  <span className="text-sm font-medium text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">
                    27
                  </span>
                </div>
              )}
            </div>

            {/* Grid Cells & Tasks */}
            <div className="relative flex-1">
              
              {/* Horizontal Grid Lines */}
              <div className="absolute inset-0 pointer-events-none">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-[60px] border-b border-border/30" />
                ))}
              </div>

              {/* Vertical Grid Lines (for week view) */}
              {viewMode === "Week" && (
                <div className="absolute inset-0 flex pointer-events-none">
                  {DAYS.map((day) => (
                    <div key={day} className="flex-1 border-r border-border/30 border-dashed" />
                  ))}
                </div>
              )}

              {/* Render Tasks as Blocks */}
              <AnimatePresence>
                {!isLoading && tasks.map((task) => {
                  const style = getTaskPosition(task);
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        top: style.top,
                        left: style.left,
                        width: style.width,
                        height: style.height,
                      }}
                      className="z-10 p-1"
                    >
                      <div 
                        onClick={() => router.push('/study')}
                        className="w-full h-full bg-primary/20 border border-primary/50 text-primary rounded-md p-2 text-xs overflow-hidden cursor-pointer hover:bg-primary/30 hover:shadow-md transition-all group"
                      >
                        <div className="font-semibold truncate">{task.title}</div>
                        <div className="text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity truncate mt-1">
                          {task.time}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
