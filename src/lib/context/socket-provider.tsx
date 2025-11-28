
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { WebSocketManager } from '@/lib/websocket/manager';

const SocketContext = createContext<WebSocketManager | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  // Use a ref to keep the singleton instance
  const socketManager = useRef<WebSocketManager | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  if (!socketManager.current) {
    // Initialize with a mock URL or env var
    // In a real app: process.env.NEXT_PUBLIC_WS_URL
    socketManager.current = new WebSocketManager('mock');
  }

  useEffect(() => {
    const manager = socketManager.current;
    if (!manager) return;

    const unsubscribe = manager.onStatusChange(setStatus);
    
    // Auto-connect on mount
    manager.connect();

    return () => {
      unsubscribe();
      manager.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketManager.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
