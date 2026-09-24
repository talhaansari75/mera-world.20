export type ModManifest = { id: string; version: string; gameVersion: string; permissions: string[] };
const ALLOWED = new Set(['content.read', 'content.add', 'theme.add']);
export function validateModManifest(m: ModManifest) {
  return Boolean(m.id && m.version && m.gameVersion) && m.permissions.every((p) => ALLOWED.has(p));
}
export function sanitizeCreatorText(value: string) {
  return value.replace(/[<>]/g, '').slice(0, 5000);
}
