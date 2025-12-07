// مكون الخريطة المحلية - عدن لايف
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import OfflineMapService from '../services/offlineMapService';

// إضافة CSS مخصص للخرائط
const mapStyles = `
  .leaflet-container {
    height: 100%;
    width: 100%;
    background: #f0f0f0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .leaflet-tile {
    filter: none;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
  .leaflet-popup-content {
    margin: 8px 12px;
    line-height: 1.4;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
    box-shadow: 0 3px 14px rgba(0,0,0,0.4);
  }
  .custom-marker {
    background: transparent;
    border: none;
  }
  .target-marker {
    background: transparent;
    border: none;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  .leaflet-control-zoom {
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.4);
  }
  .leaflet-control-zoom a {
    border-radius: 4px;
    font-size: 18px;
    font-weight: bold;
  }
`;

// إضافة الـ CSS إلى الصفحة
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = mapStyles;
  document.head.appendChild(style);
}

// إصلاح أيقونات Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface OfflineMapProps {
  className?: string;
  height?: string;
  showSearch?: boolean;
  showLandmarks?: boolean;
}

const OfflineMap: React.FC<OfflineMapProps> = ({
  className = '',
  height = '400px',
  showSearch = true,
  showLandmarks = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (mapRef.current && !map) {
      const mapService = OfflineMapService.getInstance();
      const newMap = mapService.createOfflineMap(mapRef.current.id || 'offline-map');
      setMap(newMap);

      // إضافة معالج تغيير الاتصال
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (newMap) {
          newMap.remove();
        }
      };
    }
  }, [map]);

  // البحث في المعالم
  const handleSearch = (query: string) => {
    if (!map) return;

    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // البحث المحلي في المعالم
    const mapService = OfflineMapService.getInstance();
    const results = mapService.searchLandmarks(query);
    setSearchResults(results);

    // تكبير الخريطة على النتائج
    if (results.length > 0) {
      const group = (L as any).featureGroup();
      results.forEach(result => {
        const marker = L.marker([result.lat, result.lng]);
        group.addLayer(marker);
      });
      map.fitBounds(group.getBounds().pad(0.1));
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* شريط البحث */}
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white rounded-lg shadow-lg p-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="ابحث في معالم عدن..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                بحث
              </button>
            </div>
            
            {/* نتائج البحث */}
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                    onClick={() => {
                      if (map) {
                        map.setView([result.lat, result.lng], 16);
                      }
                    }}
                  >
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.district}</div>
                    <div className="text-xs text-gray-500">{result.type}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* مؤشر حالة الاتصال */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isOnline 
            ? 'bg-green-100 text-green-800' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {isOnline ? '🟢 متصل' : '🟠 بدون إنترنت'}
        </div>
      </div>

      {/* الخريطة */}
      <div
        ref={mapRef}
        id="offline-map"
        style={{ height }}
        className="w-full rounded-lg border border-gray-300"
      />

      {/* معلومات الخريطة */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white bg-opacity-90 rounded-lg p-2 text-xs text-gray-600">
          <div>🗺️ خريطة عدن المحلية</div>
          <div>📍 {isOnline ? 'خرائط جوجل' : 'خرائط محلية'}</div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMap;
