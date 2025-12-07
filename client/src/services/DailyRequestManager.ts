// إدارة الطلبات اليومية في الواجهة الأمامية
import { USAGE_LIMITS, SECURITY_CONFIG } from '@/config/api-keys';

export interface DailyRequestData {
  date: string;
  count: number;
  requests: RequestRecord[];
  lastReset: number;
}

export interface RequestRecord {
  id: string;
  timestamp: number;
  provider: string;
  tokensUsed: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: number;
  isLimited: boolean;
}

class DailyRequestManager {
  private storageKey = 'adnawi_daily_requests';
  private rateLimitKey = 'adnawi_rate_limit';
  private currentData: DailyRequestData | null = null;

  constructor() {
    this.loadDailyData();
    this.cleanupOldData();
  }

  // تحميل البيانات اليومية
  private loadDailyData(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data: DailyRequestData = JSON.parse(stored);
        const today = new Date().toDateString();
        
        if (data.date === today) {
          this.currentData = data;
        } else {
          // يوم جديد - إعادة تعيين
          this.resetDailyData();
        }
      } else {
        this.resetDailyData();
      }
    } catch (error) {
      console.error('Error loading daily data:', error);
      this.resetDailyData();
    }
  }

  // إعادة تعيين البيانات اليومية
  private resetDailyData(): void {
    this.currentData = {
      date: new Date().toDateString(),
      count: 0,
      requests: [],
      lastReset: Date.now(),
    };
    this.saveDailyData();
  }

  // حفظ البيانات اليومية
  private saveDailyData(): void {
    if (this.currentData) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.currentData));
    }
  }

  // تنظيف البيانات القديمة
  private cleanupOldData(): void {
    try {
      const keys = Object.keys(localStorage);
      const oldKeys = keys.filter(key => 
        key.startsWith('adnawi_') && 
        key !== this.storageKey &&
        key !== this.rateLimitKey
      );
      
      oldKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            const age = Date.now() - (parsed.timestamp || 0);
            if (age > 7 * 24 * 60 * 60 * 1000) { // 7 أيام
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  // فحص الحد اليومي
  canMakeRequest(): boolean {
    if (!this.currentData) {
      this.loadDailyData();
    }
    
    return this.currentData ? this.currentData.count < USAGE_LIMITS.DAILY_REQUESTS : true;
  }

  // فحص حد المعدل (Rate Limit)
  canMakeRateLimitedRequest(): boolean {
    if (!SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
      return true;
    }

    try {
      const stored = localStorage.getItem(this.rateLimitKey);
      if (!stored) {
        return true;
      }

      const data = JSON.parse(stored);
      const now = Date.now();
      const windowStart = now - USAGE_LIMITS.RATE_LIMIT_WINDOW;

      // إزالة الطلبات القديمة
      data.requests = data.requests.filter((req: number) => req > windowStart);

      return data.requests.length < USAGE_LIMITS.RATE_LIMIT_REQUESTS;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return true;
    }
  }

  // تسجيل طلب جديد
  recordRequest(record: Omit<RequestRecord, 'id' | 'timestamp'>): boolean {
    if (!this.canMakeRequest()) {
      return false;
    }

    if (!this.canMakeRateLimitedRequest()) {
      return false;
    }

    if (!this.currentData) {
      this.loadDailyData();
    }

    if (!this.currentData) {
      return false;
    }

    const requestRecord: RequestRecord = {
      id: this.generateRequestId(),
      timestamp: Date.now(),
      ...record,
    };

    this.currentData.count++;
    this.currentData.requests.push(requestRecord);
    this.saveDailyData();

    // تسجيل في Rate Limit
    this.recordRateLimitedRequest();

    return true;
  }

  // تسجيل طلب في Rate Limit
  private recordRateLimitedRequest(): void {
    if (!SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
      return;
    }

    try {
      const stored = localStorage.getItem(this.rateLimitKey);
      let data = stored ? JSON.parse(stored) : { requests: [] };
      
      const now = Date.now();
      const windowStart = now - USAGE_LIMITS.RATE_LIMIT_WINDOW;

      // إزالة الطلبات القديمة
      data.requests = data.requests.filter((req: number) => req > windowStart);

      // إضافة الطلب الجديد
      data.requests.push(now);
      data.lastUpdate = now;

      localStorage.setItem(this.rateLimitKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error recording rate limited request:', error);
    }
  }

  // توليد معرف فريد للطلب
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // الحصول على معلومات الحد اليومي
  getDailyLimitInfo(): RateLimitInfo {
    if (!this.currentData) {
      this.loadDailyData();
    }

    const remaining = this.currentData 
      ? Math.max(0, USAGE_LIMITS.DAILY_REQUESTS - this.currentData.count)
      : USAGE_LIMITS.DAILY_REQUESTS;

    const resetTime = this.currentData 
      ? this.currentData.lastReset + 24 * 60 * 60 * 1000
      : Date.now() + 24 * 60 * 60 * 1000;

    return {
      remaining,
      resetTime,
      isLimited: remaining === 0,
    };
  }

  // الحصول على معلومات Rate Limit
  getRateLimitInfo(): RateLimitInfo {
    if (!SECURITY_CONFIG.ENABLE_RATE_LIMITING) {
      return {
        remaining: USAGE_LIMITS.RATE_LIMIT_REQUESTS,
        resetTime: Date.now() + USAGE_LIMITS.RATE_LIMIT_WINDOW,
        isLimited: false,
      };
    }

    try {
      const stored = localStorage.getItem(this.rateLimitKey);
      if (!stored) {
        return {
          remaining: USAGE_LIMITS.RATE_LIMIT_REQUESTS,
          resetTime: Date.now() + USAGE_LIMITS.RATE_LIMIT_WINDOW,
          isLimited: false,
        };
      }

      const data = JSON.parse(stored);
      const now = Date.now();
      const windowStart = now - USAGE_LIMITS.RATE_LIMIT_WINDOW;

      // إزالة الطلبات القديمة
      data.requests = data.requests.filter((req: number) => req > windowStart);

      const remaining = Math.max(0, USAGE_LIMITS.RATE_LIMIT_REQUESTS - data.requests.length);
      const resetTime = data.requests.length > 0 
        ? data.requests[0] + USAGE_LIMITS.RATE_LIMIT_WINDOW
        : now + USAGE_LIMITS.RATE_LIMIT_WINDOW;

      return {
        remaining,
        resetTime,
        isLimited: remaining === 0,
      };
    } catch (error) {
      console.error('Error getting rate limit info:', error);
      return {
        remaining: USAGE_LIMITS.RATE_LIMIT_REQUESTS,
        resetTime: Date.now() + USAGE_LIMITS.RATE_LIMIT_WINDOW,
        isLimited: false,
      };
    }
  }

  // الحصول على إحصائيات اليوم
  getTodayStats(): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    totalTokensUsed: number;
    providerStats: Record<string, number>;
  } {
    if (!this.currentData) {
      this.loadDailyData();
    }

    if (!this.currentData || this.currentData.requests.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        totalTokensUsed: 0,
        providerStats: {},
      };
    }

    const requests = this.currentData.requests;
    const successfulRequests = requests.filter(req => req.success).length;
    const failedRequests = requests.length - successfulRequests;
    const averageResponseTime = requests.reduce((sum, req) => sum + req.responseTime, 0) / requests.length;
    const totalTokensUsed = requests.reduce((sum, req) => sum + req.tokensUsed, 0);

    const providerStats: Record<string, number> = {};
    requests.forEach(req => {
      providerStats[req.provider] = (providerStats[req.provider] || 0) + 1;
    });

    return {
      totalRequests: requests.length,
      successfulRequests,
      failedRequests,
      averageResponseTime: Math.round(averageResponseTime),
      totalTokensUsed,
      providerStats,
    };
  }

  // الحصول على رسالة الخطأ المناسبة
  getLimitMessage(): string {
    const dailyInfo = this.getDailyLimitInfo();
    const rateInfo = this.getRateLimitInfo();

    if (dailyInfo.isLimited) {
      const resetTime = new Date(dailyInfo.resetTime);
      const hoursUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60 * 60));
      return `عذراً يا غالي، وصلت للحد الأقصى اليوم (${USAGE_LIMITS.DAILY_REQUESTS} طلب). تعال بكرة إن شاء الله! (بعد ${hoursUntilReset} ساعة)`;
    }

    if (rateInfo.isLimited) {
      const resetTime = new Date(rateInfo.resetTime);
      const minutesUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / (1000 * 60));
      return `عذراً يا حبيبي، وصلت للحد الأقصى في الدقيقة (${USAGE_LIMITS.RATE_LIMIT_REQUESTS} طلب). انتظر ${minutesUntilReset} دقيقة وجرب مرة ثانية!`;
    }

    return '';
  }

  // إعادة تعيين يدوي
  resetDailyDataManually(): void {
    this.clearAllData();
  }

  // مسح جميع البيانات
  clearAllData(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.rateLimitKey);
    this.clearAllData();
  }

  // تصدير البيانات للإحصائيات
  exportData(): DailyRequestData | null {
    return this.currentData;
  }

  // استيراد البيانات
  importData(data: DailyRequestData): boolean {
    try {
      this.currentData = data;
      this.saveDailyData();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// إنشاء مثيل واحد من المدير
export const dailyRequestManager = new DailyRequestManager();
export default dailyRequestManager;
