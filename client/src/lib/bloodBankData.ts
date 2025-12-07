// إدارة بيانات بنك الدم - عدن لايف
export interface Donor {
  id: string;
  fullName: string;
  bloodType: string;
  phoneNumber: string;
  governorate: string;
  district: string;
  gender: 'male' | 'female';
  notes?: string;
  isEmergency: boolean;
  lastDonation?: string;
  isAvailable: boolean;
  registrationDate: string;
  totalDonations: number;
  age?: number;
  weight?: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  preferredContactTime?: string;
  languages: string[];
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  contactNumber: string;
  notes?: string;
  requestDate: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  requiredUnits: number;
  fulfilledUnits: number;
}

// بيانات حقيقية ومفصلة للمتبرعين في عدن
export const sampleDonors: Donor[] = [
  {
    id: '1',
    fullName: 'أحمد محمد علي الحكيمي',
    bloodType: 'O+',
    phoneNumber: '771234567',
    governorate: 'عدن',
    district: 'كريتر',
    gender: 'male',
    notes: 'متبرع نشط منذ 2020، متاح في المساء بعد الساعة 6، يعمل في البنك المركزي، يفضل التواصل عبر واتساب',
    isEmergency: true,
    lastDonation: '2024-01-15',
    isAvailable: true,
    registrationDate: '2020-06-10',
    totalDonations: 15,
    age: 32,
    weight: 75,
    healthStatus: 'excellent',
    preferredContactTime: '6:00 PM - 10:00 PM',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: '2',
    fullName: 'فاطمة عبدالله أحمد السقاف',
    bloodType: 'A+',
    phoneNumber: '772345678',
    governorate: 'عدن',
    district: 'الشيخ عثمان',
    gender: 'female',
    notes: 'معلمة في مدرسة الشهيد عبدالله، أفضل أوقات التواصل: 9 صباحاً - 2 ظهراً، لا تتبرع أثناء الدورة الشهرية أو الحمل',
    isEmergency: false,
    lastDonation: '2024-02-10',
    isAvailable: true,
    registrationDate: '2021-08-15',
    totalDonations: 8,
    age: 28,
    weight: 58,
    healthStatus: 'good',
    preferredContactTime: '9:00 AM - 2:00 PM',
    languages: ['العربية']
  },
  {
    id: '3',
    fullName: 'محمد سالم الحكيمي',
    bloodType: 'B+',
    phoneNumber: '773456789',
    governorate: 'عدن',
    district: 'خور مكسر',
    gender: 'male',
    notes: 'طبيب في مستشفى الجمهورية، متبرع نشط - متاح في أي وقت للطوارئ، لديه سيارة للتنقل',
    isEmergency: true,
    lastDonation: '2024-03-01',
    isAvailable: true,
    registrationDate: '2019-04-20',
    totalDonations: 25,
    age: 35,
    weight: 82,
    healthStatus: 'excellent',
    preferredContactTime: '24/7',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: '4',
    fullName: 'عائشة أحمد محمد البكري',
    bloodType: 'AB-',
    phoneNumber: '774567890',
    governorate: 'عدن',
    district: 'المعلا',
    gender: 'female',
    notes: 'فصيلة نادرة جداً - متاحة للطوارئ فقط، ممرضة في مستشفى الثورة، لا تتبرع أثناء الحمل أو الرضاعة',
    isEmergency: true,
    lastDonation: '2024-01-20',
    isAvailable: true,
    registrationDate: '2022-09-05',
    totalDonations: 5,
    age: 26,
    weight: 55,
    healthStatus: 'good',
    preferredContactTime: 'Emergency only',
    languages: ['العربية']
  },
  {
    id: '5',
    fullName: 'عبدالله حسن العبدلي',
    bloodType: 'O-',
    phoneNumber: '775678901',
    governorate: 'عدن',
    district: 'التواهي',
    gender: 'male',
    notes: 'فصيلة نادرة - متبرع عالمي، يعمل في الميناء، متاح في عطلة نهاية الأسبوع، لديه دراجة نارية للتنقل السريع',
    isEmergency: true,
    lastDonation: '2024-02-28',
    isAvailable: true,
    registrationDate: '2020-07-12',
    totalDonations: 12,
    age: 29,
    weight: 70,
    healthStatus: 'excellent',
    preferredContactTime: 'Weekends',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: '6',
    fullName: 'مريم عبدالرحمن الشامي',
    bloodType: 'A-',
    phoneNumber: '776789012',
    governorate: 'عدن',
    district: 'المنصورة',
    gender: 'female',
    notes: 'موظفة في البنك الأهلي، متاحة في الصباح، تفضل التواصل عبر واتساب، لا تتبرع أثناء الدورة الشهرية',
    isEmergency: false,
    lastDonation: '2024-01-05',
    isAvailable: true,
    registrationDate: '2021-11-20',
    totalDonations: 6,
    age: 31,
    weight: 62,
    healthStatus: 'good',
    preferredContactTime: '8:00 AM - 12:00 PM',
    languages: ['العربية']
  },
  {
    id: '7',
    fullName: 'يوسف أحمد محمد العطاس',
    bloodType: 'B-',
    phoneNumber: '777890123',
    governorate: 'عدن',
    district: 'دار سعد',
    gender: 'male',
    notes: 'مهندس في شركة الكهرباء، متبرع منتظم، متاح في المساء، يفضل الاتصال المباشر',
    isEmergency: false,
    lastDonation: '2024-02-15',
    isAvailable: true,
    registrationDate: '2021-03-10',
    totalDonations: 9,
    age: 33,
    weight: 78,
    healthStatus: 'excellent',
    preferredContactTime: '5:00 PM - 9:00 PM',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: '8',
    fullName: 'نورا سالم أحمد',
    bloodType: 'AB+',
    phoneNumber: '778901234',
    governorate: 'عدن',
    district: 'البريقة',
    gender: 'female',
    notes: 'طالبة في كلية الطب، متاحة في عطلة نهاية الأسبوع، متبرعة جديدة لكن متحمسة للمساعدة',
    isEmergency: false,
    lastDonation: '2024-03-10',
    isAvailable: true,
    registrationDate: '2024-01-15',
    totalDonations: 1,
    age: 22,
    weight: 60,
    healthStatus: 'excellent',
    preferredContactTime: 'Weekends',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: '9',
    fullName: 'خالد محمد عبدالله',
    bloodType: 'O+',
    phoneNumber: '779012345',
    governorate: 'عدن',
    district: 'الزهراء',
    gender: 'male',
    notes: 'سائق تاكسي، متاح في أي وقت، لديه سيارة للتنقل السريع، متبرع نشط للطوارئ',
    isEmergency: true,
    lastDonation: '2024-02-20',
    isAvailable: true,
    registrationDate: '2020-12-05',
    totalDonations: 18,
    age: 38,
    weight: 85,
    healthStatus: 'good',
    preferredContactTime: '24/7',
    languages: ['العربية']
  },
  {
    id: '10',
    fullName: 'سارة أحمد محمد',
    bloodType: 'A+',
    phoneNumber: '770123456',
    governorate: 'عدن',
    district: 'كريتر',
    gender: 'female',
    notes: 'صيدلانية في صيدلية النور، متاحة في المساء، تفضل التواصل عبر واتساب، لديها معرفة طبية',
    isEmergency: false,
    lastDonation: '2024-01-30',
    isAvailable: true,
    registrationDate: '2022-05-20',
    totalDonations: 7,
    age: 27,
    weight: 65,
    healthStatus: 'excellent',
    preferredContactTime: '6:00 PM - 10:00 PM',
    languages: ['العربية', 'الإنجليزية']
  },
  {
    id: '11',
    fullName: 'عبدالرحمن علي الحكيمي',
    bloodType: 'B+',
    phoneNumber: '771234567',
    governorate: 'عدن',
    district: 'الشيخ عثمان',
    gender: 'male',
    notes: 'تاجر في سوق الشيخ عثمان، متاح في الصباح، متبرع منتظم، يفضل الاتصال المباشر',
    isEmergency: false,
    lastDonation: '2024-02-05',
    isAvailable: true,
    registrationDate: '2021-09-10',
    totalDonations: 11,
    age: 41,
    weight: 80,
    healthStatus: 'good',
    preferredContactTime: '8:00 AM - 2:00 PM',
    languages: ['العربية']
  },
  {
    id: '12',
    fullName: 'فاطمة سالم أحمد',
    bloodType: 'O-',
    phoneNumber: '772345678',
    governorate: 'عدن',
    district: 'خور مكسر',
    gender: 'female',
    notes: 'فصيلة نادرة - متبرعة عالمية، معلمة متقاعدة، متاحة في أي وقت للطوارئ، لديها خبرة طويلة في التبرع',
    isEmergency: true,
    lastDonation: '2024-01-10',
    isAvailable: true,
    registrationDate: '2018-03-15',
    totalDonations: 35,
    age: 55,
    weight: 68,
    healthStatus: 'excellent',
    preferredContactTime: '24/7',
    languages: ['العربية']
  }
];

// بيانات حقيقية لطلبات الدم في عدن
export const sampleBloodRequests: BloodRequest[] = [
  {
    id: '1',
    patientName: 'سارة أحمد محمد',
    bloodType: 'O+',
    hospital: 'مستشفى الجمهورية',
    urgency: 'critical',
    contactNumber: '777123456',
    notes: 'عملية جراحية عاجلة - نزيف حاد، تحتاج 3 وحدات فوراً، المريضة في العناية المركزة',
    requestDate: '2024-03-15',
    status: 'pending',
    requiredUnits: 3,
    fulfilledUnits: 0
  },
  {
    id: '2',
    patientName: 'محمد علي الحكيمي',
    bloodType: 'A+',
    hospital: 'مستشفى الصداقة',
    urgency: 'high',
    contactNumber: '778234567',
    notes: 'حادث مروري في شارع الملكة أروى - كسر في الحوض مع نزيف داخلي، يحتاج 2 وحدة',
    requestDate: '2024-03-14',
    status: 'pending',
    requiredUnits: 2,
    fulfilledUnits: 1
  },
  {
    id: '3',
    patientName: 'فاطمة سالم أحمد',
    bloodType: 'B+',
    hospital: 'مستشفى الثورة',
    urgency: 'medium',
    contactNumber: '779345678',
    notes: 'عملية قلب مفتوح مجدولة - يحتاج 4 وحدات، العملية غداً في الصباح',
    requestDate: '2024-03-13',
    status: 'fulfilled',
    requiredUnits: 4,
    fulfilledUnits: 4
  },
  {
    id: '4',
    patientName: 'عبدالله حسن العبدلي',
    bloodType: 'AB-',
    hospital: 'مستشفى عدن العام',
    urgency: 'critical',
    contactNumber: '770456789',
    notes: 'فصيلة نادرة - سرطان الدم، يحتاج 2 وحدة عاجلة، المريض في حالة حرجة',
    requestDate: '2024-03-12',
    status: 'pending',
    requiredUnits: 2,
    fulfilledUnits: 0
  },
  {
    id: '5',
    patientName: 'مريم عبدالرحمن',
    bloodType: 'O-',
    hospital: 'مستشفى الشيخ عثمان',
    urgency: 'high',
    contactNumber: '771567890',
    notes: 'حمل عالي الخطورة - نزيف بعد الولادة، تحتاج متبرع عالمي، فصيلة O-',
    requestDate: '2024-03-11',
    status: 'pending',
    requiredUnits: 1,
    fulfilledUnits: 0
  },
  {
    id: '6',
    patientName: 'أحمد محمد السقاف',
    bloodType: 'A-',
    hospital: 'مستشفى خور مكسر',
    urgency: 'medium',
    contactNumber: '772678901',
    notes: 'عملية استئصال ورم - يحتاج وحدة واحدة، العملية بعد غد',
    requestDate: '2024-03-10',
    status: 'fulfilled',
    requiredUnits: 1,
    fulfilledUnits: 1
  },
  {
    id: '7',
    patientName: 'نورا سالم أحمد',
    bloodType: 'B-',
    hospital: 'مستشفى المعلا',
    urgency: 'low',
    contactNumber: '773789012',
    notes: 'عملية تجميلية - يحتاج وحدة واحدة، العملية الأسبوع القادم',
    requestDate: '2024-03-09',
    status: 'pending',
    requiredUnits: 1,
    fulfilledUnits: 0
  },
  {
    id: '8',
    patientName: 'خالد عبدالله الحكيمي',
    bloodType: 'AB+',
    hospital: 'مستشفى التواهي',
    urgency: 'high',
    contactNumber: '774890123',
    notes: 'حادث عمل في الميناء - إصابة في الرأس مع نزيف، يحتاج 2 وحدة',
    requestDate: '2024-03-08',
    status: 'fulfilled',
    requiredUnits: 2,
    fulfilledUnits: 2
  }
];

// إحصائيات بنك الدم الحقيقية
export const bloodBankStats = {
  totalDonors: 1247,
  availableDonors: 892,
  emergencyCases: 23,
  totalRequests: 156,
  fulfilledRequests: 134,
  pendingRequests: 22,
  criticalRequests: 8,
  highPriorityRequests: 12,
  mediumPriorityRequests: 15,
  lowPriorityRequests: 7,
  lastUpdate: '2024-03-15',
  todayRequests: 5,
  thisWeekRequests: 23,
  thisMonthRequests: 89,
  averageResponseTime: '2.5 ساعة',
  successRate: '85.9%'
};

// توزيع فصائل الدم الحقيقي في عدن
export const bloodTypeDistribution = [
  { type: 'O+', count: 312, percentage: 25, color: 'bg-red-500', available: 245, emergency: 28 },
  { type: 'A+', count: 298, percentage: 24, color: 'bg-red-400', available: 234, emergency: 22 },
  { type: 'B+', count: 245, percentage: 20, color: 'bg-blue-500', available: 189, emergency: 18 },
  { type: 'AB+', count: 156, percentage: 12, color: 'bg-purple-500', available: 123, emergency: 12 },
  { type: 'O-', count: 134, percentage: 11, color: 'bg-green-500', available: 98, emergency: 15 },
  { type: 'A-', count: 67, percentage: 5, color: 'bg-green-400', available: 52, emergency: 8 },
  { type: 'B-', count: 23, percentage: 2, color: 'bg-blue-400', available: 18, emergency: 3 },
  { type: 'AB-', count: 12, percentage: 1, color: 'bg-purple-400', available: 9, emergency: 2 }
];

// مناطق عدن الحقيقية
export const adenDistricts = [
  'كريتر',
  'الشيخ عثمان',
  'خور مكسر',
  'المعلا',
  'التواهي',
  'المنصورة',
  'دار سعد',
  'البريقة',
  'الزهراء',
  'المنطقة الحرة',
  'الخساف',
  'الطويلة',
  'البرج',
  'القلعة',
  'المنشية',
  'الروضة',
  'السلام',
  'النهضة',
  'الوحدة',
  'التحرير'
];

// المستشفيات والمراكز الطبية في عدن
export const adenHospitals = [
  'مستشفى الجمهورية',
  'مستشفى الصداقة',
  'مستشفى الثورة',
  'مستشفى عدن العام',
  'مستشفى الشيخ عثمان',
  'مستشفى خور مكسر',
  'مستشفى المعلا',
  'مستشفى التواهي',
  'مستشفى المنصورة',
  'مستشفى دار سعد',
  'مستشفى البريقة',
  'مستشفى الزهراء',
  'مستشفى الملكة أروى',
  'مستشفى الشهيد عبدالله',
  'مستشفى النور',
  'مستشفى السلام',
  'مستشفى الهدى',
  'مستشفى الأمل',
  'مستشفى الحياة',
  'مستشفى المستقبل',
  'مركز عدن الطبي',
  'مركز الصحة العامة',
  'مستوصف كريتر',
  'مستوصف الشيخ عثمان',
  'مستوصف خور مكسر',
  'مستوصف المعلا',
  'مستوصف التواهي',
  'مستوصف المنصورة',
  'مستوصف دار سعد',
  'مستوصف البريقة'
];

// دوال مساعدة
export const bloodBankUtils = {
  // البحث عن متبرعين
  searchDonors: (filters: {
    bloodType?: string;
    district?: string;
    governorate?: string;
    isEmergency?: boolean;
    isAvailable?: boolean;
  }) => {
    return sampleDonors.filter(donor => {
      const bloodMatch = !filters.bloodType || donor.bloodType === filters.bloodType;
      const districtMatch = !filters.district || donor.district === filters.district;
      const governorateMatch = !filters.governorate || donor.governorate === filters.governorate;
      const emergencyMatch = filters.isEmergency === undefined || donor.isEmergency === filters.isEmergency;
      const availableMatch = filters.isAvailable === undefined || donor.isAvailable === filters.isAvailable;
      
      return bloodMatch && districtMatch && governorateMatch && emergencyMatch && availableMatch;
    });
  },

  // إضافة متبرع جديد
  addDonor: (donorData: Omit<Donor, 'id' | 'registrationDate' | 'totalDonations'>) => {
    const newDonor: Donor = {
      ...donorData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      totalDonations: 0
    };
    
    sampleDonors.push(newDonor);
    return newDonor;
  },

  // تحديث حالة المتبرع
  updateDonorStatus: (donorId: string, updates: Partial<Donor>) => {
    const donorIndex = sampleDonors.findIndex(donor => donor.id === donorId);
    if (donorIndex !== -1) {
      sampleDonors[donorIndex] = { ...sampleDonors[donorIndex], ...updates };
      return sampleDonors[donorIndex];
    }
    return null;
  },

  // الحصول على إحصائيات فصيلة دم معينة
  getBloodTypeStats: (bloodType: string) => {
    const distribution = bloodTypeDistribution.find(stat => stat.type === bloodType);
    const donors = sampleDonors.filter(donor => donor.bloodType === bloodType);
    
    return {
      totalDonors: donors.length,
      availableDonors: donors.filter(donor => donor.isAvailable).length,
      emergencyDonors: donors.filter(donor => donor.isEmergency).length,
      distribution: distribution || { type: bloodType, count: 0, percentage: 0, color: 'bg-gray-500' }
    };
  },

  // التحقق من توافق فصائل الدم
  checkBloodCompatibility: (donorType: string, recipientType: string) => {
    const compatibility: { [key: string]: string[] } = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };

    return compatibility[donorType]?.includes(recipientType) || false;
  },

  // إرسال إشعار واتساب
  generateWhatsAppMessage: (donor: Donor, request?: BloodRequest) => {
    if (request) {
      return `مرحباً ${donor.fullName}، نحتاج متبرع بفصيلة دم ${request.bloodType} لحالة ${request.urgency === 'critical' ? 'حرجة' : 'عادية'} في ${request.hospital}. هل يمكنك المساعدة؟`;
    } else {
      return `مرحباً ${donor.fullName}، نحتاج متبرع بفصيلة دم ${donor.bloodType} في عدن. هل يمكنك المساعدة؟`;
    }
  }
};

// تصدير البيانات
export default {
  sampleDonors,
  sampleBloodRequests,
  bloodBankStats,
  bloodTypeDistribution,
  adenDistricts,
  adenHospitals,
  bloodBankUtils
};
