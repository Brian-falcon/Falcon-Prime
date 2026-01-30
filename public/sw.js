/**
 * Service worker mínimo para que la PWA sea instalable (Chrome/Edge).
 * No cachea nada; solo cumple el criterio de instalabilidad.
 */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Paso directo: no cache. Solo necesario para que Chrome considere la PWA instalable.
});
