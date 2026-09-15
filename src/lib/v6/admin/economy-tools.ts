/** V6 platform module: admin/economy-tools. */

export type EconomyToolsId = string;

export interface EconomyToolsRecord {
  id: EconomyToolsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createEconomyToolsId(prefix = "economy_tools"): EconomyToolsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isEconomyToolsRecord(value: unknown): value is EconomyToolsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
