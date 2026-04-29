"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { 
  Flame, Clock, Target, Sparkles, TrendingUp, ChevronDown, 
  MessageSquare, ListTodo, Send, ArrowRight, PlayCircle, Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUserStats, mockWeeklyProgress, mockRecentActivities, aiSuggestions } from "@/lib/mock-data";

export default function HomeDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"tasks" | "chat">("tasks");
  const [chatMessage, setChatMessage] = useState("");

  const timeGreeting = new Date().getHours() < 12 ? "sáng" : new Date().getHours() < 18 ? "chiều" : "tối";

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Chào buổi {timeGreeting}, {mockUserStats.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Hôm nay bạn có mục tiêu gì mới không? Hãy để AI hỗ trợ nhé!
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2 text-sm border-orange-500/50 bg-orange-500/10 text-orange-500 gap-2 rounded-full font-semibold">
          Chuỗi học tập: {mockUserStats.streak} ngày <Flame className="w-4 h-4 fill-orange-500" />
        </Badge>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card shadow-sm border-border/50 rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-y-0 left-0 w-1 bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Nhiệm vụ hoàn thành
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <Target className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUserStats.completedTasks}</div>
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              {mockUserStats.completedTasksTrend} so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border/50 rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-y-0 left-0 w-1 bg-orange-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Thời gian học
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
              <Clock className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUserStats.totalStudyTime}</div>
            <p className="text-xs text-green-500 mt-2 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              {mockUserStats.studyTimeTrend} so với tuần trước
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm border-border/50 rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tỷ lệ hoàn thành
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <ListTodo className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUserStats.completionRate}%</div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 font-medium">
              Mức độ: <span className="text-primary">{mockUserStats.rateStatus}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left: Bar Chart */}
        <Card className="lg:col-span-3 bg-card shadow-sm border-border/50 rounded-2xl flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Tiến độ học tập</CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl gap-2 h-8 text-xs font-medium">
              Tuần này <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            <div className="h-[250px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockWeeklyProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#1E293B' }}
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#8B5CF6' }}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {mockWeeklyProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hours > 4 ? '#8B5CF6' : '#38BDF8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right: AI Feedback & Tasks */}
        <Card className="lg:col-span-2 bg-gradient-to-b from-primary/5 to-transparent shadow-sm border-primary/20 rounded-2xl flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="w-5 h-5" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            
            {/* AI Insight Box */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm leading-relaxed text-foreground/90 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
              {aiSuggestions[0].text}
            </div>

            {/* Toggle Buttons */}
            <div className="flex p-1 bg-muted rounded-xl gap-1">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  activeTab === "tasks" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ListTodo className="w-4 h-4" /> Gợi ý nhiệm vụ
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  activeTab === "chat" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Hỏi AI
              </button>
            </div>

            {/* Dynamic Content */}
            <div className="flex-1 min-h-[140px] relative">
              <AnimatePresence mode="wait">
                {activeTab === "tasks" ? (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2 absolute inset-0 overflow-y-auto pr-1"
                  >
                    {aiSuggestions.map((sug, i) => (
                      <div key={i} className="p-3 bg-card border rounded-xl hover:border-primary/50 cursor-pointer transition-colors text-sm flex gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div className="flex-1 pt-1 line-clamp-2">{sug.text}</div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3 absolute inset-0"
                  >
                    <div className="flex-1 p-3 bg-card border rounded-xl overflow-y-auto text-sm text-muted-foreground flex items-center justify-center flex-col gap-2">
                      <MessageSquare className="w-8 h-8 opacity-20" />
                      Nhập câu hỏi để AI hỗ trợ bạn
                    </div>
                    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); setChatMessage(""); }}>
                      <Input 
                        placeholder="Bạn cần hỏi gì..." 
                        className="rounded-xl h-10 border-border/50 bg-card"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                      />
                      <Button size="icon" className="rounded-xl h-10 w-10 flex-shrink-0" type="submit" disabled={!chatMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Bottom Content: Hoạt động gần đây */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Hoạt động gần đây
          </h2>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mockRecentActivities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              whileHover={{ 
                y: -6, 
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)" 
              }}
              className="rounded-2xl"
            >
              <Card 
                className="cursor-pointer hover:border-primary/50 transition-all shadow-sm rounded-2xl overflow-hidden group"
                onClick={() => router.push('/study')}
              >
                <div className={`h-2 w-full ${activity.color}`} />
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {activity.lastAccessed}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary`}>
                    <PlayCircle className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
