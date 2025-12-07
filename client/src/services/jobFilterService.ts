// خدمة فلاتر البحث المحسنة للوظائف
import { ScrapedJob } from './jobScrapingService';

export interface JobFilters {
  searchQuery: string;
  category: string;
  location: string;
  jobType: string;
  salaryRange: {
    min: number;
    max: number;
  };
  postedDate: string;
  company: string;
  source: string;
  isUrgent: boolean;
  isRemote: boolean;
  experienceLevel: string;
  educationLevel: string;
}

export interface SortOptions {
  field: 'postedDate' | 'title' | 'company' | 'location' | 'category';
  direction: 'asc' | 'desc';
}

export class JobFilterService {
  private defaultFilters: JobFilters = {
    searchQuery: '',
    category: 'all',
    location: 'all',
    jobType: 'all',
    salaryRange: { min: 0, max: 1000000 },
    postedDate: 'all',
    company: '',
    source: 'all',
    isUrgent: false,
    isRemote: false,
    experienceLevel: 'all',
    educationLevel: 'all'
  };

  // تطبيق الفلاتر على الوظائف
  filterJobs(jobs: ScrapedJob[], filters: Partial<JobFilters> = {}): ScrapedJob[] {
    const activeFilters = { ...this.defaultFilters, ...filters };
    
    return jobs.filter(job => {
      // فلتر البحث النصي
      if (activeFilters.searchQuery) {
        const searchLower = activeFilters.searchQuery.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          (job.description && job.description.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // فلتر الفئة
      if (activeFilters.category !== 'all' && job.category !== activeFilters.category) {
        return false;
      }

      // فلتر الموقع
      if (activeFilters.location !== 'all' && !job.location.toLowerCase().includes(activeFilters.location.toLowerCase())) {
        return false;
      }

      // فلتر نوع الوظيفة
      if (activeFilters.jobType !== 'all' && job.type !== activeFilters.jobType) {
        return false;
      }

      // فلتر الراتب
      if (job.salary) {
        const salary = this.extractSalary(job.salary);
        if (salary < activeFilters.salaryRange.min || salary > activeFilters.salaryRange.max) {
          return false;
        }
      }

      // فلتر تاريخ النشر
      if (activeFilters.postedDate !== 'all') {
        const jobDate = new Date(job.postedDate);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (activeFilters.postedDate) {
          case 'today':
            if (daysDiff > 0) return false;
            break;
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
          case '3months':
            if (daysDiff > 90) return false;
            break;
        }
      }

      // فلتر الشركة
      if (activeFilters.company && !job.company.toLowerCase().includes(activeFilters.company.toLowerCase())) {
        return false;
      }

      // فلتر المصدر
      if (activeFilters.source !== 'all' && job.source !== activeFilters.source) {
        return false;
      }

      // فلتر الوظائف العاجلة
      if (activeFilters.isUrgent) {
        const isUrgent = job.title.toLowerCase().includes('عاجل') ||
                        job.title.toLowerCase().includes('urgent') ||
                        job.title.toLowerCase().includes('فوري');
        if (!isUrgent) return false;
      }

      // فلتر الوظائف عن بُعد
      if (activeFilters.isRemote) {
        const isRemote = job.title.toLowerCase().includes('remote') ||
                        job.title.toLowerCase().includes('عن بُعد') ||
                        job.location.toLowerCase().includes('remote');
        if (!isRemote) return false;
      }

      return true;
    });
  }

  // ترتيب الوظائف
  sortJobs(jobs: ScrapedJob[], sortOptions: SortOptions): ScrapedJob[] {
    return [...jobs].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOptions.field) {
        case 'postedDate':
          aValue = new Date(a.postedDate).getTime();
          bValue = new Date(b.postedDate).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOptions.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  // استخراج الراتب من النص
  private extractSalary(salaryText: string): number {
    const numbers = salaryText.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return parseInt(numbers[0]);
    }
    return 0;
  }

  // الحصول على الفلاتر الافتراضية
  getDefaultFilters(): JobFilters {
    return { ...this.defaultFilters };
  }

  // الحصول على خيارات الفلترة
  getFilterOptions() {
    return {
      categories: [
        { value: 'all', label: 'جميع الفئات' },
        { value: 'medical', label: '🏥 طبية وصحية' },
        { value: 'education', label: '🎓 تعليمية وأكاديمية' },
        { value: 'technical', label: '💻 تقنية وتكنولوجيا' },
        { value: 'engineering', label: '🔧 هندسية' },
        { value: 'finance', label: '💰 مالية ومحاسبية' },
        { value: 'administration', label: '📋 إدارية وإشرافية' },
        { value: 'sales', label: '💼 تجارية وتسويقية' },
        { value: 'security', label: '🛡️ أمنية وحماية' },
        { value: 'service', label: '🔧 خدمية وعمالية' },
        { value: 'humanitarian', label: '🤝 إنسانية وتنموية' },
        { value: 'legal', label: '⚖️ قانونية' },
        { value: 'media', label: '📺 إعلامية واتصالات' },
        { value: 'other', label: '📌 أخرى' }
      ],
      locations: [
        { value: 'all', label: 'جميع المواقع' },
        { value: 'عدن', label: 'عدن' },
        { value: 'صنعاء', label: 'صنعاء' },
        { value: 'تعز', label: 'تعز' },
        { value: 'الحديدة', label: 'الحديدة' },
        { value: 'حجة', label: 'حجة' },
        { value: 'إب', label: 'إب' },
        { value: 'ذمار', label: 'ذمار' },
        { value: 'مأرب', label: 'مأرب' },
        { value: 'شبوة', label: 'شبوة' },
        { value: 'المكلا', label: 'المكلا' },
        { value: 'remote', label: 'عن بُعد' }
      ],
      jobTypes: [
        { value: 'all', label: 'جميع الأنواع' },
        { value: 'full-time', label: 'دوام كامل' },
        { value: 'part-time', label: 'دوام جزئي' },
        { value: 'contract', label: 'عقد' },
        { value: 'internship', label: 'تدريب' }
      ],
      postedDates: [
        { value: 'all', label: 'جميع التواريخ' },
        { value: 'today', label: 'اليوم' },
        { value: 'week', label: 'آخر أسبوع' },
        { value: 'month', label: 'آخر شهر' },
        { value: '3months', label: 'آخر 3 أشهر' }
      ],
      sources: [
        { value: 'all', label: 'جميع المصادر' },
        { value: 'YemenHR', label: 'YemenHR' },
        { value: 'Tanqeeb', label: 'Tanqeeb' },
        { value: 'AdenHR', label: 'AdenHR' },
        { value: 'OpenSooq', label: 'OpenSooq' },
        { value: 'Tenders of Yemen', label: 'Tenders of Yemen' },
        { value: 'Telegram', label: 'Telegram' }
      ],
      experienceLevels: [
        { value: 'all', label: 'جميع المستويات' },
        { value: 'entry', label: 'مبتدئ (0-2 سنة)' },
        { value: 'mid', label: 'متوسط (2-5 سنوات)' },
        { value: 'senior', label: 'خبير (5+ سنوات)' }
      ],
      educationLevels: [
        { value: 'all', label: 'جميع المؤهلات' },
        { value: 'high-school', label: 'ثانوي' },
        { value: 'diploma', label: 'دبلوم' },
        { value: 'bachelor', label: 'بكالوريوس' },
        { value: 'master', label: 'ماجستير' },
        { value: 'phd', label: 'دكتوراه' }
      ],
      sortOptions: [
        { value: 'postedDate-desc', label: 'الأحدث أولاً' },
        { value: 'postedDate-asc', label: 'الأقدم أولاً' },
        { value: 'title-asc', label: 'اسم الوظيفة (أ-ي)' },
        { value: 'title-desc', label: 'اسم الوظيفة (ي-أ)' },
        { value: 'company-asc', label: 'اسم الشركة (أ-ي)' },
        { value: 'company-desc', label: 'اسم الشركة (ي-أ)' },
        { value: 'location-asc', label: 'الموقع (أ-ي)' },
        { value: 'location-desc', label: 'الموقع (ي-أ)' }
      ]
    };
  }

  // تحليل خيارات الترتيب
  parseSortOption(sortValue: string): SortOptions {
    const [field, direction] = sortValue.split('-');
    return {
      field: field as SortOptions['field'],
      direction: direction as SortOptions['direction']
    };
  }

  // الحصول على إحصائيات الفلترة
  getFilterStats(jobs: ScrapedJob[], filters: Partial<JobFilters> = {}): {
    total: number;
    filtered: number;
    byCategory: Record<string, number>;
    byLocation: Record<string, number>;
    byType: Record<string, number>;
    bySource: Record<string, number>;
  } {
    const filteredJobs = this.filterJobs(jobs, filters);
    
    return {
      total: jobs.length,
      filtered: filteredJobs.length,
      byCategory: this.groupBy(jobs, 'category'),
      byLocation: this.groupBy(jobs, 'location'),
      byType: this.groupBy(jobs, 'type'),
      bySource: this.groupBy(jobs, 'source')
    };
  }

  // تجميع الوظائف حسب خاصية
  private groupBy(jobs: ScrapedJob[], property: keyof ScrapedJob): Record<string, number> {
    return jobs.reduce((acc, job) => {
      const value = job[property] as string;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const jobFilterService = new JobFilterService();
