import React, { useState } from 'react';
import CollectiveConfirmationCard from '@/components/CollectiveConfirmationCard';
import ReportButtons from '@/components/ReportButtons';
import { BarChart3, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function CollectiveConfirmationTestPage() {
  const [selectedDistrict, setSelectedDistrict] = useState('كريتر');
  const [reports, setReports] = useState<any[]>([]);

  const districts = ['كريتر', 'المعلا', 'التواهي', 'المنصورة', 'الشيخ عثمان', 'خور مكسر'];

  // معالجة إرسال البلاغ
  const handleReportSubmitted = (report: any) => {
    setReports(prev => [report, ...prev]);
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on': return 'text-green-600 bg-green-100';
      case 'off': return 'text-red-600 bg-red-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'unknown': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on': return <CheckCircle className="w-4 h-4" />;
      case 'off': return <AlertTriangle className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            👥 اختبار نظام التأكيد الجماعي
          </h1>
          <p className="text-lg text-gray-600">
            نظام تأكيد جماعي يتطلب 3 بلاغات متطابقة في 3 دقائق
          </p>
        </div>

        {/* اختيار المديرية */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">اختر المديرية للاختبار</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {districts.map((district) => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedDistrict === district
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {district}
              </button>
            ))}
          </div>
        </div>

        {/* بطاقة التأكيد الجماعي */}
        <div className="mb-8">
          <CollectiveConfirmationCard
            district={selectedDistrict}
            onStatusUpdate={(status) => {
              console.log('تم تحديث حالة التأكيد:', status);
            }}
            className="max-w-md mx-auto"
          />
        </div>

        {/* أزرار الإبلاغ */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            أزرار الإبلاغ - {selectedDistrict}
          </h2>
          <div className="max-w-md mx-auto">
            <ReportButtons
              district={selectedDistrict}
              onReportSubmitted={handleReportSubmitted}
            />
          </div>
        </div>

        {/* البلاغات الأخيرة */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">البلاغات الأخيرة</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>{reports.length} بلاغ</span>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>لا توجد بلاغات بعد</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 10).map((report, index) => (
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
          <h3 className="text-lg font-semibold text-blue-900 mb-4">ميزات نظام التأكيد الجماعي</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">📊 آلية التأكيد</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• يتطلب 3 بلاغات متطابقة في 3 دقائق</li>
                <li>• يجب أن تكون من 3 مستخدمين مختلفين</li>
                <li>• يتم إنشاء تأكيد جماعي تلقائياً</li>
                <li>• ينتهي التأكيد بعد 30 دقيقة</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔒 الحماية والأمان</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• معادلة هاش للتحقق من البلاغات</li>
                <li>• حماية من البلاغات المتكررة</li>
                <li>• تتبع المستخدمين الفريدين</li>
                <li>• تسجيل جميع الأنشطة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* معادلة الحماية */}
        <div className="bg-gray-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">معادلة الحماية</h3>
          <div className="bg-white rounded-lg p-4 font-mono text-sm">
            <p className="text-gray-700 mb-2">معادلة هاش البلاغات:</p>
            <div className="bg-gray-100 p-3 rounded border-l-4 border-blue-500">
              <p>reportHash = SHA256(district + status + deviceFingerprint + timestamp)</p>
            </div>
            <p className="text-gray-600 mt-2 text-xs">
              حيث: district = المديرية، status = الحالة، deviceFingerprint = بصمة الجهاز، timestamp = الطابع الزمني
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
