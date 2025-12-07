// بيانات شاملة لجميع مواقع عدن المهمة
export interface AdenLocation {
  id: string;
  name: string;
  nameEn: string;
  type: 'historic' | 'residential' | 'industrial' | 'commercial' | 'tourist' | 'government' | 'health' | 'education' | 'transport' | 'religious' | 'recreational';
  position: [number, number]; // [latitude, longitude]
  district: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
  subcategory?: string;
  features?: string[];
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  hours?: string;
  rating?: number;
  images?: string[];
}

export const adenLocations: AdenLocation[] = [
  // المناطق التاريخية
  {
    id: 'crater-aden',
    name: 'كريتر - عدن',
    nameEn: 'Crater - Aden',
    type: 'historic',
    position: [12.8275, 45.0339],
    district: 'كريتر',
    description: 'المنطقة التاريخية في عدن، قلب المدينة القديمة',
    descriptionEn: 'The historic district of Aden, the old city center',
    icon: '🏛️',
    color: '#dc2626',
    importance: 'high',
    category: 'تاريخي',
    features: ['معالم تاريخية', 'أسواق تقليدية', 'مباني قديمة'],
    rating: 4.8
  },
  {
    id: 'aden-museum',
    name: 'متحف عدن الوطني',
    nameEn: 'Aden National Museum',
    type: 'historic',
    position: [12.8280, 45.0340],
    district: 'كريتر',
    description: 'متحف يحتوي على آثار وتاريخ عدن',
    descriptionEn: 'Museum containing Aden\'s artifacts and history',
    icon: '🏛️',
    color: '#dc2626',
    importance: 'high',
    category: 'ثقافي',
    features: ['آثار تاريخية', 'معروضات ثقافية', 'جولات إرشادية'],
    rating: 4.5
  },
  {
    id: 'aden-fortress',
    name: 'قلعة عدن',
    nameEn: 'Aden Fortress',
    type: 'historic',
    position: [12.8290, 45.0350],
    district: 'كريتر',
    description: 'قلعة تاريخية تطل على المدينة',
    descriptionEn: 'Historic fortress overlooking the city',
    icon: '🏰',
    color: '#dc2626',
    importance: 'high',
    category: 'تاريخي',
    features: ['منظر بانورامي', 'معمار تاريخي', 'موقع سياحي'],
    rating: 4.6
  },

  // المناطق السكنية
  {
    id: 'maalla',
    name: 'المعلا',
    nameEn: 'Maalla',
    type: 'residential',
    position: [12.8000, 45.0500],
    district: 'المعلا',
    description: 'منطقة سكنية وتجارية في عدن',
    descriptionEn: 'Residential and commercial area in Aden',
    icon: '🏠',
    color: '#059669',
    importance: 'high',
    category: 'سكني',
    features: ['منطقة سكنية', 'مراكز تجارية', 'خدمات متنوعة'],
    rating: 4.3
  },
  {
    id: 'khormaksar',
    name: 'خور مكسر',
    nameEn: 'Khormaksar',
    type: 'residential',
    position: [12.8500, 45.0000],
    district: 'خور مكسر',
    description: 'منطقة سكنية حديثة في عدن',
    descriptionEn: 'Modern residential area in Aden',
    icon: '🏘️',
    color: '#059669',
    importance: 'high',
    category: 'سكني',
    features: ['أحياء حديثة', 'مرافق متطورة', 'خدمات صحية'],
    rating: 4.4
  },
  {
    id: 'tawahi',
    name: 'التواهي',
    nameEn: 'Tawahi',
    type: 'residential',
    position: [12.7800, 45.0200],
    district: 'التواهي',
    description: 'منطقة سكنية على ساحل البحر',
    descriptionEn: 'Residential area on the coast',
    icon: '🏖️',
    color: '#059669',
    importance: 'medium',
    category: 'سكني',
    features: ['منظر بحري', 'شواطئ', 'منطقة هادئة'],
    rating: 4.2
  },

  // المناطق الصناعية
  {
    id: 'little-aden',
    name: 'عدن الصغرى',
    nameEn: 'Little Aden',
    type: 'industrial',
    position: [12.7000, 44.9000],
    district: 'عدن الصغرى',
    description: 'منطقة صناعية وميناء نفطي',
    descriptionEn: 'Industrial area and oil port',
    icon: '🏭',
    color: '#d97706',
    importance: 'high',
    category: 'صناعي',
    features: ['مصافي نفط', 'ميناء صناعي', 'منطقة اقتصادية'],
    rating: 3.8
  },
  {
    id: 'bir-ahmed',
    name: 'بئر أحمد',
    nameEn: 'Bir Ahmed',
    type: 'industrial',
    position: [12.7500, 44.9500],
    district: 'بئر أحمد',
    description: 'منطقة صناعية ومستودعات',
    descriptionEn: 'Industrial area and warehouses',
    icon: '🏭',
    color: '#d97706',
    importance: 'medium',
    category: 'صناعي',
    features: ['مستودعات', 'ورش صناعية', 'منطقة لوجستية'],
    rating: 3.5
  },

  // المراكز التجارية
  {
    id: 'aden-mall',
    name: 'مول عدن',
    nameEn: 'Aden Mall',
    type: 'commercial',
    position: [12.8200, 45.0400],
    district: 'كريتر',
    description: 'مركز تجاري حديث في عدن',
    descriptionEn: 'Modern shopping center in Aden',
    icon: '🛍️',
    color: '#7c3aed',
    importance: 'high',
    category: 'تجاري',
    features: ['محلات متنوعة', 'مطاعم', 'ترفيه'],
    rating: 4.1
  },
  {
    id: 'souk-aden',
    name: 'سوق عدن المركزي',
    nameEn: 'Aden Central Market',
    type: 'commercial',
    position: [12.8260, 45.0320],
    district: 'كريتر',
    description: 'السوق المركزي التقليدي في عدن',
    descriptionEn: 'Traditional central market in Aden',
    icon: '🏪',
    color: '#7c3aed',
    importance: 'high',
    category: 'تجاري',
    features: ['بضائع محلية', 'أسعار مناسبة', 'تجربة تقليدية'],
    rating: 4.0
  },

  // المعالم السياحية
  {
    id: 'aden-beach',
    name: 'شاطئ عدن',
    nameEn: 'Aden Beach',
    type: 'tourist',
    position: [12.7800, 45.0100],
    district: 'التواهي',
    description: 'شاطئ جميل في عدن',
    descriptionEn: 'Beautiful beach in Aden',
    icon: '🏖️',
    color: '#0891b2',
    importance: 'high',
    category: 'سياحي',
    features: ['شاطئ نظيف', 'أنشطة مائية', 'مطاعم بحرية'],
    rating: 4.3
  },
  {
    id: 'aden-aquarium',
    name: 'أكواريوم عدن',
    nameEn: 'Aden Aquarium',
    type: 'tourist',
    position: [12.7850, 45.0150],
    district: 'التواهي',
    description: 'أكواريوم يحتوي على الحياة البحرية',
    descriptionEn: 'Aquarium containing marine life',
    icon: '🐠',
    color: '#0891b2',
    importance: 'medium',
    category: 'سياحي',
    features: ['أسماك متنوعة', 'جولات تعليمية', 'أنشطة للأطفال'],
    rating: 4.2
  },

  // المرافق الحكومية
  {
    id: 'aden-governorate',
    name: 'محافظة عدن',
    nameEn: 'Aden Governorate',
    type: 'government',
    position: [12.8300, 45.0450],
    district: 'كريتر',
    description: 'مقر محافظة عدن',
    descriptionEn: 'Aden Governorate headquarters',
    icon: '🏛️',
    color: '#1f2937',
    importance: 'high',
    category: 'حكومي',
    features: ['خدمات حكومية', 'وثائق رسمية', 'استعلامات'],
    rating: 3.9
  },
  {
    id: 'aden-court',
    name: 'محكمة عدن',
    nameEn: 'Aden Court',
    type: 'government',
    position: [12.8280, 45.0420],
    district: 'كريتر',
    description: 'المحكمة الرئيسية في عدن',
    descriptionEn: 'Main court in Aden',
    icon: '⚖️',
    color: '#1f2937',
    importance: 'high',
    category: 'حكومي',
    features: ['قضايا قانونية', 'خدمات قضائية', 'استشارات'],
    rating: 4.0
  },

  // المرافق الصحية
  {
    id: 'aden-hospital',
    name: 'مستشفى عدن العام',
    nameEn: 'Aden General Hospital',
    type: 'health',
    position: [12.8150, 45.0380],
    district: 'كريتر',
    description: 'المستشفى الرئيسي في عدن',
    descriptionEn: 'Main hospital in Aden',
    icon: '🏥',
    color: '#dc2626',
    importance: 'high',
    category: 'صحي',
    features: ['طوارئ 24/7', 'تخصصات متنوعة', 'خدمات متطورة'],
    rating: 4.1
  },
  {
    id: 'aden-clinic',
    name: 'عيادة عدن الطبية',
    nameEn: 'Aden Medical Clinic',
    type: 'health',
    position: [12.8100, 45.0350],
    district: 'كريتر',
    description: 'عيادة طبية متخصصة',
    descriptionEn: 'Specialized medical clinic',
    icon: '🏥',
    color: '#dc2626',
    importance: 'medium',
    category: 'صحي',
    features: ['فحوصات طبية', 'استشارات', 'متابعة مرضى'],
    rating: 4.0
  },

  // المرافق التعليمية
  {
    id: 'aden-university',
    name: 'جامعة عدن',
    nameEn: 'Aden University',
    type: 'education',
    position: [12.8400, 45.0200],
    district: 'خور مكسر',
    description: 'الجامعة الرئيسية في عدن',
    descriptionEn: 'Main university in Aden',
    icon: '🎓',
    color: '#059669',
    importance: 'high',
    category: 'تعليمي',
    features: ['كليات متنوعة', 'بحث علمي', 'خدمات طلابية'],
    rating: 4.2
  },
  {
    id: 'aden-school',
    name: 'مدرسة عدن الثانوية',
    nameEn: 'Aden Secondary School',
    type: 'education',
    position: [12.8250, 45.0300],
    district: 'كريتر',
    description: 'مدرسة ثانوية حكومية',
    descriptionEn: 'Government secondary school',
    icon: '🏫',
    color: '#059669',
    importance: 'medium',
    category: 'تعليمي',
    features: ['تعليم ثانوي', 'أنشطة طلابية', 'مكتبة'],
    rating: 4.0
  },

  // مرافق النقل
  {
    id: 'aden-airport',
    name: 'مطار عدن الدولي',
    nameEn: 'Aden International Airport',
    type: 'transport',
    position: [12.9000, 45.1000],
    district: 'خور مكسر',
    description: 'المطار الدولي الرئيسي في عدن',
    descriptionEn: 'Main international airport in Aden',
    icon: '✈️',
    color: '#0891b2',
    importance: 'high',
    category: 'نقل',
    features: ['رحلات دولية', 'خدمات مطار', 'مواقف سيارات'],
    rating: 4.0
  },
  {
    id: 'aden-port',
    name: 'ميناء عدن',
    nameEn: 'Aden Port',
    type: 'transport',
    position: [12.7900, 45.0000],
    district: 'التواهي',
    description: 'الميناء الرئيسي في عدن',
    descriptionEn: 'Main port in Aden',
    icon: '🚢',
    color: '#0891b2',
    importance: 'high',
    category: 'نقل',
    features: ['شحن بحري', 'ركاب', 'خدمات لوجستية'],
    rating: 4.1
  },

  // المرافق الدينية
  {
    id: 'aden-mosque',
    name: 'جامع عدن الكبير',
    nameEn: 'Great Aden Mosque',
    type: 'religious',
    position: [12.8270, 45.0330],
    district: 'كريتر',
    description: 'المسجد الرئيسي في عدن',
    descriptionEn: 'Main mosque in Aden',
    icon: '🕌',
    color: '#059669',
    importance: 'high',
    category: 'ديني',
    features: ['صلاة جماعة', 'دروس دينية', 'أنشطة اجتماعية'],
    rating: 4.5
  },
  {
    id: 'aden-church',
    name: 'كنيسة عدن',
    nameEn: 'Aden Church',
    type: 'religious',
    position: [12.8250, 45.0310],
    district: 'كريتر',
    description: 'كنيسة تاريخية في عدن',
    descriptionEn: 'Historic church in Aden',
    icon: '⛪',
    color: '#059669',
    importance: 'medium',
    category: 'ديني',
    features: ['عبادة', 'أنشطة دينية', 'تراث تاريخي'],
    rating: 4.3
  },

  // المرافق الترفيهية
  {
    id: 'aden-park',
    name: 'حديقة عدن العامة',
    nameEn: 'Aden Public Park',
    type: 'recreational',
    position: [12.8350, 45.0250],
    district: 'خور مكسر',
    description: 'حديقة عامة للعائلات',
    descriptionEn: 'Public park for families',
    icon: '🌳',
    color: '#059669',
    importance: 'medium',
    category: 'ترفيهي',
    features: ['مساحات خضراء', 'ألعاب أطفال', 'مشي'],
    rating: 4.2
  },
  {
    id: 'aden-stadium',
    name: 'ملعب عدن الرياضي',
    nameEn: 'Aden Sports Stadium',
    type: 'recreational',
    position: [12.8450, 45.0150],
    district: 'خور مكسر',
    description: 'ملعب رياضي متعدد الأغراض',
    descriptionEn: 'Multi-purpose sports stadium',
    icon: '⚽',
    color: '#059669',
    importance: 'medium',
    category: 'ترفيهي',
    features: ['مباريات كرة قدم', 'أنشطة رياضية', 'أحداث'],
    rating: 4.1
  }
];

// تصنيف المواقع حسب النوع
export const locationsByType = {
  historic: adenLocations.filter(loc => loc.type === 'historic'),
  residential: adenLocations.filter(loc => loc.type === 'residential'),
  industrial: adenLocations.filter(loc => loc.type === 'industrial'),
  commercial: adenLocations.filter(loc => loc.type === 'commercial'),
  tourist: adenLocations.filter(loc => loc.type === 'tourist'),
  government: adenLocations.filter(loc => loc.type === 'government'),
  health: adenLocations.filter(loc => loc.type === 'health'),
  education: adenLocations.filter(loc => loc.type === 'education'),
  transport: adenLocations.filter(loc => loc.type === 'transport'),
  religious: adenLocations.filter(loc => loc.type === 'religious'),
  recreational: adenLocations.filter(loc => loc.type === 'recreational')
};

// تصنيف المواقع حسب الأهمية
export const locationsByImportance = {
  high: adenLocations.filter(loc => loc.importance === 'high'),
  medium: adenLocations.filter(loc => loc.importance === 'medium'),
  low: adenLocations.filter(loc => loc.importance === 'low')
};

// تصنيف المواقع حسب المنطقة
export const locationsByDistrict = {
  'كريتر': adenLocations.filter(loc => loc.district === 'كريتر'),
  'المعلا': adenLocations.filter(loc => loc.district === 'المعلا'),
  'خور مكسر': adenLocations.filter(loc => loc.district === 'خور مكسر'),
  'التواهي': adenLocations.filter(loc => loc.district === 'التواهي'),
  'عدن الصغرى': adenLocations.filter(loc => loc.district === 'عدن الصغرى'),
  'بئر أحمد': adenLocations.filter(loc => loc.district === 'بئر أحمد')
};

// إحصائيات المواقع
export const locationStats = {
  total: adenLocations.length,
  byType: Object.keys(locationsByType).reduce((acc, type) => {
    acc[type] = locationsByType[type as keyof typeof locationsByType].length;
    return acc;
  }, {} as Record<string, number>),
  byImportance: Object.keys(locationsByImportance).reduce((acc, importance) => {
    acc[importance] = locationsByImportance[importance as keyof typeof locationsByImportance].length;
    return acc;
  }, {} as Record<string, number>),
  byDistrict: Object.keys(locationsByDistrict).reduce((acc, district) => {
    acc[district] = locationsByDistrict[district as keyof typeof locationsByDistrict].length;
    return acc;
  }, {} as Record<string, number>)
};
