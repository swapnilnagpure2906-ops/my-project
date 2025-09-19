const CACHE_NAME = "flip-card-cache-v1";

// Core files to always cache
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./images/logo.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./style.css" // अगर अलग stylesheet है
];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - dynamic caching
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResp) => {
      if (cachedResp) return cachedResp;

      // Fetch from network and cache it
      return fetch(event.request)
        .then((networkResp) => {
          return caches.open(CACHE_NAME).then((cache) => {
            // Only cache GET requests
            if (event.request.method === "GET") {
              cache.put(event.request, networkResp.clone());
            }
            return networkResp;
          });
        })
        .catch(() => {
          // Offline fallback: optional
          if (event.request.destination === "image") {
            return caches.match("./images/logo.png");
          }
          return new Response("You are offline", {
            status: 503,
            statusText: "Offline",
          });
        });
    })
  );
});
