# Multiplayer Roadmap

## Phase 1: Bot Race (NOW) ✅

**Status:** In progress
**Time:** 2-3 days
**Backend:** Not needed

- Player vs AI opponent
- Bot has human-sounding names (Alex, Sam, Riley)
- Bot speed scales with level (fast at high levels, slow at low)
- Bot "finds" words over time with random variance
- Race UI: player vs bot progress bars
- Win/lose/draw result screen
- Optional toggle in Multiplayer menu

## Phase 2: Local Multiplayer (Optional)

**Time:** 1-2 days
**Backend:** Not needed

- Two players on same device
- Split screen or take-turns
- USB gamepad support (Android)
- Not priority

## Phase 3: Online PvP (Future — 4-8 weeks)

**Time:** 4-8 weeks
**Backend:** REQUIRED

### Tech Stack Options

| Option | Cost | Complexity |
|---|---|---|
| **Photon PUN 2** | Free tier (20 CCU) then $95/mo | Easy |
| **Unity Netcode** | Free (relay ~$0.50/GB) | Medium |
| **Nakama** | Self-hosted (free) or $300/mo | Hard |
| **Custom (ASP.NET + SignalR)** | Server cost only | Very hard |

**Recommended:** Photon PUN 2 for MVP

### Required Systems

1. **Backend Server**
   - Room creation
   - Player matchmaking
   - Real-time word state sync
   - Anti-cheat validation
   - Database for player stats

2. **Matchmaking**
   - Skill-based (MMR)
   - Region-based (ping)
   - Wait time < 30 seconds

3. **Real-time Sync**
   - Both players see same grid
   - Word found events broadcast
   - Timer synchronized
   - Disconnect handling

4. **Anti-Cheat**
   - Server validates word positions
   - Speed checks (no impossible fast finds)
   - Rate limiting
   - Device fingerprint

5. **Ranking System**
   - ELO or similar
   - Leagues (Bronze → Legend)
   - Season resets (monthly)

6. **Social**
   - Friend list
   - Invite to match
   - Chat (with moderation)
   - Report/block

### Estimated Costs

- **Photon PUN:** $0 (up to 20 CCU), then $95/mo for 100 CCU
- **Server:** AWS t3.medium ~$30/mo
- **Database:** PostgreSQL RDS ~$15/mo
- **Total MVP:** ~$50-150/mo

### Timeline

| Week | Milestone |
|---|---|
| 1 | Photon SDK setup + basic room |
| 2 | Two players join and see same grid |
| 3 | Real-time word sync |
| 4 | Matchmaking + timer sync |
| 5 | Anti-cheat + validation |
| 6 | Ranking + leaderboard |
| 7 | Friend invites + chat |
| 8 | Beta testing + bug fixes |

### Decision Point

**When to build PvP:**
- After Play Store launch
- When daily active users > 500
- When you have budget for server costs
- When players demand it in reviews

**Until then:** Bot Race keeps players engaged offline.