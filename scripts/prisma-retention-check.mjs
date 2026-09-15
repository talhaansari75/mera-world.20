#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const days=Number(process.env.GAMEPLAY_EVENT_RETENTION_DAYS||90); if(!Number.isInteger(days)||days<7) throw new Error('GAMEPLAY_EVENT_RETENTION_DAYS must be >= 7');
const c=new Client({connectionString:url}); await c.connect();
try{
 await c.query(`create table if not exists operational_retention_policy (table_name text primary key, retention_days integer not null check(retention_days>=7), immutable boolean not null default false)`);
 await c.query(`insert into operational_retention_policy(table_name,retention_days,immutable) values ('gameplay_events',$1,false),('audit_events',3650,true),('purchase_receipts',2555,true),('idempotency_keys',30,false) on conflict(table_name) do update set retention_days=excluded.retention_days, immutable=excluded.immutable`,[days]);
 const r=await c.query(`select table_name,retention_days,immutable from operational_retention_policy order by table_name`); if(r.rows.some(x=>x.immutable && Number(x.retention_days)<365)) throw new Error('immutable retention policy too short');
 console.log('[retention] PASS — explicit retention policy recorded for gameplay, audit, payment, and idempotency data.');
} finally { await c.end(); }
