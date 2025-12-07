import React from 'react';
import { AccessibilitySettings, PerformanceSettings, PerformanceMonitor } from '@/components/AccessibilityProvider';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import { PerformanceOptimizer } from '@/components/PerformanceOptimizer';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import MobileNavigation from '@/components/MobileNavigation';

export default function AccessibilitySettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">إعدادات إمكانية الوصول والأداء</h1>
          <p className="text-gray-600">
            قم بتخصيص التطبيق ليتناسب مع احتياجاتك ويوفر أفضل تجربة استخدام
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* إعدادات إمكانية الوصول */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">إمكانية الوصول</h2>
            <AccessibilitySettings />
          </div>

          {/* إعدادات الأداء */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">الأداء</h2>
            <PerformanceSettings />
          </div>
        </div>

        {/* مراقبة الأداء */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">مراقبة الأداء</h2>
          <PerformanceMonitor />
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات مهمة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">إمكانية الوصول:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• دعم كامل للغة العربية (RTL)</li>
                <li>• توافق مع قارئات الشاشة</li>
                <li>• تنقل بلوحة المفاتيح</li>
                <li>• تباين ألوان محسن</li>
                <li>• نصوص قابلة للتكبير</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">الأداء:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• تحميل كسري للمكونات</li>
                <li>• ضغط البيانات</li>
                <li>• دعم الأجهزة الضعيفة</li>
                <li>• مراقبة استخدام الذاكرة</li>
                <li>• وضع توفير البيانات</li>
              </ul>
            </div>
          </div>
        </div>

        {/* اختصارات لوحة المفاتيح */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">اختصارات لوحة المفاتيح</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-800">التنقل</span>
                <kbd className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm">Tab</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-800">تفعيل العنصر</span>
                <kbd className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm">Enter</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-800">إغلاق النافذة</span>
                <kbd className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm">Escape</kbd>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-green-800">البحث</span>
                <kbd className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm">Ctrl + F</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-800">الصفحة الرئيسية</span>
                <kbd className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm">Alt + H</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-800">إعدادات إمكانية الوصول</span>
                <kbd className="px-2 py-1 bg-green-200 text-green-800 rounded text-sm">Alt + A</kbd>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
      <MobileNavigation />
    </div>
  );
}
