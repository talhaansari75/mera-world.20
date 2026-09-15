export type ContentItem = { id: string; version: number; locale: string; words: string[]; tags: string[]; checksum?: string };

export function normalizeWord(word: string) {
  return word.normalize('NFKC').trim().toLocaleUpperCase();
}

export function validateContent(item: ContentItem) {
  const errors: string[] = [];
  if (!/^[a-z0-9._-]+$/i.test(item.id)) errors.push('invalid id');
  if (item.version < 1) errors.push('invalid version');
  if (!item.locale) errors.push('missing locale');
  const words = item.words.map(normalizeWord);
  if (new Set(words).size !== words.length) errors.push('duplicate words');
  if (words.some((w) => w.length < 2 || w.length > 40)) errors.push('word length out of range');
  return { ok: errors.length === 0, errors };
}

export function fingerprint(item: ContentItem) {
  const canonical = JSON.stringify({ id: item.id, version: item.version, locale: item.locale, words: item.words.map(normalizeWord).sort(), tags: [...item.tags].sort() });
  let h = 0;
  for (let i = 0; i < canonical.length; i++) h = Math.imul(31, h) + canonical.charCodeAt(i) | 0;
  return Math.abs(h).toString(36);
}
