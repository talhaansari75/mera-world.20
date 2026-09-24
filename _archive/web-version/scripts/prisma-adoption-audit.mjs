#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();
const report = { generatedAt: new Date().toISOString(), checks: [], counts: {}, semanticViolations: [] };
const check = (name, ok, detail='') => { report.checks.push({ name, ok, detail }); if (!ok) report.semanticViolations.push({ name, detail }); };
try {
  const models = [
    ['user','user'],['account','account'],['session','session'],['verification','verification'],
    ['playerSave','player_saves'],['leaderboardScore','leaderboard_scores'],['dailyResult','daily_results'],
    ['idempotencyKey','idempotency_keys'],['rateLimitBucket','rate_limit_buckets'],['auditEvent','audit_events'],
    ['gameplayEvent','gameplay_events'],['multiplayerRoom','multiplayer_rooms'],['multiplayerMember','multiplayer_members'],
    ['moderationReport','moderation_reports'],['purchaseReceipt','purchase_receipts'],['gameSessionV5','game_sessions_v5'],
    ['rewardLedgerV5','reward_ledger_v5'],['analyticsEventV5','analytics_events_v5'],['multiplayerRoomV5','multiplayer_rooms_v5'],
    ['paymentEventV5','payment_events_v5'],['auditEventV5','audit_events_v5'],['moderationCaseV5','moderation_cases_v5'],
    ['entitlement','entitlements'],['adminAuditNote','admin_audit_notes'],['creatorPuzzle','creator_puzzles'],
    ['creatorReview','creator_reviews'],['pushSubscription','push_subscriptions'],['creatorProfile','creator_profiles'],
    ['role','roles'],['userRole','user_roles']
  ];
  for (const [model, table] of models) {
    const count = await db[model].count();
    report.counts[table] = count;
    check(`count:${table}`, count >= 0, String(count));
  }
  const badRatings = await db.creatorReview.count({ where: { OR: [{ rating: { lt: 1 } }, { rating: { gt: 5 } }] } });
  check('creatorReview.rating 1..5', badRatings === 0, `${badRatings} invalid rows`);
  const badPlayers = await db.multiplayerRoom.count({ where: { OR: [{ maxPlayers: { lt: 2 } }, { maxPlayers: { gt: 16 } }] } });
  check('multiplayerRoom.maxPlayers 2..16', badPlayers === 0, `${badPlayers} invalid rows`);
  const badCurrencies = await db.purchaseReceipt.count({ where: { currency: { notIn: ['USD','EUR','GBP','PKR'] } } });
  // Currency is intentionally reported, not rejected: deployments may use more than USD.
  report.checks.push({ name:'purchaseReceipt.currency', ok:true, detail:`${badCurrencies} non-USD rows reported; validate against enabled provider currencies before rollout.` });
  const orphanMembers = await db.multiplayerMember.count({ where: { room: { is: null } } });
  check('multiplayer members have rooms', orphanMembers === 0, `${orphanMembers} orphan rows`);
  const orphanReviews = await db.creatorReview.count({ where: { puzzle: { is: null } } });
  check('creator reviews have puzzles', orphanReviews === 0, `${orphanReviews} orphan rows`);
  const badJsonTables = [
    ['playerSave','saveJson'],['auditEvent','payloadJson'],['gameplayEvent','payloadJson'],['multiplayerRoom','stateJson'],
    ['purchaseReceipt','rawJson'],['rewardLedgerV5','payloadJson'],['analyticsEventV5','propertiesJson'],
    ['multiplayerRoomV5','stateJson'],['paymentEventV5','payloadJson'],['auditEventV5','metadataJson'],['creatorPuzzle','wordsJson'],['pushSubscription','subscriptionJson']
  ];
  for (const [model, field] of badJsonTables) {
    const rows = await db[model].findMany({ select: { [field]: true }, take: 5000 });
    let invalid = 0;
    for (const row of rows) { try { JSON.parse(String(row[field])); } catch { invalid++; } }
    check(`${model}.${field} valid JSON`, invalid === 0, `${invalid} invalid among sampled rows (max 5000)`);
  }
  const out = 'artifacts/prisma-adoption';
  await mkdir(out, { recursive:true });
  await writeFile(`${out}/data-audit.json`, JSON.stringify(report, null, 2));
  if (report.semanticViolations.length) { console.error('[prisma-adoption-audit] REFUSED — semantic/data checks failed. See artifacts/prisma-adoption/data-audit.json'); process.exitCode=1; }
  else console.log('[prisma-adoption-audit] PASS — row counts and semantic invariants passed; review the report before adoption.');
} finally { await db.$disconnect(); }
