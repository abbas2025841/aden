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
  Bus, ArrowLeft, Construction, Clock, AlertTriangle, Search, Filter, 
  MapPin, Phone, Star, Users, Calendar, CheckCircle, ExternalLink, 
  Map, Navigation, Share2, MessageCircle, Eye, EyeOff, XCircle, 
  Timer, Mail, Car, Plus, School as SchoolIcon, Building2, Route, 
  Clock3, DollarSign, Shield, UserCheck, PhoneCall, MapPin as MapPinIcon,
  Globe, Award, BookOpen, Heart, Star as StarIcon, Info
} from 'lucide-react';

// بيانات خطوط النقل المدرسي
const transportRoutes = [
  {
    id: 1,
    name: "خط المدرسة الأهلية",
    school: "المدرسة الأهلية الحديثة",
    area: "كريتر",
    price: "150 ريال/شهر",
    capacity: 45,
    availableSeats: 12,
    rating: 4.5,
    reviews: 89,
    phone: "+967-2-123456",
    website: "www.ahliya-school.ye",
    features: ["تكييف", "كاميرات مراقبة", "مقاعد مريحة", "نظام GPS"],
    status: "متاح",
    schedule: "7:00 ص - 2:00 م",
    stops: ["كريتر", "التواهي", "الشيخ عثمان", "المعلا"],
    driver: "أحمد محمد السعيد",
    driverPhone: "+967-777123456",
    vehicle: "حافلة صغيرة - 45 مقعد",
    color: "blue"
  },
  {
    id: 2,
    name: "خط مدرسة عدن الدولية",
    school: "مدرسة عدن الدولية",
    area: "التواهي",
    price: "200 ريال/شهر",
    capacity: 50,
    availableSeats: 8,
    rating: 4.7,
    reviews: 124,
    phone: "+967-2-234567",
    website: "www.aden-international.ye",
    features: ["تكييف قوي", "واي فاي", "مقاعد مريحة", "نظام أمان"],
    status: "متاح",
    schedule: "6:30 ص - 1:30 م",
    stops: ["التواهي", "كريتر", "الشيخ عثمان", "المعلا", "المنصورة"],
    driver: "محمد عبدالله حسن",
    driverPhone: "+967-777234567",
    vehicle: "حافلة متوسطة - 50 مقعد",
    color: "green"
  },
  {
    id: 3,
    name: "خط المدرسة النموذجية",
    school: "المدرسة النموذجية",
    area: "الشيخ عثمان",
    price: "120 ريال/شهر",
    capacity: 35,
    availableSeats: 15,
    rating: 4.3,
    reviews: 67,
    phone: "+967-2-345678",
    website: "www.namuzaj-school.ye",
    features: ["تكييف", "مقاعد مريحة", "نظام GPS", "كاميرات"],
    status: "متاح",
    schedule: "7:15 ص - 2:15 م",
    stops: ["الشيخ عثمان", "كريتر", "التواهي", "المعلا"],
    driver: "علي أحمد محمد",
    driverPhone: "+967-777345678",
    vehicle: "حافلة صغيرة - 35 مقعد",
    color: "purple"
  },
  {
    id: 4,
    name: "خط مدرسة الأمل",
    school: "مدرسة الأمل",
    area: "المعلا",
    price: "180 ريال/شهر",
    capacity: 40,
    availableSeats: 5,
    rating: 4.6,
    reviews: 95,
    phone: "+967-2-456789",
    website: "www.amal-school.ye",
    features: ["تكييف", "واي فاي", "مقاعد مريحة", "نظام أمان", "GPS"],
    status: "متاح",
    schedule: "6:45 ص - 1:45 م",
    stops: ["المعلا", "كريتر", "التواهي", "الشيخ عثمان", "المنصورة"],
    driver: "فاطمة علي حسن",
    driverPhone: "+967-777456789",
    vehicle: "حافلة متوسطة - 40 مقعد",
    color: "orange"
  },
  {
    id: 5,
    name: "خط المدرسة الحديثة",
    school: "المدرسة الحديثة",
    area: "المنصورة",
    price: "160 ريال/شهر",
    capacity: 42,
    availableSeats: 18,
    rating: 4.4,
    reviews: 78,
    phone: "+967-2-567890",
    website: "www.haditha-school.ye",
    features: ["تكييف", "مقاعد مريحة", "نظام GPS", "كاميرات مراقبة"],
    status: "متاح",
    schedule: "7:30 ص - 2:30 م",
    stops: ["المنصورة", "المعلا", "كريتر", "التواهي", "الشيخ عثمان"],
    driver: "يوسف محمد علي",
    driverPhone: "+967-777567890",
    vehicle: "حافلة متوسطة - 42 مقعد",
    color: "red"
  },
  {
    id: 6,
    name: "خط مدرسة المستقبل",
    school: "مدرسة المستقبل",
    area: "كريتر",
    price: "140 ريال/شهر",
    capacity: 38,
    availableSeats: 22,
    rating: 4.2,
    reviews: 56,
    phone: "+967-2-678901",
    website: "www.mustaqbal-school.ye",
    features: ["تكييف", "مقاعد مريحة", "نظام GPS", "نظام أمان"],
    status: "متاح",
    schedule: "7:00 ص - 2:00 م",
    stops: ["كريتر", "التواهي", "الشيخ عثمان", "المعلا"],
    driver: "نور الدين أحمد",
    driverPhone: "+967-777678901",
    vehicle: "حافلة صغيرة - 38 مقعد",
    color: "indigo"
  }
];

export default function SchoolTransportPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedRoute, setSelectedRoute] = useState<any>(null);

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
            <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">النقل المدرسي</h1>
          </div>
          <p className="text-orange-300 text-xs sm:text-sm md:text-base">خدمات النقل الآمن والموثوق للطلاب في عدن</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-orange-900/80 to-orange-800/80 border-orange-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Bus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-orange-300 mb-1">6</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي الخطوط</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-300 mb-1">250</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي المقاعد</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-blue-300 mb-1">80</div>
            <div className="text-xs text-gray-300 font-medium">مقاعد متاحة</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-yellow-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-300 mb-1">4.5</div>
            <div className="text-xs text-gray-300 font-medium">متوسط التقييم</div>
          </Card>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-orange-800 bg-opacity-80 border border-orange-600 rounded-xl shadow-2xl">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-2 sm:space-y-3">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-2 top-2 w-3 h-3 sm:w-4 sm:h-4 text-orange-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن خط نقل أو مدرسة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-orange-700 border border-orange-600 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-8"
                />
              </div>

              {/* فلاتر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-orange-700 border border-orange-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="all">جميع المناطق</option>
                  <option value="كريتر">كريتر</option>
                  <option value="التواهي">التواهي</option>
                  <option value="الشيخ عثمان">الشيخ عثمان</option>
                  <option value="المعلا">المعلا</option>
                  <option value="المنصورة">المنصورة</option>
                </select>

                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-orange-700 border border-orange-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="all">جميع الأسعار</option>
                  <option value="low">منخفض (≤140 ريال)</option>
                  <option value="medium">متوسط (140-180 ريال)</option>
                  <option value="high">عالي (&gt;180 ريال)</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 bg-orange-700 border border-orange-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                >
                  <option value="rating">التقييم</option>
                  <option value="name">الاسم</option>
                  <option value="price">السعر</option>
                </select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setAreaFilter('all');
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
          <div className="bg-orange-800 bg-opacity-80 border border-orange-600 rounded-lg p-2 sm:p-3">
            <p className="text-orange-300 text-xs sm:text-sm">
              عرض 6 من أصل 6 خط نقل
            </p>
          </div>
        </div>

        {/* قائمة خطوط النقل */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">خطوط النقل المتاحة</h2>
            <Badge className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
              6
            </Badge>
          </div>

          {transportRoutes.map((route) => (
            <Card key={route.id} className="bg-orange-800 bg-opacity-80 border border-orange-600 rounded-lg shadow-lg hover:bg-orange-700 transition-all duration-300 group overflow-hidden">
              <CardContent className="p-2 sm:p-4">
                <div className="space-y-3">
                  {/* الصف الأول: أيقونة + عنوان + badges */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                      <Bus className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm group-hover:text-orange-300 transition-colors leading-tight">
                        {route.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-orange-600 text-white text-xs px-2 py-1">
                          {route.area}
                        </Badge>
                        <Badge variant="outline" className="text-orange-400 border-orange-500 text-xs px-2 py-1">
                          {route.school}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-400 border-yellow-500 text-xs px-2 py-1">
                          {route.price}
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
                        <div className="text-white font-medium">{route.rating}/5</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                      <div>
                        <div className="text-gray-300">المراجعات</div>
                        <div className="text-white font-medium">{route.reviews}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                      <Users className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="text-gray-300">المقاعد</div>
                        <div className="text-white font-medium">{route.availableSeats}/{route.capacity}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-gray-300">الجدول</div>
                        <div className="text-white font-medium text-xs truncate">{route.schedule}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* الوصف */}
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                    خط نقل مدرسي من {route.area} إلى {route.school} مع {route.availableSeats} مقعد متاح
                  </p>
                  
                  {/* أزرار الإجراءات */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setSelectedRoute(route)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs py-2"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      عرض التفاصيل
                    </Button>
                    <Button
                      onClick={() => {
                        const phoneUrl = `tel:${route.phone}`;
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
          ))}
        </div>
      </div>
      <AppFooter />
    </div>
  );
}
