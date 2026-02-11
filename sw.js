const CACHE = "measure-pwa-v2";
const ASSETS = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : Promise.resolve())));
    await self.clients.claim();
  })());
});

// 네트워크 우선(최신 우선), 실패하면 캐시
self.addEventListener("fetch", (e) => {
  e.respondWith((async () => {
    try {
      const fresh = await fetch(e.request);
      return fresh;
    } catch {
      const cached = await caches.match(e.request);
      return cached || Response.error();
    }
  })());
});
