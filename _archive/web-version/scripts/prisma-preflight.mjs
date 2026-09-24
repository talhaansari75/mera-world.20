#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
let parsed; try{parsed=new URL(url)}catch{throw new Error('DATABASE_URL is not a valid URL')}
if(!['postgresql:','postgres:'].includes(parsed.protocol))throw new Error('DATABASE_URL must use PostgreSQL');
if(process.env.NODE_ENV==='production' && parsed.searchParams.get('sslmode')!=='require' && parsed.searchParams.get('sslmode')!=='verify-ca' && parsed.searchParams.get('sslmode')!=='verify-full') throw new Error('Production DATABASE_URL must explicitly require TLS (sslmode=require, verify-ca, or verify-full).');
if(process.env.NODE_ENV==='production' && process.env.ALLOW_PRODUCTION_MIGRATION!=='true') throw new Error('Production migration requires ALLOW_PRODUCTION_MIGRATION=true in the dedicated migration stage.');
const npx=process.platform==='win32'?'npx.cmd':'npx';
const r=spawnSync(npx,['prisma','validate'],{encoding:'utf8',stdio:'inherit'}); if(r.status!==0)process.exit(r.status??1);
console.log('[prisma-preflight] PASS — PostgreSQL URL/TLS and Prisma schema validated.');
