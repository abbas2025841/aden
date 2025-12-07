import React, { useEffect, useState, useRef, useMemo } from 'react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

interface HomeTank {
  id: string;
  name: string;
  capacity: string;
  material: string;
  price: string;
  seller: string;
  contact: string | null;
  location: string | null;
  district: string | null;
  status: string;
  created_at: string;
  images?: string[] | null;
}

interface IdeaAdmin {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  tags: string[] | null;
  approval_status: string;
  created_at: string;
}

interface DevServiceVoteAdmin {
  id: string;
  service_id: string;
  voter_id: string;
  created_at: string;
}

interface BloodRequestAdmin {
  id: string;
  patient_name: string;
  blood_type: string;
  hospital: string;
  contact: string;
  location: string;
  urgency: string;
  description: string | null;
  status: string;
  approval_status: string;
  created_at: string;
}

interface HarajAdAdmin {
  id: string;
  title: string;
  description: string;
  price: number | string | null;
  category: string;
  district: string | null;
  condition: string | null;
  negotiable: boolean | null;
  contact_number: string | null;
  seller_name: string | null;
  images: string[] | null;
  approval_status: string;
  created_at: string;
}

interface BloodDonorAdmin {
  id: string;
  name: string;
  blood_type: string;
  phone: string;
  location: string;
  age: number;
  last_donation: string | null;
  availability: string;
  approval_status: string;
  created_at: string;
}

interface ElectricianAdmin {
  id: string;
  name: string;
  description: string;
  phone: string | null;
  area: string;
  price_range: string | null;
  experience: string | null;
  specialties: string[] | null;
  address: string | null;
  rating: number;
  reviews: number;
  likes: number;
  dislikes: number;
  response_time: string | null;
  available: boolean;
  verified: boolean;
  approval_status: string;
  created_at: string;
}

interface PowerConverterAdmin {
  id: string;
  name: string;
  description: string;
  price: string;
  original_price: string | null;
  category: string;
  seller: string | null;
  phone: string | null;
  features: string[] | null;
  power: string | null;
  warranty: string | null;
  location: string | null;
  approval_status: string;
  created_at: string;
}

interface ChargingPointAdmin {
  id: string;
  name: string;
  location: string;
  district: string;
  hours: string | null;
  charging_types: string[];
  phone: string | null;
  features: string[];
  price: string | null;
  status: string | null;
  status_type: string | null;
  approval_status: string;
  created_at: string;
}

interface MobileTanker {
  id: string;
  driver_name: string;
  capacity: string;
  price: string;
  location: string;
  district: string;
  phone: string | null;
  working_hours: string | null;
  status: string;
  created_at: string;
  images?: string[] | null;
}

interface WaterPointAdmin {
  id: string;
  name: string;
  location: string;
  district: string;
  status_text: string | null;
  approval_status: string;
  created_at: string;
}

interface BulkWaterCompanyAdmin {
  id: string;
  brand: string;
  product_type: string;
  district: string;
  location: string;
  phone: string;
  delivery_info: string | null;
  offers: string | null;
  approval_status: string;
  created_at: string;
}

interface TankMaintenanceCompanyAdmin {
  id: string;
  provider_name: string;
  district: string;
  location: string;
  phone: string;
  experience: string | null;
  working_hours: string | null;
  warranty: string | null;
  approval_status: string;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  district: string;
  phone: string | null;
  working_hours: string | null;
  status: string;
  created_at: string;
}

interface MotorcycleDriverAdmin {
  id: string;
  full_name: string;
  phone_number: string;
  district: string;
  vehicle_type: string;
  plate_number: string;
  manufacture_year: string | null;
  vehicle_condition: string | null;
  experience_years: string | null;
  has_license: boolean;
  knows_aden_streets: boolean;
  rating: number | null;
  notes: string | null;
  approval_status: string;
  created_at: string;
}

const AdminHomeTanksPage: React.FC = () => {
  const [tanks, setTanks] = useState<HomeTank[]>([]);
  const [mobileTankers, setMobileTankers] = useState<MobileTanker[]>([]);
  const [waterPoints, setWaterPoints] = useState<WaterPointAdmin[]>([]);
  const [maintenanceCompanies, setMaintenanceCompanies] = useState<TankMaintenanceCompanyAdmin[]>([]);
  const [bulkWaterCompanies, setBulkWaterCompanies] = useState<BulkWaterCompanyAdmin[]>([]);
  const [powerConverters, setPowerConverters] = useState<PowerConverterAdmin[]>([]);
  const [chargingPoints, setChargingPoints] = useState<ChargingPointAdmin[]>([]);
  const [electricians, setElectricians] = useState<ElectricianAdmin[]>([]);
  const [bloodDonors, setBloodDonors] = useState<BloodDonorAdmin[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequestAdmin[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [motorcycleDrivers, setMotorcycleDrivers] = useState<MotorcycleDriverAdmin[]>([]);
  const [harajAds, setHarajAds] = useState<HarajAdAdmin[]>([]);
  const [ideas, setIdeas] = useState<IdeaAdmin[]>([]);
  const [devVotes, setDevVotes] = useState<DevServiceVoteAdmin[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sectionSearch, setSectionSearch] = useState('');

  // مراجع الأقسام لاستخدامها في التمرير السلس
  const sectionRefs = {
    homeTanks: useRef<HTMLDivElement | null>(null),
    devVotes: useRef<HTMLDivElement | null>(null),
    harajAds: useRef<HTMLDivElement | null>(null),
    ideas: useRef<HTMLDivElement | null>(null),
    bloodRequests: useRef<HTMLDivElement | null>(null),
    bloodDonors: useRef<HTMLDivElement | null>(null),
    electricians: useRef<HTMLDivElement | null>(null),
    motorcycleDrivers: useRef<HTMLDivElement | null>(null),
    jobs: useRef<HTMLDivElement | null>(null),
    powerConverters: useRef<HTMLDivElement | null>(null),
    mobileTankers: useRef<HTMLDivElement | null>(null),
    waterPoints: useRef<HTMLDivElement | null>(null),
    maintenanceCompanies: useRef<HTMLDivElement | null>(null),
    chargingPoints: useRef<HTMLDivElement | null>(null),
    bulkWaterCompanies: useRef<HTMLDivElement | null>(null),
  } as const;

  const sectionFilters = useMemo(
    () => [
      { id: 'homeTanks' as const, label: 'خزانات المنازل' },
      { id: 'mobileTankers' as const, label: 'صهاريج المياه المتنقلة' },
      { id: 'waterPoints' as const, label: 'نقاط المياه' },
      { id: 'maintenanceCompanies' as const, label: 'شركات صيانة الخزانات' },
      { id: 'bulkWaterCompanies' as const, label: 'شركات مياه بالجملة' },
      { id: 'chargingPoints' as const, label: 'نقاط الشحن الشمسي' },
      { id: 'harajAds' as const, label: 'إعلانات حراج عدن' },
      { id: 'ideas' as const, label: 'أفكار عدن' },
      { id: 'jobs' as const, label: 'الوظائف' },
      { id: 'bloodRequests' as const, label: 'طلبات الدم' },
      { id: 'bloodDonors' as const, label: 'المتبرعون بالدم' },
      { id: 'electricians' as const, label: 'الكهربائيون' },
      { id: 'motorcycleDrivers' as const, label: 'سائقي الدباب / التاكسي' },
      { id: 'powerConverters' as const, label: 'محولات الطاقة' },
      { id: 'devVotes' as const, label: 'تصويت خدمات التطوير' },
    ],
    []
  );

  const filteredSectionFilters = useMemo(
    () =>
      sectionFilters.filter((s) =>
        s.label.toLowerCase().includes(sectionSearch.trim().toLowerCase())
      ),
    [sectionFilters, sectionSearch]
  );

  const scrollToSection = (id: keyof typeof sectionRefs) => {
    const ref = sectionRefs[id];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [
        { data: homeTanksData, error: homeTanksError },
        { data: mobileTankersData, error: mobileTankersError },
        { data: waterPointsData, error: waterPointsError },
        { data: maintenanceData, error: maintenanceError },
        { data: bulkWaterData, error: bulkWaterError },
        { data: chargingPointsData, error: chargingPointsError },
        { data: powerConvertersData, error: powerConvertersError },
        { data: electriciansData, error: electriciansError },
        { data: bloodDonorsData, error: bloodDonorsError },
        { data: bloodRequestsData, error: bloodRequestsError },
        { data: jobsData, error: jobsError },
        { data: motorcycleDriversData, error: motorcycleDriversError },
        { data: harajAdsData, error: harajAdsError },
        { data: ideasData, error: ideasError },
        { data: devVotesData, error: devVotesError }
      ] = await Promise.all([
        supabase.from('home_tanks').select('*').order('created_at', { ascending: false }),
        supabase.from('mobile_tankers').select('*').order('created_at', { ascending: false }),
        supabase.from('water_points').select('*').order('created_at', { ascending: false }),
        supabase.from('tank_maintenance_companies').select('*').order('created_at', { ascending: false }),
        supabase.from('bulk_water_companies').select('*').order('created_at', { ascending: false }),
        supabase.from('charging_points').select('*').order('created_at', { ascending: false }),
        supabase.from('power_converters').select('*').order('created_at', { ascending: false }),
        supabase.from('electricians').select('*').order('created_at', { ascending: false }),
        supabase.from('blood_donors').select('*').order('created_at', { ascending: false }),
        supabase.from('blood_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('motorcycle_drivers').select('*').order('created_at', { ascending: false }),
        supabase.from('haraj_ads').select('*').order('created_at', { ascending: false }),
        supabase.from('ideas').select('*').order('created_at', { ascending: false }),
        supabase.from('dev_service_votes').select('*').order('created_at', { ascending: false })
      ]);

      if (homeTanksError) throw homeTanksError;
      if (mobileTankersError) throw mobileTankersError;
      if (waterPointsError) throw waterPointsError;
      if (maintenanceError) throw maintenanceError;
      if (bulkWaterError) throw bulkWaterError;
      if (chargingPointsError) throw chargingPointsError;
      if (powerConvertersError) throw powerConvertersError;
      if (electriciansError) throw electriciansError;
      if (bloodDonorsError) throw bloodDonorsError;
      if (bloodRequestsError) throw bloodRequestsError;
      if (jobsError) throw jobsError;
      if (motorcycleDriversError) throw motorcycleDriversError;
      if (harajAdsError) throw harajAdsError;
      if (ideasError) throw ideasError;

      setTanks((homeTanksData as HomeTank[]) || []);
      setMobileTankers((mobileTankersData as MobileTanker[]) || []);
      setWaterPoints((waterPointsData as WaterPointAdmin[]) || []);
      setMaintenanceCompanies((maintenanceData as TankMaintenanceCompanyAdmin[]) || []);
      setBulkWaterCompanies((bulkWaterData as BulkWaterCompanyAdmin[]) || []);
      setChargingPoints((chargingPointsData as ChargingPointAdmin[]) || []);
      setPowerConverters((powerConvertersData as PowerConverterAdmin[]) || []);
      setElectricians((electriciansData as ElectricianAdmin[]) || []);
      setBloodDonors((bloodDonorsData as BloodDonorAdmin[]) || []);
      setBloodRequests((bloodRequestsData as BloodRequestAdmin[]) || []);
      setJobs((jobsData as Job[]) || []);
      setMotorcycleDrivers((motorcycleDriversData as MotorcycleDriverAdmin[]) || []);
      setHarajAds((harajAdsData as HarajAdAdmin[]) || []);
      setIdeas((ideasData as IdeaAdmin[]) || []);
      setDevVotes((devVotesData as DevServiceVoteAdmin[]) || []);
    } catch (err: any) {
      console.error('Error fetching admin data:', err);
      setError(err.message || 'حدث خطأ أثناء جلب بيانات الإدارة');
    } finally {
      setIsLoading(false);
    }
  };

  // معرض الصور العام لجميع الأقسام
  const openGallery = (images: string[] | null | undefined, index: number) => {
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

  const updateIdeaStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase
        .from('ideas')
        .update({ approval_status: status })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating ideas status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة الفكرة');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHarajAdStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase
        .from('haraj_ads')
        .update({ approval_status: status })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating haraj_ads status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة إعلان الحراج');
    } finally {
      setIsLoading(false);
    }
  };

  const updateChargingPointStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase
        .from('charging_points')
        .update({ approval_status: status })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating charging_points status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة نقطة الشحن');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBulkWaterCompanyStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase
        .from('bulk_water_companies')
        .update({ approval_status: status })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating bulk_water_companies status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة شركة المياه');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMaintenanceCompanyStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase
        .from('tank_maintenance_companies')
        .update({ approval_status: status })
        .eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating tank_maintenance_companies status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة شركة الصيانة');
    } finally {
      setIsLoading(false);
    }
  };

  const updateHomeTankStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.from('home_tanks').update({ status }).eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating home_tanks status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة الخزان');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMobileTankerStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.from('mobile_tankers').update({ status }).eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating mobile_tankers status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة الصهريج');
    } finally {
      setIsLoading(false);
    }
  };

  const updateWaterPointStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsLoading(true);
      setError(null);
      const { error } = await supabase.from('water_points').update({ approval_status: status }).eq('id', id);

      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      console.error('Error updating water_points status:', err);
      setError(err.message || 'حدث خطأ أثناء تحديث حالة نقطة المياه');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">لوحة التحكم - خزانات المنازل وصهاريج المياه</h1>
            <p className="text-sm text-gray-300">
              هذه الصفحة خاصة بالمشرف فقط لمراجعة الخزانات والصهاريج والموافقة عليها أو رفضها.
            </p>
          </div>
          <Button
            onClick={fetchData}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'جاري التحديث...' : 'تحديث القائمة'}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* شريط البحث والفلاتر للأقسام */}
        <section className="mb-4 rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 space-y-3 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <div className="font-semibold flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg">🔎</span>
              التنقل بين أقسام الموافقات
            </div>
            <div className="w-full sm:w-64">
              <Input
                value={sectionSearch}
                onChange={(e) => setSectionSearch(e.target.value)}
                placeholder="بحث باسم القسم (مثلاً: حراج، الدم، كهربائيون...)"
                className="h-9 bg-gray-950 border-gray-700 text-xs sm:text-sm placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
            {filteredSectionFilters.map((section) => (
              <Button
                key={section.id}
                type="button"
                size="sm"
                variant="outline"
                className="border-gray-700 text-[11px] sm:text-xs text-gray-200 hover:bg-gray-800 px-2 py-1"
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </Button>
            ))}
            {filteredSectionFilters.length === 0 && (
              <span className="text-[11px] text-gray-500">لا توجد أقسام مطابقة لبحثك.</span>
            )}
          </div>
        </section>

        {/* نظرة سريعة على أقسام الموافقات */}
        <section className="mb-4 rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 text-xs sm:text-sm space-y-2">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg">📋</span>
              مركز الموافقات للخدمات والإعلانات
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="rounded-lg bg-gray-950/70 border border-gray-800 px-3 py-2 flex flex-col gap-1">
              <span className="text-[11px] text-gray-400">خدمات المياه</span>
              <span className="text-sm font-semibold text-teal-300">
                خزانات، صهاريج، نقاط مياه، شركات مياه
              </span>
            </div>
            <div className="rounded-lg bg-gray-950/70 border border-gray-800 px-3 py-2 flex flex-col gap-1">
              <span className="text-[11px] text-gray-400">الإعلانات والمحتوى</span>
              <span className="text-sm font-semibold text-sky-300">
                حراج، أفكار عدن، وظائف
              </span>
            </div>
            <div className="rounded-lg bg-gray-950/70 border border-gray-800 px-3 py-2 flex flex-col gap-1">
              <span className="text-[11px] text-gray-400">الخدمات الإنسانية والفردية</span>
              <span className="text-sm font-semibold text-rose-300">
                دم، كهربائيون، سائقو دباب/تاكسي
              </span>
            </div>
          </div>
        </section>

        {/* قسم خزانات المنازل */}
        <section ref={sectionRefs.homeTanks} className="space-y-3">
          <h2 className="text-xl font-semibold mb-2">خزانات المنازل</h2>

          {tanks.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>home_tanks</code>.
            </div>
          )}

          {tanks.length > 0 && (
            <div className="space-y-3">
              {tanks.map((tank) => (
                <div
                  key={tank.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{tank.name}</div>
                      <div className="text-gray-300 text-sm">
                        {tank.capacity} • {tank.material} • {tank.price}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        المورد: {tank.seller} | المديرية: {tank.district || 'غير محددة'}
                      </div>
                      {tank.images && tank.images.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {tank.images.slice(0, 3).map((img, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => openGallery(tank.images || [], index)}
                              className="w-14 h-14 bg-black rounded border border-gray-700 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
                            >
                              <img
                                src={img}
                                alt={`صورة الخزان ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tank.status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : tank.status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {tank.status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || tank.status === 'approved'}
                          onClick={() => updateHomeTankStatus(tank.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || tank.status === 'rejected'}
                          onClick={() => updateHomeTankStatus(tank.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    {tank.contact && (
                      <div>
                        <span className="font-semibold">التواصل:</span> {tank.contact}
                      </div>
                    )}
                    {tank.location && (
                      <div>
                        <span className="font-semibold">الموقع:</span> {tank.location}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(tank.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم سجلات تصويت خدمات قيد التطوير */}
        <section ref={sectionRefs.devVotes} className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">سجلات تصويت خدمات قيد التطوير</h2>

          {devVotes.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>dev_service_votes</code>.
            </div>
          )}

          {devVotes.length > 0 && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-2 font-semibold text-gray-200">المستخدم (معرف مجهول)</th>
                    <th className="py-2 px-2 font-semibold text-gray-200">الخدمة</th>
                    <th className="py-2 px-2 font-semibold text-gray-200">وقت التصويت</th>
                  </tr>
                </thead>
                <tbody>
                  {devVotes.map((vote) => (
                    <tr key={vote.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-1.5 px-2 text-gray-300 break-all">
                        {vote.voter_id}
                      </td>
                      <td className="py-1.5 px-2 text-gray-300">
                        {vote.service_id}
                      </td>
                      <td className="py-1.5 px-2 text-gray-300">
                        {new Date(vote.created_at).toLocaleString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* قسم إعلانات حراج عدن العادية */}
        <section ref={sectionRefs.harajAds} className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">إعلانات حراج عدن</h2>

          {harajAds.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>haraj_ads</code>.
            </div>
          )}

          {harajAds.length > 0 && (
            <div className="space-y-3">
              {harajAds.map((ad) => (
                <div
                  key={ad.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{ad.title}</div>
                      <div className="text-gray-300 text-sm line-clamp-2">{ad.description}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        السعر: {ad.price ?? 'غير محدد'} {ad.negotiable ? '(قابل للتفاوض)' : ''}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الفئة: {ad.category} | المديرية: {ad.district || 'غير محددة'}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الحالة: {ad.condition || 'غير محددة'}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        البائع: {ad.seller_name || 'مستخدم'} | الهاتف: {ad.contact_number || 'غير محدد'}
                      </div>
                      {ad.images && ad.images.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {ad.images.slice(0, 3).map((img, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => openGallery(ad.images || [], index)}
                              className="w-16 h-16 bg-black rounded border border-gray-700 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400/70"
                            >
                              <img
                                src={img}
                                alt={`صورة الإعلان ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          ad.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : ad.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {ad.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || ad.approval_status === 'approved'}
                          onClick={() => updateHarajAdStatus(ad.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || ad.approval_status === 'rejected'}
                          onClick={() => updateHarajAdStatus(ad.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(ad.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم أفكار عدن المجتمعية */}
        <section ref={sectionRefs.ideas} className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">أفكار عدن (ideas)</h2>

          {ideas.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>ideas</code>.
            </div>
          )}

          {ideas.length > 0 && (
            <div className="space-y-3">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{idea.title}</div>
                      <div className="text-gray-300 text-sm line-clamp-3">{idea.description}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        الفئة: {idea.category || 'غير محددة'} | الكاتب: {idea.author || 'مستخدم'}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        إعجابات: {idea.likes ?? 0} | تعليقات: {idea.comments ?? 0} | مشاركات: {idea.shares ?? 0}
                      </div>
                      {idea.tags && idea.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-gray-300">
                          {idea.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          idea.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : idea.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : idea.approval_status === 'rejected'
                            ? 'bg-red-700 text-red-100'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        {idea.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || idea.approval_status === 'approved'}
                          onClick={() => updateIdeaStatus(idea.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || idea.approval_status === 'rejected'}
                          onClick={() => updateIdeaStatus(idea.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(idea.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم طلبات الدم */}
        <section ref={sectionRefs.bloodRequests} className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">طلبات الدم</h2>

          {bloodRequests.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>blood_requests</code>.
            </div>
          )}

          {bloodRequests.length > 0 && (
            <div className="space-y-3">
              {bloodRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{req.patient_name}</div>
                      <div className="text-gray-300 text-sm">
                        فصيلة الدم: {req.blood_type} | المستشفى: {req.hospital}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الموقع: {req.location} | الهاتف: {req.contact}
                      </div>
                      {req.description && (
                        <div className="text-gray-400 text-xs mt-1">
                          الوصف: {req.description}
                        </div>
                      )}
                      <div className="text-gray-400 text-xs mt-1">
                        الأولوية: {req.urgency === 'critical' ? 'حرج' : req.urgency === 'urgent' ? 'عاجل' : 'عادي'} | الحالة: {req.status}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          req.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : req.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {req.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || req.approval_status === 'approved'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('blood_requests')
                                .update({ approval_status: 'approved' })
                                .eq('id', req.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating blood_requests status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة طلب الدم');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || req.approval_status === 'rejected'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('blood_requests')
                                .update({ approval_status: 'rejected' })
                                .eq('id', req.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating blood_requests status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة طلب الدم');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(req.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم المتبرعين بالدم */}
        <section ref={sectionRefs.bloodDonors} className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">المتبرعون بالدم</h2>

          {bloodDonors.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>blood_donors</code>.
            </div>
          )}

          {bloodDonors.length > 0 && (
            <div className="space-y-3">
              {bloodDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{donor.name}</div>
                      <div className="text-gray-300 text-sm">
                        فصيلة الدم: {donor.blood_type} | العمر: {donor.age}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الموقع: {donor.location} | الهاتف: {donor.phone}
                      </div>
                      {donor.last_donation && (
                        <div className="text-gray-400 text-xs mt-1">
                          آخر تبرع: {new Date(donor.last_donation).toLocaleDateString('ar-SA')}
                        </div>
                      )}
                      <div className="text-gray-400 text-xs mt-1">
                        الحالة: {donor.availability === 'available' ? 'متاح' : 'غير متاح'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          donor.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : donor.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {donor.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || donor.approval_status === 'approved'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('blood_donors')
                                .update({ approval_status: 'approved' })
                                .eq('id', donor.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating blood_donors status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة المتبرع بالدم');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || donor.approval_status === 'rejected'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('blood_donors')
                                .update({ approval_status: 'rejected' })
                                .eq('id', donor.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating blood_donors status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة المتبرع بالدم');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(donor.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم الكهربائيين */}
        <section ref={sectionRefs.electricians} className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">الكهربائيون</h2>

          {electricians.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>electricians</code>.
            </div>
          )}

          {electricians.length > 0 && (
            <div className="space-y-3">
              {electricians.map((elect) => (
                <div
                  key={elect.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{elect.name}</div>
                      <div className="text-gray-300 text-sm">{elect.description}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        المنطقة: {elect.area} | السعر: {elect.price_range || 'غير محدد'}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الهاتف: {elect.phone || 'غير محدد'} | العنوان: {elect.address || 'غير محدد'}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        التقييم: {Number(elect.rating).toFixed(1)} ({elect.reviews} تقييم)
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          elect.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : elect.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {elect.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || elect.approval_status === 'approved'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('electricians')
                                .update({ approval_status: 'approved' })
                                .eq('id', elect.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating electricians status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة الكهربائي');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || elect.approval_status === 'rejected'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('electricians')
                                .update({ approval_status: 'rejected' })
                                .eq('id', elect.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating electricians status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة الكهربائي');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(elect.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم سائقي الدباب / التاكسي */}
        <section ref={sectionRefs.motorcycleDrivers} className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">سائقي الدباب / التاكسي</h2>

          {motorcycleDrivers.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>motorcycle_drivers</code>.
            </div>
          )}

          {motorcycleDrivers.length > 0 && (
            <div className="space-y-3">
              {motorcycleDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{driver.full_name}</div>
                      <div className="text-gray-300 text-sm">
                        النوع: {driver.vehicle_type} | رقم اللوحة: {driver.plate_number}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        المديرية: {driver.district} | الهاتف: {driver.phone_number}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الخبرة: {driver.experience_years || 'غير محدد'} | التقييم: {driver.rating ?? 'لا يوجد'}
                      </div>
                      {driver.notes && (
                        <div className="text-gray-400 text-xs mt-1">
                          ملاحظات: {driver.notes}
                        </div>
                      )}
                      {driver as any && (driver as any).vehicle_photos && (driver as any).vehicle_photos.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {(driver as any).vehicle_photos.slice(0, 3).map((img: string, index: number) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => openGallery((driver as any).vehicle_photos || [], index)}
                              className="w-16 h-16 bg-black rounded border border-gray-700 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-400/70"
                            >
                              <img
                                src={img}
                                alt={`صورة المركبة ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          driver.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : driver.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {driver.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || driver.approval_status === 'approved'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('motorcycle_drivers')
                                .update({ approval_status: 'approved' })
                                .eq('id', driver.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating motorcycle_drivers status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة السائق');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || driver.approval_status === 'rejected'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('motorcycle_drivers')
                                .update({ approval_status: 'rejected' })
                                .eq('id', driver.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating motorcycle_drivers status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة السائق');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(driver.created_at).toLocaleString('ar-SA')}
                    </div>
                    <div>
                      <span className="font-semibold">رخصة:</span>{' '}
                      {driver.has_license ? 'لديه رخصة قيادة' : 'بدون رخصة'}
                    </div>
                    <div>
                      <span className="font-semibold">معرفة شوارع عدن:</span>{' '}
                      {driver.knows_aden_streets ? 'يعرف الشوارع' : 'لا يعرفها جيداً'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم الوظائف */}
        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">الوظائف</h2>

          {jobs.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>jobs</code>.
            </div>
          )}

          {jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{job.title}</div>
                      <div className="text-gray-300 text-sm">
                        {job.location}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الهاتف: {job.phone || 'غير محدد'}
                      </div>
                      {job.description && (
                        <div className="text-gray-400 text-xs mt-1">
                          الوصف: {job.description}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          (job as any).approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : (job as any).approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {(job as any).approval_status || 'pending'}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || (job as any).approval_status === 'approved'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('jobs')
                                .update({ approval_status: 'approved' })
                                .eq('id', job.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating jobs status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة الوظيفة');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || (job as any).approval_status === 'rejected'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('jobs')
                                .update({ approval_status: 'rejected' })
                                .eq('id', job.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating jobs status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة الوظيفة');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(job.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم محولات الطاقة */}
        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">محولات الطاقة</h2>

          {powerConverters.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>power_converters</code>.
            </div>
          )}

          {powerConverters.length > 0 && (
            <div className="space-y-3">
              {powerConverters.map((conv) => (
                <div
                  key={conv.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{conv.name}</div>
                      <div className="text-gray-300 text-sm">{conv.description}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        النوع: {conv.category || 'غير محدد'} | السعر: {conv.price}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        البائع: {conv.seller || 'غير محدد'} | الموقع: {conv.location || 'غير محدد'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          conv.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : conv.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {conv.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || conv.approval_status === 'approved'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('power_converters')
                                .update({ approval_status: 'approved' })
                                .eq('id', conv.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating power_converters status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة محول الطاقة');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || conv.approval_status === 'rejected'}
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              setError(null);
                              const { error } = await supabase
                                .from('power_converters')
                                .update({ approval_status: 'rejected' })
                                .eq('id', conv.id);

                              if (error) throw error;
                              await fetchData();
                            } catch (err: any) {
                              console.error('Error updating power_converters status:', err);
                              setError(err.message || 'حدث خطأ أثناء تحديث حالة محول الطاقة');
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(conv.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم صهاريج المياه المتنقلة */}
        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">صهاريج المياه المتنقلة</h2>

          {mobileTankers.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>mobile_tankers</code>.
            </div>
          )}

          {mobileTankers.length > 0 && (
            <div className="space-y-3">
              {mobileTankers.map((tanker) => (
                <div
                  key={tanker.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{tanker.driver_name}</div>
                      <div className="text-gray-300 text-sm">
                        {tanker.capacity} • {tanker.price}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        المديرية: {tanker.district || 'غير محددة'}
                      </div>
                      {tanker.images && tanker.images.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {tanker.images.slice(0, 3).map((img, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => openGallery(tanker.images || [], index)}
                              className="w-14 h-14 bg-black rounded border border-gray-700 overflow-hidden flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
                            >
                              <img
                                src={img}
                                alt={`صورة الناقلة ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          tanker.status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : tanker.status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {tanker.status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || tanker.status === 'approved'}
                          onClick={() => updateMobileTankerStatus(tanker.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || tanker.status === 'rejected'}
                          onClick={() => updateMobileTankerStatus(tanker.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    {tanker.phone && (
                      <div>
                        <span className="font-semibold">الهاتف:</span> {tanker.phone}
                      </div>
                    )}
                    {tanker.location && (
                      <div>
                        <span className="font-semibold">الموقع:</span> {tanker.location}
                      </div>
                    )}
                    {tanker.working_hours && (
                      <div>
                        <span className="font-semibold">ساعات العمل:</span> {tanker.working_hours}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(tanker.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم نقاط المياه */}
        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">نقاط المياه</h2>

          {waterPoints.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>water_points</code>.
            </div>
          )}

          {waterPoints.length > 0 && (
            <div className="space-y-3">
              {waterPoints.map((point) => (
                <div
                  key={point.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{point.name}</div>
                      <div className="text-gray-300 text-sm">
                        {point.location}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        المديرية: {point.district || 'غير محددة'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          point.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : point.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {point.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || point.approval_status === 'approved'}
                          onClick={() => updateWaterPointStatus(point.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || point.approval_status === 'rejected'}
                          onClick={() => updateWaterPointStatus(point.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(point.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم شركات صيانة الخزانات */}
        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">شركات صيانة الخزانات</h2>

          {maintenanceCompanies.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>tank_maintenance_companies</code>.
            </div>
          )}

          {maintenanceCompanies.length > 0 && (
            <div className="space-y-3">
              {maintenanceCompanies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{company.provider_name}</div>
                      <div className="text-gray-300 text-sm">
                        {company.location}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        المديرية: {company.district || 'غير محددة'} | الهاتف: {company.phone}
                      </div>
                      {company.experience && (
                        <div className="text-gray-400 text-xs mt-1">
                          الخبرة: {company.experience}
                        </div>
                      )}
                      {company.working_hours && (
                        <div className="text-gray-400 text-xs mt-1">
                          ساعات العمل: {company.working_hours}
                        </div>
                      )}
                      {company.warranty && (
                        <div className="text-gray-400 text-xs mt-1">
                          الضمان: {company.warranty}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          company.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : company.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {company.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || company.approval_status === 'approved'}
                          onClick={() => updateMaintenanceCompanyStatus(company.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || company.approval_status === 'rejected'}
                          onClick={() => updateMaintenanceCompanyStatus(company.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(company.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم نقاط الشحن الشمسي */}
        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">نقاط الشحن الشمسي</h2>

          {chargingPoints.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>charging_points</code>.
            </div>
          )}

          {chargingPoints.length > 0 && (
            <div className="space-y-3">
              {chargingPoints.map((point) => (
                <div
                  key={point.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{point.name}</div>
                      <div className="text-gray-300 text-sm">{point.location}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        المديرية: {point.district || 'غير محددة'}
                      </div>
                      {point.phone && (
                        <div className="text-gray-400 text-xs mt-1">الهاتف: {point.phone}</div>
                      )}
                      {point.hours && (
                        <div className="text-gray-400 text-xs mt-1">ساعات العمل: {point.hours}</div>
                      )}
                      {point.price && (
                        <div className="text-gray-400 text-xs mt-1">السعر: {point.price}</div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          point.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : point.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {point.approval_status || 'pending'}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || point.approval_status === 'approved'}
                          onClick={() => updateChargingPointStatus(point.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || point.approval_status === 'rejected'}
                          onClick={() => updateChargingPointStatus(point.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(point.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم شركات مياه معبأة بالجملة */}
        <section className="space-y-3 border-t border-gray-800 pt-4">
          <h2 className="text-xl font-semibold mb-2">شركات مياه معبأة بالجملة</h2>

          {bulkWaterCompanies.length === 0 && !isLoading && !error && (
            <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
              لا توجد سجلات بعد في جدول <code>bulk_water_companies</code>.
            </div>
          )}

          {bulkWaterCompanies.length > 0 && (
            <div className="space-y-3">
              {bulkWaterCompanies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-lg">{company.brand}</div>
                      <div className="text-gray-300 text-sm">
                        نوع المنتج: {company.product_type}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        المديرية: {company.district || 'غير محددة'} | الموقع: {company.location}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        الهاتف: {company.phone}
                      </div>
                      {company.delivery_info && (
                        <div className="text-gray-400 text-xs mt-1">
                          التوصيل: {company.delivery_info}
                        </div>
                      )}
                      {company.offers && (
                        <div className="text-gray-400 text-xs mt-1">
                          العروض: {company.offers}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          company.approval_status === 'approved'
                            ? 'bg-green-700 text-green-100'
                            : company.approval_status === 'pending'
                            ? 'bg-yellow-700 text-yellow-100'
                            : 'bg-red-700 text-red-100'
                        }`}
                      >
                        {company.approval_status}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading || company.approval_status === 'approved'}
                          onClick={() => updateBulkWaterCompanyStatus(company.id, 'approved')}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-900/30"
                          disabled={isLoading || company.approval_status === 'rejected'}
                          onClick={() => updateBulkWaterCompanyStatus(company.id, 'rejected')}
                        >
                          رفض
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300 text-xs mt-2">
                    <div>
                      <span className="font-semibold">تاريخ الإضافة:</span>{' '}
                      {new Date(company.created_at).toLocaleString('ar-SA')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminHomeTanksPage;
