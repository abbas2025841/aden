// نظام الإشعارات الذكية - عدن لايف
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'currency' | 'electricity' | 'water' | 'health' | 'jobs' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  icon?: string;
}

export interface NotificationPreferences {
  currency: boolean;
  electricity: boolean;
  water: boolean;
  health: boolean;
  jobs: boolean;
  general: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
}

class NotificationService {
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences = {
    currency: true,
    electricity: true,
    water: true,
    health: true,
    jobs: true,
    general: true,
    sound: true,
    vibration: true,
    desktop: true
  };

  constructor() {
    this.loadPreferences();
    this.loadNotifications();
  }

  // إضافة إشعار جديد
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.showNotification(newNotification);
  }

  // إشعارات أسعار العملات
  addCurrencyNotification(currency: string, oldRate: number, newRate: number, change: number): void {
    if (!this.preferences.currency) return;

    const isIncrease = change > 0;
    const type = isIncrease ? 'warning' : 'success';
    const icon = isIncrease ? '📈' : '📉';
    
    this.addNotification({
      title: `تحديث سعر ${currency}`,
      message: `سعر ${currency} ${isIncrease ? 'ارتفع' : 'انخفض'} من ${oldRate.toFixed(2)} إلى ${newRate.toFixed(2)} ريال (${change > 0 ? '+' : ''}${change.toFixed(2)})`,
      type,
      category: 'currency',
      priority: Math.abs(change) > 5 ? 'high' : 'medium',
      icon,
      actionUrl: '/currency-rates',
      actionText: 'عرض التفاصيل'
    });
  }

  // إشعارات انقطاع الكهرباء
  addElectricityNotification(area: string, duration: string, type: 'outage' | 'restored'): void {
    if (!this.preferences.electricity) return;

    const isOutage = type === 'outage';
    this.addNotification({
      title: isOutage ? 'انقطاع كهرباء' : 'عودة الكهرباء',
      message: isOutage 
        ? `انقطاع كهرباء في ${area} لمدة ${duration}`
        : `عودة الكهرباء في ${area}`,
      type: isOutage ? 'error' : 'success',
      category: 'electricity',
      priority: isOutage ? 'high' : 'medium',
      icon: isOutage ? '⚡' : '✅',
      actionUrl: '/electricity/outages',
      actionText: 'عرض التفاصيل'
    });
  }

  // إشعارات المياه
  addWaterNotification(area: string, type: 'shortage' | 'restored' | 'maintenance'): void {
    if (!this.preferences.water) return;

    const messages = {
      shortage: `نقص في المياه في ${area}`,
      restored: `عودة المياه في ${area}`,
      maintenance: `صيانة المياه في ${area}`
    };

    const types = {
      shortage: 'warning' as const,
      restored: 'success' as const,
      maintenance: 'info' as const
    };

    const icons = {
      shortage: '💧',
      restored: '✅',
      maintenance: '🔧'
    };

    this.addNotification({
      title: 'تحديث المياه',
      message: messages[type],
      type: types[type],
      category: 'water',
      priority: type === 'shortage' ? 'high' : 'medium',
      icon: icons[type],
      actionUrl: '/water',
      actionText: 'عرض التفاصيل'
    });
  }

  // إشعارات الوظائف
  addJobNotification(jobTitle: string, company: string, type: 'new' | 'urgent' | 'expiring'): void {
    if (!this.preferences.jobs) return;

    const messages = {
      new: `وظيفة جديدة: ${jobTitle} في ${company}`,
      urgent: `وظيفة عاجلة: ${jobTitle} في ${company}`,
      expiring: `وظيفة تنتهي قريباً: ${jobTitle} في ${company}`
    };

    const priorities = {
      new: 'medium' as const,
      urgent: 'high' as const,
      expiring: 'medium' as const
    };

    this.addNotification({
      title: 'تحديث الوظائف',
      message: messages[type],
      type: 'info',
      category: 'jobs',
      priority: priorities[type],
      icon: '💼',
      actionUrl: '/jobs',
      actionText: 'عرض الوظائف'
    });
  }

  // إشعارات صحية
  addHealthNotification(title: string, message: string, type: 'alert' | 'info' | 'emergency'): void {
    if (!this.preferences.health) return;

    const types = {
      alert: 'warning' as const,
      info: 'info' as const,
      emergency: 'error' as const
    };

    const priorities = {
      alert: 'medium' as const,
      info: 'low' as const,
      emergency: 'urgent' as const
    };

    this.addNotification({
      title,
      message,
      type: types[type],
      category: 'health',
      priority: priorities[type],
      icon: type === 'emergency' ? '🚨' : '🏥',
      actionUrl: '/health',
      actionText: 'عرض التفاصيل'
    });
  }

  // عرض الإشعار
  private showNotification(notification: Notification): void {
    if (this.preferences.desktop && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        const desktopNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });

        desktopNotification.onclick = () => {
          if (notification.actionUrl) {
            window.location.href = notification.actionUrl;
          }
          desktopNotification.close();
        };

        setTimeout(() => desktopNotification.close(), 5000);
      }
    }

    // إشعار صوتي
    if (this.preferences.sound) {
      this.playNotificationSound(notification.type);
    }

    // اهتزاز
    if (this.preferences.vibration && 'vibrate' in navigator) {
      const vibrationPattern = {
        info: [200],
        success: [200, 100, 200],
        warning: [300, 100, 300],
        error: [500, 200, 500]
      };
      navigator.vibrate(vibrationPattern[notification.type]);
    }
  }

  // تشغيل صوت الإشعار
  private playNotificationSound(type: Notification['type']): void {
    const audio = new Audio();
    const sounds = {
      info: '/sounds/notification-info.mp3',
      success: '/sounds/notification-success.mp3',
      warning: '/sounds/notification-warning.mp3',
      error: '/sounds/notification-error.mp3'
    };
    
    audio.src = sounds[type];
    audio.volume = 0.5;
    audio.play().catch(() => {
      // تجاهل الأخطاء إذا لم يتمكن من تشغيل الصوت
    });
  }

  // الحصول على الإشعارات
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // الحصول على الإشعارات غير المقروءة
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // تحديد الإشعار كمقروء
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  // تحديد جميع الإشعارات كمقروءة
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  // حذف الإشعار
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  // حذف جميع الإشعارات
  clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  // تحديث التفضيلات
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
  }

  // الحصول على التفضيلات
  getPreferences(): NotificationPreferences {
    return this.preferences;
  }

  // طلب إذن الإشعارات
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // حفظ الإشعارات في localStorage
  private saveNotifications(): void {
    localStorage.setItem('aden-live-notifications', JSON.stringify(this.notifications));
  }

  // تحميل الإشعارات من localStorage
  private loadNotifications(): void {
    const saved = localStorage.getItem('aden-live-notifications');
    if (saved) {
      try {
        this.notifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      } catch (error) {
        console.error('خطأ في تحميل الإشعارات:', error);
      }
    }
  }

  // حفظ التفضيلات في localStorage
  private savePreferences(): void {
    localStorage.setItem('aden-live-notification-preferences', JSON.stringify(this.preferences));
  }

  // تحميل التفضيلات من localStorage
  private loadPreferences(): void {
    const saved = localStorage.getItem('aden-live-notification-preferences');
    if (saved) {
      try {
        this.preferences = { ...this.preferences, ...JSON.parse(saved) };
      } catch (error) {
        console.error('خطأ في تحميل تفضيلات الإشعارات:', error);
      }
    }
  }

  // توليد معرف فريد
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// إنشاء مثيل واحد من الخدمة
export const notificationService = new NotificationService();

// تصدير الواجهة للاستخدام في المكونات
export default notificationService;
