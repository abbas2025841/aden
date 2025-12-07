import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Phone, Search, Heart, ArrowLeft, Plus
} from 'lucide-react';
import { adenBloodRequests } from '@/data/aden-blood-bank';
import { supabase } from '@/lib/supabase';

interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  urgency: 'urgent' | 'normal' | 'critical';
  contact: string;
  location: string;
  date: string;
  status: 'active' | 'fulfilled' | 'expired';
}

export default function BloodRequestsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: '',
    hospital: '',
    contact: '',
    location: '',
    urgency: 'urgent',
    description: ''
  });

  // استخدام Supabase مع بيانات ثابتة احتياطية
  const fallbackRequests: BloodRequest[] = adenBloodRequests;

  const districtOptions = [
    { id: 'all', name: 'جميع المديريات', icon: '📍' },
    { id: 'عدن كريتر', name: 'عدن كريتر', icon: '🏛️' },
    { id: 'المعلا', name: 'المعلا', icon: '🏢' },
    { id: 'التواهي', name: 'التواهي', icon: '⚓' },
    { id: 'خور مكسر', name: 'خور مكسر', icon: '🌊' },
    { id: 'المنصورة', name: 'المنصورة', icon: '🏪' },
    { id: 'الشيخ عثمان', name: 'الشيخ عثمان', icon: '🕌' },
    { id: 'البريقة', name: 'البريقة', icon: '🏭' },
    { id: 'دار سعد', name: 'دار سعد', icon: '🏘️' },
    { id: 'القلوعه', name: 'القلوعه', icon: '🏙️' },
    { id: 'الممدارة', name: 'الممدارة', icon: '🏙️' },
  ];

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('blood_requests')
          .select('*')
          .eq('approval_status', 'approved')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: BloodRequest[] = data.map((row: any) => ({
            id: row.id,
            patientName: row.patient_name,
            bloodType: row.blood_type,
            hospital: row.hospital,
            urgency: row.urgency as BloodRequest['urgency'],
            contact: row.contact,
            location: row.location,
            date: row.created_at,
            status: row.status as BloodRequest['status'],
          }));

          setRequests(mapped);
        } else {
          setRequests(fallbackRequests);
        }
      } catch (err: any) {
        console.error('Error loading blood requests:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل طلبات الدم');
        setRequests(fallbackRequests);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    counts['all'] = requests.length;

    requests.forEach((request) => {
      const id = request.location || 'other';
      counts[id] = (counts[id] || 0) + 1;
    });

    districtOptions.forEach((opt) => {
      if (counts[opt.id] === undefined) counts[opt.id] = 0;
    });

    return counts;
  }, [requests, districtOptions]);

  // فلترة طلبات الدم
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = selectedDistrict === 'all' || request.location === selectedDistrict;
      
      return matchesSearch && matchesDistrict && request.status === 'active';
    });
  }, [searchQuery, selectedDistrict, requests]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'حرج';
      case 'urgent': return 'عاجل';
      case 'normal': return 'عادي';
      default: return 'غير محدد';
    }
  };

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
        patient_name: formData.patientName,
        blood_type: formData.bloodType,
        hospital: formData.hospital,
        contact: formData.contact,
        location: formData.location,
        urgency: formData.urgency,
        description: formData.description || null,
        status: 'active',
      };

      console.log('إرسال طلب دم إلى Supabase:', payload);

      const { data, error } = await supabase
        .from('blood_requests')
        .insert(payload)
        .select();

      if (error) {
        console.error('خطأ في حفظ طلب الدم:', error);
        alert('فشل في حفظ طلب الدم: ' + error.message);
        return;
      }

      console.log('تم حفظ طلب الدم في Supabase:', data);
      alert('تم إرسال طلب الدم بنجاح! سيتم مراجعة الطلب والموافقة عليه من قبل الإدارة.');

      setFormData({
        patientName: '',
        bloodType: '',
        hospital: '',
        contact: '',
        location: '',
        urgency: 'urgent',
        description: ''
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('استثناء أثناء حفظ طلب الدم:', err);
      alert('حدث خطأ غير متوقع أثناء حفظ طلب الدم');
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
            <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">طلبات الدم العاجلة</h1>
          </div>
          <p className="text-sky-300 text-sm sm:text-base md:text-lg">مساعدة المرضى في الحصول على الدم المطلوب</p>
        </div>

        {/* زر إضافة طلب دم جديد */}
        <div className="mb-6 text-center">
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-lg font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            {showAddForm ? 'إخفاء النموذج' : 'إضافة طلب دم عاجل'}
          </Button>
        </div>

        {/* نموذج إضافة طلب دم */}
        {showAddForm && (
          <Card className="mb-4 sm:mb-6 bg-red-800 bg-opacity-80 border border-red-600 rounded-xl shadow-2xl">
            <CardContent className="p-3 sm:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">إضافة طلب دم عاجل</h2>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">اسم المريض *</label>
                    <Input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المريض"
                      className="w-full bg-red-700 border border-red-600 rounded-lg px-3 py-2 text-white placeholder-red-300 focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">فصيلة الدم *</label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className="w-full bg-red-700 border border-red-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-400"
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
                    <label className="block text-white text-sm font-medium mb-2">المستشفى *</label>
                    <Input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      placeholder="أدخل اسم المستشفى"
                      className="w-full bg-red-700 border border-red-600 rounded-lg px-3 py-2 text-white placeholder-red-300 focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">رقم الهاتف *</label>
                    <Input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="أدخل رقم الهاتف"
                      className="w-full bg-red-700 border border-red-600 rounded-lg px-3 py-2 text-white placeholder-red-300 focus:ring-2 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">الموقع *</label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-red-700 border border-red-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-400"
                      required
                    >
                      <option value="">اختر الموقع</option>
                      <option value="عدن كريتر">عدن كريتر</option>
                      <option value="المعلا">المعلا</option>
                      <option value="التواهي">التواهي</option>
                      <option value="خور مكسر">خور مكسر</option>
                      <option value="المنصورة">المنصورة</option>
                      <option value="الشيخ عثمان">الشيخ عثمان</option>
                      <option value="البريقة">البريقة</option>
                      <option value="دار سعد">دار سعد</option>
                      <option value="القلوعه">القلوعه</option>
                      <option value="الممدارة">الممدارة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">الأولوية *</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full bg-red-700 border border-red-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-400"
                      required
                    >
                      <option value="urgent">عاجل</option>
                      <option value="critical">حرج</option>
                      <option value="normal">عادي</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">وصف الحالة</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="أدخل وصف مختصر للحالة..."
                    rows={3}
                    className="w-full bg-red-700 border border-red-600 rounded-lg px-3 py-2 text-white placeholder-red-300 focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    إرسال الطلب
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

        {/* فلتر المديريات */}
        <div className="mb-4 sm:mb-6">
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDistrictOpen(!isDistrictOpen)}
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
        </div>

        {/* البحث البسيط */}
        <Card className="mb-4 sm:mb-6 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl shadow-2xl">
          <CardContent className="p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-sky-300" />
              <Input
                type="text"
                placeholder="ابحث عن طلب دم..."
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
              عرض {filteredRequests.length} من أصل {requests.length} طلب دم
            </p>
          </div>
        </div>

        {/* قائمة طلبات الدم */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white">طلبات الدم العاجلة</h2>
            <Badge className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">{filteredRequests.length}</Badge>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="bg-red-800 bg-opacity-80 border border-red-600 rounded-xl shadow-lg hover:bg-red-700 transition-all duration-300">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 text-right sm:text-start">
                      <div className="flex flex-wrap items-center justify-end sm:justify-start gap-2 sm:gap-3 mb-2">
                        <h3 className="font-bold text-white text-base sm:text-lg">{request.patientName}</h3>
                        <Badge className="bg-red-600 text-white border-red-500 text-xs sm:text-sm">
                          {request.bloodType}
                        </Badge>
                        <Badge className={`text-xs sm:text-sm px-2 py-1 rounded ${getUrgencyColor(request.urgency)}`}>
                          {getUrgencyText(request.urgency)}
                        </Badge>
                      </div>
                      <div className="text-xs sm:text-sm text-red-200 mb-1">
                        <strong>المستشفى:</strong> {request.hospital}
                      </div>
                      <div className="text-xs sm:text-sm text-red-200 mb-1">
                        <strong>الموقع:</strong> {request.location}
                      </div>
                      <div className="flex items-center justify-end sm:justify-start gap-2 text-red-200">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{request.contact}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:ml-auto flex-shrink-0">
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                        onClick={() => window.open(`tel:${request.contact}`, '_self')}
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

          {filteredRequests.length === 0 && (
            <Card className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl">
              <CardContent className="p-6 sm:p-8 text-center">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-sky-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">لا توجد طلبات دم</h3>
                <p className="text-sky-300 text-sm sm:text-base">لا توجد طلبات دم تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أزرار التنقل */}
        <div className="mt-8 flex gap-4 justify-center">
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
