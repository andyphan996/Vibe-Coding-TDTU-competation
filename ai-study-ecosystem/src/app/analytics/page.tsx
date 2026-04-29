"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame, Clock, Target, Sparkles, TrendingUp, BarChart3 } from "lucide-react";
import { mockUserStats } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [stats, setStats] = useState<typeof mockUserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats(mockUserStats);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Học Tập</h1>
        <p className="text-muted-foreground">Theo dõi tiến độ và nhận phản hồi từ AI để cải thiện.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-sm border-t-4 border-t-primary">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Tiến độ tuần này</CardTitle>
              <Target className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold">{stats?.completionRate}%</div>
                  <Progress value={stats?.completionRate || 0} className="mt-3 h-2" />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    +12% so với tuần trước
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-sm border-t-4 border-t-orange-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Chuỗi ngày học liên tục</CardTitle>
              <Flame className="w-5 h-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-bold flex items-center gap-2">
                    {stats?.streak} ngày
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cố lên! Bạn đang giữ nhịp rất tốt.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-sm border-t-4 border-t-blue-500">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Tổng thời gian học</CardTitle>
              <Clock className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-3xl font-bold">{stats?.totalStudyTime}</div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Trong tháng này
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Feedback Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.5 }}
        className="mt-4"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-none shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <CardContent className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm text-primary flex-shrink-0">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2 text-foreground">Bạn đang làm rất tốt! 🔥</h3>
              <p className="text-muted-foreground leading-relaxed">
                "Tôi nhận thấy bạn đã dành rất nhiều thời gian cho Dự án NCKH tuần này. 
                Độ tập trung của bạn đang ở mức cao (85%). Tuy nhiên, hãy nhớ nghỉ ngơi 
                ngắn giữa các phiên học để giữ năng lượng nhé!"
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-background rounded-full text-xs font-medium border shadow-sm text-muted-foreground">
                  #TậpTrungCao
                </span>
                <span className="px-3 py-1 bg-background rounded-full text-xs font-medium border shadow-sm text-muted-foreground">
                  #CầnNghỉNgơi
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Chart Placeholder */}
      <Card className="flex-1 mt-4 shadow-sm border">
        <CardHeader>
          <CardTitle className="text-lg">Biểu đồ hoạt động</CardTitle>
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center">
           {isLoading ? (
             <Skeleton className="w-full h-full rounded-xl" />
           ) : (
             <div className="text-muted-foreground flex flex-col items-center gap-2">
               <BarChart3 className="w-8 h-8 opacity-20" />
               <span>Biểu đồ chi tiết (Sắp ra mắt)</span>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
