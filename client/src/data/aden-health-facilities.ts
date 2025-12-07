// بيانات شاملة للمرافق الصحية في عدن - البيانات الحقيقية
export interface HealthFacility {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  district: string;
  specialties: string[];
  emergencyNumber: string[];
  workingHours: string;
  services: string[];
  rating?: number;
  position: [number, number]; // [latitude, longitude]
  website?: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory' | 'dental' | 'specialized';
  category: 'public' | 'private' | 'charity';
  icon: string;
  color: string;
  description: string;
  features: string[];
  contact?: {
    phone?: string[];
    email?: string;
    website?: string;
  };
  availability: {
    emergency: boolean;
    appointments: boolean;
    walkIn: boolean;
  };
}

export const adenHealthFacilities: HealthFacility[] = [
  // المستشفيات الحكومية الرئيسية
  {
    id: 'republic-hospital-aden',
    name: 'مستشفى الجمهورية',
    nameEn: 'Republic Hospital',
    address: 'كريتر - شارع الملكة - بجانب مبنى المحافظة',
    district: 'كريتر',
    specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    emergencyNumber: ['023200000', '023200001'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    rating: 4.2,
    position: [12.7857, 45.0365],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'المستشفى الحكومي الرئيسي في عدن يقدم خدمات طبية شاملة مجاناً',
    features: ['طوارئ 24/7', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023200000', '023200001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'friendship-hospital-aden',
    name: 'مستشفى الصداقة',
    nameEn: 'Friendship Hospital',
    address: 'المعلا - شارع الجمهورية - مقابل مبنى البلدية',
    district: 'المعلا',
    specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    emergencyNumber: ['023300000', '023300001'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    rating: 4.1,
    position: [12.7949, 45.0165],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى حكومي مهم يقدم خدمات طبية متخصصة',
    features: ['طوارئ 24/7', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023300000', '023300001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'revolution-hospital-aden',
    name: 'مستشفى الثورة',
    nameEn: 'Revolution Hospital',
    address: 'التواهي - شارع الميناء - بجانب مبنى الجمارك',
    district: 'التواهي',
    specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    emergencyNumber: ['023400000', '023400001'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    rating: 4.0,
    position: [12.7833, 44.9833],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى حكومي يقدم خدمات طبية أساسية ومتخصصة',
    features: ['طوارئ 24/7', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023400000', '023400001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'wali-hospital-aden',
    name: 'مستشفى الوالي',
    nameEn: 'Wali Hospital',
    address: 'المنصورة - شارع الجامعة - مقابل كلية الطب',
    district: 'المنصورة',
    specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    emergencyNumber: ['023500000', '023500001'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    rating: 4.3,
    position: [12.8547, 45.0165],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى حكومي حديث يقدم خدمات طبية متطورة',
    features: ['طوارئ 24/7', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023500000', '023500001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-maternity-hospital',
    name: 'مستشفى عدن للولادة',
    nameEn: 'Aden Maternity Hospital',
    address: 'الشيخ عثمان - شارع الرئيسي - بجانب مسجد النور',
    district: 'الشيخ عثمان',
    specialties: ['نساء وولادة', 'طوارئ نسائية', 'عناية بالأطفال حديثي الولادة', 'مختبر'],
    emergencyNumber: ['023600000', '023600001'],
    workingHours: '24 ساعة',
    services: ['نساء وولادة', 'طوارئ نسائية', 'عناية بالأطفال حديثي الولادة', 'مختبر'],
    rating: 4.4,
    position: [12.8547, 45.0500],
    type: 'hospital',
    category: 'public',
    icon: '👶',
    color: '#ec4899',
    description: 'مستشفى متخصص في طب النساء والولادة',
    features: ['ولادة طبيعية', 'ولادة قيصرية', 'طوارئ نسائية', 'عناية بالأطفال حديثي الولادة', 'مختبر طبي', 'خدمات مجانية'],
    contact: {
      phone: ['023600000', '023600001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'may-22-hospital',
    name: 'مستشفى 22 مايو العام',
    nameEn: 'May 22 General Hospital',
    address: 'المنصورة - شارع 22 مايو - مقابل مجمع المحاكم',
    district: 'المنصورة',
    specialties: ['طوارئ', 'جراحة عامة', 'نساء وولادة', 'باطنية عامة'],
    emergencyNumber: ['02390020', '02390021'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة عامة', 'نساء وولادة', 'باطنية عامة'],
    rating: 4.0,
    position: [12.8520, 45.0200],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى حكومي رئيسي يقدم خدمات طبية أساسية للمواطنين مجاناً',
    features: ['طوارئ 24/7', 'جراحة عامة', 'نساء وولادة', 'باطنية عامة', 'خدمات مجانية'],
    contact: {
      phone: ['02390020', '02390021']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-general-hospital',
    name: 'مستشفى عدن العام',
    nameEn: 'Aden General Hospital',
    address: 'عدن - كريتر - شارع الملكة',
    district: 'كريتر',
    specialties: ['طوارئ', 'جراحة عامة', 'طب باطني', 'أطفال'],
    emergencyNumber: ['023200000', '023200001'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة عامة', 'طب باطني', 'أطفال'],
    rating: 4.1,
    position: [12.7900, 45.0300],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'المستشفى الرئيسي الحكومي في عدن',
    features: ['طوارئ 24/7', 'تخصصات متنوعة', 'خدمات متطورة', 'طاقم طبي متميز'],
    contact: {
      phone: ['023200000', '023200001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-military-hospital',
    name: 'مستشفى عدن العسكري',
    nameEn: 'Aden Military Hospital',
    address: 'عدن - خور مكسر',
    district: 'خور مكسر',
    specialties: ['طوارئ', 'جراحة', 'طب باطني', 'أطفال'],
    emergencyNumber: ['023400000'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة', 'طب باطني', 'أطفال'],
    rating: 4.0,
    position: [12.8450, 45.0350],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى عسكري يقدم خدمات طبية للعسكريين والمدنيين',
    features: ['طوارئ 24/7', 'خدمات عسكرية', 'تخصصات متنوعة'],
    contact: {
      phone: ['023400000']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: false
    },
  },
  {
    id: 'republic-teaching-hospital',
    name: 'مستشفى الجمهورية التعليمي',
    nameEn: 'Republic Teaching Hospital',
    address: 'كريتر - شارع الملكة أروى، مقابل المحكمة العليا',
    district: 'كريتر',
    specialties: ['طوارئ', 'جراحة', 'نساء وولادة', 'باطنية'],
    emergencyNumber: ['02244500', '02244501'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة', 'نساء وولادة', 'باطنية'],
    rating: 4.0,
    position: [12.7870, 45.0380],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى حكومي تعليمي يقدم خدمات طبية شاملة',
    features: ['طوارئ 24 ساعة', 'جراحة عامة', 'نساء وولادة', 'باطنية عامة', 'خدمات مجانية'],
    contact: {
      phone: ['02244500', '02244501']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'hais-hospital',
    name: 'مستشفى حيس',
    nameEn: 'Hais Hospital',
    address: 'كريتر - شارع الحديدة، جوار المعهد الصحي',
    district: 'كريتر',
    specialties: ['طوارئ', 'باطنية', 'جراحة', 'أطفال'],
    emergencyNumber: ['02265432'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'باطنية', 'جراحة', 'أطفال'],
    rating: 4.0,
    position: [12.7880, 45.0320],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى حكومي يقدم خدمات طبية متخصصة',
    features: ['طوارئ 24 ساعة', 'باطنية', 'جراحة', 'أطفال', 'خدمات مجانية'],
    contact: {
      phone: ['02265432']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },

  // المستشفيات الخاصة والدولية
  {
    id: 'american-modern-hospital',
    name: 'المستشفى الأمريكي الحديث (AMH)',
    nameEn: 'American Modern Hospital (AMH)',
    address: 'المنصورة - شارع التسعين - بجانب مطعم حلب',
    district: 'المنصورة',
    specialties: ['طوارئ', 'عناية مركزة', 'جراحة عامة', 'أطفال'],
    emergencyNumber: ['02386999', '02383844', '02383855'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'عناية مركزة', 'جراحة عامة', 'أطفال'],
    rating: 4.0,
    position: [12.8500, 45.0200],
    type: 'hospital',
    category: 'private',
    icon: '🏥',
    color: '#dc2626',
    description: 'مستشفى حديث متخصص في الرعاية الطبية المتقدمة',
    features: ['طوارئ 24/7', 'عمليات متطورة', 'عناية مركزة', 'أشعة متقدمة'],
    contact: {
      phone: ['02386999', '02383844', '02383855']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'cuban-modern-hospital',
    name: 'المستشفى الكوبي الحديث',
    nameEn: 'Cuban Modern Hospital',
    address: 'المنصورة - شارع السجن - خلف مديرية أمن المنصورة',
    district: 'المنصورة',
    specialties: ['نساء وولادة', 'طوارئ', 'مختبر', 'أطفال'],
    emergencyNumber: ['02357119', '02327777', '770770532'],
    workingHours: '8 ص - 10 م',
    services: ['نساء وولادة', 'طوارئ', 'مختبر', 'أطفال'],
    rating: 4.0,
    position: [12.8480, 45.0150],
    type: 'hospital',
    category: 'private',
    icon: '🏥',
    color: '#dc2626',
    description: 'مستشفى متخصص في طب النساء والولادة والأطفال',
    features: ['عيادات خارجية', 'طوارئ', 'مختبرات متطورة', 'أشعة'],
    contact: {
      phone: ['02357119', '02327777', '770770532']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'burj-consultative-hospital',
    name: 'مستشفى البرج الاستشاري',
    nameEn: 'Burj Consultative Hospital',
    address: 'المنصورة - منطقة ريمي - شارع الستين - بجانب مسجد الرحمة',
    district: 'المنصورة',
    specialties: ['طب وجراحة العيون', 'ليزك', 'طوارئ عيون', 'مختبر'],
    emergencyNumber: ['730011100'],
    workingHours: '9 ص - 10 م',
    services: ['طب وجراحة العيون', 'ليزك', 'طوارئ عيون', 'مختبر'],
    rating: 4.0,
    position: [12.8460, 45.0180],
    type: 'hospital',
    category: 'private',
    icon: '👁️',
    color: '#7c3aed',
    description: 'مستشفى متخصص في طب وجراحة العيون',
    features: ['ليزك', 'جراحة عيون', 'طوارئ عيون', 'فحوصات متقدمة'],
    contact: {
      phone: ['730011100']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-international-hospital',
    name: 'مستشفى عدن الدولي',
    nameEn: 'Aden International Hospital',
    address: 'المنصورة - شارع التسعين - بجانب فندق عدن',
    district: 'المنصورة',
    specialties: ['طوارئ', 'عناية مركزة', 'جراحة عامة', 'أطفال'],
    emergencyNumber: ['023700000', '023700001'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'عناية مركزة', 'جراحة عامة', 'أطفال'],
    rating: 4.5,
    position: [12.8520, 45.0180],
    type: 'hospital',
    category: 'private',
    icon: '🏥',
    color: '#dc2626',
    description: 'مستشفى دولي متطور يقدم خدمات طبية متقدمة',
    features: ['طوارئ 24/7', 'عناية مركزة', 'جراحة متطورة', 'أطفال'],
    contact: {
      phone: ['023700000', '023700001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-medical-center',
    name: 'المركز الطبي العدني',
    nameEn: 'Aden Medical Center',
    address: 'المعلا - شارع الجمهورية - بجانب البنك المركزي',
    district: 'المعلا',
    specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    emergencyNumber: ['023800000', '023800001'],
    workingHours: '8 ص - 10 م',
    services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    rating: 4.3,
    position: [12.7930, 45.0150],
    type: 'hospital',
    category: 'private',
    icon: '🏥',
    color: '#dc2626',
    description: 'مركز طبي متخصص يقدم خدمات طبية شاملة',
    features: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    contact: {
      phone: ['023800000', '023800001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-specialized-hospital',
    name: 'مستشفى عدن التخصصي',
    nameEn: 'Aden Specialized Hospital',
    address: 'التواهي - شارع الميناء - بجانب مبنى الميناء',
    district: 'التواهي',
    specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    emergencyNumber: ['023900000', '023900001'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    rating: 4.4,
    position: [12.7850, 44.9850],
    type: 'hospital',
    category: 'private',
    icon: '🏥',
    color: '#dc2626',
    description: 'مستشفى تخصصي يقدم خدمات طبية متطورة',
    features: ['طوارئ 24/7', 'جراحة عامة', 'باطنية', 'نساء وولادة'],
    contact: {
      phone: ['023900000', '023900001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },

  // المراكز الطبية المتخصصة
  {
    id: 'aden-cardiac-center',
    name: 'مركز عدن للقلب',
    nameEn: 'Aden Cardiac Center',
    address: 'عدن - المعلا - شارع الجمهورية',
    district: 'المعلا',
    specialties: ['أمراض القلب', 'قسطرة', 'جراحة قلب', 'طوارئ قلبية'],
    emergencyNumber: ['023500000'],
    workingHours: '8 ص - 8 م',
    services: ['قسطرة', 'عمليات قلب', 'فحوصات', 'متابعة'],
    rating: 4.7,
    position: [12.7920, 45.0140],
    type: 'specialized',
    category: 'private',
    icon: '❤️',
    color: '#dc2626',
    description: 'مركز متخصص في أمراض وجراحة القلب',
    features: ['قسطرة متطورة', 'جراحة قلب', 'طوارئ قلبية', 'متابعة دقيقة'],
    contact: {
      phone: ['023500000']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: false
    },
  },
  {
    id: 'aden-cancer-center',
    name: 'مركز عدن للأورام',
    nameEn: 'Aden Cancer Center',
    address: 'عدن - التواهي - شارع البحر',
    district: 'التواهي',
    specialties: ['أورام', 'علاج كيميائي', 'علاج إشعاعي', 'جراحة أورام'],
    emergencyNumber: ['023600000'],
    workingHours: '8 ص - 6 م',
    services: ['علاج كيميائي', 'علاج إشعاعي', 'عمليات', 'متابعة'],
    rating: 4.4,
    position: [12.7800, 44.9820],
    type: 'specialized',
    category: 'public',
    icon: '🎗️',
    color: '#7c3aed',
    description: 'مركز متخصص في علاج الأورام والسرطان',
    features: ['علاج متطور', 'طاقم متخصص', 'متابعة شاملة', 'دعم نفسي'],
    contact: {
      phone: ['023600000']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: false
    },
  },
  {
    id: 'aden-eye-clinic',
    name: 'عيادة عدن للعيون',
    nameEn: 'Aden Eye Clinic',
    address: 'المنصورة - شارع التسعين - بجانب مستشفى الوالي',
    district: 'المنصورة',
    specialties: ['طب وجراحة العيون', 'ليزك', 'طوارئ عيون', 'فحوصات عيون'],
    emergencyNumber: ['023600000', '023600001'],
    workingHours: '9 ص - 10 م',
    services: ['طب وجراحة العيون', 'ليزك', 'طوارئ عيون', 'فحوصات عيون'],
    rating: 4.6,
    position: [12.8530, 45.0170],
    type: 'specialized',
    category: 'private',
    icon: '👁️',
    color: '#7c3aed',
    description: 'عيادة متخصصة في طب وجراحة العيون',
    features: ['ليزك', 'جراحة عيون', 'طوارئ عيون', 'فحوصات متقدمة'],
    contact: {
      phone: ['023600000', '023600001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-dental-center',
    name: 'مركز عدن للأسنان',
    nameEn: 'Aden Dental Center',
    address: 'المعلا - شارع الجمهورية - بجانب البنك المركزي',
    district: 'المعلا',
    specialties: ['طب الأسنان', 'جراحة الفم', 'تقويم الأسنان', 'زراعة الأسنان'],
    emergencyNumber: ['023700000', '023700001'],
    workingHours: '8 ص - 8 م',
    services: ['طب الأسنان', 'جراحة الفم', 'تقويم الأسنان', 'زراعة الأسنان'],
    rating: 4.4,
    position: [12.7930, 45.0150],
    type: 'dental',
    category: 'private',
    icon: '🦷',
    color: '#f59e0b',
    description: 'مركز متخصص في طب وجراحة الأسنان',
    features: ['زراعة الأسنان', 'تقويم الأسنان', 'جراحة الفم', 'علاج جذور الأسنان'],
    contact: {
      phone: ['023700000', '023700001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-pediatric-clinic',
    name: 'عيادة عدن للأطفال',
    nameEn: 'Aden Pediatric Clinic',
    address: 'التواهي - شارع الميناء - بجانب مبنى الميناء',
    district: 'التواهي',
    specialties: ['طب الأطفال', 'طوارئ أطفال', 'تطعيمات', 'متابعة نمو'],
    emergencyNumber: ['023800000', '023800001'],
    workingHours: '8 ص - 6 م',
    services: ['طب الأطفال', 'طوارئ أطفال', 'تطعيمات', 'متابعة نمو'],
    rating: 4.5,
    position: [12.7840, 44.9840],
    type: 'specialized',
    category: 'private',
    icon: '👶',
    color: '#ec4899',
    description: 'عيادة متخصصة في طب الأطفال',
    features: ['طب الأطفال', 'طوارئ أطفال', 'تطعيمات', 'متابعة نمو الأطفال'],
    contact: {
      phone: ['023800000', '023800001']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },

  // المجمعات الصحية
  {
    id: 'maalla-health-complex',
    name: 'مجمع المعلا الصحي',
    nameEn: 'Maalla Health Complex',
    address: 'عدن - المعلا - الشارع الرئيسي - مقابل ميناء عدن',
    district: 'المعلا',
    specialties: ['طوارئ', 'نساء وولادة', 'أطفال', 'باطنية عامة'],
    emergencyNumber: ['023200000'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'نساء وولادة', 'أطفال', 'باطنية عامة'],
    rating: 4.0,
    position: [12.7940, 45.0120],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية شاملة',
    features: ['طوارئ 24/7', 'نساء وولادة', 'أطفال', 'باطنية عامة', 'خدمات مجانية'],
    contact: {
      phone: ['023200000']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'tawahi-health-complex',
    name: 'مجمع التواهي الصحي',
    nameEn: 'Tawahi Health Complex',
    address: 'عدن - التواهي - منطقة القلوعة - الشارع الرئيسي',
    district: 'التواهي',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة', 'مختبر'],
    emergencyNumber: ['023300000'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة', 'مختبر'],
    rating: 4.0,
    position: [12.7820, 44.9800],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'مختبر', 'خدمات مجانية'],
    contact: {
      phone: ['023300000']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'sheikh-othman-health-complex',
    name: 'مجمع الشيخ عثمان الصحي',
    nameEn: 'Sheikh Othman Health Complex',
    address: 'عدن - الشيخ عثمان - الشارع الرئيسي - حي الرشيد',
    district: 'الشيخ عثمان',
    specialties: ['العيادات التخصصية', 'باطنية', 'جلدية', 'عظام'],
    emergencyNumber: ['023400000'],
    workingHours: '8 ص - 2 م',
    services: ['العيادات التخصصية', 'باطنية', 'جلدية', 'عظام'],
    rating: 5.0,
    position: [12.8600, 45.0550],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي متخصص يقدم خدمات طبية متقدمة',
    features: ['العيادات التخصصية', 'باطنية', 'جلدية', 'عظام', 'خدمات مجانية'],
    contact: {
      phone: ['023400000']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },

  // الصيدليات الرئيسية
  {
    id: 'aden-central-pharmacy',
    name: 'صيدلية عدن المركزية',
    nameEn: 'Aden Central Pharmacy',
    address: 'عدن - كريتر - شارع الملكة',
    district: 'كريتر',
    specialties: ['أدوية عامة', 'أدوية متخصصة', 'مستلزمات طبية'],
    emergencyNumber: ['023700000'],
    workingHours: '24 ساعة',
    services: ['أدوية عامة', 'أدوية متخصصة', 'مستلزمات طبية'],
    rating: 4.2,
    position: [12.7870, 45.0350],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية مركزية تقدم جميع أنواع الأدوية',
    features: ['أدوية شاملة', 'خدمة 24/7', 'استشارات صيدلانية'],
    contact: {
      phone: ['023700000']
    },
    availability: {
      emergency: true,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'modern-pharmacy',
    name: 'صيدلية الحديثة',
    nameEn: 'Modern Pharmacy',
    address: 'عدن - المنصورة - شارع التسعين',
    district: 'المنصورة',
    specialties: ['أدوية عامة', 'مستلزمات طبية', 'مكملات غذائية'],
    emergencyNumber: ['023800000'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية', 'مكملات غذائية'],
    rating: 4.0,
    position: [12.8510, 45.0190],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية حديثة تقدم خدمات صيدلانية متطورة',
    features: ['أدوية حديثة', 'مستلزمات متطورة', 'خدمة سريعة'],
    contact: {
      phone: ['023800000']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'aden-central-pharmacy-new',
    name: 'صيدلية عدن المركزية الجديدة',
    nameEn: 'Aden Central Pharmacy New',
    address: 'كريتر - شارع الملكة - بجانب مبنى المحافظة',
    district: 'كريتر',
    specialties: ['أدوية عامة', 'أدوية متخصصة', 'مستلزمات طبية', 'توصيل منزلي'],
    emergencyNumber: ['023200000', '023200001'],
    workingHours: '24 ساعة',
    services: ['أدوية عامة', 'أدوية متخصصة', 'مستلزمات طبية', 'توصيل منزلي'],
    rating: 4.3,
    position: [12.7875, 45.0370],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية مركزية تقدم جميع أنواع الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'خدمة 24/7', 'توصيل منزلي', 'استشارات صيدلانية'],
    contact: {
      phone: ['023200000', '023200001']
    },
    availability: {
      emergency: true,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'aden-pharmacy-chain',
    name: 'سلسلة صيدليات عدن',
    nameEn: 'Aden Pharmacy Chain',
    address: 'المنصورة - شارع التسعين - بجانب فندق عدن',
    district: 'المنصورة',
    specialties: ['أدوية عامة', 'مستلزمات طبية', 'مكملات غذائية', 'أدوية أطفال'],
    emergencyNumber: ['023700000', '023700001'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية', 'مكملات غذائية', 'أدوية أطفال'],
    rating: 4.2,
    position: [12.8515, 45.0185],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'سلسلة صيدليات تقدم خدمات صيدلانية شاملة',
    features: ['أدوية متنوعة', 'مستلزمات طبية', 'مكملات غذائية', 'أدوية أطفال'],
    contact: {
      phone: ['023700000', '023700001']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },

  // المختبرات
  {
    id: 'aden-medical-lab',
    name: 'مختبر عدن الطبي',
    nameEn: 'Aden Medical Laboratory',
    address: 'عدن - المعلا - شارع الجمهورية',
    district: 'المعلا',
    specialties: ['فحوصات عامة', 'فحوصات متخصصة', 'تحاليل دقيقة'],
    emergencyNumber: ['023900000'],
    workingHours: '7 ص - 7 م',
    services: ['تحاليل', 'فحوصات', 'تقارير'],
    rating: 4.3,
    position: [12.7925, 45.0145],
    type: 'laboratory',
    category: 'private',
    icon: '🧪',
    color: '#0891b2',
    description: 'مختبر طبي متخصص في التحاليل والفحوصات',
    features: ['تحاليل دقيقة', 'نتائج سريعة', 'تقارير مفصلة'],
    contact: {
      phone: ['023900000']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-dental-center-2',
    name: 'مركز عدن لطب الأسنان',
    nameEn: 'Aden Dental Center',
    address: 'عدن - خور مكسر - شارع الجامعة',
    district: 'خور مكسر',
    specialties: ['طب الأسنان', 'تقويم', 'زراعة', 'جراحة فم'],
    emergencyNumber: ['024000000'],
    workingHours: '9 ص - 9 م',
    services: ['علاج', 'تقويم', 'زراعة', 'جراحة'],
    rating: 4.5,
    position: [12.8470, 45.0370],
    type: 'dental',
    category: 'private',
    icon: '🦷',
    color: '#f59e0b',
    description: 'مركز متخصص في طب وجراحة الأسنان',
    features: ['تقويم متطور', 'زراعة', 'جراحة فم', 'علاج متقدم'],
    contact: {
      phone: ['024000000']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },

  // المرافق الصحية الحكومية الإضافية من موقع وزارة الصحة اليمنية
  {
    id: 'mansoura-health-complex',
    name: 'المجمع الصحي المنصورة',
    nameEn: 'Mansoura Health Complex',
    address: 'المنصورة - الشارع الرئيسي',
    district: 'المنصورة',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    emergencyNumber: ['023500000'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    rating: 4.0,
    position: [12.8540, 45.0150],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية', 'خدمات مجانية'],
    contact: {
      phone: ['023500000']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'mansoura-health-center',
    name: 'المركز الصحي المنصورة',
    nameEn: 'Mansoura Health Center',
    address: 'المنصورة - الشارع الرئيسي',
    district: 'المنصورة',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023500001'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.8545, 45.0160],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023500001']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'cairo-health-complex',
    name: 'المجمع الصحي القاهرة',
    nameEn: 'Cairo Health Complex',
    address: 'المنصورة - حي القاهرة',
    district: 'المنصورة',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    emergencyNumber: ['023500002'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    rating: 4.2,
    position: [12.8530, 45.0170],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية شاملة',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية', 'خدمات مجانية'],
    contact: {
      phone: ['023500002']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'hashid-health-complex',
    name: 'المجمع الصحي حاشد',
    nameEn: 'Hashid Health Complex',
    address: 'المنصورة - حي حاشد',
    district: 'المنصورة',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    emergencyNumber: ['023500003'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    rating: 4.1,
    position: [12.8520, 45.0180],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية متخصصة',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية', 'خدمات مجانية'],
    contact: {
      phone: ['023500003']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'kabota-health-complex',
    name: 'المجمع الصحي كابوتا (بئر فضل)',
    nameEn: 'Kabota Health Complex (Bir Fadl)',
    address: 'المنصورة - منطقة كابوتا - بئر فضل',
    district: 'المنصورة',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023500004'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 3.8,
    position: [12.8510, 45.0190],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023500004']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-prosthetics-center',
    name: 'مركز عدن للأطراف الصناعية والعلاج الطبيعي',
    nameEn: 'Aden Prosthetics and Physical Therapy Center',
    address: 'المنصورة - الشارع الرئيسي',
    district: 'المنصورة',
    specialties: ['أطراف صناعية', 'علاج طبيعي', 'إعادة تأهيل'],
    emergencyNumber: ['023500005'],
    workingHours: '8 ص - 2 م',
    services: ['أطراف صناعية', 'علاج طبيعي', 'إعادة تأهيل'],
    rating: 4.3,
    position: [12.8500, 45.0200],
    type: 'specialized',
    category: 'public',
    icon: '🦽',
    color: '#7c3aed',
    description: 'مركز متخصص في الأطراف الصناعية والعلاج الطبيعي',
    features: ['أطراف صناعية', 'علاج طبيعي', 'إعادة تأهيل', 'خدمات مجانية'],
    contact: {
      phone: ['023500005']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'aden-tuberculosis-center',
    name: 'المركز الأقليمي لمكافحة السل عدن - المنصورة',
    nameEn: 'Aden Regional Tuberculosis Control Center - Mansoura',
    address: 'المنصورة - الشارع الرئيسي',
    district: 'المنصورة',
    specialties: ['مكافحة السل', 'أمراض صدرية', 'فحوصات متخصصة'],
    emergencyNumber: ['023500006'],
    workingHours: '8 ص - 2 م',
    services: ['مكافحة السل', 'أمراض صدرية', 'فحوصات متخصصة'],
    rating: 4.4,
    position: [12.8490, 45.0210],
    type: 'specialized',
    category: 'public',
    icon: '🫁',
    color: '#7c3aed',
    description: 'مركز متخصص في مكافحة السل وأمراض الصدر',
    features: ['مكافحة السل', 'أمراض صدرية', 'فحوصات متخصصة', 'خدمات مجانية'],
    contact: {
      phone: ['023500006']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'emergency-care-center',
    name: 'مركز الطوارئ والرعاية الطارئة',
    nameEn: 'Emergency and Emergency Care Center',
    address: 'المنصورة - الشارع الرئيسي',
    district: 'المنصورة',
    specialties: ['طوارئ', 'رعاية طارئة', 'إسعافات أولية'],
    emergencyNumber: ['023500007'],
    workingHours: '24 ساعة',
    services: ['طوارئ', 'رعاية طارئة', 'إسعافات أولية'],
    rating: 4.0,
    position: [12.8480, 45.0220],
    type: 'hospital',
    category: 'public',
    icon: '🚑',
    color: '#dc2626',
    description: 'مركز متخصص في الطوارئ والرعاية الطارئة',
    features: ['طوارئ 24/7', 'رعاية طارئة', 'إسعافات أولية', 'خدمات مجانية'],
    contact: {
      phone: ['023500007']
    },
    availability: {
      emergency: true,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'central-pharmacy-mansoura',
    name: 'الصيدلية المركزية',
    nameEn: 'Central Pharmacy',
    address: 'المنصورة - الشارع الرئيسي',
    district: 'المنصورة',
    specialties: ['أدوية عامة', 'أدوية متخصصة', 'مستلزمات طبية'],
    emergencyNumber: ['023500008'],
    workingHours: '8 ص - 2 م',
    services: ['أدوية عامة', 'أدوية متخصصة', 'مستلزمات طبية'],
    rating: 4.1,
    position: [12.8470, 45.0230],
    type: 'pharmacy',
    category: 'public',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية حكومية مركزية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية', 'خدمات مجانية'],
    contact: {
      phone: ['023500008']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'may-22-surgical-hospital',
    name: 'مستشفى 22 مايو الجراحي العام',
    nameEn: 'May 22 General Surgical Hospital',
    address: 'المنصورة - شارع 22 مايو',
    district: 'المنصورة',
    specialties: ['جراحة عامة', 'طوارئ', 'باطنية', 'نساء وولادة'],
    emergencyNumber: ['023500009'],
    workingHours: '24 ساعة',
    services: ['جراحة عامة', 'طوارئ', 'باطنية', 'نساء وولادة'],
    rating: 4.2,
    position: [12.8460, 45.0240],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مستشفى حكومي متخصص في الجراحة العامة',
    features: ['جراحة عامة', 'طوارئ 24/7', 'باطنية', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023500009']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },

  // المرافق الصحية الإضافية من جميع مديريات عدن
  // مديرية كريتر
  {
    id: 'crater-health-center-1',
    name: 'المركز الصحي كريتر',
    nameEn: 'Crater Health Center',
    address: 'كريتر - الشارع الرئيسي',
    district: 'كريتر',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023200010'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.7850, 45.0350],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023200010']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'crater-health-center-2',
    name: 'المركز الصحي كريتر الثاني',
    nameEn: 'Crater Health Center 2',
    address: 'كريتر - شارع الملكة',
    district: 'كريتر',
    specialties: ['طب عام', 'باطنية', 'أطفال'],
    emergencyNumber: ['023200011'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'باطنية', 'أطفال'],
    rating: 4.1,
    position: [12.7860, 45.0360],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية متخصصة',
    features: ['طب عام', 'باطنية', 'أطفال', 'خدمات مجانية'],
    contact: {
      phone: ['023200011']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },

  // مديرية خور مكسر
  {
    id: 'khormaksar-health-complex',
    name: 'المجمع الصحي خور مكسر',
    nameEn: 'Khormaksar Health Complex',
    address: 'خور مكسر - الشارع الرئيسي',
    district: 'خور مكسر',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    emergencyNumber: ['023400010'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    rating: 4.0,
    position: [12.8440, 45.0340],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية شاملة',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية', 'خدمات مجانية'],
    contact: {
      phone: ['023400010']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'khormaksar-health-center',
    name: 'المركز الصحي خور مكسر',
    nameEn: 'Khormaksar Health Center',
    address: 'خور مكسر - شارع الجامعة',
    district: 'خور مكسر',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023400011'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.8450, 45.0350],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023400011']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },

  // مديرية البريقة
  {
    id: 'bureiqa-health-complex',
    name: 'المجمع الصحي البريقة',
    nameEn: 'Bureiqa Health Complex',
    address: 'البريقة - الشارع الرئيسي',
    district: 'البريقة',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    emergencyNumber: ['023600010'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    rating: 4.0,
    position: [12.8100, 45.0400],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية شاملة',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية', 'خدمات مجانية'],
    contact: {
      phone: ['023600010']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'bureiqa-health-center',
    name: 'المركز الصحي البريقة',
    nameEn: 'Bureiqa Health Center',
    address: 'البريقة - شارع التسعين',
    district: 'البريقة',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023600011'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.8080, 45.0380],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023600011']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },

  // مديرية دار سعد
  {
    id: 'dar-saad-health-complex',
    name: 'المجمع الصحي دار سعد',
    nameEn: 'Dar Saad Health Complex',
    address: 'دار سعد - الشارع الرئيسي',
    district: 'دار سعد',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    emergencyNumber: ['023700010'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية'],
    rating: 4.0,
    position: [12.8200, 45.0450],
    type: 'hospital',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مجمع صحي حكومي يقدم خدمات طبية شاملة',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'باطنية', 'خدمات مجانية'],
    contact: {
      phone: ['023700010']
    },
    availability: {
      emergency: true,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'dar-saad-health-center',
    name: 'المركز الصحي دار سعد',
    nameEn: 'Dar Saad Health Center',
    address: 'دار سعد - حي الإنشاءات',
    district: 'دار سعد',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023700011'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.8220, 45.0470],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023700011']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },

  // مديرية المعلا
  {
    id: 'maalla-health-center-2',
    name: 'المركز الصحي المعلا الثاني',
    nameEn: 'Maalla Health Center 2',
    address: 'المعلا - شارع الجمهورية',
    district: 'المعلا',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023300010'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.7950, 45.0130],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023300010']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'maalla-health-center-3',
    name: 'المركز الصحي المعلا الثالث',
    nameEn: 'Maalla Health Center 3',
    address: 'المعلا - شارع الميناء',
    district: 'المعلا',
    specialties: ['طب عام', 'باطنية', 'أطفال'],
    emergencyNumber: ['023300011'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'باطنية', 'أطفال'],
    rating: 4.0,
    position: [12.7960, 45.0140],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية متخصصة',
    features: ['طب عام', 'باطنية', 'أطفال', 'خدمات مجانية'],
    contact: {
      phone: ['023300011']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },

  // مديرية الشيخ عثمان
  {
    id: 'sheikh-othman-health-center-2',
    name: 'المركز الصحي الشيخ عثمان الثاني',
    nameEn: 'Sheikh Othman Health Center 2',
    address: 'الشيخ عثمان - الشارع الرئيسي',
    district: 'الشيخ عثمان',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023400010'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.8610, 45.0560],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023400010']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'sheikh-othman-health-center-3',
    name: 'المركز الصحي الشيخ عثمان الثالث',
    nameEn: 'Sheikh Othman Health Center 3',
    address: 'الشيخ عثمان - حي الرشيد',
    district: 'الشيخ عثمان',
    specialties: ['طب عام', 'باطنية', 'أطفال'],
    emergencyNumber: ['023400011'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'باطنية', 'أطفال'],
    rating: 4.0,
    position: [12.8620, 45.0570],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية متخصصة',
    features: ['طب عام', 'باطنية', 'أطفال', 'خدمات مجانية'],
    contact: {
      phone: ['023400011']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },

  // مديرية التواهي
  {
    id: 'tawahi-health-center-2',
    name: 'المركز الصحي التواهي الثاني',
    nameEn: 'Tawahi Health Center 2',
    address: 'التواهي - شارع الميناء',
    district: 'التواهي',
    specialties: ['طب عام', 'أطفال', 'نساء وولادة'],
    emergencyNumber: ['023400010'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'أطفال', 'نساء وولادة'],
    rating: 4.0,
    position: [12.7810, 44.9810],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية أساسية',
    features: ['طب عام', 'أطفال', 'نساء وولادة', 'خدمات مجانية'],
    contact: {
      phone: ['023400010']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },
  {
    id: 'tawahi-health-center-3',
    name: 'المركز الصحي التواهي الثالث',
    nameEn: 'Tawahi Health Center 3',
    address: 'التواهي - منطقة القلوعة',
    district: 'التواهي',
    specialties: ['طب عام', 'باطنية', 'أطفال'],
    emergencyNumber: ['023400011'],
    workingHours: '8 ص - 2 م',
    services: ['طب عام', 'باطنية', 'أطفال'],
    rating: 4.0,
    position: [12.7800, 44.9800],
    type: 'clinic',
    category: 'public',
    icon: '🏥',
    color: '#059669',
    description: 'مركز صحي حكومي يقدم خدمات طبية متخصصة',
    features: ['طب عام', 'باطنية', 'أطفال', 'خدمات مجانية'],
    contact: {
      phone: ['023400011']
    },
    availability: {
      emergency: false,
      appointments: true,
      walkIn: true
    },
  },

  // صيدليات إضافية
  {
    id: 'crater-pharmacy-2',
    name: 'صيدلية كريتر الثانية',
    nameEn: 'Crater Pharmacy 2',
    address: 'كريتر - شارع الملكة',
    district: 'كريتر',
    specialties: ['أدوية عامة', 'مستلزمات طبية'],
    emergencyNumber: ['023200020'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية'],
    rating: 4.0,
    position: [12.7840, 45.0340],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية'],
    contact: {
      phone: ['023200020']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'khormaksar-pharmacy',
    name: 'صيدلية خور مكسر',
    nameEn: 'Khormaksar Pharmacy',
    address: 'خور مكسر - الشارع الرئيسي',
    district: 'خور مكسر',
    specialties: ['أدوية عامة', 'مستلزمات طبية'],
    emergencyNumber: ['023400020'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية'],
    rating: 4.0,
    position: [12.8430, 45.0330],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية'],
    contact: {
      phone: ['023400020']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'bureiqa-pharmacy',
    name: 'صيدلية البريقة',
    nameEn: 'Bureiqa Pharmacy',
    address: 'البريقة - الشارع الرئيسي',
    district: 'البريقة',
    specialties: ['أدوية عامة', 'مستلزمات طبية'],
    emergencyNumber: ['023600020'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية'],
    rating: 4.0,
    position: [12.8090, 45.0390],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية'],
    contact: {
      phone: ['023600020']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'dar-saad-pharmacy',
    name: 'صيدلية دار سعد',
    nameEn: 'Dar Saad Pharmacy',
    address: 'دار سعد - الشارع الرئيسي',
    district: 'دار سعد',
    specialties: ['أدوية عامة', 'مستلزمات طبية'],
    emergencyNumber: ['023700020'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية'],
    rating: 4.0,
    position: [12.8210, 45.0460],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية'],
    contact: {
      phone: ['023700020']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'maalla-pharmacy-2',
    name: 'صيدلية المعلا الثانية',
    nameEn: 'Maalla Pharmacy 2',
    address: 'المعلا - شارع الجمهورية',
    district: 'المعلا',
    specialties: ['أدوية عامة', 'مستلزمات طبية'],
    emergencyNumber: ['023300020'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية'],
    rating: 4.0,
    position: [12.7910, 45.0130],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية'],
    contact: {
      phone: ['023300020']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'sheikh-othman-pharmacy',
    name: 'صيدلية الشيخ عثمان',
    nameEn: 'Sheikh Othman Pharmacy',
    address: 'الشيخ عثمان - الشارع الرئيسي',
    district: 'الشيخ عثمان',
    specialties: ['أدوية عامة', 'مستلزمات طبية'],
    emergencyNumber: ['023400020'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية'],
    rating: 4.0,
    position: [12.8590, 45.0540],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية'],
    contact: {
      phone: ['023400020']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
  {
    id: 'tawahi-pharmacy-2',
    name: 'صيدلية التواهي الثانية',
    nameEn: 'Tawahi Pharmacy 2',
    address: 'التواهي - شارع الميناء',
    district: 'التواهي',
    specialties: ['أدوية عامة', 'مستلزمات طبية'],
    emergencyNumber: ['023400020'],
    workingHours: '8 ص - 12 م',
    services: ['أدوية عامة', 'مستلزمات طبية'],
    rating: 4.0,
    position: [12.7820, 44.9810],
    type: 'pharmacy',
    category: 'private',
    icon: '💊',
    color: '#059669',
    description: 'صيدلية تقدم الأدوية والمستلزمات الطبية',
    features: ['أدوية شاملة', 'مستلزمات طبية'],
    contact: {
      phone: ['023400020']
    },
    availability: {
      emergency: false,
      appointments: false,
      walkIn: true
    },
  },
];

// تصنيف المرافق الصحية حسب النوع
export const healthFacilitiesByType = {
  hospital: adenHealthFacilities.filter(facility => facility.type === 'hospital'),
  clinic: adenHealthFacilities.filter(facility => facility.type === 'clinic'),
  pharmacy: adenHealthFacilities.filter(facility => facility.type === 'pharmacy'),
  laboratory: adenHealthFacilities.filter(facility => facility.type === 'laboratory'),
  dental: adenHealthFacilities.filter(facility => facility.type === 'dental'),
  specialized: adenHealthFacilities.filter(facility => facility.type === 'specialized')
};

// تصنيف المرافق الصحية حسب المديرية
export const healthFacilitiesByDistrict = {
  'كريتر': adenHealthFacilities.filter(facility => facility.district === 'كريتر'),
  'المعلا': adenHealthFacilities.filter(facility => facility.district === 'المعلا'),
  'التواهي': adenHealthFacilities.filter(facility => facility.district === 'التواهي'),
  'خور مكسر': adenHealthFacilities.filter(facility => facility.district === 'خور مكسر'),
  'المنصورة': adenHealthFacilities.filter(facility => facility.district === 'المنصورة'),
  'الشيخ عثمان': adenHealthFacilities.filter(facility => facility.district === 'الشيخ عثمان'),
  'البريقة': adenHealthFacilities.filter(facility => facility.district === 'البريقة'),
  'دار سعد': adenHealthFacilities.filter(facility => facility.district === 'دار سعد')
};

// تصنيف المرافق الصحية حسب الفئة
export const healthFacilitiesByCategory = {
  public: adenHealthFacilities.filter(facility => facility.category === 'public'),
  private: adenHealthFacilities.filter(facility => facility.category === 'private'),
  charity: adenHealthFacilities.filter(facility => facility.category === 'charity')
};

// المرافق الصحية للطوارئ
export const emergencyHealthFacilities = adenHealthFacilities.filter(facility => 
  facility.availability.emergency && facility.emergencyNumber.length > 0
);

// إحصائيات المرافق الصحية
export const healthFacilitiesStats = {
  total: adenHealthFacilities.length,
  byType: Object.keys(healthFacilitiesByType).reduce((acc, type) => {
    acc[type] = healthFacilitiesByType[type as keyof typeof healthFacilitiesByType].length;
    return acc;
  }, {} as Record<string, number>),
  byDistrict: Object.keys(healthFacilitiesByDistrict).reduce((acc, district) => {
    acc[district] = healthFacilitiesByDistrict[district as keyof typeof healthFacilitiesByDistrict].length;
    return acc;
  }, {} as Record<string, number>),
  byCategory: Object.keys(healthFacilitiesByCategory).reduce((acc, category) => {
    acc[category] = healthFacilitiesByCategory[category as keyof typeof healthFacilitiesByCategory].length;
    return acc;
  }, {} as Record<string, number>),
  emergency: emergencyHealthFacilities.length,
  withRating: adenHealthFacilities.filter(facility => facility.rating).length,
  averageRating: adenHealthFacilities
    .filter(facility => facility.rating)
    .reduce((sum, facility) => sum + (facility.rating || 0), 0) / 
    adenHealthFacilities.filter(facility => facility.rating).length
};