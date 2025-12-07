import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  MapPin, 
  Phone, 
  Star,
  ArrowLeft,
  Clock,
  Shield,
  Battery
} from 'lucide-react';

const EmergencyPumpsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedPump, setSelectedPump] = useState<string | null>(null);

  const emergencyPumps = [
    {
      id: 'pump1',
      name: 'مضخة يدوية قوية',
      type: 'يدوية',
      capacity: '1000 لتر/ساعة',
      price: '15,000 ريال',
      rentPrice: '500 ريال/يوم',
      status: 'متوفر',
      statusColor: 'green',
      rating: 4,
      reviews: 45,
      location: 'كريتر',
      phone: '+967 123 456 789',
      features: ['قوية ومتينة', 'سهلة الاستخدام', 'لا تحتاج كهرباء'],
      warranty: 'ضمان سنتين',
      workingHours: 'تعمل 4 ساعات متواصلة',
      icon: '⚡'
    },
    {
      id: 'pump2',
      name: 'مضخة ببطارية 12V',
      type: 'كهربائية',
      capacity: '2000 لتر/ساعة',
      price: '25,000 ريال',
      rentPrice: '800 ريال/يوم',
      status: 'متوفر',
      statusColor: 'green',
      rating: 5,
      reviews: 78,
      location: 'المنصورة',
      phone: '+967 987 654 321',
      features: ['بطارية قوية', 'شحن سريع', 'مؤشر البطارية'],
      warranty: 'ضمان سنتين',
      workingHours: 'تعمل 6 ساعات متواصلة',
      icon: '⚡'
    },
    {
      id: 'pump3',
      name: 'مضخة شمسية',
      type: 'شمسية',
      capacity: '1500 لتر/ساعة',
      price: '35,000 ريال',
      rentPrice: '1000 ريال/يوم',
      status: 'متوفر',
      statusColor: 'green',
      rating: 5,
      reviews: 92,
      location: 'التواهي',
      phone: '+967 555 123 456',
      features: ['طاقة شمسية', 'صديقة للبيئة', 'تشغيل مستمر'],
      warranty: 'ضمان 3 سنوات',
      workingHours: 'تعمل طوال النهار',
      icon: '⚡'
    }
  ];

  const handleBuyPump = (pumpId: string) => {
    const pump = emergencyPumps.find(p => p.id === pumpId);
    alert(`تم إرسال طلب شراء ${pump?.name}`);
  };

  const handleRentPump = (pumpId: string) => {
    const pump = emergencyPumps.find(p => p.id === pumpId);
    alert(`تم إرسال طلب إيجار ${pump?.name}`);
  };

  const handleContact = (pumpId: string) => {
    const pump = emergencyPumps.find(p => p.id === pumpId);
    alert(`سيتم التواصل معك بخصوص ${pump?.name}`);
  };

  const getStatusColor = (statusColor: string) => {
    switch (statusColor) {
      case 'green': return 'bg-green-400';
      case 'orange': return 'bg-orange-400';
      case 'red': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/water')}
            className="p-2 text-sky-300 hover:bg-teal-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-xl font-bold text-white">مضخات مياه طوارئ</h1>
          </div>
        </div>

        {/* قائمة المضخات */}
        <div className="space-y-4">
          {emergencyPumps.map((pump) => (
            <div 
              key={pump.id} 
              className={`cursor-pointer transition-all rounded-xl p-4 border ${
                selectedPump === pump.id 
                  ? 'bg-teal-700 border-cyan-400 ring-2 ring-cyan-400' 
                  : 'bg-teal-800 bg-opacity-80 border-teal-600 hover:bg-teal-700'
              }`}
              onClick={() => setSelectedPump(pump.id)}
            >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{pump.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{pump.name}</h3>
                    <p className="text-sm text-sky-300">{pump.type} - {pump.capacity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${getStatusColor(pump.statusColor)} rounded-full`}></div>
                  <span className="text-green-400 text-sm font-medium">{pump.status}</span>
                </div>
              </div>

              {/* الميزات */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {pump.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* التفاصيل */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{pump.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{pump.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{pump.workingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{pump.warranty}</span>
                </div>
              </div>

              {/* التقييم */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < pump.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                  />
                ))}
                <span className="text-sm text-sky-300 ml-1">({pump.reviews})</span>
              </div>

              {/* الأسعار */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sky-300">سعر الشراء:</span>
                  <span className="text-2xl font-bold text-cyan-400">{pump.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sky-300">سعر الإيجار:</span>
                  <span className="text-lg font-semibold text-orange-400">{pump.rentPrice}</span>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContact(pump.id);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  تواصل
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRentPump(pump.id);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg py-2"
                >
                  أجر
                </Button>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyPump(pump.id);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2"
                >
                  اشتري
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* زر العودة */}
        <div className="mt-6">
          <Button 
            onClick={() => setLocation('/water')}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة لخدمات المياه
          </Button>
        </div>
      </main>
    </div>
  );
};

export default EmergencyPumpsPage;
