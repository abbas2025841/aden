/**
 * Digital Library Page - Flowbite Version
 * صفحة المكتبة الرقمية - نسخة Flowbite
 */

// React imports
import { useState, useMemo } from 'react';

// Third-party libraries
import { useLocation } from 'wouter';

// Icons
import {
  BookOpen,
  ArrowLeft,
  Download,
  XCircle,
  FileText,
  Library,
} from 'lucide-react';

// Local components
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { BookGrid, SearchBar, FilterButtons } from '@/components/library';

// Hooks
import { useDebounce } from '@/hooks/useDebounce';

// Types
import type { Book } from '@/types/book';
import type { FilterOption } from '@/types/library';

// بيانات المكتبة الرقمية (مؤقتاً - سيتم نقلها لملف منفصل)
const digitalLibrary: Book[] = [
  {
    id: 9,
    title: "القرآن الكريم وعلومه والتربية الإسلامية",
    author: "وزارة التربية والتعليم - عدن",
    category: "islamic",
    subject: "القرآن الكريم وعلومه والتربية الإسلامية الجزء الأول",
    grade: "الصف الأول",
    type: "كتاب",
    language: "عربي",
    pages: 98,
    downloads: 0,
    description: "كتاب تعليمي يُرسّخ القيم الإسلامية",
    tags: ["قرآن كريم", "تربية إسلامية", "منهج يمني"],
    fileUrl: "https://www.dropbox.com/scl/fi/za7ozkfltdtulzlcag1hd/_-_-_-_-_-_-_-_-_2015_-_-_-_-1.pdf?rlkey=bh7oo8f6hf45ay997uy9xwkgf&e=1&dl=1",
    coverImage: "📖",
    publishedDate: "2015",
    publisher: "وزارة التربية والتعليم - عدن",
    isbn: "-",
    license: "مجاني",
  },
  // المزيد من الكتب...
];

export default function DigitalLibraryPageFlowbite() {
  const [, setLocation] = useLocation();
  
  // State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'downloads' | 'title' | 'author'>('downloads');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 300);

  // إحصائيات
  const stats = useMemo(() => {
    const total = digitalLibrary.length;
    const totalDownloads = digitalLibrary.reduce((sum, book) => sum + book.downloads, 0);
    const totalPages = digitalLibrary.reduce((sum, book) => sum + book.pages, 0);
    
    return { total, totalDownloads, totalPages };
  }, []);

  // فلترة الكتب
  const filteredBooks = useMemo(() => {
    let result = [...digitalLibrary];

    if (debouncedSearch) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        book.author.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        book.subject.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(book => book.category === categoryFilter);
    }

    if (gradeFilter !== 'all') {
      result = result.filter(book => book.grade === gradeFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(book => book.type === typeFilter);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title, 'ar');
        case 'author':
          return a.author.localeCompare(b.author, 'ar');
        case 'downloads':
        default:
          return b.downloads - a.downloads;
      }
    });

    return result;
  }, [debouncedSearch, categoryFilter, gradeFilter, typeFilter, sortBy]);

  // Filter options
  const categoryFilters: FilterOption[] = [
    { id: 'all', label: 'الكل', icon: <Library className="w-4 h-4" /> },
    { id: 'mathematics', label: 'الرياضيات' },
    { id: 'arabic', label: 'اللغة العربية' },
    { id: 'science', label: 'العلوم' },
    { id: 'islamic', label: 'التربية الإسلامية' },
  ];

  // Event handlers
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
  };

  const handleBookDownload = (book: Book) => {
    window.open(book.fileUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setGradeFilter('all');
    setTypeFilter('all');
    setSortBy('downloads');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" dir="rtl">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setLocation('/education')}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 
              transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة إلى التعليم</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <Library className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">المكتبة الرقمية</h1>
          </div>

          <p className="text-gray-300 text-lg">
            مكتبة شاملة للمواد التعليمية والكتب الدراسية
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg 
            p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm mb-1">إجمالي الكتب</p>
                <p className="text-white text-3xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="w-12 h-12 text-purple-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg 
            p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm mb-1">إجمالي التحميلات</p>
                <p className="text-white text-3xl font-bold">
                  {stats.totalDownloads.toLocaleString()}
                </p>
              </div>
              <Download className="w-12 h-12 text-green-300" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg 
            p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm mb-1">إجمالي الصفحات</p>
                <p className="text-white text-3xl font-bold">
                  {stats.totalPages.toLocaleString()}
                </p>
              </div>
              <FileText className="w-12 h-12 text-blue-300" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-8 border border-gray-700">
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
              debounceMs={300}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-white font-semibold mb-3">تصفية حسب المادة</h3>
            <FilterButtons
              activeFilter={categoryFilter}
              onFilterChange={setCategoryFilter}
              filters={categoryFilters}
            />
          </div>

          {(searchQuery || categoryFilter !== 'all' || gradeFilter !== 'all' || 
            typeFilter !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 
                transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>مسح جميع الفلاتر</span>
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-300">
            عرض <span className="text-white font-bold">{filteredBooks.length}</span> من{' '}
            <span className="text-white font-bold">{stats.total}</span> كتاب
          </p>
        </div>

        {/* Books Grid */}
        <BookGrid
          books={filteredBooks}
          onBookClick={handleBookClick}
          onBookDownload={handleBookDownload}
        />

        {/* Book Details Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center 
            p-4 z-50" onClick={() => setSelectedBook(null)}>
            <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] 
              overflow-y-auto border border-purple-600" 
              onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{selectedBook.coverImage}</span>
                  {selectedBook.title}
                </h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-purple-300 font-semibold mb-1">المؤلف</h4>
                  <p className="text-gray-300">{selectedBook.author}</p>
                </div>

                <div>
                  <h4 className="text-purple-300 font-semibold mb-1">الوصف</h4>
                  <p className="text-gray-300">{selectedBook.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-1">الصفحات</h4>
                    <p className="text-gray-300">{selectedBook.pages}</p>
                  </div>
                  <div>
                    <h4 className="text-purple-300 font-semibold mb-1">التحميلات</h4>
                    <p className="text-gray-300">{selectedBook.downloads}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleBookDownload(selectedBook)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white 
                    py-3 rounded-lg flex items-center justify-center gap-2 
                    transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>تحميل الكتاب</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
