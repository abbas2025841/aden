import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  DollarSign, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Gift,
  Baby,
  Shield,
  Star,
  MessageCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Filter
} from 'lucide-react';

export default function DonationsPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'all', name: 'جميع التبرعات', icon: '🤝' },
    { id: 'food', name: 'مواد غذائية', icon: '🍞' },
    { id: 'clothing', name: 'ملابس', icon: '👕' },
    { id: 'medical', name: 'أدوية وعلاج', icon: '💊' },
    { id: 'education', name: 'تعليم', icon: '📚' },
    { id: 'money', name: 'تبرع مالي', icon: '💰' },
    { id: 'furniture', name: 'أثاث', icon: '🪑' },
    { id: 'utilities', name: 'فواتير', icon: '⚡' }
  ];

  const districts = [
    'جميع المناطق', 'صيرة', 'الشيخ عثمان', 'المنصورة', 'التواهي', 
    'كريتر', 'خور مكسر', 'المعلا', 'دار سعد', 'البريقة'
  ];

  const needyFamilies = [
    {
      id: 1,
      name: 'عائلة أحمد محمد',
      district: 'التواهي',
      category: 'food',
      description: 'عائلة مكونة من 6 أفراد، الأب عاطل عن العمل والأم مريضة',
      needs: ['مواد غذائية', 'أدوية', 'ملابس أطفال'],
      priority: 'high',
      contact: '02358260',
      address: 'شارع التواهي - حي السلام',
      familySize: 6,
      children: 4,
      elderly: 1,
      image: '👨‍👩‍👧‍👦'
    },
    {
      id: 2,
      name: 'عائلة فاطمة علي',
      district: 'كريتر',
      category: 'medical',
      description: 'أم وحيدة مع 3 أطفال، تحتاج مساعدة في العلاج',
      needs: ['أدوية', 'تكاليف علاج', 'مواد غذائية'],
      priority: 'high',
      contact: '02354915',
      address: 'سوق كريتر - حي القديم',
      familySize: 4,
      children: 3,
      elderly: 0,
      image: '👩‍👧‍👦'
    },
    {
      id: 3,
      name: 'عائلة سالم حسن',
      district: 'المنصورة',
      category: 'education',
      description: 'عائلة تحتاج مساعدة في مصاريف التعليم',
      needs: ['مصاريف مدرسية', 'كتب', 'ملابس مدرسية'],
      priority: 'medium',
      contact: '02358259',
      address: 'شارع المنصورة - حي النور',
      familySize: 5,
      children: 3,
      elderly: 0,
      image: '👨‍👩‍👦‍👦'
    },
    {
      id: 4,
      name: 'عائلة مريم عبدالله',
      district: 'خور مكسر',
      category: 'utilities',
      description: 'عائلة تحتاج مساعدة في فواتير الكهرباء والماء',
      needs: ['فواتير كهرباء', 'فواتير ماء', 'مواد غذائية'],
      priority: 'medium',
      contact: '02354914',
      address: 'شارع خور مكسر - حي الأمل',
      familySize: 7,
      children: 5,
      elderly: 1,
      image: '👨‍👩‍👧‍👧‍👦'
    },
    {
      id: 5,
      name: 'عائلة يوسف أحمد',
      district: 'صيرة',
      category: 'furniture',
      description: 'عائلة فقدت منزلها في حادث وتحتاج أثاث',
      needs: ['أثاث منزلي', 'أجهزة كهربائية', 'ملابس'],
      priority: 'high',
      contact: '02358261',
      address: 'شارع صيرة - حي الجديد',
      familySize: 4,
      children: 2,
      elderly: 0,
      image: '👨‍👩‍👦‍👦'
    },
    {
      id: 6,
      name: 'عائلة خديجة محمد',
      district: 'البريقة',
      category: 'clothing',
      description: 'عائلة تحتاج ملابس شتوية للأطفال',
      needs: ['ملابس شتوية', 'أحذية', 'مواد غذائية'],
      priority: 'low',
      contact: '02358262',
      address: 'شارع البريقة - حي السلام',
      familySize: 6,
      children: 4,
      elderly: 1,
      image: '👩‍👧‍👧‍👦'
    }
  ];

  const filteredFamilies = needyFamilies.filter(family => {
    const matchesCategory = selectedCategory === '' || selectedCategory === 'all' || family.category === selectedCategory;
    const matchesDistrict = selectedDistrict === '' || selectedDistrict === 'جميع المناطق' || family.district === selectedDistrict;
    
    return matchesCategory && matchesDistrict;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'عاجل';
      case 'medium': return 'متوسط';
      case 'low': return 'عادي';
      default: return 'غير محدد';
    }
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال التبرع
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // إعادة تعيين النموذج بعد 3 ثوان
    setTimeout(() => {
      setSubmitted(false);
      setDonationAmount('');
      setDonorName('');
      setDonorPhone('');
      setDonationMessage('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <AppHeader />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-200/50 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation('/')}
                className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-emerald-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">تبرعات للأسر المحتاجة</h1>
                  <p className="text-emerald-600 font-medium">ساهم في مساعدة الأسر المحتاجة في عدن</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                  <p className="text-sm text-gray-600">عائلة محتاجة</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">200+</p>
                  <p className="text-sm text-gray-600">تبرع مكتمل</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-200/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.9</p>
                  <p className="text-sm text-gray-600">تقييم المانحين</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Donation Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-emerald-200/50 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-600" />
              تبرع سريع
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">شكراً لك!</h3>
                <p className="text-gray-600 mb-4">تم إرسال تبرعك بنجاح وسيتم التواصل معك قريباً</p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm text-emerald-800">
                    <strong>رقم التبرع:</strong> #DN{Math.floor(Math.random() * 10000)}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDonationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      مبلغ التبرع (ريال يمني)
                    </label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="10000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      اسمك
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="أدخل اسمك"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="77xxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    رسالة (اختياري)
                  </label>
                  <textarea
                    value={donationMessage}
                    onChange={(e) => setDonationMessage(e.target.value)}
                    placeholder="اكتب رسالة للأسر المحتاجة..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 px-6 rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      تبرع الآن
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-200/50 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-600" />
              فلترة الأسر المحتاجة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المساعدة</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">جميع الأنواع</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              تم العثور على <span className="font-bold text-emerald-600">{filteredFamilies.length}</span> عائلة محتاجة
            </p>
          </div>

          {/* Needy Families Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFamilies.map(family => (
              <div key={family.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-200/50 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{family.image}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{family.name}</h3>
                      <p className="text-gray-600 text-sm">{family.district}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(family.priority)}`}>
                    {getPriorityText(family.priority)}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{family.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{family.familySize} أفراد</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{family.children} أطفال</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">احتياجاتهم:</h4>
                  <div className="flex flex-wrap gap-2">
                    {family.needs.map((need, index) => (
                      <span key={index} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                        {need}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{family.address}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(`tel:${family.contact}`, '_self')}
                    className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    اتصل
                  </button>
                  <button
                    onClick={() => {
                      const message = `أريد المساعدة في ${family.needs.join(' و ')} للعائلة ${family.name}`;
                      window.open(`https://wa.me/${family.contact}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    واتساب
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFamilies.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">لم يتم العثور على أسر محتاجة</h3>
              <p className="text-gray-600">جرب تغيير معايير البحث</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200/50 mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              معلومات التواصل
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">رقم الطوارئ</p>
                  <p className="text-sm text-gray-600">+967 77 000 0000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
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
