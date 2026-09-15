import { chooseNotifications, type NotificationCandidate } from "@/lib/notifications/smartNotifications";
import type { PlayerSave } from "@/lib/game/types";

export function notificationCandidates(save: PlayerSave, now = Date.now()): NotificationCandidate[] {
  const candidates: NotificationCandidate[] = [];
  if (save.lastDaily !== new Date(now).toISOString().slice(0, 10)) candidates.push({ id: "daily", type: "daily", priority: 100, createdAt: now });
  if (save.energy < 2) candidates.push({ id: "energy", type: "energy", priority: 70, createdAt: now });
  if (save.stats.currentStreak > 0) candidates.push({ id: "streak", type: "streak", priority: 90, createdAt: now });
  return chooseNotifications(candidates, 2);
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof Notification === "undefined") return "unsupported";
  if (Notification.permission === "granted" || Notification.permission === "denied") return Notification.permission;
  return Notification.requestPermission();
}

export function maybeNotify(save: PlayerSave) {
  if (!save.settings.notificationReminders || typeof Notification === "undefined" || Notification.permission !== "granted") return 0;
  const selected = notificationCandidates(save);
  for (const item of selected) {
    const title = item.type === "daily" ? "Daily puzzle is ready" : item.type === "energy" ? "Energy is getting low" : "Keep your streak alive";
    new Notification(title, { body: "Open Mera Word Search Journey when you're ready." });
  }
  return selected.length;
}
