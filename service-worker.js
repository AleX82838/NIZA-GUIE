const CACHE_NAME = "nizaguie-cache-v1";
const urlsToCache = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.json",
  "img/logo.png",
  "img/grupo.jpg"
];

// Instalar y cachear
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activar y limpiar cache vieja
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Responder desde cache
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});
