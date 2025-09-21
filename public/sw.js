// Service Worker for offline functionality
const CACHE_NAME = 'hospital-management-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for when app comes back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'patient-data-sync') {
    event.waitUntil(syncPatientData());
  }
  if (event.tag === 'prescription-sync') {
    event.waitUntil(syncPrescriptions());
  }
});

async function syncPatientData() {
  // Sync patient data when online
  const pendingPatients = JSON.parse(localStorage.getItem('pendingPatients') || '[]');
  // Implementation for syncing data
}

async function syncPrescriptions() {
  // Sync prescriptions when online
  const pendingPrescriptions = JSON.parse(localStorage.getItem('pendingPrescriptions') || '[]');
  // Implementation for syncing prescriptions
}