export function canonicalAction(action: { type: string; level?: number; at?: number; payload?: unknown }): string {
  return JSON.stringify({ type: action.type, level: action.level ?? null, at: action.at ?? null, payload: action.payload ?? null });
}
export function checksum(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16).padStart(8, "0");
}
export function signAction(action: Parameters<typeof canonicalAction>[0]): string { return checksum(canonicalAction(action)); }
