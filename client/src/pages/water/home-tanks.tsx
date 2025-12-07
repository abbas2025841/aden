import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { 
  Home, 
  MapPin, 
  Phone, 
  Star,
  ArrowLeft,
  Shield,
  Filter,
  ChevronDown,
  Plus,
  X,
  Save,
  User,
  Search,
  DollarSign,
  Droplets
} from 'lucide-react';

// بيانات تجريبية افتراضية تظهر عندما لا توجد بيانات معتمدة في Supabase
const demoHomeTanks = [
  {
    id: 'demo-tank-1',
    name: 'خزان بلاستيك أبيض - شركة عدن للمياه',
    capacity: '1000 لتر',
    material: 'بولي إيثيلين عالي الجودة',
    price: '42,000 ريال',
    oldPrice: '48,000 ريال',
    rating: 4.5,
    reviews: 89,
    seller: 'شركة عدن للمياه - كريتر',
    features: ['مقاوم للأشعة فوق البنفسجية', 'سهل التنظيف', 'آمن صحياً', 'مقاوم للكسر'],
    delivery: 'توصيل مجاني في عدن',
    warranty: 'ضمان سنة واحدة',
    description: '',
    contact: '+967-2-234567',
    location: 'كريتر، شارع الجمهورية',
    images: [],
    category: 'بلاستيك',
    district: 'كريتر'
  },
  {
    id: 'demo-tank-2',
    name: 'خزان فيبرجلاس أزرق - مصنع السلام',
    capacity: '2000 لتر',
    material: 'فيبرجلاس معزول',
    price: '85,000 ريال',
    oldPrice: '92,000 ريال',
    rating: 4.8,
    reviews: 47,
    seller: 'مصنع السلام للخزانات - المنصورة',
    features: ['عزل حراري', 'مقاوم للصدأ', 'عمر افتراضي طويل'],
    delivery: 'توصيل مع التركيب داخل عدن',
    warranty: 'ضمان سنتين',
    description: '',
    contact: '+967-733-000000',
    location: 'المنصورة، الشارع الرئيسي',
    images: [],
    category: 'فيبرجلاس',
    district: 'المنصورة'
  }
];

const HomeTanksPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedTank, setSelectedTank] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [homeTanks, setHomeTanks] = useState<any[]>(demoHomeTanks);
  const [isLoadingTanks, setIsLoadingTanks] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [newTank, setNewTank] = useState({
    name: '',
    capacity: '',
    material: '',
    price: '',
    oldPrice: '',
    rating: 5,
    reviews: 0,
    seller: '',
    features: [],
    delivery: 'توصيل مجاني',
    warranty: 'ضمان سنة واحدة',
    description: '',
    contact: '',
    location: '',
    images: [] as string[]
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

  // مديريات عدن
  const districts = [
    { id: 'all', name: 'جميع المديريات', count: 8 },
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

  // جلب خزانات المياه من Supabase (الحالة الموافق عليها فقط)
  useEffect(() => {
    const fetchTanks = async () => {
      try {
        setIsLoadingTanks(true);
        setLoadError(null);
        const { data, error } = await supabase
          .from('home_tanks')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const tanks = (data as any[]) || [];
        // إذا لم توجد خزانات معتمدة في Supabase، نعرض البيانات التجريبية
        if (tanks.length === 0) {
          setHomeTanks(demoHomeTanks);
        } else {
          setHomeTanks(tanks);
        }
      } catch (err: any) {
        console.error('خطأ في جلب خزانات المياه:', err);
        setLoadError(err.message || 'حدث خطأ أثناء جلب بيانات الخزانات');
      } finally {
        setIsLoadingTanks(false);
      }
    };

    fetchTanks();
  }, []);


  // خيارات الفلترة
  const filterOptions = [
    { id: 'all', name: 'جميع الخزانات', count: homeTanks.length },
    { id: 'بلاستيك', name: 'بلاستيك', count: homeTanks.filter(t => t.category === 'بلاستيك').length },
    { id: 'فيبرجلاس', name: 'فيبرجلاس', count: homeTanks.filter(t => t.category === 'فيبرجلاس').length },
    { id: 'فولاذ', name: 'فولاذ', count: homeTanks.filter(t => t.category === 'فولاذ').length },
    { id: 'low-price', name: 'أقل من 50,000', count: homeTanks.filter(t => parseInt(t.price.replace(/[^\d]/g, '')) < 50000).length },
    { id: 'high-capacity', name: 'أكثر من 2000 لتر', count: homeTanks.filter(t => parseInt(t.capacity.replace(/[^\d]/g, '')) > 2000).length }
  ];

  const filteredTanks = homeTanks.filter(tank => {
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'low-price' && parseInt(tank.price.replace(/[^\d]/g, '')) < 50000) ||
      (selectedFilter === 'high-capacity' && parseInt(tank.capacity.replace(/[^\d]/g, '')) > 2000) ||
      tank.category === selectedFilter;
    
    const matchesDistrict = selectedDistrict === 'all' || tank.district === selectedDistrict;
    
    const matchesSearch = searchTerm === '' || 
      tank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.material.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesDistrict && matchesSearch;
  });

  // إغلاق القوائم عند النقر خارجها
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsFilterOpen(false);
        setIsDistrictOpen(false);
      }
    };
    if (isFilterOpen || isDistrictOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFilterOpen, isDistrictOpen]);

  // دوال المشاركة
  const handleInputChange = (field: string, value: any) => {
    setNewTank(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // دالة رفع الصور
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      for (let i = 0; i < Math.min(files.length, 3); i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string);
            if (newImages.length === Math.min(files.length, 3)) {
              setNewTank(prev => ({
                ...prev,
                images: [...prev.images, ...newImages].slice(0, 3)
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // دالة حذف صورة
  const removeImage = (index: number) => {
    setNewTank(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitNewTank = async () => {
    if (!newTank.name || !newTank.capacity || !newTank.material || !newTank.price || !newTank.seller) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      const { error } = await supabase
        .from('home_tanks')
        .insert([
          {
            name: newTank.name,
            capacity: newTank.capacity,
            material: newTank.material,
            price: newTank.price,
            seller: newTank.seller,
            contact: newTank.contact,
            location: newTank.location,
            district: selectedDistrict === 'all' ? null : selectedDistrict,
            images: newTank.images && newTank.images.length > 0 ? newTank.images : null,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      alert('تم إرسال الخزان بنجاح! سيتم مراجعتها والموافقة عليه');
    } catch (err: any) {
      console.error('خطأ في إرسال الخزان:', err);
      alert('حدث خطأ أثناء إرسال الخزان. يرجى المحاولة مرة أخرى.');
      return;
    }
    
    // إعادة تعيين النموذج
    setNewTank({
      name: '',
      capacity: '',
      material: '',
      price: '',
      oldPrice: '',
      rating: 5,
      reviews: 0,
      seller: '',
      features: [],
      delivery: 'توصيل مجاني',
      warranty: 'ضمان سنة واحدة',
      description: '',
      contact: '',
      location: '',
      images: []
    });
    setShowAddForm(false);
  };


  const handleContact = (tankId: string) => {
    alert(`سيتم التواصل معك قريباً بخصوص ${homeTanks.find(t => t.id === tankId)?.name}`);
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
            <span className="text-2xl">🏠</span>
            <h1 className="text-xl font-bold text-white">خزانات منزلية</h1>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن خزان أو مورد..."
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
                <span>🏠</span>
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
                    <span>🏠</span>
                    <span>{option.name}</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {option.count}
                    </span>
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
            عرض {filteredTanks.length} من {homeTanks.length} خزان
          </p>
        </div>

        {/* زر الإضافة */}
        <div className="mb-4 text-center">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            أضف خزان
          </Button>
        </div>

        {/* نموذج إضافة خزان جديد */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  أضف خزان جديد
                </h3>
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* اسم الخزان */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم الخزان *
                  </label>
                  <input
                    type="text"
                    value={newTank.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: خزان بلاستيك أبيض"
                  />
                </div>

                {/* السعة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    السعة *
                  </label>
                  <input
                    type="text"
                    value={newTank.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: 1000 لتر"
                  />
                </div>

                {/* المادة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المادة *
                  </label>
                  <select
                    value={newTank.material}
                    onChange={(e) => handleInputChange('material', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">اختر المادة</option>
                    <option value="بولي إيثيلين">بولي إيثيلين</option>
                    <option value="فيبرجلاس">فيبرجلاس</option>
                    <option value="فولاذ مقاوم للصدأ">فولاذ مقاوم للصدأ</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>

                {/* السعر */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    السعر *
                  </label>
                  <input
                    type="text"
                    value={newTank.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: 45,000 ريال"
                  />
                </div>

                {/* اسم المورد */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم المورد *
                  </label>
                  <input
                    type="text"
                    value={newTank.seller}
                    onChange={(e) => handleInputChange('seller', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: شركة الخزانات الحديثة"
                  />
                </div>

                {/* جهة الاتصال */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    جهة الاتصال
                  </label>
                  <input
                    type="text"
                    value={newTank.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="رقم الهاتف أو الواتساب"
                  />
                </div>

                {/* الموقع */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الموقع
                  </label>
                  <input
                    type="text"
                    value={newTank.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: كريتر، شارع الجمهورية"
                  />
                </div>

                {/* المديرية */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المديرية
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">اختر المديرية</option>
                    {districts.filter(d => d.id !== 'all').map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* رفع الصور */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    صور الخزان (اختياري - حد أقصى 3 صور)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                    
                    {/* عرض الصور المرفوعة */}
                    {newTank.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {newTank.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`صورة ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* الوصف */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    وصف إضافي
                  </label>
                  <textarea
                    value={newTank.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="معلومات إضافية عن الخزان..."
                  />
                </div>

                {/* أزرار التحكم */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmitNewTank}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    إرسال الخزان
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* قائمة الخزانات */}
        <div className="space-y-4">
          {filteredTanks.map((tank) => (
            <div 
              key={tank.id} 
              className={`cursor-pointer transition-all rounded-xl p-4 border ${
                selectedTank === tank.id 
                  ? 'bg-teal-700 border-cyan-400 ring-2 ring-cyan-400' 
                  : 'bg-teal-800 bg-opacity-80 border-teal-600 hover:bg-teal-700'
              }`}
              onClick={() => setSelectedTank(tank.id)}
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg">{tank.name}</h3>
                  <p className="text-sm text-sky-300">{tank.capacity} - {tank.material}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {tank.category}
                    </span>
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      {tank.district}
                    </span>
                  </div>
                </div>
              </div>

              {/* الصور */}
              {tank.images && tank.images.length > 0 && (
                <div className="flex gap-2 mb-2">
                  {tank.images.slice(0, 3).map((image: string, index: number) => (
                    <button
                      key={index}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openGallery(tank.images, index);
                      }}
                      className="p-0 border-none bg-transparent cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`صورة الخزان ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover border border-teal-700"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* الميزات */}
              <div className="flex flex-wrap gap-2 mb-2">
                {(tank.features || []).map((feature, index) => (
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
                  <Shield className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{tank.delivery || 'تفاصيل التوصيل حسب الاتفاق مع المورد'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{tank.warranty || 'ضمان حسب سياسة المورد'}</span>
                </div>
              </div>

              {/* السعر والتقييم */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-2xl font-bold text-cyan-400">{tank.price}</span>
                  {tank.oldPrice && (
                    <span className="text-sm text-gray-400 line-through mr-2">{tank.oldPrice}</span>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < tank.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                    <span className="text-xs text-sky-300 ml-1">({tank.reviews})</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-sky-300">{tank.seller}</p>
                </div>
              </div>

              {/* زر التواصل فقط */}
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContact(tank.id);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  تواصل
                </Button>
              </div>
            </div>
          ))}
        </div>

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
              alt="صورة الخزان"
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

export default HomeTanksPage;
