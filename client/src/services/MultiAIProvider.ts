// خدمة إدارة متعددة مقدمي الخدمة للذكاء الاصطناعي
import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_KEYS, GEMINI_CONFIG, GROQ_CONFIG, OPENAI_CONFIG, APP_CONFIG } from '@/config/api-keys';

export type AIProvider = 'gemini' | 'groq' | 'openai';

export interface AIResponse {
  text: string;
  provider: AIProvider;
  confidence: number;
  tokensUsed: number;
  responseTime: number;
  timestamp: Date;
}

export interface AIRequest {
  message: string;
  context: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
}

class MultiAIProvider {
  private geminiAI: GoogleGenerativeAI | null = null;
  private geminiModel: any = null;
  private currentProvider: AIProvider = APP_CONFIG.DEFAULT_AI_PROVIDER as AIProvider;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeProviders();
  }

  // تهيئة جميع مقدمي الخدمة
  private async initializeProviders() {
    try {
      // تهيئة Gemini
      if (API_KEYS.GEMINI_API_KEY) {
        this.geminiAI = new GoogleGenerativeAI(API_KEYS.GEMINI_API_KEY);
        this.geminiModel = this.geminiAI.getGenerativeModel({
          model: GEMINI_CONFIG.MODEL,
          generationConfig: {
            temperature: GEMINI_CONFIG.TEMPERATURE,
            maxOutputTokens: GEMINI_CONFIG.MAX_OUTPUT_TOKENS,
            topP: GEMINI_CONFIG.TOP_P,
            topK: GEMINI_CONFIG.TOP_K,
          },
          safetySettings: [],
        });
      }

      // تهيئة Groq (إذا كان متوفراً)
      if (API_KEYS.GROQ_API_KEY) {
      }

      // تهيئة OpenAI (إذا كان متوفراً)
      if (API_KEYS.OPENAI_API_KEY) {
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize AI providers:', error);
      this.isInitialized = false;
    }
  }

  // إرسال طلب للذكاء الاصطناعي
  async sendRequest(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const provider = request.provider || this.currentProvider;

    try {
      switch (provider) {
        case 'gemini':
          return await this.sendGeminiRequest(request, startTime);
        case 'groq':
          return await this.sendGroqRequest(request, startTime);
        case 'openai':
          return await this.sendOpenAIRequest(request, startTime);
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error with ${provider}:`, error);
      
      // محاولة مقدم خدمة بديل
      if (provider !== 'gemini' && this.geminiAI) {
        return await this.sendGeminiRequest(request, startTime);
      }
      
      throw error;
    }
  }

  // إرسال طلب لـ Gemini
  private async sendGeminiRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    if (!this.geminiModel) {
      throw new Error('Gemini not initialized');
    }

    const prompt = this.buildPrompt(request.message, request.context);
    const result = await this.geminiModel.generateContent(prompt);
    const response = result.response.text();
    const responseTime = Date.now() - startTime;

    return {
      text: this.convertToAdaniDialect(response),
      provider: 'gemini',
      confidence: 0.9,
      tokensUsed: this.estimateTokens(response),
      responseTime,
      timestamp: new Date(),
    };
  }

  // إرسال طلب لـ Groq
  private async sendGroqRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    if (!API_KEYS.GROQ_API_KEY) {
      throw new Error('Groq API key not available');
    }

    // تنفيذ طلب Groq (يتطلب مكتبة Groq SDK)
    const response = await this.callGroqAPI(request);
    const responseTime = Date.now() - startTime;

    return {
      text: this.convertToAdaniDialect(response),
      provider: 'groq',
      confidence: 0.85,
      tokensUsed: this.estimateTokens(response),
      responseTime,
      timestamp: new Date(),
    };
  }

  // إرسال طلب لـ OpenAI
  private async sendOpenAIRequest(request: AIRequest, startTime: number): Promise<AIResponse> {
    if (!API_KEYS.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not available');
    }

    // تنفيذ طلب OpenAI (يتطلب مكتبة OpenAI SDK)
    const response = await this.callOpenAIAPI(request);
    const responseTime = Date.now() - startTime;

    return {
      text: this.convertToAdaniDialect(response),
      provider: 'openai',
      confidence: 0.9,
      tokensUsed: this.estimateTokens(response),
      responseTime,
      timestamp: new Date(),
    };
  }

  // استدعاء Groq API
  private async callGroqAPI(request: AIRequest): Promise<string> {
    // تنفيذ فعلي لـ Groq API
    // هذا مثال مبسط - يحتاج إلى مكتبة Groq SDK
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: this.buildPrompt(request.message, request.context),
          },
        ],
        temperature: request.temperature || GROQ_CONFIG.TEMPERATURE,
        max_tokens: request.maxTokens || GROQ_CONFIG.MAX_TOKENS,
        top_p: GROQ_CONFIG.TOP_P,
        top_k: GROQ_CONFIG.TOP_K,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from Groq';
  }

  // استدعاء OpenAI API
  private async callOpenAIAPI(request: AIRequest): Promise<string> {
    // تنفيذ فعلي لـ OpenAI API
    // هذا مثال مبسط - يحتاج إلى مكتبة OpenAI SDK
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.MODEL,
        messages: [
          {
            role: 'system',
            content: this.buildPrompt(request.message, request.context),
          },
        ],
        temperature: request.temperature || OPENAI_CONFIG.TEMPERATURE,
        max_tokens: request.maxTokens || OPENAI_CONFIG.MAX_TOKENS,
        top_p: OPENAI_CONFIG.TOP_P,
        frequency_penalty: OPENAI_CONFIG.FREQUENCY_PENALTY,
        presence_penalty: OPENAI_CONFIG.PRESENCE_PENALTY,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from OpenAI';
  }

  // بناء الـ Prompt
  private buildPrompt(message: string, context: string): string {
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

**السياق:**
${context}

**المحادثة:**
المستخدم: ${message}

رد باللهجة العدنية بشكل طبيعي وودود ومفيد. اجعل الرد قصيراً ومفيداً (أقل من 100 كلمة):`;
  }

  // تحويل للهجة العدنية
  private convertToAdaniDialect(text: string): string {
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

  // تقدير عدد الرموز
  private estimateTokens(text: string): number {
    // تقدير بسيط: 4 أحرف = رمز واحد تقريباً
    return Math.ceil(text.length / 4);
  }

  // تغيير مقدم الخدمة الحالي
  setProvider(provider: AIProvider): void {
    this.currentProvider = provider;
  }

  // الحصول على مقدم الخدمة الحالي
  getCurrentProvider(): AIProvider {
    return this.currentProvider;
  }

  // الحصول على معلومات مقدمي الخدمة
  getProvidersInfo(): Record<AIProvider, { available: boolean; model: string }> {
    return {
      gemini: {
        available: !!this.geminiAI,
        model: GEMINI_CONFIG.MODEL,
      },
      groq: {
        available: !!API_KEYS.GROQ_API_KEY,
        model: GROQ_CONFIG.MODEL,
      },
      openai: {
        available: !!API_KEYS.OPENAI_API_KEY,
        model: OPENAI_CONFIG.MODEL,
      },
    };
  }

  // فحص حالة التهيئة
  isReady(): boolean {
    return this.isInitialized;
  }

  // إعادة تهيئة
  async reinitialize(): Promise<void> {
    await this.initializeProviders();
  }
}

// إنشاء مثيل واحد من الخدمة
export const multiAIProvider = new MultiAIProvider();
export default multiAIProvider;
