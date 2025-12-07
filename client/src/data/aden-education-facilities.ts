// بيانات المرافق التعليمية في عدن
export interface EducationFacility {
  id: string;
  name: string;
  nameEn: string;
  type: 'school' | 'university' | 'college' | 'institute' | 'kindergarten';
  category: 'public' | 'private' | 'international';
  level: 'primary' | 'intermediate' | 'secondary' | 'university' | 'mixed';
  address: string;
  district: string;
  specialties: string[];
  phoneNumbers: string[];
  workingHours: string;
  services: string[];
  rating?: number;
  position: [number, number]; // [latitude, longitude]
  website?: string;
  email?: string;
  description: string;
  features: string[];
  contact?: {
    phone?: string[];
    email?: string;
    website?: string;
  };
  availability: {
    enrollment: boolean;
    onlineRegistration: boolean;
    walkIn: boolean;
  };
  academicYear: string;
  tuitionFees?: {
    min: number;
    max: number;
    currency: string;
  };
  icon: string;
  color: string;
}

export const adenEducationFacilities: EducationFacility[] = [
  // المدارس الحكومية
  {
    id: "school_001",
    name: "مدرسة الجمهورية الابتدائية",
    nameEn: "Al-Jumhuriya Primary School",
    type: "school",
    category: "public",
    level: "primary",
    address: "شارع الجمهورية، مديرية صيرة",
    district: "صيرة",
    specialties: ["تعليم أساسي", "رياضيات", "علوم", "لغة عربية"],
    phoneNumbers: ["+967-2-123456"],
    workingHours: "7:30 ص - 12:30 م (الأحد - الخميس)",
    services: ["تعليم أساسي", "أنشطة رياضية", "مكتبة", "مختبر علوم"],
    rating: 4.2,
    position: [12.8333, 44.9817],
    website: "https://example.com",
    email: "info@example.com",
    description: "مدرسة حكومية للتعليم الأساسي",
    features: ["فصول مجهزة", "ملعب", "مكتبة", "مختبر"],
    contact: {
      phone: ["+967-2-123456"],
      email: "info@example.com",
      website: "https://example.com"
    },
    availability: {
      enrollment: true,
      onlineRegistration: false,
      walkIn: true
    },
    academicYear: "2024-2025",
    icon: "🏫",
    color: "#059669"
  },
  {
    id: "school_002",
    name: "ثانوية عدن للبنات",
    nameEn: "Aden Girls Secondary School",
    type: "school",
    category: "public",
    level: "secondary",
    address: "شارع الملكة أروى، مديرية التواهي",
    district: "التواهي",
    specialties: ["تعليم ثانوي", "علوم", "أدبي", "تجاري"],
    phoneNumbers: ["+967-2-234567"],
    workingHours: "7:00 ص - 1:00 م (الأحد - الخميس)",
    services: ["تعليم ثانوي", "إرشاد أكاديمي", "أنشطة ثقافية", "مكتبة"],
    rating: 4.5,
    position: [12.8400, 44.9900],
    description: "مدرسة ثانوية حكومية للبنات",
    features: ["فصول مجهزة", "مكتبة", "مختبرات", "قاعة أنشطة"],
    contact: {
      phone: ["+967-2-234567"]
    },
    availability: {
      enrollment: true,
      onlineRegistration: false,
      walkIn: true
    },
    academicYear: "2024-2025",
    icon: "🏫",
    color: "#059669"
  },
  {
    id: "school_003",
    name: "مدرسة الشيخ عثمان الابتدائية",
    nameEn: "Sheikh Othman Primary School",
    type: "school",
    category: "public",
    level: "primary",
    address: "حي الشيخ عثمان، مديرية الشيخ عثمان",
    district: "الشيخ عثمان",
    specialties: ["تعليم أساسي", "رياضيات", "علوم", "لغة عربية"],
    phoneNumbers: ["+967-2-345678"],
    workingHours: "7:30 ص - 12:30 م (الأحد - الخميس)",
    services: ["تعليم أساسي", "أنشطة رياضية", "مكتبة"],
    rating: 4.0,
    position: [12.8500, 44.9700],
    description: "مدرسة حكومية للتعليم الأساسي في الشيخ عثمان",
    features: ["فصول مجهزة", "ملعب", "مكتبة"],
    contact: {
      phone: ["+967-2-345678"]
    },
    availability: {
      enrollment: true,
      onlineRegistration: false,
      walkIn: true
    },
    academicYear: "2024-2025",
    icon: "🏫",
    color: "#059669"
  },

  // المدارس الخاصة
  {
    id: "school_004",
    name: "مدرسة عدن الدولية",
    nameEn: "Aden International School",
    type: "school",
    category: "private",
    level: "mixed",
    address: "شارع الملك فيصل، مديرية المعلا",
    district: "المعلا",
    specialties: ["تعليم دولي", "لغة إنجليزية", "رياضيات", "علوم"],
    phoneNumbers: ["+967-2-456789"],
    workingHours: "8:00 ص - 3:00 م (الأحد - الخميس)",
    services: ["تعليم دولي", "أنشطة رياضية", "مكتبة", "مختبرات", "حاسوب"],
    rating: 4.7,
    position: [12.8200, 44.9950],
    website: "https://aden-international.edu.ye",
    email: "info@aden-international.edu.ye",
    description: "مدرسة خاصة للتعليم الدولي",
    features: ["فصول مجهزة", "ملعب", "مكتبة", "مختبرات", "حاسوب", "مكيفات"],
    contact: {
      phone: ["+967-2-456789"],
      email: "info@aden-international.edu.ye",
      website: "https://aden-international.edu.ye"
    },
    availability: {
      enrollment: true,
      onlineRegistration: true,
      walkIn: true
    },
    academicYear: "2024-2025",
    tuitionFees: {
      min: 500000,
      max: 800000,
      currency: "YER"
    },
    icon: "🏫",
    color: "#dc2626"
  },
  {
    id: "school_005",
    name: "مدرسة النور الخاصة",
    nameEn: "Al-Noor Private School",
    type: "school",
    category: "private",
    level: "mixed",
    address: "شارع الزهراء، مديرية خور مكسر",
    district: "خور مكسر",
    specialties: ["تعليم خاص", "رياضيات", "علوم", "لغة عربية", "لغة إنجليزية"],
    phoneNumbers: ["+967-2-567890"],
    workingHours: "7:30 ص - 2:30 م (الأحد - الخميس)",
    services: ["تعليم خاص", "أنشطة رياضية", "مكتبة", "مختبرات"],
    rating: 4.3,
    position: [12.8100, 44.9850],
    description: "مدرسة خاصة للتعليم المختلط",
    features: ["فصول مجهزة", "ملعب", "مكتبة", "مختبرات", "مكيفات"],
    contact: {
      phone: ["+967-2-567890"]
    },
    availability: {
      enrollment: true,
      onlineRegistration: true,
      walkIn: true
    },
    academicYear: "2024-2025",
    tuitionFees: {
      min: 300000,
      max: 500000,
      currency: "YER"
    },
    icon: "🏫",
    color: "#dc2626"
  },

  // الجامعات والكليات
  {
    id: "university_001",
    name: "جامعة عدن",
    nameEn: "University of Aden",
    type: "university",
    category: "public",
    level: "university",
    address: "شارع الجامعة، مديرية المعلا",
    district: "المعلا",
    specialties: ["طب", "هندسة", "علوم", "آداب", "اقتصاد", "قانون"],
    phoneNumbers: ["+967-2-678901"],
    workingHours: "8:00 ص - 4:00 م (الأحد - الخميس)",
    services: ["تعليم جامعي", "دراسات عليا", "بحث علمي", "مكتبة", "مختبرات"],
    rating: 4.6,
    position: [12.8150, 44.9900],
    website: "https://www.adenuniversity.edu.ye",
    email: "info@adenuniversity.edu.ye",
    description: "الجامعة الحكومية الرئيسية في عدن",
    features: ["كليات متعددة", "مكتبة ضخمة", "مختبرات متقدمة", "مراكز بحث", "سكن طلابي"],
    contact: {
      phone: ["+967-2-678901"],
      email: "info@adenuniversity.edu.ye",
      website: "https://www.adenuniversity.edu.ye"
    },
    availability: {
      enrollment: true,
      onlineRegistration: true,
      walkIn: true
    },
    academicYear: "2024-2025",
    icon: "🎓",
    color: "#059669"
  },
  {
    id: "college_001",
    name: "كلية عدن للعلوم التطبيقية",
    nameEn: "Aden College of Applied Sciences",
    type: "college",
    category: "public",
    level: "university",
    address: "شارع الكلية، مديرية التواهي",
    district: "التواهي",
    specialties: ["حاسوب", "إدارة أعمال", "محاسبة", "سكرتارية"],
    phoneNumbers: ["+967-2-789012"],
    workingHours: "8:00 ص - 3:00 م (الأحد - الخميس)",
    services: ["تعليم تطبيقي", "تدريب عملي", "مكتبة", "مختبرات حاسوب"],
    rating: 4.4,
    position: [12.8350, 44.9850],
    description: "كلية حكومية للعلوم التطبيقية",
    features: ["مختبرات حاسوب", "مكتبة", "قاعات تدريب", "ورش عمل"],
    contact: {
      phone: ["+967-2-789012"]
    },
    availability: {
      enrollment: true,
      onlineRegistration: true,
      walkIn: true
    },
    academicYear: "2024-2025",
    icon: "🎓",
    color: "#059669"
  },
  {
    id: "university_002",
    name: "الجامعة اليمنية للعلوم والتكنولوجيا",
    nameEn: "Yemen University of Science and Technology",
    type: "university",
    category: "private",
    level: "university",
    address: "شارع التكنولوجيا، مديرية خور مكسر",
    district: "خور مكسر",
    specialties: ["هندسة", "حاسوب", "طب", "صيدلة", "إدارة أعمال"],
    phoneNumbers: ["+967-2-890123"],
    workingHours: "8:00 ص - 4:00 م (الأحد - الخميس)",
    services: ["تعليم جامعي", "دراسات عليا", "بحث علمي", "مكتبة", "مختبرات متقدمة"],
    rating: 4.8,
    position: [12.8000, 44.9800],
    website: "https://www.yust.edu.ye",
    email: "info@yust.edu.ye",
    description: "جامعة خاصة للعلوم والتكنولوجيا",
    features: ["مختبرات متقدمة", "مكتبة رقمية", "مراكز بحث", "سكن طلابي", "مرافق رياضية"],
    contact: {
      phone: ["+967-2-890123"],
      email: "info@yust.edu.ye",
      website: "https://www.yust.edu.ye"
    },
    availability: {
      enrollment: true,
      onlineRegistration: true,
      walkIn: true
    },
    academicYear: "2024-2025",
    tuitionFees: {
      min: 1000000,
      max: 2000000,
      currency: "YER"
    },
    icon: "🎓",
    color: "#dc2626"
  },

  // المعاهد
  {
    id: "institute_001",
    name: "معهد عدن التقني",
    nameEn: "Aden Technical Institute",
    type: "institute",
    category: "public",
    level: "university",
    address: "شارع التقنية، مديرية الشيخ عثمان",
    district: "الشيخ عثمان",
    specialties: ["كهرباء", "ميكانيكا", "حاسوب", "بناء"],
    phoneNumbers: ["+967-2-901234"],
    workingHours: "8:00 ص - 3:00 م (الأحد - الخميس)",
    services: ["تعليم تقني", "تدريب عملي", "ورش عمل", "مختبرات"],
    rating: 4.1,
    position: [12.8450, 44.9750],
    description: "معهد حكومي للتعليم التقني",
    features: ["ورش عمل", "مختبرات", "مكتبة تقنية", "قاعات تدريب"],
    contact: {
      phone: ["+967-2-901234"]
    },
    availability: {
      enrollment: true,
      onlineRegistration: false,
      walkIn: true
    },
    academicYear: "2024-2025",
    icon: "🔧",
    color: "#059669"
  },

  // رياض الأطفال
  {
    id: "kindergarten_001",
    name: "روضة الأمل",
    nameEn: "Al-Amal Kindergarten",
    type: "kindergarten",
    category: "private",
    level: "primary",
    address: "شارع الأمل، مديرية صيرة",
    district: "صيرة",
    specialties: ["تعليم ما قبل المدرسة", "أنشطة ترفيهية", "تنمية مهارات"],
    phoneNumbers: ["+967-2-012345"],
    workingHours: "8:00 ص - 12:00 م (الأحد - الخميس)",
    services: ["تعليم ما قبل المدرسة", "أنشطة ترفيهية", "رعاية", "وجبات"],
    rating: 4.5,
    position: [12.8300, 44.9800],
    description: "روضة أطفال خاصة",
    features: ["فصول مجهزة", "ملعب آمن", "ألعاب تعليمية", "رعاية صحية"],
    contact: {
      phone: ["+967-2-012345"]
    },
    availability: {
      enrollment: true,
      onlineRegistration: true,
      walkIn: true
    },
    academicYear: "2024-2025",
    tuitionFees: {
      min: 150000,
      max: 250000,
      currency: "YER"
    },
    icon: "🧸",
    color: "#dc2626"
  }
];
