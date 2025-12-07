// Utility functions for data manipulation

/**
 * Ensures that the input is an array
 */
export function ensureArray<T>(data: T | T[] | undefined | null): T[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (data === undefined || data === null) {
    return [];
  }
  return [data];
}

/**
 * Multi-filter function for complex filtering
 */
export function multiFilter<T>(
  data: T[],
  filters: Record<string, any>
): T[] {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return true;
      }
      
      const itemValue = (item as any)[key];
      
      if (typeof value === 'string') {
        return itemValue?.toString().toLowerCase().includes(value.toLowerCase());
      }
      
      if (Array.isArray(value)) {
        return value.includes(itemValue);
      }
      
      return itemValue === value;
    });
  });
}

/**
 * Get unique values from an array
 */
export function getUniqueValues<T>(data: T[], key: keyof T): T[keyof T][] {
  const values = data.map(item => item[key]);
  return [...new Set(values)];
}

/**
 * Sort array by key
 */
export function sortBy<T>(data: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Group array by key
 */
export function groupBy<T>(data: T[], key: keyof T): Record<string, T[]> {
  return data.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Search in array
 */
export function searchInArray<T>(
  data: T[],
  query: string,
  keys: (keyof T)[]
): T[] {
  if (!query.trim()) {
    return data;
  }
  
  const searchTerm = query.toLowerCase();
  
  return data.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm);
      }
      if (Array.isArray(value)) {
        return value.some(v => 
          typeof v === 'string' && v.toLowerCase().includes(searchTerm)
        );
      }
      return false;
    });
  });
}

/**
 * Paginate array
 */
export function paginate<T>(
  data: T[],
  page: number,
  pageSize: number
): { data: T[]; total: number; pages: number; currentPage: number } {
  const total = data.length;
  const pages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total,
    pages,
    currentPage: page
  };
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format number with locale
 */
export function formatNumber(num: number, locale: string = 'ar-SA'): string {
  return num.toLocaleString(locale);
}

/**
 * Format date with locale
 */
export function formatDate(date: string | Date, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'YER',
  locale: string = 'ar-SA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  
  return obj;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj === null || obj === undefined) {
    return true;
  }
  
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length === 0;
  }
  
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }
  
  return false;
}

/**
 * Merge objects deeply
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof result[key] === 'object' &&
        result[key] !== null &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], source[key]);
      } else {
        result[key] = source[key] as any;
      }
    }
  }
  
  return result;
}
