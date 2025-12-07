import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Trash2, 
  AlertCircle, 
  Star, 
  Target,
  Clock,
  ExternalLink
} from 'lucide-react';
import { jobNotificationService, JobNotification } from '@/services/jobNotificationService';

interface JobNotificationsProps {
  onClose?: () => void;
}

export default function JobNotifications({ onClose }: JobNotificationsProps) {
  const [notifications, setNotifications] = useState<JobNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // الاشتراك في الإشعارات
    const unsubscribe = jobNotificationService.subscribe(setNotifications);
    
    // تحميل الإشعارات الحالية
    setNotifications(jobNotificationService.getNotifications());

    return unsubscribe;
  }, []);

  const unreadCount = jobNotificationService.getUnreadCount();

  const handleMarkAsRead = (notificationId: string) => {
    jobNotificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    jobNotificationService.markAllAsRead();
  };

  const handleDeleteNotification = (notificationId: string) => {
    jobNotificationService.deleteNotification(notificationId);
  };

  const handleClearAll = () => {
    jobNotificationService.clearAllNotifications();
  };

  const getNotificationIcon = (type: JobNotification['type']) => {
    switch (type) {
      case 'urgent_job':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'matching_job':
        return <Target className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: JobNotification['type']) => {
    switch (type) {
      case 'urgent_job':
        return 'border-red-200 bg-red-50';
      case 'matching_job':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="relative">
      {/* زر الإشعارات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* قائمة الإشعارات */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                إشعارات الوظائف
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    تحديد الكل كمقروء
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* قائمة الإشعارات */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <Clock className="w-3 h-3" />
                              <span>
                                {notification.timestamp.toLocaleTimeString('ar-SA')}
                              </span>
                              <span>•</span>
                              <span>{notification.job.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                notification.job.category === 'medical' ? 'bg-red-100 text-red-700' :
                                notification.job.category === 'education' ? 'bg-blue-100 text-blue-700' :
                                notification.job.category === 'technical' ? 'bg-purple-100 text-purple-700' :
                                notification.job.category === 'engineering' ? 'bg-orange-100 text-orange-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {notification.job.category === 'medical' ? 'طبي' :
                                 notification.job.category === 'education' ? 'تعليمي' :
                                 notification.job.category === 'technical' ? 'تقني' :
                                 notification.job.category === 'engineering' ? 'هندسي' :
                                 'أخرى'}
                              </span>
                              <a
                                href={notification.job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                عرض الوظيفة
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="تحديد كمقروء"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {notifications.length} إشعار
                </span>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  حذف الكل
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
