import React from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  MapPin, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Home
} from 'lucide-react';

const WaterPage: React.FC = () => {
  const [, setLocation] = useLocation();



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-800 rounded-full mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">خدمات المياه</h1>
          <p className="text-sky-300">اطلب صهريج مياه بسهولة وسرعة</p>
        </div>
              




        {/* خدمات المياه الفرعية */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">أقسام خدمات المياه المتاحة</h2>
          
          {/* الصف الأول - الخدمات الأساسية */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* خزانات المنازل */}
            <div 
              className="water-service-card home-tanks-gradient rounded-xl p-4 border-2 border-sky-200 cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
              onClick={() => setLocation('/water/home-tanks')}
            >
              <div className="text-center">
                <div className="text-3xl mb-3 flex justify-center">
                  🏠
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  خزانات المنازل
                </h3>
                <p className="text-xs text-white mb-3 leading-relaxed">
                  تركيب وصيانة خزانات المياه المنزلية
                </p>
                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg py-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
                  اطلب الخدمة
                </button>
              </div>
            </div>

            {/* صهاريج متنقلة */}
            <div 
              className="water-service-card mobile-tankers-gradient rounded-xl p-4 border-2 border-teal-200 cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
              onClick={() => setLocation('/water/mobile-tankers')}
            >
              <div className="text-center">
                <div className="text-3xl mb-3 flex justify-center">
                  💧
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  صهاريج متنقلة
                </h3>
                <p className="text-xs text-white mb-3 leading-relaxed">
                  توصيل المياه مباشرة إلى منزلك
                </p>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg py-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
                  اطلب صهريج
                </button>
              </div>
            </div>
          </div>

          {/* الصف الثاني - الخدمات المساعدة */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* حاسبة الاستهلاك */}
            <div 
              className="water-service-card water-gradient rounded-xl p-4 border-2 border-sky-200 cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
              onClick={() => setLocation('/water/consumption-calculator')}
            >
              <div className="text-center">
                <div className="text-3xl mb-3 flex justify-center">
                  📱
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  حاسبة الاستهلاك
                </h3>
                <p className="text-xs text-white mb-3 leading-relaxed">
                  احسب استهلاكك المائي الشهري
                </p>
                <button className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg py-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
                  احسب الآن
                </button>
              </div>
            </div>

            {/* ماء سبيل */}
            <div 
              className="water-service-card water-points-gradient rounded-xl p-4 border-2 border-green-200 cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
              onClick={() => setLocation('/water/water-points')}
            >
              <div className="text-center">
                <div className="text-3xl mb-3 flex justify-center">
                  📍
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  ماء سبيل
                </h3>
                <p className="text-xs text-white mb-3 leading-relaxed">
                  أقرب نقاط المياه السبيل في عدن
                </p>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg py-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
                  عرض الخريطة
                </button>
              </div>
            </div>
          </div>

          {/* الصف الثالث - الخدمات المتخصصة */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* صيانة الخزانات */}
            <div 
              className="water-service-card maintenance-gradient rounded-xl p-4 border-2 border-purple-200 cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
              onClick={() => setLocation('/water/tank-maintenance')}
            >
              <div className="text-center">
                <div className="text-3xl mb-3 flex justify-center">
                  🔧
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  صيانة الخزانات
                </h3>
                <p className="text-xs text-white mb-3 leading-relaxed">
                  تنظيف وصيانة خزانات المياه
                </p>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg py-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
                  احجز موعد
                </button>
              </div>
            </div>

            {/* المياه بالجملة */}
            <div 
              className="water-service-card bulk-water-gradient rounded-xl p-4 border-2 border-indigo-200 cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-95"
              onClick={() => setLocation('/water/bulk-water')}
            >
              <div className="text-center">
                <div className="text-3xl mb-3 flex justify-center">
                  🏭
                </div>
                <h3 className="text-sm font-bold text-white mb-2">
                  المياه بالجملة
                </h3>
                <p className="text-xs text-white mb-3 leading-relaxed">
                  كميات كبيرة من المياه بأسعار مخفضة للمؤسسات
                </p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg py-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95">
                  اطلب عرض سعر
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* أزرار التنقل */}
        <div className="flex justify-center items-end mt-6">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/')}
            className="border-teal-500 text-sky-300 hover:bg-teal-700"
          >
            <Home className="w-4 h-4 mr-2" />
            الرئيسية
          </Button>
        </div>
      </main>
    </div>
  );
};

export default WaterPage;
