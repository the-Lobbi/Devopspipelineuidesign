import { useEffect } from 'react';
import { WebSocketManager } from '@/lib/websocket/manager';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner@2.0.3';

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
        // toast.success("System Connected", { description: "Real-time telemetry active." });
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
    send: manager.send.bind(manager)
  };
}
