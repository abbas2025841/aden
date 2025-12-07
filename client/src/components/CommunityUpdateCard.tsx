import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Zap, 
  Droplets, 
  Wifi, 
  TrendingUp,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CommunityUpdateCardProps {
  className?: string;
  defaultServiceType?: 'electricity' | 'water' | 'internet';
  showServiceSelection?: boolean;
  showRecentReports?: boolean;
  maxRecentReports?: number;
}

interface ServiceReport {
  id: string;
  service: 'electricity' | 'water' | 'internet';
  area: string;
  status: 'working' | 'interrupted' | 'maintenance';
  time: string;
  reporter: string;
}

const CommunityUpdateCard: React.FC<CommunityUpdateCardProps> = ({
  className = "",
  defaultServiceType = 'electricity',
  showServiceSelection = true,
  showRecentReports = true,
  maxRecentReports = 5
}) => {
  const [selectedService, setSelectedService] = useState(defaultServiceType);
  const [showReports, setShowReports] = useState(false);

  const services = [
    {
      id: 'electricity',
      name: 'الكهرباء',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      status: 'working'
    },
    {
      id: 'water',
      name: 'الماء',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      status: 'interrupted'
    },
    {
      id: 'internet',
      name: 'الإنترنت',
      icon: Wifi,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      status: 'working'
    }
  ];

  const recentReports: ServiceReport[] = [
    {
      id: '1',
      service: 'electricity',
      area: 'المنصورة',
      status: 'working',
      time: 'منذ 10 دقائق',
      reporter: 'أحمد محمد'
    },
    {
      id: '2',
      service: 'water',
      area: 'كريتر',
      status: 'interrupted',
      time: 'منذ 30 دقيقة',
      reporter: 'فاطمة علي'
    },
    {
      id: '3',
      service: 'internet',
      area: 'التواهي',
      status: 'maintenance',
      time: 'منذ ساعة',
      reporter: 'محمد سالم'
    },
    {
      id: '4',
      service: 'electricity',
      area: 'الشيخ عثمان',
      status: 'working',
      time: 'منذ ساعتين',
      reporter: 'عائشة أحمد'
    },
    {
      id: '5',
      service: 'water',
      area: 'المنصورة',
      status: 'working',
      time: 'منذ 3 ساعات',
      reporter: 'يوسف حسن'
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'working':
        return 'يعمل';
      case 'interrupted':
        return 'منقطع';
      case 'maintenance':
        return 'صيانة';
      default:
        return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'text-green-600 bg-green-100';
      case 'interrupted':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const currentService = services.find(s => s.id === selectedService);
  const serviceReports = recentReports.filter(r => r.service === selectedService);

  return (
    <Card className={`mb-4 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 ml-2 text-blue-500" />
          تحديثات المجتمع
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* اختيار الخدمة */}
        {showServiceSelection && (
          <div className="mb-4">
            <div className="flex space-x-2 rtl:space-x-reverse">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <Button
                    key={service.id}
                    variant={selectedService === service.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedService(service.id as any)}
                    className="flex-1"
                  >
                    <IconComponent className="w-4 h-4 ml-1" />
                    {service.name}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* حالة الخدمة الحالية */}
        {currentService && (
          <div className={`p-4 rounded-lg ${currentService.bgColor} mb-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <currentService.icon className={`w-6 h-6 ${currentService.color} ml-2`} />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {currentService.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    آخر تحديث: منذ 5 دقائق
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentService.status)}`}>
                {getStatusText(currentService.status)}
              </div>
            </div>
          </div>
        )}

        {/* التقارير الأخيرة */}
        {showRecentReports && serviceReports.length > 0 && (
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto"
              onClick={() => setShowReports(!showReports)}
            >
              <span className="text-sm font-medium">
                التقارير الأخيرة ({serviceReports.length})
              </span>
              {showReports ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {showReports && (
              <div className="mt-3 space-y-2">
                {serviceReports.slice(0, maxRecentReports).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 ml-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {report.area}
                        </p>
                        <p className="text-xs text-gray-500">
                          بواسطة {report.reporter}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 ml-1" />
                        {report.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* إحصائيات سريعة */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">
                {recentReports.filter(r => r.status === 'working').length}
              </div>
              <div className="text-xs text-gray-500">يعمل</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">
                {recentReports.filter(r => r.status === 'interrupted').length}
              </div>
              <div className="text-xs text-gray-500">منقطع</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">
                {recentReports.filter(r => r.status === 'maintenance').length}
              </div>
              <div className="text-xs text-gray-500">صيانة</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityUpdateCard;