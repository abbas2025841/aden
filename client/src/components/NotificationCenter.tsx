import React, { useState, useEffect } from 'react';
import { notificationService, Notification, NotificationPreferences } from '@/services/NotificationService';
import { Bell, Settings, Check, X, Trash2, Filter, Clock, AlertTriangle, Info, CheckCircle, Gift } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(notificationService.getPreferences());
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');
  const [filter, setFilter] = useState<'all' | 'emergency' | 'service' | 'update' | 'reminder' | 'promotion'>('all');

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread' && notification.read) return false;
    if (filter !== 'all' && notification.category !== filter) return false;
    return true;
  });

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'emergency') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (type === 'success') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (type === 'error') return <X className="w-5 h-5 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    if (category === 'promotion') return <Gift className="w-5 h-5 text-purple-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleDeleteNotification = (id: string) => {
    notificationService.deleteNotification(id);
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead();
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
  };

  const handleUpdatePreferences = (updates: Partial<NotificationPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    notificationService.updatePreferences(newPreferences);
  };

  const handleRequestPermission = async () => {
    await notificationService.requestPermission();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* خلفية شفافة */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* لوحة الإشعارات */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* الهيدر */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">الإشعارات</h2>
              {notificationService.getUnreadCount() > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {notificationService.getUnreadCount()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* التبويبات */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              الكل ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'unread' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              غير مقروء ({notificationService.getUnreadCount()})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'settings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 mx-auto" />
            </button>
          </div>

          {/* المحتوى */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'settings' ? (
              /* إعدادات الإشعارات */
              <div className="p-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">إعدادات الإشعارات</h3>
                  
                  {/* الإشعارات العامة */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">إشعارات الدفع</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.pushNotifications}
                          onChange={(e) => handleUpdatePreferences({ pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">إشعارات البريد الإلكتروني</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) => handleUpdatePreferences({ emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* فئات الإشعارات */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">فئات الإشعارات</h4>
                    {Object.entries(preferences.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {category === 'service' ? 'الخدمات' :
                           category === 'emergency' ? 'الطوارئ' :
                           category === 'update' ? 'التحديثات' :
                           category === 'reminder' ? 'التذكيرات' :
                           'العروض'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => handleUpdatePreferences({
                              categories: { ...preferences.categories, [category]: e.target.checked }
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* ساعات الهدوء */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">ساعات الهدوء</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.quietHours.enabled}
                          onChange={(e) => handleUpdatePreferences({
                            quietHours: { ...preferences.quietHours, enabled: e.target.checked }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {preferences.quietHours.enabled && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>من {preferences.quietHours.start} إلى {preferences.quietHours.end}</span>
                      </div>
                    )}
                  </div>

                  {/* طلب إذن الإشعارات */}
                  <button
                    onClick={handleRequestPermission}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    تفعيل إشعارات المتصفح
                  </button>
                </div>
              </div>
            ) : (
              /* قائمة الإشعارات */
              <div className="p-4">
                {/* الفلاتر والأزرار */}
                <div className="flex items-center justify-between mb-4">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                  >
                    <option value="all">جميع الفئات</option>
                    <option value="emergency">الطوارئ</option>
                    <option value="service">الخدمات</option>
                    <option value="update">التحديثات</option>
                    <option value="reminder">التذكيرات</option>
                    <option value="promotion">العروض</option>
                  </select>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
                    >
                      تحديد الكل كمقروء
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg transition-colors"
                    >
                      مسح الكل
                    </button>
                  </div>
                </div>

                {/* الإشعارات */}
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>لا توجد إشعارات</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-l-4 rounded-lg p-4 transition-all ${
                          notification.read ? 'bg-gray-50' : 'bg-white shadow-sm'
                        } ${getPriorityColor(notification.priority)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type, notification.category)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                    title="تحديد كمقروء"
                                  >
                                    <Check className="w-3 h-3 text-gray-500" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                  title="حذف"
                                >
                                  <Trash2 className="w-3 h-3 text-gray-500" />
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(notification.createdAt)}
                              </span>
                              {notification.priority === 'urgent' && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                  عاجل
                                </span>
                              )}
                            </div>

                            {/* أزرار الإجراءات */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {notification.actions.map((action) => (
                                  <button
                                    key={action.id}
                                    className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                                      action.style === 'primary' 
                                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        : action.style === 'danger'
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}