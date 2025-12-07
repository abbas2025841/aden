/**
 * مكون بطاقة الكتاب
 * Book Card Component
 * 
 * بطاقة حديثة وجذابة لعرض معلومات الكتاب الأساسية
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FileText, User } from 'lucide-react';
import { Book } from '@/types/library';
import { getCategoryColor, getFileIcon } from '@/lib/libraryUtils';

export interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

/**
 * مكون بطاقة الكتاب
 */
export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  // الحصول على لون الفئة
  const categoryColorClass = getCategoryColor(book.category);
  const categoryColor = categoryColorClass.replace('bg-', '').replace('-600', '');
  
  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 hover:border-primary"
      onClick={() => onClick(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(book);
        }
      }}
      aria-label={`عرض تفاصيل كتاب ${book.title}`}
    >
      {/* شريط علوي ملون حسب الفئة */}
      <div className={`h-2 ${categoryColorClass}`} />
      
      <CardContent className="p-6 space-y-4">
        {/* أيقونة الكتاب */}
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${categoryColor}-400 to-${categoryColor}-600 flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white text-3xl">
            {getFileIcon(book.type)}
          </div>
        </div>
        
        {/* العنوان */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
            {book.title}
          </h3>
          
          {/* المؤلف */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4" />
            <span className="line-clamp-1">{book.author}</span>
          </div>
        </div>
        
        {/* الشارات */}
        <div className="flex flex-wrap gap-2 justify-center">
          {/* شارة الصف الدراسي */}
          <Badge 
            variant="secondary" 
            className={`bg-${categoryColor}-100 text-${categoryColor}-800 dark:bg-${categoryColor}-900 dark:text-${categoryColor}-200 border-${categoryColor}-300`}
          >
            <BookOpen className="w-3 h-3 ml-1" />
            {book.grade}
          </Badge>
          
          {/* شارة نوع الملف */}
          <Badge 
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            <FileText className="w-3 h-3 ml-1" />
            {book.type}
          </Badge>
          
          {/* شارة اللغة */}
          <Badge 
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            {book.language}
          </Badge>
        </div>
        
        {/* معلومات إضافية */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{book.pages} صفحة</span>
          </div>
          
          {book.publishedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{book.publishedDate}</span>
            </div>
          )}
        </div>
        
        {/* زر التفاصيل */}
        <Button 
          className={`w-full ${categoryColorClass} hover:opacity-90 text-white`}
          onClick={(e) => {
            e.stopPropagation();
            onClick(book);
          }}
          aria-label={`عرض تفاصيل ${book.title}`}
        >
          عرض التفاصيل
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookCard;
