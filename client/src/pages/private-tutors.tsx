import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, ArrowLeft, Search, Filter, Star, Users, Calendar, 
  Phone, MapPin, Clock, CheckCircle, ExternalLink, XCircle, 
  Plus, School as SchoolIcon, Building2, Globe, Award, 
  Heart, Star as StarIcon, Info, FileText, MessageSquare, 
  Bell, Settings, HelpCircle, User, PhoneCall, MapPin as MapPinIcon,
  Mail, MessageCircle, ThumbsUp, Share2, BookOpen, 
  PenTool, Book, Clock3, DollarSign, Shield, UserCheck,
  Award as AwardIcon, Bookmark, Eye, EyeOff, Timer
} from 'lucide-react';

// بيانات المعلمين الخصوصيين
const privateTutors = [
  {
    id: 1,
    name: "د. أحمد محمد السعيد",
    specialty: "الرياضيات",
    subjects: ["الرياضيات", "الفيزياء", "الإحصاء"],
    grades: ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"],
    experience: "15 سنة",
    education: "دكتوراه في الرياضيات",
    university: "جامعة عدن",
    hourlyRate: "50 ريال/ساعة",
    rating: 4.8,
    reviews: 156,
    students: 89,
    phone: "+967-777123456",
    email: "ahmed.math@example.com",
    location: "كريتر",
    address: "شارع الجمهورية، كريتر",
    availability: "صباحاً ومساءً",
    languages: ["عربي", "إنجليزي"],
    teachingMethod: "وجهاً لوجه + أونلاين",
    description: "معلم رياضيات متمرس مع خبرة 15 سنة في تدريس المرحلة الثانوية. متخصص في شرح المفاهيم المعقدة بطريقة مبسطة.",
    features: ["شرح مفصل", "تمارين إضافية", "مراجعة شاملة", "اختبارات دورية"],
    image: "👨‍🏫",
    color: "blue",
    isVerified: true,
    responseTime: "ساعة واحدة",
    successRate: "95%"
  },
  {
    id: 2,
    name: "أ. فاطمة علي حسن",
    specialty: "اللغة العربية",
    subjects: ["اللغة العربية", "الأدب", "النحو والصرف"],
    grades: ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"],
    experience: "12 سنة",
    education: "ماجستير في اللغة العربية",
    university: "جامعة صنعاء",
    hourlyRate: "45 ريال/ساعة",
    rating: 4.6,
    reviews: 134,
    students: 76,
    phone: "+967-777234567",
    email: "fatima.arabic@example.com",
    location: "التواهي",
    address: "حي السلام، التواهي",
    availability: "مساءً فقط",
    languages: ["عربي"],
    teachingMethod: "وجهاً لوجه",
    description: "معلمة لغة عربية متخصصة في النحو والصرف مع خبرة واسعة في تدريس الأدب العربي.",
    features: ["شرح النحو", "تحليل النصوص", "كتابة الإنشاء", "مراجعة شاملة"],
    image: "👩‍🏫",
    color: "green",
    isVerified: true,
    responseTime: "30 دقيقة",
    successRate: "92%"
  },
  {
    id: 3,
    name: "د. محمد عبدالله",
    specialty: "الفيزياء",
    subjects: ["الفيزياء", "الرياضيات", "الكيمياء"],
    grades: ["الثاني الثانوي", "الثالث الثانوي"],
    experience: "18 سنة",
    education: "دكتوراه في الفيزياء",
    university: "جامعة الملك سعود",
    hourlyRate: "60 ريال/ساعة",
    rating: 4.9,
    reviews: 98,
    students: 65,
    phone: "+967-777345678",
    email: "mohammed.physics@example.com",
    location: "الشيخ عثمان",
    address: "شارع النصر، الشيخ عثمان",
    availability: "صباحاً ومساءً",
    languages: ["عربي", "إنجليزي"],
    teachingMethod: "أونلاين فقط",
    description: "أستاذ فيزياء متخصص في الفيزياء النظرية والتجريبية مع خبرة في البحث العلمي.",
    features: ["تجارب عملية", "شرح نظري", "حل المسائل", "مراجعة شاملة"],
    image: "👨‍🔬",
    color: "purple",
    isVerified: true,
    responseTime: "45 دقيقة",
    successRate: "97%"
  },
  {
    id: 4,
    name: "أ.د. يوسف أحمد",
    specialty: "التاريخ",
    subjects: ["التاريخ", "الجغرافيا", "التربية الوطنية"],
    grades: ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"],
    experience: "20 سنة",
    education: "دكتوراه في التاريخ",
    university: "جامعة القاهرة",
    hourlyRate: "55 ريال/ساعة",
    rating: 4.7,
    reviews: 87,
    students: 54,
    phone: "+967-777456789",
    email: "youssef.history@example.com",
    location: "المعلا",
    address: "حي المعلا، المعلا",
    availability: "صباحاً فقط",
    languages: ["عربي", "إنجليزي"],
    teachingMethod: "وجهاً لوجه + أونلاين",
    description: "أستاذ تاريخ متخصص في تاريخ اليمن والشرق الأوسط مع خبرة في التدريس الجامعي.",
    features: ["شرح تاريخي", "خرائط تفاعلية", "مراجعة شاملة", "اختبارات"],
    image: "👨‍🎓",
    color: "orange",
    isVerified: true,
    responseTime: "ساعة واحدة",
    successRate: "94%"
  },
  {
    id: 5,
    name: "د. نور الدين أحمد",
    specialty: "الكيمياء",
    subjects: ["الكيمياء", "الفيزياء", "الأحياء"],
    grades: ["الثاني الثانوي", "الثالث الثانوي"],
    experience: "14 سنة",
    education: "دكتوراه في الكيمياء",
    university: "جامعة عدن",
    hourlyRate: "52 ريال/ساعة",
    rating: 4.5,
    reviews: 72,
    students: 48,
    phone: "+967-777567890",
    email: "nour.chemistry@example.com",
    location: "المنصورة",
    address: "شارع المنصورة، المنصورة",
    availability: "مساءً فقط",
    languages: ["عربي", "إنجليزي"],
    teachingMethod: "وجهاً لوجه",
    description: "معلم كيمياء متخصص في الكيمياء العضوية واللاعضوية مع خبرة في المختبرات.",
    features: ["تجارب كيميائية", "شرح نظري", "حل المسائل", "مراجعة شاملة"],
    image: "👨‍🔬",
    color: "red",
    isVerified: true,
    responseTime: "ساعة واحدة",
    successRate: "91%"
  },
  {
    id: 6,
    name: "أ.د. سارة محمد",
    specialty: "الجغرافيا",
    subjects: ["الجغرافيا", "التاريخ", "التربية الوطنية"],
    grades: ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"],
    experience: "16 سنة",
    education: "دكتوراه في الجغرافيا",
    university: "جامعة صنعاء",
    hourlyRate: "48 ريال/ساعة",
    rating: 4.4,
    reviews: 63,
    students: 41,
    phone: "+967-777678901",
    email: "sara.geography@example.com",
    location: "كريتر",
    address: "شارع البريهي، كريتر",
    availability: "صباحاً ومساءً",
    languages: ["عربي"],
    teachingMethod: "وجهاً لوجه + أونلاين",
    description: "معلمة جغرافيا متخصصة في الجغرافيا الطبيعية والبشرية مع خبرة في استخدام الخرائط.",
    features: ["خرائط تفاعلية", "شرح جغرافي", "مراجعة شاملة", "اختبارات"],
    image: "👩‍🏫",
    color: "indigo",
    isVerified: true,
    responseTime: "45 دقيقة",
    successRate: "89%"
  },
  {
    id: 7,
    name: "Mr. John Smith",
    specialty: "اللغة الإنجليزية",
    subjects: ["اللغة الإنجليزية", "الإنجليزية للأعمال", "الإنجليزية الأكاديمية"],
    grades: ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"],
    experience: "10 سنة",
    education: "ماجستير في اللغة الإنجليزية",
    university: "University of Cambridge",
    hourlyRate: "70 ريال/ساعة",
    rating: 4.8,
    reviews: 95,
    students: 67,
    phone: "+967-777789012",
    email: "john.english@example.com",
    location: "التواهي",
    address: "شارع التواهي، التواهي",
    availability: "صباحاً ومساءً",
    languages: ["إنجليزي", "عربي"],
    teachingMethod: "أونلاين فقط",
    description: "Native English speaker with extensive experience in teaching English as a second language.",
    features: ["محادثة", "قواعد", "كتابة", "مراجعة شاملة"],
    image: "👨‍🏫",
    color: "yellow",
    isVerified: true,
    responseTime: "30 دقيقة",
    successRate: "96%"
  },
  {
    id: 8,
    name: "د. علي حسن محمد",
    specialty: "الأحياء",
    subjects: ["الأحياء", "الكيمياء", "العلوم العامة"],
    grades: ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"],
    experience: "13 سنة",
    education: "دكتوراه في الأحياء",
    university: "جامعة عدن",
    hourlyRate: "50 ريال/ساعة",
    rating: 4.6,
    reviews: 78,
    students: 52,
    phone: "+967-777890123",
    email: "ali.biology@example.com",
    location: "الشيخ عثمان",
    address: "حي الشيخ عثمان، الشيخ عثمان",
    availability: "مساءً فقط",
    languages: ["عربي", "إنجليزي"],
    teachingMethod: "وجهاً لوجه + أونلاين",
    description: "معلم أحياء متخصص في علم الأحياء مع خبرة في المختبرات والتجارب العملية.",
    features: ["تجارب عملية", "شرح نظري", "حل المسائل", "مراجعة شاملة"],
    image: "👨‍🔬",
    color: "pink",
    isVerified: true,
    responseTime: "ساعة واحدة",
    successRate: "93%"
  }
];

export default function PrivateTutorsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [selectedTutor, setSelectedTutor] = useState<any>(null);

  // إحصائيات سريعة
  const stats = React.useMemo(() => {
    const total = privateTutors.length;
    const totalStudents = privateTutors.reduce((sum, tutor) => sum + tutor.students, 0);
    const totalReviews = privateTutors.reduce((sum, tutor) => sum + tutor.reviews, 0);
    const avgRating = privateTutors.reduce((sum, tutor) => sum + tutor.rating, 0) / total;
    
    return { 
      total, 
      totalStudents, 
      totalReviews, 
      avgRating: avgRating.toFixed(1)
    };
  }, []);

  // فلترة المعلمين
  const filteredTutors = React.useMemo(() => {
    let currentTutors = [...privateTutors];

    if (searchQuery) {
      currentTutors = currentTutors.filter(tutor =>
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tutor.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (specialtyFilter !== 'all') {
      currentTutors = currentTutors.filter(tutor => tutor.specialty === specialtyFilter);
    }

    if (gradeFilter !== 'all') {
      currentTutors = currentTutors.filter(tutor => tutor.grades.includes(gradeFilter));
    }

    if (locationFilter !== 'all') {
      currentTutors = currentTutors.filter(tutor => tutor.location === locationFilter);
    }

    currentTutors.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rate': return parseInt(a.hourlyRate) - parseInt(b.hourlyRate);
        case 'rating':
        default: return b.rating - a.rating;
      }
    });

    return currentTutors;
  }, [searchQuery, specialtyFilter, gradeFilter, locationFilter, sortBy]);

  // الحصول على التخصصات والمناطق الفريدة
  const specialties = React.useMemo(() => {
    const uniqueSpecialties = [...new Set(privateTutors.map(tutor => tutor.specialty))];
    return uniqueSpecialties;
  }, []);

  const grades = React.useMemo(() => {
    const uniqueGrades = [...new Set(privateTutors.flatMap(tutor => tutor.grades))];
    return uniqueGrades;
  }, []);

  const locations = React.useMemo(() => {
    const uniqueLocations = [...new Set(privateTutors.map(tutor => tutor.location))];
    return uniqueLocations;
  }, []);

  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      'الرياضيات': 'bg-blue-600',
      'اللغة العربية': 'bg-green-600',
      'الفيزياء': 'bg-purple-600',
      'التاريخ': 'bg-orange-600',
      'الكيمياء': 'bg-red-600',
      'الجغرافيا': 'bg-indigo-600',
      'اللغة الإنجليزية': 'bg-yellow-600',
      'الأحياء': 'bg-pink-600'
    };
    return colors[specialty as keyof typeof colors] || 'bg-gray-600';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
        }`}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      {/* شريط قيد التطوير */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-4 px-4 relative overflow-hidden shadow-lg mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <span className="font-bold text-lg">🚧 قيد التطوير - صفحة المعلمين الخصوصيين 🚧</span>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="relative z-10 mt-2">
          <span className="text-sm font-medium opacity-90">هذه الصفحة قيد التطوير وقد تحتوي على ميزات غير مكتملة</span>
        </div>
      </div>
      
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-3 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">المعلمين الخصوصيين</h1>
          </div>
          <p className="text-teal-300 text-xs sm:text-sm md:text-base">معلمون متميزون لجميع المواد والمراحل التعليمية</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-teal-900/80 to-teal-800/80 border-teal-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-teal-300 mb-1">{stats.total}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي المعلمين</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-300 mb-1">{stats.totalStudents}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي الطلاب</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-blue-300 mb-1">{stats.totalReviews}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي المراجعات</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-yellow-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-300 mb-1">{stats.avgRating}</div>
            <div className="text-xs text-gray-300 font-medium">متوسط التقييم</div>
          </Card>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl shadow-2xl">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-2 sm:space-y-3">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-2 top-2 w-3 h-3 sm:w-4 sm:h-4 text-teal-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن معلم أو تخصص أو مادة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-teal-700 border border-teal-600 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 pr-8"
                />
              </div>

              {/* فلاتر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-teal-700 border border-teal-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                >
                  <option value="all">جميع التخصصات</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>

                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-teal-700 border border-teal-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                >
                  <option value="all">جميع الصفوف</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>

                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-teal-700 border border-teal-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                >
                  <option value="all">جميع المناطق</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 bg-teal-700 border border-teal-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-teal-400 focus:border-transparent"
                >
                  <option value="rating">التقييم</option>
                  <option value="name">الاسم</option>
                  <option value="rate">السعر</option>
                </select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSpecialtyFilter('all');
                    setGradeFilter('all');
                    setLocationFilter('all');
                    setSortBy('rating');
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 text-xs sm:text-sm"
                >
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* عداد النتائج */}
        <div className="mb-3 sm:mb-4 text-center">
          <div className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-lg p-2 sm:p-3">
            <p className="text-teal-300 text-xs sm:text-sm">
              عرض {filteredTutors.length} من أصل {privateTutors.length} معلم
            </p>
          </div>
        </div>

        {/* قائمة المعلمين */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">المعلمين المتاحين</h2>
            <Badge className="bg-teal-500 text-white px-2 py-1 rounded-full text-xs">
              {filteredTutors.length}
            </Badge>
          </div>

          {filteredTutors.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-teal-900/90 backdrop-blur-sm border-teal-700 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا يوجد معلمون</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على معلمين يطابقون معايير البحث</p>
              <Button 
                onClick={() => setLocation('/education')}
                className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                العودة للتعليم
              </Button>
            </Card>
          ) : (
            filteredTutors.map((tutor) => (
              <Card key={tutor.id} className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-3">
                    {/* الصف الأول: أيقونة + عنوان + badges */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-teal-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        {tutor.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors leading-tight">
                          {tutor.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {tutor.isVerified && (
                            <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                              ✓ موثق
                            </Badge>
                          )}
                        
                          <Badge className={`${getSpecialtyColor(tutor.specialty)} text-white text-xs px-2 py-1`}>
                            {tutor.specialty}
                          </Badge>
                          <Badge variant="outline" className="text-teal-400 border-teal-500 text-xs px-2 py-1">
                            {tutor.experience}
                          </Badge>
                          <Badge variant="outline" className="text-yellow-400 border-yellow-500 text-xs px-2 py-1">
                            {tutor.hourlyRate}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* شبكة المعلومات المنظمة */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div className="text-gray-300">التقييم</div>
                          <div className="text-white font-medium">{tutor.rating}/5</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-gray-300">المراجعات</div>
                          <div className="text-white font-medium">{tutor.reviews}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Users className="w-4 h-4 text-teal-400" />
                        <div>
                          <div className="text-gray-300">الطلاب</div>
                          <div className="text-white font-medium">{tutor.students}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-gray-300">الموقع</div>
                          <div className="text-white font-medium text-xs truncate">{tutor.location}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* الوصف */}
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {tutor.description}
                    </p>
                    
                    {/* المواد والصفوف */}
                    <div className="mb-2 sm:mb-3">
                      <h4 className="font-medium text-teal-300 mb-1 sm:mb-2 flex items-center gap-1 text-xs sm:text-sm">
                        <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                        المواد والصفوف
                      </h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {tutor.subjects.slice(0, 3).map((subject, index) => (
                          <Badge key={index} className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                            {subject}
                          </Badge>
                        ))}
                        {tutor.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-gray-500 text-gray-400">
                            +{tutor.subjects.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* معلومات الاتصال */}
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2 text-gray-300">
                        <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{tutor.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 text-gray-300">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
                        <span className="truncate">{tutor.email}</span>
                      </div>
                    </div>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setSelectedTutor(tutor)}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs py-2"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        عرض التفاصيل
                      </Button>
                      <Button
                        onClick={() => {
                          const phoneUrl = `tel:${tutor.phone}`;
                          window.open(phoneUrl, '_self');
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2"
                      >
                        <PhoneCall className="w-3 h-3 mr-1" />
                        اتصل الآن
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* نافذة تفاصيل المعلم */}
        {selectedTutor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl bg-gray-900 border border-teal-600 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                    <span className="text-2xl">{selectedTutor.image}</span>
                    {selectedTutor.name}
                    {selectedTutor.isVerified && (
                      <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                        ✓ موثق
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    onClick={() => setSelectedTutor(null)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* معلومات أساسية */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">التخصص</h4>
                    <Badge className={`${getSpecialtyColor(selectedTutor.specialty)} text-white text-xs px-2 py-1`}>
                      {selectedTutor.specialty}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">الخبرة</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.experience}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">التعليم</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.education}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">الجامعة</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.university}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">السعر</h4>
                    <p className="text-sm font-medium text-yellow-400">{selectedTutor.hourlyRate}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">التقييم</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {renderStars(selectedTutor.rating)}
                      </div>
                      <span className={`text-sm font-medium ${getRatingColor(selectedTutor.rating)}`}>
                        {selectedTutor.rating}/5 ({selectedTutor.reviews} مراجعة)
                      </span>
                    </div>
                  </div>
                </div>

                {/* تفاصيل إضافية */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">الموقع</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.location}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">العنوان</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.address}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">الأوقات المتاحة</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.availability}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">طريقة التدريس</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.teachingMethod}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">اللغات</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.languages.join(', ')}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-teal-300">عدد الطلاب</h4>
                    <p className="text-sm text-gray-300">{selectedTutor.students} طالب</p>
                  </div>
                </div>

                {/* الوصف */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-teal-300">الوصف</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedTutor.description}</p>
                </div>

                {/* المواد والصفوف */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-teal-300">المواد</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.subjects.map((subject, index) => (
                      <Badge key={index} className="bg-blue-600 text-white text-xs px-2 py-1">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-teal-300">الصفوف</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutor.grades.map((grade, index) => (
                      <Badge key={index} className="bg-green-600 text-white text-xs px-2 py-1">
                        {grade}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* المميزات */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-teal-300">المميزات</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedTutor.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* معلومات الاتصال */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-teal-300">معلومات الاتصال</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <PhoneCall className="w-4 h-4 text-teal-400" />
                      <span>{selectedTutor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span>{selectedTutor.email}</span>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => {
                      const phoneUrl = `tel:${selectedTutor.phone}`;
                      window.open(phoneUrl, '_self');
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <PhoneCall className="w-4 h-4 mr-2" />
                    اتصل الآن
                  </Button>
                  <Button
                    onClick={() => {
                      const emailUrl = `mailto:${selectedTutor.email}`;
                      window.open(emailUrl, '_self');
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    إرسال بريد
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <AppFooter />
    </div>
  );
}
