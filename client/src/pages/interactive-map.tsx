import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import InteractiveMap from '@/components/InteractiveMap';
import { MapPin, Users, Clock, CheckCircle, AlertTriangle, Zap, RefreshCw, Settings } from 'lucide-react';

export default function InteractiveMapPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mapData, setMapData] = useState<any>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // ثوان

  // جلب بيانات الخريطة
  const fetchMapData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/map/data');
      const result = await response.json();
      
      if (result.success) {
        setMapData(result.data);
      } else {
        console.error('خطأ في جلب بيانات الخريطة:', result.message);
      }
    } catch (error) {
      console.error('خطأ في الاتصال بالخادم:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث دوري للبيانات
  useEffect(() => {
    fetchMapData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMapData, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // معالجة النقر على المديرية
  const handleDistrictClick = (district: any) => {
    setSelectedDistrict(district.name);
    console.log('تم النقر على المديرية:', district);
  };

  // معالجة النقر على البلاغ
  const handleReportClick = (report: any) => {
    console.log('تم النقر على البلاغ:', report);
  };

  if (isLoading && !mapData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل الخريطة...</p>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🗺️ الخريطة التفاعلية لعدن
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            تتبع حالة الكهرباء في جميع مديريات عدن مع تحديثات في الوقت الفعلي
          </p>
        </div>

        {/* شريط التحكم */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={fetchMapData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm text-gray-700">
                  تحديث تلقائي
                </label>
              </div>
              
              {autoRefresh && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">كل:</label>
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={10}>10 ثوان</option>
                    <option value={30}>30 ثانية</option>
                    <option value={60}>دقيقة</option>
                    <option value={300}>5 دقائق</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>آخر تحديث: {mapData?.lastUpdated ? new Date(mapData.lastUpdated).toLocaleString('ar-SA') : 'غير متاح'}</span>
            </div>
          </div>
        </div>

        {/* الخريطة التفاعلية */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">خريطة عدن التفاعلية</h2>
            <p className="text-sm text-gray-600">
              انقر على أي منطقة لعرض التفاصيل، أو على أيقونة البلاغ لمزيد من المعلومات
            </p>
          </div>
          
          <InteractiveMap
            height="600px"
            onDistrictClick={handleDistrictClick}
            onReportClick={handleReportClick}
            className="rounded-lg overflow-hidden"
          />
        </div>

        {/* معلومات المديرية المحددة */}
        {selectedDistrict && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              معلومات المديرية: {selectedDistrict}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">الموقع</span>
                </div>
                <p className="text-sm text-blue-800">محافظة عدن</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">السكان</span>
                </div>
                <p className="text-sm text-green-800">~150,000 نسمة</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">الحالة</span>
                </div>
                <p className="text-sm text-purple-800">يتم التحديث...</p>
              </div>
            </div>
          </div>
        )}

        {/* دليل الألوان */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">دليل الألوان</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">مشغل</p>
                <p className="text-sm text-gray-600">الكهرباء متوفرة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">مطفأ</p>
                <p className="text-sm text-gray-600">انقطاع كامل</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">جزئي</p>
                <p className="text-sm text-gray-600">انقطاع جزئي</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">غير مؤكد</p>
                <p className="text-sm text-gray-600">لا توجد معلومات</p>
              </div>
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">ميزات الخريطة التفاعلية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🗺️ التفاعل:</h4>
              <ul className="space-y-1">
                <li>• انقر على المناطق لعرض التفاصيل</li>
                <li>• أيقونات متحركة للبلاغات الجديدة</li>
                <li>• تحديث تلقائي في الوقت الفعلي</li>
                <li>• شريط إحصائيات مباشر</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚡ البيانات:</h4>
              <ul className="space-y-1">
                <li>• حالات التأكيد الجماعي</li>
                <li>• عدد البلاغات والمستخدمين</li>
                <li>• معلومات السكان والمساحة</li>
                <li>• تواريخ آخر التحديثات</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
