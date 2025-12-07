// Icons
import { Sun, Moon, Heart, MapPin, Clock } from 'lucide-react';

// Local components
import WeatherCard from '@/components/WeatherCard';

/**
 * GreetingSection Component
 * بطاقة ترحيب تعرض تحية مناسبة للوقت مع معلومات الموقع والوقت والطقس
 * 
 * @returns {JSX.Element} بطاقة الترحيب
 */
export default function GreetingSection() {
  const currentHour = new Date().getHours();
  
  /**
   * الحصول على التحية المناسبة حسب الوقت
   * @returns {string} نص التحية
   */
  const getGreeting = () => {
    if (currentHour < 12) return 'صباح الخير';
    if (currentHour < 17) return 'مساء الخير';
    return 'مساء الخير';
  };

  /**
   * الحصول على الأيقونة المناسبة حسب الوقت
   * @returns {JSX.Element} أيقونة الشمس أو القمر
   */
  const getGreetingIcon = () => {
    if (currentHour < 12) {
      return <Sun className="w-5 h-5 text-yellow-500" />;
    }
    if (currentHour < 17) {
      return <Sun className="w-5 h-5 text-orange-500" />;
    }
    return <Moon className="w-5 h-5 text-blue-500" />;
  };

  return (
    <>
      <style>
        {`
        .greeting-sky-base {
          position: relative;
          overflow: hidden;
        }

        .greeting-sky-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .greeting-sky-night {
          background: radial-gradient(circle at 20% -10%, rgba(248,250,252,0.08), transparent 55%),
                      radial-gradient(circle at 80% 110%, rgba(251,191,36,0.08), transparent 55%),
                      linear-gradient(to bottom, #020617, #020617, #0b1120);
        }

        .greeting-stars {
          background-image:
            radial-gradient(2px 2px at 20% 30%, rgba(248,250,252,0.8), transparent),
            radial-gradient(1.5px 1.5px at 40% 70%, rgba(248,250,252,0.7), transparent),
            radial-gradient(1.8px 1.8px at 70% 40%, rgba(248,250,252,0.9), transparent),
            radial-gradient(1.2px 1.2px at 85% 20%, rgba(248,250,252,0.6), transparent);
          animation: greetingTwinkle 4s ease-in-out infinite alternate;
        }

        @keyframes greetingTwinkle {
          from { opacity: 0.7; transform: translateY(0px); }
          to { opacity: 1; transform: translateY(-2px); }
        }
        `}
      </style>
      <div 
        className="mb-4 p-4 rounded-xl border shadow-sm greeting-sky-base relative overflow-hidden bg-slate-950/95 border-slate-800"
      >
        {/* طبقة السماء الليلية الثابتة */}
        <div className="greeting-sky-layer">
          <div className="greeting-sky-night w-full h-full" />
          <div className="greeting-stars w-full h-full" />
        </div>

        {/* محتوى البطاقة */}
        <div className="relative z-10">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-4">
            <div 
              className="flex items-center justify-center space-x-2 
                rtl:space-x-reverse mb-2"
            >
              {getGreetingIcon()}
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {getGreeting()} في عدن
              </h1>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              مرحباً بك في تطبيق عدن لايف
            </p>
          </div>
          
          {/* معلومات الموقع والوقت والطقس */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {/* الموقع */}
            <div 
              className="flex items-center justify-center space-x-1 
                rtl:space-x-reverse bg-white dark:bg-gray-800 px-2 py-2 
                rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <MapPin className="w-4 h-4 text-blue-500" />
              <span 
                className="text-xs font-semibold text-gray-700 
                  dark:text-gray-200"
              >
                عدن
              </span>
            </div>
            
            {/* الوقت */}
            <div 
              className="flex items-center justify-center space-x-1 
                rtl:space-x-reverse bg-white dark:bg-gray-800 px-2 py-2 
                rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <Clock className="w-4 h-4 text-green-500" />
              <span 
                className="text-xs font-semibold text-gray-700 
                  dark:text-gray-200"
              >
                {new Date().toLocaleTimeString('ar-SA', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            {/* الطقس */}
            <div 
              className="flex items-center justify-center space-x-1 
                rtl:space-x-reverse bg-gradient-to-r from-blue-50 to-cyan-50 
                dark:from-blue-900/20 dark:to-cyan-900/20 px-2 py-2 rounded-lg 
                shadow-sm border border-blue-100 dark:border-blue-800"
            >
              <WeatherCard compact={true} />
            </div>
          </div>
          
          {/* الرسالة الترحيبية */}
          <div className="text-center">
            <div 
              className="flex items-center justify-center space-x-2 
                rtl:space-x-reverse bg-gradient-to-r from-red-50 to-pink-50 
                dark:from-red-900/20 dark:to-pink-900/20 px-3 py-2 rounded-lg 
                border border-red-100 dark:border-red-800/30"
            >
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span 
                className="text-xs text-gray-700 dark:text-gray-200 
                  font-medium"
              >
                نحن هنا لخدمتك
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
