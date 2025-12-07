export default function ServiceGridSimple() {
  const services = [
    {
      id: "water",
      icon: "💧",
      title: "ماء",
      description: "صهاريج وخزانات ونقاط مياه",
      status: "صهاريج متوفرة",
      buttonText: "أطلب صهريج",
    },
    {
      id: "electricity",
      icon: "⚡",
      title: "كهرباء",
      description: "حلول الطاقة والشحن والبطاريات",
      status: "انقطاع في كريتر",
      buttonText: "نقاط شحن",
    },
    {
      id: "health",
      icon: "🏥",
      title: "صحة",
      description: "مستشفيات وعيادات وخدمات طبية",
      status: "خدمات متاحة",
      buttonText: "خدمات صحية",
    },
    {
      id: "education",
      icon: "🎓",
      title: "تعليم",
      description: "مدارس وجامعات وخدمات تعليمية",
      status: "تسجيل مفتوح",
      buttonText: "خدمات تعليمية",
    },
    {
      id: "jobs",
      icon: "💼",
      title: "وظائف",
      description: "وظائف شاغرة وفرص عمل في عدن",
      status: "وظائف متاحة",
      buttonText: "تصفح الوظائف",
    },
    {
      id: "maps",
      icon: "🗺️",
      title: "خرائط",
      description: "خرائط تفاعلية ومعالم عدن",
      status: "خرائط محدثة",
      buttonText: "استكشف عدن",
    },
    {
      id: "currency",
      icon: "💱",
      title: "أسعار العملات",
      description: "أسعار الصرف والعملات المحلية",
      status: "أسعار محدثة",
      buttonText: "عرض الأسعار",
    },
    {
      id: "flights",
      icon: "✈️",
      title: "الطيران والرحلات",
      description: "حجز تذاكر الطيران والرحلات الداخلية والخارجية",
      status: "رحلات متاحة",
      buttonText: "موعد الرحلات",
    },
    {
      id: "assistant",
      icon: "🤖",
      title: "المساعد الذكي",
      description: "مساعد ذكي لخدمات عدن",
      status: "متاح الآن",
      buttonText: "تحدث معي",
    },
    {
      id: "initiatives",
      icon: "🌟",
      title: "المبادرات",
      description: "مبادرات مجتمعية وتطوعية",
      status: "مبادرات نشطة",
      buttonText: "انضم إلينا",
    },
    {
      id: "motorcycle-taxi",
      icon: "🏍️",
      title: "دباب عدن",
      description: "تاكسي لكل عدن دباب / سيكل",
      status: "متاح الآن",
      buttonText: "اطلب تاكسي",
    },
  ];

  const handleServiceAction = (action: string, serviceId: string) => {
    
    switch (serviceId) {
      case "water":
        window.location.href = "/water";
        break;
      case "electricity":
        window.location.href = "/electricity";
        break;
      case "health":
        window.location.href = "/health";
        break;
      case "education":
        window.location.href = "/education";
        break;
      case "jobs":
        window.location.href = "/jobs";
        break;
      case "maps":
        window.location.href = "/maps";
        break;
      case "currency":
        window.location.href = "/currency-rates";
        break;
      case "flights":
        window.location.href = "/flights";
        break;
      case "assistant":
        window.location.href = "/assistant";
        break;
      case "initiatives":
        window.location.href = "/initiatives";
        break;
      case "motorcycle-taxi":
        window.location.href = "/motorcycle-taxi";
        break;
      default:
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        خدمات عدن لايف
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 flex justify-center">
                {service.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <div className="mb-4">
                <span className="text-sm text-gray-600">
                  {service.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>
              
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-4 transition-colors"
                onClick={() => handleServiceAction(service.buttonText, service.id)}
              >
                {service.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
