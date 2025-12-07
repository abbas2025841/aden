import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { 
  User,
  Phone,
  MapPin,
  Bike,
  Camera,
  FileText,
  CheckCircle,
  Upload,
  X
} from 'lucide-react';

const adenDistricts = [
  { id: 'sira', name: 'صيرة' },
  { id: 'sheikh_othman', name: 'الشيخ عثمان' },
  { id: 'mansoura', name: 'المنصورة' },
  { id: 'tawahi', name: 'التواهي' },
  { id: 'crater', name: 'كريتر' },
  { id: 'khormaksar', name: 'خور مكسر' },
  { id: 'maalla', name: 'المعلا' },
  { id: 'dar_sad', name: 'دار سعد' },
  { id: 'buraika', name: 'البريقة' }
];

interface ApplicationData {
  // البيانات الشخصية
  fullName: string;
  phoneNumber: string;
  personalPhoto: string | null;
  district: string;
  
  // بيانات المركبة
  vehicleType: string;
  vehiclePhotos: string[];
  plateNumber: string;
  manufactureYear: string;
  vehicleCondition: string;
  
  // معلومات إضافية
  hasLicense: boolean;
  experienceYears: string;
  knowsAdenStreets: boolean;
}

export default function ApplyJobPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    phoneNumber: '',
    personalPhoto: null,
    district: '',
    vehicleType: '',
    vehiclePhotos: [],
    plateNumber: '',
    manufactureYear: '',
    vehicleCondition: '',
    hasLicense: false,
    experienceYears: '',
    knowsAdenStreets: false
  });

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (field: 'personalPhoto' | 'vehiclePhotos', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (field === 'personalPhoto') {
        handleInputChange('personalPhoto', result);
      } else {
        handleInputChange('vehiclePhotos', [...formData.vehiclePhotos, result]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeVehiclePhoto = (index: number) => {
    const newPhotos = formData.vehiclePhotos.filter((_, i) => i !== index);
    handleInputChange('vehiclePhotos', newPhotos);
  };

  const handleSubmit = async () => {
    // التحقق من البيانات المطلوبة
    if (!formData.fullName || !formData.phoneNumber || !formData.district || 
        !formData.vehicleType || formData.vehiclePhotos.length === 0 || 
        !formData.plateNumber) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // حفظ البيانات في localStorage
    const applications = JSON.parse(localStorage.getItem('driverApplications') || '[]');
    const newApplication = {
      ...formData,
      id: Date.now(),
      submittedAt: new Date().toISOString()
    };
    applications.push(newApplication);
    localStorage.setItem('driverApplications', JSON.stringify(applications));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      personalPhoto: null,
      district: '',
      vehicleType: '',
      vehiclePhotos: [],
      plateNumber: '',
      manufactureYear: '',
      vehicleCondition: '',
      hasLicense: false,
      experienceYears: '',
      knowsAdenStreets: false
    });
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        <AppHeader />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                  </div>
                <div className="text-center">
                  <h1 className="text-lg font-bold text-white">تم إرسال طلبك</h1>
                  <p className="text-blue-400 text-sm">سنراجع طلبك قريباً</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl p-8 border-2 border-green-500 shadow-lg text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">تم إرسال طلبك بنجاح!</h2>
              <p className="text-gray-700 text-lg mb-6">شكراً لك على اهتمامك بالانضمام إلى فريقنا</p>
              
              <div className="bg-white/80 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">تفاصيل الطلب</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
                  <div>
                    <p className="text-gray-600">رقم الطلب:</p>
                    <p className="font-bold text-gray-900">#DA{Date.now().toString().slice(-6)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">الاسم:</p>
                    <p className="font-bold text-gray-900">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">رقم الهاتف:</p>
                    <p className="font-bold text-gray-900">{formData.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">نوع المركبة:</p>
                    <p className="font-bold text-gray-900">{formData.vehicleType}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={resetForm}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl mr-4"
                >
                  تقديم طلب جديد
                </button>
                <button
                  onClick={() => setLocation('/motorcycle-taxi')}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-8 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl"
                >
                  العودة للصفحة الرئيسية
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <AppHeader />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">🚐</span>
                </div>
              <div className="text-center">
                <h1 className="text-lg font-bold text-white">يطلب عمل</h1>
                <p className="text-blue-400 text-sm">انضم إلى فريق سائقي باص صغير عدن</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl p-6 border-2 border-blue-500 shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  1
                </div>
                <span className="font-medium">البيانات الشخصية</span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  2
                </div>
                <span className="font-medium">بيانات المركبة</span>
              </div>
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                  3
                </div>
                <span className="font-medium">معلومات إضافية</span>
              </div>
            </div>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                البيانات الشخصية
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="77xxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    المديرية/الحي *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">اختر مديريتك</option>
                    {adenDistricts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Camera className="w-4 h-4 inline mr-1" />
                    الصورة الشخصية (اختياري)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {formData.personalPhoto ? (
                      <div className="relative">
                        <img src={formData.personalPhoto} alt="Personal" className="w-20 h-20 rounded-full mx-auto object-cover" />
                        <button
                          onClick={() => handleInputChange('personalPhoto', null)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">اضغط لرفع صورة</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload('personalPhoto', file);
                          }}
                          className="hidden"
                          id="personal-photo"
                        />
                        <label htmlFor="personal-photo" className="cursor-pointer text-blue-600 hover:text-blue-700">
                          اختر ملف
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  التالي
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Vehicle Information */}
          {currentStep === 2 && (
            <div className="bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-lg">🚐</span>
                بيانات المركبة
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع المركبة *
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">اختر نوع المركبة</option>
                          <option value="باص صغير">باص صغير</option>
                    <option value="سيكل">سيكل</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم اللوحة *
                  </label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => handleInputChange('plateNumber', e.target.value)}
                    placeholder="مثال: 12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنة الصنع
                  </label>
                  <input
                    type="number"
                    value={formData.manufactureYear}
                    onChange={(e) => handleInputChange('manufactureYear', e.target.value)}
                    placeholder="مثال: 2020"
                    min="1990"
                    max="2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة العامة
                  </label>
                  <select
                    value={formData.vehicleCondition}
                    onChange={(e) => handleInputChange('vehicleCondition', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر الحالة</option>
                    <option value="ممتازة">ممتازة</option>
                    <option value="جيدة">جيدة</option>
                    <option value="متوسطة">متوسطة</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="w-4 h-4 inline mr-1" />
                  صور المركبة * (مطلوب على الأقل صورة واحدة)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.vehiclePhotos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img src={photo} alt={`Vehicle ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => removeVehiclePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.vehiclePhotos.length < 4 && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-600">إضافة صورة</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload('vehiclePhotos', file);
                        }}
                        className="hidden"
                        id={`vehicle-photo-${formData.vehiclePhotos.length}`}
                      />
                      <label htmlFor={`vehicle-photo-${formData.vehiclePhotos.length}`} className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs">
                        اختر
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  السابق
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  التالي
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="bg-gradient-to-br from-blue-200 to-indigo-200 rounded-xl p-6 border-2 border-blue-500 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                معلومات إضافية
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    هل لديك رخصة قيادة سارية المفعول؟
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="hasLicense"
                        checked={formData.hasLicense === true}
                        onChange={() => handleInputChange('hasLicense', true)}
                        className="text-blue-600"
                      />
                      <span>نعم</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="hasLicense"
                        checked={formData.hasLicense === false}
                        onChange={() => handleInputChange('hasLicense', false)}
                        className="text-blue-600"
                      />
                      <span>لا</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سنوات الخبرة في القيادة
                  </label>
                  <select
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">اختر سنوات الخبرة</option>
                    <option value="أقل من سنة">أقل من سنة</option>
                    <option value="1-2 سنة">1-2 سنة</option>
                    <option value="3-5 سنوات">3-5 سنوات</option>
                    <option value="أكثر من 5 سنوات">أكثر من 5 سنوات</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    هل تعرف شوارع عدن جيداً؟
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="knowsAdenStreets"
                        checked={formData.knowsAdenStreets === true}
                        onChange={() => handleInputChange('knowsAdenStreets', true)}
                        className="text-blue-600"
                      />
                      <span>نعم</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="knowsAdenStreets"
                        checked={formData.knowsAdenStreets === false}
                        onChange={() => handleInputChange('knowsAdenStreets', false)}
                        className="text-blue-600"
                      />
                      <span>لا</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  السابق
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-8 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
