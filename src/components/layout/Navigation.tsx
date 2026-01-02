import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Sparkles, BarChart3, Target, Settings, Flame, BookOpen, Sunrise, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tab = 'dashboard' | 'routines' | 'journal' | 'analytics' | 'lifebalance' | 'goals' | 'settings';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'routines', label: 'Routines', icon: Sunrise },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'lifebalance', label: 'Life Balance', icon: Scale },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-card border-r border-border p-4 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-glow">
            <Flame className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Streakly</h1>
            <p className="text-xs text-muted-foreground">Build better habits</p>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Track your progress daily
          </p>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.slice(0, 5).map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <tab.icon className={cn(
                "w-5 h-5 transition-transform",
                activeTab === tab.id && "scale-110"
              )} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-b border-border z-40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg gradient-primary shadow-glow">
            <Flame className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Streakly</h1>
          </div>
        </div>
      </header>
    </>
  );
}
