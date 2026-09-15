/** V7 domain module: content/definitions. */
export type DefinitionsId = string;
export interface DefinitionsRecord { id: DefinitionsId; createdAt: number; version: number }
export function createDefinitions(id: DefinitionsId): DefinitionsRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDefinitions(value: unknown): value is DefinitionsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
