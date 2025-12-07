import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Phone, Clock, Star, Users, Building,
  Navigation, Search, Filter, Eye, ExternalLink
} from 'lucide-react';
import { adenHealthFacilities, HealthFacility } from '@/data/aden-health-facilities';

export default function HealthMapsPage() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [mapView, setMapView] = useState<'google' | 'openstreet' | 'all'>('google');

  // فلترة المرافق
  const filteredFacilities = useMemo(() => {
    return adenHealthFacilities.filter(facility => {
      const matchesType = selectedType === 'all' || facility.type === selectedType;
      const matchesDistrict = selectedDistrict === 'all' || facility.district === selectedDistrict;
      return matchesType && matchesDistrict;
    });
  }, [selectedType, selectedDistrict]);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const hospitals = filteredFacilities.filter(f => f.type === 'hospital').length;
    const clinics = filteredFacilities.filter(f => f.type === 'clinic').length;
    const pharmacies = filteredFacilities.filter(f => f.type === 'pharmacy').length;
    const emergency = filteredFacilities.filter(f => f.availability.emergency).length;
    
    return { hospitals, clinics, pharmacies, emergency, total: filteredFacilities.length };
  }, [filteredFacilities]);

  // فتح خريطة Google Maps
  const openGoogleMaps = (facility: HealthFacility) => {
    const [lat, lng] = facility.position;
    const url = `https://www.google.com/maps?q=${lat},${lng}&z=15&t=m`;
    window.open(url, '_blank');
  };

  // فتح خريطة OpenStreetMap
  const openOpenStreetMap = (facility: HealthFacility) => {
    const [lat, lng] = facility.position;
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;
    window.open(url, '_blank');
  };

  // فتح خريطة Apple Maps
  const openAppleMaps = (facility: HealthFacility) => {
    const [lat, lng] = facility.position;
    const url = `http://maps.apple.com/?q=${lat},${lng}&z=15&t=m`;
    window.open(url, '_blank');
  };

  // فتح جميع الخرائط
  const openAllMaps = (facility: HealthFacility) => {
    const [lat, lng] = facility.position;
    
    const mapWindow = window.open('', '_blank', 'width=900,height=600');
    if (mapWindow) {
      mapWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>خرائط ${facility.name}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 0;
              background: #f5f5f5;
              direction: rtl;
            }
            .header { 
              background: #2563eb; 
              color: white; 
              padding: 15px; 
              text-align: center; 
            }
            .map-tabs { 
              display: flex; 
              background: white; 
              border-bottom: 1px solid #ddd;
            }
            .tab { 
              flex: 1; 
              padding: 15px; 
              text-align: center; 
              cursor: pointer; 
              border: none; 
              background: white;
              transition: background 0.3s;
            }
            .tab.active { 
              background: #f0f9ff; 
              border-bottom: 3px solid #2563eb;
            }
            .tab:hover { 
              background: #f8fafc; 
            }
            .map-container { 
              height: 500px; 
              position: relative;
            }
            .map-iframe { 
              width: 100%; 
              height: 100%; 
              border: none; 
            }
            .info-panel { 
              background: white; 
              padding: 20px; 
              border-top: 1px solid #ddd;
            }
            .coordinates { 
              background: #f8f9fa; 
              padding: 10px; 
              border-radius: 5px; 
              font-family: monospace; 
              text-align: center;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🗺️ ${facility.name}</h1>
            <p>${facility.type === 'hospital' ? 'مستشفى' : facility.type === 'clinic' ? 'عيادة' : facility.type === 'pharmacy' ? 'صيدلية' : facility.type} - ${facility.district}</p>
          </div>
          
          <div class="map-tabs">
            <button class="tab active" onclick="showMap('google')">Google Maps</button>
            <button class="tab" onclick="showMap('openstreet')">OpenStreetMap</button>
            <button class="tab" onclick="showMap('apple')">Apple Maps</button>
          </div>
          
          <div class="map-container">
            <iframe id="mapFrame" class="map-iframe" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgUfXz8z8z8&q=${lat},${lng}&zoom=15" allowfullscreen></iframe>
          </div>
          
          <div class="info-panel">
            <div class="coordinates">
              <strong>الإحداثيات:</strong> ${lat}, ${lng}
            </div>
            <p><strong>العنوان:</strong> ${facility.address}</p>
            <p><strong>الهاتف:</strong> ${facility.contact?.phone?.[0] || 'غير متوفر'}</p>
            <p><strong>ساعات العمل:</strong> ${facility.workingHours}</p>
          </div>
          
          <script>
            function showMap(type) {
              const frame = document.getElementById('mapFrame');
              const tabs = document.querySelectorAll('.tab');
              
              tabs.forEach(tab => tab.classList.remove('active'));
              event.target.classList.add('active');
              
              if (type === 'google') {
                frame.src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgUfXz8z8z8&q=${lat},${lng}&zoom=15';
              } else if (type === 'openstreet') {
                frame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}';
              } else if (type === 'apple') {
                frame.src = 'https://maps.apple.com/?q=${lat},${lng}&z=15&t=m';
              }
            }
          </script>
        </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* العنوان */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">خرائط المرافق الصحية</h1>
          <p className="text-gray-600">عرض جميع المرافق الصحية على الخرائط التفاعلية</p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="pt-4">
              <Building className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">{stats.hospitals}</div>
              <div className="text-xs text-gray-600">مستشفى</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Users className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">{stats.clinics}</div>
              <div className="text-xs text-gray-600">عيادة</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">{stats.pharmacies}</div>
              <div className="text-xs text-gray-600">صيدلية</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <Navigation className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">{stats.emergency}</div>
              <div className="text-xs text-gray-600">طوارئ</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-4">
              <MapPin className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">إجمالي</div>
            </CardContent>
          </Card>
        </div>

        {/* الفلاتر */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الأنواع</option>
                <option value="hospital">مستشفى</option>
                <option value="clinic">عيادة</option>
                <option value="pharmacy">صيدلية</option>
                <option value="laboratory">مختبر</option>
                <option value="dental">عيادة أسنان</option>
                <option value="specialized">متخصص</option>
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع المناطق</option>
                <option value="كريتر">كريتر</option>
                <option value="الشيخ عثمان">الشيخ عثمان</option>
                <option value="خور مكسر">خور مكسر</option>
                <option value="التواهي">التواهي</option>
                <option value="المعلا">المعلا</option>
                <option value="المنصورة">المنصورة</option>
                <option value="دار سعد">دار سعد</option>
                <option value="البريقة">البريقة</option>
              </select>

              <select
                value={mapView}
                onChange={(e) => setMapView(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="google">Google Maps</option>
                <option value="openstreet">OpenStreetMap</option>
                <option value="all">جميع الخرائط</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* قائمة المرافق مع الخرائط */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFacilities.map((facility) => (
            <Card key={facility.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                    <p className="text-sm text-gray-600 capitalize">
                      {facility.type === 'hospital' ? 'مستشفى' :
                       facility.type === 'clinic' ? 'عيادة' :
                       facility.type === 'pharmacy' ? 'صيدلية' :
                       facility.type === 'laboratory' ? 'مختبر' :
                       facility.type === 'dental' ? 'عيادة أسنان' :
                       facility.type === 'specialized' ? 'متخصص' : facility.type}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-2xl">{facility.icon}</span>
                    {facility.availability.emergency && (
                      <Badge variant="destructive" className="text-xs">طوارئ</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{facility.district}</span>
                </div>

                {facility.contact?.phone && facility.contact.phone.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href={`tel:${facility.contact.phone[0]}`} className="text-blue-600 hover:underline">
                      {facility.contact.phone[0]}
                    </a>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{facility.workingHours}</span>
                </div>

                {facility.rating && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{facility.rating} ⭐</span>
                  </div>
                )}

                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>الإحداثيات:</strong> {facility.position[0]}, {facility.position[1]}
                </div>

                {/* أزرار الخرائط */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openGoogleMaps(facility)}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Google
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openOpenStreetMap(facility)}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    OSM
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => openAppleMaps(facility)}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Apple
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => openAllMaps(facility)}
                    className="text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    جميع الخرائط
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد مرافق</h3>
              <p className="text-gray-500">لا توجد مرافق تطابق معايير البحث</p>
            </CardContent>
          </Card>
        )}

        {/* زر العودة */}
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setLocation('/health-facilities')}>
            العودة لقائمة المرافق
          </Button>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
}
