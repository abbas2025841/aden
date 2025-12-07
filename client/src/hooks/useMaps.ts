// Hook للخرائط - سبتمبر 2025
import { useState, useEffect, useCallback, useRef } from 'react';
import { MAPS_CONFIG, MapLocation, MapMarker, DirectionsResult, GeocodingResult } from '@/lib/maps-config';

// إعلان Google Maps API
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function useGoogleMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);

  // تحميل Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places,geometry&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      window.initGoogleMaps = () => {
        setIsLoaded(true);
        setError(null);
      };

      script.onerror = () => {
        setError('فشل في تحميل Google Maps API');
        setIsLoaded(false);
      };

      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
        delete (window as any).initGoogleMaps;
      };
    };

    loadGoogleMaps();
  }, []);

  // إنشاء خريطة
  const createMap = useCallback((element: HTMLElement, options?: google.maps.MapOptions) => {
    if (!isLoaded || !window.google) return null;

    const mapOptions: google.maps.MapOptions = {
      center: MAPS_CONFIG.DEFAULT_CENTER,
      zoom: MAPS_CONFIG.DEFAULT_ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      ...options
    };

    const newMap = new google.maps.Map(element, mapOptions);
    setMap(newMap);
    return newMap;
  }, [isLoaded]);

  // إضافة ماركر
  const addMarker = useCallback((marker: MapMarker) => {
    if (!map || !window.google) return null;

    const googleMarker = new google.maps.Marker({
      position: marker.position,
      map: map,
      title: marker.title,
      icon: marker.icon ? {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#4285F4" stroke="#fff" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-size="16">${marker.icon}</text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40)
      } : undefined
    });

    // إضافة InfoWindow
    if (marker.description) {
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">${marker.title}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${marker.description}</p>
          </div>
        `
      });

      googleMarker.addListener('click', () => {
        infoWindow.open(map, googleMarker);
      });
    }

    setMarkers(prev => [...prev, marker]);
    return googleMarker;
  }, [map]);

  // إزالة جميع الماركرز
  const clearMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  // الحصول على موقع المستخدم
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: MapLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        
        if (map) {
          map.setCenter(location);
          map.setZoom(15);
        }
      },
      (error) => {
        setError(`خطأ في تحديد الموقع: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, [map]);

  // البحث عن عنوان
  const geocodeAddress = useCallback(async (address: string): Promise<GeocodingResult> => {
    if (!isLoaded || !window.google) {
      throw new Error('Google Maps API غير محمل');
    }

    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve({ results: results || [], status });
        } else {
          reject(new Error(`خطأ في البحث: ${status}`));
        }
      });
    });
  }, [isLoaded]);

  // الحصول على الاتجاهات
  const getDirections = useCallback(async (
    origin: MapLocation | string,
    destination: MapLocation | string,
    travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
  ): Promise<DirectionsResult> => {
    if (!isLoaded || !window.google) {
      throw new Error('Google Maps API غير محمل');
    }

    const directionsService = new google.maps.DirectionsService();
    
    return new Promise((resolve, reject) => {
      directionsService.route({
        origin: typeof origin === 'string' ? origin : origin,
        destination: typeof destination === 'string' ? destination : destination,
        travelMode: travelMode
      }, (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
        if (status === google.maps.DirectionsStatus.OK) {
          resolve({ routes: result?.routes || [], status });
        } else {
          reject(new Error(`خطأ في الحصول على الاتجاهات: ${status}`));
        }
      });
    });
  }, [isLoaded]);

  // رسم الاتجاهات على الخريطة
  const drawDirections = useCallback((directionsResult: DirectionsResult) => {
    if (!map || !window.google) return null;

    const directionsRenderer = new google.maps.DirectionsRenderer({
      draggable: false,
      map: map,
      suppressMarkers: false
    });

    directionsRenderer.setDirections({
      routes: directionsResult.routes,
      request: {} as google.maps.DirectionsRequest
    });

    return directionsRenderer;
  }, [map]);

  // البحث عن أماكن قريبة
  const searchNearby = useCallback(async (
    location: MapLocation,
    type: string,
    radius: number = 1000
  ) => {
    if (!isLoaded || !window.google) return [];

    const service = new google.maps.places.PlacesService(map!);
    
    return new Promise((resolve, reject) => {
      service.nearbySearch({
        location: location,
        radius: radius,
        type: type
      }, (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(new Error(`خطأ في البحث: ${status}`));
        }
      });
    });
  }, [isLoaded, map]);

  return {
    isLoaded,
    error,
    map,
    markers,
    userLocation,
    createMap,
    addMarker,
    clearMarkers,
    getUserLocation,
    geocodeAddress,
    getDirections,
    drawDirections,
    searchNearby
  };
}

// Hook لتحديد الموقع الجغرافي
export function useGeolocation() {
  const [location, setLocation] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError(`خطأ في تحديد الموقع: ${error.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        setError(`خطأ في مراقبة الموقع: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    watchLocation
  };
}
