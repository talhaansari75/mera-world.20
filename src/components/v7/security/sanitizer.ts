/** V7 domain module: security/sanitizer. */
export type SanitizerId = string;
export interface SanitizerRecord { id: SanitizerId; createdAt: number; version: number }
export function createSanitizer(id: SanitizerId): SanitizerRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidSanitizer(value: unknown): value is SanitizerRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
