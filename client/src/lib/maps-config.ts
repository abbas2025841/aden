// إعدادات Google Maps - سبتمبر 2025
export const MAPS_CONFIG = {
  // مفتاح API - يجب استبداله بمفتاح حقيقي
  API_KEY: (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBvOkBw3cF4dE7h8i9j0k1l2m3n4o5p6q7r8s9t0',
  
  // إعدادات الخريطة الافتراضية
  DEFAULT_CENTER: {
    lat: 12.7794, // عدن
    lng: 45.0369
  },
  
  DEFAULT_ZOOM: 12,
  
  // مناطق عدن الرئيسية
  ADEN_DISTRICTS: {
    'كريتر': { lat: 12.7794, lng: 45.0369 },
    'الشيخ عثمان': { lat: 12.8500, lng: 44.9500 },
    'خور مكسر': { lat: 12.8000, lng: 44.9800 },
    'المعلا': { lat: 12.7500, lng: 45.0000 },
    'التواهي': { lat: 12.7200, lng: 45.0200 },
    'المنصورة': { lat: 12.9000, lng: 44.9000 }
  },
  
  // أنواع الخرائط
  MAP_TYPES: {
    ROADMAP: 'roadmap',
    SATELLITE: 'satellite',
    HYBRID: 'hybrid',
    TERRAIN: 'terrain'
  },
  
  // إعدادات الماركرز
  MARKER_ICONS: {
    HEALTH: '🏥',
    ELECTRICITY: '⚡',
    WATER: '💧',
    EDUCATION: '🎓',
    JOBS: '💼',
    EMERGENCY: '🚨',
    ANNOUNCEMENTS: '📢',
    IDEAS: '💡'
  }
};

// واجهات TypeScript
export interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
  district?: string;
}

export interface MapMarker {
  id: string;
  position: MapLocation;
  title: string;
  description?: string;
  type: string;
  icon?: string;
  data?: any;
}

export interface DirectionsResult {
  routes: google.maps.DirectionsRoute[];
  status: google.maps.DirectionsStatus;
  request?: google.maps.DirectionsRequest;
}

export interface GeocodingResult {
  results: google.maps.GeocoderResult[];
  status: google.maps.GeocoderStatus;
}
