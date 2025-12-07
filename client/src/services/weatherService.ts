// خدمة الطقس - جلب البيانات من Supabase (OpenWeather عبر Edge Function)
// سبتمبر 2025

import { supabase } from '@/lib/supabase';
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  lastUpdated: string;
  icon: string;
}

interface WeatherCache {
  data: WeatherData | null;
  timestamp: number;
  expiresAt: number;
}

class WeatherService {
  private cache: WeatherCache = {
    data: null,
    timestamp: 0,
    expiresAt: 0
  };

  private readonly CACHE_DURATION = 60 * 60 * 1000; // ساعة واحدة
  private readonly ADEN_COORDINATES = {
    lat: 12.7855,
    lon: 45.0187
  };

  // جلب بيانات الطقس من Supabase (آخر صف من weather_aden_hourly)
  async fetchWeatherData(): Promise<WeatherData> {
    try {
      const { data, error } = await supabase
        .from('weather_aden_hourly')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('خطأ في جلب بيانات الطقس من Supabase:', error);
        return this.getDefaultWeatherData();
      }

      if (!data) {
        console.warn('لا توجد بيانات طقس في weather_aden_hourly، استخدام البيانات الافتراضية');
        return this.getDefaultWeatherData();
      }

      const temperature = Math.round(Number(data.temperature));
      const condition = this.translateCondition(String(data.condition || ''));
      const humidity = data.humidity ?? 0;
      const windSpeed = Number(data.wind_speed ?? 0);
      const icon = this.getWeatherIcon(String(data.icon || '01d'));

      return {
        temperature,
        condition,
        humidity,
        windSpeed,
        location: 'عدن',
        lastUpdated: new Date(data.recorded_at || new Date()).toLocaleString('ar-SA'),
        icon,
      };
    } catch (error) {
      console.error('خطأ غير متوقع في جلب بيانات الطقس من Supabase:', error);
      return this.getDefaultWeatherData();
    }
  }

  // ترجمة حالة الطقس للعربية
  private translateCondition(condition: string): string {
    const translations: Record<string, string> = {
      'clear sky': 'صافٍ',
      'few clouds': 'قليل الغيوم',
      'scattered clouds': 'غيوم متفرقة',
      'broken clouds': 'غيوم جزئية',
      'shower rain': 'مطر خفيف',
      'rain': 'مطر',
      'thunderstorm': 'عاصفة رعدية',
      'snow': 'ثلج',
      'mist': 'ضباب',
      'fog': 'ضباب كثيف',
      'haze': 'ضباب خفيف',
      'dust': 'غبار',
      'sand': 'عاصفة رملية',
      'ash': 'رماد بركاني',
      'squall': 'عاصفة',
      'tornado': 'إعصار'
    };

    return translations[condition.toLowerCase()] || condition;
  }

  // الحصول على أيقونة الطقس
  private getWeatherIcon(iconCode: string): string {
    const iconMap: Record<string, string> = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌦️', // shower rain
      '09n': '🌧️',
      '10d': '🌧️', // rain
      '10n': '🌧️',
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '❄️', // snow
      '13n': '❄️',
      '50d': '🌫️', // mist
      '50n': '🌫️'
    };

    return iconMap[iconCode] || '🌤️';
  }

  // بيانات افتراضية للطقس
  private getDefaultWeatherData(): WeatherData {
    const now = new Date();
    const hour = now.getHours();
    
    // محاكاة تغير درجة الحرارة خلال اليوم
    let baseTemp = 35;
    if (hour >= 6 && hour < 12) baseTemp = 28; // الصباح
    else if (hour >= 12 && hour < 18) baseTemp = 38; // الظهيرة
    else if (hour >= 18 && hour < 22) baseTemp = 32; // المساء
    else baseTemp = 26; // الليل

    return {
      temperature: baseTemp + Math.floor(Math.random() * 5) - 2,
      condition: 'صافٍ',
      humidity: 65 + Math.floor(Math.random() * 20),
      windSpeed: Math.floor(Math.random() * 15) + 5,
      location: 'عدن',
      lastUpdated: now.toLocaleString('ar-SA'),
      icon: '☀️'
    };
  }

  // جلب بيانات الطقس مع التخزين المؤقت
  async getWeatherData(): Promise<WeatherData> {
    const now = Date.now();

    // التحقق من صحة البيانات المخزنة مؤقتاً
    if (this.cache.data && now < this.cache.expiresAt) {
      return this.cache.data;
    }

    try {
      // جلب بيانات جديدة
      const weatherData = await this.fetchWeatherData();
      
      // حفظ البيانات في التخزين المؤقت
      this.cache = {
        data: weatherData,
        timestamp: now,
        expiresAt: now + this.CACHE_DURATION
      };

      return weatherData;
    } catch (error) {
      console.error('خطأ في جلب بيانات الطقس:', error);
      
      // إرجاع البيانات المخزنة أو البيانات الافتراضية
      return this.cache.data || this.getDefaultWeatherData();
    }
  }

  // جلب بيانات الطقس المحلية (بدون API)
  getLocalWeatherData(): WeatherData {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth();
    
    // محاكاة الطقس في عدن حسب الفصول
    let baseTemp = 35;
    let condition = 'صافٍ';
    let icon = '☀️';

    // درجات الحرارة حسب الشهر
    if (month >= 0 && month <= 2) { // يناير-مارس
      baseTemp = 28 + Math.floor(Math.random() * 8);
    } else if (month >= 3 && month <= 5) { // أبريل-يونيو
      baseTemp = 32 + Math.floor(Math.random() * 10);
    } else if (month >= 6 && month <= 8) { // يوليو-سبتمبر
      baseTemp = 35 + Math.floor(Math.random() * 8);
    } else { // أكتوبر-ديسمبر
      baseTemp = 30 + Math.floor(Math.random() * 10);
    }

    // تغيير درجة الحرارة حسب الوقت
    if (hour >= 6 && hour < 12) {
      baseTemp -= 5; // الصباح أبرد
    } else if (hour >= 12 && hour < 18) {
      baseTemp += 3; // الظهيرة أحر
    } else if (hour >= 18 && hour < 22) {
      baseTemp -= 2; // المساء
    } else {
      baseTemp -= 8; // الليل أبرد
    }

    // محاكاة حالات الطقس المختلفة
    const random = Math.random();
    if (random < 0.7) {
      condition = 'صافٍ';
      icon = '☀️';
    } else if (random < 0.85) {
      condition = 'قليل الغيوم';
      icon = '⛅';
    } else if (random < 0.95) {
      condition = 'غيوم متفرقة';
      icon = '☁️';
    } else {
      condition = 'مطر خفيف';
      icon = '🌦️';
      baseTemp -= 3;
    }

    return {
      temperature: Math.max(20, Math.min(45, baseTemp)), // بين 20-45 درجة
      condition,
      humidity: 60 + Math.floor(Math.random() * 30),
      windSpeed: Math.floor(Math.random() * 20) + 5,
      location: 'عدن',
      lastUpdated: now.toLocaleString('ar-SA'),
      icon
    };
  }

  // تحديث البيانات يدوياً
  async refreshWeatherData(): Promise<WeatherData> {
    this.cache = {
      data: null,
      timestamp: 0,
      expiresAt: 0
    };
    return this.getWeatherData();
  }

  // الحصول على معلومات إضافية عن الطقس
  getWeatherInfo(weatherData: WeatherData): string {
    const temp = weatherData.temperature;
    let info = '';

    if (temp >= 40) {
      info = 'حار جداً - تجنب التعرض المباشر للشمس';
    } else if (temp >= 35) {
      info = 'حار - اشرب الماء بانتظام';
    } else if (temp >= 30) {
      info = 'دافئ - طقس مناسب للأنشطة الخارجية';
    } else if (temp >= 25) {
      info = 'معتدل - طقس مريح';
    } else {
      info = 'بارد نسبياً - ارتدي ملابس دافئة';
    }

    return info;
  }
}

// إنشاء مثيل واحد من الخدمة
export const weatherService = new WeatherService();
export type { WeatherData };
