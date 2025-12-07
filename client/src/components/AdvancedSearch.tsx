import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MapPin, Clock, Star, X, Mic, MicOff } from 'lucide-react';

interface SearchFilters {
  category: string[];
  location: string[];
  priceRange: [number, number];
  rating: number;
  availability: boolean;
  dateRange: [string, string];
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'service' | 'location' | 'category';
  popularity: number;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onVoiceSearch?: () => void;
  placeholder?: string;
  showFilters?: boolean;
  showSuggestions?: boolean;
}

export default function AdvancedSearch({
  onSearch,
  onVoiceSearch,
  placeholder = "ابحث عن الخدمات...",
  showFilters = true,
  showSuggestions = true
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    location: [],
    priceRange: [0, 1000],
    rating: 0,
    availability: false,
    dateRange: ['', '']
  });
  
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // محاكاة البيانات
  useEffect(() => {
    const mockSuggestions: SearchSuggestion[] = [
      { id: '1', text: 'صهاريج مياه', type: 'service', popularity: 95 },
      { id: '2', text: 'نقاط شحن كهرباء', type: 'service', popularity: 88 },
      { id: '3', text: 'صيدليات', type: 'service', popularity: 92 },
      { id: '4', text: 'كريتر', type: 'location', popularity: 85 },
      { id: '5', text: 'المعلا', type: 'location', popularity: 78 },
      { id: '6', text: 'التواهي', type: 'location', popularity: 82 },
      { id: '7', text: 'خدمات صحية', type: 'category', popularity: 90 },
      { id: '8', text: 'خدمات تعليمية', type: 'category', popularity: 75 }
    ];
    setSuggestions(mockSuggestions);

    const mockRecent = ['صهاريج مياه', 'صيدليات كريتر', 'نقاط شحن'];
    setRecentSearches(mockRecent);

    const mockPopular = ['صهاريج مياه', 'صيدليات', 'نقاط شحن', 'مستشفيات', 'مدارس'];
    setPopularSearches(mockPopular);
  }, []);

  // إعداد التعرف على الصوت
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      // حفظ البحث في السجل
      const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      
      onSearch(query, filters);
      setShowSuggestionsList(false);
    }
  };

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } else if (onVoiceSearch) {
      onVoiceSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestionsList(false);
    handleSearch();
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      location: [],
      priceRange: [0, 1000],
      rating: 0,
      availability: false,
      dateRange: ['', '']
    });
  };

  const getFilteredSuggestions = () => {
    if (!query.trim()) return [];
    return suggestions
      .filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 8);
  };

  const activeFiltersCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) {
      return count + (filter.length > 0 ? 1 : 0);
    }
    if (typeof filter === 'boolean') {
      return count + (filter ? 1 : 0);
    }
    if (typeof filter === 'number') {
      return count + (filter > 0 ? 1 : 0);
    }
    return count;
  }, 0);

  return (
    <div className="relative">
      {/* شريط البحث الرئيسي */}
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestionsList(true)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="flex-1 py-3 px-2 text-gray-700 placeholder-gray-400 focus:outline-none"
          />
          
          <div className="flex items-center gap-2 px-3">
            {showFilters && (
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  activeFiltersCount > 0 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            )}
            
            <button
              onClick={handleVoiceSearch}
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-100 text-red-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              بحث
            </button>
          </div>
          </div>
        </div>

      {/* لوحة الفلاتر */}
      {showFiltersPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">فلاتر البحث</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              مسح الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الفئة */}
          <div>
              <label className="block text-sm font-medium mb-2">الفئة</label>
              <div className="space-y-2">
                {['مياه', 'كهرباء', 'صحة', 'تعليم', 'وظائف'].map(category => (
                  <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                      checked={filters.category.includes(category)}
                    onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...filters.category, category]
                          : filters.category.filter(c => c !== category);
                        handleFilterChange('category', newCategories);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          </div>

            {/* الموقع */}
          <div>
              <label className="block text-sm font-medium mb-2">الموقع</label>
              <div className="space-y-2">
                {['كريتر', 'المعلا', 'التواهي', 'الشيخ عثمان', 'المنصورة'].map(location => (
                  <label key={location} className="flex items-center">
                  <input
                    type="checkbox"
                      checked={filters.location.includes(location)}
                    onChange={(e) => {
                        const newLocations = e.target.checked
                          ? [...filters.location, location]
                          : filters.location.filter(l => l !== location);
                        handleFilterChange('location', newLocations);
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{location}</span>
                </label>
              ))}
            </div>
          </div>

            {/* نطاق السعر */}
          <div>
              <label className="block text-sm font-medium mb-2">
                نطاق السعر: {filters.priceRange[0]} - {filters.priceRange[1]} ريال
              </label>
                <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
            </div>

            {/* التقييم */}
            <div>
              <label className="block text-sm font-medium mb-2">التقييم الأدنى</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-5 h-5 cursor-pointer ${
                      star <= filters.rating 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                    onClick={() => handleFilterChange('rating', star)}
                  />
                ))}
                <span className="text-sm text-gray-600">
                  {filters.rating > 0 ? `${filters.rating}+ نجوم` : 'أي تقييم'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
              onClick={() => setShowFiltersPanel(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              تطبيق الفلاتر
                  </button>
                </div>
              </div>
      )}

      {/* قائمة الاقتراحات */}
      {showSuggestionsList && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
          {/* البحث الحالي */}
          {query.trim() && (
            <div className="p-3 border-b border-gray-200">
              <div className="text-sm text-gray-600 mb-2">البحث عن:</div>
              <button
                onClick={handleSearch}
                className="w-full text-right text-blue-600 hover:text-blue-800 font-medium"
              >
                "{query}"
              </button>
            </div>
          )}

          {/* الاقتراحات المطابقة */}
          {getFilteredSuggestions().length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <div className="text-sm text-gray-600 mb-2">اقتراحات</div>
              {getFilteredSuggestions().map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-right py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{suggestion.text}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {suggestion.type === 'service' ? 'خدمة' : 
                       suggestion.type === 'location' ? 'موقع' : 'فئة'}
                    </span>
          </div>
                </button>
              ))}
        </div>
          )}

          {/* عمليات البحث الحديثة */}
          {recentSearches.length > 0 && !query.trim() && (
            <div className="p-3 border-b border-gray-200">
              <div className="text-sm text-gray-600 mb-2">البحث الحديث</div>
              {recentSearches.map((search, index) => (
            <button
                  key={index}
                  onClick={() => {
                    setQuery(search);
                    setShowSuggestionsList(false);
                    handleSearch();
                  }}
                  className="w-full text-right py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-800">{search}</span>
            </button>
              ))}
            </div>
          )}

          {/* عمليات البحث الشائعة */}
          {popularSearches.length > 0 && !query.trim() && (
            <div className="p-3">
              <div className="text-sm text-gray-600 mb-2">الأكثر بحثاً</div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
            <button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      setShowSuggestionsList(false);
                      handleSearch();
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {search}
            </button>
                ))}
          </div>
        </div>
          )}
      </div>
      )}

      {/* إغلاق الاقتراحات عند النقر خارجها */}
      {showSuggestionsList && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSuggestionsList(false)}
        />
      )}
    </div>
  );
}
