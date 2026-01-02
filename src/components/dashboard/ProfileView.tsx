import { motion } from 'framer-motion';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UserInfoCard } from '@/components/profile/UserInfoCard';
import { HabitProgressCard } from '@/components/profile/HabitProgressCard';
import { CurrentGoalsCard } from '@/components/profile/CurrentGoalsCard';
import { PreferencesCard } from '@/components/profile/PreferencesCard';
import { MotivationalQuote } from '@/components/profile/MotivationalQuote';
import { useProfile } from '@/hooks/useProfile';
import { useHabits } from '@/hooks/useHabits';
import { useGoals } from '@/hooks/useGoals';
import { useMemo } from 'react';

interface ProfileViewProps {
  onNavigateToGoals: () => void;
}

export function ProfileView({ onNavigateToGoals }: ProfileViewProps) {
  const { profile, updateProfile, updatePreferences, changeSubtitle } = useProfile();
  const { habits, getHabitStats } = useHabits();
  const { goals } = useGoals();

  // Calculate overall habit stats
  const habitStats = useMemo(() => {
    if (habits.length === 0) {
      return { completionRate: 0, longestStreak: 0, totalCompletions: 0 };
    }

    const allStats = habits.map(h => getHabitStats(h));
    const avgCompletionRate = Math.round(
      allStats.reduce((sum, s) => sum + s.completionRate, 0) / allStats.length
    );
    const maxLongestStreak = Math.max(...allStats.map(s => s.longestStreak), 0);
    const totalCompletions = allStats.reduce((sum, s) => sum + s.totalCompletions, 0);

    return {
      completionRate: avgCompletionRate,
      longestStreak: maxLongestStreak,
      totalCompletions,
    };
  }, [habits, getHabitStats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header */}
      <ProfileHeader
        name={profile.name}
        subtitle={profile.subtitle}
        avatarUrl={profile.avatarUrl}
        onChangeSubtitle={changeSubtitle}
      />

      {/* User Info */}
      <UserInfoCard profile={profile} onUpdate={updateProfile} />

      {/* Habit Progress */}
      <HabitProgressCard
        completionRate={habitStats.completionRate}
        longestStreak={habitStats.longestStreak}
        totalCompletions={habitStats.totalCompletions}
      />

      {/* Current Goals */}
      <CurrentGoalsCard goals={goals} onNavigateToGoals={onNavigateToGoals} />

      {/* Preferences */}
      <PreferencesCard
        preferences={profile.preferences}
        onUpdatePreferences={updatePreferences}
      />

      {/* Motivational Quote */}
      <MotivationalQuote />
    </motion.div>
  );
}
