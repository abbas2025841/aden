import { Job } from '@/types/job';
import { JobsDataCollector, JobsDataCollectorConfig } from './jobsDataCollector';

export interface AutoUpdaterConfig {
  enabled: boolean;
  interval: number; // in minutes
  maxRetries: number;
  retryDelay: number; // in seconds
  notifications: {
    enabled: boolean;
    onSuccess: boolean;
    onError: boolean;
    onNewJobs: boolean;
  };
}

export class JobsAutoUpdater {
  private collector: JobsDataCollector;
  private config: AutoUpdaterConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private retryCount = 0;
  private isRunning = false;
  private lastJobCount = 0;

  constructor(collectorConfig: JobsDataCollectorConfig, updaterConfig: AutoUpdaterConfig) {
    this.collector = new JobsDataCollector(collectorConfig);
    this.config = updaterConfig;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Auto updater is already running');
      return;
    }

    if (!this.config.enabled) {
      console.log('Auto updater is disabled');
      return;
    }

    this.isRunning = true;
    console.log('Starting jobs auto updater...');

    try {
      // بدء جمع البيانات
      await this.collector.startCollection();
      
      // جدولة التحديثات التلقائية
      this.scheduleUpdate();
      
      // إرسال إشعار النجاح
      if (this.config.notifications.enabled && this.config.notifications.onSuccess) {
        this.showNotification('تم بدء التحديث التلقائي للوظائف', 'success');
      }
    } catch (error) {
      console.error('Error starting auto updater:', error);
      this.handleError(error);
    }
  }

  stop(): void {
    if (!this.isRunning) {
      console.warn('Auto updater is not running');
      return;
    }

    this.isRunning = false;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.collector.stopCollection();
    console.log('Jobs auto updater stopped');
  }

  private scheduleUpdate(): void {
    if (!this.isRunning) return;

    this.intervalId = setInterval(async () => {
      try {
        await this.performUpdate();
        this.retryCount = 0; // إعادة تعيين عداد المحاولات عند النجاح
      } catch (error) {
        this.handleError(error);
      }
    }, this.config.interval * 60 * 1000);
  }

  private async performUpdate(): Promise<void> {
    console.log('Performing scheduled update...');
    
    const previousJobCount = this.collector.getJobs().length;
    
    // إعادة تشغيل جمع البيانات
    await this.collector.startCollection();
    
    const currentJobCount = this.collector.getJobs().length;
    const newJobsCount = currentJobCount - previousJobCount;
    
    if (newJobsCount > 0) {
      console.log(`Found ${newJobsCount} new jobs`);
      
      // إرسال إشعار الوظائف الجديدة
      if (this.config.notifications.enabled && this.config.notifications.onNewJobs) {
        this.showNotification(`تم العثور على ${newJobsCount} وظيفة جديدة`, 'info');
      }
    }
    
    this.lastJobCount = currentJobCount;
  }

  private handleError(error: any): void {
    console.error('Auto updater error:', error);
    
    this.retryCount++;
    
    if (this.retryCount <= this.config.maxRetries) {
      console.log(`Retrying in ${this.config.retryDelay} seconds... (${this.retryCount}/${this.config.maxRetries})`);
      
      setTimeout(() => {
        if (this.isRunning) {
          this.performUpdate().catch(err => this.handleError(err));
        }
      }, this.config.retryDelay * 1000);
    } else {
      console.error('Max retries reached. Stopping auto updater.');
      
      // إرسال إشعار الخطأ
      if (this.config.notifications.enabled && this.config.notifications.onError) {
        this.showNotification('فشل التحديث التلقائي للوظائف', 'error');
      }
      
      this.stop();
    }
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    // محاكاة إظهار الإشعار
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // يمكن إضافة منطق إظهار الإشعارات الفعلية هنا
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('تحديث الوظائف', {
          body: message,
          icon: '/favicon.ico'
        });
      }
    }
  }

  getStatus(): {
    isRunning: boolean;
    isEnabled: boolean;
    retryCount: number;
    lastUpdate: Date | null;
    totalJobs: number;
    nextUpdate: Date | null;
  } {
    const stats = this.collector.getStats();
    const nextUpdate = this.intervalId ? 
      new Date(Date.now() + this.config.interval * 60 * 1000) : null;

    return {
      isRunning: this.isRunning,
      isEnabled: this.config.enabled,
      retryCount: this.retryCount,
      lastUpdate: stats.lastUpdate,
      totalJobs: stats.totalJobs,
      nextUpdate
    };
  }

  updateConfig(newConfig: Partial<AutoUpdaterConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // إعادة تشغيل المحدث إذا كان يعمل
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  getJobs(): Job[] {
    return this.collector.getJobs();
  }

  async forceUpdate(): Promise<void> {
    if (!this.isRunning) {
      throw new Error('Auto updater is not running');
    }

    console.log('Forcing update...');
    await this.performUpdate();
  }
}

// إنشاء مثيل افتراضي
export const defaultAutoUpdater = new JobsAutoUpdater(
  {
    sources: ['jobsite1.com', 'jobsite2.com', 'jobsite3.com'],
    updateInterval: 30,
    maxJobs: 1000,
    filters: {
      categories: ['تقنية', 'مالية', 'تعليم', 'صحة'],
      locations: ['عدن', 'صنعاء', 'تعز', 'حضرموت'],
      minSalary: 200000
    }
  },
  {
    enabled: true,
    interval: 60, // ساعة واحدة
    maxRetries: 3,
    retryDelay: 30, // 30 ثانية
    notifications: {
      enabled: true,
      onSuccess: true,
      onError: true,
      onNewJobs: true
    }
  }
);
