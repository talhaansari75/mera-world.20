#!/usr/bin/env node
/** Safe operational cleanup. Audit/payment/V5 data is never deleted by this command. */
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim();if(!url)throw new Error('DATABASE_URL is required');
const days=Number(process.env.GAMEPLAY_EVENT_RETENTION_DAYS||90), idem=Number(process.env.IDEMPOTENCY_RETENTION_DAYS||30), session=Number(process.env.SESSION_RETENTION_DAYS||30), verification=Number(process.env.VERIFICATION_RETENTION_DAYS||7);
for(const [n,v,min] of [['gameplay',days,7],['idempotency',idem,7],['session',session,7],['verification',verification,1]])if(!Number.isInteger(v)||v<min)throw new Error(`${n} retention is below safety minimum`);
const c=new Client({connectionString:url});await c.connect();
try{
 const counts={
  gameplay: (await c.query(`select count(*)::int n from gameplay_events where created_at < now()-make_interval(days=>$1)`,[days])).rows[0].n,
  idempotency: (await c.query(`select count(*)::int n from idempotency_keys where created_at < now()-make_interval(days=>$1) and status='completed'`,[idem])).rows[0].n,
  session: (await c.query(`select count(*)::int n from session where "expiresAt" < now()-make_interval(days=>$1)`,[session])).rows[0].n,
  verification: (await c.query(`select count(*)::int n from verification where "expiresAt" < now()-make_interval(days=>$1)`,[verification])).rows[0].n,
 };
 console.log(JSON.stringify({dryRun:process.env.RETENTION_EXECUTE!=='true',counts,neverDelete:['audit_events','purchase_receipts','game_sessions_v5','reward_ledger_v5','analytics_events_v5','multiplayer_rooms_v5','payment_events_v5','audit_events_v5','moderation_cases_v5']},null,2));
 if(process.env.RETENTION_EXECUTE!=='true'){console.log('[retention-cleanup] DRY RUN — set RETENTION_EXECUTE=true in an approved maintenance job to delete eligible operational rows.');} else {
 await c.query('BEGIN');
 await c.query(`delete from gameplay_events where created_at < now()-make_interval(days=>$1)`,[days]);
 await c.query(`delete from idempotency_keys where created_at < now()-make_interval(days=>$1) and status='completed'`,[idem]);
 await c.query(`delete from session where "expiresAt" < now()-make_interval(days=>$1)`,[session]);
 await c.query(`delete from verification where "expiresAt" < now()-make_interval(days=>$1)`,[verification]);
 await c.query('COMMIT');console.log('[retention-cleanup] PASS — approved operational cleanup completed.');
 }
}catch(e){await c.query('ROLLBACK').catch(()=>{});throw e}finally{await c.end()}
