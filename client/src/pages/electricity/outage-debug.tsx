import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface OutageReportRow {
  id: string;
  district_id: string;
  district_name: string;
  sub_area_name: string | null;
  status: string;
  user_id: string | null;
  source: string;
  created_at: string;
}

const OutageDebugPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [localDistrictReports, setLocalDistrictReports] = useState<any[] | null>(null);
  const [localSubAreaReports, setLocalSubAreaReports] = useState<any[] | null>(null);
  const [supabaseReports, setSupabaseReports] = useState<OutageReportRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLocalStorageData = () => {
    try {
      const district = localStorage.getItem('electricity_reports');
      const subArea = localStorage.getItem('electricity_sub_area_reports');

      setLocalDistrictReports(district ? JSON.parse(district) : []);
      setLocalSubAreaReports(subArea ? JSON.parse(subArea) : []);
    } catch (err) {
      console.error('خطأ في قراءة localStorage:', err);
    }
  };

  const loadSupabaseData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('outage_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setSupabaseReports(data as OutageReportRow[]);
    } catch (err: any) {
      console.error('خطأ في جلب بيانات Supabase:', err);
      setError(err.message || 'خطأ غير معروف');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLocalStorageData();
    void loadSupabaseData();
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ar-SA');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/electricity/outage-tracker')}
            className="p-2 text-sky-300 hover:bg-slate-800"
          >
            ⬅
          </Button>
          <div>
            <h1 className="text-xl font-bold">صفحة اختبار بلاغات الكهرباء</h1>
            <p className="text-sm text-sky-300">عرض سريع لما هو مخزن في المتصفح و Supabase</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Button
            className="flex-1 bg-sky-700 hover:bg-sky-600"
            onClick={() => {
              loadLocalStorageData();
              void loadSupabaseData();
            }}
          >
            تحديث البيانات
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-500 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        {/* قسم localStorage للمديريات */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">بلاغات localStorage - مستوى المديرية</h2>
          {localDistrictReports && localDistrictReports.length === 0 && (
            <div className="text-sm text-sky-300">لا توجد بلاغات مخزنة في المتصفح.</div>
          )}
          {localDistrictReports && localDistrictReports.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-700 rounded-lg p-2 bg-slate-900/40">
              {localDistrictReports.map((r: any, idx: number) => (
                <div key={r.id || idx} className="text-xs border-b border-slate-800 pb-1 last:border-b-0">
                  <div>#{idx + 1} - {r.districtName} ({r.districtId}) - الحالة: {r.status}</div>
                  <div className="text-sky-300">الوقت: {r.timestamp}</div>
                  <div className="text-slate-400">user_id: {r.userId}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم localStorage للمناطق الفرعية */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">بلاغات localStorage - المناطق الفرعية</h2>
          {localSubAreaReports && localSubAreaReports.length === 0 && (
            <div className="text-sm text-sky-300">لا توجد بلاغات مناطق فرعية في المتصفح.</div>
          )}
          {localSubAreaReports && localSubAreaReports.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-700 rounded-lg p-2 bg-slate-900/40">
              {localSubAreaReports.map((r: any, idx: number) => (
                <div key={r.id || idx} className="text-xs border-b border-slate-800 pb-1 last:border-b-0">
                  <div>#{idx + 1} - {r.districtName} ({r.districtId}) - {r.subAreaName}</div>
                  <div>الحالة: {r.status}</div>
                  <div className="text-sky-300">الوقت: {r.timestamp}</div>
                  <div className="text-slate-400">user_id: {r.userId}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* قسم Supabase */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">بلاغات Supabase (جدول outage_reports)</h2>
          {isLoading && (
            <div className="text-sm text-sky-300 mb-2">جاري تحميل بيانات Supabase...</div>
          )}
          {supabaseReports && supabaseReports.length === 0 && !isLoading && (
            <div className="text-sm text-sky-300">لا توجد بلاغات في Supabase (آخر 100 سجل فقط).</div>
          )}
          {supabaseReports && supabaseReports.length > 0 && (
            <div className="space-y-2 max-h-72 overflow-y-auto border border-slate-700 rounded-lg p-2 bg-slate-900/40">
              {supabaseReports.map((r) => (
                <div key={r.id} className="text-xs border-b border-slate-800 pb-1 last:border-b-0">
                  <div className="font-semibold">
                    {r.district_name} ({r.district_id})
                    {r.sub_area_name ? ` - ${r.sub_area_name}` : ''}
                  </div>
                  <div>الحالة: {r.status} | المصدر: {r.source}</div>
                  <div className="text-sky-300">الوقت: {formatTime(r.created_at)}</div>
                  <div className="text-slate-400">user_id: {r.user_id}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default OutageDebugPage;
