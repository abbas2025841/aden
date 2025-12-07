import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { supabase, SupabaseService } from '@/lib/supabase';
import { 
  Zap, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  Square,
  RefreshCw
} from 'lucide-react';

export default function TestReportsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    successfulReports: 0,
    failedReports: 0,
    confirmations: 0
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // المديريات المتاحة
  const districts = ['كريتر', 'المعلا', 'التواهي', 'المنصورة', 'الشيخ عثمان', 'خور مكسر'];
  const statuses = ['on', 'off', 'partial', 'unknown'];

  // إرسال بلاغ تجريبي
  const sendTestReport = async () => {
    try {
      const randomDistrict = districts[Math.floor(Math.random() * districts.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const deviceFingerprint = `test_device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const reportData = {
        report_id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        district: randomDistrict,
        status: randomStatus as any,
        user_agent: 'Test Report Generator',
        device_fingerprint: deviceFingerprint,
        report_hash: `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        is_verified: false,
        verification_count: 1
      };

      const result = await SupabaseService.submitReport(reportData);
      
      const testResult = {
        id: Date.now(),
        district: randomDistrict,
        status: randomStatus,
        success: result.success,
        message: result.success ? 'تم إرسال البلاغ بنجاح' : result.error,
        timestamp: new Date(),
        deviceFingerprint: deviceFingerprint
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 19)]); // الاحتفاظ بآخر 20 نتيجة
      
      // تحديث الإحصائيات
      setStats(prev => ({
        ...prev,
        totalReports: prev.totalReports + 1,
        successfulReports: result.success ? prev.successfulReports + 1 : prev.successfulReports,
        failedReports: result.success ? prev.failedReports : prev.failedReports + 1
      }));

      return testResult;
    } catch (error) {
      const testResult = {
        id: Date.now(),
        district: 'غير محدد',
        status: 'error',
        success: false,
        message: (error as Error).message,
        timestamp: new Date(),
        deviceFingerprint: 'error'
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 19)]);
      setStats(prev => ({
        ...prev,
        totalReports: prev.totalReports + 1,
        failedReports: prev.failedReports + 1
      }));

      return testResult;
    }
  };

  // بدء/إيقاف الاختبار التلقائي
  const toggleAutoTest = () => {
    if (isRunning) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsRunning(false);
    } else {
      const id = setInterval(sendTestReport, 3000); // كل 3 ثوان
      setIntervalId(id);
      setIsRunning(true);
    }
  };

  // إرسال بلاغ واحد
  const sendSingleReport = async () => {
    await sendTestReport();
  };

  // إرسال 5 بلاغات دفعة واحدة
  const sendBatchReports = async () => {
    for (let i = 0; i < 5; i++) {
      await sendTestReport();
      await new Promise(resolve => setTimeout(resolve, 500)); // تأخير 500ms بين البلاغات
    }
  };

  // جلب الإحصائيات
  const fetchStats = async () => {
    try {
      const { data: reportsData } = await supabase
        .from('electricity_reports')
        .select('*');

      const { data: confirmationsData } = await supabase
        .from('collective_confirmations')
        .select('*')
        .eq('is_active', true);

      setStats(prev => ({
        ...prev,
        totalReports: reportsData?.length || 0,
        confirmations: confirmationsData?.length || 0
      }));
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  // تنظيف النتائج
  const clearResults = () => {
    setTestResults([]);
    setStats(prev => ({
      ...prev,
      successfulReports: 0,
      failedReports: 0
    }));
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // كل 10 ثوان
    return () => clearInterval(interval);
  }, []);

  // تنظيف عند إغلاق المكون
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on': return 'text-green-600 bg-green-100';
      case 'off': return 'text-red-600 bg-red-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'unknown': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on': return <TrendingUp className="w-4 h-4" />;
      case 'off': return <TrendingDown className="w-4 h-4" />;
      case 'partial': return <Minus className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'on': return 'مشغل';
      case 'off': return 'مطفأ';
      case 'partial': return 'جزئي';
      case 'unknown': return 'غير مؤكد';
      case 'error': return 'خطأ';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 اختبار البلاغات التجريبية
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            إرسال بلاغات تجريبية لاختبار نظام التأكيد الجماعي
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي البلاغات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">البلاغات الناجحة</p>
                <p className="text-3xl font-bold text-green-600">{stats.successfulReports}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">البلاغات الفاشلة</p>
                <p className="text-3xl font-bold text-red-600">{stats.failedReports}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">التأكيدات النشطة</p>
                <p className="text-3xl font-bold text-purple-600">{stats.confirmations}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">أزرار التحكم</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={sendSingleReport}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Zap className="w-5 h-5" />
              إرسال بلاغ واحد
            </button>
            
            <button
              onClick={sendBatchReports}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Users className="w-5 h-5" />
              إرسال 5 بلاغات
            </button>
            
            <button
              onClick={toggleAutoTest}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg ${
                isRunning 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {isRunning ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isRunning ? 'إيقاف الاختبار' : 'بدء الاختبار التلقائي'}
            </button>
            
            <button
              onClick={clearResults}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
              مسح النتائج
            </button>
          </div>
        </div>

        {/* حالة الاختبار التلقائي */}
        {isRunning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2 text-yellow-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <span className="font-medium">الاختبار التلقائي يعمل - يتم إرسال بلاغ كل 3 ثوان</span>
            </div>
          </div>
        )}

        {/* نتائج الاختبارات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">نتائج الاختبارات</h2>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>لا توجد نتائج اختبارات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{result.district}</p>
                      <p className="text-sm text-gray-600">
                        جهاز: {result.deviceFingerprint.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                        {getStatusIcon(result.status)}
                        {getStatusText(result.status)}
                      </span>
                    </div>
                    <p className={`text-xs ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.timestamp.toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* معلومات الاختبار */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات الاختبار</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🎯 الهدف:</h4>
              <ul className="space-y-1">
                <li>• اختبار إرسال البلاغات إلى Supabase</li>
                <li>• محاكاة المستخدمين المختلفين</li>
                <li>• اختبار نظام التأكيد الجماعي</li>
                <li>• مراقبة الأداء والاستجابة</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚙️ الإعدادات:</h4>
              <ul className="space-y-1">
                <li>• المديريات: 6 مديريات عشوائية</li>
                <li>• الحالات: 4 حالات مختلفة</li>
                <li>• التكرار: كل 3 ثوان (تلقائي)</li>
                <li>• الجهاز: بصمة فريدة لكل بلاغ</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
