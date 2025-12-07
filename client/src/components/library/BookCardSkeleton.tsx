/**
 * BookCardSkeleton Component
 * حالة التحميل لبطاقة الكتاب
 */

import { Card, CardContent } from '@/components/ui/card';
import type { BookCardSkeletonProps } from '@/types/library';

function SingleSkeleton() {
  return (
    <Card
      className="book-card-skeleton"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
    >
      <CardContent className="p-0">
        {/* Cover Skeleton */}
        <div
          className="skeleton animate-pulse bg-gray-700/50"
          style={{
            aspectRatio: '3 / 4',
            minHeight: '200px',
          }}
        />

        {/* Info Skeleton */}
        <div className="p-4 space-y-3">
          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="skeleton animate-pulse bg-gray-700/50 h-4 w-full rounded" />
            <div className="skeleton animate-pulse bg-gray-700/50 h-4 w-3/4 rounded" />
          </div>

          {/* Author Skeleton */}
          <div className="skeleton animate-pulse bg-gray-700/50 h-3 w-1/2 rounded" />

          {/* Badge Skeleton */}
          <div className="skeleton animate-pulse bg-gray-700/50 h-6 w-24 rounded-full" />

          {/* Meta Skeleton */}
          <div className="flex items-center justify-between pt-2">
            <div className="skeleton animate-pulse bg-gray-700/50 h-3 w-16 rounded" />
            <div className="skeleton animate-pulse bg-gray-700/50 h-3 w-12 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BookCardSkeleton({
  count = 8,
}: BookCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </>
  );
}
