<!-- c829b25c-f217-42c8-b84a-364a26f7f117 4a2e80d5-c669-49d4-a5bd-d111ee42ff55 -->
# نظام الإشعارات لتتبع انقطاعات الكهرباء

## المتطلبات

- Web Push Notifications عبر Service Worker (تعمل حتى عند إغلاق المتصفح)
- إشعارات فقط عند تغيير الحالة المؤكدة للمديرية
- أيقونة جرس في كل بطاقة مديرية للاشتراك/إلغاء الاشتراك
- التخزين في localStorage حالياً، جاهز للربط بقاعدة البيانات لاحقاً

## الملفات المطلوب إنشاؤها/تعديلها

### 1. إنشاء Service Worker

**الملف الجديد:** `client/public/sw.js`

```javascript
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  return self.clients.claim();
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.districtId
    },
    actions: [
      {
        action: 'view',
        title: 'عرض التفاصيل',
        icon: '/icon-view.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/electricity/outage-tracker')
  );
});
```

### 2. تسجيل Service Worker

**الملف:** `client/src/main.tsx`

إضافة قبل `createRoot`:

```typescript
// Register Service Worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}
```

### 3. إنشاء خدمة الإشعارات

**الملف الجديد:** `client/src/services/notificationService.ts`

```typescript
interface NotificationSubscription {
  districtId: string;
  districtName: string;
  lastKnownStatus?: 'on' | 'off';
  subscribedAt: string;
}

class NotificationService {
  private subscriptions: NotificationSubscription[] = [];
  private readonly STORAGE_KEY = 'electricity_notifications_subscriptions';

  constructor() {
    this.loadSubscriptions();
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  async subscribe(districtId: string, districtName: string, currentStatus: 'on' | 'off'): Promise<boolean> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) {
      alert('يرجى السماح بالإشعارات لتلقي التحديثات');
      return false;
    }

    // التحقق من عدم وجود اشتراك سابق
    if (this.isSubscribed(districtId)) {
      return true;
    }

    const subscription: NotificationSubscription = {
      districtId,
      districtName,
      lastKnownStatus: currentStatus,
      subscribedAt: new Date().toISOString()
    };

    this.subscriptions.push(subscription);
    this.saveSubscriptions();

    // إظهار إشعار ترحيبي
    this.showLocalNotification(
      'تم الاشتراك بنجاح',
      `سيتم إعلامك بأي تحديثات في ${districtName}`
    );

    return true;
  }

  unsubscribe(districtId: string): void {
    const subscription = this.subscriptions.find(s => s.districtId === districtId);
    this.subscriptions = this.subscriptions.filter(s => s.districtId !== districtId);
    this.saveSubscriptions();

    if (subscription) {
      this.showLocalNotification(
        'تم إلغاء الاشتراك',
        `لن تتلقى إشعارات من ${subscription.districtName}`
      );
    }
  }

  isSubscribed(districtId: string): boolean {
    return this.subscriptions.some(s => s.districtId === districtId);
  }

  getSubscription(districtId: string): NotificationSubscription | undefined {
    return this.subscriptions.find(s => s.districtId === districtId);
  }

  getAllSubscriptions(): NotificationSubscription[] {
    return [...this.subscriptions];
  }

  checkAndNotify(districtId: string, newStatus: 'on' | 'off', districtName: string): void {
    const subscription = this.getSubscription(districtId);
    if (!subscription) return;

    // فقط عند تغيير الحالة
    if (subscription.lastKnownStatus !== newStatus) {
      const statusText = newStatus === 'on' ? 'عادت الكهرباء ⚡' : 'انقطعت الكهرباء 🔌';
      
      this.showLocalNotification(
        `${statusText} في ${districtName}`,
        `تم التأكيد من قبل المستخدمين`
      );

      // تحديث الحالة المحفوظة
      subscription.lastKnownStatus = newStatus;
      this.saveSubscriptions();
    }
  }

  private showLocalNotification(title: string, body: string): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        tag: 'electricity-update'
      });
    }
  }

  private loadSubscriptions(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.subscriptions = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      this.subscriptions = [];
    }
  }

  private saveSubscriptions(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error('Error saving subscriptions:', error);
    }
  }
}

export const notificationService = new NotificationService();
```

### 4. تحديث صفحة تتبع الانقطاعات

**الملف:** `client/src/pages/electricity/outage-tracker.tsx`

#### أ. إضافة import

```typescript
import { Bell, BellOff, BellRing } from 'lucide-react';
import { notificationService } from '@/services/notificationService';
```

#### ب. إضافة state

```typescript
const [subscribedDistricts, setSubscribedDistricts] = useState<Set<string>>(new Set());
const [notificationAnimation, setNotificationAnimation] = useState<string | null>(null);
```

#### ج. تحميل الاشتراكات عند التحميل

```typescript
useEffect(() => {
  const subscriptions = notificationService.getAllSubscriptions();
  setSubscribedDistricts(new Set(subscriptions.map(s => s.districtId)));
}, []);
```

#### د. مراقبة تغيير الحالات المؤكدة

```typescript
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
      notificationService.checkAndNotify(districtId, overallStatus, district.name);
    }
  });
}, [subAreasByDistrict, districts]);
```

#### هـ. دوال الاشتراك

```typescript
const handleNotificationToggle = async (districtId: string, districtName: string, currentStatus: 'on' | 'off') => {
  const isCurrentlySubscribed = subscribedDistricts.has(districtId);

  if (isCurrentlySubscribed) {
    notificationService.unsubscribe(districtId);
    setSubscribedDistricts(prev => {
      const newSet = new Set(prev);
      newSet.delete(districtId);
      return newSet;
    });
  } else {
    const success = await notificationService.subscribe(districtId, districtName, currentStatus);
    if (success) {
      setSubscribedDistricts(prev => new Set([...prev, districtId]));
      
      // تأثير الرنين
      setNotificationAnimation(districtId);
      setTimeout(() => setNotificationAnimation(null), 600);
    }
  }
};
```

#### و. إضافة زر الجرس في بطاقة المديرية

داخل بطاقة كل مديرية، في header البطاقة بجانب اسم المديرية:

```typescript
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center space-x-3 rtl:space-x-reverse">
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
      <Zap className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        {district.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">{district.area}</p>
    </div>
  </div>

  {/* زر الإشعارات */}
  <button
    onClick={() => handleNotificationToggle(
      district.id, 
      district.name, 
      /* determine current status from subAreasByDistrict */
    )}
    className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
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
```

### 5. إضافة أنيميشن CSS

**الملف:** `client/src/index.css`

إضافة في نهاية الملف:

```css
@keyframes bell-ring {
  0% { transform: rotate(0); }
  15% { transform: rotate(15deg); }
  30% { transform: rotate(-15deg); }
  45% { transform: rotate(10deg); }
  60% { transform: rotate(-10deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0); }
}

.animate-bell-ring {
  animation: bell-ring 0.6s ease-in-out;
}
```

### 6. تحديث vite.config.ts

**الملف:** `client/vite.config.ts`

التأكد من نسخ Service Worker:

```typescript
export default defineConfig({
  // ... existing config
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        sw: './public/sw.js'
      }
    }
  }
})
```

## الإعداد للربط بقاعدة البيانات لاحقاً

### هيكل البيانات المقترح

```typescript
// في server/routes/notifications.ts (مستقبلاً)
interface NotificationSubscriptionDB {
  id: string;
  userId: string; // من نظام المصادقة
  districtId: string;
  districtName: string;
  pushEndpoint?: string; // للـ Web Push API
  pushAuth?: string;
  pushP256dh?: string;
  lastKnownStatus: 'on' | 'off';
  subscribedAt: Date;
  isActive: boolean;
}
```

### نقاط التكامل المستقبلية

1. **عند الاشتراك:**

   - حفظ في localStorage (الآن)
   - إرسال POST request لـ `/api/notifications/subscribe` (لاحقاً)

2. **عند إلغاء الاشتراك:**

   - حذف من localStorage (الآن)
   - إرسال DELETE request لـ `/api/notifications/unsubscribe` (لاحقاً)

3. **عند تغيير الحالة:**

   - التحقق من localStorage (الآن)
   - Server يرسل Push Notifications لجميع المشتركين (لاحقاً)

## النتيجة النهائية

- أيقونة جرس واضحة في كل بطاقة مديرية
- عند الضغط: طلب إذن الإشعارات (أول مرة فقط)
- تغيير لون الجرس للأزرق عند الاشتراك
- تأثير bounce/ring عند الاشتراك
- إشعارات تظهر فقط عند تغيير الحالة المؤكدة
- الإشعارات تعمل حتى عند إغلاق المتصفح
- البيانات محفوظة في localStorage
- الكود جاهز للربط بـ API لاحقاً

### To-dos

- [ ] إنشاء خدمة البحث الموحدة searchService.ts
- [ ] تحديث hook البحث useSearch.ts
- [ ] تحسين مكون GlobalSearch.tsx مع الاقتراحات الديناميكية
- [ ] تحسين عرض النتائج في SearchResults.tsx