import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Sparkles, Heart, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const LandingPage = () => {
  const [email, setEmail] = useState('shreyas');
  const [password, setPassword] = useState('Shreyas@333');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple auth check with default credentials
    setTimeout(() => {
      if (email === 'shreyas' && password === 'Shreyas@333') {
        localStorage.setItem('streakly-auth', JSON.stringify({ 
          email, 
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        }));
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Authentication failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const features = [
    { icon: Leaf, title: 'Mindful Tracking', description: 'Build habits with calm, focused progress tracking' },
    { icon: Sparkles, title: 'Gentle Reminders', description: 'Soft notifications that respect your peace' },
    { icon: Heart, title: 'Self-Compassion', description: 'No guilt, just growth at your own pace' },
    { icon: Target, title: 'Clear Goals', description: 'Simple, achievable milestones for success' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-lavender/30 via-background to-calm-mist/30">
      {/* Hero Section */}
      <div className="container max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-calm-sage/20 text-calm-sage"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Leaf className="w-4 h-4" />
                <span className="text-sm font-medium">Mindful Habit Tracking</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Grow with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-calm-lavender to-calm-sage">
                  Gentle Progress
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-md">
                A calm, mindful approach to building lasting habits. No pressure, just peaceful growth.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-calm-lavender/50 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-calm-lavender mb-2" />
                  <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-muted-foreground italic border-l-2 border-calm-sage/50 pl-4"
            >
              "Small steps create big change."
            </motion.p>
          </motion.div>

          {/* Right - Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-calm-lavender to-calm-sage flex items-center justify-center mb-2">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
                <CardDescription>Sign in to continue your mindful journey</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground">Email / Username</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-calm-lavender"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-calm-lavender"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-calm-lavender to-calm-sage hover:opacity-90 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    New here?{' '}
                    <span className="text-calm-lavender hover:underline cursor-pointer">
                      Create an account
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-calm-lavender/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-calm-sage/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-calm-mist/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default LandingPage;
