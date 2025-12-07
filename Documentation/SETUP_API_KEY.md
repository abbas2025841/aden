# 🔑 إعداد مفتاح Google Maps API

## ✅ تم الحصول على المفتاح!

مفتاح API الخاص بك:
```
AIzaSyC5O2erOdj7kB5PjEXsjKysgF6iwWSiUXk
```

## 📝 الخطوات المطلوبة:

### 1. إنشاء ملف `.env.local`

أنشئ ملف جديد باسم `.env.local` في المجلد الجذر للمشروع (نفس مستوى `package.json`)

### 2. إضافة المفتاح

أضف المحتوى التالي إلى ملف `.env.local`:

```env
# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=AIzaSyC5O2erOdj7kB5PjEXsjKysgF6iwWSiUXk
```

### 3. إعادة تشغيل الخادم

```bash
# أوقف الخادم (Ctrl+C)
npm run dev
```

## 🎯 النتيجة المتوقعة:

بعد إعادة تشغيل الخادم:
- ✅ ستختفي رسالة الخطأ
- ✅ ستظهر الخريطة بشكل صحيح
- ✅ ستعمل جميع وظائف الخرائط

## 🔧 إذا لم تعمل الخريطة:

### تحقق من:
1. أن ملف `.env.local` موجود في المجلد الجذر
2. أن المفتاح مكتوب بشكل صحيح
3. أنك أعدت تشغيل الخادم

### تفعيل APIs المطلوبة:
تأكد من تفعيل هذه APIs في Google Cloud Console:
- ✅ Maps JavaScript API
- ✅ Places API (للبحث)
- ✅ Directions API (للاتجاهات)

## 📚 المزيد من المساعدة:

- [دليل الإعداد الكامل](GOOGLE_MAPS_SETUP.md)
- [استكشاف الأخطاء](client/src/components/maps/TROUBLESHOOTING.md)
- [Google Cloud Console](https://console.cloud.google.com/)

---

**ملاحظة**: تأكد من عدم مشاركة مفتاح API في GitHub أو أي مكان عام!
