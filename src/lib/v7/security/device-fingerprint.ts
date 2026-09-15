/** V7 domain module: security/device-fingerprint. */
export type DeviceFingerprintId = string;
export interface DeviceFingerprintRecord { id: DeviceFingerprintId; createdAt: number; version: number }
export function createDeviceFingerprint(id: DeviceFingerprintId): DeviceFingerprintRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDeviceFingerprint(value: unknown): value is DeviceFingerprintRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
