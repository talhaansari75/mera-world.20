export function normalizeText(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.normalize('NFKC').trim().slice(0, max) : '';
}
export function safeId(value: unknown, max = 80): string | null {
  const s = normalizeText(value, max);
  return /^[A-Za-z0-9._:-]+$/.test(s) ? s : null;
}
export function assertFiniteInt(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) throw new Error('invalid_integer');
  return value;
}
