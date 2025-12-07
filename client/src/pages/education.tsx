import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, MapPin, Phone, Clock, Star, Users, Building, 
  Calendar, GraduationCap, School, Bus, FileText, 
  Newspaper, MessageSquare, Search, Award, Laptop, Globe
} from "lucide-react";

function EducationPage() {
  const [, setLocation] = useLocation();

  // إحصائيات سريعة للتعليم
  const educationStats = useMemo(() => {
    return {
      universities: 3,
      schools: 45,
      courses: 28,
      tutors: 15,
      total: 91
    };
  }, []);

  // دالة لتحديد ألوان البطاقات حسب نوع الخدمة التعليمية
  const getEducationCardColor = (sectionId: string) => {
    switch (sectionId) {
      case 'universities-directory':
        return 'bg-purple-900 border-purple-800'; // جامعات - بنفسجي
      case 'schools-directory':
        return 'bg-green-900 border-green-800'; // مدارس - أخضر
      case 'online-registration':
        return 'bg-blue-900 border-blue-800'; // تسجيل - أزرق
      case 'school-transport':
        return 'bg-yellow-900 border-yellow-800'; // نقل - أصفر
      case 'parent-services':
        return 'bg-pink-900 border-pink-800'; // أولياء أمور - وردي
      case 'digital-library':
        return 'bg-indigo-900 border-indigo-800'; // مكتبة - نيلي
      default:
        return 'bg-gray-900 border-gray-800'; // افتراضي - رمادي
    }
  };

  // دالة لتحديد ألوان الأزرار حسب نوع الخدمة التعليمية
  const getEducationButtonColor = (sectionId: string) => {
    switch (sectionId) {
      case 'universities-directory':
        return 'bg-purple-600 hover:bg-purple-700'; // جامعات - بنفسجي
      case 'schools-directory':
        return 'bg-green-600 hover:bg-green-700'; // مدارس - أخضر
      case 'online-registration':
        return 'bg-blue-600 hover:bg-blue-700'; // تسجيل - أزرق
      case 'school-transport':
        return 'bg-yellow-600 hover:bg-yellow-700'; // نقل - أصفر
      case 'parent-services':
        return 'bg-pink-600 hover:bg-pink-700'; // أولياء أمور - وردي
      case 'digital-library':
        return 'bg-indigo-600 hover:bg-indigo-700'; // مكتبة - نيلي
      default:
        return 'bg-gray-600 hover:bg-gray-700'; // افتراضي - رمادي
    }
  };

  // تعريف أقسام الخدمات التعليمية مرتبة حسب الأولوية
  const educationSections = [
    // الصف الأول - الأهم (جاهزة)
    {
      id: 'universities-directory',
      title: 'دليل الجامعات',
      description: 'قائمة شاملة بالجامعات المحلية والدولية في عدن',
      icon: '🏛️',
      buttonText: 'شوف الجامعات',
      action: () => setLocation('/universities-directory')
    },
    {
      id: 'schools-directory',
      title: 'دليل المدارس والمؤسسات',
      description: 'قائمة شاملة للمدارس الحكومية والخاصة بتقييماتها',
      icon: '🏫',
      buttonText: 'شوف الدليل',
      action: () => setLocation('/schools-directory')
    },
    {
      id: 'online-registration',
      title: 'التسجيل والقبول الإلكتروني',
      description: 'تقديم ومتابعة طلبات الالتحاق وشروط القبول',
      icon: '📝',
      buttonText: 'سجل الآن',
      action: () => setLocation('/online-registration')
    },
    {
      id: 'digital-library',
      title: 'مكتبة رقمية محلية',
      description: 'مصادر مجانية: كتب ومناهج وفيديوهات',
      icon: '📚',
      buttonText: 'تصفح المكتبة',
      action: () => setLocation('/digital-library')
    },
    // الصف الثاني - جاهزة
    {
      id: 'parent-services',
      title: 'خدمات أولياء الأمور',
      description: 'متابعة درجات الأطفال وجداولهم وإشعارات الاجتماعات',
      icon: '👨‍👩‍👧‍👦',
      buttonText: 'شوف الخدمات',
      action: () => setLocation('/parent-services'),
      isUnderDevelopment: true
    },
    {
      id: 'school-transport',
      title: 'حجز النقل المدرسي',
      description: 'استعلام عن خطوط الباصات وحجز مقعد',
      icon: '🚌',
      buttonText: 'احجز النقل',
      action: () => setLocation('/school-transport'),
      isUnderDevelopment: true
    },
    // الصف الثالث - قيد التطوير (تم نقلها للأسفل)
    {
      id: 'private-tutors',
      title: 'دروس خصوصية ودورات',
      description: 'دليل المدرسين حسب التخصص والمنطقة',
      icon: '👨‍🏫',
      buttonText: 'شوف المدرسين',
      action: () => setLocation('/private-tutors'),
      isUnderDevelopment: true
    },
    {
      id: 'education-news',
      title: 'أخبار التعليم المحلية',
      description: 'تحديثات من مكتب التربية والتعليم وعروض المكتبات',
      icon: '📰',
      buttonText: 'اقرأ الأخبار',
      action: () => setLocation('/education-news'),
      isUnderDevelopment: true
    },
    {
      id: 'scholarships',
      title: 'المنح الدراسية',
      description: 'معلومات عن المنح الدراسية المحلية والدولية',
      icon: '🎓',
      buttonText: 'شوف المنح',
      action: () => setLocation('/scholarships'),
      isUnderDevelopment: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">الخدمات التعليمية</h1>
          <p className="text-gray-300">اكتشف المؤسسات التعليمية في عدن</p>
          <div className="mt-2 text-sm text-gray-400">
            {educationStats.total} خدمة تعليمية متاحة في جميع أنحاء عدن
        </div>
      </div>

        {/* أقسام الخدمات التعليمية */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
          {educationSections.map((section) => (
            <div
              key={section.id}
              className={`rounded-xl p-2 sm:p-3 border cursor-pointer transition-all hover:translateY(-4px) hover:scale-105 active:scale-95 ${
                section.isUnderDevelopment 
                  ? 'bg-orange-900 border-orange-800 opacity-75' 
                  : getEducationCardColor(section.id)
              }`}
              onClick={section.action}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 flex justify-center">
                  {section.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {section.title}
                  {section.isUnderDevelopment && (
                    <span className="text-xs text-orange-300 block mt-1">🚧 قيد التطوير</span>
                  )}
                </h3>
                <p className="text-sm text-white mb-4 leading-relaxed">
                  {section.description}
                </p>
                <button className={`w-full touch-target text-white typography-caption font-semibold rounded-xl transition-all hover:shadow-lg active:scale-95 ${
                  section.isUnderDevelopment 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : getEducationButtonColor(section.id)
                }`}>
                  {section.buttonText}
                        </button>
                      </div>
                    </div>
          ))}
        </div>

      </main>
      <AppFooter />
    </div>
  );
}

export default EducationPage;
