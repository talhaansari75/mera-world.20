#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
if(!existsSync('prisma/schema.prisma')) throw new Error('Missing prisma/schema.prisma');
if(existsSync('package-lock.json')) console.log('[release-gate] package-lock.json present'); else console.warn('[release-gate] package-lock.json is still missing; regenerate it on a networked build runner with npm install.');
const r=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run','check:prisma'],{stdio:'inherit'});process.exit(r.status??1);
