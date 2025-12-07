/**
 * Arbitraries للكتب - لاستخدامها في Property-Based Testing
 * Book Arbitraries for Property-Based Testing
 */

import fc from 'fast-check';
import { Book } from '@/types/library';
import { CATEGORY_MAP, BASE_GRADES } from '@/types/library';

/**
 * Arbitrary لتوليد كتاب عشوائي
 * Arbitrary for generating random books
 */
export const bookArbitrary: fc.Arbitrary<Book> = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  title: fc.string({ minLength: 5, maxLength: 100 }),
  author: fc.string({ minLength: 5, maxLength: 50 }),
  category: fc.constantFrom(...Object.keys(CATEGORY_MAP)),
  subject: fc.string({ minLength: 5, maxLength: 50 }),
  grade: fc.constantFrom(...BASE_GRADES),
  type: fc.constantFrom('كتاب', 'فيديو', 'صورة', 'صوت', 'أرشيف'),
  language: fc.constant('عربي'),
  pages: fc.integer({ min: 10, max: 500 }),
  size: fc.option(fc.integer({ min: 100, max: 50000 })),
  downloads: fc.integer({ min: 0, max: 10000 }),
  description: fc.string({ minLength: 20, maxLength: 500 }),
  tags: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
  fileUrl: fc.webUrl(),
  coverImage: fc.constant('📖'),
  publishedDate: fc.date({ min: new Date('2000-01-01'), max: new Date() })
    .map(d => d.getFullYear().toString()),
  lastUpdated: fc.option(fc.date().map(d => d.toISOString())),
  publisher: fc.string({ minLength: 5, maxLength: 50 }),
  isbn: fc.string({ minLength: 1, maxLength: 20 }),
  license: fc.constant('مجاني'),
  color: fc.constantFrom('blue', 'green', 'red', 'purple', 'orange', 'teal', 'emerald')
});

/**
 * Arbitrary لتوليد قائمة كتب عشوائية
 * Arbitrary for generating random book arrays
 */
export const booksArrayArbitrary = fc.array(bookArbitrary, { minLength: 0, maxLength: 50 });
