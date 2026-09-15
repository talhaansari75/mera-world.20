/** V7 domain module: notifications/preferences. */
export type PreferencesId = string;
export interface PreferencesRecord { id: PreferencesId; createdAt: number; version: number }
export function createPreferences(id: PreferencesId): PreferencesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPreferences(value: unknown): value is PreferencesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
