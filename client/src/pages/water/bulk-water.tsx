import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { 
  Droplets, 
  MapPin, 
  Phone, 
  Star,
  ArrowLeft,
  Truck,
  Shield,
  CheckCircle,
  Plus,
  X,
  Save
} from 'lucide-react';

const BulkWaterPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedWater, setSelectedWater] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({
    brand: '',
    type: '',
    district: '',
    location: '',
    phone: '',
    delivery: '',
    offers: ''
  });

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsFilterOpen(false);
        setIsDistrictOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const bulkWaterOptions = [
    {
      id: 'water1',
      brand: 'مياه الريان',
      type: 'مياه طبيعية',
      size: 'كرتون 24 زجاجة',
      bottleSize: '1.5 لتر',
      price: 8000,
      oldPrice: 9000,
      status: 'متوفر',
      statusColor: 'green',
      rating: 5,
      reviews: 156,
      location: 'كريتر',
      district: 'كريتر',
      phone: '+967 123 456 789',
      features: ['مياه طبيعية', 'ISO معتمدة', 'خالية من الكلور'],
      delivery: 'توصيل مجاني للطلبات +5,000 ريال',
      offers: ['خصم 10% للطلبات الكبيرة', 'اشتراك شهري متاح'],
      coordinates: { lat: 12.7800, lng: 44.9800 }
    },
    {
      id: 'water2',
      brand: 'مياه الأصيل',
      type: 'مياه معدنية',
      size: 'كرتون 12 زجاجة',
      bottleSize: '2 لتر',
      price: 6500,
      oldPrice: null,
      status: 'متوفر',
      statusColor: 'green',
      rating: 4,
      reviews: 89,
      location: 'المنصورة',
      district: 'المنصورة',
      phone: '+967 987 654 321',
      features: ['مياه معدنية', 'معادن طبيعية', 'نقاء عالي'],
      delivery: 'توصيل مجاني للطلبات +3,000 ريال',
      offers: ['خصم 15% للطلبات الكبيرة'],
      coordinates: { lat: 12.7900, lng: 44.9900 }
    },
    {
      id: 'water3',
      brand: 'مياه النبع',
      type: 'مياه طبيعية',
      size: 'كرتون 20 زجاجة',
      bottleSize: '1 لتر',
      price: 5500,
      oldPrice: 6500,
      status: 'متوفر',
      statusColor: 'green',
      rating: 4,
      reviews: 203,
      location: 'الشيخ عثمان',
      district: 'الشيخ عثمان',
      phone: '+967 234 567 890',
      features: ['مياه طبيعية', 'نقاء 99.9%', 'معبأة محلياً'],
      delivery: 'توصيل مجاني للطلبات +4,000 ريال',
      offers: ['خصم 20% للطلبات الكبيرة', 'توصيل سريع'],
      coordinates: { lat: 12.7700, lng: 44.9700 }
    },
    {
      id: 'water4',
      brand: 'مياه الجبل',
      type: 'مياه معدنية',
      size: 'كرتون 18 زجاجة',
      bottleSize: '1.5 لتر',
      price: 7200,
      oldPrice: null,
      status: 'متوفر',
      statusColor: 'green',
      rating: 5,
      reviews: 134,
      location: 'خور مكسر',
      district: 'خور مكسر',
      phone: '+967 345 678 901',
      features: ['مياه معدنية', 'من الجبال', 'غنية بالمعادن'],
      delivery: 'توصيل مجاني للطلبات +6,000 ريال',
      offers: ['خصم 12% للطلبات الكبيرة', 'اشتراك ربع سنوي'],
      coordinates: { lat: 12.7600, lng: 44.9600 }
    },
    {
      id: 'water5',
      brand: 'مياه العين',
      type: 'مياه طبيعية',
      size: 'كرتون 30 زجاجة',
      bottleSize: '0.5 لتر',
      price: 4500,
      oldPrice: 5500,
      status: 'متوفر',
      statusColor: 'green',
      rating: 4,
      reviews: 78,
      location: 'البريقة',
      district: 'البريقة',
      phone: '+967 456 789 012',
      features: ['مياه طبيعية', 'حجم صغير', 'مناسبة للأطفال'],
      delivery: 'توصيل مجاني للطلبات +2,000 ريال',
      offers: ['خصم 25% للطلبات الكبيرة', 'توصيل يومي'],
      coordinates: { lat: 12.7500, lng: 44.9500 }
    },
    {
      id: 'water6',
      brand: 'مياه البحر',
      type: 'مياه معدنية',
      size: 'كرتون 15 زجاجة',
      bottleSize: '2.5 لتر',
      price: 9000,
      oldPrice: 11000,
      status: 'متوفر',
      statusColor: 'green',
      rating: 5,
      reviews: 167,
      location: 'دار سعد',
      district: 'دار سعد',
      phone: '+967 567 890 123',
      features: ['مياه معدنية', 'حجم كبير', 'نقاء عالي'],
      delivery: 'توصيل مجاني للطلبات +7,000 ريال',
      offers: ['خصم 18% للطلبات الكبيرة', 'اشتراك سنوي'],
      coordinates: { lat: 12.7400, lng: 44.9400 }
    },
    {
      id: 'water7',
      brand: 'مياه الينابيع',
      type: 'مياه طبيعية',
      size: 'كرتون 25 زجاجة',
      bottleSize: '1.25 لتر',
      price: 6800,
      oldPrice: null,
      status: 'متوفر',
      statusColor: 'green',
      rating: 4,
      reviews: 92,
      location: 'المعلا',
      district: 'المعلا',
      phone: '+967 678 901 234',
      features: ['مياه طبيعية', 'من الينابيع', 'خالية من المواد الكيميائية'],
      delivery: 'توصيل مجاني للطلبات +5,500 ريال',
      offers: ['خصم 14% للطلبات الكبيرة', 'توصيل فوري'],
      coordinates: { lat: 12.7300, lng: 44.9300 }
    },
    {
      id: 'water8',
      brand: 'مياه الجنة',
      type: 'مياه معدنية',
      size: 'كرتون 16 زجاجة',
      bottleSize: '1.8 لتر',
      price: 7800,
      oldPrice: 8800,
      status: 'متوفر',
      statusColor: 'green',
      rating: 5,
      reviews: 145,
      location: 'التواهي',
      district: 'التواهي',
      phone: '+967 789 012 345',
      features: ['مياه معدنية', 'نقاء 100%', 'معبأة بأعلى المعايير'],
      delivery: 'توصيل مجاني للطلبات +6,500 ريال',
      offers: ['خصم 16% للطلبات الكبيرة', 'اشتراك نصف سنوي'],
      coordinates: { lat: 12.7200, lng: 44.9200 }
    }
  ];

  const [approvedCompanies, setApprovedCompanies] = useState<typeof bulkWaterOptions | null>(null);

  // خيارات الفلترة
  const filterOptions = [
    { id: 'all', name: 'جميع المنتجات', icon: '💧' },
    { id: 'natural', name: 'مياه طبيعية', icon: '🌿' },
    { id: 'mineral', name: 'مياه معدنية', icon: '⛰️' },
    { id: 'low-price', name: 'أقل من 6,000 ريال', icon: '💰' },
    { id: 'high-price', name: 'أكثر من 7,000 ريال', icon: '💎' },
    { id: 'high-rating', name: 'تقييم 5 نجوم', icon: '⭐' }
  ];

  // المناطق
  const districts = [
    { id: 'all', name: 'جميع المناطق', count: 10 },
    { id: 'كريتر', name: 'كريتر', count: 1 },
    { id: 'المنصورة', name: 'المنصورة', count: 1 },
    { id: 'الشيخ عثمان', name: 'الشيخ عثمان', count: 1 },
    { id: 'خور مكسر', name: 'خور مكسر', count: 1 },
    { id: 'البريقة', name: 'البريقة', count: 1 },
    { id: 'دار سعد', name: 'دار سعد', count: 1 },
    { id: 'المعلا', name: 'المعلا', count: 1 },
    { id: 'التواهي', name: 'التواهي', count: 1 },
    { id: 'القلوعه', name: 'القلوعة', count: 1 },
    { id: 'الممدارة', name: 'الممدارة', count: 1 }
  ];

  // جلب شركات المياه المعتمدة من Supabase
  useEffect(() => {
    const fetchApprovedCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('bulk_water_companies')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((c: any, index: number) => ({
            id: c.id || `supabase-${index}`,
            brand: c.brand || 'شركة مياه بدون اسم',
            type: c.product_type || 'نوع غير محدد',
            size: '',
            bottleSize: '',
            price: 0,
            oldPrice: null,
            status: 'متوفر',
            statusColor: 'green',
            rating: 5,
            reviews: 0,
            location: c.location || 'غير محدد',
            district: c.district || 'غير محددة',
            phone: c.phone || '',
            features: [],
            delivery: c.delivery_info || '',
            offers: c.offers ? String(c.offers).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
            coordinates: null
          }));

          setApprovedCompanies(mapped as any);
        } else {
          setApprovedCompanies(null);
        }
      } catch (err: any) {
        console.error('Error fetching bulk_water_companies:', err);
        setError('حدث خطأ أثناء جلب شركات المياه المعتمدة');
        setApprovedCompanies(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedCompanies();
  }, []);

  const currentCompanies = approvedCompanies && approvedCompanies.length > 0 ? approvedCompanies : bulkWaterOptions;

  // فلترة المنتجات
  const filteredWaters = currentCompanies.filter(water => {
    const matchesDistrict = selectedDistrict === 'all' || water.district === selectedDistrict;
    
    const matchesFilter = (() => {
      switch (selectedFilter) {
        case 'natural':
          return water.type.includes('طبيعية');
        case 'mineral':
          return water.type.includes('معدنية');
        case 'low-price':
          return water.price < 6000;
        case 'high-price':
          return water.price > 7000;
        case 'high-rating':
          return water.rating === 5;
        default:
          return true;
      }
    })();

    return matchesDistrict && matchesFilter;
  });

  const handleNewCompanyChange = (field: string, value: string) => {
    setNewCompany(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNewCompany = async () => {
    if (!newCompany.brand || !newCompany.type || !newCompany.district || !newCompany.location || !newCompany.phone) {
      alert('يرجى ملء الحقول المطلوبة (اسم الشركة، نوع المنتج، المديرية، الموقع، رقم الهاتف)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase.from('bulk_water_companies').insert([
        {
          brand: newCompany.brand,
          product_type: newCompany.type,
          district: newCompany.district,
          location: newCompany.location,
          phone: newCompany.phone,
          delivery_info: newCompany.delivery || null,
          offers: newCompany.offers || null,
          approval_status: 'pending'
        }
      ]);

      if (error) throw error;

      alert('تم إرسال النقطة بنجاح! سيتم مراجعتها والموافقة عليه');

      setNewCompany({
        brand: '',
        type: '',
        district: '',
        location: '',
        phone: '',
        delivery: '',
        offers: ''
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error submitting bulk water company:', err);
      alert('حدث خطأ أثناء إرسال شركة المياه. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSubscribe = (waterId: string) => {
    const water = currentCompanies.find(w => w.id === waterId);
    alert(`تم إرسال طلب اشتراك شهري لـ ${water?.brand}`);
  };

  const handleContact = (waterId: string) => {
    const water = currentCompanies.find(w => w.id === waterId);
    if (water) {
      const phoneNumber = water.phone.replace(/\D/g, ''); // إزالة جميع الرموز غير الرقمية
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleDirections = (waterId: string) => {
    const water = currentCompanies.find(w => w.id === waterId);
    if (water && water.coordinates) {
      const { lat, lng } = water.coordinates;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert('موقع المنتج غير متوفر');
    }
  };

  const getStatusColor = (statusColor: string) => {
    switch (statusColor) {
      case 'green': return 'bg-green-400';
      case 'orange': return 'bg-orange-400';
      case 'red': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/water')}
            className="p-2 text-sky-300 hover:bg-teal-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <h1 className="text-xl font-bold text-white">مياه معبأة بالجملة</h1>
          </div>
        </div>

        {/* زر إضافة شركة مياه */}
        <div className="mb-4 flex justify-center">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" />
            اضف شركة مياه
          </Button>
        </div>

        {/* أزرار الفلترة */}
        <div className="mb-6 space-y-3">
          {/* فلتر النوع */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                if (!isFilterOpen) setIsDistrictOpen(false); // إغلاق الفلتر الآخر عند فتح هذا الفلتر
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>{filterOptions.find(opt => opt.id === selectedFilter)?.icon}</span>
                <span>{filterOptions.find(opt => opt.id === selectedFilter)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedFilter(option.id);
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center gap-2 transition-colors"
                  >
                    <span>{option.icon}</span>
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* فلتر المناطق */}
          <div className="relative dropdown-container">
            <button
              onClick={() => {
                setIsDistrictOpen(!isDistrictOpen);
                if (!isDistrictOpen) setIsFilterOpen(false); // إغلاق الفلتر الآخر عند فتح هذا الفلتر
              }}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
            >
              <span className="flex items-center gap-2">
                <span>📍</span>
                <span>{districts.find(d => d.id === selectedDistrict)?.name}</span>
              </span>
              <span className={`transform transition-transform ${isDistrictOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isDistrictOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                {districts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => {
                      setSelectedDistrict(district.id);
                      setIsDistrictOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors"
                  >
                    <span>{district.name}</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {district.count}
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
            عرض {filteredWaters.length} من {bulkWaterOptions.length} منتج
          </p>
        </div>

        {/* قائمة المياه المعبأة */}
        <div className="space-y-4">
          {filteredWaters.map((water) => (
            <div 
              key={water.id} 
              className={`cursor-pointer transition-all rounded-xl p-4 border ${
                selectedWater === water.id 
                  ? 'bg-teal-700 border-cyan-400 ring-2 ring-cyan-400' 
                  : 'bg-teal-800 bg-opacity-80 border-teal-600 hover:bg-teal-700'
              }`}
              onClick={() => setSelectedWater(water.id)}
            >

              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💧</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{water.brand}</h3>
                    <p className="text-sm text-sky-300">{water.type}</p>
                    <p className="text-xs text-sky-400">{water.size} - {water.bottleSize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${getStatusColor(water.statusColor)} rounded-full`}></div>
                  <span className="text-green-400 text-sm font-medium">{water.status}</span>
                </div>
              </div>

              {/* الميزات */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {water.features.map((feature, index) => (
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
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{water.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{water.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{water.delivery}</span>
                </div>
              </div>

              {/* التقييم */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < water.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                  />
                ))}
                <span className="text-sm text-sky-300 ml-1">({water.reviews})</span>
              </div>

              {/* السعر */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-cyan-400">{water.price.toLocaleString()} ريال</span>
                  {water.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">{water.oldPrice.toLocaleString()} ريال</span>
                  )}
                </div>
              </div>

              {/* العروض */}
              <div className="mb-4">
                <h4 className="text-sky-300 font-medium mb-2">العروض المتاحة:</h4>
                <ul className="space-y-1">
                  {water.offers.map((offer, index) => (
                    <li key={index} className="text-sm text-sky-300 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>{offer}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* الأزرار */}
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContact(water.id);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  تواصل
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirections(water.id);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  الاتجاهات
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* نموذج إضافة شركة مياه جديدة */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Droplets className="w-5 h-5" />
                  إضافة شركة مياه جديدة
                </h3>
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-white bg-transparent hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* اسم الشركة / العلامة التجارية */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم شركة المياه / العلامة التجارية *
                  </label>
                  <input
                    type="text"
                    value={newCompany.brand}
                    onChange={(e) => handleNewCompanyChange('brand', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: مياه الريان"
                  />
                </div>

                {/* نوع المنتج */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    نوع المنتج *
                  </label>
                  <input
                    type="text"
                    value={newCompany.type}
                    onChange={(e) => handleNewCompanyChange('type', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: مياه طبيعية، مياه معدنية"
                  />
                </div>

                {/* المديرية */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المديرية *
                  </label>
                  <select
                    value={newCompany.district}
                    onChange={(e) => handleNewCompanyChange('district', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر المديرية</option>
                    {districts.filter(d => d.id !== 'all').map(district => (
                      <option key={district.id} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* الموقع */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الموقع *
                  </label>
                  <input
                    type="text"
                    value={newCompany.location}
                    onChange={(e) => handleNewCompanyChange('location', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: كريتر، شارع الجمهورية"
                  />
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="text"
                    value={newCompany.phone}
                    onChange={(e) => handleNewCompanyChange('phone', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: +967 123 456 789"
                  />
                </div>

                {/* توصيل / ملاحظات التوصيل */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    معلومات التوصيل
                  </label>
                  <input
                    type="text"
                    value={newCompany.delivery}
                    onChange={(e) => handleNewCompanyChange('delivery', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: توصيل مجاني للطلبات فوق 5,000 ريال"
                  />
                </div>

                {/* العروض */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    العروض (افصل بين كل عرض و الآخر بفاصلة)
                  </label>
                  <textarea
                    value={newCompany.offers}
                    onChange={(e) => handleNewCompanyChange('offers', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
                    placeholder="مثال: خصم 10% للطلبات الكبيرة، اشتراك شهري متاح"
                  />
                </div>
              </div>

              {/* أزرار النموذج */}
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSubmitNewCompany}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  إرسال الطلب
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* زر العودة */}
        <div className="mt-6">
          <Button 
            onClick={() => setLocation('/water')}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة لخدمات المياه
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BulkWaterPage;
