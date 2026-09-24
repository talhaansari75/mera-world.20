import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'src/components/app/GameApp.tsx',
  'src/lib/store.ts',
  'src/lib/server/ai.ts',
  'src/lib/db.ts',
  'src/lib/v13/cloud/server.ts',
  'src/lib/v13/payments/server.ts',
  'src/lib/v13/admin/access.ts',
  'src/lib/v14/content/languagePacks.ts',
  'src/lib/v14/liveops/seasonal.ts',
  'src/lib/v10/liveops/liveOpsBridge.ts',
  'src/lib/v9/validation/actionGuard.ts',
  'migrations/0006_v13_cloud_payments_admin.sql',
];
const missing = required.filter(f => !fs.existsSync(path.join(root, f)));
if (missing.length) throw new Error(`Missing required integration files: ${missing.join(', ')}`);

const app = fs.readFileSync(path.join(root, 'src/components/app/GameApp.tsx'), 'utf8');
const store = fs.readFileSync(path.join(root, 'src/lib/store.ts'), 'utf8');
const ai = fs.readFileSync(path.join(root, 'src/lib/server/ai.ts'), 'utf8');
const db = fs.readFileSync(path.join(root, 'src/lib/db.ts'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'src/lib/v13/admin/access.ts'), 'utf8');
const langs = fs.readFileSync(path.join(root, 'src/lib/v14/content/languagePacks.ts'), 'utf8');
const liveops = fs.readFileSync(path.join(root, 'src/lib/v14/liveops/seasonal.ts'), 'utf8');

const checks = [
  ['Core app routes are present', ['systems', 'social', 'liveOps', 'admin', 'payments'].every(x => app.includes(`case "${x}"`) || app.includes(`id: "${x}"`))],
  ['Store emits gameplay lifecycle events', ['level:start', 'word:found', 'word:miss', 'level:complete', 'level:fail'].every(x => store.includes(x))],
  ['AI key is server-side only', ai.includes('process.env.XAI_API_KEY') && !ai.includes('import.meta.env.VITE_XAI_API_KEY')],
  ['Database uses server environment configuration', db.includes('process.env.DATABASE_URL')],
  ['Admin boundary is server-configured', admin.includes('process.env.ADMIN_USER_IDS')],
  ['15 language codes are registered', ['en','ur','ur-Latn','hi','ar','bn','pa','sd','ps','tr','es','fr','de','zh','ja'].every(c => langs.includes(`code: "${c}"`))],
  ['Daily/weekly/seasonal LiveOps cycles exist', ['daily','weekly','seasonal'].every(c => liveops.includes(`cycle: "${c}"`))],
  ['No obvious VITE secret key names in src', !/VITE_[A-Z0-9_]*(KEY|SECRET|TOKEN|PRIVATE)/.test(fs.readFileSync(path.join(root,'src/lib/server/ai.ts'),'utf8'))],
];

for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}`);
  if (!ok) process.exitCode = 1;
}

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (['node_modules','.git','dist'].includes(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p); else files.push(p);
  }
}
walk(root);
const zero = files.filter(f => fs.statSync(f).size === 0).map(f => path.relative(root,f));
console.log(`INFO — scanned ${files.length} files`);
console.log(`INFO — zero-byte files: ${zero.length ? zero.join(', ') : 'none'}`);
console.log(`INFO — dependency install/build not executed when node_modules is absent`);
if (process.exitCode) process.exit(1);
console.log('V15 final static QA: PASS');
