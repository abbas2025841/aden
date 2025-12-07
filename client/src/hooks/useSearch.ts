import { useState, useCallback } from 'react';
import { searchAllContent, getSearchSuggestions, UnifiedSearchResult } from '@/services/searchService';

// واجهة متوافقة مع المكونات الموجودة
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

interface UseSearchOptions {
  initialQuery?: string;
  autoSearch?: boolean;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    initialQuery = '',
    autoSearch = true
  } = options;

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // دالة تحويل النتائج الموحدة إلى نتائج متوافقة
  const convertToSearchResults = (unifiedResults: UnifiedSearchResult[]): SearchResult[] => {
    return unifiedResults.map(result => ({
      id: result.id,
      title: result.title,
      description: result.description,
      category: result.category,
      location: result.location,
      rating: result.rating,
      phone: result.phone,
      hours: result.hours,
      distance: result.distance,
      image: result.image,
      icon: result.icon,
      color: result.color,
      url: result.url,
      type: result.type,
      subcategory: result.subcategory,
      district: result.district,
      features: result.features
    }));
  };

  const performSearch = useCallback(async (searchOptions: { 
    query: string;
    category?: string;
    type?: string;
    district?: string;
  }) => {
    if (!searchOptions.query.trim()) {
      setResults([]);
      setTotal(0);
      setHasMore(false);
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // محاكاة تأخير البحث للواقعية
      await new Promise(resolve => setTimeout(resolve, 300));

      // البحث في جميع المحتويات
      const unifiedResults = searchAllContent(searchOptions.query, 50);
      
      // تطبيق الفلاتر الإضافية
      let filteredResults = unifiedResults;
      
      if (searchOptions.category) {
        filteredResults = filteredResults.filter(item => 
          item.category === searchOptions.category
        );
      }
      
      if (searchOptions.type) {
        filteredResults = filteredResults.filter(item => 
          item.type === searchOptions.type
        );
      }
      
      if (searchOptions.district) {
        filteredResults = filteredResults.filter(item => 
          item.district?.toLowerCase().includes(searchOptions.district!.toLowerCase())
        );
      }

      // تحويل النتائج
      const searchResults = convertToSearchResults(filteredResults);
      
      setResults(searchResults);
      setTotal(searchResults.length);
      setHasMore(false); // في الوقت الحالي لا يوجد pagination

      // تحديث الاقتراحات
      const newSuggestions = getSearchSuggestions(searchOptions.query, 8);
      setSuggestions(newSuggestions);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ في البحث');
      setResults([]);
      setTotal(0);
      setHasMore(false);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    // في الوقت الحالي لا يوجد المزيد من النتائج
    setHasMore(false);
  }, []);

  const getSuggestions = useCallback((query: string) => {
    const newSuggestions = getSearchSuggestions(query, 10);
    setSuggestions(newSuggestions);
    return newSuggestions;
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setTotal(0);
    setHasMore(false);
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    total,
    hasMore,
    suggestions,
    performSearch,
    loadMore,
    getSuggestions,
    clearSearch
  };
}