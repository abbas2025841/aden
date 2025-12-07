// خدمة API لخدمات الطوارئ من المصادر الرسمية
export interface EmergencyService {
  id: string;
  name: string;
  nameEn?: string;
  type: 'ambulance' | 'hospital' | 'fire' | 'police' | 'civil_defense' | 'coast_guard' | 'air_emergency';
  category: 'medical' | 'security' | 'fire' | 'rescue' | 'coast' | 'aviation';
  phoneNumbers: string[];
  address: string;
  district: string;
  workingHours: string;
  services: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  website?: string;
  email?: string;
  description?: string;
  isActive: boolean;
  lastUpdated: string;
  priority: 'high' | 'medium' | 'low';
  responseTime?: string; // متوسط وقت الاستجابة
  coverage?: string[]; // المناطق التي يغطيها
}

export interface EmergencyServicesResponse {
  success: boolean;
  data: EmergencyService[];
  total: number;
  lastUpdated: string;
  source: string;
}

export interface EmergencyNewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  publishedAt: string;
  source: string;
  url?: string;
  imageUrl?: string;
  category: 'alert' | 'update' | 'guidance' | 'campaign';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface EmergencyNewsResponse {
  success: boolean;
  data: EmergencyNewsItem[];
  total: number;
  lastUpdated: string;
  source: string;
}

class EmergencyApiService {
  private baseUrl = 'https://api.emergency-aden.gov.ye/v1'; // URL وهمي للمثال
  private newsUrl = 'https://news.emergency-aden.gov.ye/api/v1'; // URL وهمي للمثال
  private cacheKey = 'emergency-services-cache';
  private newsCacheKey = 'emergency-news-cache';
  private cacheExpiry = 15 * 60 * 1000; // 15 دقيقة للطوارئ

  /**
   * جلب جميع خدمات الطوارئ من API الرسمي
   */
  async getEmergencyServices(city: string = 'Aden'): Promise<EmergencyServicesResponse> {
    try {
      // محاولة جلب البيانات من الذاكرة المؤقتة أولاً
      const cachedData = this.getCachedData();
      if (cachedData && !this.isCacheExpired(cachedData.timestamp)) {
        return {
          success: true,
          data: cachedData.data,
          total: cachedData.data.length,
          lastUpdated: cachedData.timestamp,
          source: 'cache'
        };
      }

      // جلب البيانات من API (محاكاة - في الواقع سيتم استبدالها بـ API حقيقي)
      const response = await this.fetchFromOfficialSource(city);
      
      // حفظ البيانات في الذاكرة المؤقتة
      this.setCachedData(response.data);

      return {
        success: true,
        data: response.data,
        total: response.data.length,
        lastUpdated: new Date().toISOString(),
        source: 'emergency-aden.gov.ye'
      };

    } catch (error) {
      console.error('خطأ في جلب بيانات الطوارئ من API:', error);
      
      // محاولة استخدام البيانات المحفوظة في الذاكرة المؤقتة
      const cachedData = this.getCachedData();
      if (cachedData) {
        return {
          success: true,
          data: cachedData.data,
          total: cachedData.data.length,
          lastUpdated: cachedData.timestamp,
          source: 'cache-fallback'
        };
      }

      // إرجاع بيانات فارغة في حالة الفشل
      return {
        success: false,
        data: [],
        total: 0,
        lastUpdated: new Date().toISOString(),
        source: 'error'
      };
    }
  }

  /**
   * جلب خدمة طوارئ محددة بالمعرف
   */
  async getEmergencyServiceById(id: string): Promise<EmergencyService | null> {
    try {
      const response = await this.getEmergencyServices();
      if (response.success) {
        return response.data.find(service => service.id === id) || null;
      }
      return null;
    } catch (error) {
      console.error('خطأ في جلب خدمة الطوارئ:', error);
      return null;
    }
  }

  /**
   * البحث في خدمات الطوارئ
   */
  async searchEmergencyServices(query: string, city: string = 'Aden'): Promise<EmergencyServicesResponse> {
    try {
      const response = await this.getEmergencyServices(city);
      if (response.success) {
        const filteredData = response.data.filter(service => 
          service.name.toLowerCase().includes(query.toLowerCase()) ||
          service.address.toLowerCase().includes(query.toLowerCase()) ||
          service.services.some(serviceItem => 
            serviceItem.toLowerCase().includes(query.toLowerCase())
          )
        );

        return {
          ...response,
          data: filteredData,
          total: filteredData.length
        };
      }
      return response;
    } catch (error) {
      console.error('خطأ في البحث في خدمات الطوارئ:', error);
      return {
        success: false,
        data: [],
        total: 0,
        lastUpdated: new Date().toISOString(),
        source: 'error'
      };
    }
  }

  /**
   * جلب أخبار الطوارئ
   */
  async getEmergencyNews(limit: number = 5): Promise<EmergencyNewsResponse> {
    try {
      // محاولة جلب البيانات من الذاكرة المؤقتة أولاً
      const cachedNews = this.getCachedNews();
      if (cachedNews && !this.isCacheExpired(cachedNews.timestamp)) {
        return {
          success: true,
          data: cachedNews.data.slice(0, limit),
          total: cachedNews.data.length,
          lastUpdated: cachedNews.timestamp,
          source: 'cache'
        };
      }

      // جلب الأخبار من API (محاكاة)
      const newsData = await this.fetchEmergencyNews();
      
      // حفظ البيانات في الذاكرة المؤقتة
      this.setCachedNews(newsData);

      return {
        success: true,
        data: newsData.slice(0, limit),
        total: newsData.length,
        lastUpdated: new Date().toISOString(),
        source: 'emergency-news.gov.ye'
      };

    } catch (error) {
      console.error('خطأ في جلب أخبار الطوارئ:', error);
      
      // محاولة استخدام البيانات المحفوظة في الذاكرة المؤقتة
      const cachedNews = this.getCachedNews();
      if (cachedNews) {
        return {
          success: true,
          data: cachedNews.data.slice(0, limit),
          total: cachedNews.data.length,
          lastUpdated: cachedNews.timestamp,
          source: 'cache-fallback'
        };
      }

      return {
        success: false,
        data: [],
        total: 0,
        lastUpdated: new Date().toISOString(),
        source: 'error'
      };
    }
  }

  /**
   * محاكاة جلب البيانات من المصدر الرسمي
   */
  private async fetchFromOfficialSource(_city: string): Promise<{ data: EmergencyService[] }> {
    // في الواقع، سيتم استبدال هذا بـ API call حقيقي
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "emergency_001",
              name: "الإسعاف العام - عدن",
              nameEn: "General Ambulance - Aden",
              type: "ambulance",
              category: "medical",
              phoneNumbers: ["191", "+967-2-123456"],
              address: "شارع الملكة أروى، مديرية صيرة",
              district: "صيرة",
              workingHours: "24 ساعة يومياً",
              services: ["إسعاف طبي", "نقل المرضى", "طوارئ"],
              coordinates: {
                latitude: 12.8333,
                longitude: 44.9817
              },
              website: "https://ambulance-aden.gov.ye",
              email: "info@ambulance-aden.gov.ye",
              description: "خدمة الإسعاف الرسمية في عدن",
              isActive: true,
              lastUpdated: new Date().toISOString(),
              priority: "high",
              responseTime: "5-10 دقائق",
              coverage: ["صيرة", "التواهي", "المعلا"]
            },
            {
              id: "emergency_002",
              name: "الدفاع المدني - عدن",
              nameEn: "Civil Defense - Aden",
              type: "civil_defense",
              category: "fire",
              phoneNumbers: ["191", "+967-2-234567"],
              address: "شارع الدفاع المدني، مديرية التواهي",
              district: "التواهي",
              workingHours: "24 ساعة يومياً",
              services: ["إطفاء حرائق", "إنقاذ", "طوارئ"],
              coordinates: {
                latitude: 12.8400,
                longitude: 44.9900
              },
              description: "خدمة الدفاع المدني في عدن",
              isActive: true,
              lastUpdated: new Date().toISOString(),
              priority: "high",
              responseTime: "3-7 دقائق",
              coverage: ["التواهي", "المعلا", "خور مكسر"]
            }
          ]
        });
      }, 1000);
    });
  }

  /**
   * محاكاة جلب أخبار الطوارئ
   */
  private async fetchEmergencyNews(): Promise<EmergencyNewsItem[]> {
    // في الواقع، سيتم استبدال هذا بـ API call حقيقي
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "emergency_news_001",
            title: "تحديث أرقام الطوارئ في عدن",
            content: "تم تحديث أرقام الطوارئ الرسمية في محافظة عدن. يرجى حفظ الأرقام الجديدة...",
            summary: "تحديث أرقام الطوارئ الرسمية في عدن",
            publishedAt: new Date().toISOString(),
            source: "وزارة الداخلية - عدن",
            url: "https://emergency.gov.ye/news/001",
            category: "update",
            severity: "medium"
          },
          {
            id: "emergency_news_002",
            title: "حملة توعية بالإسعافات الأولية",
            content: "تنظم وزارة الصحة حملة توعية شاملة حول الإسعافات الأولية في جميع مديريات عدن...",
            summary: "حملة توعية بالإسعافات الأولية",
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            source: "وزارة الصحة العامة والسكان",
            url: "https://emergency.gov.ye/news/002",
            category: "campaign",
            severity: "low"
          }
        ]);
      }, 1000);
    });
  }

  /**
   * جلب البيانات من الذاكرة المؤقتة
   */
  private getCachedData(): { data: EmergencyService[], timestamp: string } | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('خطأ في قراءة ذاكرة الطوارئ المؤقتة:', error);
    }
    return null;
  }

  /**
   * حفظ البيانات في الذاكرة المؤقتة
   */
  private setCachedData(data: EmergencyService[]): void {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('خطأ في حفظ ذاكرة الطوارئ المؤقتة:', error);
    }
  }

  /**
   * جلب الأخبار من الذاكرة المؤقتة
   */
  private getCachedNews(): { data: EmergencyNewsItem[], timestamp: string } | null {
    try {
      const cached = localStorage.getItem(this.newsCacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('خطأ في قراءة ذاكرة أخبار الطوارئ المؤقتة:', error);
    }
    return null;
  }

  /**
   * حفظ الأخبار في الذاكرة المؤقتة
   */
  private setCachedNews(data: EmergencyNewsItem[]): void {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.newsCacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('خطأ في حفظ ذاكرة أخبار الطوارئ المؤقتة:', error);
    }
  }

  /**
   * فحص انتهاء صلاحية الذاكرة المؤقتة
   */
  private isCacheExpired(timestamp: string): boolean {
    const cacheTime = new Date(timestamp).getTime();
    const now = Date.now();
    return (now - cacheTime) > this.cacheExpiry;
  }

  /**
   * مسح الذاكرة المؤقتة
   */
  clearCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      localStorage.removeItem(this.newsCacheKey);
    } catch (error) {
      console.error('خطأ في مسح ذاكرة الطوارئ المؤقتة:', error);
    }
  }

  /**
   * فحص حالة الاتصال بالAPI
   */
  async checkConnection(): Promise<boolean> {
    try {
      // محاكاة فحص الاتصال
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 500);
      });
    } catch (error) {
      return false;
    }
  }
}

// إنشاء instance واحد من الخدمة
export const emergencyApiService = new EmergencyApiService();
