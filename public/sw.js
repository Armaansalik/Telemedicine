// Enhanced Service Worker for comprehensive offline functionality
const CACHE_NAME = 'hospital-management-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json',
  // Add more static assets as needed
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Add to dynamic cache
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Network failed, try to serve offline fallback
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for when app comes back online
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'patient-data-sync') {
    event.waitUntil(syncPatientData());
  }
  
  if (event.tag === 'prescription-sync') {
    event.waitUntil(syncPrescriptions());
  }
  
  if (event.tag === 'appointment-sync') {
    event.waitUntil(syncAppointments());
  }
});

// Sync functions
async function syncPatientData() {
  try {
    const pendingPatients = JSON.parse(localStorage.getItem('pendingPatients') || '[]');
    
    for (const patient of pendingPatients) {
      // In a real app, this would sync with your backend API
      console.log('Syncing patient:', patient.name);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark as synced
      patient.synced = true;
    }
    
    // Update local storage
    localStorage.setItem('pendingPatients', JSON.stringify(pendingPatients));
    
    // Notify the main app
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: 'Patient data synced successfully'
        });
      });
    });
    
  } catch (error) {
    console.error('Failed to sync patient data:', error);
  }
}

async function syncPrescriptions() {
  try {
    const pendingPrescriptions = JSON.parse(localStorage.getItem('pendingPrescriptions') || '[]');
    
    for (const prescription of pendingPrescriptions) {
      console.log('Syncing prescription:', prescription.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      prescription.synced = true;
    }
    
    localStorage.setItem('pendingPrescriptions', JSON.stringify(pendingPrescriptions));
    
    // Notify the main app
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_COMPLETE',
          data: 'Prescriptions synced successfully'
        });
      });
    });
    
  } catch (error) {
    console.error('Failed to sync prescriptions:', error);
  }
}

async function syncAppointments() {
  try {
    const pendingAppointments = JSON.parse(localStorage.getItem('pendingAppointments') || '[]');
    
    for (const appointment of pendingAppointments) {
      console.log('Syncing appointment:', appointment.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      appointment.synced = true;
    }
    
    localStorage.setItem('pendingAppointments', JSON.stringify(pendingAppointments));
    
  } catch (error) {
    console.error('Failed to sync appointments:', error);
  }
}

// Push notification support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Hospital Management System', options)
  );
});