# تعليمات إعداد Google Maps API

## 1. الحصول على مفتاح API

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Maps JavaScript API
4. اذهب إلى "Credentials" وأنشئ مفتاح API جديد
5. قم بتقييد المفتاح للمواقع المسموحة

## 2. إعداد متغيرات البيئة

أنشئ ملف `.env.local` في مجلد `SourceCode` وأضف:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 3. تحديث ملف التكوين

في ملف `client/src/config/google-maps.ts`، استبدل:

```typescript
API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE',
```

بمفتاح API الفعلي.

## 4. اختبار التطبيق

بعد إضافة المفتاح، أعد تشغيل التطبيق:

```bash
npm run dev
```

## 5. استكشاف الأخطاء

إذا واجهت مشاكل:

1. تأكد من تفعيل Google Maps JavaScript API
2. تحقق من تقييدات المفتاح
3. تأكد من صحة المفتاح في متغيرات البيئة
4. تحقق من وحدة التحكم في المتصفح للأخطاء

## 6. الميزات المتاحة

- عرض الخرائط
- البحث عن الأماكن
- الاتجاهات
- العلامات المخصصة
- البحث المحلي في اليمن
