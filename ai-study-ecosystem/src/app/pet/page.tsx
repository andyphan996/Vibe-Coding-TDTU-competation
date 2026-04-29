"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Cat, Heart, Zap, Star, Trophy, Frown, Utensils, Bath, Gamepad2, BedDouble } from "lucide-react";
import { mockPetState } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

export default function PetPage() {
  const [petState, setPetState] = useState<typeof mockPetState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [interactionFeedback, setInteractionFeedback] = useState<{ id: number, text: string, type: "positive" | "negative" }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPetState(mockPetState);
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInteract = (type: "positive" | "negative", actionText: string) => {
    if (!petState) return;

    let newMood = petState.mood;
    let newEnergy = petState.energy;
    
    if (type === "positive") {
      newMood = Math.min(100, newMood + 15);
      newEnergy = Math.max(0, newEnergy - 5);
    } else {
      newMood = Math.max(0, newMood - 15);
      newEnergy = Math.max(0, newEnergy - 5);
    }

    setPetState({ ...petState, mood: newMood, energy: newEnergy });

    const feedbackId = Date.now();
    setInteractionFeedback(prev => [...prev, { id: feedbackId, text: actionText, type }]);
    
    setTimeout(() => {
      setInteractionFeedback(prev => prev.filter(f => f.id !== feedbackId));
    }, 1500);
  };

  if (!isLoaded || !petState) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <Cat className="w-16 h-16 text-muted-foreground opacity-50" />
        </motion.div>
      </div>
    );
  }

  const isHappy = petState.mood >= 50;

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full overflow-hidden relative rounded-3xl bg-card border border-border/50 shadow-sm">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-center p-6 relative z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thú cưng ảo</h1>
          <p className="text-sm text-muted-foreground">Chăm sóc để nhận thêm động lực học tập</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="secondary" className="px-3 py-1.5 text-sm flex items-center gap-1.5 bg-primary/20 text-primary hover:bg-primary/30">
            <Trophy className="w-4 h-4" />
            Level {petState.level}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/50 text-foreground">
            Chuyên gia tập trung
          </Badge>
        </div>
      </div>

      {/* Main Character Area (TikTok Style) */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-10">
        <div className="relative">
          {/* Glow Behind Pet */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-3xl rounded-full pointer-events-none opacity-20 ${isHappy ? 'bg-primary' : 'bg-destructive'}`} />
          
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: isHappy ? [0, 5, -5, 0] : [0, 2, -2, 0],
              scale: isHappy ? [1, 1.05, 1] : 1
            }}
            transition={{ 
              repeat: Infinity, 
              duration: isHappy ? 3 : 4,
              ease: "easeInOut" 
            }}
            className="relative z-10 cursor-pointer"
            onClick={() => handleInteract("positive", "Vuốt ve! +15")}
          >
            <div className={`w-48 h-48 sm:w-64 sm:h-64 rounded-[3rem] flex items-center justify-center shadow-2xl relative border-4 ${
              isHappy ? "bg-gradient-to-br from-primary to-accent border-primary/50" : "bg-gradient-to-br from-muted-foreground to-border border-border"
            }`}>
              <Cat className="w-28 h-28 sm:w-32 sm:h-32 text-white" />
              
              {/* Emotion Indicator */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -bottom-4 -right-4 bg-background border border-border rounded-full p-3 shadow-xl"
              >
                {isHappy ? (
                  <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                ) : (
                  <Frown className="w-8 h-8 text-blue-500" />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Feedback Numbers */}
          <AnimatePresence>
            {interactionFeedback.map(feedback => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 0, scale: 0.5, x: (Math.random() - 0.5) * 100 }}
                animate={{ opacity: 1, y: -120, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 font-black text-2xl whitespace-nowrap z-50 drop-shadow-lg ${
                  feedback.type === "positive" ? "text-green-400" : "text-red-400"
                }`}
              >
                {feedback.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Interface (Stats & Horizontal Tools) */}
      <div className="bg-background/80 backdrop-blur-md border-t border-border/50 p-6 rounded-b-3xl relative z-10 flex flex-col gap-6">
        
        {/* Status Bars */}
        <div className="flex gap-6 justify-center">
          <div className="flex-1 max-w-[200px] space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-red-500" /> Tâm trạng</span>
              <span>{petState.mood}%</span>
            </div>
            <Progress value={petState.mood} className="h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-red-600 [&>div]:to-red-400" />
          </div>

          <div className="flex-1 max-w-[200px] space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-yellow-500" /> Năng lượng</span>
              <span>{petState.energy}%</span>
            </div>
            <Progress value={petState.energy} className="h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-yellow-600 [&>div]:to-yellow-400" />
          </div>
          
          <div className="hidden sm:block flex-1 max-w-[200px] space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-blue-500" /> Kinh nghiệm</span>
              <span>45%</span>
            </div>
            <Progress value={45} className="h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-blue-400" />
          </div>
        </div>

        {/* Horizontal Tools (TikTok Style Bottom Bar) */}
        <div className="flex justify-center gap-4 sm:gap-8 pt-2">
          {[
            { icon: Utensils, label: "Cho ăn", action: () => handleInteract("positive", "Ngon quá! +10"), color: "text-orange-400", bg: "bg-orange-400/10" },
            { icon: Bath, label: "Tắm rửa", action: () => handleInteract("positive", "Sạch sẽ! +15"), color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: Gamepad2, label: "Chơi đùa", action: () => handleInteract("positive", "Vui quá! +20"), color: "text-primary", bg: "bg-primary/20" },
            { icon: BedDouble, label: "Đi ngủ", action: () => handleInteract("negative", "Buồn ngủ... -15"), color: "text-purple-400", bg: "bg-purple-400/10" },
          ].map((tool, idx) => (
            <motion.div key={idx} whileHover={{ y: -5 }} whileTap={{ scale: 0.9 }}>
              <button 
                onClick={tool.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${tool.bg} border border-border/50 group-hover:border-primary/50 transition-colors shadow-sm`}>
                  <tool.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${tool.color}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{tool.label}</span>
              </button>
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
