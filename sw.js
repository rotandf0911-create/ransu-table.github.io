const CACHE_NAME = "rands-app-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",

  "./icons/icon-192-v2.png",
  "./icons/icon-512-v2.png",
  "./icons/icon-180-v2.png",
  "./icons/icon-167-v2.png",
  "./icons/icon-152-v2.png",
  "./icons/favicon-v2.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ページ遷移は index.html をキャッシュ優先
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => cached || fetch(req).catch(() => cached))
    );
    return;
  }

  // それ以外はキャッシュ優先 → なければネット → キャッシュ保存
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => cached);
    })
  );
});
