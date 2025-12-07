import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { getJobsWithCategoryCounts, getJobStatistics, getFeaturedJobs, mockJobs, ADEN_DISTRICTS, searchJobs } from '@/data/jobs-enhanced';
import { adenJobsService } from '@/services/adenJobsService';
import QuickPostJob from './QuickPostJob';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  Phone,
  MessageCircle,
  Mail,
  Plus,
  Share2,
  Eye,
  Filter,
  X,
  Bell,
  User,
  Star,
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase,
  Zap,
  ArrowRight,
  ChevronRight,
  DollarSign
} from 'lucide-react';

// التخصصات المهنية في عدن
const ADEN_JOB_CATEGORIES = [
  { id: 'all', name: 'جميع التخصصات', icon: '💼', color: 'bg-gray-100 text-gray-700' },
  { id: 'education', name: 'تعليم وتدريب', icon: '🎓', color: 'bg-blue-100 text-blue-700' },
  { id: 'health', name: 'صحة وطب', icon: '🏥', color: 'bg-red-100 text-red-700' },
  { id: 'engineering', name: 'هندسة وتقنية', icon: '⚙️', color: 'bg-orange-100 text-orange-700' },
  { id: 'finance', name: 'مالية ومحاسبة', icon: '💰', color: 'bg-green-100 text-green-700' },
  { id: 'sales', name: 'مبيعات وتسويق', icon: '📈', color: 'bg-purple-100 text-purple-700' },
  { id: 'administration', name: 'إدارية وسكرتارية', icon: '📋', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'technical', name: 'تكنولوجيا المعلومات', icon: '💻', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'transport', name: 'نقل ومواصلات', icon: '🚗', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'tourism', name: 'سياحة وضيافة', icon: '🏨', color: 'bg-pink-100 text-pink-700' },
  { id: 'construction', name: 'بناء ومقاولات', icon: '🏗️', color: 'bg-amber-100 text-amber-700' },
  { id: 'security', name: 'أمن وحماية', icon: '🛡️', color: 'bg-slate-100 text-slate-700' },
  { id: 'media', name: 'إعلام وصحافة', icon: '📺', color: 'bg-violet-100 text-violet-700' },
  { id: 'legal', name: 'قانونية ومحاماة', icon: '⚖️', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'agriculture', name: 'زراعة وصيد', icon: '🐟', color: 'bg-lime-100 text-lime-700' },
  { id: 'services', name: 'خدمات عامة', icon: '🔧', color: 'bg-teal-100 text-teal-700' }
];


const AdenJobsPage = React.memo(() => {
  const [, setLocation] = useLocation();
  const [showCategories, setShowCategories] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [showJobTypeSelection, setShowJobTypeSelection] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [jobsFromSupabase, setJobsFromSupabase] = useState<any[]>([]);
  const hasSupabaseJobs = jobsFromSupabase.length > 0;
  
  // فلاتر البحث
  const [filters, setFilters] = useState({
    search: '',
    category: 'all'
  });

  // تحسين الأداء - منع إعادة الرسم غير الضرورية
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  // تحميل الوظائف من Supabase (الموافَق عليها والنشطة)
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('approval_status', 'approved')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((row: any) => ({
            id: row.id,
            title: row.title,
            company: row.company_name,
            companyName: row.company_name,
            location: row.location,
            category: row.category,
            jobType: row.job_type || null,
            type: row.job_type || null,
            experienceLevel: row.experience_level || null,
            experience: row.experience_level || null,
            salary: row.salary || null,
            description: row.description || '',
            requirements: row.requirements || [],
            benefits: row.benefits || [],
            contact: {
              person: row.contact_person || null,
              phone: row.contact_phone || null,
              email: row.contact_email || null,
              whatsapp: row.contact_whatsapp || null,
            },
            isFeatured: !!row.is_featured,
            featured: !!row.is_featured,
            isUrgent: !!row.is_urgent,
            urgent: !!row.is_urgent,
            postedAt: row.posted_at || row.created_at,
            views: row.views || 0,
            applications: row.applications || 0,
          }));

          setJobsFromSupabase(mapped);
        } else {
          setJobsFromSupabase([]);
        }
      } catch (error) {
        console.error('Error loading jobs from Supabase:', error);
        setJobsFromSupabase([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // تحميل البيانات
  const categoryCounts = useMemo(() => {
    try {
      return getJobsWithCategoryCounts();
    } catch (error) {
      console.error('Error loading category counts:', error);
      return {};
    }
  }, []);
  
  const jobStats = useMemo(() => {
    try {
      return getJobStatistics();
    } catch (error) {
      console.error('Error loading job stats:', error);
      return { totalJobs: 0, premiumJobs: 0, urgentJobs: 0, remoteJobs: 0 };
    }
  }, []);
  
  const featuredJobs = useMemo(() => {
    try {
      // حالياً لا نعرض الوظائف القادمة من Supabase في قسم الوظائف المميزة
      // سيتم تفعيل هذا لاحقاً عند تجهيز منطق الوظائف المميزة
      const jobs = getFeaturedJobs();
      // إضافة بيانات تجريبية إذا كانت فارغة
      if (jobs.length === 0) {
        return [
          {
            id: '1',
            title: 'مطور ويب',
            company: 'شركة عدن التقنية',
            companyName: 'شركة عدن التقنية',
            location: 'خور مكسر',
            category: 'تكنولوجيا المعلومات',
            jobType: 'دوام كامل',
            experienceLevel: 'متوسط',
            salary: '1,500,000 - 2,500,000 ريال يمني',
            description: 'نبحث عن مطور ويب ذو خبرة في React و Node.js',
            requirements: ['خبرة 2-3 سنوات', 'معرفة بـ React', 'معرفة بـ Node.js'],
            benefits: ['راتب تنافسي', 'تأمين صحي', 'بيئة عمل مرنة'],
            contact: {
              person: 'أحمد محمد',
              phone: '+967-777-123456',
              email: 'hr@aden-tech.com',
              whatsapp: '+967-777-123456'
            },
            views: 150,
            applications: 25,
            isFeatured: true,
            isUrgent: false,
            postedAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'ممرض/ممرضة',
            company: 'مستشفى عدن العام',
            companyName: 'مستشفى عدن العام',
            location: 'كريتر',
            category: 'صحة وطب',
            jobType: 'دوام كامل',
            experienceLevel: 'مبتدئ',
            salary: '800,000 - 1,200,000 ريال يمني',
            description: 'نبحث عن ممرض/ممرضة للعمل في قسم الطوارئ',
            requirements: ['شهادة تمريض', 'خبرة سنة واحدة على الأقل', 'القدرة على العمل تحت الضغط'],
            benefits: ['راتب شهري', 'تأمين صحي', 'إجازات سنوية'],
            contact: {
              person: 'د. فاطمة أحمد',
              phone: '+967-777-654321',
              email: 'hr@aden-hospital.com',
              whatsapp: '+967-777-654321'
            },
            views: 200,
            applications: 40,
            isFeatured: true,
            isUrgent: true,
            postedAt: new Date().toISOString()
          }
        ];
      }
      return jobs;
    } catch (error) {
      console.error('Error loading featured jobs:', error);
      return [];
    }
  }, []);

  // فلترة الوظائف
  const filteredJobs = useMemo(() => {
    try {
      if (hasSupabaseJobs) {
        let jobs = jobsFromSupabase;

        if (filters.category !== 'all') {
          jobs = jobs.filter(job => job.category === filters.category);
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          jobs = jobs.filter(job =>
            job.title.toLowerCase().includes(q) ||
            (job.companyName || job.company || '').toLowerCase().includes(q) ||
            (typeof job.location === 'string' ? job.location : '').toLowerCase().includes(q)
          );
        }

        return jobs;
      }

      const jobs = adenJobsService.searchJobs(filters.search, {
        category: filters.category !== 'all' ? filters.category : undefined
      });
      
      // إضافة بيانات تجريبية إذا كانت فارغة
      if (jobs.length === 0) {
        return [
          {
            id: '3',
            title: 'معلم رياضيات',
            company: 'مدرسة عدن الدولية',
            companyName: 'مدرسة عدن الدولية',
            location: 'الشيخ عثمان',
            category: 'تعليم وتدريب',
            jobType: 'دوام كامل',
            experienceLevel: 'متوسط',
            salary: '600,000 - 1,000,000 ريال يمني',
            description: 'نبحث عن معلم رياضيات للصفوف الابتدائية',
            requirements: ['شهادة جامعية في الرياضيات', 'خبرة تدريس سنة واحدة', 'القدرة على التعامل مع الأطفال'],
            benefits: ['راتب شهري', 'إجازات مدرسية', 'تطوير مهني'],
            contact: {
              person: 'أ. محمد علي',
              phone: '+967-777-789012',
              email: 'hr@aden-school.com',
              whatsapp: '+967-777-789012'
            },
            views: 80,
            applications: 15,
            isFeatured: false,
            isUrgent: false,
            postedAt: new Date().toISOString()
          },
          {
            id: '4',
            title: 'سائق توصيل',
            company: 'شركة عدن للخدمات',
            companyName: 'شركة عدن للخدمات',
            location: 'المعلا',
            category: 'نقل ومواصلات',
            jobType: 'دوام كامل',
            experienceLevel: 'مبتدئ',
            salary: '400,000 - 600,000 ريال يمني',
            description: 'نبحث عن سائق توصيل للعمل في خدمة التوصيل السريع',
            requirements: ['رخصة قيادة سارية', 'خبرة قيادة سنة واحدة', 'معرفة بطرق عدن'],
            benefits: ['راتب شهري', 'بدل وقود', 'عمولة إضافية'],
            contact: {
              person: 'أ. سالم أحمد',
              phone: '+967-777-345678',
              email: 'hr@aden-services.com',
              whatsapp: '+967-777-345678'
            },
            views: 120,
            applications: 30,
            isFeatured: false,
            isUrgent: false,
            postedAt: new Date().toISOString()
          },
          {
            id: '5',
            title: 'محاسب',
            company: 'مكتب المحاسبة العدني',
            companyName: 'مكتب المحاسبة العدني',
            location: 'كريتر',
            category: 'مالية ومحاسبة',
            jobType: 'دوام كامل',
            experienceLevel: 'متوسط',
            salary: '700,000 - 1,200,000 ريال يمني',
            description: 'نبحث عن محاسب ذو خبرة في المحاسبة المالية',
            requirements: ['شهادة محاسبة', 'خبرة 2-3 سنوات', 'معرفة برامج المحاسبة'],
            benefits: ['راتب تنافسي', 'تأمين صحي', 'بيئة عمل احترافية'],
            contact: {
              person: 'أ. فاطمة محمد',
              phone: '+967-777-456789',
              email: 'hr@aden-accounting.com',
              whatsapp: '+967-777-456789'
            },
            views: 90,
            applications: 20,
            isFeatured: false,
            isUrgent: false,
            postedAt: new Date().toISOString()
          }
        ];
      }
      return jobs;
    } catch (error) {
      console.error('Error filtering jobs:', error);
      return [];
    }
  }, [filters, hasSupabaseJobs, jobsFromSupabase]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);


  const handleContact = useCallback((job: any, method: 'phone' | 'whatsapp' | 'email') => {
    const phoneNumber = job.contact?.phone || '+967123456789';
    const message = `مرحباً، أنا مهتم بالوظيفة: ${job.title}`;
    
    switch (method) {
      case 'phone':
        window.open(`tel:${phoneNumber}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`);
        break;
      case 'email':
        const email = job.contact?.email || 'hr@company.com';
        const subject = `طلب توظيف - ${job.title}`;
        const body = `مرحباً،\n\nأنا مهتم بالوظيفة المعلن عنها: ${job.title}\n\nأرجو التواصل معي.\n\nشكراً`;
        window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
        break;
    }
  }, []);

  const handleJobClick = useCallback((job: any) => {
    setShowJobDetails(job);
  }, []);

  const handleCloseJobDetails = useCallback(() => {
    setShowJobDetails(null);
  }, []);

  const handleOpenQuickPost = useCallback(() => {
    setShowJobTypeSelection(false);
    setShowQuickPost(true);
  }, []);

  const handleCloseQuickPost = useCallback(() => {
    setShowQuickPost(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-400 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-slate-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-blue-300 rounded-full blur-2xl"></div>
      </div>
      
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            وظائف عدن
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            منصة التوظيف الرائدة في مدينة عدن
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  placeholder="ابحث عن وظيفة، شركة، مهارة، أو مجال..."
                  className="w-full pr-16 pl-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 shadow-lg bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                onClick={() => setShowJobTypeSelection(true)}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-6 h-6" />
                <span className="font-semibold text-lg">إضافة وظيفة</span>
              </button>
            </div>
          </form>

        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{(jobStats as any).total || (jobStats as any).totalJobs || 0}</div>
            <div className="text-gray-600">إجمالي الوظائف</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-7 h-7 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{(jobStats as any).featured || (jobStats as any).premiumJobs || 0}</div>
            <div className="text-gray-600">وظائف مميزة</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-7 h-7 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{(jobStats as any).urgent || (jobStats as any).urgentJobs || 0}</div>
            <div className="text-gray-600">وظائف عاجلة</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{(jobStats as any).remote || (jobStats as any).remoteJobs || 0}</div>
            <div className="text-gray-600">عمل عن بُعد</div>
          </div>
        </div>


        {/* التخصصات المتوفرة في عدن */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center justify-center gap-3 w-full p-4 text-blue-600 hover:text-blue-700 transition-colors rounded-xl hover:bg-blue-50"
          >
            <Target className="w-5 h-5" />
            <span className="font-semibold text-lg">التخصصات المتوفرة في عدن</span>
            {showCategories ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {/* Categories Grid */}
          {showCategories && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ADEN_JOB_CATEGORIES.filter(cat => cat.id !== 'all').map((category) => {
                  const count = categoryCounts[category.id] || 0;
                  return (
                    <div
                      key={category.id}
                      className={`${category.color} rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105`}
                      onClick={() => {
                        setFilters(prev => ({ ...prev, category: category.id }));
                        setShowCategories(false);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-sm font-bold">{count}</span>
                </div>
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className="text-xs opacity-75">
                        {count === 0 ? 'لا توجد وظائف' : `${count} وظيفة متاحة`}
                      </p>
                </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <div className="mb-12">
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-500" />
                الوظائف المميزة
              </h2>
              <div className="mt-3 rounded-xl border border-red-300 bg-red-50 text-red-800 text-sm px-4 py-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 mt-0.5 text-red-600" />
                <div>
                  <p className="font-semibold mb-1">تنبيه: هذا القسم ما زال قيد التطوير.</p>
                  <p className="text-xs sm:text-sm">
                    الوظائف المعروضة هنا هي بيانات تجريبية فقط لعرض شكل التصميم، وسيتم ربطها لاحقاً بالوظائف الحقيقية.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all cursor-pointer group hover:bg-white/90"
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {job.companyName?.charAt(0) || job.company?.charAt(0) || 'ش'}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors flex-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold">
                          مميزة
                        </span>
                      </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3 text-base">{job.companyName || job.company}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{typeof job.location === 'object' ? job.location.district : job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="truncate">{job.jobType || job.type || 'غير محدد'}</span>
                      </div>
                    </div>

                  {job.salary && (
                        <div className="text-green-600 font-bold text-base mb-3">
                      {typeof job.salary === 'object' && job.salary.min ? 
                            `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ريال يمني` : 
                        (typeof job.salary === 'string' ? job.salary : 'غير محدد')
                      }
          </div>
        )}

                      <div className="flex items-center justify-end">
                        <div className="text-blue-600 text-sm font-medium flex items-center gap-1">
                          <span>عرض التفاصيل</span>
                          <ChevronRight className="w-4 h-4" />
          </div>
                    </div>
                    </div>
                    </div>
                  </div>
              ))}
                </div>
          </div>
        )}


        {/* Job Listings */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              جميع الوظائف ({filteredJobs.length})
            </h2>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل الوظائف...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد وظائف مطابقة للبحث
                </h3>
                <p className="text-gray-600 mb-4">
                  جرب تغيير كلمات البحث أو الفلاتر
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {job.companyName?.charAt(0) || job.company?.charAt(0) || 'ش'}
                        </div>
                        
                    <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors flex-1">
                              {job.title}
                            </h3>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                              {(job.isUrgent || job.title.toLowerCase().includes('عاجل')) && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                  عاجل
                                </span>
                              )}
                              {(job.isPremium || job.featured) && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                  مميزة
                                </span>
                              )}
                            </div>
                          </div>
                          
                      <p className="text-gray-600 mb-3 text-base">{job.companyName || job.company}</p>
                          
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                          <span className="truncate">{typeof job.location === 'object' ? job.location.district : job.location}</span>
                            </div>
                        <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                          <span className="truncate">{job.jobType || job.type || 'غير محدد'}</span>
                            </div>
                          </div>
                          
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              {job.category}
                            </span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {job.experienceLevel || job.experience || 'غير محدد'}
                            </span>
                          </div>

                          {job.salary && (
                        <div className="text-green-600 font-bold text-base mb-3">
                              {typeof job.salary === 'object' && job.salary.min ? 
                                `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} ريال يمني` : 
                                (typeof job.salary === 'string' ? job.salary : 'غير محدد')
                              }
                            </div>
                          )}

                      <div className="flex items-center justify-end">
                        <div className="text-blue-600 text-sm font-medium flex items-center gap-1">
                          <span>عرض التفاصيل</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Professional Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-blue-200/50 dark:border-gray-600 mb-8">
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-blue-100/50 dark:hover:bg-gray-600/50 rounded-xl p-4 -m-4 transition-colors"
            onClick={() => setShowTips(!showTips)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">دليل التوظيف في عدن</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">نصائح احترافية ومحلية لنجاحك في سوق العمل العدني</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/80 hover:bg-white text-blue-700 rounded-xl transition-all shadow-sm hover:shadow-md">
              <span className="font-medium">
                {showTips ? 'إخفاء الدليل' : 'عرض الدليل'}
              </span>
              {showTips ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {showTips && (
            <div className="mt-8 space-y-8">
              {/* CV Writing Tips */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-blue-100 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">كتابة السيرة الذاتية المثالية لسوق عدن</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">المعلومات الأساسية</h5>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>اكتب باللغة العربية الفصحى مع الحفاظ على الوضوح</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>اذكر اسمك الكامل ورقم الهاتف مع رمز البلد (+967)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>حدد مديريتك في عدن بوضوح (كريتر، خور مكسر، إلخ)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>أضف صورة شخصية احترافية بخلفية بيضاء</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">المهارات والخبرات</h5>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>اذكر مهاراتك التقنية واللغوية بوضوح</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>رتب الخبرات من الأحدث للأقدم مع ذكر الفترات</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>أضف الإنجازات بالأرقام والنتائج الملموسة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>اذكر الدورات التدريبية والشهادات ذات الصلة</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Job Application Tips */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-6 border border-blue-100 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">استراتيجيات التقديم الناجح في عدن</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">قبل التقديم</h5>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>اقرأ وصف الوظيفة ومتطلباتها بعناية فائقة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>تأكد من توافق مؤهلاتك مع المتطلبات المذكورة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>ابحث عن معلومات الشركة وأنشطتها في عدن</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>جهز أسئلة ذكية للمقابلة الشخصية</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-800 dark:text-gray-200">أثناء التقديم</h5>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>تواصل مباشرة عبر واتساب للحصول على رد سريع</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>اكتب رسالة شخصية مختصرة ومهنية</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>أرفق السيرة الذاتية بصيغة PDF واضحة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span>تأكد من صحة معلومات التواصل وإمكانية الوصول</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-red-50/90 dark:bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-200/50 dark:border-red-800/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-800 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-lg font-bold text-red-900 dark:text-red-300">تحذيرات مهمة للباحثين عن عمل في عدن</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-red-800 dark:text-red-300">احذر من الاحتيال</h5>
                    <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <li>• لا تدفع أي رسوم مقدمة أو "رسوم تأمين"</li>
                      <li>• تأكد من صحة بيانات الشركة وعنوانها</li>
                      <li>• لا ترسل أوراقك الثبوتية الأصلية</li>
                      <li>• احذر من العروض "السهلة جداً" أو المبالغ فيها</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-semibold text-red-800 dark:text-red-300">علامات الوظائف المشبوهة</h5>
                    <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                      <li>• طلب دفع مبالغ مالية مقدماً</li>
                      <li>• عدم وجود عنوان واضح للشركة في عدن</li>
                      <li>• رفض إجراء مقابلة شخصية أو هاتفية</li>
                      <li>• وعود برواتب عالية جداً دون مبرر</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </main>

      {/* Floating Add Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
                  <button
          onClick={() => setShowJobTypeSelection(true)}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:scale-110 group"
                  >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                  </button>
      </div>

      {/* Job Type Selection Modal */}
      {showJobTypeSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-blue-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">اختر نوع الإعلان</h2>
              <p className="text-blue-100">اختر نوع الإعلان الذي تريد نشره</p>
            </div>

            <div className="space-y-4">
              {/* إعلان عادي */}
                  <button
                onClick={handleOpenQuickPost}
                className="w-full flex items-center gap-4 p-6 bg-white/10 hover:bg-white/20 rounded-xl border-2 border-white/20 hover:border-white/40 transition-all group backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <h3 className="font-bold text-white text-lg">إعلان عادي</h3>
                  <p className="text-blue-100 text-sm">نشر وظيفة مجاناً</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70" />
                  </button>

              {/* إعلان مميز */}
              <button
                disabled
                className="w-full flex items-center gap-4 p-6 bg-white/5 rounded-xl border-2 border-white/10 opacity-60 cursor-not-allowed relative backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-right flex-1">
                  <h3 className="font-bold text-white text-lg">إعلان مميز</h3>
                  <p className="text-blue-100 text-sm">وظيفة مميزة مع مزايا إضافية</p>
              </div>
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  قيد التطوير
            </div>
              </button>
        </div>

            <div className="mt-8 pt-6 border-t border-white/20">
        <button
                onClick={() => setShowJobTypeSelection(false)}
                className="w-full px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium backdrop-blur-sm border border-white/20"
        >
                إلغاء
        </button>
      </div>
          </div>
        </div>
      )}

      {/* Quick Post Job Modal */}
      <QuickPostJob 
        isOpen={showQuickPost} 
        onClose={handleCloseQuickPost} 
      />

      {/* Job Details Modal */}
      {showJobDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-700 shadow-2xl">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-sm rounded-t-xl p-6 text-white border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{showJobDetails.title}</h2>
                    <p className="text-blue-100">{showJobDetails.companyName || showJobDetails.company}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseJobDetails}
                  className="p-3 hover:bg-white/20 rounded-xl transition-colors border border-white/20"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-300" />
                  معلومات الوظيفة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">الموقع</p>
                      <p className="font-bold text-white text-base">{typeof showJobDetails.location === 'object' ? showJobDetails.location.district : showJobDetails.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">نوع الوظيفة</p>
                      <p className="font-bold text-white text-base">{showJobDetails.jobType || showJobDetails.type || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">مستوى الخبرة</p>
                      <p className="font-bold text-white text-base">{showJobDetails.experienceLevel || showJobDetails.experience || 'غير محدد'}</p>
                    </div>
                  </div>
                  {/* عدد المشاهدات - يظهر فقط لأصحاب الإعلانات */}
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-orange-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">المشاهدات</p>
                      <p className="font-bold text-white text-base">{showJobDetails.views || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary */}
              {showJobDetails.salary && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-300" />
                    الراتب
                  </h3>
                  <div className="text-green-300 font-bold text-xl">
                    {typeof showJobDetails.salary === 'object' && showJobDetails.salary.min ? 
                      `${showJobDetails.salary.min.toLocaleString()} - ${showJobDetails.salary.max.toLocaleString()} ريال يمني` : 
                      (typeof showJobDetails.salary === 'string' ? showJobDetails.salary : 'غير محدد')
                    }
                  </div>
                </div>
              )}

              {/* Description */}
              {showJobDetails.description && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-300" />
                    وصف الوظيفة
                  </h3>
                  <p className="text-blue-100 leading-relaxed">{showJobDetails.description}</p>
                </div>
              )}

              {/* Requirements */}
              {showJobDetails.requirements && showJobDetails.requirements.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-300" />
                    المتطلبات
                  </h3>
                  <ul className="space-y-2">
                    {showJobDetails.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-300 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-100">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {showJobDetails.benefits && showJobDetails.benefits.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-300" />
                    المزايا والفوائد
                  </h3>
                  <ul className="space-y-2">
                    {showJobDetails.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-100">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-300" />
                  معلومات التواصل
                </h3>
                <div className="space-y-4">
                  {/* المسؤول */}
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">المسؤول</p>
                      <p className="font-bold text-white text-base">
                        {showJobDetails.contact?.contactPerson || 
                         showJobDetails.contactPerson || 
                         'قسم الموارد البشرية'}
                      </p>
                    </div>
                  </div>
                  
                  {/* الهاتف */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-green-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">الهاتف</p>
                      <p className="font-bold text-white text-base">
                        {showJobDetails.contact?.phone || 
                         showJobDetails.phone || 
                         '+967123456789'}
                      </p>
                    </div>
                  </div>
                  
                  {/* البريد الإلكتروني */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">البريد الإلكتروني</p>
                      <p className="font-bold text-white text-base">
                        {showJobDetails.contact?.email || 
                         showJobDetails.email || 
                         'hr@company.com'}
                      </p>
                    </div>
                  </div>
                  
                  {/* واتساب */}
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-300" />
                    <div>
                      <p className="text-sm font-semibold text-blue-100 mb-1">واتساب</p>
                      <p className="font-bold text-white text-base">
                        {showJobDetails.contact?.whatsapp || 
                         showJobDetails.whatsapp || 
                         showJobDetails.contact?.phone || 
                         showJobDetails.phone || 
                         '+967123456789'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/20">
                <button
                  onClick={() => handleContact(showJobDetails, 'whatsapp')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  تواصل عبر واتساب
                </button>
                <button
                  onClick={() => handleContact(showJobDetails, 'phone')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-medium"
                >
                  <Phone className="w-5 h-5" />
                  اتصل مباشرة
                </button>
                <button
                  onClick={() => handleContact(showJobDetails, 'email')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg font-medium"
                >
                  <Mail className="w-5 h-5" />
                  إرسال بريد إلكتروني
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AppFooter />
    </div>
  );
});

export default AdenJobsPage;
