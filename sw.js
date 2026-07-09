/*!
 * NEHA EDU LABS — sw.js
 * Minimal service worker: precaches the app shell for offline access and
 * serves other requests network-first, falling back to cache when offline.
 */
const CACHE_NAME = "nel-cache-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/about.html",
  "/courses.html",
  "/notes.html",
  "/blog.html",
  "/projects.html",
  "/ai-tools.html",
  "/resources.html",
  "/contact.html",
  "/assets/css/style.css",
  "/assets/js/components.js",
  "/assets/js/data.js",
  "/assets/js/main.js",
  "/assets/js/news.js",
  "/assets/js/courses.js",
  "/assets/js/blog.js",
  "/assets/js/projects.js",
  "/assets/js/notes.js",
  "/assets/js/search.js",
  "/manifest.json",
  "/favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/index.html")))
  );
});
