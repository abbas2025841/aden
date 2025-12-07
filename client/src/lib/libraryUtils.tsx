/**
 * دوال المنطق الأساسية للمكتبة الرقمية
 * Digital Library Core Logic Functions
 */

import { Book, LibraryStats } from '@/types/library';
import { BookOpen, Video, Image, Music, Archive, FileText } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * تصفية الكتب حسب معايير البحث والفلاتر
 * Filter books by search query and filters
 * 
 * @param books - قائمة الكتب
 * @param searchQuery - استعلام البحث
 * @param selectedGrade - الصف المحدد
 * @param selectedCategory - الفئة المحددة
 * @returns قائمة الكتب المفلترة
 */
export const filterBooks = (
  books: Book[],
  searchQuery: string,
  selectedGrade: string,
  selectedCategory: string
): Book[] => {
  return books.filter(book => {
    // تصفية البحث
    const matchesSearch = 
      searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // تصفية الصف
    const matchesGrade = 
      selectedGrade === 'الكل' || 
      selectedGrade === '' ||
      book.grade === selectedGrade;
    
    // تصفية الفئة
    const matchesCategory = 
      selectedCategory === 'الكل' || 
      selectedCategory === '' ||
      book.category === selectedCategory;
    
    return matchesSearch && matchesGrade && matchesCategory;
  });
};

/**
 * حساب إحصائيات المكتبة
 * Calculate library statistics
 * 
 * @param books - قائمة الكتب
 * @returns إحصائيات المكتبة
 */
export const calculateStats = (books: Book[]): LibraryStats => {
  return {
    totalBooks: books.length,
    totalDownloads: books.reduce((sum, book) => sum + book.downloads, 0),
    totalPages: books.reduce((sum, book) => sum + book.pages, 0)
  };
};

/**
 * الحصول على لون الفئة
 * Get category color
 * 
 * @param category - الفئة
 * @returns لون الفئة (Tailwind class)
 */
export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'mathematics': 'bg-blue-600',
    'arabic': 'bg-green-600',
    'physics': 'bg-purple-600',
    'history': 'bg-orange-600',
    'chemistry': 'bg-red-600',
    'geography': 'bg-indigo-600',
    'english': 'bg-yellow-600',
    'biology': 'bg-pink-600',
    'science': 'bg-teal-600',
    'islamic': 'bg-emerald-600',
    'social': 'bg-amber-600',
    'national': 'bg-rose-600',
    'quran': 'bg-teal-600',
    'faith': 'bg-emerald-600',
    'fiqh_hadith': 'bg-emerald-600',
    'seerah': 'bg-emerald-600',
    'sociology': 'bg-cyan-600',
    'computer': 'bg-slate-600',
    'philosophy': 'bg-purple-600',
    'psychology': 'bg-indigo-600'
  };
  return colorMap[category] || 'bg-gray-600';
};

/**
 * خريطة ألوان الفئات (للتصدير)
 * Category colors map (for export)
 */
export const categoryColors = {
  'mathematics': 'blue',
  'arabic': 'green',
  'physics': 'purple',
  'history': 'orange',
  'chemistry': 'red',
  'geography': 'indigo',
  'english': 'yellow',
  'biology': 'pink',
  'science': 'teal',
  'islamic': 'emerald',
  'social': 'amber',
  'national': 'rose',
  'quran': 'teal',
  'faith': 'emerald',
  'fiqh_hadith': 'emerald',
  'seerah': 'emerald',
  'sociology': 'cyan',
  'computer': 'slate',
  'philosophy': 'purple',
  'psychology': 'indigo'
};

/**
 * الحصول على أيقونة نوع الملف
 * Get file type icon
 * 
 * @param type - نوع الملف
 * @returns أيقونة نوع الملف
 */
export const getFileIcon = (type: string): ReactNode => {
  const iconProps = { className: "w-4 h-4" };
  
  switch (type) {
    case 'كتاب':
      return <BookOpen {...iconProps} />;
    case 'فيديو':
      return <Video {...iconProps} />;
    case 'صورة':
      return <Image {...iconProps} />;
    case 'صوت':
      return <Music {...iconProps} />;
    case 'أرشيف':
      return <Archive {...iconProps} />;
    default:
      return <FileText {...iconProps} />;
  }
};

/**
 * التحقق من صحة بيانات الكتاب
 * Validate book data
 * 
 * @param book - الكتاب
 * @returns true إذا كان الكتاب صالحًا
 */
export const validateBook = (book: any): boolean => {
  // التحقق من وجود الحقول المطلوبة
  const requiredFields = ['id', 'title', 'author', 'fileUrl', 'grade', 'category'];
  
  for (const field of requiredFields) {
    const value = book[field];
    if (value === undefined || value === null || value === '') {
      return false;
    }
  }
  
  // التحقق من أن pages و downloads أرقام موجبة
  if (typeof book.pages === 'number' && book.pages < 0) {
    return false;
  }
  
  if (typeof book.downloads === 'number' && book.downloads < 0) {
    return false;
  }
  
  return true;
};

/**
 * تنظيف استعلام البحث
 * Sanitize search query
 * 
 * @param query - استعلام البحث
 * @returns استعلام البحث المنظف
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().replace(/[<>]/g, '');
};

/**
 * التحقق من صحة الرابط
 * Validate URL
 * 
 * @param url - الرابط
 * @returns true إذا كان الرابط صالحًا
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * معالجة تحميل الكتاب
 * Handle book download
 * 
 * @param fileUrl - رابط الملف
 */
export const handleDownload = (fileUrl: string): void => {
  try {
    if (isValidUrl(fileUrl)) {
      window.open(fileUrl, '_blank');
    } else {
      console.error('رابط غير صالح:', fileUrl);
    }
  } catch (error) {
    console.error('فشل فتح رابط التحميل:', error);
  }
};
