// src/sw.js
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

// Clean up old caches
cleanupOutdatedCaches();

// Handle watch mode duplicate registration
let manifestURLs = new Set();

// Precache and route all static assets with deduplication
const manifest = self.__WB_MANIFEST || [];
manifest.forEach((entry) => {
  if (!manifestURLs.has(entry.url)) {
    manifestURLs.add(entry.url);
  }
});

precacheAndRoute([...manifestURLs].map((url) => ({ url, revision: null })));

// Cache API responses with network-first strategy
registerRoute(
  ({ url }) =>
    url.origin === self.location.origin && url.pathname.startsWith("/api"),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  }),
);

// Cache static assets with cache-first strategy
registerRoute(
  ({ request }) => ["style", "script", "image"].includes(request.destination),
  new CacheFirst({
    cacheName: "static-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);

// Skip waiting when a new SW is ready
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
});

// Optional: Sample notification trigger
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "Hello!",
    body: "This is a push notification.",
  };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/assets/icon192.png",
  });
});
