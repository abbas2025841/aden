export interface AssistantAppearanceConfig {
  // الحجم
  size: {
    default: number; // 48px
    hover: number;   // 58px (scale 1.2)
  };
  
  // الشفافية
  transparency: {
    default: number; // 100%
    hidden: number;  // 70%
  };
  
  // الحركات
  animations: {
    peekInterval: {
      min: number; // 10 seconds
      max: number; // 15 seconds
    };
    messageInterval: number; // 60 seconds
    bubbleDuration: number;  // 3 seconds
    waveDuration: number;    // 1 second
  };
  
  // الفقاعة
  bubble: {
    maxWidth: number; // 180px
    tailPosition: 'bottom-right' | 'bottom-left' | 'bottom-center';
  };
  
  // الموضع
  position: {
    bottom: number; // 20px
    right: number;  // 20px
  };
  
  // الألوان
  colors: {
    background: string;
    border: string;
    text: string;
    shadow: string;
  };
}

export const defaultAppearanceConfig: AssistantAppearanceConfig = {
  size: {
    default: 48,
    hover: 58
  },
  
  transparency: {
    default: 1.0,
    hidden: 0.7
  },
  
  animations: {
    peekInterval: {
      min: 10000, // 10 seconds
      max: 15000  // 15 seconds
    },
    messageInterval: 60000, // 60 seconds
    bubbleDuration: 3000,   // 3 seconds
    waveDuration: 1000      // 1 second
  },
  
  bubble: {
    maxWidth: 180,
    tailPosition: 'bottom-right'
  },
  
  position: {
    bottom: 20,
    right: 20
  },
  
  colors: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    border: '#e5e7eb',
    text: '#374151',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }
};

// دالة للحصول على التكوين من localStorage
export const getAppearanceConfig = (): AssistantAppearanceConfig => {
  try {
    const stored = localStorage.getItem('assistant_appearance_config');
    if (stored) {
      return { ...defaultAppearanceConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('خطأ في تحميل تكوين مظهر المساعد:', error);
  }
  
  return defaultAppearanceConfig;
};

// دالة لحفظ التكوين في localStorage
export const saveAppearanceConfig = (config: Partial<AssistantAppearanceConfig>): void => {
  try {
    const currentConfig = getAppearanceConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('assistant_appearance_config', JSON.stringify(newConfig));
  } catch (error) {
    console.error('خطأ في حفظ تكوين مظهر المساعد:', error);
  }
};

// دالة لإعادة تعيين التكوين للافتراضي
export const resetAppearanceConfig = (): void => {
  try {
    localStorage.removeItem('assistant_appearance_config');
  } catch (error) {
    console.error('خطأ في إعادة تعيين تكوين مظهر المساعد:', error);
  }
};

// دالة للتحقق من إعدادات الأداء
export const getPerformanceSettings = () => {
  try {
    const stored = localStorage.getItem('assistant_performance_settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('خطأ في تحميل إعدادات الأداء:', error);
  }
  
  return {
    enableAnimations: true,
    enablePeekAnimation: true,
    enableMessageRotation: true,
    lowEndDeviceMode: false
  };
};

// دالة لحفظ إعدادات الأداء
export const savePerformanceSettings = (settings: any): void => {
  try {
    localStorage.setItem('assistant_performance_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('خطأ في حفظ إعدادات الأداء:', error);
  }
};
