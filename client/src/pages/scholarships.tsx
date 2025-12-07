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
  Award, ArrowLeft, Search, Filter, Star, Users, Calendar, 
  Clock, CheckCircle, ExternalLink, XCircle, Timer, Mail, 
  Plus, School as SchoolIcon, Building2, Globe, Heart, 
  Star as StarIcon, Info, FileText, MessageSquare, 
  Bell, Settings, HelpCircle, BookOpen, Library, Download,
  Eye, EyeOff, Share2, ThumbsUp, MessageCircle, Book,
  PenTool, FileText as FileTextIcon, Video, Image, Music,
  Archive, Calendar as CalendarIcon, User, MapPin, Phone,
  GraduationCap, DollarSign, Target, Zap, Shield, Crown
} from 'lucide-react';

// بيانات المنح الدراسية
const scholarships = [
  {
    id: 1,
    title: "منحة جامعة الملك سعود للطلاب اليمنيين",
    description: "منحة دراسية كاملة للطلاب اليمنيين المتميزين في جامعة الملك سعود",
    provider: "جامعة الملك سعود",
    type: "full",
    level: "undergraduate",
    field: "all",
    amount: "كاملة",
    duration: "4 سنوات",
    deadline: "2024-03-15",
    requirements: "معدل 85% فما فوق، شهادة لغة إنجليزية",
    benefits: "رسوم دراسية، سكن، راتب شهري، تأمين صحي",
    applicationProcess: "تعبئة النموذج، إرسال المستندات، مقابلة شخصية",
    contact: "scholarships@ksu.edu.sa",
    website: "https://www.ksu.edu.sa",
    country: "السعودية",
    city: "الرياض",
    isActive: true,
    isUrgent: true,
    views: 1250,
    applications: 89,
    rating: 4.8,
    color: "green"
  },
  {
    id: 2,
    title: "منحة الحكومة التركية للطلاب الدوليين",
    description: "منحة دراسية شاملة للطلاب الدوليين في الجامعات التركية",
    provider: "الحكومة التركية",
    type: "full",
    level: "all",
    field: "all",
    amount: "كاملة",
    duration: "2-4 سنوات",
    deadline: "2024-02-20",
    requirements: "معدل 70% فما فوق، شهادة لغة تركية أو إنجليزية",
    benefits: "رسوم دراسية، سكن، راتب شهري، تأمين صحي، تذكرة طيران",
    applicationProcess: "تسجيل عبر الموقع الرسمي، رفع المستندات، اختبار",
    contact: "info@turkiyeburslari.gov.tr",
    website: "https://www.turkiyeburslari.gov.tr",
    country: "تركيا",
    city: "أنقرة",
    isActive: true,
    isUrgent: false,
    views: 980,
    applications: 67,
    rating: 4.6,
    color: "red"
  },
  {
    id: 3,
    title: "منحة جامعة مالايا الماليزية",
    description: "منحة جزئية للطلاب الدوليين في جامعة مالايا",
    provider: "جامعة مالايا",
    type: "partial",
    level: "graduate",
    field: "engineering",
    amount: "50% من الرسوم",
    duration: "2-3 سنوات",
    deadline: "2024-04-10",
    requirements: "معدل 80% فما فوق، شهادة IELTS 6.0",
    benefits: "50% خصم على الرسوم، سكن مخفض، تأمين صحي",
    applicationProcess: "تعبئة النموذج، إرسال المستندات، مقابلة عبر الإنترنت",
    contact: "admission@um.edu.my",
    website: "https://www.um.edu.my",
    country: "ماليزيا",
    city: "كوالالمبور",
    isActive: true,
    isUrgent: false,
    views: 750,
    applications: 45,
    rating: 4.4,
    color: "blue"
  },
  {
    id: 4,
    title: "منحة الحكومة الألمانية DAAD",
    description: "منحة دراسية للطلاب الدوليين في الجامعات الألمانية",
    provider: "DAAD",
    type: "full",
    level: "graduate",
    field: "all",
    amount: "كاملة",
    duration: "1-2 سنوات",
    deadline: "2024-01-31",
    requirements: "معدل 85% فما فوق، شهادة لغة ألمانية B2",
    benefits: "رسوم دراسية، راتب شهري 850 يورو، تأمين صحي، دورة لغة",
    applicationProcess: "تسجيل عبر DAAD، إرسال المستندات، مقابلة",
    contact: "info@daad.de",
    website: "https://www.daad.de",
    country: "ألمانيا",
    city: "برلين",
    isActive: true,
    isUrgent: true,
    views: 1100,
    applications: 78,
    rating: 4.7,
    color: "yellow"
  },
  {
    id: 5,
    title: "منحة جامعة القاهرة للطلاب العرب",
    description: "منحة دراسية للطلاب العرب في جامعة القاهرة",
    provider: "جامعة القاهرة",
    type: "partial",
    level: "undergraduate",
    field: "all",
    amount: "30% من الرسوم",
    duration: "4 سنوات",
    deadline: "2024-05-15",
    requirements: "معدل 75% فما فوق، شهادة لغة عربية",
    benefits: "30% خصم على الرسوم، سكن جامعي، تأمين صحي",
    applicationProcess: "تعبئة النموذج، إرسال المستندات، اختبار",
    contact: "admission@cu.edu.eg",
    website: "https://www.cu.edu.eg",
    country: "مصر",
    city: "القاهرة",
    isActive: true,
    isUrgent: false,
    views: 650,
    applications: 32,
    rating: 4.2,
    color: "purple"
  },
  {
    id: 6,
    title: "منحة الحكومة الكندية للطلاب الدوليين",
    description: "منحة دراسية للطلاب الدوليين في الجامعات الكندية",
    provider: "الحكومة الكندية",
    type: "full",
    level: "all",
    field: "all",
    amount: "كاملة",
    duration: "2-4 سنوات",
    deadline: "2024-03-01",
    requirements: "معدل 80% فما فوق، شهادة IELTS 6.5",
    benefits: "رسوم دراسية، سكن، راتب شهري، تأمين صحي، تذكرة طيران",
    applicationProcess: "تسجيل عبر الموقع الرسمي، رفع المستندات، مقابلة",
    contact: "info@canada.ca",
    website: "https://www.canada.ca",
    country: "كندا",
    city: "أوتاوا",
    isActive: true,
    isUrgent: false,
    views: 1400,
    applications: 95,
    rating: 4.9,
    color: "indigo"
  }
];

export default function ScholarshipsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [fieldFilter, setFieldFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);

  // إحصائيات سريعة
  const stats = React.useMemo(() => {
    const total = scholarships.length;
    const active = scholarships.filter(s => s.isActive).length;
    const urgent = scholarships.filter(s => s.isUrgent).length;
    const totalApplications = scholarships.reduce((sum, s) => sum + s.applications, 0);
    
    return { 
      total, 
      active, 
      urgent, 
      totalApplications
    };
  }, []);

  // فلترة المنح
  const filteredScholarships = React.useMemo(() => {
    let currentScholarships = [...scholarships];

    if (searchQuery) {
      currentScholarships = currentScholarships.filter(scholarship =>
        scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.field.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      currentScholarships = currentScholarships.filter(scholarship => scholarship.type === typeFilter);
    }

    if (levelFilter !== 'all') {
      currentScholarships = currentScholarships.filter(scholarship => scholarship.level === levelFilter);
    }

    if (fieldFilter !== 'all') {
      currentScholarships = currentScholarships.filter(scholarship => scholarship.field === fieldFilter);
    }

    currentScholarships.sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'views': return b.views - a.views;
        case 'applications': return b.applications - a.applications;
        case 'deadline':
        default: return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });

    return currentScholarships;
  }, [searchQuery, typeFilter, levelFilter, fieldFilter, sortBy]);

  const getTypeColor = (type: string) => {
    const colors = {
      'full': 'bg-green-600',
      'partial': 'bg-yellow-600',
      'tuition': 'bg-blue-600',
      'living': 'bg-purple-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-600';
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'undergraduate': 'bg-blue-600',
      'graduate': 'bg-purple-600',
      'phd': 'bg-red-600',
      'all': 'bg-green-600'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-600';
  };

  const getFieldColor = (field: string) => {
    const colors = {
      'all': 'bg-gray-600',
      'engineering': 'bg-blue-600',
      'medicine': 'bg-red-600',
      'business': 'bg-green-600',
      'arts': 'bg-purple-600',
      'science': 'bg-yellow-600'
    };
    return colors[field as keyof typeof colors] || 'bg-gray-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      {/* شريط قيد التطوير */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-4 px-4 relative overflow-hidden shadow-lg mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <span className="font-bold text-lg">🚧 قيد التطوير - صفحة المنح الدراسية 🚧</span>
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
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">المنح الدراسية</h1>
          </div>
          <p className="text-yellow-300 text-xs sm:text-sm md:text-base">فرص تعليمية متميزة للطلاب اليمنيين حول العالم</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-yellow-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-300 mb-1">{stats.total}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي المنح</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-300 mb-1">{stats.active}</div>
            <div className="text-xs text-gray-300 font-medium">منح نشطة</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-red-900/80 to-red-800/80 border-red-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-red-300 mb-1">{stats.urgent}</div>
            <div className="text-xs text-gray-300 font-medium">منح عاجلة</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-blue-300 mb-1">{stats.totalApplications}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي الطلبات</div>
          </Card>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-yellow-800 bg-opacity-80 border border-yellow-600 rounded-xl shadow-2xl">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-2 sm:space-y-3">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-2 top-2 w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن منحة دراسية..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-yellow-700 border border-yellow-600 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-8"
                />
              </div>

              {/* فلاتر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-yellow-700 border border-yellow-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="full">كاملة</option>
                  <option value="partial">جزئية</option>
                  <option value="tuition">رسوم فقط</option>
                  <option value="living">معيشة فقط</option>
                </select>

                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-yellow-700 border border-yellow-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="all">جميع المستويات</option>
                  <option value="undergraduate">بكالوريوس</option>
                  <option value="graduate">ماجستير</option>
                  <option value="phd">دكتوراه</option>
                </select>

                <select
                  value={fieldFilter}
                  onChange={(e) => setFieldFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-yellow-700 border border-yellow-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="all">جميع التخصصات</option>
                  <option value="engineering">هندسة</option>
                  <option value="medicine">طب</option>
                  <option value="business">إدارة أعمال</option>
                  <option value="arts">آداب</option>
                  <option value="science">علوم</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 bg-yellow-700 border border-yellow-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="deadline">آخر موعد</option>
                  <option value="rating">التقييم</option>
                  <option value="views">المشاهدات</option>
                  <option value="applications">الطلبات</option>
                </select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setLevelFilter('all');
                    setFieldFilter('all');
                    setSortBy('deadline');
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
          <div className="bg-yellow-800 bg-opacity-80 border border-yellow-600 rounded-lg p-2 sm:p-3">
            <p className="text-yellow-300 text-xs sm:text-sm">
              عرض {filteredScholarships.length} من أصل {scholarships.length} منحة دراسية
            </p>
          </div>
        </div>

        {/* قائمة المنح الدراسية */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">المنح المتاحة</h2>
            <Badge className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
              {filteredScholarships.length}
            </Badge>
          </div>

          {filteredScholarships.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-yellow-900/90 backdrop-blur-sm border-yellow-700 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد منح</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على منح تطابق معايير البحث</p>
              <Button 
                onClick={() => setLocation('/education')}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                العودة للتعليم
              </Button>
            </Card>
          ) : (
            filteredScholarships.map((scholarship) => {
              const daysLeft = getDaysUntilDeadline(scholarship.deadline);
              return (
                <Card key={scholarship.id} className="bg-emerald-800 bg-opacity-80 border border-emerald-600 rounded-lg shadow-lg hover:bg-emerald-700 transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-2 sm:p-4">
                    <div className="space-y-3">
                      {/* الصف الأول: أيقونة + عنوان + badges */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors leading-tight">
                            {scholarship.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {scholarship.isUrgent && (
                              <Badge className="bg-red-600 text-white text-xs px-2 py-1 animate-pulse">
                                🔥 عاجل
                              </Badge>
                            )}
                            {!scholarship.isActive && (
                              <Badge className="bg-gray-600 text-white text-xs px-2 py-1">
                                غير نشط
                              </Badge>
                            )}
                          
                            <Badge className={`${getTypeColor(scholarship.type)} text-white text-xs px-2 py-1`}>
                              {scholarship.type === 'full' ? 'كاملة' : scholarship.type === 'partial' ? 'جزئية' : scholarship.type}
                            </Badge>
                            <Badge className={`${getLevelColor(scholarship.level)} text-white text-xs px-2 py-1`}>
                              {scholarship.level === 'undergraduate' ? 'بكالوريوس' : scholarship.level === 'graduate' ? 'ماجستير' : scholarship.level === 'phd' ? 'دكتوراه' : 'جميع المستويات'}
                            </Badge>
                            <Badge className={`${getFieldColor(scholarship.field)} text-white text-xs px-2 py-1`}>
                              {scholarship.field === 'all' ? 'جميع التخصصات' : scholarship.field}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* شبكة المعلومات المنظمة */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <div>
                            <div className="text-gray-300">المبلغ</div>
                            <div className="text-white font-medium text-xs truncate">{scholarship.amount}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <div>
                            <div className="text-gray-300">المدة</div>
                            <div className="text-white font-medium text-xs truncate">{scholarship.duration}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                          <Calendar className="w-4 h-4 text-orange-400" />
                          <div>
                            <div className="text-gray-300">الموعد النهائي</div>
                            <div className="text-white font-medium text-xs truncate">{formatDate(scholarship.deadline)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                          <Users className="w-4 h-4 text-purple-400" />
                          <div>
                            <div className="text-gray-300">المتقدمين</div>
                            <div className="text-white font-medium">{scholarship.applications}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* الوصف */}
                      <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                        {scholarship.description}
                      </p>
                      
                      {/* أزرار الإجراءات */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => setSelectedScholarship(scholarship)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          تفاصيل المنحة
                        </Button>
                        <Button
                          onClick={() => window.open(scholarship.website, '_blank')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          التقديم الآن
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* نافذة تفاصيل المنحة */}
        {selectedScholarship && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl bg-gray-900 border border-yellow-600 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    {selectedScholarship.title}
                    {selectedScholarship.isUrgent && (
                      <Badge className="bg-red-600 text-white text-xs px-2 py-1 animate-pulse">
                        🔥 عاجل
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    onClick={() => setSelectedScholarship(null)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* معلومات أساسية */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">المزود</h4>
                    <p className="text-sm text-gray-300">{selectedScholarship.provider}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">البلد</h4>
                    <p className="text-sm text-gray-300">{selectedScholarship.country} - {selectedScholarship.city}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">نوع المنحة</h4>
                    <Badge className={`${getTypeColor(selectedScholarship.type)} text-white text-xs px-2 py-1`}>
                      {selectedScholarship.type === 'full' ? 'كاملة' : selectedScholarship.type === 'partial' ? 'جزئية' : selectedScholarship.type}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">المستوى</h4>
                    <Badge className={`${getLevelColor(selectedScholarship.level)} text-white text-xs px-2 py-1`}>
                      {selectedScholarship.level === 'undergraduate' ? 'بكالوريوس' : selectedScholarship.level === 'graduate' ? 'ماجستير' : selectedScholarship.level === 'phd' ? 'دكتوراه' : 'جميع المستويات'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">المبلغ</h4>
                    <p className="text-sm text-gray-300">{selectedScholarship.amount}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">المدة</h4>
                    <p className="text-sm text-gray-300">{selectedScholarship.duration}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">آخر موعد للتقديم</h4>
                    <p className="text-sm text-gray-300">{formatDate(selectedScholarship.deadline)}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">التخصص</h4>
                    <Badge className={`${getFieldColor(selectedScholarship.field)} text-white text-xs px-2 py-1`}>
                      {selectedScholarship.field === 'all' ? 'جميع التخصصات' : selectedScholarship.field}
                    </Badge>
                  </div>
                </div>

                {/* الوصف */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-yellow-300">الوصف</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedScholarship.description}</p>
                </div>

                {/* المتطلبات */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-yellow-300">المتطلبات</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedScholarship.requirements}</p>
                </div>

                {/* المزايا */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-yellow-300">المزايا</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedScholarship.benefits}</p>
                </div>

                {/* عملية التقديم */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-yellow-300">عملية التقديم</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedScholarship.applicationProcess}</p>
                </div>

                {/* معلومات الاتصال */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-300">{selectedScholarship.contact}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-yellow-300">الموقع الإلكتروني</h4>
                    <a 
                      href={selectedScholarship.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                      {selectedScholarship.website}
                    </a>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => window.open(selectedScholarship.website, '_blank')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    التقديم الآن
                  </Button>
                  <Button
                    onClick={() => {
                      // مشاركة المنحة
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    مشاركة المنحة
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
