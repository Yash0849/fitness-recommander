import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/localStorage';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      loadNotifications();
      checkForReminders();
      
      // Check for reminders every minute
      const interval = setInterval(checkForReminders, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    const stored = localStorage.getItem(`notifications_${user.id}`);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    if (!user) return;
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  };

  const checkForReminders = () => {
    if (!user) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Check for workout reminders (suggest workout at 6 AM, 6 PM)
    if ((currentHour === 6 || currentHour === 18) && currentMinute === 0) {
      const workoutPlans = storage.getWorkoutPlans(user.id);
      if (workoutPlans.length > 0) {
        addNotification({
          type: 'info',
          title: 'Workout Reminder',
          message: `Time for your workout! You have ${workoutPlans.length} workout plan(s) ready.`,
          action: {
            label: 'View Plans',
            onClick: () => window.location.href = '/workout-plans'
          }
        });
      }
    }

    // Check for meal reminders (suggest meals at 8 AM, 1 PM, 7 PM)
    if ((currentHour === 8 || currentHour === 13 || currentHour === 19) && currentMinute === 0) {
      addNotification({
        type: 'info',
        title: 'Meal Reminder',
        message: currentHour === 8 ? 'Time for breakfast!' : 
                 currentHour === 13 ? 'Time for lunch!' : 
                 'Time for dinner!',
        action: {
          label: 'Log Meal',
          onClick: () => window.location.href = '/diet-tracking'
        }
      });
    }

    // Check for water intake reminder (every 2 hours during day)
    if (currentHour >= 8 && currentHour <= 20 && currentHour % 2 === 0 && currentMinute === 0) {
      const healthMetrics = storage.getHealthMetrics(user.id);
      const latest = healthMetrics[healthMetrics.length - 1];
      if (latest && latest.waterIntake < 2000) {
        addNotification({
          type: 'warning',
          title: 'Hydration Reminder',
          message: `You've had ${latest.waterIntake}ml of water today. Stay hydrated!`,
          action: {
            label: 'Update',
            onClick: () => window.location.href = '/'
          }
        });
      }
    }

    // Check for progress logging reminder (weekly on Sunday at 9 AM)
    if (now.getDay() === 0 && currentHour === 9 && currentMinute === 0) {
      addNotification({
        type: 'info',
        title: 'Weekly Progress Check',
        message: 'Time to log your weekly progress! Track your weight, measurements, and achievements.',
        action: {
          label: 'Log Progress',
          onClick: () => window.location.href = '/progress'
        }
      });
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false
    };

    const updated = [newNotification, ...notifications].slice(0, 50); // Keep last 50
    saveNotifications(updated);

    // Auto-remove after 5 seconds for non-action notifications
    if (!notification.action) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const removeNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      removeNotification,
      clearAll,
      unreadCount
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}

function NotificationContainer() {
  const { notifications, markAsRead, removeNotification } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Show only unread or recent notifications (last 5)
    const recent = notifications
      .filter(n => !n.read || new Date(n.timestamp).getTime() > Date.now() - 30000)
      .slice(0, 5);
    setVisibleNotifications(recent);
  }, [notifications]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {visibleNotifications.map(notification => (
        <div
          key={notification.id}
          className={`${getBgColor(notification.type)} border rounded-lg shadow-lg p-4 flex items-start space-x-3 animate-slide-in`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900">{notification.title}</h4>
            <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
            {notification.action && (
              <button
                onClick={() => {
                  notification.action?.onClick();
                  markAsRead(notification.id);
                  removeNotification(notification.id);
                }}
                className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                {notification.action.label} →
              </button>
            )}
          </div>
          <button
            onClick={() => {
              markAsRead(notification.id);
              removeNotification(notification.id);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function NotificationBell() {
  const { unreadCount, notifications, markAsRead, removeNotification, clearAll } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-700 hover:text-indigo-600"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="divide-y">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.action) {
                        notification.action.onClick();
                        removeNotification(notification.id);
                      }
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

