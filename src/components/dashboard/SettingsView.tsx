import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Trash2, RefreshCw, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export function SettingsView() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    toast.success(`Switched to ${newMode ? 'dark' : 'light'} mode`);
  };

  const handleClearData = () => {
    localStorage.removeItem('streakly-habits');
    localStorage.removeItem('streakly-goals');
    localStorage.removeItem('streakly-journal');
    localStorage.removeItem('streakly-journal-settings');
    localStorage.removeItem('streakly-routines');
    localStorage.removeItem('streakly-routine-completions');
    localStorage.removeItem('streakly-skincare');
    localStorage.removeItem('streakly-skincare-completions');
    localStorage.removeItem('streakly-skincare-settings');
    window.location.reload();
  };

  const handleResetToDefaults = () => {
    localStorage.removeItem('streakly-habits');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Customize your Streakly experience
        </p>
      </div>

      {/* Appearance */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <Moon className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
          />
        </div>
      </motion.section>

      {/* Data Management */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">Data Management</h2>

        <div className="space-y-4">
          {/* Reset to Defaults */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Reset Habits</p>
                <p className="text-sm text-muted-foreground">
                  Reset to default habits (keeps goals)
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset habits?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all your habits and their progress, resetting to the default habits. Your goals will be preserved.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetToDefaults}>
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Clear All Data */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-destructive" />
              <div>
                <p className="font-medium text-foreground">Clear All Data</p>
                <p className="text-sm text-muted-foreground">
                  Delete all habits, progress, and goals
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your habits, progress data, and goals.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </motion.section>

      {/* About */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl p-5 shadow-md border border-border/50 space-y-4"
      >
        <h2 className="text-lg font-semibold text-foreground">About Streakly</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Version 1.0.0</p>
              <p className="text-sm text-muted-foreground">
                Build better habits, one day at a time
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Streakly is a beautiful, minimal habit tracker designed to help you build consistent routines and achieve your personal development goals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              React
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              TypeScript
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Tailwind CSS
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Framer Motion
            </span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
