import { motion } from 'framer-motion';
import { BookOpen, Dumbbell, Apple, Sparkles, Plus, Check, Shield, Wallet } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { DEFAULT_HABITS, HabitCategory, CATEGORY_CONFIG } from '@/types/habit';
import { HabitIcon } from '@/components/ui/HabitIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categoryIcons: Record<HabitCategory, React.ElementType> = {
  growth: BookOpen,
  fitness: Dumbbell,
  nutrition: Apple,
  wellness: Sparkles,
  discipline: Shield,
  finance: Wallet,
  custom: Plus,
};

const categoryDescriptions: Record<HabitCategory, string> = {
  growth: 'Expand your mind and develop new skills every day.',
  fitness: 'Build strength, endurance, and healthy movement patterns.',
  nutrition: 'Fuel your body with nourishing foods and hydration.',
  wellness: 'Cultivate inner peace and emotional well-being.',
  discipline: 'Build self-control and break unwanted patterns.',
  finance: 'Track spending and build financial awareness.',
  custom: 'Create your own habits tailored to your goals.',
};

export function DevelopmentView() {
  const { habits, addHabit } = useHabits();

  const categories: HabitCategory[] = ['growth', 'fitness', 'nutrition', 'wellness'];

  const isHabitAdded = (habitName: string) => {
    return habits.some(h => h.name === habitName);
  };

  const handleAddHabit = (template: typeof DEFAULT_HABITS[0]) => {
    if (!isHabitAdded(template.name)) {
      addHabit(template);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Personal Development</h1>
        <p className="text-muted-foreground mt-1">
          Pre-built habit templates to kickstart your growth journey
        </p>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => {
          const CategoryIcon = categoryIcons[category];
          const templates = DEFAULT_HABITS.filter(h => h.category === category);

          return (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="space-y-4"
            >
              {/* Category Header */}
              <div className="flex items-center gap-4">
                <div 
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl",
                    category === 'growth' && "bg-category-growth/15 text-category-growth",
                    category === 'fitness' && "bg-category-fitness/15 text-category-fitness",
                    category === 'nutrition' && "bg-category-nutrition/15 text-category-nutrition",
                    category === 'wellness' && "bg-category-wellness/15 text-category-wellness"
                  )}
                >
                  <CategoryIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{CATEGORY_CONFIG[category].label}</h2>
                  <p className="text-sm text-muted-foreground">{categoryDescriptions[category]}</p>
                </div>
              </div>

              {/* Habit Templates Grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((template, index) => {
                  const isAdded = isHabitAdded(template.name);

                  return (
                    <motion.div
                      key={template.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                      className={cn(
                        "relative bg-card rounded-xl p-4 shadow-sm border transition-all duration-300",
                        isAdded 
                          ? "border-success/30 bg-success/5" 
                          : "border-border/50 hover:shadow-md hover:border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                            category === 'growth' && "bg-category-growth/15 text-category-growth",
                            category === 'fitness' && "bg-category-fitness/15 text-category-fitness",
                            category === 'nutrition' && "bg-category-nutrition/15 text-category-nutrition",
                            category === 'wellness' && "bg-category-wellness/15 text-category-wellness"
                          )}
                        >
                          <HabitIcon name={template.icon} className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground">{template.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {CATEGORY_CONFIG[category].label}
                          </p>
                        </div>

                        <Button
                          size="sm"
                          variant={isAdded ? "secondary" : "default"}
                          disabled={isAdded}
                          onClick={() => handleAddHabit(template)}
                          className={cn(
                            "shrink-0",
                            !isAdded && "gradient-primary text-primary-foreground"
                          )}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20"
      >
        <h3 className="text-lg font-bold text-foreground mb-2">💡 Pro Tips for Building Habits</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Start small - it's better to do 5 minutes daily than 1 hour once a week</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Stack new habits onto existing ones for better retention</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Focus on consistency over perfection - missing one day won't break your progress</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Celebrate small wins to build positive associations with your habits</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
