import React, { useState, useEffect, useMemo } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Bookmark, 
  Share2, 
  Heart,
  AlertTriangle,
  Shield,
  Activity,
  Stethoscope,
  Droplets,
  MapPin,
  Tag,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Star,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import ReadMoreModal from '@/components/ReadMoreModal';

interface HealthNews {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'general' | 'covid' | 'vaccination' | 'prevention' | 'treatment' | 'research' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author: string;
  publishDate: string;
  readTime: number; // in minutes
  imageUrl?: string;
  source: string;
  tags: string[];
  views: number;
  likes: number;
  isBookmarked: boolean;
  isRead: boolean;
  relatedNews: string[];
}

const mockHealthNews: HealthNews[] = [
  {
    id: '1',
    title: 'وزارة الصحة تعلن عن حملة تطعيم شاملة ضد الإنفلونزا الموسمية',
    summary: 'تطلق وزارة الصحة العامة والسكان حملة تطعيم مجانية ضد الإنفلونزا الموسمية في جميع محافظات الجمهورية',
    content: 'أعلنت وزارة الصحة العامة والسكان عن إطلاق حملة تطعيم شاملة ضد الإنفلونزا الموسمية بدءاً من الأسبوع القادم. وستشمل الحملة جميع الفئات العمرية مع التركيز على كبار السن والأطفال والحوامل...',
    category: 'vaccination',
    priority: 'high',
    author: 'وزارة الصحة العامة والسكان',
    publishDate: '2025-01-27',
    readTime: 5,
    imageUrl: '/images/health-news/vaccination.jpg',
    source: 'الموقع الرسمي لوزارة الصحة',
    tags: ['تطعيم', 'إنفلونزا', 'حملة صحية', 'وقاية'],
    views: 1250,
    likes: 89,
    isBookmarked: false,
    isRead: false,
    relatedNews: ['2', '3']
  },
  {
    id: '2',
    title: 'نصائح مهمة للوقاية من نزلات البرد في فصل الشتاء',
    summary: 'تقدم وزارة الصحة مجموعة من النصائح والإرشادات للوقاية من نزلات البرد والإنفلونزا خلال فصل الشتاء',
    content: 'مع دخول فصل الشتاء، تزداد حالات الإصابة بنزلات البرد والإنفلونزا. تقدم وزارة الصحة العامة والسكان مجموعة من النصائح المهمة للوقاية من هذه الأمراض...',
    category: 'prevention',
    priority: 'medium',
    author: 'د. أحمد محمد - استشاري الأمراض المعدية',
    publishDate: '2025-01-26',
    readTime: 3,
    imageUrl: '/images/health-news/prevention.jpg',
    source: 'مركز الأبحاث الصحية',
    tags: ['وقاية', 'نزلة برد', 'شتاء', 'صحة عامة'],
    views: 890,
    likes: 67,
    isBookmarked: true,
    isRead: true,
    relatedNews: ['1', '4']
  },
  {
    id: '3',
    title: 'إطلاق برنامج جديد لفحص سرطان الثدي المبكر في عدن',
    summary: 'تطلق وزارة الصحة برنامج فحص مجاني لسرطان الثدي المبكر في مستشفيات عدن الرئيسية',
    content: 'أطلقت وزارة الصحة العامة والسكان برنامجاً جديداً لفحص سرطان الثدي المبكر في مستشفيات عدن الرئيسية. يهدف البرنامج إلى الكشف المبكر عن المرض وزيادة فرص الشفاء...',
    category: 'treatment',
    priority: 'high',
    author: 'د. فاطمة علي - مديرة برامج السرطان',
    publishDate: '2025-01-25',
    readTime: 7,
    imageUrl: '/images/health-news/cancer-screening.jpg',
    source: 'مستشفى الجمهورية التعليمي',
    tags: ['سرطان الثدي', 'فحص مبكر', 'عدن', 'صحة المرأة'],
    views: 2100,
    likes: 156,
    isBookmarked: false,
    isRead: false,
    relatedNews: ['1', '5']
  },
  {
    id: '4',
    title: 'تحذير من تناول الأدوية من دون وصفة طبية',
    summary: 'تحذر وزارة الصحة من مخاطر تناول الأدوية من دون استشارة طبية وضرورة مراجعة الصيدلي',
    content: 'حذرت وزارة الصحة العامة والسكان من مخاطر تناول الأدوية من دون وصفة طبية أو استشارة طبية. وأكدت على ضرورة مراجعة الصيدلي قبل تناول أي دواء...',
    category: 'general',
    priority: 'medium',
    author: 'د. محمد سالم - رئيس قسم الصيدلة',
    publishDate: '2025-01-24',
    readTime: 4,
    imageUrl: '/images/health-news/medication-warning.jpg',
    source: 'نقابة الصيادلة',
    tags: ['أدوية', 'تحذير', 'صيدلة', 'سلامة'],
    views: 750,
    likes: 45,
    isBookmarked: false,
    isRead: true,
    relatedNews: ['2', '6']
  },
  {
    id: '5',
    title: 'دراسة جديدة تكشف عن فوائد الصوم المتقطع للصحة',
    summary: 'كشفت دراسة حديثة عن الفوائد الصحية للصوم المتقطع في تحسين الصحة العامة وتقليل مخاطر الأمراض المزمنة',
    content: 'كشفت دراسة حديثة أجراها باحثون في جامعة عدن عن الفوائد الصحية المذهلة للصوم المتقطع. وأظهرت النتائج تحسناً ملحوظاً في الصحة العامة...',
    category: 'research',
    priority: 'low',
    author: 'د. عبدالله حسن - أستاذ التغذية العلاجية',
    publishDate: '2025-01-23',
    readTime: 6,
    imageUrl: '/images/health-news/fasting-research.jpg',
    source: 'جامعة عدن - كلية الطب',
    tags: ['صوم متقطع', 'دراسة', 'تغذية', 'صحة عامة'],
    views: 1100,
    likes: 78,
    isBookmarked: true,
    isRead: false,
    relatedNews: ['3', '7']
  },
  {
    id: '6',
    title: 'إرشادات مهمة للتعامل مع حالات الطوارئ الصحية',
    summary: 'تقدم وزارة الصحة إرشادات مهمة للتعامل مع حالات الطوارئ الصحية والإسعافات الأولية',
    content: 'قدمت وزارة الصحة العامة والسكان مجموعة من الإرشادات المهمة للتعامل مع حالات الطوارئ الصحية. وتشمل الإرشادات كيفية التعامل مع النوبات القلبية والسكتات الدماغية...',
    category: 'emergency',
    priority: 'urgent',
    author: 'د. خالد أحمد - مدير الطوارئ',
    publishDate: '2025-01-22',
    readTime: 8,
    imageUrl: '/images/health-news/emergency-guidelines.jpg',
    source: 'مركز الطوارئ الطبية',
    tags: ['طوارئ', 'إسعاف أولي', 'نوبة قلبية', 'سكتة دماغية'],
    views: 3200,
    likes: 234,
    isBookmarked: true,
    isRead: false,
    relatedNews: ['4', '8']
  }
];

export default function HealthNewsPage() {
  const [news, setNews] = useState<HealthNews[]>(mockHealthNews);
  const [filteredNews, setFilteredNews] = useState<HealthNews[]>(mockHealthNews);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [selectedNews, setSelectedNews] = useState<HealthNews | null>(null);
  const [isReadMoreModalOpen, setIsReadMoreModalOpen] = useState(false);

  // تصفية الأخبار
  useEffect(() => {
    let filtered = news;

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.includes(searchQuery) ||
        article.summary.includes(searchQuery) ||
        article.tags.some(tag => tag.includes(searchQuery))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(article => article.category === categoryFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(article => article.priority === priorityFilter);
    }

    if (showOnlyUnread) {
      filtered = filtered.filter(article => !article.isRead);
    }

    // ترتيب الأخبار
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    setFilteredNews(filtered);
  }, [news, searchQuery, categoryFilter, priorityFilter, sortBy, showOnlyUnread]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'covid': return <Shield className="w-4 h-4" />;
      case 'vaccination': return <Droplets className="w-4 h-4" />;
      case 'prevention': return <Heart className="w-4 h-4" />;
      case 'treatment': return <Stethoscope className="w-4 h-4" />;
      case 'research': return <Activity className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'general': return 'عام';
      case 'covid': return 'كوفيد-19';
      case 'vaccination': return 'تطعيم';
      case 'prevention': return 'وقاية';
      case 'treatment': return 'علاج';
      case 'research': return 'بحث';
      case 'emergency': return 'طوارئ';
      default: return 'عام';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'عالي';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return 'عادي';
    }
  };

  const handleBookmark = (newsId: string) => {
    setNews(prev => prev.map(article => 
      article.id === newsId 
        ? { ...article, isBookmarked: !article.isBookmarked }
        : article
    ));
  };

  const handleRead = (newsId: string) => {
    setNews(prev => prev.map(article => 
      article.id === newsId 
        ? { ...article, isRead: true, views: article.views + 1 }
        : article
    ));
  };

  const handleLike = (newsId: string) => {
    setNews(prev => prev.map(article => 
      article.id === newsId 
        ? { ...article, likes: article.likes + 1 }
        : article
    ));
  };

  const handleShare = (article: HealthNews) => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${article.title}\n${article.summary}\n${window.location.href}`);
      alert('تم نسخ الرابط إلى الحافظة');
    }
  };

  // دالة لفتح نافذة اقرأ المزيد
  const handleReadMore = (article: HealthNews) => {
    setSelectedNews(article);
    setIsReadMoreModalOpen(true);
  };

  const stats = useMemo(() => {
    const totalNews = news.length;
    const unreadNews = news.filter(article => !article.isRead).length;
    const bookmarkedNews = news.filter(article => article.isBookmarked).length;
    const totalViews = news.reduce((sum, article) => sum + article.views, 0);
    const totalLikes = news.reduce((sum, article) => sum + article.likes, 0);

    return { totalNews, unreadNews, bookmarkedNews, totalViews, totalLikes };
  }, [news]);

  return (
    <div className="min-h-screen bg-background page-transition overflow-x-hidden">
      <AppHeader />
      
      <div className="w-full px-3 py-4 sm:py-8" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        {/* العنوان الرئيسي */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 sm:mb-6 shadow-lg">
            <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            الأخبار الصحية
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
            آخر الأخبار الصحية والتوعوية من وزارة الصحة العامة والسكان
          </p>
        </div>

        {/* الإحصائيات السريعة */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Newspaper className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-blue-300 mb-1 sm:mb-2">{stats.totalNews}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">إجمالي الأخبار</div>
            </CardContent>
          </Card>
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-green-900/80 to-green-800/80 border-green-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-green-300 mb-1 sm:mb-2">{stats.unreadNews}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">غير مقروءة</div>
            </CardContent>
          </Card>
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-yellow-900/80 to-yellow-800/80 border-yellow-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Bookmark className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-yellow-300 mb-1 sm:mb-2">{stats.bookmarkedNews}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">محفوظة</div>
            </CardContent>
          </Card>
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-purple-900/80 to-purple-800/80 border-purple-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-purple-300 mb-1 sm:mb-2">{stats.totalViews}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">مشاهدات</div>
            </CardContent>
          </Card>
          <Card className="text-center p-3 sm:p-6 bg-gradient-to-br from-pink-900/80 to-pink-800/80 border-pink-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <ThumbsUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-xl sm:text-3xl font-bold text-pink-300 mb-1 sm:mb-2">{stats.totalLikes}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium">إعجابات</div>
            </CardContent>
          </Card>
        </div>

        {/* شريط البحث والفلترة */}
        <Card className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm border-blue-700 shadow-lg w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          <div className="space-y-2 sm:space-y-3 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
            {/* شريط البحث */}
            <div className="relative">
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 w-4 h-4" />
              <Input
                placeholder="ابحث في الأخبار..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-full pr-8 h-9 text-sm border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* الفلاتر */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full max-w-full h-9 text-xs border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                  <SelectItem value="all" className="hover:bg-gray-700 text-white text-sm">جميع التصنيفات</SelectItem>
                  <SelectItem value="general" className="hover:bg-gray-700 text-white text-sm">عام</SelectItem>
                  <SelectItem value="covid" className="hover:bg-gray-700 text-white text-sm">كوفيد-19</SelectItem>
                  <SelectItem value="vaccination" className="hover:bg-gray-700 text-white text-sm">تطعيم</SelectItem>
                  <SelectItem value="prevention" className="hover:bg-gray-700 text-white text-sm">وقاية</SelectItem>
                  <SelectItem value="treatment" className="hover:bg-gray-700 text-white text-sm">علاج</SelectItem>
                  <SelectItem value="research" className="hover:bg-gray-700 text-white text-sm">بحث</SelectItem>
                  <SelectItem value="emergency" className="hover:bg-gray-700 text-white text-sm">طوارئ</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full max-w-full h-9 text-xs border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="الأولوية" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                  <SelectItem value="all" className="hover:bg-gray-700 text-white text-sm">جميع الأولويات</SelectItem>
                  <SelectItem value="urgent" className="hover:bg-gray-700 text-white text-sm">عاجل</SelectItem>
                  <SelectItem value="high" className="hover:bg-gray-700 text-white text-sm">عالي</SelectItem>
                  <SelectItem value="medium" className="hover:bg-gray-700 text-white text-sm">متوسط</SelectItem>
                  <SelectItem value="low" className="hover:bg-gray-700 text-white text-sm">منخفض</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* الفلاتر الإضافية */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full max-w-full h-9 text-xs border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border border-gray-600 shadow-lg">
                  <SelectItem value="date" className="hover:bg-gray-700 text-white text-sm">التاريخ</SelectItem>
                  <SelectItem value="views" className="hover:bg-gray-700 text-white text-sm">المشاهدات</SelectItem>
                  <SelectItem value="likes" className="hover:bg-gray-700 text-white text-sm">الإعجابات</SelectItem>
                  <SelectItem value="priority" className="hover:bg-gray-700 text-white text-sm">الأولوية</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                className={`h-9 text-xs ${showOnlyUnread ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                <Eye className="w-3 h-3 mr-1" />
                {showOnlyUnread ? 'جميع الأخبار' : 'غير مقروءة فقط'}
              </Button>
            </div>
          </div>
        </Card>

        {/* قائمة الأخبار */}
        <div className="space-y-3 sm:space-y-4 w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {filteredNews.map((article) => (
            <Card key={article.id} className="p-3 sm:p-4 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-blue-700 hover:border-blue-600 w-full max-w-full overflow-hidden" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      {getCategoryIcon(article.category)}
                      <h3 className="text-base sm:text-lg font-semibold text-white break-words">{article.title}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={`${getPriorityColor(article.priority)} text-xs px-2 py-1`}>
                        {getPriorityName(article.priority)}
                      </Badge>
                      <Badge variant="outline" className="text-blue-400 border-blue-500 text-xs px-2 py-1">
                        {getCategoryName(article.category)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 mb-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs text-gray-300">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-blue-400" />
                        <span className="truncate font-medium">{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-green-400" />
                        <span className="font-medium">{article.publishDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-400" />
                        <span className="font-medium">{article.readTime} دقيقة</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-purple-400" />
                        <span className="font-medium">{article.views} مشاهدة</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 break-words">
                    {article.summary}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-gray-400 border-gray-500 text-xs">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLike(article.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-900/20 border-gray-500 text-xs h-7"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {article.likes}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookmark(article.id)}
                          className={`text-xs h-7 ${
                            article.isBookmarked 
                              ? 'text-yellow-400 border-yellow-500 bg-yellow-900/20' 
                              : 'text-gray-400 border-gray-500 hover:text-yellow-400 hover:bg-yellow-900/20'
                          }`}
                        >
                          <Bookmark className="w-3 h-3 mr-1" />
                          {article.isBookmarked ? 'محفوظة' : 'حفظ'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(article)}
                          className="text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 border-gray-500 text-xs h-7"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          مشاركة
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          handleReadMore(article);
                          handleRead(article.id);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-3 py-1 h-7"
                      >
                        <ArrowRight className="w-3 h-3 mr-1" />
                        اقرأ المزيد
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <Card className="p-6 sm:p-12 text-center bg-gradient-to-br from-gray-900/90 to-blue-900/90 backdrop-blur-sm border-blue-700 shadow-lg">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Newspaper className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">لا توجد أخبار</h3>
            <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-lg">لم يتم العثور على أخبار تطابق معايير البحث</p>
          </Card>
        )}
      </div>

      <AppFooter />

      {/* نافذة اقرأ المزيد */}
      {selectedNews && (
        <ReadMoreModal
          open={isReadMoreModalOpen}
          onOpenChange={setIsReadMoreModalOpen}
          title={selectedNews.title}
          subtitle={getCategoryName(selectedNews.category)}
          content={selectedNews.content}
          author={selectedNews.author}
          publishDate={selectedNews.publishDate}
          readTime={selectedNews.readTime}
          category={getCategoryName(selectedNews.category)}
          tags={selectedNews.tags}
          stats={{
            views: selectedNews.views,
            likes: selectedNews.likes,
            comments: (selectedNews as any).comments || 0
          }}
          image={getCategoryIcon(selectedNews.category) as unknown as string}
          actions={[
            {
              label: 'إعجاب',
              onClick: () => handleLike(selectedNews.id),
              icon: <ThumbsUp className="w-4 h-4" />,
              variant: 'outline' as const
            },
            {
              label: selectedNews.isBookmarked ? 'إلغاء الحفظ' : 'حفظ',
              onClick: () => handleBookmark(selectedNews.id),
              icon: <Bookmark className="w-4 h-4" />,
              variant: 'outline' as const
            },
            {
              label: 'مشاركة',
              onClick: () => handleShare(selectedNews),
              icon: <Share2 className="w-4 h-4" />,
              variant: 'outline' as const
            }
          ]}
        />
      )}
    </div>
  );
}
