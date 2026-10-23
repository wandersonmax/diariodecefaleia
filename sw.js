// Service worker: guarda os arquivos do app para abrir sem internet.
// Ao mudar a lista de arquivos, aumente a versão para limpar o cache antigo.
var CACHE = "enxaqueca-v2";
var ARQUIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts/recursive-latin.woff2",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "icons/favicon-32.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ARQUIVOS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.filter(function (n) { return n !== CACHE; })
        .map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Responde do cache na hora e atualiza em segundo plano quando há internet,
// assim o app abre offline e recebe as mudanças na próxima abertura.
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(req, { ignoreSearch: true }).then(function (salvo) {
        var rede = fetch(req).then(function (resp) {
          if (resp.ok) c.put(req, resp.clone());
          return resp;
        }).catch(function () {
          return salvo || (req.mode === "navigate" ? c.match("index.html") : Response.error());
        });
        return salvo || rede;
      });
    })
  );
});
