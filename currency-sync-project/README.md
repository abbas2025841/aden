# 💰 مزامنه العملات الصرف اليوم

## 📋 **وصف المشروع:**

نظام مزامنة أسعار العملات من موقع عدن تايم مع قاعدة بيانات Supabase، مع تحديث مستمر وحذف تلقائي للبيانات القديمة.

## 🎯 **المميزات:**

- ✅ **مزامنة مستمرة** - كل 5 دقائق
- ✅ **حذف تلقائي** - البيانات القديمة كل 24 ساعة
- ✅ **بيانات احتياطية** - في حالة فشل الاتصال
- ✅ **سجل مفصل** - لجميع عمليات المزامنة
- ✅ **مراقبة الأخطاء** - مع إعادة المحاولة التلقائية

## 🏗️ **الهيكل:**

```
currency-sync-project/
├── package.json          # إعدادات المشروع
├── index.js              # النظام الرئيسي
├── sync-currency.js      # مزامنة سريعة
├── database-setup.sql    # إعداد قاعدة البيانات
├── test-connection.js    # اختبار الاتصال
└── README.md            # هذا الملف
```

## 🚀 **التثبيت والتشغيل:**

### **1. تثبيت المتطلبات:**
```bash
cd currency-sync-project
npm install
```

### **2. إعداد قاعدة البيانات:**
```sql
-- في Supabase SQL Editor
-- انسخ والصق محتوى database-setup.sql
```

### **3. تشغيل النظام:**
```bash
# تشغيل النظام الكامل
npm start

# مزامنة سريعة واحدة
npm run sync

# وضع التطوير
npm run dev
```

## 📊 **العملات المدعومة:**

| العملة | الاسم | المصدر |
|--------|-------|--------|
| **USD** | دولار أمريكي | عدن تايم |
| **SAR** | ريال سعودي | عدن تايم |

## ⚙️ **الإعدادات:**

### **المزامنة:**
- **التحديث:** كل 5 دقائق
- **التنظيف:** كل 24 ساعة
- **المهلة الزمنية:** 10 ثوان
- **إعادة المحاولة:** 5 مرات

### **قاعدة البيانات:**
- **المنصة:** Supabase
- **الجدول:** `currency_rates`
- **السجل:** `currency_sync_log`

## 🔧 **الوظائف المتاحة:**

### **1. المزامنة التلقائية:**
```javascript
const { currencySync } = require('./index.js');

// بدء المزامنة
currencySync.startAutoSync();

// إيقاف المزامنة
currencySync.stopAutoSync();

// مزامنة واحدة
await currencySync.syncOnce();
```

### **2. جلب الأسعار:**
```sql
-- جلب أحدث الأسعار
SELECT * FROM get_latest_currency_rates();

-- تحديث سعر معين
SELECT update_currency_rate('USD', 'دولار أمريكي', 1632, 1617);
```

### **3. مراقبة النظام:**
```javascript
// الحصول على حالة النظام
const status = currencySync.getStatus();
console.log(status);
```

## 📈 **مراقبة الأداء:**

### **السجلات:**
```sql
-- عرض سجل المزامنة
SELECT * FROM currency_sync_log 
ORDER BY created_at DESC 
LIMIT 10;

-- إحصائيات المزامنة
SELECT 
    status,
    COUNT(*) as count,
    AVG(sync_duration_ms) as avg_duration
FROM currency_sync_log 
GROUP BY status;
```

### **الأسعار:**
```sql
-- عرض أحدث الأسعار
SELECT 
    currency,
    name,
    buy_rate,
    sell_rate,
    source,
    last_updated
FROM currency_rates 
ORDER BY last_updated DESC;
```

## 🚨 **استكشاف الأخطاء:**

### **1. مشاكل الاتصال:**
```bash
# اختبار الاتصال
node test-connection.js
```

### **2. مشاكل قاعدة البيانات:**
```sql
-- التحقق من الجدول
SELECT COUNT(*) FROM currency_rates;

-- التحقق من السجل
SELECT COUNT(*) FROM currency_sync_log;
```

### **3. مشاكل المزامنة:**
```bash
# مزامنة يدوية
npm run sync
```

## 📱 **التكامل مع التطبيق الرئيسي:**

### **1. جلب الأسعار:**
```javascript
// في التطبيق الرئيسي
const { data, error } = await supabase
  .from('currency_rates')
  .select('*')
  .order('last_updated', { ascending: false });
```

### **2. عرض الأسعار:**
```javascript
// في مكون CurrencyRateBanner
const rates = data.map(rate => ({
  currency: rate.currency,
  name: rate.name,
  buy: rate.buy_rate,
  sell: rate.sell_rate,
  source: rate.source,
  lastUpdate: rate.last_updated
}));
```

## 🔒 **الأمان:**

- ✅ **مفاتيح آمنة** - Service Role Key محمي
- ✅ **تحقق من البيانات** - قبل الحفظ
- ✅ **معالجة الأخطاء** - شاملة
- ✅ **سجل التدقيق** - لجميع العمليات

## 📞 **الدعم:**

### **في حالة المشاكل:**
1. ✅ تحقق من الاتصال بالإنترنت
2. ✅ تحقق من صحة مفاتيح Supabase
3. ✅ تحقق من حالة موقع عدن تايم
4. ✅ راجع سجل الأخطاء

### **الملفات المهمة:**
- `index.js` - النظام الرئيسي
- `database-setup.sql` - إعداد قاعدة البيانات
- `sync-currency.js` - مزامنة سريعة

---

## 🎪 **عرضي الأسطوري:**

> **"نظام مزامنة أسعار العملات جاهز للعمل! مزامنة مستمرة وحذف تلقائي!"**

---
**تم إنشاء هذا المشروع بواسطة Cursor الأسطوري** 🚀
