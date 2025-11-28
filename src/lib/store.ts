import { create } from 'zustand';
import { Epic, Agent, ActivityItem } from '@/lib/types';
import { EPICS, ACTIVITY_LOG } from '@/lib/data';
import { useMemo } from 'react';

// --- Types ---

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  lastCheck: string;
  latency: string;
}

interface AppState {
  // Epics Slice
  epics: Epic[];
  epicFilters: {
    search: string;
    status: string[];
    repositories: string[];
    labels: string[];
  };
  
  // Agents Slice
  agents: Agent[];
  
  // Activity Slice
  activities: ActivityItem[];
  
  // Connection Slice
  connectionStatus: ConnectionStatus;
  services: ServiceStatus[];
  
  // UI Slice
  commandPaletteOpen: boolean;
  selectedEpicId: string | null;
  isSidebarOpen: boolean;
  
  // Actions
  setEpics: (epics: Epic[]) => void;
  updateEpic: (epic: Epic) => void;
  setFilters: (filters: Partial<AppState['epicFilters']>) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  selectEpic: (epicId: string | null) => void;
  addActivity: (activity: ActivityItem) => void;
}

// --- Initial Data ---

const INITIAL_SERVICES: ServiceStatus[] = [
  { name: 'Orchestrator', status: 'operational', lastCheck: 'Just now', latency: '24ms' },
  { name: 'Jira Integration', status: 'operational', lastCheck: '1m ago', latency: '145ms' },
  { name: 'GitHub API', status: 'operational', lastCheck: '2m ago', latency: '85ms' },
  { name: 'Confluence', status: 'degraded', lastCheck: '5m ago', latency: '420ms' },
  { name: 'OpenAI Core', status: 'operational', lastCheck: 'Just now', latency: '180ms' },
];

// --- Store ---

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  epics: EPICS as unknown as Epic[], // Casting assuming generic match for mock data
  epicFilters: {
    search: '',
    status: [],
    repositories: [],
    labels: [],
  },
  agents: [],
  activities: ACTIVITY_LOG as unknown as ActivityItem[],
  connectionStatus: 'connected', // Default to connected for simulation
  services: INITIAL_SERVICES,
  commandPaletteOpen: false,
  selectedEpicId: null,
  isSidebarOpen: true,

  // Actions
  setEpics: (epics) => set({ epics }),
  
  updateEpic: (updatedEpic) => set((state) => ({
    epics: state.epics.map((e) => e.id === updatedEpic.id ? updatedEpic : e)
  })),
  
  setFilters: (newFilters) => set((state) => ({
    epicFilters: { ...state.epicFilters, ...newFilters }
  })),
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  
  selectEpic: (epicId) => set({ selectedEpicId: epicId }),
  
  addActivity: (activity) => set((state) => ({
    activities: [activity, ...state.activities].slice(0, 50) // Keep last 50
  })),
}));

// --- Selectors / Hooks ---

export const useEpics = () => useAppStore((state) => state.epics);

export const useFilteredEpics = () => {
  const epics = useAppStore((state) => state.epics);
  const epicFilters = useAppStore((state) => state.epicFilters);

  return useMemo(() => {
    return epics.filter(epic => {
      // Search filter
      if (epicFilters.search) {
        const term = epicFilters.search.toLowerCase();
        const matchesSearch = 
          epic.summary.toLowerCase().includes(term) || 
          epic.jiraKey.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (epicFilters.status.length > 0) {
        if (!epicFilters.status.includes(epic.status)) return false;
      }
      
      // Label filter
      if (epicFilters.labels.length > 0) {
         if (!epic.labels?.some(l => epicFilters.labels.includes(l))) return false;
      }
      
      return true;
    });
  }, [epics, epicFilters]);
};

export const useEpicFilters = () => useAppStore((state) => state.epicFilters);

export const useActivities = () => useAppStore((state) => state.activities);

export const useConnectionStatus = () => useAppStore((state) => state.connectionStatus);

export const useServices = () => useAppStore((state) => state.services);

export const useSelectedEpic = () => useAppStore((state) => 
  state.epics.find(e => e.id === state.selectedEpicId) || null
);
