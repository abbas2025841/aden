# 📚 Storybook - دليل البدء السريع

## 🚀 تشغيل Storybook

```bash
# تشغيل Storybook
npm run storybook

# الوصول إلى Storybook
# http://localhost:6006
```

## 📖 المكونات المتاحة

### 1. Card Component
- **الموقع**: Components/Card
- **الوصف**: مكون البطاقة الموحد
- **القصص**: Default, WithLucideIcon, Clickable, Outlined, Filled, Sizes

### 2. Button Component  
- **الموقع**: Components/Button
- **الوصف**: مكونات الأزرار المحسنة
- **القصص**: Default, Variants, Sizes, States, WithIcon, Loading

### 3. EnhancedUI Components
- **الموقع**: Components/EnhancedUI
- **الوصف**: مكونات محسنة متقدمة
- **القصص**: EnhancedCard, StatsCard, ProgressBar, LoadingSpinner, Alert, EnhancedTabs

### 4. Design System
- **الموقع**: Design System/Tokens
- **الوصف**: نظام التصميم الموحد
- **القصص**: Colors, Spacing, Typography, BorderRadius, Shadows, ButtonStyles

### 5. ServiceGrid
- **الموقع**: Components/ServiceGrid
- **الوصف**: شبكة الخدمات الرئيسية
- **القصص**: Default, MobileView, TabletView, DesktopView, DarkBackground

## 🛠️ إعدادات متاحة

### الخلفيات
- Light (افتراضي)
- Dark
- Gray

### أحجام الشاشة
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1024x768)

### الاتجاهات
- RTL (افتراضي)
- LTR

## 📝 إضافة قصة جديدة

```javascript
// ComponentName.stories.jsx
import ComponentName from './ComponentName';

export default {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    // القيم الافتراضية
  },
};
```

## 🎨 تخصيص القصص

### إضافة عناصر تحكم
```javascript
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
  },
  size: {
    control: 'select', 
    options: ['sm', 'md', 'lg'],
  },
}
```

### إضافة معاملات
```javascript
parameters: {
  layout: 'centered',
  docs: {
    description: {
      component: 'وصف المكون',
    },
  },
}
```

## 🔧 نصائح مفيدة

1. **استخدم autodocs**: أضف `tags: ['autodocs']` للتوثيق التلقائي
2. **اختبر التفاعل**: استخدم `action` للتحقق من الأحداث
3. **اختبر الأحجام**: استخدم viewport للتحقق من التجاوب
4. **اختبر الخلفيات**: استخدم backgrounds للتحقق من التباين

## 📱 اختبار الأجهزة

- **Mobile**: اختبر التصميم المتجاوب
- **Tablet**: اختبر التخطيطات المتوسطة  
- **Desktop**: اختبر التخطيطات الكبيرة

## ♿ اختبار إمكانية الوصول

- تحقق من التباين
- اختبر التنقل بلوحة المفاتيح
- تحقق من ARIA labels
- اختبر قارئات الشاشة

---

**عدن لايف** - تطبيق الخدمات الذكية 🚀
