// بيانات كهرباء عدن - Cursor الأسطوري
export interface ElectricityStatus {
  id: string;
  district: string;
  status: 'on' | 'off' | 'partial' | 'unknown';
  lastUpdate: Date;
  powerLoad: number;
  estimatedDuration?: string;
  notes?: string;
  isRecentlyUpdated: boolean;
}

export const adenElectricityData: ElectricityStatus[] = [
  {
    id: 'electricity_001',
    district: 'كريتر',
    status: 'on',
    lastUpdate: new Date(Date.now() - 5 * 60 * 1000),
    powerLoad: 85,
    estimatedDuration: 'مستقر',
    notes: 'الخدمة تعمل بشكل طبيعي',
    isRecentlyUpdated: true
  },
  {
    id: 'electricity_002',
    district: 'المعلا',
    status: 'partial',
    lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
    powerLoad: 45,
    estimatedDuration: '2-3 ساعات',
    notes: 'انقطاع جزئي - جاري الإصلاح',
    isRecentlyUpdated: false
  },
  {
    id: 'electricity_003',
    district: 'التواهي',
    status: 'off',
    lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
    powerLoad: 0,
    estimatedDuration: '4-6 ساعات',
    notes: 'انقطاع كامل - عطل في المحطة',
    isRecentlyUpdated: false
  },
  {
    id: 'electricity_004',
    district: 'المنصورة',
    status: 'on',
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
    powerLoad: 92,
    estimatedDuration: 'مستقر',
    notes: 'الخدمة تعمل بكفاءة عالية',
    isRecentlyUpdated: true
  },
  {
    id: 'electricity_005',
    district: 'الشيخ عثمان',
    status: 'unknown',
    lastUpdate: new Date(Date.now() - 45 * 60 * 1000),
    powerLoad: 0,
    estimatedDuration: 'غير محدد',
    notes: 'لا توجد معلومات محدثة',
    isRecentlyUpdated: false
  }
];

export const getStatusColor = (status: ElectricityStatus['status']) => {
  switch (status) {
    case 'on': return 'text-green-600 bg-green-100 border-green-200';
    case 'off': return 'text-red-600 bg-red-100 border-red-200';
    case 'partial': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    case 'unknown': return 'text-gray-600 bg-gray-100 border-gray-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

export const getStatusIcon = (status: ElectricityStatus['status']) => {
  switch (status) {
    case 'on': return '⚡';
    case 'off': return '🔌';
    case 'partial': return '⚡';
    case 'unknown': return '❓';
    default: return '❓';
  }
};

export const getStatusText = (status: ElectricityStatus['status']) => {
  switch (status) {
    case 'on': return 'مشغل';
    case 'off': return 'مطفأ';
    case 'partial': return 'جزئي';
    case 'unknown': return 'غير مؤكد';
    default: return 'غير مؤكد';
  }
};

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'الآن';
  if (diffInMinutes < 60) return `قبل ${diffInMinutes} دقيقة`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `قبل ${diffInHours} ساعة`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `قبل ${diffInDays} يوم`;
};