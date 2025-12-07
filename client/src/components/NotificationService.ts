export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private preferences: NotificationPreferences = {
    email: true,
    push: true,
    sms: false,
    inApp: true
  };

  // إضافة إشعار جديد
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();
  }

  // الحصول على جميع الإشعارات
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // الحصول على الإشعارات غير المقروءة
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // تحديد إشعار كمقروء
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.notifyListeners();
    }
  }

  // تحديد جميع الإشعارات كمقروءة
  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.notifyListeners();
  }

  // حذف إشعار
  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // حذف جميع الإشعارات
  clearAllNotifications(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // إضافة مستمع للتغييرات
  addListener(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // إشعار المستمعين بالتغييرات
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // إشعارات سريعة
  info(title: string, message: string, actionUrl?: string, actionText?: string): void {
    this.addNotification({ title, message, type: 'info', actionUrl, actionText });
  }

  success(title: string, message: string, actionUrl?: string, actionText?: string): void {
    this.addNotification({ title, message, type: 'success', actionUrl, actionText });
  }

  warning(title: string, message: string, actionUrl?: string, actionText?: string): void {
    this.addNotification({ title, message, type: 'warning', actionUrl, actionText });
  }

  error(title: string, message: string, actionUrl?: string, actionText?: string): void {
    this.addNotification({ title, message, type: 'error', actionUrl, actionText });
  }

  // إدارة التفضيلات
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  updatePreferences(newPreferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }
}

// إنشاء مثيل واحد للتطبيق
export const notificationService = new NotificationService();
