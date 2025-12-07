import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Heart, 
  Zap, 
  MapPin, 
  Phone, 
  Mail,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// أنواع البيانات للبطاقة
export interface UserServiceCardProps {
  type: 'user' | 'service' | 'notification' | 'statistic';
  title: string;
  description: string;
  status?: 'active' | 'inactive' | 'pending' | 'completed';
  icon?: React.ReactNode;
  avatar?: string;
  badge?: string;
  badgeColor?: 'default' | 'secondary' | 'destructive' | 'outline';
  actionText?: string;
  onAction?: () => void;
  className?: string;
  showStatus?: boolean;
  metadata?: {
    location?: string;
    phone?: string;
    email?: string;
    rating?: number;
    lastUpdate?: string;
  };
}

// مكون البطاقة الرئيسي
const UserServiceCard: React.FC<UserServiceCardProps> = ({
  type,
  title,
  description,
  status = 'active',
  icon,
  avatar,
  badge,
  badgeColor = 'default',
  actionText = 'عرض',
  onAction,
  className = '',
  showStatus = true,
  metadata
}) => {
  // تحديد الأيقونة الافتراضية حسب النوع
  const getDefaultIcon = () => {
    switch (type) {
      case 'user':
        return <User className="w-6 h-6" />;
      case 'service':
        return <Settings className="w-6 h-6" />;
      case 'notification':
        return <AlertCircle className="w-6 h-6" />;
      case 'statistic':
        return <Star className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  // تحديد لون الحالة
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // تحديد نص الحالة
  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'inactive':
        return 'غير نشط';
      case 'pending':
        return 'في الانتظار';
      case 'completed':
        return 'مكتمل';
      default:
        return 'غير محدد';
    }
  };

  return (
    <Card className={`
      max-w-[360px] w-full
      bg-white dark:bg-gray-800
      border border-gray-200 dark:border-gray-700
      rounded-2xl
      shadow-lg hover:shadow-xl
      transition-all duration-300 ease-in-out
      hover:scale-[1.02]
      overflow-hidden
      ${className}
    `}>
      <CardContent className="p-6">
        {/* الرأس - الأيقونة والصورة */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* الصورة الرمزية أو الأيقونة */}
            <div className="relative">
              {avatar ? (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                  <img 
                    src={avatar} 
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold text-lg">
                    {title.charAt(0)}
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white">
                  {icon || getDefaultIcon()}
                </div>
              )}
              
              {/* مؤشر الحالة */}
              {showStatus && (
                <div className={`
                  absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                  ${getStatusColor()}
                `}>
                  <div className={`
                    w-full h-full rounded-full
                    ${status === 'active' ? 'bg-green-500' : 
                      status === 'inactive' ? 'bg-gray-400' : 
                      status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'}
                  `} />
                </div>
              )}
            </div>

            {/* العنوان والحالة */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              {showStatus && (
                <div className="flex items-center mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-1 ${getStatusColor()}`}
                  >
                    {getStatusText()}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* الشارة */}
          {badge && (
            <Badge variant={badgeColor} className="text-xs">
              {badge}
            </Badge>
          )}
        </div>

        {/* الوصف */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* البيانات الإضافية */}
        {metadata && (
          <div className="space-y-2 mb-4">
            {metadata.location && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <MapPin className="w-3 h-3 ml-2" />
                <span className="truncate">{metadata.location}</span>
              </div>
            )}
            
            {metadata.phone && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Phone className="w-3 h-3 ml-2" />
                <span>{metadata.phone}</span>
              </div>
            )}
            
            {metadata.email && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Mail className="w-3 h-3 ml-2" />
                <span className="truncate">{metadata.email}</span>
              </div>
            )}
            
            {metadata.rating && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Star className="w-3 h-3 ml-2 fill-yellow-400 text-yellow-400" />
                <span>{metadata.rating}/5</span>
              </div>
            )}
            
            {metadata.lastUpdate && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3 ml-2" />
                <span>{metadata.lastUpdate}</span>
              </div>
            )}
          </div>
        )}

        {/* زر الإجراء */}
        <Button
          onClick={onAction}
          className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white border-0 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 flex items-center justify-center group"
        >
          <span>{actionText}</span>
          <ChevronRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </CardContent>
    </Card>
  );
};

// مكونات مساعدة للاستخدام السريع
export const UserCard: React.FC<Omit<UserServiceCardProps, 'type'>> = (props) => (
  <UserServiceCard {...props} type="user" />
);

export const ServiceCard: React.FC<Omit<UserServiceCardProps, 'type'>> = (props) => (
  <UserServiceCard {...props} type="service" />
);

export const NotificationCard: React.FC<Omit<UserServiceCardProps, 'type'>> = (props) => (
  <UserServiceCard {...props} type="notification" />
);

export const StatisticCard: React.FC<Omit<UserServiceCardProps, 'type'>> = (props) => (
  <UserServiceCard {...props} type="statistic" />
);

export default UserServiceCard;
