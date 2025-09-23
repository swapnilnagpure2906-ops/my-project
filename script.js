const CACHE_NAME = 'flip-card-cache-v1';
const ASSETS_TO_CACHE = [
  '/manifest.json',
  '/common/script.js',
  '/images/pwa-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(resp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resp.clone());
          return resp;
        });
      }).catch(() => {
        if(event.request.destination === 'image'){
          return caches.match('/images/pwa-icon.png'); // fallback
        }
      });
    })
  );
});
