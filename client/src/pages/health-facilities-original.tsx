import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import HealthFacilityCard, { HealthFacilitiesGrid } from '@/components/HealthFacilityCard';
import HealthFacilityDetailCard from '@/components/HealthFacilityDetailCard';
import { adenHealthFacilities, type HealthFacility } from '@/data/aden-health-facilities';
import { ensureArray, multiFilter, getUniqueValues, sortBy } from '@/lib/dataUtils';
import { Search, Filter, MapPin, Clock, Phone, Star, Heart, Stethoscope, Pill, Microscope, Eye, Building, Users } from 'lucide-react';

export default function HealthFacilitiesOriginalPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortByField, setSortByField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);

  // استخدام البيانات الأصلية
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health-facilities-original'],
    queryFn: async () => {
      // محاكاة API call مع البيانات الأصلية
      await new Promise(resolve => setTimeout(resolve, 500));
      return adenHealthFacilities;
    },
    staleTime: 10 * 60 * 1000, // 10 دقائق
    gcTime: 20 * 60 * 1000 // 20 دقيقة
  });

  // التأكد من أن البيانات array
  const facilities = ensureArray(data);

  // فلترة وترتيب البيانات
  const filteredAndSortedFacilities = useMemo(() => {
    let filtered = multiFilter(facilities, {
      search: {
        query: searchQuery,
        fields: ['name', 'nameEn', 'address', 'district', 'specialties', 'services']
      },
      exact: {
        type: selectedType === 'all' ? undefined : selectedType,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        district: selectedDistrict === 'all' ? undefined : selectedDistrict
      }
    });

    // ترتيب البيانات
    if (sortByField && sortByField !== 'none') {
      filtered = sortBy(filtered, sortByField as keyof HealthFacility, sortDirection);
    }

    return filtered;
  }, [facilities, searchQuery, selectedType, selectedCategory, selectedDistrict, sortByField, sortDirection]);

  // الحصول على القيم الفريدة للفلاتر
  const types = getUniqueValues(facilities, 'type');
  const categories = getUniqueValues(facilities, 'category');
  const districts = getUniqueValues(facilities, 'district');

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const total = facilities.length;
    const hospitals = facilities.filter(f => f.type === 'hospital').length;
    const clinics = facilities.filter(f => f.type === 'clinic').length;
    const pharmacies = facilities.filter(f => f.type === 'pharmacy').length;
    const laboratories = facilities.filter(f => f.type === 'laboratory').length;
    const dental = facilities.filter(f => f.type === 'dental').length;
    const specialized = facilities.filter(f => f.type === 'specialized').length;
    const publicFacilities = facilities.filter(f => f.category === 'public').length;
    const privateFacilities = facilities.filter(f => f.category === 'private').length;
    const charityFacilities = facilities.filter(f => f.category === 'charity').length;

    return { 
      total, hospitals, clinics, pharmacies, laboratories, dental, specialized,
      publicFacilities, privateFacilities, charityFacilities 
    };
  }, [facilities]);

  // الحصول على أيقونة النوع
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Stethoscope className="w-5 h-5" />;
      case 'clinic': return <Heart className="w-5 h-5" />;
      case 'pharmacy': return <Pill className="w-5 h-5" />;
      case 'laboratory': return <Microscope className="w-5 h-5" />;
      case 'dental': return <Stethoscope className="w-5 h-5" />;
      case 'specialized': return <Eye className="w-5 h-5" />;
      default: return <Stethoscope className="w-5 h-5" />;
    }
  };

  // الحصول على لون النوع
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clinic': return 'bg-green-100 text-green-800 border-green-200';
      case 'pharmacy': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'laboratory': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dental': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'specialized': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على لون الفئة
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'public': return 'bg-green-100 text-green-800 border-green-200';
      case 'private': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'charity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // تحويل البيانات للبطاقات
  const cardFacilities = useMemo(() => {
    return filteredAndSortedFacilities.map(facility => ({
      id: facility.id,
      name: facility.name,
      type: facility.type === 'hospital' ? 'مستشفى' :
            facility.type === 'clinic' ? 'عيادة' :
            facility.type === 'pharmacy' ? 'صيدلية' :
            facility.type === 'laboratory' ? 'مختبر' :
            facility.type === 'dental' ? 'أسنان' :
            facility.type === 'specialized' ? 'متخصص' : facility.type,
      distance: 0, // يمكن إضافة حساب المسافة لاحقاً
      address: facility.address,
      phone: facility.contact?.phone?.[0] || '',
      rating: facility.rating,
      isOpen: facility.availability?.emergency,
      workingHours: facility.workingHours
    }));
  }, [filteredAndSortedFacilities]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المرافق الصحية...</p>
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
            🏥 المرافق الصحية في عدن
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            دليل شامل لجميع المرافق الصحية في محافظة عدن - مستشفيات، عيادات، صيدليات، ومختبرات
          </p>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">إجمالي المرافق</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.hospitals}</div>
            <div className="text-sm text-gray-600">مستشفيات</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.clinics}</div>
            <div className="text-sm text-gray-600">عيادات</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pharmacies}</div>
            <div className="text-sm text-gray-600">صيدليات</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{stats.laboratories}</div>
            <div className="text-sm text-gray-600">مختبرات</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.specialized}</div>
            <div className="text-sm text-gray-600">متخصصة</div>
          </div>
        </div>

        {/* إحصائيات الفئات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{stats.publicFacilities}</div>
            </div>
            <div className="text-sm text-gray-600">مرافق حكومية</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{stats.privateFacilities}</div>
            </div>
            <div className="text-sm text-gray-600">مرافق خاصة</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{stats.charityFacilities}</div>
            </div>
            <div className="text-sm text-gray-600">مرافق خيرية</div>
          </div>
        </div>

        {/* شريط البحث والفلاتر */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* شريط البحث */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن مرفق صحي، عنوان، أو تخصص..."
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
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedCategory('all');
                setSelectedDistrict('all');
                setSortByField('name');
                setSortDirection('asc');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              مسح الكل
            </button>
          </div>

          {/* الفلاتر المتقدمة */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* نوع المرفق */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المرفق</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الأنواع</option>
                  {types.map(type => (
                    <option key={String(type)} value={String(type)}>
                      {String(type) === 'hospital' ? 'مستشفى' :
                       String(type) === 'clinic' ? 'عيادة' :
                       String(type) === 'pharmacy' ? 'صيدلية' :
                       String(type) === 'laboratory' ? 'مختبر' :
                       String(type) === 'dental' ? 'أسنان' :
                       String(type) === 'specialized' ? 'متخصص' : String(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* فئة المرفق */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">فئة المرفق</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع الفئات</option>
                  {categories.map(category => (
                    <option key={String(category)} value={String(category)}>
                      {String(category) === 'public' ? 'حكومي' :
                       String(category) === 'private' ? 'خاص' :
                       String(category) === 'charity' ? 'خيري' : String(category)}
                    </option>
                  ))}
                </select>
              </div>

              {/* المنطقة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">جميع المناطق</option>
                  {districts.map(district => (
                    <option key={String(district)} value={String(district)}>{String(district)}</option>
                  ))}
                </select>
              </div>

              {/* ترتيب */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب حسب</label>
                <select
                  value={sortByField}
                  onChange={(e) => setSortByField(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">الاسم</option>
                  <option value="rating">التقييم</option>
                  <option value="type">النوع</option>
                  <option value="category">الفئة</option>
                  <option value="district">المنطقة</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* نتائج البحث */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              نتائج البحث ({filteredAndSortedFacilities.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">ترتيب:</span>
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {sortDirection === 'asc' ? 'تصاعدي' : 'تنازلي'}
              </button>
            </div>
          </div>
        </div>

        {/* قائمة المرافق الصحية باستخدام البطاقات الأصلية */}
        {filteredAndSortedFacilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلاتر</p>
          </div>
        ) : (
          <HealthFacilitiesGrid 
            facilities={cardFacilities}
            onFacilityClick={(facility) => {
              // العثور على المرفق الأصلي من البيانات
              const originalFacility = facilities.find(f => f.id === facility.id);
              if (originalFacility) {
                setSelectedFacility(originalFacility);
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        )}

        {/* معلومات إضافية */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات مهمة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">🚨 الطوارئ:</h4>
              <p>جميع المستشفيات الحكومية تقدم خدمات الطوارئ على مدار 24 ساعة</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💰 التكلفة:</h4>
              <p>المرافق الحكومية تقدم خدمات مجانية للمواطنين</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📞 التواصل:</h4>
              <p>يُنصح بالاتصال قبل الزيارة للتأكد من التوفر</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📍 الموقع:</h4>
              <p>جميع المرافق موثقة بالعنوان الدقيق والموقع الجغرافي</p>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
      
      {/* بطاقة التفاصيل */}
      {selectedFacility && (
        <HealthFacilityDetailCard
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      )}
    </div>
  );
}
