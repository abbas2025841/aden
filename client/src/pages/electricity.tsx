import React from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import { Card } from "@/components/EnhancedUI";
import { ArrowLeft, MapPin, Clock, Star, Phone, Navigation } from "lucide-react";

export default function Electricity() {
  const [, setLocation] = useLocation();

  const electricityServices = [
    {
      id: "outage-tracker",
      icon: "📊",
      title: "تتبع انقطاعات الكهرباء",
      description: "معلومات مباشرة من المواطنين",
      buttonText: "شوف الحالة",
      gradientClass: "bg-gradient-to-br from-red-100 via-pink-50 to-rose-100 dark:from-red-900/30 dark:via-pink-900/20 dark:to-rose-900/30",
      borderClass: "border-red-300 dark:border-red-600",
      titleClass: "text-red-900 dark:text-red-100",
      descriptionClass: "text-red-800 dark:text-red-200",
      buttonClass: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg",
    },
    {
      id: "charging-points",
      icon: "🔋",
      title: "نقاط الشحن الشمسي",
      description: "أماكن شحن قريبة",
      buttonText: "ابحث عن نقطة",
      gradientClass: "bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/30",
      borderClass: "border-amber-300 dark:border-amber-600",
      titleClass: "text-amber-900 dark:text-amber-100",
      descriptionClass: "text-amber-800 dark:text-amber-200",
      buttonClass: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg",
    },
    {
      id: "power-converters",
      icon: "⚡",
      title: "محولات الطاقة",
      description: "أسعار ومواصفات",
      buttonText: "شوف الأسعار",
      gradientClass: "bg-gradient-to-br from-blue-100 via-cyan-50 to-indigo-100 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-indigo-900/30",
      borderClass: "border-blue-300 dark:border-blue-600",
      titleClass: "text-blue-900 dark:text-blue-100",
      descriptionClass: "text-blue-800 dark:text-blue-200",
      buttonClass: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg",
    },
    {
      id: "electrician",
      icon: "🔧",
      title: "كهربائي سريع",
      description: "طلبات فورية",
      buttonText: "اطلب كهربائي",
      gradientClass: "bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/30",
      borderClass: "border-emerald-300 dark:border-emerald-600",
      titleClass: "text-emerald-900 dark:text-emerald-100",
      descriptionClass: "text-emerald-800 dark:text-emerald-200",
      buttonClass: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg",
    },
    {
      id: "calculator",
      icon: "📱",
      title: "حاسبة استهلاك الكهرباء",
      description: "كم تكفي البطارية؟",
      buttonText: "احسب الآن",
      gradientClass: "bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-fuchsia-900/30",
      borderClass: "border-violet-300 dark:border-violet-600",
      titleClass: "text-violet-900 dark:text-violet-100",
      descriptionClass: "text-violet-800 dark:text-violet-200",
      buttonClass: "bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg",
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    switch (serviceId) {
      case "outage-tracker":
        setLocation("/electricity/outage-tracker");
        break;
      case "charging-points":
        setLocation("/electricity/charging-points");
        break;
      case "power-converters":
        setLocation("/electricity/power-converters");
        break;
      case "electrician":
        setLocation("/electricity/electrician");
        break;
      case "calculator":
        setLocation("/electricity/calculator");
        break;
      default:
        console.log("Service clicked:", serviceId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 page-transition">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-4 max-w-md safe-area-bottom">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5 ml-2" />
              الرجوع
            </button>
            <div className="flex items-center">
              <span className="text-2xl ml-2">⚡</span>
              <h1 className="text-xl font-bold text-gray-900">كهرباء</h1>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            الرئيسية &gt; كهرباء
          </div>
          
        </div>


        {/* Services Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6 text-center tracking-wide">خدمات الكهرباء</h2>
          <div className="grid grid-cols-2 gap-4">
            {electricityServices.map((service) => (
              <div
                key={service.id}
                className={`service-card ${service.gradientClass} rounded-xl p-4 border-2 ${service.borderClass} cursor-pointer hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 transform backdrop-blur-sm`}
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3 flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className={`font-bold ${service.titleClass} mb-2 text-sm`}>
                    {service.title}
                  </h3>
                  <p className={`${service.descriptionClass} mb-3 text-xs leading-relaxed`}>
                    {service.description}
                  </p>
                  <button
                    className={`w-full ${service.buttonClass} text-white text-xs font-semibold rounded-lg py-2 transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 transform`}
                  >
                    {service.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}

// إضافة CSS للخلفيات المتدرجة
const styles = `
  .charging-gradient {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  }
  .converter-gradient {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  }
  .electrician-gradient {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  }
  .calculator-gradient {
    background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  }
`;

// إضافة الستايل إلى الصفحة
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}