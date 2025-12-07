import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import HealthFacilityCard, { HealthFacilitiesGrid } from '@/components/HealthFacilityCard';
import { adenHealthFacilities, type HealthFacility } from '@/data/aden-health-facilities';
import { ensureArray, multiFilter, getUniqueValues, sortBy } from '@/lib/dataUtils';
import { Search, Filter, MapPin, Clock, Phone, Star, Heart, Stethoscope, Pill, Microscope, Eye } from 'lucide-react';

export default function HealthFacilitiesEnhancedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [sortByField, setSortByField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // استخدام البيانات الأصلية
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health-facilities-enhanced'],
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
    const publicFacilities = facilities.filter(f => f.category === 'public').length;
    const privateFacilities = facilities.filter(f => f.category === 'private').length;

    return { total, hospitals, clinics, pharmacies, publicFacilities, privateFacilities };
  }, [facilities]);

  // الحصول على أيقونة النوع
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Stethoscope className="w-5 h-5" />;
      case 'clinic': return <Heart className="w-5 h-5" />;
      case 'pharmacy': return <Pill className="w-5 h-5" />;
      case 'laboratory': return <Microscope className="w-5 h-5" />;
      case 'dental': return <Eye className="w-5 h-5" />;
      case 'specialized': return <Eye className="w-5 h-5" />;
      default: return <Stethoscope className="w-5 h-5" />;
    }
  };

  // الحصول على لون النوع
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-blue-100 text-blue-800';
      case 'clinic': return 'bg-green-100 text-green-800';
      case 'pharmacy': return 'bg-purple-100 text-purple-800';
      case 'laboratory': return 'bg-orange-100 text-orange-800';
      case 'dental': return 'bg-pink-100 text-pink-800';
      case 'specialized': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على لون الفئة
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-blue-100 text-blue-800';
      case 'charity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
            <div className="text-2xl font-bold text-green-600">{stats.publicFacilities}</div>
            <div className="text-sm text-gray-600">حكومية</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.privateFacilities}</div>
            <div className="text-sm text-gray-600">خاصة</div>
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

        {/* قائمة المرافق الصحية */}
        {filteredAndSortedFacilities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على نتائج</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلاتر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedFacilities.map((facility) => (
              <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* صورة المرفق */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <div className="text-6xl">{facility.icon}</div>
                </div>

                {/* محتوى البطاقة */}
                <div className="p-6">
                  {/* العنوان والنوع */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(facility.type)}`}>
                        {getTypeIcon(facility.type)}
                        <span className="mr-1">
                          {facility.type === 'hospital' ? 'مستشفى' :
                           facility.type === 'clinic' ? 'عيادة' :
                           facility.type === 'pharmacy' ? 'صيدلية' :
                           facility.type === 'laboratory' ? 'مختبر' :
                           facility.type === 'dental' ? 'أسنان' :
                           facility.type === 'specialized' ? 'متخصص' : facility.type}
                        </span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(facility.category)}`}>
                        {facility.category === 'public' ? 'حكومي' :
                         facility.category === 'private' ? 'خاص' :
                         facility.category === 'charity' ? 'خيري' : facility.category}
                      </span>
                    </div>
                  </div>

                  {/* الوصف */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{facility.description}</p>

                  {/* العنوان */}
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{facility.address}</span>
                  </div>

                  {/* ساعات العمل */}
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{facility.workingHours}</span>
                  </div>

                  {/* الهاتف */}
                  {facility.contact?.phone && facility.contact.phone.length > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{facility.contact.phone[0]}</span>
                    </div>
                  )}

                  {/* التقييم */}
                  {facility.rating && (
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{facility.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* التخصصات */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">التخصصات:</h4>
                    <div className="flex flex-wrap gap-1">
                      {facility.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                      {facility.specialties.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{facility.specialties.length - 3} أكثر
                        </span>
                      )}
                    </div>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      عرض التفاصيل
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      الموقع
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
