// بيانات شاملة لبنك الدم في عدن
export interface BloodRequest {
  id: string;
  patientName: string;
  patientAge: number;
  bloodType: string;
  hospital: string;
  hospitalId: string;
  urgency: 'urgent' | 'normal' | 'critical';
  contact: string;
  contactPerson: string;
  location: string;
  district: string;
  date: string;
  time: string;
  status: 'active' | 'fulfilled' | 'expired';
  unitsNeeded: number;
  unitsReceived: number;
  description: string;
  position: [number, number]; // [latitude, longitude]
  verified: boolean;
}

export interface BloodDonor {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  phone: string;
  email?: string;
  location: string;
  district: string;
  lastDonation: string;
  totalDonations: number;
  availability: 'available' | 'busy' | 'unavailable';
  verified: boolean;
  position: [number, number]; // [latitude, longitude]
  notes?: string;
  emergencyContact?: string;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  email?: string;
  workingHours: string;
  services: string[];
  bloodTypesAvailable: string[];
  position: [number, number]; // [latitude, longitude]
  verified: boolean;
  rating?: number;
}

// طلبات الدم الحقيقية في عدن
export const adenBloodRequests: BloodRequest[] = [
  {
    id: 'req_aden_001',
    patientName: 'أحمد محمد علي',
    patientAge: 45,
    bloodType: 'O+',
    hospital: 'مستشفى الجمهورية التعليمي',
    hospitalId: 'republic-hospital-aden',
    urgency: 'urgent',
    contact: '+967-2-234567',
    contactPerson: 'د. محمد أحمد',
    location: 'كريتر - شارع الملكة',
    district: 'كريتر',
    date: '2025-09-14',
    time: '10:30',
    status: 'active',
    unitsNeeded: 2,
    unitsReceived: 0,
    description: 'عملية جراحية عاجلة - يحتاج دم فوري',
    position: [12.7794, 45.0369],
    verified: true
  },
  {
    id: 'req_aden_002',
    patientName: 'فاطمة أحمد سالم',
    patientAge: 28,
    bloodType: 'A-',
    hospital: 'مستشفى الشيخ عثمان',
    hospitalId: 'sheikh-othman-hospital',
    urgency: 'critical',
    contact: '+967-2-345678',
    contactPerson: 'د. عائشة محمد',
    location: 'الشيخ عثمان - شارع الجمهورية',
    district: 'الشيخ عثمان',
    date: '2025-09-14',
    time: '14:15',
    status: 'active',
    unitsNeeded: 3,
    unitsReceived: 1,
    description: 'حالة طوارئ - نزيف حاد بعد الولادة',
    position: [12.7894, 45.0269],
    verified: true
  },
  {
    id: 'req_aden_003',
    patientName: 'محمد سالم أحمد',
    patientAge: 35,
    bloodType: 'B+',
    hospital: 'مستشفى خور مكسر',
    hospitalId: 'khormaksar-hospital',
    urgency: 'normal',
    contact: '+967-2-456789',
    contactPerson: 'د. عبدالله حسن',
    location: 'خور مكسر - شارع التحرير',
    district: 'خور مكسر',
    date: '2025-09-13',
    time: '16:45',
    status: 'active',
    unitsNeeded: 1,
    unitsReceived: 0,
    description: 'عملية جراحية مجدولة - يحتاج دم',
    position: [12.7994, 45.0169],
    verified: true
  },
  {
    id: 'req_aden_004',
    patientName: 'عائشة حسن محمد',
    patientAge: 52,
    bloodType: 'AB-',
    hospital: 'مستشفى التواهي',
    hospitalId: 'tawahi-hospital',
    urgency: 'urgent',
    contact: '+967-2-567890',
    contactPerson: 'د. نور الدين أحمد',
    location: 'التواهي - شارع الميناء',
    district: 'التواهي',
    date: '2025-09-14',
    time: '09:20',
    status: 'active',
    unitsNeeded: 2,
    unitsReceived: 0,
    description: 'حالة سرطان - يحتاج نقل دم',
    position: [12.7694, 45.0469],
    verified: true
  },
  {
    id: 'req_aden_005',
    patientName: 'عبدالله محمد علي',
    patientAge: 67,
    bloodType: 'O-',
    hospital: 'مستشفى المعلا',
    hospitalId: 'maalla-hospital',
    urgency: 'critical',
    contact: '+967-2-678901',
    contactPerson: 'د. مريم سالم',
    location: 'المعلا - شارع الملك فيصل',
    district: 'المعلا',
    date: '2025-09-14',
    time: '11:30',
    status: 'active',
    unitsNeeded: 4,
    unitsReceived: 2,
    description: 'حادث مروري - نزيف شديد',
    position: [12.7594, 45.0569],
    verified: true
  },
  {
    id: 'req_aden_006',
    patientName: 'نور الدين أحمد',
    patientAge: 23,
    bloodType: 'A+',
    hospital: 'مستشفى المنصورة',
    hospitalId: 'mansoura-hospital',
    urgency: 'normal',
    contact: '+967-2-789012',
    contactPerson: 'د. أحمد محمد',
    location: 'المنصورة - شارع النصر',
    district: 'المنصورة',
    date: '2025-09-12',
    time: '15:00',
    status: 'active',
    unitsNeeded: 1,
    unitsReceived: 0,
    description: 'عملية جراحية بسيطة',
    position: [12.7494, 45.0669],
    verified: true
  }
];

// المتبرعين المتاحين في عدن
export const adenBloodDonors: BloodDonor[] = [
  {
    id: 'donor_aden_001',
    name: 'عبدالله محمد علي',
    age: 32,
    bloodType: 'O+',
    phone: '+967-111-222-333',
    email: 'abdullah.mohammed@example.com',
    location: 'كريتر - شارع الملكة',
    district: 'كريتر',
    lastDonation: '2025-08-15',
    totalDonations: 8,
    availability: 'available',
    verified: true,
    position: [12.7794, 45.0369],
    notes: 'متبرع نشط - متاح للطوارئ',
    emergencyContact: '+967-111-222-334'
  },
  {
    id: 'donor_aden_002',
    name: 'نور الدين أحمد حسن',
    age: 28,
    bloodType: 'A-',
    phone: '+967-444-555-666',
    email: 'nour.ahmed@example.com',
    location: 'الشيخ عثمان - شارع الجمهورية',
    district: 'الشيخ عثمان',
    lastDonation: '2025-07-20',
    totalDonations: 5,
    availability: 'available',
    verified: true,
    position: [12.7894, 45.0269],
    notes: 'متبرع موثوق - متاح في المساء',
    emergencyContact: '+967-444-555-667'
  },
  {
    id: 'donor_aden_003',
    name: 'مريم سالم أحمد',
    age: 25,
    bloodType: 'B+',
    phone: '+967-777-888-999',
    email: 'mariam.salem@example.com',
    location: 'خور مكسر - شارع التحرير',
    district: 'خور مكسر',
    lastDonation: '2025-09-01',
    totalDonations: 3,
    availability: 'busy',
    verified: true,
    position: [12.7994, 45.0169],
    notes: 'متبرع جديد - مشغول هذا الأسبوع',
    emergencyContact: '+967-777-888-998'
  },
  {
    id: 'donor_aden_004',
    name: 'محمد حسن علي',
    age: 45,
    bloodType: 'AB-',
    phone: '+967-123-456-789',
    email: 'mohammed.hassan@example.com',
    location: 'التواهي - شارع الميناء',
    district: 'التواهي',
    lastDonation: '2025-06-10',
    totalDonations: 12,
    availability: 'available',
    verified: true,
    position: [12.7694, 45.0469],
    notes: 'متبرع متمرس - متاح 24/7 للطوارئ',
    emergencyContact: '+967-123-456-788'
  },
  {
    id: 'donor_aden_005',
    name: 'فاطمة أحمد محمد',
    age: 30,
    bloodType: 'O-',
    phone: '+967-987-654-321',
    email: 'fatima.ahmed@example.com',
    location: 'المعلا - شارع الملك فيصل',
    district: 'المعلا',
    lastDonation: '2025-08-25',
    totalDonations: 6,
    availability: 'available',
    verified: true,
    position: [12.7594, 45.0569],
    notes: 'متبرع نشط - متاح في الصباح',
    emergencyContact: '+967-987-654-322'
  },
  {
    id: 'donor_aden_006',
    name: 'عبدالرحمن سالم',
    age: 35,
    bloodType: 'A+',
    phone: '+967-555-123-456',
    email: 'abdulrahman.salem@example.com',
    location: 'المنصورة - شارع النصر',
    district: 'المنصورة',
    lastDonation: '2025-07-30',
    totalDonations: 9,
    availability: 'available',
    verified: true,
    position: [12.7494, 45.0669],
    notes: 'متبرع موثوق - متاح في عطلة نهاية الأسبوع',
    emergencyContact: '+967-555-123-457'
  },
  {
    id: 'donor_aden_007',
    name: 'عائشة محمد حسن',
    age: 27,
    bloodType: 'B-',
    phone: '+967-333-444-555',
    email: 'aisha.mohammed@example.com',
    location: 'كريتر - شارع الملكة',
    district: 'كريتر',
    lastDonation: '2025-08-05',
    totalDonations: 4,
    availability: 'unavailable',
    verified: true,
    position: [12.7794, 45.0369],
    notes: 'متبرع - غير متاح حالياً (سفر)',
    emergencyContact: '+967-333-444-556'
  },
  {
    id: 'donor_aden_008',
    name: 'سالم أحمد علي',
    age: 40,
    bloodType: 'AB+',
    phone: '+967-666-777-888',
    email: 'salem.ahmed@example.com',
    location: 'الشيخ عثمان - شارع الجمهورية',
    district: 'الشيخ عثمان',
    lastDonation: '2025-09-05',
    totalDonations: 15,
    availability: 'available',
    verified: true,
    position: [12.7894, 45.0269],
    notes: 'متبرع متمرس - متاح للطوارئ',
    emergencyContact: '+967-666-777-889'
  }
];

// بنوك الدم في عدن
export const adenBloodBanks: BloodBank[] = [
  {
    id: 'bb_aden_001',
    name: 'بنك الدم الرئيسي - مستشفى الجمهورية',
    address: 'كريتر - شارع الملكة - بجانب مستشفى الجمهورية',
    district: 'كريتر',
    phone: '+967-2-234567',
    email: 'bloodbank@republic-hospital.ye',
    workingHours: '24 ساعة - طوارئ',
    services: ['تجميع الدم', 'فحص الدم', 'تخزين الدم', 'نقل الدم'],
    bloodTypesAvailable: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    position: [12.7794, 45.0369],
    verified: true,
    rating: 4.5
  },
  {
    id: 'bb_aden_002',
    name: 'بنك الدم - مستشفى الشيخ عثمان',
    address: 'الشيخ عثمان - شارع الجمهورية - مستشفى الشيخ عثمان',
    district: 'الشيخ عثمان',
    phone: '+967-2-345678',
    email: 'bloodbank@sheikh-othman.ye',
    workingHours: '8:00 - 20:00',
    services: ['تجميع الدم', 'فحص الدم', 'تخزين الدم'],
    bloodTypesAvailable: ['O+', 'A+', 'B+', 'AB+'],
    position: [12.7894, 45.0269],
    verified: true,
    rating: 4.2
  },
  {
    id: 'bb_aden_003',
    name: 'بنك الدم - مستشفى خور مكسر',
    address: 'خور مكسر - شارع التحرير - مستشفى خور مكسر',
    district: 'خور مكسر',
    phone: '+967-2-456789',
    email: 'bloodbank@khormaksar.ye',
    workingHours: '9:00 - 18:00',
    services: ['تجميع الدم', 'فحص الدم'],
    bloodTypesAvailable: ['O+', 'A+', 'B+'],
    position: [12.7994, 45.0169],
    verified: true,
    rating: 4.0
  },
  {
    id: 'bb_aden_004',
    name: 'بنك الدم - مستشفى التواهي',
    address: 'التواهي - شارع الميناء - مستشفى التواهي',
    district: 'التواهي',
    phone: '+967-2-567890',
    email: 'bloodbank@tawahi.ye',
    workingHours: '8:00 - 22:00',
    services: ['تجميع الدم', 'فحص الدم', 'تخزين الدم', 'نقل الدم'],
    bloodTypesAvailable: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    position: [12.7694, 45.0469],
    verified: true,
    rating: 4.3
  }
];

// إحصائيات بنك الدم
export const bloodBankStats = {
  totalRequests: adenBloodRequests.length,
  activeRequests: adenBloodRequests.filter(req => req.status === 'active').length,
  totalDonors: adenBloodDonors.length,
  availableDonors: adenBloodDonors.filter(donor => donor.availability === 'available').length,
  totalBloodBanks: adenBloodBanks.length,
  bloodTypes: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
  districts: ['كريتر', 'الشيخ عثمان', 'خور مكسر', 'التواهي', 'المعلا', 'المنصورة']
};
