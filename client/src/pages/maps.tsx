import { useState, useMemo, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import OptimizedCard from "@/components/OptimizedCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  Map, 
  Navigation, 
  MapPin, 
  Compass, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Phone, 
  Globe, 
  Car, 
  Building, 
  Heart, 
  Camera,
  Waves,
  TreePine,
  Mountain,
  Sun,
  Anchor,
  MapIcon,
  ExternalLink,
  Route,
  Calendar,
  Users,
  Award,
  ShoppingBag
} from "lucide-react";
import DetailsModal from "@/components/DetailsModal";

export default function MapsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Memoized callbacks for better performance
  const handleAttractionClick = useCallback((attraction: any) => {
    setSelectedAttraction(attraction);
    setIsDetailsModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedAttraction(null);
  }, []);

  // المعالم السياحية والمتنزهات والسواحل في عدن 2025
  const touristAttractions = [
    {
      id: 1,
      name: "شاطئ الذهب (Gold Mohur Beach)",
      description: "أشهر شاطئ في عدن مع رمال ذهبية ومياه صافية",
      icon: Waves,
      color: "bg-blue-500",
      category: "beaches",
      rating: 4.8,
      location: "Gold Mohur, Aden, Yemen",
      coordinates: "12.8282, 45.0365",
      googleMapsUrl: "https://maps.google.com/?q=Gold+Mohur+Beach+Aden+Yemen",
      features: ["شاطئ نظيف", "مياه صافية", "مرافق سياحية", "مطاعم"],
      bestTime: "طوال السنة",
      entryFee: "مجاني",
      openingHours: "24/7",
      images: ["🏖️", "🌊", "☀️"]
    },
    {
      id: 2,
      name: "شاطئ الحسوة (Al-Haswah Beach)",
      description: "شاطئ هادئ ومناسب للعائلات مع إطلالة رائعة",
      icon: Anchor,
      color: "bg-cyan-500",
      category: "beaches",
      rating: 4.6,
      location: "Al-Haswah, Aden, Yemen",
      coordinates: "12.7890, 45.0123",
      googleMapsUrl: "https://maps.google.com/?q=Al-Haswah+Beach+Aden+Yemen",
      features: ["هادئ", "مناسب للعائلات", "إطلالة جميلة", "أمان"],
      bestTime: "أكتوبر - أبريل",
      entryFee: "مجاني",
      openingHours: "6:00 AM - 8:00 PM",
      images: ["🏖️", "👨‍👩‍👧‍👦", "🌅"]
    },
    {
      id: 3,
      name: "حديقة عدن العامة (Aden Public Garden)",
      description: "أكبر حديقة عامة في عدن مع مساحات خضراء واسعة",
      icon: TreePine,
      color: "bg-green-500",
      category: "parks",
      rating: 4.5,
      location: "Aden Public Garden, Crater, Aden, Yemen",
      coordinates: "12.7794, 45.0367",
      googleMapsUrl: "https://maps.google.com/?q=Aden+Public+Garden+Yemen",
      features: ["مساحات خضراء", "ملاعب", "مقاعد", "نوافير"],
      bestTime: "طوال السنة",
      entryFee: "مجاني",
      openingHours: "6:00 AM - 10:00 PM",
      images: ["🌳", "🌿", "🏃‍♂️"]
    },
    {
      id: 4,
      name: "منتزه التواهي (Tawahi Park)",
      description: "منتزه حديث مع إطلالة على البحر الأحمر",
      icon: Mountain,
      color: "bg-emerald-500",
      category: "parks",
      rating: 4.4,
      location: "Tawahi, Aden, Yemen",
      coordinates: "12.7654, 45.0234",
      googleMapsUrl: "https://maps.google.com/?q=Tawahi+Park+Aden+Yemen",
      features: ["إطلالة بحرية", "منتزه حديث", "مرافق متطورة", "ألعاب"],
      bestTime: "طوال السنة",
      entryFee: "5 ريال",
      openingHours: "7:00 AM - 9:00 PM",
      images: ["🌊", "🎠", "🌴"]
    },
    {
      id: 5,
      name: "قلعة صيرة (Sira Castle)",
      description: "قلعة تاريخية تعود للقرن السادس عشر مع إطلالة بانورامية",
      icon: Building,
      color: "bg-amber-500",
      category: "historical",
      rating: 4.7,
      location: "Sira Island, Aden, Yemen",
      coordinates: "12.7778, 45.0111",
      googleMapsUrl: "https://maps.google.com/?q=Sira+Castle+Aden+Yemen",
      features: ["تاريخي", "إطلالة بانورامية", "تصوير", "ثقافي"],
      bestTime: "أكتوبر - مارس",
      entryFee: "10 ريال",
      openingHours: "8:00 AM - 6:00 PM",
      images: ["🏰", "📸", "🌅"]
    },
    {
      id: 6,
      name: "متحف عدن الوطني (Aden National Museum)",
      description: "متحف يضم آثار وتاريخ عدن القديم",
      icon: Award,
      color: "bg-purple-500",
      category: "cultural",
      rating: 4.3,
      location: "Crater, Aden, Yemen",
      coordinates: "12.7794, 45.0367",
      googleMapsUrl: "https://maps.google.com/?q=Aden+National+Museum+Yemen",
      features: ["آثار", "تاريخ", "ثقافي", "تعليمي"],
      bestTime: "طوال السنة",
      entryFee: "15 ريال",
      openingHours: "9:00 AM - 5:00 PM",
      images: ["🏛️", "📚", "🔍"]
    },
    {
      id: 7,
      name: "سوق العيدروس (Al-Aidrus Market)",
      description: "سوق تقليدي شهير للملابس والحرف اليدوية",
      icon: ShoppingBag,
      color: "bg-orange-500",
      category: "shopping",
      rating: 4.2,
      location: "Al-Aidrus, Crater, Aden, Yemen",
      coordinates: "12.7794, 45.0367",
      googleMapsUrl: "https://maps.google.com/?q=Al-Aidrus+Market+Aden+Yemen",
      features: ["حرف يدوية", "ملابس تقليدية", "هدايا", "ثقافي"],
      bestTime: "طوال السنة",
      entryFee: "مجاني",
      openingHours: "8:00 AM - 10:00 PM",
      images: ["🛍️", "👗", "🎁"]
    },
    {
      id: 8,
      name: "شاطئ الصافية (Al-Safiyah Beach)",
      description: "شاطئ صغير وهادئ مع مياه صافية ونظيفة",
      icon: Sun,
      color: "bg-yellow-500",
      category: "beaches",
      rating: 4.5,
      location: "Al-Safiyah, Aden, Yemen",
      coordinates: "12.8000, 45.0500",
      googleMapsUrl: "https://maps.google.com/?q=Al-Safiyah+Beach+Aden+Yemen",
      features: ["هادئ", "مياه صافية", "نظيف", "خاص"],
      bestTime: "أكتوبر - أبريل",
      entryFee: "مجاني",
      openingHours: "6:00 AM - 8:00 PM",
      images: ["🏖️", "🌊", "☀️"]
    },
    {
      id: 9,
      name: "حديقة الزهور (Flower Garden)",
      description: "حديقة متخصصة في زراعة الزهور والنباتات النادرة",
      icon: Camera,
      color: "bg-pink-500",
      category: "parks",
      rating: 4.4,
      location: "Khormaksar, Aden, Yemen",
      coordinates: "12.8000, 45.0500",
      googleMapsUrl: "https://maps.google.com/?q=Flower+Garden+Khormaksar+Aden+Yemen",
      features: ["زهور", "نباتات نادرة", "تصوير", "هدوء"],
      bestTime: "فبراير - مايو",
      entryFee: "8 ريال",
      openingHours: "7:00 AM - 7:00 PM",
      images: ["🌸", "📸", "🌺"]
    },
    {
      id: 10,
      name: "منطقة التواهي البحرية (Tawahi Marine Area)",
      description: "منطقة بحرية جميلة مع إطلالة على الميناء",
      icon: Globe,
      color: "bg-teal-500",
      category: "beaches",
      rating: 4.6,
      location: "Tawahi, Aden, Yemen",
      coordinates: "12.7654, 45.0234",
      googleMapsUrl: "https://maps.google.com/?q=Tawahi+Marine+Area+Aden+Yemen",
      features: ["إطلالة ميناء", "مياه نظيفة", "نشاطات بحرية", "مطاعم"],
      bestTime: "طوال السنة",
      entryFee: "مجاني",
      openingHours: "24/7",
      images: ["🌊", "⚓", "🍽️"]
    }
  ];

  const categories = [
    { id: "all", name: "الكل", icon: Map },
    { id: "beaches", name: "الشواطئ", icon: Waves },
    { id: "parks", name: "المتنزهات", icon: TreePine },
    { id: "historical", name: "تاريخي", icon: Building },
    { id: "cultural", name: "ثقافي", icon: Award },
    { id: "shopping", name: "تسوق", icon: ShoppingBag }
  ];

  // Memoized filtered attractions with debounced search
  const filteredAttractions = useMemo(() => {
    return touristAttractions.filter(attraction => {
      const matchesSearch = attraction.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                           attraction.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || attraction.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [debouncedSearchQuery, selectedCategory, touristAttractions]);

  const openGoogleMaps = (url: string) => {
    window.open(url, '_blank');
  };

  // دالة لفتح نافذة التفاصيل
  const handleShowDetails = (attraction: any) => {
    setSelectedAttraction(attraction);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-x-hidden">
      <AppHeader />
      
      <div className="w-full px-3 py-4 sm:py-8" style={{ maxWidth: '100vw', boxSizing: 'border-box' }}>
        {/* العنوان الرئيسي */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
              <Map className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">خرائط عدن التفاعلية</h1>
              <p className="text-blue-200 text-xs sm:text-sm lg:text-base">خريطة تفاعلية محدثة لعدن والمناطق السياحية</p>
            </div>
          </div>
          
          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 sm:p-3 shadow-xl border border-green-400">
              <div className="text-base sm:text-lg font-bold text-white mb-1">{touristAttractions.length}</div>
              <div className="text-xs text-green-100">معالم سياحية</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 sm:p-3 shadow-xl border border-blue-400">
              <div className="text-base sm:text-lg font-bold text-white mb-1">{touristAttractions.filter(a => a.category === 'beaches').length}</div>
              <div className="text-xs text-blue-100">شواطئ</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 sm:p-3 shadow-xl border border-purple-400">
              <div className="text-base sm:text-lg font-bold text-white mb-1">{touristAttractions.filter(a => a.category === 'parks').length}</div>
              <div className="text-xs text-purple-100">متنزهات</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2 sm:p-3 shadow-xl border border-orange-400">
              <div className="text-base sm:text-lg font-bold text-white mb-1">4.5</div>
              <div className="text-xs text-orange-100">تقييم متوسط</div>
            </div>
          </div>
        </div>

        {/* شريط البحث والفلترة */}
        <Card className="mb-4 sm:mb-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* البحث */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="ابحث عن معلم سياحي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-3 sm:pl-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                />
              </div>
              
              {/* فلترة الفئات */}
              <div className="relative">
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pr-10 pl-3 sm:pl-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none text-sm sm:text-base"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-slate-700">
                      {category.name}
                    </option>
                  ))}
                </select>
                  </div>
                </div>
              </CardContent>
            </Card>

        {/* قائمة المعالم السياحية */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredAttractions.map((attraction) => {
              const IconComponent = attraction.icon;
              
              return (
                <OptimizedCard
                  key={attraction.id}
                  className="ad-card rounded-2xl overflow-hidden bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleAttractionClick(attraction)}
                >
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    {/* أيقونة المعلم */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${attraction.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    
                    {/* البيانات الأساسية */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-green-400 transition-colors truncate">
                          {attraction.name}
                        </h3>
                        <Badge variant="secondary" className="bg-slate-700 text-slate-200 text-xs">
                          {attraction.rating} ⭐
                        </Badge>
                      </div>
                      
                      {/* الموقع المختصر */}
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-300 truncate">
                          {typeof attraction.location === 'string' ? attraction.location.split(',')[0] : attraction.location}
                        </p>
                      </div>

                      {/* الميزات المختصرة */}
                      <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                        {attraction.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {feature}
                          </Badge>
                        ))}
                        {attraction.features.length > 2 && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            +{attraction.features.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* الأزرار */}
                  <div className="action-buttons flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoogleMaps(attraction.googleMapsUrl);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 sm:py-2"
                      size="sm"
                    >
                      <MapIcon className="w-3 h-3 mr-1" />
                      خرائط جوجل
                    </Button>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openGoogleMaps(`https://maps.google.com/?q=${attraction.coordinates}`);
                      }}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 text-xs py-1.5 sm:py-2"
                      size="sm"
                    >
                      <Route className="w-3 h-3 mr-1" />
                      الاتجاهات
                    </Button>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowDetails(attraction);
                      }}
                      variant="outline"
                      className="flex-1 border-blue-600 text-blue-400 hover:bg-blue-900/20 text-xs py-1.5 sm:py-2"
                      size="sm"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      التفاصيل
                    </Button>
                  </div>
                </OptimizedCard>
              );
            })}
          </div>
        </div>

        {/* معلومات إضافية */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg p-3 sm:p-4">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                <Compass className="w-3 h-3 sm:w-4 sm:h-4 text-slate-900" />
              </div>
              دليل استخدام الخرائط التفاعلية
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-slate-900/30 p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-700/50 rounded-lg">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-yellow-400" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-xs sm:text-sm">أفضل الأوقات للزيارة</h4>
                  <p className="text-xs sm:text-sm text-slate-300">أكتوبر إلى أبريل هو أفضل وقت لزيارة الشواطئ والمعالم الخارجية</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-700/50 rounded-lg">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-purple-400" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-xs sm:text-sm">التصوير</h4>
                  <p className="text-xs sm:text-sm text-slate-300">احرص على التقاط الصور في الصباح الباكر أو قبل الغروب للحصول على أفضل الإضاءات</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-700/50 rounded-lg">
                <Waves className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-blue-400" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-xs sm:text-sm">الشواطئ</h4>
                  <p className="text-xs sm:text-sm text-slate-300">معظم الشواطئ مجانية ومفتوحة 24/7، احرص على أخذ الحذر عند السباحة</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-700/50 rounded-lg">
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-green-400" />
                <div>
                  <h4 className="font-semibold text-white mb-1 text-xs sm:text-sm">الخرائط</h4>
                  <p className="text-xs sm:text-sm text-slate-300">استخدم خرائط جوجل للحصول على الاتجاهات الدقيقة وأحدث المعلومات</p>
                </div>
              </div>
          </div>
          </CardContent>
        </Card>
        </div>
      
      <AppFooter />

      {/* نافذة التفاصيل */}
      {selectedAttraction && (
        <DetailsModal
          open={isDetailsModalOpen}
          onOpenChange={handleCloseModal}
          title={selectedAttraction.name}
          subtitle={`${selectedAttraction.category === 'beaches' ? 'شاطئ' : 
                     selectedAttraction.category === 'parks' ? 'متنزه' :
                     selectedAttraction.category === 'historical' ? 'معلم تاريخي' :
                     selectedAttraction.category === 'cultural' ? 'معلم ثقافي' :
                     selectedAttraction.category === 'shopping' ? 'مركز تسوق' : 'معلم سياحي'}`}
          image={selectedAttraction.images[0]}
          sections={[
            {
              title: 'معلومات عامة',
              icon: <MapPin className="w-5 h-5 text-blue-400" />,
              items: [
                { label: 'الوصف', value: selectedAttraction.description },
                { label: 'التقييم', value: selectedAttraction.rating, type: 'rating' },
                { label: 'الموقع الكامل', value: typeof selectedAttraction.location === 'string' ? selectedAttraction.location : JSON.stringify(selectedAttraction.location), icon: <MapPin className="w-4 h-4 text-blue-400" /> },
                { label: 'الإحداثيات', value: selectedAttraction.coordinates, icon: <Compass className="w-4 h-4 text-green-400" /> },
              ]
            },
            {
              title: 'معلومات الزيارة',
              icon: <Clock className="w-5 h-5 text-green-400" />,
              items: [
                { label: 'ساعات العمل', value: selectedAttraction.openingHours, icon: <Clock className="w-4 h-4 text-orange-400" /> },
                { label: 'أفضل وقت للزيارة', value: selectedAttraction.bestTime, icon: <Calendar className="w-4 h-4 text-purple-400" /> },
                { label: 'رسوم الدخول', value: selectedAttraction.entryFee, icon: <Users className="w-4 h-4 text-green-400" /> },
              ]
            },
            {
              title: 'الميزات والخدمات',
              icon: <Award className="w-5 h-5 text-yellow-400" />,
              items: [
                { label: 'الميزات المتاحة', value: selectedAttraction.features.join('، ') },
                { label: 'الصور', value: selectedAttraction.images.join(' ') },
              ]
            }
          ]}
          actions={[
            {
              label: 'عرض على خرائط جوجل',
              onClick: () => openGoogleMaps(selectedAttraction.googleMapsUrl),
              icon: <MapIcon className="w-4 h-4" />,
              variant: 'default' as const
            },
            {
              label: 'الحصول على الاتجاهات',
              onClick: () => openGoogleMaps(`https://maps.google.com/?q=${selectedAttraction.coordinates}`),
              icon: <Route className="w-4 h-4" />,
              variant: 'outline' as const
            }
          ]}
        />
      )}
    </div>
  );
}
