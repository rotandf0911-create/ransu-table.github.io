const CACHE_NAME = "doubles-pwa-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./icon-192.svg",
  "./icon-512.svg"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.map(k=>k===CACHE_NAME?null:caches.delete(k))
  )));
  self.clients.claim();
});
self.addEventListener("fetch", e=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
