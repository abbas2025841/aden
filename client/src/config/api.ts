// إعدادات API لأسعار العملات

export interface ApiConfig {
  fixerApiKey: string;
  exchangeRateApiKey: string;
  currencyLayerApiKey: string;
  updateInterval: number;
  fallbackEnabled: boolean;
}

// إعدادات API الافتراضية
export const defaultApiConfig: ApiConfig = {
  fixerApiKey: (import.meta as any).env?.VITE_FIXER_API_KEY || 'YOUR_FIXER_API_KEY',
  exchangeRateApiKey: (import.meta as any).env?.VITE_EXCHANGE_RATE_API_KEY || 'YOUR_EXCHANGE_RATE_API_KEY',
  currencyLayerApiKey: (import.meta as any).env?.VITE_CURRENCY_LAYER_API_KEY || 'YOUR_CURRENCY_LAYER_API_KEY',
  updateInterval: parseInt((import.meta as any).env?.VITE_CURRENCY_UPDATE_INTERVAL || '300000'), // 5 دقائق
  fallbackEnabled: true
};

// URLs للخدمات المختلفة
export const API_URLS = {
  fixer: 'http://data.fixer.io/api',
  exchangeRate: 'https://api.exchangerate-api.com/v4',
  currencyLayer: 'http://api.currencylayer.com',
  // API مجاني بديل
  exchangerateApi: 'https://api.exchangerate-api.com/v4/latest'
};

// العملات المدعومة
export const SUPPORTED_CURRENCIES = [
  'USD', 'SAR', 'AED', 'EUR', 'GBP', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP', 'TRY', 'CNY', 'JPY', 'INR', 'YER'
];

// أسعار التحويل إلى الريال اليمني (محدثة حسب السوق المحلي)
export const YEMENI_RIAL_RATES: Record<string, number> = {
  'USD': 1615,
  'SAR': 425,
  'AED': 440,
  'EUR': 1750,
  'GBP': 2050,
  'QAR': 445,
  'KWD': 5300,
  'BHD': 4300,
  'OMR': 4200,
  'JOD': 2280,
  'EGP': 52,
  'TRY': 55,
  'CNY': 225,
  'JPY': 11,
  'INR': 19.5,
  'YER': 1
};

// رسائل الخطأ
export const ERROR_MESSAGES = {
  API_KEY_MISSING: 'مفتاح API غير محدد',
  API_KEY_INVALID: 'مفتاح API غير صحيح',
  NETWORK_ERROR: 'خطأ في الاتصال بالشبكة',
  RATE_LIMIT_EXCEEDED: 'تم تجاوز حد الطلبات المسموح',
  INVALID_CURRENCY: 'عملة غير مدعومة',
  CALCULATION_ERROR: 'خطأ في حساب التحويل',
  DATA_FETCH_ERROR: 'خطأ في جلب البيانات'
};

// إعدادات التحديث التلقائي
export const UPDATE_SETTINGS = {
  AUTO_UPDATE: true,
  UPDATE_INTERVAL: 5 * 60 * 1000, // 5 دقائق
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 ثانية
};

// إعدادات التخزين المحلي
export const STORAGE_KEYS = {
  CURRENCY_RATES: 'aden_currency_rates',
  LAST_UPDATE: 'aden_last_update',
  FAVORITES: 'aden_favorite_currencies',
  API_CONFIG: 'aden_api_config'
};

// دالة للتحقق من صحة مفتاح API
export const validateApiKey = (apiKey: string): boolean => {
  return apiKey && apiKey !== 'YOUR_FIXER_API_KEY' && apiKey.length > 10;
};

// دالة للحصول على رسالة خطأ مناسبة
export const getErrorMessage = (error: any): string => {
  if (error.message?.includes('API key')) {
    return ERROR_MESSAGES.API_KEY_INVALID;
  }
  if (error.message?.includes('network')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  if (error.message?.includes('rate limit')) {
    return ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
  }
  return ERROR_MESSAGES.DATA_FETCH_ERROR;
};

export default defaultApiConfig;
