import { useState } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import GreetingSection from "@/components/GreetingSection";
import ServiceGrid from "@/components/ServiceGrid";
import AppFooter from "@/components/AppFooter";
import GlobalSearch from "@/components/GlobalSearch";
import AdenBotServiceCard from "@/components/AdenBotServiceCard";
import SearchResults from "@/components/SearchResults";
import { useSearch, SearchResult } from "@/hooks/useSearch";
import { Phone, AlertTriangle, Shield, ChevronDown } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showEmergencyMenu, setShowEmergencyMenu] = useState(false);

  // استخدام hook البحث الجديد
  const {
    results,
    loading: searchLoading,
    error: searchError,
    total: searchTotal,
    hasMore: searchHasMore,
    performSearch,
    loadMore: loadMoreResults
  } = useSearch({
    initialQuery: searchQuery,
    autoSearch: false // سنتحكم في البحث يدوياً
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearchResults(true);
      performSearch({ query });
    } else {
      setShowSearchResults(false);
    }
  };


  const handleResultClick = (result: SearchResult) => {
    // التنقل إلى الصفحة المناسبة حسب نوع النتيجة
    if (result.url) {
      setLocation(result.url);
    } else if (result.type === 'service') {
      // التنقل إلى صفحة الخدمة
      setLocation(`/${result.id}`);
    } else if (result.type === 'health') {
      setLocation('/health-facilities');
    } else if (result.type === 'education') {
      setLocation('/education');
    } else if (result.type === 'job') {
      setLocation('/jobs');
    } else if (result.type === 'location') {
      setLocation('/maps');
    }
  };

  // تم حذف دوال الفلاتر

  // معالج الطوارئ
  const handleEmergencyCall = (number: string, type: string) => {
    setShowEmergencyMenu(false);
    if (window.confirm(`هل تريد الاتصال بـ ${type}؟`)) {
      window.open(`tel:${number}`, '_self');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 page-transition">
      {/* المحتوى الرئيسي */}
      <div className="w-full">
        <AppHeader />

        <main className="w-full px-3 py-4 safe-area-bottom">
          <GreetingSection />
          <GlobalSearch
            onSearch={handleSearch}
            showAdvanced={false}
            showSuggestions={true}
          />
          
          {/* عرض نتائج البحث */}
          {showSearchResults ? (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  نتائج البحث
                </h2>
                <button
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
                >
                  إخفاء النتائج
                </button>
              </div>
              
              <SearchResults
                results={results}
                loading={searchLoading}
                error={searchError}
                total={searchTotal}
                hasMore={searchHasMore}
                onLoadMore={loadMoreResults}
                onResultClick={handleResultClick}
              />
            </div>
          ) : (
            <>
              <ServiceGrid />
            </>
          )}
        </main>
        <div className="px-3">
          <AppFooter />
        </div>
      </div>

      {/* زر الطوارئ العائم */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* قائمة الطوارئ */}
          {showEmergencyMenu && (
            <>
              {/* خلفية شفافة لإغلاق النافذة عند الضغط خارجها */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowEmergencyMenu(false)}
              />
              <div className="absolute bottom-16 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 w-[180px] z-50">
              <div className="space-y-1">
                <button
                  onClick={() => handleEmergencyCall('199', 'الطوارئ العامة')}
                  className="w-full text-right px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="w-3 h-3" />
                    <div className="text-right">
                      <div className="font-medium text-xs">الطوارئ العامة</div>
                      <div className="text-xs text-gray-500">199</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleEmergencyCall('718747135', 'إبلاغ عن التلاعب بالأسعار')}
                  className="w-full text-right px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Shield className="w-3 h-3" />
                    <div className="text-right">
                      <div className="font-medium text-xs">إبلاغ عن التلاعب</div>
                      <div className="text-xs text-gray-500">718747135</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => handleEmergencyCall('245098', 'الخط الساخن')}
                  className="w-full text-right px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Phone className="w-3 h-3" />
                    <div className="text-right">
                      <div className="font-medium text-xs">الخط الساخن</div>
                      <div className="text-xs text-gray-500">245098</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setLocation('/emergency')}
                  className="w-full text-right px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 transition-colors border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="w-3 h-3" />
                    <div className="text-right">
                      <div className="font-medium text-xs">جميع الأرقام</div>
                      <div className="text-xs text-gray-500">صفحة الطوارئ</div>
                    </div>
                  </div>
                </button>
              </div>
              </div>
            </>
          )}

          {/* زر الطوارئ الرئيسي */}
          <button
            onClick={() => setShowEmergencyMenu(!showEmergencyMenu)}
            className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold leading-none">SOS</span>
              <ChevronDown className={`w-3 h-3 mt-0.5 transition-transform duration-300 ${showEmergencyMenu ? 'rotate-180' : ''}`} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
