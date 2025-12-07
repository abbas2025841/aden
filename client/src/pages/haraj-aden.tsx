import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import OptimizedCard from '@/components/OptimizedCard';
import AdCard from '@/components/AdCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Eye, 
  Share2, 
  Plus,
  ArrowLeft,
  Store,
  Smartphone,
  Laptop,
  Car,
  Home,
  Shirt,
  Gamepad2,
  Camera,
  Headphones,
  Book,
  Dumbbell,
  Utensils,
  Baby,
  Wrench,
  Star,
  MessageCircle,
  Phone,
  Calendar,
  Tag,
  TrendingUp,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  X,
  Save,
  Trash2,
  Upload,
  Image,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Flag,
  HelpCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// CSS للأنيميشن
const fadeInUpStyle = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

// إضافة الأنيميشن للصفحة
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = fadeInUpStyle;
  document.head.appendChild(style);
}

// Interfaces للبيانات
interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  district: string;
  seller: string;
  sellerRating: number;
  sellerAdsCount: number;
  images: string[];
  condition: string;
  negotiable: boolean;
  views: number;
  likes: number;
  postedAt: string;
  isVerified: boolean;
  isFeatured: boolean;
  contactNumber?: string;
}

interface NewAdForm {
  title: string;
  description: string;
  price: string;
  category: string;
  district: string;
  condition: string;
  negotiable: boolean;
  contactNumber: string;
  images: File[];
}

// تحويل ملف صورة إلى Base64 لتخزينه مؤقتاً في Supabase (حتى يتم ربط التخزين مستقبلاً)
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// دوال localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// مديريات عدن (المديريات الأساسية فقط)
const ADEN_DISTRICTS = [
  { id: 'aden_crater', name: 'عدن كريتر', icon: '🏛️' },
  { id: 'khormaksar', name: 'خور مكسر', icon: '✈️' },
  { id: 'maalla', name: 'المعلا', icon: '🏘️' },
  { id: 'tawahi', name: 'التواهي', icon: '🌊' },
  { id: 'sheikh_othman', name: 'الشيخ عثمان', icon: '🕌' },
  { id: 'mansoura', name: 'المنصورة', icon: '🏭' },
  { id: 'dar_saad', name: 'دار سعد', icon: '🏡' },
  { id: 'albarika', name: 'البريقة', icon: '🏭' },
  { id: 'alqaloua', name: 'القلوعة', icon: '🏘️' },
  { id: 'almamadara', name: 'الممدارة', icon: '🏪' }
];

// فئات السلع
const PRODUCT_CATEGORIES = [
  { id: 'real_estate', name: 'عقارات', icon: Home, color: 'bg-emerald-600', count: 24 },
  { id: 'vehicles', name: 'مركبات', icon: Car, color: 'bg-green-500', count: 18 },
  { id: 'electronics', name: 'إلكترونيات', icon: Smartphone, color: 'bg-blue-500', count: 45 },
  { id: 'computers', name: 'أجهزة كمبيوتر', icon: Laptop, color: 'bg-purple-500', count: 23 },
  { id: 'furniture', name: 'أثاث', icon: Home, color: 'bg-orange-500', count: 32 },
  { id: 'clothing', name: 'ملابس', icon: Shirt, color: 'bg-pink-500', count: 67 },
  { id: 'gaming', name: 'ألعاب', icon: Gamepad2, color: 'bg-indigo-500', count: 15 },
  { id: 'cameras', name: 'كاميرات', icon: Camera, color: 'bg-red-500', count: 12 },
  { id: 'audio', name: 'صوتيات', icon: Headphones, color: 'bg-yellow-500', count: 28 },
  { id: 'books', name: 'كتب', icon: Book, color: 'bg-teal-500', count: 41 },
  { id: 'sports', name: 'رياضة', icon: Dumbbell, color: 'bg-emerald-500', count: 19 },
  { id: 'kitchen', name: 'مطبخ', icon: Utensils, color: 'bg-amber-500', count: 25 },
  { id: 'baby', name: 'أطفال', icon: Baby, color: 'bg-rose-500', count: 16 },
  { id: 'tools', name: 'أدوات', icon: Wrench, color: 'bg-gray-500', count: 22 },
  { id: 'jewelry', name: 'مجوهرات', icon: Star, color: 'bg-yellow-600', count: 8 },
  { id: 'watches', name: 'ساعات', icon: Clock, color: 'bg-cyan-500', count: 14 },
  { id: 'bikes', name: 'دراجات', icon: Car, color: 'bg-lime-500', count: 11 },
  { id: 'pets', name: 'حيوانات', icon: Star, color: 'bg-pink-600', count: 7 },
  { id: 'art', name: 'فنون', icon: Star, color: 'bg-violet-500', count: 9 },
  { id: 'music', name: 'موسيقى', icon: Headphones, color: 'bg-purple-600', count: 13 },
  { id: 'garden', name: 'حديقة', icon: Home, color: 'bg-green-600', count: 6 },
  { id: 'office', name: 'مكتب', icon: Laptop, color: 'bg-blue-600', count: 17 },
  { id: 'other', name: 'أخرى', icon: Store, color: 'bg-slate-500', count: 35 }
];

// خيارات حالة السلع
const CONDITION_OPTIONS = [
  { id: 'new', name: 'جديد', description: 'لم يُستخدم من قبل' },
  { id: 'excellent', name: 'ممتازة', description: 'حالة ممتازة جداً' },
  { id: 'very_good', name: 'جيدة جداً', description: 'حالة جيدة جداً' },
  { id: 'good', name: 'جيدة', description: 'حالة جيدة' },
  { id: 'fair', name: 'مقبولة', description: 'حالة مقبولة' }
];

// بيانات تجريبية للإعلانات
const mockAds = [
  {
    id: '1',
    title: 'آيفون 13 برو ماكس - حالة ممتازة',
    description: 'آيفون 13 برو ماكس 256 جيجا، لون أزرق، حالة ممتازة جداً، مع الشاحن والكابل الأصلي، بدون خدوش',
    price: 450000,
    originalPrice: 550000,
    category: 'electronics',
    district: 'crater',
    seller: 'أحمد محمد',
    sellerRating: 4.8,
    sellerAdsCount: 12,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY0NmU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPmlQaG9uZTwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjN2MzYWVkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBob25lPC90ZXh0Pjwvc3ZnPg==",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDU5NjY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vYmlsZTwvdGV4dD48L3N2Zz4="
    ],
    condition: 'ممتازة',
    negotiable: true,
    views: 156,
    likes: 23,
    postedAt: '2024-01-28T10:30:00Z',
    isVerified: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'لابتوب ديل Inspiron 15 - للطلاب',
    description: 'لابتوب ديل Inspiron 15، معالج i5، 8 جيجا رام، 256 جيجا SSD، مناسب للطلاب والعمل',
    price: 320000,
    originalPrice: 380000,
    category: 'computers',
    district: 'maalla',
    seller: 'فاطمة علي',
    sellerRating: 4.6,
    sellerAdsCount: 8,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGM2NjI2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxhcHRvcDwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWE1ODBjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNvbXB1dGVyPC90ZXh0Pjwvc3ZnPg=="
    ],
    condition: 'جيدة جداً',
    negotiable: true,
    views: 89,
    likes: 15,
    postedAt: '2024-01-28T08:15:00Z',
    isVerified: false,
    isFeatured: false
  },
  {
    id: '3',
    title: 'سيارة تويوتا كامري 2018 - فحص كامل',
    description: 'سيارة تويوتا كامري 2018، لون أبيض، 4 سلندر، فحص كامل، صيانة دورية، بدون حوادث',
    price: 8500000,
    originalPrice: 9500000,
    category: 'vehicles',
    district: 'tawahi',
    seller: 'محمد سالم',
    sellerRating: 4.9,
    sellerAdsCount: 25,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWYyOTM3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcjwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlZlaGljbGU8L3RleHQ+PC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGI1NTYzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRveW90YTwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNmI3MjgwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF1dG88L3RleHQ+PC9zdmc+"
    ],
    condition: 'ممتازة',
    negotiable: true,
    views: 234,
    likes: 45,
    postedAt: '2024-01-27T16:45:00Z',
    isVerified: true,
    isFeatured: true
  },
  {
    id: '4',
    title: 'طقم أثاث غرفة نوم - خشب أصلي',
    description: 'طقم أثاث غرفة نوم كامل، خشب أصلي، سرير + دولاب + كومودينو، حالة جيدة جداً',
    price: 180000,
    originalPrice: 220000,
    category: 'furniture',
    district: 'mansoura',
    seller: 'سارة أحمد',
    sellerRating: 4.7,
    sellerAdsCount: 6,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTI0MDBFIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZ1cm5pdHVyZTwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYjQ1MzA5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlZHJvb208L3RleHQ+PC9zdmc+"
    ],
    condition: 'جيدة جداً',
    negotiable: true,
    views: 67,
    likes: 12,
    postedAt: '2024-01-27T14:20:00Z',
    isVerified: false,
    isFeatured: false
  },
  {
    id: '5',
    title: 'كاميرا كانون EOS 80D - مع عدسات',
    description: 'كاميرا كانون EOS 80D، مع عدسة 18-55mm، حالة ممتازة، مناسبة للمصورين المبتدئين',
    price: 280000,
    originalPrice: 320000,
    category: 'cameras',
    district: 'khormaksar',
    seller: 'علي حسن',
    sellerRating: 4.8,
    sellerAdsCount: 15,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjN2MyZDEyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhbWVyYTwvdGV4dD48L3N2Zz4=",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTkxYjFiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBob3RvPC90ZXh0Pjwvc3ZnPg==",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYjkxYzFjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRTTFI8L3RleHQ+PC9zdmc+"
    ],
    condition: 'ممتازة',
    negotiable: false,
    views: 123,
    likes: 28,
    postedAt: '2024-01-27T11:30:00Z',
    isVerified: true,
    isFeatured: false
  },
  {
    id: '6',
    title: 'سماعات AirPods Pro - أصلية',
    description: 'سماعات AirPods Pro أصلية، حالة ممتازة، مع علبة الشحن، بدون مشاكل في الصوت',
    price: 85000,
    originalPrice: 95000,
    category: 'audio',
    district: 'sheikh_othman',
    seller: 'نور الدين',
    sellerRating: 4.5,
    sellerAdsCount: 9,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDY1ZjQ2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWRwaG9uZXM8L3RleHQ+PC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDQ3ODU3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF1ZGlvPC90ZXh0Pjwvc3ZnPg=="
    ],
    condition: 'ممتازة',
    negotiable: true,
    views: 78,
    likes: 19,
    postedAt: '2024-01-27T09:15:00Z',
    isVerified: false,
    isFeatured: false
  },
  {
    id: '7',
    title: 'شقة 3 غرف نوم - كريتر',
    description: 'شقة مفروشة بالكامل، 3 غرف نوم، صالة، مطبخ، حمامين، في موقع مميز بكريتر',
    price: 1200000,
    originalPrice: 1400000,
    category: 'real_estate',
    district: 'crater',
    seller: 'عبدالله محمد',
    sellerRating: 4.9,
    sellerAdsCount: 31,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDY1ZjQ2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWRwaG9uZXM8L3RleHQ+PC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDQ3ODU3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF1ZGlvPC90ZXh0Pjwvc3ZnPg=="
    ],
    condition: 'ممتازة',
    negotiable: true,
    views: 189,
    likes: 42,
    postedAt: '2024-01-26T14:30:00Z',
    isVerified: true,
    isFeatured: true
  },
  {
    id: '8',
    title: 'أرض سكنية - المعلا',
    description: 'أرض سكنية 500 متر مربع، في حي هادئ بالمعلا، قريبة من الخدمات والطرق الرئيسية',
    price: 2500000,
    originalPrice: 2800000,
    category: 'real_estate',
    district: 'maalla',
    seller: 'فاطمة أحمد',
    sellerRating: 4.7,
    sellerAdsCount: 18,
    images: [
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDY1ZjQ2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWRwaG9uZXM8L3RleHQ+PC9zdmc+",
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDQ3ODU3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkF1ZGlvPC90ZXh0Pjwvc3ZnPg=="
    ],
    condition: 'جيدة جداً',
    negotiable: true,
    views: 156,
    likes: 28,
    postedAt: '2024-01-26T11:45:00Z',
    isVerified: true,
    isFeatured: false
  }
];


export default function HarajAdenPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddAd, setShowAddAd] = useState(false);
  
  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Memoized callbacks for better performance
  
  const handleShare = useCallback((ad: any) => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${ad.title} - ${ad.description}`);
    }
  }, []);
  
  const handleViewAd = useCallback((ad: any) => {
    setSelectedAd(ad);
    setShowAdDetails(true);
  }, []);
  
  // States جديدة للتحسينات
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allAds, setAllAds] = useState<Ad[]>(mockAds);
  const [newAdForm, setNewAdForm] = useState<NewAdForm>({
    title: '',
    description: '',
    price: '',
    category: '',
    district: '',
    condition: '',
    negotiable: false,
    contactNumber: '',
    images: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showAdDetails, setShowAdDetails] = useState(false);
  const [showAdTypeSelection, setShowAdTypeSelection] = useState(false);
  
  // States جديدة للتحسينات
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // تحميل البيانات المحفوظة عند بدء التطبيق (للاحتفاظ بالتجربة المحلية إن لم توجد بيانات من القاعدة)
  useEffect(() => {
    const savedAds = loadFromLocalStorage('haraj_ads', mockAds);
    const savedRecentSearches = loadFromLocalStorage('haraj_recent_searches', []);
    const savedFilters = loadFromLocalStorage('haraj_filters', {});

    setAllAds(savedAds);
    setRecentSearches(savedRecentSearches);
    
    // استرجاع الفلاتر المحفوظة
    if (savedFilters.searchQuery) setSearchQuery(savedFilters.searchQuery);
    if (savedFilters.selectedCategory) setSelectedCategory(savedFilters.selectedCategory);
    if (savedFilters.selectedDistrict) setSelectedDistrict(savedFilters.selectedDistrict);
    if (savedFilters.sortBy) setSortBy(savedFilters.sortBy);
  }, []);

  // جلب الإعلانات الحقيقية المعتمدة من Supabase (haraj_ads)
  useEffect(() => {
    const fetchApprovedAds = async () => {
      try {
        const { data, error } = await supabase
          .from('haraj_ads')
          .select('*')
          .eq('approval_status', 'approved')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching haraj_ads:', error);
          return;
        }

        const mapped: Ad[] = (data || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          price: Number(row.price) || 0,
          originalPrice: undefined,
          category: row.category,
          district: row.district,
          seller: row.seller_name || 'بائع',
          sellerRating: 0,
          sellerAdsCount: 0,
          images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ['📦'],
          condition: row.condition,
          negotiable: !!row.negotiable,
          views: 0,
          likes: 0,
          postedAt: row.created_at,
          isVerified: false,
          isFeatured: false,
          contactNumber: row.contact_number || undefined
        }));

        if (mapped.length > 0) {
          setAllAds(mapped);
        }
      } catch (err) {
        console.error('Exception while fetching haraj_ads:', err);
      }
    };

    fetchApprovedAds();
  }, []);

  // إغلاق النوافذ باستخدام مفتاح Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAdDetails(false);
        setShowAddAd(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // حفظ البيانات عند التغيير
  useEffect(() => {
    saveToLocalStorage('haraj_ads', allAds);
  }, [allAds]);


  useEffect(() => {
    saveToLocalStorage('haraj_recent_searches', recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    const filters = {
      searchQuery,
      selectedCategory,
      selectedDistrict,
      sortBy
    };
    saveToLocalStorage('haraj_filters', filters);
  }, [searchQuery, selectedCategory, selectedDistrict, sortBy]);

  // فلترة الإعلانات مع debounced search
  const filteredAds = useMemo(() => {
    let filtered = allAds.filter(ad => {
      const matchesSearch = ad.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                           ad.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
      const matchesDistrict = selectedDistrict === 'all' || ad.district === selectedDistrict;
      
      return matchesSearch && matchesCategory && matchesDistrict;
    });

    // ترتيب الإعلانات - الإعلانات المميزة أولاً
    filtered.sort((a, b) => {
      // الإعلانات المميزة تظهر أولاً دائماً
      const aFeatured = a.isFeatured ? 1 : 0;
      const bFeatured = b.isFeatured ? 1 : 0;
      
      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured;
      }
      
      // ترتيب الإعلانات العادية حسب المعيار المختار
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case 'oldest':
          return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'views':
          return b.views - a.views;
        case 'featured':
          // في حالة "المميزة أولاً"، الإعلانات المميزة تظهر أولاً ثم العادية
          return 0; // تم الترتيب بالفعل أعلاه
        default:
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(); // الأحدث أولاً كافتراضي
      }
    });

    return filtered;
  }, [debouncedSearchQuery, selectedCategory, selectedDistrict, priceRange, sortBy, allAds]);

  // إحصائيات سريعة
  const stats = useMemo(() => ({
    totalAds: allAds.length,
    totalCategories: PRODUCT_CATEGORIES.length,
    totalDistricts: ADEN_DISTRICTS.length,
    featuredAds: allAds.filter(ad => ad.isFeatured).length,
    verifiedSellers: allAds.filter(ad => ad.isVerified).length
  }), [allAds]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('ar-YE') + ' ريال';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ دقائق';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    return date.toLocaleDateString('ar-YE');
  };

  // دالة البحث الذكي
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (value.length > 1) {
      const suggestions = allAds
        .filter(ad => 
          ad.title.toLowerCase().includes(value.toLowerCase()) ||
          ad.description.toLowerCase().includes(value.toLowerCase())
        )
        .map(ad => ad.title)
        .slice(0, 5);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // دالة معالجة إرسال نموذج الإعلان لمنع تحديث الصفحة
  const handleSubmitNewAd: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    await handleAddAd();
  };

  // دالة إضافة البحث للمؤرخ
  const addToRecentSearches = (query: string) => {
    if (query.trim() && !recentSearches.includes(query)) {
      const newRecentSearches = [query, ...recentSearches].slice(0, 5);
      setRecentSearches(newRecentSearches);
    }
  };

  // دالة إضافة إعلان جديد (ترسل إلى Supabase كإعلان عادي pending)
  const handleAddAd = async () => {
    // التحقق من صحة البيانات
    const errors: Record<string, string> = {};
    
    if (!newAdForm.title.trim()) errors.title = 'العنوان مطلوب';
    if (!newAdForm.description.trim()) errors.description = 'الوصف مطلوب';
    if (!newAdForm.price.trim()) errors.price = 'السعر مطلوب';
    if (!newAdForm.category) errors.category = 'الفئة مطلوبة';
    if (!newAdForm.district) errors.district = 'المديرية مطلوبة';
    if (!newAdForm.condition) errors.condition = 'الحالة مطلوبة';
    if (!newAdForm.contactNumber.trim()) errors.contactNumber = 'رقم التواصل مطلوب';
    if (newAdForm.images.length > 3) errors.images = 'يمكنك رفع 3 صور كحد أقصى للإعلان';

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setIsLoading(true);

        // تحويل الصور (بحد أقصى 3) إلى Base64 لتخزينها مؤقتاً في Supabase
        let imagesToSave: string[] = [];
        if (newAdForm.images.length > 0) {
          const limitedFiles = newAdForm.images.slice(0, 3);
          imagesToSave = await Promise.all(limitedFiles.map(fileToBase64));
        }

        const { error } = await supabase.from('haraj_ads').insert({
          title: newAdForm.title,
          description: newAdForm.description,
          price: Number(newAdForm.price) || 0,
          category: newAdForm.category,
          district: newAdForm.district,
          condition: newAdForm.condition,
          negotiable: newAdForm.negotiable,
          contact_number: newAdForm.contactNumber,
          images: imagesToSave,
          seller_name: null,
          approval_status: 'pending'
        });

        if (error) {
          console.error('Error inserting haraj_ad:', error);
          alert('حدث خطأ أثناء إرسال الإعلان، حاول مرة أخرى.');
          return;
        }

        // إعادة تعيين النموذج
        setNewAdForm({
          title: '',
          description: '',
          price: '',
          category: '',
          district: '',
          condition: '',
          negotiable: false,
          contactNumber: '',
          images: []
        });

        setShowAddAd(false);
        setFormErrors({});

        alert('تم إرسال إعلانك للمراجعة، وسيظهر في الحراج بعد موافقة الإدارة.');
      } catch (err) {
        console.error('Exception while inserting haraj_ad:', err);
        alert('حدث خطأ غير متوقع أثناء إرسال الإعلان.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // عرض أول رسالة خطأ للمستخدم ليوضح سبب عدم إرسال الإعلان
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        alert(errors[firstErrorKey]);
      }
    }
  };

  // دالة مسح جميع الفلاتر
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDistrict('all');
    setSortBy('newest');
  };


  // دوال جديدة للتحسينات
  const nextImage = (adId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [adId]: ((prev[adId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (adId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [adId]: ((prev[adId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  const isNewAd = (postedAt: string) => {
    const now = new Date();
    const adDate = new Date(postedAt);
    const diffInHours = (now.getTime() - adDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  const isExpiringAd = (postedAt: string) => {
    const now = new Date();
    const adDate = new Date(postedAt);
    const diffInDays = (now.getTime() - adDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays > 25;
  };

  const handleReport = async () => {
    if (reportReason) {
      setIsLoading(true);
      
      // محاكاة إرسال البلاغ
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setToastMessage('تم إرسال البلاغ بنجاح');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setShowReportModal(false);
      setReportReason('');
      setReportDetails('');
      setIsLoading(false);
    }
  };

  const handleSupport = () => {
    setToastMessage('تم إرسال رسالتك للدعم');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setShowSupportModal(false);
  };


  // دالة للحصول على الإعلانات المشابهة
  const getSimilarAds = (currentAd: Ad) => {
    return allAds
      .filter(ad => 
        ad.id !== currentAd.id && // استبعاد الإعلان الحالي
        (ad.category === currentAd.category || // نفس الفئة
         ad.district === currentAd.district) // أو نفس المديرية
      )
      .sort((a, b) => {
        // ترتيب حسب التشابه (نفس الفئة أولاً، ثم نفس المديرية)
        const aCategoryMatch = a.category === currentAd.category ? 2 : 0;
        const aDistrictMatch = a.district === currentAd.district ? 1 : 0;
        const bCategoryMatch = b.category === currentAd.category ? 2 : 0;
        const bDistrictMatch = b.district === currentAd.district ? 1 : 0;
        
        const aScore = aCategoryMatch + aDistrictMatch;
        const bScore = bCategoryMatch + bDistrictMatch;
        
        return bScore - aScore;
      })
      .slice(0, 4); // عرض 4 إعلانات مشابهة فقط
  };

  // دعم التنقل بالكيبورد في معرض الصور
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAd) return;
      
      const currentIndex = currentImageIndex[selectedAd.id] || 0;
      const totalImages = selectedAd.images.length;
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        prevImage(selectedAd.id, totalImages);
      } else if (e.key === 'ArrowRight' && currentIndex < totalImages - 1) {
        e.preventDefault();
        nextImage(selectedAd.id, totalImages);
      }
    };

    if (selectedAd) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedAd, currentImageIndex]);

  const shareAd = (ad: any) => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      const shareText = `${ad.title}\n\n${ad.description}\n\nالسعر: ${formatPrice(ad.price)}\n\nشارك من حراج عدن`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('تم نسخ نص المشاركة إلى الحافظة!');
      }).catch(() => {
        alert(`شارك هذا الإعلان:\n\n${shareText}`);
      });
    }
  };

  const shareToWhatsApp = (ad: any) => {
    const message = `مرحباً! أريد أن أشاركك هذا الإعلان من حراج عدن:\n\n${ad.title}\n\n${ad.description}\n\nالسعر: ${formatPrice(ad.price)}\n\nرابط الإعلان: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openAdDetails = (ad: Ad) => {
    console.log('Opening ad details for:', ad.title); // للتأكد من عمل الدالة
    console.log('Ad data:', ad); // للتأكد من البيانات
    setSelectedAd(ad);
    setShowAdDetails(true);
    console.log('showAdDetails set to true'); // للتأكد من تغيير الحالة
  };

  // دوال التعامل مع الصور
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const remainingSlots = 3 - newAdForm.images.length;
      const newFiles = Array.from(files).slice(0, remainingSlots);
      setNewAdForm(prev => ({
        ...prev,
        // نخزن الملفات نفسها في الحالة حتى يمكن تحويلها لاحقاً إلى Base64 عند الإرسال
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setNewAdForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const getImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-4 max-w-md sm:max-w-2xl lg:max-w-6xl">
        {/* بطاقة ترحيبية محسنة */}
        <div className="mb-8 max-w-2xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <Store className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                مرحباً بك في حراج عدن
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed mb-4 max-w-xl mx-auto">
                منصة بيع وشراء الأجهزة والسلع المستعملة في مدينة عدن
                <br />
                اكتشف آلاف الإعلانات المتنوعة وابحث عن ما تحتاجه
              </p>
              
              {/* إحصائيات سريعة محسنة */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="stats-card bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 bg-green-500/20 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Store className="w-3 h-3 text-green-400" />
                    </div>
                    <div className="text-xs text-green-400 font-medium">+12%</div>
                  </div>
                  <div className="text-lg font-bold text-white">{stats.totalAds}</div>
                  <div className="text-xs text-blue-200">إعلان نشط</div>
                </div>
                
                <div className="stats-card bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Tag className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="text-xs text-blue-400 font-medium">متنوع</div>
                  </div>
                  <div className="text-lg font-bold text-white">{stats.totalCategories}</div>
                  <div className="text-xs text-blue-200">فئة</div>
                </div>
                
                <div className="stats-card bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MapPin className="w-3 h-3 text-purple-400" />
                    </div>
                    <div className="text-xs text-purple-400 font-medium">عدن</div>
                  </div>
                  <div className="text-lg font-bold text-white">{stats.totalDistricts}</div>
                  <div className="text-xs text-blue-200">مديرية</div>
                </div>
                
                <div className="stats-card bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="w-6 h-6 bg-orange-500/20 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Star className="w-3 h-3 text-orange-400" />
                    </div>
                    <div className="text-xs text-orange-400 font-medium">مميز</div>
                  </div>
                  <div className="text-lg font-bold text-white">{stats.featuredAds}</div>
                  <div className="text-xs text-blue-200">إعلان مميز</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الفئات محسنة مع التمرير التلقائي */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">الأقسام</h2>
            <div className="flex items-center gap-2 text-sm text-blue-300">
              <Filter className="w-4 h-4" />
              <span>فلترة سريعة</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 shadow-xl">
            {/* عنوان القسم المحسن */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Filter className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    تصفح الأقسام
                  </h3>
                  <p className="text-[10px] text-slate-300">
                    اختر القسم المناسب
                  </p>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-full px-2.5 py-0.5">
                <span className="text-xs font-semibold text-slate-200">
                  {PRODUCT_CATEGORIES.length} قسم
                </span>
              </div>
            </div>

            {/* شريط التمرير الأفقي المحسن */}
            <div className="relative overflow-hidden">
              <style>{`
                @keyframes scroll-categories {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                .animate-scroll-categories {
                  animation: scroll-categories 40s linear infinite;
                  will-change: transform;
                }
                .animate-scroll-categories:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div
                className="flex gap-3 pb-3 animate-scroll-categories"
              dir="ltr"
            >
                {/* المجموعة الأولى */}
            {PRODUCT_CATEGORIES.map((category, index) => {
              const IconComponent = category.icon;
              const adCount = allAds.filter(ad => ad.category === category.id).length;
              return (
                <button
                      key={`first-${category.id}`}
                  onClick={() => setSelectedCategory(category.id)}
                      className={`
                        flex-shrink-0 w-16 h-16 rounded-xl border border-transparent
                        transition-all duration-200 ease-out
                        hover:scale-105 hover:shadow-lg hover:border-white/20
                        active:scale-95
                        ${category.color}
                        group relative overflow-hidden
                        ${selectedCategory === category.id ? 'ring-2 ring-white/50 scale-105 shadow-lg' : ''}
                      `}
                  style={{
                        minWidth: '64px',
                        maxWidth: '64px'
                  }}
                      aria-label={`فلترة حسب ${category.name}`}
                      title={`${category.name} - ${adCount} إعلان`}
                >
                      {/* تأثير الإضاءة */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      
                      <div className="flex flex-col items-center justify-center h-full p-1.5 relative z-10">
                  {/* الأيقونة */}
                        <div className="mb-0.5 group-hover:scale-110 transition-transform duration-200">
                          <IconComponent className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                  
                  {/* النص */}
                        <div className="text-[9px] font-semibold text-center leading-tight text-white drop-shadow">
                      {category.name}
                    </div>
                        
                        {/* عداد الإعلانات */}
                        {adCount > 0 && (
                          <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-md">
                            {adCount}
                    </div>
                        )}
                  </div>
                </button>
              );
            })}
                
                {/* نسخة مكررة للتمرير اللانهائي */}
            {PRODUCT_CATEGORIES.map((category, index) => {
              const IconComponent = category.icon;
              const adCount = allAds.filter(ad => ad.category === category.id).length;
              return (
                <button
                      key={`second-${category.id}`}
                  onClick={() => setSelectedCategory(category.id)}
                      className={`
                        flex-shrink-0 w-16 h-16 rounded-xl border border-transparent
                        transition-all duration-200 ease-out
                        hover:scale-105 hover:shadow-lg hover:border-white/20
                        active:scale-95
                        ${category.color}
                        group relative overflow-hidden
                        ${selectedCategory === category.id ? 'ring-2 ring-white/50 scale-105 shadow-lg' : ''}
                      `}
                  style={{
                        minWidth: '64px',
                        maxWidth: '64px'
                  }}
                      aria-label={`فلترة حسب ${category.name}`}
                      title={`${category.name} - ${adCount} إعلان`}
                >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      
                      <div className="flex flex-col items-center justify-center h-full p-1.5 relative z-10">
                        <div className="mb-0.5 group-hover:scale-110 transition-transform duration-200">
                          <IconComponent className="w-5 h-5 text-white drop-shadow-md" />
                  </div>
                  
                        <div className="text-[9px] font-semibold text-center leading-tight text-white drop-shadow">
                      {category.name}
                    </div>
                        
                        {adCount > 0 && (
                          <div className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-md">
                            {adCount}
                    </div>
                        )}
                  </div>
                </button>
              );
            })}
                
              </div>

              {/* مؤشر التمرير الاحترافي */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-60"></div>
              </div>
            </div>

          </div>
        </div>

        {/* شريط البحث والفلترة محسن */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3 sm:space-y-4">
              {/* البحث - محسن للهواتف */}
              <div className="search-container relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
                <Input
                  placeholder="ابحث عن سلعة أو جهاز..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(searchQuery.length > 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pr-10 bg-white/90 text-gray-900 placeholder-gray-500 border-white/30 focus:border-white/50 h-12 text-base"
                />
                
                {/* اقتراحات البحث */}
                {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchSuggestions.length > 0 && (
                      <div className="p-2">
                        <div className="text-xs text-gray-500 mb-2 px-2">اقتراحات</div>
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowSuggestions(false);
                              addToRecentSearches(suggestion);
                            }}
                            className="w-full text-right px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {recentSearches.length > 0 && (
                      <div className="p-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-2 px-2">البحث الأخير</div>
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSearchQuery(search);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-right px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 rounded-md transition-colors flex items-center justify-between"
                          >
                            <span>{search}</span>
                            <Trash2 
                              className="w-3 h-3 text-gray-400 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRecentSearches(prev => prev.filter((_, i) => i !== index));
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>


            </div>
          </CardContent>
        </Card>

        {/* أزرار الإجراءات */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowAdTypeSelection(true)}
            className="flex-1 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white py-3 rounded-lg font-medium border border-white/20"
          >
            <Plus className="w-5 h-5 ml-2" />
            أضف إعلانك مجاناً
          </Button>
          
        </div>

        {/* قائمة الإعلانات */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              منتجات مميزة ({filteredAds.length})
            </h3>
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                إزالة الفلتر
              </Button>
            )}
          </div>

          {filteredAds.length === 0 ? (
            <Card className="p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                لا توجد إعلانات
              </h3>
              <p className="text-blue-100 mb-4">
                جرب تغيير معايير البحث أو أضف إعلانك الأول
              </p>
              <Button
                onClick={() => setShowAddAd(true)}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/20"
              >
                أضف إعلان
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
              {filteredAds.map((ad: any) => {
                const category = PRODUCT_CATEGORIES.find((c: any) => c.id === ad.category);
                const district = ADEN_DISTRICTS.find((d: any) => d.id === ad.district);
                        const IconComponent = category?.icon || Store;
                        
                        return (
                            <AdCard
                    key={ad.id}
                              ad={ad}
                              IconComponent={IconComponent}
                    isNewAd={isNewAd}
                    isExpiringAd={isExpiringAd}
                    onView={handleViewAd}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* نصائح الأمان */}
        <Card className="mt-8 bg-yellow-500/20 border-yellow-400/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-200">
              <Shield className="w-5 h-5" />
              نصائح الأمان
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-100">
            <ul className="space-y-2">
              <li>• تأكد من فحص السلعة شخصياً قبل الشراء</li>
              <li>• لا تدفع مبلغاً مقدماً قبل رؤية السلعة</li>
              <li>• قابل البائع في مكان عام وآمن</li>
              <li>• احتفظ بسجل للمحادثات والاتفاقيات</li>
              <li>• إذا كان السعر يبدو جيداً جداً، كن حذراً</li>
            </ul>
          </CardContent>
        </Card>
      </div>

        {/* نافذة إضافة إعلان */}
        {showAddAd && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3"
            onClick={() => setShowAddAd(false)}
          >
            <div
              className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl shadow-2xl max-w-lg w-full border border-white/10 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Plus className="w-6 h-6 text-blue-400" />
                  إضافة إعلان جديد
                </h2>
                <button
                  onClick={() => setShowAddAd(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* جعل محتوى النموذج قابل للتمرير على الشاشات الصغيرة */}
              <div className="p-4 md:p-6 overflow-y-auto flex-1">
              <form className="space-y-4" onSubmit={handleSubmitNewAd}>
                {/* عنوان الإعلان */}
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    عنوان الإعلان *
                  </label>
                  <Input
                    placeholder="مثال: آيفون 13 برو ماكس - حالة ممتازة"
                    value={newAdForm.title}
                    onChange={(e) => setNewAdForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                  />
                </div>

                {/* وصف الإعلان */}
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-400" />
                    وصف الإعلان *
                  </label>
                  <textarea
                    placeholder="اكتب تفاصيل واضحة عن السلعة أو الخدمة..."
                    value={newAdForm.description}
                    onChange={(e) => setNewAdForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full min-h-[120px] p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all resize-y"
                  />
                </div>

                {/* السعر */}
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    السعر (ريال يمني) *
                  </label>
                  <Input
                    type="number"
                    placeholder="مثال: 450000"
                    value={newAdForm.price}
                    onChange={(e) => setNewAdForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 placeholder-gray-500 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/20 transition-all"
                  />
                </div>

                {/* الفئة والمديرية */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-pink-400" />
                      الفئة *
                    </label>
                    <div className="relative">
                    <select
                      value={newAdForm.category}
                      onChange={(e) => setNewAdForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">اختر فئة الإعلان</option>
                      {PRODUCT_CATEGORIES.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                      <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      حالة السلعة *
                    </label>
                    <div className="relative">
                    <select
                      value={newAdForm.condition}
                      onChange={(e) => setNewAdForm(prev => ({ ...prev, condition: e.target.value }))}
                        className="w-full p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">اختر حالة السلعة</option>
                      {CONDITION_OPTIONS.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                      <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      المديرية *
                    </label>
                    <div className="relative">
                    <select
                      value={newAdForm.district}
                      onChange={(e) => setNewAdForm(prev => ({ ...prev, district: e.target.value }))}
                        className="w-full p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">اختر مديرية عدن</option>
                      {ADEN_DISTRICTS.map(district => (
                        <option key={district.id} value={district.id}>
                        {district.name}
                        </option>
                      ))}
                    </select>
                      <ChevronDown className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* رفع الصور */}
                  <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4 text-orange-400" />
                    صور الإعلان (حد أقصى 3 صور)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    {newAdForm.images.length > 0 && (
                      <div className="flex gap-2 flex-wrap bg-white/90 rounded-lg p-2">
                        {newAdForm.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                              alt={`صورة ${index + 1}`}
                              className="w-16 h-16 object-contain rounded-lg border border-white/30 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = newAdForm.images.filter((_, i) => i !== index);
                                setNewAdForm(prev => ({ ...prev, images: newImages }));
                              }}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-blue-200 text-xs">
                      تم رفع {newAdForm.images.length} من 3 صور
                    </p>
                  </div>
                  </div>

              {/* رقم الاتصال */}
                  <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-400" />
                    رقم الاتصال *
                  </label>
                  <Input
                  placeholder="مثال: 777123456"
                    value={newAdForm.contactNumber}
                    onChange={(e) => setNewAdForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                    className="w-full p-4 border-2 border-white/30 rounded-xl text-sm bg-white/95 text-gray-900 placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
                  />
                </div>

                {/* أزرار الإجراءات */}
              <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                  {isLoading ? 'جاري النشر...' : 'نشر الإعلان'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddAd(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
{/* نافذة تفاصيل الإعلان */}
        {showAdDetails && selectedAd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Card className="bg-gradient-to-br from-slate-800 to-blue-900 border-white/20">
                    <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-xl">{selectedAd.title}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdDetails(false)}
                        className="text-white hover:bg-white/10"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </CardHeader>
                    
            <CardContent className="space-y-4">
              {/* معرض الصور */}
              {selectedAd.images && selectedAd.images.length > 0 && (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <img 
                    src={selectedAd.images[currentImageIndex[selectedAd.id] || 0]} 
                    alt={selectedAd.title}
                    className="w-full h-auto object-contain bg-black"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxzdmcgeD0iMTgwIiB5PSIxMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE5IDNINUMzLjkgMyAzIDMuOSAzIDVWMTlDMjAgMTkgMjAgMTguMSAyMCAxN1Y1QzIwIDMuOSAxOS4xIDMgMTkgM1pNMTkgMTlINVY1SDE5VjE5WiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTAgOUMxMC41NSA5IDExIDguNTUgMTEgOEMxMSA3LjQ1IDEwLjU1IDcgMTAgN0M5LjQ1IDcgOSA3LjQ1IDkgOEM5IDguNTUgOS40NSA5IDEwIDlaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                    }}
                  />
                  
                  {/* أسهم التنقل الكبيرة */}
                  {selectedAd.images.length > 1 && (
                    <>
                      <Button
                        size="lg"
                        variant="secondary"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 p-0 bg-black/50 backdrop-blur-sm border-white/30 hover:bg-black/70"
                        onClick={() => prevImage(selectedAd.id, selectedAd.images.length)}
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </Button>
                      
                      <Button
                        size="lg"
                        variant="secondary"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 p-0 bg-black/50 backdrop-blur-sm border-white/30 hover:bg-black/70"
                        onClick={() => nextImage(selectedAd.id, selectedAd.images.length)}
                      >
                        <ChevronRightIcon className="w-6 h-6 text-white" />
                      </Button>
                    </>
                  )}
                  
                  {/* عداد الصور */}
                  {selectedAd.images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                      {(currentImageIndex[selectedAd.id] || 0) + 1} / {selectedAd.images.length}
                    </div>
                  )}
                  
                  {/* أيقونات التنقل */}
                  {selectedAd.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {selectedAd.images.map((_, index) => (
                        <button
                          key={index}
                          className={`text-xl transition-all duration-200 ${
                            index === (currentImageIndex[selectedAd.id] || 0)
                              ? 'text-white drop-shadow-md' 
                              : 'text-white/50 hover:text-white/70 drop-shadow-sm'
                          }`}
                          onClick={() => setCurrentImageIndex(prev => ({
                            ...prev,
                            [selectedAd.id]: index
                          }))}
                        >
                          {index === (currentImageIndex[selectedAd.id] || 0) ? '●' : '○'}
                        </button>
                      ))}
                    </div>
                  )}
                            </div>
                          )}
                          
              {/* السعر */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {selectedAd.price} ريال
                            </div>
                {selectedAd.negotiable && (
                  <Badge className="bg-green-500 text-white">قابل للتفاوض</Badge>
                          )}
                        </div>
                        
              {/* الوصف */}
              <div>
                <h4 className="text-white font-semibold mb-2">الوصف</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedAd.description}
                </p>
                      </div>

              {/* التفاصيل */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">الفئة</h4>
                  <p className="text-gray-300 text-sm">
                    {PRODUCT_CATEGORIES.find(c => c.id === selectedAd.category)?.name || 'عام'}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">المديرية</h4>
                  <p className="text-gray-300 text-sm">
                    {ADEN_DISTRICTS.find(d => d.id === selectedAd.district)?.name || 'عدن'}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">الحالة</h4>
                  <p className="text-gray-300 text-sm">{selectedAd.condition}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">السعر</h4>
                  <p className="text-gray-300 text-sm">
                    {selectedAd.negotiable ? 'قابل للتفاوض' : 'سعر ثابت'}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">تاريخ النشر</h4>
                  <p className="text-gray-300 text-sm">
                    {new Date(selectedAd.postedAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">المشاهدات</h4>
                  <p className="text-gray-300 text-sm">{selectedAd.views} مشاهدة</p>
                </div>
              </div>

              {/* أزرار الاتصال */}
              <div className="flex gap-3 pt-4">
                  <Button 
                  onClick={() => window.open(`tel:${selectedAd.contactNumber}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                  <Phone className="w-4 h-4 ml-2" />
                  اتصال
                  </Button>
                  <Button 
                    variant="outline" 
                  onClick={() => shareToWhatsApp(selectedAd)}
                  className="border-white/20 text-white hover:bg-white/10"
                  >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  واتساب
                  </Button>
                </div>

              {/* أزرار التفاعل */}
              <div className="flex gap-3 pt-3">
                <Button 
                  onClick={() => handleShare(selectedAd)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/30"
                >
                  <Share2 className="w-4 h-4 ml-2" />
                  مشاركة
                </Button>
          </div>
          
              {/* الإعلانات المشابهة - داخل نفس النافذة */}
          {getSimilarAds(selectedAd).length > 0 && (
                <div className="pt-6 border-t border-white/30">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-white text-xl font-bold flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                  إعلانات مشابهة
                    </h4>
                    <div className="bg-white/10 rounded-full px-3 py-1">
                      <span className="text-sm font-semibold text-white">
                        {getSimilarAds(selectedAd).length} إعلان
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getSimilarAds(selectedAd).map((similarAd) => {
                    const category = PRODUCT_CATEGORIES.find((c: any) => c.id === similarAd.category);
                    const district = ADEN_DISTRICTS.find((d: any) => d.id === similarAd.district);
                    const IconComponent = category?.icon || Store;
                    
                    return (
                        <div
                        key={similarAd.id}
                          className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/40 rounded-xl p-4 cursor-pointer hover:bg-white/30 hover:border-white/50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                          onClick={() => {
                            setSelectedAd(similarAd);
                            setCurrentImageIndex(prev => ({ ...prev, [similarAd.id]: 0 }));
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {/* صورة مصغرة */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-white to-gray-100 dark:from-gray-100 dark:to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                              {similarAd.images && similarAd.images.length > 0 ? (
                                <img 
                                  src={similarAd.images[0]} 
                                  alt={similarAd.title}
                                  className="w-full h-full object-contain bg-white rounded-xl group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxzdmcgeD0iMTgwIiB5PSIxMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE5IDNINUMzLjkgMyAzIDMuOSAzIDVWMTlDMjAgMTkgMjAgMTguMSAyMCAxN1Y1QzIwIDMuOSAxOS4xIDMgMTkgM1pNMTkgMTlINVY1SDE5VjE5WiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTAgOUMxMC41NSA5IDExIDguNTUgMTEgOEMxMSA3LjQ1IDEwLjU1IDcgMTAgN0M5LjQ1IDcgOSA3LjQ1IDkgOEM5IDguNTUgOS40NSA5IDEwIDlaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                                  }}
                                />
                              ) : (
                                <IconComponent className="w-10 h-10 text-gray-400" />
                              )}
                            </div>
                            
                            {/* معلومات الإعلان */}
                            <div className="flex-1 min-w-0">
                              <h5 className="text-white font-semibold text-base sm:text-lg line-clamp-2 mb-2 leading-tight">
                                {similarAd.title}
                              </h5>
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-green-300 font-bold text-lg sm:text-xl">
                                  {similarAd.price} ريال
                                </p>
                                {similarAd.negotiable && (
                                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                                    قابل للتفاوض
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="flex items-center gap-1">
                                  <IconComponent className="w-4 h-4" />
                                  <span>{category?.name || 'عام'}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{district?.name || 'عدن'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    );
                  })}
                </div>
                </div>
              )}
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      
      {/* الزر العائم لإضافة الإعلان */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setShowAdTypeSelection(true);
          }}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-100 flex items-center justify-center hover:scale-110 active:scale-95 group"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* نافذة اختيار نوع الإعلان */}
      {showAdTypeSelection && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.1s ease-out' }}>
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-blue-700" style={{ animation: 'slideIn 0.1s ease-out' }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">اختر نوع الإعلان</h2>
              <p className="text-blue-100">اختر نوع الإعلان الذي تريد نشره</p>
            </div>

            <div className="space-y-4">
              {/* إعلان مجاني */}
              <button
                onClick={() => {
                  setShowAdTypeSelection(false);
                  setShowAddAd(true);
                }}
                className="w-full flex items-center gap-4 p-6 bg-white/10 hover:bg-white/20 rounded-xl border-2 border-white/20 hover:border-white/40 transition-all duration-200 group backdrop-blur-sm active:scale-98"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="text-right flex-1">
                  <h3 className="font-bold text-white text-lg">إعلان مجاني</h3>
                  <p className="text-blue-100 text-sm">نشر إعلان مجاناً</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/70" />
              </button>

              {/* إعلان مميز */}
              <button
                disabled
                className="w-full flex items-center gap-4 p-6 bg-white/5 rounded-xl border-2 border-white/10 opacity-60 cursor-not-allowed relative backdrop-blur-sm"
              >
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-300" />
                </div>
                <div className="text-right flex-1">
                  <h3 className="font-bold text-white text-lg">إعلان مميز</h3>
                  <p className="text-blue-100 text-sm">إعلان مميز مع مزايا إضافية</p>
                </div>
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  قيد التطوير
                </div>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <button
                onClick={() => setShowAdTypeSelection(false)}
                className="w-full px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 font-medium backdrop-blur-sm border border-white/20 active:scale-98"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
      
      <AppFooter />
    </div>
  );
}
