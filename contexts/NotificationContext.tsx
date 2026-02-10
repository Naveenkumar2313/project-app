
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'system' | 'promotion' | 'support';
  read: boolean;
  date: string;
}

interface NotificationContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  
  notifications: InAppNotification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type?: InAppNotification['type']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // In-App Notifications State (Mock initial data)
  const [notifications, setNotifications] = useState<InAppNotification[]>([
    {
      id: 'notif-1',
      title: 'Welcome to Pygenicarc!',
      message: 'Explore our latest project kits and get 10% off your first order.',
      type: 'system',
      read: false,
      date: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    },
    {
      id: 'notif-2',
      title: 'Order Delivered',
      message: 'Your order #ORD-QA-99 has been delivered successfully.',
      type: 'order',
      read: true,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ]);

  // --- Toast Logic ---
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  // --- Notification Logic ---
  const addNotification = useCallback((title: string, message: string, type: InAppNotification['type'] = 'system') => {
    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      date: new Date().toISOString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
    // Also trigger a toast for the new notification
    addToast('info', title); 
  }, [addToast]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ 
      toasts, addToast, removeToast, 
      notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
