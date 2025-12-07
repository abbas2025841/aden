import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3X3, 
  List,
  MapPin,
  Star,
  Clock
} from 'lucide-react';

interface ServiceFiltersProps {
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  activeFilter?: string;
  activeSort?: string;
  showViewToggle?: boolean;
  onViewChange?: (view: 'grid' | 'list') => void;
  currentView?: 'grid' | 'list';
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  onFilterChange,
  onSortChange,
  activeFilter = 'all',
  activeSort = 'name',
  showViewToggle = false,
  onViewChange,
  currentView = 'grid'
}) => {
  const filters = [
    { id: 'all', label: 'الكل', icon: Grid3X3 },
    { id: 'health', label: 'الصحة', icon: MapPin },
    { id: 'education', label: 'التعليم', icon: Star },
    { id: 'government', label: 'الحكومة', icon: Clock },
    { id: 'business', label: 'الأعمال', icon: Filter },
    { id: 'entertainment', label: 'الترفيه', icon: Star }
  ];

  const sortOptions = [
    { id: 'name', label: 'الاسم', icon: SortAsc },
    { id: 'distance', label: 'المسافة', icon: MapPin },
    { id: 'rating', label: 'التقييم', icon: Star },
    { id: 'recent', label: 'الأحدث', icon: Clock }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {/* فلاتر الفئات */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">الفئات</h3>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFilterChange(filter.id)}
                  className="text-xs"
                >
                  <IconComponent className="w-3 h-3 ml-1" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* خيارات الترتيب */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <h3 className="text-sm font-medium text-gray-700">ترتيب حسب:</h3>
            <div className="flex gap-1">
              {sortOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant={activeSort === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSortChange(option.id)}
                    className="text-xs"
                  >
                    <IconComponent className="w-3 h-3 ml-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* تبديل طريقة العرض */}
          {showViewToggle && onViewChange && (
            <div className="flex border rounded-md">
              <Button
                variant={currentView === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange('grid')}
                className="rounded-r-none border-r"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={currentView === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFilters;
