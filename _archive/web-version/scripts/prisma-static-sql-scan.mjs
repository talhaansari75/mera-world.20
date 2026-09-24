#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const roots=['src','scripts'];
const banned=[/\$queryRawUnsafe\b/,/\$queryRaw\b/,/\$executeRawUnsafe\b/,/\bgetSql\s*\(/];
const allow=new Set(['scripts/prisma-static-sql-scan.mjs','scripts/prisma-architecture-check.mjs','src/lib/server/v3/rateLimit.ts']); let bad=[];
function walk(dir){for(const n of readdirSync(dir)){const p=join(dir,n);const st=statSync(p);if(st.isDirectory())walk(p);else if(/\.(ts|tsx|mjs)$/.test(n)&&!allow.has(p)){const s=readFileSync(p,'utf8');for(const re of banned)if(re.test(s)){bad.push(p);break}}}}
for(const r of roots)walk(r); if(bad.length){console.error('[prisma-static-sql] REFUSED — forbidden dynamic/raw Prisma SQL API found:\n'+[...new Set(bad)].join('\n'));process.exit(1)} console.log('[prisma-static-sql] PASS — no raw/dynamic Prisma SQL API in application/scripts.');
