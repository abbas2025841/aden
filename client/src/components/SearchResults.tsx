import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Loader2,
  AlertCircle,
  ChevronDown,
  ExternalLink,
  Building2,
  GraduationCap,
  Heart,
  Briefcase,
  Home,
  Navigation
} from 'lucide-react';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  rating?: number;
  phone?: string;
  hours?: string;
  distance?: string;
  image?: string;
  icon?: string;
  color?: string;
  url?: string;
  type?: string;
  subcategory?: string;
  district?: string;
  features?: string[];
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
  onResultClick: (result: SearchResult) => void;
}

// دالة للحصول على أيقونة النوع
const getTypeIcon = (type?: string) => {
  switch (type) {
    case 'service':
      return <Home className="w-4 h-4" />;
    case 'health':
      return <Heart className="w-4 h-4" />;
    case 'education':
      return <GraduationCap className="w-4 h-4" />;
    case 'job':
      return <Briefcase className="w-4 h-4" />;
    case 'location':
      return <Navigation className="w-4 h-4" />;
    case 'page':
      return <Building2 className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
};

// دالة للحصول على لون النوع
const getTypeColor = (type?: string, color?: string) => {
  if (color) return color;
  
  switch (type) {
    case 'service':
      return '#3b82f6';
    case 'health':
      return '#dc2626';
    case 'education':
      return '#16a34a';
    case 'job':
      return '#2563eb';
    case 'location':
      return '#059669';
    case 'page':
      return '#7c3aed';
    default:
      return '#6b7280';
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  total,
  hasMore,
  onLoadMore,
  onResultClick
}) => {
  if (loading && results.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="mr-2 text-gray-700 dark:text-gray-300 font-medium">جاري البحث...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-red-600 dark:text-red-400">
        <AlertCircle className="w-6 h-6 ml-2" />
        <span className="font-medium">حدث خطأ في البحث: {error}</span>
      </div>
    );
  }

  if (results.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
        <p className="font-medium text-lg mb-2">لم يتم العثور على نتائج</p>
        <p className="text-sm">جرب البحث بكلمات مختلفة أو تحقق من الإملاء</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* إحصائيات النتائج */}
      <div className="text-sm text-gray-700 dark:text-gray-300 text-center font-medium mb-2">
        تم العثور على {total} نتيجة
      </div>

      {/* قائمة النتائج */}
      <div className="space-y-3">
        {results.map((result) => {
          const typeColor = getTypeColor(result.type, result.color);
          const TypeIcon = getTypeIcon(result.type);
          
          return (
            <Card 
              key={result.id} 
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
              style={{ borderLeftColor: typeColor }}
              onClick={() => onResultClick(result)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                      <div 
                        className="p-1 rounded-full"
                        style={{ backgroundColor: `${typeColor}20` }}
                      >
                        {result.icon ? (
                          <span className="text-lg">{result.icon}</span>
                        ) : (
                          <div style={{ color: typeColor }}>
                            {TypeIcon}
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white flex-1 text-base">
                        {result.title}
                      </h3>
                      {result.url && (
                        <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2 leading-relaxed">
                      {result.description}
                    </p>
                    
                    {(result.location || result.district) && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <MapPin className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">{result.location || result.district}</span>
                        {result.distance && (
                          <>
                            <span className="mx-1 text-gray-400">•</span>
                            <span className="text-gray-500 dark:text-gray-500">{result.distance}</span>
                          </>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: typeColor }}
                        >
                          {result.category}
                        </span>
                        
                        {result.subcategory && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full font-medium">
                            {result.subcategory}
                          </span>
                        )}
                        
                        {result.rating && (
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Star className="w-3 h-3 text-yellow-500 ml-1" />
                            <span className="font-medium">{result.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      {result.phone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`tel:${result.phone}`);
                          }}
                        >
                          <Phone className="w-3 h-3 ml-1" />
                          اتصل
                        </Button>
                      )}
                    </div>
                    
                    {result.hours && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-2">
                        <Clock className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium">{result.hours}</span>
                      </div>
                    )}
                    
                    {result.features && result.features.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.features.slice(0, 3).map((feature, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                        {result.features.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                            +{result.features.length - 3} أكثر
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* زر تحميل المزيد */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="w-full font-medium text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin ml-2" />
                جاري التحميل...
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 ml-2" />
                تحميل المزيد
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;