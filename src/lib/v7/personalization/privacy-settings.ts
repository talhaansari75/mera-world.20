/** V7 domain module: personalization/privacy-settings. */
export type PrivacySettingsId = string;
export interface PrivacySettingsRecord { id: PrivacySettingsId; createdAt: number; version: number }
export function createPrivacySettings(id: PrivacySettingsId): PrivacySettingsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidPrivacySettings(value: unknown): value is PrivacySettingsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
