/** V7 domain module: content/content-policy. */
export type ContentPolicyId = string;
export interface ContentPolicyRecord { id: ContentPolicyId; createdAt: number; version: number }
export function createContentPolicy(id: ContentPolicyId): ContentPolicyRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidContentPolicy(value: unknown): value is ContentPolicyRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
