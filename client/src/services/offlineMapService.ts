// خدمة الخرائط المحلية - عدن لايف
import L from 'leaflet';

export interface OfflineMapConfig {
  center: [number, number];
  zoom: number;
  bounds: [[number, number], [number, number]];
  maxZoom: number;
  minZoom: number;
}

export class OfflineMapService {
  private static instance: OfflineMapService;
  private map: L.Map | null = null;
  private isOnline: boolean = navigator.onLine;

  // إعدادات عدن
  private readonly ADEN_CONFIG: OfflineMapConfig = {
    center: [12.8275, 45.0367], // مركز عدن
    zoom: 12,
    bounds: [
      [12.7, 44.9],  // جنوب غرب
      [12.9, 45.1]   // شمال شرق
    ],
    maxZoom: 18,
    minZoom: 10
  };

  static getInstance(): OfflineMapService {
    if (!OfflineMapService.instance) {
      OfflineMapService.instance = new OfflineMapService();
    }
    return OfflineMapService.instance;
  }

  // إنشاء خريطة محلية
  createOfflineMap(containerId: string, targetLocation?: [number, number]): L.Map {
    this.map = L.map(containerId, {
      center: targetLocation || this.ADEN_CONFIG.center,
      zoom: targetLocation ? 16 : this.ADEN_CONFIG.zoom,
      maxZoom: this.ADEN_CONFIG.maxZoom,
      minZoom: this.ADEN_CONFIG.minZoom,
      zoomControl: true,
      attributionControl: false
    });

    // إضافة طبقة الخرائط المحلية
    this.addOfflineTileLayer();
    
    // إضافة طبقة المعالم
    this.addLandmarksLayer();

    // إذا كان هناك موقع محدد، أضف علامة عليه
    if (targetLocation) {
      this.addTargetMarker(targetLocation);
    }

    return this.map;
  }

  // إضافة طبقة الخرائط المحلية
  private addOfflineTileLayer(): void {
    if (!this.map) return;

    // استخدام OpenStreetMap عبر الإنترنت كبديل
    const onlineTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | عدن لايف',
      maxZoom: 18,
      minZoom: 10,
      bounds: this.ADEN_CONFIG.bounds,
      noWrap: true
    });

    // محاولة استخدام الخرائط المحلية أولاً
    const offlineTileLayer = L.tileLayer('/maps/aden/complete/tiles/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors | عدن لايف',
      maxZoom: 18,
      minZoom: 10,
      bounds: this.ADEN_CONFIG.bounds,
      noWrap: true
    });

    // إضافة طبقة الخرائط مع fallback
    offlineTileLayer.addTo(this.map);
    
    // إذا فشلت الخرائط المحلية، استخدم الخرائط عبر الإنترنت
    offlineTileLayer.on('tileerror', () => {
      this.map?.removeLayer(offlineTileLayer);
      onlineTileLayer.addTo(this.map!);
    });
  }

  // إضافة طبقة المعالم المهمة
  private addLandmarksLayer(): void {
    if (!this.map) return;

    // تحميل معالم عدن
    this.loadAdenLandmarks().then(landmarks => {
      landmarks.forEach(landmark => {
        const marker = L.marker([landmark.lat, landmark.lng], {
          icon: this.getCustomIcon(landmark.type)
        });

        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${landmark.name}</h3>
            <p class="text-sm text-gray-600">${landmark.district}</p>
            <p class="text-xs text-gray-500">${landmark.type}</p>
          </div>
        `);

        marker.addTo(this.map!);
      });
    });
  }

  // إضافة علامة الموقع المستهدف
  private addTargetMarker(location: [number, number]): void {
    if (!this.map) return;

    const targetIcon = L.divIcon({
      html: '<div class="text-3xl">🎯</div>',
      className: 'target-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker(location, { icon: targetIcon });
    marker.bindPopup(`
      <div class="p-3 text-center">
        <h3 class="font-bold text-lg text-red-600">موقعك المستهدف</h3>
        <p class="text-sm text-gray-600">اضغط على الخريطة للتنقل</p>
      </div>
    `);
    marker.addTo(this.map);
  }

  // تحميل معالم عدن
  private async loadAdenLandmarks(): Promise<any[]> {
    try {
      const response = await fetch('/maps/aden/aden-landmarks.json');
      return await response.json();
    } catch (error) {
      console.error('خطأ في تحميل معالم عدن:', error);
      return [];
    }
  }

  // إنشاء أيقونات مخصصة
  private getCustomIcon(type: string): L.Icon {
    const iconMap: { [key: string]: string } = {
      hospital: '🏥',
      school: '🏫',
      mosque: '🕌',
      water: '🚰',
      electricity: '⚡',
      government: '🏛️',
      market: '🏪',
      restaurant: '🍽️'
    };

    return L.divIcon({
      html: `<div class="text-2xl">${iconMap[type] || '📍'}</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    }) as any;
  }

  // البحث في المعالم
  searchLandmarks(_query: string): any[] {
    // تنفيذ البحث المحلي
    return [];
  }

  // الحصول على الاتجاهات
  getDirections(_from: [number, number], _to: [number, number]): any {
    // تنفيذ الاتجاهات المحلية
    return null;
  }

  // فحص حالة الاتصال
  checkConnectionStatus(): boolean {
    this.isOnline = navigator.onLine;
    return this.isOnline;
  }

  // تبديل بين الخرائط المحلية والعبر الإنترنت
  toggleMapMode(): void {
    if (!this.map) return;

    this.map.remove();
    
    if (this.isOnline) {
      // استخدام Google Maps
      this.createOnlineMap();
    } else {
      // استخدام الخرائط المحلية
      this.createOfflineMap('map');
    }
  }

  // إنشاء خريطة عبر الإنترنت
  private createOnlineMap(): void {
    // تنفيذ Google Maps
  }

  // فتح الخريطة مع موقع محدد
  openMapWithLocation(location: [number, number], locationName: string): void {
    // إنشاء modal للخريطة
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg w-full max-w-4xl h-96 relative">
        <div class="flex justify-between items-center p-4 border-b">
          <h3 class="text-lg font-bold">الاتجاهات إلى ${locationName}</h3>
          <button id="close-map" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div id="directions-map" class="w-full h-80 rounded-b-lg"></div>
        <div class="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2 text-xs text-gray-600">
          <div>🗺️ خريطة عدن</div>
          <div>📍 ${locationName}</div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // إنشاء الخريطة
    setTimeout(() => {
      const mapContainer = document.getElementById('directions-map');
      if (mapContainer) {
        // مسح أي خريطة موجودة
        mapContainer.innerHTML = '';
        
        // إنشاء الخريطة الجديدة
        const newMap = L.map('directions-map', {
          center: location,
          zoom: 15,
          zoomControl: true,
          attributionControl: true,
          maxZoom: 20,
          minZoom: 10,
          zoomSnap: 0.5,
          zoomDelta: 0.5
        });

        // إضافة طبقة الخرائط
        this.addOfflineTileLayerToMap(newMap);
        
        // إضافة علامة الهدف
        this.addTargetMarkerToMap(newMap, location, locationName);
      }
    }, 100);

    // إضافة معالج الإغلاق
    const closeBtn = modal.querySelector('#close-map');
    closeBtn?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // إغلاق عند النقر خارج الخريطة
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  // إضافة طبقة الخرائط لخريطة محددة
  private addOfflineTileLayerToMap(map: L.Map): void {
    // استخدام خرائط Google Maps - الخريطة العادية
    const googleMapsLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps | عدن لايف',
      maxZoom: 20,
      minZoom: 1,
      subdomains: '0123'
    });

    // خيارات خرائط جوجل إضافية
    const googleSatelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps | عدن لايف',
      maxZoom: 20,
      minZoom: 1,
      subdomains: '0123'
    });

    const googleHybridLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '© Google Maps | عدن لايف',
      maxZoom: 20,
      minZoom: 1,
      subdomains: '0123'
    });

    // إضافة الخريطة العادية
    googleMapsLayer.addTo(map);

    // إضافة طبقات التحكم
    const baseMaps = {
      "خريطة عادية": googleMapsLayer,
      "صور الأقمار الصناعية": googleSatelliteLayer,
      "خريطة مختلطة": googleHybridLayer
    };

    L.control.layers(baseMaps).addTo(map);
  }

  // إضافة علامة الهدف لخريطة محددة
  private addTargetMarkerToMap(map: L.Map, location: [number, number], locationName: string): void {
    // إنشاء دائرة حمراء للهدف
    const targetCircle = L.circle(location, {
      color: '#ff0000',
      fillColor: '#ff0000',
      fillOpacity: 0.3,
      radius: 100
    });

    // إنشاء علامة الهدف بنمط Google Maps
    const targetIcon = L.divIcon({
      html: `
        <div style="
          background: #ff0000;
          color: white;
          border: 3px solid white;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          box-shadow: 0 3px 15px rgba(0,0,0,0.4);
          font-size: 18px;
        ">📍</div>
      `,
      className: 'target-marker',
      iconSize: [35, 35],
      iconAnchor: [17, 17]
    });

    const marker = L.marker(location, { icon: targetIcon });
    
    // إضافة الدائرة والعلامة
    targetCircle.addTo(map);
    marker.addTo(map);
    
    // ربط النافذة المنبثقة بنمط Google Maps
    marker.bindPopup(`
      <div class="p-4 text-center" style="min-width: 200px;">
        <div style="
          background: #ff0000;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          margin-bottom: 10px;
          font-weight: bold;
        ">📍 ${locationName}</div>
        <p style="color: #666; font-size: 14px; margin: 5px 0;">موقعك المستهدف</p>
        <div style="
          background: #f5f5f5;
          padding: 8px;
          border-radius: 8px;
          font-size: 12px;
          color: #888;
          margin-top: 8px;
        ">
          <strong>الإحداثيات:</strong><br>
          ${location[0].toFixed(6)}° N<br>
          ${location[1].toFixed(6)}° E
        </div>
      </div>
    `);
    
    marker.openPopup();
    
    // تكبير الخريطة لتناسب المنطقة
    map.fitBounds(targetCircle.getBounds().pad(0.1));
  }
}

export default OfflineMapService;
