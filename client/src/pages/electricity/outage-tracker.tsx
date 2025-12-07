import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle,
  XCircle,
  Zap,
  Activity,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  RefreshCw,
  Loader2,
  Bell,
  BellOff,
  BellRing
} from 'lucide-react';
// import { notificationService } from '@/services/notificationService';

// أنواع البيانات
interface DistrictData {
  id: string;
  name: string;
  status: 'on' | 'off' | 'unknown';
  lastUpdate: string;
  reports: number;
  population: number;
  area: string;
  substations: number;
  estimatedRestore?: string;
  notes?: string;
}

interface SubAreaReport {
  id: string;
  districtId: string;
  districtName: string;
  subAreaName: string; // اسم المنطقة الفرعية (مثل: بلوك 23، حي السلام)
  status: 'on' | 'off';
  timestamp: string;
  userId: string;
}

interface SubAreaReports {
  on: number;
  off: number;
  pendingOn: SubAreaReport[];
  pendingOff: SubAreaReport[];
  confirmedStatus?: 'on' | 'off';
  confirmedAt?: string;
  confirmedBy?: number;
  lastReport?: SubAreaReport;
}

// الاحتفاظ بالواجهة القديمة للتوافق مع البيانات الموجودة
interface UserReport {
  id: string;
  districtId: string;
  districtName: string;
  status: 'on' | 'off';
  timestamp: string;
  userId: string;
}

interface DistrictReports {
  on: number;
  off: number;
  lastReport?: UserReport;
  pendingOn: UserReport[];
  pendingOff: UserReport[];
  confirmedStatus?: 'on' | 'off';
  confirmedAt?: string;
  confirmedBy?: number;
}


// البيانات المحلية للأحياء
const districtsData: DistrictData[] = [
  {
    id: '1',
    name: 'كريتر',
    status: 'on',
    lastUpdate: '2024-12-19T10:30:00',
    reports: 12,
    population: 45000,
    area: 'المنطقة التاريخية',
    substations: 3,
    estimatedRestore: 'متاح حالياً',
    notes: 'الخدمة مستقرة'
  },
  {
    id: '2',
    name: 'المعلا',
    status: 'off',
    lastUpdate: '2024-12-19T09:15:00',
    reports: 8,
    population: 38000,
    area: 'المنطقة التجارية',
    substations: 2,
    estimatedRestore: 'خلال ساعتين',
    notes: 'انقطاع في بعض الشوارع'
  },
  {
    id: '3',
    name: 'التواهي',
    status: 'off',
    lastUpdate: '2024-12-19T08:45:00',
    reports: 15,
    population: 52000,
    area: 'المنطقة السكنية',
    substations: 4,
    estimatedRestore: 'خلال 4 ساعات',
    notes: 'انقطاع كامل - صيانة محطة فرعية'
  },
  {
    id: '4',
    name: 'المنصورة',
    status: 'on',
    lastUpdate: '2024-12-19T11:00:00',
    reports: 5,
    population: 28000,
    area: 'المنطقة السكنية الجديدة',
    substations: 2,
    estimatedRestore: 'متاح حالياً',
    notes: 'الخدمة طبيعية'
  },
  {
    id: '5',
    name: 'الشيخ عثمان',
    status: 'off',
    lastUpdate: '2024-12-19T10:00:00',
    reports: 7,
    population: 41000,
    area: 'المنطقة الصناعية',
    substations: 3,
    estimatedRestore: 'خلال 3 ساعات',
    notes: 'انقطاع في المنطقة الصناعية'
  },
  {
    id: '6',
    name: 'خور مكسر',
    status: 'off',
    lastUpdate: '2024-12-19T07:30:00',
    reports: 20,
    population: 35000,
    area: 'المنطقة الساحلية',
    substations: 2,
    estimatedRestore: 'خلال 6 ساعات',
    notes: 'انقطاع كامل - عطل في الخط الرئيسي'
  },
  {
    id: '7',
    name: 'دار سعد',
    status: 'unknown',
    lastUpdate: '2024-12-19T06:00:00',
    reports: 3,
    population: 22000,
    area: 'المنطقة النائية',
    substations: 1,
    estimatedRestore: 'غير محدد',
    notes: 'لا توجد معلومات حديثة'
  },
  {
    id: '8',
    name: 'البريقة',
    status: 'on',
    lastUpdate: '2024-12-19T11:15:00',
    reports: 4,
    population: 18000,
    area: 'المنطقة الزراعية',
    substations: 1,
    estimatedRestore: 'متاح حالياً',
    notes: 'الخدمة مستقرة'
  },
  {
    id: '9',
    name: 'صيرة',
    status: 'off',
    lastUpdate: '2024-12-19T09:45:00',
    reports: 6,
    population: 15000,
    area: 'الجزيرة',
    substations: 1,
    estimatedRestore: 'خلال ساعة',
    notes: 'انقطاع - صيانة دورية'
  },
  {
    id: '10',
    name: 'القلوعه',
    status: 'on',
    lastUpdate: '2024-12-19T11:30:00',
    reports: 3,
    population: 12000,
    area: 'المنطقة الساحلية الشمالية',
    substations: 1,
    estimatedRestore: 'متاح حالياً',
    notes: 'الخدمة مستقرة'
  },
  {
    id: '11',
    name: 'الممدارة',
    status: 'on',
    lastUpdate: '2024-12-19T11:45:00',
    reports: 2,
    population: 16000,
    area: 'المنطقة السكنية الشرقية',
    substations: 2,
    estimatedRestore: 'متاح حالياً',
    notes: 'الخدمة مستقرة'
  }
];

export default function OutageTracker() {
  const [, setLocation] = useLocation();
  const [districts, setDistricts] = useState<DistrictData[]>(districtsData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // نظام الإبلاغ التشاركي (النظام الجديد للمناطق الفرعية)
  const [subAreaReports, setSubAreaReports] = useState<SubAreaReport[]>([]);
  const [subAreasByDistrict, setSubAreasByDistrict] = useState<Map<string, Map<string, SubAreaReports>>>(new Map());
  
  // نظام الإبلاغ التشاركي (النظام القديم - للتوافق)
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [districtReports, setDistrictReports] = useState<Map<string, DistrictReports>>(new Map());
  const [userId, setUserId] = useState<string>('');
  const [lastReportTime, setLastReportTime] = useState<number>(0);
  
  // نافذة الإبلاغ
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportDialogData, setReportDialogData] = useState<{
    districtId: string;
    districtName: string;
    status: 'on' | 'off';
    subAreaName: string;
    currentSubAreaStatus: 'on' | 'off' | null;
  } | null>(null);
  const [subAreaInput, setSubAreaInput] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  
  // فلتر المديريات
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
  
  // Notification states
  const [subscribedDistricts, setSubscribedDistricts] = useState<Set<string>>(new Set());
  const [notificationAnimation, setNotificationAnimation] = useState<string | null>(null);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);
  
  // VAPID keys (you should generate these and store them securely)
  const VAPID_PUBLIC_KEY = 'BCYO-xDv2tUWs9n5P1t4yhXhwop6tw6AYg9sibtzGy8BNJ80vs1t1c1wkogOjkiccxQxiPZckdfIXs4n9do5oU0';
  
  // ثوابت النظام
  const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 دقائق بالميلي ثانية
  
  // نظام التأكيد الجماعي
  const THRESHOLD_REPORTS = 3; // عدد البلاغات المطلوبة للتأكيد
  const THRESHOLD_WINDOW = 5 * 60 * 1000; // نافذة زمنية 5 دقائق للبلاغات
  const MIN_REPORTS_FOR_SUGGESTIONS = 3; // الحد الأدنى لعدد البلاغات لظهور المنطقة في الاقتراحات
  const OUTAGE_RETENTION_MS = 24 * 60 * 60 * 1000; // الاحتفاظ ببيانات البلاغات 24 ساعة في Supabase
  
  // دوال إدارة البلاغات
  const generateUserId = (): string => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // تحميل هوية المستخدم وفترة التهدئة من المتصفح + جلب البلاغات من Supabase (نظام جماعي)
  const loadReportsFromStorage = () => {
    try {
      const savedUserId = localStorage.getItem('user_id');
      const savedLastReportTime = localStorage.getItem('last_report_time');

      if (savedUserId) {
        setUserId(savedUserId);
      } else {
        const newUserId = generateUserId();
        setUserId(newUserId);
        localStorage.setItem('user_id', newUserId);
      }

      if (savedLastReportTime) {
        setLastReportTime(parseInt(savedLastReportTime));
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات المستخدم:', error);
    }
  };

  // حفظ آخر وقت بلاغ فقط (البلاغات نفسها أصبحت في Supabase)
  const saveReportsToStorage = () => {
    try {
      localStorage.setItem('last_report_time', lastReportTime.toString());
    } catch (error) {
      console.error('خطأ في حفظ وقت آخر بلاغ:', error);
    }
  };

  // جلب البلاغات (مديريات + مناطق فرعية) من Supabase خلال آخر 24 ساعة
  const loadReportsFromSupabase = async () => {
    try {
      const cutoff = new Date(Date.now() - OUTAGE_RETENTION_MS).toISOString();
      const { data, error } = await supabase
        .from('outage_reports')
        .select('*')
        .gte('created_at', cutoff)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const districtReportsList: UserReport[] = [];
      const subAreaReportsList: SubAreaReport[] = [];

      (data || []).forEach((row: any) => {
        if (row.source === 'district') {
          districtReportsList.push({
            id: row.id,
            districtId: row.district_id,
            districtName: row.district_name,
            status: row.status,
            timestamp: row.created_at,
            userId: row.user_id || ''
          });
        } else if (row.source === 'sub_area') {
          subAreaReportsList.push({
            id: row.id,
            districtId: row.district_id,
            districtName: row.district_name,
            subAreaName: row.sub_area_name || '',
            status: row.status,
            timestamp: row.created_at,
            userId: row.user_id || ''
          });
        }
      });

      setUserReports(districtReportsList);
      setSubAreaReports(subAreaReportsList);
    } catch (error) {
      console.error('خطأ في جلب البلاغات من Supabase:', error);
    }
  };

  // Push notification functions
  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToPushNotifications = async (districtId: string, districtName: string): Promise<boolean> => {
    console.log('🚀 Starting subscription process for:', districtId, districtName);
    
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('❌ Push notifications are not supported');
      return false;
    }

    try {
      console.log('📱 Getting service worker registration...');
      const registration = await navigator.serviceWorker.ready;
      console.log('✅ Service worker ready:', registration.scope);
      
      let subscription = await registration.pushManager.getSubscription();
      console.log('📋 Existing subscription:', subscription ? 'Found' : 'None');

      if (!subscription) {
        console.log('🔔 Creating new push subscription...');
        const appServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource;
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: appServerKey
        });
        console.log('✅ New subscription created:', subscription.endpoint);
      }

      // حفظ الاشتراك في Supabase مع مفاتيح التشفير الحقيقية
      console.log('💾 Saving subscription to Supabase...');
      
      const p256dhKey = subscription.getKey('p256dh');
      const authKey = subscription.getKey('auth');
      
      let p256dhString = '';
      let authString = '';
      
      try {
        if (p256dhKey) {
          p256dhString = btoa(String.fromCharCode.apply(null, new Uint8Array(p256dhKey)));
        }
        if (authKey) {
          authString = btoa(String.fromCharCode.apply(null, new Uint8Array(authKey)));
        }
      } catch (keyError) {
        console.error('❌ Error converting keys:', keyError);
        return false;
      }
      
      const subscriptionData = {
        user_id: userId,
        district_id: districtId,
        district_name: districtName,
        endpoint: subscription.endpoint,
        p256dh: p256dhString,
        auth: authString
      };

      console.log('📦 Subscription data prepared');

      const { data, error } = await supabase
        .from('outage_notification_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id,district_id'
        })
        .select();

      if (error) {
        console.error('❌ Error saving push subscription:', error);
        return false;
      }

      console.log('✅ Subscription saved successfully to Supabase:', data);

      setPushSubscription(subscription);
      console.log(`🎉 Push subscription successful for ${districtName}`);
      return true;
    } catch (error) {
      console.error('❌ Error subscribing to push notifications:', error);
      return false;
    }
  };

  const unsubscribeFromPushNotifications = async (districtId: string): Promise<boolean> => {
    try {
      // Remove subscription from Supabase for this district
      const { error } = await supabase
        .from('outage_notification_subscriptions')
        .delete()
        .eq('user_id', userId)
        .eq('district_id', districtId);

      if (error) {
        console.error('Error removing push subscription:', error);
        return false;
      }

      console.log(`Unsubscribed from push notifications for district ${districtId}`);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  };

  const checkNotificationSupport = () => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsNotificationSupported(supported);
    return supported;
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  // لم نعد نستخدم localStorage للمناطق الفرعية، لكن نبقي الدالة لتوافق الاستدعاءات
  const loadSubAreaReportsFromStorage = () => {
    // البلاغات الفعلية تُجلب من Supabase في loadReportsFromSupabase
  };

  const saveSubAreaReportsToStorage = () => {
    // لم نعد نحفظ البلاغات الفرعية في localStorage
  };

  const canUserReport = (): boolean => {
    const now = Date.now();
    return (now - lastReportTime) >= COOLDOWN_PERIOD;
  };

  const calculateDistrictReports = (reports: UserReport[]): Map<string, DistrictReports> => {
    const reportsMap = new Map<string, DistrictReports>();
    const now = Date.now();
    
    reports.forEach(report => {
      if (!reportsMap.has(report.districtId)) {
        reportsMap.set(report.districtId, { 
          on: 0, 
          off: 0,
          pendingOn: [],
          pendingOff: []
        });
      }
      
      const districtReport = reportsMap.get(report.districtId)!;
      if (report.status === 'on') {
        districtReport.on++;
        // إضافة للبلاغات المعلقة إذا كانت في النافذة الزمنية
        const reportTime = new Date(report.timestamp).getTime();
        if (now - reportTime <= THRESHOLD_WINDOW) {
          districtReport.pendingOn.push(report);
        }
      } else {
        districtReport.off++;
        // إضافة للبلاغات المعلقة إذا كانت في النافذة الزمنية
        const reportTime = new Date(report.timestamp).getTime();
        if (now - reportTime <= THRESHOLD_WINDOW) {
          districtReport.pendingOff.push(report);
        }
      }
      
      // تحديث آخر بلاغ
      if (!districtReport.lastReport || new Date(report.timestamp) > new Date(districtReport.lastReport.timestamp)) {
        districtReport.lastReport = report;
      }
    });
    
    // تطبيق نظام التأكيد الجماعي
    reportsMap.forEach((districtReport, districtId) => {
      // فحص البلاغات المعلقة للكهرباء "عادت"
      if (districtReport.pendingOn.length >= THRESHOLD_REPORTS) {
        districtReport.confirmedStatus = 'on';
        districtReport.confirmedAt = districtReport.pendingOn[THRESHOLD_REPORTS - 1].timestamp;
        districtReport.confirmedBy = districtReport.pendingOn.length;
      }
      // فحص البلاغات المعلقة للكهرباء "انقطعت"
      else if (districtReport.pendingOff.length >= THRESHOLD_REPORTS) {
        districtReport.confirmedStatus = 'off';
        districtReport.confirmedAt = districtReport.pendingOff[THRESHOLD_REPORTS - 1].timestamp;
        districtReport.confirmedBy = districtReport.pendingOff.length;
      }
    });
    
    return reportsMap;
  };

  // دالة حساب التقارير للمناطق الفرعية
  const calculateSubAreaReports = (reports: SubAreaReport[]): Map<string, Map<string, SubAreaReports>> => {
    const districtMap = new Map<string, Map<string, SubAreaReports>>();
    const now = Date.now();
    
    reports.forEach(report => {
      if (!districtMap.has(report.districtId)) {
        districtMap.set(report.districtId, new Map());
      }
      
      const subAreaMap = districtMap.get(report.districtId)!;
      
      if (!subAreaMap.has(report.subAreaName)) {
        subAreaMap.set(report.subAreaName, {
          on: 0,
          off: 0,
          pendingOn: [],
          pendingOff: []
        });
      }
      
      const subAreaReport = subAreaMap.get(report.subAreaName)!;
      
      // إضافة للبلاغات حسب النوع
      if (report.status === 'on') {
        subAreaReport.on++;
        if (now - new Date(report.timestamp).getTime() <= THRESHOLD_WINDOW) {
          subAreaReport.pendingOn.push(report);
        }
      } else {
        subAreaReport.off++;
        if (now - new Date(report.timestamp).getTime() <= THRESHOLD_WINDOW) {
          subAreaReport.pendingOff.push(report);
        }
      }
      
      // تحديث آخر بلاغ
      if (!subAreaReport.lastReport || new Date(report.timestamp) > new Date(subAreaReport.lastReport.timestamp)) {
        subAreaReport.lastReport = report;
      }
    });
    
    // تطبيق نظام التأكيد الجماعي لكل منطقة فرعية
    districtMap.forEach((subAreaMap) => {
      subAreaMap.forEach((subAreaReport) => {
        if (subAreaReport.pendingOn.length >= THRESHOLD_REPORTS) {
          subAreaReport.confirmedStatus = 'on';
          subAreaReport.confirmedAt = subAreaReport.pendingOn[THRESHOLD_REPORTS - 1].timestamp;
          subAreaReport.confirmedBy = subAreaReport.pendingOn.length;
        } else if (subAreaReport.pendingOff.length >= THRESHOLD_REPORTS) {
          subAreaReport.confirmedStatus = 'off';
          subAreaReport.confirmedAt = subAreaReport.pendingOff[THRESHOLD_REPORTS - 1].timestamp;
          subAreaReport.confirmedBy = subAreaReport.pendingOff.length;
        }
      });
    });
    
    return districtMap;
  };

  // دالة لتحديد حالة المنطقة الفرعية الحالية
  const getSubAreaCurrentStatus = (districtId: string, subAreaName: string): 'on' | 'off' | null => {
    const subAreaMap = subAreasByDistrict.get(districtId);
    if (!subAreaMap) return null;
    
    const subAreaReport = subAreaMap.get(subAreaName);
    if (!subAreaReport) return null;
    
    // إذا كانت هناك حالة مؤكدة
    if (subAreaReport.confirmedStatus) {
      return subAreaReport.confirmedStatus;
    }
    
    // إذا كانت هناك بلاغات معلقة، نأخذ الأغلبية
    if (subAreaReport.pendingOn.length > subAreaReport.pendingOff.length) {
      return 'on';
    } else if (subAreaReport.pendingOff.length > subAreaReport.pendingOn.length) {
      return 'off';
    }
    
    // إذا كان آخر بلاغ موجود
    if (subAreaReport.lastReport) {
      return subAreaReport.lastReport.status;
    }
    
    return null; // منطقة جديدة
  };

  // دوال نافذة الإبلاغ
  const openReportDialog = (districtId: string, districtName: string) => {
    if (!canUserReport()) {
      const remainingTime = Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastReportTime)) / 60000);
      alert(`شكراً لمساهمتك! يمكنك الإبلاغ مرة أخرى بعد ${remainingTime} دقيقة.`);
      return;
    }
    setReportDialogData({ 
      districtId, 
      districtName, 
      status: 'on', // قيمة افتراضية
      subAreaName: '',
      currentSubAreaStatus: null
    });
    setReportDialogOpen(true);
    setSubAreaInput('');
    setFilteredSuggestions([]);
  };

  const handleSubAreaChange = (value: string) => {
    if (reportDialogData) {
      const currentStatus = getSubAreaCurrentStatus(reportDialogData.districtId, value);
      setReportDialogData({
        ...reportDialogData,
        subAreaName: value,
        currentSubAreaStatus: currentStatus
      });
    }
  };

  const updateSuggestions = (input: string, districtId: string) => {
    if (!input.trim()) {
      setFilteredSuggestions([]);
      return;
    }
    
    // جلب المناطق الفرعية للمديرية المحددة
    const subAreaMap = subAreasByDistrict.get(districtId);
    if (!subAreaMap) {
      setFilteredSuggestions([]);
      return;
    }
    
    // فلترة المناطق التي لديها عدد بلاغات كافٍ (3 أو أكثر)
    const suggestions = Array.from(subAreaMap.entries())
      .filter(([subAreaName, reports]) => {
        // عدد البلاغات الإجمالي
        const totalReports = reports.on + reports.off;
        // يجب أن يكون هناك 3 بلاغات على الأقل
        return totalReports >= MIN_REPORTS_FOR_SUGGESTIONS;
      })
      .map(([subAreaName]) => subAreaName)
      .filter(area => area.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);
    
    setFilteredSuggestions(suggestions);
  };

  const submitReport = (status: 'on' | 'off') => {
    const subArea = subAreaInput.trim();
    if (!subArea || !reportDialogData) return;
    
    const confirmed = window.confirm(
      `هل أنت متأكد أن الكهرباء ${status === 'on' ? 'عادت' : 'انقطعت'} في "${subArea}" - ${reportDialogData.districtName} الآن؟`
    );
    
    if (!confirmed) return;
    
    // إنشاء البلاغ
    const newReport: SubAreaReport = {
      id: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      districtId: reportDialogData.districtId,
      districtName: reportDialogData.districtName,
      subAreaName: subArea,
      status: status,
      timestamp: new Date().toISOString(),
      userId: userId
    };
    
    // حفظ وإغلاق
    const updatedReports = [...subAreaReports, newReport];
    setSubAreaReports(updatedReports);
    setLastReportTime(Date.now());
    saveReportsToStorage();

    // حفظ البلاغ في Supabase (للاستخدام التحليلي فقط)
    const saveToSupabase = async () => {
      try {
        await supabase.from('outage_reports').insert([
          {
            district_id: reportDialogData.districtId,
            district_name: reportDialogData.districtName,
            sub_area_name: subArea,
            status,
            user_id: userId,
            source: 'sub_area'
          }
        ]);

        // حذف البلاغات الأقدم من 24 ساعة
        await supabase
          .from('outage_reports')
          .delete()
          .lt('created_at', new Date(Date.now() - OUTAGE_RETENTION_MS).toISOString());
      } catch (error) {
        console.error('خطأ في حفظ بلاغ الكهرباء في Supabase:', error);
      }
    };

    // تنفيذ الحفظ في الخلفية بدون التأثير على تجربة المستخدم
    void saveToSupabase();

    setReportDialogOpen(false);
    alert('شكراً! تم تسجيل بلاغك بنجاح.');
  };

  const handleReport = (districtId: string, districtName: string, status: 'on' | 'off') => {
    if (!canUserReport()) {
      const remainingTime = Math.ceil((COOLDOWN_PERIOD - (Date.now() - lastReportTime)) / 60000);
      alert(`شكراً لمساهمتك! يمكنك الإبلاغ مرة أخرى بعد ${remainingTime} دقيقة.`);
      return;
    }

    const confirmed = window.confirm(
      `هل أنت متأكد أن الكهرباء ${status === 'on' ? 'عادت' : 'انقطعت'} في ${districtName} الآن؟`
    );

    if (!confirmed) return;

    const newReport: UserReport = {
      id: Date.now().toString(),
      districtId,
      districtName,
      status,
      timestamp: new Date().toISOString(),
      userId
    };

    const updatedReports = [...userReports, newReport];
    setUserReports(updatedReports);
    setLastReportTime(Date.now());
    saveReportsToStorage();
    
    // تحديث إحصائيات المناطق
    const updatedDistrictReports = calculateDistrictReports(updatedReports);
    setDistrictReports(updatedDistrictReports);

    // حفظ البلاغ في Supabase (للاستخدام التحليلي فقط)
    const saveToSupabase = async () => {
      try {
        await supabase.from('outage_reports').insert([
          {
            district_id: districtId,
            district_name: districtName,
            sub_area_name: null,
            status,
            user_id: userId,
            source: 'district'
          }
        ]);

        // حذف البلاغات الأقدم من 24 ساعة
        await supabase
          .from('outage_reports')
          .delete()
          .lt('created_at', new Date(Date.now() - OUTAGE_RETENTION_MS).toISOString());
      } catch (error) {
        console.error('خطأ في حفظ بلاغ الكهرباء في Supabase (مستوى المديرية):', error);
      }
    };

    // تنفيذ الحفظ في الخلفية بدون التأثير على التأكيد الجماعي
    void saveToSupabase();
    
    // Send push notification to subscribed users for this district
    void sendPushNotification(districtId, districtName, status);
    
    // حساب عدد البلاغات المطلوبة للتأكيد
    const currentPending = status === 'on' ? districtReports.get(districtId)?.pendingOn.length || 0 : districtReports.get(districtId)?.pendingOff.length || 0;
    const remainingReports = THRESHOLD_REPORTS - (currentPending + 1);
    
    if (remainingReports > 0) {
      alert(`شكراً لك! تم تسجيل بلاغك بنجاح.\n\n⏳ نحتاج ${remainingReports} بلاغ${remainingReports > 1 ? 'ات' : ''} إضافي${remainingReports > 1 ? 'ة' : ''} من مستخدمين آخرين لتأكيد هذه المعلومة.`);
    } else {
      alert('🎉 ممتاز! تم تأكيد هذه المعلومة جماعياً من قبل المستخدمين.\n\n✅ ستظهر هذه الحالة الآن لجميع المستخدمين.');
    }
  };

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    loadReportsFromStorage();
    loadSubAreaReportsFromStorage();
    void loadReportsFromSupabase();
    
    // تحميل الاشتراكات في الإشعارات
    // const subscriptions = notificationService.getAllSubscriptions();
    // setSubscribedDistricts(new Set(subscriptions.map(s => s.districtId)));
  }, []);

  // تحديث تقارير المناطق الفرعية عند تغيير البلاغات
  useEffect(() => {
    const newSubAreaReports = calculateSubAreaReports(subAreaReports);
    setSubAreasByDistrict(newSubAreaReports);
  }, [subAreaReports]);

  // تحديث إحصائيات البلاغات عند تغيير البلاغات
  useEffect(() => {
    const updatedDistrictReports = calculateDistrictReports(userReports);
    setDistrictReports(updatedDistrictReports);
  }, [userReports]);

  // مراقبة تغيير الحالات المؤكدة وإرسال الإشعارات
  useEffect(() => {
    // فحص التغييرات في الحالات المؤكدة للمناطق الفرعية
    subAreasByDistrict.forEach((subAreaMap, districtId) => {
      let hasConfirmedOn = false;
      let hasConfirmedOff = false;

      subAreaMap.forEach((reports) => {
        if (reports.confirmedStatus === 'on') hasConfirmedOn = true;
        if (reports.confirmedStatus === 'off') hasConfirmedOff = true;
      });

      // تحديد الحالة الغالبة للمديرية
      const district = districts.find(d => d.id === districtId);
      if (!district) return;

      const overallStatus = hasConfirmedOff ? 'off' : hasConfirmedOn ? 'on' : null;
      if (overallStatus) {
        // notificationService.checkAndNotify(districtId, overallStatus, district.name);
      }
    });
  }, [subAreasByDistrict, districts]);

  // اشتراك Realtime من Supabase لتحديث البلاغات لحظياً
  useEffect(() => {
    const channel = supabase
      .channel('outage_reports_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'outage_reports' },
        () => {
          void loadReportsFromSupabase();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  // Check notification support and load existing subscriptions
  useEffect(() => {
    const initializeNotifications = async () => {
      const supported = checkNotificationSupport();
      if (supported) {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            setPushSubscription(subscription);
          }

          // Load user's existing district subscriptions
          if (userId) {
            const { data: userSubscriptions } = await supabase
              .from('outage_notification_subscriptions')
              .select('district_id')
              .eq('user_id', userId);

            if (userSubscriptions) {
              const subscribedDistrictIds = new Set(userSubscriptions.map(sub => sub.district_id));
              setSubscribedDistricts(subscribedDistrictIds);
            }
          }
        } catch (error) {
          console.error('Error loading existing push subscriptions:', error);
        }
      }
    };

    initializeNotifications();
  }, [userId]);

  // تحديث البيانات كل 30 ثانية
  useEffect(() => {
    const interval = setInterval(() => {
      updateDistrictsData();
      // تحديث وقت آخر تحديث تلقائي
      setLastRefreshTime(new Date());
      void loadReportsFromSupabase();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // تحديث البيانات المحلية
  const updateDistrictsData = () => {
    setDistricts(prevDistricts => 
      prevDistricts.map(district => {
        // محاكاة تغييرات عشوائية في الحالة
        const randomChange = Math.random();
        if (randomChange < 0.1) { // 10% احتمال للتغيير
          const statuses: ('on' | 'off' | 'unknown')[] = ['on', 'off', 'unknown'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return {
            ...district,
            status: newStatus,
                lastUpdate: new Date().toISOString(),
            reports: district.reports + Math.floor(Math.random() * 3)
          };
        }
        return district;
      })
    );
  };

  const handleRefresh = async () => {
    if (isRefreshing) return; // منع التحديث المتعدد
    
    setIsRefreshing(true);
    
    try {
      // محاكاة طلب API (سيتم استبدالها بقاعدة البيانات لاحقاً)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تحديث البيانات المحلية (محاكاة)
      updateDistrictsData();
      
      // إعادة تحميل البلاغات من التخزين المحلي
      loadReportsFromStorage();
      loadSubAreaReportsFromStorage();
      
      // تحديث وقت آخر تحديث
      setLastRefreshTime(new Date());
      
      // رسالة نجاح بصوتية (اختيارية)
      console.log('تم تحديث البيانات بنجاح');
      
      // إظهار رسالة نجاح مؤقتة
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
      successMessage.textContent = '✅ تم تحديث البيانات بنجاح';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
      
    } catch (error) {
      console.error('خطأ في تحديث البيانات:', error);
      
      // إظهار رسالة خطأ
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
      errorMessage.textContent = '❌ خطأ في تحديث البيانات';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
      
    } finally {
      setIsRefreshing(false);
    }
  };

  // دالة التعامل مع الإشعارات
  const sendPushNotification = async (districtId: string, districtName: string, status: 'on' | 'off') => {
    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          districtId,
          districtName,
          status,
          title: status === 'off' 
            ? `⚡ انقطاع الكهرباء في ${districtName}` 
            : `✅ عودة الكهرباء في ${districtName}`,
          body: status === 'off'
            ? `تم الإبلاغ عن انقطاع الكهرباء في ${districtName}. سنقوم بإشعارك عند عودتها.`
            : `تم الإبلاغ عن عودة الكهرباء في ${districtName}.`
        })
      });

      if (!response.ok) {
        console.error('Failed to send push notification:', await response.text());
      } else {
        console.log('Push notification sent successfully');
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  };

  const handleNotificationToggle = async (districtId: string, districtName: string, currentStatus: 'on' | 'off') => {
    console.log('🔔 handleNotificationToggle called:', { districtId, districtName, currentStatus });
    
    const isCurrentlySubscribed = subscribedDistricts.has(districtId);
    console.log('Current subscription status:', isCurrentlySubscribed);

    if (isCurrentlySubscribed) {
      console.log('Unsubscribing from notifications for district:', districtId);
      const success = await unsubscribeFromPushNotifications(districtId);
      if (success) {
        setSubscribedDistricts(prev => {
          const newSet = new Set(prev);
          newSet.delete(districtId);
          return newSet;
        });
        alert(`تم إلغاء الاشتراك في إشعارات ${districtName}`);
      } else {
        console.error('Failed to unsubscribe from notifications');
      }
    } else {
      console.log('Subscribing to notifications for district:', districtId);
      
      // نعود إلى النسخة البسيطة التي كانت تعمل
      try {
        console.log('🧪 Testing simple subscription save...');
        
        const subscriptionData = {
          user_id: userId + '_simple',
          district_id: districtId,
          district_name: districtName,
          endpoint: 'simple_endpoint',
          p256dh: 'simple_p256dh',
          auth: 'simple_auth'
        };
        
        const { data, error } = await supabase
          .from('outage_notification_subscriptions')
          .insert(subscriptionData)
          .select();
        
        if (error) {
          console.error('❌ Simple subscription failed:', error);
          alert('فشل في حفظ الاشتراك: ' + error.message);
          return;
        }
        
        console.log('✅ Simple subscription saved:', data);
        
        // تحديث الحالة مباشرة
        setSubscribedDistricts(prev => {
          const newSet = new Set(prev);
          newSet.add(districtId);
          console.log('Added district to subscriptions:', districtId);
          return newSet;
        });
        
        // تأثير الرنين
        setNotificationAnimation(districtId);
        setTimeout(() => setNotificationAnimation(null), 600);

        alert(`تم الاشتراك في إشعارات ${districtName} بنجاح!`);
        
      } catch (simpleError) {
        console.error('❌ Simple subscription error:', simpleError);
        alert('خطأ في الاشتراك: ' + simpleError.message);
        return;
      }
    }
  };


  // عرض جميع المناطق بدون فلترة
  const filteredDistricts = districts;


  const getStatusInfo = (status: string, districtReport?: DistrictReports) => {
    // إذا كانت هناك حالة مؤكدة جماعياً، استخدمها
    if (districtReport?.confirmedStatus) {
      switch (districtReport.confirmedStatus) {
        case 'on':
          return {
            text: `متاح ✅ (${districtReport.confirmedBy} مستخدم)`,
            color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
            icon: CheckCircle,
            bgColor: 'bg-green-50 dark:bg-green-900/20'
          };
        case 'off':
          return {
            text: `منقطع ❌ (${districtReport.confirmedBy} مستخدم)`,
            color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
            icon: XCircle,
            bgColor: 'bg-red-50 dark:bg-red-900/20'
          };
      }
    }
    
    // الحالة الافتراضية
    switch (status) {
      case 'on':
        return {
          text: 'متاح',
          color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
          icon: CheckCircle,
          bgColor: 'bg-green-50 dark:bg-green-900/20'
        };
      case 'off':
        return {
          text: 'منقطع',
          color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
          icon: XCircle,
          bgColor: 'bg-red-50 dark:bg-red-900/20'
        };
      default:
        return {
          text: 'غير معروف',
          color: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30',
          icon: Activity,
          bgColor: 'bg-gray-50 dark:bg-gray-900/20'
        };
    }
  };

  // دالة فلترة المديريات
  const getFilteredDistricts = () => {
    if (districtFilter === 'all') {
      return districts;
    }
    return districts.filter(district => district.name === districtFilter);
  };


  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    
    // استخدام التاريخ الإنجليزي بالتنسيق المطلوب: YYYY/MM/DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const formatReportTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `منذ ${days} يوم`;
    
    // استخدام التاريخ الإنجليزي بالتنسيق المطلوب: YYYY/MM/DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 page-transition">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md safe-area-bottom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/electricity")}
              className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              الرجوع
            </Button>
            </div>

          </div>
          
        {/* معلومات توضيحية */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 rounded-2xl p-6 mb-6 shadow-2xl border border-blue-500/20">
          {/* خلفية ديكورية */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/20 to-blue-500/20 rounded-full blur-xl"></div>
          
          {/* أيقونات ديكورية */}
          <div className="absolute top-3 right-3 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
            <Zap className="w-4 h-4 text-yellow-300" />
          </div>
          <div className="absolute bottom-3 left-3 w-5 h-5 bg-white/10 rounded-full flex items-center justify-center">
            <Users className="w-3 h-3 text-green-300" />
        </div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3 backdrop-blur-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              تتبع انقطاعات الكهرباء
            </h2>
            <p className="text-lg text-blue-100 mb-4 font-medium">
              معلومات مباشرة من المواطنين
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center ml-2">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  نظام الإبلاغ التشاركي
                </h3>
              </div>
              <p className="text-blue-100 font-medium">
                شارك معلوماتك لمساعدة الآخرين
              </p>
              
              {/* مؤشر مباشر */}
              <div className="flex items-center justify-center mt-3 space-x-2 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-green-200 text-xs font-semibold">مباشر</span>
              </div>
            </div>
          </div>
        </div>

        {/* شريط التحكم - التحديث والفلتر */}
        <div className="mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">فلتر المديريات</label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">نشط</span>
              </div>
              </div>
              
              {/* زر التحديث */}
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[40px] touch-manipulation"
                size="sm"
              >
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  )}
                  <span className="text-xs font-medium hidden sm:inline">
                    {isRefreshing ? 'جاري التحديث...' : 'تحديث'}
                  </span>
                  <span className="text-xs font-medium sm:hidden">
                    {isRefreshing ? '...' : '🔄'}
                  </span>
                </div>
              </Button>
            </div>
            
            <div className="relative">
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-medium min-h-[48px] touch-manipulation cursor-pointer"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              >
                <option value="all" className="py-2">🏛️ جميع المديريات ({districts.length})</option>
                {districts.map(district => (
                  <option key={district.id} value={district.name} className="py-2 text-base">
                    {district.status === 'on' ? '🟢' : district.status === 'off' ? '🔴' : '⚪'} {district.name}
                  </option>
                ))}
              </select>
              
              {/* أيقونة dropdown مخصصة */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                  </div>
                  </div>

            {/* إحصائيات الفلترة وآخر تحديث */}
            <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-gray-500 dark:text-gray-400">المعروضة:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{getFilteredDistricts().length}</span>
                  <span className="text-gray-400">من</span>
                  <span className="font-semibold text-gray-600 dark:text-gray-300">{districts.length}</span>
                  </div>
                </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>آخر تحديث: {lastRefreshTime.toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}</span>
              </div>
            </div>
                  </div>
                  </div>

        {/* Districts List */}
        <div className="space-y-4">
          {getFilteredDistricts().map((district) => {
            const districtReport = districtReports.get(district.id);
            const statusInfo = getStatusInfo(district.status, districtReport);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={district.id} className={`${statusInfo.bgColor} border-l-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`} 
                    style={{ borderLeftColor: district.status === 'on' ? '#10b981' : district.status === 'off' ? '#ef4444' : (district.status as any) === 'partial' ? '#f59e0b' : '#6b7280' }}>
                <CardContent className="p-4">
                  {/* Header - اسم المديرية في المنتصف */}
                  <div className="text-center mb-3">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-2 shadow-lg ${
                      district.name === 'المنصورة' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      district.name === 'الشيخ عثمان' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                      district.name === 'التواهي' ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                      district.name === 'القلوعه' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                      district.name === 'الممدارة' ? 'bg-gradient-to-br from-indigo-500 to-indigo-600' :
                      'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      {district.name === 'المنصورة' ? <MapPin className="w-6 h-6 text-white" /> :
                       district.name === 'الشيخ عثمان' ? <MapPin className="w-6 h-6 text-white" /> :
                       district.name === 'التواهي' ? <MapPin className="w-6 h-6 text-white" /> :
                       district.name === 'القلوعه' ? <MapPin className="w-6 h-6 text-white" /> :
                       district.name === 'الممدارة' ? <MapPin className="w-6 h-6 text-white" /> :
                       <MapPin className="w-6 h-6 text-white" />}
                  </div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-2xl leading-tight">{district.name}</h3>
                </div>

                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">

                        {/* زر الإشعارات */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('🔔 Button clicked directly!');
                            
                            let currentStatus: 'on' | 'off' = 'off';
                            
                            // التحقق من حالة المناطق الفرعية أولاً
                            const subAreaMap = subAreasByDistrict.get(district.id);
                            
                            if (subAreaMap && subAreaMap.size > 0) {
                              let hasConfirmedOn = false;
                              let hasConfirmedOff = false;
                              
                              subAreaMap.forEach((reports) => {
                                if (reports.confirmedStatus === 'on') hasConfirmedOn = true;
                                if (reports.confirmedStatus === 'off') hasConfirmedOff = true;
                              });
                              
                              currentStatus = hasConfirmedOff ? 'off' : hasConfirmedOn ? 'on' : 'off';
                            } else {
                              currentStatus = district.status === 'on' ? 'on' : 'off';
                            }
                            
                            console.log('Calling handleNotificationToggle with:', district.id, district.name, currentStatus);
                            handleNotificationToggle(district.id, district.name, currentStatus);
                          }}
                          className={`relative p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                            subscribedDistricts.has(district.id)
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          } ${notificationAnimation === district.id ? 'animate-bounce' : ''}`}
                          title={subscribedDistricts.has(district.id) ? 'إلغاء الاشتراك في الإشعارات' : 'الاشتراك في الإشعارات'}
                        >
                          {subscribedDistricts.has(district.id) ? (
                            <BellRing className="w-5 h-5" />
                          ) : (
                            <Bell className="w-5 h-5" />
                          )}
                          
                          {/* مؤشر الاشتراك النشط */}
                          {subscribedDistricts.has(district.id) && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                          )}
                        </button>
                      </div>

                      {/* معلومات البلاغات فقط */}
                      <div className="text-center mb-2">
                          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2 inline-block">
                          <MessageSquare className="w-5 h-5 text-green-600 mx-auto mb-1" />
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{districtReport ? districtReport.on + districtReport.off : 0}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">إجمالي البلاغات</div>
              </div>
                      </div>
                </div>

                    <div className="text-left">
                      <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium shadow-md ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4 ml-2" />
                        {statusInfo.text}
                      </div>

                      {/* عرض حالة التأكيد الجماعي */}
                      {districtReport?.confirmedStatus && (
                      <div className="mt-1">
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-1.5 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center">
                              <div className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center ml-2">
                                <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                              <div className="text-xs">
                                <div className="font-semibold text-blue-800 dark:text-blue-200">
                                  ✅ تم التأكيد جماعياً
                </div>
                                <div className="text-blue-600 dark:text-blue-300">
                                  {districtReport.confirmedBy} مستخدم أكدوا • {formatReportTime(districtReport.confirmedAt!)}
                                </div>
                              </div>
                            </div>
                          </div>
                  </div>
                )}
                      
                      {/* عرض البلاغات المعلقة */}
                      {districtReport && (districtReport.pendingOn.length > 0 || districtReport.pendingOff.length > 0) && !districtReport.confirmedStatus && (
                        <div className="mt-1">
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-1.5 border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center">
                              <div className="w-5 h-5 bg-yellow-500 rounded-lg flex items-center justify-center ml-2">
                                <Clock className="w-3 h-3 text-white" />
              </div>
                              <div className="text-xs">
                                <div className="font-semibold text-yellow-800 dark:text-yellow-200">
                                  ⏳ في انتظار التأكيد
                                </div>
                                <div className="text-yellow-600 dark:text-yellow-300">
                                  {districtReport.pendingOn.length > 0 && `${districtReport.pendingOn.length}/${THRESHOLD_REPORTS} بلاغ "عادت"`}
                                  {districtReport.pendingOn.length > 0 && districtReport.pendingOff.length > 0 && ' • '}
                                  {districtReport.pendingOff.length > 0 && `${districtReport.pendingOff.length}/${THRESHOLD_REPORTS} بلاغ "انقطعت"`}
                                </div>
                              </div>
                            </div>
                          </div>
                  </div>
                )}
              </div>
                  </div>

                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-500 rounded-lg flex items-center justify-center ml-2">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                  <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">آخر تحديث</div>
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatTime(district.lastUpdate)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400">التقدير الزمني</div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{district.estimatedRestore}</div>
                      </div>
                  </div>
                </div>


                  {/* قسم الإبلاغ التشاركي */}
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center ml-2">
                          <MessageSquare className="w-3 h-3 text-white" />
                      </div>
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">الإبلاغ التشاركي</h4>
                  </div>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        {districtReport && (
                          <>
                            <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                              <ThumbsUp className="w-3 h-3 text-green-600 dark:text-green-400 ml-1" />
                              <span className="text-xs font-semibold text-green-700 dark:text-green-300">{districtReport.on}</span>
              </div>
                            <div className="flex items-center bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg">
                              <ThumbsDown className="w-3 h-3 text-red-600 dark:text-red-400 ml-1" />
                              <span className="text-xs font-semibold text-red-700 dark:text-red-300">{districtReport.off}</span>
                            </div>
                          </>
                        )}
                  </div>
                </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
              <Button
                        onClick={() => openReportDialog(district.id, district.name)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={!canUserReport()}
                      >
                        <div className="flex items-center justify-center">
                          <ThumbsUp className="w-4 h-4 ml-2" />
                          <span>🟢 عادت الآن</span>
                        </div>
              </Button>
                      <Button
                        onClick={() => openReportDialog(district.id, district.name)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={!canUserReport()}
                      >
                        <div className="flex items-center justify-center">
                          <ThumbsDown className="w-4 h-4 ml-2" />
                          <span>🔴 انقطعت الآن</span>
            </div>
                      </Button>
                    </div>
                    
                    {districtReport?.lastReport && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center ml-2">
                            <AlertCircle className="w-3 h-3 text-white" />
                      </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                              آخر تحديث من المستخدمين
                  </div>
                            <div className="text-xs text-blue-600 dark:text-blue-300">
                              {districtReport.lastReport.status === 'on' ? 'عادت الكهرباء' : 'انقطعت الكهرباء'} {formatReportTime(districtReport.lastReport.timestamp)}
              </div>
                          </div>
                      </div>
                      </div>
                    )}

                    {/* عرض المناطق الفرعية المبلغ عنها */}
                    {subAreasByDistrict.get(district.id) && subAreasByDistrict.get(district.id)!.size > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">المناطق المبلغ عنها:</h4>
                        
                        {/* قسم المناطق المتاحة */}
                        <div className="mb-2">
                          <div className="flex items-center mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                            <h5 className="text-sm font-semibold text-green-700 dark:text-green-400">مناطق متاحة</h5>
            </div>
                          <div className="space-y-2">
                            {Array.from(subAreasByDistrict.get(district.id)!.entries())
                              .filter(([_, reports]) => reports.confirmedStatus === 'on')
                              .map(([subAreaName, reports]) => (
                                <div key={subAreaName} className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                                    <span className="font-medium text-green-800 dark:text-green-200">{subAreaName}</span>
                                    <span className="text-xs text-green-600 dark:text-green-400">
                                      ✅ {reports.confirmedBy} مستخدم
              </span>
                        </div>
                                  {reports.lastReport && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {formatReportTime(reports.lastReport.timestamp)}
                      </div>
                                  )}
                        </div>
                              ))
                            }
                        </div>
                      </div>
                        
                        {/* قسم المناطق المنقطعة */}
                        <div>
                          <div className="flex items-center mb-2">
                            <XCircle className="w-4 h-4 text-red-600 ml-2" />
                            <h5 className="text-sm font-semibold text-red-700 dark:text-red-400">مناطق منقطعة</h5>
                        </div>
                          <div className="space-y-2">
                            {Array.from(subAreasByDistrict.get(district.id)!.entries())
                              .filter(([_, reports]) => reports.confirmedStatus === 'off')
                              .map(([subAreaName, reports]) => (
                                <div key={subAreaName} className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-red-800 dark:text-red-200">{subAreaName}</span>
                                    <span className="text-xs text-red-600 dark:text-red-400">
                                      ❌ {reports.confirmedBy} مستخدم
                                    </span>
                                  </div>
                                  {reports.lastReport && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {formatReportTime(reports.lastReport.timestamp)}
                          </div>
                        )}
                                </div>
                              ))
                            }
                      </div>
                    </div>

                        {/* المناطق قيد التأكيد */}
                        {Array.from(subAreasByDistrict.get(district.id)!.entries())
                          .filter(([_, reports]) => !reports.confirmedStatus && (reports.pendingOn.length > 0 || reports.pendingOff.length > 0))
                          .length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-xs text-gray-500 dark:text-gray-400 mb-2">⏳ في انتظار التأكيد:</h5>
                              <div className="space-y-2">
                                {Array.from(subAreasByDistrict.get(district.id)!.entries())
                                  .filter(([_, reports]) => !reports.confirmedStatus && (reports.pendingOn.length > 0 || reports.pendingOff.length > 0))
                                  .map(([subAreaName, reports]) => (
                                    <div key={subAreaName} className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{subAreaName}</span>
                                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                                          {reports.pendingOn.length > 0 && `${reports.pendingOn.length}/${THRESHOLD_REPORTS} بلاغ "عادت"`}
                                          {reports.pendingOn.length > 0 && reports.pendingOff.length > 0 && ' • '}
                                          {reports.pendingOff.length > 0 && `${reports.pendingOff.length}/${THRESHOLD_REPORTS} بلاغ "انقطعت"`}
                      </div>
                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-6 mb-2">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-3 border border-gray-200 dark:border-gray-600">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center ml-2">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">معلومات مهمة</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                هذه المعلومات مبنية على تقارير المواطنين وتحديثات رسمية. 
                <br />
                <strong>نظام التأكيد الجماعي:</strong> نحتاج {THRESHOLD_REPORTS} بلاغات متطابقة في {THRESHOLD_WINDOW / 60000} دقائق لتأكيد أي معلومة.
                <br />
                يمكنك الإبلاغ عن حالة الكهرباء في منطقتك لمساعدة الآخرين.
              </p>
            </div>
          </div>
        </div>

      </main>
      
      {/* نافذة الإبلاغ */}
      {reportDialogOpen && reportDialogData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              حدد المنطقة بالتحديد في {reportDialogData.districtName}
            </h3>
            
            <div className="relative">
              <input
                type="text"
                value={subAreaInput}
                onChange={(e) => {
                  setSubAreaInput(e.target.value);
                  updateSuggestions(e.target.value, reportDialogData.districtId);
                  handleSubAreaChange(e.target.value);
                }}
                placeholder="مثال: بلوك 23، حي السلام، منطقة الجامعة..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* الاقتراحات التلقائية */}
              {filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl mt-2 shadow-lg z-10">
                  {filteredSuggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSubAreaInput(suggestion);
                        setFilteredSuggestions([]);
                        handleSubAreaChange(suggestion);
                      }}
                      className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                    >
                      {suggestion}
                    </button>
              ))}
            </div>
          )}
        </div>

            <div className="flex gap-3 mt-6">
              {reportDialogData && (
                <>
                  {(reportDialogData.currentSubAreaStatus === null || reportDialogData.currentSubAreaStatus === 'off') && (
                    <Button 
                      onClick={() => submitReport('on')} 
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                      disabled={!subAreaInput.trim()}
                    >
                      🟢 عادت الآن
                    </Button>
                  )}
                  {(reportDialogData.currentSubAreaStatus === null || reportDialogData.currentSubAreaStatus === 'on') && (
                    <Button 
                      onClick={() => submitReport('off')} 
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                      disabled={!subAreaInput.trim()}
                    >
                      🔴 انقطعت الآن
                    </Button>
                  )}
                </>
              )}
              <Button 
                onClick={() => setReportDialogOpen(false)} 
                variant="outline"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
              >
                إلغاء
              </Button>
        </div>
          </div>
        </div>
      )}
      
      <AppFooter />
    </div>
  );
}