/** V7 domain module: content/content-hash. */
export type ContentHashId = string;
export interface ContentHashRecord { id: ContentHashId; createdAt: number; version: number }
export function createContentHash(id: ContentHashId): ContentHashRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidContentHash(value: unknown): value is ContentHashRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
