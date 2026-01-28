"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Registra o service worker após a página carregar
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

          console.log("[SW] Service Worker registrado:", registration.scope);

          // Verifica atualizações
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // Nova versão disponível
                  console.log("[SW] Nova versão disponível");
                }
              });
            }
          });
        } catch (error) {
          console.error("[SW] Erro ao registrar Service Worker:", error);
        }
      });
    }
  }, []);

  return null;
}
