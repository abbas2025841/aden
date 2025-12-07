// نظام Fetch محسن مع معالجة 404 والاحتياطي للبيانات المحفوظة
// Cursor الأسطوري - عدن لايف

export interface FetchOptions {
  timeout?: number;
  retries?: number;
  fallbackData?: any;
  cacheKey?: string;
  cacheExpiry?: number; // in milliseconds
  headers?: Record<string, string>;
}

export interface FetchResult<T> {
  data: T | null;
  error: string | null;
  source: 'api' | 'cache' | 'fallback';
  status: number;
  cached: boolean;
  lastUpdated: number;
}

class FetchWithFallback {
  private cache = new Map<string, { data: any; timestamp: number; expiry: number }>();
  private defaultTimeout = 10000; // 10 seconds
  private defaultRetries = 3;

  // تنظيف الكاش المنتهي الصلاحية
  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // حفظ البيانات في الكاش
  private setCache(key: string, data: any, expiry: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + expiry
    });
  }

  // جلب البيانات من الكاش
  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() <= cached.expiry) {
      return cached.data;
    }
    return null;
  }

  // Fetch مع timeout
  private async fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json, text/html, */*',
          'User-Agent': 'AdenLiveApp/2.0',
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Fetch مع إعادة المحاولة
  private async fetchWithRetry(url: string, options: RequestInit, retries: number): Promise<Response> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options, this.defaultTimeout);
        
        // إذا كان 404، لا نعيد المحاولة
        if (response.status === 404) {
          throw new Error(`404 - Resource not found: ${url}`);
        }
        
        // إذا كان 5xx، نعيد المحاولة
        if (response.status >= 500 && attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        
        return response;
      } catch (error) {
        lastError = error as Error;
        
        // إذا كان 404 أو خطأ في الشبكة، لا نعيد المحاولة
        if (error instanceof Error && (
          error.message.includes('404') || 
          error.name === 'AbortError' ||
          error.message.includes('Failed to fetch')
        )) {
          break;
        }
        
        // انتظار قبل إعادة المحاولة
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  // الدالة الرئيسية للـ Fetch مع Fallback
  async fetch<T>(
    url: string, 
    options: FetchOptions = {}
  ): Promise<FetchResult<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      fallbackData = null,
      cacheKey = url,
      cacheExpiry = 5 * 60 * 1000, // 5 minutes default
      headers = {}
    } = options;

    // تنظيف الكاش المنتهي الصلاحية
    this.cleanExpiredCache();

    // محاولة جلب البيانات من الكاش أولاً
    const cachedData = this.getCache(cacheKey);
    if (cachedData) {
      return {
        data: cachedData,
        error: null,
        source: 'cache',
        status: 200,
        cached: true,
        lastUpdated: this.cache.get(cacheKey)?.timestamp || Date.now()
      };
    }

    try {
      // محاولة جلب البيانات من API
      const response = await this.fetchWithRetry(url, {
        method: 'GET',
        headers
      }, retries);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/html')) {
        const html = await response.text();
        data = html as unknown as T;
      } else {
        data = await response.text() as unknown as T;
      }

      // حفظ البيانات في الكاش
      this.setCache(cacheKey, data, cacheExpiry);

      return {
        data,
        error: null,
        source: 'api',
        status: response.status,
        cached: false,
        lastUpdated: Date.now()
      };

    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);

      // محاولة جلب البيانات من الكاش القديم (حتى لو انتهت صلاحيته)
      const staleCache = this.cache.get(cacheKey);
      if (staleCache) {
        console.warn(`Using stale cache for ${url}`);
        return {
          data: staleCache.data,
          error: null,
          source: 'cache',
          status: 200,
          cached: true,
          lastUpdated: staleCache.timestamp
        };
      }

      // استخدام البيانات الاحتياطية
      if (fallbackData) {
        console.warn(`Using fallback data for ${url}`);
        return {
          data: fallbackData,
          error: null,
          source: 'fallback',
          status: 200,
          cached: false,
          lastUpdated: Date.now()
        };
      }

      // إرجاع خطأ
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'api',
        status: 0,
        cached: false,
        lastUpdated: Date.now()
      };
    }
  }

  // مسح الكاش
  clearCache(cacheKey?: string): void {
    if (cacheKey) {
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  // الحصول على إحصائيات الكاش
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const fetchWithFallback = new FetchWithFallback();

// Hook مخصص للاستخدام في React
export function useFetchWithFallback<T>(
  url: string,
  options: FetchOptions = {}
) {
  const [result, setResult] = React.useState<FetchResult<T> | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const fetchResult = await fetchWithFallback.fetch<T>(url, options);
      setResult(fetchResult);
    } catch (error) {
      setResult({
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'api',
        status: 0,
        cached: false,
        lastUpdated: Date.now()
      });
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...result,
    loading,
    refetch: fetchData
  };
}

// React import (يجب إضافته في الملفات التي تستخدم Hook)
import React from 'react';
