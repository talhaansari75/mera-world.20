#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const c=new Client({connectionString:url}); await c.connect();
try{
 const roles=await c.query(`select r.name, count(rp.permission_id)::int permissions from roles r left join role_permissions rp on rp.role_id=r.id group by r.name order by r.name`);
 const required=['admin.audit','creator.publish','creator.moderate','multiplayer.host','profile.read','profile.write'];
 const missing=[]; for(const name of required){const x=await c.query(`select count(*)::int n from permissions where name=$1`,[name]); if(!x.rows[0].n) missing.push(name)}
 if(missing.length) throw new Error(`missing permission definitions: ${missing.join(', ')}`);
 console.log(JSON.stringify({rbac:{roles:roles.rows,requiredPermissions:required}},null,2)); console.log('[rbac-audit] PASS — persistent role/permission graph contains all required policy capabilities.');
} finally { await c.end(); }
