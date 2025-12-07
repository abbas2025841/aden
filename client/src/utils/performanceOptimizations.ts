// تحسينات الأداء للشبكة الضعيفة في عدن
// Cursor الأسطوري - تحسينات شاملة

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

// ========================================
// 1. تحميل تدريجي للبيانات
// ========================================

export const useProgressiveLoading = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const loadReports = async (pageNum: number) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('electricity_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .range((pageNum - 1) * 10, pageNum * 10 - 1);
      
      if (error) throw error;
      
      if (pageNum === 1) {
        setReports(data || []);
      } else {
        setReports((prev: any[]) => [...prev, ...(data || [])]);
      }
      
      // التحقق من وجود المزيد من البيانات
      setHasMore((data || []).length === 10);
      
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadReports(page);
  }, [page]);
  
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev: number) => prev + 1);
    }
  };
  
  return { reports, loading, loadMore, hasMore };
};

// ========================================
// 2. تخزين مؤقت محلي
// ========================================

export const useLocalCache = () => {
  const getCachedData = (key: string) => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const data = JSON.parse(cached);
        // التحقق من انتهاء صلاحية البيانات (5 دقائق)
        if (data.timestamp && Date.now() - data.timestamp < 300000) {
          return data.value;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };
  
  const setCachedData = (key: string, value: any) => {
    try {
      const data = {
        value,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };
  
  const clearCache = (key?: string) => {
    try {
      if (key) {
        localStorage.removeItem(key);
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };
  
  return { getCachedData, setCachedData, clearCache };
};

// ========================================
// 3. إعادة المحاولة التلقائية
// ========================================

export const useRetryConnection = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setRetryCount(0);
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        // انتظار متزايد بين المحاولات
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        setRetryCount((prev: number) => prev + 1);
      }
    }
  };
  
  return { retryWithBackoff, isOnline, retryCount };
};

// ========================================
// 4. تحسين استعلامات قاعدة البيانات
// ========================================

export const useOptimizedQueries = () => {
  const { getCachedData, setCachedData } = useLocalCache();
  const { retryWithBackoff } = useRetryConnection();
  
  const getReportsByDistrict = async (district: string, useCache = true) => {
    const cacheKey = `reports_${district}`;
    
    // التحقق من التخزين المؤقت
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('electricity_reports')
          .select('*')
          .eq('district', district)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        return data;
      });
      
      // حفظ في التخزين المؤقت
      setCachedData(cacheKey, result);
      return result;
      
    } catch (error) {
      console.error('Error fetching reports by district:', error);
      throw error;
    }
  };
  
  const getReportsByStatus = async (status: string, useCache = true) => {
    const cacheKey = `reports_status_${status}`;
    
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('electricity_reports')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        return data;
      });
      
      setCachedData(cacheKey, result);
      return result;
      
    } catch (error) {
      console.error('Error fetching reports by status:', error);
      throw error;
    }
  };
  
  const getRecentReports = async (limit = 20, useCache = true) => {
    const cacheKey = `recent_reports_${limit}`;
    
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }
    
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('electricity_reports')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        if (error) throw error;
        return data;
      });
      
      setCachedData(cacheKey, result);
      return result;
      
    } catch (error) {
      console.error('Error fetching recent reports:', error);
      throw error;
    }
  };
  
  return { getReportsByDistrict, getReportsByStatus, getRecentReports };
};

// ========================================
// 5. تحسين إرسال البلاغات
// ========================================

export const useOptimizedReportSubmission = () => {
  const { retryWithBackoff } = useRetryConnection();
  
  const submitReport = async (reportData: any) => {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('electricity_reports')
          .insert([reportData])
          .select();
        
        if (error) throw error;
        return data;
      });
      
      return result;
      
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  };
  
  const submitConfirmation = async (confirmationData: any) => {
    try {
      const result = await retryWithBackoff(async () => {
        const { data, error } = await supabase
          .from('collective_confirmations')
          .insert([confirmationData])
          .select();
        
        if (error) throw error;
        return data;
      });
      
      return result;
      
    } catch (error) {
      console.error('Error submitting confirmation:', error);
      throw error;
    }
  };
  
  return { submitReport, submitConfirmation };
};

// ========================================
// 6. مراقبة الأداء
// ========================================

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<{
    loadTime: number;
    retryCount: number;
    errorRate: number;
    cacheHitRate: number;
  }>({
    loadTime: 0,
    cacheHitRate: 0,
    retryCount: 0,
    errorRate: 0
  });
  
  const trackLoadTime = (startTime: number) => {
    const loadTime = Date.now() - startTime;
    setMetrics((prev: any) => ({ ...prev, loadTime }));
    return loadTime;
  };
  
  const trackCacheHit = (hit: boolean) => {
    setMetrics((prev: any) => ({
      ...prev,
      cacheHitRate: hit ? prev.cacheHitRate + 1 : prev.cacheHitRate
    }));
  };
  
  const trackRetry = () => {
    setMetrics((prev: any) => ({ ...prev, retryCount: prev.retryCount + 1 }));
  };
  
  const trackError = () => {
    setMetrics((prev: any) => ({ ...prev, errorRate: prev.errorRate + 1 }));
  };
  
  return { metrics, trackLoadTime, trackCacheHit, trackRetry, trackError };
};

// ========================================
// 7. تحسينات إضافية للشبكة الضعيفة
// ========================================

export const useNetworkOptimizations = () => {
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'poor' | 'offline'>('good');
  
  useEffect(() => {
    const checkConnectionQuality = () => {
      if (!navigator.onLine) {
        setConnectionQuality('offline');
        return;
      }
      
      // محاكاة فحص جودة الاتصال
      const startTime = Date.now();
      fetch('/api/ping', { method: 'HEAD' })
        .then(() => {
          const responseTime = Date.now() - startTime;
          setConnectionQuality(responseTime < 1000 ? 'good' : 'poor');
        })
        .catch(() => {
          setConnectionQuality('poor');
        });
    };
    
    checkConnectionQuality();
    const interval = setInterval(checkConnectionQuality, 30000); // كل 30 ثانية
    
    return () => clearInterval(interval);
  }, []);
  
  const getOptimizedBatchSize = () => {
    switch (connectionQuality) {
      case 'good': return 20;
      case 'poor': return 10;
      case 'offline': return 5;
      default: return 10;
    }
  };
  
  const getOptimizedTimeout = () => {
    switch (connectionQuality) {
      case 'good': return 5000;
      case 'poor': return 10000;
      case 'offline': return 15000;
      default: return 8000;
    }
  };
  
  return { connectionQuality, getOptimizedBatchSize, getOptimizedTimeout };
};

export default {
  useProgressiveLoading,
  useLocalCache,
  useRetryConnection,
  useOptimizedQueries,
  useOptimizedReportSubmission,
  usePerformanceMonitoring,
  useNetworkOptimizations
};
