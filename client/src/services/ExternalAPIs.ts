// خدمة التكامل مع APIs الخارجية
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  visibility: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  source: string;
  url: string;
  image?: string;
  category: string;
}

export interface TrafficData {
  route: string;
  status: 'clear' | 'moderate' | 'heavy' | 'severe';
  duration: number;
  delay: number;
  incidents: Array<{
    type: string;
    description: string;
    location: string;
  }>;
}

export interface EmergencyAlert {
  id: string;
  type: 'weather' | 'security' | 'health' | 'infrastructure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  affectedAreas: string[];
  issuedAt: string;
  expiresAt?: string;
  source: string;
}

class ExternalAPIService {
  private static instance: ExternalAPIService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

  private constructor() {}

  static getInstance(): ExternalAPIService {
    if (!ExternalAPIService.instance) {
      ExternalAPIService.instance = new ExternalAPIService();
    }
    return ExternalAPIService.instance;
  }

  // جلب بيانات الطقس
  async getWeatherData(city: string = 'Aden'): Promise<APIResponse<WeatherData>> {
    try {
      const cacheKey = `weather_${city}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return { success: true, data: cached, timestamp: new Date().toISOString() };

      // محاكاة API الطقس (في التطبيق الحقيقي، استخدم OpenWeatherMap أو خدمة مشابهة)
      const mockWeatherData: WeatherData = {
        temperature: 28 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        description: ['مشمس', 'غائم جزئياً', 'صافٍ', 'رطب'][Math.floor(Math.random() * 4)],
        icon: '☀️',
        windSpeed: 5 + Math.random() * 15,
        visibility: 8 + Math.random() * 4
      };

      this.setCachedData(cacheKey, mockWeatherData);
      return { success: true, data: mockWeatherData, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: 'فشل في جلب بيانات الطقس', 
        timestamp: new Date().toISOString() 
      };
    }
  }

  // جلب الأخبار المحلية
  async getLocalNews(limit: number = 10): Promise<APIResponse<NewsItem[]>> {
    try {
      const cacheKey = `news_${limit}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return { success: true, data: cached, timestamp: new Date().toISOString() };

      // محاكاة الأخبار المحلية
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'تحسين خدمات المياه في عدن',
          content: 'أعلنت المؤسسة المحلية للمياه عن تحسينات جديدة في شبكة المياه...',
          author: 'مراسل عدن',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'عدن لايف',
          url: '#',
          category: 'خدمات'
        },
        {
          id: '2',
          title: 'افتتاح مركز صحي جديد في كريتر',
          content: 'تم افتتاح مركز صحي متطور في منطقة كريتر يقدم خدمات طبية شاملة...',
          author: 'وزارة الصحة',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: 'وزارة الصحة',
          url: '#',
          category: 'صحة'
        },
        {
          id: '3',
          title: 'تطوير شبكة الكهرباء في المعلا',
          content: 'بدأت أعمال تطوير شبكة الكهرباء في منطقة المعلا لتحسين الخدمة...',
          author: 'شركة الكهرباء',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: 'شركة الكهرباء',
          url: '#',
          category: 'كهرباء'
        }
      ].slice(0, limit);

      this.setCachedData(cacheKey, mockNews);
      return { success: true, data: mockNews, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: 'فشل في جلب الأخبار', 
        timestamp: new Date().toISOString() 
      };
    }
  }

  // جلب بيانات المرور
  async getTrafficData(route?: string): Promise<APIResponse<TrafficData[]>> {
    try {
      const cacheKey = `traffic_${route || 'all'}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return { success: true, data: cached, timestamp: new Date().toISOString() };

      // محاكاة بيانات المرور
      const mockTrafficData: TrafficData[] = [
        {
          route: 'كريتر - المعلا',
          status: 'moderate',
          duration: 25,
          delay: 5,
          incidents: []
        },
        {
          route: 'المعلا - التواهي',
          status: 'heavy',
          duration: 35,
          delay: 10,
          incidents: [{
            type: 'accident',
            description: 'حادث مروري بسيط',
            location: 'شارع الملكة أروى'
          }]
        },
        {
          route: 'التواهي - خور مكسر',
          status: 'clear',
          duration: 15,
          delay: 0,
          incidents: []
        }
      ];

      this.setCachedData(cacheKey, mockTrafficData);
      return { success: true, data: mockTrafficData, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: 'فشل في جلب بيانات المرور', 
        timestamp: new Date().toISOString() 
      };
    }
  }

  // جلب التنبيهات الطارئة
  async getEmergencyAlerts(): Promise<APIResponse<EmergencyAlert[]>> {
    try {
      const cacheKey = 'emergency_alerts';
      const cached = this.getCachedData(cacheKey);
      if (cached) return { success: true, data: cached, timestamp: new Date().toISOString() };

      // محاكاة التنبيهات الطارئة
      const mockAlerts: EmergencyAlert[] = [
        {
          id: '1',
          type: 'weather',
          severity: 'medium',
          title: 'تحذير من ارتفاع درجات الحرارة',
          message: 'من المتوقع ارتفاع درجات الحرارة إلى 40 درجة مئوية خلال الأيام القادمة',
          affectedAreas: ['كريتر', 'المعلا', 'التواهي'],
          issuedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          source: 'المركز الوطني للأرصاد الجوية'
        }
      ];

      this.setCachedData(cacheKey, mockAlerts);
      return { success: true, data: mockAlerts, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: 'فشل في جلب التنبيهات الطارئة', 
        timestamp: new Date().toISOString() 
      };
    }
  }

  // جلب أسعار العملات
  async getCurrencyRates(): Promise<APIResponse<any>> {
    try {
      const cacheKey = 'currency_rates';
      const cached = this.getCachedData(cacheKey);
      if (cached) return { success: true, data: cached, timestamp: new Date().toISOString() };

      // محاكاة أسعار العملات
      const mockRates = {
        USD: { buy: 250.5, sell: 252.0, change: 1.2 },
        SAR: { buy: 66.8, sell: 67.2, change: -0.5 },
        EUR: { buy: 275.3, sell: 277.1, change: 0.8 }
      };

      this.setCachedData(cacheKey, mockRates);
      return { success: true, data: mockRates, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: 'فشل في جلب أسعار العملات', 
        timestamp: new Date().toISOString() 
      };
    }
  }

  // جلب بيانات الأسهم المحلية
  async getStockData(): Promise<APIResponse<any>> {
    try {
      const cacheKey = 'stock_data';
      const cached = this.getCachedData(cacheKey);
      if (cached) return { success: true, data: cached, timestamp: new Date().toISOString() };

      // محاكاة بيانات الأسهم
      const mockStocks = [
        { symbol: 'ADEN', name: 'بنك عدن', price: 125.50, change: 2.3 },
        { symbol: 'YEM', name: 'شركة اليمن للاتصالات', price: 89.75, change: -1.2 },
        { symbol: 'PORT', name: 'ميناء عدن', price: 156.25, change: 0.8 }
      ];

      this.setCachedData(cacheKey, mockStocks);
      return { success: true, data: mockStocks, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: 'فشل في جلب بيانات الأسهم', 
        timestamp: new Date().toISOString() 
      };
    }
  }

  // جلب بيانات الأحداث والفعاليات
  async getEventsData(): Promise<APIResponse<any>> {
    try {
      const cacheKey = 'events_data';
      const cached = this.getCachedData(cacheKey);
      if (cached) return { success: true, data: cached, timestamp: new Date().toISOString() };

      // محاكاة بيانات الأحداث
      const mockEvents = [
        {
          id: '1',
          title: 'مهرجان عدن الثقافي',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'حديقة الصداقة',
          category: 'ثقافي',
          description: 'مهرجان سنوي يعرض التراث الثقافي لعدن'
        },
        {
          id: '2',
          title: 'معرض الكتاب',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'مركز عدن للمؤتمرات',
          category: 'تعليمي',
          description: 'معرض للكتب والمطبوعات المحلية والعربية'
        }
      ];

      this.setCachedData(cacheKey, mockEvents);
      return { success: true, data: mockEvents, timestamp: new Date().toISOString() };
    } catch (error) {
      return { 
        success: false, 
        error: 'فشل في جلب بيانات الأحداث', 
        timestamp: new Date().toISOString() 
      };
    }
  }

  // إدارة التخزين المؤقت
  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // مسح التخزين المؤقت
  clearCache(): void {
    this.cache.clear();
  }

  // الحصول على إحصائيات التخزين المؤقت
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// تصدير المثيل الوحيد
export const externalAPIService = ExternalAPIService.getInstance();