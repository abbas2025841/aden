import React, { useState, useEffect } from 'react';

interface PerformanceConfig {
  dataSaving: boolean;
  lowPowerMode: boolean;
  cacheEnabled: boolean;
  imageOptimization: boolean;
  lazyLoading: boolean;
  compressionEnabled: boolean;
}

const PerformanceSettings: React.FC = () => {
  const [config, setConfig] = useState<PerformanceConfig>({
    dataSaving: false,
    lowPowerMode: false,
    cacheEnabled: true,
    imageOptimization: true,
    lazyLoading: true,
    compressionEnabled: true,
  });

  const handleToggle = (key: keyof PerformanceConfig, label: string) => {
    const newValue = !config[key];
    setConfig(prev => ({ ...prev, [key]: newValue }));
    
    // حفظ الإعدادات في localStorage
    localStorage.setItem('performanceConfig', JSON.stringify({
      ...config,
      [key]: newValue
    }));
  };

  useEffect(() => {
    // تحميل الإعدادات المحفوظة
    const saved = localStorage.getItem('performanceConfig');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">إعدادات الأداء</h3>
      
      <div className="space-y-4">
        {/* توفير البيانات */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">وضع توفير البيانات</label>
            <p className="text-xs text-gray-500">تقليل استهلاك البيانات والبطارية</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.dataSaving}
              onChange={() => handleToggle('dataSaving', 'وضع توفير البيانات')}
              className="sr-only peer"
              aria-label="تفعيل وضع توفير البيانات"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* وضع الطاقة المنخفضة */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">وضع الطاقة المنخفضة</label>
            <p className="text-xs text-gray-500">تحسين الأداء للأجهزة الضعيفة</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.lowPowerMode}
              onChange={() => handleToggle('lowPowerMode', 'وضع الطاقة المنخفضة')}
              className="sr-only peer"
              aria-label="تفعيل وضع الطاقة المنخفضة"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* تفعيل التخزين المؤقت */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">التخزين المؤقت</label>
            <p className="text-xs text-gray-500">تسريع تحميل الصفحات</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.cacheEnabled}
              onChange={() => handleToggle('cacheEnabled', 'التخزين المؤقت')}
              className="sr-only peer"
              aria-label="تفعيل التخزين المؤقت"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* تحسين الصور */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">تحسين الصور</label>
            <p className="text-xs text-gray-500">ضغط الصور لتوفير المساحة</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.imageOptimization}
              onChange={() => handleToggle('imageOptimization', 'تحسين الصور')}
              className="sr-only peer"
              aria-label="تفعيل تحسين الصور"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* التحميل الكسري */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">التحميل الكسري</label>
            <p className="text-xs text-gray-500">تحميل المكونات عند الحاجة</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.lazyLoading}
              onChange={() => handleToggle('lazyLoading', 'التحميل الكسري')}
              className="sr-only peer"
              aria-label="تفعيل التحميل الكسري"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* ضغط البيانات */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">ضغط البيانات</label>
            <p className="text-xs text-gray-500">تقليل حجم البيانات المرسلة</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.compressionEnabled}
              onChange={() => handleToggle('compressionEnabled', 'ضغط البيانات')}
              className="sr-only peer"
              aria-label="تفعيل ضغط البيانات"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="text-sm font-medium text-green-900 mb-2">نصائح للأداء</h4>
        <ul className="text-xs text-green-800 space-y-1">
          <li>• تفعيل وضع توفير البيانات يقلل استهلاك الإنترنت</li>
          <li>• التخزين المؤقت يحسن سرعة التطبيق</li>
          <li>• التحميل الكسري يوفر الذاكرة</li>
          <li>• ضغط البيانات يقلل وقت التحميل</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceSettings;
