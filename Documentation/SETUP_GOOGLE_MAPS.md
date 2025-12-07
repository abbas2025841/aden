# إعداد Google Maps API - دليل سريع

## المشكلة الحالية
```
⚠️ خطأ في تحميل الخرائط
Google Maps API key is not configured
```

## الحل السريع (5 دقائق)

### 1. إنشاء ملف `.env.local`

أنشئ ملف جديد باسم `.env.local` في المجلد الجذر للمشروع (نفس مستوى `package.json`) وأضف:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. الحصول على مفتاح API

#### الخطوة 1: اذهب إلى Google Cloud Console
- [Google Cloud Console](https://console.cloud.google.com/)

#### الخطوة 2: أنشئ مشروع جديد
- انقر على "Select a project" > "New Project"
- أدخل اسم المشروع: "AdenLive Maps"
- انقر على "Create"

#### الخطوة 3: فعّل Google Maps JavaScript API
- اذهب إلى "APIs & Services" > "Library"
- ابحث عن "Maps JavaScript API"
- انقر على "Enable"

#### الخطوة 4: أنشئ مفتاح API
- اذهب إلى "APIs & Services" > "Credentials"
- انقر على "Create Credentials" > "API Key"
- انسخ المفتاح

#### الخطوة 5: أضف المفتاح إلى ملف .env.local
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBvOkBw3cLxE2oZbQ1rR8sT9uV0wX3yZ4A
```

### 3. إعادة تشغيل الخادم

```bash
# أوقف الخادم (Ctrl+C)
npm run dev
```

## تفعيل APIs إضافية (اختياري)

### للبحث عن الأماكن:
- فعّل "Places API"

### للاتجاهات:
- فعّل "Directions API"

## اختبار الإعداد

1. افتح التطبيق: http://localhost:5000
2. اذهب إلى صفحة الخرائط
3. يجب أن تظهر الخريطة بدون أخطاء

## استكشاف الأخطاء

### إذا ظهر خطأ "API_KEY_INVALID":
- تحقق من صحة المفتاح
- تأكد من تفعيل Maps JavaScript API

### إذا ظهر خطأ "QUOTA_EXCEEDED":
- تحقق من حدود الاستخدام في Google Cloud Console

### إذا لم تظهر الخريطة:
- تحقق من وحدة التحكم للأخطاء
- تأكد من إعادة تشغيل الخادم

## نصائح الأمان

- لا تشارك المفتاح في GitHub
- استخدم تقييدات HTTP referrers
- راقب استخدام API

## الدعم

- [الوثائق الكاملة](client/src/components/maps/API_SETUP.md)
- [استكشاف الأخطاء](client/src/components/maps/TROUBLESHOOTING.md)
- [Google Maps Documentation](https://developers.google.com/maps/documentation/javascript)
