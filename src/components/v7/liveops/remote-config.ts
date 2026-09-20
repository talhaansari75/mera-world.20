/** V7 domain module: liveops/remote-config. */
export type RemoteConfigId = string;
export interface RemoteConfigRecord { id: RemoteConfigId; createdAt: number; version: number }
export function createRemoteConfig(id: RemoteConfigId): RemoteConfigRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidRemoteConfig(value: unknown): value is RemoteConfigRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
