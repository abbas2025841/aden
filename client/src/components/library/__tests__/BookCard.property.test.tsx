/**
 * Property-Based Tests for BookCard Component
 * اختبارات الخصائص لمكون بطاقة الكتاب
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { BookCard } from '../BookCard';
import type { Book } from '@/types/library';

// ============================================================================
// Generators
// ============================================================================

const bookCategoryArb = fc.constantFrom(
  'islamic', 'arabic', 'science', 'mathematics', 'social', 
  'geography', 'history', 'national', 'english', 'physics'
);

const bookGradeArb = fc.constantFrom(
  'الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع',
  'الصف الخامس', 'الصف السادس', 'الصف السابع', 'الصف الثامن', 'الصف التاسع'
);

const bookTypeArb = fc.constantFrom('كتاب', 'فيديو', 'صورة', 'صوت');

const nonEmptyStringArb = (minLength: number, maxLength: number) =>
  fc.string({ minLength, maxLength }).filter(s => s.trim().length > 0);

const bookArb = fc.record({
  id: fc.integer({ min: 1 }),
  title: nonEmptyStringArb(5, 100),
  author: nonEmptyStringArb(5, 50),
  category: bookCategoryArb,
  subject: nonEmptyStringArb(5, 50),
  grade: bookGradeArb,
  type: bookTypeArb,
  language: fc.constantFrom('عربي', 'إنجليزي'),
  pages: fc.integer({ min: 1, max: 1000 }),
  downloads: fc.integer({ min: 0, max: 100000 }),
  description: nonEmptyStringArb(20, 200),
  tags: fc.array(nonEmptyStringArb(3, 20), { minLength: 1, maxLength: 5 }),
  fileUrl: fc.webUrl(),
  coverImage: nonEmptyStringArb(5, 50),
  publishedDate: fc.string({ minLength: 4, maxLength: 10 }),
  publisher: nonEmptyStringArb(5, 50),
  isbn: nonEmptyStringArb(5, 20),
  license: nonEmptyStringArb(3, 20),
  color: fc.option(fc.string(), { nil: undefined })
}) as fc.Arbitrary<Book>;

// ============================================================================
// Property Tests
// ============================================================================

describe('BookCard - Property-Based Tests', () => {
  
  // ==========================================================================
  // Property 5: card should contain all required elements
  // **Feature: digital-library-redesign, Property 5: card should contain all required elements**
  // **Validates: Requirements 2.1, 2.2, 2.3, 2.6**
  // ==========================================================================
  
  describe('Property 5: Card Completeness', () => {
    it('should display book title', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const handleClick = vi.fn();
          render(<BookCard book={book} onClick={handleClick} />);
          
          expect(screen.getByText(book.title)).toBeInTheDocument();
        }),
        { numRuns: 20 }
      );
    });
    
    it('should display book author', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const handleClick = vi.fn();
          render(<BookCard book={book} onClick={handleClick} />);
          
          expect(screen.getByText(book.author)).toBeInTheDocument();
        }),
        { numRuns: 20 }
      );
    });
    
    it('should display book grade', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const handleClick = vi.fn();
          render(<BookCard book={book} onClick={handleClick} />);
          
          expect(screen.getByText(book.grade)).toBeInTheDocument();
        }),
        { numRuns: 20 }
      );
    });
    
    it('should display book type badge', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const handleClick = vi.fn();
          render(<BookCard book={book} onClick={handleClick} />);
          
          expect(screen.getByText(book.type)).toBeInTheDocument();
        }),
        { numRuns: 20 }
      );
    });
    
    it('should display book language badge', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const handleClick = vi.fn();
          render(<BookCard book={book} onClick={handleClick} />);
          
          expect(screen.getByText(book.language)).toBeInTheDocument();
        }),
        { numRuns: 20 }
      );
    });
    
    it('should display page count', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const handleClick = vi.fn();
          render(<BookCard book={book} onClick={handleClick} />);
          
          expect(screen.getByText(`${book.pages} صفحة`)).toBeInTheDocument();
        }),
        { numRuns: 20 }
      );
    });
    
    it('should have a details button', () => {
      fc.assert(
        fc.property(bookArb, (book) => {
          const handleClick = vi.fn();
          render(<BookCard book={book} onClick={handleClick} />);
          
          const button = screen.getByRole('button', { name: /عرض التفاصيل/i });
          expect(button).toBeInTheDocument();
        }),
        { numRuns: 20 }
      );
    });
  });
  
  // ==========================================================================
  // Property 4: category colors should be consistent
  // **Feature: digital-library-redesign, Property 4: category colors should be consistent**
  // **Validates: Requirements 2.4**
  // ==========================================================================
  
  describe('Property 4: Category Color Consistency', () => {
    it('should use consistent colors for the same category', () => {
      fc.assert(
        fc.property(bookCategoryArb, (category) => {
          const book1: Book = {
            id: 1,
            title: 'Test Book 1',
            author: 'Test Author',
            category,
            subject: 'Test Subject',
            grade: 'الصف الأول',
            type: 'كتاب',
            language: 'عربي',
            pages: 100,
            downloads: 0,
            description: 'Test description',
            tags: ['test'],
            fileUrl: 'https://example.com/book1.pdf',
            coverImage: 'test.jpg',
            publishedDate: '2024',
            publisher: 'Test Publisher',
            isbn: '123',
            license: 'مجاني',
            color: 'blue'
          };
          
          const book2: Book = { ...book1, id: 2, title: 'Test Book 2' };
          
          const handleClick = vi.fn();
          const { container: container1 } = render(<BookCard book={book1} onClick={handleClick} />);
          const { container: container2 } = render(<BookCard book={book2} onClick={handleClick} />);
          
          // Both cards should have the same color strip
          const colorStrip1 = container1.querySelector('div[class*="h-2"]');
          const colorStrip2 = container2.querySelector('div[class*="h-2"]');
          
          expect(colorStrip1?.className).toBe(colorStrip2?.className);
        }),
        { numRuns: 20 }
      );
    });
  });
});
