"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  BookOpen, 
  LayoutDashboard, 
  Cat, 
  Menu, 
  X,
  Sparkles,
  BarChart3,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Lịch học", href: "/calendar", icon: Calendar },
  { name: "Chế độ học", href: "/study", icon: BookOpen },
  { name: "Thống kê", href: "/analytics", icon: BarChart3 },
  { name: "Thú cưng", href: "/pet", icon: Cat },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header / Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 text-primary font-bold text-lg">
          <Sparkles className="w-6 h-6" />
          <span>AI ECOSYSTEM</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/20 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen bg-card border-r w-64 p-4 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="hidden md:flex items-center gap-2 text-primary font-bold text-xl mb-8 mt-2 px-2">
          <Sparkles className="w-8 h-8" />
          <span>AI ECOSYSTEM</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 mt-16 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-l-4",
                  "hover:scale-[1.02] hover:shadow-sm",
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-transparent border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Mini Profile Placeholder */}
        <div className="mt-auto pt-4 border-t flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/30">
            M
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">Minh</p>
            <p className="text-xs text-muted-foreground truncate">Streak: 12 ngày 🔥</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
