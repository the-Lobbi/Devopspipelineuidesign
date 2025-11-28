
import React, { createContext, useContext, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const NotificationsContext = createContext<{
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
} | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Epic Completed', description: 'GA-32 has been successfully deployed.', read: false, timestamp: '10m ago', type: 'success' },
    { id: '2', title: 'Agent Input Required', description: 'Planner Agent needs clarification on GA-34.', read: false, timestamp: '1h ago', type: 'warning' }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (data: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      read: false,
      timestamp: 'Just now',
      ...data
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
  return context;
}
