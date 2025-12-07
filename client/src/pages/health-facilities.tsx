import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Stethoscope, MapPin, Phone, Clock, Search, Plus, ArrowLeft, 
  Star, ExternalLink, Calendar, Users, Shield, Heart, Map, 
  Navigation, Share2, MessageCircle, Eye, EyeOff, AlertCircle,
  CheckCircle, XCircle, Timer, Globe, Mail, Building, Car
} from 'lucide-react';
import { adenHealthFacilities } from '@/data/aden-health-facilities';
import DetailsModal from '@/components/DetailsModal';

interface HealthFacility {
  id: string;
  name: string;
  address: string;
  district: string;
  specialties: string[];
  emergencyNumber: string[];
  workingHours: string;
  services: string[];
  rating?: number;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'laboratory' | 'dental' | 'specialized';
  category: 'public' | 'private' | 'charity';
  description: string;
  features: string[];
  contact?: {
    phone?: string[];
    email?: string;
    website?: string;
  };
  availability: {
    emergency: boolean;
    appointments: boolean;
    walkIn: boolean;
  };
}

export default function HealthFacilitiesPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // استخدام البيانات الحقيقية
  const healthFacilities = adenHealthFacilities;

  // تحديد حالة المرفق
  const getFacilityStatus = (facility: HealthFacility) => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = الأحد, 6 = السبت
    
    // إذا كان المرفق مفتوح 24 ساعة
    if (facility.workingHours.includes('24 ساعة')) {
      return 'open';
    }
    
    // إذا كان المرفق مفتوح الآن (8 ص - 10 م)
    if (hour >= 8 && hour < 22) {
      return 'open';
    }
    
    // إذا كان المرفق مغلق
    return 'closed';
  };

  // فلترة المرافق الصحية
  const filteredFacilities = useMemo(() => {
    return healthFacilities.filter(facility => {
      const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (typeof facility.address === 'string' ? facility.address.toLowerCase() : JSON.stringify(facility.address)).includes(searchQuery.toLowerCase()) ||
                           facility.specialties.some(specialty => 
                             specialty.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      const matchesType = selectedType === 'all' || facility.type === selectedType;
      const matchesDistrict = selectedDistrict === 'all' || facility.district === selectedDistrict;
      
      // فلترة حسب الحالة
      let matchesStatus = true;
      if (selectedStatus !== 'all') {
        const status = getFacilityStatus(facility);
        matchesStatus = selectedStatus === status;
      }
      
      // فلترة حسب التقييم
      let matchesRating = true;
      if (selectedRating !== 'all' && facility.rating) {
        const rating = parseFloat(selectedRating);
        matchesRating = facility.rating >= rating;
      }
      
      return matchesSearch && matchesType && matchesDistrict && matchesStatus && matchesRating;
    });
  }, [searchQuery, selectedType, selectedDistrict, selectedStatus, selectedRating]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-red-500 text-white';
      case 'clinic': return 'bg-blue-500 text-white';
      case 'pharmacy': return 'bg-green-500 text-white';
      case 'laboratory': return 'bg-purple-500 text-white';
      case 'dental': return 'bg-cyan-500 text-white';
      case 'specialized': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'hospital': return 'مستشفى';
      case 'clinic': return 'عيادة';
      case 'pharmacy': return 'صيدلية';
      case 'laboratory': return 'مختبر';
      case 'dental': return 'عيادة أسنان';
      case 'specialized': return 'متخصص';
      default: return type;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'public': return 'bg-blue-600 text-white';
      case 'private': return 'bg-green-600 text-white';
      case 'charity': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'public': return 'حكومي';
      case 'private': return 'خاص';
      case 'charity': return 'خيري';
      default: return category;
    }
  };

  // وظائف جديدة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500 text-white';
      case 'closed': return 'bg-red-500 text-white';
      case 'busy': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'closed': return 'مغلق';
      case 'busy': return 'مشغول';
      default: return 'غير محدد';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      case 'busy': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const openGoogleMaps = (facility: HealthFacility) => {
    const [lat, lng] = (facility as any).coordinates || [0, 0];
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const shareOnWhatsApp = (facility: HealthFacility) => {
    const address = typeof facility.address === 'string' ? facility.address : JSON.stringify(facility.address);
    const message = `🏥 ${facility.name}\n📍 ${address}\n📞 ${facility.contact?.phone?.[0] || 'غير متوفر'}\n⏰ ${facility.workingHours}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const getFacilityImage = (facility: HealthFacility) => {
    // صور افتراضية حسب نوع المرفق
    switch (facility.type) {
      case 'hospital': return '🏥';
      case 'clinic': return '🏪';
      case 'pharmacy': return '💊';
      case 'laboratory': return '🧪';
      case 'dental': return '🦷';
      case 'specialized': return '❤️';
      default: return '🏥';
    }
  };

  // دالة لفتح نافذة التفاصيل
  const handleShowDetails = (facility: HealthFacility) => {
    setSelectedFacility(facility);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      <AppHeader />
      
      <div className="w-full px-3 py-4 sm:py-8" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        {/* العنوان الرئيسي */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">المرافق الصحية</h1>
          </div>
          <p className="text-sky-300 text-sm sm:text-base md:text-lg">دليل شامل للمرافق الصحية في عدن</p>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-4 sm:mb-6 bg-blue-800 bg-opacity-80 border border-blue-600 rounded-xl shadow-2xl w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          <CardContent className="p-2 sm:p-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            <div className="space-y-2 sm:space-y-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
              {/* البحث */}
              <div className="relative w-full">
                <Search className="absolute right-3 top-3 w-4 h-4 text-sky-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن مرفق صحي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full max-w-full bg-blue-700 border border-blue-600 rounded-xl px-3 py-2 text-sm text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
                  style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* فلاتر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full max-w-full px-3 py-2 bg-blue-700 border border-blue-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="hospital">مستشفى</option>
                  <option value="clinic">عيادة</option>
                  <option value="pharmacy">صيدلية</option>
                  <option value="laboratory">مختبر</option>
                  <option value="dental">عيادة أسنان</option>
                  <option value="specialized">متخصص</option>
                </select>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full max-w-full px-3 py-2 bg-blue-700 border border-blue-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
                >
                  <option value="all">جميع المديريات</option>
                  <option value="عدن كريتر">عدن كريتر</option>
                  <option value="المعلا">المعلا</option>
                  <option value="التواهي">التواهي</option>
                  <option value="خور مكسر">خور مكسر</option>
                  <option value="المنصورة">المنصورة</option>
                  <option value="الشيخ عثمان">الشيخ عثمان</option>
                  <option value="البريقة">البريقة</option>
                  <option value="دار سعد">دار سعد</option>
                  <option value="القلوعه">القلوعه</option>
                  <option value="الممدارة">الممدارة</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full max-w-full px-3 py-2 bg-blue-700 border border-blue-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="open">مفتوح</option>
                  <option value="closed">مغلق</option>
                  <option value="busy">مشغول</option>
                </select>

                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full max-w-full px-3 py-2 bg-blue-700 border border-blue-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-sm"
                >
                  <option value="all">جميع التقييمات</option>
                  <option value="5">5 نجوم</option>
                  <option value="4">4+ نجوم</option>
                  <option value="3">3+ نجوم</option>
                  <option value="2">2+ نجوم</option>
                </select>
              </div>

              {/* أزرار إضافية */}
              <div className="flex flex-wrap gap-2 sm:gap-3 w-full">
                <Button
                  onClick={() => setShowMap(!showMap)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2"
                >
                  <Map className="w-4 h-4 mr-2" />
                  {showMap ? 'إخفاء الخريطة' : 'عرض الخريطة'}
                </Button>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedDistrict('all');
                    setSelectedStatus('all');
                    setSelectedRating('all');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عداد النتائج */}
        <div className="mb-4 sm:mb-6 text-center">
          <div className="bg-blue-800 bg-opacity-80 border border-blue-600 rounded-xl p-3 sm:p-4">
            <p className="text-sky-300 text-sm sm:text-base md:text-lg">
              عرض {filteredFacilities.length} من أصل {healthFacilities.length} مرفق صحي
            </p>
          </div>
        </div>

        {/* الخريطة التفاعلية */}
        {showMap && (
          <Card className="mb-6 bg-blue-800 bg-opacity-80 border border-blue-600 rounded-xl shadow-2xl">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-2">خريطة المرافق الصحية</h3>
                <p className="text-sky-300 text-sm">انقر على أي مرفق لعرض التفاصيل والاتجاهات</p>
              </div>
              
              {/* خريطة مبسطة */}
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <Map className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h4 className="text-white font-semibold mb-2">خريطة تفاعلية</h4>
                <p className="text-gray-300 text-sm mb-4">
                  الخريطة التفاعلية ستظهر هنا مع مواقع جميع المرافق الصحية
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-red-600 text-white p-2 rounded">مستشفيات</div>
                  <div className="bg-blue-600 text-white p-2 rounded">عيادات</div>
                  <div className="bg-green-600 text-white p-2 rounded">صيدليات</div>
                  <div className="bg-purple-600 text-white p-2 rounded">مختبرات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* قائمة المرافق الصحية */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">المرافق الصحية</h2>
            <Badge className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{filteredFacilities.length}</Badge>
          </div>

          <div className="space-y-3 sm:space-y-4 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            {filteredFacilities.map((facility) => {
              const status = getFacilityStatus(facility);
              return (
                <Card key={facility.id} className="bg-blue-800 bg-opacity-80 border border-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 group w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-3 mb-3">
                          {/* صورة المرفق */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-700 rounded-lg flex items-center justify-center text-xl sm:text-2xl group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                            {getFacilityImage(facility)}
                          </div>
                          
                          {/* البيانات الأساسية */}
                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-cyan-300 transition-colors break-words">
                                {facility.name}
                              </h3>
                          <div className="flex flex-wrap gap-2">
                          <Badge className={getTypeColor(facility.type)}>
                                {getTypeText(facility.type)}
                              </Badge>
                          <Badge className={getStatusColor(status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(status)}
                                  {getStatusText(status)}
                                </div>
                              </Badge>
                          </div>
                            </div>
                        
                        {/* العنوان المختصر */}
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3 h-3 text-blue-300 flex-shrink-0" />
                          <p className="text-xs sm:text-sm text-blue-100 break-words">{facility.district}</p>
                        </div>
                            
                            {/* التقييم */}
                            {facility.rating && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                  className={`w-3 h-3 ${i < Math.floor(facility.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                                    />
                                  ))}
                                </div>
                            <span className="text-xs text-yellow-400 font-medium">
                              {facility.rating}
                                </span>
                              </div>
                            )}

                        {/* التخصصات المختصرة */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {facility.specialties.slice(0, 2).map((specialty, index) => (
                              <Badge key={index} className="bg-blue-600 text-blue-100 text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          {facility.specialties.length > 2 && (
                              <Badge className="bg-gray-600 text-gray-300 text-xs">
                              +{facility.specialties.length - 2}
                              </Badge>
                            )}
                        </div>
                        </div>
                      </div>

                      {/* الأزرار */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:flex-shrink-0">
                        {facility.contact?.phone && (
                          <Button 
                            size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                            onClick={() => window.open(`tel:${facility.contact.phone[0]}`, '_self')}
                          >
                          <Phone className="w-3 h-3 mr-1" />
                            اتصل
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm"
                          onClick={() => openGoogleMaps(facility)}
                        >
                        <Navigation className="w-3 h-3 mr-1" />
                          اتجاهات
                        </Button>
                        
                        <Button 
                          size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                        onClick={() => handleShowDetails(facility)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        التفاصيل
                          </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredFacilities.length === 0 && (
            <Card className="bg-blue-800 bg-opacity-80 border border-blue-600 rounded-xl">
              <CardContent className="p-6 sm:p-8 text-center">
                <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 text-sky-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">لا توجد مرافق صحية</h3>
                <p className="text-sky-300 text-sm sm:text-base">لا توجد مرافق صحية تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أزرار التنقل */}
        <div className="mt-6 sm:mt-8 flex gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/health')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            العودة للصحة
          </Button>
        </div>
      </div>
      
      <AppFooter />

      {/* نافذة التفاصيل */}
      {selectedFacility && (
        <DetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          title={selectedFacility.name}
          subtitle={`${getTypeText(selectedFacility.type)} - ${selectedFacility.district}`}
          image={getFacilityImage(selectedFacility)}
          sections={[
            {
              title: 'معلومات عامة',
              icon: <Building className="w-5 h-5 text-blue-400" />,
              items: [
                { label: 'النوع', value: getTypeText(selectedFacility.type), type: 'badge', color: getTypeColor(selectedFacility.type) },
                { label: 'الفئة', value: getCategoryText(selectedFacility.category), type: 'badge', color: getCategoryColor(selectedFacility.category) },
                { label: 'الحالة', value: getStatusText(getFacilityStatus(selectedFacility)), type: 'badge', color: getStatusColor(getFacilityStatus(selectedFacility)) },
                { label: 'التقييم', value: selectedFacility.rating || 0, type: 'rating' },
              ]
            },
            {
              title: 'معلومات الاتصال',
              icon: <Phone className="w-5 h-5 text-green-400" />,
              items: [
                { label: 'العنوان', value: typeof selectedFacility.address === 'string' ? selectedFacility.address : JSON.stringify(selectedFacility.address), icon: <MapPin className="w-4 h-4 text-blue-400" /> },
                { label: 'ساعات العمل', value: selectedFacility.workingHours, icon: <Clock className="w-4 h-4 text-orange-400" /> },
                ...(selectedFacility.contact?.phone ? [{ label: 'الهاتف', value: selectedFacility.contact.phone[0], type: 'contact' as const, icon: <Phone className="w-4 h-4 text-green-400" /> }] : []),
                ...(selectedFacility.contact?.email ? [{ label: 'البريد الإلكتروني', value: selectedFacility.contact.email, type: 'contact' as const, icon: <Mail className="w-4 h-4 text-blue-400" /> }] : []),
                ...(selectedFacility.contact?.website ? [{ label: 'الموقع الإلكتروني', value: selectedFacility.contact.website, type: 'link' as const, icon: <Globe className="w-4 h-4 text-purple-400" /> }] : []),
              ]
            },
            {
              title: 'التخصصات والخدمات',
              icon: <Stethoscope className="w-5 h-5 text-red-400" />,
              items: [
                { label: 'التخصصات', value: selectedFacility.specialties.join('، ') },
                { label: 'الخدمات', value: selectedFacility.services.join('، ') },
                { label: 'المميزات', value: selectedFacility.features.join('، ') },
              ]
            }
          ]}
          actions={[
            ...(selectedFacility.contact?.phone ? [{
              label: 'اتصل الآن',
              onClick: () => window.open(`tel:${selectedFacility.contact!.phone![0]}`, '_self'),
              icon: <Phone className="w-4 h-4" />,
              variant: 'default' as const
            }] : []),
            {
              label: 'الاتجاهات',
              onClick: () => openGoogleMaps(selectedFacility),
              icon: <Navigation className="w-4 h-4" />,
              variant: 'outline' as const
            },
            {
              label: 'مشاركة',
              onClick: () => shareOnWhatsApp(selectedFacility),
              icon: <Share2 className="w-4 h-4" />,
              variant: 'outline' as const
            }
          ]}
        />
      )}
    </div>
  );
}
