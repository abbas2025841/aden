import React from "react";
import { Card } from "@/components/EnhancedUI";
import { useState } from "react";
import { useLocation } from "wouter";

export default function ServiceGrid() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const services = [
    {
      id: "water",
      icon: "💧",
      title: "ماء",
      description: "صهاريج وخزانات ونقاط مياه",
      status: "صهاريج متوفرة",
      statusType: "available" as const,
      buttonText: "أطلب صهريج",
      gradientClass: "water-gradient",
      borderClass: "border-sky-200",
      titleClass: "text-sky-900",
      descriptionClass: "text-sky-800",
      buttonClass: "bg-sky-600 hover:bg-sky-700",
      action: "orderWaterTank",
    },
    {
      id: "electricity",
      icon: "⚡",
      title: "كهرباء",
      description: "حلول الطاقة والشحن والبطاريات",
      status: "انقطاع في كريتر",
      statusType: "warning" as const,
      buttonText: "نقاط شحن",
      gradientClass: "electricity-gradient",
      borderClass: "border-yellow-200",
      titleClass: "text-yellow-900",
      descriptionClass: "text-yellow-800",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700",
      action: "findChargingPoints",
    },
    {
      id: "health",
      icon: "🏥",
      title: "صحة",
      description: "صيدليات ومستشفيات وطوارئ",
      status: "طوارئ 24/7",
      statusType: "available" as const,
      buttonText: "أقرب صيدلية",
      gradientClass: "health-gradient",
      borderClass: "border-red-200",
      titleClass: "text-red-900",
      descriptionClass: "text-red-800",
      buttonClass: "bg-red-600 hover:bg-red-700",
      action: "findNearestPharmacy",
    },
    {
      id: "education",
      icon: "📚",
      title: "تعليم",
      description: "دروس ومناهج ومساعدة تعليمية",
      status: "دروس متاحة",
      statusType: "available" as const,
      buttonText: "ابدأ التعلم",
      gradientClass: "education-gradient",
      borderClass: "border-green-200",
      titleClass: "text-green-900",
      descriptionClass: "text-green-800",
      buttonClass: "bg-green-600 hover:bg-green-700",
      action: "startLearning",
    },
    {
      id: "jobs",
      icon: "💼",
      title: "وظائف",
      description: "فرص عمل ووظائف شاغرة في عدن",
      status: "20 وظيفة متاحة",
      statusType: "available" as const,
      buttonText: "ابحث عن وظيفة",
      gradientClass: "jobs-gradient",
      borderClass: "border-blue-200",
      titleClass: "text-blue-900",
      descriptionClass: "text-blue-800",
      buttonClass: "bg-blue-600 hover:bg-blue-700",
      action: "searchJobs",
    },
    {
      id: "motorcycle-taxi",
      icon: "🏍️",
      title: "دباب عدن",
      description: "تاكسي لكل عدن دباب / سيكل",
      status: "متاح الآن",
      statusType: "available" as const,
      buttonText: "اطلب تاكسي",
      gradientClass: "motorcycle-gradient",
      borderClass: "border-orange-200",
      titleClass: "text-orange-900",
      descriptionClass: "text-orange-800",
      buttonClass: "bg-orange-600 hover:bg-orange-700",
      action: "orderMotorcycleTaxi",
    },
    {
      id: "currency-rates",
      icon: "💰",
      title: "أسعار العملات",
      description: "أسعار الصرف اليومية في عدن",
      status: "محدث الآن",
      statusType: "available" as const,
      buttonText: "عرض الأسعار",
      gradientClass: "currency-gradient",
      borderClass: "border-yellow-200",
      titleClass: "text-yellow-900",
      descriptionClass: "text-yellow-800",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700",
      action: "viewCurrencyRates",
    },
    {
      id: "haraj-aden",
      icon: "🏪",
      title: "حراج عدن",
      description: "بيع وشراء الأجهزة والسلع المستعملة",
      status: "إعلانات جديدة",
      statusType: "available" as const,
      buttonText: "تصفح الحراج",
      gradientClass: "haraj-gradient",
      borderClass: "border-indigo-200",
      titleClass: "text-indigo-900",
      descriptionClass: "text-indigo-800",
      buttonClass: "bg-indigo-600 hover:bg-indigo-700",
      action: "openHarajAden",
    },
    {
      id: "flights",
      icon: "✈️",
      title: "الطيران والرحلات",
      description: "حجز تذاكر الطيران والرحلات الداخلية والخارجية",
      status: "رحلات متاحة",
      statusType: "available" as const,
      buttonText: "موعد الرحلات",
      gradientClass: "flights-gradient",
      borderClass: "border-sky-200",
      titleClass: "text-sky-900",
      descriptionClass: "text-sky-800",
      buttonClass: "bg-sky-600 hover:bg-sky-700",
      action: "bookFlight",
    },
    {
      id: "ideas",
      icon: "💡",
      title: "أفكار عدن",
      description: "مبادرات ومشاريع مجتمعية في عدن",
      status: "3 أفكار نشطة",
      statusType: "available" as const,
      buttonText: "عرض الأفكار",
      gradientClass: "ideas-gradient",
      borderClass: "border-yellow-200",
      titleClass: "text-yellow-900",
      descriptionClass: "text-yellow-800",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700",
      action: "openIdeas",
    },
    {
      id: "maps",
      icon: "🗺️",
      title: "خرائط عدن التفاعلية",
      description: "خريطة تفاعلية محدثة لعدن والمناطق السياحية",
      status: "خرائط محدثة",
      statusType: "available" as const,
      buttonText: "استكشف الخريطة",
      gradientClass: "maps-gradient",
      borderClass: "border-green-200",
      titleClass: "text-green-900",
      descriptionClass: "text-green-800",
      buttonClass: "bg-green-600 hover:bg-green-700",
      action: "exploreMaps",
    },
    {
      id: "development-services",
      icon: "🚧",
      title: "خدمات قيد التطوير",
      description: "اختر الخدمة التي تريد تطويرها أولاً",
      status: "5 خدمات جديدة",
      statusType: "warning" as const,
      buttonText: "صوت للخدمات",
      gradientClass: "development-gradient",
      borderClass: "border-yellow-200",
      titleClass: "text-yellow-900",
      descriptionClass: "text-yellow-800",
      buttonClass: "bg-yellow-600 hover:bg-yellow-700",
      action: "openDevelopmentServices",
    },
  ];

  const handleServiceAction = (action: string, serviceId: string) => {
    console.log(`Service action triggered: ${action}`);
    
    // إضافة تأثير النقر
    setHoveredCard(serviceId);
    setTimeout(() => setHoveredCard(null), 200);
    
    // التنقل السلس مع تأثيرات انتقالية
    const navigateToService = (url: string) => {
      // إضافة تأثير انتقالي قبل التنقل
      const currentCard = document.querySelector(`[data-testid="card-service-${serviceId}"]`);
      if (currentCard) {
        currentCard.classList.add('card-clicked', 'navigating');
        
        // إضافة تأثير موجة للبطاقة
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
          z-index: 10;
        `;
        currentCard.appendChild(ripple);
        
        // إضافة CSS للريبل
        if (!document.querySelector('#ripple-styles')) {
          const style = document.createElement('style');
          style.id = 'ripple-styles';
          style.textContent = `
            @keyframes ripple {
              to {
                width: 200px;
                height: 200px;
                opacity: 0;
              }
            }
          `;
          document.head.appendChild(style);
        }
        
        setTimeout(() => {
          setLocation(url); // استخدام React Router للتنقل السلس
        }, 200);
      } else {
        setLocation(url); // استخدام React Router للتنقل السلس
      }
    };

    if (serviceId === "water") {
      navigateToService("/water");
    } else if (serviceId === "electricity") {
      navigateToService("/electricity");
    } else if (serviceId === "health") {
      navigateToService("/health");
    } else if (serviceId === "education") {
      navigateToService("/education");
    } else if (serviceId === "jobs") {
      navigateToService("/jobs");
    } else if (serviceId === "maps") {
      navigateToService("/maps");
    } else if (serviceId === "flights") {
      navigateToService("/flights");
    } else if (serviceId === "adeni-assistant") {
      navigateToService("/adeni-assistant");
    } else if (serviceId === "currency-rates") {
      navigateToService("/currency-rates");
    } else if (serviceId === "motorcycle-taxi") {
      navigateToService("/motorcycle-taxi");
    } else if (serviceId === "ideas") {
      navigateToService("/ideas");
    } else if (serviceId === "haraj-aden") {
      navigateToService("/haraj-aden");
    } else if (serviceId === "development-services") {
      navigateToService("/development-services");
    } else if (serviceId === "assistant-admin") {
      navigateToService("/assistant-admin");
    } else if (action === "openAssistantAdmin") {
      navigateToService("/assistant-admin");
    } else {
      // TODO: Implement other service actions
    }
  };

  return (
    <div className="mb-8">
      {/* CSS لبطاقة الطيران والدباب والمطاعم والتبرعات وستار لينك */}
      <style>{`
        .flights-gradient {
          background: linear-gradient(135deg, hsl(200 100% 92%) 0%, hsl(200 100% 98%) 100%) !important;
          border-color: hsl(200 100% 85%) !important;
        }
        .motorcycle-gradient {
          background: linear-gradient(135deg, hsl(30 100% 92%) 0%, hsl(30 100% 98%) 100%) !important;
          border-color: hsl(30 100% 85%) !important;
        }
        .ideas-gradient {
          background: linear-gradient(135deg, hsl(45 100% 92%) 0%, hsl(45 100% 98%) 100%) !important;
          border-color: hsl(45 100% 85%) !important;
        }
        .development-gradient {
          background: linear-gradient(135deg, hsl(60 100% 92%) 0%, hsl(60 100% 98%) 100%) !important;
          border-color: hsl(60 100% 85%) !important;
        }
        .haraj-gradient {
          background: linear-gradient(135deg, hsl(250 100% 92%) 0%, hsl(250 100% 98%) 100%) !important;
          border-color: hsl(250 100% 85%) !important;
        }
        
        /* إضافة الخلفيات المتدرجة المفقودة */
        .assistant-gradient {
          background: linear-gradient(135deg, hsl(280 100% 92%) 0%, hsl(280 100% 98%) 100%) !important;
          border-color: hsl(280 100% 85%) !important;
        }
        
        .currency-gradient {
          background: linear-gradient(135deg, hsl(45 100% 92%) 0%, hsl(45 100% 98%) 100%) !important;
          border-color: hsl(45 100% 85%) !important;
        }
        
        /* إضافة تأثيرات إضافية للتأكد من التطبيق */
        .service-card {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer !important;
          position: relative !important;
          overflow: hidden !important;
        }
        
        /* أحجام مضغوطة للموبايل */
        @media (max-width: 768px) {
          .service-card {
            padding: 0.5rem !important; /* p-2 */
          }
          .service-card h3 {
            font-size: 0.75rem !important; /* text-xs */
            margin-bottom: 0.25rem !important;
          }
          .service-card p {
            font-size: 0.625rem !important; /* text-[10px] */
            line-height: 1.2 !important;
          }
          .service-card button {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.625rem !important;
          }
          .service-card .status-indicator {
            font-size: 0.625rem !important;
          }
        }
        
        /* خلفيات متدرجة للوضع الداكن - ألوان متوازنة */
        .dark .service-card.flights-gradient {
          background: linear-gradient(135deg, hsl(200 70% 25%) 0%, hsl(200 60% 35%) 100%) !important;
          border-color: hsl(200 60% 40%) !important;
        }
        
        .dark .service-card.motorcycle-gradient {
          background: linear-gradient(135deg, hsl(30 70% 25%) 0%, hsl(30 60% 35%) 100%) !important;
          border-color: hsl(30 60% 40%) !important;
        }
        
        .dark .service-card.ideas-gradient {
          background: linear-gradient(135deg, hsl(45 70% 25%) 0%, hsl(45 60% 35%) 100%) !important;
          border-color: hsl(45 60% 40%) !important;
        }
        
        .dark .service-card.development-gradient {
          background: linear-gradient(135deg, hsl(60 70% 25%) 0%, hsl(60 60% 35%) 100%) !important;
          border-color: hsl(60 60% 40%) !important;
        }
        
        .dark .service-card.haraj-gradient {
          background: linear-gradient(135deg, hsl(250 70% 25%) 0%, hsl(250 60% 35%) 100%) !important;
          border-color: hsl(250 60% 40%) !important;
        }
        
        .dark .service-card.assistant-gradient {
          background: linear-gradient(135deg, hsl(280 70% 25%) 0%, hsl(280 60% 35%) 100%) !important;
          border-color: hsl(280 60% 40%) !important;
        }
        
        .dark .service-card.currency-gradient {
          background: linear-gradient(135deg, hsl(45 70% 25%) 0%, hsl(45 60% 35%) 100%) !important;
          border-color: hsl(45 60% 40%) !important;
        }
        
        /* خلفيات داكنة للخدمات الأساسية */
        .dark .service-card.water-gradient {
          background: linear-gradient(135deg, hsl(200 70% 25%) 0%, hsl(200 60% 35%) 100%) !important;
          border-color: hsl(200 60% 40%) !important;
        }
        
        .dark .service-card.electricity-gradient {
          background: linear-gradient(135deg, hsl(45 70% 25%) 0%, hsl(45 60% 35%) 100%) !important;
          border-color: hsl(45 60% 40%) !important;
        }
        
        .dark .service-card.health-gradient {
          background: linear-gradient(135deg, hsl(0 70% 25%) 0%, hsl(0 60% 35%) 100%) !important;
          border-color: hsl(0 60% 40%) !important;
        }
        
        .dark .service-card.education-gradient {
          background: linear-gradient(135deg, hsl(120 70% 25%) 0%, hsl(120 60% 35%) 100%) !important;
          border-color: hsl(120 60% 40%) !important;
        }
        
        .dark .service-card.jobs-gradient {
          background: linear-gradient(135deg, hsl(240 70% 25%) 0%, hsl(240 60% 35%) 100%) !important;
          border-color: hsl(240 60% 40%) !important;
        }
        
        .dark .service-card.maps-gradient {
          background: linear-gradient(135deg, hsl(120 70% 25%) 0%, hsl(120 60% 35%) 100%) !important;
          border-color: hsl(120 60% 40%) !important;
        }
        
        /* خلفيات فاتحة للوضع النهاري */
        .service-card.flights-gradient {
          background: linear-gradient(135deg, hsl(200 100% 95%) 0%, hsl(200 100% 98%) 100%) !important;
          border-color: hsl(200 100% 85%) !important;
        }
        
        .service-card.motorcycle-gradient {
          background: linear-gradient(135deg, hsl(30 100% 95%) 0%, hsl(30 100% 98%) 100%) !important;
          border-color: hsl(30 100% 85%) !important;
        }
        
        .service-card.ideas-gradient {
          background: linear-gradient(135deg, hsl(45 100% 95%) 0%, hsl(45 100% 98%) 100%) !important;
          border-color: hsl(45 100% 85%) !important;
        }
        
        .service-card.development-gradient {
          background: linear-gradient(135deg, hsl(60 100% 95%) 0%, hsl(60 100% 98%) 100%) !important;
          border-color: hsl(60 100% 85%) !important;
        }
        
        .service-card.haraj-gradient {
          background: linear-gradient(135deg, hsl(250 100% 95%) 0%, hsl(250 100% 98%) 100%) !important;
          border-color: hsl(250 100% 85%) !important;
        }
        
        .service-card.assistant-gradient {
          background: linear-gradient(135deg, hsl(280 100% 95%) 0%, hsl(280 100% 98%) 100%) !important;
          border-color: hsl(280 100% 85%) !important;
        }
        
        .service-card.currency-gradient {
          background: linear-gradient(135deg, hsl(45 100% 95%) 0%, hsl(45 100% 98%) 100%) !important;
          border-color: hsl(45 100% 85%) !important;
        }
        
        .service-card.water-gradient {
          background: linear-gradient(135deg, hsl(200 100% 95%) 0%, hsl(200 100% 98%) 100%) !important;
          border-color: hsl(200 100% 85%) !important;
        }
        
        .service-card.electricity-gradient {
          background: linear-gradient(135deg, hsl(45 100% 95%) 0%, hsl(45 100% 98%) 100%) !important;
          border-color: hsl(45 100% 85%) !important;
        }
        
        .service-card.health-gradient {
          background: linear-gradient(135deg, hsl(0 100% 95%) 0%, hsl(0 100% 98%) 100%) !important;
          border-color: hsl(0 100% 85%) !important;
        }
        
        .service-card.education-gradient {
          background: linear-gradient(135deg, hsl(120 100% 95%) 0%, hsl(120 100% 98%) 100%) !important;
          border-color: hsl(120 100% 85%) !important;
        }
        
        .service-card.jobs-gradient {
          background: linear-gradient(135deg, hsl(240 100% 95%) 0%, hsl(240 100% 98%) 100%) !important;
          border-color: hsl(240 100% 85%) !important;
        }
        
        .service-card.maps-gradient {
          background: linear-gradient(135deg, hsl(120 100% 95%) 0%, hsl(120 100% 98%) 100%) !important;
          border-color: hsl(120 100% 85%) !important;
        }
        
        .service-card::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: -100% !important;
          width: 100% !important;
          height: 100% !important;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent) !important;
          transition: left 0.5s !important;
        }
        
        .service-card:hover {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.2) !important;
        }
        
        .service-card:hover::before {
          left: 100% !important;
        }
        
        .service-card:active {
          transform: translateY(-2px) scale(0.98) !important;
          transition: all 0.1s ease !important;
        }
        
        .card-clicked {
          transform: scale(0.95) !important;
          opacity: 0.8 !important;
          transition: all 0.15s ease !important;
        }
        
        /* تأثيرات التنقل السلس */
        .page-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .service-card {
          will-change: transform, box-shadow !important;
        }
        
        /* تأثيرات إضافية للتنقل */
        .service-card.navigating {
          transform: scale(0.95) !important;
          opacity: 0.7 !important;
          pointer-events: none !important;
        }
        
        .service-card .status-indicator {
          transition: all 0.3s ease !important;
        }
        
        .service-card:hover .status-indicator {
          transform: scale(1.1) !important;
        }
        
        .service-card .pulse-dot {
          animation: pulse 2s infinite !important;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .service-card button {
          transition: all 0.3s ease !important;
          position: relative !important;
          overflow: hidden !important;
        }
        
        .service-card button::before {
          content: '' !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          width: 0 !important;
          height: 0 !important;
          background: rgba(255,255,255,0.3) !important;
          border-radius: 50% !important;
          transform: translate(-50%, -50%) !important;
          transition: width 0.6s, height 0.6s !important;
        }
        
        .service-card button:hover::before {
          width: 300px !important;
          height: 300px !important;
        }
        
        .service-card button:active {
          transform: scale(0.95) !important;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      {/* الشبكة التقليدية للخدمات */}
      <section
        className="grid grid-cols-2 gap-2 sm:gap-3"
        data-testid="grid-services"
      >
      {services.map((service) => (
          <div
          key={service.id} 
            className={`ad-card service-card card-aden aden-hover ${service.gradientClass} rounded-xl p-3 sm:p-4 border ${service.borderClass} ${
              hoveredCard === service.id ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
            }`}
            data-testid={`card-service-${service.id}`}
            onMouseEnter={() => setHoveredCard(service.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleServiceAction(service.action, service.id)}
          >
            <div className="text-center">
              <div
                className="text-2xl sm:text-3xl mb-2 flex justify-center"
                data-testid={`icon-${service.id}`}
              >
                {typeof service.icon === "string" ? (
                  <span className="text-2xl sm:text-3xl">{service.icon}</span>
                ) : (
                  React.createElement(service.icon, { className: "w-8 h-8 sm:w-10 sm:h-10" })
                )}
            </div>
              <h3
                className={`text-sm sm:text-base font-bold ${service.titleClass} dark:text-white mb-2`}
                data-testid={`title-${service.id}`}
              >
              {service.title}
              </h3>
              <div
                className={`status-indicator mb-3 flex items-center gap-1 justify-center ${
                  service.statusType === "available"
                    ? "status-available"
                    : service.statusType === "warning"
                      ? "status-warning"
                      : "status-unavailable"
                }`}
                data-testid={`status-${service.id}`}
              >
                <span
                  className={`w-2 h-2 rounded-full pulse-dot ${
                    service.statusType === "available"
                      ? "bg-green-500"
                      : service.statusType === "warning"
                        ? "bg-orange-500"
                        : "bg-red-500"
                  }`}
                ></span>
                <span className="text-xs sm:text-sm dark:text-gray-200">{service.status}</span>
              </div>
              <p
                className={`text-xs sm:text-sm ${service.descriptionClass} dark:text-gray-300 mb-3 leading-tight line-clamp-2`}
                data-testid={`description-${service.id}`}
              >
              {service.description}
            </p>
              
              
              <button
                className={`w-full touch-target ${service.buttonClass} text-white text-xs sm:text-sm font-semibold rounded-lg transition-all hover:shadow-lg active:scale-95 relative z-10 py-2`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleServiceAction(service.action, service.id);
                }}
                data-testid={`button-${service.action}`}
              >
                {service.buttonText}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}