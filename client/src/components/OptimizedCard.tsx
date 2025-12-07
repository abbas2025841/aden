import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

// Memoized card wrapper to prevent unnecessary re-renders during scroll
const OptimizedCard = React.memo<OptimizedCardProps>(({ 
  children, 
  className = '', 
  onClick,
  style 
}) => {
  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md ${className}`}
      onClick={onClick}
      style={style}
    >
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';

export default OptimizedCard;
