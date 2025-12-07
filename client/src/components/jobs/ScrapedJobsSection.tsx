import React from 'react';
import { JobCategory, ScrapedJob } from '@/services/jobScrapingService';
import { MapPin, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface ScrapedJobsSectionProps {
  categories: JobCategory[];
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export default function ScrapedJobsSection({ 
  categories, 
  isLoading, 
  lastUpdated, 
  onRefresh 
}: ScrapedJobsSectionProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 mb-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <ExternalLink className="w-8 h-8 text-blue-500" />
          الوظائف المتاحة في عدن
        </h3>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              آخر تحديث: {lastUpdated.toLocaleTimeString('ar-SA')}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'جاري التحديث...' : 'تحديث'}
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {category.count}
              </span>
            </div>
            
            <div className="space-y-3">
              {category.jobs.slice(0, 3).map((job, index) => (
                <div key={job.id} className={`border-l-4 pl-4 py-2 rounded-r-lg ${
                  index === 0 ? 'border-blue-500 bg-blue-50' : 
                  index === 1 ? 'border-green-500 bg-green-50' : 
                  'border-purple-500 bg-purple-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 text-sm mb-1">{job.title}</h5>
                      <p className="text-xs text-gray-600 mb-1">{job.company}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                        <Clock className="w-3 h-3" />
                        <span>{job.postedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          job.type === 'full-time' ? 'bg-green-100 text-green-700' :
                          job.type === 'part-time' ? 'bg-yellow-100 text-yellow-700' :
                          job.type === 'contract' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {job.type === 'full-time' ? 'دوام كامل' :
                           job.type === 'part-time' ? 'دوام جزئي' :
                           job.type === 'contract' ? 'عقد' : job.type}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {job.source}
                        </span>
                      </div>
                    </div>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-2"
                    >
                      عرض
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {category.jobs.length > 3 && (
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                عرض جميع الوظائف ({category.count})
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
