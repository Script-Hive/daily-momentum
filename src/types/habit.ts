export type HabitCategory = 'growth' | 'fitness' | 'nutrition' | 'wellness' | 'custom';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  color: string;
  completedDates: string[]; // ISO date strings
  createdAt: string;
  order: number;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface DailyProgress {
  date: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export const CATEGORY_CONFIG: Record<HabitCategory, { label: string; color: string; bgClass: string }> = {
  growth: { label: 'Personal Growth', color: 'category-growth', bgClass: 'bg-category-growth' },
  fitness: { label: 'Health & Fitness', color: 'category-fitness', bgClass: 'bg-category-fitness' },
  nutrition: { label: 'Nutrition', color: 'category-nutrition', bgClass: 'bg-category-nutrition' },
  wellness: { label: 'Mental Wellness', color: 'category-wellness', bgClass: 'bg-category-wellness' },
  custom: { label: 'Custom', color: 'primary', bgClass: 'bg-primary' },
};

export const DEFAULT_HABITS: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'order'>[] = [
  // Personal Growth
  { name: 'Read for 20 minutes', icon: 'BookOpen', category: 'growth', color: 'category-growth' },
  { name: 'Journal for 5 minutes', icon: 'PenTool', category: 'growth', color: 'category-growth' },
  { name: 'Practice a new language', icon: 'Globe', category: 'growth', color: 'category-growth' },
  { name: 'Limit social media', icon: 'Smartphone', category: 'growth', color: 'category-growth' },
  { name: 'Learn a new skill', icon: 'Brain', category: 'growth', color: 'category-growth' },
  
  // Health & Fitness
  { name: 'Exercise', icon: 'Dumbbell', category: 'fitness', color: 'category-fitness' },
  { name: 'Stretch for 10 minutes', icon: 'Activity', category: 'fitness', color: 'category-fitness' },
  { name: 'Track workouts', icon: 'ClipboardList', category: 'fitness', color: 'category-fitness' },
  { name: 'Take supplements', icon: 'Pill', category: 'fitness', color: 'category-fitness' },
  { name: 'Hit daily step goal', icon: 'Footprints', category: 'fitness', color: 'category-fitness' },
  
  // Nutrition
  { name: 'Eat 3 healthy meals', icon: 'UtensilsCrossed', category: 'nutrition', color: 'category-nutrition' },
  { name: 'Drink 8+ glasses of water', icon: 'Droplets', category: 'nutrition', color: 'category-nutrition' },
  { name: 'Avoid junk food', icon: 'Ban', category: 'nutrition', color: 'category-nutrition' },
  { name: 'Track calories', icon: 'Calculator', category: 'nutrition', color: 'category-nutrition' },
  { name: 'Eat fruits & vegetables', icon: 'Apple', category: 'nutrition', color: 'category-nutrition' },
  
  // Mental Wellness
  { name: 'Meditate for 10 minutes', icon: 'Sparkles', category: 'wellness', color: 'category-wellness' },
  { name: 'Write 3 gratitudes', icon: 'Heart', category: 'wellness', color: 'category-wellness' },
  { name: 'No phone after 9 PM', icon: 'Moon', category: 'wellness', color: 'category-wellness' },
  { name: 'Spend time outside', icon: 'Sun', category: 'wellness', color: 'category-wellness' },
  { name: 'Reflect on feelings', icon: 'MessageCircle', category: 'wellness', color: 'category-wellness' },
];
