import { useState, useEffect, useMemo } from "react";
import AppHeader from "@/components/AppHeader";
import { ArrowLeft, MapPin, Clock, Phone, Navigation, Sun, Search, Filter, Star, Zap, Battery, Wifi } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ChargingPointRecord {
  id: string | number;
  name: string;
  location: string;
  district: string;
  status: string;
  statusType?: string;
  hours: string;
  chargingTypes: string[];
  charging_types?: string[];
  distance?: string;
  rating?: number;
  reviews?: number;
  phone: string;
  features: string[];
  price: string;
  coordinates?: [number, number];
}

export default function ChargingPoints() {
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedChargingType, setSelectedChargingType] = useState("all");
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isChargingTypeOpen, setIsChargingTypeOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<ChargingPointRecord[]>([]);

  const [newPoint, setNewPoint] = useState({
    name: '',
    location: '',
    district: '',
    hours: '',
    chargingTypes: [] as string[],
    phone: '',
    features: [] as string[],
    price: ''
  });

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsAreaOpen(false);
        setIsStatusOpen(false);
        setIsChargingTypeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // بيانات تجريبية افتراضية تستخدم فقط إذا لم توجد بيانات في Supabase
  const sampleChargingPoints: ChargingPointRecord[] = [
    {
      id: 1,
      name: "مسجد النور - عدن كريتر",
      location: "حي الجمهورية",
      district: "عدن كريتر",
      status: "متاح الآن",
      statusType: "available",
      hours: "بعد الفجر - بعد العشاء",
      chargingTypes: ["12V", "USB"],
      distance: "500 متر",
      rating: 4.8,
      reviews: 67,
      coordinates: [12.7854, 45.0187],
      phone: "+967-1-234-567",
      features: ["مظلة", "مقاعد", "إنترنت مجاني"],
      price: "مجاني",
    },
    {
      id: 2,
      name: "مركز الشحن الذكي - المعلا",
      location: "شارع الملك فيصل",
      district: "المعلا",
      status: "متاح الآن",
      statusType: "available",
      hours: "24/7",
      chargingTypes: ["12V", "USB", "220V"],
      distance: "1.2 كم",
      rating: 4.6,
      reviews: 89,
      coordinates: [12.7890, 45.0123],
      phone: "+967-1-234-568",
      features: ["تكييف", "مراقبة أمنية", "دفع إلكتروني"],
      price: "5 ريال/ساعة",
    },
    {
      id: 3,
      name: "محطة الطاقة الشمسية - الشيخ عثمان",
      location: "حي السلام",
      district: "الشيخ عثمان",
      status: "مشغول",
      statusType: "busy",
      hours: "6:00 ص - 10:00 م",
      chargingTypes: ["12V", "USB"],
      distance: "2.1 كم",
      rating: 4.4,
      reviews: 45,
      coordinates: [12.7654, 45.0321],
      phone: "+967-1-234-569",
      features: ["طاقة شمسية", "مظلة", "مقاعد"],
      price: "مجاني",
    },
    {
      id: 4,
      name: "مول عدن - المنصورة",
      location: "شارع الجمهورية",
      district: "المنصورة",
      status: "متاح الآن",
      statusType: "available",
      hours: "9:00 ص - 11:00 م",
      chargingTypes: ["USB", "220V", "Wireless"],
      distance: "3.5 كم",
      rating: 4.7,
      reviews: 123,
      coordinates: [12.8123, 44.9876],
      phone: "+967-1-234-570",
      features: ["تكييف", "مطعم", "مرافق تسوق"],
      price: "3 ريال/ساعة",
    },
    {
      id: 5,
      name: "مستشفى الجمهورية - عدن كريتر",
      location: "شارع الملكة أروى",
      district: "عدن كريتر",
      status: "خارج الخدمة",
      statusType: "out_of_service",
      hours: "8:00 ص - 6:00 م",
      chargingTypes: ["12V", "USB"],
      distance: "800 متر",
      rating: 4.2,
      reviews: 34,
      coordinates: [12.7789, 45.0156],
      phone: "+967-1-234-571",
      features: ["مظلة", "مقاعد", "مرافق طبية"],
      price: "مجاني",
    },
    {
      id: 6,
      name: "جامعة عدن - المعلا",
      location: "شارع الجامعة",
      district: "المعلا",
      status: "متاح الآن",
      statusType: "available",
      hours: "7:00 ص - 9:00 م",
      chargingTypes: ["12V", "USB", "220V", "Wireless"],
      distance: "2.8 كم",
      rating: 4.9,
      reviews: 156,
      coordinates: [12.8012, 45.0089],
      phone: "+967-1-234-572",
      features: ["إنترنت مجاني", "مكتبة", "مقاعد مريحة"],
      price: "مجاني للطلاب",
    },
    {
      id: 7,
      name: "محطة وقود النور - الشيخ عثمان",
      location: "شارع المطار",
      district: "الشيخ عثمان",
      status: "متاح الآن",
      statusType: "available",
      hours: "24/7",
      chargingTypes: ["12V", "USB", "220V"],
      distance: "4.2 كم",
      rating: 4.3,
      reviews: 78,
      coordinates: [12.7432, 45.0456],
      phone: "+967-1-234-573",
      features: ["مظلة", "مراقبة أمنية", "مرافق وقود"],
      price: "2 ريال/ساعة",
    },
    {
      id: 8,
      name: "حديقة التحرير - عدن كريتر",
      location: "شارع التحرير",
      district: "عدن كريتر",
      status: "مشغول",
      statusType: "busy",
      hours: "6:00 ص - 10:00 م",
      chargingTypes: ["12V", "USB"],
      distance: "1.5 كم",
      rating: 4.5,
      reviews: 92,
      coordinates: [12.7654, 45.0234],
      phone: "+967-1-234-574",
      features: ["حديقة", "مقاعد", "منطقة أطفال"],
      price: "مجاني",
    },
    {
      id: 9,
      name: "مركز التسوق الكبير - المنصورة",
      location: "شارع السوق",
      district: "المنصورة",
      status: "متاح الآن",
      statusType: "available",
      hours: "10:00 ص - 12:00 م",
      chargingTypes: ["USB", "220V", "Wireless"],
      distance: "3.8 كم",
      rating: 4.6,
      reviews: 134,
      coordinates: [12.8234, 44.9765],
      phone: "+967-1-234-575",
      features: ["تكييف", "مطاعم", "تسوق"],
      price: "4 ريال/ساعة",
    },
    {
      id: 10,
      name: "مكتب البريد - المعلا",
      location: "شارع البريد",
      district: "المعلا",
      status: "متاح الآن",
      statusType: "available",
      hours: "8:00 ص - 3:00 م",
      chargingTypes: ["12V", "USB"],
      distance: "2.3 كم",
      rating: 4.1,
      reviews: 56,
      coordinates: [12.7890, 45.0056],
      phone: "+967-1-234-576",
      features: ["مظلة", "مقاعد", "خدمات بريدية"],
      price: "مجاني",
    },
    {
      id: 11,
      name: "محطة الشحن الساحلية - خور مكسر",
      location: "شارع الكورنيش",
      district: "خور مكسر",
      status: "متاح الآن",
      statusType: "available",
      hours: "6:00 ص - 11:00 م",
      chargingTypes: ["12V", "USB", "220V"],
      distance: "5.2 كم",
      rating: 4.6,
      reviews: 89,
      coordinates: [12.7500, 44.9500],
      phone: "+967-1-234-577",
      features: ["منظر بحري", "مظلة", "مقاعد"],
      price: "3 ريال/ساعة",
    },
    {
      id: 12,
      name: "مركز الشحن الصناعي - البريقة",
      location: "المنطقة الصناعية",
      district: "البريقة",
      status: "متاح الآن",
      statusType: "available",
      hours: "24/7",
      chargingTypes: ["12V", "USB", "220V", "Wireless"],
      distance: "6.8 كم",
      rating: 4.4,
      reviews: 67,
      coordinates: [12.7200, 44.9200],
      phone: "+967-1-234-578",
      features: ["مراقبة أمنية", "تكييف", "مرافق صناعية"],
      price: "4 ريال/ساعة",
    },
    {
      id: 13,
      name: "مسجد السلام - دار سعد",
      location: "حي السلام",
      district: "دار سعد",
      status: "مشغول",
      statusType: "busy",
      hours: "بعد الفجر - بعد العشاء",
      chargingTypes: ["12V", "USB"],
      distance: "7.5 كم",
      rating: 4.3,
      reviews: 45,
      coordinates: [12.6800, 44.8800],
      phone: "+967-1-234-579",
      features: ["مظلة", "مقاعد", "مرافق دينية"],
      price: "مجاني",
    },
    {
      id: 14,
      name: "ميناء عدن - التواهي",
      location: "منطقة الميناء",
      district: "التواهي",
      status: "متاح الآن",
      statusType: "available",
      hours: "24/7",
      chargingTypes: ["12V", "USB", "220V"],
      distance: "8.2 كم",
      rating: 4.7,
      reviews: 112,
      coordinates: [12.6500, 44.8500],
      phone: "+967-1-234-580",
      features: ["منظر بحري", "مراقبة أمنية", "مرافق ميناء"],
      price: "5 ريال/ساعة",
    },
    {
      id: 15,
      name: "ميناء عدن - التواهي",
      location: "منطقة الميناء",
      district: "التواهي",
      status: "متاح الآن",
      statusType: "available",
      hours: "24/7",
      chargingTypes: ["12V", "USB", "220V"],
      distance: "8.2 كم",
      rating: 4.7,
      reviews: 112,
      coordinates: [12.6500, 44.8500],
      phone: "+967-1-234-581",
      features: ["منظر بحري", "مراقبة أمنية", "مرافق ميناء"],
      price: "5 ريال/ساعة",
    },
    {
      id: 16,
      name: "محطة الشحن الساحلية - خور مكسر",
      location: "شارع الكورنيش",
      district: "خور مكسر",
      status: "متاح الآن",
      statusType: "available",
      hours: "6:00 ص - 11:00 م",
      chargingTypes: ["12V", "USB", "220V"],
      distance: "5.2 كم",
      rating: 4.6,
      reviews: 89,
      coordinates: [12.7500, 44.9500],
      phone: "+967-1-234-582",
      features: ["منظر بحري", "مظلة", "مقاعد"],
      price: "3 ريال/ساعة",
    },
    {
      id: 17,
      name: "مركز الشحن الصناعي - البريقة",
      location: "المنطقة الصناعية",
      district: "البريقة",
      status: "متاح الآن",
      statusType: "available",
      hours: "24/7",
      chargingTypes: ["12V", "USB", "220V", "Wireless"],
      distance: "6.8 كم",
      rating: 4.4,
      reviews: 67,
      coordinates: [12.7200, 44.9200],
      phone: "+967-1-234-583",
      features: ["مراقبة أمنية", "تكييف", "مرافق صناعية"],
      price: "4 ريال/ساعة",
    },
    {
      id: 18,
      name: "مسجد السلام - دار سعد",
      location: "حي السلام",
      district: "دار سعد",
      status: "مشغول",
      statusType: "busy",
      hours: "بعد الفجر - بعد العشاء",
      chargingTypes: ["12V", "USB"],
      distance: "7.5 كم",
      rating: 4.3,
      reviews: 45,
      coordinates: [12.6800, 44.8800],
      phone: "+967-1-234-584",
      features: ["مظلة", "مقاعد", "مرافق دينية"],
      price: "مجاني",
    },
    {
      id: 19,
      name: "مستشفى الشيخ عثمان - الشيخ عثمان",
      location: "شارع المستشفى",
      district: "الشيخ عثمان",
      status: "متاح الآن",
      statusType: "available",
      hours: "24/7",
      chargingTypes: ["12V", "USB"],
      distance: "2.1 كم",
      rating: 4.4,
      reviews: 45,
      coordinates: [12.7654, 45.0321],
      phone: "+967-1-234-585",
      features: ["مرافق طبية", "مظلة", "مقاعد"],
      price: "مجاني",
    },
    {
      id: 20,
      name: "سوق المنصورة - المنصورة",
      location: "سوق المنصورة",
      district: "المنصورة",
      status: "متاح الآن",
      statusType: "available",
      hours: "6:00 ص - 10:00 م",
      chargingTypes: ["12V", "USB", "220V"],
      distance: "3.5 كم",
      rating: 4.7,
      reviews: 123,
      coordinates: [12.8123, 44.9876],
      phone: "+967-1-234-586",
      features: ["سوق", "مظلة", "مقاعد"],
      price: "2 ريال/ساعة",
    },
  ];

  // تحميل نقاط الشحن من Supabase (فقط الموافَق عليها)
  useEffect(() => {
    const loadPoints = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('charging_points')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: ChargingPointRecord[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            location: row.location,
            district: row.district,
            status: 'متاح الآن',
            statusType: 'available',
            hours: row.hours || '24/7',
            chargingTypes: row.charging_types || ['12V', 'USB'],
            charging_types: row.charging_types,
            distance: '0 كم',
            rating: 5.0,
            reviews: 0,
            phone: row.phone || '+967-1-234-000',
            features: row.features || ['مظلة', 'مقاعد'],
            price: row.price || 'مجاني',
          }));

          setPoints(mapped);
        } else {
          // لا توجد بيانات حقيقية بعد → لا نعرض نقاط
          setPoints([]);
        }
      } catch (err: any) {
        console.error('Error loading charging points:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل نقاط الشحن');
        // في حالة الخطأ لا نعرض نقاط حتى لا نستخدم بيانات تجريبية
        setPoints([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // خيارات الفلترة
  const areaOptions = [
    { id: 'all', name: 'جميع المناطق', count: 22, icon: '📍' },
    { id: 'عدن كريتر', name: 'عدن كريتر', count: 3, icon: '🏛️' },
    { id: 'المعلا', name: 'المعلا', count: 3, icon: '🏢' },
    { id: 'التواهي', name: 'التواهي', count: 2, icon: '⚓' },
    { id: 'خور مكسر', name: 'خور مكسر', count: 2, icon: '🌊' },
    { id: 'المنصورة', name: 'المنصورة', count: 2, icon: '🏪' },
    { id: 'الشيخ عثمان', name: 'الشيخ عثمان', count: 2, icon: '🕌' },
    { id: 'البريقة', name: 'البريقة', count: 2, icon: '🏭' },
    { id: 'دار سعد', name: 'دار سعد', count: 2, icon: '🏘️' },
    { id: 'القلوعه', name: 'القلوعة', count: 1, icon: '🏙️' },
    { id: 'الممدارة', name: 'الممدارة', count: 1, icon: '🏙️' }
  ];

  const statusOptions = [
    { id: 'all', name: 'جميع الحالات', count: 20, icon: '⚡' },
    { id: 'available', name: 'متاح', count: 16, icon: '✅' },
    { id: 'busy', name: 'مشغول', count: 3, icon: '⏳' },
    { id: 'out_of_service', name: 'خارج الخدمة', count: 1, icon: '❌' }
  ];

  const chargingTypeOptions = [
    { id: 'all', name: 'جميع الأنواع', count: 20, icon: '🔌' },
    { id: '12V', name: '12V', count: 12, icon: '🔋' },
    { id: 'USB', name: 'USB', count: 16, icon: '📱' },
    { id: '220V', name: '220V', count: 8, icon: '⚡' },
    { id: 'Wireless', name: 'Wireless', count: 5, icon: '📶' }
  ];

  // حساب الأعداد الحقيقية لكل فلتر اعتماداً على بيانات النقاط
  const areaCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = points.length;

    points.forEach(point => {
      const id = point.district || 'other';
      counts[id] = (counts[id] || 0) + 1;
    });

    areaOptions.forEach(opt => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [points, areaOptions]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = points.length;

    points.forEach(point => {
      const statusType = (point.statusType || (point as any).status_type || 'available') as string;
      counts[statusType] = (counts[statusType] || 0) + 1;
    });

    statusOptions.forEach(opt => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [points, statusOptions]);

  const chargingTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = points.length;

    points.forEach(point => {
      (point.chargingTypes || []).forEach(type => {
        counts[type] = (counts[type] || 0) + 1;
      });
    });

    chargingTypeOptions.forEach(opt => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [points, chargingTypeOptions]);

  // منطق الفلترة بدون حقل البحث
  const filteredPoints = points.filter(point => {
    const matchesArea = selectedArea === "all" || point.district === selectedArea;
    const statusType = (point.statusType || (point as any).status_type || 'available') as string;
    const matchesStatus = selectedStatus === "all" || statusType === selectedStatus;
    const matchesChargingType = selectedChargingType === "all" || (point.chargingTypes || []).includes(selectedChargingType);
    return matchesArea && matchesStatus && matchesChargingType;
  });

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case "available":
        return "text-green-600 bg-green-50 border-green-200";
      case "busy":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "out_of_service":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getChargingTypeIcon = (type: string) => {
    switch (type) {
      case "12V":
        return <Battery className="w-3 h-3" />;
      case "USB":
        return <Zap className="w-3 h-3" />;
      case "220V":
        return <Sun className="w-3 h-3" />;
      case "Wireless":
        return <Wifi className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
    }
  };

  // دوال إدارة النموذج
  const handleAddPoint = async () => {
    if (!newPoint.name || !newPoint.location || !newPoint.district) {
      alert('يرجى ملء الحقول المطلوبة (الاسم، الموقع، المديرية)');
      return;
    }

    try {
      // تجهيز بيانات Supabase بناءً على جدول charging_points
      const payload = {
        name: newPoint.name,
        location: newPoint.location,
        district: newPoint.district,
        hours: newPoint.hours || null,
        charging_types:
          newPoint.chargingTypes && newPoint.chargingTypes.length > 0
            ? newPoint.chargingTypes
            : ["12V", "USB"],
        phone: newPoint.phone || null,
        features:
          newPoint.features && newPoint.features.length > 0
            ? newPoint.features
            : ["مظلة", "مقاعد"],
        price: newPoint.price || null,
      };

      console.log("إرسال نقطة شحن إلى Supabase:", payload);

      const { data, error } = await supabase
        .from("charging_points")
        .insert(payload)
        .select();

      if (error) {
        console.error("خطأ في حفظ نقطة الشحن:", error);
        alert("فشل في حفظ نقطة الشحن: " + error.message);
        return;
      }

      console.log("تم حفظ نقطة الشحن في Supabase:", data);
      alert("تم إرسال النقطة بنجاح! سيتم مراجعتها والموافقة عليها من قبل الإدارة.");

      // إعادة تعيين النموذج بعد الحفظ
      setNewPoint({
        name: "",
        location: "",
        district: "",
        hours: "",
        chargingTypes: [],
        phone: "",
        features: [],
        price: "",
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error("استثناء أثناء حفظ نقطة الشحن:", err);
      alert("حدث خطأ غير متوقع أثناء حفظ نقطة الشحن");
    }
  };

  const handleChargingTypeChange = (type: string) => {
    setNewPoint(prev => ({
      ...prev,
      chargingTypes: prev.chargingTypes.includes(type)
        ? prev.chargingTypes.filter(t => t !== type)
        : [...prev.chargingTypes, type]
    }));
  };

  const handleFeatureAdd = (feature: string) => {
    if (feature.trim() && !newPoint.features.includes(feature.trim())) {
      setNewPoint(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
    }
  };

  const handleFeatureRemove = (feature: string) => {
    setNewPoint(prev => ({
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
            <h1 className="text-xl font-bold text-white">نقاط الشحن الشمسي</h1>
          </div>
        </div>

        {/* تم حذف شريط البحث بناءً على طلب المستخدم */}

        {/* أزرار الفلترة */}
        <div className="mb-6 space-y-3">
          {/* فلتر المنطقة */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsAreaOpen(!isAreaOpen);
                if (!isAreaOpen) {
                  setIsStatusOpen(false);
                  setIsChargingTypeOpen(false);
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

          {/* فلتر الحالة */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsStatusOpen(!isStatusOpen);
                if (!isStatusOpen) {
                  setIsAreaOpen(false);
                  setIsChargingTypeOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{statusOptions.find(opt => opt.id === selectedStatus)?.icon}</span>
                <span>{statusOptions.find(opt => opt.id === selectedStatus)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isStatusOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isStatusOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {statusOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedStatus(option.id);
                      setIsStatusOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {statusCounts[option.id] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* فلتر نوع الشحن */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsChargingTypeOpen(!isChargingTypeOpen);
                if (!isChargingTypeOpen) {
                  setIsAreaOpen(false);
                  setIsStatusOpen(false);
                }
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{chargingTypeOptions.find(opt => opt.id === selectedChargingType)?.icon}</span>
                <span>{chargingTypeOptions.find(opt => opt.id === selectedChargingType)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isChargingTypeOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isChargingTypeOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {chargingTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedChargingType(option.id);
                      setIsChargingTypeOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                    </span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {chargingTypeCounts[option.id] ?? 0}
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
            عرض {filteredPoints.length} من {points.length} نقطة شحن
          </p>
        </div>

        {/* زر إضافة نقطة شحن جديدة */}
        <div className="mb-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Sun className="w-5 h-5" />
            {showAddForm ? 'إلغاء إضافة نقطة شحن' : 'إضافة نقطة شحن جديدة'}
          </button>
        </div>

        {/* نموذج إضافة نقطة شحن جديدة */}
        {showAddForm && (
          <div className="mb-6 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-400" />
              إضافة نقطة شحن جديدة
            </h3>
            
            <div className="space-y-4">
              {/* اسم النقطة */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  اسم النقطة *
                </label>
                <input
                  type="text"
                  value={newPoint.name}
                  onChange={(e) => setNewPoint(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: مسجد النور - عدن كريتر"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* الموقع */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  الموقع *
                </label>
                <input
                  type="text"
                  value={newPoint.location}
                  onChange={(e) => setNewPoint(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="مثال: شارع الجمهورية"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
          </div>
          
              {/* المديرية */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  المديرية *
            </label>
            <select
                  value={newPoint.district}
                  onChange={(e) => setNewPoint(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="">اختر المديرية</option>
                  {areaOptions.filter(opt => opt.id !== 'all').map(option => (
                    <option key={option.id} value={option.name}>
                      {option.name}
                    </option>
                  ))}
            </select>
              </div>

              {/* ساعات العمل */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  ساعات العمل
                </label>
                <input
                  type="text"
                  value={newPoint.hours}
                  onChange={(e) => setNewPoint(prev => ({ ...prev, hours: e.target.value }))}
                  placeholder="مثال: 24/7 أو 6:00 ص - 10:00 م"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* أنواع الشحن */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  أنواع الشحن
                </label>
                <div className="flex flex-wrap gap-2">
                  {['12V', 'USB', '220V', 'Wireless'].map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPoint.chargingTypes.includes(type)}
                        onChange={() => handleChargingTypeChange(type)}
                        className="w-4 h-4 text-yellow-600 bg-teal-700 border-teal-600 rounded focus:ring-cyan-400"
                      />
                      <span className="text-sky-300 text-sm flex items-center gap-1">
                        {getChargingTypeIcon(type)}
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={newPoint.phone}
                  onChange={(e) => setNewPoint(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="مثال: +967-1-234-567"
                  className="w-full p-3 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* السعر */}
              <div>
                <label className="block text-sm font-medium text-sky-300 mb-2">
                  السعر
                </label>
                <input
                  type="text"
                  value={newPoint.price}
                  onChange={(e) => setNewPoint(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="مثال: مجاني أو 5 ريال/ساعة"
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
                  {newPoint.features.map((feature, index) => (
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
                  onClick={handleAddPoint}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  إضافة النقطة
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

        {/* قائمة نقاط الشحن */}
        <div className="space-y-4">
          {filteredPoints.map((point) => (
            <div
              key={point.id}
              className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4 hover:bg-teal-700 transition-all"
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{point.name}</h3>
                    <p className="text-sm text-sky-300">{point.location} - {point.district}</p>
                    <p className="text-xs text-sky-400">{point.distance} منك</p>
                    </div>
                  </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${point.statusType === 'available' ? 'bg-green-400' : point.statusType === 'busy' ? 'bg-orange-400' : 'bg-red-400'} rounded-full`}></div>
                  <span className="text-green-400 text-sm font-medium">{point.status}</span>
                </div>
              </div>

              {/* الميزات */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                    {point.chargingTypes.map((type, index) => (
                      <span
                        key={index}
                      className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                      {getChargingTypeIcon(type)}
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

              {/* التفاصيل */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sky-300 text-sm">
                  <Clock className="w-4 h-4 ml-1" />
                  {point.hours}
                </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <span className="ml-1">السعر:</span>
                  <span className="font-medium text-yellow-400 mr-2">{point.price}</span>
                </div>

                <div className="flex items-center text-sky-300 text-sm">
                  <div className="flex items-center ml-1">
                    <Star className="w-4 h-4 text-yellow-400 ml-1" />
                    <span className="font-medium">{point.rating}</span>
                    <span className="mr-1">({point.reviews} تقييم)</span>
                  </div>
                </div>

                {/* المميزات الإضافية */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {point.features.map((feature, index) => (
                      <span
                      key={index}
                      className="bg-teal-700 text-sky-300 px-2 py-1 rounded text-xs"
                      >
                      {feature}
                      </span>
                    ))}
                </div>
              </div>

              {/* أزرار العمل */}
              <div className="flex gap-3">
                <button 
                  onClick={() => window.open(`tel:${point.phone}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Phone className="w-4 h-4 ml-1" />
                  اتصال
                </button>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${point.coordinates[0]},${point.coordinates[1]}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Navigation className="w-4 h-4 ml-1" />
                  اتجاهات
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPoints.length === 0 && (
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
