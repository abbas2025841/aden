// خدمة API للمرافق التعليمية من المصادر الرسمية
export interface OfficialEducationFacility {
  id: string;
  name: string;
  nameEn?: string;
  type: 'school' | 'university' | 'college' | 'institute' | 'kindergarten';
  category: 'public' | 'private' | 'international';
  level: 'primary' | 'intermediate' | 'secondary' | 'university' | 'mixed';
  address: string;
  district: string;
  specialties: string[];
  phoneNumbers: string[];
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
  academicYear: string;
  tuitionFees?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface EducationFacilitiesResponse {
  success: boolean;
  data: OfficialEducationFacility[];
  total: number;
  lastUpdated: string;
  source: string;
}

export interface EducationNewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  publishedAt: string;
  source: string;
  url?: string;
  imageUrl?: string;
  category: 'general' | 'enrollment' | 'academic' | 'events';
}

export interface EducationNewsResponse {
  success: boolean;
  data: EducationNewsItem[];
  total: number;
  lastUpdated: string;
  source: string;
}

class EducationApiService {
  private baseUrl = 'https://api.education-aden.gov.ye/v1'; // URL وهمي للمثال
  private newsUrl = 'https://news.education-aden.gov.ye/api/v1'; // URL وهمي للمثال
  private cacheKey = 'education-facilities-cache';
  private newsCacheKey = 'education-news-cache';
  private cacheExpiry = 30 * 60 * 1000; // 30 دقيقة

  /**
   * جلب جميع المرافق التعليمية من API الرسمي
   */
  async getEducationFacilities(city: string = 'Aden'): Promise<EducationFacilitiesResponse> {
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
        source: 'education-aden.gov.ye'
      };

    } catch (error) {
      console.error('خطأ في جلب البيانات من API التعليمي:', error);
      
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
   * جلب مرفق تعليمي محدد بالمعرف
   */
  async getEducationFacilityById(id: string): Promise<OfficialEducationFacility | null> {
    try {
      const response = await this.getEducationFacilities();
      if (response.success) {
        return response.data.find(facility => facility.id === id) || null;
      }
      return null;
    } catch (error) {
      console.error('خطأ في جلب المرفق التعليمي:', error);
      return null;
    }
  }

  /**
   * البحث في المرافق التعليمية
   */
  async searchEducationFacilities(query: string, city: string = 'Aden'): Promise<EducationFacilitiesResponse> {
    try {
      const response = await this.getEducationFacilities(city);
      if (response.success) {
        const filteredData = response.data.filter(facility => 
          facility.name.toLowerCase().includes(query.toLowerCase()) ||
          facility.address.toLowerCase().includes(query.toLowerCase()) ||
          facility.specialties.some(specialty => 
            specialty.toLowerCase().includes(query.toLowerCase())
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
      console.error('خطأ في البحث التعليمي:', error);
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
   * جلب أخبار التعليم
   */
  async getEducationNews(limit: number = 5): Promise<EducationNewsResponse> {
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
      const newsData = await this.fetchEducationNews();
      
      // حفظ البيانات في الذاكرة المؤقتة
      this.setCachedNews(newsData);

      return {
        success: true,
        data: newsData.slice(0, limit),
        total: newsData.length,
        lastUpdated: new Date().toISOString(),
        source: 'education-news.gov.ye'
      };

    } catch (error) {
      console.error('خطأ في جلب أخبار التعليم:', error);
      
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
  private async fetchFromOfficialSource(_city: string): Promise<{ data: OfficialEducationFacility[] }> {
    // في الواقع، سيتم استبدال هذا بـ API call حقيقي
    // هذا مجرد محاكاة للبيانات
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              id: "official_school_001",
              name: "مدرسة عدن الرسمية",
              nameEn: "Aden Official School",
              type: "school",
              category: "public",
              level: "mixed",
              address: "شارع التعليم، مديرية صيرة",
              district: "صيرة",
              specialties: ["تعليم أساسي", "تعليم ثانوي"],
              phoneNumbers: ["+967-2-111111"],
              workingHours: "7:30 ص - 1:30 م (الأحد - الخميس)",
              services: ["تعليم", "أنشطة", "مكتبة"],
              coordinates: {
                latitude: 12.8333,
                longitude: 44.9817
              },
              website: "https://aden-school.gov.ye",
              email: "info@aden-school.gov.ye",
              description: "مدرسة حكومية رسمية",
              isActive: true,
              lastUpdated: new Date().toISOString(),
              academicYear: "2024-2025"
            }
          ]
        });
      }, 1000);
    });
  }

  /**
   * محاكاة جلب أخبار التعليم
   */
  private async fetchEducationNews(): Promise<EducationNewsItem[]> {
    // في الواقع، سيتم استبدال هذا بـ API call حقيقي
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "news_001",
            title: "بدء التسجيل الإلكتروني للعام الدراسي 2024-2025",
            content: "أعلنت وزارة التربية والتعليم عن بدء التسجيل الإلكتروني للعام الدراسي الجديد...",
            summary: "بدء التسجيل الإلكتروني للعام الدراسي الجديد",
            publishedAt: new Date().toISOString(),
            source: "وزارة التربية والتعليم",
            url: "https://education.gov.ye/news/001",
            category: "enrollment"
          },
          {
            id: "news_002",
            title: "افتتاح مدرسة جديدة في مديرية الشيخ عثمان",
            content: "تم افتتاح مدرسة جديدة في مديرية الشيخ عثمان لتخفيف الازدحام...",
            summary: "افتتاح مدرسة جديدة في الشيخ عثمان",
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            source: "مكتب التربية والتعليم - عدن",
            url: "https://education.gov.ye/news/002",
            category: "general"
          }
        ]);
      }, 1000);
    });
  }

  /**
   * جلب البيانات من الذاكرة المؤقتة
   */
  private getCachedData(): { data: OfficialEducationFacility[], timestamp: string } | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('خطأ في قراءة الذاكرة المؤقتة:', error);
    }
    return null;
  }

  /**
   * حفظ البيانات في الذاكرة المؤقتة
   */
  private setCachedData(data: OfficialEducationFacility[]): void {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('خطأ في حفظ الذاكرة المؤقتة:', error);
    }
  }

  /**
   * جلب الأخبار من الذاكرة المؤقتة
   */
  private getCachedNews(): { data: EducationNewsItem[], timestamp: string } | null {
    try {
      const cached = localStorage.getItem(this.newsCacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('خطأ في قراءة ذاكرة الأخبار المؤقتة:', error);
    }
    return null;
  }

  /**
   * حفظ الأخبار في الذاكرة المؤقتة
   */
  private setCachedNews(data: EducationNewsItem[]): void {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.newsCacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('خطأ في حفظ ذاكرة الأخبار المؤقتة:', error);
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
      console.error('خطأ في مسح الذاكرة المؤقتة:', error);
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
export const educationApiService = new EducationApiService();
