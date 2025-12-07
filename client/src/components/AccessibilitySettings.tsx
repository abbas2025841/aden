import React, { useState, useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';

const AccessibilitySettings: React.FC = () => {
  const { config, updateConfig, announceToScreenReader } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (key: keyof typeof config, label: string) => {
    const newValue = !config[key];
    updateConfig({ [key]: newValue });
    announceToScreenReader(`${label} ${newValue ? 'مفعل' : 'معطل'}`);
  };

  return (
    <div className="relative">
      {/* زر الإعدادات */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="فتح إعدادات إمكانية الوصول"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* القائمة المنبثقة */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">إعدادات إمكانية الوصول</h3>
            
            <div className="space-y-3">
              {/* التباين العالي */}
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">التباين العالي</span>
                <input
                  type="checkbox"
                  checked={config.highContrast}
                  onChange={() => handleToggle('highContrast', 'التباين العالي')}
                  className="rounded"
                />
              </label>

              {/* تقليل الحركة */}
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">تقليل الحركة</span>
                <input
                  type="checkbox"
                  checked={config.reducedMotion}
                  onChange={() => handleToggle('reducedMotion', 'تقليل الحركة')}
                  className="rounded"
                />
              </label>

              {/* النص الكبير */}
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">النص الكبير</span>
                <input
                  type="checkbox"
                  checked={config.largeText}
                  onChange={() => handleToggle('largeText', 'النص الكبير')}
                  className="rounded"
                />
              </label>

              {/* قارئ الشاشة */}
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">قارئ الشاشة</span>
                <input
                  type="checkbox"
                  checked={config.screenReader}
                  onChange={() => handleToggle('screenReader', 'قارئ الشاشة')}
                  className="rounded"
                />
              </label>

              {/* التنقل بلوحة المفاتيح */}
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">التنقل بلوحة المفاتيح</span>
                <input
                  type="checkbox"
                  checked={config.keyboardNavigation}
                  onChange={() => handleToggle('keyboardNavigation', 'التنقل بلوحة المفاتيح')}
                  className="rounded"
                />
              </label>

              {/* التركيز المرئي */}
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">التركيز المرئي</span>
                <input
                  type="checkbox"
                  checked={config.focusVisible}
                  onChange={() => handleToggle('focusVisible', 'التركيز المرئي')}
                  className="rounded"
                />
              </label>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                هذه الإعدادات تساعد في تحسين تجربة الاستخدام للأشخاص ذوي الإعاقة
              </p>
            </div>
          </div>
        </div>
      )}

      {/* إغلاق القائمة عند النقر خارجها */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AccessibilitySettings;
