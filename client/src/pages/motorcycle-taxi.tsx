import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { supabase } from '@/lib/supabase';
import {
  Bike,
  Users,
  ArrowRight,
  MapPin,
  Phone,
  Star,
  Eye,
  X,
  Award,
  Shield
} from 'lucide-react';

interface DriverData {
  id: number | string;
  fullName: string;
  phoneNumber: string;
  district: string;
  vehicleType: string;
  plateNumber: string;
  manufactureYear: string;
  vehicleCondition: string;
  hasLicense: boolean | null;
  experienceYears: string;
  knowsAdenStreets: boolean | null;
  personalPhoto?: string;
  vehiclePhotos?: string[];
  rating?: number;
  reviews?: number;
  distance?: number;
  estimatedPrice?: number;
  isAvailable?: boolean;
}

const mockDrivers: DriverData[] = [
  {
    id: 1,
    fullName: 'أحمد محمد',
    phoneNumber: '770000001',
    district: 'صيرة',
    vehicleType: 'باص صغير',
    plateNumber: 'عدن 1234',
    manufactureYear: '2020',
    vehicleCondition: 'ممتاز',
    hasLicense: true,
    experienceYears: '3',
    knowsAdenStreets: true,
    rating: 4.8,
    reviews: 120,
    distance: 0.5,
    estimatedPrice: 500,
    isAvailable: true,
    vehiclePhotos: ['🚐', '🚌']
  },
  {
    id: 2,
    fullName: 'محمد علي',
    phoneNumber: '770000002',
    district: 'الشيخ عثمان',
    vehicleType: 'سيكل',
    plateNumber: 'عدن 5678',
    manufactureYear: '2019',
    vehicleCondition: 'جيد',
    hasLicense: true,
    experienceYears: '2',
    knowsAdenStreets: true,
    rating: 4.6,
    reviews: 80,
    distance: 0.8,
    estimatedPrice: 400,
    isAvailable: true,
    vehiclePhotos: ['🚲', '🚴']
  },
  {
    id: 3,
    fullName: 'عبدالله حسن',
    phoneNumber: '770000003',
    district: 'المنصورة',
    vehicleType: 'باص صغير',
    plateNumber: 'عدن 9012',
    manufactureYear: '2021',
    vehicleCondition: 'ممتاز',
    hasLicense: true,
    experienceYears: '5',
    knowsAdenStreets: true,
    rating: 4.9,
    reviews: 150,
    distance: 1.2,
    estimatedPrice: 600,
    isAvailable: true,
    vehiclePhotos: ['🚐', '🚌', '🚐']
  },
  {
    id: 4,
    fullName: 'يوسف أحمد',
    phoneNumber: '770000004',
    district: 'التواهي',
    vehicleType: 'سيكل',
    plateNumber: 'عدن 3456',
    manufactureYear: '2018',
    vehicleCondition: 'جيد',
    hasLicense: true,
    experienceYears: '4',
    knowsAdenStreets: true,
    rating: 4.7,
    reviews: 60,
    distance: 1.5,
    estimatedPrice: 450,
    isAvailable: true,
    vehiclePhotos: ['🚲', '🚴']
  },
  {
    id: 5,
    fullName: 'سالم محمد',
    phoneNumber: '770000005',
    district: 'كريتر',
    vehicleType: 'باص صغير',
    plateNumber: 'عدن 7890',
    manufactureYear: '2022',
    vehicleCondition: 'ممتاز',
    hasLicense: true,
    experienceYears: '1',
    knowsAdenStreets: false,
    rating: 4.5,
    reviews: 40,
    distance: 2.0,
    estimatedPrice: 700,
    isAvailable: true,
    vehiclePhotos: ['🚐', '🚌']
  }
];

export default function MotorcycleTaxiPage() {
  const [, setLocation] = useLocation();
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState<DriverData | null>(null);
  const [selectedVehiclePhotoIndex, setSelectedVehiclePhotoIndex] = useState<number | null>(null);
  const [driversFromDb, setDriversFromDb] = useState<DriverData[]>([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [driversError, setDriversError] = useState<string | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const baseDrivers = driversFromDb.length > 0 ? driversFromDb : mockDrivers;
  const sortedDrivers = [...baseDrivers].sort((a, b) => (a.distance || 0) - (b.distance || 0));
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [isSubmittingDriver, setIsSubmittingDriver] = useState(false);
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});

  const [newDriver, setNewDriver] = useState({
    fullName: '',
    phoneNumber: '',
    district: '',
    vehicleType: '',
    plateNumber: '',
    manufactureYear: '',
    vehicleCondition: '',
    experienceYears: '',
    hasLicense: null as boolean | null,
    knowsAdenStreets: null as boolean | null,
    rating: '',
    notes: '',
    vehiclePhotos: [] as string[]
  });

  const handleNewDriverChange = (field: keyof typeof newDriver, value: any) => {
    setNewDriver(prev => ({ ...prev, [field]: value }));
  };

  const handleDriverImageUpload = (file: File) => {
    if (!file) return;
    if (newDriver.vehiclePhotos.length >= 3) {
      alert('يمكنك رفع 3 صور كحد أقصى للمركبة.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setNewDriver(prev => ({
        ...prev,
        vehiclePhotos: [...prev.vehiclePhotos, result]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDriverPhoto = (index: number) => {
    setNewDriver(prev => ({
      ...prev,
      vehiclePhotos: prev.vehiclePhotos.filter((_, i) => i !== index)
    }));
  };

  // دالة تقييم السائق مع السماح بتعديل التقييم من نفس الجهاز مرة بعد مرة
  const handleRateDriver = async (driver: DriverData, score: number) => {
    // إذا كان السائق من البيانات التجريبية (id رقم فقط) فلا نحاول حفظ في Supabase حاليًا
    const isSample = typeof driver.id === 'number';
    if (isSample) {
      alert('تم تسجيل تقييمك التجريبي لهذا السائق. سيتم تفعيل الحفظ في قاعدة البيانات للسائقين الحقيقيين عند ربط القائمة بجدول Supabase.');
      setUserRatings((prev) => ({ ...prev, [driver.id as number]: score }));
      return;
    }

    try {
      const storageKey = `motorcycle_driver_rating_${driver.id}`;
      let previousScore: number | null = null;

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = Number(stored);
          if (!Number.isNaN(parsed)) {
            previousScore = parsed;
          }
        }
      }

      const oldRating = driver.rating || 0;
      const oldReviews = driver.reviews || 0;
      let newReviews = oldReviews;
      let newRating: number;

      if (previousScore === null) {
        // أول تقييم من هذا الجهاز: نضيف مراجعة جديدة
        newReviews = oldReviews + 1;
        newRating = (oldRating * oldReviews + score) / newReviews;
      } else {
        // تعديل تقييم سابق من نفس الجهاز: نطرح القديم ونضيف الجديد بدون تغيير عدد المراجعات
        if (oldReviews === 0) {
          // حالة احتياطية غير متوقعة: لا توجد مراجعات ولكن يوجد تقييم سابق مخزن
          newReviews = 1;
          newRating = score;
        } else {
          const total = oldRating * oldReviews - previousScore + score;
          newRating = total / oldReviews;
        }
      }

      const { error } = await supabase
        .from('motorcycle_drivers')
        .update({ rating: newRating, reviews: newReviews })
        .eq('id', driver.id);

      if (error) {
        console.error('خطأ في حفظ تقييم السائق:', error);
        alert('فشل في حفظ التقييم: ' + error.message);
        return;
      }

      // تحديث التقييم محليًا في الواجهة
      setUserRatings((prev) => ({ ...prev, [driver.id as number]: score }));

      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, String(score));
      }

      alert(previousScore === null ? 'شكراً لتقييمك! تم إضافة تقييمك لهذا السائق.' : 'تم تحديث تقييمك لهذا السائق.');
    } catch (err: any) {
      console.error('استثناء أثناء حفظ تقييم السائق:', err);
      alert('حدث خطأ غير متوقع أثناء حفظ التقييم');
    }
  };

  const handleSubmitNewDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.fullName || !newDriver.phoneNumber || !newDriver.district || !newDriver.vehicleType || !newDriver.plateNumber) {
      alert('يرجى ملء الحقول الأساسية: الاسم، الهاتف، المديرية، نوع المركبة، رقم اللوحة');
      return;
    }

    if (newDriver.hasLicense === null || newDriver.knowsAdenStreets === null) {
      alert('يرجى الإجابة على أسئلة الرخصة ومعرفة شوارع عدن (نعم أو لا).');
      return;
    }

    try {
      setIsSubmittingDriver(true);
      const { error } = await supabase.from('motorcycle_drivers').insert({
        full_name: newDriver.fullName,
        phone_number: newDriver.phoneNumber,
        district: newDriver.district,
        vehicle_type: newDriver.vehicleType,
        plate_number: newDriver.plateNumber,
        manufacture_year: newDriver.manufactureYear || null,
        vehicle_condition: newDriver.vehicleCondition || null,
        experience_years: newDriver.experienceYears || null,
        has_license: newDriver.hasLicense,
        knows_aden_streets: newDriver.knowsAdenStreets,
        rating: newDriver.rating ? Number(newDriver.rating) : null,
        notes: newDriver.notes || null,
        vehicle_photos: newDriver.vehiclePhotos.length ? newDriver.vehiclePhotos : null,
        approval_status: 'pending'
      });

      if (error) throw error;

      alert('تم إرسال طلب السائق بنجاح، سيتم مراجعته من الإدارة.');
      setShowAddDriverModal(false);
      setNewDriver({
        fullName: '',
        phoneNumber: '',
        district: '',
        vehicleType: '',
        plateNumber: '',
        manufactureYear: '',
        vehicleCondition: '',
        experienceYears: '',
        hasLicense: null,
        knowsAdenStreets: null,
        rating: '',
        notes: '',
        vehiclePhotos: []
      });
    } catch (err: any) {
      console.error('Error submitting driver application:', err);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmittingDriver(false);
    }
  };

  const uniqueDistricts = [
    'دار سعد',
    'الشيخ عثمان',
    'المنصورة',
    'البريقة',
    'التواهي',
    'المعلا',
    'كريتر',
    'خور مكسر',
    'القلوعه',
    'الممدارة'
  ];
  const uniqueVehicleTypes = Array.from(new Set(baseDrivers.map((d) => d.vehicleType))).filter(Boolean);

  // تحميل السائقين الحقيقيين المعتمدين من Supabase
  useEffect(() => {
    const fetchApprovedDrivers = async () => {
      try {
        setIsLoadingDrivers(true);
        setDriversError(null);

        const { data, error } = await supabase
          .from('motorcycle_drivers')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: DriverData[] = (data || []).map((row: any) => ({
          id: row.id,
          fullName: row.full_name,
          phoneNumber: row.phone_number,
          district: row.district || '',
          vehicleType: row.vehicle_type || 'باص صغير',
          plateNumber: row.plate_number || '',
          manufactureYear: row.manufacture_year ? String(row.manufacture_year) : '',
          vehicleCondition: row.vehicle_condition || '',
          hasLicense: row.has_license,
          experienceYears: row.experience_years ? String(row.experience_years) : '',
          knowsAdenStreets: row.knows_aden_streets,
          vehiclePhotos: row.vehicle_photos || undefined,
          rating: row.rating || 0,
          reviews: row.reviews || 0,
          // حالياً لا توجد مسافة أو سعر تقديري في الجدول، نتركها undefined ونتعامل معها في العرض
          distance: undefined,
          estimatedPrice: undefined,
          isAvailable: true
        }));

        setDriversFromDb(mapped);
      } catch (err: any) {
        console.error('Error fetching approved motorcycle drivers:', err);
        setDriversError(err.message || 'حدث خطأ أثناء جلب بيانات السائقين');
      } finally {
        setIsLoadingDrivers(false);
      }
    };

    fetchApprovedDrivers();
  }, []);

  const filteredDrivers = sortedDrivers.filter((driver) => {
    const districtMatch = selectedDistrict === 'all' || driver.district === selectedDistrict;
    const vehicleMatch = selectedVehicleType === 'all' || driver.vehicleType === selectedVehicleType;
    return districtMatch && vehicleMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fb923c' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <AppHeader />

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Welcome Card */}
          <div className="mb-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 rounded-2xl p-5 shadow-xl border border-white/20 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff_0,_transparent_45%)]" />
            <div className="relative flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shadow-lg">
                <Bike className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-extrabold tracking-tight">تاكسي / سيكل عدن</h2>
                <p className="text-xs sm:text-sm text-blue-50 font-medium">
                  اختر المديرية ونوع المركبة، ثم اختر السائق المناسب لك.
                </p>
                <p className="text-[11px] sm:text-xs text-blue-100">
                  استخدم زر التفاصيل لعرض بيانات السائق، وقيّم تجربتك لمساعدة الآخرين.
                </p>
              </div>
            </div>
          </div>

          {/* Available Drivers (same as order page) */}
          <div className="bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bike className="w-5 h-5 text-blue-600" />
              السائقون المتاحون (مرتبون حسب القرب)
            </h2>

            <div className="mb-4">
              <button
                onClick={() => setShowAddDriverModal(true)}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Users className="w-6 h-6" />
                <span className="font-semibold text-lg">اضف سائق</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 backdrop-blur-sm border border-white/40 dark:border-gray-700 rounded-2xl px-4 py-3 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">المديرية</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white/70 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">كل المديريات</option>
                  {uniqueDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">نوع المركبة</label>
                <select
                  value={selectedVehicleType}
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white/70 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">كل الأنواع</option>
                  {uniqueVehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 text-sm text-gray-700 flex items-center justify-between">
              <span>عدد السائقين المطابقين: {filteredDrivers.length}</span>
            </div>

            <div className="space-y-4">
              {filteredDrivers.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-sm text-blue-800">
                  لا توجد سائقين مطابقين للفلاتر الحالية. جرّب تغيير المديرية أو نوع المركبة.
                </div>
              )}

              {filteredDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-gray-800/90 rounded-xl p-5 border border-gray-600 hover:border-blue-400 transition-all overflow-hidden"
                >
                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                        👤
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">{driver.fullName}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {typeof driver.distance === 'number' ? `${driver.distance} كم` : 'المسافة غير محددة'}
                          </span>
                          <span className={`font-medium ${
                            driver.knowsAdenStreets ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {driver.knowsAdenStreets ? 'يعرف الشوارع' : 'جديد في عدن'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-right">
                      <p className="text-orange-400 font-bold text-lg mb-2">
                        {typeof driver.estimatedPrice === 'number'
                          ? `${driver.estimatedPrice} ريال`
                          : 'السعر حسب الاتفاق'}
                      </p>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                          driver.vehicleType === 'سيكل' 
                            ? 'bg-blue-600 text-blue-100' 
                            : 'bg-purple-600 text-purple-100'
                        }`}
                      >
                        {driver.vehicleType === 'سيكل' ? '🚲 سيكل' : '🚐 باص صغير'}
                      </span>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{driver.phoneNumber}</span>
                    </div>
                    <div className="text-center sm:text-left">
                      خبرة: {driver.experienceYears} سنوات
                    </div>
                    <div className="text-center sm:text-right">
                      رقم اللوحة: {driver.plateNumber}
                    </div>
                  </div>

                  {/* Rating Row */}
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-gray-200">تقييم السائق:</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => {
                          const score = i + 1;
                          const currentRating = userRatings[driver.id as number] ?? driver.rating ?? 0;
                          const filled = score <= Math.round(currentRating);
                          return (
                            <button
                              key={score}
                              type="button"
                              onClick={() => handleRateDriver(driver, score)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {typeof driver.reviews === 'number' && driver.reviews > 0 && (
                      <span className="text-[11px] text-gray-400">
                        ({driver.reviews} تقييم)
                      </span>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        setSelectedDriverForDetails(driver);
                        setSelectedVehiclePhotoIndex(null);
                      }}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-base hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Eye className="w-5 h-5" />
                      التفاصيل
                    </button>
                    <button
                      onClick={() => window.open(`tel:${driver.phoneNumber}`, '_self')}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg text-base hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Phone className="w-5 h-5" />
                      اتصل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedDriverForDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-600 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">تفاصيل السائق</h2>
              <button
                onClick={() => setSelectedDriverForDetails(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-lg p-4 border border-blue-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  المعلومات الشخصية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">الاسم الكامل</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">رقم الهاتف</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">المنطقة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">سنوات الخبرة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.experienceYears} سنوات</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 rounded-lg p-4 border border-orange-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  {selectedDriverForDetails.vehicleType === 'سيكل' ? (
                    <Bike className="w-5 h-5 text-orange-400" />
                  ) : (
                    <span className="text-lg">🚐</span>
                  )}
                  معلومات المركبة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">نوع المركبة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">رقم اللوحة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">سنة الصنع</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.manufactureYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">حالة المركبة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.vehicleCondition}</p>
                  </div>
                </div>
              </div>

              {selectedDriverForDetails.vehiclePhotos &&
                selectedDriverForDetails.vehiclePhotos.length > 0 && (
                  <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-4 border border-green-700/30">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-green-400" />
                      صور المركبة
                    </h3>
                    {/* شبكة الصور المصغّرة */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {selectedDriverForDetails.vehiclePhotos.map((photo, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedVehiclePhotoIndex(index)}
                          className="bg-black rounded-lg p-2 border border-gray-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-400/60"
                        >
                          <img
                            src={photo}
                            alt={`صورة المركبة ${index + 1}`}
                            className="w-full h-auto object-contain bg-black rounded"
                          />
                        </button>
                      ))}
                    </div>

                    {/* عارض الصورة الكبيرة مع أسهم للتقليب (نفس أسلوب حراج عدن تقريباً) */}
                    {selectedVehiclePhotoIndex !== null && (
                      <div className="relative bg-black rounded-lg overflow-hidden border border-gray-600 mt-1">
                        <img
                          src={selectedDriverForDetails.vehiclePhotos[selectedVehiclePhotoIndex]}
                          alt={`صورة المركبة ${selectedVehiclePhotoIndex + 1}`}
                          className="w-full h-auto object-contain bg-black"
                        />

                        {/* زر السابق */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedDriverForDetails.vehiclePhotos) return;
                            const total = selectedDriverForDetails.vehiclePhotos.length;
                            setSelectedVehiclePhotoIndex((prev) => {
                              const current = prev ?? 0;
                              return (current - 1 + total) % total;
                            });
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                        >
                          <ArrowRight className="w-5 h-5 rotate-180" />
                        </button>

                        {/* زر التالي */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!selectedDriverForDetails.vehiclePhotos) return;
                            const total = selectedDriverForDetails.vehiclePhotos.length;
                            setSelectedVehiclePhotoIndex((prev) => {
                              const current = prev ?? 0;
                              return (current + 1) % total;
                            });
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  المؤهلات والتراخيص
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedDriverForDetails.hasLicense ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    ></div>
                    <span className="text-white">
                      {selectedDriverForDetails.hasLicense
                        ? 'لديه رخصة قيادة سارية'
                        : 'لا يملك رخصة قيادة'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedDriverForDetails.knowsAdenStreets ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    ></div>
                    <span className="text-white">
                      {selectedDriverForDetails.knowsAdenStreets
                        ? 'يعرف شوارع عدن جيداً'
                        : 'جديد في عدن'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-lg p-4 border border-yellow-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  التقييم والسعر
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">التقييم</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(selectedDriverForDetails.rating || 0)}
                      </div>
                      <span className="font-semibold text-white">
                        ({selectedDriverForDetails.rating})
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">السعر التقديري</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {selectedDriverForDetails.estimatedPrice} ريال
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => window.open(`tel:${selectedDriverForDetails.phoneNumber}`, '_self')}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  اتصل بالسائق
                </button>
                <button
                  onClick={() => setSelectedDriverForDetails(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddDriverModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddDriverModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <form className="px-4 py-4 space-y-4" onSubmit={handleSubmitNewDriver}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDriver.fullName}
                    onChange={(e) => handleNewDriverChange('fullName', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newDriver.phoneNumber}
                    onChange={(e) => handleNewDriverChange('phoneNumber', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    المديرية *
                  </label>
                  <select
                    required
                    value={newDriver.district}
                    onChange={(e) => handleNewDriverChange('district', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر المديرية</option>
                    {uniqueDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    نوع المركبة *
                  </label>
                  <select
                    required
                    value={newDriver.vehicleType}
                    onChange={(e) => handleNewDriverChange('vehicleType', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر النوع</option>
                    {uniqueVehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    رقم اللوحة *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDriver.plateNumber}
                    onChange={(e) => handleNewDriverChange('plateNumber', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    سنة الصنع
                  </label>
                  <input
                    type="number"
                    value={newDriver.manufactureYear}
                    onChange={(e) => handleNewDriverChange('manufactureYear', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    حالة المركبة
                  </label>
                  <select
                    value={newDriver.vehicleCondition}
                    onChange={(e) => handleNewDriverChange('vehicleCondition', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر الحالة</option>
                    <option value="ممتازة">ممتازة</option>
                    <option value="جيدة">جيدة</option>
                    <option value="متوسطة">متوسطة</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    سنوات الخبرة في القيادة
                  </label>
                  <select
                    value={newDriver.experienceYears}
                    onChange={(e) => handleNewDriverChange('experienceYears', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر سنوات الخبرة</option>
                    <option value="أقل من سنة">أقل من سنة</option>
                    <option value="1-2 سنة">1-2 سنة</option>
                    <option value="3-5 سنوات">3-5 سنوات</option>
                    <option value="أكثر من 5 سنوات">أكثر من 5 سنوات</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    تقييم السائق (1 - 5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newDriver.rating}
                    onChange={(e) => handleNewDriverChange('rating', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  صور المركبة (حتى 3 صور)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {newDriver.vehiclePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-auto object-contain bg-black rounded-lg border border-gray-300 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDriverPhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {newDriver.vehiclePhotos.length < 3 && (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg h-24 cursor-pointer text-xs text-gray-500 dark:text-gray-300">
                      <span className="mb-1">إضافة صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDriverImageUpload(file);
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    هل لديك رخصة قيادة سارية؟
                  </label>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-800 dark:text-gray-200">
                    <label
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        newDriver.hasLicense === true
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span>نعم</span>
                      <input
                        type="radio"
                        name="hasLicense"
                        className="h-4 w-4 accent-blue-600 cursor-pointer"
                        checked={newDriver.hasLicense === true}
                        onChange={() => handleNewDriverChange('hasLicense', true)}
                      />
                    </label>
                    <label
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        newDriver.hasLicense === false
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span>لا</span>
                      <input
                        type="radio"
                        name="hasLicense"
                        className="h-4 w-4 accent-blue-600 cursor-pointer"
                        checked={newDriver.hasLicense === false}
                        onChange={() => handleNewDriverChange('hasLicense', false)}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    هل تعرف شوارع عدن جيداً؟
                  </label>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-800 dark:text-gray-200">
                    <label
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        newDriver.knowsAdenStreets === true
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span>نعم</span>
                      <input
                        type="radio"
                        name="knowsAdenStreets"
                        className="h-4 w-4 accent-blue-600 cursor-pointer"
                        checked={newDriver.knowsAdenStreets === true}
                        onChange={() => handleNewDriverChange('knowsAdenStreets', true)}
                      />
                    </label>
                    <label
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        newDriver.knowsAdenStreets === false
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <span>لا</span>
                      <input
                        type="radio"
                        name="knowsAdenStreets"
                        className="h-4 w-4 accent-blue-600 cursor-pointer"
                        checked={newDriver.knowsAdenStreets === false}
                        onChange={() => handleNewDriverChange('knowsAdenStreets', false)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  نبذة عن خبرة السائق وساعات العمل (اختياري)
                </label>
                <textarea
                  rows={3}
                  value={newDriver.notes}
                  onChange={(e) => handleNewDriverChange('notes', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="اكتب نبذة مختصرة عن خبرة السائق وساعات العمل المتاحة"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDriver}
                  className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md disabled:opacity-60"
                >
                  {isSubmittingDriver ? 'جاري الإرسال...' : 'ارسال الطلب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Add Driver Button */}
      <button
        onClick={() => setShowAddDriverModal(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
        aria-label="اضف سائق"
      >
        <Users className="w-6 h-6" />
      </button>

      <AppFooter />
    </div>
  );
}
