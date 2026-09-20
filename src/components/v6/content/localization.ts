/** V6 platform module: content/localization. */

export type LocalizationId = string;

export interface LocalizationRecord {
  id: LocalizationId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createLocalizationId(prefix = "localization"): LocalizationId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isLocalizationRecord(value: unknown): value is LocalizationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
