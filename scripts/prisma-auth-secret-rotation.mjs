#!/usr/bin/env node
/** Explicit secret-rotation operation: invalidate all existing DB sessions before/with a new secret rollout. */
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim();if(!url)throw new Error('DATABASE_URL is required');
if(process.env.AUTH_ROTATION_APPROVED!=='true')throw new Error('AUTH_ROTATION_APPROVED=true is required; this operation invalidates every active session.');
const c=new Client({connectionString:url});await c.connect();
try{const r=await c.query('delete from session');console.log(`[auth-secret-rotation] PASS — invalidated ${r.rowCount??0} existing sessions. Deploy the new BETTER_AUTH_SECRET immediately after this operation; users must sign in again.`);}finally{await c.end()}
