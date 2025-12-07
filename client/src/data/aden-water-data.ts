// بيانات المياه الشاملة - سبتمبر 2025
// جميع المعلومات المتعلقة بخدمات المياه في عدن

export interface WaterPump {
  id: string;
  name: string;
  type: 'electric' | 'solar' | 'manual' | 'diesel';
  capacity: string; // e.g., '1000L/hour'
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  price: {
    purchase: number;
    rental: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
  seller: {
    name: string;
    phone: string[];
    whatsapp?: string;
    email?: string;
    address: string;
    district: string;
    rating: number;
    reviews: number;
  };
  location: {
    address: string;
    district: string;
    coordinates: [number, number];
  };
  features: string[];
  warranty: string;
  availability: 'available' | 'rented' | 'sold' | 'maintenance';
  images: string[];
  description: string;
  lastUpdated: string;
}

export interface WaterMaintenance {
  id: string;
  service: string;
  description: string;
  provider: {
    name: string;
    phone: string[];
    whatsapp?: string;
    email?: string;
    address: string;
    district: string;
    rating: number;
    reviews: number;
    experience: string; // e.g., '5 years'
  };
  pricing: {
    type: 'fixed' | 'hourly' | 'per_job';
    amount: number;
    currency: string;
    includes: string[];
  };
  availability: {
    days: string[];
    hours: string;
    emergency: boolean;
  };
  specialties: string[];
  location: {
    address: string;
    district: string;
    coordinates: [number, number];
  };
  booking: {
    available: boolean;
    advanceBooking: number; // days
    cancellationPolicy: string;
  };
  lastUpdated: string;
}

export interface WaterTanker {
  id: string;
  name: string;
  capacity: string; // e.g., '5000L', '10000L'
  type: 'drinking' | 'non_drinking' | 'mixed';
  owner: {
    name: string;
    phone: string[];
    whatsapp?: string;
    email?: string;
    company?: string;
    rating: number;
    reviews: number;
  };
  pricing: {
    perLiter: number;
    minimumOrder: number;
    deliveryFee: number;
    currency: string;
  };
  delivery: {
    areas: string[];
    timeRange: string;
    sameDay: boolean;
    advanceBooking: number; // hours
  };
  location: {
    address: string;
    district: string;
    coordinates: [number, number];
  };
  availability: 'available' | 'busy' | 'offline';
  features: string[];
  lastUpdated: string;
}

export interface WaterPoint {
  id: string;
  name: string;
  type: 'drinking' | 'non_drinking' | 'mixed' | 'emergency';
  status: 'operational' | 'maintenance' | 'out_of_service';
  location: {
    address: string;
    district: string;
    coordinates: [number, number];
    landmark?: string;
  };
  contact: {
    phone?: string[];
    whatsapp?: string;
    email?: string;
    website?: string;
  };
  operatingHours: {
    days: string[];
    hours: string;
    notes?: string;
  };
  services: string[];
  quality: {
    tested: boolean;
    lastTest: string;
    rating: number;
    notes?: string;
  };
  accessibility: {
    wheelchair: boolean;
    parking: boolean;
    publicTransport: boolean;
  };
  lastUpdated: string;
}

export interface WaterOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    district: string;
    coordinates: [number, number];
  };
  tanker: WaterTanker;
  quantity: number; // liters
  type: 'drinking' | 'non_drinking' | 'mixed';
  deliveryTime: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WaterBooking {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    district: string;
  };
  service: WaterMaintenance;
  scheduledDate: string;
  scheduledTime: string;
  issue: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimatedCost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// بيانات مضخات المياه
export const adenWaterPumps: WaterPump[] = [
  {
    id: 'pump_001',
    name: 'مضخة مياه كهربائية 1.5 حصان',
    type: 'electric',
    capacity: '1500L/hour',
    condition: 'excellent',
    price: {
      purchase: 450000,
      rental: {
        daily: 15000,
        weekly: 80000,
        monthly: 250000
      }
    },
    seller: {
      name: 'محمد أحمد السقاف',
      phone: ['+967-712345678', '+967-2-234567'],
      whatsapp: '+967-712345678',
      email: 'mohammed.saqaf@waterpumps.ye',
      address: 'شارع الملك فيصل، كريتر',
      district: 'كريتر',
      rating: 4.8,
      reviews: 127
    },
    location: {
      address: 'شارع الملك فيصل، كريتر',
      district: 'كريتر',
      coordinates: [12.7794, 45.0369]
    },
    features: ['ضمان سنتين', 'تركيب مجاني', 'صيانة مجانية', 'قطع غيار متوفرة'],
    warranty: 'سنتان',
    availability: 'available',
    images: ['/images/pumps/electric-1.5hp.jpg'],
    description: 'مضخة مياه كهربائية عالية الجودة مناسبة للمنازل والمحلات التجارية',
    lastUpdated: '2025-09-09T10:00:00Z'
  },
  {
    id: 'pump_002',
    name: 'مضخة مياه شمسية 2 حصان',
    type: 'solar',
    capacity: '2000L/hour',
    condition: 'good',
    price: {
      purchase: 750000,
      rental: {
        daily: 25000,
        weekly: 120000,
        monthly: 400000
      }
    },
    seller: {
      name: 'شركة الطاقة الخضراء',
      phone: ['+967-2-345678'],
      whatsapp: '+967-712345679',
      email: 'info@greenenergy.ye',
      address: 'شارع الجمهورية، الشيخ عثمان',
      district: 'الشيخ عثمان',
      rating: 4.6,
      reviews: 89
    },
    location: {
      address: 'شارع الجمهورية، الشيخ عثمان',
      district: 'الشيخ عثمان',
      coordinates: [12.8500, 44.9500]
    },
    features: ['طاقة شمسية', 'بطارية احتياطية', 'تحكم ذكي', 'توفير في الكهرباء'],
    warranty: '3 سنوات',
    availability: 'available',
    images: ['/images/pumps/solar-2hp.jpg'],
    description: 'مضخة مياه تعمل بالطاقة الشمسية مع بطارية احتياطية',
    lastUpdated: '2025-09-09T10:00:00Z'
  },
  {
    id: 'pump_003',
    name: 'مضخة مياه يدوية',
    type: 'manual',
    capacity: '500L/hour',
    condition: 'excellent',
    price: {
      purchase: 85000,
      rental: {
        daily: 5000,
        weekly: 25000,
        monthly: 80000
      }
    },
    seller: {
      name: 'أحمد علي البكري',
      phone: ['+967-712345680'],
      whatsapp: '+967-712345680',
      address: 'سوق خور مكسر',
      district: 'خور مكسر',
      rating: 4.4,
      reviews: 56
    },
    location: {
      address: 'سوق خور مكسر',
      district: 'خور مكسر',
      coordinates: [12.8000, 44.9800]
    },
    features: ['لا تحتاج كهرباء', 'سهلة الاستخدام', 'متينة', 'سعر مناسب'],
    warranty: 'سنة واحدة',
    availability: 'available',
    images: ['/images/pumps/manual.jpg'],
    description: 'مضخة مياه يدوية مناسبة للمناطق التي لا تتوفر فيها الكهرباء',
    lastUpdated: '2025-09-09T10:00:00Z'
  }
];

// بيانات صيانة المياه
export const adenWaterMaintenance: WaterMaintenance[] = [
  {
    id: 'maintenance_001',
    service: 'صيانة مضخات المياه',
    description: 'صيانة شاملة لجميع أنواع مضخات المياه',
    provider: {
      name: 'مؤسسة صيانة المياه المتخصصة',
      phone: ['+967-2-456789', '+967-712345681'],
      whatsapp: '+967-712345681',
      email: 'info@watermaintenance.ye',
      address: 'شارع التحرير، خور مكسر',
      district: 'خور مكسر',
      rating: 4.9,
      reviews: 203,
      experience: '8 سنوات'
    },
    pricing: {
      type: 'hourly',
      amount: 25000,
      currency: 'YER',
      includes: ['فحص شامل', 'تنظيف', 'إصلاح', 'قطع غيار']
    },
    availability: {
      days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
      hours: '8:00 ص - 6:00 م',
      emergency: true
    },
    specialties: ['مضخات كهربائية', 'مضخات شمسية', 'مضخات ديزل', 'مضخات يدوية'],
    location: {
      address: 'شارع التحرير، خور مكسر',
      district: 'خور مكسر',
      coordinates: [12.8000, 44.9800]
    },
    booking: {
      available: true,
      advanceBooking: 1,
      cancellationPolicy: 'يمكن الإلغاء قبل 24 ساعة'
    },
    lastUpdated: '2025-09-09T10:00:00Z'
  },
  {
    id: 'maintenance_002',
    service: 'إصلاح شبكات المياه',
    description: 'إصلاح وصيانة شبكات المياه المنزلية والتجارية',
    provider: {
      name: 'أحمد محمد النجار',
      phone: ['+967-712345682'],
      whatsapp: '+967-712345682',
      address: 'حي المعلا، المعلا',
      district: 'المعلا',
      rating: 4.7,
      reviews: 145,
      experience: '6 سنوات'
    },
    pricing: {
      type: 'per_job',
      amount: 50000,
      currency: 'YER',
      includes: ['تشخيص المشكلة', 'الإصلاح', 'اختبار النظام']
    },
    availability: {
      days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      hours: '7:00 ص - 8:00 م',
      emergency: true
    },
    specialties: ['شبكات منزلية', 'شبكات تجارية', 'تسريبات', 'استبدال الأنابيب'],
    location: {
      address: 'حي المعلا، المعلا',
      district: 'المعلا',
      coordinates: [12.7500, 45.0000]
    },
    booking: {
      available: true,
      advanceBooking: 0,
      cancellationPolicy: 'يمكن الإلغاء قبل 12 ساعة'
    },
    lastUpdated: '2025-09-09T10:00:00Z'
  }
];

// بيانات صهاريج المياه
export const adenWaterTankers: WaterTanker[] = [
  {
    id: 'tanker_001',
    name: 'صهريج مياه شرب 5000 لتر',
    capacity: '5000L',
    type: 'drinking',
    owner: {
      name: 'شركة مياه عدن النقية',
      phone: ['+967-2-567890', '+967-712345683'],
      whatsapp: '+967-712345683',
      email: 'orders@adenwater.ye',
      company: 'شركة مياه عدن النقية',
      rating: 4.8,
      reviews: 312
    },
    pricing: {
      perLiter: 15,
      minimumOrder: 1000,
      deliveryFee: 10000,
      currency: 'YER'
    },
    delivery: {
      areas: ['كريتر', 'الشيخ عثمان', 'خور مكسر', 'المعلا'],
      timeRange: '8:00 ص - 6:00 م',
      sameDay: true,
      advanceBooking: 2
    },
    location: {
      address: 'مصنع مياه عدن، كريتر',
      district: 'كريتر',
      coordinates: [12.7794, 45.0369]
    },
    availability: 'available',
    features: ['مياه معقمة', 'شهادة جودة', 'توصيل سريع', 'أسعار تنافسية'],
    lastUpdated: '2025-09-09T10:00:00Z'
  },
  {
    id: 'tanker_002',
    name: 'صهريج مياه عام 10000 لتر',
    capacity: '10000L',
    type: 'non_drinking',
    owner: {
      name: 'محمد سالم الحكيمي',
      phone: ['+967-712345684'],
      whatsapp: '+967-712345684',
      rating: 4.5,
      reviews: 89
    },
    pricing: {
      perLiter: 8,
      minimumOrder: 2000,
      deliveryFee: 15000,
      currency: 'YER'
    },
    delivery: {
      areas: ['كريتر', 'الشيخ عثمان', 'خور مكسر'],
      timeRange: '7:00 ص - 7:00 م',
      sameDay: true,
      advanceBooking: 1
    },
    location: {
      address: 'حي الشيخ عثمان',
      district: 'الشيخ عثمان',
      coordinates: [12.8500, 44.9500]
    },
    availability: 'available',
    features: ['مياه نظيفة', 'توصيل مجاني للكميات الكبيرة', 'خدمة 24/7'],
    lastUpdated: '2025-09-09T10:00:00Z'
  }
];

// بيانات نقاط المياه
export const adenWaterPoints: WaterPoint[] = [
  {
    id: 'point_001',
    name: 'نقطة مياه حديقة كريتر',
    type: 'drinking',
    status: 'operational',
    location: {
      address: 'حديقة كريتر العامة',
      district: 'كريتر',
      coordinates: [12.7794, 45.0369],
      landmark: 'بجانب المسجد الكبير'
    },
    contact: {
      phone: ['+967-2-234567'],
      whatsapp: '+967-712345685'
    },
    operatingHours: {
      days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      hours: '6:00 ص - 10:00 م',
      notes: 'متاح 24/7 في حالات الطوارئ'
    },
    services: ['مياه شرب', 'مياه للاستخدام العام', 'خدمة الطوارئ'],
    quality: {
      tested: true,
      lastTest: '2025-09-01',
      rating: 4.9,
      notes: 'مياه عالية الجودة ومطابقة للمعايير'
    },
    accessibility: {
      wheelchair: true,
      parking: true,
      publicTransport: true
    },
    lastUpdated: '2025-09-09T10:00:00Z'
  },
  {
    id: 'point_002',
    name: 'نقطة مياه سوق الشيخ عثمان',
    type: 'mixed',
    status: 'operational',
    location: {
      address: 'سوق الشيخ عثمان المركزي',
      district: 'الشيخ عثمان',
      coordinates: [12.8500, 44.9500],
      landmark: 'بجانب البنك الأهلي'
    },
    contact: {
      phone: ['+967-2-345678'],
      whatsapp: '+967-712345686'
    },
    operatingHours: {
      days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      hours: '5:00 ص - 11:00 م'
    },
    services: ['مياه شرب', 'مياه للاستخدام العام', 'خدمة التعبئة'],
    quality: {
      tested: true,
      lastTest: '2025-08-28',
      rating: 4.7,
      notes: 'مياه نظيفة ومناسبة للاستخدام'
    },
    accessibility: {
      wheelchair: false,
      parking: true,
      publicTransport: true
    },
    lastUpdated: '2025-09-09T10:00:00Z'
  },
  {
    id: 'point_003',
    name: 'نقطة مياه طوارئ خور مكسر',
    type: 'emergency',
    status: 'operational',
    location: {
      address: 'مستشفى خور مكسر',
      district: 'خور مكسر',
      coordinates: [12.8000, 44.9800],
      landmark: 'بجانب قسم الطوارئ'
    },
    contact: {
      phone: ['+967-2-456789'],
      whatsapp: '+967-712345687'
    },
    operatingHours: {
      days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
      hours: '24/7',
      notes: 'متاح على مدار الساعة للطوارئ'
    },
    services: ['مياه شرب', 'خدمة الطوارئ', 'خدمة المستشفى'],
    quality: {
      tested: true,
      lastTest: '2025-09-05',
      rating: 5.0,
      notes: 'مياه معقمة ومطابقة للمعايير الطبية'
    },
    accessibility: {
      wheelchair: true,
      parking: true,
      publicTransport: true
    },
    lastUpdated: '2025-09-09T10:00:00Z'
  }
];

// بيانات الطلبات والحجوزات (للاستخدام المحلي)
export const waterOrders: WaterOrder[] = [];
export const waterBookings: WaterBooking[] = [];
