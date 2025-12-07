import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, Shield, Zap } from 'lucide-react';
import { 
  reportProtection, 
  formatCooldownTime, 
  getReportStatusColor, 
  getReportStatusIcon,
  type ReportData 
} from '@/lib/reportProtection';

interface ReportButtonsProps {
  district: string;
  currentStatus?: 'on' | 'off' | 'partial' | 'unknown';
  onReportSubmitted?: (report: ReportData) => void;
  className?: string;
}

const ReportButtons: React.FC<ReportButtonsProps> = ({
  district,
  currentStatus,
  onReportSubmitted,
  className = ''
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState<'on' | 'off' | null>(null);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [lastMessage, setLastMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning'>('success');

  // تحديث مؤقت التهدئة
  useEffect(() => {
    const updateCooldown = () => {
      const canReportOn = reportProtection.canReport(district, 'on');
      const canReportOff = reportProtection.canReport(district, 'off');
      
      if (!canReportOn.allowed && canReportOn.cooldownRemaining) {
        setCooldownTime(canReportOn.cooldownRemaining);
      } else if (!canReportOff.allowed && canReportOff.cooldownRemaining) {
        setCooldownTime(canReportOff.cooldownRemaining);
      } else {
        setCooldownTime(0);
      }
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [district]);

  // إرسال البلاغ
  const handleSubmitReport = async (status: 'on' | 'off') => {
    setIsSubmitting(true);
    setLastMessage('');
    
    try {
      const result = await reportProtection.submitReport(district, status);
      
      if (result.success) {
        setMessageType('success');
        setLastMessage(result.message);
        onReportSubmitted?.(result as any);
        
        // إخفاء رسالة النجاح بعد 3 ثوان
        setTimeout(() => setLastMessage(''), 3000);
      } else {
        setMessageType('error');
        setLastMessage(result.message);
        
        // إخفاء رسالة الخطأ بعد 5 ثوان
        setTimeout(() => setLastMessage(''), 5000);
      }
    } catch (error) {
      setMessageType('error');
      setLastMessage('حدث خطأ غير متوقع');
      setTimeout(() => setLastMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(null);
    }
  };

  // التحقق من إمكانية الإبلاغ
  const canReportOn = reportProtection.canReport(district, 'on');
  const canReportOff = reportProtection.canReport(district, 'off');

  // الحصول على لون الزر
  const getButtonColor = (status: 'on' | 'off', canReport: boolean) => {
    if (!canReport) return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    if (status === 'on') return 'bg-green-500 hover:bg-green-600 text-white';
    return 'bg-red-500 hover:bg-red-600 text-white';
  };

  // الحصول على أيقونة الزر
  const getButtonIcon = (status: 'on' | 'off') => {
    return status === 'on' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* رسالة الحالة */}
      {lastMessage && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${
          messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
          messageType === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : messageType === 'error' ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{lastMessage}</span>
        </div>
      )}

      {/* مؤقت التهدئة */}
      {cooldownTime > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">
              مؤقت التهدئة: {formatCooldownTime(cooldownTime)}
            </span>
          </div>
        </div>
      )}

      {/* أزرار الإبلاغ */}
      <div className="grid grid-cols-2 gap-3">
        {/* زر "لصت الآن" */}
        <button
          onClick={() => setShowConfirmation('on')}
          disabled={!canReportOn.allowed || isSubmitting}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
            transition-all duration-200 transform hover:scale-105 active:scale-95
            ${getButtonColor('on', canReportOn.allowed)}
            ${!canReportOn.allowed ? 'opacity-50' : 'shadow-md hover:shadow-lg'}
          `}
        >
          {getButtonIcon('on')}
          <span>🟢 لصت الآن</span>
        </button>

        {/* زر "طفت" */}
        <button
          onClick={() => setShowConfirmation('off')}
          disabled={!canReportOff.allowed || isSubmitting}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium
            transition-all duration-200 transform hover:scale-105 active:scale-95
            ${getButtonColor('off', canReportOff.allowed)}
            ${!canReportOff.allowed ? 'opacity-50' : 'shadow-md hover:shadow-lg'}
          `}
        >
          {getButtonIcon('off')}
          <span>🔴 طفت</span>
        </button>
      </div>

      {/* نافذة التأكيد */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              {/* أيقونة التأكيد */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>

              {/* العنوان */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                تأكيد الإبلاغ
              </h3>

              {/* الرسالة */}
              <p className="text-sm text-gray-600 mb-6">
                هل أنت متأكد من أن الكهرباء{' '}
                <span className={`font-medium ${
                  showConfirmation === 'on' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {showConfirmation === 'on' ? 'لصت الآن' : 'طفت'}
                </span>{' '}
                في مديرية <span className="font-medium">{district}</span>؟
              </p>

              {/* معلومات الحماية */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4" />
                  <span>نظام حماية متقدم ضد البلاغات المتكررة</span>
                </div>
              </div>

              {/* أزرار التأكيد */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleSubmitReport(showConfirmation)}
                  disabled={isSubmitting}
                  className={`
                    flex-1 px-4 py-2 rounded-lg font-medium transition-colors
                    ${showConfirmation === 'on' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    }
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    'تأكيد الإبلاغ'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* معلومات الحماية */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">نظام حماية متقدم</p>
            <ul className="text-xs space-y-1">
              <li>• مؤقت تهدئة 5 دقائق بين البلاغات</li>
              <li>• حماية من البلاغات المتكررة</li>
              <li>• حد أقصى 3 بلاغات في الساعة</li>
              <li>• حد أقصى 10 بلاغات في اليوم</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportButtons;
