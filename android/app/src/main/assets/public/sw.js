self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  return self.clients.claim();
});

self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  let notificationData;
  try {
    notificationData = event.data.json();
  } catch (e) {
    console.error('Service Worker: Error parsing push data', e);
    return;
  }

  const options = {
    body: notificationData.body || 'تحديث في حالة الكهرباء',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: notificationData.districtId || 'general',
      districtName: notificationData.districtName || '',
      status: notificationData.status || ''
    },
    actions: [
      {
        action: 'view',
        title: 'عرض التفاصيل',
        icon: '/icon-view.png'
      },
      {
        action: 'dismiss',
        title: 'إغلاق',
        icon: '/icon-dismiss.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title || 'إشعار من متتبع انقطاع الكهرباء', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.openWindow('/electricity/outage-tracker')
  );
});
