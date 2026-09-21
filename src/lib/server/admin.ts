import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { isAdminUser } from "@/lib/v13/admin/access";

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!(await isAdminUser(context.userId))) {
      throw new Error("Forbidden: admin access required");
    }

    const db = getPrisma();
    const [users, sessions, reports, puzzles] = await Promise.all([
      db.user.count(),
      db.gameSessionV5.count(),
      db.moderationReport.count(),
      db.creatorPuzzle.count(),
    ]);

    return {
      ok: true as const,
      adminEmail: process.env.ADMIN_EMAIL?.trim() ?? "",
      users,
      sessions,
      reports,
      puzzles,
    };
  });
