// Job interface محلي
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string | { city?: string; district: string; address?: string };
  category: string;
  salary?: string | { min: number; max: number; currency?: string; isNegotiable?: boolean; includesBenefits?: boolean };
  company: string;
  companyName?: string;
  type: string;
  jobType?: string;
  postedDate: string;
  experience: string;
  experienceLevel?: string;
  education?: string;
  requirements: string[];
  responsibilities?: string[];
  benefits?: string[];
  contact?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  isFeatured: boolean;
  featured?: boolean;
  isUrgent: boolean;
  isRemote?: boolean;
  isActive?: boolean;
  views?: number;
  applicants?: number;
  tags?: string[];
  rating?: number;
  workingHours?: string;
  gender?: string;
  ageRange?: { min?: number; max?: number };
  languages?: string[];
}

export interface SearchFilters {
  query?: string;
  district?: string;
  category?: string;
  jobType?: string;
  experienceLevel?: string;
  education?: string;
  companyType?: string;
  salaryMin?: number;
  salaryMax?: number;
  isPremium?: boolean;
}

export const JOB_CATEGORIES = [
  {
    id: "sales",
    name: "مبيعات وتسويق",
    icon: "💼",
    count: 0,
    description: "وظائف المبيعات والتسويق والإعلان",
  },
  {
    id: "driver",
    name: "سائق",
    icon: "🚗",
    count: 0,
    description: "وظائف قيادة المركبات والشاحنات",
  },
  {
    id: "technical",
    name: "تقني",
    icon: "💻",
    count: 0,
    description: "وظائف تقنية ومعلوماتية",
  },
  {
    id: "tourism",
    name: "سياحة ومطاعم",
    icon: "🍽️",
    count: 0,
    description: "وظائف الفنادق والمطاعم والضيافة",
  },
  {
    id: "health",
    name: "صحة وطب",
    icon: "🏥",
    count: 0,
    description: "وظائف طبية وتمريضية",
  },
  {
    id: "education",
    name: "تعليم",
    icon: "📚",
    count: 0,
    description: "وظائف التدريس والتعليم",
  },
  {
    id: "construction",
    name: "بناء ومقاولات",
    icon: "🏗️",
    count: 0,
    description: "وظائف البناء والمقاولات",
  },
  {
    id: "finance",
    name: "مالية ومحاسبة",
    icon: "💰",
    count: 0,
    description: "وظائف البنوك والمحاسبة",
  },
  {
    id: "security",
    name: "أمن وحماية",
    icon: "🛡️",
    count: 0,
    description: "وظائف الأمن والحماية",
  },
  {
    id: "media",
    name: "إعلام وصحافة",
    icon: "📺",
    count: 0,
    description: "وظائف الإعلام والصحافة",
  },
  {
    id: "legal",
    name: "قانونية ومحاماة",
    icon: "⚖️",
    count: 0,
    description: "وظائف قانونية ومحاماة",
  },
  {
    id: "agriculture",
    name: "زراعة وصيد",
    icon: "🐟",
    count: 0,
    description: "وظائف الزراعة والصيد",
  },
  {
    id: "services",
    name: "خدمات عامة",
    icon: "🔧",
    count: 0,
    description: "وظائف الخدمات العامة",
  },
];

export const JOB_TYPES = [
  { value: "دوام كامل", label: "دوام كامل" },
  { value: "دوام جزئي", label: "دوام جزئي" },
  { value: "عقد مؤقت", label: "عقد مؤقت" },
  { value: "عمل عن بُعد", label: "عمل عن بُعد" },
  { value: "تدريب", label: "تدريب" },
];

export const EXPERIENCE_LEVELS = [
  { value: "مبتدئ", label: "مبتدئ (0-2 سنوات)" },
  { value: "متوسط", label: "متوسط (2-5 سنوات)" },
  { value: "متقدم", label: "متقدم (5-10 سنوات)" },
  { value: "خبير", label: "خبير (10+ سنوات)" },
];

export const EDUCATION_LEVELS = [
  { value: "ثانوي", label: "ثانوي" },
  { value: "دبلوم", label: "دبلوم" },
  { value: "بكالوريوس", label: "بكالوريوس" },
  { value: "ماجستير", label: "ماجستير" },
  { value: "دكتوراه", label: "دكتوراه" },
  { value: "غير محدد", label: "غير محدد" },
];

export const COMPANY_TYPES = [
  { value: "شركة", label: "شركة" },
  { value: "مؤسسة", label: "مؤسسة" },
  { value: "بنك", label: "بنك" },
  { value: "مستشفى", label: "مستشفى" },
  { value: "مدرسة", label: "مدرسة" },
  { value: "جامعة", label: "جامعة" },
  { value: "حكومي", label: "حكومي" },
  { value: "منظمة غير ربحية", label: "منظمة غير ربحية" },
];

// Enhanced mock jobs with all new properties
export const mockJobs: Job[] = [
  {
    id: "1",
    title: "مندوب مبيعات",
    category: "مبيعات وتسويق",
    company: "شركة عدن التجارية",
    companyName: "شركة عدن التجارية",
    location: {
      city: "عدن",
      district: "كريتر",
      address: "شارع الجمهورية، كريتر",
    },
    type: "دوام كامل",
    jobType: "دوام كامل",
    salary: {
      min: 150000,
      max: 250000,
      currency: "YER",
      isNegotiable: true,
      includesBenefits: true,
    },
    description: "نبحث عن مندوب مبيعات ذو خبرة في مجال المبيعات والتسويق للعمل مع فريقنا المتميز في عدن. الوظيفة تتطلب مهارات تواصل ممتازة ومعرفة بالسوق المحلي.",
    requirements: [
      "خبرة لا تقل عن سنتين في المبيعات",
      "إجادة اللغة العربية والإنجليزية",
      "مهارات تواصل ممتازة",
      "رخصة قيادة سارية",
      "معرفة بمنتجات الشركة",
    ],
    benefits: [
      "راتب تنافسي",
      "عمولة على المبيعات",
      "تأمين صحي",
      "علاوات أداء",
      "بدل مواصلات",
    ],
    responsibilities: [
      "البحث عن عملاء جدد",
      "تقديم عروض المبيعات",
      "متابعة العملاء",
      "تحقيق أهداف المبيعات",
    ],
    contact: {
      phone: "+967-777-123456",
      whatsapp: "+967-777-123456",
      email: "hr@aden-trade.com",
    },
    postedDate: "2024-01-15T10:30:00Z",
    experience: "متوسط",
    experienceLevel: "متوسط",
    isFeatured: true,
    isUrgent: false,
    isRemote: false,
    workingHours: "8:00 ص - 5:00 م",
    gender: "غير محدد",
    education: "بكالوريوس",
    ageRange: { min: 25, max: 40 },
    languages: ["العربية", "الإنجليزية"],
    views: 245,
    applicants: 12,
    isActive: true,
    tags: ["مبيعات", "تسويق", "عدن", "كريتر"],
    featured: true,
  },
  {
    id: "2",
    title: "سائق توصيل",
    category: "سائق",
    company: "شركة توصيل عدن",
    companyName: "شركة توصيل عدن",
    location: {
      city: "عدن",
      district: "المعلا",
      address: "شارع الملكة أروى، المعلا",
    },
    type: "دوام كامل",
    jobType: "دوام كامل",
    salary: {
      min: 120000,
      max: 180000,
      currency: "YER",
      isNegotiable: false,
      includesBenefits: false,
    },
    description: "مطلوب سائق توصيل للعمل في شركة توصيل محلية. يجب أن يكون لديه رخصة قيادة سارية ومعرفة بطرق عدن.",
    requirements: [
      "رخصة قيادة سارية",
      "خبرة في القيادة",
      "معرفة بطرق عدن",
      "مهارات تواصل جيدة",
      "الالتزام بالمواعيد",
    ],
    benefits: [
      "راتب ثابت",
      "بدل وقود",
      "تأمين على المركبة",
    ],
    responsibilities: [
      "توصيل الطلبات للعملاء",
      "الالتزام بمواعيد التسليم",
      "الحفاظ على المركبة",
      "التعامل مع العملاء باحترافية",
    ],
    contact: {
      phone: "+967-777-234567",
      whatsapp: "+967-777-234567",
      email: "delivery@aden.com",
    },
    postedDate: "2024-01-14T09:00:00Z",
    experience: "مبتدئ",
    experienceLevel: "مبتدئ",
    isFeatured: false,
    isUrgent: true,
    isRemote: false,
    workingHours: "9:00 ص - 6:00 م",
    gender: "غير محدد",
    education: "ثانوي",
    ageRange: { min: 22, max: 45 },
    languages: ["العربية"],
    views: 89,
    applicants: 15,
    isActive: true,
    tags: ["سائق", "توصيل", "عدن", "المعلا"],
    featured: false,
  },
  {
    id: "3",
    title: "مطور ويب",
    category: "تقني",
    company: "شركة عدن التقنية",
    companyName: "شركة عدن التقنية",
    location: {
      city: "عدن",
      district: "التواهي",
      address: "مبنى التقنية، الطابق الثاني",
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
    description: "مطلوب مطور ويب للعمل على تطوير تطبيقات ويب حديثة. خبرة في React, Node.js, و قواعد البيانات مطلوبة.",
    requirements: [
      "بكالوريوس في علوم الحاسوب",
      "خبرة لا تقل عن 3 سنوات في تطوير الويب",
      "إجادة React, Node.js, JavaScript",
      "معرفة بقواعد البيانات SQL",
      "خبرة في Git و DevOps",
    ],
    benefits: [
      "راتب تنافسي",
      "تأمين صحي شامل",
      "إجازات مرنة",
      "بيئة عمل إبداعية",
      "فرص عمل عن بُعد",
    ],
    responsibilities: [
      "تطوير تطبيقات ويب",
      "كتابة كود نظيف ومُوثق",
      "المشاركة في مراجعة الكود",
      "التعاون مع فريق التصميم",
    ],
    contact: {
      phone: "+967-777-345678",
      whatsapp: "+967-777-345678",
      email: "careers@adentech.com",
    },
    postedDate: "2024-01-13T14:00:00Z",
    experience: "متقدم",
    experienceLevel: "متقدم",
    isFeatured: true,
    isUrgent: false,
    isRemote: true,
    workingHours: "9:00 ص - 5:00 م",
    gender: "غير محدد",
    education: "بكالوريوس",
    ageRange: { min: 25, max: 35 },
    languages: ["العربية", "الإنجليزية"],
    views: 156,
    applicants: 8,
    isActive: true,
    tags: ["برمجة", "React", "Node.js", "تطوير"],
    featured: true,
  },
  {
    id: "4",
    title: "طاهي",
    category: "سياحة ومطاعم",
    company: "مطعم عدن الشهير",
    companyName: "مطعم عدن الشهير",
    location: {
      city: "عدن",
      district: "خور مكسر",
      address: "شارع المطار، بجانب الفندق",
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
    description: "مطلوب طاهي محترف للعمل في مطعم شهير في عدن. خبرة في الطبخ اليمني والعربي مطلوبة.",
    requirements: [
      "خبرة لا تقل عن 5 سنوات في الطبخ",
      "معرفة بالطبخ اليمني والعربي",
      "القدرة على العمل تحت الضغط",
      "مهارات إدارة المطبخ",
      "معرفة بمعايير النظافة",
    ],
    benefits: [
      "راتب تنافسي",
      "تأمين صحي",
      "وجبات مجانية",
      "بيئة عمل محترمة",
      "فرص تطوير مهني",
    ],
    responsibilities: [
      "إعداد الوجبات المختلفة",
      "إدارة المطبخ",
      "ضمان جودة الطعام",
      "التدريب على الوصفات الجديدة",
    ],
    contact: {
      phone: "+967-777-456789",
      whatsapp: "+967-777-456789",
      email: "kitchen@adenrestaurant.com",
    },
    postedDate: "2024-01-12T11:00:00Z",
    experience: "متقدم",
    experienceLevel: "متقدم",
    isFeatured: false,
    isUrgent: false,
    isRemote: false,
    workingHours: "10:00 ص - 10:00 م",
    gender: "غير محدد",
    education: "دبلوم",
    ageRange: { min: 28, max: 50 },
    languages: ["العربية"],
    views: 67,
    applicants: 5,
    isActive: true,
    tags: ["طبخ", "مطعم", "عدن", "خور مكسر"],
    featured: false,
  },
  {
    id: "5",
    title: "ممرض",
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
      min: 140000,
      max: 220000,
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
      phone: "+967-777-567890",
      whatsapp: "+967-777-567890",
      email: "nursing@adenhospital.com",
    },
    postedDate: "2024-01-11T08:00:00Z",
    experience: "متوسط",
    experienceLevel: "متوسط",
    isFeatured: false,
    isUrgent: true,
    isRemote: false,
    workingHours: "نوبات (8 ساعات)",
    gender: "غير محدد",
    education: "دبلوم",
    ageRange: { min: 22, max: 40 },
    languages: ["العربية"],
    views: 123,
    applicants: 18,
    isActive: true,
    tags: ["تمريض", "رعاية", "مستشفى", "عدن"],
    featured: false,
  }
];

// Helper functions
export function getJobsWithCategoryCounts(): Job[] {
  return mockJobs;
}

export function getJobStatistics() {
  const activeJobs = mockJobs.filter(job => job.isActive);
  
  return {
    total: activeJobs.length,
    featured: activeJobs.filter(job => job.featured).length,
    urgent: activeJobs.filter(job => job.isUrgent).length,
    remote: activeJobs.filter(job => job.isRemote).length,
    categories: getCategoryCounts(activeJobs),
    districts: getDistrictCounts(activeJobs)
  };
}

export function getFeaturedJobs(): Job[] {
  return mockJobs.filter(job => job.featured && job.isActive);
}

export function searchJobs(query: string, filters: SearchFilters = {}): Job[] {
  let filteredJobs = mockJobs.filter(job => job.isActive);

  if (query) {
    const searchQuery = query.toLowerCase();
    filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery) ||
        job.description.toLowerCase().includes(searchQuery) ||
      job.company.toLowerCase().includes(searchQuery) ||
      job.category.toLowerCase().includes(searchQuery) ||
      job.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
    );
  }

  if (filters.category && filters.category !== 'all') {
    filteredJobs = filteredJobs.filter(job => job.category === filters.category);
  }

    if (filters.district) {
    filteredJobs = filteredJobs.filter(job => {
      const location = job.location;
      if (typeof location === 'object') {
        return location.district?.toLowerCase().includes(filters.district?.toLowerCase() || '');
      }
      return location?.toLowerCase().includes(filters.district?.toLowerCase() || '');
    });
  }

    if (filters.jobType) {
    filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
    }

    if (filters.experienceLevel) {
    filteredJobs = filteredJobs.filter(job => job.experienceLevel === filters.experienceLevel);
  }

  if (filters.isPremium) {
    filteredJobs = filteredJobs.filter(job => job.isFeatured);
  }

  return filteredJobs;
}

function getCategoryCounts(jobs: Job[]) {
  const counts: { [key: string]: number } = {};
  jobs.forEach(job => {
    counts[job.category] = (counts[job.category] || 0) + 1;
  });
  return counts;
}

function getDistrictCounts(jobs: Job[]) {
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