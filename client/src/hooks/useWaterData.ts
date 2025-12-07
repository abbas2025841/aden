// Hooks لإدارة بيانات المياه - سبتمبر 2025
import { useState, useEffect, useCallback } from 'react';
import {
  WaterPump,
  WaterMaintenance,
  WaterTanker,
  WaterPoint,
  WaterOrder,
  WaterBooking,
  adenWaterPumps,
  adenWaterMaintenance,
  adenWaterTankers,
  adenWaterPoints,
  waterOrders,
  waterBookings
} from '@/data/aden-water-data';

// Hook لإدارة مضخات المياه
export function useWaterPumps() {
  const [pumps, setPumps] = useState<WaterPump[]>(adenWaterPumps);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterPumps = useCallback((filters: {
    type?: string;
    district?: string;
    availability?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    let filtered = [...pumps];

    if (filters.type) {
      filtered = filtered.filter(pump => pump.type === filters.type);
    }

    if (filters.district) {
      filtered = filtered.filter(pump => pump.location.district === filters.district);
    }

    if (filters.availability) {
      filtered = filtered.filter(pump => pump.availability === filters.availability);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(pump => pump.price.purchase >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(pump => pump.price.purchase <= filters.maxPrice!);
    }

    return filtered;
  }, [pumps]);

  const getPumpById = useCallback((id: string) => {
    return pumps.find(pump => pump.id === id);
  }, [pumps]);

  const updatePumpAvailability = useCallback((id: string, availability: WaterPump['availability']) => {
    setPumps(prev => prev.map(pump => 
      pump.id === id ? { ...pump, availability } : pump
    ));
  }, []);

  return {
    pumps,
    loading,
    error,
    filterPumps,
    getPumpById,
    updatePumpAvailability
  };
}

// Hook لإدارة صيانة المياه
export function useWaterMaintenance() {
  const [maintenance, setMaintenance] = useState<WaterMaintenance[]>(adenWaterMaintenance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterMaintenance = useCallback((filters: {
    district?: string;
    emergency?: boolean;
    specialty?: string;
  }) => {
    let filtered = [...maintenance];

    if (filters.district) {
      filtered = filtered.filter(service => service.location.district === filters.district);
    }

    if (filters.emergency !== undefined) {
      filtered = filtered.filter(service => service.availability.emergency === filters.emergency);
    }

    if (filters.specialty) {
      filtered = filtered.filter(service => 
        service.specialties.includes(filters.specialty!)
      );
    }

    return filtered;
  }, [maintenance]);

  const getMaintenanceById = useCallback((id: string) => {
    return maintenance.find(service => service.id === id);
  }, [maintenance]);

  return {
    maintenance,
    loading,
    error,
    filterMaintenance,
    getMaintenanceById
  };
}

// Hook لإدارة صهاريج المياه
export function useWaterTankers() {
  const [tankers, setTankers] = useState<WaterTanker[]>(adenWaterTankers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterTankers = useCallback((filters: {
    type?: string;
    district?: string;
    availability?: string;
    minCapacity?: number;
    maxCapacity?: number;
  }) => {
    let filtered = [...tankers];

    if (filters.type) {
      filtered = filtered.filter(tanker => tanker.type === filters.type);
    }

    if (filters.district) {
      filtered = filtered.filter(tanker => tanker.delivery.areas.includes(filters.district!));
    }

    if (filters.availability) {
      filtered = filtered.filter(tanker => tanker.availability === filters.availability);
    }

    if (filters.minCapacity) {
      filtered = filtered.filter(tanker => {
        const capacity = parseInt(tanker.capacity.replace('L', ''));
        return capacity >= filters.minCapacity!;
      });
    }

    if (filters.maxCapacity) {
      filtered = filtered.filter(tanker => {
        const capacity = parseInt(tanker.capacity.replace('L', ''));
        return capacity <= filters.maxCapacity!;
      });
    }

    return filtered;
  }, [tankers]);

  const getTankerById = useCallback((id: string) => {
    return tankers.find(tanker => tanker.id === id);
  }, [tankers]);

  const updateTankerAvailability = useCallback((id: string, availability: WaterTanker['availability']) => {
    setTankers(prev => prev.map(tanker => 
      tanker.id === id ? { ...tanker, availability } : tanker
    ));
  }, []);

  return {
    tankers,
    loading,
    error,
    filterTankers,
    getTankerById,
    updateTankerAvailability
  };
}

// Hook لإدارة نقاط المياه
export function useWaterPoints() {
  const [points, setPoints] = useState<WaterPoint[]>(adenWaterPoints);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filterPoints = useCallback((filters: {
    type?: string;
    district?: string;
    status?: string;
    hasContact?: boolean;
  }) => {
    let filtered = [...points];

    if (filters.type) {
      filtered = filtered.filter(point => point.type === filters.type);
    }

    if (filters.district) {
      filtered = filtered.filter(point => point.location.district === filters.district);
    }

    if (filters.status) {
      filtered = filtered.filter(point => point.status === filters.status);
    }

    if (filters.hasContact !== undefined) {
      filtered = filtered.filter(point => 
        filters.hasContact ? !!point.contact : !point.contact
      );
    }

    return filtered;
  }, [points]);

  const getPointById = useCallback((id: string) => {
    return points.find(point => point.id === id);
  }, [points]);

  const updatePointStatus = useCallback((id: string, status: WaterPoint['status']) => {
    setPoints(prev => prev.map(point => 
      point.id === id ? { ...point, status } : point
    ));
  }, []);

  return {
    points,
    loading,
    error,
    filterPoints,
    getPointById,
    updatePointStatus
  };
}

// Hook لإدارة طلبات المياه
export function useWaterOrders() {
  const [orders, setOrders] = useState<WaterOrder[]>(waterOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback((orderData: Omit<WaterOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: WaterOrder = {
      ...orderData,
      id: `order_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: WaterOrder['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === id 
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ));
  }, []);

  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);

  const getOrdersByCustomer = useCallback((phone: string) => {
    return orders.filter(order => order.customer.phone === phone);
  }, [orders]);

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByCustomer
  };
}

// Hook لإدارة حجوزات الصيانة
export function useWaterBookings() {
  const [bookings, setBookings] = useState<WaterBooking[]>(waterBookings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback((bookingData: Omit<WaterBooking, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBooking: WaterBooking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  }, []);

  const updateBookingStatus = useCallback((id: string, status: WaterBooking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id 
        ? { ...booking, status, updatedAt: new Date().toISOString() }
        : booking
    ));
  }, []);

  const getBookingById = useCallback((id: string) => {
    return bookings.find(booking => booking.id === id);
  }, [bookings]);

  const getBookingsByCustomer = useCallback((phone: string) => {
    return bookings.filter(booking => booking.customer.phone === phone);
  }, [bookings]);

  const getBookingsByService = useCallback((serviceId: string) => {
    return bookings.filter(booking => booking.service.id === serviceId);
  }, [bookings]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    getBookingById,
    getBookingsByCustomer,
    getBookingsByService
  };
}

// Hook شامل لإدارة المياه
export function useWaterManagement() {
  const waterPumps = useWaterPumps();
  const waterMaintenance = useWaterMaintenance();
  const waterTankers = useWaterTankers();
  const waterPoints = useWaterPoints();
  const waterOrders = useWaterOrders();
  const waterBookings = useWaterBookings();

  const getWaterStats = useCallback(() => {
    return {
      totalPumps: waterPumps.pumps.length,
      availablePumps: waterPumps.pumps.filter(p => p.availability === 'available').length,
      totalMaintenance: waterMaintenance.maintenance.length,
      emergencyMaintenance: waterMaintenance.maintenance.filter(m => m.availability.emergency).length,
      totalTankers: waterTankers.tankers.length,
      availableTankers: waterTankers.tankers.filter(t => t.availability === 'available').length,
      totalPoints: waterPoints.points.length,
      operationalPoints: waterPoints.points.filter(p => p.status === 'operational').length,
      totalOrders: waterOrders.orders.length,
      pendingOrders: waterOrders.orders.filter(o => o.status === 'pending').length,
      totalBookings: waterBookings.bookings.length,
      pendingBookings: waterBookings.bookings.filter(b => b.status === 'pending').length
    };
  }, [waterPumps, waterMaintenance, waterTankers, waterPoints, waterOrders, waterBookings]);

  return {
    ...waterPumps,
    ...waterMaintenance,
    ...waterTankers,
    ...waterPoints,
    ...waterOrders,
    ...waterBookings,
    getWaterStats
  };
}
