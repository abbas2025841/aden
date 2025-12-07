import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { adenDistricts, mapReports, ADEN_CENTER, DEFAULT_ZOOM, ADEN_BOUNDS, getStatusColor, getStatusIcon, getStatusText, type DistrictData, type MapReport } from '@/data/aden-map-data';
import { Users, Clock, CheckCircle, AlertTriangle, Zap, TrendingUp, TrendingDown } from 'lucide-react';

// إصلاح أيقونات Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// مكون تحديث الخريطة
const MapUpdater: React.FC<{ districts: DistrictData[] }> = ({ districts }) => {
  const map = useMap();

  useEffect(() => {
    // تحديث حدود الخريطة عند تغيير البيانات
    if (districts.length > 0) {
      const bounds = L.latLngBounds(ADEN_BOUNDS);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [districts, map]);

  return null;
};

// مكون أيقونة مخصصة
const CustomIcon: React.FC<{ status: string; isNew: boolean }> = ({ status, isNew }) => {
  const iconRef = useRef<L.DivIcon | null>(null);

  useEffect(() => {
    const color = getStatusColor(status);
    const icon = getStatusIcon(status);
    
    iconRef.current = L.divIcon({
      html: `
        <div class="custom-marker ${isNew ? 'animate-pulse' : ''}" style="
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${isNew ? 'animation: pulse 2s infinite;' : ''}
        ">
          ${icon}
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  }, [status, isNew]);

  return null;
};

// مكون منطقة المديرية
const DistrictPolygon: React.FC<{ district: DistrictData }> = ({ district }) => {
  const color = getStatusColor(district.status);
  const opacity = district.isConfirmed ? 0.7 : 0.4;

  return (
    <Polygon
      positions={district.bounds}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: opacity,
        weight: 2
      }}
    >
      <Popup>
        <div className="p-2" dir="rtl">
          <h3 className="font-bold text-lg mb-2">{district.name}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                district.status === 'on' ? 'bg-green-100 text-green-800' :
                district.status === 'off' ? 'bg-red-100 text-red-800' :
                district.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {getStatusIcon(district.status)} {getStatusText(district.status)}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>السكان: {district.population.toLocaleString()}</p>
              <p>المساحة: {district.area} كم²</p>
            </div>

            {district.isConfirmed ? (
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <div className="flex items-center gap-1 text-green-800 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>تم التأكيد بواسطة {district.uniqueUsers} مستخدم</span>
                </div>
                {district.confirmedAt && (
                  <p className="text-xs text-green-600 mt-1">
                    في {district.confirmedAt.toLocaleString('ar-SA')}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <div className="flex items-center gap-1 text-yellow-800 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>يحتاج {3 - district.confirmationCount} بلاغات أخرى</span>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500">
              آخر تحديث: {district.lastUpdate.toLocaleString('ar-SA')}
            </div>
          </div>
        </div>
      </Popup>
    </Polygon>
  );
};

// مكون البلاغات
const ReportMarkers: React.FC<{ reports: MapReport[] }> = ({ reports }) => {
  return (
    <>
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={report.coordinates}
          icon={L.divIcon({
            html: `
              <div class="report-marker ${report.isNew ? 'animate-bounce' : ''}" style="
                background-color: ${getStatusColor(report.status)};
                border: 2px solid white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                ${report.isNew ? 'animation: bounce 1s infinite;' : ''}
              ">
                ${getStatusIcon(report.status)}
              </div>
            `,
            className: 'custom-div-icon',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            popupAnchor: [0, -10]
          })}
        >
          <Popup>
            <div className="p-2" dir="rtl">
              <h4 className="font-bold text-sm mb-1">{report.district}</h4>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  report.status === 'on' ? 'bg-green-100 text-green-800' :
                  report.status === 'off' ? 'bg-red-100 text-red-800' :
                  report.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusIcon(report.status)} {getStatusText(report.status)}
                </span>
                {report.isNew && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    جديد
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {report.timestamp.toLocaleString('ar-SA')}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

// المكون الرئيسي
interface InteractiveMapProps {
  className?: string;
  height?: string;
  onDistrictClick?: (district: DistrictData) => void;
  onReportClick?: (report: MapReport) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  className = '',
  height = '500px',
  onDistrictClick,
  onReportClick
}) => {
  const [districts, setDistricts] = useState<DistrictData[]>(adenDistricts);
  const [reports, setReports] = useState<MapReport[]>(mapReports);
  const [isLoading, setIsLoading] = useState(false);

  // محاكاة تحديث البيانات في الوقت الفعلي
  useEffect(() => {
    const interval = setInterval(() => {
      // تحديث عشوائي لحالة إحدى المديريات
      setDistricts(prevDistricts => 
        prevDistricts.map(district => {
          if (Math.random() < 0.1) { // 10% احتمال للتحديث
            const newStatus = ['on', 'off', 'partial', 'unknown'][Math.floor(Math.random() * 4)] as any;
            return {
              ...district,
              status: newStatus,
              lastUpdate: new Date(),
              confirmationCount: Math.floor(Math.random() * 4),
              uniqueUsers: Math.floor(Math.random() * 4),
              isConfirmed: Math.random() > 0.5
            };
          }
          return district;
        })
      );

      // إضافة بلاغ جديد عشوائياً
      if (Math.random() < 0.2) { // 20% احتمال لبلاغ جديد
        const randomDistrict = adenDistricts[Math.floor(Math.random() * adenDistricts.length)];
        const newReport: MapReport = {
          id: `report_${Date.now()}`,
          district: randomDistrict.name,
          status: ['on', 'off', 'partial'][Math.floor(Math.random() * 3)] as any,
          timestamp: new Date(),
          coordinates: randomDistrict.coordinates,
          deviceFingerprint: `device_${Date.now()}`,
          isNew: true
        };

        setReports(prevReports => [newReport, ...prevReports.slice(0, 9)]);

        // إزالة علامة "جديد" بعد 5 ثوان
        setTimeout(() => {
          setReports(prevReports =>
            prevReports.map(report =>
              report.id === newReport.id ? { ...report, isNew: false } : report
            )
          );
        }, 5000);
      }
    }, 10000); // كل 10 ثوان

    return () => clearInterval(interval);
  }, []);

  // إحصائيات سريعة
  const stats = {
    totalDistricts: districts.length,
    confirmedDistricts: districts.filter(d => d.isConfirmed).length,
    onDistricts: districts.filter(d => d.status === 'on').length,
    offDistricts: districts.filter(d => d.status === 'off').length,
    partialDistricts: districts.filter(d => d.status === 'partial').length,
    unknownDistricts: districts.filter(d => d.status === 'unknown').length,
    totalReports: reports.length,
    newReports: reports.filter(r => r.isNew).length
  };

  return (
    <div className={`relative ${className}`}>
      {/* شريط الإحصائيات */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-bold text-sm mb-3">إحصائيات الخريطة</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>مشغل: {stats.onDistricts}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>مطفأ: {stats.offDistricts}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>جزئي: {stats.partialDistricts}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>غير مؤكد: {stats.unknownDistricts}</span>
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>مؤكد: {stats.confirmedDistricts}/{stats.totalDistricts}</span>
          </div>
          <div className="col-span-2 flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-600" />
            <span>البلاغات: {stats.totalReports} ({stats.newReports} جديد)</span>
          </div>
        </div>
      </div>

      {/* الخريطة */}
      <div style={{ height }} className="rounded-lg overflow-hidden">
        <MapContainer
          center={ADEN_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          bounds={ADEN_BOUNDS}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater districts={districts} />
          
          {/* مناطق المديريات */}
          {districts.map((district) => (
            <DistrictPolygon key={district.id} district={district} />
          ))}
          
          {/* البلاغات */}
          <ReportMarkers reports={reports} />
        </MapContainer>
      </div>

      {/* CSS للحركات */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .custom-marker {
          transition: all 0.3s ease;
        }
        
        .custom-marker:hover {
          transform: scale(1.1);
        }
        
        .report-marker {
          transition: all 0.3s ease;
        }
        
        .report-marker:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default InteractiveMap;
