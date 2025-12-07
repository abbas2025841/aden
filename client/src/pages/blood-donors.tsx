import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Phone, Users, Search, Plus, ArrowLeft, MessageCircle
} from 'lucide-react';
import { adenBloodDonors, bloodBankStats } from '@/data/aden-blood-bank';
import { supabase } from '@/lib/supabase';

interface BloodDonor {
  id: string;
  name: string;
  bloodType: string;
  phone: string;
  location: string;
  lastDonation: string;
  availability: 'available' | 'busy' | 'unavailable';
}

export default function BloodDonorsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    phone: '',
    location: '',
    age: '',
    lastDonation: '',
    availability: 'available'
  });

  // استخدام Supabase مع بيانات تجريبية احتياطية
  const fallbackDonors: BloodDonor[] = adenBloodDonors;

  useEffect(() => {
    const loadDonors = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('blood_donors')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: BloodDonor[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            bloodType: row.blood_type,
            phone: row.phone,
            location: row.location,
            lastDonation: row.last_donation || '',
            availability: (row.availability as BloodDonor['availability']) || 'available',
          }));

          setDonors(mapped);
        } else {
          setDonors(fallbackDonors);
        }
      } catch (err: any) {
        console.error('Error loading blood donors:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل بيانات المتبرعين');
        setDonors(fallbackDonors);
      } finally {
        setIsLoading(false);
      }
    };

    loadDonors();
  }, []);

  // خيارات المديريات لفلتر المتبرعين
  const districtOptions = [
    { id: 'all', name: 'جميع المناطق', count: 10 },
    { id: 'عدن كريتر', name: 'عدن كريتر', count: 1 },
    { id: 'المعلا', name: 'المعلا', count: 1 },
    { id: 'التواهي', name: 'التواهي', count: 1 },
    { id: 'خور مكسر', name: 'خور مكسر', count: 1 },
    { id: 'المنصورة', name: 'المنصورة', count: 1 },
    { id: 'الشيخ عثمان', name: 'الشيخ عثمان', count: 1 },
    { id: 'البريقة', name: 'البريقة', count: 1 },
    { id: 'دار سعد', name: 'دار سعد', count: 1 },
    { id: 'القلوعه', name: 'القلوعة', count: 1 },
    { id: 'الممدارة', name: 'الممدارة', count: 1 },
  ];

  // عدد المتبرعين الفعلي في كل مديرية
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = donors.length;

    donors.forEach(donor => {
      const loc = donor.location || '';
      const match = districtOptions.find(
        d => d.id !== 'all' && (loc === d.name || loc.includes(d.name))
      );
      const key = match ? match.id : 'other';
      counts[key] = (counts[key] || 0) + 1;
    });

    districtOptions.forEach(d => {
      if (counts[d.id] === undefined) counts[d.id] = 0;
    });

    return counts;
  }, [donors, districtOptions]);

  // فلترة المتبرعين
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           donor.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict =
        selectedDistrict === 'all' ||
        donor.location === selectedDistrict ||
        donor.location.includes(selectedDistrict);
      
      return matchesSearch && matchesDistrict;
    });
  }, [searchQuery, donors, selectedDistrict]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        name: formData.name,
        blood_type: formData.bloodType,
        phone: formData.phone,
        location: formData.location,
        age: Number(formData.age),
        last_donation: formData.lastDonation || null,
        availability: formData.availability || 'available',
      };

      console.log('إرسال متبرع دم إلى Supabase:', payload);

      const { data, error } = await supabase
        .from('blood_donors')
        .insert(payload)
        .select();

      if (error) {
        console.error('خطأ في حفظ المتبرع:', error);
        alert('فشل في حفظ بيانات المتبرع: ' + error.message);
        return;
      }

      console.log('تم حفظ المتبرع في Supabase:', data);
      alert('تم إرسال طلبك كمتبرع دم بنجاح! سيتم مراجعته والموافقة عليه من قبل الإدارة.');

      setFormData({
        name: '',
        bloodType: '',
        phone: '',
        location: '',
        age: '',
        lastDonation: '',
        availability: 'available'
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('استثناء أثناء حفظ المتبرع:', err);
      alert('حدث خطأ غير متوقع أثناء حفظ بيانات المتبرع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">المتبرعين المتاحين</h1>
          </div>
          <p className="text-sky-300 text-sm sm:text-base md:text-lg">مساعدة المرضى في الحصول على الدم المطلوب</p>
        </div>

        {/* زر إضافة متبرع جديد */}
        <div className="mb-4 sm:mb-6 text-center">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showAddForm ? 'إخفاء النموذج' : 'سجل كمتبرع دم'}
          </Button>
        </div>

        {/* نموذج إضافة متبرع */}
        {showAddForm && (
          <Card className="mb-4 sm:mb-6 bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-2xl">
            <CardContent className="p-3 sm:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">سجل كمتبرع دم</h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">الاسم الكامل *</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">فصيلة الدم *</label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-400"
                      required
                    >
                      <option value="">اختر فصيلة الدم</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">رقم الهاتف *</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="أدخل رقم الهاتف"
                      className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">الموقع *</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-400"
                      required
                    >
                      <option value="">اختر الموقع</option>
                      {districtOptions
                        .filter(d => d.id !== 'all')
                        .map(district => (
                          <option key={district.id} value={district.name}>
                            {district.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">العمر *</label>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="أدخل عمرك"
                      min="18"
                      max="65"
                      className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-white placeholder-green-300 focus:ring-2 focus:ring-green-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">آخر تبرع</label>
                    <Input
                      type="date"
                      name="lastDonation"
                      value={formData.lastDonation}
                      onChange={handleInputChange}
                      className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    تسجيل كمتبرع
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* الآية الكريمة */}
        <Card className="mb-4 sm:mb-6 bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-2xl">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-green-200 text-base sm:text-lg leading-relaxed mb-2">
              وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا
            </div>
            <div className="text-green-300 text-xs sm:text-sm">
              سورة المائدة - الآية 32
            </div>
          </CardContent>
        </Card>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-lg">
            <CardContent className="pt-4 sm:pt-6 text-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-300 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{bloodBankStats.availableDonors}</div>
              <div className="text-xs sm:text-sm text-green-200">متبرع متاح</div>
            </CardContent>
          </Card>
          <Card className="bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-lg">
            <CardContent className="pt-4 sm:pt-6 text-center">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-green-300 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-white">{bloodBankStats.totalDonors || 0}</div>
              <div className="text-xs sm:text-sm text-green-200">تبرع إجمالي</div>
            </CardContent>
          </Card>
        </div>

        {/* فلتر المديريات */}
        <Card className="mb-3 sm:mb-4 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl shadow-2xl">
          <CardContent className="p-3 sm:p-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                className="w-full bg-teal-700 border border-teal-500 rounded-xl px-4 py-2 sm:py-3 text-white text-right flex items-center justify-between hover:bg-teal-600 transition-colors min-h-[44px]"
              >
                <span className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="text-sm sm:text-base">
                    {districtOptions.find(d => d.id === selectedDistrict)?.name || 'جميع المناطق'}
                  </span>
                </span>
                <span
                  className={`text-xs sm:text-sm transform transition-transform ${
                    isDistrictOpen ? 'rotate-180' : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {isDistrictOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-teal-900 border border-teal-600 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                  {districtOptions.map((district) => (
                    <button
                      key={district.id}
                      type="button"
                      onClick={() => {
                        setSelectedDistrict(district.id);
                        setIsDistrictOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 sm:py-3 text-white hover:bg-teal-700 flex items-center justify-between transition-colors text-sm sm:text-base"
                    >
                      <span>{district.name}</span>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        {districtCounts[district.id] ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* البحث البسيط */}
        <Card className="mb-4 sm:mb-6 bg-teal-800 bg-opacity-80 border border-teال-600 rounded-xl shadow-2xl">
          <CardContent className="p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-sky-300" />
              <Input
                type="text"
                placeholder="ابحث عن متبرع..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-teal-700 border border-teal-600 rounded-xl px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* عداد النتائج */}
        <div className="mb-4 sm:mb-6 text-center">
          <div className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-3 sm:p-4">
            <p className="text-sky-300 text-sm sm:text-base md:text-lg">
              عرض {filteredDonors.length} من أصل {donors.length} متبرع
            </p>
          </div>
        </div>

        {/* قائمة المتبرعين */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">المتبرعين المتاحين</h2>
            <Badge className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{filteredDonors.length}</Badge>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-lg hover:bg-green-700 transition-all duration-300">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 text-right sm:text-start">
                      <div className="flex flex-wrap items-center justify-end sm:justify-start gap-2 sm:gap-3 mb-2">
                        <h3 className="font-bold text-white text-base sm:text-lg">{donor.name}</h3>
                        <Badge className="bg-green-600 text-white border-green-500 text-xs sm:text-sm">
                          {donor.bloodType}
                        </Badge>
                        <Badge className={`text-xs sm:text-sm px-2 py-1 rounded ${
                          donor.availability === 'available' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {donor.availability === 'available' ? 'متاح' : 'غير متاح'}
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-green-200 mb-1">
                        <strong>الموقع:</strong> {donor.location}
                      </div>
                      <div className="flex items-center justify-end sm:justify-start gap-2 text-green-200">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{donor.phone}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:ml-auto flex-shrink-0">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                        onClick={() => window.open(`tel:${donor.phone}`, '_self')}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        اتصل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDonors.length === 0 && (
            <Card className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl">
              <CardContent className="p-6 sm:p-8 text-center">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-sky-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">لا يوجد متبرعين</h3>
                <p className="text-sky-300 text-sm sm:text-base">لا يوجد متبرعين يطابقون معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أزرار التنقل */}
        <div className="mt-6 sm:mt-8 flex gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/blood-bank')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            العودة لبنك الدم
          </Button>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
