// Unregister service worker and clear all caches to prevent stale asset issues
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.map(name => caches.delete(name)))
    ).then(() => self.clients.matchAll()).then(clients => {
      clients.forEach(client => client.navigate(client.url));
    })
  );
  self.registration.unregister();
});