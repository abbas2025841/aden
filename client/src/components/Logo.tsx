import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'monochrome';
  animated?: boolean;
  showText?: boolean;
  className?: string;
}

type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
type LogoVariant = 'default' | 'white' | 'monochrome';

export const Logo: React.FC<LogoProps> = memo(({
  size = 'md',
  variant = 'default',
  animated = false,
  showText = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'white':
        return {
          circle: 'fill-white',
          text: 'fill-white',
          star: 'fill-white',
          stroke: 'stroke-white',
        };
      case 'monochrome':
        return {
          circle: 'fill-gray-800',
          text: 'fill-gray-800',
          star: 'fill-gray-800',
          stroke: 'stroke-gray-800',
        };
      default:
        return {
          circle: 'fill-primary',
          text: 'fill-white',
          star: 'fill-yellow-400',
          stroke: 'stroke-primary',
        };
    }
  };

  const variantClasses = getVariantClasses();

  // SVG مدمج كبديل احتياطي
  const EmbeddedLogo = () => (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'transition-all duration-300',
        animated && 'animate-slow-pulse',
        'group-hover:scale-110 group-hover:rotate-3',
        'drop-shadow-lg hover:drop-shadow-xl'
      )}
    >
      <circle cx="24" cy="24" r="22" fill="url(#gradient)" stroke="url(#borderGradient)" strokeWidth="2"/>
      <path d="M24 6L26.5 18.5L39 21L26.5 23.5L24 36L21.5 23.5L9 21L21.5 18.5L24 6Z" fill="url(#starGradient)" stroke="#FFD700" strokeWidth="1"/>
      <text x="24" y="42" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" textAnchor="middle" fill="url(#textGradient)">عدن</text>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#1E40AF', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#60A5FA', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#A78BFA', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#FCD34D', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#F59E0B', stopOpacity:1}} />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#1E40AF', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#7C3AED', stopOpacity:1}} />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* الشعار */}
      <div className={cn('relative group', sizeClasses[size])}>
        {/* SVG مدمج كبديل احتياطي */}
        <div className="absolute inset-0" style={{ display: 'none' }}>
          <EmbeddedLogo />
        </div>
        
        <img
          src="/aden-logo.svg"
          alt="شعار عدن لايف - منصة خدمات عدن الذكية"
          loading="lazy"
          role="img"
          aria-label="شعار عدن لايف"
          className={cn(
            'w-full h-full transition-all duration-300 object-contain',
            animated && 'animate-slow-pulse',
            'group-hover:scale-110 group-hover:rotate-3',
            'drop-shadow-lg hover:drop-shadow-xl'
          )}
          style={{
            filter: variant === 'white' ? 'brightness(0) invert(1)' : 
                   variant === 'monochrome' ? 'brightness(0) saturate(100%)' : 'none'
          }}
          onError={(e) => {
            console.log('خطأ في تحميل اللوجو، سيتم عرض البديل المدمج');
            e.currentTarget.style.display = 'none';
            // إظهار البديل المدمج
            const fallback = e.currentTarget.previousElementSibling as HTMLElement;
            if (fallback) {
              fallback.style.display = 'block';
            }
          }}
        />
        
        {/* بديل نصي في حالة عدم ظهور الصورة */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-xs" style={{ display: 'none' }}>
          عدن
        </div>
        {/* تأثير إضافي عند hover */}
        <div className={cn(
          'absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300',
          'bg-gradient-to-r from-blue-400 to-purple-500'
        )} />
      </div>

      {/* النص */}
      {showText && (
        <div className="flex flex-col group-hover:translate-x-1 transition-transform duration-300">
          <span className={cn(
            'font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
            textSizeClasses[size],
            'group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300'
          )}>
            عدن لايف
          </span>
          <span className={cn(
            'text-gray-600 dark:text-gray-400 transition-colors duration-300',
            size === 'sm' ? 'text-xs' : 'text-sm',
            'group-hover:text-blue-600 dark:group-hover:text-blue-400'
          )}>
            خدمات عدن الذكية
          </span>
        </div>
      )}
    </div>
  );
});

// مكون الشعار المبسط
export const LogoIcon: React.FC<Omit<LogoProps, 'showText'>> = (props) => (
  <Logo {...props} showText={false} />
);

// مكون الشعار مع النص
export const LogoWithText: React.FC<LogoProps> = (props) => (
  <Logo {...props} showText={true} />
);

export default Logo;
