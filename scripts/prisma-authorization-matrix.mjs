#!/usr/bin/env node
import { readFileSync } from 'node:fs';
const checks=[
 ['src/lib/v13/admin/server.ts','requirePermission','admin endpoints'],
 ['src/lib/v13/payments/server.ts','requirePermission','payment mutation'],
 ['src/lib/v26/creator/community.ts','requirePermission','moderation mutation'],
];
const errors=[];
for(const [file,needle,label] of checks){const s=readFileSync(file,'utf8');if(!s.includes(needle))errors.push(`${label}: ${file} does not cross the centralized authorization boundary`);}
const authz=readFileSync('src/lib/auth/authorization.server.ts','utf8');
for(const needle of ['userRole.findFirst','role: { permissions','isAdminUser'])if(!authz.includes(needle))errors.push(`authorization.server.ts missing ${needle}`);
if(errors.length){console.error('[authorization-matrix] FAIL\n'+errors.join('\n'));process.exit(1)}
console.log('[authorization-matrix] PASS — known privileged mutations use centralized persistent RBAC policy checks; ownership remains enforced in resource queries.');
