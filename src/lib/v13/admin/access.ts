import { getPrisma } from "@/lib/db";

/**
 * Server-side admin authorization.
 *
 * ADMIN_EMAIL is the bootstrap/admin identity configured by the deployer.
 * It is intentionally read from the server environment so admin identity is
 * never exposed as a client-side setting.
 *
 * Do not use GitHub repository ownership as app authorization.
 */
function configuredAdminEmail(): string | null {
  const value = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return value || null;
}

export async function isAdminUser(userId?: string | null): Promise<boolean> {
  if (!userId) return false;

  const adminEmail = configuredAdminEmail();
  if (!adminEmail) return false;

  try {
    const db = getPrisma();
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    return Boolean(user?.email && String(user.email).trim().toLowerCase() === adminEmail);
  } catch {
    // Fail closed: a database/auth lookup failure must never grant admin access.
    return false;
  }
}

export async function verifyAdminAccess(userId?: string | null): Promise<boolean> {
  return isAdminUser(userId);
}

export async function checkAdminRole(userId?: string | null): Promise<boolean> {
  return isAdminUser(userId);
}

/**
 * Compatibility export for legacy callers.
 * Prefer isAdminUser/verifyAdminAccess/checkAdminRole in server code.
 */
export const adminAccess = {
  isAdminUser,
  verifyAdminAccess,
  checkAdminRole,
};

export default adminAccess;
