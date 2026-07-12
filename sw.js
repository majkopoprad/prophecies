/* Proroctva.sk service worker — offline-first for a static site.
   Bump CACHE when shipping changes so clients refresh the app shell. */
const CACHE = "proroctva-v1";

// App shell precached on install. Bible data JSON is intentionally left out
// (large, per-book) and cached on demand by the fetch handler instead.
const SHELL = [
  "./",
  "index.html", "prophecies.html", "typology.html", "nations.html",
  "harmony.html", "parables.html", "iam.html", "genealogy.html",
  "widget.html", "encyclical.html", "bible.html", "prayers.html",
  "reference.html", "readings.html", "plan.html", "timeline.html",
  "theology.css", "theology.js", "verses.js", "prophecies-data.js",
  "bible-books.js",
  "Receipt.otf",
  "favicon.ico", "favicon.svg", "apple-touch-icon.png",
  "icon-192.png", "icon-512.png", "icon-maskable-512.png",
  "manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Cache each item individually so one 404 can't abort the whole install.
    await Promise.all(SHELL.map((url) =>
      cache.add(url).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  const isHTML = req.mode === "navigate" ||
                 (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // Network-first for pages: fresh content online, cached copy offline.
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
        return res;
      } catch (e) {
        return (await caches.match(req)) ||
               (await caches.match("index.html")) ||
               Response.error();
      }
    })());
    return;
  }

  // Stale-while-revalidate for assets (css, js, json, fonts, images).
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req);
    const network = fetch(req).then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
