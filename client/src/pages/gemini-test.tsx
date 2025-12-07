import React, { useState, useEffect } from 'react';
import { adnawiAI } from '@/services/AdnawiAI';
import { API_KEYS, GEMINI_CONFIG, USAGE_LIMITS } from '@/config/api-keys';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import { Card } from '@/design-system/components/Card';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import MobileNavigation from '@/components/MobileNavigation';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Send, 
  Settings,
  Zap,
  Brain,
  MessageCircle,
  Clock,
  Key
} from 'lucide-react';

interface TestResult {
  id: string;
  input: string;
  output: string;
  isLocalResponse: boolean;
  confidence: number;
  timestamp: Date;
  duration: number;
}

export default function GeminiTestPage() {
  const [systemInfo, setSystemInfo] = useState(adnawiAI.getSystemInfo());
  const [testInput, setTestInput] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // تحديث معلومات النظام
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemInfo(adnawiAI.getSystemInfo());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // اختبار Gemini
  const runTest = async () => {
    if (!testInput.trim()) return;

    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const context = {
        userLocation: 'عدن، اليمن',
        currentPage: '/gemini-test',
        conversationHistory: [],
        userPreferences: {
          language: 'ar' as const,
          dialect: 'adeni' as const,
        },
      };

      const response = await adnawiAI.chat(testInput, context);
      const duration = Date.now() - startTime;

      const result: TestResult = {
        id: Date.now().toString(),
        input: testInput,
        output: response.text,
        isLocalResponse: response.isLocalResponse,
        confidence: response.confidence,
        timestamp: new Date(),
        duration,
      };

      setTestResults(prev => [result, ...prev]);
      setTestInput('');

    } catch (error) {
      console.error('Test error:', error);
      setError('حدث خطأ في الاختبار');
    } finally {
      setIsLoading(false);
    }
  };

  // إعادة تهيئة النظام
  const reinitialize = async () => {
    setIsLoading(true);
    try {
      await adnawiAI.reinitialize();
      setSystemInfo(adnawiAI.getSystemInfo());
      setError(null);
    } catch (error) {
      setError('فشل في إعادة تهيئة النظام');
    } finally {
      setIsLoading(false);
    }
  };

  // مسح النتائج
  const clearResults = () => {
    setTestResults([]);
  };

  // اختبارات سريعة
  const quickTests = [
    'مرحبا',
    'فين في صيدلة قريب؟',
    'اشتي كهربائي؟',
    'أريد صهريج مياه',
    'أسعار العملات اليوم',
    'وظائف متاحة في عدن',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* الهيدر */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">اختبار Gemini 2.0 Flash</h1>
              <p className="text-lg text-gray-600">اختبار تكامل عدناوي مع الذكاء الاصطناعي</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* معلومات النظام */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                معلومات النظام
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">حالة Gemini</span>
                  <div className="flex items-center gap-2">
                    {systemInfo.isReady ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      systemInfo.isReady ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.isReady ? 'متاح' : 'غير متاح'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">النموذج</span>
                  <span className="text-sm font-mono">{systemInfo.model}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">مفتاح API</span>
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${
                      systemInfo.hasAPIKey ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemInfo.hasAPIKey ? 'موجود' : 'مفقود'}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={reinitialize}
                disabled={isLoading}
                className="w-full mt-4"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                إعادة تهيئة
              </Button>
            </Card>

            {/* إعدادات التكوين */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">إعدادات التكوين</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-mono">{GEMINI_CONFIG.TEMPERATURE}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Tokens</span>
                  <span className="font-mono">{GEMINI_CONFIG.MAX_OUTPUT_TOKENS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top P</span>
                  <span className="font-mono">{GEMINI_CONFIG.TOP_P}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top K</span>
                  <span className="font-mono">{GEMINI_CONFIG.TOP_K}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحد اليومي</span>
                  <span className="font-mono">{USAGE_LIMITS.DAILY_REQUESTS}</span>
                </div>
              </div>
            </Card>

            {/* اختبارات سريعة */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">اختبارات سريعة</h3>
              
              <div className="space-y-2">
                {quickTests.map((test, index) => (
                  <Button
                    key={index}
                    onClick={() => setTestInput(test)}
                    variant="outline"
                    size="sm"
                    className="w-full text-right justify-start"
                  >
                    {test}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* منطقة الاختبار */}
          <div className="lg:col-span-2 space-y-6">
            {/* إدخال الاختبار */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                اختبار المحادثة
              </h2>
              
              <div className="space-y-4">
                <Input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="اكتب رسالة للاختبار..."
                  onKeyPress={(e) => e.key === 'Enter' && runTest()}
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={runTest}
                    disabled={!testInput.trim() || isLoading}
                    className="flex-1"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? 'جاري الاختبار...' : 'اختبار'}
                  </Button>
                  
                  <Button
                    onClick={clearResults}
                    variant="outline"
                    disabled={testResults.length === 0}
                  >
                    مسح النتائج
                  </Button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
            </Card>

            {/* النتائج */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                نتائج الاختبار ({testResults.length})
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد نتائج اختبار بعد</p>
                    <p className="text-sm">اكتب رسالة واضغط على "اختبار"</p>
                  </div>
                ) : (
                  testResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {result.timestamp.toLocaleTimeString('ar-SA')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            result.isLocalResponse 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {result.isLocalResponse ? 'محلي' : 'Gemini'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(result.confidence * 100)}%
                          </span>
                          <span className="text-xs text-gray-500">
                            {result.duration}ms
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-gray-600">الإدخال:</span>
                          <p className="text-sm bg-white p-2 rounded border">{result.input}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">الرد:</span>
                          <p className="text-sm bg-white p-2 rounded border">{result.output}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <AppFooter />
      <MobileNavigation />
    </div>
  );
}
