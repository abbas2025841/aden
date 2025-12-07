import React from 'react';
import { MapPin, Clock, Zap, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { type ElectricityStatus, getStatusColor, getStatusIcon, getStatusText, formatTimeAgo } from '@/data/aden-electricity-data';
import ReportButtons from './ReportButtons';

interface SimpleElectricityCardProps {
  electricity: ElectricityStatus;
  onClick?: (electricity: ElectricityStatus) => void;
}

const SimpleElectricityCard: React.FC<SimpleElectricityCardProps> = ({ 
  electricity, 
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(electricity);
    }
  };

  const statusColor = getStatusColor(electricity.status);
  const statusIcon = getStatusIcon(electricity.status);
  const statusText = getStatusText(electricity.status);
  const timeAgo = formatTimeAgo(electricity.lastUpdate);

  return (
    <div
      className={`
        electricity-card relative bg-white rounded-lg shadow-md border border-gray-200 p-6 cursor-pointer
        ${electricity.isRecentlyUpdated ? 'animate-pulse-enhanced ring-2 ring-green-200' : ''}
      `}
      onClick={handleClick}
    >
      {/* مؤشر التحديث الحديث */}
      {electricity.isRecentlyUpdated && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-ping-enhanced"></div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{statusIcon}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{electricity.district}</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>📍</span>
            </div>
          </div>
        </div>
        
        {/* حالة الكهرباء */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
          {statusText}
        </div>
      </div>

      {/* معلومات الطاقة */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">حمل الطاقة</span>
          <span className={`text-sm font-medium ${
            electricity.powerLoad >= 80 ? 'text-green-600' :
            electricity.powerLoad >= 60 ? 'text-yellow-600' :
            electricity.powerLoad >= 40 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {electricity.powerLoad}%
          </span>
        </div>
        
        {/* شريط التقدم */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              electricity.powerLoad >= 80 ? 'bg-green-500' :
              electricity.powerLoad >= 60 ? 'bg-yellow-500' :
              electricity.powerLoad >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${electricity.powerLoad}%` }}
          ></div>
        </div>
      </div>

      {/* المدة المتوقعة */}
      {electricity.estimatedDuration && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>المدة المتوقعة: {electricity.estimatedDuration}</span>
          </div>
        </div>
      )}

      {/* الملاحظات */}
      {electricity.notes && (
        <div className="mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{electricity.notes}</span>
          </div>
        </div>
      )}

      {/* آخر تحديث */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>آخر تحديث</span>
        </div>
        <span className="font-medium">{timeAgo}</span>
      </div>

      {/* أزرار الإبلاغ */}
      <div className="border-t border-gray-100 pt-4">
        <ReportButtons 
          district={electricity.district}
          currentStatus={electricity.status}
          onReportSubmitted={(report) => {
            // يمكن إضافة منطق إضافي هنا
          }}
        />
      </div>

      {/* تأثير الرفع عند النقر */}
      <div className="absolute inset-0 rounded-lg bg-blue-50 opacity-0 transition-opacity duration-200 hover:opacity-10"></div>
    </div>
  );
};

// مكون شبكة بطاقات الكهرباء البسيطة
interface SimpleElectricityGridProps {
  electricityData: ElectricityStatus[];
  onElectricityClick?: (electricity: ElectricityStatus) => void;
  className?: string;
}

export const SimpleElectricityGrid: React.FC<SimpleElectricityGridProps> = ({
  electricityData,
  onElectricityClick,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {electricityData.map((electricity, index) => (
        <div
          key={electricity.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <SimpleElectricityCard 
            electricity={electricity}
            onClick={onElectricityClick}
          />
        </div>
      ))}
    </div>
  );
};

export default SimpleElectricityCard;
