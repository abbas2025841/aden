import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { 
  ArrowLeft, 
  Satellite, 
  Wifi, 
  Zap, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Globe,
  Shield,
  Star,
  MessageCircle,
  CreditCard,
  Truck,
  Settings,
  Signal,
  Router,
  Users
} from 'lucide-react';

export default function StarlinkPage() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const plans = [
    {
      id: 'residential',
      name: 'الخطة السكنية',
      price: '50',
      currency: 'USD',
      speed: '50-200',
      latency: '20-40',
      data: 'غير محدود',
      features: ['إنترنت عالي السرعة', 'استقبال عالمي', 'سهولة التركيب', 'دعم فني 24/7'],
      icon: '🏠',
      popular: false
    },
    {
      id: 'business',
      name: 'الخطة التجارية',
      price: '250',
      currency: 'USD',
      speed: '100-500',
      latency: '20-40',
      data: 'غير محدود',
      features: ['سرعة أعلى', 'أولوية في الشبكة', 'دعم فني مخصص', 'ضمان الخدمة'],
      icon: '🏢',
      popular: true
    },
    {
      id: 'premium',
      name: 'الخطة المميزة',
      price: '500',
      currency: 'USD',
      speed: '200-1000',
      latency: '15-30',
      data: 'غير محدود',
      features: ['أقصى سرعة', 'أولوية قصوى', 'دعم فني فوري', 'ضمان 99.9%'],
      icon: '⭐',
      popular: false
    }
  ];

  const features = [
    {
      icon: <Wifi className="w-6 h-6" />,
      title: 'إنترنت عالي السرعة',
      description: 'سرعات تصل إلى 1 جيجابت في الثانية'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'تغطية عالمية',
      description: 'متاح في جميع أنحاء العالم'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'استجابة سريعة',
      description: 'زمن استجابة منخفض للغاية'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'أمان عالي',
      description: 'حماية متقدمة للبيانات'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'سهولة التركيب',
      description: 'تركيب ذاتي في دقائق'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'دعم فني 24/7',
      description: 'مساعدة متاحة على مدار الساعة'
    }
  ];

  const coverage = [
    { area: 'صيرة', status: 'متاح', signal: 'ممتاز' },
    { area: 'الشيخ عثمان', status: 'متاح', signal: 'ممتاز' },
    { area: 'المنصورة', status: 'متاح', signal: 'جيد جداً' },
    { area: 'التواهي', status: 'متاح', signal: 'ممتاز' },
    { area: 'كريتر', status: 'متاح', signal: 'جيد جداً' },
    { area: 'خور مكسر', status: 'متاح', signal: 'ممتاز' },
    { area: 'المعلا', status: 'متاح', signal: 'جيد' },
    { area: 'دار سعد', status: 'متاح', signal: 'جيد' },
    { area: 'البريقة', status: 'متاح', signal: 'جيد جداً' }
  ];

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !customerName || !customerPhone || !customerAddress) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsOrdering(true);
    
    // محاكاة طلب الخدمة
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsOrdering(false);
    setOrderPlaced(true);
    
    // إعادة تعيين النموذج بعد 5 ثوان
    setTimeout(() => {
      setOrderPlaced(false);
      setSelectedPlan('');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    }, 5000);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'ممتاز': return 'text-green-600';
      case 'جيد جداً': return 'text-blue-600';
      case 'جيد': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <AppHeader />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-indigo-200/50 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation('/')}
                className="p-2 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-indigo-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Satellite className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">خدمة ستار لينك</h1>
                  <p className="text-indigo-600 font-medium">إنترنت عالي السرعة عبر الأقمار الصناعية</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">1 Gbps</p>
                  <p className="text-sm text-gray-600">أقصى سرعة</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">20ms</p>
                  <p className="text-sm text-gray-600">زمن الاستجابة</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-sm text-gray-600">موثوقية الخدمة</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-indigo-200/50 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-600" />
              مميزات ستار لينك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plans */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              خطط الاشتراك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <div key={plan.id} className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 transition-all hover:shadow-lg ${
                  plan.popular 
                    ? 'border-indigo-500 ring-2 ring-indigo-200' 
                    : 'border-indigo-200/50'
                }`}>
                  {plan.popular && (
                    <div className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full text-center mb-4">
                      الأكثر شعبية
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">{plan.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-indigo-600">${plan.price}</span>
                      <span className="text-gray-600">/شهر</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-gray-600">السرعة: {plan.speed} Mbps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-gray-600">زمن الاستجابة: {plan.latency} ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm text-gray-600">البيانات: {plan.data}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      selectedPlan === plan.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                    }`}
                  >
                    {selectedPlan === plan.id ? 'محدد' : 'اختر هذه الخطة'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-indigo-200/50 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              طلب الخدمة
            </h2>

            {orderPlaced ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تم إرسال طلبك بنجاح!</h3>
                <p className="text-gray-600 mb-4">سيتصل بك فريقنا خلال 24 ساعة لتأكيد الطلب</p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm text-indigo-800">
                    <strong>رقم الطلب:</strong> #SL{Math.floor(Math.random() * 10000)}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="77xxxxxxx"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    العنوان التفصيلي
                  </label>
                  <textarea
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="أدخل عنوانك التفصيلي في عدن..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isOrdering || !selectedPlan}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isOrdering ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <Satellite className="w-5 h-5" />
                      اطلب الخدمة الآن
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Coverage Map */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-indigo-200/50 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              تغطية الخدمة في عدن
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coverage.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{area.area}</h3>
                    <p className="text-sm text-gray-600">الحالة: {area.status}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getSignalColor(area.signal)}`}>
                      {area.signal}
                    </div>
                    <div className="flex items-center gap-1">
                      <Signal className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs text-gray-600">إشارة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200/50">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              معلومات التواصل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">رقم الطوارئ</p>
                  <p className="text-sm text-gray-600">+967 77 000 0000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-gray-900">واتساب</p>
                  <p className="text-sm text-gray-600">+967 77 000 0000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
