import { getPrisma } from "@/lib/db";
import { isAdminUser } from "@/lib/v13/admin/access";

/** Central server-side authorization policy. Env admins are bootstrap-only; persistent RBAC is authoritative otherwise. */
export async function hasPermission(userId: string, permission: string): Promise<boolean> {
  if (!userId || !permission) return false;
  if (isAdminUser(userId)) return true;
  const db = getPrisma();
  const row = await db.userRole.findFirst({
    where: { userId, role: { permissions: { some: { permission: { name: permission } } } } },
    select: { userId: true },
  });
  return Boolean(row);
}

export async function requirePermission(userId: string, permission: string): Promise<void> {
  if (!(await hasPermission(userId, permission))) throw new Error(`Forbidden: ${permission}`);
}
