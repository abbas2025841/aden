# 📚 Storybook - عدن لايف

## نظرة عامة

Storybook هو أداة تطوير واجهة المستخدم التي تساعدنا على بناء مكونات منفصلة ومعزولة. يوفر بيئة تفاعلية لتطوير واختبار وتوثيق مكونات React.

## 🚀 البدء السريع

### تشغيل Storybook

```bash
# تشغيل Storybook في وضع التطوير
npm run storybook

# بناء Storybook للإنتاج
npm run build-storybook
```

### الوصول إلى Storybook

بعد تشغيل `npm run storybook`، ستكون قادراً على الوصول إلى Storybook على:
- **الرابط المحلي**: http://localhost:6006
- **الرابط الشبكي**: http://[your-ip]:6006

## 📖 المكونات المتاحة

### 1. Components/Card
- **الوصف**: مكون البطاقة الموحد لتطبيق عدن لايف
- **القصص المتاحة**:
  - `Default`: البطاقة الأساسية
  - `WithLucideIcon`: بطاقة مع أيقونة Lucide
  - `Clickable`: بطاقة قابلة للنقر
  - `Outlined`: بطاقة بحدود
  - `Filled`: بطاقة مملوءة
  - `Small/Medium/Large`: أحجام مختلفة
  - `CardGrid`: شبكة من البطاقات

### 2. Components/Button
- **الوصف**: مكونات الأزرار المحسنة لإمكانية الوصول
- **القصص المتاحة**:
  - `Default`: الزر الأساسي
  - `Primary/Secondary/Success/Warning/Error`: أنماط مختلفة
  - `Small/Medium/Large`: أحجام مختلفة
  - `Disabled/FullWidth`: حالات مختلفة
  - `WithIcon`: أزرار مع أيقونات
  - `Loading`: أزرار التحميل
  - `CallButton/NavigationButton/ToggleButton`: أزرار متخصصة

### 3. Components/EnhancedUI
- **الوصف**: مجموعة من المكونات المحسنة
- **القصص المتاحة**:
  - `EnhancedCard`: بطاقات محسنة
  - `StatsCard`: بطاقات إحصائيات
  - `ProgressBar`: أشرطة التقدم
  - `LoadingSpinner`: مؤشرات التحميل
  - `Alert`: التنبيهات
  - `EnhancedTabs`: التبويبات المحسنة

### 4. Design System/Tokens
- **الوصف**: نظام التصميم الموحد
- **القصص المتاحة**:
  - `Colors`: الألوان
  - `Spacing`: المسافات
  - `Typography`: الخطوط
  - `BorderRadius`: نصف قطر الحدود
  - `Shadows`: الظلال
  - `ButtonStyles`: أنماط الأزرار
  - `ButtonSizes`: أحجام الأزرار
  - `HelperFunctions`: دوال المساعدة

### 5. Components/ServiceGrid
- **الوصف**: شبكة الخدمات الرئيسية
- **القصص المتاحة**:
  - `Default`: العرض الأساسي
  - `MobileView/TabletView/DesktopView`: عروض مختلفة
  - `DarkBackground/ColoredBackground`: خلفيات مختلفة
  - `RTLView/LTRView`: دعم الاتجاهات
  - `AccessibilityView`: تحسينات إمكانية الوصول

## 🛠️ إعدادات Storybook

### الملفات الرئيسية

- **`.storybook/main.ts`**: إعدادات Storybook الرئيسية
- **`.storybook/preview.ts`**: إعدادات المعاينة العامة
- **`*.stories.tsx`**: ملفات القصص للمكونات

### الإضافات المتاحة

- **@storybook/addon-essentials**: الإضافات الأساسية
- **@storybook/addon-a11y**: اختبار إمكانية الوصول
- **@storybook/addon-docs**: التوثيق التلقائي
- **@storybook/addon-controls**: عناصر التحكم
- **@storybook/addon-viewport**: تغيير حجم الشاشة
- **@storybook/addon-backgrounds**: تغيير الخلفية

## 📝 كتابة القصص

### هيكل القصة الأساسي

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'وصف المكون',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // تعريف عناصر التحكم
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // القيم الافتراضية
  },
};
```

### أنواع القصص

1. **القصص الأساسية**: عرض المكون في حالته الافتراضية
2. **قصص الحالات**: عرض حالات مختلفة للمكون
3. **قصص التفاعل**: عرض كيفية تفاعل المكون مع المستخدم
4. **قصص التصميم**: عرض المكون في سياقات تصميم مختلفة

## 🎨 إعدادات التصميم

### الخلفيات المتاحة

- `light`: خلفية فاتحة
- `dark`: خلفية داكنة
- `gray`: خلفية رمادية

### أحجام الشاشة

- `mobile`: 375x667
- `tablet`: 768x1024
- `desktop`: 1024x768

### الاتجاهات

- `RTL`: من اليمين إلى اليسار
- `LTR`: من اليسار إلى اليمين

## 🔧 التخصيص

### إضافة قصة جديدة

1. أنشئ ملف `ComponentName.stories.tsx`
2. اتبع الهيكل الأساسي للقصة
3. أضف القصص المختلفة
4. اختبر القصة في Storybook

### تخصيص الإعدادات

يمكن تخصيص إعدادات Storybook من خلال:
- تعديل `.storybook/main.ts` للإضافات والإعدادات
- تعديل `.storybook/preview.ts` للإعدادات العامة
- إضافة ملفات إعدادات مخصصة

## 📱 دعم الأجهزة

### الأجهزة المحمولة
- اختبار التصميم المتجاوب
- التحقق من إمكانية الوصول
- اختبار الأداء

### الأجهزة اللوحية
- اختبار التخطيطات المتوسطة
- التحقق من التفاعل باللمس
- اختبار التوجهات المختلفة

### أجهزة سطح المكتب
- اختبار التخطيطات الكبيرة
- التحقق من التفاعل بالماوس
- اختبار لوحة المفاتيح

## ♿ إمكانية الوصول

### الاختبارات المتاحة

- **التباين**: التحقق من نسبة التباين
- **التنقل بلوحة المفاتيح**: اختبار التنقل
- **قارئات الشاشة**: التحقق من ARIA labels
- **التركيز**: اختبار مؤشرات التركيز

### الأدوات

- **@storybook/addon-a11y**: اختبار إمكانية الوصول
- **axe-core**: محرك اختبار إمكانية الوصول
- **التحقق اليدوي**: اختبار يدوي للوظائف

## 🚀 النشر

### بناء Storybook

```bash
npm run build-storybook
```

### النشر

يمكن نشر Storybook على:
- **GitHub Pages**: للنشر المجاني
- **Netlify**: للنشر السريع
- **Vercel**: للنشر المتقدم
- **Chromatic**: للنشر المتخصص

## 📚 الموارد

### الوثائق الرسمية

- [Storybook Documentation](https://storybook.js.org/docs)
- [React Stories](https://storybook.js.org/docs/react/get-started/introduction)
- [Addon Documentation](https://storybook.js.org/addons)

### الأدوات المساعدة

- [Storybook Addon Gallery](https://storybook.js.org/addons)
- [Storybook Examples](https://github.com/storybookjs/storybook/tree/next/examples)
- [Community Stories](https://storybook.js.org/community)

## 🤝 المساهمة

### إضافة مكونات جديدة

1. أنشئ المكون في `src/components/`
2. أضف القصص في `*.stories.tsx`
3. اختبر القصص في Storybook
4. أضف التوثيق المناسب

### تحسين القصص الموجودة

1. راجع القصص الحالية
2. أضف حالات جديدة
3. حسّن التوثيق
4. اختبر التحسينات

## 📞 الدعم

إذا واجهت أي مشاكل أو لديك أسئلة:

1. راجع الوثائق الرسمية
2. ابحث في Issues الموجودة
3. أنشئ Issue جديد
4. تواصل مع الفريق

---

**عدن لايف** - تطبيق الخدمات الذكية 🚀
