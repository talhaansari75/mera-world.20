import { getPushConfig, removePushSubscription, savePushSubscription } from "./push";

export async function enablePushNotifications(): Promise<{ ok: boolean; message: string }> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { ok: false, message: "This browser does not support web push." };
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, message: "Notification permission was not granted." };
  const config = await getPushConfig();
  if (!config.publicKey) return { ok: false, message: "Push delivery is not configured on this deployment yet." };
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription = existing ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToBytes(config.publicKey) });
  const result = await savePushSubscription({ data: { subscription: subscription.toJSON() } });
  return result.ok ? { ok: true, message: "Push notifications are enabled." } : { ok: false, message: result.error };
}

export async function disablePushNotifications(): Promise<{ ok: boolean; message: string }> {
  if (!("serviceWorker" in navigator)) return { ok: false, message: "Service workers are unavailable." };
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return { ok: true, message: "No push subscription is active." };
  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  await removePushSubscription({ data: { endpoint } });
  return { ok: true, message: "Push notifications are disabled." };
}

export async function pushState() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return "unsupported" as const;
  const subscription = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
  return subscription ? "enabled" as const : "disabled" as const;
}

function urlBase64ToBytes(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const rawData = atob((base64String + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
