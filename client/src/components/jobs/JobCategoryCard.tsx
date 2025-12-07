import React from 'react';
import { useLocation } from 'wouter';

interface JobCategoryCardProps {
  category: string;
  jobCount: number;
  icon: string;
  description: string;
  gradient: string;
}

export default function JobCategoryCard({ 
  category, 
  jobCount, 
  icon, 
  description, 
  gradient 
}: JobCategoryCardProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    setLocation(`/jobs/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <div 
      onClick={handleClick}
      className={`service-card rounded-xl p-4 border border-orange-200 bg-white hover:shadow-lg transition-all cursor-pointer group ${gradient}`}
    >
      <div className="text-center">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="typography-h3 text-foreground mb-1">{category}</h3>
        <p className="typography-small text-muted-foreground mb-2">
          {description}
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
            {jobCount} وظيفة
          </span>
        </div>
      </div>
    </div>
  );
}
