import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Phone, Search, Heart, ArrowLeft, Plus
} from 'lucide-react';
import { adenBloodRequests } from '@/data/aden-blood-bank';

interface BloodRequest {
  id: string;
  patientName: string;
  bloodType: string;
  hospital: string;
  urgency: 'urgent' | 'normal' | 'critical';
  contact: string;
  location: string;
  date: string;
  status: 'active' | 'fulfilled' | 'expired';
}

export default function BloodRequestsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // استخدام البيانات الحقيقية
  const bloodRequests = adenBloodRequests;

  // فلترة طلبات الدم
  const filteredRequests = useMemo(() => {
    return bloodRequests.filter(request => {
      const matchesSearch = request.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch && request.status === 'active';
    });
  }, [searchQuery]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500 text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      case 'normal': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'حرج';
      case 'urgent': return 'عاجل';
      case 'normal': return 'عادي';
      default: return 'غير محدد';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AppHeader />

      <div className="container mx-auto px-4 py-8">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">طلبات الدم العاجلة</h1>
          </div>
          <p className="text-sky-300 text-lg">مساعدة المرضى في الحصول على الدم المطلوب</p>
        </div>

        {/* البحث البسيط */}
        <Card className="mb-6 bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl shadow-2xl">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-sky-300" />
              <Input
                type="text"
                placeholder="ابحث عن طلب دم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-teal-700 border border-teal-600 rounded-xl px-4 py-3 text-white placeholder-sky-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* عداد النتائج */}
        <div className="mb-6 text-center">
          <div className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl p-4">
            <p className="text-sky-300 text-lg">
              عرض {filteredRequests.length} من أصل {bloodRequests.length} طلب دم
            </p>
          </div>
        </div>

        {/* قائمة طلبات الدم */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">طلبات الدم العاجلة</h2>
            <Badge className="bg-red-500 text-white px-3 py-1 rounded-full">{filteredRequests.length}</Badge>
          </div>

          <div className="space-y-3">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="bg-red-800 bg-opacity-80 border border-red-600 rounded-xl shadow-lg hover:bg-red-700 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white text-lg">{request.patientName}</h3>
                        <Badge className="bg-red-600 text-white border-red-500 text-sm">
                          {request.bloodType}
                        </Badge>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {getUrgencyText(request.urgency)}
                        </Badge>
                      </div>
                      <div className="text-sm text-red-200 mb-1">
                        <strong>المستشفى:</strong> {request.hospital}
                      </div>
                      <div className="flex items-center gap-2 text-red-200">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{request.contact}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                        onClick={() => window.open(`tel:${request.contact}`, '_self')}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        اتصل
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                        onClick={() => window.open(`https://wa.me/${request.contact.replace(/[^0-9]/g, '')}`, '_blank')}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        تبرع
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <Card className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl">
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 text-sky-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">لا توجد طلبات دم</h3>
                <p className="text-sky-300">لا توجد طلبات دم تطابق معايير البحث</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أزرار التنقل */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => setLocation('/register-donor')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            سجل كمتبرع دم
          </Button>
          <Button 
            onClick={() => setLocation('/blood-bank')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            العودة لبنك الدم
          </Button>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
