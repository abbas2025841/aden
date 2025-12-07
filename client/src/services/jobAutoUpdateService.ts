// خدمة التحديث التلقائي للوظائف
import { jobScrapingService, JobCategory } from './jobScrapingService';
import { jobNotificationService } from './jobNotificationService';

export class JobAutoUpdateService {
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false;
  private updateCallbacks: ((categories: JobCategory[]) => void)[] = [];

  // بدء التحديث التلقائي
  startAutoUpdate(intervalMinutes: number = 30) {
    if (this.updateInterval) {
      this.stopAutoUpdate();
    }

    this.updateInterval = setInterval(async () => {
      await this.updateJobs();
    }, intervalMinutes * 60 * 1000);

    console.log(`🔄 تم بدء التحديث التلقائي للوظائف كل ${intervalMinutes} دقيقة`);
  }

  // إيقاف التحديث التلقائي
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('⏹️ تم إيقاف التحديث التلقائي للوظائف');
    }
  }

  // تحديث الوظائف
  async updateJobs(): Promise<JobCategory[]> {
    if (this.isUpdating) {
      console.log('⏳ التحديث قيد التشغيل بالفعل...');
      return [];
    }

    this.isUpdating = true;
    console.log('🔄 بدء تحديث الوظائف...');

    try {
      const categories = await jobScrapingService.updateJobs();
      
      // فحص الوظائف الجديدة وإرسال الإشعارات
      const allJobs = categories.flatMap(category => category.jobs);
      jobNotificationService.checkForNewJobs(allJobs);
      
      // إشعار جميع المشتركين بالتحديث
      this.updateCallbacks.forEach(callback => {
        try {
          callback(categories);
        } catch (error) {
          console.error('خطأ في callback التحديث:', error);
        }
      });

      console.log(`✅ تم تحديث ${categories.length} فئة وظائف بنجاح`);
      return categories;
    } catch (error) {
      console.error('❌ خطأ في تحديث الوظائف:', error);
      return [];
    } finally {
      this.isUpdating = false;
    }
  }

  // الاشتراك في التحديثات
  subscribe(callback: (categories: JobCategory[]) => void) {
    this.updateCallbacks.push(callback);
    
    // إرجاع دالة إلغاء الاشتراك
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }

  // الحصول على حالة التحديث
  getUpdateStatus() {
    return {
      isUpdating: this.isUpdating,
      isAutoUpdateActive: this.updateInterval !== null,
      subscribersCount: this.updateCallbacks.length
    };
  }

  // تحديث فوري
  async forceUpdate(): Promise<JobCategory[]> {
    console.log('🚀 بدء تحديث فوري للوظائف...');
    return await this.updateJobs();
  }
}

export const jobAutoUpdateService = new JobAutoUpdateService();
