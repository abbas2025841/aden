# 🗄️ دليل إعداد قاعدة البيانات - عدن لايف

## 🎯 **الهدف:**
إعداد قاعدة بيانات Supabase كاملة لتطبيق عدن لايف مع جميع الجداول والميزات المطلوبة.

---

## 🚀 **الخطوات:**

### **1. إنشاء حساب Supabase:**
1. اذهب إلى: https://supabase.com
2. انقر "Start your project"
3. سجل بحساب Google أو GitHub
4. أنشئ مشروع جديد باسم `aden-live-app`
5. اختر كلمة مرور قوية
6. اختر المنطقة: `Asia Pacific (Singapore)`

### **2. الحصول على مفاتيح API:**
1. اذهب إلى: `Settings > API`
2. انسخ المفاتيح التالية:
   - **Project URL**
   - **anon public key**
   - **service_role key**

### **3. إنشاء ملف البيئة:**
```bash
# انسخ ملف env-template.txt إلى .env
cp env-template.txt .env
```

### **4. تحديث ملف .env:**
```env
# استبدل [YOUR_PROJECT_ID] و [YOUR_PASSWORD] بالقيم الحقيقية
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:5432/postgres
VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **5. إنشاء الجداول:**
1. اذهب إلى: `SQL Editor` في Supabase Dashboard
2. انسخ والصق محتوى ملف `database-setup.sql`
3. اضغط "Run" لتنفيذ الكود

### **6. اختبار الاتصال:**
```bash
# تشغيل التطبيق
npm run dev

# فتح المتصفح
http://localhost:3020
```

---

## 📊 **الجداول المُنشأة:**

### **👤 نظام المستخدمين:**
- `users` - المستخدمين
- `user_sessions` - جلسات المستخدمين

### **💼 نظام الوظائف:**
- `jobs` - الوظائف
- `job_applications` - طلبات الوظائف

### **🏥 النظام الصحي:**
- `health_facilities` - المرافق الصحية
- `blood_banks` - بنوك الدم
- `health_evaluations` - تقييمات المرافق

### **⚡ نظام الكهرباء:**
- `electricity_reports` - بلاغات الكهرباء
- `collective_confirmations` - التأكيدات الجماعية
- `unique_users` - المستخدمين الفريدين

### **📊 الإحصائيات:**
- `system_stats` - إحصائيات النظام
- `usage_reports` - تقارير الاستخدام

---

## 🔧 **الميزات المُضافة:**

### **✅ الأمان:**
- Row Level Security (RLS)
- سياسات الأمان للمستخدمين
- تشفير البيانات الحساسة

### **⚡ الأداء:**
- فهارس محسنة للاستعلامات السريعة
- Views مُحسنة للبيانات الشائعة
- تحسين استعلامات JSON

### **🔄 التحديث التلقائي:**
- تحديث `updated_at` تلقائياً
- إحصائيات النظام المحدثة
- تتبع التغييرات

---

## 🧪 **اختبار قاعدة البيانات:**

### **1. اختبار الاتصال:**
```javascript
// في وحدة التحكم (F12)
const { data, error } = await supabase.from('users').select('*');
console.log('اتصال قاعدة البيانات:', data ? 'نجح' : 'فشل');
```

### **2. اختبار إدراج بيانات:**
```javascript
// إدراج مستخدم تجريبي
const { data, error } = await supabase
  .from('users')
  .insert([{ name: 'مستخدم تجريبي', email: 'test@example.com' }])
  .select();
```

### **3. اختبار جلب البيانات:**
```javascript
// جلب الوظائف النشطة
const { data, error } = await supabase
  .from('active_jobs')
  .select('*')
  .limit(5);
```

---

## 🚨 **استكشاف الأخطاء:**

### **مشكلة الاتصال:**
```bash
# تحقق من ملف .env
cat .env | grep SUPABASE

# تحقق من مفاتيح API
echo $VITE_SUPABASE_URL
```

### **مشكلة الجداول:**
```sql
-- تحقق من الجداول المُنشأة
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### **مشكلة الصلاحيات:**
```sql
-- تحقق من سياسات RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 📈 **المرحلة التالية:**

### **1. إدراج البيانات الوهمية:**
- وظائف تجريبية
- مرافق صحية حقيقية
- بيانات بنوك الدم

### **2. إعداد المصادقة:**
- تسجيل الدخول
- تسجيل الخروج
- إدارة الجلسات

### **3. اختبار الميزات:**
- نشر الوظائف
- البحث والفلترة
- تقييم المرافق

---

## 🎉 **النتيجة المتوقعة:**

بعد إكمال الإعداد، ستحصل على:
- ✅ قاعدة بيانات كاملة ومُحسنة
- ✅ نظام مصادقة آمن
- ✅ أداء عالي للاستعلامات
- ✅ أمان متقدم للبيانات
- ✅ إحصائيات مفصلة
- ✅ سهولة الصيانة والتطوير

---

**تم إنشاء هذا الدليل بواسطة Cursor الأسطوري** 🚀
