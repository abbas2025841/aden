import React, { useState, useRef, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getSearchSuggestions } from '@/services/searchService';

interface GlobalSearchProps {
  onSearch: (query: string) => void;
  showAdvanced?: boolean;
  showSuggestions?: boolean;
  placeholder?: string;
  className?: string;
  onFilterChange?: (filter: string) => void;
  onSortChange?: (sort: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onSearch,
  showAdvanced = false,
  showSuggestions = true,
  placeholder = "ابحث في عدن...",
  className = "",
  onFilterChange,
  onSortChange
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // تحميل عمليات البحث الأخيرة من localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aden-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  // حفظ عمليات البحث الأخيرة
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('aden-recent-searches', JSON.stringify(updated));
  };

  // حذف عملية بحث محددة
  const removeRecentSearch = (searchToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== searchToRemove);
    setRecentSearches(updated);
    localStorage.setItem('aden-recent-searches', JSON.stringify(updated));
  };

  // حذف جميع عمليات البحث الأخيرة
  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('aden-recent-searches');
  };

  // تم حذف دوال الفلاتر

  // تحديث الاقتراحات عند تغيير الاستعلام
  useEffect(() => {
    if (query.length > 1 && showSuggestions) {
      const newSuggestions = getSearchSuggestions(query, 8);
      setSuggestions(newSuggestions);
      setShowSuggestionsList(true);
    } else if (query.length === 0 && showSuggestions) {
      // عرض عمليات البحث الأخيرة عند عدم وجود استعلام
      setSuggestions(recentSearches);
      setShowSuggestionsList(true);
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  }, [query, showSuggestions, recentSearches]);

  const handleSearch = async () => {
    if (query.trim()) {
      setIsSearching(true);
      try {
        saveRecentSearch(query.trim());
        await onSearch(query.trim());
        setShowSuggestionsList(false);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestionsList(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    saveRecentSearch(suggestion);
    onSearch(suggestion);
    setShowSuggestionsList(false);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (showSuggestions && (suggestions.length > 0 || recentSearches.length > 0)) {
      setShowSuggestionsList(true);
    }
  };

  const handleInputBlur = () => {
    // تأخير إخفاء الاقتراحات للسماح بالنقر عليها
    setTimeout(() => {
      setShowSuggestionsList(false);
    }, 200);
  };

  return (
    <div className={`relative mb-6 ${className}`}>
      <Card className="shadow-lg border-0 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-6">
          {/* شريط البحث الرئيسي */}
          <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={placeholder}
              className="pr-4 pl-4 py-3 text-right text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl shadow-sm transition-all duration-200"
                dir="rtl"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                  onClick={clearSearch}
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Button>
              )}
            </div>
            
          {/* تم حذف الفلاتر المتقدمة */}

          {/* عرض الاقتراحات */}
          {showSuggestionsList && suggestions.length > 0 && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg max-h-60 overflow-y-auto">
              {query.length === 0 && recentSearches.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <span>البحث الأخير</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllRecentSearches}
                      className="h-6 px-2 text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-3 h-3 ml-1" />
                      مسح الكل
                </Button>
                  </div>
                </div>
              )}
              {query.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse px-2 py-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <span>اقتراحات ذكية</span>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center group">
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start text-right text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 h-auto font-medium rounded-lg transition-all duration-200"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="truncate">{suggestion}</span>
                </Button>
                    {query.length === 0 && recentSearches.includes(suggestion) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => removeRecentSearch(suggestion, e)}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSearch;