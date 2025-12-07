// مفاتيح API للتطبيق
export const API_KEYS = {
  // مجاني من Google AI Studio - مفتاح جديد
  GEMINI_API_KEY: 'AIzaSyAwv01RCrs_aTlcBEXQuWjDPZinZJmFVSQ',
  
  // مجاني من Groq (اختياري)
  GROQ_API_KEY: '', // أضف مفتاح Groq هنا إذا كان متوفراً
  
  // مفاتيح أخرى
  OPENAI_API_KEY: '', // OpenAI (اختياري)
} as const;

// إعدادات التطبيق
export const APP_CONFIG = {
  NAME: 'AdenLive',
  VERSION: '1.0.0',
  ENVIRONMENT: 'development',
  DEFAULT_AI_PROVIDER: 'gemini', // 'gemini' | 'groq' | 'openai'
} as const;

// إعدادات Gemini
export const GEMINI_CONFIG = {
  MODEL: 'gemini-2.0-flash-exp',
  TEMPERATURE: 0.7,
  MAX_OUTPUT_TOKENS: 512,
  TOP_P: 0.8,
  TOP_K: 40,
  SAFETY_SETTINGS: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
} as const;

// إعدادات Groq
export const GROQ_CONFIG = {
  MODEL: 'llama-3.1-70b-versatile',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 512,
  TOP_P: 0.8,
  TOP_K: 40,
} as const;

// إعدادات OpenAI
export const OPENAI_CONFIG = {
  MODEL: 'gpt-3.5-turbo',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 512,
  TOP_P: 0.8,
  FREQUENCY_PENALTY: 0,
  PRESENCE_PENALTY: 0,
} as const;

// حدود الاستخدام
export const USAGE_LIMITS = {
  DAILY_REQUESTS: 15,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_TOKENS_PER_REQUEST: 512,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 دقيقة
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 دقيقة
  RATE_LIMIT_REQUESTS: 5, // 5 طلبات في الدقيقة
} as const;

// إعدادات الأمان
export const SECURITY_CONFIG = {
  ENABLE_CONTENT_FILTERING: true,
  ENABLE_RATE_LIMITING: true,
  ENABLE_LOGGING: true,
  LOG_LEVEL: 'info', // 'debug' | 'info' | 'warn' | 'error'
} as const;

// إعدادات التخزين
export const STORAGE_CONFIG = {
  CONVERSATION_HISTORY_LIMIT: 50,
  CACHE_DURATION: 5 * 60 * 1000, // 5 دقائق
  PERSIST_USER_PREFERENCES: true,
} as const;
