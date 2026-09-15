/** V7 domain module: gameplay/grid. */
export type GridId = string;
export interface GridRecord { id: GridId; createdAt: number; version: number }
export function createGrid(id: GridId): GridRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidGrid(value: unknown): value is GridRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
