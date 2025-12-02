
import React, { useState, Suspense } from 'react';
import { AppShell } from './components/layout/AppShell';
import { ThemeProvider } from './components/theme-provider';
import { SocketProvider } from './lib/context/socket-provider';
import { EpicsProvider } from './lib/context/epics-provider';
import { AgentsProvider } from './lib/context/agents-provider';
import { ActivityProvider } from './lib/context/activity-provider';
import { NotificationsProvider } from './lib/context/notifications-provider';
import { Toaster } from 'sonner@2.0.3';
import { PageTransition } from '@/components/ui/page-transition';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Skeletons
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { EpicListSkeleton } from '@/components/skeletons/EpicListSkeleton';
import { EpicDetailSkeleton } from '@/components/skeletons/EpicDetailSkeleton';
import { AgentsSkeleton } from '@/components/skeletons/AgentsSkeleton';

// Lazy Loaded Views
const DashboardView = React.lazy(() => import('./components/views/DashboardView').then(module => ({ default: module.DashboardView })));
const EpicListView = React.lazy(() => import('./components/views/EpicListView').then(module => ({ default: module.EpicListView })));
const EpicDetailView = React.lazy(() => import('./components/views/EpicDetailView').then(module => ({ default: module.EpicDetailView })));
const SettingsView = React.lazy(() => import('./components/views/SettingsView').then(module => ({ default: module.SettingsView })));
const AgentsView = React.lazy(() => import('./components/views/AgentsView').then(module => ({ default: module.AgentsView })));
const WizardsView = React.lazy(() => import('./components/views/WizardsView').then(module => ({ default: module.WizardsView })));
const KnowledgeView = React.lazy(() => import('./components/views/KnowledgeView').then(module => ({ default: module.KnowledgeView })));

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
        return (
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardView onEpicClick={(id) => handleNavigation('epic-detail', id)} />
            </Suspense>
        );
      case 'epics':
        return (
            <Suspense fallback={<EpicListSkeleton />}>
                <EpicListView onEpicClick={(id) => handleNavigation('epic-detail', id)} />
            </Suspense>
        );
      case 'epic-detail':
        return (
            <Suspense fallback={<EpicDetailSkeleton />}>
                <EpicDetailView epicId={selectedEpicId || 'GA-33'} onBack={() => setCurrentView('epics')} />
            </Suspense>
        );
      case 'agents':
        return (
            <Suspense fallback={<AgentsSkeleton />}>
                <AgentsView />
            </Suspense>
        );
      case 'wizards':
        return (
            <Suspense fallback={<DashboardSkeleton />}>
                <WizardsView />
            </Suspense>
        );
      case 'knowledge':
        return (
            <Suspense fallback={<DashboardSkeleton />}>
                <KnowledgeView />
            </Suspense>
        );
      case 'settings':
        return (
            <Suspense fallback={<DashboardSkeleton />}>
                <SettingsView />
            </Suspense>
        );
      default:
        return (
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardView onEpicClick={(id) => handleNavigation('epic-detail', id)} />
            </Suspense>
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="ga-theme">
      <DndProvider backend={HTML5Backend}>
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
      </DndProvider>
    </ThemeProvider>
  );
}
