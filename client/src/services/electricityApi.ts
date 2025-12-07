// خدمة API للكهرباء في عدن - سبتمبر 2025
// مصادر البيانات: وزارة الكهرباء والطاقة، شركة الكهرباء العامة، مصادر محلية موثوقة

export interface ElectricityApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  lastUpdated: string;
  source: 'pecaden.com' | 'moee-ye.com' | 'local';
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface ElectricityOutageApi {
  id: string;
  area: string;
  district: string;
  startTime: string;
  endTime?: string;
  reason: string;
  status: 'planned' | 'emergency' | 'maintenance' | 'technical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedCustomers: number;
  estimatedDuration?: string;
  contactInfo: {
    phone: string[];
    whatsapp?: string;
    email?: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  lastUpdated: string;
}

export interface PowerStationApi {
  id: string;
  name: string;
  nameEn: string;
  type: 'main' | 'substation' | 'distribution' | 'backup';
  capacity: number;
  status: 'operational' | 'maintenance' | 'offline' | 'overloaded';
  location: {
    address: string;
    district: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  contactInfo: {
    phone: string[];
    emergency: string[];
    email?: string;
  };
  services: string[];
  lastMaintenance: string;
  nextMaintenance?: string;
  loadPercentage: number;
}

export interface ElectricityServiceApi {
  id: string;
  name: string;
  type: 'billing' | 'connection' | 'maintenance' | 'emergency' | 'complaint';
  description: string;
  contactInfo: {
    phone: string[];
    whatsapp?: string;
    email?: string;
    address: string;
  };
  workingHours: string;
  requirements: string[];
  fees?: {
    connection: number;
    maintenance: number;
    emergency: number;
  };
  responseTime: string;
}

export interface SolarChargingStationApi {
  id: string;
  name: string;
  location: {
    address: string;
    district: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  capacity: number;
  availableSlots: number;
  services: string[];
  pricing: {
    perHour: number;
    perDevice: number;
  };
  workingHours: string;
  contactInfo: {
    phone: string[];
    whatsapp?: string;
  };
  rating: number;
  features: string[];
}

export interface ElectricityStatsApi {
  totalCustomers: number;
  totalCapacity: number;
  currentLoad: number;
  loadPercentage: number;
  averageOutageDuration: string;
  plannedOutagesThisMonth: number;
  emergencyOutagesThisMonth: number;
  customerSatisfaction: number;
  lastUpdated: string;
}

// URLs للمصادر الرسمية
const API_BASE_URLS = {
  PEC_ADEN: 'https://pecaden.com/api/v1',
  MOEE_YE: 'https://moee-ye.com/api/v1',
  LOCAL: 'local'
};

class ElectricityApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_BASE_URLS.PEC_ADEN;
    this.timeout = 10000; // 10 seconds
  }

  // جلب بيانات انقطاع الكهرباء
  async getOutages(area?: string): Promise<ElectricityApiResponse<ElectricityOutageApi[]>> {
    try {
      const url = area 
        ? `${this.baseUrl}/outages?area=${encodeURIComponent(area)}`
        : `${this.baseUrl}/outages`;
      
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.outages || [],
        total: data.total || 0,
        lastUpdated: new Date().toISOString(),
        source: 'pecaden.com'
      };
    } catch (error) {
      console.error('Error fetching electricity outages:', error);
      return {
        success: false,
        data: [],
        lastUpdated: new Date().toISOString(),
        source: 'local',
        error: {
          code: 'FETCH_ERROR',
          message: 'فشل في جلب بيانات انقطاع الكهرباء',
          details: error instanceof Error ? error.message : 'خطأ غير معروف'
        }
      };
    }
  }

  // جلب بيانات محطات الكهرباء
  async getPowerStations(): Promise<ElectricityApiResponse<PowerStationApi[]>> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/power-stations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.stations || [],
        total: data.total || 0,
        lastUpdated: new Date().toISOString(),
        source: 'pecaden.com'
      };
    } catch (error) {
      console.error('Error fetching power stations:', error);
      return {
        success: false,
        data: [],
        lastUpdated: new Date().toISOString(),
        source: 'local',
        error: {
          code: 'FETCH_ERROR',
          message: 'فشل في جلب بيانات محطات الكهرباء',
          details: error instanceof Error ? error.message : 'خطأ غير معروف'
        }
      };
    }
  }

  // جلب خدمات الكهرباء
  async getElectricityServices(): Promise<ElectricityApiResponse<ElectricityServiceApi[]>> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/services`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.services || [],
        total: data.total || 0,
        lastUpdated: new Date().toISOString(),
        source: 'pecaden.com'
      };
    } catch (error) {
      console.error('Error fetching electricity services:', error);
      return {
        success: false,
        data: [],
        lastUpdated: new Date().toISOString(),
        source: 'local',
        error: {
          code: 'FETCH_ERROR',
          message: 'فشل في جلب خدمات الكهرباء',
          details: error instanceof Error ? error.message : 'خطأ غير معروف'
        }
      };
    }
  }

  // جلب محطات الشحن الشمسي
  async getSolarChargingStations(): Promise<ElectricityApiResponse<SolarChargingStationApi[]>> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/solar-charging`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.stations || [],
        total: data.total || 0,
        lastUpdated: new Date().toISOString(),
        source: 'pecaden.com'
      };
    } catch (error) {
      console.error('Error fetching solar charging stations:', error);
      return {
        success: false,
        data: [],
        lastUpdated: new Date().toISOString(),
        source: 'local',
        error: {
          code: 'FETCH_ERROR',
          message: 'فشل في جلب محطات الشحن الشمسي',
          details: error instanceof Error ? error.message : 'خطأ غير معروف'
        }
      };
    }
  }

  // جلب إحصائيات الكهرباء
  async getElectricityStats(): Promise<ElectricityApiResponse<ElectricityStatsApi>> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.stats || {},
        lastUpdated: new Date().toISOString(),
        source: 'pecaden.com'
      };
    } catch (error) {
      console.error('Error fetching electricity stats:', error);
      return {
        success: false,
        data: {
          totalCustomers: 0,
          totalCapacity: 0,
          currentLoad: 0,
          loadPercentage: 0,
          averageOutageDuration: 'غير متاح',
          plannedOutagesThisMonth: 0,
          emergencyOutagesThisMonth: 0,
          customerSatisfaction: 0,
          lastUpdated: new Date().toISOString()
        },
        lastUpdated: new Date().toISOString(),
        source: 'local',
        error: {
          code: 'FETCH_ERROR',
          message: 'فشل في جلب إحصائيات الكهرباء',
          details: error instanceof Error ? error.message : 'خطأ غير معروف'
        }
      };
    }
  }

  // جلب حالة الكهرباء العامة
  async getPowerStatus(area?: string): Promise<ElectricityApiResponse<{ status: string; message: string; lastUpdated: string }>> {
    try {
      const url = area 
        ? `${this.baseUrl}/power-status?area=${encodeURIComponent(area)}`
        : `${this.baseUrl}/power-status`;
      
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data.status || { status: 'unknown', message: 'حالة غير معروفة', lastUpdated: new Date().toISOString() },
        lastUpdated: new Date().toISOString(),
        source: 'pecaden.com'
      };
    } catch (error) {
      console.error('Error fetching power status:', error);
      return {
        success: false,
        data: { status: 'unknown', message: 'حالة غير معروفة', lastUpdated: new Date().toISOString() },
        lastUpdated: new Date().toISOString(),
        source: 'local',
        error: {
          code: 'FETCH_ERROR',
          message: 'فشل في جلب حالة الكهرباء',
          details: error instanceof Error ? error.message : 'خطأ غير معروف'
        }
      };
    }
  }

  // دالة مساعدة للطلب مع timeout
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'AdenLiveApp/1.0',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // فحص حالة الاتصال
  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/health`, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // جلب معلومات الاتصال
  getContactInfo() {
    return {
      mainOffice: {
        address: "شارع الملك فيصل، كريتر، عدن",
        phone: ["+967-2-234567", "+967-2-234568"],
        email: "info@pecaden.com",
        workingHours: "الأحد - الخميس: 8:00 - 16:00"
      },
      emergency: {
        phone: ["+967-2-999999", "+967-2-888888"],
        whatsapp: "+967-712345683",
        workingHours: "24/7"
      },
      socialMedia: {
        facebook: "https://facebook.com/PEC.SheikhOsman",
        twitter: "@PECAden",
        instagram: "@pec_aden"
      },
      website: "https://pecaden.com"
    };
  }
}

// إنشاء instance واحد للخدمة
export const electricityApiService = new ElectricityApiService();
