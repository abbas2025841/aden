import React, { useState } from 'react';
import { adenHealthFacilities, HealthFacility } from '@/data/aden-health-facilities';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Clock, 
  User, 
  Stethoscope, 
  Star, 
  MapPin, 
  Calendar,
  MessageCircle,
  Video,
  Headphones,
  Shield,
  Heart,
  Activity,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';
import DetailsModal from '@/components/DetailsModal';

interface Consultation {
  id: string;
  doctorName: string;
  specialty: string;
  facility: string;
  phone: string;
  availability: string;
  rating: number;
  price: string;
  languages: string[];
  experience: string;
  description: string;
  isAvailable: boolean;
}

const mockConsultations: Consultation[] = [
  {
    id: '1',
    doctorName: 'د. أحمد محمد السعيد',
    specialty: 'طوارئ',
    facility: 'مستشفى الجمهورية',
    phone: '023200000',
    availability: '24/7',
    rating: 4.8,
    price: 'مجاني',
    languages: ['العربية', 'الإنجليزية'],
    experience: '15 سنة',
    description: 'استشاري طوارئ مع خبرة واسعة في التعامل مع الحالات الطارئة',
    isAvailable: true
  },
  {
    id: '2',
    doctorName: 'د. فاطمة علي حسن',
    specialty: 'أطفال',
    facility: 'مستشفى عدن الدولي',
    phone: '023700000',
    availability: '8 ص - 10 م',
    rating: 4.9,
    price: '50 ريال',
    languages: ['العربية'],
    experience: '12 سنة',
    description: 'طبيبة أطفال متخصصة في طب الأطفال والمراهقين',
    isAvailable: true
  },
  {
    id: '3',
    doctorName: 'د. محمد عبدالله',
    specialty: 'أمراض القلب',
    facility: 'مركز عدن للقلب',
    phone: '023500000',
    availability: '9 ص - 6 م',
    rating: 4.7,
    price: '100 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '20 سنة',
    description: 'استشاري أمراض القلب والقسطرة القلبية',
    isAvailable: false
  },
  {
    id: '4',
    doctorName: 'د. نورا أحمد',
    specialty: 'نساء وولادة',
    facility: 'مستشفى عدن للولادة',
    phone: '023600000',
    availability: '8 ص - 8 م',
    rating: 4.6,
    price: '75 ريال',
    languages: ['العربية'],
    experience: '18 سنة',
    description: 'طبيبة نساء وولادة مع خبرة في المتابعة والولادة',
    isAvailable: true
  },
  {
    id: '5',
    doctorName: 'د. سارة محمد',
    specialty: 'طب وجراحة العيون',
    facility: 'عيادة عدن للعيون',
    phone: '023600000',
    availability: '9 ص - 10 م',
    rating: 4.5,
    price: '60 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '14 سنة',
    description: 'طبيبة عيون متخصصة في جراحة العيون والليزك',
    isAvailable: true
  },
  // تخصصات جديدة
  {
    id: '6',
    doctorName: 'د. خالد يوسف',
    specialty: 'جراحة عامة',
    facility: 'مستشفى عدن الجراحي',
    phone: '023800000',
    availability: '8 ص - 6 م',
    rating: 4.4,
    price: '120 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '16 سنة',
    description: 'جراح عام متخصص في الجراحات المفتوحة والمنظار',
    isAvailable: true
  },
  {
    id: '7',
    doctorName: 'د. أمل سالم',
    specialty: 'أمراض الجلدية',
    facility: 'عيادة عدن للجلدية',
    phone: '023900000',
    availability: '9 ص - 7 م',
    rating: 4.3,
    price: '80 ريال',
    languages: ['العربية'],
    experience: '11 سنة',
    description: 'طبيبة جلدية متخصصة في علاج الأمراض الجلدية والتجميل',
    isAvailable: true
  },
  {
    id: '8',
    doctorName: 'د. عبدالرحمن علي',
    specialty: 'أمراض الجهاز الهضمي',
    facility: 'مركز عدن للجهاز الهضمي',
    phone: '024000000',
    availability: '8 ص - 5 م',
    rating: 4.6,
    price: '90 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '13 سنة',
    description: 'استشاري أمراض الجهاز الهضمي والمنظار',
    isAvailable: false
  },
  {
    id: '9',
    doctorName: 'د. مريم عبدالله',
    specialty: 'أمراض الكلى',
    facility: 'مستشفى عدن للكلى',
    phone: '024100000',
    availability: '9 ص - 8 م',
    rating: 4.7,
    price: '110 ريال',
    languages: ['العربية'],
    experience: '17 سنة',
    description: 'استشارية أمراض الكلى والغسيل الكلوي',
    isAvailable: true
  },
  {
    id: '10',
    doctorName: 'د. ياسر محمد',
    specialty: 'أمراض الرئة',
    facility: 'مستشفى عدن للرئة',
    phone: '024200000',
    availability: '8 ص - 6 م',
    rating: 4.5,
    price: '85 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '14 سنة',
    description: 'استشاري أمراض الرئة والصدر',
    isAvailable: true
  },
  {
    id: '11',
    doctorName: 'د. هناء أحمد',
    specialty: 'أمراض السكر والغدد',
    facility: 'عيادة عدن للسكر',
    phone: '024300000',
    availability: '9 ص - 7 م',
    rating: 4.8,
    price: '95 ريال',
    languages: ['العربية'],
    experience: '15 سنة',
    description: 'استشارية أمراض السكر والغدد الصماء',
    isAvailable: true
  },
  {
    id: '12',
    doctorName: 'د. عمر حسن',
    specialty: 'أمراض العظام',
    facility: 'مركز عدن للعظام',
    phone: '024400000',
    availability: '8 ص - 5 م',
    rating: 4.4,
    price: '100 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '12 سنة',
    description: 'استشاري أمراض العظام والمفاصل',
    isAvailable: false
  },
  {
    id: '13',
    doctorName: 'د. ريم عبدالرحمن',
    specialty: 'أمراض الأنف والأذن والحنجرة',
    facility: 'عيادة عدن للأنف والأذن',
    phone: '024500000',
    availability: '9 ص - 8 م',
    rating: 4.2,
    price: '70 ريال',
    languages: ['العربية'],
    experience: '10 سنة',
    description: 'طبيبة أنف وأذن وحنجرة متخصصة في الجراحات الدقيقة',
    isAvailable: true
  },
  {
    id: '14',
    doctorName: 'د. طارق سالم',
    specialty: 'أمراض المسالك البولية',
    facility: 'مستشفى عدن للمسالك البولية',
    phone: '024600000',
    availability: '8 ص - 6 م',
    rating: 4.6,
    price: '105 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '18 سنة',
    description: 'استشاري أمراض المسالك البولية والجراحة',
    isAvailable: true
  },
  {
    id: '15',
    doctorName: 'د. لينا يوسف',
    specialty: 'أمراض الدم',
    facility: 'مركز عدن لأمراض الدم',
    phone: '024700000',
    availability: '9 ص - 7 م',
    rating: 4.9,
    price: '130 ريال',
    languages: ['العربية', 'الإنجليزية'],
    experience: '19 سنة',
    description: 'استشارية أمراض الدم والأورام',
    isAvailable: true
  }
];

export default function PhoneConsultationPage() {
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [filteredConsultations, setFilteredConsultations] = useState<Consultation[]>(mockConsultations);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  // تصفية الاستشارات
  React.useEffect(() => {
    let filtered = consultations;

    if (searchQuery) {
      filtered = filtered.filter(consultation =>
        consultation.doctorName.includes(searchQuery) ||
        consultation.specialty.includes(searchQuery) ||
        consultation.facility.includes(searchQuery)
      );
    }

    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(consultation => consultation.specialty === specialtyFilter);
    }

    if (availabilityFilter !== 'all') {
      if (availabilityFilter === 'available') {
        filtered = filtered.filter(consultation => consultation.isAvailable);
      } else if (availabilityFilter === 'free') {
        filtered = filtered.filter(consultation => consultation.price === 'مجاني');
      }
    }

    setFilteredConsultations(filtered);
  }, [consultations, searchQuery, specialtyFilter, availabilityFilter]);

  // دالة لفتح نافذة التفاصيل
  const handleShowDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsDetailsModalOpen(true);
  };

  const specialties = Array.from(new Set(consultations.map(c => c.specialty)));

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'طوارئ': return <Zap className="w-6 h-6 text-red-600" />;
      case 'أطفال': return <Heart className="w-6 h-6 text-pink-600" />;
      case 'نساء وولادة': return <Heart className="w-6 h-6 text-purple-600" />;
      case 'أمراض القلب': return <Heart className="w-6 h-6 text-red-600" />;
      case 'طب وجراحة العيون': return <Activity className="w-6 h-6 text-blue-600" />;
      case 'جراحة عامة': return <Stethoscope className="w-6 h-6 text-indigo-600" />;
      case 'أمراض الجلدية': return <Shield className="w-6 h-6 text-orange-600" />;
      case 'أمراض الجهاز الهضمي': return <Activity className="w-6 h-6 text-teal-600" />;
      case 'أمراض الكلى': return <Heart className="w-6 h-6 text-cyan-600" />;
      case 'أمراض الرئة': return <Activity className="w-6 h-6 text-emerald-600" />;
      case 'أمراض السكر والغدد': return <Activity className="w-6 h-6 text-yellow-600" />;
      case 'أمراض العظام': return <Activity className="w-6 h-6 text-slate-600" />;
      case 'أمراض الأنف والأذن والحنجرة': return <Activity className="w-6 h-6 text-violet-600" />;
      case 'أمراض المسالك البولية': return <Activity className="w-6 h-6 text-rose-600" />;
      case 'أمراض الدم': return <Heart className="w-6 h-6 text-red-500" />;
      default: return <Stethoscope className="w-6 h-6 text-green-600" />;
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'طوارئ': return 'bg-red-900/80 text-red-300 border-red-700';
      case 'أطفال': return 'bg-pink-900/80 text-pink-300 border-pink-700';
      case 'نساء وولادة': return 'bg-purple-900/80 text-purple-300 border-purple-700';
      case 'أمراض القلب': return 'bg-red-900/80 text-red-300 border-red-700';
      case 'طب وجراحة العيون': return 'bg-blue-900/80 text-blue-300 border-blue-700';
      case 'جراحة عامة': return 'bg-indigo-900/80 text-indigo-300 border-indigo-700';
      case 'أمراض الجلدية': return 'bg-orange-900/80 text-orange-300 border-orange-700';
      case 'أمراض الجهاز الهضمي': return 'bg-teal-900/80 text-teal-300 border-teal-700';
      case 'أمراض الكلى': return 'bg-cyan-900/80 text-cyan-300 border-cyan-700';
      case 'أمراض الرئة': return 'bg-emerald-900/80 text-emerald-300 border-emerald-700';
      case 'أمراض السكر والغدد': return 'bg-yellow-900/80 text-yellow-300 border-yellow-700';
      case 'أمراض العظام': return 'bg-slate-900/80 text-slate-300 border-slate-700';
      case 'أمراض الأنف والأذن والحنجرة': return 'bg-violet-900/80 text-violet-300 border-violet-700';
      case 'أمراض المسالك البولية': return 'bg-rose-900/80 text-rose-300 border-rose-700';
      case 'أمراض الدم': return 'bg-red-800/80 text-red-200 border-red-600';
      default: return 'bg-green-900/80 text-green-300 border-green-700';
    }
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
            <span className="font-bold text-lg">🚧 قيد التطوير - صفحة الاستشارة الهاتفية 🚧</span>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <div className="relative z-10 mt-2">
            <span className="text-sm font-medium opacity-90">هذه الصفحة قيد التطوير وقد تحتوي على ميزات غير مكتملة</span>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-6 shadow-lg">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              الاستشارة الهاتفية
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              احصل على استشارة طبية فورية من أفضل الأطباء في عدن عبر الهاتف
            </p>
          </div>

          {/* شريط البحث والتصفية */}
          <Card className="p-6 mb-8 shadow-lg border-0 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm border-blue-700">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* البحث */}
              <div className="flex-1">
                <div className="relative group">
                  <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    placeholder="البحث في الأطباء، التخصصات، المرافق..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-12 h-12 text-lg border-2 border-gray-600 focus:border-blue-500 rounded-xl transition-all duration-200 bg-gray-800/50 text-gray-300"
                  />
                </div>
              </div>

              {/* تصفية التخصص */}
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-full md:w-48 h-12 border-2 border-gray-600 focus:border-blue-500 rounded-xl bg-gray-800/50 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    <SelectValue placeholder="التخصص" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التخصصات</SelectItem>
                  {specialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty === 'طوارئ' ? '🚨 ' : 
                       specialty === 'أطفال' ? '👶 ' :
                       specialty === 'نساء وولادة' ? '🤱 ' :
                       specialty === 'أمراض القلب' ? '❤️ ' :
                       specialty === 'طب وجراحة العيون' ? '👁️ ' : '🏥 '}
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* تصفية التوفر */}
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full md:w-48 h-12 border-2 border-gray-600 focus:border-blue-500 rounded-xl bg-gray-800/50 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <SelectValue placeholder="التوفر" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأطباء</SelectItem>
                  <SelectItem value="available">متاح الآن</SelectItem>
                  <SelectItem value="free">مجاني</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center bg-gradient-to-r from-blue-900/80 to-blue-800/80 border-blue-700">
              <div className="text-3xl font-bold text-blue-300">{consultations.length}</div>
              <div className="text-sm text-blue-200 font-medium">إجمالي الأطباء</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-r from-green-900/80 to-green-800/80 border-green-700">
              <div className="text-3xl font-bold text-green-300">
                {consultations.filter(c => c.isAvailable).length}
              </div>
              <div className="text-sm text-green-200 font-medium">متاح الآن</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-r from-purple-900/80 to-purple-800/80 border-purple-700">
              <div className="text-3xl font-bold text-purple-300">
                {consultations.filter(c => c.price === 'مجاني').length}
              </div>
              <div className="text-sm text-purple-200 font-medium">مجاني</div>
            </Card>
            <Card className="p-6 text-center bg-gradient-to-r from-orange-900/80 to-orange-800/80 border-orange-700">
              <div className="text-3xl font-bold text-orange-300">
                {specialties.length}
              </div>
              <div className="text-sm text-orange-200 font-medium">تخصص</div>
            </Card>
          </div>

          {/* قائمة الاستشارات */}
          <div className="space-y-6">
            {filteredConsultations.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Phone className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">لا توجد استشارات</h3>
                  <p className="text-gray-500 mb-6 text-lg">لم يتم العثور على أطباء تطابق معايير البحث</p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-3 sm:gap-4">
                {filteredConsultations.map((consultation) => (
                  <Card key={consultation.id} className={`p-3 sm:p-4 group hover:shadow-xl transition-all duration-300 ${
                    consultation.isAvailable 
                      ? 'ring-2 ring-green-200 bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      {/* أيقونة التخصص */}
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        consultation.isAvailable 
                          ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                          : 'bg-gray-100'
                      }`}>
                        {getSpecialtyIcon(consultation.specialty)}
                      </div>
                      
                      {/* البيانات الأساسية */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                            {consultation.doctorName}
                          </h3>
                          <Badge className={`${getSpecialtyColor(consultation.specialty)} text-xs`}>
                            {consultation.specialty}
                          </Badge>
                          {consultation.isAvailable && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              <CheckCircle className="w-3 h-3 ml-1" />
                              متاح
                            </Badge>
                          )}
                        </div>
                        
                        {/* معلومات مختصرة */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 text-xs sm:text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <span className="text-gray-700 truncate">{consultation.facility}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                            <span className="text-gray-700">{consultation.rating}/5</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className={`font-bold text-xs ${
                              consultation.price === 'مجاني' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {consultation.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* الأزرار */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => handleCall(consultation.phone)}
                        disabled={!consultation.isAvailable}
                        size="sm"
                        className={`flex-1 text-xs sm:text-sm ${
                          consultation.isAvailable
                            ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        {consultation.isAvailable ? 'اتصل الآن' : 'غير متاح'}
                      </Button>
                      
                      <Button
                        onClick={() => handleShowDetails(consultation)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-600 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm"
                      >
                        <User className="w-3 h-3 mr-1" />
                        التفاصيل
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* معلومات إضافية */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500 rounded-full">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-800">معلومات مهمة</span>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-700">
                    <strong className="text-blue-800">الاستشارة الهاتفية:</strong> خدمة طبية متخصصة للحصول على استشارة فورية
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-700">جميع الأطباء معتمدون وذوو خبرة عالية</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-700">الأسعار تختلف حسب التخصص والخبرة</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-700">احتفظ بمعلوماتك الطبية جاهزة قبل الاتصال</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-700">في حالات الطوارئ، اتصل بالإسعاف مباشرة</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className="text-blue-700">الاستشارة لا تغني عن الفحص الطبي المباشر</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <AppFooter />

        {/* نافذة التفاصيل */}
        {selectedConsultation && (
          <DetailsModal
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
            title={selectedConsultation.doctorName}
            subtitle={`${selectedConsultation.specialty} - ${selectedConsultation.facility}`}
            image={getSpecialtyIcon(selectedConsultation.specialty) as unknown as string}
            sections={[
              {
                title: 'معلومات الطبيب',
                icon: <User className="w-5 h-5 text-blue-400" />,
                items: [
                  { label: 'الاسم', value: selectedConsultation.doctorName, icon: <User className="w-4 h-4 text-blue-400" /> },
                  { label: 'التخصص', value: selectedConsultation.specialty, type: 'badge', color: getSpecialtyColor(selectedConsultation.specialty) },
                  { label: 'المرفق الطبي', value: selectedConsultation.facility, icon: <MapPin className="w-4 h-4 text-purple-400" /> },
                  { label: 'الخبرة', value: selectedConsultation.experience, icon: <Activity className="w-4 h-4 text-green-400" /> },
                  { label: 'التقييم', value: selectedConsultation.rating, type: 'rating' },
                  { label: 'الوصف', value: selectedConsultation.description },
                ]
              },
              {
                title: 'معلومات الاستشارة',
                icon: <Phone className="w-5 h-5 text-green-400" />,
                items: [
                  { label: 'رقم الهاتف', value: selectedConsultation.phone, type: 'contact', icon: <Phone className="w-4 h-4 text-green-400" /> },
                  { label: 'أوقات التوفر', value: selectedConsultation.availability, icon: <Clock className="w-4 h-4 text-orange-400" /> },
                  { label: 'السعر', value: selectedConsultation.price, type: 'badge', color: selectedConsultation.price === 'مجاني' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white' },
                  { label: 'الحالة', value: selectedConsultation.isAvailable ? 'متاح' : 'غير متاح', type: 'badge', color: selectedConsultation.isAvailable ? 'bg-green-600 text-white' : 'bg-red-600 text-white' },
                ]
              },
              {
                title: 'اللغات المدعومة',
                icon: <MessageCircle className="w-5 h-5 text-purple-400" />,
                items: [
                  { label: 'اللغات', value: selectedConsultation.languages.join('، ') },
                ]
              }
            ]}
            actions={[
              ...(selectedConsultation.isAvailable ? [{
                label: 'اتصل الآن',
                onClick: () => handleCall(selectedConsultation.phone),
                icon: <Phone className="w-4 h-4" />,
                variant: 'default' as const
              }] : []),
              {
                label: 'إغلاق',
                onClick: () => setIsDetailsModalOpen(false),
                icon: <CheckCircle className="w-4 h-4" />,
                variant: 'outline' as const
              }
            ]}
          />
        )}
      </div>
    </div>
  );
}
