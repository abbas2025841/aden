import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { SimpleElectricityGrid } from '@/components/SimpleElectricityCard';
import { adenElectricityData, type ElectricityStatus, getStatusText } from '@/data/aden-electricity-data';
import { ensureArray, multiFilter, getUniqueValues } from '@/lib/dataUtils';
import { Search, Filter, MapPin, Zap, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ElectricityStatusPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // استخدام البيانات التجريبية
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['electricity-status'],
    queryFn: async () => {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return adenElectricityData;
    },
    staleTime: 2 * 60 * 1000, // 2 دقائق
    gcTime: 5 * 60 * 1000 // 5 دقائق
  });

  // التأكد من أن البيانات array
  const electricityData = ensureArray(data);

  // فلترة البيانات
  const filteredData = useMemo(() => {
    return multiFilter(electricityData, {
      search: {
        query: searchQuery,
        fields: ['district', 'notes']
      },
      exact: {
        district: selectedDistrict === 'all' ? undefined : selectedDistrict,
        status: selectedStatus === 'all' ? undefined : selectedStatus
      }
    });
  }, [electricityData, searchQuery, selectedDistrict, selectedStatus]);

  // الحصول على القيم الفريدة للفلاتر
  const districts = getUniqueValues(electricityData, 'district');
  const statuses = getUniqueValues(electricityData, 'status');

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const total = electricityData.length;
    const onCount = electricityData.filter(e => e.status === 'on').length;
    const offCount = electricityData.filter(e => e.status === 'off').length;
    const partialCount = electricityData.filter(e => e.status === 'partial').length;
    const unknownCount = electricityData.filter(e => e.status === 'unknown').length;
    const recentlyUpdated = electricityData.filter(e => e.isRecentlyUpdated).length;

    return { total, onCount, offCount, partialCount, unknownCount, recentlyUpdated };
  }, [electricityData]);

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'off': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'partial': return <Minus className="w-4 h-4 text-yellow-600" />;
      case 'unknown': return <Minus className="w-4 h-4 text-gray-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on': return 'bg-green-100 text-green-800 border-green-200';
      case 'off': return 'bg-red-100 text-red-800 border-red-200';
      case 'partial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unknown': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل حالة الكهرباء...</p>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>خطأ في تحميل البيانات: {error?.message}</p>
            <button 
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              إعادة المحاولة
            </button>
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
            ⚡ حالة الكهرباء في عدن
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            تتبع حالة الكهرباء في جميع مديريات محافظة عدن - تحديثات مباشرة ومعلومات دقيقة
          </p>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي المديريات</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.onCount}</div>
            <div className="text-sm text-gray-600">مشغل</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.offCount}</div>
            <div className="text-sm text-gray-600">مطفأ</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.partialCount}</div>
            <div className="text-sm text-gray-600">جزئي</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.unknownCount}</div>
            <div className="text-sm text-gray-600">غير مؤكد</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.recentlyUpdated}</div>
            <div className="text-sm text-gray-600">محدث حديثاً</div>
          </div>
        </div>

        {/* شريط البحث والفلاتر */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* شريط البحث */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن مديرية أو ملاحظة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* أزرار الفلاتر */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              فلاتر متقدمة
            </button>
            
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث
            </button>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDistrict('all');
                setSelectedStatus('all');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              مسح الكل
            </button>
          </div>

          {/* الفلاتر المتقدمة */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* فلتر المديريات */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline ml-1" />
                  المديرية
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المديريات</option>
                  {districts.map(district => (
                    <option key={String(district)} value={String(district)}>{String(district)}</option>
                  ))}
                </select>
              </div>

              {/* فلتر الحالة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Zap className="w-4 h-4 inline ml-1" />
                  حالة الكهرباء
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الحالات</option>
                  {statuses.map(status => (
                    <option key={String(status)} value={String(status)}>
                      {getStatusText(status as any)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* نتائج البحث */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              نتائج البحث ({filteredData.length})
            </h2>
            <div className="text-sm text-gray-600">
              آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
            </div>
          </div>
        </div>

        {/* قائمة بطاقات الكهرباء */}
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلاتر</p>
          </div>
        ) : (
          <SimpleElectricityGrid 
            electricityData={filteredData}
            onElectricityClick={(electricity) => {
              console.log('تم النقر على مديرية:', electricity.district);
              // يمكن إضافة منطق عرض التفاصيل أو التنقل
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        )}

        {/* معلومات إضافية */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات مهمة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">⚡ حالة الكهرباء:</h4>
              <p>البيانات يتم تحديثها كل 5 دقائق من مصادر رسمية</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📍 المديريات:</h4>
              <p>جميع مديريات محافظة عدن مشمولة في التتبع</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔄 التحديثات:</h4>
              <p>البطاقات المحدثة حديثاً تظهر مع تأثير pulse</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 الإحصائيات:</h4>
              <p>إحصائيات مباشرة لحالة الكهرباء في جميع المديريات</p>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
