import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Award, Target, PenTool } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useJournal } from '@/hooks/useJournal';
import { HabitCard } from '@/components/habits/HabitCard';
import { AddHabitDialog } from '@/components/habits/AddHabitDialog';
import { ProgressRing } from '@/components/habits/ProgressRing';
import { CATEGORY_CONFIG, HabitCategory } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardViewProps {
  onNavigateToJournal?: () => void;
}

export function DashboardView({ onNavigateToJournal }: DashboardViewProps) {
  const { 
    habits, 
    isLoaded, 
    toggleHabit, 
    addHabit, 
    removeHabit, 
    getHabitStats, 
    getTodayProgress,
    getBestHabit,
    getWeakestHabit
  } = useHabits();
  
  const { getTodayEntry } = useJournal();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  const todayProgress = getTodayProgress();
  const bestHabit = getBestHabit();
  const weakestHabit = getWeakestHabit();
  const todayJournalEntry = getTodayEntry();

  const filteredHabits = useMemo(() => {
    if (selectedCategory === 'all') return habits;
    return habits.filter(h => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const totalStreak = useMemo(() => {
    return habits.reduce((acc, habit) => {
      const stats = getHabitStats(habit);
      return acc + stats.currentStreak;
    }, 0);
  }, [habits, getHabitStats]);

  const categoryStats = useMemo(() => {
    const stats: Record<HabitCategory, { total: number; completed: number }> = {
      growth: { total: 0, completed: 0 },
      fitness: { total: 0, completed: 0 },
      nutrition: { total: 0, completed: 0 },
      wellness: { total: 0, completed: 0 },
      discipline: { total: 0, completed: 0 },
      finance: { total: 0, completed: 0 },
      custom: { total: 0, completed: 0 },
    };

    const today = format(new Date(), 'yyyy-MM-dd');
    habits.forEach(habit => {
      stats[habit.category].total++;
      if (habit.completedDates.includes(today)) {
        stats[habit.category].completed++;
      }
    });

    return stats;
  }, [habits]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onNavigateToJournal && (
            <Button 
              variant="outline" 
              onClick={onNavigateToJournal}
              className="gap-2"
            >
              <PenTool className="w-4 h-4" />
              {todayJournalEntry ? 'Continue Journal' : "Write Today's Entry"}
            </Button>
          )}
          <AddHabitDialog onAddHabit={addHabit} existingHabits={habits} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 sm:col-span-1 bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-4">
            <ProgressRing percentage={todayProgress.percentage} size={70} strokeWidth={6}>
              <span className="text-lg font-bold">{todayProgress.percentage}%</span>
            </ProgressRing>
            <div>
              <p className="text-sm text-muted-foreground">Today's Progress</p>
              <p className="text-xl font-bold text-foreground">
                {todayProgress.completedCount}/{todayProgress.totalCount}
              </p>
              <p className="text-xs text-muted-foreground">habits completed</p>
            </div>
          </div>
        </motion.div>

        {/* Total Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-streak/15">
              <Flame className="w-5 h-5 text-streak animate-streak-pulse" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Streaks</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">days combined</p>
        </motion.div>

        {/* Best Habit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/15">
              <Award className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Best Habit</span>
          </div>
          {bestHabit ? (
            <>
              <p className="text-lg font-bold text-foreground truncate">{bestHabit.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getHabitStats(bestHabit).completionRate}% completion
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Add habits to track</p>
          )}
        </motion.div>

        {/* Needs Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 shadow-md border border-border/50"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-warning/15">
              <Target className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Needs Focus</span>
          </div>
          {weakestHabit ? (
            <>
              <p className="text-lg font-bold text-foreground truncate">{weakestHabit.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getHabitStats(weakestHabit).completionRate}% completion
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Add habits to track</p>
          )}
        </motion.div>
      </div>

      {/* Category Filter & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "rounded-full",
              selectedCategory === 'all' && "gradient-primary text-primary-foreground"
            )}
          >
            All ({habits.length})
          </Button>
          {(['growth', 'fitness', 'nutrition', 'wellness'] as HabitCategory[]).map(cat => {
            const count = habits.filter(h => h.category === cat).length;
            if (count === 0) return null;
            return (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full gap-2",
                  selectedCategory === cat && cn(
                    cat === 'growth' && "bg-category-growth text-white hover:bg-category-growth/90",
                    cat === 'fitness' && "bg-category-fitness text-white hover:bg-category-fitness/90",
                    cat === 'nutrition' && "bg-category-nutrition text-white hover:bg-category-nutrition/90",
                    cat === 'wellness' && "bg-category-wellness text-white hover:bg-category-wellness/90"
                  )
                )}
              >
                {CATEGORY_CONFIG[cat].label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Start building better habits! Click "Add Habit" to create your first one.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                stats={getHabitStats(habit)}
                onToggle={toggleHabit}
                onRemove={removeHabit}
                currentMonth={currentMonth}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
