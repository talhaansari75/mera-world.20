/** V6 platform module: platform/crash-reporting. */

export type CrashReportingId = string;

export interface CrashReportingRecord {
  id: CrashReportingId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createCrashReportingId(prefix = "crash_reporting"): CrashReportingId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isCrashReportingRecord(value: unknown): value is CrashReportingRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
