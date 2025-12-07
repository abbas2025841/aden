import React, { useState, useEffect } from 'react';
import { dailyRequestManager } from '@/services/DailyRequestManager';
import { USAGE_LIMITS, SECURITY_CONFIG } from '@/config/api-keys';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import MobileNavigation from '@/components/MobileNavigation';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Zap, 
  TrendingUp,
  RefreshCw,
  Download,
  Trash2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function RequestStatsPage() {
  const [stats, setStats] = useState(dailyRequestManager.getTodayStats());
  const [limitInfo, setLimitInfo] = useState(dailyRequestManager.getDailyLimitInfo());
  const [rateLimitInfo, setRateLimitInfo] = useState(dailyRequestManager.getRateLimitInfo());
  const [exportData, setExportData] = useState<any>(null);

  // تحديث الإحصائيات
  useEffect(() => {
    const updateStats = () => {
      setStats(dailyRequestManager.getTodayStats());
      setLimitInfo(dailyRequestManager.getDailyLimitInfo());
      setRateLimitInfo(dailyRequestManager.getRateLimitInfo());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  // تصدير البيانات
  const handleExport = () => {
    const data = dailyRequestManager.exportData();
    setExportData(data);
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adnawi-stats-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // مسح البيانات
  const handleClear = () => {
    if (confirm('هل أنت متأكد من مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      dailyRequestManager.clearAllData();
      setStats(dailyRequestManager.getTodayStats());
      setLimitInfo(dailyRequestManager.getDailyLimitInfo());
      setRateLimitInfo(dailyRequestManager.getRateLimitInfo());
    }
  };

  // إعادة تعيين اليومي
  const handleReset = () => {
    if (confirm('هل تريد إعادة تعيين الطلبات اليومية؟')) {
      (dailyRequestManager as any).resetDailyData();
      setStats(dailyRequestManager.getTodayStats());
      setLimitInfo(dailyRequestManager.getDailyLimitInfo());
    }
  };

  // حساب النسبة المئوية
  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  // حساب الوقت المتبقي
  const getTimeUntilReset = (resetTime: number) => {
    const now = Date.now();
    const diff = resetTime - now;
    
    if (diff <= 0) return 'تم إعادة التعيين';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours} ساعة و ${minutes} دقيقة`;
    } else {
      return `${minutes} دقيقة`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* الهيدر */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إحصائيات الطلبات</h1>
              <p className="text-lg text-gray-600">مراقبة استخدام عدناوي اليومي</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* الإحصائيات الرئيسية */}
          <div className="lg:col-span-2 space-y-6">
            {/* حدود الاستخدام */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                حدود الاستخدام
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* الحد اليومي */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">الحد اليومي</span>
                    <span className="text-sm font-mono">
                      {USAGE_LIMITS.DAILY_REQUESTS - limitInfo.remaining} / {USAGE_LIMITS.DAILY_REQUESTS}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        limitInfo.remaining > 5 ? 'bg-green-500' : 
                        limitInfo.remaining > 2 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${getPercentage(USAGE_LIMITS.DAILY_REQUESTS - limitInfo.remaining, USAGE_LIMITS.DAILY_REQUESTS)}%` 
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      متبقي: {limitInfo.remaining} طلب
                    </span>
                    <span className="text-gray-500">
                      إعادة تعيين: {getTimeUntilReset(limitInfo.resetTime)}
                    </span>
                  </div>
                </div>

                {/* Rate Limit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">حد المعدل</span>
                    <span className="text-sm font-mono">
                      {USAGE_LIMITS.RATE_LIMIT_REQUESTS - rateLimitInfo.remaining} / {USAGE_LIMITS.RATE_LIMIT_REQUESTS}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        rateLimitInfo.remaining > 2 ? 'bg-green-500' : 
                        rateLimitInfo.remaining > 0 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${getPercentage(USAGE_LIMITS.RATE_LIMIT_REQUESTS - rateLimitInfo.remaining, USAGE_LIMITS.RATE_LIMIT_REQUESTS)}%` 
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      متبقي: {rateLimitInfo.remaining} طلب
                    </span>
                    <span className="text-gray-500">
                      إعادة تعيين: {getTimeUntilReset(rateLimitInfo.resetTime)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* إحصائيات مفصلة */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                إحصائيات مفصلة
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalRequests}</div>
                  <div className="text-sm text-gray-600">إجمالي الطلبات</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.successfulRequests}</div>
                  <div className="text-sm text-gray-600">طلبات ناجحة</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.failedRequests}</div>
                  <div className="text-sm text-gray-600">طلبات فاشلة</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stats.averageResponseTime}ms</div>
                  <div className="text-sm text-gray-600">متوسط الاستجابة</div>
                </div>
              </div>
            </Card>

            {/* إحصائيات مقدمي الخدمة */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">استخدام مقدمي الخدمة</h2>
              
              <div className="space-y-4">
                {Object.entries(stats.providerStats).map(([provider, count]) => (
                  <div key={provider} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        provider === 'gemini' ? 'bg-blue-500' :
                        provider === 'local' ? 'bg-green-500' :
                        provider === 'error' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <span className="capitalize font-medium">
                        {provider === 'gemini' ? 'Gemini' :
                         provider === 'local' ? 'محلي' :
                         provider === 'error' ? 'خطأ' : provider}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            provider === 'gemini' ? 'bg-blue-500' :
                            provider === 'local' ? 'bg-green-500' :
                            provider === 'error' ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                          style={{ 
                            width: `${getPercentage(count, stats.totalRequests)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-mono w-12 text-right">
                        {count} ({getPercentage(count, stats.totalRequests)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* الشريط الجانبي */}
          <div className="space-y-6">
            {/* معلومات النظام */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                معلومات النظام
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">الحد اليومي</span>
                  <span className="font-mono">{USAGE_LIMITS.DAILY_REQUESTS}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">حد المعدل</span>
                  <span className="font-mono">{USAGE_LIMITS.RATE_LIMIT_REQUESTS}/دقيقة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">حد الرموز</span>
                  <span className="font-mono">{USAGE_LIMITS.MAX_TOKENS_PER_REQUEST}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rate Limiting</span>
                  <span className={`font-mono ${SECURITY_CONFIG.ENABLE_RATE_LIMITING ? 'text-green-600' : 'text-red-600'}`}>
                    {SECURITY_CONFIG.ENABLE_RATE_LIMITING ? 'مفعل' : 'معطل'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الرموز المستخدمة</span>
                  <span className="font-mono">{stats.totalTokensUsed}</span>
                </div>
              </div>
            </Card>

            {/* إجراءات */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">إجراءات</h3>
              
              <div className="space-y-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة تعيين اليومي
                </Button>
                
                <Button
                  onClick={handleExport}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير البيانات
                </Button>
                
                <Button
                  onClick={handleClear}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  مسح جميع البيانات
                </Button>
              </div>
            </Card>

            {/* تحذيرات */}
            {limitInfo.remaining <= 3 && (
              <Card className="p-6 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2 text-orange-800 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-semibold">تحذير</h3>
                </div>
                <p className="text-sm text-orange-700">
                  {limitInfo.remaining === 0 
                    ? 'وصلت للحد الأقصى اليوم. سيتم إعادة التعيين غداً.'
                    : `متبقي ${limitInfo.remaining} طلب فقط اليوم.`
                  }
                </p>
              </Card>
            )}

            {/* نصائح */}
            <Card className="p-6 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <Info className="w-5 h-5" />
                <h3 className="font-semibold">نصائح</h3>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• استخدم الطلبات بحكمة</li>
                <li>• انتظر بين الطلبات لتجنب Rate Limit</li>
                <li>• استخدم الردود المحلية عند الحاجة</li>
                <li>• راقب الإحصائيات بانتظام</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>

      <AppFooter />
      <MobileNavigation />
    </div>
  );
}
