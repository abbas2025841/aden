import React, { useState, useEffect } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { adenHealthFacilities, HealthFacility } from '@/data/aden-health-facilities';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AppointmentDetailsModal from '@/components/AppointmentDetailsModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  Filter, 
  Search, 
  Plus, 
  CalendarDays, 
  User, 
  Stethoscope,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Activity,
  Shield,
  Zap
} from 'lucide-react';

interface Appointment {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityNameEn: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  patientName: string;
  patientPhone: string;
  notes?: string;
  createdAt: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    facilityId: 'republic-hospital-aden',
    facilityName: 'مستشفى الجمهورية',
    facilityNameEn: 'Republic Hospital',
    specialty: 'طوارئ',
    date: '2024-01-20',
    time: '10:00',
    status: 'scheduled',
    patientName: 'أحمد محمد السعيد',
    patientPhone: '777123456',
    notes: 'فحص دوري شامل - متابعة ضغط الدم',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    facilityId: 'aden-international-hospital',
    facilityName: 'مستشفى عدن الدولي',
    facilityNameEn: 'Aden International Hospital',
    specialty: 'أطفال',
    date: '2024-01-22',
    time: '14:30',
    status: 'confirmed',
    patientName: 'فاطمة علي حسن',
    patientPhone: '777654321',
    notes: 'متابعة طفل - تطعيمات إضافية',
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    facilityId: 'aden-cardiac-center',
    facilityName: 'مركز عدن للقلب',
    facilityNameEn: 'Aden Cardiac Center',
    specialty: 'أمراض القلب',
    date: '2024-01-25',
    time: '09:00',
    status: 'confirmed',
    patientName: 'محمد عبدالله',
    patientPhone: '777789123',
    notes: 'قسطرة قلبية - فحص دوري',
    createdAt: '2024-01-18'
  },
  {
    id: '4',
    facilityId: 'aden-maternity-hospital',
    facilityName: 'مستشفى عدن للولادة',
    facilityNameEn: 'Aden Maternity Hospital',
    specialty: 'نساء وولادة',
    date: '2024-01-28',
    time: '11:00',
    status: 'scheduled',
    patientName: 'نورا أحمد',
    patientPhone: '777456789',
    notes: 'فحص حمل - الأسبوع 32',
    createdAt: '2024-01-19'
  },
  {
    id: '5',
    facilityId: 'aden-eye-clinic',
    facilityName: 'عيادة عدن للعيون',
    facilityNameEn: 'Aden Eye Clinic',
    specialty: 'طب وجراحة العيون',
    date: '2024-01-30',
    time: '15:00',
    status: 'completed',
    patientName: 'سارة محمد',
    patientPhone: '777321654',
    notes: 'فحص نظر - تم الانتهاء',
    createdAt: '2024-01-10'
  }
];

export default function HealthAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(mockAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);
  
  // حالة النافذة المنبثقة
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // بيانات نموذج الموعد الجديد
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientPhone: '',
    facilityId: '',
    specialty: '',
    date: '',
    time: '',
    notes: ''
  });

  // تصفية المواعيد
  useEffect(() => {
    let filtered = appointments;

    if (searchQuery) {
      filtered = filtered.filter(appointment =>
        appointment.facilityName.includes(searchQuery) ||
        appointment.facilityNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.patientName.includes(searchQuery) ||
        appointment.specialty.includes(searchQuery)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.specialty === specialtyFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, statusFilter, specialtyFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-900/80 text-yellow-300 border-yellow-700';
      case 'confirmed': return 'bg-green-900/80 text-green-300 border-green-700';
      case 'completed': return 'bg-blue-900/80 text-blue-300 border-blue-700';
      case 'cancelled': return 'bg-red-900/80 text-red-300 border-red-700';
      default: return 'bg-gray-900/80 text-gray-300 border-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مجدول';
      case 'confirmed': return 'مؤكد';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  // دالة لفتح نافذة التفاصيل
  const handleShowDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const specialties = Array.from(new Set(adenHealthFacilities.flatMap(facility => facility.specialties)));

  // وظائف إدارة النموذج
  const handleInputChange = (field: string, value: string) => {
    setNewAppointment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الحقول المطلوبة
    if (!newAppointment.patientName || !newAppointment.patientPhone || !newAppointment.facilityId || 
        !newAppointment.specialty || !newAppointment.date || !newAppointment.time) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // إنشاء موعد جديد
    const facility = adenHealthFacilities.find(f => f.id === newAppointment.facilityId);
    const newAppointmentData: Appointment = {
      id: Date.now().toString(),
      facilityId: newAppointment.facilityId,
      facilityName: facility?.name || '',
      facilityNameEn: facility?.nameEn || '',
      specialty: newAppointment.specialty,
      date: newAppointment.date,
      time: newAppointment.time,
      status: 'scheduled',
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      notes: newAppointment.notes,
      createdAt: new Date().toISOString().split('T')[0]
    };

    // إضافة الموعد الجديد
    setAppointments(prev => [newAppointmentData, ...prev]);
    
    // إعادة تعيين النموذج
    setNewAppointment({
      patientName: '',
      patientPhone: '',
      facilityId: '',
      specialty: '',
      date: '',
      time: '',
      notes: ''
    });
    
    // إغلاق النموذج
    setShowNewAppointment(false);
    
    alert('تم حجز الموعد بنجاح!');
  };

  const resetForm = () => {
    setNewAppointment({
      patientName: '',
      patientPhone: '',
      facilityId: '',
      specialty: '',
      date: '',
      time: '',
      notes: ''
    });
    setShowNewAppointment(false);
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="w-full">
        <AppHeader />
        
        {/* شريط قيد التطوير */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-4 px-4 relative overflow-hidden shadow-lg mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <span className="font-bold text-lg">🚧 قيد التطوير - صفحة مواعيد الطبية 🚧</span>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <div className="relative z-10 mt-2">
            <span className="text-sm font-medium opacity-90">هذه الصفحة قيد التطوير وقد تحتوي على ميزات غير مكتملة</span>
          </div>
        </div>

        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-md sm:max-w-2xl lg:max-w-6xl">
        {/* العنوان الرئيسي المحسن */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl border border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-full shadow-lg">
                <CalendarDays className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  مواعيد الطبية
                </h1>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">إدارة مواعيدك الطبية في مرافق عدن الصحية</p>
              </div>
            </div>
            
            {/* إحصائيات سريعة في العنوان */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
              <div className="text-center p-3 rounded-lg bg-blue-900/30 border border-blue-700/30">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400">{appointments.length}</div>
                <div className="text-xs sm:text-sm text-gray-300">إجمالي المواعيد</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-900/30 border border-green-700/30">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-300">مواعيد مؤكدة</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-900/30 border border-yellow-700/30">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400">
                  {appointments.filter(a => a.status === 'scheduled').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-300">في الانتظار</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-900/30 border border-purple-700/30">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400">
                  {appointments.filter(a => a.status === 'completed').length}
                </div>
                <div className="text-xs sm:text-sm text-gray-300">مكتملة</div>
              </div>
            </div>
          </div>
        </div>

        {/* شريط البحث والتصفية المُحسن */}
        <Card className="mb-6 shadow-lg border-0 bg-gradient-to-r from-gray-900/95 to-blue-900/95 backdrop-blur-sm border-gray-700/50">
          <div className="p-4 sm:p-6">
            {/* البحث الرئيسي */}
            <div className="mb-4">
              <div className="relative group">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  placeholder="البحث في المواعيد، المرافق، أو المرضى..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-12 text-base border-2 border-gray-600/50 focus:border-blue-500 rounded-xl transition-all duration-200 bg-gray-800/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* الفلاتر والإجراءات */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* تصفية الحالة */}
              <div className="flex-1 sm:max-w-xs">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 border-2 border-gray-600/50 focus:border-green-500 rounded-xl bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-green-400" />
                      <SelectValue placeholder="حالة الموعد" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="all" className="text-gray-300 hover:bg-gray-800">جميع الحالات</SelectItem>
                    <SelectItem value="scheduled" className="text-gray-300 hover:bg-gray-800">📅 مجدول</SelectItem>
                    <SelectItem value="confirmed" className="text-gray-300 hover:bg-gray-800">✅ مؤكد</SelectItem>
                    <SelectItem value="completed" className="text-gray-300 hover:bg-gray-800">🎉 مكتمل</SelectItem>
                    <SelectItem value="cancelled" className="text-gray-300 hover:bg-gray-800">❌ ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* تصفية التخصص */}
              <div className="flex-1 sm:max-w-xs">
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="h-11 border-2 border-gray-600/50 focus:border-purple-500 rounded-xl bg-gray-800/30 text-gray-300 hover:bg-gray-800/50 transition-all">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-purple-400" />
                      <SelectValue placeholder="التخصص الطبي" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="all" className="text-gray-300 hover:bg-gray-800">جميع التخصصات</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty} className="text-gray-300 hover:bg-gray-800">
                        {specialty === 'طوارئ' ? '🚨 ' : 
                         specialty === 'أطفال' ? '👶 ' :
                         specialty === 'نساء وولادة' ? '🤱 ' :
                         specialty === 'أمراض القلب' ? '❤️ ' :
                         specialty === 'طب وجراحة العيون' ? '👁️ ' :
                         specialty === 'جراحة عامة' ? '⚕️ ' : '🏥 '}
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* زر إضافة موعد جديد */}
              <Button 
                onClick={() => setShowNewAppointment(true)}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white h-11 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex-shrink-0"
              >
                <Plus className="w-4 h-4 ml-1 sm:ml-2" />
                <span className="hidden sm:inline">موعد جديد</span>
                <span className="sm:hidden">جديد</span>
              </Button>
            </div>

            {/* عداد النتائج */}
            {searchQuery && (
              <div className="mt-4 text-sm text-gray-400 bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                <span className="text-blue-400 font-medium">{filteredAppointments.length}</span> موعد يطابق البحث: "{searchQuery}"
              </div>
            )}
          </div>
        </Card>


        {/* قائمة المواعيد المحسنة */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-gray-900/90 to-blue-900/90 border-2 border-dashed border-gray-600 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-800 rounded-full mb-4">
                  <Calendar className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">لا توجد مواعيد</h3>
                <p className="text-gray-300 mb-6 text-lg">لم يتم العثور على مواعيد تطابق معايير البحث</p>
                <Button 
                  onClick={() => setShowNewAppointment(true)}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  إضافة موعد جديد
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredAppointments.map((appointment) => {
                const facility = adenHealthFacilities.find(f => f.id === appointment.facilityId);
                const isUpcoming = new Date(appointment.date) >= new Date();
                const isToday = new Date(appointment.date).toDateString() === new Date().toDateString();
                
                return (
                  <Card key={appointment.id} className={`p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-l-4 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm ${
                    appointment.status === 'confirmed' ? 'border-l-green-500' :
                    appointment.status === 'scheduled' ? 'border-l-yellow-500' :
                    appointment.status === 'completed' ? 'border-l-blue-500' :
                    'border-l-red-500'
                  } ${isToday ? 'ring-2 ring-blue-400 bg-blue-900/30' : ''}`}>
                    
                    {/* العنوان والأيقونة */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex-shrink-0">
                        {appointment.specialty === 'طوارئ' ? <Zap className="w-5 h-5 text-red-600" /> :
                         appointment.specialty === 'أطفال' ? <Heart className="w-5 h-5 text-pink-600" /> :
                         appointment.specialty === 'نساء وولادة' ? <Heart className="w-5 h-5 text-purple-600" /> :
                         appointment.specialty === 'أمراض القلب' ? <Heart className="w-5 h-5 text-red-600" /> :
                         appointment.specialty === 'طب وجراحة العيون' ? <Eye className="w-5 h-5 text-blue-600" /> :
                         <Stethoscope className="w-5 h-5 text-green-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">
                          {appointment.facilityName}
                        </h3>
                        <p className="text-sm text-gray-300">{appointment.specialty}</p>
                      </div>
                      
                      {/* الحالة */}
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(appointment.status)} px-2 py-1 text-xs font-medium`}>
                          {appointment.status === 'scheduled' && <Clock className="w-3 h-3 ml-1" />}
                          {appointment.status === 'confirmed' && <CheckCircle className="w-3 h-3 ml-1" />}
                          {appointment.status === 'completed' && <Activity className="w-3 h-3 ml-1" />}
                          {appointment.status === 'cancelled' && <XCircle className="w-3 h-3 ml-1" />}
                          {getStatusText(appointment.status)}
                        </Badge>
                        {isToday && (
                          <Badge className="bg-blue-900/80 text-blue-300 border-blue-700 px-2 py-1 text-xs font-medium">
                            <AlertCircle className="w-3 h-3 ml-1" />
                            اليوم
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* المعلومات الأساسية فقط */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white text-sm truncate">{appointment.patientName}</p>
                          <p className="text-gray-400 text-xs">المريض</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Calendar className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white text-sm">{appointment.date}</p>
                          <p className="text-gray-400 text-xs">التاريخ</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white text-sm">{appointment.time}</p>
                          <p className="text-gray-400 text-xs">الوقت</p>
                        </div>
                      </div>
                    </div>

                    {/* أزرار الإجراءات المبسطة */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 h-9 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white text-sm"
                      >
                        <Edit className="w-3 h-3 ml-1" />
                        تعديل
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1 h-9 border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-sm"
                      >
                        <Trash2 className="w-3 h-3 ml-1" />
                        إلغاء
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => handleShowDetails(appointment)}
                        className="flex-1 h-9 border-green-600 text-green-400 hover:bg-green-600 hover:text-white text-sm"
                      >
                        <Eye className="w-3 h-3 ml-1" />
                        التفاصيل
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        </main>
        <AppFooter />
      </div>

      {/* نموذج إضافة موعد جديد */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/50 border-blue-200 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg p-6">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                إضافة موعد طبي جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitAppointment} className="space-y-6">
                {/* معلومات المريض */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم المريض *</label>
                    <Input 
                      placeholder="أدخل اسم المريض"
                      value={newAppointment.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className="border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                    <Input 
                      placeholder="أدخل رقم الهاتف"
                      value={newAppointment.patientPhone}
                      onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                      className="border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* اختيار المرفق الصحي */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المرفق الصحي *</label>
                  <Select value={newAppointment.facilityId} onValueChange={(value) => handleInputChange('facilityId', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="اختر المرفق الصحي" />
                    </SelectTrigger>
                    <SelectContent>
                      {adenHealthFacilities.map((facility) => (
                        <SelectItem key={facility.id} value={facility.id}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* التخصص */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">التخصص *</label>
                  <Select value={newAppointment.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="اختر التخصص" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* التاريخ والوقت */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ *</label>
                    <Input 
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الوقت *</label>
                    <Input 
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* الملاحظات */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات إضافية</label>
                  <textarea 
                    placeholder="أدخل أي ملاحظات أو تفاصيل إضافية..."
                    value={newAppointment.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3"
                  >
                    <Calendar className="w-5 h-5 ml-2" />
                    حجز الموعد
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 py-3"
                  >
                    <XCircle className="w-5 h-5 ml-2" />
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* النافذة المنبثقة لتفاصيل الموعد */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          facility={adenHealthFacilities.find(f => f.id === selectedAppointment.facilityId)}
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
        />
      )}
    </div>
  );
}
