// نظام حماية من البلاغات الكاذبة
export interface ReportValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100, كلما زاد الرقم كلما كان التقرير أكثر موثوقية
}

export interface ValidationRules {
  minTimeBetweenReports: number; // بالدقائق
  maxReportsPerHour: number;
  maxReportsPerDay: number;
  suspiciousPatternThreshold: number; // عدد التقارير المتشابهة
  locationVerification: boolean;
  timeBasedValidation: boolean;
}

// إعدادات افتراضية للحماية
export const DEFAULT_VALIDATION_RULES: ValidationRules = {
  minTimeBetweenReports: 5, // 5 دقائق بين التقارير
  maxReportsPerHour: 3, // 3 تقارير في الساعة
  maxReportsPerDay: 10, // 10 تقارير في اليوم
  suspiciousPatternThreshold: 5, // 5 تقارير متشابهة
  locationVerification: true,
  timeBasedValidation: true
};

// تحقق من صحة التقرير
export function validateReport(
  reportData: any,
  userHistory: any[] = [],
  rules: ValidationRules = DEFAULT_VALIDATION_RULES
): ReportValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 1. تحقق من الوقت بين التقارير
  if (rules.minTimeBetweenReports > 0) {
    const lastReport = userHistory[0];
    if (lastReport) {
      const timeDiff = Date.now() - new Date(lastReport.timestamp).getTime();
      const minutesDiff = timeDiff / (1000 * 60);
      
      if (minutesDiff < rules.minTimeBetweenReports) {
        errors.push(`يرجى الانتظار ${rules.minTimeBetweenReports} دقائق قبل إرسال تقرير آخر`);
        score -= 30;
      }
    }
  }

  // 2. تحقق من عدد التقارير في الساعة
  if (rules.maxReportsPerHour > 0) {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentReports = userHistory.filter(
      report => new Date(report.timestamp).getTime() > oneHourAgo
    );
    
    if (recentReports.length >= rules.maxReportsPerHour) {
      errors.push(`لقد أرسلت ${recentReports.length} تقارير في الساعة الماضية. الحد الأقصى ${rules.maxReportsPerHour}`);
      score -= 25;
    }
  }

  // 3. تحقق من عدد التقارير في اليوم
  if (rules.maxReportsPerDay > 0) {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const dailyReports = userHistory.filter(
      report => new Date(report.timestamp).getTime() > oneDayAgo
    );
    
    if (dailyReports.length >= rules.maxReportsPerDay) {
      errors.push(`لقد أرسلت ${dailyReports.length} تقارير اليوم. الحد الأقصى ${rules.maxReportsPerDay}`);
      score -= 20;
    }
  }

  // 4. تحقق من الأنماط المشبوهة
  if (rules.suspiciousPatternThreshold > 0) {
    const similarReports = userHistory.filter(report => 
      report.serviceType === reportData.serviceType &&
      report.neighborhood === reportData.neighborhood &&
      report.status === reportData.status
    );
    
    if (similarReports.length >= rules.suspiciousPatternThreshold) {
      warnings.push(`تم الإبلاغ عن نفس الحالة ${similarReports.length} مرات. تأكد من دقة المعلومات`);
      score -= 15;
    }
  }

  // 5. تحقق من صحة البيانات
  if (!reportData.serviceType || !reportData.neighborhood || !reportData.status) {
    errors.push("يرجى ملء جميع الحقول المطلوبة");
    score -= 40;
  }

  // 6. تحقق من صحة المنطقة
  const validNeighborhoods = [
    "عدن كريتر", "كريتر", "خور مكسر", "المعلا", "التواهي",
    "الشيخ عثمان", "المنصورة", "دار سعد", "البريقة"
  ];
  
  if (!validNeighborhoods.includes(reportData.neighborhood)) {
    errors.push("المنطقة المحددة غير صحيحة");
    score -= 30;
  }

  // 7. تحقق من صحة نوع الخدمة
  const validServices = ["electricity", "water", "internet", "gas", "other"];
  if (!validServices.includes(reportData.serviceType)) {
    errors.push("نوع الخدمة غير صحيح");
    score -= 30;
  }

  // 8. تحقق من صحة الحالة
  const validStatuses = ["available", "outage", "unstable"];
  if (!validStatuses.includes(reportData.status)) {
    errors.push("حالة الخدمة غير صحيحة");
    score -= 30;
  }

  // 9. تحقق من الوقت (تجنب التقارير في أوقات غير منطقية)
  if (rules.timeBasedValidation) {
    const hour = new Date().getHours();
    if (hour >= 2 && hour <= 5) {
      warnings.push("التقرير في وقت متأخر من الليل. تأكد من دقة المعلومات");
      score -= 5;
    }
  }

  // 10. تحقق من طول الوصف
  if (reportData.description && reportData.description.length < 10) {
    warnings.push("الوصف قصير جداً. يفضل إضافة المزيد من التفاصيل");
    score -= 5;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  };
}

// تحقق من تاريخ المستخدم
export function getUserReportHistory(userId?: string): any[] {
  try {
    const reports = JSON.parse(localStorage.getItem("community-reports") || "[]");
    return reports.filter((report: any) => 
      !userId || report.reporter === userId
    );
  } catch {
    return [];
  }
}

// حساب درجة الموثوقية للمستخدم
export function calculateUserReliability(userId?: string): number {
  const userHistory = getUserReportHistory(userId);
  
  if (userHistory.length === 0) return 50; // درجة افتراضية للمستخدمين الجدد
  
  let totalScore = 0;
  let validReports = 0;
  
  userHistory.forEach(report => {
    const validation = validateReport(report, userHistory.slice(1));
    if (validation.isValid) {
      totalScore += validation.score;
      validReports++;
    }
  });
  
  if (validReports === 0) return 0;
  
  return Math.round(totalScore / validReports);
}

// تحقق من إمكانية الإبلاغ
export function canUserReport(userId?: string): { canReport: boolean; reason?: string; waitTime?: number } {
  const userHistory = getUserReportHistory(userId);
  const rules = DEFAULT_VALIDATION_RULES;
  
  // تحقق من آخر تقرير
  if (userHistory.length > 0) {
    const lastReport = userHistory[0];
    const timeDiff = Date.now() - new Date(lastReport.timestamp).getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < rules.minTimeBetweenReports) {
      const waitTime = Math.ceil(rules.minTimeBetweenReports - minutesDiff);
      return {
        canReport: false,
        reason: `يرجى الانتظار ${waitTime} دقائق`,
        waitTime
      };
    }
  }
  
  // تحقق من عدد التقارير في الساعة
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  const recentReports = userHistory.filter(
    report => new Date(report.timestamp).getTime() > oneHourAgo
  );
  
  if (recentReports.length >= rules.maxReportsPerHour) {
    return {
      canReport: false,
      reason: `لقد أرسلت ${recentReports.length} تقارير في الساعة الماضية`
    };
  }
  
  // تحقق من عدد التقارير في اليوم
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  const dailyReports = userHistory.filter(
    report => new Date(report.timestamp).getTime() > oneDayAgo
  );
  
  if (dailyReports.length >= rules.maxReportsPerDay) {
    return {
      canReport: false,
      reason: `لقد أرسلت ${dailyReports.length} تقارير اليوم`
    };
  }
  
  return { canReport: true };
}

// إحصائيات الحماية
export function getProtectionStats(): {
  totalReports: number;
  suspiciousReports: number;
  blockedReports: number;
  averageScore: number;
} {
  try {
    const reports = JSON.parse(localStorage.getItem("community-reports") || "[]");
    
    let suspiciousCount = 0;
    let blockedCount = 0;
    let totalScore = 0;
    let validReports = 0;
    
    reports.forEach((report: any) => {
      const validation = validateReport(report, reports);
      
      if (validation.score < 70) {
        suspiciousCount++;
      }
      
      if (!validation.isValid) {
        blockedCount++;
      }
      
      if (validation.isValid) {
        totalScore += validation.score;
        validReports++;
      }
    });
    
    return {
      totalReports: reports.length,
      suspiciousReports: suspiciousCount,
      blockedReports: blockedCount,
      averageScore: validReports > 0 ? Math.round(totalScore / validReports) : 0
    };
  } catch {
    return {
      totalReports: 0,
      suspiciousReports: 0,
      blockedReports: 0,
      averageScore: 0
    };
  }
}
