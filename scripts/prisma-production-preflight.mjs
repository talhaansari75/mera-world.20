#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
const db=new PrismaClient();
try{
 const required=['DATABASE_URL','BETTER_AUTH_SECRET'];
 for(const k of required)if(!process.env[k]?.trim())throw new Error(`${k} is required in production`);
 if(process.env.NODE_ENV==='production'&&process.env.BETTER_AUTH_SECRET.trim().length<32)throw new Error('BETTER_AUTH_SECRET must be at least 32 characters in production');
 const url=new URL(process.env.DATABASE_URL); if(!['require','verify-ca','verify-full'].includes(url.searchParams.get('sslmode')||'') && process.env.ALLOW_INSECURE_TEST_DB!=='true')throw new Error('Production DATABASE_URL must specify sslmode=require, verify-ca, or verify-full');
 const pool=Number(url.searchParams.get('connection_limit')||process.env.PRISMA_POOL_MAX||0); if(process.env.NODE_ENV==='production' && (!Number.isFinite(pool)||pool<2||pool>100)) throw new Error('Production Prisma pool must set connection_limit (or PRISMA_POOL_MAX) between 2 and 100; size it below the database connection budget.');
 await db.user.count();

 console.log('[production-preflight] PASS — secrets, TLS URL and database connectivity verified.');
}catch(e){console.error('[production-preflight] FAIL:',e?.message||e);process.exitCode=1}finally{await db.$disconnect()}
