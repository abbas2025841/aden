import React from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Droplets, Users, AlertTriangle, Heart, Search
} from 'lucide-react';


export default function BloodBankPage() {
  const [, setLocation] = useLocation();



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-full mb-4 shadow-lg">
            <Droplets className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">بنك الدم</h1>
          <p className="text-sky-300 text-lg">طلبات الدم العاجلة وتسجيل المتبرعين</p>
        </div>

        {/* البطاقتان الرئيسيتان */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          {/* بطاقة المتبرع */}
          <Card className="group bg-gradient-to-br from-green-800 via-green-700 to-green-900 border-green-500 shadow-2xl hover:shadow-green-400/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <CardHeader className="text-center pb-6 relative overflow-hidden">
              {/* خلفية متحركة */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-green-400/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
          <div className="relative">
                    <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-green-400/50 transition-all duration-300">
                      <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full flex items-center justify-center">
                      <span className="text-green-800 text-xs font-bold">+</span>
              </div>
            </div>
                  <CardTitle className="text-2xl font-bold text-white ml-3 group-hover:text-green-200 transition-colors duration-300">
                    متبرع
                  </CardTitle>
          </div>

                {/* الآية الكريمة */}
                <div className="bg-gradient-to-r from-green-600/40 to-green-700/40 rounded-xl p-4 mb-4 border border-green-400/50 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-green-100 text-lg leading-relaxed mb-2 font-medium">
                      وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا
                    </div>
                    <div className="text-green-300 text-xs font-semibold">
                      سورة المائدة - الآية 32
                    </div>
          </div>
        </div>

                <p className="text-green-100 text-lg mb-4 font-medium group-hover:text-white transition-colors duration-300">
                  ساهم في إنقاذ حياة إنسان
                </p>
                    </div>
            </CardHeader>
            
            <CardContent className="text-center relative z-10">
              <Button 
                onClick={() => setLocation('/blood-donors')} 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl"
              >
                <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                عرض المتبرعين
                    </Button>
                </CardContent>
              </Card>

          {/* بطاقة يحتاج دم */}
          <Card className="group bg-gradient-to-br from-red-800 via-red-700 to-red-900 border-red-500 shadow-2xl hover:shadow-red-400/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <CardHeader className="text-center pb-6 relative overflow-hidden">
              {/* خلفية متحركة */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-transparent to-red-400/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-red-400/50 transition-all duration-300">
                      <AlertTriangle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-300 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-red-800 text-xs font-bold">!</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white ml-3 group-hover:text-red-200 transition-colors duration-300">
                    يحتاج دم
                  </CardTitle>
                  </div>

                <p className="text-red-100 text-lg mb-4 font-medium group-hover:text-white transition-colors duration-300">
                  طلبات الدم العاجلة
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="text-center relative z-10">
              <Button 
                onClick={() => setLocation('/blood-requests')} 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl"
              >
                <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                عرض الطلبات
                    </Button>
                </CardContent>
              </Card>
        </div>




      </main>

      <AppFooter />
    </div>
  );
}