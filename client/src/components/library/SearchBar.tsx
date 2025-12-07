/**
 * SearchBar Component
 * شريط البحث مع debouncing
 */

import { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import type { SearchBarProps } from '@/types/library';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'ابحث عن كتاب، مؤلف، أو موضوع...',
  debounceMs = 300,
  isLoading = false,
  className = '',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, debounceMs);

  // تحديث القيمة الخارجية عند تغيير debouncedValue
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  // تحديث القيمة المحلية عند تغيير القيمة الخارجية
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        {isLoading ? (
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        ) : (
          <Search className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Input Field */}
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pr-10 pl-10 py-3 text-white bg-gray-800/50 
          border-gray-700 focus:border-purple-500 
          focus:ring-purple-500/20 rounded-lg"
        dir="rtl"
        aria-label="البحث في المكتبة"
      />

      {/* Clear Button */}
      {localValue && (
        <Button
          onClick={handleClear}
          variant="ghost"
          size="sm"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 
            hover:bg-gray-700"
          aria-label="مسح البحث"
        >
          <X className="w-4 h-4 text-gray-400" />
        </Button>
      )}
    </div>
  );
}
