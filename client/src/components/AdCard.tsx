import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store
} from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  district: string;
  condition: string;
  negotiable: boolean;
  postedAt: string;
  views: number;
  isFeatured: boolean;
  images: string[];
  contactNumber: string;
  sellerName: string;
  sellerRating: number;
}

interface AdCardProps {
  ad: Ad;
  IconComponent: any;
  isNewAd: (date: string) => boolean;
  isExpiringAd: (date: string) => boolean;
  onView: (ad: Ad) => void;
  style?: React.CSSProperties;
}

const AdCard = React.memo<AdCardProps>(({ 
  ad, 
  IconComponent, 
  isNewAd, 
  isExpiringAd, 
  onView,
  style 
}) => {
  
  return (
    <div style={style}>
      <Card 
        className={`ad-card group bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border-white/40 hover:border-white/50 cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[140px] ${
          isNewAd(ad.postedAt) ? 'ad-card-new' : 
          isExpiringAd(ad.postedAt) ? 'ad-card-expiring' :
          ad.isFeatured ? 'ad-card-featured' : ''
        }`}
        onClick={() => onView(ad)}
      >
        {/* صورة الإعلان */}
        <div className="relative h-36 sm:h-40 md:h-44 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
          {ad.images && ad.images.length > 0 ? (
            <>
              <img 
                src={ad.images[0]} 
                alt={ad.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxzdmcgeD0iMTgwIiB5PSIxMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE5IDNINUMzLjkgMyAzIDMuOSAzIDVWMTlDMjAgMTkgMjAgMTguMSAyMCAxN1Y1QzIwIDMuOSAxOS4xIDMgMTkgM1pNMTkgMTlINVY1SDE5VjE5WiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTAgOUMxMC41NSA5IDExIDguNTUgMTEgOEMxMSA3LjQ1IDEwLjU1IDcgMTAgN0M5LjQ1IDcgOSA3LjQ1IDkgOEM5IDguNTUgOS40NSA5IDEwIDlaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
                }}
              />
              
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconComponent className="w-16 h-16 text-gray-400" />
            </div>
          )}
          
          {/* شارات الحالة */}
          <div className="absolute top-1 left-1 flex flex-col gap-0.5">
            {isNewAd(ad.postedAt) && (
              <Badge className="bg-green-500 text-white text-[8px] px-1 py-0">
                جديد
              </Badge>
            )}
            {ad.isFeatured && (
              <Badge className="bg-yellow-500 text-white text-[8px] px-1 py-0">
                مميز
              </Badge>
            )}
          </div>
          
        </div>
        
        <CardContent className="p-1.5">
          <div className="flex flex-col gap-1">
            {/* العنوان */}
            <div className="text-xs font-medium text-white line-clamp-1 leading-tight">
                {ad.title}
            </div>
        
            {/* السعر */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-green-300">
                {ad.price.toLocaleString()} ريال
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AdCard.displayName = 'AdCard';

export default AdCard;
