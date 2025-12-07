import React, { useState, useEffect } from 'react';
import AdvancedSearch from '@/components/AdvancedSearch';
import { Card, EnhancedCard, StatsCard, ProgressBar, LoadingSpinner, Alert, EnhancedTabs } from '@/components/EnhancedUI';
import { externalAPIService } from '@/services/ExternalAPIs';
import { notificationService } from '@/services/NotificationService';
import { Star, Users, TrendingUp, Activity, Heart, Share2, Bookmark } from 'lucide-react';

export default function FeaturesTestEnhancedPage() {
  const [activeTab, setActiveTab] = useState('search');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  const tabs = [
    { id: 'search', label: 'البحث المتقدم', icon: <Activity className="w-4 h-4" /> },
    { id: 'ui', label: 'واجهة محسنة', icon: <Heart className="w-4 h-4" /> },
    { id: 'apis', label: 'APIs خارجية', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Users className="w-4 h-4" /> }
  ];

  useEffect(() => {
    loadExternalData();
  }, []);

  const loadExternalData = async () => {
    setIsLoading(true);
    try {
      const [weather, news] = await Promise.all([
        externalAPIService.getWeatherData(),
        externalAPIService.getLocalNews(5)
      ]);

      if (weather.success) setWeatherData(weather.data);
      if (news.success) setNewsData(news.data || []);
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'فشل في تحميل البيانات الخارجية' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string, filters: any) => {
    setAlertMessage({ 
      type: 'success', 
      message: `تم البحث عن: "${query}" مع ${Object.keys(filters).length} فلتر` 
    });
  };

  const handleSendNotification = async () => {
    await notificationService.sendNotification({
      title: 'اختبار الإشعارات',
      message: 'هذا إشعار تجريبي من صفحة الاختبار',
      type: 'info',
      category: 'update',
      priority: 'medium'
    });
    setAlertMessage({ type: 'success', message: 'تم إرسال إشعار تجريبي' });
  };

  const renderAdvancedSearch = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">البحث المتقدم</h2>
      <AdvancedSearch
        onSearch={handleSearch}
        placeholder="ابحث في الخدمات التجريبية..."
        showFilters={true}
        showSuggestions={true}
      />
    </div>
  );

  const renderEnhancedUI = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">واجهة المستخدم المحسنة</h2>
      
      {/* البطاقات الموحدة */}
      <div>
        <h3 className="text-lg font-semibold mb-4">البطاقات الموحدة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card
            title="خدمة صهاريج المياه"
            description="توصيل صهاريج المياه إلى جميع أنحاء عدن بأسعار منافسة وجودة عالية"
            icon={<Activity className="w-6 h-6" />}
            onClick={() => setAlertMessage({ type: 'info', message: 'تم النقر على بطاقة صهاريج المياه' })}
          />
          
          <Card
            title="نقاط شحن الكهرباء"
            description="شحن البطاريات والأجهزة الإلكترونية في نقاط موزعة في المدينة"
            icon={<TrendingUp className="w-6 h-6" />}
            variant="outlined"
            onClick={() => setAlertMessage({ type: 'info', message: 'تم النقر على بطاقة نقاط الشحن' })}
          />
          
          <Card
            title="خدمات الصحة"
            description="معلومات المستشفيات والصيدليات وخدمات الطوارئ الطبية"
            icon={<Heart className="w-6 h-6" />}
            variant="filled"
            size="sm"
            onClick={() => setAlertMessage({ type: 'info', message: 'تم النقر على بطاقة الخدمات الصحية' })}
          />
        </div>
      </div>
      
      {/* البطاقات المحسنة */}
      <div>
        <h3 className="text-lg font-semibold mb-4">البطاقات المحسنة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EnhancedCard
            title="خدمة صهاريج المياه"
            description="خدمة توصيل صهاريج المياه إلى جميع أنحاء عدن بأسعار منافسة وجودة عالية"
            rating={4.5}
            reviews={127}
            price={150}
            location="كريتر"
            category="مياه"
            views={1250}
            comments={23}
            likes={89}
            trending={true}
            verified={true}
            onFavorite={() => setAlertMessage({ type: 'info', message: 'تم إضافة للمفضلة' })}
            onBookmark={() => setAlertMessage({ type: 'info', message: 'تم إضافة للإشارات المرجعية' })}
            onShare={() => setAlertMessage({ type: 'info', message: 'تم مشاركة الخدمة' })}
          />
          
          <EnhancedCard
            title="نقاط شحن الكهرباء"
            description="شحن البطاريات والأجهزة الإلكترونية في نقاط شحن موزعة في جميع أنحاء المدينة"
            rating={4.2}
            reviews={89}
            price={25}
            location="المعلا"
            category="كهرباء"
            views={890}
            comments={15}
            likes={67}
            onFavorite={() => setAlertMessage({ type: 'info', message: 'تم إضافة للمفضلة' })}
          />
        </div>
      </div>

      {/* إحصائيات */}
      <div>
        <h3 className="text-lg font-semibold mb-4">بطاقات الإحصائيات</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="إجمالي الخدمات"
            value={1250}
            change={12}
            icon={<Activity className="w-6 h-6" />}
            color="blue"
            trend="up"
          />
          <StatsCard
            title="المستخدمين النشطين"
            value={8900}
            change={-3}
            icon={<Users className="w-6 h-6" />}
            color="green"
            trend="down"
          />
          <StatsCard
            title="التقييمات"
            value={4567}
            change={8}
            icon={<Star className="w-6 h-6" />}
            color="yellow"
            trend="up"
          />
        </div>
      </div>

      {/* أشرطة التقدم */}
      <div>
        <h3 className="text-lg font-semibold mb-4">أشرطة التقدم</h3>
        <div className="space-y-4">
          <ProgressBar
            value={75}
            label="معدل الرضا"
            color="green"
            animated={true}
          />
          <ProgressBar
            value={60}
            label="استخدام الخدمات"
            color="blue"
          />
          <ProgressBar
            value={90}
            label="جودة الخدمة"
            color="purple"
          />
        </div>
      </div>
    </div>
  );

  const renderExternalAPIs = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">APIs الخارجية</h2>
      
      {isLoading ? (
        <LoadingSpinner text="جاري تحميل البيانات..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* بيانات الطقس */}
          {weatherData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">الطقس الحالي</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>درجة الحرارة:</span>
                  <span className="font-bold">{weatherData.temperature.toFixed(1)}°م</span>
                </div>
                <div className="flex justify-between">
                  <span>الرطوبة:</span>
                  <span className="font-bold">{weatherData.humidity.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>الوصف:</span>
                  <span className="font-bold">{weatherData.description}</span>
                </div>
                <div className="flex justify-between">
                  <span>سرعة الرياح:</span>
                  <span className="font-bold">{weatherData.windSpeed.toFixed(1)} كم/س</span>
                </div>
              </div>
            </div>
          )}

          {/* الأخبار */}
          {newsData.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">الأخبار المحلية</h3>
              <div className="space-y-4">
                {newsData.map((news, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
                    <h4 className="font-medium text-sm mb-1">{news.title}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{news.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{news.source}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(news.publishedAt).toLocaleDateString('ar-YE')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={loadExternalData}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        تحديث البيانات
      </button>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">نظام الإشعارات</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">اختبار الإشعارات</h3>
        <div className="space-y-4">
          <button
            onClick={handleSendNotification}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            إرسال إشعار تجريبي
          </button>
          
          <div className="text-sm text-gray-600">
            <p>• انقر على زر الجرس في الهيدر لعرض مركز الإشعارات</p>
            <p>• يمكنك تخصيص إعدادات الإشعارات من المركز</p>
            <p>• الإشعارات تظهر تلقائياً للطوارئ والأحداث المهمة</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return renderAdvancedSearch();
      case 'ui':
        return renderEnhancedUI();
      case 'apis':
        return renderExternalAPIs();
      case 'notifications':
        return renderNotifications();
      default:
        return renderAdvancedSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">اختبار الميزات المحسنة</h1>
          <p className="text-gray-600">تجربة جميع الميزات المحسنة والمضافة للتطبيق</p>
        </div>

        {/* التبويبات */}
        <EnhancedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pills"
        />

        {/* المحتوى */}
        <div className="mt-8">
          {renderContent()}
        </div>

        {/* التنبيهات */}
        {alertMessage && (
          <div className="fixed bottom-4 right-4 z-50">
            <Alert
              type={alertMessage.type}
              message={alertMessage.message}
              dismissible={true}
              onDismiss={() => setAlertMessage(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
