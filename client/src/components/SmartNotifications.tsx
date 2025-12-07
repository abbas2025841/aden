import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService, Notification } from '@/lib/notificationService';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const SmartNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = notificationService.addListener(setNotifications);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setIsVisible(true);
    }
  }, [notifications]);

  const handleClose = (id: string) => {
    notificationService.removeNotification(id);
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
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
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${getBgColor(notification.type)} border rounded-lg p-4 shadow-lg`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  {notification.message}
                </p>
                
                {notification.actionUrl && notification.actionText && (
                  <a
                    href={notification.actionUrl}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    {notification.actionText}
                  </a>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleClose(notification.id)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="إغلاق الإشعار"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
                
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="تحديد كمقروء"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SmartNotifications;
