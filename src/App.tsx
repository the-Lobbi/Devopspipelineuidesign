
import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardView } from './components/views/DashboardView';
import { EpicListView } from './components/views/EpicListView';
import { EpicDetailView } from './components/views/EpicDetailView';
import { SettingsView } from './components/views/SettingsView';
import { AgentsView } from './components/views/AgentsView';
import { KnowledgeView } from './components/views/KnowledgeView';
import { ThemeProvider } from './components/theme-provider';
import { SocketProvider } from './lib/context/socket-provider';
import { EpicsProvider } from './lib/context/epics-provider';
import { AgentsProvider } from './lib/context/agents-provider';
import { ActivityProvider } from './lib/context/activity-provider';
import { NotificationsProvider } from './lib/context/notifications-provider';
import { Toaster } from 'sonner@2.0.3';

import { PageTransition } from '@/components/ui/page-transition';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);

  const handleNavigation = (view: string, id?: string) => {
    if (id) setSelectedEpicId(id);
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onEpicClick={(id) => handleNavigation('epic-detail', id)} />;
      case 'epics':
        return <EpicListView onEpicClick={(id) => handleNavigation('epic-detail', id)} />;
      case 'epic-detail':
        return <EpicDetailView epicId={selectedEpicId || 'GA-33'} onBack={() => setCurrentView('epics')} />;
      case 'agents':
        return <AgentsView />;
      case 'knowledge':
        return <KnowledgeView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onEpicClick={(id) => handleNavigation('epic-detail', id)} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ga-theme">
      <SocketProvider>
        <NotificationsProvider>
          <ActivityProvider>
            <AgentsProvider>
              <EpicsProvider>
                <AppShell currentView={currentView} onChangeView={handleNavigation}>
                  <PageTransition key={currentView}>
                    {renderView()}
                  </PageTransition>
                </AppShell>
                <Toaster theme="dark" position="bottom-right" />
              </EpicsProvider>
            </AgentsProvider>
          </ActivityProvider>
        </NotificationsProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}
