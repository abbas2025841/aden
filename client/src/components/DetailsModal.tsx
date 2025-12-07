import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink, Phone, MapPin, Mail, Globe, Star } from 'lucide-react';

interface DetailItem {
  label: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
  type?: 'text' | 'badge' | 'rating' | 'contact' | 'link' | 'official' | 'warning';
  color?: string;
}

interface DetailSection {
  title: string;
  items: DetailItem[];
  icon?: React.ReactNode;
}

interface DetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  image?: string;
  sections: DetailSection[];
  actions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
}

export default function DetailsModal({
  open,
  onOpenChange,
  title,
  subtitle,
  image,
  sections,
  actions
}: DetailsModalProps) {
  const renderDetailItem = (item: DetailItem) => {
    switch (item.type) {
      case 'badge':
        return (
          <Badge className={`${item.color || 'bg-blue-600 text-white'} text-xs`}>
            {item.value}
          </Badge>
        );
      
      case 'rating':
        const rating = Number(item.value);
        return (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 sm:w-3 sm:h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
              />
            ))}
            <span className="text-sm sm:text-xs text-gray-400 mr-1">({rating})</span>
          </div>
        );
      
      case 'contact':
        return (
          <div className="flex flex-col items-start gap-2">
            {item.icon}
            <a 
              href={typeof item.value === 'string' ? 
                (item.value.includes('@') ? `mailto:${item.value}` : 
                 item.value.startsWith('http') ? item.value : `tel:${item.value}`) : '#'}
              className="text-blue-400 hover:text-blue-300 transition-colors break-all text-sm"
            >
              {typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}
            </a>
          </div>
        );
      
      case 'link':
        return (
          <a 
            href={typeof item.value === 'string' ? item.value : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 break-all text-sm"
          >
            <span className="break-all">{typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}</span>
            <ExternalLink className="w-3 h-3 sm:w-2 sm:h-2 flex-shrink-0" />
          </a>
        );
      
      case 'official':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              رسمي
            </Badge>
            <span className="text-gray-300 text-sm">
              {typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}
            </span>
          </div>
        );
      
      case 'warning':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              تحذير
            </Badge>
            <span className="text-gray-300 text-sm">
              {typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}
            </span>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-start gap-2">
            {item.icon}
            <span className="text-gray-300 break-words text-sm">
              {typeof item.value === 'object' ? JSON.stringify(item.value) : item.value}
            </span>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="details-modal-mobile w-[85vw] max-w-[85vw] sm:max-w-md lg:max-w-xl max-h-[95vh] overflow-y-auto bg-gray-900 border-gray-700 text-white mx-1 sm:mx-4" style={{ maxWidth: '85vw', boxSizing: 'border-box' }}>
        <DialogHeader className="details-modal-header pb-2 sm:pb-3 border-b border-gray-700">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            {image && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                {image}
              </div>
            )}
            <div className="flex-1 min-w-0 w-full text-center">
              <DialogTitle className="text-lg sm:text-xl font-bold text-white mb-1 break-words leading-tight">
                {title}
              </DialogTitle>
              {subtitle && (
                <DialogDescription className="text-gray-400 text-sm sm:text-base break-words">
                  {subtitle}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="details-modal-content space-y-3 sm:space-y-4 py-2 sm:py-3">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-700">
                {section.icon}
                <h3 className="font-semibold text-white text-sm sm:text-base">{section.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-1 p-2 sm:p-3 bg-gray-800 bg-opacity-50 rounded-lg">
                    <label className="text-xs font-medium text-gray-400 block">
                      {item.label}
                    </label>
                    <div className="text-sm break-words">
                      {renderDetailItem(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {actions && actions.length > 0 && (
          <div className="details-modal-actions grid grid-cols-2 sm:flex sm:flex-row gap-2 pt-3 border-t border-gray-700">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || 'outline'}
                className="flex-1 h-10 sm:h-8 text-xs sm:text-sm flex items-center justify-center gap-1"
              >
                {action.icon}
                <span className="break-words">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
