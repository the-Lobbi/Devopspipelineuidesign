import React from 'react';
import { useEpics, useActivities } from '@/lib/store';
import { useWebSocket } from '@/lib/hooks/use-websocket';
import { StatCard } from '@/components/ui/stat-card';
import { WorkflowKanban } from '@/components/dashboard/WorkflowKanban';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Activity as ActivityIcon,
  Wifi
} from 'lucide-react';

interface DashboardViewProps {
  onEpicClick: (epicId: string) => void;
}

export function DashboardView({ onEpicClick }: DashboardViewProps) {
  const epics = useEpics();
  const activities = useActivities();
  const { isConnected } = useWebSocket(["epics", "agents", "activities"]);

  // Calculate stats
  const activeEpics = epics.filter(e => ['planning', 'executing', 'review', 'code_review'].includes(e.status.toLowerCase())).length;
  const pendingAction = epics.filter(e => ['planning_review', 'review', 'failed'].includes(e.status.toLowerCase())).length;
  const completed = epics.filter(e => e.status.toLowerCase() === 'done').length;
  const failed = epics.filter(e => e.status === 'failed').length;
  const totalCompletedFailed = completed + failed;
  const successRate = totalCompletedFailed > 0 ? Math.round((completed / totalCompletedFailed) * 100) : 100;

  return (
    <div className="flex h-full bg-[#09090b] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
            <div>
                <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight flex items-center gap-3">
                    Dashboard
                    {isConnected && <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />}
                </h1>
                <p className="text-zinc-500 text-sm mt-1">Overview of your DevOps pipeline performance</p>
            </div>
            <SystemStatus />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pt-4">
            <StatCard 
                label="Active Epics" 
                value={activeEpics.toString()} 
                icon={Layers}
                trend="up" 
                trendLabel="+2 this week"
                accentColor="bg-blue-500"
            />
            <StatCard 
                label="Pending Action" 
                value={pendingAction.toString()} 
                icon={AlertCircle}
                trend={pendingAction > 3 ? "down" : "neutral"}
                trendLabel={pendingAction > 3 ? "High Load" : "Normal"}
                accentColor="bg-amber-500"
            />
            <StatCard 
                label="Completed" 
                value={completed.toString()} 
                icon={CheckCircle2}
                trend="up"
                trendLabel="Last 30 days"
                accentColor="bg-emerald-500"
            />
            <StatCard 
                label="Success Rate" 
                value={`${successRate}%`} 
                icon={ActivityIcon}
                trend="up"
                trendLabel="Stable"
                accentColor="bg-violet-500"
            />
        </div>

        {/* Kanban Board */}
        <WorkflowKanban onEpicClick={onEpicClick} />
      </div>

      {/* Right Sidebar: Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
