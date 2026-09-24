#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const c=new Client({connectionString:url}); await c.connect();
const requiredTables=['user','session','account','verification','player_saves','leaderboard_scores','daily_results','idempotency_keys','rate_limit_buckets','audit_events','gameplay_events','multiplayer_rooms','multiplayer_members','moderation_reports','purchase_receipts','entitlements','creator_puzzles','creator_reviews','push_subscriptions','roles','permissions','role_permissions','user_roles','admin_audit_notes'];
try{
 const t=await c.query(`select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'`);
 const have=new Set(t.rows.map(r=>r.table_name)); const missing=requiredTables.filter(x=>!have.has(x)); if(missing.length) throw new Error(`missing tables: ${missing.join(', ')}`);
 const checks=await c.query(`select conrelid::regclass::text table_name, conname from pg_constraint where contype='c' and conname like '%_chk' order by 1,2`);
 if(checks.rowCount<8) throw new Error(`expected business check constraints, found ${checks.rowCount}`);
 const indexes=await c.query(`select count(*)::int count from pg_indexes where schemaname='public'`); if(indexes.rows[0].count<15) throw new Error('unexpectedly low index count');
 console.log(`[production-assertions] PASS — ${have.size} tables, ${checks.rowCount} check constraints, ${indexes.rows[0].count} indexes.`);
} finally { await c.end(); }
