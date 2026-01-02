import { motion } from 'framer-motion';
import { Sun, Moon, Leaf, Bell, Eye, EyeOff, Mail, Lock, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/hooks/useProfile';

interface PreferencesCardProps {
  preferences: UserProfile['preferences'];
  onUpdatePreferences: (updates: Partial<UserProfile['preferences']>) => void;
  onLogout?: () => void;
}

export function PreferencesCard({ preferences, onUpdatePreferences, onLogout }: PreferencesCardProps) {
  const appearanceModes = [
    { id: 'light' as const, icon: Sun, label: 'Light' },
    { id: 'dark' as const, icon: Moon, label: 'Dark' },
    { id: 'calm' as const, icon: Leaf, label: 'Calm' },
  ];

  const handleAppearanceChange = (mode: 'light' | 'dark' | 'calm') => {
    onUpdatePreferences({ appearance: mode });
    
    // Apply theme
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', mode);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-foreground">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appearance */}
          <div>
            <p className="text-sm text-muted-foreground mb-3">Appearance</p>
            <div className="flex gap-2">
              {appearanceModes.map((mode) => (
                <Button
                  key={mode.id}
                  variant="outline"
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 py-4 h-auto border-border/50 transition-all",
                    preferences.appearance === mode.id && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleAppearanceChange(mode.id)}
                >
                  <mode.icon className={cn(
                    "h-5 w-5",
                    preferences.appearance === mode.id ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-xs",
                    preferences.appearance === mode.id ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {mode.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Reminders */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-calm-lavender/30">
                <Bell className="h-4 w-4 text-calm-lavender-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Reminders</p>
                <p className="text-xs text-muted-foreground">Get gentle nudges</p>
              </div>
            </div>
            <Switch
              checked={preferences.reminderEnabled}
              onCheckedChange={(checked) => onUpdatePreferences({ reminderEnabled: checked })}
            />
          </div>

          {/* Privacy */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-calm-mist/30">
                {preferences.statsPrivate ? (
                  <EyeOff className="h-4 w-4 text-calm-mist-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-calm-mist-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Private Stats</p>
                <p className="text-xs text-muted-foreground">Hide your progress from others</p>
              </div>
            </div>
            <Switch
              checked={preferences.statsPrivate}
              onCheckedChange={(checked) => onUpdatePreferences({ statsPrivate: checked })}
            />
          </div>

          <Separator className="bg-border/50" />

          {/* Account Management */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Account</p>
            <Button variant="outline" className="w-full justify-start gap-3 border-border/50 text-muted-foreground hover:text-foreground">
              <Mail className="h-4 w-4" />
              Change Email
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 border-border/50 text-muted-foreground hover:text-foreground">
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
            {onLogout && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3 border-calm-peach/50 text-calm-peach-foreground hover:bg-calm-peach/10"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
