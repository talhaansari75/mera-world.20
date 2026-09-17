import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getPrisma, getSql } from "@/lib/db";
import { requirePermission } from "@/lib/security/authorization.server";

async function requireAdmin(userId: string) {
  await requirePermission(userId, "admin.audit");
}

/* ---------------- Dashboard ---------------- */

export const getAdminSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);

    const db = getPrisma();

    const [
      users,
      events,
      rooms,
      reports,
      purchases,
      entitlements,
    ] = await Promise.all([
      db.gameplayEvent.findMany({
        distinct: ["userId"],
        where: { userId: { not: null } },
        select: { userId: true },
      }),
      db.gameplayEvent.count({
        where: {
          createdAt: {
            gt: new Date(Date.now() - 86400000),
          },
        },
      }),
      db.multiplayerRoom.count({
        where: { status: "open" },
      }),
      db.moderationReport.count({
        where: { status: "open" },
      }),
      db.purchaseReceipt.count({
        where: { status: "verified" },
      }),
      db.entitlement.count({
        where: { active: true },
      }),
    ]);

    return {
      ok: true as const,
      usersSeen: users.length,
      events24h: events,
      openRooms: rooms,
      openReports: reports,
      verifiedPurchases: purchases,
      activeEntitlements: entitlements,
    };
  });

/* ---------------- Users ---------------- */

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);

    const sql = await getSql();

    return await sql.query<{
      id: string;
      email: string;
      name: string;
      username: string | null;
      roleId: string | null;
      roleName: string | null;
    }>(
      `
      select
        u.id,
        u.email,
        u.name,
        u.username,
        r.id as "roleId",
        r.name as "roleName"
      from "user" u
      left join user_roles ur
        on ur.user_id = u.id
      left join roles r
        on r.id = ur.role_id
      order by u."createdAt" desc
      limit 500
      `,
      [],
    );
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      userId: string;
      roleId: string | null;
    }) => ({
      userId: String(d.userId ?? ""),
      roleId: d.roleId === null ? null : String(d.roleId ?? ""),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);

    if (!data.userId) {
      throw new Error("User ID is required");
    }

    const sql = await getSql();

    await sql.query(
      `delete from user_roles where user_id = $1`,
      [data.userId],
    );

    if (data.roleId) {
      const role = await sql.query<{ id: string }>(
        `select id from roles where id = $1 limit 1`,
        [data.roleId],
      );

      if (!role.length) {
        throw new Error("Role not found");
      }

      await sql.query(
        `
        insert into user_roles(user_id, role_id)
        values ($1, $2)
        on conflict do nothing
        `,
        [data.userId, data.roleId],
      );
    }

    return { ok: true as const };
  });

/* ---------------- Roles ---------------- */

export const getAdminRoles = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);

    const sql = await getSql();

    return await sql.query<{
      id: string;
      name: string;
    }>(
      `
      select id, name
      from roles
      order by name asc
      `,
      [],
    );
  });

export const createAdminRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      id: string;
      name: string;
    }) => ({
      id: String(d.id ?? "")
        .trim()
        .toLowerCase()
        .slice(0, 64),

      name: String(d.name ?? "")
        .trim()
        .slice(0, 100),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);

    if (!data.id || !data.name) {
      throw new Error("Role ID and name are required");
    }

    const sql = await getSql();

    await sql.query(
      `
      insert into roles(id, name)
      values ($1, $2)
      `,
      [data.id, data.name],
    );

    return {
      ok: true as const,
      id: data.id,
      name: data.name,
    };
  });

/* ---------------- Permissions ---------------- */

export const getAdminPermissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);

    const sql = await getSql();

    return await sql.query<{
      id: string;
      name: string;
      description: string;
    }>(
      `
      select id, name, description
      from permissions
      order by name asc
      `,
      [],
    );
  });

export const getRolePermissions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    (d: { roleId: string }) => ({
      roleId: String(d.roleId ?? ""),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);

    if (!data.roleId) {
      throw new Error("Role ID is required");
    }

    const sql = await getSql();

    return await sql.query<{
      permissionId: string;
    }>(
      `
      select permission_id as "permissionId"
      from role_permissions
      where role_id = $1
      `,
      [data.roleId],
    );
  });

export const setRolePermission = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      roleId: string;
      permissionId: string;
      enabled: boolean;
    }) => ({
      roleId: String(d.roleId ?? ""),
      permissionId: String(d.permissionId ?? ""),
      enabled: Boolean(d.enabled),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);

    if (!data.roleId || !data.permissionId) {
      throw new Error("Role and permission are required");
    }

    const sql = await getSql();

    if (data.enabled) {
      await sql.query(
        `
        insert into role_permissions(role_id, permission_id)
        values ($1, $2)
        on conflict do nothing
        `,
        [data.roleId, data.permissionId],
      );
    } else {
      await sql.query(
        `
        delete from role_permissions
        where role_id = $1
          and permission_id = $2
        `,
        [data.roleId, data.permissionId],
      );
    }

    return { ok: true as const };
  });

/* ---------------- Audit ---------------- */

export const writeAdminNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      action: string;
      target?: string;
      note?: string;
    }) => ({
      action: String(d.action ?? "").slice(0, 64),
      target: String(d.target ?? "").slice(0, 128),
      note: String(d.note ?? "").slice(0, 1000),
    }),
  )
  .handler(async ({ context, data }) => {
    await requireAdmin(context.userId);

    await getPrisma().adminAuditNote.create({
      data: {
        adminUserId: context.userId,
        action: data.action,
        target: data.target,
        note: data.note,
      },
    });

    return { ok: true as const };
  });
