/** V6 platform module: platform/privacy. */

export type PrivacyId = string;

export interface PrivacyRecord {
  id: PrivacyId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createPrivacyId(prefix = "privacy"): PrivacyId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isPrivacyRecord(value: unknown): value is PrivacyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
