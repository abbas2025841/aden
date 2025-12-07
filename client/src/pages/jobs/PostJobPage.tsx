import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import {
  JOB_CATEGORIES,
  ADEN_DISTRICTS,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  EDUCATION_LEVELS,
  COMPANY_TYPES,
} from "@/data/jobs-enhanced";
import { jobsTheme, commonStyles } from "./jobs-theme";
import {
  Save,
  Eye,
  Plus,
  X,
  Building,
  Briefcase,
  Clock,
  Users,
  Phone,
  Star,
  Zap,
  Globe2,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
  Heart,
  Target,
  Lightbulb,
  Rocket,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface JobFormData {
  title: string;
  category: string;
  companyName: string;
  companyType: string;
  companySize: string;
  location: {
    city: string;
    district: string;
    address: string;
  };
  jobType: string;
  salary: {
    min: number;
    max: number;
    currency: "YER";
    isNegotiable: boolean;
    includesBenefits: boolean;
  } | null;
  description: string;
  requirements: string[];
  benefits: string[];
  responsibilities: string[];
  skills: string[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    contactPerson: string;
  };
  experienceLevel: string;
  workingHours: string;
  gender: string;
  education: string;
  ageRange: {
    min: number;
    max: number;
  } | null;
  languages: string[];
  applicationMethod: string;
  isPremium: boolean;
  isUrgent: boolean;
  isRemote: boolean;
  isPartTime: boolean;
  expiryDate: string;
}

export default function PostJobPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showTips, setShowTips] = useState(true);
  const [autoSave, setAutoSave] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    category: "",
    companyName: "",
    companyType: "",
    companySize: "",
    location: {
      city: "عدن",
      district: "",
      address: "",
    },
    jobType: "",
    salary: null,
    description: "",
    requirements: [],
    benefits: [],
    responsibilities: [],
    skills: [],
    contact: {
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
      contactPerson: "",
    },
    experienceLevel: "",
    workingHours: "",
    gender: "غير محدد",
    education: "",
    ageRange: null,
    languages: ["العربية"],
    applicationMethod: "واتساب",
    isPremium: false,
    isUrgent: false,
    isRemote: false,
    isPartTime: false,
    expiryDate: "",
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.companyName) {
        localStorage.setItem('jobFormDraft', JSON.stringify(formData));
        setAutoSave(true);
        setTimeout(() => setAutoSave(false), 2000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('jobFormDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Form validation with detailed error messages
  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'title':
        if (!value || value.trim().length < 3) return 'عنوان الوظيفة يجب أن يكون 3 أحرف على الأقل';
        if (value.length > 100) return 'عنوان الوظيفة يجب أن يكون أقل من 100 حرف';
        return '';
      case 'companyName':
        if (!value || value.trim().length < 2) return 'اسم الشركة مطلوب';
        return '';
      case 'description':
        if (!value || value.trim().length < 20) return 'وصف الوظيفة يجب أن يكون 20 حرف على الأقل';
        if (value.length > 2000) return 'وصف الوظيفة يجب أن يكون أقل من 2000 حرف';
        return '';
      case 'phone':
        if (!value) return 'رقم الهاتف مطلوب';
        if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) return 'رقم الهاتف غير صحيح';
        return '';
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'البريد الإلكتروني غير صحيح';
        return '';
      case 'salary':
        if (value && value.min && value.max && value.min > value.max) {
          return 'الحد الأدنى للراتب يجب أن يكون أقل من الحد الأقصى';
        }
        return '';
      default:
        return '';
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        errors.title = validateField('title', formData.title);
        errors.companyName = validateField('companyName', formData.companyName);
        errors.description = validateField('description', formData.description);
        if (!formData.category) errors.category = 'فئة الوظيفة مطلوبة';
        if (!formData.companyType) errors.companyType = 'نوع الشركة مطلوب';
        break;
      case 2:
        if (!formData.location.district) errors.district = 'المنطقة مطلوبة';
        if (!formData.jobType) errors.jobType = 'نوع الوظيفة مطلوب';
        if (!formData.experienceLevel) errors.experienceLevel = 'مستوى الخبرة مطلوب';
        if (!formData.workingHours) errors.workingHours = 'ساعات العمل مطلوبة';
        errors.salary = validateField('salary', formData.salary);
        break;
      case 3:
        if (formData.requirements.length === 0) errors.requirements = 'يجب إضافة متطلب واحد على الأقل';
        break;
      case 4:
        errors.phone = validateField('phone', formData.contact.phone);
        errors.email = validateField('email', formData.contact.email);
        break;
    }
    
    setFormErrors(errors);
    return Object.values(errors).every(error => error === '');
  };

  const updateFormData = (field: keyof JobFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedFormData = (
    parentField: keyof JobFormData,
    childField: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any),
        [childField]: value,
      },
    }));
  };

  const addToList = (
    field: "requirements" | "benefits" | "responsibilities" | "skills",
    value: string,
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
    }
  };

  const removeFromList = (
    field: "requirements" | "benefits" | "responsibilities" | "skills",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Form validation for each step (updated to use new validation)
  const isStepValid = (step: number) => {
    return validateStep(step);
  };

  const handleNext = () => {
    if (isStepValid(currentStep) && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Final validation
      if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
        setCurrentStep(1);
        setIsLoading(false);
        return;
      }

    // Generate unique ID and posted date
    const newJob = {
      ...formData,
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postedDate: new Date().toISOString(),
      views: 0,
      applications: 0,
      isActive: true,
      verified: false,
        featured: formData.isPremium,
        tags: formData.skills,
        priority: formData.isUrgent ? 'high' : 'normal',
        status: 'pending',
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("New Job Submitted:", newJob);
      
      // Clear draft
      localStorage.removeItem('jobFormDraft');
      
    setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting job:', error);
      // Handle error (show error message)
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      companyName: "",
      companyType: "",
      companySize: "",
      location: {
        city: "عدن",
        district: "",
        address: "",
      },
      jobType: "",
      salary: null,
      description: "",
      requirements: [],
      benefits: [],
      responsibilities: [],
      skills: [],
      contact: {
        phone: "",
        whatsapp: "",
        email: "",
        website: "",
        contactPerson: "",
      },
      experienceLevel: "",
      workingHours: "",
      gender: "غير محدد",
      education: "",
      ageRange: null,
      languages: ["العربية"],
      applicationMethod: "واتساب",
      isPremium: false,
      isUrgent: false,
      isRemote: false,
      isPartTime: false,
      expiryDate: "",
    });
    setCurrentStep(1);
    setIsSubmitted(false);
  };

  const steps = [
    { number: 1, title: "معلومات أساسية", icon: Briefcase, description: "عنوان الوظيفة والشركة" },
    { number: 2, title: "تفاصيل الوظيفة", icon: Building, description: "الموقع والراتب والمتطلبات" },
    { number: 3, title: "متطلبات ومزايا", icon: Users, description: "المهارات والمسؤوليات" },
    { number: 4, title: "معلومات الاتصال", icon: Phone, description: "طرق التواصل" },
    { number: 5, title: "مراجعة ونشر", icon: Eye, description: "مراجعة نهائية" },
  ];

  // Helper component for form field with error display
  const FormField = ({ 
    label, 
    children, 
    error, 
    required = false, 
    icon: Icon,
    tip 
  }: { 
    label: string; 
    children: React.ReactNode; 
    error?: string; 
    required?: boolean;
    icon?: React.ComponentType<any>;
    tip?: string;
  }) => (
    <div className="space-y-2">
      <label className={`${jobsTheme.captionText} font-semibold flex items-center gap-2`}>
        {Icon && <Icon className="w-4 h-4" />}
        {label}
        {required && <span className="text-red-500">*</span>}
        {tip && (
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      {tip && showTips && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{tip}</span>
          </div>
        </div>
      )}
    </div>
  );

  // Helper component for progress indicator
  const ProgressIndicator = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          الخطوة {currentStep} من {steps.length}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((currentStep / steps.length) * 100)}% مكتمل
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );

  // Helper component for auto-save indicator
  const AutoSaveIndicator = () => (
    autoSave && (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm font-medium">تم الحفظ التلقائي</span>
      </div>
    )
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Success Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
            <div>
                  <h3 className="font-bold text-green-800 mb-2">نصائح لنشر وظيفة ناجحة</h3>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• استخدم عنوان واضح ومحدد للوظيفة</li>
                    <li>• اكتب وصفاً شاملاً للمسؤوليات والمتطلبات</li>
                    <li>• حدد الراتب والمزايا بوضوح</li>
                    <li>• أضف معلومات الاتصال الصحيحة</li>
                  </ul>
                </div>
              </div>
            </div>

            <FormField
              label="عنوان الوظيفة"
              required
              error={formErrors.title}
              icon={Briefcase}
              tip="استخدم عنواناً واضحاً ومحدداً يجذب المرشحين المناسبين"
            >
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  updateFormData("title", e.target.value);
                  setFormErrors(prev => ({ ...prev, title: '' }));
                }}
                placeholder="مثال: مندوب مبيعات - قطاع التكنولوجيا"
                className={`${commonStyles.input} text-right ${formErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
            </FormField>

            <FormField
              label="فئة الوظيفة"
              required
              error={formErrors.category}
              icon={Target}
              tip="اختر الفئة التي تناسب طبيعة الوظيفة"
            >
              <select
                value={formData.category}
                onChange={(e) => {
                  updateFormData("category", e.target.value);
                  setFormErrors(prev => ({ ...prev, category: '' }));
                }}
                className={`${commonStyles.input} text-right ${formErrors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              >
                <option value="">اختر الفئة</option>
                {JOB_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="اسم الشركة"
              required
              error={formErrors.companyName}
              icon={Building}
              tip="أدخل الاسم الرسمي للشركة أو المؤسسة"
            >
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => {
                  updateFormData("companyName", e.target.value);
                  setFormErrors(prev => ({ ...prev, companyName: '' }));
                }}
                placeholder="مثال: شركة عدن التجارية"
                className={`${commonStyles.input} text-right ${formErrors.companyName ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="نوع الشركة"
                required
                error={formErrors.companyType}
                icon={Shield}
                tip="اختر نوع الشركة أو المؤسسة"
              >
                <select
                  value={formData.companyType}
                  onChange={(e) => {
                    updateFormData("companyType", e.target.value);
                    setFormErrors(prev => ({ ...prev, companyType: '' }));
                  }}
                  className={`${commonStyles.input} text-right ${formErrors.companyType ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                >
                  <option value="">اختر النوع</option>
                  {COMPANY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="حجم الشركة"
                icon={Users}
                tip="اختر حجم الشركة حسب عدد الموظفين"
              >
                <select
                  value={formData.companySize}
                  onChange={(e) => updateFormData("companySize", e.target.value)}
                  className={`${commonStyles.input} text-right`}
                >
                  <option value="">اختر الحجم</option>
                  <option value="صغيرة (1-10)">صغيرة (1-10)</option>
                  <option value="متوسطة (11-50)">متوسطة (11-50)</option>
                  <option value="كبيرة (51-200)">كبيرة (51-200)</option>
                  <option value="كبيرة جداً (200+)">كبيرة جداً (200+)</option>
                </select>
              </FormField>
            </div>

            <FormField
              label="وصف الوظيفة"
              required
              error={formErrors.description}
              icon={FileText}
              tip="اكتب وصفاً شاملاً للوظيفة يتضمن المسؤوليات والمتطلبات"
            >
              <textarea
                value={formData.description}
                onChange={(e) => {
                  updateFormData("description", e.target.value);
                  setFormErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="اكتب وصفاً مفصلاً للوظيفة يتضمن المسؤوليات والمتطلبات..."
                className={`${commonStyles.input} text-right h-32 resize-none ${formErrors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              <div className="text-xs text-gray-500 text-left">
                {formData.description.length}/2000 حرف
            </div>
            </FormField>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`${jobsTheme.captionText} font-semibold mb-2 block`}
                >
                  المنطقة *
                </label>
                <select
                  value={formData.location.district}
                  onChange={(e) =>
                    updateNestedFormData("location", "district", e.target.value)
                  }
                  className={`${commonStyles.input} text-right`}
                  required
                >
                  <option value="">اختر المنطقة</option>
                  {ADEN_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`${jobsTheme.captionText} font-semibold mb-2 block`}
                >
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) =>
                    updateNestedFormData("location", "address", e.target.value)
                  }
                  placeholder="مثال: شارع الجمهورية، كريتر"
                  className={`${commonStyles.input} text-right`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`${jobsTheme.captionText} font-semibold mb-2 block`}
                >
                  نوع الوظيفة *
                </label>
                <select
                  value={formData.jobType}
                  onChange={(e) => updateFormData("jobType", e.target.value)}
                  className={`${commonStyles.input} text-right`}
                  required
                >
                  <option value="">اختر النوع</option>
                  {JOB_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`${jobsTheme.captionText} font-semibold mb-2 block`}
                >
                  ساعات العمل *
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) =>
                    updateFormData("workingHours", e.target.value)
                  }
                  placeholder="مثال: 8:00 ص - 5:00 م"
                  className={`${commonStyles.input} text-right`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className={`${jobsTheme.captionText} font-semibold mb-2 block`}
                >
                  مستوى الخبرة *
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) =>
                    updateFormData("experienceLevel", e.target.value)
                  }
                  className={`${commonStyles.input} text-right`}
                  required
                >
                  <option value="">اختر المستوى</option>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`${jobsTheme.captionText} font-semibold mb-2 block`}
                >
                  المؤهل العلمي *
                </label>
                <select
                  value={formData.education}
                  onChange={(e) => updateFormData("education", e.target.value)}
                  className={`${commonStyles.input} text-right`}
                  required
                >
                  <option value="">اختر المؤهل</option>
                  {EDUCATION_LEVELS.map((education) => (
                    <option key={education.value} value={education.value}>
                      {education.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                الراتب (ريال يمني)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  value={formData.salary?.min || ""}
                  onChange={(e) =>
                    updateFormData("salary", {
                      ...formData.salary,
                      min: e.target.value ? Number(e.target.value) : 0,
                      max: formData.salary?.max || 0,
                      currency: "YER",
                      isNegotiable: formData.salary?.isNegotiable || false,
                      includesBenefits:
                        formData.salary?.includesBenefits || false,
                    })
                  }
                  placeholder="الحد الأدنى"
                  className={`${commonStyles.input} text-right`}
                />
                <input
                  type="number"
                  value={formData.salary?.max || ""}
                  onChange={(e) =>
                    updateFormData("salary", {
                      ...formData.salary,
                      min: formData.salary?.min || 0,
                      max: e.target.value ? Number(e.target.value) : 0,
                      currency: "YER",
                      isNegotiable: formData.salary?.isNegotiable || false,
                      includesBenefits:
                        formData.salary?.includesBenefits || false,
                    })
                  }
                  placeholder="الحد الأقصى"
                  className={`${commonStyles.input} text-right`}
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.salary?.isNegotiable || false}
                      onChange={(e) =>
                        updateFormData("salary", {
                          ...formData.salary,
                          min: formData.salary?.min || 0,
                          max: formData.salary?.max || 0,
                          currency: "YER",
                          isNegotiable: e.target.checked,
                          includesBenefits:
                            formData.salary?.includesBenefits || false,
                        })
                      }
                      className="rounded"
                    />
                    <span className={jobsTheme.captionText}>قابل للتفاوض</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isRemote}
                  onChange={(e) => updateFormData("isRemote", e.target.checked)}
                  className="rounded"
                />
                <Globe2 className="w-4 h-4" />
                <span className={jobsTheme.captionText}>عمل عن بُعد</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPartTime}
                  onChange={(e) =>
                    updateFormData("isPartTime", e.target.checked)
                  }
                  className="rounded"
                />
                <Clock className="w-4 h-4" />
                <span className={jobsTheme.captionText}>دوام جزئي</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isUrgent}
                  onChange={(e) => updateFormData("isUrgent", e.target.checked)}
                  className="rounded"
                />
                <Zap className="w-4 h-4" />
                <span className={jobsTheme.captionText}>عاجل</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) =>
                    updateFormData("isPremium", e.target.checked)
                  }
                  className="rounded"
                />
                <Star className="w-4 h-4" />
                <span className={jobsTheme.captionText}>مميز</span>
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Requirements */}
            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                المتطلبات *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="أضف متطلب جديد"
                  className={`${commonStyles.input} text-right flex-1`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addToList("requirements", newRequirement);
                      setNewRequirement("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    addToList("requirements", newRequirement);
                    setNewRequirement("");
                  }}
                  className={`${commonStyles.button} ${jobsTheme.primaryButton} px-4`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                  >
                    <span
                      className={`${jobsTheme.captionText} flex-1 text-right`}
                    >
                      {req}
                    </span>
                    <button
                      onClick={() => removeFromList("requirements", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                المزايا
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="أضف ميزة جديدة"
                  className={`${commonStyles.input} text-right flex-1`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addToList("benefits", newBenefit);
                      setNewBenefit("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    addToList("benefits", newBenefit);
                    setNewBenefit("");
                  }}
                  className={`${commonStyles.button} ${jobsTheme.primaryButton} px-4`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                  >
                    <span
                      className={`${jobsTheme.captionText} flex-1 text-right`}
                    >
                      {benefit}
                    </span>
                    <button
                      onClick={() => removeFromList("benefits", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                المسؤوليات
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  placeholder="أضف مسؤولية جديدة"
                  className={`${commonStyles.input} text-right flex-1`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addToList("responsibilities", newResponsibility);
                      setNewResponsibility("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    addToList("responsibilities", newResponsibility);
                    setNewResponsibility("");
                  }}
                  className={`${commonStyles.button} ${jobsTheme.primaryButton} px-4`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.responsibilities.map((resp, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                  >
                    <span
                      className={`${jobsTheme.captionText} flex-1 text-right`}
                    >
                      {resp}
                    </span>
                    <button
                      onClick={() => removeFromList("responsibilities", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                المهارات المطلوبة
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="أضف مهارة جديدة"
                  className={`${commonStyles.input} text-right flex-1`}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addToList("skills", newSkill);
                      setNewSkill("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    addToList("skills", newSkill);
                    setNewSkill("");
                  }}
                  className={`${commonStyles.button} ${jobsTheme.primaryButton} px-4`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeFromList("skills", index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.contact.phone}
                onChange={(e) =>
                  updateNestedFormData("contact", "phone", e.target.value)
                }
                placeholder="+967-777-123456"
                className={`${commonStyles.input} text-right`}
                required
              />
            </div>

            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                رقم الواتساب
              </label>
              <input
                type="tel"
                value={formData.contact.whatsapp}
                onChange={(e) =>
                  updateNestedFormData("contact", "whatsapp", e.target.value)
                }
                placeholder="+967-777-123456"
                className={`${commonStyles.input} text-right`}
              />
            </div>

            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={(e) =>
                  updateNestedFormData("contact", "email", e.target.value)
                }
                placeholder="hr@company.com"
                className={`${commonStyles.input} text-right`}
              />
            </div>

            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                موقع الشركة
              </label>
              <input
                type="url"
                value={formData.contact.website}
                onChange={(e) =>
                  updateNestedFormData("contact", "website", e.target.value)
                }
                placeholder="https://www.company.com"
                className={`${commonStyles.input} text-right`}
              />
            </div>

            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                اسم المسؤول عن التوظيف
              </label>
              <input
                type="text"
                value={formData.contact.contactPerson}
                onChange={(e) =>
                  updateNestedFormData(
                    "contact",
                    "contactPerson",
                    e.target.value,
                  )
                }
                placeholder="أحمد محمد"
                className={`${commonStyles.input} text-right`}
              />
            </div>

            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                طريقة التقديم المفضلة
              </label>
              <select
                value={formData.applicationMethod}
                onChange={(e) =>
                  updateFormData("applicationMethod", e.target.value)
                }
                className={`${commonStyles.input} text-right`}
              >
                <option value="واتساب">واتساب</option>
                <option value="اتصال مباشر">اتصال مباشر</option>
                <option value="إيميل">إيميل</option>
                <option value="موقع الشركة">موقع الشركة</option>
                <option value="مقابلة شخصية">مقابلة شخصية</option>
              </select>
            </div>

            <div>
              <label
                className={`${jobsTheme.captionText} font-semibold mb-2 block`}
              >
                تاريخ انتهاء الإعلان
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => updateFormData("expiryDate", e.target.value)}
                className={`${commonStyles.input} text-right`}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div
              className={`${jobsTheme.cardBackground} ${jobsTheme.borderRadius} ${jobsTheme.cardPaddingLarge} ${jobsTheme.accentBorder}`}
            >
              <h3 className={`${jobsTheme.heading3} mb-4`}>معاينة الإعلان</h3>

              <div className="space-y-4">
                <div>
                  <h4 className={`${jobsTheme.heading3} text-orange-600`}>
                    {formData.title}
                  </h4>
                  <p className={`${jobsTheme.bodyText} font-semibold`}>
                    {formData.companyName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className={`${jobsTheme.captionText} font-semibold`}>
                      الفئة:
                    </span>
                    <span className={`${jobsTheme.captionText} mr-2`}>
                      {formData.category}
                    </span>
                  </div>
                  <div>
                    <span className={`${jobsTheme.captionText} font-semibold`}>
                      المنطقة:
                    </span>
                    <span className={`${jobsTheme.captionText} mr-2`}>
                      {formData.location.district}
                    </span>
                  </div>
                  <div>
                    <span className={`${jobsTheme.captionText} font-semibold`}>
                      نوع الوظيفة:
                    </span>
                    <span className={`${jobsTheme.captionText} mr-2`}>
                      {formData.jobType}
                    </span>
                  </div>
                  <div>
                    <span className={`${jobsTheme.captionText} font-semibold`}>
                      مستوى الخبرة:
                    </span>
                    <span className={`${jobsTheme.captionText} mr-2`}>
                      {formData.experienceLevel}
                    </span>
                  </div>
                </div>

                {formData.salary && (
                  <div>
                    <span className={`${jobsTheme.captionText} font-semibold`}>
                      الراتب:
                    </span>
                    <span className={`${jobsTheme.captionText} mr-2`}>
                      {formData.salary.min.toLocaleString()} -{" "}
                      {formData.salary.max.toLocaleString()} ريال يمني
                    </span>
                  </div>
                )}

                <div>
                  <span className={`${jobsTheme.captionText} font-semibold`}>
                    الوصف:
                  </span>
                  <p className={`${jobsTheme.bodyText} mt-1`}>
                    {formData.description}
                  </p>
                </div>

                {formData.requirements.length > 0 && (
                  <div>
                    <span className={`${jobsTheme.captionText} font-semibold`}>
                      المتطلبات:
                    </span>
                    <ul
                      className={`${jobsTheme.bodyText} mt-1 list-disc list-inside`}
                    >
                      {formData.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.benefits.length > 0 && (
                  <div>
                    <span className={`${jobsTheme.captionText} font-semibold`}>
                      المزايا:
                    </span>
                    <ul
                      className={`${jobsTheme.bodyText} mt-1 list-disc list-inside`}
                    >
                      {formData.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <span className={`${jobsTheme.captionText} font-semibold`}>
                    معلومات الاتصال:
                  </span>
                  <div className={`${jobsTheme.bodyText} mt-1`}>
                    <p>الهاتف: {formData.contact.phone}</p>
                    {formData.contact.whatsapp && (
                      <p>الواتساب: {formData.contact.whatsapp}</p>
                    )}
                    {formData.contact.email && (
                      <p>الإيميل: {formData.contact.email}</p>
                    )}
                    {formData.contact.contactPerson && (
                      <p>المسؤول: {formData.contact.contactPerson}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show success message if submitted
  if (isSubmitted) {
    return (
      <div
        className={`min-h-screen ${jobsTheme.pageBackground} page-transition`}
      >
        <AppHeader />

        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center">
            <div
              className={`${jobsTheme.cardBackground} ${jobsTheme.borderRadius} ${jobsTheme.cardPaddingLarge} ${jobsTheme.accentBorder} max-w-2xl mx-auto`}
            >
              <div className="text-6xl mb-6">🎉</div>
              <h1 className={`${jobsTheme.heading1} mb-4 text-green-600`}>
                تم نشر وظيفتك بنجاح!
              </h1>
              <p className={`${jobsTheme.bodyText} mb-8`}>
                شكراً لك على نشر الوظيفة. سيتم مراجعتها ونشرها قريباً.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetForm}
                  className={`${commonStyles.button} ${jobsTheme.primaryButton} ${jobsTheme.captionText} font-semibold px-6 py-3`}
                >
                  إضافة وظيفة أخرى
                </button>
                <button
                  onClick={() => setLocation("/jobs/list")}
                  className={`${commonStyles.button} ${jobsTheme.secondaryButton} ${jobsTheme.captionText} font-semibold px-6 py-3`}
                >
                  العودة للوظائف
                </button>
              </div>
            </div>
          </div>
        </main>

        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-slate-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-300 rounded-full blur-2xl"></div>
      </div>
      
      <AppHeader />
      <AutoSaveIndicator />

      <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">نشر وظيفة جديدة</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            انشر وظيفتك واجذب أفضل المواهب في عدن
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">+25%</span>
              </div>
              <p className="text-sm text-gray-600">زيادة في الطلب</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">500+</span>
              </div>
              <p className="text-sm text-gray-600">وظيفة نشطة</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">95%</span>
              </div>
              <p className="text-sm text-gray-600">معدل الرضا</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator />

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center">
                    <div className="flex items-center gap-3">
                  <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                            ? "bg-blue-600 text-white shadow-lg scale-110"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                      ) : (
                          <Icon className="w-5 h-5" />
                      )}
                    </div>
                      <div className="hidden md:block">
                        <div className={`font-semibold ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                      {step.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {step.description}
                        </div>
                      </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                        className={`w-12 h-0.5 mx-4 transition-all duration-300 ${
                        isCompleted ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:shadow-md"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            السابق
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all hover:shadow-md"
            >
                <Eye className="w-5 h-5" />
              معاينة
            </button>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                    isStepValid(currentStep)
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                التالي
                  <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري النشر...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                نشر الوظيفة
                    </>
                  )}
              </button>
            )}
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
