
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useSocket } from './socket-provider';
import { Epic } from '@/lib/types';
import { EPICS } from '@/lib/data'; // Mock data for initial state

interface EpicsState {
  items: Record<string, Epic>; // Keyed by ID or Key
  loading: boolean;
  error: string | null;
  filters: {
    status: string[];
    search: string;
  };
}

type Action = 
  | { type: 'SET_EPICS'; payload: Epic[] }
  | { type: 'UPDATE_EPIC'; payload: Epic }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<EpicsState['filters']> };

const initialState: EpicsState = {
  items: {},
  loading: false,
  error: null,
  filters: {
    status: [],
    search: '',
  },
};

function epicsReducer(state: EpicsState, action: Action): EpicsState {
  switch (action.type) {
    case 'SET_EPICS':
      const newItems = action.payload.reduce((acc, epic) => {
        acc[epic.id] = epic;
        return acc;
      }, {} as Record<string, Epic>);
      return { ...state, items: newItems, loading: false };
    case 'UPDATE_EPIC':
      return {
        ...state,
        items: { ...state.items, [action.payload.id]: action.payload },
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

const EpicsContext = createContext<{
  state: EpicsState;
  dispatch: React.Dispatch<Action>;
  filteredEpics: Epic[];
} | null>(null);

export function EpicsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(epicsReducer, initialState);
  const socket = useSocket();

  // Load initial mock data
  useEffect(() => {
    // In real app: fetch('/api/epics').then(...)
    // For now, load mock data
    
    dispatch({ type: 'SET_EPICS', payload: EPICS as unknown as Epic[] });
  }, []);

  useEffect(() => {
    const handleUpdate = (data: any) => {
      dispatch({ type: 'UPDATE_EPIC', payload: data });
    };

    const unsubUpdate = socket.on('epic.updated', handleUpdate);
    const unsubProgress = socket.on('epic.progress', handleUpdate);

    return () => {
      unsubUpdate();
      unsubProgress();
    };
  }, [socket]);

  const filteredEpics = Object.values(state.items).filter(epic => {
    if (state.filters.search && !epic.summary.toLowerCase().includes(state.filters.search.toLowerCase()) && !epic.jiraKey.toLowerCase().includes(state.filters.search.toLowerCase())) {
        return false;
    }
    if (state.filters.status.length > 0 && !state.filters.status.includes(epic.status)) {
        return false;
    }
    return true;
  });

  return (
    <EpicsContext.Provider value={{ state, dispatch, filteredEpics }}>
      {children}
    </EpicsContext.Provider>
  );
}

export function useEpics() {
  const context = useContext(EpicsContext);
  if (!context) throw new Error('useEpics must be used within EpicsProvider');
  return context;
}
