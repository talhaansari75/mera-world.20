#!/usr/bin/env node
/** Offline structural lockfile audit. CI must additionally run npm ci against the public registry. */
import { readFileSync } from 'node:fs';
const pkg=JSON.parse(readFileSync('package.json','utf8'));
const lock=JSON.parse(readFileSync('package-lock.json','utf8'));
if(lock.lockfileVersion!==3) throw new Error(`package-lock.json must use lockfileVersion 3, got ${lock.lockfileVersion}`);
if(lock.packages?.['']?.name!==pkg.name) throw new Error('root package name mismatch');
const wanted={...pkg.dependencies,...pkg.devDependencies,...pkg.optionalDependencies};
const missing=[];
for(const [name,range] of Object.entries(wanted)){
 const key=`node_modules/${name}`;
 const entry=lock.packages?.[key];
 if(!entry?.version) missing.push(`${name}: missing resolved version`);
 if(!entry?.resolved && !entry?.link && !entry?.inBundle && !entry?.file) missing.push(`${name}: missing registry resolved URL`);
 if(entry?.version && entry.version.startsWith('file:')) missing.push(`${name}: file dependency is not registry-resolvable`);
}
if(missing.length) throw new Error('Lockfile audit failed:\n'+missing.join('\n'));
console.log(`[lock-audit] PASS — npm lockfile v3 contains registry-resolvable entries for ${Object.keys(wanted).length} direct dependencies.`);
console.log('[lock-audit] NOTE — only npm ci against the public registry can prove registry availability/integrity; CI performs that gate.');
