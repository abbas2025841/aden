import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Shield, 
  Heart, 
  Activity, 
  Clock, 
  MapPin, 
  Bell, 
  Search, 
  Filter, 
  Eye, 
  Bookmark, 
  Share, 
  Calendar,
  Users,
  Zap,
  Droplets,
  Wind,
  Sun,
  Cloud,
  Thermometer,
  AlertOctagon,
  Info,
  CheckCircle,
  XCircle,
  Settings,
  Volume2,
  VolumeX,
  BellRing
} from 'lucide-react';

interface HealthAlert {
  id: string;
  title: string;
  description: string;
  category: 'weather' | 'disease' | 'safety' | 'emergency' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  date: string;
  time: string;
  source: string;
  isRead: boolean;
  isBookmarked: boolean;
  tags: string[];
  affectedAreas: string[];
  recommendations: string[];
}

const mockAlerts: HealthAlert[] = [
  {
    id: '1',
    title: 'تحذير من ارتفاع درجات الحرارة',
    description: 'تتوقع الأرصاد الجوية ارتفاع درجات الحرارة إلى 45 درجة مئوية خلال الأيام القادمة. يُنصح بتجنب التعرض المباشر لأشعة الشمس وتناول كميات كافية من الماء.',
    category: 'weather',
    severity: 'high',
    location: 'عدن - جميع المناطق',
    date: '2024-01-20',
    time: '10:30',
    source: 'وزارة الصحة العامة',
    isRead: false,
    isBookmarked: false,
    tags: ['حرارة', 'جفاف', 'أشعة الشمس'],
    affectedAreas: ['كريتر', 'المعلا', 'التواهي', 'خور مكسر', 'المنصورة'],
    recommendations: [
      'تجنب الخروج في أوقات الذروة (11 ص - 4 م)',
      'شرب 8-10 أكواب ماء يومياً',
      'استخدام واقي الشمس',
      'ارتداء ملابس فاتحة اللون'
    ]
  },
  {
    id: '2',
    title: 'تنبيه عن انتشار الإنفلونزا الموسمية',
    description: 'تم رصد زيادة في حالات الإنفلونزا الموسمية في بعض مناطق عدن. يُنصح بأخذ الاحتياطات اللازمة ومراجعة الطبيب عند ظهور الأعراض.',
    category: 'disease',
    severity: 'medium',
    location: 'عدن - المنصورة والشيخ عثمان',
    date: '2024-01-19',
    time: '14:15',
    source: 'مديرية الصحة - عدن',
    isRead: true,
    isBookmarked: true,
    tags: ['إنفلونزا', 'فيروس', 'موسمي'],
    affectedAreas: ['المنصورة', 'الشيخ عثمان'],
    recommendations: [
      'غسل اليدين بانتظام',
      'تجنب الازدحام',
      'استخدام الكمامة في الأماكن المغلقة',
      'أخذ لقاح الإنفلونزا'
    ]
  },
  {
    id: '3',
    title: 'تحذير من تلوث المياه في بعض المناطق',
    description: 'تم اكتشاف تلوث في شبكة المياه في مناطق محددة. يُنصح بغلي الماء قبل الاستخدام أو استخدام المياه المعبأة.',
    category: 'safety',
    severity: 'critical',
    location: 'عدن - البريقة ودار سعد',
    date: '2024-01-18',
    time: '08:45',
    source: 'شركة المياه والصرف الصحي',
    isRead: false,
    isBookmarked: false,
    tags: ['مياه', 'تلوث', 'صحة عامة'],
    affectedAreas: ['البريقة', 'دار سعد'],
    recommendations: [
      'غلي الماء لمدة 5 دقائق على الأقل',
      'استخدام المياه المعبأة للشرب',
      'تجنب استخدام ماء الصنبور للطبخ',
      'مراجعة الطبيب عند ظهور أعراض'
    ]
  },
  {
    id: '4',
    title: 'تنبيه عن جودة الهواء',
    description: 'تسجيل مستويات عالية من التلوث في الهواء بسبب الرياح المحملة بالغبار. يُنصح بارتداء الكمامات وتجنب الأنشطة الخارجية.',
    category: 'weather',
    severity: 'medium',
    location: 'عدن - جميع المناطق',
    date: '2024-01-17',
    time: '16:20',
    source: 'المركز الوطني للأرصاد الجوية',
    isRead: true,
    isBookmarked: false,
    tags: ['هواء', 'غبار', 'تلوث'],
    affectedAreas: ['جميع المناطق'],
    recommendations: [
      'ارتداء الكمامة عند الخروج',
      'تجنب الأنشطة الخارجية',
      'إغلاق النوافذ والأبواب',
      'استخدام أجهزة تنقية الهواء'
    ]
  },
  {
    id: '5',
    title: 'تنبيه عن نقص الأدوية الأساسية',
    description: 'نقص في بعض الأدوية الأساسية في الصيدليات الحكومية. يُنصح بالحصول على الأدوية من الصيدليات الخاصة أو مراجعة المستشفيات.',
    category: 'general',
    severity: 'medium',
    location: 'عدن - جميع المناطق',
    date: '2024-01-16',
    time: '12:00',
    source: 'وزارة الصحة العامة',
    isRead: false,
    isBookmarked: true,
    tags: ['أدوية', 'نقص', 'صيدليات'],
    affectedAreas: ['جميع المناطق'],
    recommendations: [
      'مراجعة الصيدليات الخاصة',
      'الاستعانة بالمستشفيات',
      'شراء الأدوية بكميات مناسبة',
      'مراجعة الطبيب للبدائل'
    ]
  }
];

export default function HealthAlertsPage() {
  const [alerts, setAlerts] = useState<HealthAlert[]>(mockAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<HealthAlert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  
  // إعدادات الإشعارات
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    sms: false,
    categories: {
      weather: true,
      disease: true,
      safety: true,
      emergency: true,
      general: true
    },
    severities: {
      low: false,
      medium: true,
      high: true,
      critical: true
    }
  });
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const [lastAlertCheck, setLastAlertCheck] = useState(Date.now());

  // تصفية التنبيهات
  React.useEffect(() => {
    let filtered = alerts;

    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.title.includes(searchQuery) ||
        alert.description.includes(searchQuery) ||
        alert.tags.some(tag => tag.includes(searchQuery))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(alert => alert.category === categoryFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    if (showOnlyUnread) {
      filtered = filtered.filter(alert => !alert.isRead);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchQuery, categoryFilter, severityFilter, showOnlyUnread]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather': return <Sun className="w-5 h-5" />;
      case 'disease': return <Heart className="w-5 h-5" />;
      case 'safety': return <Shield className="w-5 h-5" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weather': return 'bg-yellow-900/80 text-yellow-300 border-yellow-700';
      case 'disease': return 'bg-red-900/80 text-red-300 border-red-700';
      case 'safety': return 'bg-blue-900/80 text-blue-300 border-blue-700';
      case 'emergency': return 'bg-red-900/80 text-red-300 border-red-700';
      default: return 'bg-gray-900/80 text-gray-300 border-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-900/80 text-green-300 border-green-700';
      case 'medium': return 'bg-yellow-900/80 text-yellow-300 border-yellow-700';
      case 'high': return 'bg-orange-900/80 text-orange-300 border-orange-700';
      case 'critical': return 'bg-red-900/80 text-red-300 border-red-700';
      default: return 'bg-gray-900/80 text-gray-300 border-gray-700';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low': return 'منخفض';
      case 'medium': return 'متوسط';
      case 'high': return 'عالي';
      case 'critical': return 'حرج';
      default: return severity;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'weather': return 'طقس';
      case 'disease': return 'أمراض';
      case 'safety': return 'سلامة';
      case 'emergency': return 'طوارئ';
      case 'general': return 'عام';
      default: return category;
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
  };

  const toggleBookmark = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isBookmarked: !alert.isBookmarked } : alert
    ));
  };

  // وظائف الإشعارات
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (alert: HealthAlert) => {
    if (!notificationSettings.enabled) return;

    // إشعار سطح المكتب
    if (notificationSettings.desktop && 'Notification' in window) {
      const notification = new Notification(`تنبيه صحي جديد: ${alert.title}`, {
        body: alert.description,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: alert.id,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // صوت الإشعار
    if (notificationSettings.sound) {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(() => {
        // إنشاء صوت بسيط إذا لم يكن الملف موجود
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      });
    }
  };

  const checkForNewAlerts = () => {
    const newAlerts = alerts.filter(alert => 
      new Date(alert.date + ' ' + alert.time).getTime() > lastAlertCheck
    );
    
    if (newAlerts.length > 0) {
      setNewAlertCount(prev => prev + newAlerts.length);
      
      // إظهار إشعارات للتنبيهات الجديدة
      newAlerts.forEach(alert => {
        if (notificationSettings.categories[alert.category as keyof typeof notificationSettings.categories] &&
            notificationSettings.severities[alert.severity as keyof typeof notificationSettings.severities]) {
          showNotification(alert);
        }
      });
    }
    
    setLastAlertCheck(Date.now());
  };

  // محاكاة تنبيهات جديدة كل 30 ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      if (notificationSettings.enabled) {
        // إضافة تنبيه جديد محاكي
        const newAlert: HealthAlert = {
          id: `alert-${Date.now()}`,
          title: 'تنبيه صحي جديد',
          description: 'هذا تنبيه محاكي لاختبار نظام الإشعارات',
          category: 'general',
          severity: 'medium',
          location: 'عدن - جميع المناطق',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('ar-SA', { hour12: false }).slice(0, 5),
          source: 'نظام الإشعارات',
          isRead: false,
          isBookmarked: false,
          tags: ['اختبار', 'إشعار'],
          affectedAreas: ['جميع المناطق'],
          recommendations: ['تحقق من الإشعارات بانتظام']
        };

        setAlerts(prev => [newAlert, ...prev]);
        showNotification(newAlert);
      }
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, [notificationSettings]);

  // طلب إذن الإشعارات عند تحميل الصفحة
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="w-full">
        <AppHeader />
        
        {/* شريط قيد التطوير */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-4 px-4 relative overflow-hidden shadow-lg mb-6 sm:mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <span className="font-bold text-lg">🚧 قيد التطوير - صفحة التنبيهات الصحية 🚧</span>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <div className="relative z-10 mt-2">
            <span className="text-sm font-medium opacity-90">هذه الصفحة قيد التطوير وقد تحتوي على ميزات غير مكتملة</span>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* العنوان الرئيسي المحسن */}
          <div className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-700/50">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg">
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      التنبيهات الصحية
                    </h1>
                    <p className="text-gray-300 text-sm md:text-base mt-1">ابق على اطلاع بأحدث التنبيهات الصحية والتحذيرات في عدن</p>
                  </div>
                </div>
                
                {/* أزرار الإشعارات */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {newAlertCount > 0 && (
                    <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold animate-pulse">
                      {newAlertCount} جديد
                    </Badge>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      <Settings className="w-4 h-4 ml-1" />
                      إعدادات
                    </Button>
                    
                    <Button
                      onClick={checkForNewAlerts}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                    >
                      <BellRing className="w-4 h-4 ml-1" />
                      فحص
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* إحصائيات سريعة في العنوان */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <div className="text-center p-3 bg-gradient-to-r from-red-900/80 to-red-800/80 rounded-lg border border-red-700">
                  <div className="text-lg font-bold text-red-300">{alerts.length}</div>
                  <div className="text-xs text-red-200 font-medium">إجمالي التنبيهات</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-orange-900/80 to-orange-800/80 rounded-lg border border-orange-700">
                  <div className="text-lg font-bold text-orange-300">
                    {alerts.filter(a => !a.isRead).length}
                  </div>
                  <div className="text-xs text-orange-200 font-medium">غير مقروء</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-yellow-900/80 to-yellow-800/80 rounded-lg border border-yellow-700">
                  <div className="text-lg font-bold text-yellow-300">
                    {alerts.filter(a => a.severity === 'critical' || a.severity === 'high').length}
                  </div>
                  <div className="text-xs text-yellow-200 font-medium">عالي الخطورة</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-r from-blue-900/80 to-blue-800/80 rounded-lg border border-blue-700">
                  <div className="text-lg font-bold text-blue-300">
                    {alerts.filter(a => a.isBookmarked).length}
                  </div>
                  <div className="text-xs text-blue-200 font-medium">محفوظ</div>
                </div>
              </div>
            </div>
          </div>

          {/* شريط البحث والتصفية المحسن */}
          <Card className="p-4 mb-6 shadow-lg border-0 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm rounded-xl border-blue-700">
            <div className="space-y-4">
              {/* البحث المحسن */}
              <div className="relative group">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  placeholder="البحث في التنبيهات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-12 text-sm border-2 border-gray-600 focus:border-blue-500 rounded-xl transition-all duration-300 shadow-sm bg-gray-800/50 text-gray-300"
                />
              </div>

              {/* التصفية */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-12 border-2 border-gray-600 focus:border-blue-500 rounded-xl shadow-sm bg-gray-800/50 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <SelectValue placeholder="الفئة" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    <SelectItem value="weather">🌤️ طقس</SelectItem>
                    <SelectItem value="disease">🦠 أمراض</SelectItem>
                    <SelectItem value="safety">🛡️ سلامة</SelectItem>
                    <SelectItem value="emergency">🚨 طوارئ</SelectItem>
                    <SelectItem value="general">ℹ️ عام</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="h-12 border-2 border-gray-600 focus:border-blue-500 rounded-xl shadow-sm bg-gray-800/50 text-gray-300">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <SelectValue placeholder="الخطورة" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المستويات</SelectItem>
                    <SelectItem value="low">🟢 منخفض</SelectItem>
                    <SelectItem value="medium">🟡 متوسط</SelectItem>
                    <SelectItem value="high">🟠 عالي</SelectItem>
                    <SelectItem value="critical">🔴 حرج</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                  className={`h-12 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg ${
                    showOnlyUnread 
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white' 
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 hover:from-gray-600 hover:to-gray-700'
                  }`}
                >
                  <Bell className="w-4 h-4 ml-1" />
                  <span className="text-sm">غير مقروء</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* إعدادات الإشعارات */}
          {showNotificationSettings && (
            <Card className="p-8 mb-8 shadow-xl border-0 bg-gradient-to-r from-gray-900/90 to-blue-900/90 backdrop-blur-sm rounded-2xl border-blue-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-300 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-400" />
                  إعدادات الإشعارات
                </h3>
                <Button
                  onClick={() => setShowNotificationSettings(false)}
                  variant="outline"
                  size="sm"
                  className="text-gray-400 border-gray-600 hover:border-gray-500"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* الإعدادات العامة */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-300 mb-4">الإعدادات العامة</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-gray-300">تفعيل الإشعارات</span>
                      </div>
                      <Button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                        className={notificationSettings.enabled ? 'bg-green-600' : 'bg-gray-400'}
                      >
                        {notificationSettings.enabled ? 'مفعل' : 'معطل'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {notificationSettings.sound ? <Volume2 className="w-5 h-5 text-green-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                        <span className="font-medium text-gray-300">صوت الإشعارات</span>
                      </div>
                      <Button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, sound: !prev.sound }))}
                        className={notificationSettings.sound ? 'bg-green-600' : 'bg-gray-400'}
                      >
                        {notificationSettings.sound ? 'مفعل' : 'معطل'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-purple-400" />
                        <span className="font-medium text-gray-300">إشعارات سطح المكتب</span>
                      </div>
                      <Button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, desktop: !prev.desktop }))}
                        className={notificationSettings.desktop ? 'bg-green-600' : 'bg-gray-400'}
                      >
                        {notificationSettings.desktop ? 'مفعل' : 'معطل'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* تصفية الفئات */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-300 mb-4">تصفية الفئات</h4>
                  
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.categories).map(([category, enabled]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="font-medium capitalize text-gray-300">{getCategoryText(category)}</span>
                        <Button
                          onClick={() => setNotificationSettings(prev => ({
                            ...prev,
                            categories: { ...prev.categories, [category]: !enabled }
                          }))}
                          size="sm"
                          className={enabled ? 'bg-green-600' : 'bg-gray-400'}
                        >
                          {enabled ? 'مفعل' : 'معطل'}
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-300 mb-4 mt-6">تصفية الخطورة</h4>
                  
                  <div className="space-y-3">
                    {Object.entries(notificationSettings.severities).map(([severity, enabled]) => (
                      <div key={severity} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="font-medium text-gray-300">{getSeverityText(severity)}</span>
                        <Button
                          onClick={() => setNotificationSettings(prev => ({
                            ...prev,
                            severities: { ...prev.severities, [severity]: !enabled }
                          }))}
                          size="sm"
                          className={enabled ? 'bg-green-600' : 'bg-gray-400'}
                        >
                          {enabled ? 'مفعل' : 'معطل'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* قائمة التنبيهات */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <Card className="p-8 text-center bg-gradient-to-br from-gray-900/90 to-blue-900/90 border-2 border-dashed border-gray-600 rounded-xl backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-gray-800/80 rounded-full mb-4">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-300 mb-2">لا توجد تنبيهات</h3>
                  <p className="text-gray-400 text-sm">لم يتم العثور على تنبيهات تطابق معايير البحث</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className={`group hover:shadow-xl transition-all duration-300 ${
                    !alert.isRead 
                      ? 'bg-gradient-to-r from-red-900/90 to-orange-900/90 border-l-4 border-l-red-400 shadow-lg backdrop-blur-sm' 
                      : 'bg-gradient-to-r from-gray-900/90 to-blue-900/90 border-blue-700 shadow-md backdrop-blur-sm'
                  } rounded-xl`}>
                    <div className="p-4">
                      {/* العنوان والخطورة */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg shadow-sm ${getCategoryColor(alert.category)}`}>
                          {getCategoryIcon(alert.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-lg font-bold leading-tight ${alert.isRead ? 'text-gray-300' : 'text-white'}`}>
                              {alert.title}
                            </h3>
                            {!alert.isRead && (
                              <Badge className="bg-red-500 text-white px-2 py-0.5 text-xs font-bold animate-pulse">
                                جديد
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`${getCategoryColor(alert.category)} px-2 py-1 text-xs font-semibold rounded-full`}>
                              {getCategoryText(alert.category)}
                            </Badge>
                            <Badge className={`${getSeverityColor(alert.severity)} px-2 py-1 text-xs font-semibold rounded-full`}>
                              {getSeverityText(alert.severity)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* الوصف */}
                      <p className={`text-sm leading-relaxed mb-3 ${alert.isRead ? 'text-gray-400' : 'text-gray-300'}`}>
                        {alert.description}
                      </p>
                      
                      {/* معلومات التنبيه */}
                      <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0 text-blue-500" />
                          <span className="truncate">{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0 text-green-500" />
                          <span>{alert.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0 text-purple-500" />
                          <span>{alert.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 flex-shrink-0 text-orange-500" />
                          <span className="truncate">{alert.source}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* التوصيات */}
                      {alert.recommendations && alert.recommendations.length > 0 && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 rounded-lg border border-blue-700/50">
                          <h4 className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            التوصيات المهمة
                          </h4>
                          <ul className="space-y-1">
                            {alert.recommendations.slice(0, 2).map((rec, index) => (
                              <li key={index} className="text-xs text-blue-200 flex items-start gap-2">
                                <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                <span className="leading-relaxed">{rec}</span>
                              </li>
                            ))}
                            {alert.recommendations.length > 2 && (
                              <li className="text-xs text-blue-300 font-medium">
                                +{alert.recommendations.length - 2} توصيات أخرى
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {/* المناطق المتأثرة */}
                      {alert.affectedAreas && alert.affectedAreas.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            المناطق المتأثرة
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {alert.affectedAreas.slice(0, 3).map((area, index) => (
                              <Badge key={index} className="bg-orange-900/80 text-orange-300 border-orange-700 px-2 py-0.5 text-xs">
                                {area}
                              </Badge>
                            ))}
                            {alert.affectedAreas.length > 3 && (
                              <Badge className="bg-gray-900/80 text-gray-300 border-gray-700 px-2 py-0.5 text-xs">
                                +{alert.affectedAreas.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* العلامات */}
                      {alert.tags && alert.tags.length > 0 && (
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-1">
                            {alert.tags.slice(0, 4).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 border-gray-500 text-gray-300">
                                #{tag}
                              </Badge>
                            ))}
                            {alert.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-gray-500 text-gray-400">
                                +{alert.tags.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* أزرار الإجراءات */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => markAsRead(alert.id)}
                            size="sm"
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                              alert.isRead 
                                ? 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80 border-gray-600' 
                                : 'bg-green-900/80 text-green-300 hover:bg-green-800/80 border-green-700'
                            }`}
                          >
                            {alert.isRead ? 'تم القراءة' : 'اقرأ'}
                          </Button>
                          <Button
                            onClick={() => toggleBookmark(alert.id)}
                            size="sm"
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                              alert.isBookmarked 
                                ? 'bg-yellow-900/80 text-yellow-300 hover:bg-yellow-800/80 border-yellow-700' 
                                : 'bg-gray-800/80 text-gray-400 hover:bg-gray-700/80 border-gray-600'
                            }`}
                          >
                            {alert.isBookmarked ? 'محفوظ' : 'حفظ'}
                          </Button>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            onClick={() => {/* TODO: مشاركة التنبيه */}}
                            variant="outline"
                            size="sm"
                            className="text-gray-400 hover:text-gray-200 border-gray-600 hover:border-gray-500 px-2 py-1.5"
                          >
                            <Share className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => {/* TODO: عرض التفاصيل */}}
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-2 py-1.5"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </main>
        <AppFooter />
      </div>
    </div>
  );
}
