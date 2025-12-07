// Google Maps API Configuration
export const GOOGLE_MAPS_CONFIG = {
  // استبدل هذا المفتاح بمفتاح API الخاص بك
  API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyD8ymvHslNV9gh2HhkH5RqgUmkna0enmoM',
  
  // إعدادات الخريطة الافتراضية
  DEFAULT_CENTER: {
    lat: 12.8275, // خط عرض عدن
    lng: 45.0367  // خط طول عدن
  },
  
  DEFAULT_ZOOM: 12,
  
  // إعدادات الخريطة
  MAP_OPTIONS: {
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  },
  
  // إعدادات العلامات
  MARKER_OPTIONS: {
    animation: 'DROP' as const,
    draggable: false
  },
  
  // إعدادات البحث
  SEARCH_OPTIONS: {
    types: ['establishment'],
    componentRestrictions: { country: 'ye' } // اليمن
  }
};

// دالة لتحميل Google Maps API
export const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_CONFIG.API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    window.initGoogleMaps = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error('فشل في تحميل Google Maps API'));
    };

    document.head.appendChild(script);
  });
};

// دالة للتحقق من صحة مفتاح API
export const validateGoogleMapsAPIKey = async (): Promise<boolean> => {
  try {
    await loadGoogleMapsAPI();
    return true;
  } catch (error) {
    console.error('خطأ في مفتاح Google Maps API:', error);
    return false;
  }
};
