// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBvOkBw3cF4dE7h8i9j0k1l2m3n4o5p6q7r8s9t0',
  language: 'ar',
  region: 'YE',
  libraries: ['places', 'geometry', 'drawing'] as const,
  mapOptions: {
    center: { lat: 12.8275, lng: 45.0364 }, // Aden coordinates
    zoom: 12,
    mapTypeId: 'roadmap' as google.maps.MapTypeId,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }
};

// Validate Google Maps API key
export function validateGoogleMapsAPI(): boolean {
  const apiKey = GOOGLE_MAPS_CONFIG.apiKey;
  return apiKey && apiKey.length > 0 && !apiKey.includes('YOUR_API_KEY');
}

// App Configuration
export const APP_CONFIG = {
  name: 'Aden Live',
  version: '1.0.0',
  description: 'منصة عدن لايف للخدمات المحلية',
  baseUrl: (import.meta as any).env?.VITE_APP_BASE_URL || 'http://localhost:5000',
  apiUrl: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api',
  environment: (import.meta as any).env?.MODE || 'development'
};

// Cache Configuration
export const CACHE_CONFIG = {
  enabled: true,
  ttl: 3600000, // 1 hour
  maxSize: 100
};

// Theme Configuration
export const THEME_CONFIG = {
  defaultTheme: 'light',
  themes: ['light', 'dark'] as const,
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  }
};

// Localization Configuration
export const LOCALE_CONFIG = {
  defaultLocale: 'ar',
  locales: ['ar', 'en'] as const,
  rtl: true
};

// Export all configurations
export default {
  GOOGLE_MAPS_CONFIG,
  APP_CONFIG,
  CACHE_CONFIG,
  THEME_CONFIG,
  LOCALE_CONFIG,
  validateGoogleMapsAPI
};
