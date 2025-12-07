/**
 * BookGrid Component
 * شبكة عرض الكتب متجاوبة
 */

import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import type { BookGridProps } from '@/types/library';

export default function BookGrid({
  books,
  isLoading = false,
  onBookClick,
  onBookDownload,
  columns = {
    mobile: 2,
    tablet: 3,
    desktop: 4,
  },
  className = '',
}: BookGridProps) {
  if (isLoading) {
    return (
      <div
        className={`grid gap-4 ${className}`}
        style={{
          gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
        }}
      >
        <style>{`
          @media (min-width: 540px) {
            .book-grid {
              grid-template-columns: repeat(${columns.tablet}, 1fr);
              gap: 1.5rem;
            }
          }
          @media (min-width: 768px) {
            .book-grid {
              grid-template-columns: repeat(${columns.desktop}, 1fr);
              gap: 2rem;
            }
          }
        `}</style>
        <BookCardSkeleton count={8} />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">لا توجد كتب</p>
      </div>
    );
  }

  return (
    <div
      className={`book-grid grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
        gap: 'var(--grid-gap-mobile)',
      }}
    >
      <style>{`
        @media (min-width: 540px) {
          .book-grid {
            grid-template-columns: repeat(${columns.tablet}, 1fr);
            gap: var(--grid-gap-tablet);
          }
        }
        @media (min-width: 768px) {
          .book-grid {
            grid-template-columns: repeat(${columns.desktop}, 1fr);
            gap: var(--grid-gap-desktop);
          }
        }
      `}</style>

      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={onBookClick}
          onDownload={onBookDownload}
        />
      ))}
    </div>
  );
}
