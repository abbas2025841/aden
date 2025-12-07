import { useState, useEffect, useCallback } from 'react';
import { emergencyApiService, type EmergencyService, type EmergencyServicesResponse, type EmergencyNewsItem, type EmergencyNewsResponse } from '@/services/emergencyApi';

interface UseEmergencyServicesOptions {
  autoFetch?: boolean;
  city?: string;
  refreshInterval?: number; // في الميلي ثانية
}

interface UseEmergencyServicesReturn {
  services: EmergencyService[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  source: string;
  total: number;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  getServiceById: (id: string) => Promise<EmergencyService | null>;
  isOnline: boolean;
}

interface UseEmergencyNewsReturn {
  news: EmergencyNewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  source: string;
  total: number;
  refresh: () => Promise<void>;
  isOnline: boolean;
}

export function useEmergencyServices(options: UseEmergencyServicesOptions = {}): UseEmergencyServicesReturn {
  const {
    autoFetch = true,
    city = 'Aden',
    refreshInterval = 15 * 60 * 1000 // 15 دقيقة للطوارئ
  } = options;

  const [services, setServices] = useState<EmergencyService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [source, setSource] = useState<string>('local');
  const [total, setTotal] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // جلب البيانات
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: EmergencyServicesResponse = await emergencyApiService.getEmergencyServices(city);
      
      setServices(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

      // تحديث حالة الاتصال
      setIsOnline(response.source !== 'error');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب بيانات الطوارئ';
      setError(errorMessage);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, [city]);

  // البحث في البيانات
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchServices();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: EmergencyServicesResponse = await emergencyApiService.searchEmergencyServices(query, city);
      
      setServices(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في البحث في خدمات الطوارئ';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [city, fetchServices]);

  // جلب خدمة محددة
  const getServiceById = useCallback(async (id: string): Promise<EmergencyService | null> => {
    try {
      return await emergencyApiService.getEmergencyServiceById(id);
    } catch (err) {
      console.error('خطأ في جلب خدمة الطوارئ:', err);
      return null;
    }
  }, []);

  // تحديث البيانات
  const refresh = useCallback(async () => {
    await fetchServices();
  }, [fetchServices]);

  // مراقبة حالة الاتصال
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // جلب البيانات الأولي
  useEffect(() => {
    if (autoFetch) {
      fetchServices();
    }
  }, [autoFetch, fetchServices]);

  // التحديث التلقائي
  useEffect(() => {
    if (refreshInterval > 0 && isOnline) {
      const interval = setInterval(() => {
        fetchServices();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, isOnline, fetchServices]);

  return {
    services,
    loading,
    error,
    lastUpdated,
    source,
    total,
    refresh,
    search,
    getServiceById,
    isOnline
  };
}

// Hook منفصل لأخبار الطوارئ
export function useEmergencyNews(options: { autoFetch?: boolean; limit?: number; refreshInterval?: number } = {}): UseEmergencyNewsReturn {
  const {
    autoFetch = true,
    limit = 5,
    refreshInterval = 10 * 60 * 1000 // 10 دقائق للأخبار الطارئة
  } = options;

  const [news, setNews] = useState<EmergencyNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [source, setSource] = useState<string>('local');
  const [total, setTotal] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // جلب الأخبار
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: EmergencyNewsResponse = await emergencyApiService.getEmergencyNews(limit);
      
      setNews(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

      // تحديث حالة الاتصال
      setIsOnline(response.source !== 'error');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب أخبار الطوارئ';
      setError(errorMessage);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // تحديث الأخبار
  const refresh = useCallback(async () => {
    await fetchNews();
  }, [fetchNews]);

  // مراقبة حالة الاتصال
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // جلب الأخبار الأولي
  useEffect(() => {
    if (autoFetch) {
      fetchNews();
    }
  }, [autoFetch, fetchNews]);

  // التحديث التلقائي للأخبار
  useEffect(() => {
    if (refreshInterval > 0 && isOnline) {
      const interval = setInterval(() => {
        fetchNews();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, isOnline, fetchNews]);

  return {
    news,
    loading,
    error,
    lastUpdated,
    source,
    total,
    refresh,
    isOnline
  };
}

// Hook منفصل لفحص حالة الاتصال
export function useEmergencyApiConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const updateOnlineStatus = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  useEffect(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [updateOnlineStatus]);

  const checkConnection = useCallback(async () => {
    try {
      const isConnected = await emergencyApiService.checkConnection();
      setIsOnline(isConnected);
      return isConnected;
    } catch (error) {
      setIsOnline(false);
      return false;
    }
  }, []);

  return { isOnline, checkConnection };
}
