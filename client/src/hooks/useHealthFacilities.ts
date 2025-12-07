import { useState, useEffect, useCallback } from 'react';
import { healthApiService, type OfficialHealthFacility, type HealthFacilitiesResponse } from '@/services/healthApi';

interface UseHealthFacilitiesOptions {
  autoFetch?: boolean;
  city?: string;
  refreshInterval?: number; // في الميلي ثانية
}

interface UseHealthFacilitiesReturn {
  facilities: OfficialHealthFacility[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  source: string;
  total: number;
  refresh: () => Promise<void>;
  search: (query: string) => Promise<void>;
  getFacilityById: (id: string) => Promise<OfficialHealthFacility | null>;
}

export function useHealthFacilities(options: UseHealthFacilitiesOptions = {}): UseHealthFacilitiesReturn {
  const {
    autoFetch = true,
    city = 'Aden',
    refreshInterval = 30 * 60 * 1000 // 30 دقيقة
  } = options;

  const [facilities, setFacilities] = useState<OfficialHealthFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [source, setSource] = useState<string>('local');
  const [total, setTotal] = useState(0);

  // جلب البيانات
  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: HealthFacilitiesResponse = await healthApiService.getHealthFacilities(city);
      
      setFacilities(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

      // حفظ البيانات في localStorage
      localStorage.setItem('health-facilities-cache', JSON.stringify({
        data: response.data,
        lastUpdated: response.lastUpdated,
        source: response.source,
        total: response.total
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      
      // محاولة جلب البيانات المحلية في حالة الفشل
      const localData = healthApiService.getLocalData();
      setFacilities(localData);
      setSource('fallback');
      setTotal(localData.length);
      
      console.error('خطأ في جلب المرافق الصحية:', err);
    } finally {
      setLoading(false);
    }
  }, [city]);

  // البحث
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      await fetchFacilities();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: HealthFacilitiesResponse = await healthApiService.searchHealthFacilities(query, city);
      
      setFacilities(response.data);
      setLastUpdated(response.lastUpdated);
      setSource(response.source);
      setTotal(response.total);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'خطأ في البحث';
      setError(errorMessage);
      
      // البحث في البيانات المحلية
      const localData = healthApiService.getLocalData();
      const filteredData = localData.filter(facility => 
        facility.name.toLowerCase().includes(query.toLowerCase()) ||
        facility.address.toLowerCase().includes(query.toLowerCase()) ||
        facility.specialties.some(specialty => 
          specialty.toLowerCase().includes(query.toLowerCase())
        )
      );
      
      setFacilities(filteredData);
      setSource('fallback');
      setTotal(filteredData.length);
      
    } finally {
      setLoading(false);
    }
  }, [city, fetchFacilities]);

  // جلب مرفق محدد
  const getFacilityById = useCallback(async (id: string): Promise<OfficialHealthFacility | null> => {
    try {
      const facility = await healthApiService.getHealthFacilityById(id);
      return facility;
    } catch (err) {
      console.error('خطأ في جلب المرفق:', err);
      return null;
    }
  }, []);

  // تحديث البيانات
  const refresh = useCallback(async () => {
    await fetchFacilities();
  }, [fetchFacilities]);

  // تحميل البيانات المحلية عند البدء
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem('health-facilities-cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          setFacilities(parsed.data || []);
          setLastUpdated(parsed.lastUpdated);
          setSource(parsed.source || 'local');
          setTotal(parsed.total || 0);
        }
      } catch (err) {
        console.error('خطأ في تحميل البيانات المحلية:', err);
      }
    };

    loadCachedData();
  }, []);

  // جلب البيانات تلقائياً
  useEffect(() => {
    if (autoFetch) {
      fetchFacilities();
    }
  }, [autoFetch, fetchFacilities]);

  // تحديث دوري للبيانات
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchFacilities();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchFacilities]);

  return {
    facilities,
    loading,
    error,
    lastUpdated,
    source,
    total,
    refresh,
    search,
    getFacilityById
  };
}

// Hook مخصص للبحث
export function useHealthFacilitiesSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OfficialHealthFacility[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { search } = useHealthFacilities({ autoFetch: false });

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    try {
      await search(query);
    } finally {
      setIsSearching(false);
    }
  }, [search]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    clearSearch
  };
}

// Hook للتحقق من حالة الاتصال
export function useApiConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

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

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch('https://mophp-ye.com/api/v1/health', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      setIsOnline(true);
      setLastChecked(new Date());
    } catch (error) {
      setIsOnline(false);
      setLastChecked(new Date());
    }
  }, []);

  return {
    isOnline,
    lastChecked,
    checkConnection
  };
}
