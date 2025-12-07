import { useState, useEffect, useMemo } from "react";
import AppHeader from "@/components/AppHeader";
import { ArrowLeft, Phone, Clock, Star, ThumbsUp, ThumbsDown, Zap, Search, Filter, Plus, MapPin, Wifi } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ElectricianRecord {
  id: string | number;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  likes: number;
  dislikes: number;
  responseTime: string;
  priceRange: string;
  phone: string;
  area: string;
  experience: string;
  specialties: string[];
  address: string;
  coordinates?: [number, number];
  available: boolean;
  verified: boolean;
}

export default function Electrician() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [electricianList, setElectricianList] = useState<ElectricianRecord[]>([]);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<ElectricianRecord | null>(null);
  const [selectedStars, setSelectedStars] = useState<number>(5);

  const [newElectrician, setNewElectrician] = useState({
    name: '',
    description: '',
    phone: '',
    area: '',
    priceRange: '',
    experience: '',
    specialties: [] as string[],
    address: ''
  });

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsAreaOpen(false);
        setIsRatingOpen(false);
        setIsPriceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // بيانات تجريبية افتراضية تستخدم فقط إذا لم توجد بيانات في Supabase
  const sampleElectricians: ElectricianRecord[] = [
    {
      id: 1,
    name: "أحمد الكهربائي - كريتر",
      description: "كهربائي محترف مع 15 سنة خبرة في الإصلاحات المنزلية",
      rating: 5.0,
    reviews: 126,
    likes: 126,
      dislikes: 8,
      responseTime: "30-45 دقيقة",
      priceRange: "من 5,000 ريال",
      phone: "+967-1-234-567",
      area: "عدن كريتر",
      experience: "15 سنة",
      specialties: ["إصلاحات منزلية", "تركيب أجهزة", "صيانة عامة"],
      address: "شارع الملك فيصل، كريتر",
      coordinates: [12.7854, 45.0187],
      available: true,
      verified: true
    },
    {
      id: 2,
      name: "محمد الصيانة - المعلا",
      description: "متخصص في إصلاح الأعطال المعقدة والتركيبات الجديدة",
      rating: 4.8,
      reviews: 89,
      likes: 89,
      dislikes: 12,
      responseTime: "45-60 دقيقة",
      priceRange: "من 7,000 ريال",
      phone: "+967-1-234-568",
      area: "المعلا",
      experience: "12 سنة",
      specialties: ["إصلاحات معقدة", "تركيبات جديدة", "أنظمة أمان"],
      address: "شارع الجمهورية، المعلا",
      coordinates: [12.7890, 45.0123],
      available: true,
      verified: true
    },
    {
      id: 3,
      name: "علي الإلكترونيات - الشيخ عثمان",
      description: "خبير في الإلكترونيات والأنظمة الذكية",
      rating: 4.9,
      reviews: 156,
      likes: 156,
      dislikes: 5,
      responseTime: "20-30 دقيقة",
      priceRange: "من 6,000 ريال",
      phone: "+967-1-234-569",
      area: "الشيخ عثمان",
      experience: "18 سنة",
      specialties: ["أنظمة ذكية", "إلكترونيات", "كاميرات مراقبة"],
      address: "شارع النصر، الشيخ عثمان",
      coordinates: [12.7654, 45.0321],
      available: true,
      verified: true
    },
    {
      id: 4,
      name: "يوسف الكهربائي - المنصورة",
      description: "متخصص في الصيانة الصناعية والتجارية",
      rating: 4.7,
      reviews: 78,
      likes: 78,
      dislikes: 15,
      responseTime: "60-90 دقيقة",
      priceRange: "من 8,000 ريال",
      phone: "+967-1-234-570",
      area: "المنصورة",
      experience: "20 سنة",
      specialties: ["صيانة صناعية", "أنظمة تجارية", "مولدات"],
      address: "شارع الصناعة، المنصورة",
      coordinates: [12.8123, 44.9876],
      available: false,
      verified: true
    },
    {
      id: 5,
      name: "سالم الإصلاح - خور مكسر",
      description: "كهربائي سريع متخصص في الإصلاحات الطارئة",
      rating: 4.6,
      reviews: 92,
      likes: 92,
      dislikes: 8,
      responseTime: "15-25 دقيقة",
      priceRange: "من 4,000 ريال",
      phone: "+967-1-234-571",
      area: "خور مكسر",
      experience: "10 سنوات",
      specialties: ["إصلاحات طارئة", "صيانة سريعة", "أعطال بسيطة"],
      address: "شارع السلام، خور مكسر",
      coordinates: [12.7500, 44.9500],
      available: true,
      verified: false
    },
    {
      id: 6,
      name: "حسن التقني - البريقة",
      description: "خبير في أنظمة الطاقة الشمسية والبديلة",
      rating: 4.9,
      reviews: 134,
      likes: 134,
      dislikes: 3,
      responseTime: "45-75 دقيقة",
      priceRange: "من 10,000 ريال",
      phone: "+967-1-234-572",
      area: "البريقة",
      experience: "22 سنة",
      specialties: ["طاقة شمسية", "أنظمة بديلة", "بطاريات"],
      address: "شارع الطاقة، البريقة",
      coordinates: [12.7200, 44.9200],
      available: true,
      verified: true
    },
    {
      id: 7,
      name: "عبدالله الماهر - دار سعد",
      description: "كهربائي متعدد المهارات مع خبرة واسعة",
      rating: 4.5,
      reviews: 67,
      likes: 67,
      dislikes: 12,
      responseTime: "30-50 دقيقة",
      priceRange: "من 5,500 ريال",
      phone: "+967-1-234-573",
      area: "دار سعد",
      experience: "14 سنة",
      specialties: ["إصلاحات عامة", "تركيبات", "صيانة دورية"],
      address: "شارع الوحدة، دار سعد",
      coordinates: [12.6800, 44.8800],
      available: true,
      verified: false
    },
    {
      id: 8,
      name: "محمود الخبير - التواهي",
      description: "متخصص في الأنظمة المتقدمة والتحكم الآلي",
      rating: 4.8,
      reviews: 98,
      likes: 98,
      dislikes: 6,
      responseTime: "40-65 دقيقة",
      priceRange: "من 9,000 ريال",
      phone: "+967-1-234-574",
      area: "التواهي",
      experience: "16 سنة",
      specialties: ["أنظمة متقدمة", "تحكم آلي", "شبكات"],
      address: "شارع الميناء، التواهي",
      coordinates: [12.6500, 44.8500],
      available: false,
      verified: true
    }
  ];

  // تحميل الكهربائيين من Supabase (فقط الموافق عليهم)
  useEffect(() => {
    const loadElectricians = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('electricians')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: ElectricianRecord[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            rating: Number(row.rating ?? 5),
            reviews: Number(row.reviews ?? 0),
            likes: Number(row.likes ?? 0),
            dislikes: Number(row.dislikes ?? 0),
            responseTime: row.response_time || '30-60 دقيقة',
            priceRange: row.price_range || 'من 5,000 ريال',
            phone: row.phone || '+967-1-234-000',
            area: row.area,
            experience: row.experience || '5 سنوات',
            specialties: row.specialties || ['إصلاحات عامة'],
            address: row.address || 'عدن',
            coordinates: undefined,
            available: row.available ?? true,
            verified: row.verified ?? false,
          }));

          setElectricianList(mapped);
        } else {
          // لا توجد بيانات حقيقية بعد → استخدم البيانات التجريبية
          setElectricianList(sampleElectricians);
        }
      } catch (err: any) {
        console.error('Error loading electricians:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل الكهربائيين');
        // في حالة الخطأ نستمر في استخدام البيانات التجريبية
        setElectricianList(sampleElectricians);
      } finally {
        setIsLoading(false);
      }
    };

    loadElectricians();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // خيارات الفلترة
  const areaOptions = [
    { id: 'all', name: 'جميع المناطق', count: 10, icon: '📍' },
    { id: 'عدن كريتر', name: 'عدن كريتر', count: 1, icon: '🏛️' },
    { id: 'المعلا', name: 'المعلا', count: 1, icon: '🏢' },
    { id: 'الشيخ عثمان', name: 'الشيخ عثمان', count: 1, icon: '🏘️' },
    { id: 'المنصورة', name: 'المنصورة', count: 1, icon: '🏭' },
    { id: 'خور مكسر', name: 'خور مكسر', count: 1, icon: '🏠' },
    { id: 'البريقة', name: 'البريقة', count: 1, icon: '⚡' },
    { id: 'دار سعد', name: 'دار سعد', count: 1, icon: '🏡' },
    { id: 'التواهي', name: 'التواهي', count: 1, icon: '🚢' },
    { id: 'القلوعه', name: 'القلوعة', count: 1, icon: '🏙️' },
    { id: 'الممدارة', name: 'الممدارة', count: 1, icon: '🏙️' }
  ];

  const ratingOptions = [
    { id: 'all', name: 'جميع التقييمات', count: 8, icon: '⭐' },
    { id: '5', name: '5 نجوم', count: 1, icon: '⭐⭐⭐⭐⭐' },
    { id: '4.5', name: '4.5 نجوم وأكثر', count: 4, icon: '⭐⭐⭐⭐' },
    { id: '4', name: '4 نجوم وأكثر', count: 3, icon: '⭐⭐⭐' }
  ];

  const priceRangeOptions = [
    { id: 'all', name: 'جميع الأسعار', count: 8, icon: '💰' },
    { id: 'low', name: 'أقل من 6,000 ريال', count: 2, icon: '💵' },
    { id: 'medium', name: '6,000 - 8,000 ريال', count: 4, icon: '💴' },
    { id: 'high', name: 'أكثر من 8,000 ريال', count: 2, icon: '💎' }
  ];

  // حساب الأعداد الحقيقية لكل فلتر من بيانات الكهربائيين
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = electricianList.length;

    electricianList.forEach(e => {
      const area = e.area || '';
      const match = areaOptions.find(opt => opt.id !== 'all' && (area === opt.id || area === opt.name || area.includes(opt.name)));
      const key = match ? match.id : 'other';
      counts[key] = (counts[key] || 0) + 1;
    });

    areaOptions.forEach(opt => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [electricianList, areaOptions]);

  const ratingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = electricianList.length;

    electricianList.forEach(e => {
      const r = e.rating || 0;
      if (r >= 5) counts['5'] = (counts['5'] || 0) + 1;
      if (r >= 4.5) counts['4.5'] = (counts['4.5'] || 0) + 1;
      if (r >= 4) counts['4'] = (counts['4'] || 0) + 1;
    });

    ratingOptions.forEach(opt => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [electricianList, ratingOptions]);

  const priceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = electricianList.length;

    electricianList.forEach(e => {
      const priceNumber = parseInt(e.priceRange.replace(/[^\d]/g, '')) || 0;
      if (priceNumber < 6000) counts['low'] = (counts['low'] || 0) + 1;
      else if (priceNumber <= 8000) counts['medium'] = (counts['medium'] || 0) + 1;
      else counts['high'] = (counts['high'] || 0) + 1;
    });

    priceRangeOptions.forEach(opt => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [electricianList, priceRangeOptions]);

  // منطق الفلترة والبحث
  const filteredElectricians = electricianList.filter(electrician => {
    const matchesSearch = electrician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         electrician.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         electrician.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesArea = selectedArea === "all" || electrician.area === selectedArea;
    
    const matchesRating = selectedRating === "all" || 
                         (selectedRating === "5" && electrician.rating >= 5) ||
                         (selectedRating === "4.5" && electrician.rating >= 4.5) ||
                         (selectedRating === "4" && electrician.rating >= 4);
    
    const matchesPrice = (() => {
      const price = parseInt(electrician.priceRange.replace(/[^\d]/g, ''));
      switch (selectedPriceRange) {
        case 'low':
          return price < 6000;
        case 'medium':
          return price >= 6000 && price <= 8000;
        case 'high':
          return price > 8000;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesArea && matchesRating && matchesPrice;
  });

  // دوال إدارة النموذج
  const handleAddElectrician = async () => {
    if (!newElectrician.name || !newElectrician.description || !newElectrician.area) {
      alert('يرجى ملء الحقول المطلوبة (الاسم، الوصف، المنطقة)');
      return;
    }

    try {
      const payload = {
        name: newElectrician.name,
        description: newElectrician.description,
        phone: newElectrician.phone || null,
        area: newElectrician.area,
        price_range: newElectrician.priceRange || 'من 5,000 ريال',
        experience: newElectrician.experience || '5 سنوات',
        specialties:
          newElectrician.specialties && newElectrician.specialties.length > 0
            ? newElectrician.specialties
            : ['إصلاحات عامة'],
        address: newElectrician.address || 'عدن',
        rating: 5,
        reviews: 0,
        likes: 0,
        dislikes: 0,
        response_time: '30-60 دقيقة',
        available: true,
        verified: false,
      };

      console.log('إرسال كهربائي إلى Supabase:', payload);

      const { data, error } = await supabase
        .from('electricians')
        .insert(payload)
        .select();

      if (error) {
        console.error('خطأ في حفظ الكهربائي:', error);
        alert('فشل في حفظ بيانات الكهربائي: ' + error.message);
        return;
      }

      console.log('تم حفظ الكهربائي في Supabase:', data);
      alert('تم إرسال الكهربائي بنجاح! سيتم مراجعته والموافقة عليه من قبل الإدارة.');

      setNewElectrician({
        name: '',
        description: '',
        phone: '',
        area: '',
        priceRange: '',
        experience: '',
        specialties: [],
        address: ''
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('استثناء أثناء حفظ الكهربائي:', err);
      alert('حدث خطأ غير متوقع أثناء حفظ بيانات الكهربائي');
    }
  };

  // دالة تقييم الكهربائي (1-5 نجوم)
  const handleRateElectrician = async (electrician: ElectricianRecord, score: number) => {
    // إذا كان الكهربائي من البيانات التجريبية (id رقم فقط) فلا نحاول حفظ في Supabase
    const isSample = typeof electrician.id === 'number';
    if (isSample) {
      alert('تم تسجيل تقييمك. سيتم تفعيل الحفظ في قاعدة البيانات للكهربائيين الحقيقيين.');
      return;
    }

    const storageKey = `electrician_rated_${electrician.id}`;
    if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
      alert('لقد قمت بتقييم هذا الكهربائي من قبل من هذا الجهاز.');
      return;
    }

    try {
      const oldRating = electrician.rating || 0;
      const oldReviews = electrician.reviews || 0;
      const newReviews = oldReviews + 1;
      const newRating = (oldRating * oldReviews + score) / newReviews;

      const { error } = await supabase
        .from('electricians')
        .update({ rating: newRating, reviews: newReviews })
        .eq('id', electrician.id);

      if (error) {
        console.error('خطأ في حفظ التقييم:', error);
        alert('فشل في حفظ التقييم: ' + error.message);
        return;
      }

      // تحديث في الواجهة
      setElectricianList(prev =>
        prev.map(e =>
          e.id === electrician.id
            ? { ...e, rating: newRating, reviews: newReviews }
            : e
        )
      );

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, 'rated');
      }

      alert('شكراً لتقييمك! تم تحديث تقييم الكهربائي.');
    } catch (err: any) {
      console.error('استثناء أثناء حفظ التقييم:', err);
      alert('حدث خطأ غير متوقع أثناء حفظ التقييم');
    }
  };

  const openRatingModal = (electrician: ElectricianRecord) => {
    const isSample = typeof electrician.id === 'number';
    const storageKey = `electrician_rated_${electrician.id}`;
    if (!isSample && typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
      alert('لقد قمت بتقييم هذا الكهربائي من قبل من هذا الجهاز.');
      return;
    }
    setRatingTarget(electrician);
    setSelectedStars(5);
    setRatingModalOpen(true);
  };

  const confirmRating = async () => {
    if (!ratingTarget) return;
    await handleRateElectrician(ratingTarget, selectedStars);
    setRatingModalOpen(false);
    setRatingTarget(null);
  };

  const handleSpecialtyAdd = (specialty: string) => {
    if (specialty.trim() && !newElectrician.specialties.includes(specialty.trim())) {
      setNewElectrician(prev => ({
      ...prev,
        specialties: [...prev.specialties, specialty.trim()]
      }));
    }
  };

  const handleSpecialtyRemove = (specialty: string) => {
    setNewElectrician(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
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
            <h1 className="text-xl font-bold text-white">كهربائي سريع</h1>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن كهربائي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span className="text-sky-300">🔍</span>
            </div>
            </div>
          </div>
          
        {/* أزرار الفلترة */}
        <div className="mb-6 space-y-3">
          {/* فلتر المنطقة */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsAreaOpen(!isAreaOpen);
                if (!isAreaOpen) {
                  setIsRatingOpen(false);
                  setIsPriceOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{areaOptions.find(opt => opt.id === selectedArea)?.icon}</span>
                <span>{areaOptions.find(opt => opt.id === selectedArea)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isAreaOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isAreaOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {areaOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedArea(option.id);
                      setIsAreaOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {areaCounts[option.id] ?? 0}
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
                  setIsAreaOpen(false);
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
                      {ratingCounts[option.id] ?? 0}
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
                  setIsAreaOpen(false);
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
        </div>

        {/* عدد النتائج */}
        <div className="mb-4 text-center">
          <p className="text-sky-300 text-sm">
            عرض {filteredElectricians.length} من {electricianList.length} كهربائي
          </p>
        </div>

        {/* زر إضافة كهربائي جديد */}
        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showAddForm ? 'إلغاء إضافة كهربائي' : 'إضافة كهربائي جديد'}
          </button>
        </div>

        {/* نموذج إضافة كهربائي جديد */}
        {showAddForm && (
          <div className="mb-6 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-yellow-400" />
              إضافة كهربائي جديد
            </h3>
          
          <div className="space-y-4">
              {/* اسم الكهربائي */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  اسم الكهربائي *
                </label>
                <input
                  type="text"
                  value={newElectrician.name}
                  onChange={(e) => setNewElectrician(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: أحمد الكهربائي - كريتر"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  الوصف *
                </label>
                <textarea
                  value={newElectrician.description}
                  onChange={(e) => setNewElectrician(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="مثال: كهربائي محترف مع 15 سنة خبرة في الإصلاحات المنزلية"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-20 resize-none"
                />
              </div>

              {/* المنطقة */}
            <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  المنطقة *
              </label>
              <select
                  value={newElectrician.area}
                  onChange={(e) => setNewElectrician(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">اختر المنطقة</option>
                  {areaOptions.filter(opt => opt.id !== 'all').map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                ))}
              </select>
            </div>

              {/* الهاتف والسعر */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={newElectrician.phone}
                    onChange={(e) => setNewElectrician(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+967-1-234-567"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
            <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    نطاق السعر
              </label>
                  <input
                    type="text"
                    value={newElectrician.priceRange}
                    onChange={(e) => setNewElectrician(prev => ({ ...prev, priceRange: e.target.value }))}
                    placeholder="من 5,000 ريال"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
            </div>

              {/* الخبرة والعنوان */}
              <div className="grid grid-cols-2 gap-3">
            <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    سنوات الخبرة
              </label>
              <input
                    type="text"
                    value={newElectrician.experience}
                    onChange={(e) => setNewElectrician(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="15 سنة"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
                  <label className="block text-sm font-medium text-sky-300 mb-2">
                    العنوان
              </label>
              <input
                type="text"
                    value={newElectrician.address}
                    onChange={(e) => setNewElectrician(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="شارع الملك فيصل، كريتر"
                    className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
            </div>

              {/* التخصصات */}
            <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  التخصصات
              </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="أضف تخصص جديد"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSpecialtyAdd(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 p-2 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleSpecialtyAdd(input.value);
                      input.value = '';
                    }}
                    className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm"
                  >
                    إضافة
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newElectrician.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-teal-700 text-sky-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                    >
                      {specialty}
                      <button
                        onClick={() => handleSpecialtyRemove(specialty)}
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
                  onClick={handleAddElectrician}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  إضافة الكهربائي
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

        {/* قائمة الكهربائيين */}
        <div className="space-y-4">
          {filteredElectricians.map((electrician) => (
            <div 
              key={electrician.id} 
              className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4 hover:bg-teal-700 transition-all"
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
            <div>
                    <h3 className="font-bold text-white text-lg">{electrician.name}</h3>
                    <p className="text-sm text-sky-300">{electrician.description}</p>
                    <p className="text-xs text-sky-400">{electrician.area}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {electrician.verified && (
                    <span className="text-green-400 text-xs">✓ موثق</span>
                  )}
                  <div className={`w-3 h-3 rounded-full ${electrician.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                </div>
              </div>

              {/* التخصصات */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {electrician.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
              </div>
            </div>

              {/* التفاصيل */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sky-300 text-sm">
                  <Clock className="w-4 h-4 ml-1" />
                  <span className="font-medium text-yellow-400 mr-2">{electrician.responseTime}</span>
                </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <span className="ml-1">💰</span>
                  <span className="font-medium text-green-400 mr-2">{electrician.priceRange}</span>
                </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <span className="ml-1">👨‍🔧</span>
                  <span className="font-medium text-blue-400 mr-2">{electrician.experience}</span>
          </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <div className="flex items-center ml-1">
                    <Star className="w-4 h-4 text-yellow-400 ml-1" />
                    <span className="font-medium">{Math.round(electrician.rating)}</span>
                    <span className="mr-1">({electrician.reviews} تقييم)</span>
                  </div>
            </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <MapPin className="w-4 h-4 ml-1" />
                  <span className="text-xs">{electrician.address}</span>
            </div>
          </div>

              {/* أزرار العمل */}
              <div className="flex gap-3">
                <button 
                  onClick={() => window.open(`tel:${electrician.phone}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Phone className="w-4 h-4 ml-1" />
                  تواصل مع الكهربائي
                </button>
                <button 
                  onClick={() => openRatingModal(electrician)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Star className="w-4 h-4 ml-1" />
                  قيّم الكهربائي
                </button>
              </div>
          </div>
          ))}
        </div>

        {/* نافذة التقييم */}
        {ratingModalOpen && ratingTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-full max-w-sm mx-4" dir="rtl">
              <h3 className="text-lg font-bold text-white mb-2">تقييم {ratingTarget.name}</h3>
              <p className="text-sm text-gray-300 mb-3">اختر عدد النجوم لهذا الكهربائي (1 إلى 5):</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStars(star)}
                    className={`p-1 ${
                      star <= selectedStars ? 'text-yellow-400' : 'text-gray-500'
                    }`}
                  >
                    <Star className="w-7 h-7" />
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={confirmRating}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  تأكيد التقييم ({selectedStars} نجوم)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRatingModalOpen(false);
                    setRatingTarget(null);
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredElectricians.length === 0 && (
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
