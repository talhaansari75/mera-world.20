import { t as getPrisma } from "./prisma-u55HPJ6Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rateLimit-BmPnMSIH.js
/**
* Database-backed distributed rate limiter. The counter mutation is atomic in
* PostgreSQL, so concurrent app instances cannot all observe the same stale
* count and exceed the configured limit.
*/
async function consumeRateLimit(subject, bucket, limit, windowSeconds) {
	const db = getPrisma();
	const safeLimit = Math.max(1, Math.floor(limit));
	const resetAt = new Date(Date.now() + Math.max(1, Math.floor(windowSeconds)) * 1e3);
	const row = (await db.$queryRaw`
    INSERT INTO rate_limit_buckets(subject,bucket,count,reset_at)
    VALUES (${subject},${bucket},1,${resetAt})
    ON CONFLICT (subject,bucket) DO UPDATE
      SET count = CASE
        WHEN rate_limit_buckets.reset_at <= now() THEN 1
        WHEN rate_limit_buckets.count < ${safeLimit} THEN rate_limit_buckets.count + 1
        ELSE rate_limit_buckets.count
      END,
      reset_at = CASE
        WHEN rate_limit_buckets.reset_at <= now() THEN ${resetAt}
        ELSE rate_limit_buckets.reset_at
      END
    RETURNING count, reset_at
  `)[0];
	const count = Number(row.count);
	return {
		allowed: count <= safeLimit,
		remaining: Math.max(0, safeLimit - count),
		resetAt: row.reset_at
	};
}
//#endregion
export { consumeRateLimit as t };
