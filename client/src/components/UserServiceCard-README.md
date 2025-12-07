# بطاقات المعلومات والخدمات - UserServiceCard

## نظرة عامة

مكون React حديث ومتجاوب لإنشاء بطاقات معلومات المستخدمين والخدمات في شريط جانبي لوحة التحكم. مصمم خصيصاً للتطبيقات العربية مع دعم كامل لـ RTL.

## المميزات

### 🎨 **التصميم**
- **حديث وعصري**: زوايا مستديرة وظلال ناعمة
- **متجاوب**: يعمل على جميع أحجام الشاشات
- **ألوان متناسقة**: أزرق وفيروزي مع رمادي كلاسيكي
- **تأثيرات حركية**: انتقالات سلسة وتأثيرات hover

### 🌍 **دعم اللغة العربية**
- **خطوط Google**: Cairo و Tajawal
- **دعم RTL**: محاذاة مثالية من اليمين لليسار
- **نصوص عربية**: محسنة للقراءة والوضوح

### 📱 **الاستجابة**
- **عرض أقصى**: 360 بكسل للشاشات الكبيرة
- **تخطيط مرن**: يتكيف مع جميع الأجهزة
- **تحسينات الجوال**: تجربة مثالية على الهواتف

## الاستخدام

### التثبيت

```bash
# تأكد من وجود الملفات المطلوبة
src/components/UserServiceCard.tsx
src/styles/cards.css
```

### الاستخدام الأساسي

```tsx
import UserServiceCard from '@/components/UserServiceCard';

// بطاقة مستخدم
<UserServiceCard
  type="user"
  title="أحمد محمد علي"
  description="مطور تطبيقات ويب متخصص في React وNode.js"
  status="active"
  avatar="https://example.com/avatar.jpg"
  badge="مطور"
  actionText="عرض الملف"
  onAction={() => console.log('عرض الملف')}
  metadata={{
    location: "عدن، اليمن",
    phone: "+967 123 456 789",
    email: "ahmed@example.com",
    rating: 4.8,
    lastUpdate: "منذ ساعتين"
  }}
/>
```

### أنواع البطاقات

#### 1. بطاقة المستخدم
```tsx
import { UserCard } from '@/components/UserServiceCard';

<UserCard
  title="فاطمة أحمد"
  description="ممرضة متخصصة في العناية المركزة"
  status="active"
  avatar="https://example.com/avatar.jpg"
  badge="ممرضة"
  actionText="عرض الملف"
  onAction={() => console.log('عرض الملف')}
/>
```

#### 2. بطاقة الخدمة
```tsx
import { ServiceCard } from '@/components/UserServiceCard';

<ServiceCard
  title="خدمة الصحة"
  description="خدمة طوارئ صحية متاحة 24/7"
  status="active"
  icon={<Heart className="w-6 h-6" />}
  badge="متاح"
  actionText="طلب الخدمة"
  onAction={() => setLocation('/health')}
/>
```

#### 3. بطاقة الإشعارات
```tsx
import { NotificationCard } from '@/components/UserServiceCard';

<NotificationCard
  title="انقطاع الكهرباء"
  description="تم الإبلاغ عن انقطاع في التيار الكهربائي"
  status="pending"
  icon={<Zap className="w-6 h-6" />}
  badge="طارئ"
  badgeColor="destructive"
  actionText="متابعة الحالة"
  onAction={() => console.log('متابعة الحالة')}
/>
```

#### 4. بطاقة الإحصائيات
```tsx
import { StatisticCard } from '@/components/UserServiceCard';

<StatisticCard
  title="إحصائيات اليوم"
  description="إجمالي الطلبات المكتملة اليوم"
  status="completed"
  icon={<TrendingUp className="w-6 h-6" />}
  badge="+15%"
  actionText="عرض التفاصيل"
  onAction={() => console.log('عرض التفاصيل')}
/>
```

## الخصائص (Props)

### UserServiceCardProps

| الخاصية | النوع | الافتراضي | الوصف |
|---------|------|-----------|--------|
| `type` | `'user' \| 'service' \| 'notification' \| 'statistic'` | - | نوع البطاقة |
| `title` | `string` | - | عنوان البطاقة |
| `description` | `string` | - | وصف البطاقة |
| `status` | `'active' \| 'inactive' \| 'pending' \| 'completed'` | `'active'` | حالة البطاقة |
| `icon` | `React.ReactNode` | - | أيقونة مخصصة |
| `avatar` | `string` | - | رابط الصورة الرمزية |
| `badge` | `string` | - | نص الشارة |
| `badgeColor` | `'default' \| 'secondary' \| 'destructive' \| 'outline'` | `'default'` | لون الشارة |
| `actionText` | `string` | `'عرض'` | نص زر الإجراء |
| `onAction` | `() => void` | - | دالة تنفيذ الإجراء |
| `className` | `string` | `''` | فئات CSS إضافية |
| `showStatus` | `boolean` | `true` | إظهار مؤشر الحالة |
| `metadata` | `object` | - | البيانات الإضافية |

### Metadata Object

```tsx
interface Metadata {
  location?: string;    // الموقع
  phone?: string;       // رقم الهاتف
  email?: string;       // البريد الإلكتروني
  rating?: number;      // التقييم (1-5)
  lastUpdate?: string;  // آخر تحديث
}
```

## الحالات (Status)

| الحالة | اللون | النص | الوصف |
|--------|-------|------|--------|
| `active` | أخضر | نشط | البطاقة نشطة ومتاحة |
| `inactive` | رمادي | غير نشط | البطاقة غير نشطة |
| `pending` | أصفر | في الانتظار | البطاقة في حالة انتظار |
| `completed` | أزرق | مكتمل | البطاقة مكتملة |

## الألوان

### الألوان الأساسية
- **الأزرق**: `#3b82f6` (aden-blue)
- **الفيروزي**: `#14b8a6` (aden-teal)
- **الرمادي**: `#6b7280` (gray-500)

### ألوان الحالات
- **نشط**: `#10b981` (green-500)
- **غير نشط**: `#6b7280` (gray-500)
- **في الانتظار**: `#f59e0b` (yellow-500)
- **مكتمل**: `#3b82f6` (blue-500)

## الخطوط

### الخطوط المستخدمة
- **Cairo**: الخط الأساسي للنصوص العربية
- **Tajawal**: الخط البديل للنصوص العربية
- **Segoe UI**: الخط الاحتياطي

### تحميل الخطوط
```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
```

## الاستجابة (Responsive)

### نقاط التوقف
- **Mobile**: `< 640px` - عرض كامل
- **Tablet**: `640px - 768px` - عرض 320px
- **Desktop**: `> 768px` - عرض 360px

### التخطيط
```css
/* Mobile */
@media (max-width: 640px) {
  .user-service-card {
    max-width: 100%;
    margin: 0 1rem;
  }
}

/* Tablet */
@media (min-width: 641px) and (max-width: 768px) {
  .user-service-card {
    max-width: 320px;
  }
}

/* Desktop */
@media (min-width: 769px) {
  .user-service-card {
    max-width: 360px;
  }
}
```

## التخصيص

### تخصيص الألوان
```tsx
// استخدام فئات CSS مخصصة
<UserServiceCard
  className="custom-card"
  // ... other props
/>
```

```css
.custom-card {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
  border-color: #your-border-color;
}
```

### تخصيص الأيقونات
```tsx
import { CustomIcon } from '@/components/CustomIcon';

<UserServiceCard
  icon={<CustomIcon className="w-6 h-6" />}
  // ... other props
/>
```

## الأمثلة

### مثال شامل
```tsx
import React from 'react';
import { UserServiceCard } from '@/components/UserServiceCard';
import { Heart, Phone, MapPin } from 'lucide-react';

function DashboardSidebar() {
  return (
    <div className="space-y-4">
      {/* بطاقة مستخدم */}
      <UserServiceCard
        type="user"
        title="أحمد محمد علي"
        description="مطور تطبيقات ويب متخصص في React وNode.js مع خبرة 5 سنوات"
        status="active"
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        badge="مطور"
        badgeColor="default"
        actionText="عرض الملف"
        onAction={() => console.log('عرض ملف المستخدم')}
        metadata={{
          location: "عدن، اليمن",
          phone: "+967 123 456 789",
          email: "ahmed@example.com",
          rating: 4.8,
          lastUpdate: "منذ ساعتين"
        }}
      />

      {/* بطاقة خدمة */}
      <UserServiceCard
        type="service"
        title="خدمة الصحة"
        description="خدمة طوارئ صحية متاحة 24/7 مع فريق طبي متخصص"
        status="active"
        icon={<Heart className="w-6 h-6" />}
        badge="متاح"
        actionText="طلب الخدمة"
        onAction={() => setLocation('/health')}
        metadata={{
          location: "مستشفى الجمهورية",
          phone: "+967 1 234 567",
          rating: 4.9,
          lastUpdate: "منذ 5 دقائق"
        }}
      />

      {/* بطاقة إشعار */}
      <UserServiceCard
        type="notification"
        title="انقطاع الكهرباء"
        description="تم الإبلاغ عن انقطاع في التيار الكهربائي في منطقة التواهي"
        status="pending"
        icon={<Zap className="w-6 h-6" />}
        badge="طارئ"
        badgeColor="destructive"
        actionText="متابعة الحالة"
        onAction={() => console.log('متابعة الحالة')}
        metadata={{
          location: "التواهي، عدن",
          lastUpdate: "منذ 10 دقائق"
        }}
      />
    </div>
  );
}
```

## الملفات المطلوبة

### ملفات React
- `UserServiceCard.tsx` - المكون الرئيسي
- `cards-demo.tsx` - صفحة التجريب
- `cards.css` - ملف الأنماط

### ملفات HTML
- `UserServiceCard.html` - نسخة HTML منفصلة

### التبعيات
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "lucide-react": "^0.263.1",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  }
}
```

## الدعم

### المتطلبات
- React 18+
- Tailwind CSS 3+
- TypeScript (اختياري)

### المتصفحات المدعومة
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. يمكنك استخدامه وتعديله بحرية.

## المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. فتح Pull Request

## التحديثات

### الإصدار 1.0.0
- إصدار أولي مع جميع المميزات الأساسية
- دعم كامل للغة العربية و RTL
- تصميم متجاوب وحديث
- مكونات قابلة لإعادة الاستخدام

---

**تم التطوير بواسطة فريق عدن لايف** 🚀
