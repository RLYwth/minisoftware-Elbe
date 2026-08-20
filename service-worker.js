const CACHE_NAME = 'cloak-app-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

const EXTERNAL_LIBRARIES = [
  'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await Promise.allSettled(EXTERNAL_LIBRARIES.map((url) => cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        await cache.put('./index.html', response.clone());
        return response;
      } catch (error) {
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;

    try {
      const response = await fetch(event.request);
      if (response.ok || response.type === 'opaque') {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});
