import { useState, useEffect, useMemo } from "react";
import AppHeader from "@/components/AppHeader";
import { ArrowLeft, Star, Phone, TrendingUp, Zap, Sun, Car, Search, Filter, Battery, Wifi, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PowerConverterRecord {
  id: string | number;
  name: string;
  description: string;
  price: string;
  originalPrice: string | null;
  rating: number;
  reviews: number;
  seller: string;
  phone: string;
  icon: string;
  features: string[];
  category: string;
  power: string;
  warranty: string;
  location: string;
  coordinates?: [number, number];
}

export default function PowerConverters() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [converters, setConverters] = useState<PowerConverterRecord[]>([]);
  const [newConverter, setNewConverter] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    seller: '',
    features: [] as string[],
    power: '',
    warranty: ''
  });

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsCategoryOpen(false);
        setIsPriceOpen(false);
        setIsRatingOpen(false);
        setIsDistrictOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // بيانات تجريبية افتراضية تستخدم فقط إذا لم توجد بيانات في Supabase
  const samplePowerConverters: PowerConverterRecord[] = [
    {
      id: 1,
      name: "محول 12V إلى 220V - 300W",
      description: "محول للسيارة بقدرة 300 واط مع حماية حرارية",
      price: "350000",
      originalPrice: "400000",
      rating: 4.6,
      reviews: 67,
      seller: "متجر الطاقة",
      phone: "+967-1-234-567",
      icon: "🔌",
      features: ["300 واط", "حماية حرارية", "مؤشر LED", "USB منافذ"],
      category: "car",
      power: "300W",
      warranty: "سنة واحدة",
      location: "عدن كريتر",
      coordinates: [12.7854, 45.0187],
    },
    {
      id: 2,
      name: "انفرتر طاقة شمسية 600W",
      description: "انفرتر 600 واط بعاكس موجة نقية للاستخدام المنزلي",
      price: "850000",
      originalPrice: "950000",
      rating: 4.8,
      reviews: 89,
      seller: "الشمسية الحديثة",
      phone: "+967-1-234-568",
      icon: "☀️",
      features: ["600 واط", "موجة نقية", "شحن سريع", "تحكم رقمي"],
      category: "solar",
      power: "600W",
      warranty: "سنتان",
      location: "المعلا",
      coordinates: [12.7890, 45.0123],
    },
    {
      id: 3,
      name: "محول سيارة 400W صامت",
      description: "انفرتر 400 واط مع حماية حرارية وصوت منخفض",
      price: "450000",
      originalPrice: "500000",
      rating: 4.4,
      reviews: 45,
      seller: "سوق الإلكترونيات",
      phone: "+967-1-234-569",
      icon: "🚗",
      features: ["400 واط", "حماية حرارية", "صامت", "مؤشر LED"],
      category: "car",
      power: "400W",
      warranty: "سنة واحدة",
      location: "الشيخ عثمان",
      coordinates: [12.7654, 45.0321],
    },
    {
      id: 4,
      name: "انفرتر شمسي 1000W متقدم",
      description: "انفرتر 1000 واط للاستخدام المنزلي مع تحكم رقمي",
      price: "1200000",
      originalPrice: "1400000",
      rating: 4.9,
      reviews: 124,
      seller: "الطاقة البديلة",
      phone: "+967-1-234-570",
      icon: "⚡",
      features: ["1000 واط", "موجة نقية", "تحكم رقمي", "شاشة LCD"],
      category: "solar",
      power: "1000W",
      warranty: "3 سنوات",
      location: "المنصورة",
      coordinates: [12.8123, 44.9876],
    },
    {
      id: 5,
      name: "محول 24V إلى 220V - 500W",
      description: "محول للشاحنات والحافلات بقدرة 500 واط",
      price: "550000",
      originalPrice: "650000",
      rating: 4.7,
      reviews: 78,
      seller: "محلات النقل",
      phone: "+967-1-234-571",
      icon: "🚛",
      features: ["500 واط", "حماية حرارية", "مؤشر LED", "مقاوم للماء"],
      category: "truck",
      power: "500W",
      warranty: "سنتان",
      location: "خور مكسر",
      coordinates: [12.7500, 44.9500],
    },
    {
      id: 6,
      name: "انفرتر شمسي 1500W احترافي",
      description: "انفرتر 1500 واط للاستخدام التجاري مع موجة نقية",
      price: "1800000",
      originalPrice: "2000000",
      rating: 4.9,
      reviews: 156,
      seller: "الطاقة المتقدمة",
      phone: "+967-1-234-572",
      icon: "🏭",
      features: ["1500 واط", "موجة نقية", "تحكم رقمي", "شاشة LCD", "WiFi"],
      category: "solar",
      power: "1500W",
      warranty: "5 سنوات",
      location: "البريقة",
      coordinates: [12.7200, 44.9200],
    },
    {
      id: 7,
      name: "محول 12V محمول 200W",
      description: "محول محمول للاستخدام الشخصي بقدرة 200 واط",
      price: "280000",
      originalPrice: "350000",
      rating: 4.3,
      reviews: 92,
      seller: "الإلكترونيات المحمولة",
      phone: "+967-1-234-573",
      icon: "📱",
      features: ["200 واط", "محمول", "USB منافذ", "مؤشر LED"],
      category: "portable",
      power: "200W",
      warranty: "سنة واحدة",
      location: "دار سعد",
      coordinates: [12.6800, 44.8800],
    },
    {
      id: 8,
      name: "انفرتر شمسي 2000W تجاري",
      description: "انفرتر 2000 واط للاستخدام التجاري والصناعي",
      price: "2500000",
      originalPrice: "2800000",
      rating: 4.8,
      reviews: 203,
      seller: "الطاقة الصناعية",
      phone: "+967-1-234-574",
      icon: "🏢",
      features: ["2000 واط", "موجة نقية", "تحكم رقمي", "شاشة LCD", "WiFi", "حماية متقدمة"],
      category: "solar",
      power: "2000W",
      warranty: "5 سنوات",
      location: "التواهي",
      coordinates: [12.6500, 44.8500],
    },
    {
      id: 9,
      name: "محول 12V للقوارب 300W",
      description: "محول مقاوم للماء للقوارب واليخوت بقدرة 300 واط",
      price: "420000",
      originalPrice: "500000",
      rating: 4.5,
      reviews: 67,
      seller: "معدات البحرية",
      phone: "+967-1-234-575",
      icon: "⛵",
      features: ["300 واط", "مقاوم للماء", "حماية حرارية", "مؤشر LED"],
      category: "marine",
      power: "300W",
      warranty: "سنتان",
      location: "الميناء",
      coordinates: [12.6200, 44.8200],
    },
    {
      id: 10,
      name: "انفرتر شمسي 3000W صناعي",
      description: "انفرتر 3000 واط للاستخدام الصناعي مع تحكم متقدم",
      price: "3500000",
      originalPrice: "4000000",
      rating: 4.9,
      reviews: 145,
      seller: "الطاقة الصناعية",
      phone: "+967-1-234-576",
      icon: "🏭",
      features: ["3000 واط", "موجة نقية", "تحكم رقمي", "شاشة LCD", "WiFi", "حماية متقدمة", "مراقبة عن بُعد"],
      category: "solar",
      power: "3000W",
      warranty: "5 سنوات",
      location: "المنطقة الصناعية",
      coordinates: [12.5800, 44.7800],
    },
  ];

  // تحميل محولات الطاقة من Supabase (فقط الموافق عليها)
  useEffect(() => {
    const loadConverters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('power_converters')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: PowerConverterRecord[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: row.price,
            originalPrice: row.original_price || null,
            rating: 5.0,
            reviews: 0,
            seller: row.seller || 'بائع جديد',
            phone: row.phone || '+967-1-234-000',
            icon: '🔌',
            features: row.features || ['جديد'],
            category: row.category,
            power: row.power || 'غير محدد',
            warranty: row.warranty || 'سنة واحدة',
            location: row.location || 'عدن',
            coordinates: undefined,
          }));

          setConverters(mapped);
        } else {
          // لا توجد بيانات حقيقية بعد → استخدم البيانات التجريبية
          setConverters(samplePowerConverters);
        }
      } catch (err: any) {
        console.error('Error loading power converters:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل محولات الطاقة');
        // في حالة الخطأ نستمر في استخدام البيانات التجريبية
        setConverters(samplePowerConverters);
      } finally {
        setIsLoading(false);
      }
    };

    loadConverters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // خيارات الفلترة
  const categoryOptions = [
    { id: 'all', name: 'جميع الأنواع', count: 10, icon: '🔌' },
    { id: 'car', name: 'محولات السيارات', count: 2, icon: '🚗' },
    { id: 'solar', name: 'محولات الطاقة الشمسية', count: 5, icon: '☀️' },
    { id: 'truck', name: 'محولات الشاحنات', count: 1, icon: '🚛' },
    { id: 'portable', name: 'محولات محمولة', count: 1, icon: '📱' },
    { id: 'marine', name: 'محولات بحرية', count: 1, icon: '⛵' }
  ];

  const priceRangeOptions = [
    { id: 'all', name: 'جميع الأسعار', count: 10, icon: '💰' },
    { id: 'low', name: 'أقل من 500,000 ريال', count: 3, icon: '💵' },
    { id: 'medium', name: '500,000 - 1,500,000 ريال', count: 4, icon: '💴' },
    { id: 'high', name: 'أكثر من 1,500,000 ريال', count: 3, icon: '💎' }
  ];

  const ratingOptions = [
    { id: 'all', name: 'جميع التقييمات', count: 10, icon: '⭐' },
    { id: '5', name: '5 نجوم', count: 3, icon: '⭐⭐⭐⭐⭐' },
    { id: '4', name: '4 نجوم وأكثر', count: 6, icon: '⭐⭐⭐⭐' },
    { id: '3', name: '3 نجوم وأكثر', count: 1, icon: '⭐⭐⭐' }
  ];

  // خيارات المديريات (مشابهة لصفحة نقاط الشحن)
  const districtOptions = [
    { id: 'all', name: 'جميع المناطق', count: 10, icon: '📍' },
    { id: 'عدن كريتر', name: 'عدن كريتر', count: 1, icon: '🏛️' },
    { id: 'المعلا', name: 'المعلا', count: 1, icon: '🏢' },
    { id: 'التواهي', name: 'التواهي', count: 1, icon: '⚓' },
    { id: 'خور مكسر', name: 'خور مكسر', count: 1, icon: '🌊' },
    { id: 'المنصورة', name: 'المنصورة', count: 1, icon: '🏪' },
    { id: 'الشيخ عثمان', name: 'الشيخ عثمان', count: 1, icon: '🕌' },
    { id: 'البريقة', name: 'البريقة', count: 1, icon: '🏭' },
    { id: 'دار سعد', name: 'دار سعد', count: 1, icon: '🏘️' },
    { id: 'القلوعه', name: 'القلوعة', count: 1, icon: '🏙️' },
    { id: 'الممدارة', name: 'الممدارة', count: 1, icon: '🏙️' },
  ];

  // عدد المحولات الفعلي في كل مديرية
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = converters.length;

    converters.forEach(converter => {
      const loc = converter.location || '';
      const match = districtOptions.find(d => d.id !== 'all' && (loc === d.name || loc.includes(d.name)));
      const key = match ? match.id : 'other';
      counts[key] = (counts[key] || 0) + 1;
    });

    districtOptions.forEach(opt => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [converters, districtOptions]);

  // منطق الفلترة بدون حقل البحث
  const filteredConverters = converters.filter(converter => {
    const matchesDistrict =
      selectedDistrict === "all" ||
      converter.location === selectedDistrict ||
      converter.location.includes(selectedDistrict);

    const matchesCategory = selectedCategory === "all" || converter.category === selectedCategory;
    
    const matchesPrice = (() => {
      const price = parseInt(converter.price);
      switch (selectedPriceRange) {
        case 'low':
          return price < 500000;
        case 'medium':
          return price >= 500000 && price <= 1500000;
        case 'high':
          return price > 1500000;
        default:
          return true;
      }
    })();
    
    const matchesRating = selectedRating === "all" ||
                         (selectedRating === "5" && converter.rating >= 5) ||
                         (selectedRating === "4" && converter.rating >= 4) ||
                         (selectedRating === "3" && converter.rating >= 3);
    
    return matchesDistrict && matchesCategory && matchesPrice && matchesRating;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "car":
        return <Car className="w-5 h-5 text-blue-500" />;
      case "solar":
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case "truck":
        return <Car className="w-5 h-5 text-orange-500" />;
      case "portable":
        return <Battery className="w-5 h-5 text-green-500" />;
      case "marine":
        return <Zap className="w-5 h-5 text-cyan-500" />;
      default:
        return <Zap className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "car":
        return "bg-blue-50 border-blue-200";
      case "solar":
        return "bg-yellow-50 border-yellow-200";
      case "truck":
        return "bg-orange-50 border-orange-200";
      case "portable":
        return "bg-green-50 border-green-200";
      case "marine":
        return "bg-cyan-50 border-cyan-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // دوال إدارة النموذج
  const handleAddConverter = async () => {
    if (!newConverter.name || !newConverter.description || !newConverter.category) {
      alert('يرجى ملء الحقول المطلوبة (الاسم، الوصف، النوع)');
      return;
    }

    try {
      const payload = {
        name: newConverter.name,
        description: newConverter.description,
        price: newConverter.price || '0',
        original_price: newConverter.originalPrice || null,
        category: newConverter.category,
        seller: newConverter.seller || 'بائع جديد',
        phone: null,
        features:
          newConverter.features && newConverter.features.length > 0
            ? newConverter.features
            : ['جديد'],
        power: newConverter.power || null,
        warranty: newConverter.warranty || null,
        location: 'عدن',
      };

      console.log('إرسال محول طاقة إلى Supabase:', payload);

      const { data, error } = await supabase
        .from('power_converters')
        .insert(payload)
        .select();

      if (error) {
        console.error('خطأ في حفظ محول الطاقة:', error);
        alert('فشل في حفظ محول الطاقة: ' + error.message);
        return;
      }

      console.log('تم حفظ محول الطاقة في Supabase:', data);
      alert('تم إرسال المحول بنجاح! سيتم مراجعته والموافقة عليه من قبل الإدارة.');

      setNewConverter({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        seller: '',
        features: [],
        power: '',
        warranty: ''
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('استثناء أثناء حفظ محول الطاقة:', err);
      alert('حدث خطأ غير متوقع أثناء حفظ محول الطاقة');
    }
  };

  const handleFeatureAdd = (feature: string) => {
    if (feature.trim() && !newConverter.features.includes(feature.trim())) {
      setNewConverter(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
    }
  };

  const handleFeatureRemove = (feature: string) => {
    setNewConverter(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => window.history.back()}
            className="p-2 text-sky-300 hover:bg-teal-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold text-white">محولات الطاقة</h1>
          </div>
        </div>

        {/* تم حذف شريط البحث بناءً على طلب المستخدم */}

        {/* أزرار الفلترة */}
        <div className="mb-6 space-y-3">
          {/* فلتر المديريات */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsDistrictOpen(!isDistrictOpen);
                if (!isDistrictOpen) {
                  setIsCategoryOpen(false);
                  setIsPriceOpen(false);
                  setIsRatingOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{districtOptions.find(opt => opt.id === selectedDistrict)?.icon}</span>
                <span>{districtOptions.find(opt => opt.id === selectedDistrict)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isDistrictOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isDistrictOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {districtOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedDistrict(option.id);
                      setIsDistrictOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {districtCounts[option.id] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* فلتر النوع */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                if (!isCategoryOpen) {
                  setIsPriceOpen(false);
                  setIsRatingOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{categoryOptions.find(opt => opt.id === selectedCategory)?.icon}</span>
                <span>{categoryOptions.find(opt => opt.id === selectedCategory)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {categoryOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedCategory(option.id);
                      setIsCategoryOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* فلتر السعر */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsPriceOpen(!isPriceOpen);
                if (!isPriceOpen) {
                  setIsCategoryOpen(false);
                  setIsRatingOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{priceRangeOptions.find(opt => opt.id === selectedPriceRange)?.icon}</span>
                <span>{priceRangeOptions.find(opt => opt.id === selectedPriceRange)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isPriceOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {priceRangeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedPriceRange(option.id);
                      setIsPriceOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* فلتر التقييم */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsRatingOpen(!isRatingOpen);
                if (!isRatingOpen) {
                  setIsCategoryOpen(false);
                  setIsPriceOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{ratingOptions.find(opt => opt.id === selectedRating)?.icon}</span>
                <span>{ratingOptions.find(opt => opt.id === selectedRating)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isRatingOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isRatingOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {ratingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedRating(option.id);
                      setIsRatingOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {option.count}
                    </span>
            </button>
                ))}
              </div>
            )}
            </div>
          </div>
          
        {/* عدد النتائج */}
        <div className="mb-4 text-center">
          <p className="text-sky-300 text-sm">
            عرض {filteredConverters.length} من {converters.length} محول طاقة
          </p>
        </div>

        {/* زر إضافة محول جديد */}
        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showAddForm ? 'إلغاء إضافة محول' : 'إضافة محول جديد'}
          </button>
        </div>

        {/* نموذج إضافة محول جديد */}
        {showAddForm && (
          <div className="mb-6 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-yellow-400" />
              إضافة محول طاقة جديد
            </h3>
            
            <div className="space-y-4">
              {/* اسم المحول */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  اسم المحول *
                </label>
                <input
                  type="text"
                  value={newConverter.name}
                  onChange={(e) => setNewConverter(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: محول 12V إلى 220V - 300W"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  الوصف *
                </label>
                <textarea
                  value={newConverter.description}
                  onChange={(e) => setNewConverter(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="مثال: محول للسيارة بقدرة 300 واط مع حماية حرارية"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-20 resize-none"
                />
          </div>
          
              {/* النوع */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  النوع *
            </label>
            <select
                  value={newConverter.category}
                  onChange={(e) => setNewConverter(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">اختر النوع</option>
                  {categoryOptions.filter(opt => opt.id !== 'all').map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
            </select>
              </div>

              {/* السعر */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    السعر الحالي
                  </label>
                  <input
                    type="number"
                    value={newConverter.price}
                    onChange={(e) => setNewConverter(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="350000"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    السعر الأصلي
                  </label>
                  <input
                    type="number"
                    value={newConverter.originalPrice}
                    onChange={(e) => setNewConverter(prev => ({ ...prev, originalPrice: e.target.value }))}
                    placeholder="400000"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* البائع والقدرة */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    البائع
                  </label>
                  <input
                    type="text"
                    value={newConverter.seller}
                    onChange={(e) => setNewConverter(prev => ({ ...prev, seller: e.target.value }))}
                    placeholder="متجر الطاقة"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    القدرة
                  </label>
                  <input
                    type="text"
                    value={newConverter.power}
                    onChange={(e) => setNewConverter(prev => ({ ...prev, power: e.target.value }))}
                    placeholder="300W"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              {/* الضمان */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  الضمان
                </label>
                <input
                  type="text"
                  value={newConverter.warranty}
                  onChange={(e) => setNewConverter(prev => ({ ...prev, warranty: e.target.value }))}
                  placeholder="سنة واحدة"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* المميزات */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  المميزات
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="أضف ميزة جديدة"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleFeatureAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 p-2 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleFeatureAdd(input.value);
                      input.value = '';
                    }}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newConverter.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-teal-700 text-sky-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                    >
                      {feature}
                      <button
                        onClick={() => handleFeatureRemove(feature)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
          </div>
        </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddConverter}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  إضافة المحول
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* قائمة محولات الطاقة */}
        <div className="space-y-4">
          {filteredConverters.map((converter) => (
            <div
              key={converter.id}
              className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4 hover:bg-teal-700 transition-all"
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{converter.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{converter.name}</h3>
                    <p className="text-sm text-sky-300">{converter.description}</p>
                    <p className="text-xs text-sky-400">{converter.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                {getCategoryIcon(converter.category)}
                </div>
              </div>

              {/* المميزات */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                {converter.features.map((feature, index) => (
                  <span
                    key={index}
                      className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                </div>
              </div>

              {/* التفاصيل */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sky-300 text-sm">
                  <span className="ml-1">🏪</span>
                  {converter.seller}
                </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <span className="ml-1">⚡</span>
                  <span className="font-medium text-yellow-400 mr-2">{converter.power}</span>
                </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <span className="ml-1">🛡️</span>
                  <span className="font-medium text-green-400 mr-2">{converter.warranty}</span>
                </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <div className="flex items-center ml-1">
                  <Star className="w-4 h-4 text-yellow-400 ml-1" />
                    <span className="font-medium">{converter.rating}</span>
                    <span className="mr-1">({converter.reviews} تقييم)</span>
                  </div>
                </div>
              </div>

              {/* السعر */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-yellow-400">
                    {parseInt(converter.price).toLocaleString()} ريال
                  </span>
                  {converter.originalPrice && (
                    <span className="text-sky-400 line-through text-sm mr-2">
                      {parseInt(converter.originalPrice).toLocaleString()} ريال
                    </span>
                  )}
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>

              {/* أزرار العمل */}
              <div className="flex gap-3">
                <button 
                  onClick={() => window.open(`tel:${converter.phone}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Phone className="w-4 h-4 ml-1" />
                  تواصل مع البائع
                </button>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${converter.coordinates[0]},${converter.coordinates[1]}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <TrendingUp className="w-4 h-4 ml-1" />
                  الاتجاهات
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredConverters.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-teal-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚡</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">لا توجد نتائج</h3>
            <p className="text-sky-300">جرب تغيير الفلاتر أو البحث بكلمات مختلفة</p>
        </div>
        )}
      </main>

    </div>
  );
}
