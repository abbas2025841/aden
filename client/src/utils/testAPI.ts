// كود اختبار API مباشر - Cursor الأسطوري
import { supabase } from '@/lib/supabase';

// واجهة البيانات
interface TestReport {
  report_id: string;
  district: string;
  status: 'on' | 'off' | 'partial' | 'unknown';
  user_agent: string;
  device_fingerprint: string;
  report_hash: string;
  timestamp: string;
  is_verified: boolean;
  verification_count: number;
}

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

// دوال الاختبار
export class APITester {
  // إرسال بلاغ تجريبي
  static async sendTestReport(district?: string, status?: string): Promise<TestResult> {
    try {
      const testReport: TestReport = {
        report_id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        district: district || this.getRandomDistrict(),
        status: (status as any) || this.getRandomStatus(),
        user_agent: 'API Tester',
        device_fingerprint: `test_device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        report_hash: `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        is_verified: false,
        verification_count: 1
      };

      const { data, error } = await supabase
        .from('electricity_reports')
        .insert([testReport])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          message: 'فشل في إرسال البلاغ',
          error: (error as Error).message
        };
      }

      return {
        success: true,
        message: 'تم إرسال البلاغ بنجاح',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في إرسال البلاغ',
        error: (error as Error).message
      };
    }
  }

  // جلب البلاغات
  static async getReports(limit: number = 10): Promise<TestResult> {
    try {
      const { data, error } = await supabase
        .from('electricity_reports')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        return {
          success: false,
          message: 'فشل في جلب البلاغات',
          error: (error as Error).message
        };
      }

      return {
        success: true,
        message: `تم جلب ${data?.length || 0} بلاغ`,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في جلب البلاغات',
        error: (error as Error).message
      };
    }
  }

  // جلب حالة التأكيد
  static async getConfirmationStatus(district: string): Promise<TestResult> {
    try {
      const { data, error } = await supabase
        .from('collective_confirmations')
        .select('*')
        .eq('district', district)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('confirmed_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        return {
          success: false,
          message: 'فشل في جلب حالة التأكيد',
          error: (error as Error).message
        };
      }

      return {
        success: true,
        message: data ? 'تم العثور على تأكيد' : 'لا توجد تأكيدات نشطة',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في جلب حالة التأكيد',
        error: (error as Error).message
      };
    }
  }

  // إنشاء تأكيد جماعي تجريبي
  static async createTestConfirmation(district: string, status: string): Promise<TestResult> {
    try {
      const testConfirmation = {
        district: district,
        status: status,
        confirmation_hash: `conf_hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        report_count: 3,
        unique_users: 3,
        time_window: 180,
        is_active: true,
        confirmed_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };

      const { data, error } = await supabase
        .from('collective_confirmations')
        .insert([testConfirmation])
        .select()
        .single();

      if (error) {
        return {
          success: false,
          message: 'فشل في إنشاء التأكيد',
          error: (error as Error).message
        };
      }

      return {
        success: true,
        message: 'تم إنشاء التأكيد بنجاح',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في إنشاء التأكيد',
        error: (error as Error).message
      };
    }
  }

  // جلب الإحصائيات
  static async getStatistics(): Promise<TestResult> {
    try {
      const { data, error } = await supabase
        .from('report_statistics')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        return {
          success: false,
          message: 'فشل في جلب الإحصائيات',
          error: (error as Error).message
        };
      }

      return {
        success: true,
        message: `تم جلب ${data?.length || 0} إحصائية`,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في جلب الإحصائيات',
        error: (error as Error).message
      };
    }
  }

  // جلب المديريات
  static async getDistricts(): Promise<TestResult> {
    try {
      const { data, error } = await supabase
        .from('districts')
        .select('*')
        .order('name');

      if (error) {
        return {
          success: false,
          message: 'فشل في جلب المديريات',
          error: (error as Error).message
        };
      }

      return {
        success: true,
        message: `تم جلب ${data?.length || 0} مديرية`,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: 'خطأ في جلب المديريات',
        error: (error as Error).message
      };
    }
  }

  // اختبار شامل
  static async runFullTest(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // اختبار إرسال بلاغ
    const reportResult = await this.sendTestReport();
    results.push({ ...reportResult, message: 'اختبار إرسال بلاغ: ' + reportResult.message });

    // اختبار جلب البلاغات
    const getReportsResult = await this.getReports(5);
    results.push({ ...getReportsResult, message: 'اختبار جلب البلاغات: ' + getReportsResult.message });

    // اختبار جلب المديريات
    const districtsResult = await this.getDistricts();
    results.push({ ...districtsResult, message: 'اختبار جلب المديريات: ' + districtsResult.message });

    // اختبار جلب الإحصائيات
    const statsResult = await this.getStatistics();
    results.push({ ...statsResult, message: 'اختبار جلب الإحصائيات: ' + statsResult.message });

    // اختبار حالة التأكيد
    const confirmationResult = await this.getConfirmationStatus('كريتر');
    results.push({ ...confirmationResult, message: 'اختبار حالة التأكيد: ' + confirmationResult.message });

    return results;
  }

  // دوال مساعدة
  private static getRandomDistrict(): string {
    const districts = ['كريتر', 'المعلا', 'التواهي', 'المنصورة', 'الشيخ عثمان', 'خور مكسر'];
    return districts[Math.floor(Math.random() * districts.length)];
  }

  private static getRandomStatus(): string {
    const statuses = ['on', 'off', 'partial', 'unknown'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}

// دوال سريعة للاستخدام
export const quickTest = {
  // إرسال بلاغ سريع
  sendReport: (district: string = 'كريتر', status: string = 'on') => 
    APITester.sendTestReport(district, status),

  // جلب البلاغات السريع
  getReports: (limit: number = 10) => 
    APITester.getReports(limit),

  // جلب المديريات السريع
  getDistricts: () => 
    APITester.getDistricts(),

  // اختبار شامل سريع
  runFullTest: () => 
    APITester.runFullTest()
};

// تصدير للاستخدام في وحدة التحكم
if (typeof window !== 'undefined') {
  (window as any).APITester = APITester;
  (window as any).quickTest = quickTest;
  console.log('🚀 APITester متاح في وحدة التحكم!');
  console.log('استخدم: APITester.sendTestReport() أو quickTest.sendReport()');
}
