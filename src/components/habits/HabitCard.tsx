import { motion } from 'framer-motion';
import { Check, Flame, MoreVertical, Trash2 } from 'lucide-react';
import { Habit, HabitStats, CATEGORY_CONFIG } from '@/types/habit';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { format, subDays, addDays, startOfMonth, endOfMonth, isSameMonth, isToday, isFuture } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface HabitCardProps {
  habit: Habit;
  stats: HabitStats;
  onToggle: (habitId: string, date: string) => void;
  onRemove: (habitId: string) => void;
  currentMonth: Date;
}

export function HabitCard({ habit, stats, onToggle, onRemove, currentMonth }: HabitCardProps) {
  const categoryConfig = CATEGORY_CONFIG[habit.category];
  
  // Get days for the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const today = new Date();
  
  // Generate 31 days grid for the current month
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = addDays(monthStart, i);
    return isSameMonth(day, currentMonth) ? day : null;
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative bg-card rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg",
            habit.category === 'growth' && "bg-category-growth/15 text-category-growth",
            habit.category === 'fitness' && "bg-category-fitness/15 text-category-fitness",
            habit.category === 'nutrition' && "bg-category-nutrition/15 text-category-nutrition",
            habit.category === 'wellness' && "bg-category-wellness/15 text-category-wellness",
            habit.category === 'custom' && "bg-primary/15 text-primary"
          )}
        >
          <HabitIcon name={habit.icon} className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{habit.name}</h3>
          <p className="text-xs text-muted-foreground">{categoryConfig.label}</p>
        </div>

        {/* Streak */}
        {stats.currentStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-streak/15 text-streak"
          >
            <Flame className="w-4 h-4 animate-streak-pulse" />
            <span className="text-sm font-bold">{stats.currentStreak}</span>
          </motion.div>
        )}

        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onRemove(habit.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 31-day Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-[10px] text-muted-foreground text-center font-medium">
            {day}
          </div>
        ))}
        
        {/* Empty cells for alignment */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {days.map((day, index) => {
          if (!day) return <div key={`null-${index}`} className="aspect-square" />;
          
          const dateStr = format(day, 'yyyy-MM-dd');
          const isCompleted = habit.completedDates.includes(dateStr);
          const isTodayDate = isToday(day);
          const isFutureDate = isFuture(day);
          
          return (
            <motion.button
              key={dateStr}
              whileHover={{ scale: isFutureDate ? 1 : 1.1 }}
              whileTap={{ scale: isFutureDate ? 1 : 0.9 }}
              onClick={() => !isFutureDate && onToggle(habit.id, dateStr)}
              disabled={isFutureDate}
              className={cn(
                "aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-all duration-200",
                isFutureDate && "opacity-30 cursor-not-allowed",
                !isCompleted && !isFutureDate && "bg-secondary hover:bg-secondary/80 text-muted-foreground",
                isCompleted && habit.category === 'growth' && "bg-category-growth text-white",
                isCompleted && habit.category === 'fitness' && "bg-category-fitness text-white",
                isCompleted && habit.category === 'nutrition' && "bg-category-nutrition text-white",
                isCompleted && habit.category === 'wellness' && "bg-category-wellness text-white",
                isCompleted && habit.category === 'custom' && "bg-primary text-primary-foreground",
                isTodayDate && !isCompleted && "ring-2 ring-primary ring-offset-1 ring-offset-card"
              )}
            >
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="animate-check-bounce"
                >
                  <Check className="w-3 h-3" />
                </motion.div>
              ) : (
                format(day, 'd')
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{stats.completionRate}%</p>
            <p className="text-[10px] text-muted-foreground">Rate</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-[10px] text-muted-foreground">Best</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{stats.totalCompletions}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="flex-1 ml-4 max-w-[100px]">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                habit.category === 'growth' && "bg-category-growth",
                habit.category === 'fitness' && "bg-category-fitness",
                habit.category === 'nutrition' && "bg-category-nutrition",
                habit.category === 'wellness' && "bg-category-wellness",
                habit.category === 'custom' && "bg-primary"
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
