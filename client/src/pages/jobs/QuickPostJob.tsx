import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import { 
  X,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  AlertCircle
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
  { id: 'buraika', name: 'البريقة' }
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

interface QuickPostJobProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickPostJob({ isOpen, onClose }: QuickPostJobProps) {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    district: '',
    category: '',
    salary: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactWhatsapp: '',
    contactEmail: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        company_name: formData.company,
        location: formData.district || 'عدن',
        category: formData.category,
        job_type: null,
        experience_level: null,
        salary: formData.salary || null,
        description: formData.description || null,
        requirements: null,
        benefits: null,
        contact_person: formData.contactName || null,
        contact_phone: formData.contactPhone,
        contact_email: formData.contactEmail || null,
        contact_whatsapp: formData.contactWhatsapp || null,
        is_featured: false,
        is_urgent: false,
        status: 'active',
      };

      console.log('إرسال وظيفة إلى Supabase:', payload);

      const { data, error } = await supabase
        .from('jobs')
        .insert(payload)
        .select();

      if (error) {
        console.error('خطأ في حفظ الوظيفة:', error);
        alert('فشل في حفظ بيانات الوظيفة: ' + error.message);
        setIsSubmitting(false);
        return;
      }

      console.log('تم حفظ الوظيفة في Supabase:', data);
      alert('تم إرسال الوظيفة بنجاح! سيتم مراجعتها والموافقة عليها من قبل الإدارة قبل عرضها في قائمة الوظائف.');

      onClose();
      setLocation('/jobs');
    } catch (err: any) {
      console.error('استثناء أثناء حفظ الوظيفة:', err);
      alert('حدث خطأ غير متوقع أثناء حفظ بيانات الوظيفة');
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.title && formData.company && formData.district && 
           formData.category && formData.description && formData.contactPhone;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 text-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">نشر وظيفة سريع</h2>
                <p className="text-white/90 text-sm">املأ البيانات الأساسية فقط</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                عنوان الوظيفة *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="مثال: مطور ويب Frontend"
                className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                اسم الشركة *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="مثال: شركة تقنية عدن"
                className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                المديرية *
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white"
                required
                name="district"
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
              <label className="block text-sm font-medium text-white mb-2">
                المجال *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white"
                required
                name="category"
              >
                <option value="">اختر المجال</option>
                {JOB_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-2">
                الراتب (اختياري)
              </label>
              <input
                type="text"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
                placeholder="مثال: 2,000,000 - 3,500,000 ريال يمني"
                className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
                name="salary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              وصف الوظيفة *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="اكتب وصفاً مختصراً للوظيفة والمهام المطلوبة..."
              rows={4}
              className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
              required
              name="description"
            />
          </div>

          {/* Contact Info */}
          <div className="bg-blue-800/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">معلومات التواصل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  اسم المسؤول
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
                  name="contactName"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="مثال: +967123456789"
                  className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
                  required
                  name="contactPhone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  واتساب
                </label>
                <input
                  type="tel"
                  value={formData.contactWhatsapp}
                  onChange={(e) => handleInputChange('contactWhatsapp', e.target.value)}
                  placeholder="مثال: +967123456789"
                  className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
                  name="contactWhatsapp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="مثال: hr@company.com"
                  className="w-full px-4 py-3 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-800 text-white placeholder-blue-200"
                  name="contactEmail"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري النشر...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  نشر الوظيفة
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
