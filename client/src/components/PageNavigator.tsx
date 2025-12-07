import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

interface PageItem {
  id: string;
  icon: string;
  title: string;
  path: string;
  color: string;
  bgColor: string;
}

const pages: PageItem[] = [
  {
    id: "water",
    icon: "💧",
    title: "ماء",
    path: "/water",
    color: "text-sky-600",
    bgColor: "bg-sky-50 dark:bg-sky-900/20"
  },
  {
    id: "electricity",
    icon: "⚡",
    title: "كهرباء",
    path: "/electricity",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
  },
  {
    id: "health",
    icon: "🏥",
    title: "صحة",
    path: "/health",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20"
  },
  {
    id: "education",
    icon: "📚",
    title: "تعليم",
    path: "/education",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    id: "jobs",
    icon: "💼",
    title: "وظائف",
    path: "/jobs",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    id: "motorcycle-taxi",
    icon: "🏍️",
    title: "دباب عدن",
    path: "/motorcycle-taxi",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20"
  },
  {
    id: "currency-rates",
    icon: "💰",
    title: "أسعار العملات",
    path: "/currency-rates",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
  },
  {
    id: "flights",
    icon: "✈️",
    title: "الطيران",
    path: "/flights",
    color: "text-sky-600",
    bgColor: "bg-sky-50 dark:bg-sky-900/20"
  },
  {
    id: "maps",
    icon: "🗺️",
    title: "خرائط عدن",
    path: "/maps",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    id: "blood-bank",
    icon: "🩸",
    title: "بنك الدم",
    path: "/blood-bank",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20"
  },
  {
    id: "haraj-aden",
    icon: "🏪",
    title: "حراج عدن",
    path: "/haraj-aden",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20"
  }
];

const PageNavigator = memo(function PageNavigator() {
  const [, setLocation] = useLocation();
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // التنقل إلى صفحة
  const handlePageClick = useCallback((path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocation(path);
  }, [setLocation]);

  // تبديل التمرير التلقائي
  const toggleAutoScroll = useCallback(() => {
    setIsAutoScrollEnabled(prev => !prev);
  }, []);



  // تهيئة التمرير عند التحميل (مرة واحدة عند تفعيل التمرير التلقائي)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isAutoScrollEnabled) return;

    // تأخير صغير للتأكد من تحميل العناصر
    const initTimeout = setTimeout(() => {
      const singleGroupWidth = container.scrollWidth / 3;
      if (singleGroupWidth > 0) {
        container.scrollLeft = singleGroupWidth;
        console.log('✅ Initial scroll set to:', singleGroupWidth);
      }
    }, 100);
    return () => clearTimeout(initTimeout);
  }, [isAutoScrollEnabled]);

  // التمرير التلقائي مع JavaScript
  useEffect(() => {
    const container = containerRef.current;
    
    if (!container || !isAutoScrollEnabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = 0;
      return;
    }

    const speed = 90; // بكسل في الثانية (زيادة السرعة)
    let isRunning = true;
    
    const animate = (currentTime: number) => {
      if (!isRunning || !container) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // إذا كان المستخدم يتفاعل حالياً، لا نغيّر scrollLeft لكن نكمل الحلقة
      if (!isUserInteracting) {
        const distance = speed * deltaTime;
        
        // تحريك التمرير
        container.scrollLeft += distance;

        // إعادة التموضع للحلقة اللانهائية
        const singleGroupWidth = container.scrollWidth / 3;
        
        // عند الوصول لنهاية المجموعة الأولى، ارجع للبداية
        if (container.scrollLeft >= singleGroupWidth) {
          container.scrollLeft = container.scrollLeft - singleGroupWidth;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // تأخير صغير قبل بدء الـ animation
    const startTimeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 150);

    return () => {
      clearTimeout(startTimeout);
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = 0;
    };
  }, [isAutoScrollEnabled, isUserInteracting]);



  return (
    <div className="w-full mt-2">
      {/* عنوان القسم */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="text-[10px] text-gray-500 dark:text-gray-400">
            {pages.length} خدمة
          </div>
          <button
            onClick={toggleAutoScroll}
            className={`text-[10px] px-2 py-1 rounded transition-colors ${
              isAutoScrollEnabled 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            title={isAutoScrollEnabled ? 'إيقاف التمرير التلقائي' : 'تشغيل التمرير التلقائي'}
            type="button"
          >
            {isAutoScrollEnabled ? '⏸️' : '▶️'}
          </button>
        </div>
        <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
          الخدمات الرئيسية
        </h3>
      </div>

      {/* شريط التمرير الأفقي - بدون حواف سوداء */}
      <div className="relative rounded-lg overflow-hidden">
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-1"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'auto'
          }}
          onMouseDown={() => setIsUserInteracting(true)}
          onMouseUp={() => setIsUserInteracting(false)}
          onMouseLeave={() => setIsUserInteracting(false)}
          onTouchStart={() => setIsUserInteracting(true)}
          onTouchEnd={() => setIsUserInteracting(false)}
        >
          {/* تكرار العناصر 3 مرات للحلقة المستمرة */}
          {[...Array(3)].map((_, groupIndex) => (
            <React.Fragment key={`group-${groupIndex}`}>
              {pages.map((page) => (
                <button
                  key={`${groupIndex}-${page.id}`}
                  onClick={(e) => handlePageClick(page.path, e)}
                  className={`
                    flex-shrink-0 w-14 h-14 rounded-lg border-2 border-transparent
                    transition-all duration-200
                    hover:scale-105 hover:shadow-lg hover:border-current
                    active:scale-95
                    ${page.bgColor}
                    ${page.color}
                    cursor-pointer
                  `}
                  style={{
                    minWidth: "56px",
                    maxWidth: "56px"
                  }}
                  aria-label={`الانتقال إلى صفحة ${page.title}`}
                  title={page.title}
                  type="button"
                >
                  <div className="flex flex-col items-center justify-center h-full p-1">
                    <div className="text-lg mb-0.5">
                      {page.icon}
                    </div>
                    <div className="text-[10px] font-medium text-center leading-tight">
                      {page.title}
                    </div>
                  </div>
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* مؤشر التمرير */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-opacity ${
            isAutoScrollEnabled ? 'opacity-50 animate-pulse' : 'opacity-20'
          }`}></div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

export default PageNavigator;
