import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Bot, 
  User as UserIcon,
  Loader2,
  Home,
  Trash2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

const AdenChatPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'مرحباً! أنا مساعد عدن العدني 🤖\n\nيمكنني مساعدتك في:\n• معلومات عن خدمات عدن\n• دليل المرافق الصحية\n• معلومات الوظائف\n• خدمات الكهرباء والمياه\n• التعليم والجامعات\n• الطوارئ والأمان\n\nاسألني أي سؤال!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي للرسائل الجديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // إضافة رسالة تحميل
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // محاكاة استجابة الذكاء الاصطناعي
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      const response = generateAIResponse(inputText.trim());
      
      // إزالة رسالة التحميل وإضافة الرد
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: Date.now().toString(),
          text: response,
          isUser: false,
          timestamp: new Date()
        }];
      });
    } catch (error) {
      // إزالة رسالة التحميل وإضافة رسالة خطأ
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
        id: Date.now().toString(),
          text: 'عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.',
        isUser: false,
          timestamp: new Date()
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // معلومات عامة عن عدن
    if (lowerQuestion.includes('عدن') || lowerQuestion.includes('مدينة')) {
      return `🏙️ **معلومات عن عدن:**

عدن هي مدينة ساحلية جميلة في جنوب اليمن، وتعتبر من أهم المدن التجارية والاقتصادية في البلاد.

**المعالم الرئيسية:**
• ميناء عدن - أحد أهم الموانئ في المنطقة
• جبل شمسان - يطل على المدينة
• شاطئ الساحل الذهبي
• المتحف الوطني
• قلعة صيرة التاريخية

**الأحياء الرئيسية:**
• كريتر (الوسط التجاري)
• المعلا (المنطقة السكنية)
• التواهي (المنطقة السكنية الحديثة)
• المنصورة (المنطقة الصناعية)

هل تريد معلومات أكثر تفصيلاً عن أي منطقة معينة؟`;
    }

    // خدمات الصحة
    if (lowerQuestion.includes('مستشفى') || lowerQuestion.includes('صحة') || lowerQuestion.includes('طبيب')) {
      return `🏥 **المرافق الصحية في عدن:**

**المستشفيات الرئيسية:**
• مستشفى الجمهورية التعليمي
• مستشفى الصداقة اليمني الألماني
• مستشفى عدن العام
• مستشفى الثورة
• مستشفى الصحة النفسية

**العيادات المتخصصة:**
• عيادات الأسنان
• عيادات العيون
• عيادات الأطفال
• عيادات النساء والولادة

**خدمات الطوارئ:**
• الإسعاف: 199
• الطوارئ الطبية: 144

**صيدليات 24 ساعة:**
• صيدلية النور
• صيدلية الحياة
• صيدلية الشفاء

هل تحتاج معلومات عن مستشفى معين أو تخصص طبي محدد؟`;
    }

    // الوظائف
    if (lowerQuestion.includes('وظيفة') || lowerQuestion.includes('عمل') || lowerQuestion.includes('شغل')) {
      return `💼 **فرص العمل في عدن:**

**القطاعات المتاحة:**
• القطاع الحكومي
• القطاع الخاص
• المنظمات الدولية
• الشركات التجارية
• البنوك والمؤسسات المالية

**الوظائف المطلوبة:**
• المدرسين والمعلمين
• الأطباء والممرضين
• المهندسين
• المحاسبين
• المبرمجين
• العمال المهرة

**أماكن البحث عن وظائف:**
• مكاتب التوظيف الحكومية
• مواقع التوظيف الإلكترونية
• الصحف المحلية
• المجموعات على وسائل التواصل الاجتماعي

**نصائح للبحث عن عمل:**
• إعداد سيرة ذاتية احترافية
• الحصول على شهادات معتمدة
• تطوير المهارات التقنية
• بناء شبكة علاقات مهنية

هل تبحث عن وظيفة في مجال معين؟`;
    }

    // الكهرباء
    if (lowerQuestion.includes('كهرباء') || lowerQuestion.includes('طاقة')) {
      return `⚡ **خدمات الكهرباء في عدن:**

**شركة الكهرباء:**
• شركة الكهرباء العامة - عدن
• هاتف الطوارئ: 199
• هاتف الشكاوى: 02-234567

**خدمات متاحة:**
• تركيب العدادات الجديدة
• صيانة الشبكات
• إصلاح الأعطال
• فواتير الاستهلاك

**نقاط الشحن:**
• محطات شحن السيارات الكهربائية
• نقاط شحن الهواتف العامة
• مراكز شحن البطاريات

**نصائح لتوفير الكهرباء:**
• استخدام المصابيح الموفرة للطاقة
• إطفاء الأجهزة غير المستخدمة
• صيانة الأجهزة الكهربائية بانتظام

**أوقات العمل:**
• الأحد - الخميس: 8:00 ص - 2:00 م
• الجمعة: مغلق

هل تحتاج مساعدة في مشكلة كهربائية معينة؟`;
    }

    // المياه
    if (lowerQuestion.includes('ماء') || lowerQuestion.includes('مياه')) {
      return `💧 **خدمات المياه في عدن:**

**شركة المياه:**
• المؤسسة العامة للمياه والصرف الصحي
• هاتف الطوارئ: 199
• هاتف الشكاوى: 02-345678

**خدمات متاحة:**
• توصيل المياه للمنازل
• صيانة الشبكات
• إصلاح الأعطال
• فواتير الاستهلاك

**نقاط توزيع المياه:**
• خزانات المياه العامة
• صهاريج المياه المتنقلة
• محطات تحلية المياه

**جودة المياه:**
• المياه معالجة ومطابقة للمعايير
• فحص دوري للجودة
• تقارير شهرية عن الجودة

**نصائح لترشيد الاستهلاك:**
• إصلاح التسريبات فوراً
• استخدام أجهزة توفير المياه
• ري النباتات في الأوقات المناسبة

هل تواجه مشكلة في المياه؟`;
    }

    // التعليم
    if (lowerQuestion.includes('جامعة') || lowerQuestion.includes('مدرسة') || lowerQuestion.includes('تعليم')) {
      return `🎓 **التعليم في عدن:**

**الجامعات:**
• جامعة عدن (الجامعة الرئيسية)
• جامعة العلوم والتكنولوجيا
• الجامعة اليمنية للتعليم عن بعد
• كلية المجتمع

**المدارس:**
• مدارس التعليم الأساسي
• مدارس التعليم الثانوي
• مدارس التعليم المهني

**المدارس الخاصة:**
• مدارس البعثة الفرنسية
• مدارس البعثة البريطانية
• مدارس البعثة الأمريكية
• مدارس عربية خاصة

**التسجيل:**
• التسجيل في المدارس: سبتمبر
• التسجيل في الجامعات: يوليو - أغسطس
• متطلبات التسجيل: شهادات + صور شخصية

**المنح الدراسية:**
• منح حكومية للطلاب المتفوقين
• منح من المنظمات الدولية
• منح من الجامعات الأجنبية

هل تريد معلومات عن جامعة أو مدرسة معينة؟`;
    }

    // الطوارئ
    if (lowerQuestion.includes('طوارئ') || lowerQuestion.includes('إسعاف') || lowerQuestion.includes('شرطة')) {
      return `🚨 **أرقام الطوارئ في عدن:**

**الطوارئ العامة:**
• الشرطة: 199
• الإسعاف: 144
• المطافئ: 191
• الطوارئ الطبية: 199

**أرقام مهمة أخرى:**
• شركة الكهرباء: 199
• شركة المياه: 199
• شركة الغاز: 199
• الدفاع المدني: 191

**خدمات الأمان:**
• مراكز الشرطة في كل حي
• دوريات أمنية 24/7
• كاميرات مراقبة في الأماكن العامة

**نصائح في حالات الطوارئ:**
• احتفظ بأرقام الطوارئ في هاتفك
• اعرف أقرب مركز شرطة أو مستشفى
• لا تتردد في طلب المساعدة
• ابق هادئاً واتبع تعليمات المسؤولين

**أماكن آمنة:**
• مراكز الشرطة
• المستشفيات
• المدارس (في أوقات الدوام)
• المساجد

هل تحتاج مساعدة في حالة طوارئ؟`;
    }

    // التحية
    if (lowerQuestion.includes('مرحبا') || lowerQuestion.includes('السلام') || lowerQuestion.includes('أهلا')) {
      return `👋 **أهلاً وسهلاً بك!**

مرحباً بك في عدن الجميلة! أنا مساعد عدن العدني، ويسعدني أن أكون في خدمتك.

**يمكنني مساعدتك في:**
🏥 معلومات الصحة والمستشفيات
💼 فرص العمل والوظائف
⚡ خدمات الكهرباء
💧 خدمات المياه
🎓 التعليم والجامعات
🚨 أرقام الطوارئ
🏙️ معلومات عامة عن عدن

**كيف يمكنني مساعدتك اليوم؟**
اسألني عن أي شيء تريد معرفته عن عدن وخدماتها!`;
    }

    // الرد الافتراضي
    return `🤔 **أعتذر، لم أفهم سؤالك تماماً.**

لكن يمكنني مساعدتك في:

**🏥 الصحة:** معلومات عن المستشفيات والعيادات
**💼 العمل:** فرص الوظائف والقطاعات المتاحة  
**⚡ الكهرباء:** خدمات الكهرباء والصيانة
**💧 المياه:** خدمات المياه والصرف الصحي
**🎓 التعليم:** الجامعات والمدارس
**🚨 الطوارئ:** أرقام الطوارئ والخدمات الأمنية
**🏙️ عدن:** معلومات عامة عن المدينة

**جرب أن تسأل:**
• "أين أقرب مستشفى؟"
• "ما هي فرص العمل المتاحة؟"
• "كيف أصلح مشكلة الكهرباء؟"
• "معلومات عن جامعة عدن"

أو اسأل عن أي شيء آخر! 😊`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'مرحباً! أنا مساعد عدن العدني 🤖\n\nيمكنني مساعدتك في:\n• معلومات عن خدمات عدن\n• دليل المرافق الصحية\n• معلومات الوظائف\n• خدمات الكهرباء والمياه\n• التعليم والجامعات\n• الطوارئ والأمان\n\nاسألني أي سؤال!',
      isUser: false,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* شريط العنوان البسيط */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">عدني</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">مساعد عدن الذكي</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="مسح المحادثة"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setLocation('/')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="العودة للصفحة الرئيسية"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
            </div>

      {/* منطقة المحادثة */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!message.isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] ${
                  message.isUser
                    ? 'bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-md px-4 py-3'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">جاري الكتابة...</span>
                    </div>
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </div>
                )}
              </div>
              
              {message.isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* شريط الإدخال */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3">
            <div className="flex-1">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading}
                dir="rtl"
              />
            </div>
                  <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="h-12 w-12 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                      <Send className="w-5 h-5" />
              )}
                  </Button>
          </div>

          {/* اقتراحات سريعة */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              'مستشفيات',
              'وظائف',
              'كهرباء',
              'طوارئ'
            ].map((suggestion) => (
                  <button
                key={suggestion}
                onClick={() => setInputText(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {suggestion}
                  </button>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdenChatPage;