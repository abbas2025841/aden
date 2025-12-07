import React, { useState } from 'react';
import { SupabaseAdminService } from '@/lib/supabase';
import { Wrench, CheckCircle, XCircle, Loader, Database, Settings, MapPin } from 'lucide-react';

const AdminFixPage: React.FC = () => {
  const [isFixing, setIsFixing] = useState(false);
  const [fixResults, setFixResults] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<'idle' | 'fixing' | 'success' | 'error'>('idle');

  const handleFixSystem = async () => {
    setIsFixing(true);
    setSystemStatus('fixing');
    setFixResults([]);

    try {
      console.log('🚀 بدء إصلاح النظام...');
      
      // إصلاح النظام
      const result = await SupabaseAdminService.fixSystem();
      
      if (result.success) {
        setSystemStatus('success');
        setFixResults([{
          step: 'إصلاح النظام',
          status: 'success',
          message: result.message,
          timestamp: new Date().toLocaleString('ar-SA')
        }]);
      } else {
        setSystemStatus('error');
        setFixResults([{
          step: 'إصلاح النظام',
          status: 'error',
          message: result.error,
          timestamp: new Date().toLocaleString('ar-SA')
        }]);
      }
    } catch (error) {
      setSystemStatus('error');
      setFixResults([{
        step: 'إصلاح النظام',
        status: 'error',
        message: error.message,
        timestamp: new Date().toLocaleString('ar-SA')
      }]);
    } finally {
      setIsFixing(false);
    }
  };

  const handleTestSystem = async () => {
    setIsFixing(true);
    setFixResults([]);

    try {
      // اختبار إرسال بلاغ
      const testReport = {
        device_id: 'admin_test_device',
        report_id: `admin_test_${Date.now()}`,
        district: 'كريتر',
        status: 'on' as const,
        user_agent: 'Admin Test',
        device_fingerprint: 'admin_test_fingerprint',
        ip_address: '127.0.0.1',
        location: { lat: 12.7794, lng: 45.0369 },
        report_hash: `admin_test_hash_${Date.now()}`,
        timestamp: new Date().toISOString(),
        is_verified: false,
        verification_count: 1,
        customer_name: 'Admin Test',
        phone_number: '000-000-0000',
        problem_type: 'electricity_outage',
        priority: 'medium'
      };

      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('electricity_reports')
        .insert([testReport])
        .select()
        .single();

      if (error) throw error;

      setFixResults([{
        step: 'اختبار إرسال بلاغ',
        status: 'success',
        message: 'تم إرسال البلاغ بنجاح',
        data: data,
        timestamp: new Date().toLocaleString('ar-SA')
      }]);

    } catch (error) {
      setFixResults([{
        step: 'اختبار إرسال بلاغ',
        status: 'error',
        message: error.message,
        timestamp: new Date().toLocaleString('ar-SA')
      }]);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إصلاح النظام</h1>
              <p className="text-gray-600">إصلاح جميع أخطاء النظام وتشغيله مع قاعدة البيانات</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">حالة النظام</h2>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              systemStatus === 'success' ? 'bg-green-100' :
              systemStatus === 'error' ? 'bg-red-100' :
              systemStatus === 'fixing' ? 'bg-yellow-100' :
              'bg-gray-100'
            }`}>
              {systemStatus === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
              {systemStatus === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
              {systemStatus === 'fixing' && <Loader className="w-6 h-6 text-yellow-600 animate-spin" />}
              {systemStatus === 'idle' && <Settings className="w-6 h-6 text-gray-600" />}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {systemStatus === 'success' && 'النظام يعمل بشكل مثالي'}
                {systemStatus === 'error' && 'هناك أخطاء في النظام'}
                {systemStatus === 'fixing' && 'جاري إصلاح النظام...'}
                {systemStatus === 'idle' && 'النظام في حالة انتظار'}
              </p>
              <p className="text-sm text-gray-600">
                {systemStatus === 'success' && 'جميع الجداول والأعمدة تعمل بشكل صحيح'}
                {systemStatus === 'error' && 'يحتاج النظام إلى إصلاح'}
                {systemStatus === 'fixing' && 'يرجى الانتظار...'}
                {systemStatus === 'idle' && 'اضغط على إصلاح النظام للبدء'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">إجراءات الإصلاح</h2>
          <div className="flex gap-4">
            <button
              onClick={handleFixSystem}
              disabled={isFixing}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFixing ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Database className="w-5 h-5" />
              )}
              إصلاح النظام
            </button>
            
            <button
              onClick={handleTestSystem}
              disabled={isFixing}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFixing ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              اختبار النظام
            </button>
          </div>
        </div>

        {/* Results */}
        {fixResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">نتائج الإصلاح</h2>
            <div className="space-y-4">
              {fixResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  result.status === 'success' ? 'bg-green-50 border-green-500' :
                  result.status === 'error' ? 'bg-red-50 border-red-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${
                      result.status === 'success' ? 'bg-green-100' :
                      result.status === 'error' ? 'bg-red-100' :
                      'bg-yellow-100'
                    }`}>
                      {result.status === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {result.status === 'error' && <XCircle className="w-4 h-4 text-red-600" />}
                      {result.status === 'warning' && <Loader className="w-4 h-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{result.step}</h3>
                      <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{result.timestamp}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-sm text-blue-600 cursor-pointer">عرض البيانات</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات النظام</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">الجداول المطلوبة</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• electricity_reports</li>
                <li>• collective_confirmations</li>
                <li>• unique_users</li>
                <li>• report_statistics</li>
                <li>• activity_log</li>
                <li>• districts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">مديريات عدن الـ8</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• كريتر</li>
                <li>• المعلا</li>
                <li>• التواهي</li>
                <li>• المنصورة</li>
                <li>• خور مكسر</li>
                <li>• الشيخ عثمان</li>
                <li>• دار سعد</li>
                <li>• البريقة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFixPage;
