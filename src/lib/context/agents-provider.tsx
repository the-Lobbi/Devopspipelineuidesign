
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socket-provider';
import { AGENT_TREE } from '@/lib/plan-data';

// Define Agent type if not fully imported or extend it
interface Agent {
  id: string;
  name: string;
  status: string;
  activity: string;
  model: string;
  children?: Agent[];
}

const AgentsContext = createContext<{
  agents: Agent[];
  updateAgent: (id: string, data: Partial<Agent>) => void;
} | null>(null);

export function AgentsProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([AGENT_TREE as unknown as Agent]);
  const socket = useSocket();

  useEffect(() => {
    const handleAgentUpdate = (data: any) => {
      // In a real app, we'd need complex logic to update the tree
      // For now, we'll just console log or simplistic update
      console.log('Agent update:', data);
    };

    const unsub = socket.on('agent.updated', handleAgentUpdate);
    return () => unsub();
  }, [socket]);

  const updateAgent = (id: string, data: Partial<Agent>) => {
    // Implementation for recursive update would go here
    console.log('Updating agent', id, data);
  };

  return (
    <AgentsContext.Provider value={{ agents, updateAgent }}>
      {children}
    </AgentsContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentsContext);
  if (!context) throw new Error('useAgents must be used within AgentsProvider');
  return context;
}
