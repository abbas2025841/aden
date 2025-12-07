import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Phone,
  MapPin,
  Star,
  ShoppingCart,
  User,
  Clock,
  Shield,
  Mail,
  MessageCircle
} from 'lucide-react';

const SupplierPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/water/supplier/:supplierName');
  const [supplier, setSupplier] = useState<any>(null);
  const [supplierTanks, setSupplierTanks] = useState<any[]>([]);

  // بيانات الموردين
  const suppliersData = {
    'شركة-عدن-للمياه---كريتر': {
      id: 'supplier1',
      name: 'شركة عدن للمياه - كريتر',
      location: 'كريتر، شارع الجمهورية',
      contact: '+967-2-234567',
      email: 'info@adenwater.com',
      rating: 4.5,
      reviews: 89,
      established: '2018',
      description: 'شركة رائدة في مجال الخزانات البلاستيكية عالية الجودة في عدن',
      services: ['بيع الخزانات', 'تركيب الخزانات', 'صيانة الخزانات', 'توصيل مجاني'],
      workingHours: '8:00 صباحاً - 6:00 مساءً',
      warranty: 'ضمان سنة واحدة على جميع المنتجات',
      delivery: 'توصيل مجاني في عدن',
      coordinates: { lat: 12.7794, lng: 45.0367 }
    },
    'مؤسسة-الخزانات-الذكية---المعلا': {
      id: 'supplier2',
      name: 'مؤسسة الخزانات الذكية - المعلا',
      location: 'المعلا، شارع الميناء',
      contact: '+967-2-345678',
      email: 'info@smarttanks.com',
      rating: 4.8,
      reviews: 156,
      established: '2015',
      description: 'متخصصون في الخزانات الفيبرجلاس عالية الجودة والتقنيات الحديثة',
      services: ['خزانات فيبرجلاس', 'خزانات شفافة', 'عازل حراري', 'تركيب متخصص'],
      workingHours: '7:00 صباحاً - 8:00 مساءً',
      warranty: 'ضمان سنتين على جميع المنتجات',
      delivery: 'توصيل مجاني في عدن',
      coordinates: { lat: 12.7947, lng: 45.0264 }
    },
    'شركة-الخزانات-المتقدمة---التواهي': {
      id: 'supplier3',
      name: 'شركة الخزانات المتقدمة - التواهي',
      location: 'التواهي، شارع الخمسين',
      contact: '+967-2-456789',
      email: 'info@advancedtanks.com',
      rating: 4.9,
      reviews: 203,
      established: '2012',
      description: 'رواد في صناعة الخزانات الفولاذية المقاومة للصدأ في عدن',
      services: ['خزانات فولاذية', 'مقاومة للصدأ', 'جودة عالية', 'صيانة دورية'],
      workingHours: '8:00 صباحاً - 5:00 مساءً',
      warranty: 'ضمان 3 سنوات على جميع المنتجات',
      delivery: 'توصيل مجاني في عدن',
      coordinates: { lat: 12.7900, lng: 45.0200 }
    }
  };

  // خزانات المورد
  const allTanks = [
    {
      id: 'tank1',
      name: 'خزان بلاستيك أبيض - شركة عدن للمياه',
      capacity: '1000 لتر',
      material: 'بولي إيثيلين عالي الجودة',
      price: '42,000 ريال',
      oldPrice: '48,000 ريال',
      rating: 4.5,
      reviews: 89,
      seller: 'شركة عدن للمياه - كريتر',
      features: ['مقاوم للأشعة فوق البنفسجية', 'سهل التنظيف', 'آمن صحياً', 'مقاوم للكسر'],
      delivery: 'توصيل مجاني في عدن',
      warranty: 'ضمان سنة واحدة',
      category: 'بلاستيك',
      coordinates: { lat: 12.7794, lng: 45.0367 }
    },
    {
      id: 'tank2',
      name: 'خزان فيبرجلاس - مؤسسة الخزانات الذكية',
      capacity: '2000 لتر',
      material: 'فيبرجلاس معزز',
      price: '78,000 ريال',
      oldPrice: '85,000 ريال',
      rating: 4.8,
      reviews: 156,
      seller: 'مؤسسة الخزانات الذكية - المعلا',
      features: ['عازل حراري ممتاز', 'مقاوم للصدأ', 'جودة عالية', 'عمر طويل'],
      delivery: 'توصيل مجاني في عدن',
      warranty: 'ضمان سنتين',
      category: 'فيبرجلاس',
      coordinates: { lat: 12.7947, lng: 45.0264 }
    },
    {
      id: 'tank3',
      name: 'خزان فولاذ مقاوم - شركة الخزانات المتقدمة',
      capacity: '500 لتر',
      material: 'فولاذ مقاوم للصدأ 316',
      price: '58,000 ريال',
      oldPrice: null,
      rating: 4.9,
      reviews: 203,
      seller: 'شركة الخزانات المتقدمة - التواهي',
      features: ['جودة عالية', 'مقاوم للتآكل', 'سهل الصيانة', 'مقاوم للضغط'],
      delivery: 'توصيل مجاني في عدن',
      warranty: 'ضمان 3 سنوات',
      category: 'فولاذ',
      coordinates: { lat: 12.7900, lng: 45.0200 }
    }
  ];

  useEffect(() => {
    if (params && 'supplierName' in params && (params as any).supplierName) {
      const supplierData = suppliersData[(params as any).supplierName as keyof typeof suppliersData];
      if (supplierData) {
        setSupplier(supplierData);
        // فلترة الخزانات حسب المورد
        const tanks = allTanks.filter(tank => tank.seller === supplierData.name);
        setSupplierTanks(tanks);
      }
    }
  }, [params]);

  if (!supplier) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-xl font-bold mb-4">المورد غير موجود</h2>
          <Button onClick={() => setLocation('/water/home-tanks')}>
            العودة للخزانات
          </Button>
        </div>
      </div>
    );
  }

  const handleContact = () => {
    alert(`سيتم التواصل معك قريباً مع ${supplier.name}`);
  };

  const handleOrderTank = (tankId: string) => {
    const tank = supplierTanks.find(t => t.id === tankId);
    alert(`تم إرسال طلبك لـ ${tank?.name}`);
  };

  return (
    <div className="min-h-screen bg-black">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/water/home-tanks')}
            className="p-2 text-sky-300 hover:bg-teal-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <h1 className="text-xl font-bold text-white">صفحة المورد</h1>
          </div>
        </div>

        {/* معلومات المورد */}
        <div className="bg-teal-800 rounded-xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{supplier.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(supplier.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                />
              ))}
              <span className="text-sky-300 text-sm">({supplier.reviews} تقييم)</span>
            </div>
          </div>

          {/* تفاصيل المورد */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-300" />
              <span className="text-sky-300">{supplier.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-300" />
              <span className="text-sky-300">{supplier.contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-300" />
              <span className="text-sky-300">{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-300" />
              <span className="text-sky-300">{supplier.workingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-300" />
              <span className="text-sky-300">{supplier.warranty}</span>
            </div>
          </div>

          {/* الوصف */}
          <div className="mt-4 p-3 bg-teal-700 rounded-lg">
            <p className="text-sky-200 text-sm leading-relaxed">{supplier.description}</p>
          </div>

          {/* الخدمات */}
          <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">الخدمات المقدمة:</h3>
            <div className="flex flex-wrap gap-2">
              {supplier.services.map((service: string, index: number) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* خزانات المورد */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            خزانات {supplier.name} ({supplierTanks.length})
          </h2>
          
          <div className="space-y-4">
            {supplierTanks.map((tank) => (
              <div 
                key={tank.id} 
                className="bg-teal-800 rounded-xl p-4 border border-teal-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{tank.name}</h3>
                    <p className="text-sm text-sky-300">{tank.capacity} - {tank.material}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        {tank.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium">متاح</span>
                  </div>
                </div>

                {/* الميزات */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {tank.features.map((feature: string, index: number) => (
                    <span 
                      key={index}
                      className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* السعر والتقييم */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-cyan-400">{tank.price}</span>
                      {tank.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">{tank.oldPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < tank.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                        />
                      ))}
                      <span className="text-sm text-sky-300 ml-1">({tank.reviews})</span>
                    </div>
                  </div>
                </div>

                {/* الأزرار */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleContact()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg py-2"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    تواصل
                  </Button>
                  <Button 
                    onClick={() => handleOrderTank(tank.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg py-2"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    اطلب الآن
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* زر العودة */}
        <div className="mt-6">
          <Button 
            onClick={() => setLocation('/water/home-tanks')}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة لخزانات المنازل
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SupplierPage;
