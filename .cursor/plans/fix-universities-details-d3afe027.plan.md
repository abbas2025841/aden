<!-- d3afe027-7a8f-460c-a0bf-c5ecb03c8e15 26c63d0e-b352-4146-8c27-04e03e4f4452 -->
# خطة إصلاح شاملة للتطبيق

## المشاكل المكتشفة

### 1. صفحة الرحلات `/flights`

**المشكلة:** الأزرار داكنة ولا يمكن قراءة النص في الوضع الداكن

**الملف:** `client/src/pages/flights.tsx`

**السبب:** استخدام `text-black` في الأزرار بدون `dark:text-white`

**الأسطر المتأثرة:**

- السطر 220: زر "جدول الرحلات"
- السطر 227: زر "الحجز"
- السطر 439: زر "اتصل"
- السطر 446: زر "موقع الشركة"

### 2. نوافذ التفاصيل في صفحات التعليم

**المشكلة:** نوافذ التفاصيل كبيرة جداً وتملأ شاشة الهاتف

**المكون:** `DetailsModal.tsx`

**السبب:** العرض 95vw مازال كبير للهواتف

**الحل المطلوب:**

- تصغير من 95vw إلى 85vw
- تغيير max-width من `sm:max-w-lg` إلى `sm:max-w-md`
- تغيير `lg:max-w-2xl` إلى `lg:max-w-xl`

### 3. أيقونة التطبيق الخارجية

**المشكلة:** الأيقونة لم تظهر في البناء السابق

**السبب المحتمل:**

- الأيقونات موجودة في mipmap ولكن قد تكون بحاجة لإعادة مزامنة
- أو تحتاج لأيقونة بصيغة مختلفة

**الحل:**

- التحقق من وجود الأيقونات في جميع مجلدات mipmap
- إعادة مزامنة Capacitor قبل البناء
- التأكد من تنظيف الـ build cache

## الحل التفصيلي

### 1. إصلاح أزرار الرحلات

في `client/src/pages/flights.tsx`:

```tsx
// من:
className="bg-white border-purple-300 text-black hover:bg-purple-50"
// إلى:
className="bg-white dark:bg-gray-700 border-purple-300 dark:border-gray-600 text-black dark:text-white hover:bg-purple-50 dark:hover:bg-gray-600"
```

### 2. تصغير نوافذ التفاصيل

في `DetailsModal.tsx` السطر 116:

```tsx
// من:
className="details-modal-mobile w-[95vw] max-w-[95vw] sm:max-w-lg lg:max-w-2xl"
// إلى:
className="details-modal-mobile w-[85vw] max-w-[85vw] sm:max-w-md lg:max-w-xl"
```

### 3. التأكد من أيقونة التطبيق

- تنظيف build cache: `cd android && ./gradlew clean`
- إعادة مزامنة: `npm run cap:sync`
- التأكد من الأيقونات في mipmap-*/

## خطوات التنفيذ

1. تعديل `client/src/pages/flights.tsx` - إصلاح جميع الأزرار الداكنة
2. تعديل `client/src/components/DetailsModal.tsx` - تصغير العرض
3. التحقق من أيقونات mipmap
4. تحديث `CHANGELOG.md` بجميع الإصلاحات
5. حفظ التعديلات في Git
6. تنظيف build cache
7. بناء APK نهائي

## الملفات المتأثرة

- `client/src/pages/flights.tsx` - إصلاح الأزرار
- `client/src/components/DetailsModal.tsx` - تصغير النوافذ
- `android/app/src/main/res/mipmap-*/` - التحقق من الأيقونات
- `CHANGELOG.md` - توثيق جميع الإصلاحات

### To-dos

- [ ] إصلاح زر التفاصيل ليستخدم handleShowDetails بدلاً من setSelectedUniversity فقط
- [ ] إضافة مكون DetailsModal في نهاية صفحة universities-directory مع sections منظمة
- [ ] تحديث معلومات الجامعات الموجودة (جامعة عدن، جامعة العلوم والتكنولوجيا) بالمعلومات الرسمية
- [ ] إضافة جامعة القرآن الكريم والعلوم الإسلامية - فرع عدن
- [ ] اختبار نافذة التفاصيل للتأكد من عرض جميع المعلومات بشكل صحيح