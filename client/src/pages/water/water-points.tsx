import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import DirectionsButton from '@/components/DirectionsButton';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/lib/supabase';
import { 
  Droplets, 
  MapPin, 
  Phone, 
  Clock,
  ArrowLeft,
  Shield,
  Send,
  AlertTriangle,
  ChevronDown,
  Filter,
  Plus,
  X,
  Save,
  User,
  Map
} from 'lucide-react';

const WaterPointsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Debounced search for better performance
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Memoized callbacks for better performance
  const handlePointClick = useCallback((pointId: string) => {
    setSelectedPoint(selectedPoint === pointId ? null : pointId);
  }, [selectedPoint]);
  
  const handleDistrictChange = useCallback((district: string) => {
    setSelectedDistrict(district);
    setIsDropdownOpen(false);
  }, []);
  const [newWaterPoint, setNewWaterPoint] = useState({
    name: '',
    location: '',
    district: '',
    status: 'مفتوحة',
    quality: 'جيدة',
    price: 'مجانية',
    description: '',
    responsible: '',
    contact: '',
    lat: 0,
    lng: 0
  });

  // متغيرات التقييم
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedPointForRating, setSelectedPointForRating] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [showRatingInfo, setShowRatingInfo] = useState(false);

  // قائمة المناطق
  const districts = [
    { id: 'all', name: 'جميع المناطق', count: 28 },
    { id: 'كريتر', name: 'مديرية كريتر', count: 3 },
    { id: 'المعلا', name: 'مديرية المعلا', count: 3 },
    { id: 'التواهي', name: 'مديرية التواهي', count: 3 },
    { id: 'الشيخ عثمان', name: 'مديرية الشيخ عثمان', count: 3 },
    { id: 'المنصورة', name: 'مديرية المنصورة', count: 3 },
    { id: 'دار سعد', name: 'مديرية دار سعد', count: 3 },
    { id: 'البريقة', name: 'مديرية البريقة', count: 3 },
    { id: 'خور مكسر', name: 'مديرية خور مكسر', count: 3 },
    { id: 'القلوعه', name: 'مديرية القلوعة', count: 1 },
    { id: 'الممدارة', name: 'مديرية الممدارة', count: 1 },
    { id: 'أخرى', name: 'نقاط أخرى', count: 2 }
  ];

  const waterPoints = [
    // مديرية كريتر
    {
      id: 'point1',
      name: 'براد مياه مسجد العيدروس التاريخي',
      location: 'بجوار منارة العيدروس، كريتر التاريخية',
      district: 'كريتر',
      status: 'مفتوحة من 5 صباحاً - 10 مساءً',
      statusColor: 'green',
      distance: '500 متر منك',
      quality: 'ممتازة (مفلترة)',
      description: 'براد حديث تحت إشراف إدارة المسجد',
      tags: ['براد حديث', 'إشراف إدارة المسجد', 'مفلترة'],
      price: 'مجانية تماماً',
      operatingHours: '5:00 صباحاً - 10:00 مساءً',
      icon: '🚰',
      coordinates: '12.7794° N, 45.0367° E',
      lat: 12.7794,
      lng: 45.0367,
      responsible: 'إدارة مسجد العيدروس',
      ratings: { good: 15, bad: 2, total: 17 },
      ratingPercentage: 88
    },
    {
      id: 'point2',
      name: 'نقطة مياه الحي الصحي',
      location: 'شارع الجمهورية الرئيسي، قرب المستشفى العسكري، كريتر',
      district: 'كريتر',
      status: 'مفتوحة 24/7',
      statusColor: 'green',
      distance: '600 متر منك',
      quality: 'ممتازة (مفلترة ومعقمة)',
      description: 'نقطة مياه حكومية معقمة ومفلترة مع مراقبة صحية دورية',
      tags: ['مفلترة', 'معقمة', 'مراقبة صحية', 'مياه محلاة'],
      price: 'مجانية',
      operatingHours: '24/7',
      icon: '🚰',
      coordinates: '12.7794° N, 45.0367° E',
      lat: 12.7794,
      lng: 45.0367,
      responsible: 'الأوقاف المحلية والمحسنين',
      ratings: { good: 22, bad: 1, total: 23 },
      ratingPercentage: 96
    },
    {
      id: 'point3',
      name: 'براد مياه جامع الأشرف',
      location: 'منطقة سيرا، كريتر',
      district: 'كريتر',
      status: 'مفتوحة أوقات الصلاة والمساء',
      statusColor: 'green',
      distance: '800 متر منك',
      quality: 'جيدة جداً',
      description: 'إدارة تطوعية مع فحص أسبوعي',
      tags: ['إدارة تطوعية', 'فحص أسبوعي'],
      price: 'مجانية',
      operatingHours: 'أوقات الصلاة والمساء',
      icon: '🚰',
      coordinates: '12.7794° N, 45.0367° E',
      lat: 12.7794,
      lng: 45.0367,
      responsible: 'إدارة جامع الأشرف',
      ratings: { good: 8, bad: 3, total: 11 },
      ratingPercentage: 73
    },
    // مديرية المعلا
    {
      id: 'point4',
      name: 'محطة تنقية مياه الميناء القديم',
      location: 'منطقة الميناء القديم، قرب محطة المعلا متعددة الأغراض',
      district: 'المعلا',
      status: 'تعمل من 6 مساءً - 10 مساءً',
      statusColor: 'yellow',
      distance: '1.2 كم منك',
      quality: 'ممتازة (أوزموز عكسي)',
      description: 'محطة تنقية حديثة بتقنية الأوزموز العكسي مع تحليل يومي',
      tags: ['أوزموز عكسي', 'تحليل يومي', 'تنقية متقدمة'],
      price: '100 ريال لكل 20 لتر (مدعومة)',
      operatingHours: '6:00 مساءً - 10:00 مساءً',
      icon: '🚰',
      coordinates: '12.7947° N, 45.0264° E',
      lat: 12.7947,
      lng: 45.0264,
      responsible: 'محطة المعلا متعددة الأغراض',
      ratings: { good: 12, bad: 4, total: 16 },
      ratingPercentage: 75
    },
    {
      id: 'point5',
      name: 'براد مياه شارع المعلا التجاري',
      location: 'الشارع التجاري الرئيسي، المعلا',
      district: 'المعلا',
      status: 'مفتوحة 7 صباحاً - 9 مساءً',
      statusColor: 'green',
      distance: '900 متر منك',
      quality: 'جيدة',
      description: 'براد خيري مع تعبئة دورية',
      tags: ['براد خيري', 'تعبئة دورية'],
      price: 'مجانية',
      operatingHours: '7:00 صباحاً - 9:00 مساءً',
      icon: '🚰',
      coordinates: '12.8000° N, 45.0000° E',
      lat: 12.8000,
      lng: 45.0000,
      responsible: 'الجمعيات الخيرية',
      ratings: { good: 6, bad: 2, total: 8 },
      ratingPercentage: 75
    },
    {
      id: 'point6',
      name: 'نقطة مياه مسجد المنارة الكبير',
      location: 'قرب ميناء المعلا، شارع الميناء',
      district: 'المعلا',
      status: 'مفتوحة بعد الصلوات',
      statusColor: 'green',
      distance: '1.1 كم منك',
      quality: 'جيدة',
      description: 'إشراف إدارة الميناء مع صيانة شهرية',
      tags: ['إدارة الميناء', 'صيانة شهرية'],
      price: 'مجانية',
      operatingHours: 'بعد الصلوات',
      icon: '🚰',
      coordinates: '12.8000° N, 45.0000° E',
      lat: 12.8000,
      lng: 45.0000,
      responsible: 'إدارة ميناء المعلا',
      ratings: { good: 9, bad: 1, total: 10 },
      ratingPercentage: 90
    },
    // مديرية التواهي
    {
      id: 'point7',
      name: 'مسجد الرحمة - التواهي',
      location: 'مديرية التواهي، حي الرحمة',
      district: 'التواهي',
      status: 'مفتوحة من 6 صباحاً - 9 مساءً',
      statusColor: 'green',
      distance: '1.5 كم منك',
      quality: 'ممتازة (مفلترة)',
      description: 'تم تجديد النظام 2025، براد متطور',
      tags: ['مفلترة', 'براد متطور', 'تجديد 2025'],
      price: 'مجانية',
      operatingHours: '6:00 صباحاً - 9:00 مساءً',
      icon: '🚰',
      coordinates: '12.7900° N, 45.0200° E',
      lat: 12.7900,
      lng: 45.0200,
      responsible: 'إدارة مسجد الرحمة'
    },
    {
      id: 'point8',
      name: 'براد مياه مسجد الجبرتي',
      location: 'مديرية التواهي',
      district: 'التواهي',
      status: 'مفتوحة أوقات الصلاة والمساء',
      statusColor: 'green',
      distance: '1.8 كم منك',
      quality: 'جيدة',
      description: 'إشراف جمعية خيرية',
      tags: ['جمعية خيرية', 'إشراف'],
      price: 'مجانية',
      operatingHours: 'أوقات الصلاة والمساء',
      icon: '🚰',
      coordinates: '12.7900° N, 45.0200° E',
      lat: 12.7900,
      lng: 45.0200,
      responsible: 'الجمعيات الخيرية'
    },
    {
      id: 'point9',
      name: 'محطة مياه خط التواهي المُحدث',
      location: 'خط التوزيع الرئيسي من العقبة إلى حجيف',
      district: 'التواهي',
      status: 'تم تأهيلها حديثاً',
      statusColor: 'green',
      distance: '2.0 كم منك',
      quality: 'ممتازة بعد التحديث',
      description: 'نظام حديث بـ 7 غرف تحكم، يخدم 96 ألف نسمة',
      tags: ['نظام حديث', '7 غرف تحكم', '96 ألف نسمة'],
      price: 'مجانية',
      operatingHours: '24/7',
      icon: '🚰',
      coordinates: '12.7900° N, 45.0200° E',
      lat: 12.7900,
      lng: 45.0200,
      responsible: 'تمويل ألماني'
    },
    // مديرية الشيخ عثمان
    {
      id: 'point10',
      name: 'بئر مسجد النور',
      location: 'حي النور، الشيخ عثمان',
      district: 'الشيخ عثمان',
      status: 'مفتوحة دائماً (24/7)',
      statusColor: 'green',
      distance: '1.1 كم منك',
      quality: 'جيدة (مياه طبيعية آمنة)',
      description: 'بئر طبيعي مع فحص محلي دوري',
      tags: ['طبيعي', 'فحص دوري', 'آمنة'],
      price: 'مجانية تماماً',
      operatingHours: '24/7',
      icon: '🚰',
      coordinates: '12.8150° N, 45.0450° E',
      lat: 12.8150,
      lng: 45.0450,
      responsible: 'إدارة مسجد النور'
    },
    {
      id: 'point11',
      name: 'براد مياه مسجد الرحمة - الشيخ عثمان',
      location: 'حي السيلة، الشيخ عثمان',
      district: 'الشيخ عثمان',
      status: 'تعمل من 5 صباحاً - 11 مساءً',
      statusColor: 'green',
      distance: '1.3 كم منك',
      quality: 'ممتازة (مفلترة)',
      description: 'براد حديث تحت إشراف مؤسسة النقيب الخيرية',
      tags: ['فلتر متقدم', 'مؤسسة النقيب', 'حديث'],
      price: 'مجانية',
      operatingHours: '5:00 صباحاً - 11:00 مساءً',
      icon: '🚰',
      coordinates: '12.8150° N, 45.0450° E',
      lat: 12.8150,
      lng: 45.0450,
      responsible: 'مؤسسة النقيب الخيرية'
    },
    {
      id: 'point12',
      name: 'براد مياه المسجد الجامع',
      location: 'المركز التجاري، الشيخ عثمان',
      district: 'الشيخ عثمان',
      status: 'مفتوحة أوقات الصلاة وبعد المغرب',
      statusColor: 'green',
      distance: '1.5 كم منك',
      quality: 'جيدة جداً',
      description: 'سعة كبيرة مع صيانة أسبوعية',
      tags: ['سعة كبيرة', 'صيانة أسبوعية'],
      price: 'مجانية',
      operatingHours: 'أوقات الصلاة وبعد المغرب',
      icon: '🚰',
      coordinates: '12.8150° N, 45.0450° E',
      lat: 12.8150,
      lng: 45.0450,
      responsible: 'إدارة المسجد الجامع'
    },
    // مديرية المنصورة
    {
      id: 'point13',
      name: 'براد مياه مسجد المنصورة الكبير',
      location: 'شارع الخمسين، المنصورة',
      district: 'المنصورة',
      status: 'مفتوحة من 6 صباحاً - 10 مساءً',
      statusColor: 'green',
      distance: '2.0 كم منك',
      quality: 'ممتازة',
      description: 'مشروع حديث مع تبريد متطور',
      tags: ['مشروع حديث', 'تبريد متطور'],
      price: 'مجانية',
      operatingHours: '6:00 صباحاً - 10:00 مساءً',
      icon: '🚰',
      coordinates: '12.8000° N, 45.0300° E',
      lat: 12.8000,
      lng: 45.0300,
      responsible: 'إدارة مسجد المنصورة'
    },
    {
      id: 'point14',
      name: 'نقطة مياه مدينة الشعب',
      location: 'مدينة الشعب، المنصورة',
      district: 'المنصورة',
      status: 'مفتوحة أوقات العمل والمساء',
      statusColor: 'green',
      distance: '2.2 كم منك',
      quality: 'جيدة جداً',
      description: 'إشراف حكومي محلي',
      tags: ['إشراف حكومي', 'محلي'],
      price: 'مجانية للمواطنين',
      operatingHours: 'أوقات العمل والمساء',
      icon: '🚰',
      coordinates: '12.8000° N, 45.0300° E',
      lat: 12.8000,
      lng: 45.0300,
      responsible: 'الحكومة المحلية'
    },
    {
      id: 'point15',
      name: 'براد مياه وزارة التربية والتعليم',
      location: 'مبنى وزارة التربية والتعليم، مدينة الشعب',
      district: 'المنصورة',
      status: 'أوقات العمل الرسمية',
      statusColor: 'green',
      distance: '2.8 كم منك',
      quality: 'ممتازة',
      description: 'إشراف مؤسسة النقيب التنموية الخيرية',
      tags: ['وزارة التربية', 'مؤسسة النقيب', 'موظفين'],
      price: 'مجانية للموظفين والمراجعين',
      operatingHours: '7:00 صباحاً - 3:00 مساءً',
      icon: '🚰',
      coordinates: '12.8000° N, 45.0300° E',
      lat: 12.8000,
      lng: 45.0300,
      responsible: 'مؤسسة النقيب التنموية'
    },
    // مديرية دار سعد
    {
      id: 'point16',
      name: 'براد مياه ثانوية عدن النموذجية',
      location: 'داخل مجمع ثانوية عدن النموذجية، دار سعد',
      district: 'دار سعد',
      status: 'تعمل أوقات المدرسة والأنشطة المسائية',
      statusColor: 'green',
      distance: '2.1 كم منك',
      quality: 'ممتازة',
      description: 'براد حديث بسعة 75 لتر مع صيانة دورية',
      tags: ['سعة 75 لتر', 'صيانة دورية', 'مدرسة'],
      price: 'مجانية للطلاب والمجتمع المحلي',
      operatingHours: 'أوقات المدرسة والأنشطة المسائية',
      icon: '🚰',
      coordinates: '12.8200° N, 45.0500° E',
      lat: 12.8200,
      lng: 45.0500,
      responsible: 'إدارة المدرسة'
    },
    {
      id: 'point17',
      name: 'نقطة مياه مسجد دار سعد الجامع',
      location: 'المسجد الجامع، مركز دار سعد',
      district: 'دار سعد',
      status: 'مفتوحة للجمهور دائماً',
      statusColor: 'green',
      distance: '2.3 كم منك',
      quality: 'جيدة جداً',
      description: 'بئر محدث تحت إشراف إدارة المسجد',
      tags: ['بئر محدث', 'إدارة المسجد'],
      price: 'مجانية',
      operatingHours: 'دائماً',
      icon: '🚰',
      coordinates: '12.8200° N, 45.0500° E',
      lat: 12.8200,
      lng: 45.0500,
      responsible: 'إدارة المسجد الجامع'
    },
    {
      id: 'point18',
      name: 'براد مياه مدرسة دار سعد الأساسية',
      location: 'المدرسة المركزية، دار سعد',
      district: 'دار سعد',
      status: 'أوقات الدراسة والأنشطة',
      statusColor: 'green',
      distance: '2.5 كم منك',
      quality: 'جيدة',
      description: 'براد تعليمي مع فحص شهري',
      tags: ['براد تعليمي', 'فحص شهري'],
      price: 'مجانية للطلاب والمعلمين',
      operatingHours: 'أوقات الدراسة والأنشطة',
      icon: '🚰',
      coordinates: '12.8200° N, 45.0500° E',
      lat: 12.8200,
      lng: 45.0500,
      responsible: 'إدارة المدرسة'
    },
    // مديرية البريقة
    {
      id: 'point19',
      name: 'نقطة مياه نبع الحياة - فقم الساحلية',
      location: 'منطقة فقم الساحلية، البريقة',
      district: 'البريقة',
      status: 'مفتوحة يومياً 6 صباحاً - 8 مساءً',
      statusColor: 'green',
      distance: '3.5 كم منك',
      quality: 'جيدة جداً',
      description: 'مشروع جديد تحت إشراف خيري مع فحص دوري',
      tags: ['مشروع جديد', 'إشراف خيري', 'فحص دوري'],
      price: 'مجانية',
      operatingHours: '6:00 صباحاً - 8:00 مساءً',
      icon: '🚰',
      coordinates: '12.8100° N, 45.0600° E',
      lat: 12.8100,
      lng: 45.0600,
      responsible: 'الجمعيات الخيرية'
    },
    {
      id: 'point20',
      name: 'براد مياه مسجد البريقة المركزي',
      location: 'مركز مدينة البريقة',
      district: 'البريقة',
      status: 'مفتوحة بعد الصلوات',
      statusColor: 'green',
      distance: '3.8 كم منك',
      quality: 'جيدة',
      description: 'براد تقليدي مع تعبئة يدوية',
      tags: ['براد تقليدي', 'تعبئة يدوية'],
      price: 'مجانية',
      operatingHours: 'بعد الصلوات',
      icon: '🚰',
      coordinates: '12.8100° N, 45.0600° E',
      lat: 12.8100,
      lng: 45.0600,
      responsible: 'إدارة مسجد البريقة'
    },
    {
      id: 'point21',
      name: 'نقطة مياه الصالحية',
      location: 'حي الصالحية، البريقة',
      district: 'البريقة',
      status: 'محطة خيرية تعمل مساءً',
      statusColor: 'green',
      distance: '4.0 كم منك',
      quality: 'ممتازة بعد التحلية',
      description: 'محطة تحلية صغيرة تحت إشراف منتدى شباب الصفوة',
      tags: ['محطة تحلية', 'منتدى شباب الصفوة'],
      price: 'مجانية',
      operatingHours: 'مساءً',
      icon: '🚰',
      coordinates: '12.8100° N, 45.0600° E',
      lat: 12.8100,
      lng: 45.0600,
      responsible: 'منتدى شباب الصفوة'
    },
    // مديرية خور مكسر
    {
      id: 'point22',
      name: 'آبار المساجد - خور مكسر المتعددة',
      location: 'مساجد متفرقة في أحياء خور مكسر',
      district: 'خور مكسر',
      status: 'متاحة معظم أوقات اليوم',
      statusColor: 'yellow',
      distance: '4.2 كم منك',
      quality: 'متغيرة (بعضها مالح، البعض الآخر جيد)',
      description: 'الأهالي يعتمدون عليها بسبب أزمة المياه الحكومية',
      tags: ['آبار مساجد', 'متغيرة الجودة', 'أحياء متعددة'],
      price: 'مجانية',
      operatingHours: 'معظم أوقات اليوم',
      icon: '🚰',
      coordinates: '12.8300° N, 45.0400° E',
      lat: 12.8300,
      lng: 45.0400,
      responsible: 'إدارات المساجد المحلية'
    },
    {
      id: 'point23',
      name: 'محطة معالجة مياه الصرف - خور مكسر الجديدة',
      location: 'المحطة الرئيسية لضخ مياه الصرف الصحي',
      district: 'خور مكسر',
      status: 'تم تدشينها حديثاً سبتمبر 2025',
      statusColor: 'green',
      distance: '4.5 كم منك',
      quality: 'نظام متطور لمعالجة المياه',
      description: 'تمويل 3 ملايين دولار من البنك الألماني (KFW)',
      tags: ['تمويل ألماني', '3 ملايين دولار', 'KFW'],
      price: 'مجانية',
      operatingHours: '24/7',
      icon: '🚰',
      coordinates: '12.8300° N, 45.0400° E',
      lat: 12.8300,
      lng: 45.0400,
      responsible: 'البنك الألماني (KFW)'
    },
    {
      id: 'point24',
      name: 'براد مياه حي الرشيد',
      location: 'حي الرشيد، خور مكسر',
      district: 'خور مكسر',
      status: 'يعاني من انقطاع المياه أحياناً',
      statusColor: 'yellow',
      distance: '4.8 كم منك',
      quality: 'جيدة عند توفر المياه',
      description: 'يحتاج لتحسين الخدمة',
      tags: ['انقطاع أحياناً', 'يحتاج تحسين'],
      price: 'مجانية',
      operatingHours: 'عند توفر المياه',
      icon: '🚰',
      coordinates: '12.8300° N, 45.0400° E',
      lat: 12.8300,
      lng: 45.0400,
      responsible: 'إدارة الحي'
    },
    // نقاط إضافية مُحدثة
    {
      id: 'point25',
      name: 'مشروع حقل بئر أحمد المُطور',
      location: 'حقل بئر أحمد',
      district: 'أخرى',
      status: 'قيد التنفيذ حالياً',
      statusColor: 'yellow',
      distance: '5.0 كم منك',
      quality: 'ممتازة بتقنيات حديثة',
      description: 'حفر وتأهيل 10 آبار جديدة باستخدام الطاقة المتجددة',
      tags: ['10 آبار جديدة', 'طاقة شمسية', 'مشروع حكومي'],
      price: 'مجانية',
      operatingHours: 'عند الانتهاء',
      icon: '🚰',
      coordinates: '12.8500° N, 45.0700° E',
      lat: 12.8500,
      lng: 45.0700,
      responsible: 'الحكومة اليمنية'
    },
    {
      id: 'point26',
      name: 'جمعية عدن الخيرية - برادات المدارس',
      location: 'مدارس مختلفة في عدن',
      district: 'أخرى',
      status: 'المرحلة الثانية من التوزيع',
      statusColor: 'green',
      distance: 'مختلفة حسب المدرسة',
      quality: 'ممتازة بمعايير تعليمية',
      description: 'توزيع برادات وثلاجات مياه للمدارس',
      tags: ['خزانات مياه باردة', 'إشراف تربوي'],
      price: 'مجانية',
      operatingHours: 'أوقات الدراسة',
      icon: '🚰',
      coordinates: '12.8000° N, 45.0000° E',
      lat: 12.8000,
      lng: 45.0000,
      responsible: 'جمعية عدن الخيرية'
    }
  ];

  const [approvedPoints, setApprovedPoints] = useState<typeof waterPoints | null>(null);

  // جلب نقاط المياه المعتمدة من Supabase
  useEffect(() => {
    const fetchApprovedPoints = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('water_points')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map((p: any, index: number) => ({
            id: p.id || `supabase-${index}`,
            name: p.name || 'نقطة مياه بدون اسم',
            location: p.location || 'غير محدد',
            district: p.district || 'غير محددة',
            status: p.status_text || 'الحالة غير محددة',
            statusColor: p.status_color || 'green',
            distance: p.distance_label || 'غير محدد',
            quality: p.quality || 'غير محددة',
            description: p.description || '',
            tags: p.tags || ['مشاركة مستخدم'],
            price: p.price || 'مجانية',
            operatingHours: p.operating_hours || '',
            icon: '🚰',
            coordinates: p.coordinates || `${p.lat || 0}° N, ${p.lng || 0}° E`,
            lat: p.lat || 0,
            lng: p.lng || 0,
            responsible: p.responsible || 'مشاركة مجتمعية',
            ratings: p.ratings || undefined,
            ratingPercentage: p.rating_percentage || undefined
          }));

          setApprovedPoints(mapped as any);
        } else {
          setApprovedPoints(null);
        }
      } catch (err: any) {
        console.error('Error fetching approved water_points:', err);
        setError('حدث خطأ أثناء جلب نقاط المياه المعتمدة');
        setApprovedPoints(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovedPoints();
  }, []);

  const currentPoints = approvedPoints && approvedPoints.length > 0 ? approvedPoints : waterPoints;

  // حساب عدد النقاط لكل منطقة اعتماداً على البيانات الحالية
  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    // إجمالي كل النقاط
    counts['all'] = currentPoints.length;

    const knownDistrictIds = districts
      .filter(d => d.id !== 'all')
      .map(d => d.id);

    currentPoints.forEach((point) => {
      // إذا كانت المنطقة موجودة ضمن القائمة نستخدمها، وإلا نعتبرها "أخرى"
      const id = knownDistrictIds.includes(point.district) ? point.district : 'أخرى';
      counts[id] = (counts[id] || 0) + 1;
    });

    // تأكد من أن كل المناطق لديها قيمة حتى لو صفر
    districts.forEach(d => {
      if (counts[d.id] === undefined) counts[d.id] = 0;
    });

    return counts;
  }, [currentPoints, districts]);

  // Memoized filtered water points with debounced search
  const filteredWaterPoints = useMemo(() => {
    let filtered = selectedDistrict === 'all' 
      ? currentPoints 
      : currentPoints.filter(point => point.district === selectedDistrict);
    
    // Apply search filter if search query exists
    if (debouncedSearchQuery.trim()) {
      filtered = filtered.filter(point => 
        point.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        point.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        point.district.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedDistrict, debouncedSearchQuery, currentPoints]);

  // دالة اختيار المنطقة
  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrict(districtId);
    setIsDropdownOpen(false);
  };

  // إغلاق القائمة عند النقر خارجها
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // الحصول على اسم المنطقة المحددة
  const selectedDistrictName = districts.find(d => d.id === selectedDistrict)?.name || 'جميع المناطق';

  // دوال إدارة النموذج
  const handleInputChange = (field: string, value: string) => {
    setNewWaterPoint(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // دالة مشاركة الموقع
  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setNewWaterPoint(prev => ({
          ...prev,
          lat: lat,
          lng: lng
        }));
        
        alert(`تم تحديد الموقع بنجاح!\nالإحداثيات: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      },
      (error) => {
        console.error('خطأ في تحديد الموقع:', error);
        alert('فشل في تحديد الموقع. تأكد من السماح للمتصفح بالوصول إلى الموقع.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // دالة الحصول على موقع المستخدم
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('خطأ في تحديد الموقع:', error);
            reject(error);
          }
        );
      } else {
        reject(new Error('المتصفح لا يدعم تحديد الموقع'));
      }
    });
  };

  // دالة حساب المسافة
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // المسافة بالمتر
  };

  // دالة فتح نافذة التقييم
  const handleRatePoint = async (point: any) => {
    setIsCheckingLocation(true);
    try {
      const userPos = await getCurrentLocation() as {lat: number, lng: number};
      const distance = calculateDistance(userPos.lat, userPos.lng, point.lat, point.lng);
      
      if (distance <= 100) { // 100 متر
        setSelectedPointForRating(point);
        setShowRatingModal(true);
      } else {
        alert(`يجب أن تكون على بعد 100 متر أو أقل من النقطة للمشاركة في التقييم. المسافة الحالية: ${Math.round(distance)} متر`);
      }
    } catch (error) {
      alert('فشل في تحديد موقعك. تأكد من تفعيل GPS.');
    } finally {
      setIsCheckingLocation(false);
    }
  };

  // دالة إرسال التقييم
  const handleSubmitRating = async (isGood: boolean) => {
    if (!selectedPointForRating) return;

    try {
      // إرسال التقييم إلى Supabase
      await supabase.from('water_point_ratings').insert([
        {
          water_point_id: selectedPointForRating.id && selectedPointForRating.id.toString().startsWith('supabase-')
            ? null
            : selectedPointForRating.id,
          point_name: selectedPointForRating.name,
          is_good: isGood,
          user_lat: userLocation?.lat || null,
          user_lng: userLocation?.lng || null
        }
      ]);

      // تحديث التقييم في الواجهة كما كان سابقاً
      const currentRatings = selectedPointForRating.ratings || { good: 0, bad: 0, total: 0 };
      const updatedPoint = {
        ...selectedPointForRating,
        ratings: {
          good: isGood ? currentRatings.good + 1 : currentRatings.good,
          bad: !isGood ? currentRatings.bad + 1 : currentRatings.bad,
          total: currentRatings.total + 1
        }
      };

      updatedPoint.ratingPercentage = Math.round((updatedPoint.ratings.good / updatedPoint.ratings.total) * 100);

      setRatingSubmitted(true);
      setTimeout(() => {
        setShowRatingModal(false);
        setRatingSubmitted(false);
        setSelectedPointForRating(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleSubmitNewPoint = async () => {
    if (!newWaterPoint.name || !newWaterPoint.location || !newWaterPoint.district) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase.from('water_points').insert([
        {
          name: newWaterPoint.name,
          location: newWaterPoint.location,
          district: newWaterPoint.district,
          status_text: newWaterPoint.status,
          quality: newWaterPoint.quality,
          price: newWaterPoint.price,
          description: newWaterPoint.description,
          responsible: newWaterPoint.responsible || null,
          contact: newWaterPoint.contact || null,
          lat: newWaterPoint.lat || null,
          lng: newWaterPoint.lng || null,
          approval_status: 'pending'
        }
      ]);

      if (error) throw error;

      // إعادة تعيين النموذج
      setNewWaterPoint({
        name: '',
        location: '',
        district: '',
        status: 'مفتوحة',
        quality: 'جيدة',
        price: 'مجانية',
        description: '',
        responsible: '',
        contact: '',
        lat: 0,
        lng: 0
      });
      setShowAddForm(false);

      alert('تم إرسال النقطة بنجاح! سيتم مراجعتها والموافقة عليه');
    } catch (err: any) {
      console.error('Error submitting water point:', err);
      alert('حدث خطأ أثناء إرسال النقطة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInquire = (pointId: string) => {
    const point = currentPoints.find(p => p.id === pointId);
    alert(`سيتم التواصل معك بخصوص ${point?.name}`);
  };


  const getStatusColor = (statusColor: string) => {
    switch (statusColor) {
      case 'green': return 'bg-green-400';
      case 'yellow': return 'bg-yellow-400';
      case 'red': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (statusColor: string) => {
    switch (statusColor) {
      case 'green': return <Shield className="w-4 h-4 text-green-400" />;
      case 'yellow': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'red': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {/* العنوان الرئيسي */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/water')}
            className="p-2 text-sky-300 hover:bg-teal-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚰</span>
            <h1 className="text-xl font-bold text-white">ماء سبيل</h1>
          </div>
        </div>

        {/* تنويه مهم */}
        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            </div>
            <div>
              <h3 className="text-yellow-200 font-semibold text-sm mb-1">
                تنويه مهم
              </h3>
              <p className="text-yellow-100 text-xs leading-relaxed">
                المعلومات المعروضة قد لا تكون دقيقة بالكامل. ننصح بالتحقق من توفر المياه 
                وأوقات العمل قبل التوجه للنقطة. هذه الخدمة تهدف لتسهيل الوصول للمياه 
                وليست ضماناً لاستمرارية الخدمة.
              </p>
            </div>
          </div>
        </div>

        {/* فلتر المناطق - شريط منسدل */}
        <div className="mb-4">
          <div className="space-y-3">
            <div className="relative dropdown-container">
              {/* زر الفلتر الرئيسي */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-teal-800 border border-teal-600 rounded-xl px-4 py-3 text-right flex items-center justify-between hover:bg-teal-700 transition-colors min-h-[48px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{selectedDistrictName}</span>
                  <span className="text-sky-300 text-sm">
                    ({districtCounts[selectedDistrict] ?? 0} نقطة)
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-sky-300 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* القائمة المنسدلة */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-teal-800 border border-teal-600 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                  {districts.map((district) => (
                    <button
                      key={district.id}
                      onClick={() => handleDistrictSelect(district.id)}
                      className={`w-full px-4 py-3 text-right flex items-center justify-between hover:bg-teal-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                        selectedDistrict === district.id ? 'bg-teal-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            selectedDistrict === district.id ? 'text-white' : 'text-sky-300'
                          }`}
                        >
                          {district.name}
                        </span>
                        <span
                          className={`text-sm ${
                            selectedDistrict === district.id ? 'text-teal-200' : 'text-sky-300'
                          }`}
                        >
                          ({districtCounts[district.id] ?? 0} نقطة)
                        </span>
                      </div>
                      {selectedDistrict === district.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* عداد النتائج */}
        <div className="mb-4 flex justify-center">
          <p className="text-sky-300 text-sm text-center">
            عرض {filteredWaterPoints.length} من أصل {waterPoints.length} نقطة مياه
          </p>
        </div>

        {/* زر الإضافة */}
        <div className="mb-6 flex justify-center">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
          >
            <Plus className="w-4 h-4" />
            اكسب أجراً
          </Button>
        </div>

        {/* نموذج إضافة نقطة جديدة */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  اكسب أجراً
                </h3>
                <Button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* وصف تحفيزي */}
                <div className="bg-green-900 border border-green-700 rounded-lg p-3 mb-4">
                  <p className="text-green-200 text-sm text-center">
                    💧 شارك في إضافة نقاط المياه واكسب الأجر بإذن الله
                  </p>
                </div>

                {/* اسم النقطة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    اسم النقطة *
                  </label>
                  <input
                    type="text"
                    value={newWaterPoint.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: براد مياه مسجد النور"
                  />
                </div>

                {/* الموقع */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    الموقع التفصيلي *
                  </label>
                  <input
                    type="text"
                    value={newWaterPoint.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: شارع الجمهورية، قرب المستشفى"
                  />
                </div>

                {/* المنطقة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المنطقة *
                  </label>
                  <select
                    value={newWaterPoint.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">اختر المنطقة</option>
                    {districts
                      .filter(d => d.id !== 'all')
                      .map(district => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* الجودة */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    جودة المياه
                  </label>
                  <select
                    value={newWaterPoint.quality}
                    onChange={(e) => handleInputChange('quality', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ممتازة">ممتازة</option>
                    <option value="جيدة جداً">جيدة جداً</option>
                    <option value="جيدة">جيدة</option>
                    <option value="متوسطة">متوسطة</option>
                  </select>
                </div>

                {/* السعر */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    السعر
                  </label>
                  <input
                    type="text"
                    value={newWaterPoint.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: مجانية أو 50 ريال للعبوة"
                  />
                </div>

                {/* مشاركة الموقع */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    مشاركة موقع النقطة
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleShareLocation}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                      <Map className="w-4 h-4" />
                      تحديد الموقع الحالي
                    </Button>
                    {newWaterPoint.lat !== 0 && newWaterPoint.lng !== 0 && (
                      <div className="flex-1 px-3 py-2 bg-green-800 border border-green-600 rounded-lg text-green-200 text-sm flex items-center justify-center">
                        ✓ تم تحديد الموقع
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    انقر لتحديد موقع النقطة تلقائياً باستخدام GPS
                  </p>
                </div>

                {/* الوصف */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    وصف إضافي
                  </label>
                  <textarea
                    value={newWaterPoint.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                    placeholder="معلومات إضافية عن النقطة..."
                  />
                </div>

                {/* المسؤول */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المسؤول عن النقطة
                  </label>
                  <input
                    type="text"
                    value={newWaterPoint.responsible}
                    onChange={(e) => handleInputChange('responsible', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="مثال: إدارة المسجد أو الجمعية الخيرية"
                  />
                </div>

                {/* جهة الاتصال */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    جهة الاتصال (اختياري)
                  </label>
                  <input
                    type="text"
                    value={newWaterPoint.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="رقم هاتف أو معلومات اتصال"
                  />
                </div>

                {/* أزرار التحكم */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmitNewPoint}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    إرسال النقطة
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* قائمة نقاط المياه */}
        <div className="space-y-4">
          {filteredWaterPoints.map((point) => (
            <div
              key={point.id}
              className={`cursor-pointer transition-all rounded-xl p-4 border ${
                selectedPoint === point.id 
                        ? 'bg-teal-700 border-cyan-400 ring-2 ring-cyan-400' 
                        : 'bg-teal-800 bg-opacity-80 border-teal-600 hover:bg-teal-700'
                    }`}
              onClick={() => handlePointClick(point.id)}
                  >
              {/* رأس البطاقة */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">{point.name}</h3>
                    <p className="text-sm text-sky-300">{point.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        {point.district}
                      </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      point.statusColor === 'green' ? 'bg-green-600 text-white' :
                      point.statusColor === 'yellow' ? 'bg-yellow-600 text-white' :
                      'bg-red-600 text-white'
                  }`}>
                    {point.status}
                  </span>
                  </div>
                </div>
              </div>

              {/* التفاصيل */}
              <div className="space-y-1 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-300" />
                  <span className="text-sky-300">{point.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(point.statusColor)}
                  <span className="text-sky-300">{point.quality}</span>
                </div>
                {point.operatingHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-300" />
                    <span className="text-sky-300">{point.operatingHours}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">{point.price}</span>
                </div>
              </div>

              {/* الوصف */}
              <p className="text-xs text-sky-300 mb-3 leading-relaxed break-words">{point.description}</p>

              {/* العلامات */}
              <div className="flex flex-wrap gap-2 mb-2">
                {point.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-teal-700 text-sky-300 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* السعر والتقييم */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-2xl font-bold text-cyan-400">{point.price}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-sky-300">👍 {point.ratings?.good || 0}</span>
                    <span className="text-xs text-sky-300">👎 {point.ratings?.bad || 0}</span>
                    <span className="text-xs text-cyan-400">({point.ratingPercentage || 0}%)</span>
                  </div>
                </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowRatingInfo(true);
                      }}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-full transition-colors"
                    >
                      ؟
                    </button>
              </div>

              {/* الأزرار */}
              <div className="flex gap-2">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRatePoint(point);
                  }}
                  disabled={isCheckingLocation}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg py-2 disabled:opacity-50"
                >
                  {isCheckingLocation ? 'جاري التحقق...' : 'تقييم'}
                </Button>
                <DirectionsButton
                  location={[point.lat, point.lng]}
                  locationName={point.name}
                  className="w-full"
                  size="sm"
                />
              </div>
                </div>
          ))}
        </div>

        {/* زر العودة */}
        <div className="mt-6">
          <Button 
            onClick={() => setLocation('/water')}
            className="w-full bg-teal-700 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة لخدمات المياه
          </Button>
        </div>
      </main>

      {/* نافذة معلومات التقييم */}
      {showRatingInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-teal-800 rounded-xl p-6 max-w-md w-full border border-teal-600">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">شروط التقييم</h3>
              <p className="text-sky-300">كيف يعمل نظام التقييم؟</p>
            </div>
            
            <div className="space-y-4 text-sm text-sky-300">
              <div className="bg-teal-700 bg-opacity-50 rounded-lg p-3">
                <h4 className="font-bold text-white mb-2">📍 الموقع المطلوب:</h4>
                <p>يجب أن تكون على بعد 100 متر أو أقل من النقطة</p>
              </div>
              
              <div className="bg-teal-700 bg-opacity-50 rounded-lg p-3">
                <h4 className="font-bold text-white mb-2">🔒 الأمان:</h4>
                <p>نستخدم GPS للتأكد من وجودك فعلاً عند النقطة</p>
              </div>
              
              <div className="bg-teal-700 bg-opacity-50 rounded-lg p-3">
                <h4 className="font-bold text-white mb-2">⭐ التقييم:</h4>
                <p>👍 جيدة - النقطة تعمل بشكل جيد<br/>👎 سيئة - النقطة تحتاج تحسين</p>
              </div>
              
              <div className="bg-teal-700 bg-opacity-50 rounded-lg p-3">
                <h4 className="font-bold text-white mb-2">📊 النتائج:</h4>
                <p>النسبة المئوية تُحسب من التقييمات الإيجابية</p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button
                onClick={() => setShowRatingInfo(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                فهمت
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة التقييم */}
      {showRatingModal && selectedPointForRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-teal-800 rounded-xl p-6 max-w-md w-full border border-teal-600">
            {ratingSubmitted ? (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">شكراً لك!</h3>
                <p className="text-sky-300">تم إرسال تقييمك بنجاح</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">تقييم النقطة</h3>
                  <p className="text-sky-300">{selectedPointForRating.name}</p>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-white mb-4">كيف تقيم هذه النقطة؟</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => handleSubmitRating(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg"
                    >
                      👍 جيدة
                    </Button>
                    <Button
                      onClick={() => handleSubmitRating(false)}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg"
                    >
                      👎 سيئة
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button
                    onClick={() => setShowRatingModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                  >
                    إلغاء
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterPointsPage;
