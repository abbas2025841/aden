import { Job } from '@/types/job';

export interface JobsDataCollectorConfig {
  sources: string[];
  updateInterval: number; // in minutes
  maxJobs: number;
  filters: {
    categories: string[];
    locations: string[];
    minSalary?: number;
    maxSalary?: number;
  };
}

export class JobsDataCollector {
  private config: JobsDataCollectorConfig;
  private jobs: Job[] = [];
  private lastUpdate: Date | null = null;
  private isCollecting = false;

  constructor(config: JobsDataCollectorConfig) {
    this.config = config;
  }

  async startCollection(): Promise<void> {
    if (this.isCollecting) {
      console.warn('Jobs collection is already running');
      return;
    }

    this.isCollecting = true;
    console.log('Starting jobs data collection...');

    try {
      await this.collectJobs();
      this.scheduleNextCollection();
    } catch (error) {
      console.error('Error starting jobs collection:', error);
      this.isCollecting = false;
    }
  }

  stopCollection(): void {
    this.isCollecting = false;
    console.log('Jobs collection stopped');
  }

  private async collectJobs(): Promise<void> {
    try {
      const newJobs: Job[] = [];

      // محاكاة جمع البيانات من مصادر مختلفة
      for (const source of this.config.sources) {
        const sourceJobs = await this.collectFromSource(source);
        newJobs.push(...sourceJobs);
      }

      // تطبيق الفلاتر
      const filteredJobs = this.applyFilters(newJobs);

      // تحديث قائمة الوظائف
      this.jobs = this.mergeJobs(this.jobs, filteredJobs);
      this.lastUpdate = new Date();

      console.log(`Collected ${filteredJobs.length} new jobs`);
    } catch (error) {
      console.error('Error collecting jobs:', error);
      throw error;
    }
  }

  private async collectFromSource(source: string): Promise<Job[]> {
    // محاكاة جمع البيانات من مصدر معين
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockJobs: Job[] = [
          {
            id: `${source}-${Date.now()}-1`,
            title: 'مطور ويب',
            company: 'شركة تقنية',
            location: 'عدن',
            type: 'دوام كامل',
            salary: '500,000 - 800,000 ريال',
            description: 'نبحث عن مطور ويب ذو خبرة في React و Node.js',
            requirements: ['خبرة 2+ سنوات', 'معرفة React', 'معرفة Node.js'],
            benefits: ['راتب تنافسي', 'تأمين صحي', 'إجازة سنوية'],
            postedDate: new Date().toISOString(),
            category: 'تقنية',
            experience: '2-5 سنوات',
            education: 'بكالوريوس',
            skills: ['React', 'Node.js', 'JavaScript'],
            isRemote: false,
            isUrgent: false,
            isFeatured: true,
            contactEmail: 'hr@company.com',
            contactPhone: '+967-123-456-789'
          },
          {
            id: `${source}-${Date.now()}-2`,
            title: 'محاسب',
            company: 'مؤسسة مالية',
            location: 'عدن',
            type: 'دوام كامل',
            salary: '300,000 - 500,000 ريال',
            description: 'نبحث عن محاسب ذو خبرة في المحاسبة المالية',
            requirements: ['خبرة 3+ سنوات', 'معرفة المحاسبة', 'معرفة البرامج المحاسبية'],
            benefits: ['راتب تنافسي', 'تأمين صحي'],
            postedDate: new Date().toISOString(),
            category: 'مالية',
            experience: '3-7 سنوات',
            education: 'بكالوريوس',
            skills: ['المحاسبة', 'Excel', 'QuickBooks'],
            isRemote: false,
            isUrgent: true,
            isFeatured: false,
            contactEmail: 'finance@company.com',
            contactPhone: '+967-123-456-790'
          }
        ];

        resolve(mockJobs);
      }, 1000);
    });
  }

  private applyFilters(jobs: Job[]): Job[] {
    return jobs.filter(job => {
      // فحص الفئة
      if (this.config.filters.categories.length > 0 && 
          !this.config.filters.categories.includes(job.category)) {
        return false;
      }

      // فحص الموقع
      if (this.config.filters.locations.length > 0 && 
          !this.config.filters.locations.includes(job.location)) {
        return false;
      }

      // فحص الراتب (إذا كان متوفراً)
      if (job.salary && this.config.filters.minSalary) {
        const salaryMatch = job.salary.match(/(\d+)/);
        if (salaryMatch) {
          const salary = parseInt(salaryMatch[1]);
          if (salary < this.config.filters.minSalary) {
            return false;
          }
        }
      }

      return true;
    });
  }

  private mergeJobs(existingJobs: Job[], newJobs: Job[]): Job[] {
    const jobMap = new Map<string, Job>();

    // إضافة الوظائف الموجودة
    existingJobs.forEach(job => {
      jobMap.set(job.id, job);
    });

    // إضافة الوظائف الجديدة
    newJobs.forEach(job => {
      if (!jobMap.has(job.id)) {
        jobMap.set(job.id, job);
      }
    });

    // تحويل إلى مصفوفة وترتيب حسب التاريخ
    const allJobs = Array.from(jobMap.values());
    allJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

    // تحديد الحد الأقصى للوظائف
    return allJobs.slice(0, this.config.maxJobs);
  }

  private scheduleNextCollection(): void {
    if (!this.isCollecting) return;

    setTimeout(() => {
      if (this.isCollecting) {
        this.collectJobs().then(() => {
          this.scheduleNextCollection();
        }).catch(error => {
          console.error('Error in scheduled collection:', error);
          this.scheduleNextCollection();
        });
      }
    }, this.config.updateInterval * 60 * 1000);
  }

  getJobs(): Job[] {
    return [...this.jobs];
  }

  getLastUpdate(): Date | null {
    return this.lastUpdate;
  }

  getStats(): {
    totalJobs: number;
    lastUpdate: Date | null;
    isCollecting: boolean;
    sources: string[];
  } {
    return {
      totalJobs: this.jobs.length,
      lastUpdate: this.lastUpdate,
      isCollecting: this.isCollecting,
      sources: this.config.sources
    };
  }

  updateConfig(newConfig: Partial<JobsDataCollectorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// إنشاء مثيل افتراضي
export const defaultJobsCollector = new JobsDataCollector({
  sources: ['jobsite1.com', 'jobsite2.com', 'jobsite3.com'],
  updateInterval: 30, // 30 دقيقة
  maxJobs: 1000,
  filters: {
    categories: ['تقنية', 'مالية', 'تعليم', 'صحة'],
    locations: ['عدن', 'صنعاء', 'تعز', 'حضرموت'],
    minSalary: 200000
  }
});
