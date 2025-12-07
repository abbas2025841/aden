import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType {
  config: AccessibilityConfig;
  updateConfig: (updates: Partial<AccessibilityConfig>) => void;
  isRTL: boolean;
  announceToScreenReader: (message: string) => void;
  setFocus: (elementId: string) => void;
  getContrastRatio: (color1: string, color2: string) => number;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const defaultConfig: AccessibilityConfig = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: true,
  focusVisible: true
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AccessibilityConfig>(defaultConfig);
  const [isRTL, setIsRTL] = useState(true);

  // كشف إعدادات إمكانية الوصول
  useEffect(() => {
    // كشف تفضيلات النظام
    if (window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      setConfig(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
      }));
    }

    // كشف قارئ الشاشة
    const hasScreenReader = 
      'speechSynthesis' in window ||
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver');
    
    setConfig(prev => ({ ...prev, screenReader: hasScreenReader }));

    // كشف اتجاه النص
    const htmlDir = document.documentElement.dir;
    setIsRTL(htmlDir === 'rtl' || htmlDir === 'auto');
  }, []);

  // تحديث الإعدادات
  const updateConfig = useCallback((updates: Partial<AccessibilityConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    localStorage.setItem('accessibility-config', JSON.stringify({ ...config, ...updates }));
  }, [config]);

  // إعلان لقارئ الشاشة
  const announceToScreenReader = useCallback((message: string) => {
    if (config.screenReader && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'ar-SA'; // العربية السعودية
      speechSynthesis.speak(utterance);
    }
  }, [config.screenReader]);

  // تحديد التركيز
  const setFocus = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // حساب نسبة التباين
  const getContrastRatio = useCallback((color1: string, color2: string): number => {
    // تحويل الألوان إلى RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    // حساب النصوع النسبي
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  }, []);

  // تطبيق CSS لإمكانية الوصول
  useEffect(() => {
    const root = document.documentElement;
    
    // التباين العالي
    if (config.highContrast) {
      root.style.setProperty('--contrast-multiplier', '1.5');
      root.classList.add('high-contrast');
    } else {
      root.style.removeProperty('--contrast-multiplier');
      root.classList.remove('high-contrast');
    }

    // تقليل الحركة
    if (config.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
      root.classList.add('reduced-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
      root.classList.remove('reduced-motion');
    }

    // النص الكبير
    if (config.largeText) {
      root.style.setProperty('--font-size-multiplier', '1.25');
      root.classList.add('large-text');
    } else {
      root.style.removeProperty('--font-size-multiplier');
      root.classList.remove('large-text');
    }

    // التركيز المرئي
    if (config.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // RTL
    if (isRTL) {
      root.setAttribute('dir', 'rtl');
      root.classList.add('rtl');
    } else {
      root.setAttribute('dir', 'ltr');
      root.classList.remove('rtl');
    }
  }, [config, isRTL]);

  // تحميل الإعدادات المحفوظة
  useEffect(() => {
    const savedConfig = localStorage.getItem('accessibility-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsed });
      } catch (error) {
        console.warn('Failed to parse saved accessibility config');
      }
    }
  }, []);

  const value: AccessibilityContextType = {
    config,
    updateConfig,
    isRTL,
    announceToScreenReader,
    setFocus,
    getContrastRatio
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// مكون إعدادات إمكانية الوصول
// تصدير مكونات الأداء
export { default as PerformanceSettings } from './PerformanceSettings';
export { default as PerformanceMonitor } from './PerformanceMonitor';

export const AccessibilitySettings: React.FC = () => {
  const { config, updateConfig, announceToScreenReader } = useAccessibility();

  const handleToggle = (key: keyof AccessibilityConfig, label: string) => {
    const newValue = !config[key];
    updateConfig({ [key]: newValue });
    announceToScreenReader(`${label} ${newValue ? 'مفعل' : 'معطل'}`);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">إعدادات إمكانية الوصول</h3>
      
      <div className="space-y-4">
        {/* التباين العالي */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">التباين العالي</label>
            <p className="text-xs text-gray-500">زيادة تباين الألوان للوضوح</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.highContrast}
              onChange={() => handleToggle('highContrast', 'التباين العالي')}
              className="sr-only peer"
              aria-label="تفعيل التباين العالي"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* تقليل الحركة */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">تقليل الحركة</label>
            <p className="text-xs text-gray-500">تعطيل الرسوم المتحركة والانتقالات</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.reducedMotion}
              onChange={() => handleToggle('reducedMotion', 'تقليل الحركة')}
              className="sr-only peer"
              aria-label="تفعيل تقليل الحركة"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* النص الكبير */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">النص الكبير</label>
            <p className="text-xs text-gray-500">زيادة حجم النص بنسبة 25%</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.largeText}
              onChange={() => handleToggle('largeText', 'النص الكبير')}
              className="sr-only peer"
              aria-label="تفعيل النص الكبير"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* التركيز المرئي */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">التركيز المرئي</label>
            <p className="text-xs text-gray-500">إظهار مؤشر التركيز بوضوح</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.focusVisible}
              onChange={() => handleToggle('focusVisible', 'التركيز المرئي')}
              className="sr-only peer"
              aria-label="تفعيل التركيز المرئي"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">نصائح للاستخدام</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• استخدم Tab للتنقل بين العناصر</li>
          <li>• استخدم Enter أو Space لتفعيل الأزرار</li>
          <li>• استخدم الأسهم للتنقل في القوائم</li>
          <li>• استخدم Escape لإغلاق النوافذ المنبثقة</li>
        </ul>
      </div>
    </div>
  );
};
