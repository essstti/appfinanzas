// Service worker: guarda la app en el celular para que funcione sin internet.
// Cada vez que cambies algo de la app, subí este número (v1 -> v2) para que el celu baje la versión nueva.
const VERSION = 'finanzas-v11';
const ARCHIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/favicon.svg',
  './fonts/SpaceMono-400.woff2',
  './fonts/SpaceMono-700.woff2',
  './fonts/SpaceGrotesk.woff2',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // La cotización del dólar va siempre a internet (la app ya maneja si no hay conexión)
  if (url.origin !== location.origin) return;
  // Primero intenta internet (para tener lo último); si no hay, usa la copia guardada
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copia = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
