#!/usr/bin/env node
import { Client } from 'pg';
const url=process.env.DATABASE_URL?.trim();if(!url)throw new Error('DATABASE_URL is required');
const c=new Client({connectionString:url});await c.connect();
try{
 const role=(await c.query(`select current_user,current_database()`)).rows[0].current_user;
 const r=(await c.query(`select rolcreatedb,rolcreaterole,rolsuper,rolreplication,rolbypassrls,rolinherit from pg_roles where rolname=$1`,[role])).rows[0];
 if(!r)throw new Error('current role not found');
 const schema=(await c.query(`select has_schema_privilege($1,'public','CREATE') create_priv,has_schema_privilege($1,'public','USAGE') usage_priv`,[role])).rows[0];
 const seq=(await c.query(`select count(*)::int n from pg_class s join pg_namespace n on n.oid=s.relnamespace where s.relkind='S' and n.nspname='public' and has_sequence_privilege($1,s.oid,'USAGE')`,[role])).rows[0].n;
 const exec=(await c.query(`select count(*)::int n from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and has_function_privilege($1,p.oid,'EXECUTE')`,[role])).rows[0].n;
 const createDefaults=await c.query(`select coalesce(array_agg(privilege_type order by privilege_type),'{}') privileges from information_schema.role_table_grants where grantee=$1 and table_schema='public' and table_name='__nonexistent__'`,[role]);
 const owned=(await c.query(`select count(*)::int n from pg_class x join pg_namespace n on n.oid=x.relnamespace where n.nspname='public' and x.relowner=(select oid from pg_roles where rolname=$1)`,[role])).rows[0].n;
 const elevated=Boolean(r.rolsuper||r.rolcreaterole||r.rolcreatedb||r.rolreplication||r.rolbypassrls||schema.create_priv);
 if(process.env.NODE_ENV==='production'&&elevated)throw new Error(`application role ${role} is elevated (super=${r.rolsuper},createRole=${r.rolcreaterole},createDB=${r.rolcreatedb},replication=${r.rolreplication},bypassRLS=${r.rolbypassrls},schemaCreate=${schema.create_priv})`);
 console.log(JSON.stringify({role,clusterPrivileges:r,schema,sequenceUsageCount:seq,functionExecuteCount:exec,ownedPublicObjects:owned,defaultPrivilegeProbe:createDefaults.rows[0]},null,2));
 console.log('[privilege-audit] PASS — cluster/schema/sequence/function/ownership privilege surface inspected. Production must use a separate migration owner/role and a non-owner application role.');
}finally{await c.end()}
