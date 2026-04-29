"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, Send, Sparkles, BookOpen, Presentation, BarChart3, ChevronRight, File, Plus, Table, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockDocs = [
  { id: "1", title: "Chương 1: Cơ sở lý luận", type: "PDF", size: "2.4 MB" },
  { id: "2", title: "Slide bài giảng tuần 3", type: "PPTX", size: "5.1 MB" },
  { id: "3", title: "Ghi chú họp nhóm", type: "DOCX", size: "12 KB" },
];

const mockChat = [
  { id: "1", sender: "ai", text: "Chào bạn! Hôm nay bạn muốn tìm hiểu hay tóm tắt tài liệu nào?" },
];

export default function StudyModePage() {
  const [docs, setDocs] = useState<typeof mockDocs>([]);
  const [chat, setChat] = useState<typeof mockChat>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDocs(mockDocs);
      setChat(mockChat);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        sender: "ai", 
        text: "Tôi đã hiểu yêu cầu của bạn. Đợi tôi một chút để phân tích tài liệu nhé!" 
      };
      setChat((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-4 max-h-[calc(100vh-2rem)]">
      
      {/* Left Column: Documents (Notion Style) */}
      <div className="lg:w-[280px] flex flex-col gap-2 border-r border-border/50 pr-4 h-full">
        <div className="flex items-center justify-between pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            Tài liệu
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-muted">
            <Plus className="w-4 h-4 text-foreground" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          ) : docs.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2">Chưa có tài liệu</div>
          ) : (
            <AnimatePresence>
              {docs.map((doc) => (
                <motion.div key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="group flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer text-sm text-foreground/80 hover:text-foreground transition-colors">
                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="flex-1 truncate">{doc.title}</span>
                    <MoreHorizontal className="w-4 h-4 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Middle Column: AI Chat */}
      <div className="flex-1 flex flex-col bg-card/30 rounded-3xl border border-border/50 overflow-hidden shadow-sm relative">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="p-5 border-b border-border/50 flex items-center justify-between bg-card/50 backdrop-blur-md z-10">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Trợ lý Học tập
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 z-10">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex gap-3 max-w-[80%]">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-16 w-full rounded-2xl rounded-tl-none" />
              </div>
            </div>
          ) : (
            <>
              {chat.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
                  }`}>
                    {msg.sender === "user" ? "U" : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    msg.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none shadow-md" 
                      : "bg-muted text-foreground rounded-tl-none border border-border/50"
                  }`}>
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-4 bg-muted rounded-2xl rounded-tl-none flex items-center gap-1.5 border border-border/50">
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        <div className="p-4 bg-card/80 backdrop-blur-md border-t border-border/50 z-10">
          <form onSubmit={handleSendMessage} className="flex gap-2 bg-background p-1.5 rounded-2xl border border-border/80 shadow-sm focus-within:ring-1 ring-primary transition-all">
            <Input
              placeholder="Nhập yêu cầu của bạn (VD: Hãy tóm tắt...)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl bg-transparent border-none focus-visible:ring-0 shadow-none px-4"
            />
            <Button type="submit" size="icon" className="rounded-xl w-10 h-10 flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90" disabled={!message.trim() || isTyping}>
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Right Column: Actions (NotebookLM Style) */}
      <div className="lg:w-[320px] flex flex-col gap-5 h-full">
        <h2 className="text-lg font-semibold flex items-center gap-2 pb-1 border-b border-border/50">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          Nguồn & Công cụ
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 overflow-y-auto pr-2">
          {[
            { title: "Tạo báo cáo", icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
            { title: "Bài kiểm tra", icon: BarChart3, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
            { title: "Bảng dữ liệu", icon: Table, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
            { title: "Bản trình bày", icon: Presentation, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
            { title: "Sơ đồ tư duy", icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
          ].map((action, idx) => (
            <motion.div key={idx} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <div className={`cursor-pointer bg-card hover:bg-muted/80 border ${action.border} shadow-sm rounded-2xl transition-all group overflow-hidden relative`}>
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full ${action.bg} opacity-50 pointer-events-none transition-transform group-hover:scale-110`} />
                <div className="p-4 flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg} ${action.color} shadow-inner`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground/90 group-hover:text-foreground">{action.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Mở công cụ {action.title.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
