import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import DetailsModal from '@/components/DetailsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, MapPin, Phone, Star, Users, Calendar, 
  Search, Filter, Globe, Award, BookOpen, Clock, 
  CheckCircle, ExternalLink, Map, Navigation, Share2, 
  MessageCircle, Eye, EyeOff, XCircle, Timer, Mail, 
  Car, ArrowLeft, Plus, School as SchoolIcon, Building2, AlertTriangle
} from 'lucide-react';
import { schools, School } from '@/lib/adenBotData';

export default function SchoolsDirectoryPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'rating', 'name', 'reviews'
  const [showMap, setShowMap] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const total = schools.length;
    const publicSchools = schools.filter(s => s.type === 'public').length;
    const privateSchools = schools.filter(s => s.type === 'private').length;
    const totalRating = schools.reduce((sum, school) => sum + school.rating, 0);
    const avgRating = schools.length > 0 ? (totalRating / schools.length).toFixed(1) : '0';
    return { total, public: publicSchools, private: privateSchools, avgRating };
  }, [schools]);

  // فلترة المدارس
  const filteredSchools = useMemo(() => {
    let currentSchools = [...schools];

    if (searchQuery) {
      currentSchools = currentSchools.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (school.levels && school.levels.some(level => 
          level.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
    }

    if (typeFilter !== 'all') {
      currentSchools = currentSchools.filter(school => school.type === typeFilter);
    }

    if (districtFilter !== 'all') {
      currentSchools = currentSchools.filter(school => school.district === districtFilter);
    }

    if (levelFilter !== 'all') {
      currentSchools = currentSchools.filter(school => 
        school.levels && school.levels.includes(levelFilter)
      );
    }

    currentSchools.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'reviews': return b.reviews - a.reviews;
        case 'rating':
        default: return b.rating - a.rating;
      }
    });

    return currentSchools;
  }, [schools, searchQuery, typeFilter, districtFilter, levelFilter, sortBy]);

  // قائمة مديريات عدن ثابتة لاستخدامها في الفلاتر
  const districts = [
    'كريتر',
    'المعلا',
    'التواهي',
    'خور مكسر',
    'المنصورة',
    'الشيخ عثمان',
    'البريقة',
    'دار سعد',
    'القلوعه',
    'الممدارة',
  ];

  // الحصول على المستويات الفريدة
  const levels = useMemo(() => {
    const allLevels = schools.flatMap(school => school.levels || []);
    const uniqueLevels = [...new Set(allLevels)];
    return uniqueLevels.sort();
  }, [schools]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public': return 'bg-green-900/80 text-green-300 border-green-700';
      case 'private': return 'bg-purple-900/80 text-purple-300 border-purple-700';
      default: return 'bg-gray-900/80 text-gray-300 border-gray-700';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'public': return 'حكومية';
      case 'private': return 'خاصة';
      default: return type;
    }
  };

  const getSchoolImage = (school: School) => {
    switch (school.type) {
      case 'public': return '🏫';
      case 'private': return '🏢';
      default: return '🎓';
    }
  };

  const getLevelColor = (level: string) => {
    const colors = [
      'bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600',
      'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-orange-600'
    ];
    const index = level.length % colors.length;
    return colors[index];
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleShowDetails = (school: School) => {
    setSelectedSchool(school);
    setIsDetailsModalOpen(true);
  };


  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
        }`}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <div className="w-full px-3 py-2 sm:py-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <SchoolIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">دليل المدارس</h1>
          </div>
          <p className="text-green-300 text-xs sm:text-sm md:text-base">دليل شامل للمدارس والمرافق التعليمية في عدن</p>
          
          {/* تنبيه مهم حول دقة المعلومات */}
          <div className="mt-3 p-2 sm:p-3 bg-yellow-900/20 border border-yellow-600/50 rounded-lg space-y-2">
            <p className="text-yellow-300 text-xs sm:text-sm">
              ⚠️ <strong>إخلاء مسؤولية:</strong> المعلومات المعروضة استرشادية. يُنصح بالتواصل المباشر مع المدارس للتأكد من التفاصيل.
            </p>
            <div className="flex flex-wrap gap-2 text-xs justify-center">
              <a 
                href="https://moe-ye.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-blue-200 underline flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                وزارة التربية والتعليم
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">التقييمات تقديرية</span>
            </div>
          </div>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <SchoolIcon className="w-3 h-3 sm:w-4 h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-300 mb-1">{stats.total}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي المدارس</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Building2 className="w-3 h-3 sm:w-4 h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-blue-300 mb-1">{stats.public}</div>
            <div className="text-xs text-gray-300 font-medium">حكومية</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-purple-900/80 to-purple-800/80 border-purple-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <GraduationCap className="w-3 h-3 sm:w-4 h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-purple-300 mb-1">{stats.private}</div>
            <div className="text-xs text-gray-300 font-medium">خاصة</div>
          </Card>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-2xl">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-2 sm:space-y-3">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-300 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن مدرسة أو مستوى تعليمي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 h-9 text-xs text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 pr-8"
                />
              </div>

              {/* فلاتر بدون فلتر الترتيب حسب التقييم/المراجعات */}
              <div className="grid grid-cols-2 gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 text-xs border-green-600 focus:border-green-400 bg-green-700 text-white">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-700 text-white text-sm">جميع الأنواع</SelectItem>
                    <SelectItem value="public" className="hover:bg-gray-700 text-white text-sm">🏫 حكومية</SelectItem>
                    <SelectItem value="private" className="hover:bg-gray-700 text-white text-sm">🏢 خاصة</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger className="h-9 text-xs border-green-600 focus:border-green-400 bg-green-700 text-white">
                    <SelectValue placeholder="المنطقة" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-700 text-white text-sm">جميع المناطق</SelectItem>
                    {districts.map(district => (
                      <SelectItem key={district} value={district} className="hover:bg-gray-700 text-white text-sm">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="h-9 text-xs border-green-600 focus:border-green-400 bg-green-700 text-white">
                    <SelectValue placeholder="المستوى" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-700 text-white text-sm">جميع المستويات</SelectItem>
                    {levels.map(level => (
                      <SelectItem key={level} value={level} className="hover:bg-gray-700 text-white text-sm">
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* أزرار إضافية */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setShowMap(!showMap)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 h-9 text-xs"
                >
                  <Map className="w-3 h-3 mr-1" />
                  {showMap ? 'إخفاء الخريطة' : 'عرض الخريطة'}
                </Button>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setDistrictFilter('all');
                    setLevelFilter('all');
                    setSortBy('name');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 h-9 text-xs"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عداد النتائج */}
        <div className="mb-3 sm:mb-4 text-center">
          <div className="bg-green-800 bg-opacity-80 border border-green-600 rounded-lg p-2 sm:p-3">
            <p className="text-green-300 text-xs sm:text-sm">
              عرض {filteredSchools.length} من أصل {schools.length} مدرسة
            </p>
          </div>
        </div>

        {/* الخريطة التفاعلية */}
        {showMap && (
          <Card className="mb-4 sm:mb-6 bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-2xl">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">خريطة المدارس</h3>
                <p className="text-green-300 text-xs sm:text-sm">انقر على أي مدرسة لعرض التفاصيل والاتجاهات</p>
              </div>
              
              {/* خريطة مبسطة */}
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                <Map className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-2 sm:mb-4" />
                <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">خريطة تفاعلية</h4>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                  الخريطة التفاعلية ستظهر هنا مع مواقع جميع المدارس
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-xs">
                  <div className="bg-blue-600 text-white p-1.5 sm:p-2 rounded text-xs">حكومية</div>
                  <div className="bg-purple-600 text-white p-1.5 sm:p-2 rounded text-xs">خاصة</div>
                  <div className="bg-green-600 text-white p-1.5 sm:p-2 rounded text-xs">مستويات</div>
                  <div className="bg-yellow-600 text-white p-1.5 sm:p-2 rounded text-xs">تقييمات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* قائمة المدارس */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">المدارس</h2>
            <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">{filteredSchools.length}</Badge>
          </div>
          {filteredSchools.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-green-900/90 backdrop-blur-sm border-green-700 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <SchoolIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد مدارس</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على مدارس تطابق معايير البحث</p>
              <Button 
                onClick={() => setLocation('/education')}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                العودة للتعليم
              </Button>
            </Card>
          ) : (
            filteredSchools.map((school) => (
              <Card key={school.id} className="bg-green-800 bg-opacity-80 border border-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-3">
                    {/* العنوان الرئيسي */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        {getSchoolImage(school)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm group-hover:text-green-300 transition-colors leading-tight">
                            {school.name}
                          </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getTypeColor(school.type)} text-white text-xs px-2 py-1`}>
                            {getTypeText(school.type)}
                          </Badge>
                          <Badge variant="outline" className="text-green-400 border-green-500 text-xs px-2 py-1">
                            {school.district}
                          </Badge>
                        </div>
                      </div>
                        </div>
                        
                    {/* معلومات منظمة بدون نظام التقييم والمراجعات */}
                    {/* معلومات إضافية */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start gap-2 p-2 bg-gray-800/30 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div className="text-gray-300">العنوان</div>
                          <div className="text-white font-medium break-words leading-tight">{school.address || school.name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
                        <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-gray-300">الهاتف</div>
                          <div className="text-white font-medium break-all">{school.tel}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex flex-col gap-1 pt-1">
                      <Button
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.address || school.name)}`;
                          window.open(mapsUrl, '_blank');
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 min-h-[32px]"
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        الاتجاهات
                      </Button>
                      <Button
                        onClick={() => handleShowDetails(school)}
                        variant="outline"
                        className="w-full border-green-500 text-green-300 hover:bg-green-900 text-xs py-1.5 min-h-[32px]"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        التفاصيل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <AppFooter />

      {/* نافذة تفاصيل المدرسة - محسنة للهواتف */}
      {selectedSchool && (
        <DetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          title={selectedSchool.name}
          subtitle={`${getTypeText(selectedSchool.type)} - ${selectedSchool.district}`}
          image={getSchoolImage(selectedSchool)}
          sections={[
            {
              title: "المعلومات الأساسية",
              icon: <SchoolIcon className="w-4 h-4 text-blue-400" />,
              items: [
                {
                  label: "النوع",
                  value: getTypeText(selectedSchool.type),
                  type: "badge",
                  color: getTypeColor(selectedSchool.type)
                },
                {
                  label: "المنطقة",
                  value: selectedSchool.district,
                  icon: <MapPin className="w-4 h-4 text-purple-400" />
                },
              ]
            },
            {
              title: "معلومات الاتصال",
              icon: <Phone className="w-4 h-4 text-green-400" />,
              items: [
                {
                  label: "الهاتف",
                  value: selectedSchool.tel,
                  type: "contact",
                  icon: <Phone className="w-4 h-4 text-green-400" />
                },
                {
                  label: "العنوان",
                  value: selectedSchool.address || 'غير محدد',
                  icon: <MapPin className="w-4 h-4 text-purple-400" />
                }
              ]
            },
            {
              title: "المستويات التعليمية",
              icon: <BookOpen className="w-4 h-4 text-orange-400" />,
              items: selectedSchool.levels?.map(level => ({
                label: level,
                value: level,
                type: "badge" as const,
                color: getLevelColor(level)
              })) || []
            },
            {
              title: "معلومات إضافية",
              icon: <BookOpen className="w-4 h-4 text-blue-400" />,
              items: [
                {
                  label: "الوصف",
                  value: selectedSchool.description,
                  icon: <BookOpen className="w-4 h-4 text-blue-400" />
                },
                ...(selectedSchool.fees ? [{
                  label: "الرسوم",
                  value: selectedSchool.fees,
                  icon: <Users className="w-4 h-4 text-green-400" />
                }] : [])
              ]
            },
            {
              title: "معلومات رسمية",
              icon: <Award className="w-4 h-4 text-yellow-400" />,
              items: [
                {
                  label: "وزارة التربية والتعليم",
                  value: "جمهورية اليمن",
                  icon: <Building2 className="w-4 h-4 text-blue-400" />,
                  type: "official" as const
                },
                {
                  label: "الموقع الرسمي للوزارة",
                  value: "https://moe.gov.ye",
                  type: "link" as const,
                  icon: <Globe className="w-4 h-4 text-green-400" />
                },
                {
                  label: "نظام القبول المدرسي",
                  value: "https://schools.gov.ye",
                  type: "link" as const,
                  icon: <CheckCircle className="w-4 h-4 text-purple-400" />
                }
              ]
            },
            {
              title: "تحذيرات مهمة",
              icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
              items: [
                {
                  label: "تأكيد صحة المعلومات",
                  value: "يرجى التأكد من صحة المعلومات قبل اتخاذ أي قرار",
                  icon: <CheckCircle className="w-4 h-4 text-yellow-400" />,
                  type: "warning" as const
                },
                {
                  label: "التواصل المباشر",
                  value: "يُنصح بالتواصل المباشر مع المدرسة للتأكد من أحدث المعلومات",
                  icon: <Phone className="w-4 h-4 text-green-400" />,
                  type: "warning" as const
                },
                {
                  label: "الرسوم والبرامج",
                  value: "الرسوم والبرامج قابلة للتغيير - يرجى التحقق من الموقع الرسمي",
                  icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
                  type: "warning" as const
                }
              ]
            }
          ]}
          actions={[
            {
              label: "اتصال",
              onClick: () => window.open(`tel:${selectedSchool.tel}`, '_self'),
              icon: <Phone className="w-3 h-3" />,
              variant: "default" as const
            },
            {
              label: "خريطة",
              onClick: () => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSchool.address || selectedSchool.name)}`;
                window.open(mapsUrl, '_blank');
              },
              icon: <Navigation className="w-3 h-3" />,
              variant: "outline" as const
            },
            {
              label: "مشاركة",
              onClick: () => {
                if (navigator.share) {
                  navigator.share({
                    title: selectedSchool.name,
                    text: selectedSchool.description,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(`${selectedSchool.name} - ${selectedSchool.address}`);
                  alert('تم نسخ معلومات المدرسة');
                }
              },
              icon: <Share2 className="w-3 h-3" />,
              variant: "outline" as const
            }
          ]}
        />
      )}
    </div>
  );
}
