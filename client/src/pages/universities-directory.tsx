import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, MapPin, Phone, Star, Users, Calendar, 
  Search, Filter, Globe, Award, GraduationCap, 
  BookOpen, Clock, CheckCircle, ExternalLink, Map,
  Navigation, Share2, MessageCircle, Eye, EyeOff, 
  XCircle, Timer, Mail, Car, ArrowLeft, Plus, AlertTriangle
} from 'lucide-react';
import { universities, University } from '@/lib/adenBotData';
import DetailsModal from '@/components/DetailsModal';

export default function UniversitiesDirectoryPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'established'
  const [showMap, setShowMap] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const total = universities.length;
    const publicUnis = universities.filter(u => u.type === 'public').length;
    const privateUnis = universities.filter(u => u.type === 'private').length;
    const avgRating = universities.reduce((sum, u) => sum + u.rating, 0) / total;
    
    return { total, publicUnis, privateUnis, avgRating: avgRating.toFixed(1) };
  }, []);

  // فلترة وترتيب الجامعات
  const filteredUniversities = useMemo(() => {
    let filtered = [...universities];

    // فلترة حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(uni => 
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // فلترة حسب النوع
    if (typeFilter !== 'all') {
      filtered = filtered.filter(uni => uni.type === typeFilter);
    }

    // فلترة حسب المنطقة
    if (districtFilter !== 'all') {
      filtered = filtered.filter(uni => uni.district === districtFilter);
    }

    // فلترة حسب التخصص
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(uni => 
        uni.specialties.some(spec => spec.toLowerCase().includes(specialtyFilter.toLowerCase()))
      );
    }

    // ترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar');
        case 'established':
          return (b.established || 0) - (a.established || 0);
        default:
          return a.name.localeCompare(b.name, 'ar');
      }
    });

    return filtered;
  }, [searchQuery, typeFilter, districtFilter, specialtyFilter, sortBy]);

  // قائمة مديريات عدن ثابتة لاستخدامها في فلتر الجامعات
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

  // الحصول على قائمة التخصصات
  const specialties = useMemo(() => {
    const allSpecialties = universities.flatMap(uni => uni.specialties);
    return [...new Set(allSpecialties)].sort();
  }, []);

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

  const getUniversityImage = (university: University) => {
    switch (university.type) {
      case 'public': return '🏛️';
      case 'private': return '🏢';
      default: return '🎓';
    }
  };

  // دالة لفتح نافذة التفاصيل
  const handleShowDetails = (university: University) => {
    setSelectedUniversity(university);
    setIsDetailsModalOpen(true);
  };

  const getSpecialtyColor = (specialty: string) => {
    const colors = [
      'bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600',
      'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-orange-600'
    ];
    const index = specialty.length % colors.length;
    return colors[index];
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? getRatingColor(rating) : 'text-gray-600'
        }`}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
      <AppHeader />
      
      <div className="w-full px-3 py-4 sm:py-8" style={{ maxWidth: '100vw', boxSizing: 'border-box', overflow: 'hidden' }}>
        {/* العنوان الرئيسي */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">دليل الجامعات</h1>
          </div>
          <p className="text-purple-300 text-xs sm:text-sm md:text-base">دليل شامل للجامعات والكليات في عدن</p>
          
          {/* تنبيه مهم حول دقة المعلومات */}
          <div className="mt-3 p-2 sm:p-3 bg-yellow-900/20 border border-yellow-600/50 rounded-lg space-y-2">
            <p className="text-yellow-300 text-xs sm:text-sm">
              ⚠️ <strong>تنبيه مهم:</strong> المعلومات المعروضة استرشادية. يرجى التحقق من المصادر الرسمية للجامعات قبل اتخاذ أي قرار أكاديمي.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
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
              <span className="text-gray-400">التقييمات تقديرية وليست رسمية</span>
            </div>
          </div>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-purple-800 bg-opacity-80 border border-purple-600 rounded-xl shadow-2xl w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          <CardContent className="p-2 sm:p-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="space-y-2 sm:space-y-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
              {/* البحث */}
              <div className="relative w-full">
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن جامعة أو تخصص..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-full bg-purple-700 border border-purple-600 rounded-lg px-3 py-2 h-9 text-xs text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 pr-8"
                />
              </div>

              {/* فلاتر بدون فلتر الترتيب */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full max-w-full h-9 text-xs border-purple-600 focus:border-purple-400 bg-purple-700 text-white">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-700 text-white text-sm">جميع الأنواع</SelectItem>
                    <SelectItem value="public" className="hover:bg-gray-700 text-white text-sm">🏛️ حكومية</SelectItem>
                    <SelectItem value="private" className="hover:bg-gray-700 text-white text-sm">🏢 خاصة</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={districtFilter} onValueChange={setDistrictFilter}>
                  <SelectTrigger className="w-full max-w-full h-9 text-xs border-purple-600 focus:border-purple-400 bg-purple-700 text-white">
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

                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="w-full max-w-full h-9 text-xs border-purple-600 focus:border-purple-400 bg-purple-700 text-white">
                    <SelectValue placeholder="التخصص" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                    <SelectItem value="all" className="hover:bg-gray-700 text-white text-sm">جميع التخصصات</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty} className="hover:bg-gray-700 text-white text-sm">
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* أزرار إضافية */}
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  onClick={() => setShowMap(!showMap)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 h-9 text-xs"
                >
                  <Map className="w-3 h-3 mr-1" />
                  {showMap ? 'إخفاء الخريطة' : 'عرض الخريطة'}
                </Button>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setDistrictFilter('all');
                    setSpecialtyFilter('all');
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
        <div className="mb-3 sm:mb-4 text-center w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          <div className="bg-purple-800 bg-opacity-80 border border-purple-600 rounded-lg p-2 sm:p-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <p className="text-purple-300 text-xs sm:text-sm">
              عرض {filteredUniversities.length} من أصل {universities.length} جامعة
            </p>
          </div>
        </div>

        {/* الخريطة التفاعلية */}
        {showMap && (
          <Card className="mb-4 sm:mb-6 bg-purple-800 bg-opacity-80 border border-purple-600 rounded-xl shadow-2xl w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <CardContent className="p-3 sm:p-4">
              <div className="text-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">خريطة الجامعات</h3>
                <p className="text-purple-300 text-xs sm:text-sm">انقر على أي جامعة لعرض التفاصيل والاتجاهات</p>
              </div>
              
              {/* خريطة مبسطة */}
              <div className="bg-gray-800 rounded-lg p-3 sm:p-4 text-center">
                <Map className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-2 sm:mb-4" />
                <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">خريطة تفاعلية</h4>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                  الخريطة التفاعلية ستظهر هنا مع مواقع جميع الجامعات
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 text-xs">
                  <div className="bg-green-600 text-white p-1.5 sm:p-2 rounded text-xs">حكومية</div>
                  <div className="bg-purple-600 text-white p-1.5 sm:p-2 rounded text-xs">خاصة</div>
                  <div className="bg-blue-600 text-white p-1.5 sm:p-2 rounded text-xs">تخصصات</div>
                  <div className="bg-yellow-600 text-white p-1.5 sm:p-2 rounded text-xs">تقييمات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* قائمة الجامعات */}
        <div className="space-y-2 sm:space-y-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">الجامعات</h2>
            <Badge className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs">{filteredUniversities.length}</Badge>
          </div>
          {filteredUniversities.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-sm border-purple-700 shadow-lg w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد جامعات</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على جامعات تطابق معايير البحث</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setDistrictFilter('all');
                  setSpecialtyFilter('all');
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                إعادة تعيين الفلاتر
              </Button>
            </Card>
          ) : (
            filteredUniversities.map((university) => (
              <Card key={university.id} className="bg-purple-800 bg-opacity-80 border border-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-3">
                    {/* العنوان الرئيسي */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        {getUniversityImage(university)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm group-hover:text-purple-300 transition-colors leading-tight">
                            {university.name}
                          </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getTypeColor(university.type)} text-white text-xs px-2 py-1`}>
                            {getTypeText(university.type)}
                          </Badge>
                          <Badge variant="outline" className="text-purple-400 border-purple-500 text-xs px-2 py-1">
                            {university.district}
                          </Badge>
                          {university.established && (
                            <Badge variant="outline" className="text-blue-400 border-blue-500 text-xs px-2 py-1">
                              {university.established}
                            </Badge>
                          )}
                        </div>
                      </div>
                        </div>
                        
                    {/* معلومات منظمة بدون نظام تقييم عددي */}
                    {/* معلومات إضافية */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start gap-2 p-2 bg-gray-800/30 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <div className="text-gray-300">العنوان</div>
                          <div className="text-white font-medium break-words leading-tight">{university.address}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
                        <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-gray-300">الهاتف</div>
                          <div className="text-white font-medium break-all">{university.tel}</div>
                      </div>
                      </div>
                    </div>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex flex-col gap-1 pt-1">
                      <Button
                        onClick={() => {
                          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(university.address)}`;
                          window.open(mapsUrl, '_blank');
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1.5 min-h-[32px]"
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        الاتجاهات
                      </Button>
                      <Button
                        onClick={() => handleShowDetails(university)}
                        variant="outline"
                        className="w-full border-purple-500 text-purple-300 hover:bg-purple-900 text-xs py-1.5 min-h-[32px]"
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
      
      {/* نافذة تفاصيل الجامعة - محسنة للهواتف */}
      {selectedUniversity && (
        <DetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          title={selectedUniversity.name}
          subtitle={`${getTypeText(selectedUniversity.type)} - ${selectedUniversity.district}`}
          image={getUniversityImage(selectedUniversity)}
          sections={[
            {
              title: "المعلومات الأساسية",
              icon: <Building2 className="w-4 h-4 text-blue-400" />,
              items: [
                {
                  label: "النوع",
                  value: getTypeText(selectedUniversity.type),
                  type: "badge",
                  color: getTypeColor(selectedUniversity.type)
                },
                {
                  label: "المنطقة",
                  value: selectedUniversity.district,
                  icon: <MapPin className="w-4 h-4 text-purple-400" />
                },
                {
                  label: "سنة التأسيس",
                  value: selectedUniversity.established || "غير محدد",
                  icon: <Calendar className="w-4 h-4 text-green-400" />
                }
              ]
            },
            {
              title: "معلومات الاتصال",
              icon: <Phone className="w-4 h-4 text-green-400" />,
              items: [
                {
                  label: "الهاتف",
                  value: selectedUniversity.tel,
                  type: "contact",
                  icon: <Phone className="w-4 h-4 text-green-400" />
                },
                {
                  label: "العنوان",
                  value: selectedUniversity.address,
                  icon: <MapPin className="w-4 h-4 text-purple-400" />
                },
                ...(selectedUniversity.website ? [{
                  label: "الموقع الإلكتروني",
                  value: selectedUniversity.website.startsWith('http') ? selectedUniversity.website : `https://${selectedUniversity.website}`,
                  type: "link" as const,
                  icon: <Globe className="w-4 h-4 text-blue-400" />
                }] : [])
              ]
            },
            {
              title: "التخصصات والكليات",
              icon: <GraduationCap className="w-4 h-4 text-purple-400" />,
              items: selectedUniversity.specialties.map(specialty => ({
                label: specialty,
                value: specialty,
                type: "badge" as const,
                color: getSpecialtyColor(specialty)
              }))
            },
            ...(selectedUniversity.admissionRequirements ? [{
              title: "شروط القبول",
              icon: <CheckCircle className="w-4 h-4 text-green-400" />,
              items: selectedUniversity.admissionRequirements.map(requirement => ({
                label: requirement,
                value: requirement,
                icon: <CheckCircle className="w-4 h-4 text-green-400" />
              }))
            }] : []),
            {
              title: "معلومات إضافية",
              icon: <BookOpen className="w-4 h-4 text-blue-400" />,
              items: [
                {
                  label: "الوصف",
                  value: selectedUniversity.description,
                  icon: <BookOpen className="w-4 h-4 text-blue-400" />
                },
                ...(selectedUniversity.accreditation ? [{
                  label: "الاعتماد",
                  value: selectedUniversity.accreditation,
                  icon: <Award className="w-4 h-4 text-yellow-400" />
                }] : []),
                ...(selectedUniversity.fees ? [{
                  label: "الرسوم",
                  value: selectedUniversity.fees,
                  icon: <Users className="w-4 h-4 text-green-400" />
                }] : [])
              ]
            },
            {
              title: "معلومات رسمية",
              icon: <Award className="w-4 h-4 text-yellow-400" />,
              items: [
                {
                  label: "وزارة التعليم العالي والبحث العلمي",
                  value: "وزارة التعليم العالي - عدن",
                  icon: <Building2 className="w-4 h-4 text-blue-400" />,
                  type: "official" as const
                },
                {
                  label: "الموقع الرسمي للوزارة",
                  value: "https://mohe.gov.ye",
                  type: "link" as const,
                  icon: <Globe className="w-4 h-4 text-green-400" />
                },
                {
                  label: "نظام القبول الموحد",
                  value: "https://admission.gov.ye",
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
                  value: "يُنصح بالتواصل المباشر مع الجامعة للتأكد من أحدث المعلومات",
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
              onClick: () => window.open(`tel:${selectedUniversity.tel}`, '_self'),
              icon: <Phone className="w-3 h-3" />,
              variant: "default" as const
            },
            ...(selectedUniversity.website ? [{
              label: "موقع",
              onClick: () => window.open(selectedUniversity.website!.startsWith('http') ? selectedUniversity.website! : `https://${selectedUniversity.website}`, '_blank'),
              icon: <ExternalLink className="w-3 h-3" />,
              variant: "outline" as const
            }] : []),
            {
              label: "خريطة",
              onClick: () => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedUniversity.address)}`;
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
                    title: selectedUniversity.name,
                    text: selectedUniversity.description,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(`${selectedUniversity.name} - ${selectedUniversity.address}`);
                  alert('تم نسخ معلومات الجامعة');
                }
              },
              icon: <Share2 className="w-3 h-3" />,
              variant: "outline" as const
            }
          ]}
        />
      )}
      
      <AppFooter />
    </div>
  );
}
