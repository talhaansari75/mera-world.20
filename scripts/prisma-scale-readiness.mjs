#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim();if(!url)throw new Error('DATABASE_URL is required');
const c=new Client({connectionString:url});await c.connect();
try{
 const names=['gameplay_events','audit_events','session','purchase_receipts','idempotency_keys'];
 const rows=[];for(const t of names){const r=await c.query(`select count(*)::bigint n, pg_total_relation_size($1::regclass)::bigint bytes from ${t}`,[t]);rows.push({table:t,rows:Number(r.rows[0].n),bytes:Number(r.rows[0].bytes)});}
 const threshold=Number(process.env.PARTITION_ROW_THRESHOLD||5000000);const candidates=rows.filter(x=>x.rows>=threshold).map(x=>x.table);
 console.log(JSON.stringify({threshold,rows,candidates,partitionPolicy:'Partition event-heavy tables by created_at only after sustained threshold/query-plan evidence and a reviewed migration.'},null,2));
 if(process.env.FAIL_ON_PARTITION_THRESHOLD==='true'&&candidates.length)throw new Error(`partition threshold reached: ${candidates.join(', ')}`);
 console.log('[scale-readiness] PASS — growth/partition threshold evaluated.');
}finally{await c.end()}
