"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { aiSuggestions } from "@/lib/mock-data";
import { motion } from "framer-motion";

export function AIPanel() {
  return (
    <Card className="w-full h-full bg-primary/5 border-primary/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          Gợi ý từ AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Dựa trên lịch trình và thói quen của bạn, đây là cách AI sắp xếp công việc:
          </p>
          {aiSuggestions.map((suggestion, idx) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="p-3 bg-background rounded-xl border shadow-sm text-sm"
            >
              {suggestion.text}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
