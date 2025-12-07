// نظام إدارة صلاحيات الضيف - عدن لايف
// Guest Permissions System for Aden Live App

export interface GuestUser {
  id: string;
  name: string;
  role: 'guest';
  permissions: {
    canPublish: boolean;
    canShare: boolean;
    canComment: boolean;
    canRate: boolean;
    canBookmark: boolean;
    canSave: boolean;
    canDownload: boolean;
    canUpload: boolean;
  };
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: {
    canPublish: boolean;
    canShare: boolean;
    canComment: boolean;
    canRate: boolean;
    canBookmark: boolean;
    canSave: boolean;
    canDownload: boolean;
    canUpload: boolean;
  };
}

export type User = GuestUser | AuthenticatedUser;

// صلاحيات الضيف (مقيدة)
export const GUEST_PERMISSIONS: GuestUser['permissions'] = {
  canPublish: false,
  canShare: false,
  canComment: false,
  canRate: false,
  canBookmark: false,
  canSave: false,
  canDownload: false,
  canUpload: false,
};

// صلاحيات المستخدم العادي
export const USER_PERMISSIONS: AuthenticatedUser['permissions'] = {
  canPublish: true,
  canShare: true,
  canComment: true,
  canRate: true,
  canBookmark: true,
  canSave: true,
  canDownload: true,
  canUpload: true,
};

// صلاحيات المراقب
export const MODERATOR_PERMISSIONS: AuthenticatedUser['permissions'] = {
  canPublish: true,
  canShare: true,
  canComment: true,
  canRate: true,
  canBookmark: true,
  canSave: true,
  canDownload: true,
  canUpload: true,
};

// صلاحيات المشرف
export const ADMIN_PERMISSIONS: AuthenticatedUser['permissions'] = {
  canPublish: true,
  canShare: true,
  canComment: true,
  canRate: true,
  canBookmark: true,
  canSave: true,
  canDownload: true,
  canUpload: true,
};

// إنشاء مستخدم ضيف
export function createGuestUser(): GuestUser {
  return {
    id: 'guest',
    name: 'زائر',
    role: 'guest',
    permissions: GUEST_PERMISSIONS,
  };
}

// الحصول على المستخدم الحالي
export function getCurrentUser(): User | null {
  try {
    // محاولة جلب المستخدم المسجل
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      return JSON.parse(authUser);
    }

    // محاولة جلب المستخدم الضيف
    const guestUser = localStorage.getItem('guestUser');
    if (guestUser) {
      return JSON.parse(guestUser);
    }

    return null;
  } catch (error) {
    console.error('خطأ في جلب المستخدم الحالي:', error);
    return null;
  }
}

// حفظ المستخدم
export function saveUser(user: User): void {
  try {
    if (user.role === 'guest') {
      localStorage.setItem('guestUser', JSON.stringify(user));
      localStorage.removeItem('authUser'); // إزالة المستخدم المسجل إذا كان موجوداً
    } else {
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.removeItem('guestUser'); // إزالة المستخدم الضيف إذا كان موجوداً
    }
  } catch (error) {
    console.error('خطأ في حفظ المستخدم:', error);
  }
}

// تسجيل الخروج
export function logout(): void {
  localStorage.removeItem('authUser');
  localStorage.removeItem('guestUser');
}

// فحص الصلاحيات
export function hasPermission(permission: keyof User['permissions']): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.permissions[permission];
}

// فحص إذا كان المستخدم ضيف
export function isGuest(): boolean {
  const user = getCurrentUser();
  return user?.role === 'guest';
}

// فحص إذا كان المستخدم مسجل
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return user?.role !== 'guest' && user !== null;
}

// الحصول على رسالة تحذير للضيف
export function getGuestWarningMessage(action: string): string {
  const messages: Record<string, string> = {
    publish: 'يجب تسجيل الدخول برقم الهاتف لنشر المحتوى',
    share: 'يجب تسجيل الدخول برقم الهاتف لمشاركة المحتوى',
    comment: 'يجب تسجيل الدخول برقم الهاتف لإضافة تعليق',
    rate: 'يجب تسجيل الدخول برقم الهاتف لتقييم المحتوى',
    bookmark: 'يجب تسجيل الدخول برقم الهاتف لحفظ المحتوى',
    save: 'يجب تسجيل الدخول برقم الهاتف لحفظ المحتوى',
    download: 'يجب تسجيل الدخول برقم الهاتف لتحميل المحتوى',
    upload: 'يجب تسجيل الدخول برقم الهاتف لرفع المحتوى',
  };

  return messages[action] || 'يجب تسجيل الدخول برقم الهاتف للوصول إلى هذه الميزة';
}

// مكون للتحقق من الصلاحيات (سيتم نقله إلى ملف منفصل)
export function withPermissionCheck<T extends React.ComponentType<any>>(
  Component: T,
  requiredPermission: keyof User['permissions'],
  fallbackMessage?: string
): T {
  // هذا المكون سيتم نقله إلى ملف React منفصل
  return Component;
}

// Hook للتحقق من الصلاحيات
export function usePermissions() {
  const user = getCurrentUser();
  
  return {
    user,
    isGuest: isGuest(),
    isAuthenticated: isAuthenticated(),
    hasPermission,
    getGuestWarningMessage,
  };
}

export default {
  createGuestUser,
  getCurrentUser,
  saveUser,
  logout,
  hasPermission,
  isGuest,
  isAuthenticated,
  getGuestWarningMessage,
  withPermissionCheck,
  usePermissions,
  GUEST_PERMISSIONS,
  USER_PERMISSIONS,
  MODERATOR_PERMISSIONS,
  ADMIN_PERMISSIONS,
};
