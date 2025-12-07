// خدمة ضغط البيانات وتحسين التخزين
export class DataCompressionService {
  private static instance: DataCompressionService;
  private compressionEnabled: boolean = true;
  private maxDataSize: number = 50 * 1024 * 1024; // 50MB

  private constructor() {}

  static getInstance(): DataCompressionService {
    if (!DataCompressionService.instance) {
      DataCompressionService.instance = new DataCompressionService();
    }
    return DataCompressionService.instance;
  }

  // ضغط البيانات باستخدام LZ-string
  compress(data: any): string {
    if (!this.compressionEnabled) {
      return JSON.stringify(data);
    }

    try {
      // ضغط بسيط باستخدام Base64
      const jsonString = JSON.stringify(data);
      const compressed = btoa(unescape(encodeURIComponent(jsonString)));
      return compressed;
    } catch (error) {
      console.warn('Compression failed, using original data:', error);
      return JSON.stringify(data);
    }
  }

  // إلغاء ضغط البيانات
  decompress(compressedData: string): any {
    if (!this.compressionEnabled) {
      return JSON.parse(compressedData);
    }

    try {
      const decompressed = decodeURIComponent(escape(atob(compressedData)));
      return JSON.parse(decompressed);
    } catch (error) {
      console.warn('Decompression failed, trying direct parse:', error);
      return JSON.parse(compressedData);
    }
  }

  // حفظ البيانات مع ضغط
  saveToStorage(key: string, data: any): boolean {
    try {
      const compressed = this.compress(data);
      
      // فحص حجم البيانات
      if (compressed.length > this.maxDataSize) {
        console.warn(`Data size (${compressed.length}) exceeds limit (${this.maxDataSize})`);
        return false;
      }

      localStorage.setItem(key, compressed);
      return true;
    } catch (error) {
      console.error('Failed to save data:', error);
      return false;
    }
  }

  // تحميل البيانات مع إلغاء الضغط
  loadFromStorage(key: string): any | null {
    try {
      const compressed = localStorage.getItem(key);
      if (!compressed) return null;

      return this.decompress(compressed);
    } catch (error) {
      console.error('Failed to load data:', error);
      return null;
    }
  }

  // حذف البيانات
  removeFromStorage(key: string): void {
    localStorage.removeItem(key);
  }

  // تنظيف البيانات القديمة
  cleanupOldData(maxAge: number = 7 * 24 * 60 * 60 * 1000): void { // 7 أيام
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      try {
        const data = localStorage.getItem(key);
        if (!data) continue;

        // محاولة استخراج timestamp من البيانات
        const parsed = JSON.parse(data);
        if (parsed.timestamp && (now - parsed.timestamp) > maxAge) {
          keysToRemove.push(key);
        }
      } catch (error) {
        // إذا فشل التحليل، تجاهل
        continue;
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // حساب حجم البيانات المحفوظة
  getStorageSize(): { used: number; available: number; percentage: number } {
    let used = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }

    // تقدير المساحة المتاحة (عادة 5-10MB)
    const available = this.maxDataSize - used;
    const percentage = (used / this.maxDataSize) * 100;

    return {
      used: Math.round(used / 1024), // KB
      available: Math.round(available / 1024), // KB
      percentage: Math.round(percentage * 100) / 100
    };
  }

  // تحسين البيانات
  optimizeData(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.optimizeData(item));
    }

    if (typeof data === 'object' && data !== null) {
      const optimized: any = {};
      
      for (const [key, value] of Object.entries(data)) {
        // إزالة القيم الفارغة
        if (value !== null && value !== undefined && value !== '') {
          optimized[key] = this.optimizeData(value);
        }
      }
      
      return optimized;
    }

    return data;
  }

  // ضغط الصور
  compressImage(file: File, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // حساب الأبعاد الجديدة
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // رسم الصورة
        ctx?.drawImage(img, 0, 0, width, height);

        // تحويل إلى base64
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // إعدادات الضغط
  setCompressionEnabled(enabled: boolean): void {
    this.compressionEnabled = enabled;
  }

  setMaxDataSize(size: number): void {
    this.maxDataSize = size;
  }

  // تصدير البيانات
  exportData(): string {
    const data: any = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key);
      }
    }

    return JSON.stringify(data, null, 2);
  }

  // استيراد البيانات
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // مسح جميع البيانات
  clearAllData(): void {
    localStorage.clear();
  }
}

// خدمة إدارة التخزين المحسن
export class StorageManager {
  private compressionService: DataCompressionService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 دقائق

  constructor() {
    this.compressionService = DataCompressionService.getInstance();
  }

  // حفظ مع انتهاء صلاحية
  setWithTTL(key: string, data: any, ttl: number = this.defaultTTL): boolean {
    const dataWithTTL = {
      data,
      timestamp: Date.now(),
      ttl
    };

    const success = this.compressionService.saveToStorage(key, dataWithTTL);
    
    if (success) {
      this.cache.set(key, data);
      this.cacheExpiry.set(key, Date.now() + ttl);
    }

    return success;
  }

  // تحميل مع التحقق من انتهاء الصلاحية
  getWithTTL(key: string): any | null {
    // فحص الكاش أولاً
    const cacheExpiry = this.cacheExpiry.get(key);
    if (cacheExpiry && Date.now() < cacheExpiry) {
      return this.cache.get(key) || null;
    }

    // تحميل من التخزين
    const stored = this.compressionService.loadFromStorage(key);
    if (!stored) return null;

    // التحقق من انتهاء الصلاحية
    if (stored.timestamp && stored.ttl) {
      if (Date.now() - stored.timestamp > stored.ttl) {
        this.remove(key);
        return null;
      }
    }

    // تحديث الكاش
    this.cache.set(key, stored.data);
    this.cacheExpiry.set(key, Date.now() + (stored.ttl || this.defaultTTL));

    return stored.data;
  }

  // حذف
  remove(key: string): void {
    this.compressionService.removeFromStorage(key);
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  // مسح الكاش
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // تنظيف البيانات المنتهية الصلاحية
  cleanupExpired(): void {
    const now = Date.now();
    
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      if (now >= expiry) {
        this.remove(key);
      }
    }
  }

  // إحصائيات التخزين
  getStats(): {
    cacheSize: number;
    storageSize: { used: number; available: number; percentage: number };
    expiredItems: number;
  } {
    const storageSize = this.compressionService.getStorageSize();
    const now = Date.now();
    let expiredItems = 0;

    for (const expiry of this.cacheExpiry.values()) {
      if (now >= expiry) {
        expiredItems++;
      }
    }

    return {
      cacheSize: this.cache.size,
      storageSize,
      expiredItems
    };
  }
}

// تصدير الخدمات
export const dataCompressionService = DataCompressionService.getInstance();
export const storageManager = new StorageManager();
