import { useEffect } from 'react';
import { WebSocketManager } from '../websocket/manager';
import { useAppStore } from '../store';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';

// Singleton instance for the application
let wsManager: WebSocketManager | null = null;

function getWebSocketManager() {
  if (!wsManager) {
    // Use mock URL for this environment
    wsManager = new WebSocketManager('mock');
  }
  return wsManager;
}

export function useWebSocket(channels: string[] = []) {
  const setConnectionStatus = useAppStore((state) => state.setConnectionStatus);
  const updateEpic = useAppStore((state) => state.updateEpic);
  const addActivity = useAppStore((state) => state.addActivity);
  
  const manager = getWebSocketManager();

  useEffect(() => {
    // Connect on mount
    manager.connect();

    // Status listener
    const cleanupStatus = manager.onStatusChange((status) => {
      setConnectionStatus(status);
      if (status === 'connected') {
        toast.success("System Connected", { description: "Real-time telemetry active." });
      } else if (status === 'disconnected') {
        toast.error("System Disconnected", { description: "Attempting to reconnect..." });
      }
    });

    // Event listeners
    const cleanupActivity = manager.on('activity.new', (data) => {
      addActivity(data);
    });

    const cleanupEpicUpdate = manager.on('epic.updated', (data) => {
      updateEpic(data);
    });

    return () => {
      cleanupStatus();
      cleanupActivity();
      cleanupEpicUpdate();
    };
  }, [setConnectionStatus, updateEpic, addActivity]);

  return {
    isConnected: manager.status === 'connected',
    send: manager.send.bind(manager),
    reconnect: manager.connect.bind(manager)
  };
}
