export type HabitCategory = 'growth' | 'fitness' | 'nutrition' | 'wellness' | 'discipline' | 'finance' | 'custom';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  category: HabitCategory;
  color: string;
  completedDates: string[]; // ISO date strings
  createdAt: string;
  order: number;
  lifeArea?: 'health' | 'career' | 'mind' | 'relationships';
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
  lifeArea?: 'health' | 'career' | 'mind' | 'relationships';
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
  discipline: { label: 'Discipline', color: 'category-discipline', bgClass: 'bg-category-discipline' },
  finance: { label: 'Finance', color: 'category-finance', bgClass: 'bg-category-finance' },
  custom: { label: 'Custom', color: 'primary', bgClass: 'bg-primary' },
};

export const DEFAULT_HABITS: Omit<Habit, 'id' | 'completedDates' | 'createdAt' | 'order'>[] = [
  // Personal Growth
  { name: 'Read for 20 minutes', icon: 'BookOpen', category: 'growth', color: 'category-growth', lifeArea: 'mind' },
  { name: 'Journal for 5 minutes', icon: 'PenTool', category: 'growth', color: 'category-growth', lifeArea: 'mind' },
  { name: 'Practice a new language', icon: 'Globe', category: 'growth', color: 'category-growth', lifeArea: 'mind' },
  { name: 'Limit social media', icon: 'Smartphone', category: 'growth', color: 'category-growth', lifeArea: 'mind' },
  { name: 'Learn a new skill', icon: 'Brain', category: 'growth', color: 'category-growth', lifeArea: 'career' },
  
  // Health & Fitness
  { name: 'Exercise', icon: 'Dumbbell', category: 'fitness', color: 'category-fitness', lifeArea: 'health' },
  { name: 'Stretch for 10 minutes', icon: 'Activity', category: 'fitness', color: 'category-fitness', lifeArea: 'health' },
  { name: 'Track workouts', icon: 'ClipboardList', category: 'fitness', color: 'category-fitness', lifeArea: 'health' },
  { name: 'Take supplements', icon: 'Pill', category: 'fitness', color: 'category-fitness', lifeArea: 'health' },
  { name: 'Hit daily step goal', icon: 'Footprints', category: 'fitness', color: 'category-fitness', lifeArea: 'health' },
  
  // Nutrition
  { name: 'Eat 3 healthy meals', icon: 'UtensilsCrossed', category: 'nutrition', color: 'category-nutrition', lifeArea: 'health' },
  { name: 'Drink 8+ glasses of water', icon: 'Droplets', category: 'nutrition', color: 'category-nutrition', lifeArea: 'health' },
  { name: 'Avoid junk food', icon: 'Ban', category: 'nutrition', color: 'category-nutrition', lifeArea: 'health' },
  { name: 'Track calories', icon: 'Calculator', category: 'nutrition', color: 'category-nutrition', lifeArea: 'health' },
  { name: 'Eat fruits & vegetables', icon: 'Apple', category: 'nutrition', color: 'category-nutrition', lifeArea: 'health' },
  
  // Mental Wellness
  { name: 'Meditate for 10 minutes', icon: 'Sparkles', category: 'wellness', color: 'category-wellness', lifeArea: 'mind' },
  { name: 'Write 3 gratitudes', icon: 'Heart', category: 'wellness', color: 'category-wellness', lifeArea: 'mind' },
  { name: 'No phone after 9 PM', icon: 'Moon', category: 'wellness', color: 'category-wellness', lifeArea: 'health' },
  { name: 'Spend time outside', icon: 'Sun', category: 'wellness', color: 'category-wellness', lifeArea: 'health' },
  { name: 'Reflect on feelings', icon: 'MessageCircle', category: 'wellness', color: 'category-wellness', lifeArea: 'mind' },

  // Discipline
  { name: '5:30 AM Wake Up', icon: 'Sunrise', category: 'discipline', color: 'category-discipline', lifeArea: 'health' },
  { name: 'Stop Smoking', icon: 'Ban', category: 'discipline', color: 'category-discipline', lifeArea: 'health' },
  { name: 'No Porn', icon: 'Shield', category: 'discipline', color: 'category-discipline', lifeArea: 'mind' },
  { name: 'No Alcohol', icon: 'Wine', category: 'discipline', color: 'category-discipline', lifeArea: 'health' },

  // Finance
  { name: 'Stayed Within Budget', icon: 'Wallet', category: 'finance', color: 'category-finance', lifeArea: 'career' },
  { name: 'Tracked Expenses', icon: 'Receipt', category: 'finance', color: 'category-finance', lifeArea: 'career' },
];
