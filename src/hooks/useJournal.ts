import { useState, useEffect, useCallback } from 'react';
import { JournalEntry, JournalStats } from '@/types/journal';
import { format, subDays, parseISO, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const STORAGE_KEY = 'streakly-journal';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function getStoredEntries(): JournalEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setEntries(getStoredEntries());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  const getEntryByDate = useCallback((date: string): JournalEntry | undefined => {
    return entries.find(e => e.date === date);
  }, [entries]);

  const getTodayEntry = useCallback((): JournalEntry | undefined => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return getEntryByDate(today);
  }, [getEntryByDate]);

  const saveEntry = useCallback((date: string, content: string, mood?: JournalEntry['mood'], habitsSummary?: JournalEntry['habitsSummary']) => {
    const now = new Date().toISOString();
    
    setEntries(prev => {
      const existingIndex = prev.findIndex(e => e.date === date);
      
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          content,
          mood: mood ?? updated[existingIndex].mood,
          habitsSummary: habitsSummary ?? updated[existingIndex].habitsSummary,
          updatedAt: now,
        };
        return updated;
      } else {
        // Create new
        return [...prev, {
          id: generateId(),
          date,
          content,
          mood,
          habitsSummary,
          createdAt: now,
          updatedAt: now,
        }];
      }
    });
  }, []);

  const deleteEntry = useCallback((date: string) => {
    setEntries(prev => prev.filter(e => e.date !== date));
  }, []);

  const updateMood = useCallback((date: string, mood: JournalEntry['mood']) => {
    setEntries(prev => prev.map(entry => {
      if (entry.date !== date) return entry;
      return { ...entry, mood, updatedAt: new Date().toISOString() };
    }));
  }, []);

  const getStats = useCallback((): JournalStats => {
    const sortedDates = entries.map(e => e.date).sort().reverse();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Calculate current streak
    let currentStreak = 0;
    let checkDate = today;
    
    if (sortedDates.includes(today)) {
      currentStreak = 1;
      checkDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    }
    
    while (sortedDates.includes(checkDate)) {
      currentStreak++;
      checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
    }

    // If today is not complete but yesterday is, still count streak
    if (currentStreak === 0 && sortedDates.includes(format(subDays(new Date(), 1), 'yyyy-MM-dd'))) {
      checkDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      while (sortedDates.includes(checkDate)) {
        currentStreak++;
        checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 1;
    const allDates = [...sortedDates].sort();
    
    for (let i = 1; i < allDates.length; i++) {
      const diff = differenceInDays(parseISO(allDates[i]), parseISO(allDates[i - 1]));
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    // This month entries
    const thisMonth = format(new Date(), 'yyyy-MM');
    const thisMonthEntries = entries.filter(e => e.date.startsWith(thisMonth)).length;

    // Average words per entry
    const totalWords = entries.reduce((acc, e) => acc + e.content.split(/\s+/).filter(w => w.length > 0).length, 0);
    const avgWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;

    return {
      currentStreak,
      longestStreak,
      totalEntries: entries.length,
      thisMonthEntries,
      avgWordsPerEntry,
    };
  }, [entries]);

  const getMonthEntries = useCallback((month: Date): { date: string; hasEntry: boolean; wordCount: number; mood?: JournalEntry['mood'] }[] => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateStr);
      return {
        date: dateStr,
        hasEntry: !!entry,
        wordCount: entry ? entry.content.split(/\s+/).filter(w => w.length > 0).length : 0,
        mood: entry?.mood,
      };
    });
  }, [entries]);

  const getMoodTrend = useCallback((days: number = 30) => {
    const trend: { date: string; mood: JournalEntry['mood'] }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === date);
      if (entry?.mood) {
        trend.push({ date, mood: entry.mood });
      }
    }
    
    return trend;
  }, [entries]);

  return {
    entries,
    isLoaded,
    getEntryByDate,
    getTodayEntry,
    saveEntry,
    deleteEntry,
    updateMood,
    getStats,
    getMonthEntries,
    getMoodTrend,
  };
}
