// مثال استخدام نظام الصلاحيات - عدن لايف
// Example Permission System Usage for Aden Live App

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PermissionGuard, { 
  SimplePermissionCheck, 
  PermissionButton, 
  UserStatusBadge 
} from '@/components/PermissionGuard';
import { usePermissions } from '@/lib/guestPermissions';
import { 
  Plus, 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark,
  Download,
  Upload,
  Star
} from 'lucide-react';

// مثال صفحة الوظائف مع نظام الصلاحيات
const JobsPageExample: React.FC = () => {
  const { user, isGuest, isAuthenticated, hasPermission } = usePermissions();

  return (
    <div className="container mx-auto p-4">
      {/* عرض حالة المستخدم */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">الوظائف المتاحة</h1>
        <UserStatusBadge />
      </div>

      {/* بطاقة وظيفة */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>مطور ويب - React</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            مطلوب مطور ويب متخصص في React.js لتطوير تطبيقات ويب حديثة
          </p>
          
          {/* أزرار مع فحص الصلاحيات */}
          <div className="flex gap-2 flex-wrap">
            {/* زر التقديم - يحتاج صلاحية النشر */}
            <PermissionButton
              permission="canPublish"
              onClick={() => console.log('تقديم للوظيفة')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              التقديم للوظيفة
            </PermissionButton>

            {/* زر المشاركة */}
            <PermissionButton
              permission="canShare"
              onClick={() => console.log('مشاركة الوظيفة')}
              variant="outline"
            >
              <Share2 className="w-4 h-4 ml-2" />
              مشاركة
            </PermissionButton>

            {/* زر الإعجاب */}
            <PermissionButton
              permission="canRate"
              onClick={() => console.log('إعجاب بالوظيفة')}
              variant="outline"
            >
              <Heart className="w-4 h-4 ml-2" />
              إعجاب
            </PermissionButton>

            {/* زر الحفظ */}
            <PermissionButton
              permission="canBookmark"
              onClick={() => console.log('حفظ الوظيفة')}
              variant="outline"
            >
              <Bookmark className="w-4 h-4 ml-2" />
              حفظ
            </PermissionButton>
          </div>
        </CardContent>
      </Card>

      {/* قسم التعليقات مع حارس الصلاحيات */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>التعليقات</CardTitle>
        </CardHeader>
        <CardContent>
          {/* حارس الصلاحيات للتعليقات */}
          <PermissionGuard
            requiredPermission="canComment"
            fallbackMessage="يجب تسجيل الدخول برقم الهاتف لإضافة تعليق"
          >
            <div className="space-y-4">
              <textarea
                placeholder="اكتب تعليقك هنا..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
              />
              <Button className="bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4 ml-2" />
                إضافة تعليق
              </Button>
            </div>
          </PermissionGuard>

          {/* عرض التعليقات الموجودة */}
          <div className="mt-4 space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">تعليق من مستخدم مسجل...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قسم رفع الملفات */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>رفع السيرة الذاتية</CardTitle>
        </CardHeader>
        <CardContent>
          <PermissionGuard
            requiredPermission="canUpload"
            showAsCard={false}
          >
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">اسحب وأفلت ملف السيرة الذاتية هنا</p>
              <Button variant="outline">
                <Upload className="w-4 h-4 ml-2" />
                اختيار ملف
              </Button>
            </div>
          </PermissionGuard>
        </CardContent>
      </Card>

      {/* قسم التقييمات */}
      <Card>
        <CardHeader>
          <CardTitle>تقييم الشركة</CardTitle>
        </CardHeader>
        <CardContent>
          <SimplePermissionCheck
            permission="canRate"
            fallback={
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Star className="w-8 h-8 mx-auto text-orange-400 mb-2" />
                <p className="text-orange-600">
                  يجب تسجيل الدخول لتقييم الشركة
                </p>
              </div>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span>تقييمك:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Star className="w-4 h-4 ml-2" />
                إرسال التقييم
              </Button>
            </div>
          </SimplePermissionCheck>
        </CardContent>
      </Card>

      {/* معلومات إضافية للضيف */}
      {isGuest && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">
                  استفد من جميع الميزات!
                </h3>
                <p className="text-orange-700 text-sm">
                  سجل دخولك برقم الهاتف للوصول إلى جميع الميزات مثل التقديم للوظائف، 
                  إضافة التعليقات، التقييم، والمزيد.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JobsPageExample;
