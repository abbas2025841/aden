import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { 
  Bot, 
  Send, 
  MessageCircle,
  Sparkles,
  Brain,
  Zap,
  Heart,
  MapPin,
  Phone,
  Search,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

interface SimpleMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AdeniAssistantSimplePage() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<SimpleMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');

  // إضافة رسالة ترحيب
  useEffect(() => {
    const welcomeMessage: SimpleMessage = {
      id: '1',
      text: 'أهلاً وسهلاً يا حبيبي! أنا عدني، مساعدك الذكي لخدمات عدن. شبيك لبيك انا بين ايديك! يمكنني أساعدك في العثور على أي خدمة في عدن - المياه، الكهرباء، الصيدليات، الوظائف، أو أي شيء آخر. بس سهولة!',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // معالجة الإدخال
  const handleSubmit = async (text: string = inputText) => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    setInputText('');

    // إضافة رسالة المستخدم
    const userMessage: SimpleMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // محاكاة استجابة المساعد
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response: SimpleMessage = {
        id: (Date.now() + 1).toString(),
        text: 'شكراً لك! أنا هنا لمساعدتك في خدمات عدن. يمكنك أن تسألني عن أي شيء تحتاجه.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('خطأ في معالجة الرسالة:', error);
      const errorMessage: SimpleMessage = {
        id: (Date.now() + 1).toString(),
        text: 'عذراً، حدث خطأ في معالجة طلبك. حاول مرة أخرى.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickActions = [
    { icon: MapPin, text: 'أقرب صيدلية', action: () => setLocation('/health') },
    { icon: Zap, text: 'نقاط الشحن', action: () => setLocation('/electricity') },
    { icon: Heart, text: 'بنك الدم', action: () => setLocation('/blood-bank') },
    { icon: Search, text: 'البحث عن وظيفة', action: () => setLocation('/jobs') },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-12 h-12 text-blue-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">عدني - المساعد الذكي</h1>
          </div>
          <p className="text-gray-600">مساعدك الذكي لجميع خدمات عدن</p>
        </div>

        {/* التبويبات */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageCircle className="w-4 h-4 inline ml-2" />
              المحادثة
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Brain className="w-4 h-4 inline ml-2" />
              لوحة التحكم
            </button>
          </div>
        </div>

        {activeTab === 'chat' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* منطقة المحادثة */}
            <div className="lg:col-span-2">
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    المحادثة
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  {/* الرسائل */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isUser
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString('ar-SA', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 ml-2"></div>
                            <span className="text-sm">جاري الكتابة...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* إدخال الرسالة */}
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="اكتب رسالتك هنا..."
                      className="flex-1"
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={() => handleSubmit()}
                      disabled={isProcessing || !inputText.trim()}
                      className="px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الإجراءات السريعة */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 ml-2" />
                    إجراءات سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => {
                      const IconComponent = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={action.action}
                        >
                          <IconComponent className="w-4 h-4 ml-2" />
                          {action.text}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* لوحة التحكم */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">الذكاء الاصطناعي</h3>
                <p className="text-sm text-gray-600">مُفعّل ومتاح 24/7</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">الخدمات المتاحة</h3>
                <p className="text-sm text-gray-600">جميع خدمات عدن</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">وقت الاستجابة</h3>
                <p className="text-sm text-gray-600">أقل من ثانية</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <AppFooter />
    </div>
  );
}
