/**
 * Property-Based Tests for Library Utilities
 * اختبارات الخصائص لدوال المكتبة الرقمية
 * 
 * هذا الملف يحتوي على اختبارات الخصائص (Property-Based Tests) 
 * للتحقق من صحة دوال المنطق الأساسية للمكتبة الرقمية
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  filterBooks,
  calculateStats,
  getCategoryColor,
  getFileIcon,
  validateBook,
  categoryColors
} from '../libraryUtils.tsx';
import type { Book, BookCategory, BookGrade, BookType } from '@/types/book';

// ============================================================================
// Generators - مولدات البيانات العشوائية
// ============================================================================

/**
 * مولد لفئات الكتب الصالحة
 */
const bookCategoryArb = fc.constantFrom<BookCategory>(
  'islamic',
  'arabic',
  'science',
  'mathematics',
  'social',
  'geography',
  'history',
  'national',
  'english',
  'physics',
  'chemistry',
  'biology',
  'sociology',
  'computer',
  'quran',
  'faith',
  'fiqh_hadith',
  'seerah',
  'philosophy',
  'psychology'
);

/**
 * مولد للصفوف الدراسية الصالحة
 */
const bookGradeArb = fc.constantFrom<BookGrade>(
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
  'الصف الثالث الثانوي'
);

/**
 * مولد لأنواع الكتب الصالحة
 */
const bookTypeArb = fc.constantFrom<BookType>(
  'كتاب',
  'فيديو',
  'صورة',
  'صوت',
  'كتاب تمارين وتدريبات',
  'كتاب تمارين',
  'كتاب أنشطة وتجارب'
);

/**
 * مولد لنص غير فارغ (استخدام أحرف وأرقام فقط)
 */
const nonEmptyStringArb = (minLength: number, maxLength: number) =>
  fc.array(
    fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split('')),
    { minLength: Math.max(1, minLength), maxLength }
  ).map(arr => arr.join('')).filter(s => s.trim().length > 0);

/**
 * مولد لكائن كتاب صالح
 */
const bookArb = fc.record({
  id: fc.integer({ min: 1 }),
  title: nonEmptyStringArb(1, 200),
  author: nonEmptyStringArb(1, 100),
  category: bookCategoryArb,
  subject: nonEmptyStringArb(1, 200),
  grade: bookGradeArb,
  type: bookTypeArb,
  language: fc.constantFrom('عربي', 'إنجليزي'),
  pages: fc.integer({ min: 1, max: 1000 }),
  downloads: fc.integer({ min: 0, max: 100000 }),
  description: nonEmptyStringArb(1, 500),
  tags: fc.array(nonEmptyStringArb(1, 50), { minLength: 1, maxLength: 10 }),
  fileUrl: fc.webUrl(),
  coverImage: nonEmptyStringArb(1, 50),
  publishedDate: nonEmptyStringArb(1, 50),
  publisher: nonEmptyStringArb(1, 100),
  isbn: nonEmptyStringArb(1, 50),
  license: nonEmptyStringArb(1, 50),
  color: fc.option(fc.string(), { nil: undefined })
}) as fc.Arbitrary<Book>;

/**
 * مولد لمصفوفة من الكتب
 */
const booksArrayArb = fc.array(bookArb, { minLength: 0, maxLength: 50 });

// ============================================================================
// Property Tests - اختبارات الخصائص
// ============================================================================

describe('Library Utils - Property-Based Tests', () => {
  
  // ==========================================================================
  // Property 6: filtered books should match selected grade
  // **Feature: digital-library-redesign, Property 6: filtered books should match selected grade**
  // **Validates: Requirements 4.1**
  // ==========================================================================
  
  describe('Property 6: Grade Filtering', () => {
    it('should return only books matching the selected grade', () => {
      fc.assert(
        fc.property(booksArrayArb, bookGradeArb, (books, selectedGrade) => {
          const filtered = filterBooks(books, '', selectedGrade, '');
          
          for (const book of filtered) {
            expect(book.grade).toBe(selectedGrade);
          }
          
          const expectedBooks = books.filter(b => b.grade === selectedGrade);
          expect(filtered.length).toBe(expectedBooks.length);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should return all books when grade filter is "الكل"', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const filtered = filterBooks(books, '', 'الكل', '');
          expect(filtered.length).toBe(books.length);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should return all books when grade filter is empty string', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const filtered = filterBooks(books, '', '', '');
          expect(filtered.length).toBe(books.length);
        }),
        { numRuns: 100 }
      );
    });
  });
  
  // ==========================================================================
  // Property 7: filtered books should match selected category
  // **Feature: digital-library-redesign, Property 7: filtered books should match selected category**
  // **Validates: Requirements 4.2, 4.3**
  // ==========================================================================
  
  describe('Property 7: Category Filtering', () => {
    it('should return only books matching the selected category', () => {
      fc.assert(
        fc.property(booksArrayArb, bookCategoryArb, (books, selectedCategory) => {
          const filtered = filterBooks(books, '', '', selectedCategory);
          
          for (const book of filtered) {
            expect(book.category).toBe(selectedCategory);
          }
          
          const expectedBooks = books.filter(b => b.category === selectedCategory);
          expect(filtered.length).toBe(expectedBooks.length);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should return all books when category filter is "الكل"', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const filtered = filterBooks(books, '', '', 'الكل');
          expect(filtered.length).toBe(books.length);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should return all books when category filter is empty string', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const filtered = filterBooks(books, '', '', '');
          expect(filtered.length).toBe(books.length);
        }),
        { numRuns: 100 }
      );
    });
  });
  
  // ==========================================================================
  // Property 8: multiple filters should apply AND logic
  // **Feature: digital-library-redesign, Property 8: multiple filters should apply AND logic**
  // **Validates: Requirements 4.4**
  // ==========================================================================
  
  describe('Property 8: Multiple Filters with AND Logic', () => {
    it('should return only books matching both grade AND category', () => {
      fc.assert(
        fc.property(booksArrayArb, bookGradeArb, bookCategoryArb, (books, selectedGrade, selectedCategory) => {
          const filtered = filterBooks(books, '', selectedGrade, selectedCategory);
          
          for (const book of filtered) {
            expect(book.grade).toBe(selectedGrade);
            expect(book.category).toBe(selectedCategory);
          }
          
          const expectedBooks = books.filter(
            b => b.grade === selectedGrade && b.category === selectedCategory
          );
          expect(filtered.length).toBe(expectedBooks.length);
        }),
        { numRuns: 100 }
      );
    });
  });
  
  // ==========================================================================
  // Property 11: search results should contain query
  // **Feature: digital-library-redesign, Property 11: search results should contain query**
  // **Validates: Requirements 5.1, 5.2, 5.3**
  // ==========================================================================
  
  describe('Property 11: Search Functionality', () => {
    it('should return only books where title, author, or tags contain the search query', () => {
      fc.assert(
        fc.property(booksArrayArb, fc.string({ minLength: 1, maxLength: 20 }), (books, searchQuery) => {
          const filtered = filterBooks(books, searchQuery, '', '');
          
          const lowerQuery = searchQuery.toLowerCase();
          for (const book of filtered) {
            const matchesTitle = book.title.toLowerCase().includes(lowerQuery);
            const matchesAuthor = book.author.toLowerCase().includes(lowerQuery);
            const matchesTags = book.tags.some(tag => 
              tag.toLowerCase().includes(lowerQuery)
            );
            
            expect(matchesTitle || matchesAuthor || matchesTags).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
  
  // ==========================================================================
  // Property 12: empty search should return all books
  // **Feature: digital-library-redesign, Property 12: empty search should return all books**
  // **Validates: Requirements 5.5**
  // ==========================================================================
  
  describe('Property 12: Empty Search Returns All Books', () => {
    it('should return all books when search query is empty', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const filtered = filterBooks(books, '', '', '');
          expect(filtered.length).toBe(books.length);
          expect(filtered).toEqual(books);
        }),
        { numRuns: 100 }
      );
    });
  });
  
  // ==========================================================================
  // Property 1: all books should have required fields
  // **Feature: digital-library-redesign, Property 1: all books should have required fields**
  // **Validates: Requirements 1.1, 1.2, 1.3**
  // ==========================================================================
  
  describe('Property 1: Data Integrity - Required Fields', () => {
    it('should validate that all generated books have required fields', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          expect(validateBook(book)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject books with missing required fields', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const invalidBook = { ...book };
          delete (invalidBook as any).title;
          
          expect(validateBook(invalidBook)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject books with empty title', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const invalidBook = { ...book, title: '' };
          expect(validateBook(invalidBook)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject books with empty author', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const invalidBook = { ...book, author: '' };
          expect(validateBook(invalidBook)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject books with negative pages', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const invalidBook = { ...book, pages: -1 };
          expect(validateBook(invalidBook)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject books with negative downloads', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const invalidBook = { ...book, downloads: -1 };
          expect(validateBook(invalidBook)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should reject books with empty fileUrl', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const invalidBook = { ...book, fileUrl: '' };
          expect(validateBook(invalidBook)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
  
  // ==========================================================================
  // Additional Property Tests
  // ==========================================================================
  
  describe('Stats Calculation Properties', () => {
    it('should calculate correct total books count', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const stats = calculateStats(books);
          expect(stats.totalBooks).toBe(books.length);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should calculate correct total downloads', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const stats = calculateStats(books);
          const expectedDownloads = books.reduce((sum, book) => sum + book.downloads, 0);
          expect(stats.totalDownloads).toBe(expectedDownloads);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should calculate correct total pages', () => {
      fc.assert(
        fc.property(booksArrayArb, (books) => {
          const stats = calculateStats(books);
          const expectedPages = books.reduce((sum, book) => sum + book.pages, 0);
          expect(stats.totalPages).toBe(expectedPages);
        }),
        { numRuns: 100 }
      );
    });
  });
  
  describe('Category Color Properties', () => {
    it('should return a valid color for any category', () => {
      fc.assert(
        fc.property(bookCategoryArb, (category) => {
          const color = getCategoryColor(category);
          expect(typeof color).toBe('string');
          expect(color.length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
    
    it('should return consistent color for the same category', () => {
      fc.assert(
        fc.property(bookCategoryArb, (category) => {
          const color1 = getCategoryColor(category);
          const color2 = getCategoryColor(category);
          expect(color1).toBe(color2);
        }),
        { numRuns: 100 }
      );
    });
  });
  
  describe('File Icon Properties', () => {
    it('should return a valid icon for any book type', () => {
      fc.assert(
        fc.property(bookTypeArb, (type) => {
          const icon = getFileIcon(type);
          expect(icon).toBeDefined();
          expect(icon).not.toBeNull();
        }),
        { numRuns: 100 }
      );
    });
  });
});
