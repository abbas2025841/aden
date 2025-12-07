/**
 * FilterButtons Component
 * أزرار الفلترة السريعة
 */

import { Button } from '@/components/ui/button';
import type { FilterButtonsProps } from '@/types/library';

export default function FilterButtons({
  activeFilter,
  onFilterChange,
  filters,
  className = '',
}: FilterButtonsProps) {
  const handleFilterClick = (filterId: string) => {
    onFilterChange(filterId);
  };

  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      dir="rtl"
      role="group"
      aria-label="خيارات الفلترة"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;

        return (
          <Button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            className={`transition-all duration-300 ${
              isActive
                ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 font-semibold shadow-md'
                : 'bg-gray-800/50 hover:bg-gray-700 text-gray-300 border-gray-700 hover:border-gray-600'
            }`}
            aria-pressed={isActive}
            aria-label={filter.label}
          >
            {/* Icon */}
            {filter.icon && (
              <span className="ml-2 flex items-center">{filter.icon}</span>
            )}

            {/* Label */}
            <span>{filter.label}</span>

            {/* Count Badge */}
            {filter.count !== undefined && (
              <span
                className={`mr-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  isActive
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {filter.count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
