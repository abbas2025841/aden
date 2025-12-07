/**
 * Book Types - Digital Library
 * 
 * جميع الـ interfaces والـ types المتعلقة بالكتب في المكتبة الرقمية
 * بناءً على البيانات الحقيقية (174 كتاب)
 */

import type React from 'react';

/**
 * Book Category
 * الفئات المتاحة للكتب (من البيانات الفعلية)
 */
export type BookCategory =
  | 'islamic'
  | 'arabic'
  | 'science'
  | 'mathematics'
  | 'social'
  | 'geography'
  | 'history'
  | 'national'
  | 'english'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'sociology'
  | 'computer'
  | 'quran'
  | 'faith'
  | 'fiqh_hadith'
  | 'seerah'
  | 'philosophy'
  | 'psychology';

/**
 * Book Type
 * أنواع المحتوى المتاح
 */
export type BookType = 
  | 'كتاب' 
  | 'فيديو' 
  | 'صورة' 
  | 'صوت'
  | 'كتاب تمارين وتدريبات'
  | 'كتاب تمارين'
  | 'كتاب أنشطة وتجارب';

/**
 * Book Grade
 * الصفوف الدراسية (من البيانات الفعلية)
 */
export type BookGrade =
  | 'الصف الأول'
  | 'الصف الثاني'
  | 'الصف الثالث'
  | 'الصف الرابع'
  | 'الصف الخامس'
  | 'الصف السادس'
  | 'الصف السابع'
  | 'الصف الثامن'
  | 'الصف التاسع'
  | 'الصف الأول الثانوي'
  | 'الصف الثاني الثانوي'
  | 'الصف الثالث الثانوي';

/**
 * Sort Options
 * خيارات الترتيب
 */
export type SortBy = 'downloads' | 'title' | 'author' | 'date';

/**
 * Book Interface
 * الواجهة الرئيسية للكتاب (بناءً على البنية الحقيقية)
 */
export interface Book {
  id: number;
  title: string;
  author: string;
  category: BookCategory;
  subject: string;
  grade: BookGrade;
  type: BookType;
  language: string;
  pages: number;
  size?: string;
  downloads: number;
  description: string;
  tags: string[];
  fileUrl: string;
  coverImage: string;
  publishedDate: string;
  lastUpdated?: string;
  publisher: string;
  isbn: string;
  license: string;
  color?: string;
}

/**
 * Book Stats
 * إحصائيات المكتبة
 */
export interface BookStats {
  totalBooks: number;
  totalDownloads: number;
  totalPages: number;
}

/**
 * Filter Options
 * خيارات الفلترة
 */
export interface FilterOptions {
  category: string;
  grade: string;
  type: string;
}

/**
 * Filter Option Item
 * عنصر واحد في قائمة الفلاتر
 */
export interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
