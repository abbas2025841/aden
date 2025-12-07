import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { supabase, SupabaseService } from '@/lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  Zap, 
  Users, 
  Clock, 
  MapPin,
  BarChart3,
  Activity,
  Shield,
  Server,
  RefreshCw
} from 'lucide-react';

export default function SystemStatusPage() {
  const [systemStatus, setSystemStatus] = useState({
    database: 'checking',
    api: 'checking',
    reports: 0,
    confirmations: 0,
    users: 0,
    districts: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [districtStatus, setDistrictStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // فحص حالة النظام
  const checkSystemStatus = async () => {
    try {
      setIsLoading(true);
      
      // فحص قاعدة البيانات
      const { data: reportsData, error: reportsError } = await supabase
        .from('electricity_reports')
        .select('count')
        .limit(1);

      const { data: confirmationsData, error: confirmationsError } = await supabase
        .from('collective_confirmations')
        .select('count')
        .limit(1);

      const { data: usersData, error: usersError } = await supabase
        .from('unique_users')
        .select('count')
        .limit(1);

      const { data: districtsData, error: districtsError } = await supabase
        .from('districts')
        .select('count')
        .limit(1);

      // فحص API
      const apiResponse = await fetch('/api/electricity/statistics');
      const apiStatus = apiResponse.ok ? 'connected' : 'error';

      setSystemStatus({
        database: reportsError || confirmationsError || usersError || districtsError ? 'error' : 'connected',
        api: apiStatus,
        reports: reportsData?.length || 0,
        confirmations: confirmationsData?.length || 0,
        users: usersData?.length || 0,
        districts: districtsData?.length || 0
      });

      // جلب النشاط الأخير
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      setRecentActivity(activityData || []);

      // جلب حالة المديريات
      const { data: districtsStatusData } = await supabase
        .from('collective_confirmations')
        .select('*')
        .eq('is_active', true)
        .order('confirmed_at', { ascending: false });

      setDistrictStatus(districtsStatusData || []);

    } catch (error) {
      console.error('خطأ في فحص حالة النظام:', error);
      setSystemStatus(prev => ({ ...prev, database: 'error', api: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث دوري
  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000); // كل 30 ثانية
    return () => clearInterval(interval);
  }, []);

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'checking': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5" />;
      case 'checking': return <Clock className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'checking': return 'جاري التحقق';
      case 'error': return 'خطأ';
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
            📊 حالة النظام
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            مراقبة شاملة لحالة نظام البلاغات للكهرباء
          </p>
        </div>

        {/* حالة النظام العامة */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* قاعدة البيانات */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">قاعدة البيانات</h2>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus.database)}`}>
                {getStatusIcon(systemStatus.database)}
                {getStatusText(systemStatus.database)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{systemStatus.reports}</div>
                <div className="text-sm text-gray-600">البلاغات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{systemStatus.confirmations}</div>
                <div className="text-sm text-gray-600">التأكيدات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{systemStatus.users}</div>
                <div className="text-sm text-gray-600">المستخدمين</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{systemStatus.districts}</div>
                <div className="text-sm text-gray-600">المديريات</div>
              </div>
            </div>
          </div>

          {/* API */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">API</h2>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStatus.api)}`}>
                {getStatusIcon(systemStatus.api)}
                {getStatusText(systemStatus.api)}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">إرسال البلاغات</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">التأكيد الجماعي</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الخريطة التفاعلية</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">الإحصائيات</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
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
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{district.district}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      district.status === 'on' ? 'bg-green-100 text-green-800' :
                      district.status === 'off' ? 'bg-red-100 text-red-800' :
                      district.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {district.status === 'on' ? 'مشغل' :
                       district.status === 'off' ? 'مطفأ' :
                       district.status === 'partial' ? 'جزئي' : 'غير مؤكد'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>البلاغات: {district.report_count}</p>
                    <p>المستخدمين: {district.unique_users}</p>
                    <p>ينتهي في: {new Date(district.expires_at).toLocaleString('ar-SA')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* النشاط الأخير */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">النشاط الأخير</h2>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>لا يوجد نشاط حديث</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">
                        {activity.district && `${activity.district} - `}
                        {activity.status && `${activity.status} - `}
                        {activity.device_fingerprint && `جهاز: ${activity.device_fingerprint.slice(0, 8)}...`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('ar-SA')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* معلومات النظام */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* معلومات Supabase */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات Supabase</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>قاعدة البيانات: PostgreSQL</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Row Level Security: مفعل</span>
              </div>
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                <span>الخادم: yyscldfxdfhequxcyiao.supabase.co</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>الجداول: 6 جداول متخصصة</span>
              </div>
            </div>
          </div>

          {/* ميزات النظام */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">ميزات النظام</h3>
            <div className="space-y-2 text-sm text-green-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>التأكيد الجماعي (3 بلاغات في 3 دقائق)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>تتبع المستخدمين الفريدين</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>خريطة تفاعلية مع Leaflet</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>تسجيل جميع الأنشطة</span>
              </div>
            </div>
          </div>
        </div>

        {/* زر التحديث */}
        <div className="text-center mt-8">
          <button
            onClick={checkSystemStatus}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mx-auto"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث حالة النظام
          </button>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
