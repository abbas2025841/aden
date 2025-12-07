import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  MapPin, 
  Heart, 
  Briefcase, 
  Zap, 
  Droplets,
  Wifi,
  Car,
  ShoppingCart,
  Calendar
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      id: 'emergency',
      title: 'الطوارئ',
      icon: Phone,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'أرقام الطوارئ'
    },
    {
      id: 'maps',
      title: 'الخرائط',
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'خرائط عدن'
    },
    {
      id: 'health',
      title: 'الصحة',
      icon: Heart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'المرافق الصحية'
    },
    {
      id: 'jobs',
      title: 'الوظائف',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'فرص العمل'
    },
    {
      id: 'electricity',
      title: 'الكهرباء',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'تقرير انقطاع الكهرباء'
    },
    {
      id: 'water',
      title: 'الماء',
      icon: Droplets,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'تقرير انقطاع الماء'
    },
    {
      id: 'internet',
      title: 'الإنترنت',
      icon: Wifi,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'تقرير انقطاع الإنترنت'
    },
    {
      id: 'transport',
      title: 'المواصلات',
      icon: Car,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'خدمات النقل'
    },
    {
      id: 'shopping',
      title: 'التسوق',
      icon: ShoppingCart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'المتاجر والأسواق'
    },
    {
      id: 'events',
      title: 'الفعاليات',
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: 'الأحداث والفعاليات'
    }
  ];

  const handleActionClick = (actionId: string) => {
    // يمكن إضافة منطق التنقل هنا
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          الإجراءات السريعة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                className={`h-auto p-3 flex flex-col items-center space-y-2 ${action.bgColor} hover:shadow-md transition-all duration-200`}
                onClick={() => handleActionClick(action.id)}
              >
                <IconComponent className={`w-6 h-6 ${action.color}`} />
                <div className="text-center">
                  <div className={`text-sm font-medium ${action.color}`}>
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
