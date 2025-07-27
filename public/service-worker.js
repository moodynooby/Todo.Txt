// Service Worker for versioned cache management
const CACHE_PREFIX = 'todo-txt-v';
const CACHE_VERSION = '1.0.1'; // This will be replaced during build
const CURRENT_CACHE = `${CACHE_PREFIX}${CACHE_VERSION}`;

// Files to cache
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
  // Other assets will be added during build
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CURRENT_CACHE)
      .then(cache => {
        console.log(`[Service Worker] Caching app shell (v${CACHE_VERSION})`);
        return cache.addAll(PRECACHE_URLS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that don't match the current version
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CURRENT_CACHE) {
            console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        // Make network request and cache the response
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CURRENT_CACHE).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
  );
});
