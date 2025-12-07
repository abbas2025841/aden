// مكون حارس الصلاحيات - عدن لايف
// Permission Guard Component for Aden Live App

import React from 'react';
import { useLocation } from 'wouter';
import { hasPermission, isGuest, getGuestWarningMessage } from '@/lib/guestPermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Lock, 
  User, 
  Phone, 
  AlertTriangle,
  ArrowRight,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: 'canPublish' | 'canShare' | 'canComment' | 'canRate' | 'canBookmark' | 'canSave' | 'canDownload' | 'canUpload';
  fallbackMessage?: string;
  showAsCard?: boolean;
  className?: string;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermission,
  fallbackMessage,
  showAsCard = true,
  className = ''
}) => {
  const [, setLocation] = useLocation();
  const hasRequiredPermission = hasPermission(requiredPermission);
  const isGuestUser = isGuest();

  // إذا كان لديه الصلاحية، اعرض المحتوى
  if (hasRequiredPermission) {
    return <>{children}</>;
  }

  // رسالة التحذير
  const warningMessage = fallbackMessage || getGuestWarningMessage(requiredPermission);

  // مكون التحذير
  const WarningComponent = () => (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
        {isGuestUser ? (
          <User className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        ) : (
          <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
        {isGuestUser ? 'ميزة مقيدة للزوار' : 'صلاحية مطلوبة'}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
        {warningMessage}
      </p>

      {isGuestUser && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 w-full max-w-md">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm">
            <Phone className="w-4 h-4" />
            <span className="font-medium">تسجيل الدخول برقم الهاتف</span>
          </div>
          <p className="text-blue-600 dark:text-blue-400 text-xs mt-1">
            ستحصل على جميع الصلاحيات بعد تسجيل الدخول
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={() => setLocation('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Phone className="w-4 h-4 ml-2" />
          تسجيل الدخول
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setLocation('/')}
          className="border-gray-300 dark:border-gray-600"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
          العودة للرئيسية
        </Button>
      </div>
    </div>
  );

  // عرض كبطاقة أو كعنصر عادي
  if (showAsCard) {
    return (
      <Card className="border-2 border-dashed border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
        <CardContent className="p-0">
          <WarningComponent />
        </CardContent>
      </Card>
    );
  }

  return <WarningComponent />;
};

// مكون مبسط للتحقق من الصلاحيات
interface SimplePermissionCheckProps {
  children: React.ReactNode;
  permission: 'canPublish' | 'canShare' | 'canComment' | 'canRate' | 'canBookmark' | 'canSave' | 'canDownload' | 'canUpload';
  fallback?: React.ReactNode;
}

export const SimplePermissionCheck: React.FC<SimplePermissionCheckProps> = ({
  children,
  permission,
  fallback
}) => {
  const hasRequiredPermission = hasPermission(permission);

  if (hasRequiredPermission) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
};

// مكون زر مع فحص الصلاحيات
interface PermissionButtonProps {
  children: React.ReactNode;
  permission: 'canPublish' | 'canShare' | 'canComment' | 'canRate' | 'canBookmark' | 'canSave' | 'canDownload' | 'canUpload';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
  children,
  permission,
  onClick,
  disabled = false,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const [, setLocation] = useLocation();
  const hasRequiredPermission = hasPermission(permission);
  const isGuestUser = isGuest();

  const handleClick = () => {
    if (hasRequiredPermission && onClick) {
      onClick();
    } else {
      // توجيه لصفحة تسجيل الدخول
      setLocation('/login');
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled}
      variant={variant}
      size={size}
      className={`${className} ${!hasRequiredPermission ? 'opacity-75' : ''}`}
      title={!hasRequiredPermission ? getGuestWarningMessage(permission) : undefined}
    >
      {children}
      {!hasRequiredPermission && (
        <Lock className="w-3 h-3 mr-1" />
      )}
    </Button>
  );
};

// مكون عرض حالة المستخدم
export const UserStatusBadge: React.FC = () => {
  const isGuestUser = isGuest();
  const isAuthenticated = !isGuestUser;

  if (isGuestUser) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm">
        <User className="w-4 h-4" />
        <span>زائر</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm">
        <Shield className="w-4 h-4" />
        <span>مسجل</span>
      </div>
    );
  }

  return null;
};

export default PermissionGuard;
