#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const schema=readFileSync('prisma/schema.prisma','utf8'); const sql=readFileSync('prisma/migrations/20260915020000_prisma_fresh_baseline/migration.sql','utf8'); const errors=[];
const modelBlocks=[...schema.matchAll(/model\s+\w+\s*\{([\s\S]*?)\n\}/g)].map(m=>m[1]);
const expected=modelBlocks.flatMap(b=>{const m=b.match(/@@map\("([^"]+)"\)/);return m?[m[1]]:[]}); for(const table of expected) if(!new RegExp(`CREATE TABLE\\s+(?:IF NOT EXISTS\\s+)?"?${table}"?\\s*\\(`,'i').test(sql)) errors.push(`missing CREATE TABLE for ${table}`);
if(!/player_saves\s*\([\s\S]*?revision\s+bigint/i.test(sql)) errors.push('player_saves.revision is not created in baseline');
if(!/CREATE TABLE\s+push_subscriptions\s*\([\s\S]*?subscription_json/i.test(sql)) errors.push('push_subscriptions definition incomplete');
for(const token of ['ALTER TABLE player_saves ADD COLUMN revision','CREATE UNIQUE INDEX account_user_provider_account_uidx']) if(sql.includes(token)) errors.push(`forbidden duplicate/redundant baseline statement: ${token}`);
const enumMaps=[['GameMode','game_mode'],['IdempotencyStatus','idempotency_status'],['MultiplayerRoomStatus','multiplayer_room_status'],['MultiplayerMemberRole','multiplayer_member_role'],['ModerationReportStatus','moderation_report_status'],['PurchaseStatus','purchase_status'],['Currency','currency_code'],['EntitlementSource','entitlement_source'],['CreatorPuzzleStatus','creator_puzzle_status']];
for(const [name,dbType] of enumMaps){if(!new RegExp(`CREATE TYPE ${dbType} AS ENUM`,'i').test(sql)) errors.push(`missing PostgreSQL enum type ${dbType}`);}
const fkNames=[...sql.matchAll(/CONSTRAINT\s+([A-Za-z0-9_]+)\s+FOREIGN KEY/gi)].map(m=>m[1]); for(const n of new Set(fkNames)) if(fkNames.filter(x=>x===n).length>1) errors.push(`duplicate FK ${n}`);
if(errors.length){console.error('[migration-structure] FAIL\n'+errors.join('\n'));process.exit(1)}
console.log(`[migration-structure] PASS — ${expected.length} Prisma-mapped tables have concrete baseline CREATE TABLE definitions and critical DDL duplication checks passed.`);
