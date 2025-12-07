// بيانات خدمات الطوارئ في عدن
export interface EmergencyService {
  id: string;
  name: string;
  nameEn: string;
  type: 'ambulance' | 'hospital' | 'fire' | 'police' | 'civil_defense' | 'coast_guard' | 'air_emergency';
  category: 'medical' | 'security' | 'fire' | 'rescue' | 'coast' | 'aviation';
  phoneNumbers: string[];
  address: string;
  district: string;
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
    emergency: boolean;
    twentyFourSeven: boolean;
    walkIn: boolean;
  };
  priority: 'high' | 'medium' | 'low';
  responseTime?: string; // متوسط وقت الاستجابة
  coverage?: string[]; // المناطق التي يغطيها
  icon: string;
  color: string;
}

export const adenEmergencyServices: EmergencyService[] = [
  // خدمات الإسعاف
  {
    id: "ambulance_001",
    name: "الإسعاف العام - عدن",
    nameEn: "General Ambulance - Aden",
    type: "ambulance",
    category: "medical",
    phoneNumbers: ["191", "+967-2-123456"],
    address: "شارع الملكة أروى، مديرية صيرة",
    district: "صيرة",
    workingHours: "24 ساعة يومياً",
    services: ["إسعاف طبي", "نقل المرضى", "طوارئ", "إنقاذ"],
    rating: 4.8,
    position: [12.8333, 44.9817],
    website: "https://ambulance-aden.gov.ye",
    email: "info@ambulance-aden.gov.ye",
    description: "خدمة الإسعاف الرسمية في عدن",
    features: ["سيارات إسعاف مجهزة", "طاقم طبي متخصص", "استجابة سريعة", "تغطية شاملة"],
    contact: {
      phone: ["191", "+967-2-123456"],
      email: "info@ambulance-aden.gov.ye",
      website: "https://ambulance-aden.gov.ye"
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: false
    },
    priority: "high",
    responseTime: "5-10 دقائق",
    coverage: ["صيرة", "التواهي", "المعلا", "خور مكسر"],
    icon: "🚑",
    color: "#dc2626"
  },
  {
    id: "ambulance_002",
    name: "إسعاف الشيخ عثمان",
    nameEn: "Sheikh Othman Ambulance",
    type: "ambulance",
    category: "medical",
    phoneNumbers: ["+967-2-234567"],
    address: "حي الشيخ عثمان، مديرية الشيخ عثمان",
    district: "الشيخ عثمان",
    workingHours: "24 ساعة يومياً",
    services: ["إسعاف طبي", "نقل المرضى", "طوارئ"],
    rating: 4.5,
    position: [12.8500, 44.9700],
    description: "خدمة إسعاف محلية في الشيخ عثمان",
    features: ["سيارات إسعاف", "طاقم طبي", "استجابة محلية"],
    contact: {
      phone: ["+967-2-234567"]
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: false
    },
    priority: "high",
    responseTime: "7-12 دقيقة",
    coverage: ["الشيخ عثمان", "المنصورة"],
    icon: "🚑",
    color: "#dc2626"
  },

  // الدفاع المدني
  {
    id: "civil_defense_001",
    name: "الدفاع المدني - عدن",
    nameEn: "Civil Defense - Aden",
    type: "civil_defense",
    category: "fire",
    phoneNumbers: ["191", "+967-2-345678"],
    address: "شارع الدفاع المدني، مديرية التواهي",
    district: "التواهي",
    workingHours: "24 ساعة يومياً",
    services: ["إطفاء حرائق", "إنقاذ", "طوارئ", "إخلاء"],
    rating: 4.7,
    position: [12.8400, 44.9900],
    website: "https://civil-defense-aden.gov.ye",
    email: "info@civil-defense-aden.gov.ye",
    description: "خدمة الدفاع المدني في عدن",
    features: ["سيارات إطفاء", "معدات إنقاذ", "طاقم متخصص", "استجابة سريعة"],
    contact: {
      phone: ["191", "+967-2-345678"],
      email: "info@civil-defense-aden.gov.ye",
      website: "https://civil-defense-aden.gov.ye"
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: false
    },
    priority: "high",
    responseTime: "3-7 دقائق",
    coverage: ["التواهي", "المعلا", "خور مكسر", "صيرة"],
    icon: "🚒",
    color: "#dc2626"
  },
  {
    id: "civil_defense_002",
    name: "الدفاع المدني - المعلا",
    nameEn: "Civil Defense - Al-Ma'alla",
    type: "civil_defense",
    category: "fire",
    phoneNumbers: ["+967-2-456789"],
    address: "شارع المعلا، مديرية المعلا",
    district: "المعلا",
    workingHours: "24 ساعة يومياً",
    services: ["إطفاء حرائق", "إنقاذ", "طوارئ"],
    rating: 4.3,
    position: [12.8200, 44.9950],
    description: "فرع الدفاع المدني في المعلا",
    features: ["سيارات إطفاء", "معدات إنقاذ", "طاقم متخصص"],
    contact: {
      phone: ["+967-2-456789"]
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: false
    },
    priority: "high",
    responseTime: "5-10 دقائق",
    coverage: ["المعلا", "التواهي"],
    icon: "🚒",
    color: "#dc2626"
  },

  // الشرطة
  {
    id: "police_001",
    name: "شرطة عدن",
    nameEn: "Aden Police",
    type: "police",
    category: "security",
    phoneNumbers: ["194", "+967-2-567890"],
    address: "مبنى شرطة عدن، مديرية صيرة",
    district: "صيرة",
    workingHours: "24 ساعة يومياً",
    services: ["أمن", "حماية", "تحقيق", "طوارئ أمنية"],
    rating: 4.6,
    position: [12.8300, 44.9800],
    website: "https://police-aden.gov.ye",
    email: "info@police-aden.gov.ye",
    description: "مقر شرطة عدن الرئيسي",
    features: ["دوريات أمنية", "غرف عمليات", "طاقم أمني متخصص", "استجابة سريعة"],
    contact: {
      phone: ["194", "+967-2-567890"],
      email: "info@police-aden.gov.ye",
      website: "https://police-aden.gov.ye"
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: true
    },
    priority: "high",
    responseTime: "5-15 دقيقة",
    coverage: ["صيرة", "التواهي", "المعلا", "خور مكسر"],
    icon: "🚔",
    color: "#1e40af"
  },
  {
    id: "police_002",
    name: "شرطة الشيخ عثمان",
    nameEn: "Sheikh Othman Police",
    type: "police",
    category: "security",
    phoneNumbers: ["+967-2-678901"],
    address: "حي الشيخ عثمان، مديرية الشيخ عثمان",
    district: "الشيخ عثمان",
    workingHours: "24 ساعة يومياً",
    services: ["أمن", "حماية", "تحقيق", "طوارئ أمنية"],
    rating: 4.4,
    position: [12.8450, 44.9750],
    description: "فرع شرطة الشيخ عثمان",
    features: ["دوريات أمنية", "غرف عمليات", "طاقم أمني"],
    contact: {
      phone: ["+967-2-678901"]
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: true
    },
    priority: "high",
    responseTime: "7-15 دقيقة",
    coverage: ["الشيخ عثمان", "المنصورة"],
    icon: "🚔",
    color: "#1e40af"
  },

  // مستشفيات الطوارئ
  {
    id: "emergency_hospital_001",
    name: "مستشفى الجمهورية - الطوارئ",
    nameEn: "Al-Jumhuriya Hospital - Emergency",
    type: "hospital",
    category: "medical",
    phoneNumbers: ["+967-2-789012", "+967-2-789013"],
    address: "شارع الملكة أروى، مديرية صيرة",
    district: "صيرة",
    workingHours: "24 ساعة يومياً",
    services: ["طوارئ طبية", "جراحة طوارئ", "عناية مركزة", "إسعاف"],
    rating: 4.5,
    position: [12.8350, 44.9850],
    website: "https://aljumhuriya-hospital.gov.ye",
    email: "emergency@aljumhuriya-hospital.gov.ye",
    description: "قسم الطوارئ في مستشفى الجمهورية",
    features: ["غرف طوارئ مجهزة", "طاقم طبي متخصص", "معدات طبية متقدمة", "استقبال 24/7"],
    contact: {
      phone: ["+967-2-789012", "+967-2-789013"],
      email: "emergency@aljumhuriya-hospital.gov.ye",
      website: "https://aljumhuriya-hospital.gov.ye"
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: true
    },
    priority: "high",
    responseTime: "فوري",
    coverage: ["صيرة", "التواهي", "المعلا"],
    icon: "🏥",
    color: "#dc2626"
  },
  {
    id: "emergency_hospital_002",
    name: "مستشفى الصداقة - الطوارئ",
    nameEn: "Al-Sadaqa Hospital - Emergency",
    type: "hospital",
    category: "medical",
    phoneNumbers: ["+967-2-890123"],
    address: "حي الشيخ عثمان، مديرية الشيخ عثمان",
    district: "الشيخ عثمان",
    workingHours: "24 ساعة يومياً",
    services: ["طوارئ طبية", "جراحة طوارئ", "عناية مركزة"],
    rating: 4.3,
    position: [12.8500, 44.9700],
    description: "قسم الطوارئ في مستشفى الصداقة",
    features: ["غرف طوارئ", "طاقم طبي", "معدات طبية"],
    contact: {
      phone: ["+967-2-890123"]
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: true
    },
    priority: "high",
    responseTime: "فوري",
    coverage: ["الشيخ عثمان", "المنصورة"],
    icon: "🏥",
    color: "#dc2626"
  },

  // خفر السواحل
  {
    id: "coast_guard_001",
    name: "خفر السواحل - عدن",
    nameEn: "Coast Guard - Aden",
    type: "coast_guard",
    category: "coast",
    phoneNumbers: ["196", "+967-2-901234"],
    address: "ميناء عدن، مديرية التواهي",
    district: "التواهي",
    workingHours: "24 ساعة يومياً",
    services: ["إنقاذ بحري", "أمن بحري", "طوارئ بحرية", "بحث وإنقاذ"],
    rating: 4.7,
    position: [12.8400, 44.9900],
    website: "https://coast-guard-aden.gov.ye",
    email: "info@coast-guard-aden.gov.ye",
    description: "خدمة خفر السواحل في عدن",
    features: ["قوارب إنقاذ", "معدات بحرية", "طاقم متخصص", "رادار بحري"],
    contact: {
      phone: ["196", "+967-2-901234"],
      email: "info@coast-guard-aden.gov.ye",
      website: "https://coast-guard-aden.gov.ye"
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: false
    },
    priority: "high",
    responseTime: "10-20 دقيقة",
    coverage: ["خليج عدن", "المياه الإقليمية"],
    icon: "🚁",
    color: "#059669"
  },

  // الطوارئ الجوية
  {
    id: "air_emergency_001",
    name: "الطوارئ الجوية - عدن",
    nameEn: "Air Emergency - Aden",
    type: "air_emergency",
    category: "aviation",
    phoneNumbers: ["199", "+967-2-012345"],
    address: "مطار عدن الدولي، مديرية خور مكسر",
    district: "خور مكسر",
    workingHours: "24 ساعة يومياً",
    services: ["طوارئ جوية", "إنقاذ جوي", "أمن جوي", "بحث وإنقاذ"],
    rating: 4.8,
    position: [12.8000, 44.9800],
    website: "https://air-emergency-aden.gov.ye",
    email: "info@air-emergency-aden.gov.ye",
    description: "خدمة الطوارئ الجوية في مطار عدن",
    features: ["طائرات إنقاذ", "معدات جوية", "طاقم متخصص", "رادار جوي"],
    contact: {
      phone: ["199", "+967-2-012345"],
      email: "info@air-emergency-aden.gov.ye",
      website: "https://air-emergency-aden.gov.ye"
    },
    availability: {
      emergency: true,
      twentyFourSeven: true,
      walkIn: false
    },
    priority: "high",
    responseTime: "15-30 دقيقة",
    coverage: ["المجال الجوي لعدن", "المناطق الجبلية"],
    icon: "✈️",
    color: "#7c3aed"
  }
];
