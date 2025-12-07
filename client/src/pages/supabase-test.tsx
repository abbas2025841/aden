import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { supabase, SupabaseService } from '@/lib/supabase';
import { CheckCircle, XCircle, AlertTriangle, Database, Zap, Users, Clock, RefreshCw } from 'lucide-react';

export default function SupabaseTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statistics, setStatistics] = useState<any>(null);

  // اختبار الاتصال مع Supabase
  const testConnection = async () => {
    try {
      setIsLoading(true);
      setConnectionStatus('checking');
      
      const { data, error } = await supabase
        .from('electricity_reports')
        .select('count')
        .limit(1);

      if (error) throw error;
      
      setConnectionStatus('connected');
      addTestResult('اتصال قاعدة البيانات', 'نجح', 'تم الاتصال بنجاح مع Supabase');
    } catch (error) {
      setConnectionStatus('error');
      addTestResult('اتصال قاعدة البيانات', 'فشل', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة نتيجة اختبار
  const addTestResult = (test: string, status: 'نجح' | 'فشل', message: string) => {
    setTestResults(prev => [{
      id: Date.now(),
      test,
      status,
      message,
      timestamp: new Date()
    }, ...prev]);
  };

  // اختبار إرسال بلاغ
  const testSubmitReport = async () => {
    try {
      setIsLoading(true);
      
      const reportData = {
        report_id: `test_${Date.now()}`,
        district: 'كريتر',
        status: 'on' as const,
        user_agent: 'Supabase Test',
        device_fingerprint: `test_device_${Date.now()}`,
        report_hash: `hash_${Date.now()}`,
        timestamp: new Date().toISOString(),
        is_verified: false,
        verification_count: 1
      };

      const result = await SupabaseService.submitReport(reportData);
      
      if (result.success) {
        addTestResult('إرسال بلاغ', 'نجح', 'تم إرسال البلاغ بنجاح');
      } else {
        addTestResult('إرسال بلاغ', 'فشل', result.error || 'خطأ غير معروف');
      }
    } catch (error) {
      addTestResult('إرسال بلاغ', 'فشل', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار جلب البلاغات
  const testGetReports = async () => {
    try {
      setIsLoading(true);
      
      const result = await SupabaseService.getReports({ limit: 10 });
      
      if (result.success) {
        addTestResult('جلب البلاغات', 'نجح', `تم جلب ${result.data?.length || 0} بلاغ`);
      } else {
        addTestResult('جلب البلاغات', 'فشل', result.error || 'خطأ غير معروف');
      }
    } catch (error) {
      addTestResult('جلب البلاغات', 'فشل', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // اختبار حالة التأكيد
  const testConfirmationStatus = async () => {
    try {
      setIsLoading(true);
      
      const result = await SupabaseService.getConfirmationStatus('كريتر');
      
      if (result.success) {
        if (result.data) {
          addTestResult('حالة التأكيد', 'نجح', `تم العثور على تأكيد للمديرية`);
        } else {
          addTestResult('حالة التأكيد', 'نجح', 'لا توجد تأكيدات نشطة');
        }
      } else {
        addTestResult('حالة التأكيد', 'فشل', result.error || 'خطأ غير معروف');
      }
    } catch (error) {
      addTestResult('حالة التأكيد', 'فشل', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // جلب الإحصائيات
  const fetchStatistics = async () => {
    try {
      const result = await SupabaseService.getStatistics();
      
      if (result.success && result.data) {
        const stats = result.data.reduce((acc, stat) => {
          acc.totalReports += stat.total_reports;
          acc.onReports += stat.on_reports;
          acc.offReports += stat.off_reports;
          acc.partialReports += stat.partial_reports;
          acc.unknownReports += stat.unknown_reports;
          acc.uniqueUsers += stat.unique_users;
          acc.confirmations += stat.confirmations;
          return acc;
        }, {
          totalReports: 0,
          onReports: 0,
          offReports: 0,
          partialReports: 0,
          unknownReports: 0,
          uniqueUsers: 0,
          confirmations: 0
        });
        
        setStatistics(stats);
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  // اختبار جميع الوظائف
  const runAllTests = async () => {
    setTestResults([]);
    await testConnection();
    await testSubmitReport();
    await testGetReports();
    await testConfirmationStatus();
    await fetchStatistics();
  };

  // اختبار الاتصال عند تحميل الصفحة
  useEffect(() => {
    testConnection();
    fetchStatistics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🗄️ اختبار Supabase
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            اختبار الاتصال والوظائف مع قاعدة بيانات Supabase
          </p>
        </div>

        {/* حالة الاتصال */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">حالة الاتصال</h2>
            <button
              onClick={testConnection}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              اختبار الاتصال
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {connectionStatus === 'checking' && (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">جاري التحقق...</span>
              </>
            )}
            {connectionStatus === 'connected' && (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-600 font-medium">متصل بنجاح</span>
              </>
            )}
            {connectionStatus === 'error' && (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                <span className="text-red-600 font-medium">خطأ في الاتصال</span>
              </>
            )}
          </div>
        </div>

        {/* الإحصائيات */}
        {statistics && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">إحصائيات قاعدة البيانات</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalReports}</div>
                <div className="text-sm text-gray-600">إجمالي البلاغات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.onReports}</div>
                <div className="text-sm text-gray-600">بلاغات مشغل</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{statistics.offReports}</div>
                <div className="text-sm text-gray-600">بلاغات مطفأ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{statistics.uniqueUsers}</div>
                <div className="text-sm text-gray-600">مستخدمين فريدين</div>
              </div>
            </div>
          </div>
        )}

        {/* أزرار الاختبار */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">اختبارات الوظائف</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={testSubmitReport}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Zap className="w-5 h-5" />
              اختبار إرسال بلاغ
            </button>
            
            <button
              onClick={testGetReports}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Database className="w-5 h-5" />
              اختبار جلب البلاغات
            </button>
            
            <button
              onClick={testConfirmationStatus}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <CheckCircle className="w-5 h-5" />
              اختبار حالة التأكيد
            </button>
            
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              تشغيل جميع الاختبارات
            </button>
          </div>
        </div>

        {/* نتائج الاختبارات */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">نتائج الاختبارات</h2>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>لا توجد نتائج اختبارات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.status === 'نجح' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{result.test}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      result.status === 'نجح' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.status}
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

        {/* معلومات Supabase */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات Supabase</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🔗 الاتصال:</h4>
              <ul className="space-y-1">
                <li>• Project URL: yyscldfxdfhequxcyiao.supabase.co</li>
                <li>• API Key: تم تكوينه</li>
                <li>• قاعدة البيانات: PostgreSQL</li>
                <li>• الحالة: {connectionStatus === 'connected' ? 'متصل' : 'غير متصل'}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 الجداول:</h4>
              <ul className="space-y-1">
                <li>• electricity_reports</li>
                <li>• collective_confirmations</li>
                <li>• unique_users</li>
                <li>• report_statistics</li>
                <li>• activity_log</li>
                <li>• districts</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
