# 🎨 نظام التصميم المتقدم - عدن لايف

## نظرة عامة

نظام التصميم المتقدم لتطبيق عدن لايف يوفر مكونات موحدة، أدوات اختبار الأداء، وتكامل مع Figma Tokens.

## 🚀 الميزات الجديدة

### 1. Figma Tokens Integration
- **تصدير المعايير**: من Figma إلى `tokens.json`
- **تكامل Tailwind**: استخدام Tokens في Tailwind CSS
- **تحديث تلقائي**: مزامنة التصميم مع الكود

### 2. Lighthouse Performance Testing
- **اختبار الأداء**: قياس شامل للأداء
- **اختبار إمكانية الوصول**: فحص A11y
- **تقارير مفصلة**: HTML و JSON
- **CI/CD Integration**: اختبارات تلقائية

### 3. Design System Components
- **مكونات محسنة**: Button, Input, Card, MapContainer
- **TypeScript Support**: دعم كامل للأنواع
- **Accessibility**: إمكانية وصول محسنة
- **Responsive Design**: تصميم متجاوب

## 📁 هيكل المشروع

```
src/design-system/
├── tokens.json              # Figma Tokens
├── components/
│   ├── Button.tsx           # مكون الزر المحسن
│   ├── Input.tsx            # مكون الإدخال المحسن
│   ├── Card.tsx             # مكون البطاقة المحسن
│   └── MapContainer.tsx     # مكون الخريطة المحسن
├── colors.ts                # نظام الألوان
├── spacing.ts               # نظام المسافات
├── typography.ts            # نظام الخطوط
└── index.ts                 # تصدير المكونات

scripts/
├── lighthouse-test.js       # اختبارات Lighthouse
└── figma-tokens.js          # تصدير Figma Tokens

lighthouse-results/          # نتائج اختبارات الأداء
├── summary-report.json      # التقرير الشامل
└── *.html                   # التقارير التفصيلية
```

## 🛠️ الإعداد والاستخدام

### 1. إعداد Figma Tokens

#### في Figma:
1. تثبيت Figma Tokens Plugin
2. إنشاء Design Tokens
3. تصدير إلى JSON

#### في المشروع:
```bash
# نسخ tokens.json إلى src/design-system/
cp figma-export/tokens.json src/design-system/

# تحديث Tailwind
npm run build
```

### 2. إعداد Lighthouse Testing

```bash
# تثبيت Lighthouse
npm install -g lighthouse

# تشغيل الاختبارات
npm run lighthouse

# تشغيل اختبارات CI
npm run lighthouse:ci
```

### 3. استخدام المكونات

```tsx
import { Button, Input, Card, MapContainer } from '@/design-system/components';

// استخدام الزر
<Button variant="primary" size="lg" loading={isLoading}>
  حفظ البيانات
</Button>

// استخدام الإدخال
<Input
  label="البريد الإلكتروني"
  type="email"
  required
  error={errors.email}
  helperText="أدخل بريدك الإلكتروني"
/>

// استخدام البطاقة
<Card
  title="خدمة المياه"
  description="طلب صهريج مياه سريع"
  icon={<WaterIcon />}
  onClick={handleClick}
/>

// استخدام الخريطة
<MapContainer
  facilities={healthFacilities}
  onFacilityClick={handleFacilityClick}
  height="500px"
/>
```

## 🎨 نظام التصميم

### الألوان
```json
{
  "primary": "#0066FF",
  "secondary": "#00C853",
  "success": "#4CAF50",
  "warning": "#FF9800",
  "error": "#F44336",
  "info": "#2196F3"
}
```

### المسافات
```json
{
  "xs": "0.5rem",
  "sm": "1rem",
  "md": "1.5rem",
  "lg": "2rem",
  "xl": "3rem",
  "xxl": "4rem"
}
```

### الخطوط
```json
{
  "fontFamily": {
    "primary": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "arabic": "Cairo, 'Noto Sans Arabic', Arial, sans-serif"
  },
  "fontSize": {
    "xs": "0.75rem",
    "sm": "0.875rem",
    "base": "1rem",
    "lg": "1.125rem",
    "xl": "1.25rem"
  }
}
```

## 📊 اختبارات الأداء

### معايير الأداء المستهدفة

| المعيار | الهدف | الحالة |
|---------|-------|--------|
| **Performance** | ≥ 80 | ✅ |
| **Accessibility** | ≥ 90 | ✅ |
| **Best Practices** | ≥ 80 | ✅ |
| **SEO** | ≥ 80 | ✅ |
| **First Contentful Paint** | ≤ 2s | ✅ |
| **Largest Contentful Paint** | ≤ 2.5s | ✅ |
| **Cumulative Layout Shift** | ≤ 0.1 | ✅ |

### تشغيل الاختبارات

```bash
# اختبار شامل
npm run lighthouse

# اختبار صفحة واحدة
lighthouse http://localhost:5000 --view

# اختبار مع إعدادات مخصصة
lighthouse http://localhost:5000 --only-categories=performance,accessibility
```

### تفسير النتائج

#### Performance Score
- **90-100**: ممتاز
- **80-89**: جيد
- **70-79**: مقبول
- **< 70**: يحتاج تحسين

#### Accessibility Score
- **90-100**: ممتاز
- **80-89**: جيد
- **70-79**: مقبول
- **< 70**: يحتاج تحسين

## 🔧 التخصيص

### تخصيص الألوان

```typescript
// src/design-system/colors.ts
export const customColors = {
  primary: {
    50: '#eff6ff',
    500: '#0066FF',
    900: '#1e3a8a',
  },
  // ... المزيد
};
```

### تخصيص المكونات

```typescript
// src/design-system/components/Button.tsx
const customButtonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        custom: "custom-styles",
        // ... المزيد
      },
    },
  }
);
```

### تخصيص Tailwind

```javascript
// tailwind.config.tokens.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // استخدام Figma Tokens
        primary: tokens.global.color.primary.value,
        // ... المزيد
      },
    },
  },
};
```

## 📱 دعم الأجهزة

### الأجهزة المحمولة
- **iPhone SE**: 375x667
- **iPhone 12**: 390x844
- **Samsung Galaxy**: 360x640

### الأجهزة اللوحية
- **iPad**: 768x1024
- **iPad Pro**: 1024x1366

### أجهزة سطح المكتب
- **Desktop**: 1024x768
- **Large Desktop**: 1440x900

## ♿ إمكانية الوصول

### المعايير المطبقة
- **WCAG 2.1 AA**: معيار إمكانية الوصول
- **ARIA Labels**: تسميات وصفية
- **Keyboard Navigation**: تنقل بلوحة المفاتيح
- **Color Contrast**: تباين الألوان ≥ 4.5:1
- **Screen Reader**: دعم قارئات الشاشة

### الاختبارات
```bash
# اختبار إمكانية الوصول
lighthouse http://localhost:5000 --only-categories=accessibility

# اختبار مع axe-core
npm run test:a11y
```

## 🚀 النشر

### بناء المشروع
```bash
# بناء التطبيق
npm run build

# بناء Storybook
npm run build-storybook

# بناء شامل
npm run design:build
```

### النشر
```bash
# نشر التطبيق
npm run deploy

# نشر Storybook
npm run deploy:storybook
```

## 📚 الموارد

### الوثائق
- [Figma Tokens Plugin](https://www.figma.com/community/plugin/843461159747178946/Figma-Tokens)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Leaflet](https://react-leaflet.js.org/)

### الأدوات
- [Figma](https://www.figma.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

## 🤝 المساهمة

### إضافة مكونات جديدة
1. إنشاء المكون في `src/design-system/components/`
2. إضافة القصص في Storybook
3. إضافة الاختبارات
4. تحديث الوثائق

### تحسين الأداء
1. تشغيل Lighthouse
2. تحليل النتائج
3. تطبيق التحسينات
4. إعادة الاختبار

### تحسين إمكانية الوصول
1. اختبار مع قارئات الشاشة
2. اختبار التنقل بلوحة المفاتيح
3. فحص تباين الألوان
4. تطبيق ARIA labels

## 📞 الدعم

إذا واجهت أي مشاكل:

1. راجع الوثائق
2. تحقق من Issues
3. أنشئ Issue جديد
4. تواصل مع الفريق

---

**عدن لايف** - تطبيق الخدمات الذكية 🚀
