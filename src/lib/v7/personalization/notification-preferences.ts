/** V7 domain module: personalization/notification-preferences. */
export type NotificationPreferencesId = string;
export interface NotificationPreferencesRecord { id: NotificationPreferencesId; createdAt: number; version: number }
export function createNotificationPreferences(id: NotificationPreferencesId): NotificationPreferencesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidNotificationPreferences(value: unknown): value is NotificationPreferencesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
