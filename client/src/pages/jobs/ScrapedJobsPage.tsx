import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { jobScrapingService, JobCategory, ScrapedJob } from '@/services/jobScrapingService';
import { jobAutoUpdateService } from '@/services/jobAutoUpdateService';
import { jobFilterService, JobFilters, SortOptions } from '@/services/jobFilterService';
import JobNotifications from '@/components/jobs/JobNotifications';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Building2, 
  Calendar,
  Star,
  Heart,
  Bookmark
} from 'lucide-react';

export default function ScrapedJobsPage() {
  const [, setLocation] = useLocation();
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filters, setFilters] = useState<JobFilters>(jobFilterService.getDefaultFilters());
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'postedDate', direction: 'desc' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterStats, setFilterStats] = useState(jobFilterService.getFilterStats([]));

  // تحميل الوظائف
  useEffect(() => {
    const loadJobs = async () => {
      setIsLoading(true);
      try {
        const savedJobs = jobScrapingService.getSavedJobs();
        if (savedJobs.length > 0) {
          setCategories(savedJobs);
        }
        
        const updatedJobs = await jobScrapingService.updateJobs();
        setCategories(updatedJobs);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();

    // بدء التحديث التلقائي
    jobAutoUpdateService.startAutoUpdate(30);

    // الاشتراك في التحديثات
    const unsubscribe = jobAutoUpdateService.subscribe((updatedCategories) => {
      setCategories(updatedCategories);
      setLastUpdated(new Date());
    });

    return () => {
      unsubscribe();
      jobAutoUpdateService.stopAutoUpdate();
    };
  }, []);

  // تحديث الوظائف يدوياً
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const updatedJobs = await jobAutoUpdateService.forceUpdate();
      setCategories(updatedJobs);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // فلترة وترتيب الوظائف
  const filteredAndSortedJobs = useMemo(() => {
    const allJobs = categories.flatMap(cat => cat.jobs);
    const filteredJobs = jobFilterService.filterJobs(allJobs, filters);
    const sortedJobs = jobFilterService.sortJobs(filteredJobs, sortOptions);
    
    // تحديث إحصائيات الفلترة
    setFilterStats(jobFilterService.getFilterStats(allJobs, filters));
    
    return sortedJobs;
  }, [categories, filters, sortOptions]);

  // الحصول على قائمة الفئات
  const categoryOptions = [
    { id: 'all', name: 'جميع الفئات' },
    ...categories.map(category => ({
      id: category.id,
      name: category.name
    }))
  ];

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
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            الوظائف المتاحة في عدن
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            اكتشف أحدث الوظائف المتاحة في مدينة عدن من مختلف المواقع
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </div>
              <div className="text-gray-600">إجمالي الوظائف</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {categories.length}
              </div>
              <div className="text-gray-600">فئات مختلفة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {new Set(categories.flatMap(cat => cat.jobs.map(job => job.source))).size}
              </div>
              <div className="text-gray-600">مصادر مختلفة</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن وظيفة، شركة، أو موقع..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {jobFilterService.getFilterOptions().categories.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={`${sortOptions.field}-${sortOptions.direction}`}
              onChange={(e) => {
                const newSortOptions = jobFilterService.parseSortOption(e.target.value);
                setSortOptions(newSortOptions);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {jobFilterService.getFilterOptions().sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Notifications */}
            <JobNotifications />
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'جاري التحديث...' : 'تحديث'}
            </button>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              آخر تحديث: {lastUpdated.toLocaleString('ar-SA')}
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredAndSortedJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                لا توجد وظائف مطابقة للبحث
              </h3>
              <p className="text-gray-600">
                جرب تغيير كلمات البحث أو الفلاتر
              </p>
            </div>
          ) : (
            filteredAndSortedJobs.map((job, index) => (
              <div key={job.id} className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all ${
                index === 0 ? 'ring-2 ring-blue-200' : ''
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        job.category === 'medical' ? 'bg-red-100' :
                        job.category === 'education' ? 'bg-blue-100' :
                        job.category === 'technical' ? 'bg-purple-100' :
                        job.category === 'engineering' ? 'bg-orange-100' :
                        job.category === 'finance' ? 'bg-green-100' :
                        job.category === 'administration' ? 'bg-indigo-100' :
                        job.category === 'sales' ? 'bg-pink-100' :
                        job.category === 'security' ? 'bg-gray-100' :
                        job.category === 'service' ? 'bg-yellow-100' :
                        job.category === 'humanitarian' ? 'bg-teal-100' :
                        job.category === 'legal' ? 'bg-amber-100' :
                        job.category === 'media' ? 'bg-cyan-100' :
                        'bg-gray-100'
                      }`}>
                        <Building2 className={`w-6 h-6 ${
                          job.category === 'medical' ? 'text-red-600' :
                          job.category === 'education' ? 'text-blue-600' :
                          job.category === 'technical' ? 'text-purple-600' :
                          job.category === 'engineering' ? 'text-orange-600' :
                          job.category === 'finance' ? 'text-green-600' :
                          job.category === 'administration' ? 'text-indigo-600' :
                          job.category === 'sales' ? 'text-pink-600' :
                          job.category === 'security' ? 'text-gray-600' :
                          job.category === 'service' ? 'text-yellow-600' :
                          job.category === 'humanitarian' ? 'text-teal-600' :
                          job.category === 'legal' ? 'text-amber-600' :
                          job.category === 'media' ? 'text-cyan-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          {index === 0 && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              جديد
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.postedDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className={`px-2 py-1 rounded text-xs ${
                              job.type === 'full-time' ? 'bg-green-100 text-green-700' :
                              job.type === 'part-time' ? 'bg-yellow-100 text-yellow-700' :
                              job.type === 'contract' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {job.type === 'full-time' ? 'دوام كامل' :
                               job.type === 'part-time' ? 'دوام جزئي' :
                               job.type === 'contract' ? 'عقد' : job.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                            {job.source}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            job.category === 'medical' ? 'bg-red-100 text-red-700' :
                            job.category === 'education' ? 'bg-blue-100 text-blue-700' :
                            job.category === 'technical' ? 'bg-purple-100 text-purple-700' :
                            job.category === 'engineering' ? 'bg-orange-100 text-orange-700' :
                            job.category === 'finance' ? 'bg-green-100 text-green-700' :
                            job.category === 'administration' ? 'bg-indigo-100 text-indigo-700' :
                            job.category === 'sales' ? 'bg-pink-100 text-pink-700' :
                            job.category === 'security' ? 'bg-gray-100 text-gray-700' :
                            job.category === 'service' ? 'bg-yellow-100 text-yellow-700' :
                            job.category === 'humanitarian' ? 'bg-teal-100 text-teal-700' :
                            job.category === 'legal' ? 'bg-amber-100 text-amber-700' :
                            job.category === 'media' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {job.category === 'medical' ? 'طبي' :
                             job.category === 'education' ? 'تعليمي' :
                             job.category === 'technical' ? 'تقني' :
                             job.category === 'engineering' ? 'هندسي' :
                             job.category === 'finance' ? 'مالي' :
                             job.category === 'administration' ? 'إداري' :
                             job.category === 'sales' ? 'تجاري' :
                             job.category === 'security' ? 'أمني' :
                             job.category === 'service' ? 'خدمي' :
                             job.category === 'humanitarian' ? 'إنساني' :
                             job.category === 'legal' ? 'قانوني' :
                             job.category === 'media' ? 'إعلامي' :
                             'أخرى'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:shadow-lg"
                    >
                      عرض التفاصيل
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
