import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface PerformanceConfig {
  enableAnimations: boolean;
  enableLazyLoading: boolean;
  enableDataCompression: boolean;
  maxImageSize: number; // KB
  maxDataSize: number; // MB
  lowEndDeviceMode: boolean;
}

interface PerformanceContextType {
  config: PerformanceConfig;
  updateConfig: (updates: Partial<PerformanceConfig>) => void;
  isLowEndDevice: boolean;
  enableDataSavingMode: () => void;
  disableDataSavingMode: () => void;
  getDeviceInfo: () => DeviceInfo;
}

interface DeviceInfo {
  isLowEnd: boolean;
  memory: number; // MB
  connectionSpeed: 'slow' | 'medium' | 'fast';
  userAgent: string;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

const defaultConfig: PerformanceConfig = {
  enableAnimations: true,
  enableLazyLoading: true,
  enableDataCompression: true,
  maxImageSize: 500, // 500KB
  maxDataSize: 50, // 50MB
  lowEndDeviceMode: false
};

export const PerformanceOptimizer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PerformanceConfig>(defaultConfig);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // كشف الأجهزة الضعيفة
  const detectLowEndDevice = useCallback((): DeviceInfo => {
    const userAgent = navigator.userAgent;
    const memory = (navigator as any).deviceMemory || 4; // افتراضي 4GB
    const connection = (navigator as any).connection;
    
    // كشف الأجهزة الضعيفة
    const isLowEnd = 
      memory < 4 || // أقل من 4GB RAM
      /Android.*Chrome\/[0-5]/.test(userAgent) || // Chrome قديم
      /iPhone.*OS [0-9]_[0-5]/.test(userAgent) || // iOS قديم
      (connection && connection.effectiveType === 'slow-2g'); // اتصال بطيء

    const connectionSpeed = connection ? 
      (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' ? 'slow' :
       connection.effectiveType === '3g' ? 'medium' : 'fast') : 'medium';

    return {
      isLowEnd,
      memory,
      connectionSpeed,
      userAgent
    };
  }, []);

  // تحديث الإعدادات
  const updateConfig = useCallback((updates: Partial<PerformanceConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    
    // حفظ في localStorage
    localStorage.setItem('performance-config', JSON.stringify({ ...config, ...updates }));
  }, [config]);

  // تفعيل وضع توفير البيانات
  const enableDataSavingMode = useCallback(() => {
    updateConfig({
      enableAnimations: false,
      enableLazyLoading: true,
      enableDataCompression: true,
      lowEndDeviceMode: true
    });
  }, [updateConfig]);

  // إلغاء وضع توفير البيانات
  const disableDataSavingMode = useCallback(() => {
    updateConfig({
      enableAnimations: true,
      enableLazyLoading: true,
      enableDataCompression: true,
      lowEndDeviceMode: false
    });
  }, [updateConfig]);

  // تحميل الإعدادات المحفوظة
  useEffect(() => {
    const savedConfig = localStorage.getItem('performance-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsed });
      } catch (error) {
        console.warn('Failed to parse saved performance config');
      }
    }
  }, []);

  // كشف الجهاز عند التحميل
  useEffect(() => {
    const deviceInfo = detectLowEndDevice();
    setIsLowEndDevice(deviceInfo.isLowEnd);
    
    if (deviceInfo.isLowEnd) {
      updateConfig({ lowEndDeviceMode: true, enableAnimations: false });
    }
  }, []); // إزالة التبعيات لتجنب الحلقة اللانهائية

  // تطبيق CSS للأداء
  useEffect(() => {
    const root = document.documentElement;
    
    if (!config.enableAnimations) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // إضافة class للأجهزة الضعيفة
    if (config.lowEndDeviceMode) {
      document.body.classList.add('low-end-device');
    } else {
      document.body.classList.remove('low-end-device');
    }
  }, [config]);

  const value: PerformanceContextType = {
    config,
    updateConfig,
    isLowEndDevice,
    enableDataSavingMode,
    disableDataSavingMode,
    getDeviceInfo: detectLowEndDevice
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceOptimizer');
  }
  return context;
};

// مكون إعدادات الأداء
export const PerformanceSettings: React.FC = () => {
  const { config, updateConfig, enableDataSavingMode, disableDataSavingMode, isLowEndDevice } = usePerformance();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">إعدادات الأداء</h3>
      
      <div className="space-y-4">
        {/* وضع توفير البيانات */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">وضع توفير البيانات</label>
            <p className="text-xs text-gray-500">تعطيل الرسوم المتحركة وتقليل استهلاك البيانات</p>
          </div>
          <button
            onClick={config.lowEndDeviceMode ? disableDataSavingMode : enableDataSavingMode}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              config.lowEndDeviceMode 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {config.lowEndDeviceMode ? 'مفعل' : 'معطل'}
          </button>
        </div>

        {/* الرسوم المتحركة */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">الرسوم المتحركة</label>
            <p className="text-xs text-gray-500">تفعيل/تعطيل الرسوم المتحركة والانتقالات</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableAnimations}
              onChange={(e) => updateConfig({ enableAnimations: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* التحميل الكسري */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">التحميل الكسري</label>
            <p className="text-xs text-gray-500">تحميل المكونات عند الحاجة فقط</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableLazyLoading}
              onChange={(e) => updateConfig({ enableLazyLoading: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* ضغط البيانات */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">ضغط البيانات</label>
            <p className="text-xs text-gray-500">تقليل حجم البيانات المحفوظة</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enableDataCompression}
              onChange={(e) => updateConfig({ enableDataCompression: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* معلومات الجهاز */}
        {isLowEndDevice && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>تم كشف جهاز ضعيف:</strong> تم تفعيل وضع توفير البيانات تلقائياً لتحسين الأداء
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// مكون مراقبة الأداء
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    loadTime: 0,
    dataSize: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      // مراقبة استخدام الذاكرة
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        }));
      }

      // مراقبة حجم البيانات المحفوظة
      const dataSize = new Blob(Object.values(localStorage)).size / 1024 / 1024; // MB
      setMetrics(prev => ({ ...prev, dataSize: Math.round(dataSize * 100) / 100 }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h4 className="text-sm font-semibold mb-3">مراقبة الأداء</h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500">الذاكرة</p>
          <p className="text-lg font-bold text-blue-600">{metrics.memoryUsage}MB</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">البيانات</p>
          <p className="text-lg font-bold text-green-600">{metrics.dataSize}MB</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">الحالة</p>
          <p className="text-lg font-bold text-gray-600">جيد</p>
        </div>
      </div>
    </div>
  );
};
