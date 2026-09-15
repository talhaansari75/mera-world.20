const seen = new Map<string, number>();
export function acceptAction(sessionId: string, action: string, now = Date.now(), windowMs = 250) {
  const key = `${sessionId}:${action}`;
  const previous = seen.get(key);
  if (previous != null && now - previous < windowMs) return false;
  seen.set(key, now);
  if (seen.size > 2000) for (const [k, t] of seen) if (now - t > windowMs * 8) seen.delete(k);
  return true;
}
