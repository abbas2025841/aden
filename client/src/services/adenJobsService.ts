import { mockJobs } from '@/data/jobs-enhanced';
import type { Job } from '@/data/jobs-enhanced';

// خدمة الوظائف المحسنة لعدن
export class AdenJobsService {
  private static instance: AdenJobsService;
  private jobs: Job[] = [];
  private subscribers: Array<(jobs: Job[]) => void> = [];

  private constructor() {
    this.initializeJobs();
  }

  public static getInstance(): AdenJobsService {
    if (!AdenJobsService.instance) {
      AdenJobsService.instance = new AdenJobsService();
    }
    return AdenJobsService.instance;
  }

  private initializeJobs() {
    // إضافة وظائف إضافية خاصة بعدن
    const adenSpecificJobs: Job[] = [
      {
        id: "aden-001",
        title: "معلم لغة إنجليزية - مدارس عدن",
        category: "تعليم",
        company: "مدارس عدن النموذجية",
        companyName: "مدارس عدن النموذجية",
        location: {
          city: "عدن",
          district: "كريتر",
          address: "شارع الجمهورية، مقابل البنك المركزي",
        },
        type: "دوام كامل",
        jobType: "دوام كامل",
        salary: {
          min: 180000,
          max: 280000,
          currency: "YER",
          isNegotiable: true,
          includesBenefits: true,
        },
        description: "مطلوب معلم لغة إنجليزية للمرحلة الثانوية في إحدى أفضل مدارس عدن. الوظيفة تتطلب خبرة في التدريس وإجادة كاملة للغة الإنجليزية.",
        requirements: [
          "بكالوريوس في اللغة الإنجليزية أو التربية",
          "خبرة لا تقل عن 3 سنوات في التدريس",
          "إجادة كاملة للغة الإنجليزية تحدثاً وكتابة",
          "مهارات تواصل ممتازة مع الطلاب",
          "القدرة على استخدام التقنيات التعليمية الحديثة",
        ],
        benefits: [
          "راتب تنافسي مع بدلات",
          "تأمين صحي شامل",
          "إجازات مدفوعة الأجر",
          "بيئة عمل محترمة",
          "فرص تطوير مهني",
        ],
        responsibilities: [
          "تدريس اللغة الإنجليزية للمرحلة الثانوية",
          "إعداد الخطط التعليمية",
          "تقييم أداء الطلاب",
          "المشاركة في الأنشطة المدرسية",
        ],
        contact: {
          phone: "+967-777-111222",
          whatsapp: "+967-777-111222",
          email: "hr@adenmodel.edu.ye",
        },
        postedDate: "2024-01-16T08:00:00Z",
        experience: "متوسط",
        experienceLevel: "متوسط",
        isFeatured: true,
        isUrgent: false,
        isRemote: false,
        workingHours: "7:30 ص - 2:30 م",
        gender: "غير محدد",
        education: "بكالوريوس",
        ageRange: { min: 25, max: 45 },
        languages: ["العربية", "الإنجليزية"],
        views: 156,
        applicants: 18,
        isActive: true,
        tags: ["تدريس", "إنجليزية", "عدن", "مدارس"],
        featured: true,
      },
      {
        id: "aden-002",
        title: "فني صيانة أجهزة طبية - مستشفى عدن",
        category: "صحة وطب",
        company: "مستشفى عدن التخصصي",
        companyName: "مستشفى عدن التخصصي",
        location: {
          city: "عدن",
          district: "خور مكسر",
          address: "منطقة المطار، بجانب مستشفى الجمهورية",
        },
        type: "دوام كامل",
        jobType: "دوام كامل",
        salary: {
          min: 220000,
          max: 350000,
          currency: "YER",
          isNegotiable: true,
          includesBenefits: true,
        },
        description: "مطلوب فني متخصص في صيانة الأجهزة الطبية للعمل في مستشفى عدن التخصصي. يجب أن يكون لديه خبرة في التعامل مع أحدث الأجهزة الطبية.",
        requirements: [
          "دبلوم في الهندسة الطبية أو الإلكترونيات",
          "خبرة لا تقل عن 4 سنوات في صيانة الأجهزة الطبية",
          "معرفة بأنظمة التشغيل والصيانة الوقائية",
          "شهادات في السلامة المهنية",
          "القدرة على العمل تحت الضغط",
        ],
        benefits: [
          "راتب ممتاز مع بدلات",
          "تأمين صحي شامل للعائلة",
          "إجازات سنوية مدفوعة",
          "بيئة عمل آمنة ومجهزة",
          "فرص تدريب وتطوير مستمرة",
        ],
        responsibilities: [
          "صيانة وإصلاح الأجهزة الطبية",
          "إجراء الفحوصات الدورية",
          "تسجيل تقارير الصيانة",
          "التدريب على استخدام الأجهزة الجديدة",
        ],
        contact: {
          phone: "+967-777-222333",
          whatsapp: "+967-777-222333",
          email: "hr@adenhospital.com",
        },
        postedDate: "2024-01-15T10:00:00Z",
        experience: "متقدم",
        experienceLevel: "متقدم",
        isFeatured: true,
        isUrgent: true,
        isRemote: false,
        workingHours: "8:00 ص - 4:00 م",
        gender: "غير محدد",
        education: "دبلوم",
        ageRange: { min: 28, max: 50 },
        languages: ["العربية", "الإنجليزية"],
        views: 89,
        applicants: 12,
        isActive: true,
        tags: ["صيانة", "أجهزة طبية", "عدن", "مستشفى"],
        featured: true,
      },
      {
        id: "aden-003",
        title: "مهندس برمجيات - شركة تقنية",
        category: "تكنولوجيا المعلومات",
        company: "شركة عدن التقنية",
        companyName: "شركة عدن التقنية",
        location: {
          city: "عدن",
          district: "التواهي",
          address: "مبنى التقنية، الطابق الثالث",
        },
        type: "دوام كامل",
        jobType: "دوام كامل",
        salary: {
          min: 300000,
          max: 500000,
          currency: "YER",
          isNegotiable: true,
          includesBenefits: true,
        },
        description: "مطلوب مهندس برمجيات للعمل على تطوير تطبيقات ويب وموبايل. خبرة في React, Node.js, و قواعد البيانات.",
        requirements: [
          "بكالوريوس في علوم الحاسوب أو هندسة البرمجيات",
          "خبرة لا تقل عن 2 سنوات في تطوير التطبيقات",
          "إجادة React, Node.js, JavaScript",
          "معرفة بقواعد البيانات SQL",
          "خبرة في Git و DevOps",
        ],
        benefits: [
          "راتب تنافسي دولياً",
          "تأمين صحي شامل",
          "إجازات مرنة",
          "بيئة عمل إبداعية",
          "فرص عمل عن بُعد",
        ],
        responsibilities: [
          "تطوير تطبيقات ويب وموبايل",
          "كتابة كود نظيف ومُوثق",
          "المشاركة في مراجعة الكود",
          "التعاون مع فريق التصميم",
        ],
        contact: {
          phone: "+967-777-333444",
          whatsapp: "+967-777-333444",
          email: "careers@adentech.com",
        },
        postedDate: "2024-01-14T14:00:00Z",
        experience: "متوسط",
        experienceLevel: "متوسط",
        isFeatured: false,
        isUrgent: false,
        isRemote: true,
        workingHours: "9:00 ص - 5:00 م",
        gender: "غير محدد",
        education: "بكالوريوس",
        ageRange: { min: 22, max: 35 },
        languages: ["العربية", "الإنجليزية"],
        views: 234,
        applicants: 45,
        isActive: true,
        tags: ["برمجة", "React", "Node.js", "تطوير"],
        featured: false,
      },
      {
        id: "aden-004",
        title: "محاسب - شركة تجارية",
        category: "مالية ومحاسبة",
        company: "شركة عدن التجارية",
        companyName: "شركة عدن التجارية",
        location: {
          city: "عدن",
          district: "المعلا",
          address: "شارع الملكة أروى، مبنى التجارة",
        },
        type: "دوام كامل",
        jobType: "دوام كامل",
        salary: {
          min: 150000,
          max: 250000,
          currency: "YER",
          isNegotiable: false,
          includesBenefits: false,
        },
        description: "مطلوب محاسب للعمل في شركة تجارية رائدة في عدن. خبرة في المحاسبة المالية وإعداد التقارير.",
        requirements: [
          "بكالوريوس في المحاسبة أو المالية",
          "خبرة لا تقل عن 3 سنوات في المحاسبة",
          "إجادة برامج المحاسبة",
          "معرفة بالأنظمة الضريبية",
          "دقة في العمل",
        ],
        benefits: [
          "راتب ثابت",
          "بيئة عمل مستقرة",
          "فرص نمو مهني",
        ],
        responsibilities: [
          "إعداد القوائم المالية",
          "مراجعة الحسابات",
          "إعداد التقارير الضريبية",
          "المتابعة مع البنوك",
        ],
        contact: {
          phone: "+967-777-444555",
          whatsapp: "+967-777-444555",
          email: "hr@adencommercial.com",
        },
        postedDate: "2024-01-13T09:00:00Z",
        experience: "متوسط",
        experienceLevel: "متوسط",
        isFeatured: false,
        isUrgent: false,
        isRemote: false,
        workingHours: "8:00 ص - 3:00 م",
        gender: "غير محدد",
        education: "بكالوريوس",
        ageRange: { min: 25, max: 40 },
        languages: ["العربية"],
        views: 67,
        applicants: 8,
        isActive: true,
        tags: ["محاسبة", "مالية", "تقارير", "عدن"],
        featured: false,
      },
      {
        id: "aden-005",
        title: "ممرض - مستشفى عام",
        category: "صحة وطب",
        company: "مستشفى عدن العام",
        companyName: "مستشفى عدن العام",
        location: {
          city: "عدن",
          district: "المنصورة",
          address: "شارع الصحة، بجانب كلية الطب",
        },
        type: "دوام كامل",
        jobType: "دوام كامل",
        salary: {
          min: 120000,
          max: 200000,
          currency: "YER",
          isNegotiable: true,
          includesBenefits: true,
        },
        description: "مطلوب ممرض/ممرضة للعمل في مستشفى عدن العام. خبرة في الرعاية التمريضية والعمل في بيئة طبية.",
        requirements: [
          "دبلوم في التمريض",
          "خبرة لا تقل عن 2 سنوات",
          "شهادة مزاولة المهنة",
          "مهارات تواصل ممتازة",
          "القدرة على العمل في نوبات",
        ],
        benefits: [
          "راتب مع بدلات نوبات",
          "تأمين صحي شامل",
          "إجازات مدفوعة",
          "بيئة عمل آمنة",
        ],
        responsibilities: [
          "تقديم الرعاية التمريضية",
          "مراقبة حالة المرضى",
          "إعطاء الأدوية حسب الوصفة",
          "التعاون مع الفريق الطبي",
        ],
        contact: {
          phone: "+967-777-555666",
          whatsapp: "+967-777-555666",
          email: "nursing@adenhospital.com",
        },
        postedDate: "2024-01-12T11:00:00Z",
        experience: "مبتدئ",
        experienceLevel: "مبتدئ",
        isFeatured: false,
        isUrgent: true,
        isRemote: false,
        workingHours: "نوبات (8 ساعات)",
        gender: "غير محدد",
        education: "دبلوم",
        ageRange: { min: 22, max: 35 },
        languages: ["العربية"],
        views: 145,
        applicants: 23,
        isActive: true,
        tags: ["تمريض", "رعاية", "مستشفى", "عدن"],
        featured: false,
      }
    ];

    // دمج الوظائف المحلية مع الوظائف العامة
    this.jobs = [...mockJobs, ...adenSpecificJobs];
  }

  // الحصول على جميع الوظائف
  getAllJobs(): Job[] {
    return this.jobs;
  }

  // الحصول على الوظائف النشطة فقط
  getActiveJobs(): Job[] {
    return this.jobs.filter(job => job.isActive);
  }

  // البحث في الوظائف
  searchJobs(searchQuery: string, filters: any = {}): Job[] {
    let filteredJobs = this.jobs.filter(job => job.isActive);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.companyName?.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query) ||
        job.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // تطبيق الفلاتر
    if (filters.district) {
      filteredJobs = filteredJobs.filter(job => {
        const location = job.location;
        if (typeof location === 'object') {
          return location.district?.toLowerCase().includes(filters.district) ||
            ADEN_DISTRICTS.some(name => 
              (typeof location === 'object' ? location.district : location)?.includes(name)
            );
        }
        return location?.toLowerCase().includes(filters.district);
      });
    }

      if (filters.category && filters.category !== 'all') {
        filteredJobs = filteredJobs.filter(job => job.category === filters.category);
      }

    if (filters.jobType) {
        filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
      }

    if (filters.experienceLevel) {
        filteredJobs = filteredJobs.filter(job => job.experienceLevel === filters.experienceLevel);
      }

    if (filters.salaryRange) {
      filteredJobs = filteredJobs.filter(job => {
        if (typeof job.salary === 'object' && job.salary) {
          const salary = job.salary;
          return salary.min >= filters.salaryRange.min && salary.max <= filters.salaryRange.max;
        }
        return true;
      });
    }

    if (filters.isRemote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.isRemote === filters.isRemote);
    }

    if (filters.isUrgent) {
      filteredJobs = filteredJobs.filter(job => job.isUrgent);
    }

    if (filters.isFeatured) {
      filteredJobs = filteredJobs.filter(job => job.isFeatured);
    }

    return filteredJobs;
  }

  // الحصول على الوظائف المميزة
  getFeaturedJobs(): Job[] {
    return this.jobs.filter(job => job.featured && job.isActive);
  }

  // الحصول على الوظائف العاجلة
  getUrgentJobs(): Job[] {
    return this.jobs.filter(job => job.isUrgent && job.isActive);
  }

  // الحصول على إحصائيات الوظائف
  getJobStatistics() {
    const activeJobs = this.jobs.filter(job => job.isActive);
    
    return {
      total: activeJobs.length,
      featured: activeJobs.filter(job => job.featured).length,
      urgent: activeJobs.filter(job => job.isUrgent).length,
      remote: activeJobs.filter(job => job.isRemote).length,
      categories: this.getCategoryCounts(activeJobs),
      districts: this.getDistrictCounts(activeJobs)
    };
  }

  // إضافة وظيفة جديدة
  addJob(job: Partial<Job>): Job {
    const newJob: Job = {
      id: `aden-${Date.now()}`,
      title: job.title || '',
      description: job.description || '',
      location: job.location || 'عدن',
      category: job.category || '',
      company: job.company || '',
      companyName: job.companyName || '',
      type: job.type || 'دوام كامل',
      jobType: job.jobType || 'دوام كامل',
      postedDate: new Date().toISOString(),
      experience: job.experience || 'مبتدئ',
      experienceLevel: job.experienceLevel || 'مبتدئ',
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      benefits: job.benefits || [],
      contact: job.contact || {
        phone: '',
        email: '',
        whatsapp: ''
      },
      isFeatured: job.isFeatured || false,
      isUrgent: job.isUrgent || false,
      isRemote: job.isRemote || false,
      isActive: job.isActive || true,
      views: 0,
      applicants: 0,
      tags: job.tags || [],
      featured: job.featured || false,
      workingHours: job.workingHours || '8:00 ص - 5:00 م',
      gender: job.gender || 'غير محدد',
      ageRange: job.ageRange,
      languages: job.languages || ['العربية']
    };

    this.jobs.push(newJob);
    this.notifySubscribers();
    return newJob;
  }

  // الحصول على عدد الوظائف حسب التصنيف
  private getCategoryCounts(jobs: Job[]) {
    const counts: { [key: string]: number } = {};
    jobs.forEach(job => {
      counts[job.category] = (counts[job.category] || 0) + 1;
    });
    return counts;
  }

  // الحصول على عدد الوظائف حسب المديرية
  private getDistrictCounts(jobs: Job[]) {
    const counts: { [key: string]: number } = {};
    jobs.forEach(job => {
      const location = job.location;
      const district = typeof location === 'object' ? location.district : location;
      if (district) {
        counts[district] = (counts[district] || 0) + 1;
      }
    });
    return counts;
  }

  // إشعار المشتركين بالتغييرات
  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.jobs));
  }

  // الاشتراك في التحديثات
  subscribe(callback: (jobs: Job[]) => void) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }
}

// تصدير مثيل واحد من الخدمة
export const adenJobsService = AdenJobsService.getInstance();

// تصدير ثوابت مديريات عدن
export const ADEN_DISTRICTS = [
  'كريتر',
  'خور مكسر', 
  'المعلا',
  'التواهي',
  'الشيخ عثمان',
  'المنصورة',
  'دار سعد',
  'البريقة',
  'صيرة'
];