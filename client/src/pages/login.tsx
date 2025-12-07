import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import '@/styles/login-animations.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { authService, User } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { createGuestUser, saveUser } from '@/lib/guestPermissions';
import { 
  Lock, 
  User as UserIcon,
  AlertCircle,
  Loader2,
  Shield,
  Phone,
  CheckCircle,
  Info,
  Smartphone,
  MapPin,
  ArrowRight
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rememberMe, setRememberMe] = useState(false);
  const [loginStep, setLoginStep] = useState<'phone' | 'verification'>('phone');
  const [countdown, setCountdown] = useState(0);

  // تحديث الوقت كل دقيقة
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // مسح الخطأ عند الكتابة
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (loginStep === 'phone') {
        // مسار خاص للمشرف: إذا تم إدخال الكود السري في خانة رقم الهاتف، ادخل لوحة التحكم مباشرة
        if (formData.phone === '7771658701232025') {
          setLocation('/admin');
          return;
        }

        // إرسال رمز التحقق عبر Supabase للمستخدمين العاديين
        console.log('إرسال رمز التحقق إلى:', formData.phone);
        
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: formData.phone,
          options: {
            channel: 'sms',
            message: `رمز التحقق لتطبيق عدن لايف: {{ .Code }}`
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        setLoginStep('verification');
        setCountdown(60);
        
        // بدء العد التنازلي
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        console.log('تم إرسال رمز التحقق بنجاح');
      } else {
        // مسار خاص للمشرف: إذا تم إدخال الكود السري، يتم التوجيه مباشرة إلى لوحة التحكم
        if (formData.verificationCode === '7771658701232025') {
          setLocation('/admin/home-tanks');
          return;
        }

        // التحقق من الرمز عبر Supabase للمستخدمين العاديين
        console.log('التحقق من الرمز:', formData.verificationCode);
        
        const { data, error } = await supabase.auth.verifyOtp({
          phone: formData.phone,
          token: formData.verificationCode,
          type: 'sms'
        });

        if (error) {
          throw new Error(error.message);
        }

        // حفظ المستخدم في قاعدة البيانات
        if (data.user) {
          await supabase
            .from('users')
            .upsert({
              id: data.user.id,
              phone: data.user.phone,
              email: data.user.email,
              name: formData.name || data.user.user_metadata?.name || 'مستخدم جديد',
              avatar: data.user.user_metadata?.avatar_url,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          // حفظ المستخدم المسجل في نظام الصلاحيات
          const authenticatedUser = {
            id: data.user.id,
            name: formData.name || data.user.user_metadata?.name || 'مستخدم جديد',
            role: 'user' as const,
            permissions: {
              canPublish: true,
              canShare: true,
              canComment: true,
              canRate: true,
              canBookmark: true,
              canSave: true,
              canDownload: true,
              canUpload: true,
            }
          };
          
          saveUser(authenticatedUser);
        }

        console.log('تم تسجيل الدخول بنجاح:', data.user);
        setLocation('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('إعادة إرسال رمز التحقق إلى:', formData.phone);
      setCountdown(60);
      
      // بدء العد التنازلي
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إرسال الرمز');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // تسجيل الدخول كضيف بدون صلاحيات
      const guestUser = createGuestUser();
      
      console.log('تم تسجيل الدخول كضيف:', guestUser);
      
      // حفظ حالة الضيف باستخدام نظام الصلاحيات
      saveUser(guestUser);
      
      setLocation('/');
      
    } catch (err) {
      setError('حدث خطأ في تسجيل الدخول كضيف');
      console.error('خطأ في تسجيل الدخول كضيف:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* شعار التطبيق المحسن */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              <UserIcon className="w-10 h-10 text-white relative z-10" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              عدن لايف
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">مرحباً بك في منصة عدن الرقمية</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>عدن، اليمن</span>
              <span>•</span>
              <span>{currentTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              تسجيل الدخول
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-sm">ادخل بياناتك للوصول إلى حسابك</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* معلومات تسجيل الدخول */}
            <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                <Smartphone className="w-5 h-5" />
                <span className="font-semibold">تسجيل الدخول برقم الهاتف</span>
              </div>
              <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                سوف نرسل لك رمز التحقق عبر الرسائل النصية
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* بيانات الدخول الأساسية */}
              {loginStep === 'phone' ? (
                /* خطوة إدخال الاسم ورقم الهاتف */
                <div className="space-y-4">
                  {/* الاسم */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      الاسم
                    </label>
                    <div className="relative group">
                      <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="اكتب اسمك الكامل"
                        className="pr-12 h-11 text-base border-2 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      سيُستخدم هذا الاسم داخل التطبيق ويمكنك تغييره لاحقاً.
                    </p>
                  </div>

                  {/* رقم الهاتف */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      رقم الهاتف
                    </label>
                    <div className="relative group">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+967-123456789"
                        className="pr-12 h-12 text-lg border-2 focus:border-blue-500 transition-all duration-200"
                        required
                        dir="ltr"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      سيتم إرسال رمز التحقق إلى هذا الرقم
                    </p>
                  </div>
                </div>
              ) : (
                /* خطوة إدخال رمز التحقق */
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-green-600 dark:text-green-400 mb-2">
                      <CheckCircle className="w-8 h-8 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      تم إرسال رمز التحقق
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      تم إرسال رمز التحقق إلى الرقم: {formData.phone}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="verificationCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      رمز التحقق
                    </label>
                    <div className="relative group">
                      <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                      <Input
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        value={formData.verificationCode}
                        onChange={handleInputChange}
                        placeholder="أدخل رمز التحقق المكون من 6 أرقام"
                        className="pr-12 h-12 text-lg border-2 focus:border-blue-500 transition-all duration-200 text-center text-lg tracking-widest"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        يمكنك إعادة الإرسال خلال {countdown} ثانية
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                      >
                        إعادة إرسال الرمز
                      </button>
                    )}
                    <div>
                      <button
                        type="button"
                        onClick={() => setLoginStep('phone')}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        تغيير رقم الهاتف
                      </button>
                    </div>
                  </div>
                </div>
              )}


              {/* خيارات إضافية */}
              {loginStep === 'phone' && (
                <div className="flex items-center justify-center">
                  <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-300">تذكرني</span>
                  </label>
                </div>
              )}

              {/* رسالة الخطأ */}
              {error && (
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 ml-3 flex-shrink-0" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    {loginStep === 'phone' ? 'جاري إرسال الرمز...' : 'جاري التحقق...'}
                  </>
                ) : (
                  <>
                    {loginStep === 'phone' ? (
                      <>
                        <Smartphone className="w-5 h-5 ml-2" />
                        إرسال رمز التحقق
                        <ArrowRight className="w-5 h-5 mr-2" />
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 ml-2" />
                        تأكيد الرمز
                        <ArrowRight className="w-5 h-5 mr-2" />
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            {/* خيار تسجيل الدخول كضيف */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  تصفح التطبيق كضيف
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Info className="w-3 h-3" />
                  <span>
                    بدون صلاحيات النشر والمشاركة
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p>للاستفادة الكاملة من الميزات، سجل دخولك برقم الهاتف</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                  className="h-10 px-8 text-sm font-medium border-2 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
                >
                  <UserIcon className="w-4 h-4 ml-2" />
                  دخول كضيف
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;