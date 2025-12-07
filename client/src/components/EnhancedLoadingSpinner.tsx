import React from 'react';

interface EnhancedLoadingSpinnerProps {
  type?: 'page' | 'section' | 'card' | 'skeleton';
  text?: string;
  showProgress?: boolean;
  progress?: number;
}

// Skeleton loader للصفحات الرئيسية
const SkeletonLoader: React.FC = () => (
  <div className="animate-pulse">
    {/* Header skeleton */}
    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
    
    {/* Service grid skeleton */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full mb-3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </div>
      ))}
    </div>
    
    {/* Content skeleton */}
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

// Progress bar component
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    ></div>
  </div>
);

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  type = 'page',
  text = "جاري التحميل...",
  showProgress = false,
  progress = 0
}) => {
  if (type === 'skeleton') {
    return <SkeletonLoader />;
  }

  const getSpinnerSize = () => {
    switch (type) {
      case 'page': return 'w-12 h-12';
      case 'section': return 'w-8 h-8';
      case 'card': return 'w-6 h-6';
      default: return 'w-8 h-8';
    }
  };

  const getContainerClasses = () => {
    switch (type) {
      case 'page': return 'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900';
      case 'section': return 'flex items-center justify-center py-8';
      case 'card': return 'flex items-center justify-center p-4';
      default: return 'flex items-center justify-center py-4';
    }
  };

  return (
    <div className={getContainerClasses()}>
      <div className="text-center">
        <div className={`${getSpinnerSize()} mx-auto mb-4 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600`}></div>
        
        {showProgress && (
          <div className="w-64 mx-auto">
            <ProgressBar progress={progress} />
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {text}
        </p>
        
        {showProgress && (
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {Math.round(progress)}%
          </p>
        )}
      </div>
    </div>
  );
};

// مكونات محسنة للاستخدام في مختلف المواقف
export const PageLoadingSpinner: React.FC<{ text?: string; showProgress?: boolean; progress?: number }> = ({ 
  text = "جاري التحميل...", 
  showProgress = false, 
  progress = 0 
}) => (
  <EnhancedLoadingSpinner type="page" text={text} showProgress={showProgress} progress={progress} />
);

export const SectionLoadingSpinner: React.FC<{ text?: string }> = ({ text = "جاري التحميل..." }) => (
  <EnhancedLoadingSpinner type="section" text={text} />
);

export const CardLoadingSpinner: React.FC<{ text?: string }> = ({ text = "جاري التحميل..." }) => (
  <EnhancedLoadingSpinner type="card" text={text} />
);

export const SkeletonPageLoader: React.FC = () => (
  <EnhancedLoadingSpinner type="skeleton" />
);

export default EnhancedLoadingSpinner;
