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
  // Don't automatically skip waiting, let the user decide
  // self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  clients.claim();
  console.log("Service worker activated and clients claimed.");
});

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Inform clients when a new version is ready
self.addEventListener("controllerchange", () => {
  // This event fires when the service worker controlling this page changes.
  // It's a good place to reload the page or notify the user.
  // For now, we'll rely on the client-side check after registration.
});


// When a new SW has installed and is waiting, tell the clients
self.addEventListener('waiting', async (event) => {
  // This event doesn't seem to be standard or fire reliably for this purpose.
  // We will rely on the registration.onupdatefound logic in the client.
  // However, keeping a listener here can be useful for debugging.
  console.log('A new service worker is waiting.');
});

// This is a more reliable way to inform clients from the SW itself
// if an update is found *during* the current SW's lifetime,
// but the primary notification logic will be client-side based on registration.onupdatefound
const informClientsOfUpdate = () => {
  self.registration.waiting?.postMessage({ type: 'SW_WAITING' });
};

// Call this if you have a mechanism to detect an update from within the SW.
// For now, we're focusing on client-side detection.

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
