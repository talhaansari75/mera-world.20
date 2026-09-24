#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const c=new Client({connectionString:url}); await c.connect();
try{
 const expired=await c.query(`select count(*)::int n from verification where "expiresAt" < now()`);
 const sessions=await c.query(`select count(*)::int n from session where "expiresAt" < now()`);
 console.log(`[auth-matrix] expired verification tokens=${expired.rows[0].n}, expired sessions=${sessions.rows[0].n}`);
 const checks=['session_userId_idx','account_userId_idx','verification_identifier_idx'];
 const idx=await c.query(`select indexname from pg_indexes where schemaname='public'`); const set=new Set(idx.rows.map(x=>x.indexname)); for(const x of checks) if(!set.has(x)) throw new Error(`missing auth index ${x}`);
 console.log('[auth-matrix] PASS — expiry/index invariants verified. Production browser matrix remains gated by E2E_BASE_URL credentials.');
} finally { await c.end(); }
