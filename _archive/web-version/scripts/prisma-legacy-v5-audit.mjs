#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const models=['GameSessionV5','RewardLedgerV5','AnalyticsEventV5','MultiplayerRoomV5','PaymentEventV5','AuditEventV5','ModerationCaseV5'];
const modelToTable={GameSessionV5:'game_sessions_v5',RewardLedgerV5:'reward_ledger_v5',AnalyticsEventV5:'analytics_events_v5',MultiplayerRoomV5:'multiplayer_rooms_v5',PaymentEventV5:'payment_events_v5',AuditEventV5:'audit_events_v5',ModerationCaseV5:'moderation_cases_v5'};
const hits=[];
function walk(dir){for(const f of readdirSync(dir)){if(['node_modules','.git','dist','build'].includes(f))continue;const p=join(dir,f), st=statSync(p);if(st.isDirectory())walk(p);else if(/\.(ts|tsx|mjs|js)$/.test(f)){const s=readFileSync(p,'utf8');for(const m of models)if(s.includes(m)||s.includes(modelToTable[m]))hits.push({model:m,file:p});}}}
walk('src');
const unique=[...new Map(hits.map(x=>[`${x.model}:${x.file}`,x])).values()];
console.log(JSON.stringify({legacyV5Models:models,applicationReferences:unique},null,2));
if(unique.length){console.error('[legacy-v5-audit] FAIL — legacy V5 references remain. Archive/drop only after each reference is migrated.');process.exit(1)}
console.log('[legacy-v5-audit] PASS — no runtime source references legacy V5 Prisma models/tables; they may remain as read-only compatibility tables until a separately approved drop migration.');
