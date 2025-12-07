// مكون زر الاتجاهات - عدن لايف
import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import OfflineMapService from '../services/offlineMapService';

interface DirectionsButtonProps {
  location: [number, number]; // [lat, lng]
  locationName: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const DirectionsButton: React.FC<DirectionsButtonProps> = ({
  location,
  locationName,
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  const mapService = OfflineMapService.getInstance();

  const handleDirections = () => {
    mapService.openMapWithLocation(location, locationName);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'outline':
        return 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-2 text-base';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      onClick={handleDirections}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
        flex items-center justify-center space-x-2
        rounded-lg font-medium
        transition-all duration-200
        hover:shadow-lg
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      <Navigation className="w-4 h-4" />
      <span>الاتجاهات</span>
      <MapPin className="w-4 h-4" />
    </button>
  );
};

export default DirectionsButton;
