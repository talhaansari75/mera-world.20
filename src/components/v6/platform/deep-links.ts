/** V6 platform module: platform/deep-links. */

export type DeepLinksId = string;

export interface DeepLinksRecord {
  id: DeepLinksId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createDeepLinksId(prefix = "deep_links"): DeepLinksId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isDeepLinksRecord(value: unknown): value is DeepLinksRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
