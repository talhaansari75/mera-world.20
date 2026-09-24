import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export const CURRENT_LEGAL_VERSION = "2026-09-16";

export const getLegalConsent = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();

    const rows = await sql.query<{ version: string }>(
      `select version
       from legal_consents
       where user_id = $1 and version = $2
       limit 1`,
      [context.userId, CURRENT_LEGAL_VERSION],
    );

    return {
      accepted: rows.length > 0,
      version: CURRENT_LEGAL_VERSION,
    };
  });

export const acceptLegalConsent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();

    await sql.query(
      `insert into legal_consents (user_id, version)
       values ($1, $2)
       on conflict (user_id, version) do nothing`,
      [context.userId, CURRENT_LEGAL_VERSION],
    );

    return {
      accepted: true,
      version: CURRENT_LEGAL_VERSION,
    };
  });
