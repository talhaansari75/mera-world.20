/** V6 platform module: api/contracts. */

export type ContractsId = string;

export interface ContractsRecord {
  id: ContractsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createContractsId(prefix = "contracts"): ContractsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isContractsRecord(value: unknown): value is ContractsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
