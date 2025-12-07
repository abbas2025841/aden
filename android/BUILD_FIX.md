# إصلاح مشكلة Capacitor - تطبيق عدن لايف

## المشكلة:
```
Could not find com.getcapacitor:core:6.0.0
```

## الحل المطبق:
1. ✅ تم تغيير إصدار Capacitor إلى 5.6.0 (إصدار مستقر)
2. ✅ تم إضافة مستودع jcenter() للمكتبات
3. ✅ تم تنظيف إعدادات المستودعات

## الخطوات التالية في Android Studio:

### 1. مزامنة المشروع:
- افتح Android Studio
- اذهب إلى **File** → **Sync Project with Gradle Files**
- انتظر حتى تكتمل المزامنة

### 2. تنظيف المشروع:
- اذهب إلى **Build** → **Clean Project**
- انتظر حتى يكتمل التنظيف

### 3. إعادة بناء المشروع:
- اذهب إلى **Build** → **Rebuild Project**
- انتظر حتى يكتمل البناء

### 4. إنشاء APK:
- اذهب إلى **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**

## إذا استمر الخطأ:

### جرب إصدارات أخرى من Capacitor:
```gradle
implementation "com.getcapacitor:core:5.5.1"
// أو
implementation "com.getcapacitor:core:5.4.0"
```

### تأكد من إعدادات Gradle:
- تأكد من أن Android Studio محدث
- تأكد من أن Android SDK محدث
- جرب **File** → **Invalidate Caches and Restart**

## معلومات المشروع:
- إصدار Capacitor: 5.6.0
- إصدار Android Gradle Plugin: 8.2.2
- إصدار Kotlin: 1.9.10
