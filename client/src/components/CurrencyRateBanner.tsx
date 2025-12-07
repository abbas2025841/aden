import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import { RefreshCw, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrencyRates } from '@/hooks/useCurrencyRates';
import { CurrencyUpdateService, CurrencyRate, CurrencyResponse } from '@/services/currencyApi';

export default function CurrencyRateBanner() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [source, setSource] = useState<string>('محلي');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currencyService = CurrencyUpdateService.getInstance();
    
    // بدء التحديث التلقائي
    currencyService.startAutoUpdate();

    // الاشتراك في التحديثات
    const unsubscribe = currencyService.subscribe((data: CurrencyResponse) => {
      setRates(data.data);
      setLastUpdate(new Date(data.lastUpdate));
      setSource(data.source);
      setLoading(false);
      setError(null);
    });

    // تنظيف عند إلغاء التحميل
    return () => {
      unsubscribe();
      currencyService.stopAutoUpdate();
    };
  }, []);

  // تحديث يدوي
  const handleManualRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const currencyService = CurrencyUpdateService.getInstance();
      // إجبار التحديث
      await (currencyService as any).updateRates();
    } catch (err) {
      setError('فشل في تحديث الأسعار');
      setLoading(false);
    }
  };

  if (loading && rates.length === 0) {
    return (
      <div className="py-3 px-4 w-full">
        <div className="flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-white" />
          <span className="font-bold text-sm text-white">جاري تحديث أسعار العملات...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-2 px-4 w-full">
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-sm text-white">{error}</span>
          <button 
            onClick={handleManualRefresh}
            className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs text-white"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-YE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return value.toFixed(2);
  };

  // إنشاء نص متحرك لجميع العملات
  const marqueeText = rates.map(rate => {
    const isPositive = rate.change >= 0;
    const changeIcon = isPositive ? '↗' : '↘';
    const changeColor = isPositive ? 'text-green-800' : 'text-red-800';
    
    return (
      <span key={rate.currency} className="inline-flex items-center gap-2 mx-8">
        <span className="font-bold text-yellow-100">{rate.name}:</span>
        <span className="font-mono font-bold">
          {formatCurrency(rate.buy)} - {formatCurrency(rate.sell)} ريال
        </span>
        <span className={`font-bold ${changeColor}`}>
          {changeIcon} {isPositive ? '+' : ''}{formatCurrency(rate.change)}
        </span>
      </span>
    );
  });

  return (
    <div className="py-3 px-4 w-full relative overflow-hidden">
      <div className="relative z-10">
        {/* العنوان الثابت */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-bold text-lg text-white">
            💰 أسعار العملات اليوم في عدن
          </span>
          <button 
            onClick={handleManualRefresh}
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors"
            title="تحديث الأسعار"
          >
            <RefreshCw className={`w-3 h-3 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* النص المتحرك مع إطار غير مزعج */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 shadow-sm">
          <Marquee
            speed={50}
            gradient={false}
            pauseOnHover={true}
            className="text-sm"
          >
            {marqueeText}
          </Marquee>
        </div>

        {/* معلومات التحديث والمصدر */}
        <div className="flex items-center justify-between mt-3 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span>آخر تحديث: {formatTime(lastUpdate)}</span>
            <span>•</span>
            <span>المصدر: {source}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {source !== 'محلي' && (
              <a 
                href={source === 'YDN News' ? 'https://ydn.news' : source === 'Aden TM' ? 'https://aden-tm.net' : 'https://ye-rial.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="زيارة المصدر"
              >
                <ExternalLink className="w-3 h-3" />
                <span>المصدر</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون مبسط للاستخدام في أماكن أخرى
export function SimpleCurrencyBanner() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currencyService = CurrencyUpdateService.getInstance();
    currencyService.startAutoUpdate();

    const unsubscribe = currencyService.subscribe((data: CurrencyResponse) => {
      setRates(data.data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading || rates.length === 0) {
    return (
      <div className="bg-yellow-600 text-black py-2 px-4 w-full">
        <div className="flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="font-bold text-sm">جاري تحديث أسعار العملات...</span>
        </div>
      </div>
    );
  }

  const mainRates = rates.slice(0, 3); // عرض أول 3 عملات فقط
  const rateText = mainRates.map(rate => {
    const isPositive = rate.change >= 0;
    const changeIcon = isPositive ? '↗' : '↘';
    return `${rate.name}: ${rate.buy.toFixed(2)}-${rate.sell.toFixed(2)} ${changeIcon}${rate.change.toFixed(2)}`;
  }).join(' | ');

  return (
    <div className="bg-yellow-600 text-black py-2 px-4 w-full overflow-hidden">
      <Marquee speed={40} gradient={false} pauseOnHover={true}>
        <span className="font-bold text-sm">
          💰 {rateText} | آخر تحديث: {new Date().toLocaleTimeString('ar-YE')}
        </span>
      </Marquee>
    </div>
  );
}
