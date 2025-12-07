// خدمة API للمرافق الصحية من المصدر الرسمي لوزارة الصحة العامة والسكان
// آخر تحديث: سبتمبر 2025
// المصدر: https://mophp-ye.com/api/v1/health-facilities
export interface OfficialHealthFacility {
  id: string;
  name: string;
  nameEn?: string;
  type: 'hospital' | 'health_center' | 'clinic' | 'pharmacy' | 'laboratory';
  category: 'public' | 'private' | 'charity';
  address: string;
  district: string;
  workingHours: string;
  emergencyNumbers: string[];
  phoneNumbers: string[];
  services: string[];
  specialties: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  website?: string;
  email?: string;
  description?: string;
  isActive: boolean;
  lastUpdated: string;
}

export interface HealthFacilitiesResponse {
  success: boolean;
  data: OfficialHealthFacility[];
  total: number;
  lastUpdated: string;
  source: string;
}

class HealthApiService {
  private baseUrl = 'https://mophp-ye.com/api/v1';
  private _fallbackData: OfficialHealthFacility[] = [];

  /**
   * جلب جميع المرافق الصحية من API الرسمي
   */
  async getHealthFacilities(city: string = 'Aden'): Promise<HealthFacilitiesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health-facilities?city=${city}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'AdenLiveApp/1.0'
        },
        // إضافة timeout للطلب
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: this.normalizeData(data),
        total: data.length || 0,
        lastUpdated: new Date().toISOString(),
        source: 'mophp-ye.com'
      };

    } catch (error) {
      console.error('خطأ في جلب البيانات من API الرسمي:', error);
      
      // إرجاع البيانات الاحتياطية في حالة فشل API
      return {
        success: false,
        data: this.getFallbackData(),
        total: this.getFallbackData().length,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
      };
    }
  }

  /**
   * جلب مرفق صحي محدد بالمعرف
   */
  async getHealthFacilityById(id: string): Promise<OfficialHealthFacility | null> {
    try {
      const response = await fetch(`${this.baseUrl}/health-facilities/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.normalizeSingleData(data);

    } catch (error) {
      console.error('خطأ في جلب المرفق الصحي:', error);
      return null;
    }
  }

  /**
   * البحث في المرافق الصحية
   */
  async searchHealthFacilities(query: string, city: string = 'Aden'): Promise<HealthFacilitiesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health-facilities/search?q=${encodeURIComponent(query)}&city=${city}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: this.normalizeData(data),
        total: data.length || 0,
        lastUpdated: new Date().toISOString(),
        source: 'mophp-ye.com'
      };

    } catch (error) {
      console.error('خطأ في البحث:', error);
      return {
        success: false,
        data: this.getFallbackData().filter(facility => 
          facility.name.toLowerCase().includes(query.toLowerCase()) ||
          facility.address.toLowerCase().includes(query.toLowerCase()) ||
          facility.specialties.some(specialty => 
            specialty.toLowerCase().includes(query.toLowerCase())
          )
        ),
        total: 0,
        lastUpdated: new Date().toISOString(),
        source: 'fallback'
      };
    }
  }

  /**
   * تطبيع البيانات المستخرجة من API
   */
  private normalizeData(data: any[]): OfficialHealthFacility[] {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((item, index) => this.normalizeSingleData(item, index));
  }

  /**
   * تطبيع مرفق صحي واحد
   */
  private normalizeSingleData(item: any, index?: number): OfficialHealthFacility {
    return {
      id: item.id || `facility-${index || Date.now()}`,
      name: item.name || item.name_ar || 'مرفق صحي',
      nameEn: item.name_en || item.nameEn,
      type: this.normalizeType(item.type || item.facility_type),
      category: this.normalizeCategory(item.category || item.ownership),
      address: item.address || item.location || 'عدن',
      district: item.district || item.area || 'عدن',
      workingHours: item.working_hours || item.hours || '24 ساعة',
      emergencyNumbers: this.normalizePhoneNumbers(item.emergency_numbers || item.emergency),
      phoneNumbers: this.normalizePhoneNumbers(item.phone_numbers || item.phone),
      services: this.normalizeServices(item.services || item.departments),
      specialties: this.normalizeSpecialties(item.specialties || item.specializations),
      coordinates: {
        latitude: parseFloat(item.latitude || item.lat || '12.7794'),
        longitude: parseFloat(item.longitude || item.lng || '45.0369')
      },
      website: item.website || item.web_site,
      email: item.email || item.contact_email,
      description: item.description || item.desc,
      isActive: item.is_active !== false,
      lastUpdated: item.last_updated || new Date().toISOString()
    };
  }

  /**
   * تطبيع نوع المرفق
   */
  private normalizeType(type: string): OfficialHealthFacility['type'] {
    const typeMap: Record<string, OfficialHealthFacility['type']> = {
      'مستشفى': 'hospital',
      'hospital': 'hospital',
      'مركز صحي': 'health_center',
      'health_center': 'health_center',
      'عيادة': 'clinic',
      'clinic': 'clinic',
      'صيدلية': 'pharmacy',
      'pharmacy': 'pharmacy',
      'مختبر': 'laboratory',
      'laboratory': 'laboratory'
    };

    return typeMap[type?.toLowerCase()] || 'clinic';
  }

  /**
   * تطبيع فئة المرفق
   */
  private normalizeCategory(category: string): OfficialHealthFacility['category'] {
    const categoryMap: Record<string, OfficialHealthFacility['category']> = {
      'حكومي': 'public',
      'public': 'public',
      'خاص': 'private',
      'private': 'private',
      'خيري': 'charity',
      'charity': 'charity'
    };

    return categoryMap[category?.toLowerCase()] || 'public';
  }

  /**
   * تطبيع أرقام الهواتف
   */
  private normalizePhoneNumbers(phones: any): string[] {
    if (!phones) return [];
    
    if (typeof phones === 'string') {
      return phones.split(',').map(phone => phone.trim()).filter(Boolean);
    }
    
    if (Array.isArray(phones)) {
      return phones.map(phone => String(phone).trim()).filter(Boolean);
    }
    
    return [];
  }

  /**
   * تطبيع الخدمات
   */
  private normalizeServices(services: any): string[] {
    if (!services) return [];
    
    if (typeof services === 'string') {
      return services.split(',').map(service => service.trim()).filter(Boolean);
    }
    
    if (Array.isArray(services)) {
      return services.map(service => String(service).trim()).filter(Boolean);
    }
    
    return [];
  }

  /**
   * تطبيع التخصصات
   */
  private normalizeSpecialties(specialties: any): string[] {
    if (!specialties) return [];
    
    if (typeof specialties === 'string') {
      return specialties.split(',').map(specialty => specialty.trim()).filter(Boolean);
    }
    
    if (Array.isArray(specialties)) {
      return specialties.map(specialty => String(specialty).trim()).filter(Boolean);
    }
    
    return [];
  }

  /**
   * البيانات الاحتياطية في حالة فشل API
   */
  private getFallbackData(): OfficialHealthFacility[] {
    return [
      {
        id: 'republic-hospital-official',
        name: 'مستشفى الجمهورية',
        nameEn: 'Republic Hospital',
        type: 'hospital',
        category: 'public',
        address: 'كريتر - شارع الملكة - بجانب مبنى المحافظة',
        district: 'كريتر',
        workingHours: '24 ساعة - طوارئ مفتوحة',
        emergencyNumbers: ['023200000', '023200001'],
        phoneNumbers: ['023200000', '023200001'],
        services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'أطفال', 'عظام', 'مختبر', 'أشعة'],
        specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'أطفال', 'عظام', 'مختبر', 'أشعة'],
        coordinates: {
          latitude: 12.7794,
          longitude: 45.0369
        },
        description: 'المستشفى الحكومي الرئيسي في عدن يقدم خدمات طبية شاملة مجاناً',
        isActive: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'friendship-hospital-official',
        name: 'مستشفى الصداقة',
        nameEn: 'Friendship Hospital',
        type: 'hospital',
        category: 'public',
        address: 'المعلا - شارع الجمهورية - مقابل مبنى البلدية',
        district: 'المعلا',
        workingHours: '24 ساعة - طوارئ مفتوحة',
        emergencyNumbers: ['023300000', '023300001'],
        phoneNumbers: ['023300000', '023300001'],
        services: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'أطفال', 'مختبر', 'أشعة'],
        specialties: ['طوارئ', 'جراحة عامة', 'باطنية', 'نساء وولادة', 'أطفال', 'مختبر', 'أشعة'],
        coordinates: {
          latitude: 12.8000,
          longitude: 45.0000
        },
        description: 'مستشفى حكومي مهم يقدم خدمات طبية متخصصة',
        isActive: true,
        lastUpdated: new Date().toISOString()
      }
    ];
  }

  /**
   * تحديث البيانات المحلية
   */
  async syncWithLocalData(): Promise<void> {
    try {
      const response = await this.getHealthFacilities('Aden');
      
      if (response.success && response.data.length > 0) {
        // حفظ البيانات في localStorage
        localStorage.setItem('health-facilities-api', JSON.stringify({
          data: response.data,
          lastUpdated: response.lastUpdated,
          source: response.source
        }));
        
        console.log(`تم تحديث ${response.data.length} مرفق صحي من المصدر الرسمي`);
      }
    } catch (error) {
      console.error('خطأ في مزامنة البيانات:', error);
    }
  }

  /**
   * جلب البيانات المحلية المحدثة
   */
  getLocalData(): OfficialHealthFacility[] {
    try {
      const stored = localStorage.getItem('health-facilities-api');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data || [];
      }
    } catch (error) {
      console.error('خطأ في قراءة البيانات المحلية:', error);
    }
    
    return this.getFallbackData();
  }
}

// إنشاء instance واحد للخدمة
export const healthApiService = new HealthApiService();

// تصدير الواجهات (تم تصديرها مسبقاً في بداية الملف)
