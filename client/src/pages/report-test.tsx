import React, { useState } from 'react';
import ReportButtons from '@/components/ReportButtons';
import { reportProtection, type ReportData } from '@/lib/reportProtection';
import { Shield, BarChart3, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ReportTestPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [stats, setStats] = useState(reportProtection.getReportStats());

  // تحديث الإحصائيات
  const updateStats = () => {
    setStats(reportProtection.getReportStats());
  };

  // معالجة إرسال البلاغ
  const handleReportSubmitted = (report: ReportData) => {
    setReports(prev => [report, ...prev]);
    updateStats();
  };

  // مسح البيانات
  const clearData = () => {
    reportProtection.clearData();
    setReports([]);
    updateStats();
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on': return 'text-green-600 bg-green-100';
      case 'off': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on': return <CheckCircle className="w-4 h-4" />;
      case 'off': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🛡️ اختبار نظام الإبلاغ المتقدم
          </h1>
          <p className="text-lg text-gray-600">
            اختبار أزرار الإبلاغ مع نظام الحماية المتقدم
          </p>
        </div>

        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalReports}</div>
            <div className="text-sm text-gray-600">إجمالي البلاغات</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.todayReports}</div>
            <div className="text-sm text-gray-600">بلاغات اليوم</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.hourlyReports}</div>
            <div className="text-sm text-gray-600">بلاغات الساعة</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.cooldowns).length}</div>
            <div className="text-sm text-gray-600">مؤقتات التهدئة</div>
          </div>
        </div>

        {/* أزرار الإبلاغ للاختبار */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {['كريتر', 'المعلا', 'التواهي', 'المنصورة', 'الشيخ عثمان', 'خور مكسر'].map((district) => (
            <div key={district} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                {district}
              </h3>
              <ReportButtons
                district={district}
                onReportSubmitted={handleReportSubmitted}
              />
            </div>
          ))}
        </div>

        {/* البلاغات الأخيرة */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">البلاغات الأخيرة</h2>
            <button
              onClick={clearData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              مسح البيانات
            </button>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>لا توجد بلاغات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.district}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(report.timestamp).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {report.status === 'on' ? 'لصت الآن' : 'طفت'}
                    </p>
                    <p className="text-xs text-gray-500">ID: {report.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* معلومات النظام */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">ميزات نظام الحماية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🛡️ الحماية من البلاغات المتكررة</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• معادلة رياضية لحساب تشابه البلاغات</li>
                <li>• تحليل بصمة الجهاز والموقع</li>
                <li>• فحص البلاغات في آخر 24 ساعة</li>
                <li>• عتبة تشابه 85% للكشف عن التكرار</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">⏰ نظام التهدئة والحدود</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• مؤقت تهدئة 5 دقائق بين البلاغات</li>
                <li>• حد أقصى 3 بلاغات في الساعة</li>
                <li>• حد أقصى 10 بلاغات في اليوم</li>
                <li>• حفظ البيانات في LocalStorage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* معادلة الحماية */}
        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معادلة الحماية الرياضية</h3>
          <div className="bg-white rounded-lg p-4 font-mono text-sm">
            <p className="text-gray-700 mb-2">معادلة تشابه البلاغات:</p>
            <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-500">
              <p>similarity = (time_sim × 0.3) + (district_sim × 0.2) + (status_sim × 0.2) + (device_sim × 0.3)</p>
            </div>
            <p className="text-gray-600 mt-2 text-xs">
              حيث: time_sim = تشابه الوقت، district_sim = تشابه المديرية، 
              status_sim = تشابه الحالة، device_sim = تشابه الجهاز
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
