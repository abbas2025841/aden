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
import { 
  X, ExternalLink, Share2, Bookmark, Heart, Eye, 
  Calendar, Clock, User, Tag, Star, ThumbsUp, MessageSquare 
} from 'lucide-react';

interface ReadMoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  publishDate?: string;
  readTime?: string | number;
  category?: string;
  tags?: string[];
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
    rating?: number;
  };
  image?: string;
  actions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'outline' | 'destructive';
  }[];
}

export default function ReadMoreModal({
  open,
  onOpenChange,
  title,
  subtitle,
  content,
  author,
  publishDate,
  readTime,
  category,
  tags,
  stats,
  image,
  actions
}: ReadMoreModalProps) {
  const formatReadTime = (time: string | number) => {
    if (typeof time === 'number') {
      return `${time} دقيقة`;
    }
    return time;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader className="pb-4 border-b border-gray-700">
          <div className="flex items-start gap-4">
            {image && (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {image}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white mb-2 text-right leading-tight">
                {title}
              </DialogTitle>
              {subtitle && (
                <DialogDescription className="text-gray-400 text-right mb-3">
                  {subtitle}
                </DialogDescription>
              )}
              
              {/* معلومات المقال */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {author && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{author}</span>
                  </div>
                )}
                {publishDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(publishDate)}</span>
                  </div>
                )}
                {readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatReadTime(readTime)}</span>
                  </div>
                )}
                {category && (
                  <Badge className="bg-blue-600 text-white text-xs">
                    {category}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* الإحصائيات */}
          {stats && (
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-700 text-sm">
              {stats.views && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber(stats.views)} مشاهدة</span>
                </div>
              )}
              {stats.likes && (
                <div className="flex items-center gap-1 text-gray-400">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{formatNumber(stats.likes)} إعجاب</span>
                </div>
              )}
              {stats.comments && (
                <div className="flex items-center gap-1 text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>{formatNumber(stats.comments)} تعليق</span>
                </div>
              )}
              {stats.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < stats.rating! ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                    />
                  ))}
                  <span className="text-gray-400 mr-1">({stats.rating})</span>
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        {/* المحتوى */}
        <div className="py-6">
          <div 
            className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-right"
            style={{ direction: 'rtl' }}
          >
            {content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-4 text-base leading-7">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>

        {/* العلامات */}
        {tags && tags.length > 0 && (
          <div className="py-4 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">العلامات:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* الأزرار */}
        {actions && actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-700">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || 'outline'}
                className="flex-1 h-10"
              >
                {action.icon}
                <span className="mr-2">{action.label}</span>
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
