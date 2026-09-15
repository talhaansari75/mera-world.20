#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const c=new Client({connectionString:url}); await c.connect();
try{
 const r=await c.query(`select count(*)::int connections from pg_stat_activity where datname=current_database()`);
 const slow=await c.query(`select count(*)::int n from pg_stat_activity where state='active' and now()-query_start > interval '5 seconds'`);
 const locks=await c.query(`select count(*)::int n from pg_locks where not granted`);
 const payload={at:new Date().toISOString(),database:(await c.query('select current_database()')).rows[0].current_database,connections:r.rows[0].connections,slowQueries:slow.rows[0].n,waitingLocks:locks.rows[0].n};
 console.log(JSON.stringify({observability:payload}));
 if(payload.slowQueries>0 && process.env.FAIL_ON_SLOW_QUERIES==='true') throw new Error(`slow queries detected: ${payload.slowQueries}`);
 if(payload.waitingLocks>0 && process.env.FAIL_ON_WAITING_LOCKS==='true') throw new Error(`waiting locks detected: ${payload.waitingLocks}`);
 console.log('[observability] PASS — DB health snapshot collected.');
} finally { await c.end(); }
