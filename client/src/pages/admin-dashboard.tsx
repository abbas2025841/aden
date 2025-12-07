import React from 'react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { Droplets, Zap, Briefcase, Map, Shield } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const [, setLocation] = useLocation();

  const sections = [
    {
      id: 'water',
      title: 'قسم المياه',
      description: 'إدارة خدمات المياه، بما في ذلك خزانات المنازل.',
      icon: <Droplets className="w-6 h-6 text-cyan-400" />,
      actions: [
        {
          label: 'إدارة خزانات المنازل',
          onClick: () => setLocation('/admin/home-tanks'),
        },
      ],
    },
    {
      id: 'electricity',
      title: 'قسم الكهرباء',
      description: 'إدارة خدمات الكهرباء، بما في ذلك نقاط الشحن الشمسي.',
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      actions: [
        {
          label: 'إدارة نقاط الشحن الشمسي',
          onClick: () => setLocation('/admin/home-tanks'),
        },
      ],
    },
    {
      id: 'jobs',
      title: 'قسم الوظائف',
      description: 'إدارة إعلانات الوظائف وفرص العمل (قيد التطوير).',
      icon: <Briefcase className="w-6 h-6 text-emerald-400" />,
      actions: [],
    },
    {
      id: 'maps',
      title: 'الخرائط والخدمات',
      description: 'مواقع الخدمات العامة والنقاط المهمة (قيد التطوير).',
      icon: <Map className="w-6 h-6 text-blue-400" />,
      actions: [],
    },
  ];

  const waterSection = sections.find((s) => s.id === 'water');
  const inDevelopmentSections = sections.filter((s) => s.id !== 'water');

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
        {/* رأس الصفحة */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-400" />
              لوحة تحكم المشرف
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl">
              هذه الصفحة مخصصة لإدارة أقسام التطبيق والخدمات المرتبطة بها. حالياً تم تفعيل إدارة خزانات المنازل،
              بينما بقية الأقسام في مراحل مختلفة من التطوير.
            </p>
          </div>
        </div>

        {/* 1. قسم الإحصائيات السريعة */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <span className="text-lg">📊</span>
              نظرة عامة سريعة
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg bg-gray-950/70 border border-gray-800 px-3 py-2.5 flex flex-col gap-1 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <span className="text-base">🏠</span>
                  خزانات المنازل
                </span>
              </div>
              <div className="text-xl font-bold text-teal-400">127</div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>مسجلة</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  ✅ نشط
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-gray-950/70 border border-gray-800 px-3 py-2.5 flex flex-col gap-1 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <span className="text-base">⚡</span>
                  نقاط شحن شمسي
                </span>
              </div>
              <div className="text-xl font-bold text-yellow-400">45</div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>نقطة</span>
                <span className="text-amber-400 flex items-center gap-1">
                  🔄 قيد التطوير
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-gray-950/70 border border-gray-800 px-3 py-2.5 flex flex-col gap-1 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <span className="text-base">💼</span>
                  وظائف
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-400">23</div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>إعلان</span>
                <span className="text-amber-400 flex items-center gap-1">
                  🔄 قيد التطوير
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-gray-950/70 border border-gray-800 px-3 py-2.5 flex flex-col gap-1 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1">
                  <span className="text-base">🗺️</span>
                  خدمات عامة
                </span>
              </div>
              <div className="text-xl font-bold text-sky-400">89</div>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span>موقع</span>
                <span className="text-amber-400 flex items-center gap-1">
                  🔄 قيد التطوير
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. الأقسام الرئيسية - الخدمات النشطة وقيد التطوير */}
        <section className="space-y-4">
          {/* أ) الخدمات النشطة */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🟢</span>
              <h2 className="text-sm sm:text-base font-semibold">الخدمات النشطة</h2>
            </div>
            {waterSection && (
              <div className="rounded-xl bg-gray-900 border border-emerald-700/60 px-4 py-4 shadow-[0_10px_30px_rgba(16,185,129,0.25)]">
                <div className="flex items-start gap-3 mb-3">
                  <div className="mt-1">{waterSection.icon}</div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{waterSection.title}</h3>
                    <p className="text-sm text-gray-300">{waterSection.description}</p>
                    <div className="mt-2 text-xs text-gray-400 space-y-1">
                      <p className="font-semibold text-gray-200 flex items-center gap-1">
                        📍 الخدمات المتاحة:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>خزانات المنازل (127 مسجلة)</li>
                        <li>طلبات الصيانة (15 معلقة)</li>
                        <li>مقدمو الخدمة (8 نشطين)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {waterSection.actions.map((action) => (
                    <Button
                      key={action.label}
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/10"
                  >
                    طلبات الصيانة
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-200 hover:bg-gray-800"
                  >
                    ⚙️ إعدادات القسم
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* ب) الخدمات قيد التطوير */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🟡</span>
              <h2 className="text-sm sm:text-base font-semibold">الخدمات قيد التطوير</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inDevelopmentSections.map((section) => (
                <div
                  key={section.id}
                  className="rounded-xl bg-gray-900 border border-gray-800 px-4 py-4 flex flex-col justify-between shadow-[0_8px_24px_rgba(15,23,42,0.6)]"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-1">{section.icon}</div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold">{section.title}</h3>
                      <p className="text-sm text-gray-300">{section.description}</p>
                      <div className="mt-1 text-xs text-gray-400 space-y-0.5">
                        <p className="flex items-center gap-1">
                          <span>📊 الحالة:</span>
                          <span className="text-amber-400">🔄 قيد التطوير</span>
                        </p>
                        <p>
                          التفعيل المتوقع:
                          {section.id === 'electricity' && ' الربع الأول 2026'}
                          {section.id === 'jobs' && ' الربع الثاني 2026'}
                          {section.id === 'maps' && ' الربع الثالث 2026'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-sky-600 text-sky-300 hover:bg-sky-900/40"
                    >
                      معاينة
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-200 hover:bg-gray-800"
                    >
                      📋 التفاصيل
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. قسم الإدارة السريعة */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">⚡</span>
            <h2 className="text-sm sm:text-base font-semibold">إجراءات سريعة</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs sm:text-sm">
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white justify-center"
              onClick={() => setLocation('/admin/home-tanks')}
            >
              ➕ إضافة خزان جديد
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-800 justify-center"
            >
              👥 إدارة المستخدمين
            </Button>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-300 hover:bg-purple-900/30 justify-center"
            >
              📊 التقارير
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-200 hover:bg-gray-800 justify-center"
            >
              ⚙️ الإعدادات العامة
            </Button>
          </div>
        </section>

        {/* 4. سجل النشاطات الأخيرة */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-lg space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <h2 className="text-sm sm:text-base font-semibold">آخر النشاطات</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm text-gray-300 hover:text-white hover:bg-gray-800 px-2 sm:px-3"
            >
              عرض السجل الكامل →
            </Button>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300">
            <li>• منذ 5 دقائق - تم إضافة خزان جديد في حي المعلا</li>
            <li>• منذ ساعة - تم تحديث بيانات 3 خزانات</li>
            <li>• منذ ساعتين - طلب صيانة جديد من أحمد محمد</li>
            <li>• أمس - تم الموافقة على 2 مقدمي خدمة جدد</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
