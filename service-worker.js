const CACHE_NAME = "flip-card-cache-v1";

// URLs to cache
const totalCards = 200; // total number of cards
const urlsToCache = [
  "./",
  "./index.html",
  "./images/profile.jpg",
  "./images/logo.png",
  "./images/icon-192.png",
  "./images/icon-512.png"
];

// Add all card index.html files to cache
for (let i = 1; i <= totalCards; i++) {
  urlsToCache.push(`./card${i}/index.html`);
}

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
