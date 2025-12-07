import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  User, 
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Heart,
  Activity,
  Shield,
  Zap,
  Eye,
  Building2,
  Navigation
} from 'lucide-react';
import { HealthFacility } from '@/data/aden-health-facilities';

interface Appointment {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityNameEn: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  patientName: string;
  patientPhone: string;
  notes?: string;
  createdAt: string;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment;
  facility?: HealthFacility;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed': return 'bg-green-900/50 text-green-300 border-green-700';
    case 'scheduled': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
    case 'completed': return 'bg-blue-900/50 text-blue-300 border-blue-700';
    case 'cancelled': return 'bg-red-900/50 text-red-300 border-red-700';
    default: return 'bg-gray-900/50 text-gray-300 border-gray-700';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'confirmed': return 'مؤكد';
    case 'scheduled': return 'مجدول';
    case 'completed': return 'مكتمل';
    case 'cancelled': return 'ملغي';
    default: return 'غير محدد';
  }
};

const getSpecialtyIcon = (specialty: string) => {
  switch (specialty) {
    case 'طوارئ': return <Zap className="w-5 h-5 text-red-500" />;
    case 'أطفال': return <Heart className="w-5 h-5 text-pink-500" />;
    case 'نساء وولادة': return <Heart className="w-5 h-5 text-purple-500" />;
    case 'أمراض القلب': return <Heart className="w-5 h-5 text-red-500" />;
    case 'طب وجراحة العيون': return <Eye className="w-5 h-5 text-blue-500" />;
    default: return <Stethoscope className="w-5 h-5 text-green-500" />;
  }
};

export default function AppointmentDetailsModal({ 
  appointment, 
  facility, 
  open, 
  onOpenChange 
}: AppointmentDetailsModalProps) {
  const isToday = new Date(appointment.date).toDateString() === new Date().toDateString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl flex-shrink-0">
              {getSpecialtyIcon(appointment.specialty)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white text-right">
                {appointment.facilityName}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-300 mt-1 text-right">
                {appointment.specialty}
              </DialogDescription>
              
              {/* الحالة والتاريخ */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className={`${getStatusColor(appointment.status)} px-3 py-1 text-sm font-medium`}>
                  {appointment.status === 'scheduled' && <Clock className="w-4 h-4 ml-1" />}
                  {appointment.status === 'confirmed' && <CheckCircle className="w-4 h-4 ml-1" />}
                  {appointment.status === 'completed' && <Activity className="w-4 h-4 ml-1" />}
                  {appointment.status === 'cancelled' && <XCircle className="w-4 h-4 ml-1" />}
                  {getStatusText(appointment.status)}
                </Badge>
                {isToday && (
                  <Badge className="bg-blue-900/80 text-blue-300 border-blue-700 px-3 py-1 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    اليوم
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات الموعد الأساسية */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              معلومات الموعد
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{appointment.patientName}</p>
                  <p className="text-gray-400 text-sm">اسم المريض</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{appointment.patientPhone}</p>
                  <p className="text-gray-400 text-sm">رقم الهاتف</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{appointment.date}</p>
                  <p className="text-gray-400 text-sm">التاريخ</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                <Clock className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{appointment.time}</p>
                  <p className="text-gray-400 text-sm">الوقت</p>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات المرفق الصحي */}
          {facility && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-400" />
                معلومات المرفق الصحي
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{facility.district}</p>
                    <p className="text-gray-400 text-sm">المنطقة</p>
                  </div>
                </div>
                
                {facility.rating && (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{facility.rating}/5</p>
                      <p className="text-gray-400 text-sm">التقييم</p>
                    </div>
                  </div>
                )}
                
                {facility.type && (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Shield className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{facility.type}</p>
                      <p className="text-gray-400 text-sm">نوع المرفق</p>
                    </div>
                  </div>
                )}
                
                {(facility as any).phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                    <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{(facility as any).phone}</p>
                      <p className="text-gray-400 text-sm">هاتف المرفق</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* الملاحظات */}
          {appointment.notes && (
            <div className="bg-gradient-to-r from-blue-900/50 to-green-900/50 rounded-xl p-4 border border-blue-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                ملاحظات إضافية
              </h3>
              <p className="text-gray-300 leading-relaxed">{appointment.notes}</p>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Phone className="w-4 h-4 ml-2" />
              الاتصال بالمريض
            </Button>
            
            {facility && (
              <Button 
                variant="outline"
                className="flex-1 border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
              >
                <Navigation className="w-4 h-4 ml-2" />
                عرض الموقع على الخريطة
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
