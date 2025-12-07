// تصدير جميع الأنواع
export * from './job';

// أنواع إضافية للتطبيق
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  performance: {
    dataSaving: boolean;
    lowPowerMode: boolean;
    cacheEnabled: boolean;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  url?: string;
  external?: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'health' | 'education' | 'government' | 'commercial' | 'other';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  rating: number;
  reviews: number;
  isVerified: boolean;
  description?: string;
  images?: string[];
  services?: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  publishedAt: Date;
  category: string;
  tags: string[];
  image?: string;
  isBreaking: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  shares: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
  icon: string;
  forecast: {
    date: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }[];
}

export interface CurrencyRate {
  currency: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'ambulance' | 'fire' | 'civil_defense' | 'other';
  description?: string;
  isActive: boolean;
}

export interface Feedback {
  id: string;
  userId?: string;
  type: 'bug' | 'feature' | 'improvement' | 'complaint' | 'praise';
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  response?: string;
  rating?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}

export interface AppConfig {
  version: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxFileSize: number;
    maxImageSize: number;
    maxRequestsPerDay: number;
    maxRequestsPerHour: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
}
