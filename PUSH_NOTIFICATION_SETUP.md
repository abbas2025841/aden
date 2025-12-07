# إعداد الإشعارات الخارجية لمتتبع انقطاع الكهرباء

## نظرة عامة
يستخدم النظام Web Push API لإرسال إشعارات خارجية للمستخدمين عند تغير حالة الكهرباء في المديريات التي اشتركوا فيها.

## المتطلبات
- Supabase (قاعدة بيانات + Edge Functions)
- HTTPS (مطلوب لخدم Workers والإشعارات)
- متصفح حديث يدعم Web Push API

## خطوات الإعداد

### 1. إنشاء مفاتيح VAPID
```bash
# تثبيت web-push
npm install -g web-push

# إنشاء مفاتيح VAPID
web-push generate-vapid-keys

# سيتم عرض:
# Public Key: YOUR_PUBLIC_KEY_HERE
# Private Key: YOUR_PRIVATE_KEY_HERE
```

### 2. إعداد متغيرات البيئة في Supabase

#### في لوحة تحكم Supabase:
1. اذهب إلى Settings > Edge Functions
2. أضف المتغيرات التالية:
   ```
   VAPID_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
   VAPID_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
   VAPID_SUBJECT=mailto:your-email@example.com
   ```

### 3. تحديث الكود

#### في `outage-tracker.tsx`:
```typescript
// استبدل بمفتاح VAPID العام الخاص بك
const VAPID_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE';
```

#### في `.env` للـ client:
```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 4. نشر Edge Function

```bash
# الدخول لمجلد functions
cd supabase/functions

# نشر الـ Edge Function
supabase functions deploy send-push-notification
```

### 5. تطبيق جداول Supabase

```bash
# تطبيق migration
supabase db push
```

## اختبار النظام

### 1. اختبار اشتراك الإشعارات
1. افتح التطبيق في متصفح يدعم الإشعارات
2. اضغط على زر الجرس بجانب أي مديرية
3. اسمح بالإشعارات في المتصفح
4. تحقق من وحدة التحكم لرسائل النجاح

### 2. اختبار إرسال الإشعارات
```bash
# اختبار Edge Function مباشرة
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-push-notification' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "districtId": "1",
    "districtName": "كريتر",
    "status": "off",
    "title": "اختبار انقطاع الكهرباء",
    "body": "هذا إشعار اختبار"
  }'
```

## استكشاف الأخطاء

### مشاكل شائعة:

1. **الإشعارات لا تعمل**
   - تأكد من أن الموقع يعمل عبر HTTPS
   - تحقق من إذن الإشعارات في المتصفح
   - تأكد من أن Service Worker يعمل

2. **فشل اشتراك Push**
   - تحقق من مفاتيح VAPID
   - تأكد من متغيرات البيئة في Supabase
   - تحقق من وحدة تحكم المتصفح للأخطاء

3. **Edge Function لا تعمل**
   - تحقق من نشر الـ Function بنجاح
   - تأكد من متغيرات البيئة مضافة
   - تحقق من سجلات الـ Function في Supabase

## تسعير واستضافة

### Supabase (مجاني):
- 500MB تخزين
- 50,000 Edge Function calls/شهر
- 2GB bandwidth/شهر
- Realtime connections غير محدودة

### Frontend (خيارات مجانية):
- **Netlify**: مجاني للمواقع الشخصية
- **Vercel**: مجاني للمشاريع الشخصية
- **GitHub Pages**: مجاني للمواقع الثابتة

## ملاحظات أمنية
- احتفظ بمفتاح VAPID الخاص في مكان آمن
- لا تضع مفاتيح خاصة في الكود frontend
- استخدم متغيرات البيئة دائماً للبيانات الحساسة

## تحسينات مستقبلية
- إضافة إشعارات للمناطق الفرعية
- تخصيص صوت الإشعار
- إدارة الإشعارات من لوحة تحكم
- إحصائيات الإشعارات وتقارير
