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
  Newspaper, ArrowLeft, Search, Filter, Star, Users, Calendar, 
  Clock, CheckCircle, ExternalLink, XCircle, Timer, Mail, 
  Plus, School as SchoolIcon, Building2, Globe, Award, 
  Heart, Star as StarIcon, Info, FileText, MessageSquare, 
  Bell, Settings, HelpCircle, BookOpen, Library, Download,
  Eye, EyeOff, Share2, ThumbsUp, MessageCircle, Book,
  PenTool, FileText as FileTextIcon, Video, Image, Music,
  Archive, Calendar as CalendarIcon, User, MapPin, Phone
} from 'lucide-react';

// بيانات أخبار التعليم
const educationNews = [
  {
    id: 1,
    title: "وزارة التربية والتعليم تعلن عن فتح باب التسجيل للعام الدراسي الجديد",
    summary: "أعلنت وزارة التربية والتعليم في عدن عن فتح باب التسجيل للعام الدراسي 2024-2025 لجميع المراحل التعليمية",
    content: "أعلنت وزارة التربية والتعليم في محافظة عدن عن فتح باب التسجيل للعام الدراسي الجديد 2024-2025 لجميع المراحل التعليمية ابتداءً من الصف الأول الابتدائي وحتى الثالث الثانوي. وأكدت الوزارة على ضرورة إحضار جميع المستندات المطلوبة للتسجيل بما في ذلك شهادة الميلاد الأصلية وصورة منها، وصورة شخصية حديثة، وشهادة نجاح آخر مرحلة دراسية إن وجدت.",
    category: "announcement",
    priority: "high",
    author: "وزارة التربية والتعليم",
    publishDate: "2024-01-20",
    readTime: "5 دقائق",
    views: 1250,
    likes: 89,
    comments: 23,
    tags: ["تسجيل", "عام دراسي", "وزارة التربية", "عدن"],
    image: "📢",
    color: "blue",
    isBreaking: true,
    isPinned: true
  },
  {
    id: 2,
    title: "جامعة عدن تفتتح برنامج الماجستير في الذكاء الاصطناعي",
    summary: "أعلنت جامعة عدن عن افتتاح برنامج ماجستير جديد في الذكاء الاصطناعي وتطبيقاته",
    content: "أعلنت جامعة عدن عن افتتاح برنامج ماجستير جديد في الذكاء الاصطناعي وتطبيقاته، والذي يهدف إلى إعداد كوادر متخصصة في هذا المجال المتنامي. البرنامج سيشمل دراسة نظريات الذكاء الاصطناعي، تعلم الآلة، معالجة اللغة الطبيعية، والرؤية الحاسوبية. وسيتم تدريس البرنامج باللغة الإنجليزية مع إمكانية الحصول على شهادات معتمدة دولياً.",
    category: "university",
    priority: "medium",
    author: "جامعة عدن",
    publishDate: "2024-01-18",
    readTime: "7 دقائق",
    views: 890,
    likes: 67,
    comments: 15,
    tags: ["جامعة عدن", "ماجستير", "ذكاء اصطناعي", "تقنية"],
    image: "🎓",
    color: "green",
    isBreaking: false,
    isPinned: false
  },
  {
    id: 3,
    title: "مدرسة عدن الدولية تحقق نتائج متميزة في اختبارات البكالوريا الدولية",
    summary: "حققت مدرسة عدن الدولية نتائج متميزة في اختبارات البكالوريا الدولية بنسبة نجاح 95%",
    content: "حققت مدرسة عدن الدولية نتائج متميزة في اختبارات البكالوريا الدولية (IB) بنسبة نجاح وصلت إلى 95%، حيث حصل 45 طالباً وطالبة على شهادات البكالوريا الدولية. وأشاد مدير المدرسة بالجهود المبذولة من قبل الطلاب والمعلمين، مؤكداً أن هذه النتائج تعكس المستوى التعليمي المتميز للمدرسة والتزامها بمعايير الجودة العالمية.",
    category: "achievement",
    priority: "high",
    author: "مدرسة عدن الدولية",
    publishDate: "2024-01-15",
    readTime: "6 دقائق",
    views: 1100,
    likes: 95,
    comments: 28,
    tags: ["مدرسة عدن الدولية", "بكالوريا دولية", "نتائج متميزة", "نجاح"],
    image: "🏆",
    color: "yellow",
    isBreaking: false,
    isPinned: true
  },
  {
    id: 4,
    title: "وزارة التربية تطلق برنامج تدريبي للمعلمين في استخدام التقنيات الحديثة",
    summary: "أطلقت وزارة التربية والتعليم برنامجاً تدريبياً شاملاً للمعلمين في استخدام التقنيات الحديثة في التعليم",
    content: "أطلقت وزارة التربية والتعليم في عدن برنامجاً تدريبياً شاملاً للمعلمين في استخدام التقنيات الحديثة في التعليم، والذي يشمل التدريب على استخدام السبورات الذكية، المنصات التعليمية الإلكترونية، وتطبيقات التعلم التفاعلي. البرنامج يستهدف 500 معلم ومعلمة من مختلف المراحل التعليمية، وسيتم تنفيذه على مدار 3 أشهر مع إمكانية الحصول على شهادات معتمدة.",
    category: "training",
    priority: "medium",
    author: "وزارة التربية والتعليم",
    publishDate: "2024-01-12",
    readTime: "8 دقائق",
    views: 750,
    likes: 54,
    comments: 12,
    tags: ["تدريب", "معلمين", "تقنيات حديثة", "تعليم إلكتروني"],
    image: "💻",
    color: "purple",
    isBreaking: false,
    isPinned: false
  },
  {
    id: 5,
    title: "معهد عدن التقني يفتتح تخصصات جديدة في الطاقة المتجددة",
    summary: "أعلن معهد عدن التقني عن افتتاح تخصصات جديدة في مجال الطاقة المتجددة والطاقة الشمسية",
    content: "أعلن معهد عدن التقني عن افتتاح تخصصات جديدة في مجال الطاقة المتجددة والطاقة الشمسية، والتي تهدف إلى إعداد كوادر فنية متخصصة في هذا المجال الحيوي. التخصصات الجديدة تشمل تقنية الطاقة الشمسية، طاقة الرياح، والطاقة الهيدروليكية. وسيتم توفير مختبرات متطورة ومعدات حديثة لتدريب الطلاب على أحدث التقنيات في مجال الطاقة النظيفة.",
    category: "technical",
    priority: "medium",
    author: "معهد عدن التقني",
    publishDate: "2024-01-10",
    readTime: "6 دقائق",
    views: 680,
    likes: 42,
    comments: 8,
    tags: ["معهد تقني", "طاقة متجددة", "طاقة شمسية", "تخصصات جديدة"],
    image: "⚡",
    color: "orange",
    isBreaking: false,
    isPinned: false
  },
  {
    id: 6,
    title: "طلاب مدارس عدن يحققون مراكز متقدمة في مسابقة العلوم الوطنية",
    summary: "حقق طلاب مدارس عدن مراكز متقدمة في مسابقة العلوم الوطنية التي أقيمت في صنعاء",
    content: "حققت مدارس عدن مراكز متقدمة في مسابقة العلوم الوطنية التي أقيمت في العاصمة صنعاء، حيث حصل طلاب من مدرسة عدن النموذجية على المركز الأول في مسابقة الفيزياء، بينما حقق طلاب من مدرسة عدن الدولية المركز الثاني في مسابقة الكيمياء. وأشاد وزير التربية والتعليم بالجهود المبذولة من قبل الطلاب والمعلمين، مؤكداً على أهمية هذه المسابقات في تنمية المواهب العلمية.",
    category: "competition",
    priority: "high",
    author: "وزارة التربية والتعليم",
    publishDate: "2024-01-08",
    readTime: "5 دقائق",
    views: 920,
    likes: 78,
    comments: 19,
    tags: ["مسابقة علوم", "طلاب عدن", "مراكز متقدمة", "إنجاز"],
    image: "🔬",
    color: "red",
    isBreaking: false,
    isPinned: true
  },
  {
    id: 7,
    title: "جامعة عدن توقع اتفاقية تعاون مع جامعة الملك سعود",
    summary: "وقعت جامعة عدن اتفاقية تعاون أكاديمي مع جامعة الملك سعود في المملكة العربية السعودية",
    content: "وقعت جامعة عدن اتفاقية تعاون أكاديمي شاملة مع جامعة الملك سعود في المملكة العربية السعودية، والتي تشمل تبادل الطلاب والأساتذة، والبحث العلمي المشترك، وبرامج الدراسات العليا. الاتفاقية ستتيح للطلاب اليمنيين فرصة الدراسة في جامعة الملك سعود، كما ستسمح للأساتذة من كلا الجامعتين بالمشاركة في البرامج البحثية المشتركة.",
    category: "cooperation",
    priority: "medium",
    author: "جامعة عدن",
    publishDate: "2024-01-05",
    readTime: "7 دقائق",
    views: 1100,
    likes: 89,
    comments: 25,
    tags: ["تعاون أكاديمي", "جامعة الملك سعود", "تبادل طلاب", "بحث علمي"],
    image: "🤝",
    color: "indigo",
    isBreaking: false,
    isPinned: false
  },
  {
    id: 8,
    title: "وزارة التربية تعلن عن إطلاق منصة التعليم الإلكتروني الجديدة",
    summary: "أعلنت وزارة التربية والتعليم عن إطلاق منصة التعليم الإلكتروني الجديدة لجميع المراحل التعليمية",
    content: "أعلنت وزارة التربية والتعليم في عدن عن إطلاق منصة التعليم الإلكتروني الجديدة التي ستخدم جميع المراحل التعليمية من الابتدائية إلى الثانوية. المنصة ستوفر محتوى تعليمي تفاعلي، دروس فيديو، تمارين تفاعلية، واختبارات إلكترونية. كما ستتضمن نظام إدارة التعلم الذي يسمح للمعلمين بإنشاء فصول افتراضية ومتابعة تقدم الطلاب. المنصة ستكون متاحة مجاناً لجميع الطلاب والمعلمين.",
    category: "technology",
    priority: "high",
    author: "وزارة التربية والتعليم",
    publishDate: "2024-01-03",
    readTime: "9 دقائق",
    views: 1500,
    likes: 120,
    comments: 35,
    tags: ["تعليم إلكتروني", "منصة رقمية", "تعلم تفاعلي", "تقنية"],
    image: "💻",
    color: "blue",
    isBreaking: true,
    isPinned: true
  }
];

export default function EducationNewsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedNews, setSelectedNews] = useState<any>(null);

  // إحصائيات سريعة
  const stats = React.useMemo(() => {
    const total = educationNews.length;
    const totalViews = educationNews.reduce((sum, news) => sum + news.views, 0);
    const totalLikes = educationNews.reduce((sum, news) => sum + news.likes, 0);
    const breakingNews = educationNews.filter(news => news.isBreaking).length;
    
    return { 
      total, 
      totalViews, 
      totalLikes, 
      breakingNews
    };
  }, []);

  // فلترة الأخبار
  const filteredNews = React.useMemo(() => {
    let currentNews = [...educationNews];

    if (searchQuery) {
      currentNews = currentNews.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      currentNews = currentNews.filter(news => news.category === categoryFilter);
    }

    if (priorityFilter !== 'all') {
      currentNews = currentNews.filter(news => news.priority === priorityFilter);
    }

    currentNews.sort((a, b) => {
      switch (sortBy) {
        case 'views': return b.views - a.views;
        case 'likes': return b.likes - a.likes;
        case 'date':
        default: return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
    });

    return currentNews;
  }, [searchQuery, categoryFilter, priorityFilter, sortBy]);

  // الحصول على الفئات الفريدة
  const categories = React.useMemo(() => {
    const categoryMap = {
      'announcement': 'إعلانات',
      'university': 'جامعي',
      'achievement': 'إنجازات',
      'training': 'تدريب',
      'technical': 'تقني',
      'competition': 'مسابقات',
      'cooperation': 'تعاون',
      'technology': 'تقنية'
    };
    return categoryMap;
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      'announcement': 'bg-blue-600',
      'university': 'bg-green-600',
      'achievement': 'bg-yellow-600',
      'training': 'bg-purple-600',
      'technical': 'bg-orange-600',
      'competition': 'bg-red-600',
      'cooperation': 'bg-indigo-600',
      'technology': 'bg-teal-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': 'text-red-400',
      'medium': 'text-yellow-400',
      'low': 'text-green-400'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      {/* شريط قيد التطوير */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-4 px-4 relative overflow-hidden shadow-lg mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <span className="font-bold text-lg">🚧 قيد التطوير - صفحة أخبار التعليم 🚧</span>
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
            <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">أخبار التعليم</h1>
          </div>
          <p className="text-cyan-300 text-xs sm:text-sm md:text-base">آخر الأخبار والتطورات في قطاع التعليم في عدن</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-cyan-900/80 to-cyan-800/80 border-cyan-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-cyan-300 mb-1">{stats.total}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي الأخبار</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-300 mb-1">{stats.totalViews.toLocaleString()}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي المشاهدات</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-yellow-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-300 mb-1">{stats.totalLikes}</div>
            <div className="text-xs text-gray-300 font-medium">إجمالي الإعجابات</div>
          </Card>
          
          <Card className="text-center p-2 sm:p-4 bg-gradient-to-br from-red-900/80 to-red-800/80 border-red-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-lg sm:text-2xl font-bold text-red-300 mb-1">{stats.breakingNews}</div>
            <div className="text-xs text-gray-300 font-medium">أخبار عاجلة</div>
          </Card>
        </div>

        {/* البحث والفلاتر */}
        <Card className="mb-3 sm:mb-4 bg-cyan-800 bg-opacity-80 border border-cyan-600 rounded-xl shadow-2xl">
          <CardContent className="p-2 sm:p-3">
            <div className="space-y-2 sm:space-y-3">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-2 top-2 w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
                <Input
                  type="text"
                  placeholder="ابحث عن أخبار أو مواضيع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cyan-700 border border-cyan-600 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-8"
                />
              </div>

              {/* فلاتر */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-cyan-700 border border-cyan-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="all">جميع الفئات</option>
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-2 py-1.5 bg-cyan-700 border border-cyan-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="all">جميع الأولويات</option>
                  <option value="high">عاجل</option>
                  <option value="medium">متوسط</option>
                  <option value="low">عادي</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-2 py-1.5 bg-cyan-700 border border-cyan-600 rounded-lg text-xs sm:text-sm text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                >
                  <option value="date">التاريخ</option>
                  <option value="views">المشاهدات</option>
                  <option value="likes">الإعجابات</option>
                </select>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setPriorityFilter('all');
                    setSortBy('date');
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
          <div className="bg-cyan-800 bg-opacity-80 border border-cyan-600 rounded-lg p-2 sm:p-3">
            <p className="text-cyan-300 text-xs sm:text-sm">
              عرض {filteredNews.length} من أصل {educationNews.length} خبر
            </p>
          </div>
        </div>

        {/* قائمة الأخبار */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base sm:text-lg font-bold text-white">آخر الأخبار</h2>
            <Badge className="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs">
              {filteredNews.length}
            </Badge>
          </div>

          {filteredNews.length === 0 ? (
            <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-cyan-900/90 backdrop-blur-sm border-cyan-700 shadow-lg">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد أخبار</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على أخبار تطابق معايير البحث</p>
              <Button 
                onClick={() => setLocation('/education')}
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 text-sm sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                العودة للتعليم
              </Button>
            </Card>
          ) : (
            filteredNews.map((news) => (
              <Card key={news.id} className="bg-cyan-800 bg-opacity-80 border border-cyan-600 rounded-lg shadow-lg hover:bg-cyan-700 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-2 sm:p-4">
                  <div className="space-y-3">
                    {/* الصف الأول: أيقونة + عنوان + badges */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cyan-700 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        {news.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors leading-tight">
                          {news.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {news.isBreaking && (
                            <Badge className="bg-red-600 text-white text-xs px-2 py-1 animate-pulse">
                              🔥 عاجل
                            </Badge>
                          )}
                          {news.isPinned && (
                            <Badge className="bg-yellow-600 text-white text-xs px-2 py-1">
                              📌 مثبت
                            </Badge>
                          )}
                        
                          <Badge className={`${getCategoryColor(news.category)} text-white text-xs px-2 py-1`}>
                            {categories[news.category as keyof typeof categories]}
                          </Badge>
                          <Badge variant="outline" className={`text-xs px-2 py-1 ${getPriorityColor(news.priority)} border-current`}>
                            {news.priority === 'high' ? 'عاجل' : news.priority === 'medium' ? 'متوسط' : 'عادي'}
                          </Badge>
                          <Badge variant="outline" className="text-cyan-400 border-cyan-500 text-xs px-2 py-1">
                            {news.author}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* شبكة المعلومات المنظمة */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="text-gray-300">المشاهدات</div>
                          <div className="text-white font-medium">{news.views}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <ThumbsUp className="w-4 h-4 text-green-400" />
                        <div>
                          <div className="text-gray-300">الإعجابات</div>
                          <div className="text-white font-medium">{news.likes}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="text-gray-300">التعليقات</div>
                          <div className="text-white font-medium">{news.comments}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <div>
                          <div className="text-gray-300">وقت القراءة</div>
                          <div className="text-white font-medium text-xs truncate">{news.readTime}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* الملخص */}
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                      {news.summary}
                    </p>
                    
                    {/* التصنيفات */}
                    <div className="mb-2 sm:mb-3">
                      <h4 className="font-medium text-cyan-300 mb-1 sm:mb-2 flex items-center gap-1 text-xs sm:text-sm">
                        <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                        التصنيفات
                      </h4>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {news.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                        {news.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-gray-500 text-gray-400">
                            +{news.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setSelectedNews(news)}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs py-2"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        قراءة الخبر
                      </Button>
                      <Button
                        onClick={() => {
                          // مشاركة الخبر
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        مشاركة
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* نافذة تفاصيل الخبر */}
        {selectedNews && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-3xl bg-gray-900 border border-cyan-600 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                    <span className="text-2xl">{selectedNews.image}</span>
                    {selectedNews.title}
                    {selectedNews.isBreaking && (
                      <Badge className="bg-red-600 text-white text-xs px-2 py-1 animate-pulse">
                        🔥 عاجل
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    onClick={() => setSelectedNews(null)}
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
                    <h4 className="text-sm font-bold text-cyan-300">المؤلف</h4>
                    <p className="text-sm text-gray-300">{selectedNews.author}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-cyan-300">الفئة</h4>
                    <Badge className={`${getCategoryColor(selectedNews.category)} text-white text-xs px-2 py-1`}>
                      {categories[selectedNews.category as keyof typeof categories]}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-cyan-300">تاريخ النشر</h4>
                    <p className="text-sm text-gray-300">{formatDate(selectedNews.publishDate)}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-cyan-300">وقت القراءة</h4>
                    <p className="text-sm text-gray-300">{selectedNews.readTime}</p>
                  </div>
                </div>

                {/* إحصائيات الخبر */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-cyan-800/50 rounded-lg">
                    <Eye className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-cyan-300">{selectedNews.views.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">مشاهدة</div>
                  </div>
                  <div className="text-center p-3 bg-green-800/50 rounded-lg">
                    <ThumbsUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-green-300">{selectedNews.likes}</div>
                    <div className="text-xs text-gray-400">إعجاب</div>
                  </div>
                  <div className="text-center p-3 bg-blue-800/50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-300">{selectedNews.comments}</div>
                    <div className="text-xs text-gray-400">تعليق</div>
                  </div>
                  <div className="text-center p-3 bg-purple-800/50 rounded-lg">
                    <Share2 className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-purple-300">0</div>
                    <div className="text-xs text-gray-400">مشاركة</div>
                  </div>
                </div>

                {/* الملخص */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-cyan-300">ملخص الخبر</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedNews.summary}</p>
                </div>

                {/* المحتوى الكامل */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-cyan-300">المحتوى الكامل</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedNews.content}</p>
                </div>

                {/* التصنيفات */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-cyan-300">التصنيفات</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.tags.map((tag, index) => (
                      <Badge key={index} className="bg-blue-600 text-white text-xs px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => {
                      // مشاركة الخبر
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    مشاركة الخبر
                  </Button>
                  <Button
                    onClick={() => {
                      // إضافة للمفضلة
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    إضافة للمفضلة
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
