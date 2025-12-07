// import SmartNotifications from "@/components/SmartNotifications";
// import NotificationCenter from "@/components/NotificationCenter";
import { Logo } from "@/components/Logo";
import PageNavigator from "@/components/PageNavigator";
import { useState, useEffect, memo, useCallback } from "react";
import { Bell, User, LogIn, ArrowLeft, Home } from "lucide-react";
// import { notificationService } from "@/services/NotificationService";
import { useLocation } from "wouter";
import { authService } from "@/lib/auth";

const AppHeader = memo(function AppHeader() {
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [location, setLocation] = useLocation();

  // تحديد ما إذا كنا في الصفحة الرئيسية أم لا
  const isHomePage = location === '/' || location === '';
  
  // دالة للرجوع للخلف
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  // دالة للذهاب للصفحة الرئيسية
  const handleGoHome = useCallback(() => {
    setLocation('/');
  }, [setLocation]);

  useEffect(() => {
    // مؤقت - سيتم إصلاحه لاحقاً
    // const unsubscribe = notificationService.subscribe((notifications) => {
    //   setUnreadCount(notificationService.getUnreadCount());
    // });

    // // طلب إذن الإشعارات
    // notificationService.requestPermission();

    // return unsubscribe;
  }, []);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border py-4 page-transition safe-area-top w-full" data-testid="header-main">
      {/* Top Bar with Controls */}
      <div className="flex justify-between items-center mb-3 px-3">
        <div className="flex items-center gap-2">
          {/* أزرار التنقل - تظهر فقط خارج الصفحة الرئيسية */}
          {!isHomePage && (
            <>
              <button
                onClick={handleGoBack}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                title="رجوع"
                aria-label="العودة للصفحة السابقة"
                type="button"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors hover:text-blue-600 dark:hover:text-blue-400" />
              </button>
              <button
                onClick={handleGoHome}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md"
                title="الصفحة الرئيسية"
                aria-label="الذهاب للصفحة الرئيسية"
                type="button"
              >
                <Home className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors hover:text-blue-600 dark:hover:text-blue-400" />
              </button>
            </>
          )}
          {/* <SmartNotifications /> */}
          {/* زر الإشعارات - مؤقت معطل */}
          {/* <button
            onClick={() => setIsNotificationCenterOpen(true)}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button> */}
        </div>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span>{currentUser.name}</span>
              </div>
              <button
                onClick={() => {
                  authService.logout();
                  setCurrentUser(null);
                }}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                aria-label="تسجيل الخروج من الحساب"
                type="button"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLocation('/login')}
              className="flex items-center gap-1 p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              aria-label="تسجيل الدخول إلى الحساب"
              type="button"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>

      {/* Logo and Brand */}
      <div className="text-center mb-3 p-6 mx-3 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-xl dark:bg-gradient-to-br dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-800/30 dark:shadow-blue-900/20" style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 50%, rgba(236, 72, 153, 0.08) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(20px) saturate(180%)'
      }}>
        <div className="flex items-center justify-center mb-3" data-testid="text-logo">
          <Logo size="lg" animated />
        </div>
        <p className="typography-caption text-muted-foreground transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400" data-testid="text-tagline">
          حلول ذكية لحياة أسهل في عدن
        </p>
      </div>

      {/* شريط تمرير الصفحات */}
      <div className="px-3">
        <PageNavigator />
      </div>
      

      {/* مركز الإشعارات - مؤقت معطل */}
      {/* <NotificationCenter 
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      /> */}
    </header>
  );
});

export default AppHeader;
