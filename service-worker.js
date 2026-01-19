const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  './Sokil1.html',
  './manifest.json',
  './icon.png',
];

// Встановлення кешу
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Оновлення кешу
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обробка запитів
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Повертає кешований ресурс, якщо він є, або виконує запит до сервера
      return cachedResponse || fetch(event.request).catch(() => {
        // Якщо немає з’єднання, повертає спрощену версію або повідомлення
        return caches.match('/offline.html'); // Переконайтеся, що у вас є цей файл
      });
    })
  );
});