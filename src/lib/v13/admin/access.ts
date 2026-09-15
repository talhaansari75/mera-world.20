/** Server-only admin boundary. Never expose ADMIN_USER_IDS to the browser. */
export function isAdminUser(userId: string): boolean {
  const raw = process.env.ADMIN_USER_IDS ?? "";
  return raw.split(",").map((x) => x.trim()).filter(Boolean).includes(userId);
}
