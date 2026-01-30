"use client";

/**
 * Banner/botón visible para instalar la PWA (Falcon Prime).
 * Aparece cuando el navegador permite instalar y el usuario no lo cerró.
 */
import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "falcon-prime-pwa-dismissed";

export default function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Registrar service worker para que Chrome permita instalar la PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // No mostrar si ya está en modo standalone (app instalada)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }
    if ((window as unknown as { standalone?: boolean }).standalone) {
      setIsInstalled(true);
      return;
    }
    // No mostrar si el usuario cerró el banner antes
    if (localStorage.getItem(DISMISS_KEY)) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    if (typeof window !== "undefined") localStorage.setItem(DISMISS_KEY, "1");
  }

  if (!showBanner || isInstalled || !deferredPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[100] bg-fp-black text-white p-4 rounded-lg shadow-lg flex items-center gap-3"
      role="dialog"
      aria-label="Instalar Falcon Prime"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">Instalar Falcon Prime</p>
        <p className="text-xs text-white/80 mt-0.5">
          Descargá la app para acceder más rápido desde tu celular o escritorio.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="px-3 py-1.5 bg-white text-fp-black text-sm font-medium rounded hover:bg-gray-100"
        >
          Instalar
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 text-white/80 hover:text-white rounded"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
