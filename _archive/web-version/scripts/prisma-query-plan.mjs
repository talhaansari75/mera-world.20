#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim();if(!url)throw new Error('DATABASE_URL is required');
const c=new Client({connectionString:url});await c.connect();
const queries=[
 ['leaderboard','EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id FROM leaderboard_scores WHERE board=$1 ORDER BY score DESC, created_at ASC LIMIT 50'],
 ['daily','EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT user_id FROM daily_results WHERE day_key=$1 ORDER BY score DESC, time_ms ASC LIMIT 50'],
 ['gameplay','EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id FROM gameplay_events WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50'],
 ['audit','EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id FROM audit_events WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50'],
 ['purchases','EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id FROM purchase_receipts WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50'],
 ['creator','EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT id FROM creator_puzzles WHERE user_id=$1 ORDER BY updated_at DESC LIMIT 50'],
 ['room','EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) SELECT room_id FROM multiplayer_rooms WHERE status=$1 ORDER BY updated_at DESC LIMIT 50'],
];
try{for(const [name,q] of queries){const r=await c.query(q,name==='room'?['open']:['__probe__']);const plan=r.rows[0]['QUERY PLAN'][0];const text=JSON.stringify(plan);if(text.includes('Seq Scan')&&process.env.REJECT_SEQ_SCAN==='true')throw new Error(`${name}: sequential scan detected`);console.log(`[query-plan] ${name}: ${plan.Plan['Node Type']}, actualRows=${plan.Plan['Actual Rows']}, buffers=${plan.Plan['Shared Read Blocks']??0}+${plan.Plan['Shared Hit Blocks']??0}`)}console.log('[query-plan] PASS — ANALYZE/BUFFERS plans captured for representative production paths.');}finally{await c.end()}
