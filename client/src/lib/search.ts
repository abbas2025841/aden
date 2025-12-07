export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  rating?: number;
  phone?: string;
  hours?: string;
  distance?: string;
  image?: string;
}

export interface SearchFilters {
  category?: string[];
  location?: string[];
  rating?: number;
  priceRange?: [number, number];
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'name' | 'date' | 'priority' | 'distance' | 'rating';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
  suggestions: string[];
}

// بيانات وهمية للبحث
const mockData: SearchResult[] = [
  {
    id: '1',
    title: 'مستشفى الجمهورية',
    description: 'مستشفى حكومي يقدم خدمات طبية شاملة',
    category: 'مستشفى',
    location: 'كريتر، عدن',
    rating: 4.5,
    phone: '+967-2-234567',
    hours: '24/7',
    distance: '2.5 كم'
  },
  {
    id: '2',
    title: 'مطار عدن الدولي',
    description: 'المطار الرئيسي لمدينة عدن',
    category: 'مطار',
    location: 'المنصورة، عدن',
    rating: 4.2,
    phone: '+967-2-345678',
    hours: '24/7',
    distance: '15 كم'
  },
  {
    id: '3',
    title: 'جامعة عدن',
    description: 'الجامعة الرئيسية في عدن',
    category: 'جامعة',
    location: 'كريتر، عدن',
    rating: 4.7,
    phone: '+967-2-456789',
    hours: '8:00 - 16:00',
    distance: '3 كم'
  },
  {
    id: '4',
    title: 'سوق الصالح',
    description: 'سوق شعبي كبير في عدن',
    category: 'سوق',
    location: 'كريتر، عدن',
    rating: 4.0,
    hours: '6:00 - 22:00',
    distance: '1.5 كم'
  },
  {
    id: '5',
    title: 'شاطئ الغدير',
    description: 'شاطئ جميل في عدن',
    category: 'شاطئ',
    location: 'التواهي، عدن',
    rating: 4.3,
    hours: '24/7',
    distance: '8 كم'
  }
];

export function search(query: string, options: Partial<SearchOptions> = {}): SearchResponse {
  const { limit = 20, offset = 0 } = options;
  
  const filteredResults = mockData.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return {
    results: filteredResults.slice(offset, offset + limit),
    total: filteredResults.length,
    hasMore: filteredResults.length > offset + limit,
    suggestions: ['مستشفى', 'مطار', 'جامعة', 'سوق', 'شاطئ']
  };
}

export function quickSearch(query: string): SearchResult[] {
  return search(query).results.slice(0, 5);
}

export function advancedSearch(options: SearchOptions): SearchResponse {
  return search(options.query, options);
}

export function getSuggestions(query: string): string[] {
  return ['مستشفى', 'مطار', 'جامعة', 'سوق', 'شاطئ'].filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );
}

export function getSearchStats() {
  return {
    totalItems: mockData.length,
    categories: ['مستشفى', 'مطار', 'جامعة', 'سوق', 'شاطئ'],
    lastUpdated: new Date().toISOString()
  };
}

export function searchInCategory(category: string, query: string): SearchResult[] {
  return mockData.filter(item =>
    item.category === category &&
    (item.title.toLowerCase().includes(query.toLowerCase()) ||
     item.description.toLowerCase().includes(query.toLowerCase()))
  );
}