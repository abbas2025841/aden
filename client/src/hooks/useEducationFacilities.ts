import { useState, useEffect, useCallback } from 'react';
import { educationApiService, type OfficialEducationFacility, type EducationFacilitiesResponse, type EducationNewsItem, type EducationNewsResponse } from '@/services/educationApi';

interface UseEducationFacilitiesOptions {
  autoFetch?: boolean;
  city?: string;
  refreshInterval?: number; // في الميلي ثانية
}

interface UseEducationFacilitiesReturn {
  facilities: OfficialEducationFacility[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  source: string;
  total: number;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  getFacilityById: (id: string) => Promise<OfficialEducationFacility | null>;
  isOnline: boolean;
}

interface UseEducationNewsReturn {
  news: EducationNewsItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  source: string;
  total: number;
  refresh: () => Promise<void>;
  isOnline: boolean;
}

export function useEducationFacilities(options: UseEducationFacilitiesOptions = {}): UseEducationFacilitiesReturn {
  const {
    autoFetch = true,
    city = 'Aden',
    refreshInterval = 30 * 60 * 1000 // 30 دقيقة
  } = options;

  const [facilities, setFacilities] = useState<OfficialEducationFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [source, setSource] = useState<string>('local');
  const [total, setTotal] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // جلب البيانات
  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: EducationFacilitiesResponse = await educationApiService.getEducationFacilities(city);
      
      setFacilities(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

      // تحديث حالة الاتصال
      setIsOnline(response.source !== 'error');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب البيانات التعليمية';
      setError(errorMessage);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, [city]);

  // البحث في البيانات
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchFacilities();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: EducationFacilitiesResponse = await educationApiService.searchEducationFacilities(query, city);
      
      setFacilities(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في البحث التعليمي';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [city, fetchFacilities]);

  // جلب مرفق محدد
  const getFacilityById = useCallback(async (id: string): Promise<OfficialEducationFacility | null> => {
    try {
      return await educationApiService.getEducationFacilityById(id);
    } catch (err) {
      console.error('خطأ في جلب المرفق التعليمي:', err);
      return null;
    }
  }, []);

  // تحديث البيانات
  const refresh = useCallback(async () => {
    await fetchFacilities();
  }, [fetchFacilities]);

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
      fetchFacilities();
    }
  }, [autoFetch, fetchFacilities]);

  // التحديث التلقائي
  useEffect(() => {
    if (refreshInterval > 0 && isOnline) {
      const interval = setInterval(() => {
        fetchFacilities();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, isOnline, fetchFacilities]);

  return {
    facilities,
    loading,
    error,
    lastUpdated,
    source,
    total,
    refresh,
    search,
    getFacilityById,
    isOnline
  };
}

// Hook منفصل لأخبار التعليم
export function useEducationNews(options: { autoFetch?: boolean; limit?: number; refreshInterval?: number } = {}): UseEducationNewsReturn {
  const {
    autoFetch = true,
    limit = 5,
    refreshInterval = 15 * 60 * 1000 // 15 دقيقة للأخبار
  } = options;

  const [news, setNews] = useState<EducationNewsItem[]>([]);
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
      const response: EducationNewsResponse = await educationApiService.getEducationNews(limit);
      
      setNews(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

      // تحديث حالة الاتصال
      setIsOnline(response.source !== 'error');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في جلب أخبار التعليم';
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
export function useEducationApiConnectionStatus() {
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
      const isConnected = await educationApiService.checkConnection();
      setIsOnline(isConnected);
      return isConnected;
    } catch (error) {
      setIsOnline(false);
      return false;
    }
  }, []);

  return { isOnline, checkConnection };
}
