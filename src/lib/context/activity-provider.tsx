
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socket-provider';
import { ACTIVITY_LOG } from '@/lib/data';

interface Activity {
  id: string | number;
  type: string;
  agentName?: string;
  action?: string;
  description?: string;
  timestamp: string;
  context?: string;
}

const ActivityContext = createContext<{
  activities: Activity[];
  addActivity: (activity: Activity) => void;
} | null>(null);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const socket = useSocket();

  useEffect(() => {
    // Load mock data
    const mapped = ACTIVITY_LOG.map(a => ({
        id: a.id,
        type: a.type,
        agentName: a.agentName,
        description: a.action,
        timestamp: a.time, // This is "2 min ago", should be Date for real app
        context: a.context
    }));
    setActivities(mapped);
  }, []);

  useEffect(() => {
    const handleEvent = (data: any) => {
      const newActivity: Activity = {
        id: data.id || Date.now(),
        type: data.type || 'system',
        agentName: data.agentName || data.agent || 'System',
        description: data.description || data.message || '',
        timestamp: data.timestamp || 'Just now',
        context: data.context
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 100));
    };

    const unsub = socket.on('activity.new', handleEvent);
    return () => unsub();
  }, [socket]);

  const addActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev].slice(0, 100));
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within ActivityProvider');
  return context;
}
