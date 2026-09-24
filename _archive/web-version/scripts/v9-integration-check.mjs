import fs from 'node:fs';
const files = ['src/lib/store.ts','src/lib/v9/integration/gameplayBridge.ts','src/lib/v9/validation/actionGuard.ts','src/components/app/GameApp.tsx'];
const missing = files.filter((f) => !fs.existsSync(f));
if (missing.length) throw new Error(`Missing: ${missing.join(', ')}`);
const store = fs.readFileSync(files[0], 'utf8');
for (const token of ['installV9Integrations','validatePathInput','acceptAction','level:start']) if (!store.includes(token)) throw new Error(`store not wired: ${token}`);
console.log('V9 integration static check: PASS');
