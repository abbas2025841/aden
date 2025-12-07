/**
 * أنواع المكتبة الرقمية
 * Digital Library Types
 */

/**
 * واجهة الكتاب
 * Book Interface
 */
export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  subject: string;
  grade: string;
  type: string;
  language: string;
  pages: number;
  size?: number;
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
  color: string;
}

/**
 * حالة المكتبة الرقمية
 * Digital Library State
 */
export interface DigitalLibraryState {
  searchQuery: string;
  selectedGrade: string;
  selectedCategory: string;
  selectedBook: Book | null;
  isDetailsModalOpen: boolean;
}

/**
 * إحصائيات المكتبة
 * Library Statistics
 */
export interface LibraryStats {
  totalBooks: number;
  totalDownloads: number;
  totalPages: number;
}

/**
 * خريطة الفئات
 * Category Map
 */
export type CategoryMap = Record<string, string>;

/**
 * خريطة ألوان الفئات
 * Category Colors Map
 */
export type CategoryColorMap = Record<string, string>;

/**
 * خصائص مكون بطاقة الكتاب
 * Book Card Component Props
 */
export interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

/**
 * خصائص مكون نافذة تفاصيل الكتاب
 * Book Details Modal Component Props
 */
export interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * خصائص مكون شريط البحث
 * Search Bar Component Props
 */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * خصائص مكون شريط الفلاتر
 * Filter Bar Component Props
 */
export interface FilterBarProps {
  selectedGrade: string;
  selectedCategory: string;
  onGradeChange: (grade: string) => void;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
  grades: string[];
  categories: CategoryMap;
  resultCount: number;
}

/**
 * خصائص مكون بطاقات الإحصائيات
 * Stats Cards Component Props
 */
export interface StatsCardsProps {
  stats: LibraryStats;
}

/**
 * ثوابت الفئات
 * Category Constants
 */
export const CATEGORY_MAP: CategoryMap = {
  'mathematics': 'الرياضيات',
  'arabic': 'اللغة العربية',
  'physics': 'الفيزياء',
  'history': 'التاريخ',
  'chemistry': 'الكيمياء',
  'geography': 'الجغرافيا',
  'english': 'اللغة الإنجليزية',
  'biology': 'الأحياء',
  'science': 'العلوم',
  'islamic': 'القرآن الكريم والتربية الإسلامية',
  'social': 'التربية الاجتماعية',
  'national': 'التربية الوطنية',
  'quran': 'القرآن الكريم وعلومه',
  'faith': 'الإيمان',
  'fiqh_hadith': 'الفقه والحديث',
  'seerah': 'السيرة النبوية',
  'sociology': 'علم الاجتماع',
  'computer': 'الحاسوب',
  'philosophy': 'مبادئ الفلسفة',
  'psychology': 'علم النفس'
};

/**
 * ثوابت ألوان الفئات
 * Category Color Constants
 */
export const CATEGORY_COLORS: CategoryColorMap = {
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
 * ثوابت الصفوف الدراسية
 * Grade Constants
 */
export const BASE_GRADES = [
  'الصف الأول',
  'الصف الثاني',
  'الصف الثالث',
  'الصف الرابع',
  'الصف الخامس',
  'الصف السادس',
  'الصف السابع',
  'الصف الثامن',
  'الصف التاسع',
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
];
