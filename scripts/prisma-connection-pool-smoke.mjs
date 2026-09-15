#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const u=new URL(url); const configured=Number(u.searchParams.get('connection_limit')||process.env.PRISMA_POOL_MAX||0);
if(process.env.NODE_ENV==='production' && (!Number.isInteger(configured)||configured<2||configured>100)) throw new Error('Production pool size must be explicitly configured between 2 and 100.');
const concurrency=Math.min(Number(process.env.POOL_SMOKE_CONNECTIONS||Math.max(2,configured||8)),32);
const clients=await Promise.all(Array.from({length:concurrency},async()=>{const c=new Client({connectionString:url});await c.connect();await c.query('select 1');return c;}));
try{console.log(`[pool-smoke] PASS — opened ${clients.length} concurrent PostgreSQL connections without exhaustion.`);}finally{await Promise.all(clients.map(c=>c.end()));}
