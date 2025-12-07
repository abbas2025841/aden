import React, { useState, useEffect } from 'react';
import { Heart, Share2, Bookmark, Eye, MessageCircle, ThumbsUp, Star, TrendingUp, Users, Clock } from 'lucide-react';

// مكون Card موحد
interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  icon, 
  onClick,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  const baseClasses = "rounded-lg transition-all duration-300";
  const sizeClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };
  
  const variantClasses = {
    default: "bg-white shadow-md hover:shadow-lg",
    outlined: "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md",
    filled: "bg-blue-50 hover:bg-blue-100 border border-blue-200"
  };

  const interactiveClasses = onClick ? "cursor-pointer hover:scale-105" : "";

  return (
    <div 
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="text-blue-600 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// مكون البطاقة المحسنة
interface EnhancedCardProps {
  title: string;
  description: string;
  image?: string;
  rating?: number;
  reviews?: number;
  price?: number;
  location?: string;
  category?: string;
  isFavorite?: boolean;
  isBookmarked?: boolean;
  views?: number;
  comments?: number;
  likes?: number;
  trending?: boolean;
  verified?: boolean;
  onFavorite?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  onClick?: () => void;
}

export function EnhancedCard({
  title,
  description,
  image,
  rating = 0,
  reviews = 0,
  price,
  location,
  category,
  isFavorite = false,
  isBookmarked = false,
  views = 0,
  comments = 0,
  likes = 0,
  trending = false,
  verified = false,
  onFavorite,
  onBookmark,
  onShare,
  onClick
}: EnhancedCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorite(!favorite);
    onFavorite?.();
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
    onBookmark?.();
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.();
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* الصورة */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {trending && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              ترند
            </div>
          )}
          {verified && (
            <div className="absolute top-3 right-3 bg-blue-500 text-white p-1 rounded-full">
              <Star className="w-4 h-4" />
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* العنوان والفئة */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
              {title}
            </h3>
            {category && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {category}
              </span>
            )}
          </div>
          <div className="flex gap-2 ml-3">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-colors ${
                favorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                bookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* الوصف */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* التقييم */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)} ({reviews} تقييم)
            </span>
          </div>
        )}

        {/* الموقع والسعر */}
        <div className="flex items-center justify-between mb-4">
          {location && (
            <div className="flex items-center text-sm text-gray-500">
              <span>📍</span>
              <span className="ml-1">{location}</span>
            </div>
          )}
          {price && (
            <div className="text-lg font-bold text-green-600">
              {price} ريال
            </div>
          )}
        </div>

        {/* الإحصائيات */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" />
              <span>{likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون بطاقة الإحصائيات
interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: 'up' | 'down';
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue',
  trend = 'up'
}: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    red: 'bg-red-500 text-white',
    purple: 'bg-purple-500 text-white'
  };

  const changeColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const changeIcon = trend === 'up' ? '↗' : '↘';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          <p className={`text-sm ${changeColor} flex items-center gap-1`}>
            <span>{changeIcon}</span>
            <span>{Math.abs(change)}%</span>
          </p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// مكون شريط التقدم
interface ProgressBarProps {
  value: number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  animated?: boolean;
}

export function ProgressBar({ 
  value, 
  label, 
  color = 'blue',
  animated = false
}: ProgressBarProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]} ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// مكون التنبيه
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({ type, message, dismissible = false, onDismiss }: AlertProps) {
  const typeClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`border rounded-lg p-4 ${typeClasses[type]} flex items-center gap-3`}>
      <span className="text-lg">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}

// مكون التبويبات المحسنة
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface EnhancedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export function EnhancedTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default' 
}: EnhancedTabsProps) {
  const variantClasses = {
    default: 'border-b border-gray-200',
    pills: 'bg-gray-100 rounded-lg p-1',
    underline: 'border-b border-gray-200'
  };

  const tabClasses = {
    default: 'border-b-2 border-transparent hover:border-gray-300',
    pills: 'rounded-md px-4 py-2',
    underline: 'border-b-2 border-transparent hover:border-gray-300'
  };

  const activeClasses = {
    default: 'border-blue-500 text-blue-600',
    pills: 'bg-white shadow-sm text-blue-600',
    underline: 'border-blue-500 text-blue-600'
  };

  return (
    <div className={`${variantClasses[variant]}`}>
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? activeClasses[variant]
                : 'text-gray-500 hover:text-gray-700'
            } ${tabClasses[variant]}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// مكون مؤشر التحميل
interface LoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ text = 'جاري التحميل...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
      {text && (
        <p className="mt-4 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
}