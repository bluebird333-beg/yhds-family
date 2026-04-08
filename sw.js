const CACHE = "yhds-v2";
const ASSETS = ["./index.html", "./manifest.json"];
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyABdaB9U87q1wZJYYBsRbSmYHaqrdMhT5w",
  authDomain: "yhds-family.firebaseapp.com",
  projectId: "yhds-family",
  storageBucket: "yhds-family.firebasestorage.app",
  messagingSenderId: "900368479728",
  appId: "1:900368479728:web:e507687308781052721935",
  measurementId: "G-ECHZL3V44V"
};

importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js");

firebase.initializeApp(FIREBASE_CONFIG);
const messaging = firebase.messaging();

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

// FCM 백그라운드 알림
messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || "🏠 YHDS FAMILY", {
    body: body || "새 소식이 있어요!",
    icon: "https://em-content.zobj.net/source/apple/391/house_1f3e0.png",
    badge: "https://em-content.zobj.net/source/apple/391/house_1f3e0.png",
    vibrate: [200, 100, 200],
    data: { url: "./index.html" }
  });
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: "window" }).then(clientList => {
    for (const client of clientList) {
      if (client.url.includes("yhds-family") && "focus" in client) return client.focus();
    }
    return clients.openWindow("./index.html");
  }));
});
