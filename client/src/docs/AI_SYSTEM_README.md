# نظام الذكاء الاصطناعي المتقدم - عدناوي

## نظرة عامة

نظام ذكي متكامل يجمع بين الردود المحلية والذكاء الاصطناعي الخارجي (Gemini 2.0 Flash) مع إدارة متقدمة للطلبات والحدود.

## المكونات الرئيسية

### 1. AdnawiAI Service (`services/AdnawiAI.ts`)
- **الوظيفة**: التكامل مع Google Gemini 2.0 Flash
- **المميزات**:
  - تحويل تلقائي للهجة العدنية
  - إدارة السياق والمحادثة
  - معالجة الأخطاء والاستثناءات
  - إعدادات الأمان والفلترة

### 2. MultiAIProvider Service (`services/MultiAIProvider.ts`)
- **الوظيفة**: إدارة متعددة مقدمي الخدمة
- **المميزات**:
  - دعم Gemini, Groq, OpenAI
  - تبديل تلقائي عند الفشل
  - إدارة موحدة للطلبات
  - تحسين الأداء والموثوقية

### 3. DailyRequestManager Service (`services/DailyRequestManager.ts`)
- **الوظيفة**: إدارة الطلبات اليومية والحدود
- **المميزات**:
  - حد يومي: 15 طلب
  - Rate Limiting: 5 طلبات/دقيقة
  - تتبع الإحصائيات المفصلة
  - تصدير واستيراد البيانات
  - تنظيف تلقائي للبيانات القديمة

### 4. AdnawiChat Component (`components/AdnawiChat.tsx`)
- **الوظيفة**: واجهة المحادثة المتقدمة
- **المميزات**:
  - دعم الصوت (Text-to-Speech)
  - التعرف على الكلام (Speech Recognition)
  - رسائل متحركة
  - إدارة الحالة في الوقت الفعلي
  - واجهة مستخدم متجاوبة

### 5. Request Stats Page (`pages/request-stats.tsx`)
- **الوظيفة**: مراقبة وإحصائيات الاستخدام
- **المميزات**:
  - رسوم بيانية تفاعلية
  - إحصائيات مفصلة
  - تحذيرات ذكية
  - إدارة البيانات
  - نصائح للاستخدام الأمثل

## الإعداد والتكوين

### 1. مفاتيح API (`config/api-keys.ts`)

```typescript
export const API_KEYS = {
  GEMINI_API_KEY: 'AIzaSy...', // مجاني من Google AI Studio
  GROQ_API_KEY: '', // اختياري
  OPENAI_API_KEY: '', // اختياري
};
```

### 2. حدود الاستخدام

```typescript
export const USAGE_LIMITS = {
  DAILY_REQUESTS: 15, // حد يومي
  MAX_TOKENS_PER_REQUEST: 512, // حد الرموز
  RATE_LIMIT_WINDOW: 60 * 1000, // نافذة Rate Limit
  RATE_LIMIT_REQUESTS: 5, // طلبات في الدقيقة
};
```

### 3. إعدادات الأمان

```typescript
export const SECURITY_CONFIG = {
  ENABLE_CONTENT_FILTERING: true,
  ENABLE_RATE_LIMITING: true,
  ENABLE_LOGGING: true,
  LOG_LEVEL: 'info',
};
```

## الاستخدام

### 1. المحادثة الأساسية

```typescript
import { adnawiAI } from '@/services/AdnawiAI';

const response = await adnawiAI.chat('فين في صيدلية قريب؟', context);
console.log(response.text); // "أكيد يا حبيبي، الصيدلية المركزية..."
```

### 2. إدارة الطلبات

```typescript
import { dailyRequestManager } from '@/services/DailyRequestManager';

// فحص الحدود
if (dailyRequestManager.canMakeRequest()) {
  // إرسال الطلب
  const success = dailyRequestManager.recordRequest({
    provider: 'gemini',
    tokensUsed: 150,
    responseTime: 1200,
    success: true,
  });
}

// الحصول على الإحصائيات
const stats = dailyRequestManager.getTodayStats();
```

### 3. متعدد مقدمي الخدمة

```typescript
import { multiAIProvider } from '@/services/MultiAIProvider';

const response = await multiAIProvider.sendRequest({
  message: 'مرحبا',
  context: 'عدن',
  provider: 'gemini', // أو 'groq' أو 'openai'
});
```

## المميزات المتقدمة

### 1. تحويل اللهجة العدنية

النظام يحول تلقائياً النصوص إلى اللهجة العدنية:

```typescript
// المدخل: "مرحبا، كيف حالك؟"
// المخرج: "حبيبي ياخوي، شلونك؟"
```

### 2. إدارة السياق

```typescript
const context: AdnawiContext = {
  userLocation: 'عدن',
  currentPage: '/health',
  conversationHistory: ['رسالة سابقة'],
  userPreferences: {
    language: 'ar',
    dialect: 'adeni',
  },
};
```

### 3. معالجة الأخطاء

```typescript
try {
  const response = await adnawiAI.chat(message, context);
} catch (error) {
  // معالجة تلقائية للأخطاء
  // العودة للردود المحلية
}
```

## الإحصائيات والمراقبة

### 1. إحصائيات اليوم

- إجمالي الطلبات
- الطلبات الناجحة/الفاشلة
- متوسط وقت الاستجابة
- استخدام مقدمي الخدمة
- الرموز المستخدمة

### 2. حدود الاستخدام

- شريط تقدم الحد اليومي
- تحذيرات ذكية
- إعادة تعيين تلقائية
- رسائل واضحة للمستخدم

### 3. تصدير البيانات

```typescript
// تصدير البيانات
const data = dailyRequestManager.exportData();

// استيراد البيانات
dailyRequestManager.importData(data);
```

## الأمان والخصوصية

### 1. فلترة المحتوى

- فحص المحتوى الضار
- فلترة الكلمات غير المناسبة
- حماية من الهجمات

### 2. Rate Limiting

- منع إساءة الاستخدام
- حماية من DDoS
- توزيع عادل للموارد

### 3. تسجيل العمليات

- تتبع جميع الطلبات
- تسجيل الأخطاء
- مراقبة الأداء

## التطوير والصيانة

### 1. إضافة مقدم خدمة جديد

```typescript
// في MultiAIProvider.ts
private async sendNewProviderRequest(request: AIRequest): Promise<AIResponse> {
  // تنفيذ مقدم الخدمة الجديد
}
```

### 2. تخصيص اللهجة

```typescript
// في AdnawiAI.ts
private convertToAdaniDialect(text: string): string {
  // إضافة كلمات جديدة
  const newDialectMap = {
    'كلمة جديدة': 'ترجمة عدنية',
  };
}
```

### 3. تحديث الحدود

```typescript
// في api-keys.ts
export const USAGE_LIMITS = {
  DAILY_REQUESTS: 20, // زيادة الحد
  // ...
};
```

## استكشاف الأخطاء

### 1. مشاكل الاتصال

```typescript
// فحص حالة Gemini
const systemInfo = adnawiAI.getSystemInfo();
console.log(systemInfo.isReady); // true/false
```

### 2. مشاكل الحدود

```typescript
// فحص الحدود
const limitInfo = dailyRequestManager.getDailyLimitInfo();
console.log(limitInfo.remaining); // عدد الطلبات المتبقية
```

### 3. مشاكل الصوت

```typescript
// فحص دعم الصوت
if ('speechSynthesis' in window) {
  // دعم Text-to-Speech
}

if ('webkitSpeechRecognition' in window) {
  // دعم Speech Recognition
}
```

## التحديثات المستقبلية

### 1. ميزات مخططة

- [ ] دعم المزيد من مقدمي الخدمة
- [ ] تحسين دقة تحويل اللهجة
- [ ] إضافة دعم الصور
- [ ] تحسين واجهة المحادثة
- [ ] إضافة إشعارات ذكية

### 2. تحسينات الأداء

- [ ] تخزين مؤقت للردود
- [ ] ضغط البيانات
- [ ] تحسين استهلاك الذاكرة
- [ ] تحسين سرعة الاستجابة

### 3. ميزات الأمان

- [ ] تشفير البيانات
- [ ] مصادقة المستخدمين
- [ ] مراجعة المحتوى
- [ ] حماية من التلاعب

## الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:

1. تحقق من صفحة الإحصائيات (`/request-stats`)
2. راجع سجلات المتصفح
3. تحقق من حالة مقدمي الخدمة
4. جرب إعادة تعيين البيانات

---

**تم تطوير هذا النظام لخدمة مجتمع عدن بأفضل الطرق التقنية مع الحفاظ على الهوية المحلية واللهجة العدنية الأصيلة.**
