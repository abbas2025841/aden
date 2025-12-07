// خدمة الإشعارات الذكية
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  category: 'service' | 'emergency' | 'update' | 'reminder' | 'promotion';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
  actions?: NotificationAction[];
  scheduledFor?: Date;
  expiresAt?: Date;
  read: boolean;
  createdAt: Date;
  userId?: string;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  style: 'primary' | 'secondary' | 'danger';
}

export interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    service: boolean;
    emergency: boolean;
    update: boolean;
    reminder: boolean;
    promotion: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  frequency: 'immediate' | 'hourly' | 'daily';
}

export interface SmartNotificationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
  priority: number;
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private preferences: NotificationPreferences;
  private smartRules: SmartNotificationRule[] = [];
  private subscribers: ((notifications: Notification[]) => void)[] = [];

  private constructor() {
    this.preferences = this.loadPreferences();
    this.smartRules = this.loadSmartRules();
    this.notifications = this.loadNotifications();
    this.initializeSmartNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // الاشتراك في التحديثات
  subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.push(callback);
    callback(this.notifications);
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // إرسال إشعار جديد
  async sendNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<string> {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      read: false,
      createdAt: new Date()
    };

    // تطبيق القواعد الذكية
    const processedNotification = await this.applySmartRules(newNotification);
    
    // التحقق من التفضيلات
    if (this.shouldSendNotification(processedNotification)) {
      this.notifications.unshift(processedNotification);
      this.saveNotifications();
      this.notifySubscribers();
      
      // إرسال إشعار فوري إذا كان عاجلاً
      if (processedNotification.priority === 'urgent' || processedNotification.category === 'emergency') {
        this.showBrowserNotification(processedNotification);
      }
    }

    return processedNotification.id;
  }

  // تطبيق القواعد الذكية
  private async applySmartRules(notification: Notification): Promise<Notification> {
    let processedNotification = { ...notification };

    for (const rule of this.smartRules.filter(r => r.enabled)) {
      if (this.evaluateCondition(rule.condition, processedNotification)) {
        processedNotification = await this.executeAction(rule.action, processedNotification);
      }
    }

    return processedNotification;
  }

  // تقييم الشرط
  private evaluateCondition(condition: string, notification: Notification): boolean {
    try {
      // محاكاة تقييم الشروط (في التطبيق الحقيقي، استخدم محرك قواعد أكثر تطوراً)
      const conditions = {
        'isEmergency': notification.category === 'emergency',
        'isHighPriority': notification.priority === 'high' || notification.priority === 'urgent',
        'isServiceUpdate': notification.category === 'service' && notification.type === 'info',
        'isPromotion': notification.category === 'promotion',
        'isQuietHours': this.isQuietHours()
      };

      return conditions[condition as keyof typeof conditions] || false;
    } catch (error) {
      console.error('خطأ في تقييم الشرط:', error);
      return false;
    }
  }

  // تنفيذ الإجراء
  private async executeAction(action: string, notification: Notification): Promise<Notification> {
    const actions = {
      'escalatePriority': () => ({
        ...notification,
        priority: (notification.priority === 'low' ? 'medium' : 
                 notification.priority === 'medium' ? 'high' : 'urgent') as 'low' | 'medium' | 'high' | 'urgent'
      }),
      'addUrgentFlag': () => ({
        ...notification,
        title: `🚨 ${notification.title}`,
        priority: 'urgent' as const
      }),
      'scheduleForLater': () => ({
        ...notification,
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000) // بعد ساعتين
      }),
      'addActionButton': () => ({
        ...notification,
        actions: [
          ...(notification.actions || []),
          {
            id: 'view_details',
            label: 'عرض التفاصيل',
            action: 'view_details',
            style: 'primary' as const
          }
        ]
      })
    };

    return actions[action as keyof typeof actions]?.() || { ...notification, priority: 'medium' as const };
  }

  // التحقق من ساعات الهدوء
  private isQuietHours(): boolean {
    if (!this.preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const start = this.preferences.quietHours.start;
    const end = this.preferences.quietHours.end;
    
    return currentTime >= start && currentTime <= end;
  }

  // التحقق من إرسال الإشعار
  private shouldSendNotification(notification: Notification): boolean {
    // التحقق من التفضيلات العامة
    if (!this.preferences.pushNotifications) return false;
    
    // التحقق من فئة الإشعار
    if (!this.preferences.categories[notification.category]) return false;
    
    // التحقق من ساعات الهدوء (ما عدا الطوارئ)
    if (this.isQuietHours() && notification.category !== 'emergency') {
      return false;
    }
    
    // التحقق من انتهاء الصلاحية
    if (notification.expiresAt && new Date() > notification.expiresAt) {
      return false;
    }
    
    return true;
  }

  // عرض إشعار المتصفح
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });

      browserNotification.onclick = () => {
        window.focus();
        this.markAsRead(notification.id);
        browserNotification.close();
      };

      // إغلاق الإشعار تلقائياً بعد 5 ثوانٍ
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  // طلب إذن الإشعارات
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // الحصول على الإشعارات
  getNotifications(limit?: number): Notification[] {
    return limit ? this.notifications.slice(0, limit) : this.notifications;
  }

  // الحصول على الإشعارات غير المقروءة
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // الحصول على عدد الإشعارات غير المقروءة
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // تحديد الإشعار كمقروء
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifySubscribers();
    }
  }

  // تحديد جميع الإشعارات كمقروءة
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifySubscribers();
  }

  // حذف إشعار
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifySubscribers();
  }

  // حذف جميع الإشعارات
  clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifySubscribers();
  }

  // الحصول على التفضيلات
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // تحديث التفضيلات
  updatePreferences(preferences: Partial<NotificationPreferences>): void {
    this.preferences = { ...this.preferences, ...preferences };
    this.savePreferences();
  }

  // الحصول على القواعد الذكية
  getSmartRules(): SmartNotificationRule[] {
    return [...this.smartRules];
  }

  // إضافة قاعدة ذكية
  addSmartRule(rule: Omit<SmartNotificationRule, 'id'>): void {
    const newRule: SmartNotificationRule = {
      ...rule,
      id: this.generateId()
    };
    this.smartRules.push(newRule);
    this.saveSmartRules();
  }

  // تحديث قاعدة ذكية
  updateSmartRule(id: string, updates: Partial<SmartNotificationRule>): void {
    const index = this.smartRules.findIndex(r => r.id === id);
    if (index !== -1) {
      this.smartRules[index] = { ...this.smartRules[index], ...updates };
      this.saveSmartRules();
    }
  }

  // حذف قاعدة ذكية
  deleteSmartRule(id: string): void {
    this.smartRules = this.smartRules.filter(r => r.id !== id);
    this.saveSmartRules();
  }

  // تهيئة الإشعارات الذكية
  private initializeSmartNotifications(): void {
    // إضافة قواعد افتراضية
    if (this.smartRules.length === 0) {
      this.addSmartRule({
        name: 'تصعيد الطوارئ',
        condition: 'isEmergency',
        action: 'addUrgentFlag',
        enabled: true,
        priority: 1
      });

      this.addSmartRule({
        name: 'إضافة أزرار للخدمات',
        condition: 'isServiceUpdate',
        action: 'addActionButton',
        enabled: true,
        priority: 2
      });

      this.addSmartRule({
        name: 'تأجيل العروض في ساعات الهدوء',
        condition: 'isPromotion',
        action: 'scheduleForLater',
        enabled: true,
        priority: 3
      });
    }
  }

  // إشعار المشتركين
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  // توليد معرف فريد
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // تحميل الإشعارات من التخزين المحلي
  private loadNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem('aden_notifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        return notifications.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          scheduledFor: n.scheduledFor ? new Date(n.scheduledFor) : undefined,
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined
        }));
      }
    } catch (error) {
      console.error('خطأ في تحميل الإشعارات:', error);
    }
    return [];
  }

  // حفظ الإشعارات في التخزين المحلي
  private saveNotifications(): void {
    try {
      localStorage.setItem('aden_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('خطأ في حفظ الإشعارات:', error);
    }
  }

  // تحميل التفضيلات من التخزين المحلي
  private loadPreferences(): NotificationPreferences {
    try {
      const stored = localStorage.getItem('aden_notification_preferences');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('خطأ في تحميل التفضيلات:', error);
    }
    
    // تفضيلات افتراضية
    return {
      pushNotifications: true,
      emailNotifications: false,
      smsNotifications: false,
      categories: {
        service: true,
        emergency: true,
        update: true,
        reminder: true,
        promotion: false
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      },
      frequency: 'immediate'
    };
  }

  // حفظ التفضيلات في التخزين المحلي
  private savePreferences(): void {
    try {
      localStorage.setItem('aden_notification_preferences', JSON.stringify(this.preferences));
    } catch (error) {
      console.error('خطأ في حفظ التفضيلات:', error);
    }
  }

  // تحميل القواعد الذكية من التخزين المحلي
  private loadSmartRules(): SmartNotificationRule[] {
    try {
      const stored = localStorage.getItem('aden_smart_rules');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('خطأ في تحميل القواعد الذكية:', error);
    }
    return [];
  }

  // حفظ القواعد الذكية في التخزين المحلي
  private saveSmartRules(): void {
    try {
      localStorage.setItem('aden_smart_rules', JSON.stringify(this.smartRules));
    } catch (error) {
      console.error('خطأ في حفظ القواعد الذكية:', error);
    }
  }
}

// تصدير المثيل الوحيد
export const notificationService = NotificationService.getInstance();