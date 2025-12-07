// خدمة التأكيد الجماعي مع Supabase - Cursor الأسطوري
import { SupabaseService, type ElectricityReport, type CollectiveConfirmation, type UniqueUser, type ActivityLog } from '@/lib/supabase';
// import crypto from 'crypto-js';

export interface ReportSubmissionData {
  district: string;
  status: 'on' | 'off' | 'partial' | 'unknown';
  userAgent: string;
  deviceFingerprint: string;
  ipAddress?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface ConfirmationResult {
  success: boolean;
  message: string;
  reportId?: string;
  isConfirmed?: boolean;
  confirmationCount?: number;
  uniqueUsers?: number;
  timeRemaining?: number;
}

export interface ConfirmationStatus {
  district: string;
  status: string;
  isConfirmed: boolean;
  confirmationCount: number;
  uniqueUsers: number;
  timeWindow: number;
  confirmedAt?: Date;
  expiresAt?: Date;
}

class SupabaseCollectiveConfirmationService {
  private readonly CONFIRMATION_THRESHOLD = 3; // 3 بلاغات
  private readonly TIME_WINDOW = 3 * 60; // 3 دقائق بالثواني
  private readonly CONFIRMATION_EXPIRY = 30 * 60; // 30 دقيقة

  // إنشاء هاش للبلاغ
  private generateReportHash(_data: ReportSubmissionData): string {
    return 'hash_' + Math.random().toString(36).substr(2, 9);
  }

  // إنشاء هاش للتأكيد الجماعي
  private generateConfirmationHash(_district: string, _status: string): string {
    return 'hash_' + Math.random().toString(36).substr(2, 9);
  }

  // إنشاء معرف فريد للبلاغ
  private generateReportId(): string {
    return crypto.getRandomValues(new Uint8Array(16)).toString();
  }

  // التحقق من البلاغات المتشابهة
  private async checkSimilarReports(reportHash: string, timeWindow: number): Promise<boolean> {
    const cutoffTime = new Date(Date.now() - timeWindow * 1000).toISOString();
    
    const result = await SupabaseService.getReports({
      limit: 1
    });

    if (!result.success) return false;

    // البحث عن بلاغات متشابهة في النافذة الزمنية
    const similarReports = result.data?.filter(report => 
      report.report_hash === reportHash && 
      new Date(report.timestamp) >= new Date(cutoffTime)
    ) || [];

    return similarReports.length > 0;
  }

  // إضافة أو تحديث مستخدم فريد
  private async upsertUniqueUser(deviceFingerprint: string): Promise<void> {
    const now = new Date().toISOString();
    
    const userData: Omit<UniqueUser, 'id' | 'created_at' | 'updated_at'> = {
      device_fingerprint: deviceFingerprint,
      first_report: now,
      last_report: now,
      total_reports: 1,
      is_blocked: false
    };

    await SupabaseService.upsertUniqueUser(userData);
  }

  // تسجيل النشاط
  private async logActivity(
    action: string,
    district: string,
    status: string,
    deviceFingerprint: string,
    details?: any,
    ipAddress?: string
  ): Promise<void> {
    const activityData: Omit<ActivityLog, 'id'> = {
      action,
      district,
      status,
      device_fingerprint: deviceFingerprint,
      details,
      ip_address: ipAddress,
      timestamp: new Date().toISOString()
    };
    
    await SupabaseService.logActivity(activityData);
  }

  // إرسال بلاغ
  public async submitReport(data: ReportSubmissionData): Promise<ConfirmationResult> {
    try {
      const reportHash = this.generateReportHash(data);
      const reportId = this.generateReportId();
      
      // التحقق من البلاغات المتشابهة
      const isSimilar = await this.checkSimilarReports(reportHash, 60); // دقيقة واحدة
      if (isSimilar) {
        return {
          success: false,
          message: 'تم اكتشاف بلاغ مشابه مؤخراً'
        };
      }

      // إضافة أو تحديث المستخدم الفريد
      await this.upsertUniqueUser(data.deviceFingerprint);

      // حفظ البلاغ
      const reportData: Omit<ElectricityReport, 'id' | 'created_at' | 'updated_at'> = {
        report_id: reportId,
        district: data.district,
        status: data.status,
        user_agent: data.userAgent,
        device_fingerprint: data.deviceFingerprint,
        ip_address: data.ipAddress,
        location: data.location,
        report_hash: reportHash,
        timestamp: new Date().toISOString(),
        is_verified: false,
        verification_count: 1
      };

      const result = await SupabaseService.submitReport(reportData);

      if (!result.success) {
        return {
          success: false,
          message: 'خطأ في إرسال البلاغ'
        };
      }

      // تسجيل النشاط
      await this.logActivity('report', data.district, data.status, data.deviceFingerprint, {
        reportId,
        reportHash
      }, data.ipAddress);

      // التحقق من التأكيد الجماعي
      const confirmationResult = await this.checkCollectiveConfirmation(data.district, data.status);

      return {
        success: true,
        message: 'تم إرسال البلاغ بنجاح',
        reportId,
        isConfirmed: confirmationResult.isConfirmed,
        confirmationCount: confirmationResult.confirmationCount,
        uniqueUsers: confirmationResult.uniqueUsers,
        timeRemaining: confirmationResult.timeRemaining
      };

    } catch (error) {
      console.error('خطأ في إرسال البلاغ:', error);
      return {
        success: false,
        message: 'خطأ في إرسال البلاغ'
      };
    }
  }

  // التحقق من التأكيد الجماعي
  public async checkCollectiveConfirmation(district: string, status: string): Promise<{
    isConfirmed: boolean;
    confirmationCount: number;
    uniqueUsers: number;
    timeRemaining?: number;
  }> {
    const cutoffTime = new Date(Date.now() - this.TIME_WINDOW * 1000).toISOString();
    
    // الحصول على البلاغات في النافذة الزمنية
    const result = await SupabaseService.getReports({
      district,
      limit: 100
    });

    if (!result.success || !result.data) {
      return {
        isConfirmed: false,
        confirmationCount: 0,
        uniqueUsers: 0
      };
    }

    const reports = result.data.filter(report => 
      report.district === district &&
      report.status === status &&
      new Date(report.timestamp) >= new Date(cutoffTime)
    );

    // حساب المستخدمين الفريدين
    const uniqueDeviceFingerprints = new Set(reports.map(r => r.device_fingerprint));
    const uniqueUsersCount = uniqueDeviceFingerprints.size;

    // التحقق من شروط التأكيد
    const isConfirmed = reports.length >= this.CONFIRMATION_THRESHOLD && 
                       uniqueUsersCount >= this.CONFIRMATION_THRESHOLD;

    if (isConfirmed) {
      // إنشاء تأكيد جماعي
      await this.createCollectiveConfirmation(district, status, reports.length, uniqueUsersCount);
    }

    // حساب الوقت المتبقي
    const timeRemaining = isConfirmed ? 0 : 
      Math.max(0, this.TIME_WINDOW - Math.floor((Date.now() - new Date(reports[0]?.timestamp || 0).getTime()) / 1000));

    return {
      isConfirmed,
      confirmationCount: reports.length,
      uniqueUsers: uniqueUsersCount,
      timeRemaining: timeRemaining > 0 ? timeRemaining : undefined
    };
  }

  // إنشاء تأكيد جماعي
  private async createCollectiveConfirmation(
    district: string, 
    status: string, 
    reportCount: number, 
    uniqueUsersCount: number
  ): Promise<void> {
    const confirmationHash = this.generateConfirmationHash(district, status);
    const confirmedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + this.CONFIRMATION_EXPIRY * 1000).toISOString();

    const confirmationData: Omit<CollectiveConfirmation, 'id' | 'created_at' | 'updated_at'> = {
      district,
      status: status as any,
      confirmation_hash: confirmationHash,
      report_count: reportCount,
      unique_users: uniqueUsersCount,
      time_window: this.TIME_WINDOW,
      is_active: true,
      confirmed_at: confirmedAt,
      expires_at: expiresAt
    };

    await SupabaseService.createConfirmation(confirmationData);

    // تسجيل النشاط
    await this.logActivity('confirmation', district, status, 'system', {
      confirmationHash,
      reportCount,
      uniqueUsers: uniqueUsersCount
    });
  }

  // الحصول على حالة التأكيد
  public async getConfirmationStatus(district: string): Promise<ConfirmationStatus | null> {
    const result = await SupabaseService.getConfirmationStatus(district);

    if (!result.success || !result.data) {
      return null;
    }

    const confirmation = result.data;
    return {
      district: confirmation.district,
      status: confirmation.status,
      isConfirmed: true,
      confirmationCount: confirmation.report_count,
      uniqueUsers: confirmation.unique_users,
      timeWindow: confirmation.time_window,
      confirmedAt: new Date(confirmation.confirmed_at),
      expiresAt: new Date(confirmation.expires_at)
    };
  }

  // الحصول على إحصائيات البلاغات
  public async getReportStatistics(district?: string): Promise<{
    totalReports: number;
    todayReports: number;
    hourlyReports: number;
    confirmations: number;
    uniqueUsers: number;
  }> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const hourStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    const [totalResult, todayResult, hourlyResult] = await Promise.all([
      SupabaseService.getReports({ district, limit: 1000 }),
      SupabaseService.getReports({ district, limit: 1000 }),
      SupabaseService.getReports({ district, limit: 1000 })
    ]);

    const totalReports = totalResult.data?.length || 0;
    const todayReports = todayResult.data?.filter(r => new Date(r.timestamp) >= new Date(todayStart)).length || 0;
    const hourlyReports = hourlyResult.data?.filter(r => new Date(r.timestamp) >= new Date(hourStart)).length || 0;

    // الحصول على إحصائيات التأكيدات
    const confirmationsResult = await SupabaseService.getStatistics(district);
    const confirmations = confirmationsResult.data?.length || 0;

    // حساب المستخدمين الفريدين
    const uniqueUsers = new Set(totalResult.data?.map(r => r.device_fingerprint) || []).size;

    return {
      totalReports,
      todayReports,
      hourlyReports,
      confirmations,
      uniqueUsers
    };
  }

  // تنظيف البيانات المنتهية الصلاحية
  public async cleanupExpiredData(): Promise<void> {
    await SupabaseService.cleanupExpiredData();
  }
}

// إنشاء مثيل واحد للخدمة
export const supabaseCollectiveConfirmationService = new SupabaseCollectiveConfirmationService();
