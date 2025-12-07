/**
 * useDebounce Hook
 * Custom hook للـ debouncing
 *
 * يؤخر تنفيذ القيمة لمدة محددة لتحسين الأداء
 */

import { useState, useEffect } from 'react';

/**
 * useDebounce
 * @template T - نوع القيمة المراد debounce لها
 * @param {T} value - القيمة المراد debounce لها
 * @param {number} delay - التأخير بالميلي ثانية (افتراضي: 300ms)
 * @returns {T} القيمة المؤجلة
 *
 * @example
 * const debouncedSearch = useDebounce(searchQuery, 300);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // إنشاء timer
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: إلغاء timer السابق عند تغيير القيمة
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
