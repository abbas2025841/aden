// نظام التأكيد الجماعي - Cursor الأسطوري
import { db } from '../database/postgresql';
import { 
  electricityReports, 
  collectiveConfirmations, 
  uniqueUsers, 
  reportStatistics,
  activityLog,
  type NewElectricityReport,
  type NewCollectiveConfirmation,
  type NewUniqueUser,
  type NewActivityLog
} from '../database/electricity-schema';
import { eq, and, gte, desc, count, sql } from 'drizzle-orm';
import crypto from 'crypto';

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

class CollectiveConfirmationService {
  private readonly CONFIRMATION_THRESHOLD = 3; // 3 بلاغات
  private readonly TIME_WINDOW = 3 * 60; // 3 دقائق بالثواني
  private readonly CONFIRMATION_EXPIRY = 30 * 60; // 30 دقيقة

  // إنشاء هاش للبلاغ
  private generateReportHash(data: ReportSubmissionData): string {
    const hashData = {
      district: data.district.toLowerCase(),
      status: data.status,
      deviceFingerprint: data.deviceFingerprint,
      timestamp: Math.floor(Date.now() / (60 * 1000)) // دقيقة واحدة
    };
    
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(hashData))
      .digest('hex');
  }

  // إنشاء هاش للتأكيد الجماعي
  private generateConfirmationHash(district: string, status: string): string {
    const hashData = {
      district: district.toLowerCase(),
      status,
      timestamp: Math.floor(Date.now() / (60 * 1000)) // دقيقة واحدة
    };
    
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(hashData))
      .digest('hex');
  }

  // إنشاء معرف فريد للبلاغ
  private generateReportId(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // التحقق من البلاغات المتشابهة
  private async checkSimilarReports(reportHash: string, timeWindow: number): Promise<boolean> {
    const cutoffTime = new Date(Date.now() - timeWindow * 1000);
    
    const similarReports = await db
      .select()
      .from(electricityReports)
      .where(
        and(
          eq(electricityReports.reportHash, reportHash),
          gte(electricityReports.timestamp, cutoffTime)
        )
      )
      .limit(1);

    return similarReports.length > 0;
  }

  // إضافة أو تحديث مستخدم فريد
  private async upsertUniqueUser(deviceFingerprint: string): Promise<void> {
    const existingUser = await db
      .select()
      .from(uniqueUsers)
      .where(eq(uniqueUsers.deviceFingerprint, deviceFingerprint))
      .limit(1);

    if (existingUser.length > 0) {
      // تحديث المستخدم الموجود
      await db
        .update(uniqueUsers)
        .set({
          lastReport: new Date(),
          totalReports: sql`${uniqueUsers.totalReports} + 1`,
          updatedAt: new Date()
        })
        .where(eq(uniqueUsers.deviceFingerprint, deviceFingerprint));
    } else {
      // إضافة مستخدم جديد
      const newUser: NewUniqueUser = {
        deviceFingerprint,
        firstReport: new Date(),
        lastReport: new Date(),
        totalReports: 1,
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.insert(uniqueUsers).values(newUser);
    }
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
    const logEntry: NewActivityLog = {
      action,
      district,
      status,
      deviceFingerprint,
      details,
      ipAddress,
      timestamp: new Date()
    };
    
    await db.insert(activityLog).values(logEntry);
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
      const newReport: NewElectricityReport = {
        reportId,
        district: data.district,
        status: data.status,
        userAgent: data.userAgent,
        deviceFingerprint: data.deviceFingerprint,
        ipAddress: data.ipAddress,
        location: data.location,
        reportHash,
        timestamp: new Date(),
        isVerified: false,
        verificationCount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(electricityReports).values(newReport);

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
    const cutoffTime = new Date(Date.now() - this.TIME_WINDOW * 1000);
    
    // الحصول على البلاغات في النافذة الزمنية
    const reports = await db
      .select()
      .from(electricityReports)
      .where(
        and(
          eq(electricityReports.district, district),
          eq(electricityReports.status, status),
          gte(electricityReports.timestamp, cutoffTime)
        )
      )
      .orderBy(desc(electricityReports.timestamp));

    // حساب المستخدمين الفريدين
    const uniqueDeviceFingerprints = new Set(reports.map(r => r.deviceFingerprint));
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
      Math.max(0, this.TIME_WINDOW - Math.floor((Date.now() - reports[0]?.timestamp.getTime()) / 1000));

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
    const confirmedAt = new Date();
    const expiresAt = new Date(confirmedAt.getTime() + this.CONFIRMATION_EXPIRY * 1000);

    const newConfirmation: NewCollectiveConfirmation = {
      district,
      status,
      confirmationHash,
      reportCount,
      uniqueUsers: uniqueUsersCount,
      timeWindow: this.TIME_WINDOW,
      isActive: true,
      confirmedAt,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.insert(collectiveConfirmations).values(newConfirmation);

    // تسجيل النشاط
    await this.logActivity('confirmation', district, status, 'system', {
      confirmationHash,
      reportCount,
      uniqueUsers: uniqueUsersCount
    });
  }

  // الحصول على حالة التأكيد
  public async getConfirmationStatus(district: string): Promise<ConfirmationStatus | null> {
    const activeConfirmation = await db
      .select()
      .from(collectiveConfirmations)
      .where(
        and(
          eq(collectiveConfirmations.district, district),
          eq(collectiveConfirmations.isActive, true),
          gte(collectiveConfirmations.expiresAt, new Date())
        )
      )
      .orderBy(desc(collectiveConfirmations.confirmedAt))
      .limit(1);

    if (activeConfirmation.length === 0) {
      return null;
    }

    const confirmation = activeConfirmation[0];
    return {
      district: confirmation.district,
      status: confirmation.status,
      isConfirmed: true,
      confirmationCount: confirmation.reportCount,
      uniqueUsers: confirmation.uniqueUsers,
      timeWindow: confirmation.timeWindow,
      confirmedAt: confirmation.confirmedAt,
      expiresAt: confirmation.expiresAt
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
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const hourStart = new Date(now.getTime() - 60 * 60 * 1000);

    let whereClause = undefined;
    if (district) {
      whereClause = eq(electricityReports.district, district);
    }

    const [totalResult, todayResult, hourlyResult, confirmationsResult, usersResult] = await Promise.all([
      db.select({ count: count() }).from(electricityReports).where(whereClause),
      db.select({ count: count() }).from(electricityReports).where(
        whereClause ? and(whereClause, gte(electricityReports.timestamp, todayStart)) : 
        gte(electricityReports.timestamp, todayStart)
      ),
      db.select({ count: count() }).from(electricityReports).where(
        whereClause ? and(whereClause, gte(electricityReports.timestamp, hourStart)) : 
        gte(electricityReports.timestamp, hourStart)
      ),
      db.select({ count: count() }).from(collectiveConfirmations).where(
        district ? eq(collectiveConfirmations.district, district) : undefined
      ),
      db.select({ count: count() }).from(uniqueUsers)
    ]);

    return {
      totalReports: totalResult[0]?.count || 0,
      todayReports: todayResult[0]?.count || 0,
      hourlyReports: hourlyResult[0]?.count || 0,
      confirmations: confirmationsResult[0]?.count || 0,
      uniqueUsers: usersResult[0]?.count || 0
    };
  }

  // تنظيف البيانات المنتهية الصلاحية
  public async cleanupExpiredData(): Promise<void> {
    const now = new Date();
    
    // تعطيل التأكيدات المنتهية الصلاحية
    await db
      .update(collectiveConfirmations)
      .set({ isActive: false, updatedAt: now })
      .where(
        and(
          eq(collectiveConfirmations.isActive, true),
          sql`${collectiveConfirmations.expiresAt} < ${now}`
        )
      );

    // حذف البلاغات القديمة (أكثر من 30 يوم)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    await db
      .delete(electricityReports)
      .where(sql`${electricityReports.timestamp} < ${thirtyDaysAgo}`);
  }
}

// إنشاء مثيل واحد للخدمة
export const collectiveConfirmationService = new CollectiveConfirmationService();
