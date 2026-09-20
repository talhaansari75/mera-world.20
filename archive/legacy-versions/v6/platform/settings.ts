/** V6 platform module: platform/settings. */

export type SettingsId = string;

export interface SettingsRecord {
  id: SettingsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createSettingsId(prefix = "settings"): SettingsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isSettingsRecord(value: unknown): value is SettingsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
