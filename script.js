self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      if (cachedRes) {
        return cachedRes; // serve from cache
      }

      return fetch(event.request).then((networkRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // dynamically cache new request
          cache.put(event.request, networkRes.clone());
          return networkRes;
        });
      }).catch(() => {
        // optional: fallback if offline & not in cache
        if(event.request.destination === 'image'){
          return caches.match('./images/logo.png');
        }
      });
    })
  );
});
