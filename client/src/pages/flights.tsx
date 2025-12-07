import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { FlightUpdateService, FlightData, getUpdateInfo, getRealFlightData } from '@/services/flightService';
import { supabase } from '@/lib/supabase';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Filter,
  Star,
  ArrowRight,
  Phone,
  Globe,
  CreditCard,
  Shield,
  CheckCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import DetailsModal from '@/components/DetailsModal';

// استخدام FlightData من الخدمة
type Flight = FlightData;

// البيانات الآن تأتي من خدمة التحديث اليومي

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStops, setSelectedStops] = useState('all');
  const [sortBy, setSortBy] = useState('departure');
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [updateInfo, setUpdateInfo] = useState(getUpdateInfo());
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // تحويل كود المطار إلى اسم مدينة بالعربية مع الكود
  const getArabicCityLabel = (iata?: string | null, fallbackName?: string | null): string => {
    const code = (iata || '').toUpperCase();
    const map: Record<string, string> = {
      ADE: 'عدن',
      CAI: 'القاهرة',
      JED: 'جدة',
      RUH: 'الرياض',
      DXB: 'دبي',
      BAH: 'البحرين',
      DOH: 'الدوحة',
      AMM: 'عمّان',
      JIB: 'جيبوتي',
      MCT: 'مسقط',
      ADD: 'أديس أبابا',
      KWI: 'الكويت',
      BOM: 'مومباي',
    };

    const city = map[code] || fallbackName || '';
    if (!city && !code) return 'غير معروف';
    if (!code) return city;
    return `${city} (${code})`;
  };

  // تقدير أسعار تقريبية حسب الوجهة عندما لا يتوفر سعر حقيقي
  const getEstimatedPrice = (toIata?: string | null): number => {
    const code = (toIata || '').toUpperCase();
    switch (code) {
      case 'CAI':
        return 356; // عدن - القاهرة (ذهاب فقط، من 356$ تقريباً)
      case 'AMM':
        return 261; // عدن - عمّان (ذهاب فقط، من 261$ تقريباً)
      case 'DXB':
        return 360; // عدن - دبي (ذهاب فقط، من 360$ تقريباً)
      case 'RUH':
        return 373; // عدن - الرياض (ذهاب فقط، من 373$ تقريباً)
      case 'JED':
        return 335; // عدن - جدة (ذهاب فقط، 335$ تقريباً)
      case 'BOM':
        return 550; // عدن - مومباي (ذهاب فقط، 550$ تقريباً)
      case 'ADD':
        return 350; // عدن - أديس أبابا (تقدير تقريبي)
      case 'JIB':
        return 300; // عدن - جيبوتي (تقديري)
      case 'KWI':
        return 400; // عدن - الكويت (تقديري)
      case 'MCT':
        return 320; // عدن - مسقط (تقديري)
      default:
        return 0;
    }
  };

  // دالة مساعدة لحساب مدة الرحلة من وقت المغادرة ووقت الوصول
  const computeDuration = (departureIso?: string | null, arrivalIso?: string | null): string => {
    if (!departureIso || !arrivalIso) return 'غير محدد';
    try {
      const dep = new Date(departureIso).getTime();
      const arr = new Date(arrivalIso).getTime();
      if (isNaN(dep) || isNaN(arr)) return 'غير محدد';
      let diffMs = arr - dep;
      if (diffMs < 0) {
        // في حال عبور منتصف الليل نضيف 24 ساعة
        diffMs += 24 * 60 * 60 * 1000;
      }
      const totalMinutes = Math.round(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (hours <= 0 && minutes <= 0) return 'غير محدد';
      if (hours === 0) return `${minutes} دقيقة`;
      if (minutes === 0) return `${hours} ساعة`;
      return `${hours} ساعة ${minutes} دقيقة`;
    } catch {
      return 'غير محدد';
    }
  };

  // تحميل البيانات من Supabase (flights_aden) مع استخدام البيانات المحلية كنسخة احتياطية
  useEffect(() => {
    const loadFromSupabase = async () => {
      setIsUpdating(true);
      try {
        const { data, error } = await supabase
          .from('flights_aden')
          .select('*')
          .order('departure_time', { ascending: true });

        if (error) {
          console.error('خطأ في جلب بيانات الرحلات من Supabase:', error);
        }

        if (data && data.length > 0) {
          const mapped: Flight[] = data.map((row: any): Flight => {
            const fromLabel = row.direction === 'from_aden'
              ? getArabicCityLabel('ADE', 'عدن')
              : getArabicCityLabel(row.from_iata, row.from_city);
            const toLabel = row.direction === 'from_aden'
              ? getArabicCityLabel(row.to_iata, row.to_city)
              : getArabicCityLabel('ADE', 'عدن');

            const departureTime = row.departure_time
              ? new Date(row.departure_time).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })
              : '';
            const arrivalTime = row.arrival_time
              ? new Date(row.arrival_time).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })
              : '';

            const duration = computeDuration(row.departure_time, row.arrival_time);

            const usingSuppliedPrice = row.price && row.price > 0;
            const estimatedPrice = getEstimatedPrice(row.direction === 'from_aden' ? row.to_iata : row.from_iata);
            const price = usingSuppliedPrice ? row.price : estimatedPrice;
            const currency = usingSuppliedPrice
              ? (row.currency || 'ريال يمني')
              : (price > 0 ? 'دولار أمريكي' : 'السعر غير متوفر');

            return {
              id: `${row.flight_number || ''}-${row.direction || ''}`,
              airline: row.airline || 'غير معروف',
              flightNumber: row.flight_number || 'N/A',
              from: fromLabel,
              to: toLabel,
              departure: departureTime,
              arrival: arrivalTime,
              duration,
              price,
              currency,
              stops: row.stops ?? 0,
              class: row.class || 'اقتصادي',
              available: row.available ?? true,
              rating: row.rating ?? 4.5,
              logo: '✈️',
              features: Array.isArray(row.features) ? row.features : [],
              lastUpdated: row.last_updated || new Date().toISOString(),
              source: 'aviationstack',
            };
          });

          setFlights(mapped);
          setLastUpdate(new Date().toLocaleString('ar-YE'));
          return;
        }

        // في حال عدم وجود بيانات في Supabase نستخدم البيانات المحلية الحالية كنسخة احتياطية
        console.log('لا توجد بيانات في flights_aden، استخدام البيانات المحلية للرحلات');
        const fallbackFlights = getRealFlightData();
        setFlights(fallbackFlights);
        setLastUpdate(new Date().toLocaleString('ar-YE'));
      } catch (error) {
        console.error('خطأ غير متوقع في تحميل بيانات الرحلات من Supabase:', error);
        const fallbackFlights = getRealFlightData();
        setFlights(fallbackFlights);
        setLastUpdate(new Date().toLocaleString('ar-YE'));
      } finally {
        setIsUpdating(false);
      }
    };

    loadFromSupabase();
  }, []);

  // تحديث يدوي - إعادة التحميل من Supabase أو البيانات المحلية
  const handleManualUpdate = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase
        .from('flights_aden')
        .select('*')
        .order('departure_time', { ascending: true });

      if (error) {
        console.error('خطأ في جلب بيانات الرحلات من Supabase (تحديث يدوي):', error);
      }

      if (data && data.length > 0) {
        const mapped: Flight[] = data.map((row: any): Flight => {
          const fromLabel = row.direction === 'from_aden'
            ? getArabicCityLabel('ADE', 'عدن')
            : getArabicCityLabel(row.from_iata, row.from_city);
          const toLabel = row.direction === 'from_aden'
            ? getArabicCityLabel(row.to_iata, row.to_city)
            : getArabicCityLabel('ADE', 'عدن');

          const departureTime = row.departure_time
            ? new Date(row.departure_time).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })
            : '';
          const arrivalTime = row.arrival_time
            ? new Date(row.arrival_time).toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })
            : '';

          const duration = computeDuration(row.departure_time, row.arrival_time);

          const usingSuppliedPrice = row.price && row.price > 0;
          const estimatedPrice = getEstimatedPrice(row.direction === 'from_aden' ? row.to_iata : row.from_iata);
          const price = usingSuppliedPrice ? row.price : estimatedPrice;
          const currency = usingSuppliedPrice
            ? (row.currency || 'ريال يمني')
            : (price > 0 ? 'دولار أمريكي' : 'السعر غير متوفر');

          return {
            id: `${row.flight_number || ''}-${row.direction || ''}`,
            airline: row.airline || 'غير معروف',
            flightNumber: row.flight_number || 'N/A',
            from: fromLabel,
            to: toLabel,
            departure: departureTime,
            arrival: arrivalTime,
            duration,
            price,
            currency,
            stops: row.stops ?? 0,
            class: row.class || 'اقتصادي',
            available: row.available ?? true,
            rating: row.rating ?? 4.5,
            logo: '✈️',
            features: Array.isArray(row.features) ? row.features : [],
            lastUpdated: row.last_updated || new Date().toISOString(),
            source: 'aviationstack',
          };
        });

        setFlights(mapped);
        setLastUpdate(new Date().toLocaleString('ar-YE'));
        return;
      }

      // في حال عدم وجود بيانات نعود للبيانات المحلية
      const fallbackFlights = getRealFlightData();
      setFlights(fallbackFlights);
      setLastUpdate(new Date().toLocaleString('ar-YE'));
    } catch (error) {
      console.error('خطأ غير متوقع في التحديث اليدوي:', error);
      const fallbackFlights = getRealFlightData();
      setFlights(fallbackFlights);
      setLastUpdate(new Date().toLocaleString('ar-YE'));
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    let filtered = flights;

    // البحث
    if (searchTerm) {
      filtered = filtered.filter(flight =>
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.to.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // تصفية حسب الفئة
    if (selectedClass !== 'all') {
      filtered = filtered.filter(flight => flight.class === selectedClass);
    }

    // تصفية حسب التوقفات
    if (selectedStops !== 'all') {
      const stops = selectedStops === 'direct' ? 0 : parseInt(selectedStops);
      filtered = filtered.filter(flight => flight.stops === stops);
    }

    // الترتيب
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'rating':
          return b.rating - a.rating;
        case 'departure':
          return a.departure.localeCompare(b.departure);
        default:
          return 0;
      }
    });

    setFilteredFlights(filtered);
  }, [flights, searchTerm, selectedClass, selectedStops, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-YE').format(price);
  };

  // دالة لفتح نافذة التفاصيل
  const handleShowDetails = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsDetailsModalOpen(true);
  };

  // دالة لتوليد الاقتراحات
  const generateSuggestions = (term: string) => {
    if (!term || term.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = new Set<string>();
    
    flights.forEach(flight => {
      // اقتراحات شركات الطيران
      if (flight.airline.toLowerCase().includes(term.toLowerCase())) {
        suggestions.add(flight.airline);
      }
      
      // اقتراحات المدن
      if (flight.from.toLowerCase().includes(term.toLowerCase())) {
        suggestions.add(flight.from);
      }
      if (flight.to.toLowerCase().includes(term.toLowerCase())) {
        suggestions.add(flight.to);
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 5));
    setShowSuggestions(true);
  };

  // دالة لاختيار اقتراح
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600 dark:text-green-300';
    if (rating >= 4.0) return 'text-yellow-600 dark:text-yellow-300';
    return 'text-orange-600 dark:text-orange-300';
  };

  const getClassColor = (flightClass: string) => {
    switch (flightClass) {
      case 'اقتصادي':
        return 'bg-blue-100 text-blue-800';
      case 'رئيسي':
        return 'bg-purple-100 text-purple-800';
      case 'أول':
        return 'bg-gold-100 text-gold-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .flight-card-animated {
          animation: gentleFloat 5s ease-in-out infinite;
        }
      `}</style>
      <div>
        <AppHeader />
      
      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-md sm:max-w-2xl lg:max-w-6xl">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4 gap-2 sm:gap-4">
            <Plane className="w-8 h-8 sm:w-12 sm:h-12 text-blue-700" />
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-gray-800 dark:text-white">جدول الرحلات الدولية</h1>
          </div>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6">
            مطار عدن الدولي - أوقات الرحلات الدولية المباشرة
          </p>
          
          {/* أزرار التنقل */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              className="bg-white dark:bg-gray-700 border-purple-300 dark:border-gray-600 text-black dark:text-white hover:bg-purple-50 dark:hover:bg-gray-600 text-sm sm:text-base"
            >
              <Plane className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              جدول الرحلات
            </Button>
            <Button 
              variant="outline" 
              className="bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-600 text-black dark:text-white hover:bg-orange-100 dark:hover:bg-orange-900/30 text-sm sm:text-base"
            >
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
              الحجز (قيد التطوير)
            </Button>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-200 to-blue-300 border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all">
            <div className="text-lg sm:text-2xl font-bold text-black">{flights.length}</div>
            <div className="text-xs sm:text-sm text-black font-medium">رحلات أسبوعية</div>
          </Card>
          <Card className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-200 to-green-300 border-2 border-green-500 shadow-lg hover:shadow-xl transition-all">
            <div className="text-lg sm:text-2xl font-bold text-black">{flights.filter(f => f.available).length}</div>
            <div className="text-xs sm:text-sm text-black font-medium">رحلات نشطة</div>
          </Card>
          <Card className="text-center p-3 sm:p-4 bg-gradient-to-br from-purple-200 to-purple-300 border-2 border-purple-500 shadow-lg hover:shadow-xl transition-all">
            <div className="text-lg sm:text-2xl font-bold text-black">6</div>
            <div className="text-xs sm:text-sm text-black font-medium">شركات طيران</div>
          </Card>
          <Card className="text-center p-3 sm:p-4 bg-gradient-to-br from-orange-200 to-orange-300 border-2 border-orange-500 shadow-lg hover:shadow-xl transition-all">
            <div className="text-lg sm:text-2xl font-bold text-black">6</div>
            <div className="text-xs sm:text-sm text-black font-medium">وجهات دولية</div>
          </Card>
        </div>

        {/* شريط البحث والتصفية */}
        <Card className="mb-8 p-6 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5" />
                <Input
                  placeholder="ابحث عن شركة طيران أو وجهة..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    generateSuggestions(e.target.value);
                  }}
                  onFocus={() => {
                    if (searchSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // تأخير إخفاء الاقتراحات للسماح بالنقر عليها
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                
                {/* قائمة الاقتراحات */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-2 text-right text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-none">
                <SelectValue placeholder="فئة الرحلة" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 animate-none transition-none">
                <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">جميع الفئات</SelectItem>
                <SelectItem value="اقتصادي" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">اقتصادي</SelectItem>
                <SelectItem value="رئيسي" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">رئيسي</SelectItem>
                <SelectItem value="أول" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">أول</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStops} onValueChange={setSelectedStops}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-none">
                <SelectValue placeholder="نوع الرحلة" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 animate-none transition-none">
                <SelectItem value="all" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">جميع الرحلات</SelectItem>
                <SelectItem value="direct" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">مباشر</SelectItem>
                <SelectItem value="1" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">توقف واحد</SelectItem>
                <SelectItem value="2" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">توقفين</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white transition-none">
                <SelectValue placeholder="ترتيب حسب" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 animate-none transition-none">
                <SelectItem value="departure" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">وقت المغادرة</SelectItem>
                <SelectItem value="duration" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">المدة</SelectItem>
                <SelectItem value="rating" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">التقييم</SelectItem>
                <SelectItem value="price" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 transition-none">السعر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* قائمة الرحلات */}
        <div className="space-y-6">
          {isUpdating && flights.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-lg">
              <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-black mb-2">جاري تحميل بيانات الرحلات...</h3>
              <p className="text-black">يتم جلب أحدث المعلومات من الموقع الرسمي</p>
            </Card>
          ) : filteredFlights.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-lg">
              <Plane className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">لا توجد رحلات متاحة</h3>
              <p className="text-black">جرب تغيير معايير البحث</p>
            </Card>
          ) : (
            filteredFlights.map((flight) => (
              <Card
                key={flight.id}
                className={`flight-card-animated transition-all hover:shadow-xl shadow-md border border-sky-300 rounded-xl bg-sky-700 ${
                  flight.source === 'yemenia' ? 'border-l-4 border-l-sky-500' : 'border-l-4 border-l-sky-400'
                } ${!flight.available ? 'opacity-60' : ''}`}
              >
                <div className="bg-sky-100 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start gap-3 mb-3">
                  {/* لوجو شركة الطيران */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-sky-200 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                    {flight.logo}
                  </div>
                  
                  {/* البيانات الأساسية */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-black text-base sm:text-lg truncate">
                        {flight.airline}
                      </h3>
                      <Badge variant="outline" className="text-xs bg-white/80 text-black border-gray-400">
                        {flight.flightNumber}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className={`w-3 h-3 ${getRatingColor(flight.rating)}`} />
                        <span className={`text-xs font-medium ${getRatingColor(flight.rating)}`}>
                          {flight.rating}
                        </span>
                      </div>
                    </div>
                    
                    {/* معلومات الرحلة المختصرة */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs sm:text-sm">
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{flight.from}</div>
                        <div className="text-slate-700 font-medium">{flight.departure}</div>
                      </div>
                      
                      <div className="text-center flex flex-col items-center">
                        <Plane className="w-4 h-4 text-slate-500 mb-1" />
                        <div className="text-slate-700 text-xs">{flight.duration}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="font-bold text-gray-900">{flight.to}</div>
                        <div className="text-slate-700 font-medium">{flight.arrival}</div>
                      </div>
                    </div>

                    {/* السعر والفئة */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          {formatPrice(flight.price)}
                        </span>
                        <span className="text-xs text-gray-700">{flight.currency}</span>
                      </div>
                      <Badge className={`${getClassColor(flight.class)} text-xs`}>
                        {flight.class}
                      </Badge>
                    </div>
                  </div>
                  </div>

                  {/* الأزرار */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-black bg-black text-white hover:bg-neutral-900 text-xs sm:text-sm"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      اتصل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-black bg-black text-white hover:bg-neutral-900 text-xs sm:text-sm"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      الموقع
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowDetails(flight)}
                      className="flex-1 border-black bg-black text-white hover:bg-neutral-900 text-xs sm:text-sm"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* قسم الحجز - قيد التطوير */}
        <Card className="mt-8 p-8 bg-gradient-to-br from-orange-200 to-amber-200 border-2 border-orange-500 shadow-lg hover:shadow-xl transition-all">
          <div className="text-center">
            <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-orange-800 mb-4">خدمة الحجز الإلكتروني</h2>
            <p className="text-lg text-orange-700 mb-6 max-w-2xl mx-auto">
              قريباً ستتمكن من حجز رحلاتك مباشرة من خلال التطبيق مع أفضل الأسعار والخدمات
            </p>
            
            {/* الميزات القادمة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="font-bold text-orange-900 mb-2">دفع آمن</h3>
                <p className="text-sm text-orange-700">طرق دفع متعددة وآمنة</p>
              </div>
              <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-bold text-orange-900 mb-2">تطبيق موبايل</h3>
                <p className="text-sm text-orange-700">حجز سهل من هاتفك</p>
              </div>
              <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-sm">
                <div className="text-3xl mb-3">🎫</div>
                <h3 className="font-bold text-orange-900 mb-2">تذاكر إلكترونية</h3>
                <p className="text-sm text-orange-700">تذاكر رقمية فورية</p>
              </div>
            </div>
            
            {/* شريط التقدم */}
            <div className="bg-white bg-opacity-80 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-orange-900 font-semibold">تقدم التطوير</span>
                <span className="text-orange-700 text-sm">75%</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-3 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-orange-700 text-sm mt-3">
                متوقع الإطلاق: الربع الثاني من 2025
              </p>
            </div>
            
            {/* زر الاشتراك في التنبيهات */}
            <div className="mt-8">
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                disabled
              >
                <Clock className="w-4 h-4 ml-2" />
                اشترك في التنبيهات (قريباً)
              </Button>
            </div>
          </div>
        </Card>

        {/* معلومات مطار عدن */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-purple-200 to-indigo-200 border-2 border-purple-500 shadow-lg hover:shadow-xl transition-all">
          <h3 className="text-xl font-bold text-gray-900 mb-4">مطار عدن الدولي</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">الموقع</h4>
                <p className="text-sm text-gray-600">عدن، اليمن - المطار الرئيسي للمدينة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">ساعات العمل</h4>
                <p className="text-sm text-gray-600">24/7 - يعمل على مدار الساعة</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Plane className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">الرحلات الدولية</h4>
                <p className="text-sm text-gray-600">رحلات مباشرة إلى 6 وجهات دولية</p>
              </div>
            </div>
          </div>
        </Card>

        {/* تنبيه مهم */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-yellow-200 to-orange-200 border-2 border-orange-500 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 p-2 rounded-full">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">تنبيه مهم</h4>
              <p className="text-sm text-orange-700 mb-3">
                أوقات الرحلات قابلة للتغيير. يرجى التأكد من أوقات الرحلات المحدثة قبل السفر. 
                للحجز والاستفسارات، يرجى الاتصال بشركات الطيران مباشرة.
              </p>
              <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                <p className="text-xs text-orange-800">
                  <strong>مصدر البيانات:</strong> يتم تحديث المعلومات يومياً من الموقع الرسمي للخطوط الجوية اليمنية (yemenia.com) 
                  ومواقع شركات الطيران الأخرى. آخر تحديث: {lastUpdate || 'جاري التحميل...'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
      
      <AppFooter />

      {/* نافذة التفاصيل */}
      {selectedFlight && (
        <DetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          title={`${selectedFlight.airline} - ${selectedFlight.flightNumber}`}
          subtitle={`${selectedFlight.from} ← ${selectedFlight.to}`}
          image={selectedFlight.logo}
          sections={[
            {
              title: 'معلومات الرحلة',
              icon: <Plane className="w-5 h-5 text-blue-400" />,
              items: [
                { label: 'شركة الطيران', value: selectedFlight.airline, icon: <Plane className="w-4 h-4 text-blue-400" /> },
                { label: 'رقم الرحلة', value: selectedFlight.flightNumber, icon: <Calendar className="w-4 h-4 text-green-400" /> },
                { label: 'المغادرة', value: `${selectedFlight.from} - ${selectedFlight.departure}`, icon: <Clock className="w-4 h-4 text-orange-400" /> },
                { label: 'الوصول', value: `${selectedFlight.to} - ${selectedFlight.arrival}`, icon: <MapPin className="w-4 h-4 text-purple-400" /> },
                { label: 'مدة الرحلة', value: selectedFlight.duration, icon: <Clock className="w-4 h-4 text-gray-400" /> },
                { label: 'التقييم', value: selectedFlight.rating, type: 'rating' },
              ]
            },
            {
              title: 'معلومات التذكرة',
              icon: <CreditCard className="w-5 h-5 text-green-400" />,
              items: [
                { label: 'السعر', value: `${formatPrice(selectedFlight.price)} ${selectedFlight.currency}`, icon: <CreditCard className="w-4 h-4 text-green-400" /> },
                { label: 'فئة السفر', value: selectedFlight.class, type: 'badge', color: getClassColor(selectedFlight.class) },
                { label: 'التوفر', value: selectedFlight.available ? 'متاح' : 'غير متاح', type: 'badge', color: selectedFlight.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white' },
                { label: 'عدد التوقفات', value: selectedFlight.stops === 0 ? 'مباشر' : `${selectedFlight.stops} توقف` },
              ]
            },
            {
              title: 'الميزات والخدمات',
              icon: <Star className="w-5 h-5 text-yellow-400" />,
              items: [
                { label: 'الميزات المتاحة', value: selectedFlight.features.join('، ') },
                { label: 'مصدر البيانات', value: selectedFlight.source === 'yemenia' ? 'الموقع الرسمي' : 'محدث من المصدر' },
                { label: 'آخر تحديث', value: new Date(selectedFlight.lastUpdated).toLocaleString('ar-YE') },
              ]
            }
          ]}
          actions={[
            {
              label: 'اتصل بالشركة',
              onClick: () => console.log('اتصل بالشركة'),
              icon: <Phone className="w-4 h-4" />,
              variant: 'default' as const
            },
            {
              label: 'الموقع الرسمي',
              onClick: () => console.log('الموقع الرسمي'),
              icon: <Globe className="w-4 h-4" />,
              variant: 'outline' as const
            }
          ]}
        />
      )}
      </div>
    </div>
  );
}
