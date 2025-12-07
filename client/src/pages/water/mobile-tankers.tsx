import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { 
  Truck, 
  Phone, 
  Star,
  ArrowLeft,
  Clock,
  Filter,
  ChevronDown,
  Plus,
  X,
  Save,
  Search,
  DollarSign,
  Droplets
} from 'lucide-react';

const MobileTankersPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedTanker, setSelectedTanker] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvedTankers, setApprovedTankers] = useState<typeof mobileTankers | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [newTanker, setNewTanker] = useState({
    driverName: '',
    capacity: '',
    price: '',
    location: '',
    district: '',
    phone: '',
    workingHours: '',
    features: [] as string[],
    images: [] as string[]
  });

  // مديريات عدن
  const districts = [
    { id: 'all', name: 'جميع المديريات', count: 10 },
    { id: 'كريتر', name: 'مديرية كريتر', count: 1 },
    { id: 'المعلا', name: 'مديرية المعلا', count: 1 },
    { id: 'التواهي', name: 'مديرية التواهي', count: 1 },
    { id: 'الشيخ عثمان', name: 'مديرية الشيخ عثمان', count: 1 },
    { id: 'المنصورة', name: 'مديرية المنصورة', count: 1 },
    { id: 'دار سعد', name: 'مديرية دار سعد', count: 1 },
    { id: 'البريقة', name: 'مديرية البريقة', count: 1 },
    { id: 'خور مكسر', name: 'مديرية خور مكسر', count: 1 },
    { id: 'القلوعه', name: 'مديرية القلوعة', count: 1 },
    { id: 'الممدارة', name: 'مديرية الممدارة', count: 1 }
  ];

  const mobileTankers = [
    {
      id: 'tanker1',
      driverName: 'أحمد محمد العيدروس',
      capacity: '2000 لتر',
      price: '25,000 ريال',
      location: 'كريتر، شارع الجمهورية',
      district: 'كريتر',
      phone: '+967-2-234567',
      estimatedTime: '15-20 دقيقة',
      rating: 4.8,
      reviews: 156,
      experience: '5 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'متوسط',
      coordinates: { lat: 12.7794, lng: 45.0367 },
      features: ['مياه نظيفة', 'توصيل سريع', 'أسعار مناسبة', 'خدمة 24/7'],
      workingHours: '24/7',
      licenseNumber: 'AD-2024-001'
    },
    {
      id: 'tanker2',
      driverName: 'سالم علي المطري',
      capacity: '1500 لتر',
      price: '20,000 ريال',
      location: 'المنصورة، شارع الخمسين',
      district: 'المنصورة',
      phone: '+967-2-345678',
      estimatedTime: '30-35 دقيقة',
      rating: 4.5,
      reviews: 89,
      experience: '3 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'صغير',
      coordinates: { lat: 12.8000, lng: 45.0300 },
      features: ['مياه معقمة', 'سعر اقتصادي', 'خدمة سريعة', 'موثوق'],
      workingHours: '6 صباحاً - 10 مساءً',
      licenseNumber: 'AD-2024-002'
    },
    {
      id: 'tanker3',
      driverName: 'محمد حسن الشامي',
      capacity: '3000 لتر',
      price: '35,000 ريال',
      location: 'التواهي، شارع الميناء',
      district: 'التواهي',
      phone: '+967-2-456789',
      estimatedTime: '45-50 دقيقة',
      rating: 4.9,
      reviews: 203,
      experience: '8 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'كبير',
      coordinates: { lat: 12.7900, lng: 45.0200 },
      features: ['سعة كبيرة', 'مياه عالية الجودة', 'خدمة احترافية', 'ضمان الجودة'],
      workingHours: '5 صباحاً - 11 مساءً',
      licenseNumber: 'AD-2024-003'
    },
    {
      id: 'tanker4',
      driverName: 'عبدالله سالم النقيب',
      capacity: '2500 لتر',
      price: '30,000 ريال',
      location: 'الشيخ عثمان، شارع النور',
      district: 'الشيخ عثمان',
      phone: '+967-2-567890',
      estimatedTime: '20-25 دقيقة',
      rating: 4.7,
      reviews: 134,
      experience: '6 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'متوسط',
      coordinates: { lat: 12.8500, lng: 45.0000 },
      features: ['مياه نظيفة', 'توصيل مجاني', 'خدمة ممتازة', 'أسعار عادلة'],
      workingHours: '24/7',
      licenseNumber: 'AD-2024-004'
    },
    {
      id: 'tanker5',
      driverName: 'يوسف أحمد البكري',
      capacity: '1800 لتر',
      price: '22,000 ريال',
      location: 'المعلا، شارع الميناء',
      district: 'المعلا',
      phone: '+967-2-678901',
      estimatedTime: '18-22 دقيقة',
      rating: 4.6,
      reviews: 98,
      experience: '4 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'متوسط',
      coordinates: { lat: 12.7947, lng: 45.0264 },
      features: ['مياه معقمة', 'سعر مناسب', 'خدمة سريعة', 'موثوق'],
      workingHours: '6 صباحاً - 10 مساءً',
      licenseNumber: 'AD-2024-005'
    },
    {
      id: 'tanker6',
      driverName: 'خالد محمد الجابري',
      capacity: '4000 لتر',
      price: '45,000 ريال',
      location: 'دار سعد، شارع الثانوية',
      district: 'دار سعد',
      phone: '+967-2-789012',
      estimatedTime: '35-40 دقيقة',
      rating: 4.8,
      reviews: 167,
      experience: '7 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'كبير جداً',
      coordinates: { lat: 12.8200, lng: 45.0500 },
      features: ['سعة كبيرة جداً', 'مياه عالية الجودة', 'خدمة احترافية', 'ضمان شامل'],
      workingHours: '5 صباحاً - 11 مساءً',
      licenseNumber: 'AD-2024-006'
    },
    {
      id: 'tanker7',
      driverName: 'علي سالم الحكيمي',
      capacity: '1200 لتر',
      price: '18,000 ريال',
      location: 'البريقة، شارع فقم',
      district: 'البريقة',
      phone: '+967-2-890123',
      estimatedTime: '12-15 دقيقة',
      rating: 4.4,
      reviews: 76,
      experience: '3 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'صغير',
      coordinates: { lat: 12.7500, lng: 44.9000 },
      features: ['مياه نظيفة', 'سعر اقتصادي', 'خدمة سريعة', 'موثوق'],
      workingHours: '6 صباحاً - 9 مساءً',
      licenseNumber: 'AD-2024-007'
    },
    {
      id: 'tanker8',
      driverName: 'محمود عبدالله السقاف',
      capacity: '3500 لتر',
      price: '40,000 ريال',
      location: 'خور مكسر، شارع المطار',
      district: 'خور مكسر',
      phone: '+967-2-901234',
      estimatedTime: '50-55 دقيقة',
      rating: 4.9,
      reviews: 189,
      experience: '9 سنوات خبرة',
      icon: '🚛',
      image: '🚛',
      images: [],
      category: 'كبير',
      coordinates: { lat: 12.8300, lng: 45.0400 },
      features: ['سعة كبيرة', 'مياه عالية الجودة', 'خدمة احترافية', 'ضمان الجودة'],
      workingHours: '5 صباحاً - 11 مساءً',
      licenseNumber: 'AD-2024-008'
    }
  ];

  // جلب الصهاريج المعتمدة من Supabase
  useEffect(() => {
    const fetchApprovedTankers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('mobile_tankers')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((t: any, index: number) => ({
            id: t.id || `supabase-${index}`,
            driverName: t.driver_name || 'سائق غير معروف',
            capacity: t.capacity || '-',
            price: t.price || '-',
            location: t.location || 'غير محدد',
            district: t.district || 'غير محددة',
            phone: t.phone || '',
            estimatedTime: t.estimated_time || 'غير محدد',
            rating: t.rating ?? 4.5,
            reviews: t.reviews ?? 0,
            experience: t.experience || '',
            icon: '🚛',
            image: '🚛',
            images: t.images || [],
            category: t.category || 'متوسط',
            coordinates: t.coordinates || { lat: 0, lng: 0 },
            features: t.features || ['مياه نظيفة', 'خدمة سريعة'],
            workingHours: t.working_hours || '',
            licenseNumber: t.license_number || ''
          }));

          setApprovedTankers(mapped as any);
        } else {
          setApprovedTankers(null);
        }
      } catch (err: any) {
        console.error('Error fetching approved mobile_tankers:', err);
        setError('حدث خطأ أثناء جلب بيانات الصهاريج');
        setApprovedTankers(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedTankers();
  }, []);

  const currentTankers = approvedTankers && approvedTankers.length > 0 ? approvedTankers : mobileTankers;

  // خيارات الفلترة
  const filterOptions = [
    { id: 'all', name: 'جميع الناقلات', count: currentTankers.length },
    { id: 'صغير', name: 'صغير (أقل من 2000 لتر)', count: currentTankers.filter(t => t.category === 'صغير').length },
    { id: 'متوسط', name: 'متوسط (2000-3000 لتر)', count: currentTankers.filter(t => t.category === 'متوسط').length },
    { id: 'كبير', name: 'كبير (أكثر من 3000 لتر)', count: currentTankers.filter(t => t.category === 'كبير' || t.category === 'كبير جداً').length },
    { id: 'low-price', name: 'أقل من 25,000', count: currentTankers.filter(t => parseInt(t.price.replace(/[^\d]/g, '')) < 25000).length },
    { id: 'high-rating', name: 'تقييم عالي (4.5+)', count: currentTankers.filter(t => t.rating >= 4.5).length }
  ];


  // فلترة الناقلات
  const filteredTankers = currentTankers.filter(tanker => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'low-price' && parseInt(tanker.price.replace(/[^\d]/g, '')) < 25000) ||
      (selectedFilter === 'high-rating' && tanker.rating >= 4.5) ||
      tanker.category === selectedFilter;
    
    const matchesDistrict = selectedDistrict === 'all' || tanker.district === selectedDistrict;
    
    const matchesSearch = searchTerm === '' || 
      tanker.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tanker.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tanker.phone.includes(searchTerm);
    
    return matchesFilter && matchesDistrict && matchesSearch;
  });

  // إغلاق الفلاتر عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
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

  // دوال المشاركة
  const handleInputChange = (field: string, value: any) => {
    setNewTanker(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNewTanker = async () => {
    if (!newTanker.driverName || !newTanker.capacity || !newTanker.price || !newTanker.location || !newTanker.district) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase.from('mobile_tankers').insert([
        {
          driver_name: newTanker.driverName,
          capacity: newTanker.capacity,
          price: newTanker.price,
          location: newTanker.location,
          district: newTanker.district,
          phone: newTanker.phone || null,
          working_hours: newTanker.workingHours || null,
          features: newTanker.features && newTanker.features.length > 0 ? newTanker.features : null,
          images: newTanker.images && newTanker.images.length > 0 ? newTanker.images : null,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      alert('تم إرسال الناقلة بنجاح! سيتم مراجعتها والموافقة عليه');
      setShowAddForm(false);
      setNewTanker({
        driverName: '',
        capacity: '',
        price: '',
        location: '',
        district: '',
        phone: '',
        workingHours: '',
        features: [],
        images: []
      });
    } catch (err: any) {
      console.error('Error submitting mobile tanker:', err);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      Array.from(files).forEach((file, index) => {
        if (newTanker.images.length + index < 3) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              newImages.push(e.target.result as string);
              if (newImages.length === Math.min(files.length, 3 - newTanker.images.length)) {
                setNewTanker(prev => ({
                  ...prev,
                  images: [...prev.images, ...newImages]
                }));
              }
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setNewTanker(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };


  const handleContact = (tankerId: string) => {
    const tanker = currentTankers.find(t => t.id === tankerId);
    alert(`سيتم التواصل مع ${tanker?.driverName} على ${tanker?.phone}`);
  };

  const openGallery = (images: string[], index: number) => {
    if (!images || images.length === 0) return;
    setGalleryImages(images);
    setGalleryIndex(index);
  };

  const closeGallery = () => {
    setGalleryIndex(null);
    setGalleryImages([]);
  };

  const showNextImage = () => {
    if (galleryIndex === null || galleryImages.length === 0) return;
    setGalleryIndex((galleryIndex + 1) % galleryImages.length);
  };

  const showPrevImage = () => {
    if (galleryIndex === null || galleryImages.length === 0) return;
    setGalleryIndex((galleryIndex - 1 + galleryImages.length) % galleryImages.length);
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
            <span className="text-2xl">🚛</span>
            <h1 className="text-xl font-bold text-white">صهاريج متنقلة</h1>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sky-300 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن السائق أو الموقع..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-teal-800 border border-teal-600 rounded-xl px-4 py-3 pr-10 text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
            />
          </div>
        </div>

        {/* فلترة الناقلات */}
        <div className="mb-4">
          <div className="space-y-3">
            <div className="relative dropdown-container">
              <button
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  if (!isFilterOpen) setIsDistrictOpen(false); // إغلاق الفلتر الآخر عند فتح هذا الفلتر
                }}
                className="w-full bg-teal-800 border border-teal-600 rounded-xl px-4 py-3 text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {filterOptions.find(f => f.id === selectedFilter)?.name}
                  </span>
                  <span className="text-sky-300 text-sm">
                    ({filterOptions.find(f => f.id === selectedFilter)?.count})
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-sky-300 transition-transform ${
                    isFilterOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedFilter(option.id);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-right flex items-center justify-between hover:bg-teal-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedFilter === option.id ? 'bg-teal-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          selectedFilter === option.id ? 'text-white' : 'text-sky-300'
                        }`}>
                          {option.name}
                        </span>
                        <span className={`text-sm ${
                          selectedFilter === option.id ? 'text-teal-200' : 'text-sky-300'
                        }`}>
                          ({option.count})
                        </span>
                      </div>
                      {selectedFilter === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* فلترة حسب المديرية */}
        <div className="mb-4">
          <div className="space-y-3">
            <div className="relative dropdown-container">
              <button
                onClick={() => {
                  setIsDistrictOpen(!isDistrictOpen);
                  if (!isDistrictOpen) setIsFilterOpen(false); // إغلاق الفلتر الآخر عند فتح هذا الفلتر
                }}
                className="w-full bg-teal-800 border border-teal-600 rounded-xl px-4 py-3 text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {districts.find(d => d.id === selectedDistrict)?.name}
                  </span>
                  <span className="text-sky-300 text-sm">
                    ({districts.find(d => d.id === selectedDistrict)?.count})
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-sky-300 transition-transform ${
                    isDistrictOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {isDistrictOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                  {districts.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => {
                        setSelectedDistrict(district.id);
                        setIsDistrictOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-right flex items-center justify-between hover:bg-teal-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedDistrict === district.id ? 'bg-teal-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          selectedDistrict === district.id ? 'text-white' : 'text-sky-300'
                        }`}>
                          {district.name}
                        </span>
                        <span className={`text-sm ${
                          selectedDistrict === district.id ? 'text-teal-200' : 'text-sky-300'
                        }`}>
                          ({district.count})
                        </span>
                      </div>
                      {selectedDistrict === district.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* حالة التحميل / الخطأ */}
        {isLoading && (
          <div className="mb-2 text-center text-sky-300 text-sm">جاري تحميل بيانات الصهاريج المعتمدة...</div>
        )}
        {error && (
          <div className="mb-2 text-center text-red-300 text-sm">{error}</div>
        )}

        {/* عداد النتائج */}
        <div className="mb-4 flex justify-center">
          <p className="text-sky-300 text-sm text-center">
            عرض {filteredTankers.length} من أصل {currentTankers.length} ناقلة
          </p>
        </div>

        {/* زر الإضافة */}
        <div className="mb-6 flex justify-center">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" />
            إضافة ناقلة
          </Button>
        </div>

        {/* قائمة الصهاريج */}
        <div className="space-y-3">
          {filteredTankers.map((tanker) => (
            <div 
              key={tanker.id} 
              className={`cursor-pointer transition-all rounded-xl p-3 border ${
                selectedTanker === tanker.id 
                  ? 'bg-teal-700 border-cyan-400 ring-2 ring-cyan-400' 
                  : 'bg-teal-800 bg-opacity-80 border-teal-600 hover:bg-teal-700'
              }`}
              onClick={() => setSelectedTanker(tanker.id)}
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{tanker.driverName}</h3>
                  <p className="text-sm text-sky-300">{tanker.capacity} - {tanker.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {tanker.category}
                    </span>
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      {tanker.district}
                  </span>
                </div>
                  </div>
                </div>

              {/* الصور */}
              {tanker.images && tanker.images.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {tanker.images.slice(0, 3).map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGallery(tanker.images, index);
                      }}
                      className="p-0 border-none bg-transparent cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`صورة الناقلة ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover border border-teal-700"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* الميزات */}
              <div className="flex flex-wrap gap-2 mb-2">
                {tanker.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* التفاصيل */}
              <div className="space-y-1 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{tanker.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{tanker.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">وقت الوصول: {tanker.estimatedTime}</span>
                </div>
              </div>

              {/* السعر والتقييم */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-2xl font-bold text-cyan-400">{tanker.price}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < tanker.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                    <span className="text-sm text-sky-300 ml-1">({tanker.reviews})</span>
                  </div>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContact(tanker.id);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  اتصال مباشر
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* نموذج إضافة ناقلة جديدة */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  إضافة ناقلة جديدة
                </h3>
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* اسم السائق */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم السائق *
                  </label>
                  <input
                    type="text"
                    value={newTanker.driverName}
                    onChange={(e) => handleInputChange('driverName', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل اسم السائق"
                  />
                </div>

                {/* السعة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    سعة الناقلة *
                  </label>
                  <input
                    type="text"
                    value={newTanker.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: 2000 لتر"
                  />
                </div>

                {/* السعر */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    السعر *
                  </label>
                  <input
                    type="text"
                    value={newTanker.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: 25,000 ريال"
                  />
                </div>

                {/* الموقع */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الموقع *
                  </label>
                  <input
                    type="text"
                    value={newTanker.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: كريتر، شارع الجمهورية"
                  />
                </div>

                {/* المديرية */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المديرية *
                  </label>
                  <select
                    value={newTanker.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
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

                {/* الهاتف */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    value={newTanker.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: +967-2-234567"
                  />
                </div>


                {/* ساعات العمل */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ساعات العمل
                  </label>
                  <input
                    type="text"
                    value={newTanker.workingHours}
                    onChange={(e) => handleInputChange('workingHours', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: 24/7 أو 6 صباحاً - 10 مساءً"
                  />
                </div>

                {/* رفع الصور */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    صور الناقلة (اختياري - حد أقصى 3 صور)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    {newTanker.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {newTanker.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
                  onClick={handleSubmitNewTanker}
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
      {/* معرض الصور (Lightbox) */}
      {galleryIndex !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <button
            type="button"
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-2xl px-3 py-1 rounded-full bg-black bg-opacity-60"
          >
            ×
          </button>

          <div className="max-w-full px-4 flex flex-col items-center gap-4">
            <img
              src={galleryImages[galleryIndex]}
              alt="صورة الناقلة"
              className="max-h-[70vh] max-w-[90vw] mx-auto rounded-lg object-contain border border-teal-500"
            />

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={showPrevImage}
                className="text-white text-2xl px-3 py-1 rounded-full bg-black bg-opacity-60"
              >
                ‹
              </button>

              <span className="text-sm text-teal-200">
                {galleryIndex + 1} / {galleryImages.length}
              </span>

              <button
                type="button"
                onClick={showNextImage}
                className="text-white text-2xl px-3 py-1 rounded-full bg-black bg-opacity-60"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileTankersPage;
