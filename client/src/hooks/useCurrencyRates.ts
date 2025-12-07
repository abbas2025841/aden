import { useState, useEffect, useCallback } from 'react';
import { currencyApiService, CurrencyRate } from '@/services/currencyApiService';

export interface UseCurrencyRatesReturn {
  currencies: CurrencyRate[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshRates: () => Promise<void>;
  isOnline: boolean;
}

export function useCurrencyRates(): UseCurrencyRatesReturn {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // تحميل البيانات الافتراضية فوراً
  useEffect(() => {
    const loadDefaultData = async () => {
      try {
        console.log('تحميل البيانات الافتراضية...');
        const defaultCurrencies = await currencyApiService.getDefaultCurrencies();
        console.log('البيانات الافتراضية المحملة:', defaultCurrencies.length);
        setCurrencies(defaultCurrencies);
        setLastUpdated(new Date());
        setIsLoading(false);
        console.log('تم تحميل البيانات الافتراضية بنجاح');
      } catch (err) {
        console.error('خطأ في تحميل البيانات الافتراضية:', err);
        // في حالة الخطأ، احتفظ بالبيانات الافتراضية الثابتة
        const fallbackCurrencies = [
          {
            id: "USD",
            name: "الدولار الأمريكي",
            code: "USD",
            flag: "🇺🇸",
            buyRate: 1615.00,
            sellRate: 1630.00,
            change: 15.00,
            changePercent: 0.93
          },
          {
            id: "SAR",
            name: "الريال السعودي",
            code: "SAR",
            flag: "🇸🇦",
            buyRate: 425.00,
            sellRate: 428.00,
            change: 3.00,
            changePercent: 0.71
          }
        ];
        setCurrencies(fallbackCurrencies);
        setLastUpdated(new Date());
        setIsLoading(false);
        console.log('تم تحميل البيانات الافتراضية الثابتة');
      }
    };

    loadDefaultData();
  }, []);

  // تحديث حالة الاتصال
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // جلب أسعار العملات
  const fetchRates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const rates = await currencyApiService.fetchCurrencyRates();
      setCurrencies(rates);
      setLastUpdated(new Date());
      console.log('تم تحديث الأسعار بنجاح');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب أسعار العملات';
      setError(errorMessage);
      console.error('خطأ في جلب أسعار العملات:', err);
      
      // في حالة الخطأ، احتفظ بالبيانات الموجودة أو استخدم الافتراضية
      if (currencies.length === 0) {
        const defaultCurrencies = await currencyApiService.getDefaultCurrencies();
        setCurrencies(defaultCurrencies);
        setLastUpdated(new Date());
      }
    } finally {
      setIsLoading(false);
    }
  }, [currencies.length]);

  // تحديث الأسعار
  const refreshRates = useCallback(async () => {
    currencyApiService.clearCache();
    await fetchRates();
  }, [fetchRates]);

  // تحميل البيانات الأولية (بعد تحميل البيانات الافتراضية)
  useEffect(() => {
    // تأخير بسيط لضمان تحميل البيانات الافتراضية أولاً
    const timer = setTimeout(() => {
      console.log('بدء جلب البيانات من API...');
      fetchRates();
    }, 500); // زيادة التأخير قليلاً

    return () => clearTimeout(timer);
  }, [fetchRates]);

  // تحديث تلقائي كل 5 دقائق
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      console.log('تحديث تلقائي للأسعار...');
      fetchRates();
    }, 5 * 60 * 1000); // 5 دقائق

    return () => clearInterval(interval);
  }, [fetchRates, isOnline]);

  // تحديث إضافي كل دقيقة لضمان التحديث المستمر
  useEffect(() => {
    if (!isOnline || currencies.length === 0) return;

    const interval = setInterval(() => {
      console.log('تحديث دوري للأسعار...');
      fetchRates();
    }, 60 * 1000); // دقيقة واحدة

    return () => clearInterval(interval);
  }, [fetchRates, isOnline, currencies.length]);

  // تحديث عند العودة للاتصال
  useEffect(() => {
    if (isOnline && currencies.length === 0) {
      fetchRates();
    }
  }, [isOnline, currencies.length, fetchRates]);

  return {
    currencies,
    isLoading,
    error,
    lastUpdated,
    refreshRates,
    isOnline
  };
}