import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, ArrowLeft, User, Phone, MapPin, Calendar, 
  Shield, CheckCircle, AlertCircle, Save, Plus
} from 'lucide-react';

interface DonorFormData {
  name: string;
  phone: string;
  bloodType: string;
  age: string;
  location: string;
  lastDonation: string;
  totalDonations: string;
  availability: string;
  notes: string;
  emergencyContact: string;
  medicalConditions: string;
  medications: string;
}

export default function RegisterDonorPage() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<DonorFormData>({
    name: '',
    phone: '',
    bloodType: '',
    age: '',
    location: '',
    lastDonation: '',
    totalDonations: '0',
    availability: 'available',
    notes: '',
    emergencyContact: '',
    medicalConditions: '',
    medications: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<DonorFormData>>({});

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const locations = [
    'عدن كريتر', 'المعلا', 'التواهي', 'خور مكسر', 
    'المنصورة', 'الشيخ عثمان', 'البريقة', 'دار سعد'
  ];
  const availabilityOptions = [
    { value: 'available', label: 'متاح دائماً', color: 'bg-green-500' },
    { value: 'busy', label: 'مشغول أحياناً', color: 'bg-yellow-500' },
    { value: 'unavailable', label: 'غير متاح حالياً', color: 'bg-red-500' }
  ];

  const handleInputChange = (field: keyof DonorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<DonorFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.bloodType) newErrors.bloodType = 'فصيلة الدم مطلوبة';
    if (!formData.age.trim()) newErrors.age = 'العمر مطلوب';
    if (!formData.location) newErrors.location = 'الموقع مطلوب';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'جهة الاتصال في الطوارئ مطلوبة';

    // التحقق من صحة العمر
    const age = parseInt(formData.age);
    if (age < 18 || age > 65) {
      newErrors.age = 'العمر يجب أن يكون بين 18 و 65 سنة';
    }

    // التحقق من صحة رقم الهاتف
    const phoneRegex = /^[0-9]{9,15}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // محاكاة إرسال البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // حفظ البيانات في localStorage
      const existingDonors = JSON.parse(localStorage.getItem('registeredDonors') || '[]');
      const newDonor = {
        id: `donor_${Date.now()}`,
        ...formData,
        registrationDate: new Date().toISOString(),
        status: 'pending'
      };
      
      existingDonors.push(newDonor);
      localStorage.setItem('registeredDonors', JSON.stringify(existingDonors));
      
      setSubmitSuccess(true);
      
      // إعادة تعيين النموذج بعد 3 ثوان
      setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          bloodType: '',
          age: '',
          location: '',
          lastDonation: '',
          totalDonations: '0',
          availability: 'available',
          notes: '',
          emergencyContact: '',
          medicalConditions: '',
          medications: ''
        });
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('خطأ في تسجيل المتبرع:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-black">
        <AppHeader />
        
        <main className="container mx-auto px-4 py-6 max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">تم التسجيل بنجاح!</h1>
            <p className="text-sky-300 text-lg mb-6">
              شكراً لك على تسجيلك كمتبرع دم. سنتواصل معك قريباً.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation('/blood-bank')} 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg"
              >
                العودة لبنك الدم
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/blood-requests')} 
                className="w-full border-teal-600 text-teal-300 hover:bg-teal-800 hover:text-white py-3 rounded-xl"
              >
                عرض طلبات الدم
              </Button>
            </div>
          </div>
        </main>
        
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">سجل كمتبرع دم</h1>
          <p className="text-sky-300 text-lg">ساهم في إنقاذ حياة إنسان</p>
        </div>

        {/* الآية الكريمة */}
        <Card className="mb-6 bg-green-800 bg-opacity-80 border border-green-600 rounded-xl shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="text-green-200 text-lg leading-relaxed mb-2">
              وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا
            </div>
            <div className="text-green-300 text-sm">
              سورة المائدة - الآية 32
            </div>
          </CardContent>
        </Card>

        {/* نموذج التسجيل */}
        <Card className="bg-teal-800 bg-opacity-80 border border-teal-600 rounded-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white text-center">
              بيانات المتبرع
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* المعلومات الشخصية */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  المعلومات الشخصية
                </h3>
                
                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    الاسم الكامل *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="أدخل اسمك الكامل"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    رقم الهاتف *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                    placeholder="777123456"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sky-300 text-sm font-medium mb-2">
                      فصيلة الدم *
                    </label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) => handleInputChange('bloodType', e.target.value)}
                      className={`w-full px-3 py-2 bg-teal-700 border border-teal-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                        errors.bloodType ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">اختر فصيلة الدم</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.bloodType && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.bloodType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sky-300 text-sm font-medium mb-2">
                      العمر *
                    </label>
                    <Input
                      type="number"
                      min="18"
                      max="65"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={`w-full bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                        errors.age ? 'border-red-500' : ''
                      }`}
                      placeholder="25"
                    />
                    {errors.age && (
                      <p className="text-red-400 text-xs mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.age}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    الموقع *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-3 py-2 bg-teal-700 border border-teal-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${
                      errors.location ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">اختر موقعك</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  {errors.location && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* معلومات التبرع */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  معلومات التبرع
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sky-300 text-sm font-medium mb-2">
                      آخر تبرع
                    </label>
                    <Input
                      type="date"
                      value={formData.lastDonation}
                      onChange={(e) => handleInputChange('lastDonation', e.target.value)}
                      className="w-full bg-teal-700 border border-teal-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sky-300 text-sm font-medium mb-2">
                      إجمالي التبرعات
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.totalDonations}
                      onChange={(e) => handleInputChange('totalDonations', e.target.value)}
                      className="w-full bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    حالة التوفر
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {availabilityOptions.map(option => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          value={option.value}
                          checked={formData.availability === option.value}
                          onChange={(e) => handleInputChange('availability', e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          formData.availability === option.value 
                            ? `${option.color} border-white` 
                            : 'border-gray-400'
                        }`} />
                        <span className="text-sky-300">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* معلومات إضافية */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  معلومات إضافية
                </h3>
                
                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    جهة الاتصال في الطوارئ *
                  </label>
                  <Input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className={`w-full bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                      errors.emergencyContact ? 'border-red-500' : ''
                    }`}
                    placeholder="اسم ورقم هاتف"
                  />
                  {errors.emergencyContact && (
                    <p className="text-red-400 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    الحالات الطبية (إن وجدت)
                  </label>
                  <textarea
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    className="w-full px-3 py-2 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                    rows={3}
                    placeholder="أي حالات طبية أو أمراض مزمنة..."
                  />
                </div>

                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    الأدوية المستخدمة (إن وجدت)
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    className="w-full px-3 py-2 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                    rows={3}
                    placeholder="أي أدوية تستخدمها حالياً..."
                  />
                </div>

                <div>
                  <label className="block text-sky-300 text-sm font-medium mb-2">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full px-3 py-2 bg-teal-700 border border-teal-600 rounded-lg text-white placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                    rows={3}
                    placeholder="أي معلومات إضافية تريد إضافتها..."
                  />
                </div>
              </div>

              {/* أزرار الإجراءات */}
              <div className="space-y-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      جاري التسجيل...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="w-5 h-5 mr-2" />
                      سجل كمتبرع
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/blood-bank')}
                  className="w-full border-teal-600 text-teal-300 hover:bg-teal-800 hover:text-white py-3 rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  العودة لبنك الدم
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <AppFooter />
    </div>
  );
}
