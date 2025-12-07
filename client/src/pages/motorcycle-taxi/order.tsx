import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { 
  MapPin, 
  Phone, 
  Star, 
  Bike,
  Eye,
  X,
  Award,
  Shield
} from 'lucide-react';

// واجهة بيانات السائق من صفحة التقديم
interface DriverData {
  id: number;
  fullName: string;
  phoneNumber: string;
  district: string;
  vehicleType: string;
  plateNumber: string;
  manufactureYear: string;
  vehicleCondition: string;
  hasLicense: boolean;
  experienceYears: string;
  knowsAdenStreets: boolean;
  personalPhoto?: string;
  vehiclePhotos?: string[];
  rating?: number;
  distance?: number;
  estimatedPrice?: number;
  isAvailable?: boolean;
}

// بيانات تجريبية للسائقين (سيتم استبدالها ببيانات من قاعدة البيانات)
const mockDrivers: DriverData[] = [
  {
    id: 1,
    fullName: "أحمد محمد",
    phoneNumber: "770000001",
    district: "صيرة",
    vehicleType: "باص صغير",
    plateNumber: "عدن 1234",
    manufactureYear: "2020",
    vehicleCondition: "ممتاز",
    hasLicense: true,
    experienceYears: "3",
    knowsAdenStreets: true,
    rating: 4.8,
    distance: 0.5,
    estimatedPrice: 500,
    isAvailable: true,
    vehiclePhotos: [
      "🚐",
      "🚌"
    ]
  },
  {
    id: 2,
    fullName: "محمد علي",
    phoneNumber: "770000002",
    district: "الشيخ عثمان",
    vehicleType: "سيكل",
    plateNumber: "عدن 5678",
    manufactureYear: "2019",
    vehicleCondition: "جيد",
    hasLicense: true,
    experienceYears: "2",
    knowsAdenStreets: true,
    rating: 4.6,
    distance: 0.8,
    estimatedPrice: 400,
    isAvailable: true,
    vehiclePhotos: [
      "🚲",
      "🚴"
    ]
  },
  {
    id: 3,
    fullName: "عبدالله حسن",
    phoneNumber: "770000003",
    district: "المنصورة",
    vehicleType: "باص صغير",
    plateNumber: "عدن 9012",
    manufactureYear: "2021",
    vehicleCondition: "ممتاز",
    hasLicense: true,
    experienceYears: "5",
    knowsAdenStreets: true,
    rating: 4.9,
    distance: 1.2,
    estimatedPrice: 600,
    isAvailable: true,
    vehiclePhotos: [
      "🚐",
      "🚌",
      "🚐"
    ]
  },
  {
    id: 4,
    fullName: "يوسف أحمد",
    phoneNumber: "770000004",
    district: "التواهي",
    vehicleType: "سيكل",
    plateNumber: "عدن 3456",
    manufactureYear: "2018",
    vehicleCondition: "جيد",
    hasLicense: true,
    experienceYears: "4",
    knowsAdenStreets: true,
    rating: 4.7,
    distance: 1.5,
    estimatedPrice: 450,
    isAvailable: true,
    vehiclePhotos: [
      "🚲",
      "🚴"
    ]
  },
  {
    id: 5,
    fullName: "سالم محمد",
    phoneNumber: "770000005",
    district: "كريتر",
    vehicleType: "باص صغير",
    plateNumber: "عدن 7890",
    manufactureYear: "2022",
    vehicleCondition: "ممتاز",
    hasLicense: true,
    experienceYears: "1",
    knowsAdenStreets: false,
    rating: 4.5,
    distance: 2.0,
    estimatedPrice: 700,
    isAvailable: true,
    vehiclePhotos: [
      "🚐",
      "🚌"
    ]
  }
];


export default function OrderTaxiPage() {
  const [, setLocation] = useLocation();
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState<DriverData | null>(null);

  // فرز السائقين حسب المسافة
  const sortedDrivers = [...mockDrivers].sort((a, b) => a.distance - b.distance);


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <AppHeader />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">🚐</span>
                </div>
              <div className="text-center">
                <h1 className="text-lg font-bold text-white">اطلب باص صغير أو سيكل</h1>
                <p className="text-orange-400 text-sm">اختر السائق المناسب لك</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* Available Drivers */}
          <div className="bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bike className="w-5 h-5 text-blue-600" />
              السائقون المتاحون (مرتبون حسب القرب)
            </h2>
            
            <div className="space-y-4">
              {sortedDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="bg-gray-800/90 rounded-lg p-4 border-2 border-gray-600 hover:border-blue-400 transition-all"
                >
                  <div className="space-y-4">
                    {/* معلومات السائق */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-2xl">
                        👤
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{driver.fullName}</h3>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-1">
                            {renderStars(driver.rating || 0)}
                          </div>
                          <span className="text-sm text-gray-300">({driver.rating})</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {driver.distance} كم
                          </span>
                          <span className="flex items-center gap-1">
                            {driver.vehicleType === "سيكل" ? <Bike className="w-3 h-3" /> : <span className="text-xs">🚐</span>}
                            {driver.vehicleType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {driver.phoneNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <span>خبرة: {driver.experienceYears} سنوات</span>
                          <span>رقم اللوحة: {driver.plateNumber}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            driver.knowsAdenStreets ? 'bg-green-600 text-green-100' : 'bg-yellow-600 text-yellow-100'
                          }`}>
                            {driver.knowsAdenStreets ? 'يعرف الشوارع' : 'جديد'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* السعر والأزرار */}
                    <div className="flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-lg font-bold text-orange-400">{driver.estimatedPrice} ريال</p>
                        <p className="text-sm text-gray-300">السعر التقديري</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedDriverForDetails(driver)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          التفاصيل
                        </button>
                      <button
                          onClick={() => window.open(`tel:${driver.phoneNumber}`, '_self')}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          اتصل
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* نافذة تفاصيل السائق */}
      {selectedDriverForDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-600 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">تفاصيل السائق</h2>
              <button
                onClick={() => setSelectedDriverForDetails(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* معلومات السائق الشخصية */}
              <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-lg p-4 border border-blue-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  المعلومات الشخصية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">الاسم الكامل</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">رقم الهاتف</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">المنطقة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">سنوات الخبرة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.experienceYears} سنوات</p>
                  </div>
                </div>
              </div>

              {/* معلومات المركبة */}
              <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 rounded-lg p-4 border border-orange-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  {selectedDriverForDetails.vehicleType === "سيكل" ? <Bike className="w-5 h-5 text-orange-400" /> : <span className="text-lg">🚐</span>}
                  معلومات المركبة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">نوع المركبة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">رقم اللوحة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">سنة الصنع</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.manufactureYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">حالة المركبة</p>
                    <p className="font-semibold text-white">{selectedDriverForDetails.vehicleCondition}</p>
                  </div>
                </div>
              </div>

              {/* صور المركبة */}
              {selectedDriverForDetails.vehiclePhotos && selectedDriverForDetails.vehiclePhotos.length > 0 && (
                <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-lg p-4 border border-green-700/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-400" />
                    صور المركبة
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedDriverForDetails.vehiclePhotos.map((photo, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 text-center border border-gray-600">
                        <div className="text-4xl mb-2">{photo}</div>
                        <p className="text-sm text-gray-300">صورة {index + 1}</p>
                      </div>
                    ))}
                  </div>
            </div>
          )}

              {/* المؤهلات والتراخيص */}
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  المؤهلات والتراخيص
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedDriverForDetails.hasLicense ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-white">
                      {selectedDriverForDetails.hasLicense ? 'لديه رخصة قيادة سارية' : 'لا يملك رخصة قيادة'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${selectedDriverForDetails.knowsAdenStreets ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-white">
                      {selectedDriverForDetails.knowsAdenStreets ? 'يعرف شوارع عدن جيداً' : 'جديد في عدن'}
                    </span>
                  </div>
                </div>
              </div>

              {/* التقييم والسعر */}
              <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-lg p-4 border border-yellow-700/30">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  التقييم والسعر
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">التقييم</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(selectedDriverForDetails.rating || 0)}
                      </div>
                      <span className="font-semibold text-white">({selectedDriverForDetails.rating})</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">السعر التقديري</p>
                    <p className="text-2xl font-bold text-orange-400">{selectedDriverForDetails.estimatedPrice} ريال</p>
                  </div>
        </div>
      </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => window.open(`tel:${selectedDriverForDetails.phoneNumber}`, '_self')}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  اتصل بالسائق
                </button>
                <button
                  onClick={() => setSelectedDriverForDetails(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AppFooter />
    </div>
  );
}
