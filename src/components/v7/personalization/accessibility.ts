/** V7 domain module: personalization/accessibility. */
export type AccessibilityId = string;
export interface AccessibilityRecord { id: AccessibilityId; createdAt: number; version: number }
export function createAccessibility(id: AccessibilityId): AccessibilityRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAccessibility(value: unknown): value is AccessibilityRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
