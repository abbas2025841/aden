import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, MapPin, Phone, Star, Calendar, 
  Search, Filter, Globe, Award, BookOpen, Clock, 
  CheckCircle, ExternalLink, Map, Navigation, Share2, 
  MessageCircle, Eye, EyeOff, XCircle, Timer, Mail, 
  Car, ArrowLeft, Plus, School as SchoolIcon, Building2,
  UserCheck, PhoneCall, MapPin as MapPinIcon, Shield,
  AlertTriangle, Info, FileText, MessageSquare, 
  Bell, Settings, HelpCircle, Heart, Star as StarIcon
} from 'lucide-react';

// بيانات خدمات أولياء الأمور
const parentServices = [
  {
    id: 1,
    name: "نظام متابعة الطلاب",
    description: "تتبع أداء الطالب الأكاديمي والسلوكي في الوقت الفعلي",
    category: "academic",
    provider: "وزارة التربية والتعليم",
    price: "مجاني",
    rating: 4.5,
    reviews: 234,
    phone: "+967-2-123456",
    website: "www.mohe-ye.org",
    features: ["تقرير شهري", "إشعارات فورية", "تقييم الأداء", "نصائح تعليمية"],
    status: "متاح",
    icon: "📊"
  },
  {
    id: 2,
    name: "خدمة التواصل مع المدرسة",
    description: "قناة مباشرة للتواصل مع إدارة المدرسة والمعلمين",
    category: "communication",
    provider: "مؤسسة الخدمات التعليمية",
    price: "مجاني",
    rating: 4.3,
    reviews: 189,
    phone: "+967-2-234567",
    website: "www.school-connect.ye",
    features: ["رسائل فورية", "مؤتمرات فيديو", "تقارير دورية", "دعم 24/7"],
    status: "متاح",
    icon: "💬"
  },
  {
    id: 3,
    name: "نظام الحضور والغياب",
    description: "متابعة حضور الطالب وغيابه مع إشعارات فورية",
    category: "attendance",
    provider: "شركة التقنيات التعليمية",
    price: "50 ريال/شهر",
    rating: 4.7,
    reviews: 156,
    phone: "+967-2-345678",
    website: "www.attendance-track.ye",
    features: ["إشعارات فورية", "تقارير مفصلة", "تحليل الأنماط", "تنبيهات"],
    status: "متاح",
    icon: "📅"
  },
  {
    id: 4,
    name: "خدمة النقل المدرسي",
    description: "حجز وتتبع حافلات النقل المدرسي للطلاب",
    category: "transport",
    provider: "شركة النقل المدرسي المتحدة",
    price: "200 ريال/شهر",
    rating: 4.2,
    reviews: 98,
    phone: "+967-2-456789",
    website: "www.school-bus.ye",
    features: ["تتبع الحافلة", "حجز المقاعد", "إشعارات التأخير", "تقييم السائق"],
    status: "متاح",
    icon: "🚌"
  },
  {
    id: 5,
    name: "نظام الدفع الإلكتروني",
    description: "دفع الرسوم المدرسية والخدمات الإلكترونية",
    category: "payment",
    provider: "بنك عدن الرقمي",
    price: "مجاني",
    rating: 4.6,
    reviews: 312,
    phone: "+967-2-567890",
    website: "www.aden-bank.ye",
    features: ["دفع آمن", "فواتير إلكترونية", "تذكيرات الدفع", "تاريخ المعاملات"],
    status: "متاح",
    icon: "💳"
  },
  {
    id: 6,
    name: "خدمة الاستشارة التربوية",
    description: "استشارات تربوية متخصصة لأولياء الأمور",
    category: "consultation",
    provider: "مركز الاستشارات التربوية",
    price: "100 ريال/جلسة",
    rating: 4.8,
    reviews: 67,
    phone: "+967-2-678901",
    website: "www.education-consult.ye",
    features: ["استشارات متخصصة", "جلسات فردية", "خطط تعليمية", "متابعة دورية"],
    status: "متاح",
    icon: "🎓"
  },
  {
    id: 7,
    name: "نظام الواجبات المنزلية",
    description: "متابعة وتقديم الواجبات المنزلية إلكترونياً",
    category: "homework",
    provider: "منصة التعليم الذكي",
    price: "75 ريال/شهر",
    rating: 4.4,
    reviews: 145,
    phone: "+967-2-789012",
    website: "www.smart-homework.ye",
    features: ["واجبات تفاعلية", "تصحيح تلقائي", "تقدم الطالب", "نصائح تعليمية"],
    status: "متاح",
    icon: "📝"
  },
  {
    id: 8,
    name: "خدمة الصحة المدرسية",
    description: "متابعة صحة الطالب والتطعيمات والفحوصات",
    category: "health",
    provider: "وزارة الصحة العامة",
    price: "مجاني",
    rating: 4.1,
    reviews: 89,
    phone: "+967-2-890123",
    website: "www.school-health.ye",
    features: ["سجل صحي", "تذكيرات التطعيم", "فحوصات دورية", "نصائح صحية"],
    status: "متاح",
    icon: "🏥"
  }
];

export default function ParentServicesPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedService, setSelectedService] = useState<any>(null);

  // إحصائيات سريعة
  const stats = React.useMemo(() => {
    const total = parentServices.length;
    const freeServices = parentServices.filter(s => s.price === 'مجاني').length;
    const paidServices = total - freeServices;
    const avgRating = parentServices.reduce((sum, service) => sum + service.rating, 0) / total;
    
    return { 
      total, 
      free: freeServices, 
      paid: paidServices, 
      avgRating: avgRating.toFixed(1)
    };
  }, []);

  // فلترة الخدمات
  const filteredServices = React.useMemo(() => {
    let currentServices = [...parentServices];

    if (searchQuery) {
      currentServices = currentServices.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      currentServices = currentServices.filter(service => service.category === categoryFilter);
    }

    if (priceFilter !== 'all') {
      currentServices = currentServices.filter(service => {
        if (priceFilter === 'free') return service.price === 'مجاني';
        if (priceFilter === 'paid') return service.price !== 'مجاني';
        return true;
      });
    }

    currentServices.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'price': return a.price.localeCompare(b.price);
        case 'rating':
        default: return b.rating - a.rating;
      }
    });

    return currentServices;
  }, [searchQuery, categoryFilter, priceFilter, sortBy]);

  // الحصول على الفئات الفريدة
  const categories = React.useMemo(() => {
    const categoryMap = {
      'academic': 'أكاديمي',
      'communication': 'تواصل',
      'attendance': 'حضور',
      'transport': 'نقل',
      'payment': 'دفع',
      'consultation': 'استشارة',
      'homework': 'واجبات',
      'health': 'صحة'
    };
    return categoryMap;
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'academic': 'bg-blue-600',
      'communication': 'bg-green-600',
      'attendance': 'bg-purple-600',
      'transport': 'bg-orange-600',
      'payment': 'bg-yellow-600',
      'consultation': 'bg-pink-600',
      'homework': 'bg-indigo-600',
      'health': 'bg-red-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-600';
  };

  const getPriceColor = (price: string) => {
    if (price === 'مجاني') return 'text-green-400';
    return 'text-yellow-400';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
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
      
      {/* شريط قيد التطوير */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-4 px-4 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <span className="font-bold text-lg">🚧 قيد التطوير - صفحة مواعيد الطبية 🚧</span>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="relative z-10 mt-2">
          <span className="text-sm font-medium opacity-90">هذه الصفحة قيد التطوير وقد تحتوي على ميزات غير مكتملة</span>
        </div>
      </div>
      
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">خدمات أولياء الأمور</h1>
          </div>
          <p className="text-pink-300 text-xs sm:text-sm md:text-base">خدمات شاملة لدعم أولياء الأمور في متابعة أبنائهم</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-pink-900/80 to-pink-800/80 border-pink-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-pink-300 mb-1">{stats.total}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي الخدمات</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-300 mb-1">{stats.free}</div>
            <div className="text-xs text-gray-300 font-medium">خدمات مجانية</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-yellow-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-300 mb-1">{stats.avgRating}</div>
            <div className="text-xs text-gray-300 font-medium">متوسط التقييم</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-blue-300 mb-1">{stats.paid}</div>
            <div className="text-xs text-gray-300 font-medium">خدمات مدفوعة</div>
          </Card>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-pink-800 bg-opacity-80 border border-pink-600 rounded-xl shadow-2xl">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-2 sm:space-y-3">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-2 top-2 w-3 h-3 sm:w-4 sm:h-4 text-pink-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن خدمة أو مزود..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-pink-700 border border-pink-600 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 pr-8"
                />
              </div>

              {/* فلاتر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-pink-700 border border-pink-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                >
                  <option value="all">جميع الفئات</option>
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-pink-700 border border-pink-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                >
                  <option value="all">جميع الأسعار</option>
                  <option value="free">مجاني</option>
                  <option value="paid">مدفوع</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 bg-pink-700 border border-pink-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                >
                  <option value="rating">التقييم</option>
                  <option value="name">الاسم</option>
                  <option value="price">السعر</option>
                </select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setPriceFilter('all');
                    setSortBy('rating');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 text-xs sm:text-sm"
                >
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عداد النتائج */}
        <div className="mb-3 sm:mb-4 text-center">
          <div className="bg-pink-800 bg-opacity-80 border border-pink-600 rounded-lg p-2 sm:p-3">
            <p className="text-pink-300 text-xs sm:text-sm">
              عرض {filteredServices.length} من أصل {parentServices.length} خدمة
            </p>
          </div>
        </div>

        {/* قائمة الخدمات */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">الخدمات المتاحة</h2>
            <Badge className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs">
              {filteredServices.length}
            </Badge>
          </div>

          {filteredServices.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-pink-900/90 backdrop-blur-sm border-pink-700 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد خدمات</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على خدمات تطابق معايير البحث</p>
              <Button 
                onClick={() => setLocation('/education')}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                العودة للتعليم
              </Button>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className="bg-pink-800 bg-opacity-80 border border-pink-600 rounded-lg shadow-lg hover:bg-pink-700 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-3">
                    {/* الصف الأول: أيقونة + عنوان + badges */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        {service.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm group-hover:text-pink-300 transition-colors leading-tight">
                          {service.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getCategoryColor(service.category)} text-white text-xs px-2 py-1`}>
                            {categories[service.category as keyof typeof categories]}
                          </Badge>
                          <Badge variant="outline" className="text-pink-400 border-pink-500 text-xs px-2 py-1">
                            {service.provider}
                          </Badge>
                          <Badge variant="outline" className={`text-xs px-2 py-1 ${getPriceColor(service.price)} border-current`}>
                            {service.price}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* شبكة المعلومات المنظمة */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div className="text-gray-300">التقييم</div>
                          <div className="text-white font-medium">{service.rating}/5</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-gray-300">المراجعات</div>
                          <div className="text-white font-medium">{service.reviews}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <PhoneCall className="w-4 h-4 text-pink-400" />
                        <div>
                          <div className="text-gray-300">الهاتف</div>
                          <div className="text-white font-medium text-xs truncate">{service.phone}</div>
                        </div>
                      </div>
                      {service.website && (
                        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                          <Globe className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="text-gray-300">الموقع</div>
                            <div className="text-white font-medium text-xs truncate">{service.website}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                    
                    {/* معلومات الاتصال */}
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 text-gray-300">
                        <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400 flex-shrink-0" />
                        <span className="truncate">{service.phone}</span>
                      </div>
                      {service.website && (
                        <div className="flex items-center gap-1 sm:gap-2 text-gray-300">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                          <a href={`https://${service.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 truncate flex items-center gap-1">
                            {service.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setSelectedService(service)}
                        className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-2"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        عرض التفاصيل
                      </Button>
                      <Button
                        onClick={() => {
                          const phoneUrl = `tel:${service.phone}`;
                          window.open(phoneUrl, '_self');
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2"
                      >
                        <PhoneCall className="w-3 h-3 mr-1" />
                        اتصل الآن
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* نافذة تفاصيل الخدمة */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl bg-gray-900 border border-pink-600 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                    <span className="text-2xl">{selectedService.icon}</span>
                    {selectedService.name}
                  </CardTitle>
                  <Button
                    onClick={() => setSelectedService(null)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* معلومات أساسية */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-pink-300">المزود</h4>
                    <p className="text-sm text-gray-300">{selectedService.provider}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-pink-300">الفئة</h4>
                    <Badge className={`${getCategoryColor(selectedService.category)} text-white text-xs px-2 py-1`}>
                      {categories[selectedService.category as keyof typeof categories]}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-pink-300">السعر</h4>
                    <p className={`text-sm font-medium ${getPriceColor(selectedService.price)}`}>{selectedService.price}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-pink-300">التقييم</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(selectedService.rating)}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(selectedService.rating)}`}>
                        {selectedService.rating}/5 ({selectedService.reviews} مراجعة)
                      </span>
                    </div>
                  </div>
                </div>

                {/* الوصف */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-pink-300">الوصف</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedService.description}</p>
                </div>

                {/* المميزات */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-pink-300">المميزات</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* معلومات الاتصال */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-pink-300">معلومات الاتصال</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <PhoneCall className="w-4 h-4 text-pink-400" />
                      <span>{selectedService.phone}</span>
                    </div>
                    {selectedService.website && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <a href={`https://${selectedService.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          {selectedService.website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => {
                      const phoneUrl = `tel:${selectedService.phone}`;
                      window.open(phoneUrl, '_self');
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    اتصل الآن
                  </Button>
                  {selectedService.website && (
                    <Button
                      onClick={() => {
                        window.open(`https://${selectedService.website}`, '_blank');
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      زيارة الموقع
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
