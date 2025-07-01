// src/sw.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses
registerRoute(
    ({ url }) => url.origin === self.location.origin && url.pathname.startsWith('/api'),
    new NetworkFirst({
        cacheName: 'api-cache',
    })
);

// Cache static assets (images, CSS, JS)
registerRoute(
    ({ request }) => ['style', 'script', 'image'].includes(request.destination),
    new CacheFirst({
        cacheName: 'static-cache',
    })
);

// Skip waiting when a new SW is ready
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    if (typeof clients !== 'undefined') {
        clients.claim();
    }
});

// Optional: Sample notification trigger
self.addEventListener('push', (event) => {
    const data = event.data?.json() || { title: 'Hello!', body: 'This is a push notification.' };
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/assets/icon192.png',
    });
});
