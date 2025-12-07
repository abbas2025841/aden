# دليل إعداد المكتبات - Library Setup Guide

## المكتبات المطلوبة

### 1. React Bits
مكتبة UI components حديثة وخفيفة

**التثبيت:**
```bash
npm install @react-bits/core
# أو
yarn add @react-bits/core
```

**الاستخدام:**
```tsx
import { Button, Card, Input } from '@react-bits/core';
```

**الموقع الرسمي:** https://www.reactbits.dev/

---

### 2. Flowbite (اختياري)
مكتبة UI components مبنية على Tailwind CSS

**التثبيت:**
```bash
npm install flowbite flowbite-react
# أو
yarn add flowbite flowbite-react
```

**التكوين في tailwind.config.cjs:**
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}"
  ],
  plugins: [
    require('flowbite/plugin')
  ],
}
```

---

## التوصيات

### للمكتبة الرقمية:

نوصي باستخدام **المكونات المخصصة** التي أنشأناها بدلاً من المكتبات الخارجية:

✅ **المكونات الموجودة:**
- `BookCard` - بطاقة الكتاب
- `BookGrid` - شبكة الكتب
- `SearchBar` - شريط البحث
- `FilterButtons` - أزرار الفلترة
- `BookCardSkeleton` - حالة التحميل

✅ **المكونات من shadcn/ui:**
- `Card`, `CardContent`, `CardHeader` من `@/components/ui/card`
- `Button` من `@/components/ui/button`
- `Input` من `@/components/ui/input`
- `Select` من `@/components/ui/select`
- `Badge` من `@/components/ui/badge`

### لماذا المكونات المخصصة أفضل؟

1. **أداء أفضل**: لا حاجة لتحميل مكتبات كاملة
2. **تخصيص كامل**: مصممة خصيصاً لاحتياجات المشروع
3. **RTL Support**: دعم كامل للغة العربية
4. **حجم أصغر**: Bundle size أقل
5. **متوافقة مع Design System**: ألوان ومسافات متناسقة

---

## القرار النهائي

### الخيار 1: استخدام المكونات الحالية (موصى به ⭐)
```tsx
// لا حاجة لتثبيت مكتبات إضافية
import { BookCard, BookGrid, SearchBar } from '@/components/library';
import { Button, Card, Input } from '@/components/ui';
```

### الخيار 2: إضافة React Bits
```bash
npm install @react-bits/core
```

```tsx
import { Button, Card } from '@react-bits/core';
import { BookCard, BookGrid } from '@/components/library';
```

### الخيار 3: إضافة Flowbite
```bash
npm install flowbite flowbite-react
```

```tsx
import { Button, Card } from 'flowbite-react';
import { BookCard, BookGrid } from '@/components/library';
```

---

## ملاحظات مهمة

⚠️ **تحذير**: إضافة مكتبات UI خارجية قد يؤدي إلى:
- زيادة حجم Bundle (قد يتجاوز 300 KB)
- تعارض في الأنماط مع Tailwind
- صعوبة في تخصيص RTL
- عدم التوافق مع Design System الحالي

✅ **التوصية**: استمر في استخدام المكونات الحالية وأضف مكونات جديدة عند الحاجة فقط.

---

## الخطوات التالية

إذا قررت المتابعة مع المكونات الحالية:

1. ✅ احذف `import 'flowbite'` من `main.tsx`
2. ✅ احذف ملف `digital-library-flowbite.tsx`
3. ✅ استخدم المكونات من `@/components/library`
4. ✅ أضف مكونات جديدة في `@/components/library` عند الحاجة

إذا قررت استخدام React Bits أو Flowbite:

1. ⚠️ ثبت المكتبة المطلوبة
2. ⚠️ اختبر الأداء (Bundle size, Lighthouse score)
3. ⚠️ تأكد من دعم RTL
4. ⚠️ تأكد من التوافق مع Design System

