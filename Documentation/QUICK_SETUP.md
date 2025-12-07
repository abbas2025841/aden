# 🚀 إعداد سريع - Google Maps API

## ⚠️ المشكلة
```
خطأ في تحميل الخرائط
Google Maps API key is not configured
```

## ✅ الحل السريع

### 1. أنشئ ملف `.env.local`
في المجلد الجذر (نفس مستوى `package.json`):

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 2. احصل على مفتاح API
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد
3. فعّل "Maps JavaScript API"
4. أنشئ مفتاح API
5. انسخ المفتاح

### 3. أضف المفتاح إلى `.env.local`
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBvOkBw3cLxE2oZbQ1rR8sT9uV0wX3yZ4A
```

### 4. أعد تشغيل الخادم
```bash
npm run dev
```

## 🎯 النتيجة
- ✅ الخريطة ستعمل
- ✅ العلامات ستعمل
- ✅ البحث سيعمل
- ✅ الاتجاهات ستعمل

## 📚 المزيد من التفاصيل
- [الوثائق الكاملة](GOOGLE_MAPS_SETUP.md)
- [استكشاف الأخطاء](client/src/components/maps/TROUBLESHOOTING.md)
