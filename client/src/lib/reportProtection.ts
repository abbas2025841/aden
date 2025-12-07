// نظام حماية الإبلاغات المتقدم - Cursor الأسطوري
import CryptoJS from 'crypto-js';

export interface ReportData {
  id: string;
  district: string;
  status: 'on' | 'off';
  timestamp: number;
  userAgent: string;
  location?: {
    lat: number;
    lng: number;
  };
  deviceFingerprint: string;
}

export interface ReportProtectionConfig {
  cooldownMinutes: number;
  maxReportsPerHour: number;
  maxReportsPerDay: number;
  duplicateThreshold: number;
}

const DEFAULT_CONFIG: ReportProtectionConfig = {
  cooldownMinutes: 5,
  maxReportsPerHour: 3,
  maxReportsPerDay: 10,
  duplicateThreshold: 0.85
};

class ReportProtectionSystem {
  private config: ReportProtectionConfig;
  private storageKey = 'aden_electricity_reports';
  private cooldownKey = 'aden_electricity_cooldown';

  constructor(config: Partial<ReportProtectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // إنشاء بصمة الجهاز
  private generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return CryptoJS.SHA256(fingerprint).toString();
  }

  // إنشاء معرف فريد للبلاغ
  private generateReportId(district: string, status: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const data = `${district}-${status}-${timestamp}-${random}`;
    return CryptoJS.SHA256(data).toString().substring(0, 16);
  }

  // حساب تشابه البلاغات باستخدام معادلة رياضية
  private calculateSimilarity(report1: ReportData, report2: ReportData): number {
    // معادلة تشابه متعددة الأبعاد
    const timeDiff = Math.abs(report1.timestamp - report2.timestamp);
    const timeSimilarity = Math.max(0, 1 - (timeDiff / (60 * 60 * 1000))); // ساعة
    
    const districtSimilarity = report1.district === report2.district ? 1 : 0;
    const statusSimilarity = report1.status === report2.status ? 1 : 0;
    const deviceSimilarity = report1.deviceFingerprint === report2.deviceFingerprint ? 1 : 0;
    
    // معادلة الوزن المرجح
    const weights = {
      time: 0.3,
      district: 0.2,
      status: 0.2,
      device: 0.3
    };
    
    const similarity = (
      timeSimilarity * weights.time +
      districtSimilarity * weights.district +
      statusSimilarity * weights.status +
      deviceSimilarity * weights.device
    );
    
    return similarity;
  }

  // التحقق من البلاغات المتكررة
  private checkDuplicateReports(newReport: ReportData): boolean {
    const reports = this.getStoredReports();
    const recentReports = reports.filter(report => 
      Date.now() - report.timestamp < 24 * 60 * 60 * 1000 // آخر 24 ساعة
    );
    
    for (const report of recentReports) {
      const similarity = this.calculateSimilarity(newReport, report);
      if (similarity > this.config.duplicateThreshold) {
        return true;
      }
    }
    
    return false;
  }

  // التحقق من مؤقت التهدئة
  private checkCooldown(district: string, status: string): boolean {
    const cooldownData = localStorage.getItem(this.cooldownKey);
    if (!cooldownData) return false;
    
    try {
      const cooldowns = JSON.parse(cooldownData);
      const key = `${district}-${status}`;
      const lastReport = cooldowns[key];
      
      if (lastReport) {
        const timeDiff = Date.now() - lastReport;
        const cooldownMs = this.config.cooldownMinutes * 60 * 1000;
        return timeDiff < cooldownMs;
      }
    } catch (error) {
      console.error('خطأ في قراءة مؤقت التهدئة:', error);
    }
    
    return false;
  }

  // التحقق من حد البلاغات
  private checkRateLimit(): boolean {
    const reports = this.getStoredReports();
    const now = Date.now();
    
    // البلاغات في آخر ساعة
    const hourlyReports = reports.filter(report => 
      now - report.timestamp < 60 * 60 * 1000
    );
    
    // البلاغات في آخر يوم
    const dailyReports = reports.filter(report => 
      now - report.timestamp < 24 * 60 * 60 * 1000
    );
    
    return hourlyReports.length >= this.config.maxReportsPerHour ||
           dailyReports.length >= this.config.maxReportsPerDay;
  }

  // الحصول على البلاغات المحفوظة
  private getStoredReports(): ReportData[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('خطأ في قراءة البلاغات:', error);
      return [];
    }
  }

  // حفظ البلاغ
  private saveReport(report: ReportData): void {
    try {
      const reports = this.getStoredReports();
      reports.push(report);
      
      // الاحتفاظ بآخر 100 بلاغ فقط
      if (reports.length > 100) {
        reports.splice(0, reports.length - 100);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(reports));
    } catch (error) {
      console.error('خطأ في حفظ البلاغ:', error);
    }
  }

  // تحديث مؤقت التهدئة
  private updateCooldown(district: string, status: string): void {
    try {
      const cooldownData = localStorage.getItem(this.cooldownKey);
      const cooldowns = cooldownData ? JSON.parse(cooldownData) : {};
      cooldowns[`${district}-${status}`] = Date.now();
      localStorage.setItem(this.cooldownKey, JSON.stringify(cooldowns));
    } catch (error) {
      console.error('خطأ في تحديث مؤقت التهدئة:', error);
    }
  }

  // التحقق من إمكانية الإبلاغ
  public canReport(district: string, status: string): {
    allowed: boolean;
    reason?: string;
    cooldownRemaining?: number;
  } {
    // التحقق من مؤقت التهدئة
    if (this.checkCooldown(district, status)) {
      const cooldownData = localStorage.getItem(this.cooldownKey);
      if (cooldownData) {
        const cooldowns = JSON.parse(cooldownData);
        const key = `${district}-${status}`;
        const lastReport = cooldowns[key];
        const cooldownRemaining = Math.ceil(
          (this.config.cooldownMinutes * 60 * 1000 - (Date.now() - lastReport)) / 1000
        );
        
        return {
          allowed: false,
          reason: `يجب الانتظار ${this.config.cooldownMinutes} دقائق بين البلاغات`,
          cooldownRemaining
        };
      }
    }
    
    // التحقق من حد البلاغات
    if (this.checkRateLimit()) {
      return {
        allowed: false,
        reason: 'تم تجاوز الحد المسموح من البلاغات اليومية'
      };
    }
    
    return { allowed: true };
  }

  // إرسال البلاغ
  public async submitReport(district: string, status: 'on' | 'off'): Promise<{
    success: boolean;
    message: string;
    reportId?: string;
  }> {
    // التحقق من الإمكانية
    const canReport = this.canReport(district, status);
    if (!canReport.allowed) {
      return {
        success: false,
        message: canReport.reason || 'غير مسموح بالإبلاغ'
      };
    }
    
    // إنشاء البلاغ
    const report: ReportData = {
      id: this.generateReportId(district, status),
      district,
      status,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      deviceFingerprint: this.generateDeviceFingerprint()
    };
    
    // التحقق من البلاغات المتكررة
    if (this.checkDuplicateReports(report)) {
      return {
        success: false,
        message: 'تم اكتشاف بلاغ مشابه مؤخراً'
      };
    }
    
    // حفظ البلاغ
    this.saveReport(report);
    this.updateCooldown(district, status);
    
    // محاكاة إرسال للخادم
    try {
      // هنا يمكن إضافة منطق إرسال للخادم
      await this.sendToServer(report);
      
      return {
        success: true,
        message: 'تم إرسال البلاغ بنجاح',
        reportId: report.id
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في إرسال البلاغ'
      };
    }
  }

  // إرسال للخادم (محاكاة)
  private async sendToServer(report: ReportData): Promise<void> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // هنا يمكن إضافة منطق إرسال حقيقي للخادم
    console.log('إرسال البلاغ للخادم:', report);
  }

  // الحصول على إحصائيات البلاغات
  public getReportStats(): {
    totalReports: number;
    todayReports: number;
    hourlyReports: number;
    cooldowns: Record<string, number>;
  } {
    const reports = this.getStoredReports();
    const now = Date.now();
    
    const todayReports = reports.filter(report => 
      now - report.timestamp < 24 * 60 * 60 * 1000
    ).length;
    
    const hourlyReports = reports.filter(report => 
      now - report.timestamp < 60 * 60 * 1000
    ).length;
    
    const cooldownData = localStorage.getItem(this.cooldownKey);
    const cooldowns = cooldownData ? JSON.parse(cooldownData) : {};
    
    return {
      totalReports: reports.length,
      todayReports,
      hourlyReports,
      cooldowns
    };
  }

  // مسح البيانات (للتطوير)
  public clearData(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.cooldownKey);
  }
}

// إنشاء مثيل واحد للنظام
export const reportProtection = new ReportProtectionSystem();

// دوال مساعدة
export const formatCooldownTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${remainingSeconds} ثانية`;
};

export const getReportStatusColor = (status: 'on' | 'off'): string => {
  return status === 'on' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
};

export const getReportStatusIcon = (status: 'on' | 'off'): string => {
  return status === 'on' ? '🟢' : '🔴';
};
