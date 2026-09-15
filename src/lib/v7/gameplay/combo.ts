/** V7 domain module: gameplay/combo. */
export type ComboId = string;
export interface ComboRecord { id: ComboId; createdAt: number; version: number }
export function createCombo(id: ComboId): ComboRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCombo(value: unknown): value is ComboRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
