import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencyService, type CurrencyRate } from '@/services/currencyService';
import { supabase } from '@/lib/supabase';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Calculator,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpDown,
  Bell,
  BarChart3,
  Star,
  Eye,
  EyeOff,
  Filter,
  Search,
  Settings,
  Info,
  Activity,
  Zap,
  Loader2
} from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

// أنواع العملات - تم نقلها إلى currencyService.ts

// بيانات العملات المحلية - أسعار السوق الموازي في عدن (يمكن استبدالها بـ API حقيقي)
const mockCurrencyRates: CurrencyRate[] = [
  {
    currency: 'USD',
    name: 'الدولار الأمريكي',
    buy: 1615.0,
    sell: 1630.0,
    change: 5.25,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'SAR',
    name: 'الريال السعودي',
    buy: 425.0,
    sell: 428.0,
    change: 2.40,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'AED',
    name: 'الدرهم الإماراتي',
    buy: 440.0,
    sell: 445.0,
    change: 1.80,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'EUR',
    name: 'اليورو الأوروبي',
    buy: 1750.0,
    sell: 1770.0,
    change: -8.50,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'GBP',
    name: 'الجنيه الإسترليني',
    buy: 2050.0,
    sell: 2070.0,
    change: 12.25,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'QAR',
    name: 'الريال القطري',
    buy: 445.0,
    sell: 450.0,
    change: 1.15,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'KWD',
    name: 'الدينار الكويتي',
    buy: 5300.0,
    sell: 5350.0,
    change: 18.50,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'BHD',
    name: 'الدينار البحريني',
    buy: 4300.0,
    sell: 4350.0,
    change: 12.80,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'OMR',
    name: 'الريال العماني',
    buy: 4200.0,
    sell: 4250.0,
    change: 8.90,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'JOD',
    name: 'الدينار الأردني',
    buy: 2280.0,
    sell: 2300.0,
    change: 4.75,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'EGP',
    name: 'الجنيه المصري',
    buy: 52.0,
    sell: 54.0,
    change: 0.60,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'TRY',
    name: 'الليرة التركية',
    buy: 55.0,
    sell: 57.0,
    change: -1.25,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'CNY',
    name: 'اليوان الصيني',
    buy: 225.0,
    sell: 230.0,
    change: 2.40,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'JPY',
    name: 'الين الياباني',
    buy: 10.80,
    sell: 11.20,
    change: 0.25,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'INR',
    name: 'الروبية الهندية',
    buy: 19.50,
    sell: 20.20,
    change: 0.38,
    lastUpdate: new Date().toISOString(),
    isActive: true
  },
  {
    currency: 'YER',
    name: 'الريال اليمني (عدن)',
    buy: 1.0,
    sell: 1.0,
    change: 0.0,
    lastUpdate: new Date().toISOString(),
    isActive: true
  }
];

export default function CurrencyRatesPage() {
  const [rates, setRates] = useState<CurrencyRate[]>(mockCurrencyRates);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [fromCurrency, setFromCurrency] = useState('YER');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('currency');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState({ hasApiKey: false, isConfigured: false, usingFreeApi: true });

  // أيقونات العملات
  const currencyIcons: Record<string, string> = {
    'USD': '💵',
    'SAR': '🇸🇦',
    'AED': '🇦🇪',
    'EUR': '💶',
    'GBP': '💷',
    'QAR': '🇶🇦',
    'KWD': '🇰🇼',
    'BHD': '🇧🇭',
    'OMR': '🇴🇲',
    'JOD': '🇯🇴',
    'EGP': '🇪🇬',
    'TRY': '🇹🇷',
    'CNY': '🇨🇳',
    'JPY': '🇯🇵',
    'INR': '🇮🇳',
    'YER': '🇾🇪'
  };

  // رموز الدول للأعلام
  const countryCodes: Record<string, string> = {
    'USD': 'US',
    'SAR': 'SA',
    'AED': 'AE',
    'EUR': 'EU',
    'GBP': 'GB',
    'QAR': 'QA',
    'KWD': 'KW',
    'BHD': 'BH',
    'OMR': 'OM',
    'JOD': 'JO',
    'EGP': 'EG',
    'TRY': 'TR',
    'CNY': 'CN',
    'JPY': 'JP',
    'INR': 'IN',
    'YER': 'YE'
  };

  // جلب البيانات من جدول Supabase currency_rates_daily
  const fetchCurrencyRatesFromSupabase = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('currency_rates_daily')
        .select('*')
        .order('fetched_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('خطأ في جلب بيانات العملة من Supabase:', error);
      }

      if (data && data.rates) {
        const base: string = data.base;
        const ratesObj: Record<string, number> = data.rates;

        const now = new Date(data.fetched_at || new Date().toISOString());

        // نعرض فقط العملات المهمة في التطبيق ونخفي الباقي
        const allowedCurrencies = ['USD', 'EUR', 'SAR', 'AED', 'YER', 'EGP', 'TRY', 'GBP', 'CNY', 'JPY'];

        const transformed: CurrencyRate[] = Object.entries(ratesObj)
          .filter(([currency]) => allowedCurrencies.includes(currency))
          .map(([currency, rateValue]) => {
            const numeric = typeof rateValue === 'number' ? rateValue : Number(rateValue);
            const name = currency; // يمكن تحسينها لاحقاً بأسماء عربية إن لزم

            // استخدام قيمة API كما هي (سعر لكل 1 من العملة مقابل العملة الأساسية)
            const buy = numeric;
            const sell = numeric;

            return {
              currency,
              name,
              buy,
              sell,
              change: 0,
              lastUpdate: now.toISOString(),
              isActive: true,
            } as CurrencyRate;
          });

        if (transformed.length > 0) {
          setRates(transformed);
          setLastUpdate(now);
          console.log('تم تحميل أسعار العملات من Supabase:', transformed.length);
          return;
        }
      }

      // في حال عدم وجود بيانات في الجدول، نستخدم البيانات المحلية
      console.log('لا توجد بيانات في currency_rates_daily، استخدام البيانات المحلية');
      setRates(mockCurrencyRates);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('خطأ غير متوقع في جلب أسعار العملات من Supabase:', error);
      setRates(mockCurrencyRates);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  // حساب التحويل باستخدام الخدمة الجديدة
  const calculateConversion = useCallback(async () => {
    console.log('بدء حساب التحويل:', { amount, fromCurrency, toCurrency, ratesCount: rates.length });
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setConvertedAmount(0);
      setError('');
      return;
    }

    if (rates.length === 0) {
      console.log('لا توجد بيانات عملات متاحة');
      setError('جاري تحميل بيانات العملات...');
      return;
    }

    // التحقق من وجود العملات المختارة
    const fromRate = rates.find(rate => rate.currency === fromCurrency);
    const toRate = rates.find(rate => rate.currency === toCurrency);
    
    if (!fromRate || !toRate) {
      setError('العملة المختارة غير متاحة');
      setConvertedAmount(0);
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      // محاكاة تأخير للحسابات المعقدة
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const result = currencyService.calculateConversion(
        Number(amount),
        fromCurrency,
        toCurrency,
        rates
      );
      
      console.log('نتيجة الحساب:', result);
      
      if (result === 0) {
        setError('لا يمكن حساب التحويل - تحقق من العملات المختارة');
      } else if (isNaN(result) || !isFinite(result)) {
        setError('نتيجة حساب غير صحيحة');
        setConvertedAmount(0);
      } else {
        setConvertedAmount(result);
        setError('');
      }
    } catch (error) {
      console.error('خطأ في حساب التحويل:', error);
      setError('خطأ في حساب التحويل - يرجى المحاولة مرة أخرى');
      setConvertedAmount(0);
    } finally {
      setIsCalculating(false);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency, rates]);

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchCurrencyRatesFromSupabase();
  }, [fetchCurrencyRatesFromSupabase]);

  // إضافة console.log للتأكد من أن البيانات تُحمل
  useEffect(() => {
    console.log('Currency rates loaded:', rates.length);
    console.log('First rate:', rates[0]);
    console.log('From currency:', fromCurrency);
    console.log('To currency:', toCurrency);
    console.log('Amount:', amount);
  }, [rates, fromCurrency, toCurrency, amount]);

  // إضافة debug info
  console.log('Rendering CurrencyRatesPage, rates count:', rates.length);

  // فلترة وترتيب العملات مع تحسينات الأداء
  const filteredRates = useMemo(() => {
    const filtered = rates.filter(rate => {
      const matchesSearch = rate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           rate.currency.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorites = !showFavorites || favorites.includes(rate.currency);
      return matchesSearch && matchesFavorites && rate.isActive;
    });

    // ترتيب العملات حسب الأولوية
    const priorityOrder = ['SAR', 'AED', 'USD', 'EUR', 'GBP', 'KWD', 'QAR', 'BHD', 'OMR', 'JOD', 'EGP', 'TRY', 'CNY', 'JPY', 'INR', 'YER'];
    
    return filtered.sort((a, b) => {
      // إذا كان الترتيب حسب معايير أخرى، استخدمها
      if (sortBy === 'change') {
        return Math.abs(b.change) - Math.abs(a.change);
      }
      if (sortBy === 'buy') {
        return b.buy - a.buy;
      }
      if (sortBy === 'sell') {
        return b.sell - a.sell;
      }
      
      // الترتيب الافتراضي حسب الأولوية
      const aIndex = priorityOrder.indexOf(a.currency);
      const bIndex = priorityOrder.indexOf(b.currency);
      
      // إذا كانت العملة في قائمة الأولوية، ترتب حسب الأولوية
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // إذا كانت العملة الأولى فقط في قائمة الأولوية
      if (aIndex !== -1) return -1;
      
      // إذا كانت العملة الثانية فقط في قائمة الأولوية
      if (bIndex !== -1) return 1;
      
      // إذا لم تكن أي منهما في قائمة الأولوية، ترتب أبجدياً
      return a.currency.localeCompare(b.currency);
    });
  }, [rates, searchQuery, showFavorites, favorites, sortBy]);

  // إضافة/إزالة من المفضلة
  const toggleFavorite = (currency: string) => {
    setFavorites(prev => 
      prev.includes(currency) 
        ? prev.filter(c => c !== currency)
        : [...prev, currency]
    );
  };

  // إحصائيات سريعة مع تحسينات الأداء
  const stats = useMemo(() => ({
    total: rates.length,
    active: rates.filter(r => r.isActive).length,
    favorites: favorites.length,
    up: rates.filter(r => r.change > 0).length,
    down: rates.filter(r => r.change < 0).length
  }), [rates, favorites]);

  const formatCurrency = (value: number) => {
    const cleanValue = parseFloat(value.toFixed(2));
    return cleanValue.toLocaleString('ar-YE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const formatTime = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      if (isNaN(date.getTime())) {
        return 'غير محدد';
      }
    return date.toLocaleTimeString('ar-YE', {
      hour: '2-digit',
      minute: '2-digit'
    });
    } catch (error) {
      return 'غير محدد';
    }
  };

  // إضافة loading state بسيط - إزالة هذا الشرط لأن البيانات تُحمل فوراً
  // if (rates.length === 0) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">جاري تحميل أسعار العملات...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-md sm:max-w-2xl lg:max-w-6xl">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">أسعار العملات في عدن</h1>
              <p className="text-blue-200 text-sm sm:text-base lg:text-lg">أسعار العملات المحدثة لحظة بلحظة</p>
            </div>
          </div>
          
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-xl border border-blue-400">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stats.total}</div>
              <div className="text-xs sm:text-sm text-blue-100">إجمالي العملات</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-xl border border-green-400">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stats.up}</div>
              <div className="text-xs sm:text-sm text-green-100">صاعد</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-xl border border-red-400">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stats.down}</div>
              <div className="text-xs sm:text-sm text-red-100">هابط</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-xl border border-purple-400 col-span-2 sm:col-span-1">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stats.active}</div>
              <div className="text-xs sm:text-sm text-purple-100">نشطة</div>
            </div>
          </div>
        </div>

        {/* شريط البحث والترتيب */}
        <Card className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-2 sm:gap-4">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="ابحث عن عملة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                />
              </div>
              
              {/* ترتيب */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectItem value="currency" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">اسم العملة</SelectItem>
                  <SelectItem value="change" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">التغيير</SelectItem>
                  <SelectItem value="buy" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">سعر الشراء</SelectItem>
                  <SelectItem value="sell" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">سعر البيع</SelectItem>
                </SelectContent>
              </Select>
              
            </div>
          </CardContent>
        </Card>

        {/* معلومات التحديث */}
        <div className="flex justify-start items-center mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>آخر تحديث: {formatTime(lastUpdate)}</span>
          </div>
        </div>

        {/* بطاقات أسعار العملات */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900" />
                </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                أسعار العملات الحالية ({filteredRates.length})
            </h2>
          </div>
          
          <div className="grid gap-3 sm:gap-4">
                    {filteredRates.map((rate) => (
              <Card key={rate.currency} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    {/* معلومات العملة */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <ReactCountryFlag 
                                countryCode={countryCodes[rate.currency] || 'US'} 
                                svg 
                                style={{
                            width: '20px',
                            height: '15px',
                            borderRadius: '3px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                          }}
                        />
                        <span className="text-base sm:text-lg">{currencyIcons[rate.currency]}</span>
                            </div>
                          <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{rate.currency}</div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px] sm:max-w-none">{rate.name}</div>
                            </div>
                          </div>
                    
                    {/* الحالة */}
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={rate.isActive ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {rate.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                          </div>
                  </div>
                  
                  {/* الأسعار */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                    <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">شراء</div>
                      <div className="font-mono text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300">
                        {formatCurrency(rate.buy)}
                      </div>
                      <div className="text-xs text-blue-500 dark:text-blue-400">ريال</div>
                    </div>
                    <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-800">
                      <div className="text-xs text-green-600 dark:text-green-400 mb-1">بيع</div>
                      <div className="font-mono text-sm sm:text-base font-bold text-green-700 dark:text-green-300">
                        {formatCurrency(rate.sell)}
                      </div>
                      <div className="text-xs text-green-500 dark:text-green-400">ريال</div>
                    </div>
                    <div className="text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">التغيير</div>
                      <div className={`flex items-center justify-center gap-1 ${
                        rate.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {rate.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span className="font-bold text-xs sm:text-sm">
                          {rate.change >= 0 ? '+' : ''}{formatCurrency(rate.change)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* معلومات إضافية */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    آخر تحديث: {formatTime(rate.lastUpdate)}
              </div>
            </CardContent>
          </Card>
            ))}
          </div>
        </div>
        
        <div className="grid gap-6 mb-8">

          {/* حاسبة التحويل المحسنة */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Calculator className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-base sm:text-lg">حاسبة التحويل الذكية</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">من</label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="YER" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <span>{currencyIcons['YER']}</span>
                            <span>الريال اليمني (YER)</span>
                          </div>
                        </SelectItem>
                        {rates.filter(rate => rate.currency !== 'YER').map((rate) => (
                          <SelectItem key={rate.currency} value={rate.currency} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <span>{currencyIcons[rate.currency]}</span>
                              <span>{rate.name} ({rate.currency})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">المبلغ</label>
                    <div className="relative">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="أدخل المبلغ"
                        className="pr-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        {currencyIcons[fromCurrency]}
                      </div>
                    </div>
                    {/* أزرار سريعة للمبالغ */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAmount('100')}
                        className="text-xs py-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        100
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAmount('1000')}
                        className="text-xs py-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        1K
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAmount('10000')}
                        className="text-xs py-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        10K
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setAmount('100000')}
                        className="text-xs py-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        100K
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">إلى</label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                        <SelectItem value="YER" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <span>{currencyIcons['YER']}</span>
                            <span>الريال اليمني (YER)</span>
                          </div>
                        </SelectItem>
                        {rates.filter(rate => rate.currency !== 'YER').map((rate) => (
                          <SelectItem key={rate.currency} value={rate.currency} className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <span>{currencyIcons[rate.currency]}</span>
                              <span>{rate.name} ({rate.currency})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">النتيجة</label>
                    <div className="p-6 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl border border-green-300 dark:border-green-700">
                      {isCalculating ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-6 h-6 animate-spin text-green-600 dark:text-green-400 mr-2" />
                          <span className="text-green-600 dark:text-green-400">جاري الحساب...</span>
                        </div>
                      ) : error ? (
                        <div className="text-red-600 dark:text-red-400 text-center">
                          <AlertCircle className="w-5 h-5 mx-auto mb-2" />
                          <div className="text-sm">{error}</div>
                        </div>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-green-800 dark:text-green-200 font-mono mb-2">
                            {formatCurrency(convertedAmount)} {toCurrency}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-300">
                            {amount && parseFloat(amount) > 0 && (
                              <>
                                1 {fromCurrency} = {formatCurrency(convertedAmount / parseFloat(amount))} {toCurrency}
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* زر تبديل العملات */}
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    const temp = fromCurrency;
                    setFromCurrency(toCurrency);
                    setToCurrency(temp);
                  }}
                  className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600 px-6 py-3 rounded-xl"
                >
                  <ArrowUpDown className="w-5 h-5" />
                  تبديل العملات
                </Button>
              </div>
            </CardContent>
          </Card>


          {/* معلومات إضافية */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg">
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-slate-900" />
                </div>
                معلومات مهمة
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-slate-900/30">
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-400" />
                  <span className="text-slate-200">الأسعار تعتمد على السوق الموازي في عدن (وليس صنعاء)</span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 mt-0.5 text-green-400" />
                  <span className="text-slate-200">للحصول على أفضل الأسعار، يرجى زيارة الصرافين مباشرة</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
