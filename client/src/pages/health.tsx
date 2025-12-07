import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, MapPin, Phone, Clock, Star, Users, Building, 
  Calendar, Droplets, AlertTriangle, Truck, 
  Newspaper, MessageSquare, Search, Shield
} from "lucide-react";
import { adenHealthFacilities, HealthFacility } from "@/data/aden-health-facilities";

export default function HealthPage() {
  const [, setLocation] = useLocation();

  // استخدام البيانات الحقيقية مع فلترة للحصول على أفضل المرافق
  const featuredHealthServices = useMemo(() => {
    return adenHealthFacilities
      .filter(facility => 
        facility.type === 'hospital' || 
        facility.type === 'clinic' || 
        facility.type === 'pharmacy'
      )
      .sort((a, b) => {
        // ترتيب حسب التقييم أولاً، ثم حسب نوع المرفق
        if (a.rating && b.rating) {
          return b.rating - a.rating;
        }
        if (a.type === 'hospital' && b.type !== 'hospital') return -1;
        if (b.type === 'hospital' && a.type !== 'hospital') return 1;
        return 0;
      })
      .slice(0, 6); // عرض أفضل 6 مرافق
  }, []);

  // إحصائيات سريعة
  const healthStats = useMemo(() => {
    const hospitals = adenHealthFacilities.filter(f => f.type === 'hospital').length;
    const clinics = adenHealthFacilities.filter(f => f.type === 'clinic').length;
    const pharmacies = adenHealthFacilities.filter(f => f.type === 'pharmacy').length;
    const emergency = adenHealthFacilities.filter(f => f.availability.emergency).length;
    
    return { hospitals, clinics, pharmacies, emergency, total: adenHealthFacilities.length };
  }, []);

  // تعريف أقسام الخدمات الصحية مرتبة حسب الأولوية
  const healthSections = [
    // الصف الأول - الأهم (جاهزة)
    {
      id: 'blood-bank',
      title: 'بنك الدم',
      description: 'عرض طلبات الدم العاجلة وتسجيل المتبرعين',
      icon: '🩸',
      buttonText: 'ادخل الآن',
      action: () => setLocation('/blood-bank')
    },
    {
      id: 'facilities-directory',
      title: 'دليل المرافق الصحية',
      description: 'مستشفيات وعيادات وصيدليات عدن بالمواقع والتقييمات',
      icon: '🗺️',
      buttonText: 'شوف الخريطة',
      action: () => setLocation('/health-facilities')
    },
    {
      id: 'emergency-services',
      title: 'خدمات الطوارئ',
      description: 'أرقام الإسعاف والطوارئ الطبية السريعة',
      icon: '🚑',
      buttonText: 'طوارئ فوري',
      action: () => setLocation('/emergency')
    },
    {
      id: 'health-news',
      title: 'الأخبار الصحية',
      description: 'آخر الأخبار الصحية والتوعوية من وزارة الصحة',
      icon: '📰',
      buttonText: 'اقرأ الأخبار',
      action: () => setLocation('/health-news')
    },
    // الصف الثاني - جاهزة
    {
      id: 'services-evaluation',
      title: 'تقييم الخدمات',
      description: 'قيم تجربتك مع المستشفيات والأطباء',
      icon: '⭐',
      buttonText: 'أضف تقييم',
      action: () => setLocation('/health-evaluation'),
      isUnderDevelopment: true
    },
    // الصف الثالث - قيد التطوير (تم نقلها للأسفل)
    {
      id: 'appointments',
      title: 'حجز المواعيد الطبية',
      description: 'احجز موعد في العيادات والمستشفيات إلكترونياً',
      icon: '📅',
      buttonText: 'احجز موعد',
      action: () => setLocation('/health-appointments'),
      isUnderDevelopment: true
    },
    {
      id: 'phone-consultation',
      title: 'استشارة طبية هاتفية',
      description: 'تحدث مع طبيب مختص عبر الهاتف',
      icon: '📞',
      buttonText: 'اتصل بطبيب',
      action: () => setLocation('/phone-consultation'),
      isUnderDevelopment: true
    },
    {
      id: 'health-alerts',
      title: 'التنبيهات الصحية',
      description: 'إشعارات التطعيم والحملات الصحية في عدن',
      icon: '⚠️',
      buttonText: 'شوف التنبيهات',
      action: () => setLocation('/health-alerts'),
      isUnderDevelopment: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      <style>
        {`
        .health-loading svg polyline {
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .health-loading svg polyline#back {
          fill: none;
          stroke: #ff4d5033;
        }

        .health-loading svg polyline#front {
          fill: none;
          stroke: #ff4d4f;
          stroke-dasharray: 48, 144;
          stroke-dashoffset: 192;
          animation: healthDash 1.4s linear infinite;
        }

        @keyframes healthDash {
          72.5% {
            opacity: 0;
          }

          to {
            stroke-dashoffset: 0;
          }
        }
        `}
      </style>
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <div className="health-loading w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <svg width="64" height="48" viewBox="0 0 64 48">
              <polyline
                points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                id="back"
              />
              <polyline
                points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"
                id="front"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">الخدمات الصحية</h1>
          <p className="text-gray-300">اكتشف المرافق الصحية في عدن</p>
          <div className="mt-2 text-sm text-gray-400">
            {healthStats.total} مرفق صحي متاح في جميع أنحاء عدن
          </div>
        </div>

        {/* أقسام الخدمات الصحية */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {healthSections.map((section) => (
            <div 
              key={section.id}
              className={`rounded-xl p-4 border cursor-pointer transition-all hover:translateY(-4px) hover:scale-105 active:scale-95 ${
                section.isUnderDevelopment 
                  ? 'bg-orange-900 border-orange-800 opacity-75' 
                  : 'bg-red-900 border-red-800'
              }`}
              onClick={section.action}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 flex justify-center">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {section.title}
                  {section.isUnderDevelopment && (
                    <span className="text-xs text-orange-300 block mt-1">🚧 قيد التطوير</span>
                  )}
                </h3>
                <p className="text-sm text-white mb-4 leading-relaxed">
                  {section.description}
                </p>
                <button className={`w-full touch-target text-white typography-caption font-semibold rounded-xl transition-all hover:shadow-lg active:scale-95 ${
                  section.isUnderDevelopment 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                  {section.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}