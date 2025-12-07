import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { 
  Wrench, 
  MapPin, 
  Phone, 
  Star,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  Save
} from 'lucide-react';

const TankMaintenancePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCompany, setNewCompany] = useState({
    providerName: '',
    district: '',
    location: '',
    phone: '',
    experience: '',
    workingHours: '',
    warranty: '',
    services: '',
    specialties: ''
  });

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDistrictOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const maintenanceServices = [
    {
      id: 'service1',
      providerName: 'خدمات أبو أحمد للصيانة - كريتر',
      experience: '15 سنة خبرة',
      rating: 5,
      reviews: 127,
      location: 'كريتر',
      phone: '+967 123 456 789',
      services: ['تنظيف شامل', 'تعقيم وتطهير', 'إصلاح تسريبات', 'تغيير عوامات'],
      prices: [
        { service: 'تنظيف شامل', price: '3,000 ريال' },
        { service: 'تعقيم', price: '2,000 ريال' },
        { service: 'إصلاح تسريب', price: '1,500 ريال' },
        { service: 'تغيير عوامة', price: '800 ريال' }
      ],
      district: 'كريتر',
      coordinates: { lat: 12.7794, lng: 45.0367 },
      workingHours: '8:00 صباحاً - 6:00 مساءً',
      warranty: 'ضمان 6 أشهر على الصيانة',
      specialties: ['خزانات بلاستيك', 'خزانات فيبرجلاس', 'خزانات فولاذ'],
      image: '🔧'
    },
    {
      id: 'service2',
      providerName: 'مؤسسة الخزانات المتقدمة - المعلا',
      experience: '12 سنة خبرة',
      rating: 5,
      reviews: 89,
      location: 'المعلا',
      phone: '+967 987 654 321',
      services: ['تنظيف', 'تعقيم', 'فحص جودة', 'صيانة دورية'],
      prices: [
        { service: 'تنظيف + تعقيم', price: '4,500 ريال' },
        { service: 'فحص جودة المياه', price: '1,000 ريال' },
        { service: 'صيانة شاملة', price: '6,000 ريال' }
      ],
      district: 'المعلا',
      coordinates: { lat: 12.7947, lng: 45.0264 },
      workingHours: '7:00 صباحاً - 5:00 مساءً',
      warranty: 'ضمان سنة على الصيانة الشاملة',
      specialties: ['خزانات فيبرجلاس', 'خزانات فولاذ', 'صيانة دورية'],
      image: '🔧'
    },
    {
      id: 'service3',
      providerName: 'شركة عدن للصيانة السريعة - التواهي',
      experience: '8 سنة خبرة',
      rating: 4,
      reviews: 156,
      location: 'التواهي',
      phone: '+967 234 567 890',
      services: ['صيانة طارئة', 'تنظيف سريع', 'إصلاح فوري', 'استبدال قطع'],
      prices: [
        { service: 'صيانة طارئة', price: '5,000 ريال' },
        { service: 'تنظيف سريع', price: '2,500 ريال' },
        { service: 'إصلاح فوري', price: '3,000 ريال' },
        { service: 'استبدال قطع', price: '1,200 ريال' }
      ],
      district: 'التواهي',
      coordinates: { lat: 12.8000, lng: 45.0000 },
      workingHours: '24/7',
      warranty: 'ضمان 3 أشهر على الإصلاحات',
      specialties: ['صيانة طارئة', 'إصلاح فوري', 'جميع أنواع الخزانات'],
      image: '⚡'
    },
    {
      id: 'service4',
      providerName: 'مؤسسة النقيب للصيانة - الشيخ عثمان',
      experience: '20 سنة خبرة',
      rating: 5,
      reviews: 203,
      location: 'الشيخ عثمان',
      phone: '+967 345 678 901',
      services: ['صيانة شاملة', 'تعقيم متقدم', 'فحص دوري', 'استشارات فنية'],
      prices: [
        { service: 'صيانة شاملة', price: '7,000 ريال' },
        { service: 'تعقيم متقدم', price: '3,500 ريال' },
        { service: 'فحص دوري', price: '1,500 ريال' },
        { service: 'استشارة فنية', price: '500 ريال' }
      ],
      district: 'الشيخ عثمان',
      coordinates: { lat: 12.8500, lng: 44.9500 },
      workingHours: '8:30 صباحاً - 5:30 مساءً',
      warranty: 'ضمان سنتين على الصيانة الشاملة',
      specialties: ['خزانات فولاذ', 'صيانة متقدمة', 'استشارات فنية'],
      image: '🏆'
    },
    {
      id: 'service5',
      providerName: 'خدمات الصيانة الذكية - المنصورة',
      experience: '6 سنة خبرة',
      rating: 4,
      reviews: 78,
      location: 'المنصورة',
      phone: '+967 456 789 012',
      services: ['صيانة ذكية', 'مراقبة عن بُعد', 'تنظيف آلي', 'تقارير مفصلة'],
      prices: [
        { service: 'صيانة ذكية', price: '4,000 ريال' },
        { service: 'مراقبة عن بُعد', price: '2,000 ريال' },
        { service: 'تنظيف آلي', price: '3,000 ريال' },
        { service: 'تقرير مفصل', price: '800 ريال' }
      ],
      district: 'المنصورة',
      coordinates: { lat: 12.8200, lng: 44.9800 },
      workingHours: '9:00 صباحاً - 7:00 مساءً',
      warranty: 'ضمان سنة على التقنيات الذكية',
      specialties: ['تقنيات ذكية', 'مراقبة عن بُعد', 'خزانات حديثة'],
      image: '🤖'
    },
    {
      id: 'service6',
      providerName: 'شركة البريقة للصيانة - البريقة',
      experience: '10 سنة خبرة',
      rating: 4,
      reviews: 134,
      location: 'البريقة',
      phone: '+967 567 890 123',
      services: ['صيانة تقليدية', 'تنظيف عميق', 'إصلاح شامل', 'صيانة وقائية'],
      prices: [
        { service: 'صيانة تقليدية', price: '3,500 ريال' },
        { service: 'تنظيف عميق', price: '2,800 ريال' },
        { service: 'إصلاح شامل', price: '4,500 ريال' },
        { service: 'صيانة وقائية', price: '2,000 ريال' }
      ],
      district: 'البريقة',
      coordinates: { lat: 12.7800, lng: 44.9200 },
      workingHours: '8:00 صباحاً - 6:00 مساءً',
      warranty: 'ضمان 8 أشهر على الصيانة',
      specialties: ['صيانة تقليدية', 'خزانات بلاستيك', 'صيانة وقائية'],
      image: '🛠️'
    },
    {
      id: 'service7',
      providerName: 'مؤسسة خور مكسر للصيانة - خور مكسر',
      experience: '14 سنة خبرة',
      rating: 5,
      reviews: 167,
      location: 'خور مكسر',
      phone: '+967 678 901 234',
      services: ['صيانة متخصصة', 'تعقيم طبي', 'فحص شامل', 'صيانة دورية'],
      prices: [
        { service: 'صيانة متخصصة', price: '5,500 ريال' },
        { service: 'تعقيم طبي', price: '3,200 ريال' },
        { service: 'فحص شامل', price: '2,000 ريال' },
        { service: 'صيانة دورية', price: '3,800 ريال' }
      ],
      district: 'خور مكسر',
      coordinates: { lat: 12.7600, lng: 44.9400 },
      workingHours: '7:30 صباحاً - 6:30 مساءً',
      warranty: 'ضمان سنة على التعقيم الطبي',
      specialties: ['تعقيم طبي', 'خزانات صحية', 'صيانة متخصصة'],
      image: '🏥'
    },
    {
      id: 'service8',
      providerName: 'خدمات دار سعد للصيانة - دار سعد',
      experience: '11 سنة خبرة',
      rating: 4,
      reviews: 92,
      location: 'دار سعد',
      phone: '+967 789 012 345',
      services: ['صيانة سريعة', 'تنظيف أساسي', 'إصلاح بسيط', 'صيانة دورية'],
      prices: [
        { service: 'صيانة سريعة', price: '2,500 ريال' },
        { service: 'تنظيف أساسي', price: '1,800 ريال' },
        { service: 'إصلاح بسيط', price: '2,200 ريال' },
        { service: 'صيانة دورية', price: '3,000 ريال' }
      ],
      district: 'دار سعد',
      coordinates: { lat: 12.7400, lng: 44.9600 },
      workingHours: '8:00 صباحاً - 5:00 مساءً',
      warranty: 'ضمان 6 أشهر على الصيانة',
      specialties: ['صيانة سريعة', 'خزانات بلاستيك', 'إصلاحات بسيطة'],
      image: '⚡'
    }
  ];

  const [approvedCompanies, setApprovedCompanies] = useState<typeof maintenanceServices | null>(null);

  // قائمة المناطق
  const districts = [
    { id: 'all', name: 'جميع المناطق', count: 10 },
    { id: 'كريتر', name: 'مديرية كريتر', count: 1 },
    { id: 'المعلا', name: 'مديرية المعلا', count: 1 },
    { id: 'التواهي', name: 'مديرية التواهي', count: 1 },
    { id: 'الشيخ عثمان', name: 'مديرية الشيخ عثمان', count: 1 },
    { id: 'المنصورة', name: 'مديرية المنصورة', count: 1 },
    { id: 'البريقة', name: 'مديرية البريقة', count: 1 },
    { id: 'خور مكسر', name: 'مديرية خور مكسر', count: 1 },
    { id: 'دار سعد', name: 'مديرية دار سعد', count: 1 },
    { id: 'القلوعه', name: 'مديرية القلوعة', count: 1 },
    { id: 'الممدارة', name: 'مديرية الممدارة', count: 1 }
  ];



  // جلب شركات الصيانة المعتمدة من Supabase
  useEffect(() => {
    const fetchApprovedCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('tank_maintenance_companies')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((c: any, index: number) => ({
            id: c.id || `supabase-${index}`,
            providerName: c.provider_name || 'شركة صيانة بدون اسم',
            experience: c.experience || '',
            rating: 5,
            reviews: 0,
            location: c.location || 'غير محدد',
            phone: c.phone || '',
            services: c.services ? String(c.services).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
            prices: [],
            district: c.district || 'غير محددة',
            coordinates: c.coordinates || null,
            workingHours: c.working_hours || '',
            warranty: c.warranty || '',
            specialties: c.specialties ? String(c.specialties).split(',').map((s: string) => s.trim()).filter(Boolean) : [],
            image: '🔧'
          }));

          setApprovedCompanies(mapped as any);
        } else {
          setApprovedCompanies(null);
        }
      } catch (err: any) {
        console.error('Error fetching tank_maintenance_companies:', err);
        setError('حدث خطأ أثناء جلب شركات الصيانة المعتمدة');
        setApprovedCompanies(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedCompanies();
  }, []);

  const currentServices = approvedCompanies && approvedCompanies.length > 0 ? approvedCompanies : maintenanceServices;

  // فلترة الخدمات
  const filteredServices = currentServices.filter(service => {
    const matchesSearch = service.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.services.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDistrict = selectedDistrict === 'all' || service.district === selectedDistrict;

    return matchesSearch && matchesDistrict;
  });

  // دوال إدارة نموذج إضافة شركة صيانة
  const handleNewCompanyChange = (field: string, value: string) => {
    setNewCompany(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitNewCompany = async () => {
    if (!newCompany.providerName || !newCompany.district || !newCompany.location || !newCompany.phone) {
      alert('يرجى ملء الحقول المطلوبة (اسم الشركة، المديرية، الموقع، رقم الهاتف)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase.from('tank_maintenance_companies').insert([
        {
          provider_name: newCompany.providerName,
          district: newCompany.district,
          location: newCompany.location,
          phone: newCompany.phone,
          experience: newCompany.experience || null,
          working_hours: newCompany.workingHours || null,
          warranty: newCompany.warranty || null,
          services: newCompany.services || null,
          specialties: newCompany.specialties || null,
          approval_status: 'pending'
        }
      ]);

      if (error) throw error;

      alert('تم إرسال النقطة بنجاح! سيتم مراجعتها والموافقة عليه');

      setNewCompany({
        providerName: '',
        district: '',
        location: '',
        phone: '',
        experience: '',
        workingHours: '',
        warranty: '',
        services: '',
        specialties: ''
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error submitting maintenance company:', err);
      alert('حدث خطأ أثناء إرسال شركة الصيانة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // دالة التواصل مع صاحب الخدمة
  const handleContact = (serviceId: string) => {
    const service = maintenanceServices.find(s => s.id === serviceId);
    if (service) {
      const phoneNumber = service.phone.replace(/\D/g, ''); // إزالة جميع الرموز غير الرقمية
      const whatsappUrl = `https://wa.me/${phoneNumber}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // دالة فتح الاتجاهات في خرائط جوجل
  const handleDirections = (serviceId: string) => {
    const service = maintenanceServices.find(s => s.id === serviceId);
    if (service && service.coordinates) {
      const { lat, lng } = service.coordinates;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert('موقع الخدمة غير متوفر');
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
            <span className="text-2xl">🔧</span>
            <h1 className="text-xl font-bold text-white">صيانة الخزانات</h1>
          </div>
        </div>

        {/* زر إضافة شركة صيانة */}
        <div className="mb-6 flex justify-center">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" />
            اضف شركة صيانه
          </Button>
        </div>

        {/* فلتر المناطق */}
        <div className="mb-6">
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDistrictOpen(!isDistrictOpen)}
              className="w-full bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl px-4 py-3 text-white text-right flex items-center justify-between"
            >
              <span>{districts.find(d => d.id === selectedDistrict)?.name || 'جميع المناطق'}</span>
              <span className={`transform transition-transform ${isDistrictOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isDistrictOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl z-10 max-h-60 overflow-y-auto">
                {districts.map((district) => (
                  <button
                    key={district.id}
                    onClick={() => {
                      setSelectedDistrict(district.id);
                      setIsDistrictOpen(false);
                    }}
                    className="w-full text-right px-4 py-3 text-white hover:bg-teal-700 flex items-center justify-between"
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

        {/* قائمة خدمات الصيانة */}
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div 
              key={service.id} 
              className={`cursor-pointer transition-all rounded-xl p-4 border ${
                selectedService === service.id 
                  ? 'bg-teal-700 border-cyan-400 ring-2 ring-cyan-400' 
                  : 'bg-teal-800 bg-opacity-80 border-teal-600 hover:bg-teal-700'
              }`}
              onClick={() => setSelectedService(service.id)}
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-white text-lg">{service.providerName}</h3>
                    <p className="text-sm text-sky-300">{service.experience}</p>
                  </div>
                </div>
              </div>

              {/* التقييم والموقع */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < service.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                    />
                  ))}
                  <span className="text-sm text-sky-300 ml-1">({service.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300 text-sm">{service.district}</span>
                </div>
              </div>

              {/* الموقع التفصيلي */}
              <div className="mb-4 p-3 bg-teal-900 bg-opacity-50 rounded-lg">
                <div className="flex items-center gap-2 text-sky-300 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">الموقع:</span>
                </div>
                <p className="text-white text-sm mt-1">{service.location}</p>
                {service.coordinates && (
                  <p className="text-sky-300 text-xs mt-1">
                    الإحداثيات: {service.coordinates.lat.toFixed(4)}, {service.coordinates.lng.toFixed(4)}
                  </p>
                )}
              </div>

              {/* ساعات العمل والضمان */}
              <div className="mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-sky-300">
                  <Clock className="w-4 h-4" />
                  <span>{service.workingHours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-sky-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>{service.warranty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-sky-300">
                  <Phone className="w-4 h-4" />
                  <span>{service.phone}</span>
                </div>
              </div>

              {/* التخصصات */}
              <div className="mb-4">
                <h4 className="text-sky-300 font-medium mb-2">التخصصات:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* أزرار التواصل والاتجاهات */}
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContact(service.id);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  اتصال مباشر
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDirections(service.id);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  الاتجاهات
                </Button>
              </div>

              {/* الخدمات المتوفرة */}
              <div className="mb-4">
                <h4 className="text-sky-300 font-medium mb-2">الخدمات المتوفرة:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.services.map((serviceName, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full"
                    >
                      {serviceName}
                    </span>
                  ))}
                </div>
              </div>

              {/* الأسعار */}
              <div className="mb-4">
                <h4 className="text-sky-300 font-medium mb-2">الأسعار:</h4>
                <div className="space-y-1">
                  {service.prices.map((priceItem, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-sky-300">{priceItem.service}</span>
                      <span className="text-white font-semibold">{priceItem.price}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* نموذج إضافة شركة صيانة جديدة */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  إضافة شركة صيانة جديدة
                </h3>
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-white bg-transparent hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* اسم الشركة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم شركة الصيانة *
                  </label>
                  <input
                    type="text"
                    value={newCompany.providerName}
                    onChange={(e) => handleNewCompanyChange('providerName', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل اسم شركة الصيانة"
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

                {/* سنوات الخبرة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    سنوات الخبرة
                  </label>
                  <input
                    type="text"
                    value={newCompany.experience}
                    onChange={(e) => handleNewCompanyChange('experience', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: 10 سنوات خبرة"
                  />
                </div>

                {/* ساعات العمل */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ساعات العمل
                  </label>
                  <input
                    type="text"
                    value={newCompany.workingHours}
                    onChange={(e) => handleNewCompanyChange('workingHours', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: 8 صباحاً - 6 مساءً"
                  />
                </div>

                {/* الضمان */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الضمان
                  </label>
                  <input
                    type="text"
                    value={newCompany.warranty}
                    onChange={(e) => handleNewCompanyChange('warranty', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: ضمان سنة على الصيانة"
                  />
                </div>

                {/* الخدمات */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الخدمات (افصل بين كل خدمة و الأخرى بفاصلة)
                  </label>
                  <textarea
                    value={newCompany.services}
                    onChange={(e) => handleNewCompanyChange('services', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
                    placeholder="مثال: تنظيف شامل، تعقيم، صيانة دورية"
                  />
                </div>

                {/* التخصصات */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    التخصصات (افصل بين كل تخصص و الآخر بفاصلة)
                  </label>
                  <textarea
                    value={newCompany.specialties}
                    onChange={(e) => handleNewCompanyChange('specialties', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[70px]"
                    placeholder="مثال: خزانات بلاستيك، خزانات فيبرجلاس، صيانة طارئة"
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

export default TankMaintenancePage;
