// نظام React Query محسن - Cursor الأسطوري
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithFallback } from './fetchWithFallback';

// ===== أنواع البيانات =====
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  lastUpdated?: string;
  source: string;
  error?: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'lab';
  location: string;
  district: string;
  contact: string;
  services: string[];
  status: 'operational' | 'maintenance' | 'closed';
  workingHours: string;
  emergency: boolean;
}

export interface BloodBank {
  id: string;
  name: string;
  location: string;
  contact: string;
  bloodTypes: string[];
  status: 'available' | 'busy' | 'closed';
  workingHours: string;
  capacity?: number;
  currentStock?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  status: 'active' | 'inactive' | 'expired';
}

export interface ElectricityStatus {
  totalCustomers: number;
  totalCapacity: number;
  currentLoad: number;
  loadPercentage: number;
  outages: any[];
  lastUpdated: string;
}

// ===== Hooks للبيانات =====

// 1. المرافق الصحية
export function useHealthFacilities() {
  return useQuery({
    queryKey: ['health-facilities'],
    queryFn: async () => {
      const result = await fetchWithFallback.fetch<HealthFacility[]>(
        '/api/health/facilities',
        {
          timeout: 5000,
          retries: 2,
          cacheKey: 'health-facilities',
          cacheExpiry: 15 * 60 * 1000
        }
      );
      return result.data || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
}

// 2. بنوك الدم
export function useBloodBanks() {
  return useQuery({
    queryKey: ['blood-banks'],
    queryFn: async () => {
      const result = await fetchWithFallback.fetch<BloodBank[]>(
        '/api/blood-banks',
        {
          timeout: 5000,
          retries: 2,
          cacheKey: 'blood-banks',
          cacheExpiry: 10 * 60 * 1000
        }
      );
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 3
  });
}

// 3. الوظائف
export function useJobs(filters?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const result = await fetchWithFallback.fetch<{
        data: Job[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(
        `/api/jobs?${params.toString()}`,
        {
          timeout: 5000,
          retries: 2,
          cacheKey: `jobs-${JSON.stringify(filters)}`,
          cacheExpiry: 5 * 60 * 1000
        }
      );
      return result.data || { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  });
}

// 4. حالة الكهرباء
export function useElectricityStatus() {
  return useQuery({
    queryKey: ['electricity-status'],
    queryFn: async () => {
      const result = await fetchWithFallback.fetch<ElectricityStatus>(
        '/api/electricity/status',
        {
          timeout: 5000,
          retries: 2,
          cacheKey: 'electricity-status',
          cacheExpiry: 2 * 60 * 1000 // 2 دقائق
        }
      );
      return result.data || {
        totalCustomers: 0,
        totalCapacity: 0,
        currentLoad: 0,
        loadPercentage: 0,
        outages: [],
        lastUpdated: new Date().toISOString()
      };
    },
    staleTime: 1 * 60 * 1000, // 1 دقيقة
    gcTime: 5 * 60 * 1000,
    retry: 3,
    refetchInterval: 5 * 60 * 1000 // تحديث كل 5 دقائق
  });
}

// 5. أسعار العملات
export function useCurrencyRates() {
  return useQuery({
    queryKey: ['currency-rates'],
    queryFn: async () => {
      const result = await fetchWithFallback.fetch<any[]>(
        '/api/currency/rates',
        {
          timeout: 5000,
          retries: 2,
          cacheKey: 'currency-rates',
          cacheExpiry: 5 * 60 * 1000
        }
      );
      return result.data || [];
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    refetchInterval: 5 * 60 * 1000
  });
}

// 6. البحث العام
export function useGlobalSearch(query: string, type?: string) {
  return useQuery({
    queryKey: ['global-search', query, type],
    queryFn: async () => {
      if (!query.trim()) return { jobs: [], facilities: [], services: [] };
      
      const params = new URLSearchParams();
      params.append('q', query);
      if (type) params.append('type', type);

      const result = await fetchWithFallback.fetch<{
        jobs: any[];
        facilities: any[];
        services: any[];
      }>(
        `/api/search?${params.toString()}`,
        {
          timeout: 5000,
          retries: 2,
          cacheKey: `search-${query}-${type}`,
          cacheExpiry: 5 * 60 * 1000
        }
      );
      return result.data || { jobs: [], facilities: [], services: [] };
    },
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2
  });
}

// 7. الإحصائيات العامة
export function useSystemStats() {
  return useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const result = await fetchWithFallback.fetch<any>(
        '/api/stats/overview',
        {
          timeout: 5000,
          retries: 2,
          cacheKey: 'system-stats',
          cacheExpiry: 10 * 60 * 1000
        }
      );
      return result.data || {};
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2
  });
}

// ===== Mutations =====

// 1. حجز موعد في مرفق صحي
export function useBookAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      facilityId: string;
      patientName: string;
      phone: string;
      preferredDate: string;
      preferredTime: string;
      reason: string;
    }) => {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, appointmentId: 'apt_' + Date.now() };
    },
    onSuccess: () => {
      // إعادة تحميل البيانات
      queryClient.invalidateQueries({ queryKey: ['health-facilities'] });
    }
  });
}

// 2. طلب دم من بنك الدم
export function useRequestBlood() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      bloodBankId: string;
      bloodType: string;
      quantity: number;
      patientName: string;
      phone: string;
      urgency: 'low' | 'medium' | 'high';
    }) => {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, requestId: 'req_' + Date.now() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blood-banks'] });
    }
  });
}

// 3. التقدم لوظيفة
export function useApplyJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      jobId: string;
      applicantName: string;
      email: string;
      phone: string;
      resume: string;
      coverLetter?: string;
    }) => {
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, applicationId: 'app_' + Date.now() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  });
}

// ===== Utility Functions =====

// إعادة تحميل جميع البيانات
export function useRefreshAllData() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['health-facilities'] });
    queryClient.invalidateQueries({ queryKey: ['blood-banks'] });
    queryClient.invalidateQueries({ queryKey: ['jobs'] });
    queryClient.invalidateQueries({ queryKey: ['electricity-status'] });
    queryClient.invalidateQueries({ queryKey: ['currency-rates'] });
    queryClient.invalidateQueries({ queryKey: ['system-stats'] });
  };
}

// مسح جميع البيانات المحفوظة
export function useClearAllCache() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.clear();
    fetchWithFallback.clearCache();
  };
}
