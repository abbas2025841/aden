import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, AlertCircle, Zap, TrendingUp, TrendingDown } from 'lucide-react';

interface ConfirmationStatus {
  district: string;
  status: string;
  isConfirmed: boolean;
  confirmationCount: number;
  uniqueUsers: number;
  timeWindow: number;
  confirmedAt?: Date;
  expiresAt?: Date;
}

interface CollectiveConfirmationCardProps {
  district: string;
  onStatusUpdate?: (status: ConfirmationStatus) => void;
  className?: string;
}

const CollectiveConfirmationCard: React.FC<CollectiveConfirmationCardProps> = ({
  district,
  onStatusUpdate,
  className = ''
}) => {
  const [confirmationStatus, setConfirmationStatus] = useState<ConfirmationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب حالة التأكيد
  const fetchConfirmationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/electricity/confirmation/${encodeURIComponent(district)}`);
      const result = await response.json();
      
      if (result.success) {
        setConfirmationStatus(result.data);
        onStatusUpdate?.(result.data);
      } else {
        setError(result.message || 'خطأ في جلب حالة التأكيد');
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم');
      console.error('خطأ في جلب حالة التأكيد:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث دوري للحالة
  useEffect(() => {
    fetchConfirmationStatus();
    
    const interval = setInterval(fetchConfirmationStatus, 30000); // كل 30 ثانية
    return () => clearInterval(interval);
  }, [district]);

  // الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on': return 'text-green-600 bg-green-100 border-green-200';
      case 'off': return 'text-red-600 bg-red-100 border-red-200';
      case 'partial': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'unknown': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on': return <TrendingUp className="w-5 h-5" />;
      case 'off': return <TrendingDown className="w-5 h-5" />;
      case 'partial': return <Zap className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status: string) => {
    switch (status) {
      case 'on': return 'لصت الآن';
      case 'off': return 'طفت';
      case 'partial': return 'جزئي';
      case 'unknown': return 'غير مؤكد';
      default: return 'غير مؤكد';
    }
  };

  // حساب الوقت المتبقي
  const getTimeRemaining = (expiresAt?: Date): string => {
    if (!expiresAt) return '';
    
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'منتهي الصلاحية';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours} ساعة ${minutes % 60} دقيقة`;
    }
    
    return `${minutes} دقيقة`;
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchConfirmationStatus}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (!confirmationStatus) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">لا توجد بيانات تأكيد</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* العنوان */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{district}</h3>
        {confirmationStatus.isConfirmed && (
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">مؤكد</span>
          </div>
        )}
      </div>

      {/* حالة التأكيد */}
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(confirmationStatus.status)}`}>
          {getStatusIcon(confirmationStatus.status)}
          {getStatusText(confirmationStatus.status)}
        </div>
      </div>

      {/* إحصائيات التأكيد */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{confirmationStatus.confirmationCount}</div>
          <div className="text-xs text-gray-600">إجمالي البلاغات</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{confirmationStatus.uniqueUsers}</div>
          <div className="text-xs text-gray-600">مستخدمين فريدين</div>
        </div>
      </div>

      {/* رسالة التأكيد */}
      {confirmationStatus.isConfirmed ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-green-800">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">
              تم التأكيد بواسطة {confirmationStatus.uniqueUsers} مستخدم
            </span>
          </div>
          {confirmationStatus.confirmedAt && (
            <div className="text-xs text-green-600 mt-1">
              في {confirmationStatus.confirmedAt.toLocaleString('ar-SA')}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              يحتاج {3 - confirmationStatus.confirmationCount} بلاغات أخرى للتأكيد
            </span>
          </div>
          <div className="text-xs text-yellow-600 mt-1">
            في نافذة زمنية مدتها {confirmationStatus.timeWindow / 60} دقيقة
          </div>
        </div>
      )}

      {/* شريط التقدم */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>التقدم نحو التأكيد</span>
          <span>{confirmationStatus.confirmationCount}/3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              confirmationStatus.isConfirmed ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min((confirmationStatus.confirmationCount / 3) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* معلومات إضافية */}
      {confirmationStatus.expiresAt && (
        <div className="text-xs text-gray-500 text-center">
          ينتهي في: {getTimeRemaining(confirmationStatus.expiresAt)}
        </div>
      )}

      {/* زر التحديث */}
      <button
        onClick={fetchConfirmationStatus}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        تحديث الحالة
      </button>
    </div>
  );
};

export default CollectiveConfirmationCard;
