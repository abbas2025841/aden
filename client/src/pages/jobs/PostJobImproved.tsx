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
  X
} from 'lucide-react';

export default function PostJobImproved() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    company: '',
    location: '',
    category: '',
    jobType: '',
    salary: '',
    experience: '',
    education: '',
    
    // Description
    description: '',
    requirements: [''],
    benefits: [''],
    
    // Contact Info
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactWhatsapp: '',
    
    // Additional
    isUrgent: false,
    isRemote: false,
    deadline: '',
    numberOfPositions: 1
  });

  const categories = [
    { id: 'technical', name: 'تقنية وتكنولوجيا', icon: '💻' },
    { id: 'medical', name: 'طبية وصحية', icon: '🏥' },
    { id: 'education', name: 'تعليمية', icon: '🎓' },
    { id: 'engineering', name: 'هندسية', icon: '🔧' },
    { id: 'finance', name: 'مالية ومحاسبية', icon: '💰' },
    { id: 'sales', name: 'مبيعات وتسويق', icon: '💼' },
    { id: 'administration', name: 'إدارية', icon: '📋' },
    { id: 'security', name: 'أمنية', icon: '🛡️' },
    { id: 'service', name: 'خدمية', icon: '🔧' },
    { id: 'humanitarian', name: 'إنسانية', icon: '🤝' },
    { id: 'legal', name: 'قانونية', icon: '⚖️' },
    { id: 'media', name: 'إعلامية', icon: '📺' }
  ];

  const jobTypes = [
    { id: 'full-time', name: 'دوام كامل' },
    { id: 'part-time', name: 'دوام جزئي' },
    { id: 'contract', name: 'عقد' },
    { id: 'internship', name: 'تدريب' }
  ];

  const experienceLevels = [
    { id: 'entry', name: 'مبتدئ (0-2 سنة)' },
    { id: 'mid', name: 'متوسط (2-5 سنوات)' },
    { id: 'senior', name: 'خبير (5+ سنوات)' },
    { id: 'any', name: 'أي مستوى' }
  ];

  const educationLevels = [
    { id: 'high-school', name: 'ثانوي' },
    { id: 'diploma', name: 'دبلوم' },
    { id: 'bachelor', name: 'بكالوريوس' },
    { id: 'master', name: 'ماجستير' },
    { id: 'phd', name: 'دكتوراه' },
    { id: 'any', name: 'أي مؤهل' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'requirements' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // محاكاة إرسال البيانات
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('تم نشر الوظيفة بنجاح!');
    setLocation('/jobs');
  };

  const steps = [
    { number: 1, title: 'المعلومات الأساسية', icon: Building2, description: 'عنوان الوظيفة والشركة' },
    { number: 2, title: 'وصف الوظيفة', icon: FileText, description: 'المتطلبات والمزايا' },
    { number: 3, title: 'معلومات التواصل', icon: Users, description: 'بيانات المسؤول' },
    { number: 4, title: 'مراجعة النشر', icon: CheckCircle, description: 'التأكد من البيانات' }
  ];

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.company && formData.location && formData.category && formData.jobType;
      case 2:
        return formData.description && formData.requirements.some(req => req.trim());
      case 3:
        return formData.contactName && formData.contactPhone && formData.contactEmail;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setLocation('/jobs')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">نشر وظيفة جديدة</h1>
            <p className="text-gray-600">انشر وظيفتك واجذب أفضل المواهب</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isValid = isStepValid(step.number);
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center gap-3 ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-100' : 
                      isCompleted ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="hidden md:block">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl p-8 shadow-sm border">
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
                        الموقع *
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="مثال: عدن، اليمن"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        التخصص *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">اختر التخصص</option>
                        {categories.map(category => (
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
                        {jobTypes.map(type => (
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الخبرة المطلوبة
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر مستوى الخبرة</option>
                        {experienceLevels.map(level => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المؤهل المطلوب
                      </label>
                      <select
                        value={formData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">اختر المؤهل</option>
                        {educationLevels.map(level => (
                          <option key={level.id} value={level.id}>
                            {level.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عدد الوظائف
                      </label>
                      <input
                        type="number"
                        value={formData.numberOfPositions}
                        onChange={(e) => handleInputChange('numberOfPositions', parseInt(e.target.value))}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        آخر موعد للتقديم
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => handleInputChange('deadline', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isUrgent}
                        onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">وظيفة عاجلة</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isRemote}
                        onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">وظيفة عن بُعد</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Job Description */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl p-8 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">وصف الوظيفة</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        وصف الوظيفة *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="اكتب وصفاً مفصلاً للوظيفة..."
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المتطلبات
                      </label>
                      <div className="space-y-2">
                        {formData.requirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={req}
                              onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                              placeholder="اكتب متطلباً..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('requirements', index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('requirements')}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          إضافة متطلب
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المزايا
                      </label>
                      <div className="space-y-2">
                        {formData.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={benefit}
                              onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                              placeholder="اكتب ميزة..."
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('benefits', index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayItem('benefits')}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                          إضافة ميزة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl p-8 shadow-sm border">
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
                        البريد الإلكتروني *
                      </label>
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="مثال: hr@company.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="bg-white rounded-xl p-8 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">مراجعة النشر</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">معاينة الوظيفة</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{formData.title}</h4>
                          <p className="text-gray-600">{formData.company}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {formData.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formData.jobType}
                          </span>
                          {formData.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {formData.salary}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {formData.isUrgent && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                              عاجل
                            </span>
                          )}
                          {formData.isRemote && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              عن بُعد
                            </span>
                          )}
                        </div>
                        
                        <div className="prose max-w-none">
                          <p className="text-gray-700 whitespace-pre-line">{formData.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  السابق
                </button>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Save className="w-4 h-4" />
                    حفظ كمسودة
                  </button>

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                      disabled={!isStepValid(currentStep)}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          جاري النشر...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          نشر الوظيفة
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Progress Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">تقدم النشر</h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isCompleted = currentStep > step.number;
                  const isCurrent = currentStep === step.number;
                  const isValid = isStepValid(step.number);
                  
                  return (
                    <div key={step.number} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-100 text-green-600' :
                        isCurrent ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : step.number}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isCompleted ? 'text-green-700' :
                          isCurrent ? 'text-blue-700' :
                          'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                        {isCurrent && !isValid && (
                          <p className="text-xs text-red-600">يرجى إكمال الحقول المطلوبة</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
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
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
