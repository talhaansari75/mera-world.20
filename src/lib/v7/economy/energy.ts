/** V7 domain module: economy/energy. */
export type EnergyId = string;
export interface EnergyRecord { id: EnergyId; createdAt: number; version: number }
export function createEnergy(id: EnergyId): EnergyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidEnergy(value: unknown): value is EnergyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
