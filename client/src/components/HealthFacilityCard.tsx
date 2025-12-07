import React from 'react';
import { Card } from '@/components/EnhancedUI';
import { MapPin, Clock, Phone, Star } from 'lucide-react';

interface HealthFacility {
  id: string;
  name: string;
  type: string;
  distance: number;
  address?: string;
  phone?: string;
  rating?: number;
  isOpen?: boolean;
  workingHours?: string;
}

interface HealthFacilityCardProps {
  facility: HealthFacility;
  onClick?: (facility: HealthFacility) => void;
}

const HealthFacilityCard: React.FC<HealthFacilityCardProps> = ({ 
  facility, 
  onClick 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(facility);
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'مستشفى':
      case 'hospital':
        return '🏥';
      case 'صيدلية':
      case 'pharmacy':
        return '💊';
      case 'عيادة':
      case 'clinic':
        return '🩺';
      case 'طوارئ':
      case 'emergency':
        return '🚨';
      case 'مختبر':
      case 'lab':
        return '🧪';
      default:
        return '🏥';
    }
  };

  const getStatusColor = (isOpen?: boolean) => {
    if (isOpen === undefined) return 'text-gray-500';
    return isOpen ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = (isOpen?: boolean) => {
    if (isOpen === undefined) return 'غير محدد';
    return isOpen ? 'مفتوح الآن' : 'مغلق';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      {/* معلومات إضافية */}
      <div className="mt-4 space-y-2">
        {/* العنوان */}
        {facility.address && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{facility.address}</span>
          </div>
        )}

        {/* الهاتف */}
        {facility.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{facility.phone}</span>
          </div>
        )}

        {/* ساعات العمل */}
        {facility.workingHours && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{facility.workingHours}</span>
          </div>
        )}

        {/* التقييم */}
        {facility.rating && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-gray-600">{facility.rating.toFixed(1)}</span>
          </div>
        )}

        {/* حالة الفتح/الإغلاق */}
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(facility.isOpen).replace('text-', 'bg-')}`} />
          <span className={getStatusColor(facility.isOpen)}>
            {getStatusText(facility.isOpen)}
          </span>
        </div>
      </div>
    </div>
  );
};

// مكونات متخصصة لأنواع مختلفة من المرافق الصحية
export const HospitalCard: React.FC<HealthFacilityCardProps> = (props) => (
  <HealthFacilityCard {...props} />
);

export const PharmacyCard: React.FC<HealthFacilityCardProps> = (props) => (
  <HealthFacilityCard {...props} />
);

export const ClinicCard: React.FC<HealthFacilityCardProps> = (props) => (
  <HealthFacilityCard {...props} />
);

export const EmergencyCard: React.FC<HealthFacilityCardProps> = (props) => (
  <HealthFacilityCard {...props} />
);

// مكون شبكة المرافق الصحية
interface HealthFacilitiesGridProps {
  facilities: HealthFacility[];
  onFacilityClick?: (facility: HealthFacility) => void;
  className?: string;
}

export const HealthFacilitiesGrid: React.FC<HealthFacilitiesGridProps> = ({
  facilities,
  onFacilityClick,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {facilities.map(facility => (
        <HealthFacilityCard 
          key={facility.id} 
          facility={facility}
          onClick={onFacilityClick}
        />
      ))}
    </div>
  );
};

// بيانات تجريبية للمرافق الصحية
export const mockHealthFacilities: HealthFacility[] = [
  {
    id: '1',
    name: 'مستشفى الجمهورية التعليمي',
    type: 'مستشفى',
    distance: 2.5,
    address: 'شارع الجمهورية، كريتر، عدن',
    phone: '+967-2-234567',
    rating: 4.5,
    isOpen: true,
    workingHours: '24/7'
  },
  {
    id: '2',
    name: 'صيدلية النور',
    type: 'صيدلية',
    distance: 0.8,
    address: 'شارع التحرير، المعلا، عدن',
    phone: '+967-2-345678',
    rating: 4.2,
    isOpen: true,
    workingHours: '8:00 - 22:00'
  },
  {
    id: '3',
    name: 'عيادة الدكتور أحمد',
    type: 'عيادة',
    distance: 1.2,
    address: 'شارع الملكة أروى، التواهي، عدن',
    phone: '+967-2-456789',
    rating: 4.7,
    isOpen: false,
    workingHours: '9:00 - 17:00'
  },
  {
    id: '4',
    name: 'مستشفى الطوارئ',
    type: 'طوارئ',
    distance: 3.1,
    address: 'شارع الخليج، الشيخ عثمان، عدن',
    phone: '+967-2-567890',
    rating: 4.3,
    isOpen: true,
    workingHours: '24/7'
  },
  {
    id: '5',
    name: 'مختبر التحاليل الطبية',
    type: 'مختبر',
    distance: 1.8,
    address: 'شارع الاستقلال، كريتر، عدن',
    phone: '+967-2-678901',
    rating: 4.1,
    isOpen: true,
    workingHours: '7:00 - 19:00'
  },
  {
    id: '6',
    name: 'صيدلية الشفاء',
    type: 'صيدلية',
    distance: 0.5,
    address: 'شارع النصر، المعلا، عدن',
    phone: '+967-2-789012',
    rating: 4.4,
    isOpen: true,
    workingHours: '8:00 - 23:00'
  }
];

export default HealthFacilityCard;