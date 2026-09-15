import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('src/lib/game/languageWords.ts', 'utf8');
const body = source.replace(/^import[^\n]+\n/, '').replace(/export const NATIVE_WORDS: Record<LangCode, string\[\]>/, 'const NATIVE_WORDS').replace(/export function[\s\S]*$/m, '');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(body + '\nsandbox=NATIVE_WORDS;', sandbox);
const packs = sandbox.sandbox;
const required = ['en','ur','ur-Latn','hi','ar','bn','pa','sd','ps','tr','es','fr','de','zh','ja'];
const errors = [];
for (const lang of required) {
  const words = packs[lang];
  if (!Array.isArray(words) || words.length < 50) errors.push(`${lang}: fewer than 50 native words`);
  const seen = new Set();
  for (const w of words ?? []) {
    if (typeof w !== 'string' || !w.trim()) errors.push(`${lang}: empty/non-string token`);
    const token = w.trim();
    if (seen.has(token)) errors.push(`${lang}: duplicate ${token}`);
    seen.add(token);
    if (/\s/.test(token)) errors.push(`${lang}: whitespace in token ${token}`);
    if (/[.,!?;:'"/\\]/.test(token)) errors.push(`${lang}: punctuation in token ${token}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
const counts = Object.fromEntries(required.map((lang) => [lang, packs[lang].length]));
console.log(JSON.stringify({ ok: true, languages: required.length, totalNativeStarterTokens: required.reduce((n,l)=>n+packs[l].length,0), counts }));
console.log(`V20 language content PASS: ${required.length} languages, ${required.reduce((n,l)=>n+packs[l].length,0)} native starter tokens.`);
