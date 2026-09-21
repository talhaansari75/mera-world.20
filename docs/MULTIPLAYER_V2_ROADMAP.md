# Multiplayer V2 — Production Roadmap

## Current baseline
Quick Match, private rooms, server-authoritative word validation/scoring, human-vs-bot fallback, event sequencing, chat, rate limiting, concurrent room joins, settlement/rating, and authenticated short voice messages are already present.

## P0 — reliability and fairness
- Real-time SSE/WebSocket transport instead of most polling.
- Reconnect/resume with a grace window and explicit connected/reconnecting/forfeited states.
- Idempotent client actions and replay protection.
- Anti-cheat telemetry for impossible timing, abnormal action rate, duplicate/replayed actions and suspicious-score patterns.
- Automated 2-player E2E tests for simultaneous join, disconnect/reconnect, bot fallback, timeout and settlement.
- Load tests for concurrent rooms and action bursts.

## P1 — competitive
- Skill/rating-aware matchmaking using rating, region/latency and queue age.
- Ranked/unranked queues.
- Seasons, placement games, streaks and seasonal rewards.
- Rating history and match history.
- Country/global/daily/weekly leaderboards.

## P2 — social
- Friends, presence, invites and recent opponents.
- Rematch and party/lobby flow.
- Mute/block/report for chat and voice.
- Move voice audio from PostgreSQL bytea to object storage with signed URLs when scale requires it.

## P3 — game modes
- Blitz, classic, sudden death, survival and team 2v2/3v3.
- Special events and tournaments.
- Spectator mode for authorized live/completed matches.
- Carefully balanced cosmetic/progression rewards and optional non-pay-to-win power-ups.

## Architecture target
Client → authenticated realtime gateway → authoritative multiplayer service → PostgreSQL/event log → matchmaking/rating/leaderboards.

Blockchain/payment stays outside the live gameplay loop and is used for commerce/reward settlement only.

## Definition of done
A feature is not called production-ready until it has server-side authorization, deterministic state transitions, idempotency/replay protection where applicable, automated tests, observability/failure handling, and a real deployed E2E run.

## Principles
- Bots remain truthfully marked with `is_bot=true`; the UI may use human-style profiles but backend records must stay honest.
- Live gameplay authority never lives on the client.
- Blockchain transactions are not used for per-word gameplay events.
