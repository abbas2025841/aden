// مثال على استخدام نظام Fetch المحسن للقسم الداخلي
// Cursor الأسطوري - عدن لايف

import React, { useState, useEffect } from 'react';
import { fetchWithFallback, FetchResult, useFetchWithFallback } from '@/lib/fetchWithFallback';

interface InternalData {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

// مثال 1: استخدام Hook المخصص
export function InternalSectionWithHook() {
  const { data, loading, error, source, refetch } = useFetchWithFallback<InternalData[]>(
    '/api/internal-sections',
    {
      timeout: 5000,
      retries: 3,
      fallbackData: [
        {
          id: 'fallback-1',
          title: 'قسم احتياطي',
          content: 'هذا محتوى احتياطي في حالة عدم توفر البيانات',
          lastUpdated: new Date().toISOString()
        }
      ],
      cacheKey: 'internal-sections',
      cacheExpiry: 10 * 60 * 1000 // 10 دقائق
    }
  );

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded-lg">
        <div className="text-red-700">
          <strong>خطأ في تحميل البيانات:</strong> {error}
        </div>
        <button 
          onClick={refetch}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">الأقسام الداخلية</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${
            source === 'api' ? 'bg-green-100 text-green-800' :
            source === 'cache' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {source === 'api' ? '🟢 مباشر' : 
             source === 'cache' ? '🟡 محفوظ' : '⚪ احتياطي'}
          </span>
          <button 
            onClick={refetch}
            className="p-1 hover:bg-gray-100 rounded"
            title="تحديث"
          >
            🔄
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {data?.map((section) => (
          <div key={section.id} className="p-3 bg-gray-50 rounded border">
            <h4 className="font-medium text-gray-900">{section.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{section.content}</p>
            <div className="text-xs text-gray-500 mt-2">
              آخر تحديث: {new Date(section.lastUpdated).toLocaleString('ar-YE')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// مثال 2: استخدام الدالة مباشرة
export function InternalSectionWithDirectFetch() {
  const [data, setData] = useState<InternalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'cache' | 'fallback'>('fallback');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result: FetchResult<InternalData[]> = await fetchWithFallback.fetch(
        '/api/internal-sections',
        {
          timeout: 5000,
          retries: 3,
          fallbackData: [
            {
              id: 'fallback-1',
              title: 'قسم احتياطي',
              content: 'هذا محتوى احتياطي في حالة عدم توفر البيانات',
              lastUpdated: new Date().toISOString()
            }
          ],
          cacheKey: 'internal-sections-direct',
          cacheExpiry: 10 * 60 * 1000
        }
      );

      if (result.data) {
        setData(result.data);
        setSource(result.source);
      } else {
        setError(result.error || 'فشل في جلب البيانات');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white border rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">الأقسام الداخلية (Direct Fetch)</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs ${
            source === 'api' ? 'bg-green-100 text-green-800' :
            source === 'cache' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {source === 'api' ? '🟢 مباشر' : 
             source === 'cache' ? '🟡 محفوظ' : '⚪ احتياطي'}
          </span>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            title="تحديث"
          >
            {loading ? '⏳' : '🔄'}
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <strong>خطأ:</strong> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className="space-y-3">
          {data.map((section) => (
            <div key={section.id} className="p-3 bg-gray-50 rounded border">
              <h4 className="font-medium text-gray-900">{section.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{section.content}</p>
              <div className="text-xs text-gray-500 mt-2">
                آخر تحديث: {new Date(section.lastUpdated).toLocaleString('ar-YE')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// مثال 3: معالجة 404 مخصصة
export function InternalSectionWith404Handling() {
  const [data, setData] = useState<InternalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setIs404(false);

    try {
      const result: FetchResult<InternalData[]> = await fetchWithFallback.fetch(
        '/api/internal-sections',
        {
          timeout: 5000,
          retries: 0, // لا نعيد المحاولة للـ 404
          fallbackData: [
            {
              id: 'not-found',
              title: 'القسم غير موجود',
              content: 'عذراً، القسم المطلوب غير متوفر حالياً. يرجى المحاولة لاحقاً.',
              lastUpdated: new Date().toISOString()
            }
          ],
          cacheKey: 'internal-sections-404',
          cacheExpiry: 5 * 60 * 1000
        }
      );

      if (result.error?.includes('404')) {
        setIs404(true);
        setData((result as any).fallbackData || []);
      } else if (result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'فشل في جلب البيانات');
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        setIs404(true);
        setData([
          {
            id: 'not-found',
            title: 'القسم غير موجود',
            content: 'عذراً، القسم المطلوب غير متوفر حالياً. يرجى المحاولة لاحقاً.',
            lastUpdated: new Date().toISOString()
          }
        ]);
      } else {
        setError(err instanceof Error ? err.message : 'خطأ غير معروف');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white border rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">الأقسام الداخلية (404 Handling)</h3>
        <button 
          onClick={fetchData}
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          title="تحديث"
        >
          {loading ? '⏳' : '🔄'}
        </button>
      </div>
      
      {loading && (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      )}
      
      {is404 && (
        <div className="p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
          <strong>⚠️ تنبيه:</strong> القسم المطلوب غير موجود (404)
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
          <strong>خطأ:</strong> {error}
        </div>
      )}
      
      {!loading && (
        <div className="space-y-3">
          {data.map((section) => (
            <div key={section.id} className={`p-3 rounded border ${
              is404 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
            }`}>
              <h4 className="font-medium text-gray-900">{section.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{section.content}</p>
              <div className="text-xs text-gray-500 mt-2">
                آخر تحديث: {new Date(section.lastUpdated).toLocaleString('ar-YE')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
