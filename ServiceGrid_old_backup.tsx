import { Card } from "@/components/EnhancedUI";

export default function ServiceGrid() {
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
      id: "maps",
      icon: "🗺️",
      title: "خرائط",
      description: "خريطة تفاعلية لعدن والمناطق",
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
      id: "adeni-assistant",
      icon: "🤖",
      title: "عدني - المساعد الذكي",
      description: "مساعدك الذكي لجميع الخدمات في عدن",
      status: "متاح 24/7",
      statusType: "available" as const,
      buttonText: "تحدث مع عدني",
      gradientClass: "assistant-gradient",
      borderClass: "border-purple-200",
      titleClass: "text-purple-900",
      descriptionClass: "text-purple-800",
      buttonClass: "bg-purple-600 hover:bg-purple-700",
      action: "openAdeniAssistant",
    },
  ];

  const handleServiceAction = (action: string, serviceId: string) => {
    console.log(`Service action triggered: ${action}`);
    if (serviceId === "water") {
      window.location.href = "/water";
    } else if (serviceId === "electricity") {
      window.location.href = "/electricity";
    } else if (serviceId === "health") {
      window.location.href = "/health";
    } else if (serviceId === "education") {
      window.location.href = "/education";
    } else if (serviceId === "jobs") {
      window.location.href = "/jobs";
    } else if (serviceId === "maps") {
      window.location.href = "/maps";
    } else if (serviceId === "adeni-assistant") {
      window.location.href = "/adeni-assistant";
    } else if (serviceId === "currency-rates") {
      window.location.href = "/currency-rates";
    } else if (serviceId === "assistant-admin") {
      window.location.href = "/assistant-admin";
    } else if (action === "openAssistantAdmin") {
      window.location.href = "/assistant-admin";
    } else {
      // TODO: Implement other service actions
    }
  };

  return (
    <div className="mb-8">
      {/* الشبكة التقليدية للخدمات */}
      <section
        className="grid grid-cols-2 gap-4"
        data-testid="grid-services"
      >
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${service.gradientClass} rounded-xl p-4 border ${service.borderClass}`}
            data-testid={`card-service-${service.id}`}
          >
            <div className="text-center">
              <div
                className="text-4xl mb-4 flex justify-center"
                data-testid={`icon-${service.id}`}
              >
                {typeof service.icon === "string" ? (
                  service.icon
                ) : (
                  <service.icon className="w-8 h-8" />
                )}
              </div>
              <h3
                className={`typography-body font-bold ${service.titleClass} mb-3`}
                data-testid={`title-${service.id}`}
              >
                {service.title}
              </h3>
              <div
                className={`status-indicator mb-4 ${
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
                <span>{service.status}</span>
              </div>
              <p
                className={`typography-small ${service.descriptionClass} mb-4 leading-relaxed`}
                data-testid={`description-${service.id}`}
              >
                {service.description}
              </p>
              
              
              <button
                className={`w-full touch-target ${service.buttonClass} text-white typography-caption font-semibold rounded-xl transition-all hover:shadow-lg active:scale-95`}
                onClick={() => handleServiceAction(service.action, service.id)}
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