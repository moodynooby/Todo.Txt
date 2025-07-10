// This file is intentionally left blank.
// Workbox will generate the service worker code here during the build process.

// Basic service worker lifecycle event listeners (optional, for customization)
self.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  // Add any assets to cache here if not handled by Workbox
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activating...");
  // Clean up old caches here
});

self.addEventListener("fetch", (event) => {
  // console.log('Fetching:', event.request.url);
  // Workbox will handle caching strategies defined in rsbuild.config.mjs
  // You can add custom fetch handling here if needed
});
