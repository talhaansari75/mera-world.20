
import { getPrisma } from "@/lib/db";

const LEASE_MS = 30_000;
const WAIT_MS = 100;
const WAIT_LIMIT = 300;

/**
 * Exactly-once execution for a single (user,key,operation) while the process is
 * healthy. A unique row is claimed before fn() runs; concurrent callers wait
 * for the winner's completed result instead of executing fn() twice.
 */
export async function withIdempotency<T>(
  userId: string,
  key: string,
  operation: string,
  fn: () => Promise<T>,
): Promise<T> {
  const safeKey = String(key).trim().slice(0, 128);
  if (!safeKey) return fn();
  const db = getPrisma();
  const now = new Date();
  let owner = false;

  try {
    await db.idempotencyKey.create({
      data: { userId, key: safeKey, operation, responseJson: {}, status: "pending", lockedAt: now },
    });
    owner = true;
  } catch (error) {
    if ((error as { code?: string })?.code !== "P2002") throw error;
  }

  if (!owner) {
    for (let attempt = 0; attempt < WAIT_LIMIT; attempt++) {
      const existing = await db.idempotencyKey.findUnique({
        where: { userId_key: { userId, key: safeKey } },
        select: { operation: true, responseJson: true, status: true, lockedAt: true },
      });
      if (!existing) break;
      if (existing.operation !== operation) throw new Error("idempotency_key_conflict");
      if (existing.status === "completed") return existing.responseJson as T;
      // Never steal a pending claim automatically. The callback may have external side effects,
      // so a lease timeout cannot prove that the previous owner stopped. Recovery is explicit.
      await new Promise((resolve) => setTimeout(resolve, WAIT_MS));
    }
    if (!owner) throw new Error("idempotency_in_progress");
  }

  const result = await fn();
  await db.idempotencyKey.update({
    where: { userId_key: { userId, key: safeKey } },
    data: { operation, responseJson: result as any, status: "completed", lockedAt: null },
  });
  return result;
}
