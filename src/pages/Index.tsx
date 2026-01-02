import { useState, useEffect } from 'react';
import { Navigation, Tab } from '@/components/layout/Navigation';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { RoutinesView } from '@/components/dashboard/RoutinesView';
import { JournalView } from '@/components/dashboard/JournalView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { LifeBalanceView } from '@/components/dashboard/LifeBalanceView';
import { GoalsView } from '@/components/dashboard/GoalsView';
import { BudgetView } from '@/components/dashboard/BudgetView';
import { ProjectsView } from '@/components/dashboard/ProjectsView';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onNavigateToJournal={() => setActiveTab('journal')} />;
      case 'routines':
        return <RoutinesView />;
      case 'journal':
        return <JournalView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'lifebalance':
        return <LifeBalanceView />;
      case 'goals':
        return <GoalsView />;
      case 'budget':
        return <BudgetView />;
      case 'projects':
        return <ProjectsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigateToJournal={() => setActiveTab('journal')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content */}
      <main className="md:ml-64 pt-16 md:pt-0 pb-24 md:pb-8">
        <div className="container max-w-6xl py-6 px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Index;
