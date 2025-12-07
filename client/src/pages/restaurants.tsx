import React, { useState } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Navigation,
  Search,
  Filter,
  Utensils,
  Coffee,
  Pizza,
  Fish,
  Beef,
  Salad,
  IceCream
} from 'lucide-react';

export default function RestaurantsPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const categories = [
    { id: 'all', name: 'جميع المطاعم', icon: '🍽️' },
    { id: 'traditional', name: 'مطاعم تقليدية', icon: '🥘' },
    { id: 'fast-food', name: 'وجبات سريعة', icon: '🍔' },
    { id: 'seafood', name: 'مأكولات بحرية', icon: '🐟' },
    { id: 'cafe', name: 'مقاهي', icon: '☕' },
    { id: 'desserts', name: 'حلويات', icon: '🍰' }
  ];

  const districts = [
    'جميع المناطق', 'صيرة', 'الشيخ عثمان', 'المنصورة', 'التواهي', 
    'كريتر', 'خور مكسر', 'المعلا', 'دار سعد', 'البريقة'
  ];

  const restaurants = [
    {
      id: 1,
      name: 'مطعم البحر الأحمر',
      category: 'seafood',
      district: 'التواهي',
      rating: 4.8,
      priceRange: '$$$',
      status: 'مفتوح',
      phone: '02358260',
      address: 'شارع التواهي الرئيسي',
      description: 'أفضل المأكولات البحرية الطازجة في عدن',
      image: '🐟',
      specialties: ['سمك مشوي', 'جمبري', 'كابوريا'],
      openHours: '12:00 - 23:00'
    },
    {
      id: 2,
      name: 'مقهى عدن القديمة',
      category: 'cafe',
      district: 'كريتر',
      rating: 4.6,
      priceRange: '$$',
      status: 'مفتوح',
      phone: '02354915',
      address: 'سوق كريتر',
      description: 'مقهى تراثي يقدم أفضل القهوة اليمنية',
      image: '☕',
      specialties: ['قهوة يمنية', 'شاي بالحليب', 'بسكويت'],
      openHours: '06:00 - 22:00'
    },
    {
      id: 3,
      name: 'مطعم المنصورة',
      category: 'traditional',
      district: 'المنصورة',
      rating: 4.7,
      priceRange: '$$',
      status: 'مفتوح',
      phone: '02358259',
      address: 'شارع المنصورة',
      description: 'أطباق يمنية تقليدية أصيلة',
      image: '🥘',
      specialties: ['مندي', 'كبسة', 'حنيذ'],
      openHours: '11:00 - 24:00'
    },
    {
      id: 4,
      name: 'برجر كينج عدن',
      category: 'fast-food',
      district: 'خور مكسر',
      rating: 4.3,
      priceRange: '$$',
      status: 'مفتوح',
      phone: '02354914',
      address: 'مول خور مكسر',
      description: 'وجبات سريعة عالمية',
      image: '🍔',
      specialties: ['برجر', 'بطاطس', 'مشروبات'],
      openHours: '10:00 - 02:00'
    },
    {
      id: 5,
      name: 'حلويات البريقة',
      category: 'desserts',
      district: 'البريقة',
      rating: 4.9,
      priceRange: '$',
      status: 'مفتوح',
      phone: '02358261',
      address: 'شارع البريقة',
      description: 'أشهى الحلويات الشرقية والغربية',
      image: '🍰',
      specialties: ['بسبوسة', 'كنافة', 'تيراميسو'],
      openHours: '08:00 - 23:00'
    },
    {
      id: 6,
      name: 'مطعم الشرق الأوسط',
      category: 'traditional',
      district: 'صيرة',
      rating: 4.5,
      priceRange: '$$$',
      status: 'مغلق',
      phone: '02358262',
      address: 'شارع صيرة',
      description: 'مأكولات شرق أوسطية متنوعة',
      image: '🥙',
      specialties: ['شاورما', 'كباب', 'فلافل'],
      openHours: '12:00 - 23:00'
    }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || restaurant.category === selectedCategory;
    const matchesDistrict = selectedDistrict === '' || selectedDistrict === 'جميع المناطق' || restaurant.district === selectedDistrict;
    
    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'seafood': return <Fish className="w-5 h-5" />;
      case 'cafe': return <Coffee className="w-5 h-5" />;
      case 'fast-food': return <Pizza className="w-5 h-5" />;
      case 'traditional': return <Utensils className="w-5 h-5" />;
      case 'desserts': return <IceCream className="w-5 h-5" />;
      default: return <Utensils className="w-5 h-5" />;
    }
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-green-600';
      case '$$': return 'text-yellow-600';
      case '$$$': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fb7185' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <AppHeader />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-rose-200/50 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation('/')}
                className="p-2 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-rose-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">مطاعم عدن</h1>
                  <p className="text-rose-600 font-medium">أفضل المطاعم والمقاهي في عدن</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث عن مطعم أو نوع طعام..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-1" />
                  نوع المطعم
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">جميع الأنواع</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  المنطقة
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  {districts.map(district => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              تم العثور على <span className="font-bold text-rose-600">{filteredRestaurants.length}</span> مطعم
            </p>
          </div>

          {/* Restaurants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-rose-200/50 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{restaurant.image}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm">{restaurant.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{restaurant.description}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{restaurant.openHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getPriceColor(restaurant.priceRange)}`}>
                      {restaurant.priceRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      restaurant.status === 'مفتوح' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">الأطباق المميزة:</h4>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.specialties.map((specialty, index) => (
                      <span key={index} className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{restaurant.address}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(`tel:${restaurant.phone}`, '_self')}
                    className="flex-1 bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    اتصل
                  </button>
                  <button
                    onClick={() => {
                      const query = encodeURIComponent(`${restaurant.name} ${restaurant.address} عدن`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    موقع
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">لم يتم العثور على مطاعم</h3>
              <p className="text-gray-600">جرب تغيير معايير البحث</p>
            </div>
          )}
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
