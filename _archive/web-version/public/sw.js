const CACHE = "mera-word-search-v29-shell-v1";
const APP_SHELL = ["/", "/__grok/manifest.webmanifest", "/__grok/icon-180.png"];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("message", (event) => { if (event.data?.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && (event.request.mode === "navigate" || url.pathname.startsWith("/assets/"))) {
      const clone = response.clone(); void caches.open(CACHE).then((cache) => cache.put(event.request, clone));
    }
    return response;
  }).catch(() => caches.match("/"))));
});
self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data?.json() ?? {}; } catch { data = { body: event.data?.text() ?? "Your word journey is waiting." }; }
  event.waitUntil(self.registration.showNotification(data.title || "Mera Word Search Journey", {
    body: data.body || "A new challenge is ready.", icon: "/__grok/icon-180.png", badge: "/__grok/icon-180.png", tag: data.tag || "word-journey",
    data: { url: data.url || "/" },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/";
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    const client = clients.find((c) => "focus" in c);
    return client ? client.focus() : self.clients.openWindow(target);
  }));
});
