// بيانات خريطة عدن - Cursor الأسطوري
export interface DistrictData {
  id: string;
  name: string;
  nameEn: string;
  coordinates: [number, number]; // [lat, lng]
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  status: 'on' | 'off' | 'partial' | 'unknown';
  population: number;
  area: number; // km²
  lastUpdate: Date;
  confirmationCount: number;
  uniqueUsers: number;
  isConfirmed: boolean;
  confirmedAt?: Date;
  expiresAt?: Date;
}

export interface MapReport {
  id: string;
  district: string;
  status: 'on' | 'off' | 'partial' | 'unknown';
  timestamp: Date;
  coordinates: [number, number];
  deviceFingerprint: string;
  isNew: boolean;
}

export const adenDistricts: DistrictData[] = [
  {
    id: 'kraytar',
    name: 'كريتر',
    nameEn: 'Kraytar',
    coordinates: [12.7794, 45.0369],
    bounds: [[12.7600, 45.0200], [12.8000, 45.0600]],
    status: 'on',
    population: 150000,
    area: 15.2,
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000),
    confirmationCount: 3,
    uniqueUsers: 3,
    isConfirmed: true,
    confirmedAt: new Date(Date.now() - 2 * 60 * 1000),
    expiresAt: new Date(Date.now() + 28 * 60 * 1000)
  },
  {
    id: 'al-maalla',
    name: 'المعلا',
    nameEn: 'Al-Maalla',
    coordinates: [12.8000, 45.0000],
    bounds: [[12.7800, 44.9800], [12.8200, 45.0200]],
    status: 'partial',
    population: 120000,
    area: 12.8,
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
    confirmationCount: 2,
    uniqueUsers: 2,
    isConfirmed: false
  },
  {
    id: 'al-tawahi',
    name: 'التواهي',
    nameEn: 'Al-Tawahi',
    coordinates: [12.8200, 45.0200],
    bounds: [[12.8000, 45.0000], [12.8400, 45.0400]],
    status: 'off',
    population: 80000,
    area: 8.5,
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
    confirmationCount: 3,
    uniqueUsers: 3,
    isConfirmed: true,
    confirmedAt: new Date(Date.now() - 25 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  },
  {
    id: 'al-mansoura',
    name: 'المنصورة',
    nameEn: 'Al-Mansoura',
    coordinates: [12.8273, 44.9908],
    bounds: [[12.8100, 44.9700], [12.8500, 45.0100]],
    status: 'on',
    population: 200000,
    area: 18.3,
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
    confirmationCount: 3,
    uniqueUsers: 3,
    isConfirmed: true,
    confirmedAt: new Date(Date.now() - 1 * 60 * 1000),
    expiresAt: new Date(Date.now() + 29 * 60 * 1000)
  },
  {
    id: 'sheikh-othman',
    name: 'الشيخ عثمان',
    nameEn: 'Sheikh Othman',
    coordinates: [12.7800, 44.9800],
    bounds: [[12.7600, 44.9600], [12.8000, 45.0000]],
    status: 'unknown',
    population: 180000,
    area: 16.7,
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000),
    confirmationCount: 0,
    uniqueUsers: 0,
    isConfirmed: false
  },
  {
    id: 'khormaksar',
    name: 'خور مكسر',
    nameEn: 'Khormaksar',
    coordinates: [12.7800, 44.9800],
    bounds: [[12.7600, 44.9600], [12.8000, 45.0000]],
    status: 'on',
    population: 160000,
    area: 14.2,
    lastUpdate: new Date(Date.now() - 8 * 60 * 1000),
    confirmationCount: 3,
    uniqueUsers: 3,
    isConfirmed: true,
    confirmedAt: new Date(Date.now() - 5 * 60 * 1000),
    expiresAt: new Date(Date.now() + 25 * 60 * 1000)
  }
];

// بيانات البلاغات
export const mapReports: MapReport[] = [
  {
    id: 'report_001',
    district: 'كريتر',
    status: 'on',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    coordinates: [12.7794, 45.0369],
    deviceFingerprint: 'device_001',
    isNew: false
  },
  {
    id: 'report_002',
    district: 'المعلا',
    status: 'partial',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    coordinates: [12.8000, 45.0000],
    deviceFingerprint: 'device_002',
    isNew: false
  },
  {
    id: 'report_003',
    district: 'التواهي',
    status: 'off',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    coordinates: [12.8200, 45.0200],
    deviceFingerprint: 'device_003',
    isNew: false
  },
  {
    id: 'report_004',
    district: 'المنصورة',
    status: 'on',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    coordinates: [12.8273, 44.9908],
    deviceFingerprint: 'device_004',
    isNew: true
  },
  {
    id: 'report_005',
    district: 'خور مكسر',
    status: 'on',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    coordinates: [12.7800, 44.9800],
    deviceFingerprint: 'device_005',
    isNew: false
  }
];

// دوال مساعدة
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'on': return '#10B981'; // أخضر
    case 'off': return '#EF4444'; // أحمر
    case 'partial': return '#F59E0B'; // أصفر
    case 'unknown': return '#6B7280'; // رمادي
    default: return '#6B7280';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'on': return '⚡';
    case 'off': return '🔌';
    case 'partial': return '⚡';
    case 'unknown': return '❓';
    default: return '❓';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'on': return 'مشغل';
    case 'off': return 'مطفأ';
    case 'partial': return 'جزئي';
    case 'unknown': return 'غير مؤكد';
    default: return 'غير مؤكد';
  }
};

// إحداثيات مركز عدن
export const ADEN_CENTER: [number, number] = [12.8000, 45.0000];

// مستوى التكبير الافتراضي
export const DEFAULT_ZOOM = 12;

// حدود عدن
export const ADEN_BOUNDS: [[number, number], [number, number]] = [
  [12.7000, 44.9000], // جنوب غرب
  [12.9000, 45.1000]  // شمال شرق
];
