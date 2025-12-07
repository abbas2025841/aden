import React from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import UserServiceCard, { 
  UserCard, 
  ServiceCard, 
  NotificationCard, 
  StatisticCard 
} from '@/components/UserServiceCard';
import { 
  User, 
  Settings, 
  Heart, 
  Zap, 
  MapPin, 
  Phone, 
  Mail,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

export default function CardsDemoPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            بطاقات المعلومات والخدمات
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            تصميم حديث ومتجاوب لشريط جانبي لوحة التحكم
          </p>
        </div>

        {/* شبكة البطاقات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* بطاقة المستخدم */}
          <UserCard
            title="أحمد محمد علي"
            description="مطور تطبيقات ويب متخصص في React وNode.js مع خبرة 5 سنوات في تطوير الحلول التقنية"
            status="active"
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            badge="مطور"
            badgeColor="default"
            actionText="عرض الملف"
            onAction={() => console.log('عرض ملف المستخدم')}
            metadata={{
              location: "عدن، اليمن",
              phone: "+967 123 456 789",
              email: "ahmed@example.com",
              rating: 4.8,
              lastUpdate: "منذ ساعتين"
            }}
          />

          {/* بطاقة الخدمة */}
          <ServiceCard
            title="خدمة الصحة"
            description="خدمة طوارئ صحية متاحة 24/7 مع فريق طبي متخصص ومركبات إسعاف مجهزة"
            status="active"
            icon={<Heart className="w-6 h-6" />}
            badge="متاح"
            badgeColor="default"
            actionText="طلب الخدمة"
            onAction={() => setLocation('/health')}
            metadata={{
              location: "مستشفى الجمهورية",
              phone: "+967 1 234 567",
              rating: 4.9,
              lastUpdate: "منذ 5 دقائق"
            }}
          />

          {/* بطاقة الإشعارات */}
          <NotificationCard
            title="انقطاع الكهرباء"
            description="تم الإبلاغ عن انقطاع في التيار الكهربائي في منطقة التواهي، فريق الصيانة في الطريق"
            status="pending"
            icon={<Zap className="w-6 h-6" />}
            badge="طارئ"
            badgeColor="destructive"
            actionText="متابعة الحالة"
            onAction={() => setLocation('/electricity')}
            metadata={{
              location: "التواهي، عدن",
              lastUpdate: "منذ 10 دقائق"
            }}
          />

          {/* بطاقة الإحصائيات */}
          <StatisticCard
            title="إحصائيات اليوم"
            description="إجمالي الطلبات المكتملة اليوم مع معدل الرضا العالي من المستخدمين"
            status="completed"
            icon={<TrendingUp className="w-6 h-6" />}
            badge="+15%"
            badgeColor="default"
            actionText="عرض التفاصيل"
            onAction={() => console.log('عرض الإحصائيات')}
            metadata={{
              lastUpdate: "منذ دقيقة"
            }}
          />

          {/* بطاقة المستخدم بدون صورة */}
          <UserCard
            title="فاطمة أحمد"
            description="ممرضة متخصصة في العناية المركزة مع خبرة 8 سنوات في المستشفيات الحكومية"
            status="active"
            badge="ممرضة"
            badgeColor="secondary"
            actionText="عرض الملف"
            onAction={() => console.log('عرض ملف الممرضة')}
            metadata={{
              location: "مستشفى الصدر",
              phone: "+967 987 654 321",
              rating: 4.7,
              lastUpdate: "منذ 30 دقيقة"
            }}
          />

          {/* بطاقة الخدمة غير نشطة */}
          <ServiceCard
            title="خدمة المياه"
            description="خدمة توصيل المياه المنزلية متوقفة مؤقتاً بسبب أعمال الصيانة المجدولة"
            status="inactive"
            icon={<Settings className="w-6 h-6" />}
            badge="متوقف"
            badgeColor="outline"
            actionText="متابعة الحالة"
            onAction={() => console.log('متابعة خدمة المياه')}
            metadata={{
              location: "مؤسسة المياه",
              phone: "+967 1 111 222",
              lastUpdate: "منذ ساعة"
            }}
          />

          {/* بطاقة إشعار مكتمل */}
          <NotificationCard
            title="تم إصلاح العطل"
            description="تم إصلاح عطل الكهرباء في منطقة المعلا بنجاح، التيار الكهربائي عاد للعمل"
            status="completed"
            icon={<CheckCircle className="w-6 h-6" />}
            badge="مكتمل"
            badgeColor="default"
            actionText="تأكيد الاستلام"
            onAction={() => console.log('تأكيد إصلاح العطل')}
            metadata={{
              location: "المعلا، عدن",
              lastUpdate: "منذ 20 دقيقة"
            }}
          />

          {/* بطاقة إحصائيات متقدمة */}
          <StatisticCard
            title="أداء النظام"
            description="معدل استجابة النظام اليوم مع إحصائيات الأداء والاستخدام للمستخدمين"
            status="active"
            icon={<Activity className="w-6 h-6" />}
            badge="ممتاز"
            badgeColor="default"
            actionText="عرض التقرير"
            onAction={() => console.log('عرض تقرير الأداء')}
            metadata={{
              rating: 4.9,
              lastUpdate: "الآن"
            }}
          />

        </div>

        {/* معلومات إضافية */}
        <div className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              مميزات البطاقات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">متجاوب</h3>
                <p className="text-gray-600 dark:text-gray-300">يعمل على جميع الشاشات</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">حديث</h3>
                <p className="text-gray-600 dark:text-gray-300">تصميم عصري وجذاب</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">مرن</h3>
                <p className="text-gray-600 dark:text-gray-300">قابل للتخصيص بسهولة</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">سهل الاستخدام</h3>
                <p className="text-gray-600 dark:text-gray-300">واجهة بديهية وبسيطة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
