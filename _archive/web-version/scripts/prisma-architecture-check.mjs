#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const roots=['src']; const banned=["$queryRawUnsafe","getSql"];
function walk(dir){for(const n of readdirSync(dir)){const p=join(dir,n);const st=statSync(p);if(st.isDirectory())walk(p);else if(/\.(ts|tsx|mjs)$/.test(n)){const s=readFileSync(p,'utf8');if(/\$queryRawUnsafe\b|\bgetSql\s*\(/.test(s)&&!p.endsWith('prisma-architecture-check.mjs')){console.error(`[prisma-architecture] forbidden SQL facade in ${p}`);process.exitCode=1}}}}
for(const r of roots)walk(r);if(process.exitCode)process.exit(1);console.log('[prisma-architecture] PASS — no $queryRawUnsafe/getSql persistence facade in application source.');
