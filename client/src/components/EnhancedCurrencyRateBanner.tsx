// مكون محسن لشريط أسعار العملات مع نظام Fetch متقدم
// Cursor الأسطوري - عدن لايف

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { CurrencyRate } from '@/services/currencyApi';
import { fetchWithFallback, FetchResult } from '@/lib/fetchWithFallback';

export default function EnhancedCurrencyRateBanner() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [source, setSource] = useState<string>('محلي');
  const [error, setError] = useState<string | null>(null);

  // البيانات الاحتياطية
  const fallbackRates: CurrencyRate[] = [
    {
      currency: 'USD',
      name: 'دولار أمريكي',
      buy: 1632,
      sell: 1617,
      change: 0,
      lastUpdate: new Date().toISOString(),
      source: 'عدن تايم (احتياطي)'
    },
    {
      currency: 'SAR',
      name: 'ريال سعودي',
      buy: 428,
      sell: 425,
      change: 0,
      lastUpdate: new Date().toISOString(),
      source: 'عدن تايم (احتياطي)'
    }
  ];

  // دالة جلب البيانات المحسنة
  const fetchRealRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // استخدام نظام Fetch المحسن
      const result: FetchResult<string> = await fetchWithFallback.fetch(
        'https://www.aden-tm.net/news/345502',
        {
          timeout: 8000,
          retries: 2,
          fallbackData: null,
          cacheKey: 'aden-tm-currency-rates',
          cacheExpiry: 5 * 60 * 1000, // 5 دقائق
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );
      
      if (result.data && result.source === 'api') {
        // استخراج الأسعار من النص
        const usdMatch = result.data.match(/دولار امريكي=\s*(\d+)\s*:\s*(\d+)/);
        const sarMatch = result.data.match(/ريال سعودي=\s*(\d+)\s*:\s*(\d+)/);
        
        const realRates: CurrencyRate[] = [];
        
        if (usdMatch) {
          realRates.push({
            currency: 'USD',
            name: 'دولار أمريكي',
            buy: parseFloat(usdMatch[1]),
            sell: parseFloat(usdMatch[2]),
            change: 0,
            lastUpdate: new Date().toISOString(),
            source: 'عدن تايم'
          });
        }
        
        if (sarMatch) {
          realRates.push({
            currency: 'SAR',
            name: 'ريال سعودي',
            buy: parseFloat(sarMatch[1]),
            sell: parseFloat(sarMatch[2]),
            change: 0,
            lastUpdate: new Date().toISOString(),
            source: 'عدن تايم'
          });
        }
        
        if (realRates.length > 0) {
          setRates(realRates);
          setSource('عدن تايم');
          
          // حفظ البيانات في localStorage
          localStorage.setItem('currency-rates-cache', JSON.stringify({
            data: result.data,
            timestamp: Date.now()
          }));
        } else {
          setRates(fallbackRates);
          setSource('عدن تايم (احتياطي)');
        }
      } else if (result.source === 'cache') {
        // استخدام البيانات المحفوظة
        setRates(fallbackRates);
        setSource('عدن تايم (محفوظ)');
      } else {
        // استخدام البيانات الاحتياطية
        setRates(fallbackRates);
        setSource('عدن تايم (احتياطي)');
      }
      
    } catch (error) {
      console.error('خطأ في جلب أسعار العملات:', error);
      
      // محاولة جلب البيانات من localStorage
      try {
        const cached = localStorage.getItem('currency-rates-cache');
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const age = Date.now() - timestamp;
          
          // إذا كانت البيانات أقل من 30 دقيقة
          if (age < 30 * 60 * 1000) {
            const usdMatch = data.match(/دولار امريكي=\s*(\d+)\s*:\s*(\d+)/);
            const sarMatch = data.match(/ريال سعودي=\s*(\d+)\s*:\s*(\d+)/);
            
            const realRates: CurrencyRate[] = [];
            
            if (usdMatch) {
              realRates.push({
                currency: 'USD',
                name: 'دولار أمريكي',
                buy: parseFloat(usdMatch[1]),
                sell: parseFloat(usdMatch[2]),
                change: 0,
                lastUpdate: new Date(timestamp).toISOString(),
                source: 'عدن تايم (محفوظ محلي)'
              });
            }
            
            if (sarMatch) {
              realRates.push({
                currency: 'SAR',
                name: 'ريال سعودي',
                buy: parseFloat(sarMatch[1]),
                sell: parseFloat(sarMatch[2]),
                change: 0,
                lastUpdate: new Date(timestamp).toISOString(),
                source: 'عدن تايم (محفوظ محلي)'
              });
            }
            
            if (realRates.length > 0) {
              setRates(realRates);
              setSource('عدن تايم (محفوظ محلي)');
            } else {
              setRates(fallbackRates);
              setSource('عدن تايم (احتياطي)');
            }
          } else {
            setRates(fallbackRates);
            setSource('عدن تايم (احتياطي)');
          }
        } else {
          setRates(fallbackRates);
          setSource('عدن تايم (احتياطي)');
        }
      } catch (localError) {
        console.error('خطأ في جلب البيانات المحفوظة:', localError);
        setRates(fallbackRates);
        setSource('عدن تايم (احتياطي)');
      }
    } finally {
      setLastUpdate(new Date());
      setLoading(false);
    }
  }, []);

  // تحديث يدوي مع مسح الكاش
  const handleManualRefresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // مسح الكاش لإجبار التحديث
    fetchWithFallback.clearCache('aden-tm-currency-rates');
    
    // إعادة تشغيل دالة جلب البيانات
    await fetchRealRates();
  }, [fetchRealRates]);

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    fetchRealRates();
    
    // تحديث تلقائي كل 5 دقائق
    const interval = setInterval(fetchRealRates, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchRealRates]);

  // تنسيق العملة
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('ar-YE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  // تنسيق الوقت
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ar-YE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // إنشاء جدول العملات
  const currencyTable = rates.map(rate => {
    return (
      <div key={rate.currency} className="flex items-center justify-center py-1 px-2 bg-black/10 rounded mb-1">
        <div className="flex items-center gap-3">
          <span className="font-bold text-yellow-100 min-w-[100px] text-right text-xs">{rate.name}</span>
          <span className="font-mono font-bold text-white min-w-[60px] text-center text-xs">{formatCurrency(rate.buy)}</span>
          <span className="font-mono font-bold text-white min-w-[60px] text-center text-xs">{formatCurrency(rate.sell)}</span>
        </div>
      </div>
    );
  });

  if (loading && rates.length === 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-2 px-3 w-full shadow-lg">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          <span className="text-sm">جاري تحميل أسعار العملات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-black py-2 px-3 w-full shadow-lg relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 animate-pulse"></div>
      
      <div className="relative z-10">
        {/* العنوان الثابت */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="font-bold text-sm text-yellow-100">
            💰 صرف اليوم
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-400 p-1 rounded-full transition-colors"
            title="تحديث الأسعار"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* رؤوس الجدول */}
        <div className="bg-black/20 rounded-lg p-2 mb-1">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <span className="font-bold text-yellow-100 min-w-[100px] text-right text-xs">العملة</span>
              <span className="font-bold text-yellow-100 min-w-[60px] text-center text-xs">شراء</span>
              <span className="font-bold text-yellow-100 min-w-[60px] text-center text-xs">بيع</span>
            </div>
          </div>
        </div>

        {/* جدول العملات */}
        <div className="max-h-24 overflow-y-auto">
          {currencyTable}
        </div>

        {/* معلومات إضافية */}
        {error && (
          <div className="text-xs text-red-200 text-center mt-1">
            ⚠️ {error}
          </div>
        )}
        
        {/* مؤشر المصدر */}
        <div className="text-xs text-yellow-100 text-center mt-1">
          📡 {source} • آخر تحديث: {formatTime(lastUpdate)}
        </div>
      </div>
    </div>
  );
}
