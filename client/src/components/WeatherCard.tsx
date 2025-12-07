// مكون بطاقة الطقس - عرض البيانات الحقيقية مع تصميم احترافي
// سبتمبر 2025

import React, { useState, useEffect } from 'react';
import { RefreshCw, MapPin, Thermometer, Droplets, Wind, Eye, Clock } from 'lucide-react';
import { weatherService, WeatherData } from '@/services/weatherService';

interface WeatherCardProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
  variant?: 'default' | 'premium' | 'minimal';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  className = '', 
  showDetails = false,
  compact = false,
  variant = 'default'
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // جلب بيانات الطقس من الخدمة (Supabase + كاش داخلي)
  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // دائماً نستخدم getWeatherData التي تعيد آخر بيانات مع كاش لمدة ساعة
      const data = await weatherService.getWeatherData();
      
      setWeatherData(data);
      setLastUpdate(data.lastUpdated);
    } catch (err) {
      console.error('خطأ في جلب بيانات الطقس:', err);
      setError('فشل في جلب بيانات الطقس');
      // استخدام البيانات المحلية كبديل
      const localData = weatherService.getLocalWeatherData();
      setWeatherData(localData);
      setLastUpdate(localData.lastUpdated);
    } finally {
      setLoading(false);
    }
  };

  // تحديث البيانات
  const handleRefresh = () => {
    // تحديث يدوي يعتمد على نفس مصدر البيانات المستخدم في العرض (Supabase + كاش)
    fetchWeather();
  };

  // جلب البيانات عند تحميل المكون (من Supabase مع وجود نسخة احتياطية داخل الخدمة)
  useEffect(() => {
    fetchWeather();
  }, []);

  // تحديث البيانات كل 3 ساعات
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeather();
    }, 3 * 60 * 60 * 1000); // 3 ساعات

    return () => clearInterval(interval);
  }, []);

  // الحصول على ألوان الطقس حسب درجة الحرارة
  const getWeatherColors = (temp: number) => {
    if (temp >= 40) {
      return {
        gradient: 'from-red-500 to-orange-500',
        bg: 'from-red-50 to-orange-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: 'text-red-600',
        accent: 'text-red-600'
      };
    } else if (temp >= 35) {
      return {
        gradient: 'from-orange-500 to-yellow-500',
        bg: 'from-orange-50 to-yellow-50',
        border: 'border-orange-200',
        text: 'text-orange-800',
        icon: 'text-orange-600',
        accent: 'text-orange-600'
      };
    } else if (temp >= 30) {
      return {
        gradient: 'from-yellow-500 to-amber-500',
        bg: 'from-yellow-50 to-amber-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: 'text-yellow-600',
        accent: 'text-yellow-600'
      };
    } else if (temp >= 25) {
      return {
        gradient: 'from-green-500 to-emerald-500',
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: 'text-green-600',
        accent: 'text-green-600'
      };
    } else {
      return {
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'text-blue-600',
        accent: 'text-blue-600'
      };
    }
  };

  if (loading && !weatherData) {
    return (
      <div className={`bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 shadow-sm ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className={`bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200 shadow-sm ${className}`}>
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-sm">!</span>
          </div>
          <span className="text-red-800 font-medium">غير متوفر</span>
        </div>
      </div>
    );
  }

  const weatherInfo = weatherService.getWeatherInfo(weatherData);
  const colors = getWeatherColors(weatherData.temperature);

  if (compact) {
    return (
      <div className={`flex items-center space-x-1 rtl:space-x-reverse ${className}`}>
        {/* أيقونة الطقس */}
        <div className="text-sm">{weatherData.icon}</div>
        {/* درجة الحرارة */}
        <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{weatherData.temperature}°م</div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{weatherData.icon}</span>
            <div>
              <div className="font-semibold text-gray-800">{weatherData.temperature}°م</div>
              <div className="text-sm text-gray-600">{weatherData.condition}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">{weatherData.location}</div>
            <div className="text-xs text-gray-500">{lastUpdate}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-20 right-4 z-50 ${className}`}>
      <div className="text-right">
        {/* أيقونة الطقس */}
        <div className="text-3xl mb-2">{weatherData.icon}</div>
        {/* درجة الحرارة */}
        <div className="text-2xl font-bold text-white mb-2">{weatherData.temperature}°م</div>
        {/* حالة الطقس */}
        <div className="text-sm text-white/80">{weatherData.condition}</div>
      </div>
    </div>
  );
};

export default WeatherCard;
