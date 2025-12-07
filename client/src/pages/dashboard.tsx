import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { supabase } from '@/lib/supabase';
import { 
  Zap, 
  Users, 
  MapPin, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalReports: 0,
    todayReports: 0,
    confirmedDistricts: 0,
    totalDistricts: 6,
    uniqueUsers: 0,
    systemStatus: 'checking'
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [districtStatus, setDistrictStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب الإحصائيات
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      
      // جلب البلاغات
      const { data: reportsData } = await supabase
        .from('electricity_reports')
        .select('*')
        .order('timestamp', { ascending: false });

      // جلب التأكيدات
      const { data: confirmationsData } = await supabase
        .from('collective_confirmations')
        .select('*')
        .eq('is_active', true);

      // جلب المستخدمين
      const { data: usersData } = await supabase
        .from('unique_users')
        .select('*');

      // حساب الإحصائيات
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayReports = reportsData?.filter(report => 
        new Date(report.timestamp) >= today
      ).length || 0;

      setStats({
        totalReports: reportsData?.length || 0,
        todayReports,
        confirmedDistricts: confirmationsData?.length || 0,
        totalDistricts: 6,
        uniqueUsers: usersData?.length || 0,
        systemStatus: 'connected'
      });

      // البلاغات الأخيرة
      setRecentReports(reportsData?.slice(0, 5) || []);

      // حالة المديريات
      setDistrictStatus(confirmationsData || []);

    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
      setStats(prev => ({ ...prev, systemStatus: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // كل دقيقة
    return () => clearInterval(interval);
  }, []);

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on': return 'text-green-600 bg-green-100';
      case 'off': return 'text-red-600 bg-red-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'unknown': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on': return <TrendingUp className="w-4 h-4" />;
      case 'off': return <TrendingDown className="w-4 h-4" />;
      case 'partial': return <Minus className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'on': return 'مشغل';
      case 'off': return 'مطفأ';
      case 'partial': return 'جزئي';
      case 'unknown': return 'غير مؤكد';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ⚡ لوحة تحكم نظام البلاغات
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نظام تأكيد جماعي للكهرباء في عدن
          </p>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي البلاغات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">+{stats.todayReports} اليوم</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المديريات المؤكدة</p>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmedDistricts}/{stats.totalDistricts}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                {Math.round((stats.confirmedDistricts / stats.totalDistricts) * 100)}% مؤكد
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">المستخدمين الفريدين</p>
                <p className="text-3xl font-bold text-gray-900">{stats.uniqueUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">مستخدمين نشطين</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">حالة النظام</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.systemStatus === 'connected' ? '🟢' : 
                   stats.systemStatus === 'error' ? '🔴' : '🟡'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stats.systemStatus === 'connected' ? 'text-green-600' :
                stats.systemStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {stats.systemStatus === 'connected' ? 'متصل' :
                 stats.systemStatus === 'error' ? 'خطأ' : 'جاري التحقق'}
              </span>
            </div>
          </div>
        </div>

        {/* حالة المديريات */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">حالة المديريات</h2>
          
          {districtStatus.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>لا توجد تأكيدات نشطة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {districtStatus.map((district) => (
                <div key={district.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{district.district}</h3>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(district.status)}`}>
                      {getStatusIcon(district.status)}
                      {getStatusText(district.status)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>البلاغات:</span>
                      <span className="font-medium">{district.report_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المستخدمين:</span>
                      <span className="font-medium">{district.unique_users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ينتهي في:</span>
                      <span className="font-medium">
                        {new Date(district.expires_at).toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* البلاغات الأخيرة */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">البلاغات الأخيرة</h2>
          
          {recentReports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>لا توجد بلاغات حديثة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.district}</p>
                      <p className="text-sm text-gray-600">
                        جهاز: {report.device_fingerprint.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {getStatusText(report.status)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.timestamp).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* روابط سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="/interactive-map" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">الخريطة التفاعلية</h3>
                <p className="text-sm text-gray-600">عرض حالة المديريات</p>
              </div>
            </div>
          </a>

          <a href="/collective-confirmation-test" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">اختبار التأكيد</h3>
                <p className="text-sm text-gray-600">نظام التأكيد الجماعي</p>
              </div>
            </div>
          </a>

          <a href="/supabase-test" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">اختبار Supabase</h3>
                <p className="text-sm text-gray-600">فحص قاعدة البيانات</p>
              </div>
            </div>
          </a>

          <a href="/system-status" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">حالة النظام</h3>
                <p className="text-sm text-gray-600">مراقبة شاملة</p>
              </div>
            </div>
          </a>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
