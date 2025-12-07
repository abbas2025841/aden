import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import CollapsibleSidebar from '@/components/CollapsibleSidebar';
import SectionDisplay from '@/components/SectionDisplay';
import { 
  Home,
  Heart,
  GraduationCap,
  Zap,
  Droplets,
  Trash2,
  MoreHorizontal,
  Settings,
  User,
  Bell,
  Search,
  Map,
  DollarSign,
  Bot
} from 'lucide-react';

export default function SidebarDemoPage() {
  const [, setLocation] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // عناصر مخصصة للشريط الجانبي
  const customSidebarItems = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: <Home className="w-5 h-5" />,
      path: '/'
    },
    {
      id: 'health',
      label: 'الخدمات الصحية',
      icon: <Heart className="w-5 h-5" />,
      path: '/health',
      badge: 'جديد',
      badgeColor: 'destructive' as const
    },
    {
      id: 'education',
      label: 'التعليم',
      icon: <GraduationCap className="w-5 h-5" />,
      path: '/education'
    },
    {
      id: 'electricity',
      label: 'الكهرباء',
      icon: <Zap className="w-5 h-5" />,
      path: '/electricity',
      badge: '5',
      badgeColor: 'secondary' as const
    },
    {
      id: 'water',
      label: 'المياه',
      icon: <Droplets className="w-5 h-5" />,
      path: '/water'
    },
    {
      id: 'sanitation',
      label: 'النظافة',
      icon: <Trash2 className="w-5 h-5" />,
      path: '/sanitation'
    },
    {
      id: 'services',
      label: 'خدمات أخرى',
      icon: <MoreHorizontal className="w-5 h-5" />,
      children: [
        {
          id: 'jobs',
          label: 'الوظائف',
          icon: <User className="w-4 h-4" />,
          path: '/jobs'
        },
        {
          id: 'maps',
          label: 'الخرائط',
          icon: <Map className="w-4 h-4" />,
          path: '/maps'
        },
        {
          id: 'currency',
          label: 'أسعار العملات',
          icon: <DollarSign className="w-4 h-4" />,
          path: '/currency-rates'
        },
        {
          id: 'emergency',
          label: 'الطوارئ',
          icon: <Bell className="w-4 h-4" />,
          path: '/emergency'
        },
        {
          id: 'assistant',
          label: 'مساعد عدن',
          icon: <Bot className="w-4 h-4" />,
          path: '/adeni-assistant'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الشريط الجانبي */}
      <CollapsibleSidebar
        defaultCollapsed={false}
        onToggle={(collapsed) => setSidebarCollapsed(collapsed)}
        onSectionChange={(sectionId) => setActiveSection(sectionId)}
        items={customSidebarItems}
      />

      {/* المحتوى الرئيسي */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'mr-16' : 'mr-64'}
      `}>
        <AppHeader />
        
        <div className="container mx-auto px-4 py-8">
          {/* العنوان الرئيسي */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              شريط جانبي قابل للطي
            </h1>
            <p className="text-gray-600 text-lg">
              تصميم حديث ومتجاوب مع دعم كامل للغة العربية
            </p>
          </div>

          {/* عرض القسم النشط */}
          <div className="mb-8">
            <SectionDisplay activeSection={activeSection} />
          </div>

          {/* معلومات الشريط الجانبي */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">قابل للطي</h3>
              </div>
              <p className="text-gray-600 text-sm">
                يمكن طي الشريط الجانبي لتوفير مساحة أكبر للمحتوى مع الحفاظ على الوصول السريع للعناصر
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">متجاوب</h3>
              </div>
              <p className="text-gray-600 text-sm">
                يتكيف مع جميع أحجام الشاشات ويوفر تجربة مستخدم مثالية على جميع الأجهزة
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">إشعارات</h3>
              </div>
              <p className="text-gray-600 text-sm">
                دعم للشارات والإشعارات مع ألوان مختلفة لتوضيح حالة كل عنصر
              </p>
            </div>
          </div>

          {/* المميزات */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">مميزات الشريط الجانبي</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">تصميم حديث</h4>
                    <p className="text-gray-600 text-sm">واجهة مستخدم عصرية مع تأثيرات حركية سلسة</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">دعم RTL</h4>
                    <p className="text-gray-600 text-sm">محاذاة مثالية للنصوص العربية من اليمين لليسار</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">عناصر فرعية</h4>
                    <p className="text-gray-600 text-sm">دعم للقوائم المنسدلة والعناصر الفرعية</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">شارات ملونة</h4>
                    <p className="text-gray-600 text-sm">إشعارات ملونة لتوضيح حالة كل عنصر</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">تفاعل سلس</h4>
                    <p className="text-gray-600 text-sm">انتقالات سلسة وتأثيرات hover متقدمة</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">قابل للتخصيص</h4>
                    <p className="text-gray-600 text-sm">سهولة في التخصيص وإضافة عناصر جديدة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* إرشادات الاستخدام */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">كيفية الاستخدام</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">التبديل</h3>
                <p className="text-gray-600 text-sm mb-4">
                  انقر على زر التبديل في أعلى الشريط الجانبي لطي أو توسيع الشريط
                </p>
                <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                  <code>onClick: toggleSidebar()</code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">التنقل</h3>
                <p className="text-gray-600 text-sm mb-4">
                  انقر على أي عنصر للانتقال إلى الصفحة المطلوبة
                </p>
                <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                  <code>onClick: setLocation(path)</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AppFooter />
      </div>
    </div>
  );
}
