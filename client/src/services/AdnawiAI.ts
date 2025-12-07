// خدمة التكامل مع Gemini 2.0 Flash للمساعد الذكي عدني
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEYS, GEMINI_CONFIG } from '@/config/api-keys';

interface AdnawiResponse {
  text: string;
  confidence: number;
  isLocalResponse: boolean;
  timestamp: Date;
}

interface AdnawiContext {
  userLocation?: string;
  currentPage?: string;
  conversationHistory: string[];
  userPreferences?: {
    language: 'ar' | 'en';
    dialect: 'adeni' | 'standard';
  };
}

class AdnawiAI {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized: boolean = false;
  
  constructor() {
    this.initializeGemini();
  }

  // تهيئة Gemini
  private async initializeGemini() {
    try {
      // استخدام مفتاح API من ملف الإعدادات
      const apiKey = API_KEYS.GEMINI_API_KEY;
      
      if (apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ 
          model: GEMINI_CONFIG.MODEL,
          generationConfig: {
            temperature: GEMINI_CONFIG.TEMPERATURE,
            maxOutputTokens: GEMINI_CONFIG.MAX_OUTPUT_TOKENS,
            topP: GEMINI_CONFIG.TOP_P,
            topK: GEMINI_CONFIG.TOP_K,
          }
        });
        this.isInitialized = true;
        console.log('✅ Gemini 2.0 Flash initialized successfully with API key');
      } else {
        console.warn('⚠️ Gemini API key not found, using local responses only');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Gemini:', error);
      this.isInitialized = false;
    }
  }

  // المحادثة الرئيسية
  async chat(userMessage: string, context: AdnawiContext): Promise<AdnawiResponse> {
    try {
      if (this.isInitialized && this.model) {
        // استخدام Gemini للردود المتقدمة
        const geminiResponse = await this.chatWithGemini(userMessage, context);
        return {
          text: geminiResponse,
          confidence: 0.9,
          isLocalResponse: false,
          timestamp: new Date(),
        };
      } else {
        // استخدام الردود المحلية كبديل
        const localResponse = this.getLocalResponse(userMessage, context);
        return {
          text: localResponse,
          confidence: 0.7,
          isLocalResponse: true,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      console.error('Error in chat:', error);
      // العودة للردود المحلية في حالة الخطأ
      const localResponse = this.getLocalResponse(userMessage, context);
      return {
        text: localResponse,
        confidence: 0.5,
        isLocalResponse: true,
        timestamp: new Date(),
      };
    }
  }

  // المحادثة مع Gemini
  private async chatWithGemini(userMessage: string, context: AdnawiContext): Promise<string> {
    const prompt = this.buildAdnawiPrompt(userMessage, context);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return this.convertToAdaniDialect(response);
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  // بناء الـ Prompt للهوية العدنية
  private buildAdnawiPrompt(message: string, context: AdnawiContext): string {
    const locationInfo = context.userLocation ? `الموقع الحالي: ${context.userLocation}` : '';
    const pageInfo = context.currentPage ? `الصفحة الحالية: ${context.currentPage}` : '';
    const historyInfo = context.conversationHistory.length > 0 
      ? `تاريخ المحادثة: ${context.conversationHistory.slice(-3).join(', ')}`
      : '';

    return `
أنت "عدني"، المساعد الذكي لمدينة عدن، اليمن. 

**شخصيتك:**
- ودود وبشوش ومحب لمساعدة أهل عدن
- تتحدث باللهجة العدنية بشكل طبيعي ومريح
- تستخدم كلمات عدنية مثل: "حبايب"، "يا عيال"، "مالكش حل"، "مافيش مشكلة"، "خلاص"، "تعال"
- تضيف تعابير عدنية مثل: "الله يعطيك العافية"، "تسلم يا غالي"، "حياك الله"
- فكاهي ومتفائل ولكن ليس سخيف
- مفيد ومفصل في الإجابات
- تفهم المشاكل اليومية لأهل عدن

**معلوماتك عن عدن:**
- عدن مدينة ساحلية جميلة في اليمن
- مشهورة بمينائها التاريخي
- أهلها ودودون ومضيافون
- فيها خدمات متنوعة: المياه، الكهرباء، الصحة، الوظائف
- اللهجة العدنية مميزة ومحبوبة

**السياق الحالي:**
${locationInfo}
${pageInfo}
${historyInfo}

**المحادثة:**
المستخدم: ${message}

رد باللهجة العدنية بشكل طبيعي وودود ومفيد. اجعل الرد قصيراً ومفيداً (أقل من 100 كلمة):`;
  }

  // تحويل النص للهجة العدنية
  private convertToAdaniDialect(text: string): string {
    // قاموس تحويل للهجة العدنية
    const dialectMap: Record<string, string> = {
      'مرحبا': 'حبيبي ياخوي',
      'شكرا': 'تسلم يا غالي',
      'كيف': 'شكلك حارق',
      'ماذا': 'إيش',
      'نعم': 'إيوة',
      'لا': 'لا',
      'موجود': 'اب عليك بقلب التطبيق قلب عشا اطلعه لك',
      'غير موجود': 'مالاقيت /ماهلوش/مافيش',
      'جيد': 'تمام',
      'ممتاز': 'مالكش حل ياليد',
      'الآن': 'دلحين',
      'اليوم': 'اليوم ذا',
      'أريد': 'أشتي',
      'ذاهب': 'رايح',
      'تعال': 'تعال فين رايح مالك كذا تسوي',
      'أين': 'فين',
      'متى': 'إمتى',
      'لماذا': 'ليش',
      'كيف حالك': 'شلونك',
      'أهلاً وسهلاً': 'أهلاً وسهلاً',
      'بالتوفيق': 'الله يعطيك العافية',
      'لا مشكلة': 'مافيش مشكلة',
      'حسناً': 'تمام',
      'ممتاز جداً': 'مالكش حل ياليد',
      'شكراً لك': 'تسلم يا غالي',
      'عفواً': 'حياك الله',
      'أعتذر': 'معذرة',
      'من فضلك': 'لو سمحت',
      'أرجوك': 'أرجوك',
      'نعم بالطبع': 'إيوة أكيد',
      'لا شكراً': 'لا شكراً',
      'أحتاج': 'أشتي',
      'أبحث عن': 'أدور على',
      'أجد': 'ألاقي',
      'أقرب': 'أقرب',
      'بعيد': 'بعيد',
      'قريب': 'قريب',
      'سريع': 'سريع',
      'بطيء': 'بطيء',
      'سهل': 'سهل',
      'صعب': 'صعب',
      'مهم': 'مهم',
      'غير مهم': 'مش مهم',
      'مفيد': 'مفيد',
      'غير مفيد': 'مش مفيد',
      'جيد جداً': 'زين كتير',
      'سيء': 'زين مش',
      'رائع': 'زين كتير',
      'جميل': 'زين',
      'قبيح': 'مش زين',
      'كبير': 'كبير',
      'صغير': 'صغير',
      'طويل': 'طويل',
      'قصير': 'قصير',
      'عريض': 'عريض',
      'ضيق': 'ضيق',
      'ثقيل': 'ثقيل',
      'خفيف': 'خفيف',
      'ساخن': 'ساخن',
      'بارد': 'بارد',
      'دافئ': 'دافئ',
      'رطب': 'رطب',
      'جاف': 'جاف',
      'نظيف': 'نظيف',
      'وسخ': 'وسخ',
      'جديد': 'جديد',
      'قديم': 'قديم',
      'حديث': 'حديث',
      'تقليدي': 'تقليدي',
    };

    let adaniText = text;
    
    // تطبيق التحويلات
    Object.entries(dialectMap).forEach(([standard, adani]) => {
      const regex = new RegExp(`\\b${standard}\\b`, 'gi');
      adaniText = adaniText.replace(regex, adani);
    });

    // إضافة تعابير عدنية إضافية
    adaniText = this.addAdaniExpressions(adaniText);

    return adaniText;
  }

  // إضافة تعابير عدنية
  private addAdaniExpressions(text: string): string {
    // إضافة تعابير عدنية حسب السياق
    if (text.includes('مساعدة') || text.includes('مساعدة')) {
      text = text.replace(/مساعدة/g, 'شبيك لبيك انا بين ايديك');
    }
    
    if (text.includes('سهل') || text.includes('سهولة')) {
      text = text.replace(/سهل/g, 'بس سهولة');
    }
    
    if (text.includes('أكيد') || text.includes('بالطبع')) {
      text = text.replace(/أكيد/g, 'أكيد يا حبيبي');
    }
    
    if (text.includes('مرحبا') || text.includes('أهلاً')) {
      text = text.replace(/مرحبا/g, 'يا مرحبا');
    }

    return text;
  }

  // الردود المحلية كبديل
  private getLocalResponse(_userMessage: string, _context: any): string {
    const responses = [
      'أكيد يا حبيبي! أنا عدني، مساعدك الذكي لخدمات عدن. كيف أقدر أساعدك؟',
      'شبيك لبيك انا بين ايديك! أنا عدني، مساعدك الذكي. في إيش أقدر أساعدك؟',
      'يا مرحبا! أنا عدني، مساعدك الذكي لخدمات عدن. كيف أقدر أساعدك؟',
      'بس سهولة يا أخي! أنا عدني، مساعدك الذكي. في إيش أقدر أساعدك اليوم؟',
      'أكيد! أنا عدني، مساعدك الذكي لخدمات عدن. كيف أقدر أساعدك؟',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // فحص حالة التهيئة
  isGeminiReady(): boolean {
    return this.isInitialized && this.model !== null;
  }

  // إعادة تهيئة Gemini
  async reinitialize(): Promise<void> {
    await this.initializeGemini();
  }

  // الحصول على معلومات النظام
  getSystemInfo(): { isReady: boolean; model: string; hasAPIKey: boolean } {
    return {
      isReady: this.isInitialized,
      model: GEMINI_CONFIG.MODEL,
      hasAPIKey: !!API_KEYS.GEMINI_API_KEY,
    };
  }
}

// إنشاء مثيل واحد من الخدمة
export const adnawiAI = new AdnawiAI();
export default adnawiAI;
