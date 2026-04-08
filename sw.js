const CACHE = "yhds-v1";
const ASSETS = ["./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
self.addEventListener("push", e => {
  const data = e.data?.json() || {};
  e.waitUntil(self.registration.showNotification(data.title || "YHDS FAMILY", {
    body: data.body || "새 소식이 있어요!",
    icon: "https://em-content.zobj.net/source/apple/391/house_1f3e0.png"
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow("./index.html"));
});
