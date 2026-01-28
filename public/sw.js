/**
 * Service Worker do Participa DF
 *
 * Funcionalidades:
 * - Cache de recursos estáticos para funcionamento offline
 * - Estratégia network-first para conteúdo dinâmico
 * - Página offline personalizada
 */

const CACHE_NAME = "participa-df-v1";
const OFFLINE_URL = "/offline";

// Recursos para cache inicial
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // Cache de recursos estáticos
      await cache.addAll(STATIC_ASSETS);

      // Força ativação imediata
      self.skipWaiting();
    })()
  );
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Limpa caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );

      // Assume controle de todas as páginas
      self.clients.claim();
    })()
  );
});

// Interceptação de requisições
self.addEventListener("fetch", (event) => {
  // Ignora requisições não-GET
  if (event.request.method !== "GET") {
    return;
  }

  // Ignora requisições de API (sempre vai para rede)
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Tenta buscar da rede primeiro
        const networkResponse = await fetch(event.request);

        // Se sucesso, atualiza o cache
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // Se offline, tenta buscar do cache
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        // Se é uma navegação e não tem cache, mostra página offline
        if (event.request.mode === "navigate") {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // Retorna erro genérico
        return new Response("Conteúdo não disponível offline", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    })()
  );
});

// Sincronização em background (para envios pendentes)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-manifestation") {
    event.waitUntil(syncPendingManifestations());
  }
});

async function syncPendingManifestations() {
  // TODO: Implementar sincronização de manifestações pendentes
  // Isso seria usado para enviar manifestações que foram salvas
  // localmente enquanto o usuário estava offline
  console.log("[SW] Sincronizando manifestações pendentes...");
}
