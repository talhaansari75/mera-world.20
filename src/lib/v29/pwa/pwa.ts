export type PwaStatus = { installed: boolean; updateAvailable: boolean; online: boolean };

type BeforeInstallEvent = Event & { prompt?: () => Promise<void>; userChoice?: Promise<{ outcome: "accepted" | "dismissed" }> };
let deferredPrompt: BeforeInstallEvent | null = null;
let registration: ServiceWorkerRegistration | null = null;

export function registerPwa(onUpdate?: () => void) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return () => {};
  const onInstallPrompt = (event: Event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallEvent;
  };
  const onController = () => onUpdate?.();
  window.addEventListener("beforeinstallprompt", onInstallPrompt);
  navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((r) => {
    registration = r;
    if (r.waiting) onUpdate?.();
    r.addEventListener("updatefound", () => {
      const worker = r.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) onUpdate?.();
      });
    });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", onController);
  return () => {
    window.removeEventListener("beforeinstallprompt", onInstallPrompt);
    navigator.serviceWorker.removeEventListener("controllerchange", onController);
  };
}

export function canInstallPwa() { return Boolean(deferredPrompt); }
export async function installPwa() {
  if (!deferredPrompt?.prompt) return false;
  await deferredPrompt.prompt();
  const outcome = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return outcome?.outcome === "accepted";
}

export function hasWaitingUpdate() { return Boolean(registration?.waiting); }
export function applyPwaUpdate() {
  registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
}
export function pwaStatus(): PwaStatus {
  return {
    installed: typeof window !== "undefined" && window.matchMedia?.("(display-mode: standalone)").matches === true,
    updateAvailable: hasWaitingUpdate(),
    online: typeof navigator !== "undefined" ? navigator.onLine : true,
  };
}
