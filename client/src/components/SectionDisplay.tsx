import React from 'react';
import { 
  Heart, 
  GraduationCap, 
  Zap, 
  Droplets, 
  Trash2, 
  User, 
  Map, 
  DollarSign, 
  Bell, 
  Bot,
  Home,
  Settings
} from 'lucide-react';

interface SectionDisplayProps {
  activeSection: string;
  className?: string;
}

const SectionDisplay: React.FC<SectionDisplayProps> = ({ 
  activeSection, 
  className = '' 
}) => {
  // بيانات الأقسام
  const sections = {
    home: {
      title: 'الرئيسية',
      icon: <Home className="w-8 h-8" />,
      description: 'الصفحة الرئيسية لتطبيق عدن لايف',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">مرحباً بك في عدن لايف</h3>
            <p className="text-gray-600">
              تطبيق شامل لجميع خدمات مدينة عدن. يمكنك الوصول إلى جميع الخدمات من خلال الشريط الجانبي.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-2">الخدمات المتاحة</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• الخدمات الصحية</li>
                <li>• التعليم</li>
                <li>• الكهرباء</li>
                <li>• المياه</li>
                <li>• النظافة</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-2">معلومات سريعة</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• عدد المستخدمين: 1,250+</li>
                <li>• الخدمات المكتملة: 5,890</li>
                <li>• معدل الرضا: 4.8/5</li>
                <li>• آخر تحديث: اليوم</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    health: {
      title: 'الخدمات الصحية',
      icon: <Heart className="w-8 h-8" />,
      description: 'خدمات طبية وصحية متاحة في عدن',
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 rounded-xl p-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-4">خدمات الطوارئ الطبية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">الإسعاف</h4>
                <p className="text-2xl font-bold text-red-600">199</p>
                <p className="text-sm text-gray-600">متاح 24/7</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">الطوارئ</h4>
                <p className="text-2xl font-bold text-red-600">+967 1 234 567</p>
                <p className="text-sm text-gray-600">مستشفى الجمهورية</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-2">المستشفيات</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• مستشفى الجمهورية</li>
                <li>• مستشفى الصدر</li>
                <li>• مستشفى الأطفال</li>
                <li>• مستشفى العيون</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-2">الصيدليات</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• صيدلية النور</li>
                <li>• صيدلية الشفاء</li>
                <li>• صيدلية الحياة</li>
                <li>• صيدلية الأمل</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-2">المراكز الصحية</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• مركز التواهي</li>
                <li>• مركز المعلا</li>
                <li>• مركز الشيخ عثمان</li>
                <li>• مركز خورمكسر</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    education: {
      title: 'التعليم',
      icon: <GraduationCap className="w-8 h-8" />,
      description: 'المؤسسات التعليمية والخدمات الأكاديمية',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4">المؤسسات التعليمية</h3>
            <p className="text-gray-600">
              دليل شامل لجميع المؤسسات التعليمية في عدن من المدارس إلى الجامعات
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">الجامعات</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>جامعة عدن</span>
                  <span className="text-blue-600">مفتوح</span>
                </li>
                <li className="flex justify-between">
                  <span>الجامعة التقنية</span>
                  <span className="text-blue-600">مفتوح</span>
                </li>
                <li className="flex justify-between">
                  <span>جامعة العلوم</span>
                  <span className="text-green-600">متاح</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">المدارس</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>مدرسة النور</span>
                  <span className="text-blue-600">مفتوح</span>
                </li>
                <li className="flex justify-between">
                  <span>مدرسة الأمل</span>
                  <span className="text-blue-600">مفتوح</span>
                </li>
                <li className="flex justify-between">
                  <span>مدرسة المستقبل</span>
                  <span className="text-green-600">متاح</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    electricity: {
      title: 'الكهرباء',
      icon: <Zap className="w-8 h-8" />,
      description: 'خدمات الكهرباء ونقاط الشحن الشمسي',
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-xl font-bold text-yellow-900 mb-4">حالة التيار الكهربائي</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">التواهي</h4>
                <p className="text-2xl font-bold text-green-600">متاح</p>
                <p className="text-sm text-gray-600">24 ساعة</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">المعلا</h4>
                <p className="text-2xl font-bold text-yellow-600">محدود</p>
                <p className="text-sm text-gray-600">12 ساعة</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">الشيخ عثمان</h4>
                <p className="text-2xl font-bold text-red-600">منقطع</p>
                <p className="text-sm text-gray-600">إصلاح جاري</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">نقاط الشحن الشمسي</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>نقطة التواهي</span>
                  <span className="text-green-600">متاح</span>
                </li>
                <li className="flex justify-between">
                  <span>نقطة المعلا</span>
                  <span className="text-green-600">متاح</span>
                </li>
                <li className="flex justify-between">
                  <span>نقطة الشيخ عثمان</span>
                  <span className="text-yellow-600">مشغول</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">أرقام الطوارئ</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>شكاوى الكهرباء</span>
                  <span className="text-blue-600">+967 1 111 222</span>
                </li>
                <li className="flex justify-between">
                  <span>الطوارئ</span>
                  <span className="text-red-600">+967 1 999 888</span>
                </li>
                <li className="flex justify-between">
                  <span>الصيانة</span>
                  <span className="text-green-600">+967 1 333 444</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    water: {
      title: 'المياه',
      icon: <Droplets className="w-8 h-8" />,
      description: 'خدمات المياه والتوصيل',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4">حالة المياه</h3>
            <p className="text-gray-600">
              معلومات محدثة عن توفر المياه في مختلف مناطق عدن
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">المناطق المتاحة</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>التواهي</span>
                  <span className="text-green-600">متاح</span>
                </li>
                <li className="flex justify-between">
                  <span>المعلا</span>
                  <span className="text-green-600">متاح</span>
                </li>
                <li className="flex justify-between">
                  <span>الشيخ عثمان</span>
                  <span className="text-yellow-600">محدود</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">خدمات التوصيل</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>طلب توصيل</span>
                  <span className="text-blue-600">+967 1 555 666</span>
                </li>
                <li className="flex justify-between">
                  <span>شكاوى</span>
                  <span className="text-red-600">+967 1 777 888</span>
                </li>
                <li className="flex justify-between">
                  <span>الطوارئ</span>
                  <span className="text-red-600">+967 1 999 000</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    sanitation: {
      title: 'النظافة',
      icon: <Trash2 className="w-8 h-8" />,
      description: 'خدمات النظافة وجمع النفايات',
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4">خدمات النظافة</h3>
            <p className="text-gray-600">
              جدول جمع النفايات وخدمات النظافة في جميع مناطق عدن
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">جدول الجمع</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>التواهي</span>
                  <span className="text-blue-600">يومياً</span>
                </li>
                <li className="flex justify-between">
                  <span>المعلا</span>
                  <span className="text-blue-600">يومياً</span>
                </li>
                <li className="flex justify-between">
                  <span>الشيخ عثمان</span>
                  <span className="text-green-600">كل يومين</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="font-semibold text-gray-900 mb-3">أرقام التواصل</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex justify-between">
                  <span>طلب جمع</span>
                  <span className="text-blue-600">+967 1 222 333</span>
                </li>
                <li className="flex justify-between">
                  <span>شكاوى</span>
                  <span className="text-red-600">+967 1 444 555</span>
                </li>
                <li className="flex justify-between">
                  <span>الطوارئ</span>
                  <span className="text-red-600">+967 1 666 777</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  };

  const currentSection = sections[activeSection as keyof typeof sections] || sections.home;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* رأس القسم */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
          {currentSection.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
          <p className="text-gray-600">{currentSection.description}</p>
        </div>
      </div>

      {/* محتوى القسم */}
      <div className="space-y-4">
        {currentSection.content}
      </div>
    </div>
  );
};

export default SectionDisplay;
