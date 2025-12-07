import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { 
  ArrowLeft,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Send,
  Upload,
  FileText,
  Eye,
  Edit,
  X,
  Phone,
  MessageCircle,
  Mail,
  Shield,
  Info
} from 'lucide-react';

// مديريات عدن
const ADEN_DISTRICTS = [
  { id: 'sira', name: 'صيرة' },
  { id: 'sheikh_othman', name: 'الشيخ عثمان' },
  { id: 'mansoura', name: 'المنصورة' },
  { id: 'tawahi', name: 'التواهي' },
  { id: 'crater', name: 'كريتر' },
  { id: 'khormaksar', name: 'خور مكسر' },
  { id: 'maalla', name: 'المعلا' },
  { id: 'dar_sad', name: 'دار سعد' },
  { id: 'buraika', name: 'البريقة' },
  { id: 'al_mansura', name: 'المنصورة' },
  { id: 'al_mualla', name: 'المعلا' }
];

// المجالات المهنية
const JOB_CATEGORIES = [
  { id: 'education', name: 'تعليم', icon: '🎓' },
  { id: 'engineering', name: 'هندسة', icon: '🔧' },
  { id: 'health', name: 'صحة', icon: '🏥' },
  { id: 'administration', name: 'إدارية', icon: '📋' },
  { id: 'labor', name: 'عمالة', icon: '👷' },
  { id: 'services', name: 'خدمات', icon: '🔧' },
  { id: 'technical', name: 'تقنية', icon: '💻' },
  { id: 'finance', name: 'مالية', icon: '💰' },
  { id: 'sales', name: 'مبيعات', icon: '💼' },
  { id: 'security', name: 'أمنية', icon: '🛡️' },
  { id: 'media', name: 'إعلامية', icon: '📺' }
];

// أنواع الوظائف
const JOB_TYPES = [
  { id: 'full-time', name: 'دوام كامل' },
  { id: 'part-time', name: 'دوام جزئي' },
  { id: 'remote', name: 'عن بُعد' },
  { id: 'temporary', name: 'مؤقت' },
  { id: 'contract', name: 'عقد' }
];

export default function PostJobAden() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    company: '',
    district: '',
    category: '',
    jobType: '',
    salary: '',
    
    // Description
    description: '',
    
    // Contact Info
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactWhatsapp: '',
    
    // Additional
    showPhone: true,
    showWhatsapp: true,
    showEmail: false,
    receiveApplications: true,
    logo: null as File | null
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('تم نشر الوظيفة بنجاح!');
    setLocation('/jobs');
  };

  const isFormValid = () => {
    return formData.title && formData.company && formData.district && 
           formData.category && formData.jobType && formData.description &&
           formData.contactName && formData.contactPhone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation('/jobs')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              العودة
            </button>
            <div>
              <h1 className="text-3xl font-bold">إضافة وظيفة جديدة</h1>
              <p className="text-white/90 mt-2">انشر وظيفتك واجذب أفضل المواهب في عدن</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">المعلومات الأساسية</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الوظيفة *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="مثال: مطور ويب Frontend"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم الشركة *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="مثال: شركة تقنية عدن"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المديرية *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">اختر المديرية</option>
                      {ADEN_DISTRICTS.map(district => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المجال *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">اختر المجال</option>
                      {JOB_CATEGORIES.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الوظيفة *
                    </label>
                    <select
                      value={formData.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">اختر نوع الوظيفة</option>
                      {JOB_TYPES.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الراتب
                    </label>
                    <input
                      type="text"
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      placeholder="مثال: 2,000,000 - 3,500,000 ريال يمني"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">وصف الوظيفة</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف الوظيفة *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً للوظيفة والمهام المطلوبة..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات التواصل</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المسؤول *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="مثال: أحمد محمد"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                      placeholder="مثال: +967123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="مثال: hr@company.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      واتساب
                    </label>
                    <input
                      type="tel"
                      value={formData.contactWhatsapp}
                      onChange={(e) => handleInputChange('contactWhatsapp', e.target.value)}
                      placeholder="مثال: +967123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Contact Display Options */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">عرض معلومات التواصل</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.showPhone}
                        onChange={(e) => handleInputChange('showPhone', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">إظهار رقم الهاتف</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.showWhatsapp}
                        onChange={(e) => handleInputChange('showWhatsapp', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">إظهار واتساب</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.showEmail}
                        onChange={(e) => handleInputChange('showEmail', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">إظهار البريد الإلكتروني</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.receiveApplications}
                        onChange={(e) => handleInputChange('receiveApplications', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">استلام الطلبات هنا</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Company Logo */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">شعار الشركة (اختياري)</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">ارفع شعار شركتك</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    اختيار صورة
                  </label>
                  {formData.logo && (
                    <p className="text-sm text-green-600 mt-2">
                      تم اختيار: {formData.logo.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {showPreview ? 'إخفاء المعاينة' : 'معاينة الإعلان'}
                </button>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    حفظ كمسودة
                  </button>

                  <button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        جاري النشر...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        نشر الإعلان
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Preview */}
            {showPreview && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة الإعلان</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{formData.title || 'عنوان الوظيفة'}</h4>
                  <p className="text-gray-600 mb-2">{formData.company || 'اسم الشركة'}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {ADEN_DISTRICTS.find(d => d.id === formData.district)?.name || 'المديرية'}
                  </p>
                  <p className="text-sm text-gray-700">
                    {formData.description ? 
                      (formData.description.length > 100 ? 
                        formData.description.substring(0, 100) + '...' : 
                        formData.description) : 
                      'وصف الوظيفة...'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">نصائح للنشر</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>اكتب عنواناً واضحاً ومحدداً</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>اذكر المتطلبات بوضوح</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>أضف معلومات التواصل الصحيحة</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>راجع البيانات قبل النشر</span>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="bg-yellow-50/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-200/50">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">سياسات النشر</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>يجب أن تكون المعلومات صادقة وقابلة للتحقق</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>سيتم مراجعة الإعلان قبل النشر</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>ستتلقى إشعاراً عند الموافقة على النشر</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
