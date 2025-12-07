import React from 'react';
import { MapPin, Clock, Phone, Star, Heart, Stethoscope, Pill, Microscope, Eye, Globe, Mail, Users, Shield, AlertTriangle } from 'lucide-react';
import { type HealthFacility } from '@/data/aden-health-facilities';

interface HealthFacilityDetailCardProps {
  facility: HealthFacility;
  onClose?: () => void;
}

const HealthFacilityDetailCard: React.FC<HealthFacilityDetailCardProps> = ({ 
  facility, 
  onClose 
}) => {
  // الحصول على أيقونة النوع
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Stethoscope className="w-6 h-6" />;
      case 'clinic': return <Heart className="w-6 h-6" />;
      case 'pharmacy': return <Pill className="w-6 h-6" />;
      case 'laboratory': return <Microscope className="w-6 h-6" />;
      case 'dental': return <Stethoscope className="w-6 h-6" />;
      case 'specialized': return <Eye className="w-6 h-6" />;
      default: return <Stethoscope className="w-6 h-6" />;
    }
  };

  // الحصول على لون النوع
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'clinic': return 'bg-green-100 text-green-800 border-green-200';
      case 'pharmacy': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'laboratory': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dental': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'specialized': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على لون الفئة
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'public': return 'bg-green-100 text-green-800 border-green-200';
      case 'private': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'charity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // الحصول على نص النوع بالعربية
  const getTypeText = (type: string) => {
    switch (type) {
      case 'hospital': return 'مستشفى';
      case 'clinic': return 'عيادة';
      case 'pharmacy': return 'صيدلية';
      case 'laboratory': return 'مختبر';
      case 'dental': return 'عيادة أسنان';
      case 'specialized': return 'مرفق متخصص';
      default: return type;
    }
  };

  // الحصول على نص الفئة بالعربية
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'public': return 'حكومي';
      case 'private': return 'خاص';
      case 'charity': return 'خيري';
      default: return category;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{facility.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{facility.name}</h2>
                <p className="text-gray-600">{facility.nameEn}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type and Category */}
          <div className="flex flex-wrap gap-2">
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(facility.type)}`}>
              {getTypeIcon(facility.type)}
              {getTypeText(facility.type)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(facility.category)}`}>
              {getCategoryText(facility.category)}
            </span>
            {facility.rating && (
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                <Star className="w-4 h-4 fill-current" />
                {facility.rating.toFixed(1)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
            <p className="text-gray-700 leading-relaxed">{facility.description}</p>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">العنوان</h3>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700">{facility.address}</p>
                <p className="text-sm text-gray-500 mt-1">المنطقة: {facility.district}</p>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ساعات العمل</h3>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{facility.workingHours}</span>
            </div>
          </div>

          {/* Contact Information */}
          {facility.contact && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">معلومات التواصل</h3>
              <div className="space-y-2">
                {facility.contact.phone && facility.contact.phone.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {facility.contact.phone.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {facility.contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a
                      href={`mailto:${facility.contact.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {facility.contact.email}
                    </a>
                  </div>
                )}
                {facility.contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={`https://${facility.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {facility.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emergency Numbers */}
          {facility.emergencyNumber && facility.emergencyNumber.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">أرقام الطوارئ</h3>
              <div className="flex flex-wrap gap-2">
                {facility.emergencyNumber.map((number, index) => (
                  <a
                    key={index}
                    href={`tel:${number}`}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {number}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Specialties */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">التخصصات</h3>
            <div className="flex flex-wrap gap-2">
              {facility.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">الخدمات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {facility.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {facility.features && facility.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">المميزات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {facility.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">التوفر</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${facility.availability.emergency ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">طوارئ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${facility.availability.appointments ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">مواعيد</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${facility.availability.walkIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-gray-700">زيارة مباشرة</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">الموقع الجغرافي</h3>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">الإحداثيات:</p>
              <p className="font-mono text-sm">
                خط العرض: {facility.position[0]}<br />
                خط الطول: {facility.position[1]}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
              عرض على الخريطة
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
              الاتصال الآن
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إغلاق
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthFacilityDetailCard;
