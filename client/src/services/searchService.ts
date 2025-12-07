// خدمة البحث الشاملة لجميع محتوى تطبيق عدن لايف
import { adenHealthFacilities, HealthFacility } from '@/data/aden-health-facilities';
import { adenEducationFacilities, EducationFacility } from '@/data/aden-education-facilities';
import { adenLocations, AdenLocation } from '@/data/aden-locations';
import { mockJobs } from '@/data/jobs-enhanced';
import { getJobsWithCategoryCounts } from '@/data/jobs-enhanced';

// واجهة موحدة لنتائج البحث
export interface UnifiedSearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  type: 'service' | 'job' | 'health' | 'education' | 'location' | 'page';
  location?: string;
  district?: string;
  rating?: number;
  phone?: string;
  hours?: string;
  distance?: string;
  image?: string;
  icon?: string;
  color?: string;
  url?: string;
  features?: string[];
  keywords?: string[];
}

// فئات البحث الرئيسية
export const SEARCH_CATEGORIES = {
  SERVICES: 'خدمات',
  JOBS: 'وظائف',
  HEALTH: 'صحة',
  EDUCATION: 'تعليم',
  LOCATIONS: 'أماكن',
  PAGES: 'صفحات'
};

// الخدمات الرئيسية في التطبيق
const APP_SERVICES = [
  {
    id: 'water',
    title: 'خدمات المياه',
    description: 'صهاريج وخزانات ونقاط مياه',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '💧',
    color: '#0ea5e9',
    url: '/water',
    keywords: ['ماء', 'صهريج', 'خزان', 'مياه', 'شرب']
  },
  {
    id: 'electricity',
    title: 'خدمات الكهرباء',
    description: 'حلول الطاقة والشحن والبطاريات',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '⚡',
    color: '#eab308',
    url: '/electricity',
    keywords: ['كهرباء', 'طاقة', 'شحن', 'بطارية', 'انقطاع']
  },
  {
    id: 'health',
    title: 'الخدمات الصحية',
    description: 'صيدليات ومستشفيات وطوارئ',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '🏥',
    color: '#dc2626',
    url: '/health',
    keywords: ['صحة', 'مستشفى', 'صيدلية', 'طوارئ', 'طبيب']
  },
  {
    id: 'education',
    title: 'الخدمات التعليمية',
    description: 'دروس ومناهج ومساعدة تعليمية',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '📚',
    color: '#16a34a',
    url: '/education',
    keywords: ['تعليم', 'مدرسة', 'جامعة', 'دروس', 'مناهج']
  },
  {
    id: 'jobs',
    title: 'الوظائف',
    description: 'فرص عمل ووظائف شاغرة في عدن',
    category: SEARCH_CATEGORIES.JOBS,
    type: 'service' as const,
    icon: '💼',
    color: '#2563eb',
    url: '/jobs',
    keywords: ['وظيفة', 'عمل', 'شغل', 'توظيف', 'مهنة']
  },
  {
    id: 'motorcycle-taxi',
    title: 'دباب عدن',
    description: 'تاكسي لكل عدن دباب / سيكل',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '🏍️',
    color: '#ea580c',
    url: '/motorcycle-taxi',
    keywords: ['دباب', 'تاكسي', 'مواصلات', 'سيكل', 'نقل']
  },
  {
    id: 'flights',
    title: 'الطيران',
    description: 'رحلات جوية ومطارات',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '✈️',
    color: '#7c3aed',
    url: '/flights',
    keywords: ['طيران', 'مطار', 'رحلة', 'سفر', 'طائرة']
  },
  {
    id: 'maps',
    title: 'الخرائط',
    description: 'خرائط تفاعلية ومواقع',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '🗺️',
    color: '#059669',
    url: '/maps',
    keywords: ['خريطة', 'موقع', 'عنوان', 'مكان', 'مواقع']
  },
  {
    id: 'currency',
    title: 'أسعار العملات',
    description: 'أسعار صرف العملات المحلية والأجنبية',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '💱',
    color: '#ca8a04',
    url: '/currency-rates',
    keywords: ['عملة', 'سعر', 'صرف', 'دولار', 'ريال']
  },
  {
    id: 'ideas',
    title: 'صندوق الأفكار',
    description: 'اقتراحات ومبادرات المجتمع',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '💡',
    color: '#f59e0b',
    url: '/ideas',
    keywords: ['فكرة', 'اقتراح', 'مبادرة', 'مجتمع', 'تطوير']
  },
  {
    id: 'development',
    title: 'خدمات التطوير',
    description: 'خدمات تقنية وتطويرية',
    category: SEARCH_CATEGORIES.SERVICES,
    type: 'service' as const,
    icon: '⚙️',
    color: '#6b7280',
    url: '/development-services',
    keywords: ['تطوير', 'تقنية', 'برمجة', 'تكنولوجيا', 'حاسوب']
  }
];

// الصفحات الرئيسية في التطبيق
const APP_PAGES = [
  {
    id: 'home',
    title: 'الصفحة الرئيسية',
    description: 'الصفحة الرئيسية لتطبيق عدن لايف',
    category: SEARCH_CATEGORIES.PAGES,
    type: 'page' as const,
    icon: '🏠',
    color: '#3b82f6',
    url: '/',
    keywords: ['رئيسية', 'صفحة', 'بداية', 'منزل']
  },
  {
    id: 'blood-bank',
    title: 'بنك الدم',
    description: 'طلبات الدم العاجلة وتسجيل المتبرعين',
    category: SEARCH_CATEGORIES.HEALTH,
    type: 'page' as const,
    icon: '🩸',
    color: '#dc2626',
    url: '/blood-bank',
    keywords: ['دم', 'تبرع', 'بنك', 'عاجل', 'مستشفى']
  },
  {
    id: 'emergency',
    title: 'الطوارئ',
    description: 'أرقام الطوارئ والخدمات العاجلة',
    category: SEARCH_CATEGORIES.HEALTH,
    type: 'page' as const,
    icon: '🚨',
    color: '#dc2626',
    url: '/emergency',
    keywords: ['طوارئ', 'عاجل', 'إسعاف', 'شرطة', 'إطفاء']
  }
];

// دالة تحويل المرافق الصحية إلى نتائج بحث موحدة
function convertHealthFacilities(): UnifiedSearchResult[] {
  return adenHealthFacilities.map(facility => ({
    id: facility.id,
    title: facility.name,
    description: facility.description,
    category: SEARCH_CATEGORIES.HEALTH,
    subcategory: facility.type,
    type: 'health' as const,
    location: facility.address,
    district: facility.district,
    rating: facility.rating,
    phone: facility.contact?.phone?.[0],
    hours: facility.workingHours,
    icon: facility.icon,
    color: facility.color,
    features: facility.features,
    keywords: [
      facility.name,
      facility.nameEn,
      ...facility.specialties,
      ...facility.services,
      facility.district,
      facility.type
    ]
  }));
}

// دالة تحويل المرافق التعليمية إلى نتائج بحث موحدة
function convertEducationFacilities(): UnifiedSearchResult[] {
  return adenEducationFacilities.map(facility => ({
    id: facility.id,
    title: facility.name,
    description: facility.description,
    category: SEARCH_CATEGORIES.EDUCATION,
    subcategory: facility.type,
    type: 'education' as const,
    location: facility.address,
    district: facility.district,
    rating: facility.rating,
    phone: facility.contact?.phone?.[0],
    hours: facility.workingHours,
    icon: facility.icon,
    color: facility.color,
    features: facility.features,
    keywords: [
      facility.name,
      facility.nameEn,
      ...facility.specialties,
      ...facility.services,
      facility.district,
      facility.type,
      facility.level
    ]
  }));
}

// دالة تحويل الأماكن إلى نتائج بحث موحدة
function convertLocations(): UnifiedSearchResult[] {
  return adenLocations.map(location => ({
    id: location.id,
    title: location.name,
    description: location.description,
    category: SEARCH_CATEGORIES.LOCATIONS,
    subcategory: location.type,
    type: 'location' as const,
    location: location.district,
    district: location.district,
    rating: location.rating,
    phone: location.contact?.phone,
    hours: location.hours,
    icon: location.icon,
    color: location.color,
    features: location.features,
    keywords: [
      location.name,
      location.nameEn,
      location.district,
      location.type,
      location.category,
      ...(location.features || [])
    ]
  }));
}

// دالة تحويل الوظائف إلى نتائج بحث موحدة
function convertJobs(): UnifiedSearchResult[] {
  return mockJobs.map(job => ({
    id: job.id,
    title: job.title,
    description: job.description,
    category: SEARCH_CATEGORIES.JOBS,
    subcategory: job.category,
    type: 'job' as const,
    location: typeof job.location === 'string' ? job.location : job.location.district || '',
    district: typeof job.location === 'string' ? job.location : job.location.district || '',
    rating: job.rating || 0,
    phone: job.contact?.phone || '',
    hours: job.workingHours || '',
    icon: '💼',
    color: '#2563eb',
    features: job.requirements,
    keywords: [
      job.title,
      job.description,
      job.category,
      typeof job.location === 'string' ? job.location : job.location.district || '',
      ...(job.requirements || []),
      ...(job.tags || [])
    ]
  }));
}

// دالة البحث الرئيسية
export function searchAllContent(query: string, limit: number = 20): UnifiedSearchResult[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase().trim();
  const allResults: UnifiedSearchResult[] = [
    ...APP_SERVICES,
    ...APP_PAGES,
    ...convertHealthFacilities(),
    ...convertEducationFacilities(),
    ...convertLocations(),
    ...convertJobs()
  ];

  // خوارزمية البحث المحسنة
  const results = allResults.filter(item => {
    const searchableText = [
      item.title,
      item.description,
      item.category,
      item.subcategory,
      item.location,
      item.district,
      ...(item.keywords || []),
      ...(item.features || [])
    ].join(' ').toLowerCase();

    return searchableText.includes(searchTerm);
  });

  // ترتيب النتائج حسب الأهمية
  results.sort((a, b) => {
    // الأولوية للخدمات والصفحات
    if (a.type === 'service' && b.type !== 'service') return -1;
    if (b.type === 'service' && a.type !== 'service') return 1;
    if (a.type === 'page' && b.type !== 'page') return -1;
    if (b.type === 'page' && a.type !== 'page') return 1;

    // ثم حسب التقييم
    if (a.rating && b.rating) return b.rating - a.rating;
    if (a.rating && !b.rating) return -1;
    if (!a.rating && b.rating) return 1;

    // أخيراً حسب الترتيب الأبجدي
    return a.title.localeCompare(b.title, 'ar');
  });

  return results.slice(0, limit);
}

// دالة الحصول على الاقتراحات
export function getSearchSuggestions(query: string, limit: number = 10): string[] {
  if (!query.trim()) {
    // اقتراحات افتراضية
    return [
      'مستشفى الجمهورية',
      'جامعة عدن',
      'مطار عدن',
      'خدمات المياه',
      'وظائف شاغرة',
      'صيدليات',
      'مدارس',
      'بنك الدم',
      'الطوارئ',
      'الخرائط'
    ];
  }

  const searchTerm = query.toLowerCase().trim();
  const allResults = searchAllContent(query, 50);
  
  // استخراج الاقتراحات من النتائج
  const suggestions = allResults
    .map(item => item.title)
    .filter((title, index, array) => array.indexOf(title) === index) // إزالة التكرار
    .slice(0, limit);

  return suggestions;
}

// دالة البحث في فئة محددة
export function searchInCategory(category: string, query: string, limit: number = 20): UnifiedSearchResult[] {
  const allResults = searchAllContent(query, 100);
  return allResults
    .filter(item => item.category === category)
    .slice(0, limit);
}

// دالة الحصول على إحصائيات البحث
export function getSearchStats() {
  return {
    totalServices: APP_SERVICES.length,
    totalPages: APP_PAGES.length,
    totalHealthFacilities: adenHealthFacilities.length,
    totalEducationFacilities: adenEducationFacilities.length,
    totalLocations: adenLocations.length,
    totalJobs: mockJobs.length,
    totalItems: APP_SERVICES.length + APP_PAGES.length + 
                adenHealthFacilities.length + adenEducationFacilities.length + 
                adenLocations.length + mockJobs.length,
    categories: Object.values(SEARCH_CATEGORIES),
    lastUpdated: new Date().toISOString()
  };
}

// دالة البحث السريع
export function quickSearch(query: string): UnifiedSearchResult[] {
  return searchAllContent(query, 5);
}

// دالة البحث المتقدم
export function advancedSearch(query: string, options: {
  category?: string;
  type?: string;
  district?: string;
  limit?: number;
}): UnifiedSearchResult[] {
  let results = searchAllContent(query, options.limit || 20);

  if (options.category) {
    results = results.filter(item => item.category === options.category);
  }

  if (options.type) {
    results = results.filter(item => item.type === options.type);
  }

  if (options.district) {
    results = results.filter(item => 
      item.district?.toLowerCase().includes(options.district!.toLowerCase())
    );
  }

  return results;
}
