import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MapPin, Clock } from "lucide-react";

export default function EmergencyPage() {
  const emergencyNumbers = [
    {
      id: 1,
      service: "خط حماية المستهلك",
      number: "718747135",
      description: "للإبلاغ عن الممارسات غير السليمة بالأسعار",
      icon: "🛡️",
      color: "bg-blue-500",
      priority: "high"
    },
    {
      id: 2,
      service: "الخط الساخن - الوزارة",
      number: "245098",
      description: "للتواصل مع الوزارة والاستفسارات العامة",
      icon: "📞",
      color: "bg-blue-500",
      priority: "high"
    },
    {
      id: 3,
      service: "الإسعاف والطوارئ الطبية",
      number: "195",
      description: "الرقم المجاني الموحد - 24 ساعة يومياً",
      icon: "🚑",
      color: "bg-red-600",
      priority: "high"
    },
    {
      id: 4,
      service: "مركز الطوارئ والإسعاف عدن",
      number: "02358260",
      description: "خدمة الإسعاف المحلية",
      icon: "🏥",
      color: "bg-red-500",
      priority: "high"
    },
    {
      id: 5,
      service: "مركز الطوارئ والإسعاف عدن",
      number: "02358259",
      description: "خدمة الإسعاف المحلية",
      icon: "🏥",
      color: "bg-red-500",
      priority: "high"
    },
    {
      id: 6,
      service: "مركز الطوارئ والإسعاف عدن",
      number: "02354915",
      description: "خدمة الإسعاف المحلية",
      icon: "🏥",
      color: "bg-red-500",
      priority: "high"
    },
    {
      id: 7,
      service: "مركز الطوارئ والإسعاف عدن",
      number: "02354914",
      description: "خدمة الإسعاف المحلية",
      icon: "🏥",
      color: "bg-red-500",
      priority: "high"
    },
    {
      id: 8,
      service: "مركز الطوارئ والإسعاف عدن",
      number: "02354913",
      description: "خدمة الإسعاف المحلية",
      icon: "🏥",
      color: "bg-red-500",
      priority: "high"
    },
    {
      id: 9,
      service: "الشرطة",
      number: "199",
      description: "للحالات الأمنية والطوارئ",
      icon: "🚔",
      color: "bg-blue-500",
      priority: "high"
    },
    {
      id: 10,
      service: "الإطفاء",
      number: "198",
      description: "للحرائق والحوادث",
      icon: "🚒",
      color: "bg-orange-500",
      priority: "medium"
    },
    {
      id: 11,
      service: "الدفاع المدني",
      number: "199",
      description: "للكوارث والطوارئ العامة",
      icon: "🛡️",
      color: "bg-green-500",
      priority: "medium"
    }
  ];

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 page-transition">
      {/* المحتوى الرئيسي */}
      <div className="w-full">
        <AppHeader />
        <main className="container mx-auto px-4 py-4 max-w-md">
        {/* العنوان كما في الصورة */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mb-4 shadow-lg">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            أرقام الطوارئ الطبية
          </h1>
          <p className="text-gray-400 text-sm">
            أرقام الإسعاف والطوارئ الطبية السريعة المتاحة في عدن العام 2025
          </p>
        </div>

        {/* التنبيهات كما في الصورة */}
        <div className="grid gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-red-500 rounded-full">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-red-800 text-sm">تنبيه مهم</span>
            </div>
            <p className="text-red-700 text-xs">
              هذه الأرقام للطوارئ الطبية فقط. استخدمها بمسؤولية في الحالات الحقيقية
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 bg-green-500 rounded-full">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-green-800 text-sm">خدمة الإسعاف</span>
            </div>
            <p className="text-green-700 text-xs">
              خدمة الإسعاف تعمل على مدار 24 ساعة يومياً وتقدم إسعاف الحالات المرضية الطارئة داخل المنازل، أو من الشوارع، وتنتقل بالمصابين إلى المستشفيات بكفاءة عالية.
            </p>
          </div>
        </div>

        {/* الأرقام كما في الصورة */}
        <div className="grid gap-4">
          {emergencyNumbers.map((emergency) => (
            <Card key={emergency.id} className="bg-purple-50 border border-purple-200 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <div className="text-lg">{emergency.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{emergency.service}</h3>
                      <p className="text-xs text-gray-600 mb-2">{emergency.description}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-red-600 font-medium">أولوية عالية</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleEmergencyCall(emergency.number)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-lg flex-shrink-0"
                  >
                    <Phone className="w-3 h-3 ml-1" />
                    {emergency.number}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        </main>
        <AppFooter />
      </div>
    </div>
  );
}
