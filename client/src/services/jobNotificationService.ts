// خدمة إشعارات الوظائف الجديدة
import { ScrapedJob } from './jobScrapingService';

export interface JobNotification {
  id: string;
  jobId: string;
  job: ScrapedJob;
  timestamp: Date;
  isRead: boolean;
  type: 'new_job' | 'urgent_job' | 'matching_job';
  message: string;
}

export class JobNotificationService {
  private notifications: JobNotification[] = [];
  private subscribers: ((notifications: JobNotification[]) => void)[] = [];
  private lastJobIds: Set<string> = new Set();

  // الاشتراك في الإشعارات
  subscribe(callback: (notifications: JobNotification[]) => void) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // إشعار المشتركين
  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback([...this.notifications]);
      } catch (error) {
        console.error('Error notifying subscriber:', error);
      }
    });
  }

  // إضافة إشعار جديد
  private addNotification(job: ScrapedJob, type: JobNotification['type'], message: string) {
    const notification: JobNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      jobId: job.id,
      job,
      timestamp: new Date(),
      isRead: false,
      type,
      message
    };

    this.notifications.unshift(notification);
    
    // الاحتفاظ بآخر 50 إشعار فقط
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifySubscribers();
    this.showBrowserNotification(notification);
  }

  // إظهار إشعار المتصفح
  private showBrowserNotification(notification: JobNotification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.message, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.jobId,
        requireInteraction: false,
        silent: false
      });
    }
  }

  // طلب إذن الإشعارات
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // فحص الوظائف الجديدة
  checkForNewJobs(newJobs: ScrapedJob[]) {
    const currentJobIds = new Set(newJobs.map(job => job.id));
    const newJobIds = new Set([...currentJobIds].filter(id => !this.lastJobIds.has(id)));

    // إضافة إشعارات للوظائف الجديدة
    newJobs.forEach(job => {
      if (newJobIds.has(job.id)) {
        let message = '';
        let type: JobNotification['type'] = 'new_job';

        // تحديد نوع الإشعار
        if (job.title.toLowerCase().includes('عاجل') || 
            job.title.toLowerCase().includes('urgent') ||
            job.title.toLowerCase().includes('فوري')) {
          type = 'urgent_job';
          message = `🚨 وظيفة عاجلة: ${job.title} في ${job.company}`;
        } else if (this.isMatchingJob(job)) {
          type = 'matching_job';
          message = `🎯 وظيفة مناسبة لك: ${job.title} في ${job.company}`;
        } else {
          message = `✨ وظيفة جديدة: ${job.title} في ${job.company}`;
        }

        this.addNotification(job, type, message);
      }
    });

    // تحديث قائمة الوظائف السابقة
    this.lastJobIds = currentJobIds;
  }

  // فحص إذا كانت الوظيفة مناسبة للمستخدم
  private isMatchingJob(job: ScrapedJob): boolean {
    // يمكن تحسين هذا المنطق بناءً على تفضيلات المستخدم
    const preferredCategories = ['technical', 'engineering', 'medical', 'education'];
    const preferredKeywords = ['مطور', 'مهندس', 'طبيب', 'مدرس', 'developer', 'engineer', 'doctor', 'teacher'];
    
    const titleLower = job.title.toLowerCase();
    const hasPreferredCategory = preferredCategories.includes(job.category);
    const hasPreferredKeyword = preferredKeywords.some(keyword => 
      titleLower.includes(keyword.toLowerCase())
    );

    return hasPreferredCategory || hasPreferredKeyword;
  }

  // الحصول على جميع الإشعارات
  getNotifications(): JobNotification[] {
    return [...this.notifications];
  }

  // الحصول على الإشعارات غير المقروءة
  getUnreadNotifications(): JobNotification[] {
    return this.notifications.filter(notification => !notification.isRead);
  }

  // عدد الإشعارات غير المقروءة
  getUnreadCount(): number {
    return this.notifications.filter(notification => !notification.isRead).length;
  }

  // تحديد الإشعار كمقروء
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifySubscribers();
    }
  }

  // تحديد جميع الإشعارات كمقروءة
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.notifySubscribers();
  }

  // حذف إشعار
  deleteNotification(notificationId: string) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.notifySubscribers();
    }
  }

  // حذف جميع الإشعارات
  clearAllNotifications() {
    this.notifications = [];
    this.notifySubscribers();
  }

  // الحصول على إحصائيات الإشعارات
  getNotificationStats() {
    const total = this.notifications.length;
    const unread = this.notifications.filter(n => !n.isRead).length;
    const byType = this.notifications.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      unread,
      read: total - unread,
      byType
    };
  }
}

export const jobNotificationService = new JobNotificationService();
