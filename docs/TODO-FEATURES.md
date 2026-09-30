# Mera Word Search Journey — MASTER TODO (Complete Edition)

> Ye file project ki SINGLE SOURCE OF TRUTH hai.
> Sab kuch yahan likha hai — kuch bhi miss nahi hona chahiye.
> Version: 2.0 | Last updated: 30 Sep 2026

---

## 📊 OVERALL PROGRESS

| Section | Done | Missing | Priority |
|---|---|---|---|
| Core gameplay | 80% | Save, polish | 🔴 |
| UI screens | 70% | Animations, tutorial | 🟡 |
| Bot AI | 60% | Difficulty tuning | 🔴 |
| Real multiplayer | 5% | Backend, sync | 🟢 |
| Ads | 10% | Real SDK | 🔴 |
| IAP | 0% | Setup | 🟡 |
| Audio | 20% | Real files | 🔴 |
| Analytics | 0% | Firebase | 🟡 |
| Play Store | 0% | Assets, listing | 🔴 |
| Legal/Compliance | 0% | Privacy, ToS | 🔴 |

---

# 🔴 SECTION A — PLAY STORE LAUNCH (MUST HAVE)

## A1. Real Ads Integration

### A1.1 Ad Networks — Choose
- [ ] **Unity Ads** (recommended for Unity games — free, easy)
- [ ] **Google AdMob** (better eCPM, more setup)
- [ ] **Ad mediation** (both together — advanced)
- [ ] **Test ads** ON during development

### A1.2 Unity Ads Setup
- [ ] Account banao: https://dashboard.unity3d.com
- [ ] Unity Project ID link karo
- [ ] Package install: `com.unity.ads`
- [ ] Game ID copy karo
- [ ] Ad Unit IDs banao:
  - [ ] `Banner_Android`
  - [ ] `Interstitial_Android`
  - [ ] `Rewarded_Android`
- [ ] Test mode ON (development ke liye)

### A1.3 Ad Placement
- [ ] **Banner ads:**
  - [ ] Home screen bottom (safe area ke andar)
  - [ ] Shop screen bottom
  - [ ] Level complete screen bottom
  - [ ] NEVER gameplay ke dauran (annoying)
- [ ] **Interstitial ads (full-screen):**
  - [ ] Har 3rd level complete ke baad
  - [ ] App close pe (optional)
  - [ ] Min 60 sec gap between two interstitials
  - [ ] NEVER first launch pe
- [ ] **Rewarded ads (user chooses):**
  - [ ] "Get Hint" — 1 free hint
  - [ ] "Double Coins" — level reward 2x
  - [ ] "Extra Time" — +30 sec
  - [ ] "Continue" — after lose
  - [ ] "Free Spin" — daily spin
  - [ ] "Unlock Pet" — rare pet
- [ ] **Frequency cap:**
  - [ ] Max 5 interstitials/day
  - [ ] Min 90 sec between two ads
  - [ ] Respect user's "ad-free" IAP

### A1.4 AdsManager.cs — Real Implementation
- [ ] `AdsManager.cs` update:
  - [ ] Initialize SDK on startup
  - [ ] Load ads on scene load
  - [ ] Show banner/interstitial/rewarded
  - [ ] Handle callbacks (onComplete, onFailed)
  - [ ] Fallback if ad not available
- [ ] Ad caching — pre-load next ad
- [ ] Ad loading screen if slow
- [ ] Ad state tracking (analytics)

### A1.5 Ad Revenue Optimization
- [ ] eCPM tracking per ad type
- [ ] A/B test ad frequency
- [ ] Country-based ad serving
- [ ] Ad network fallback (Unity Ads fail → AdMob)

---

## A2. Real Multiplayer (Backend)

### A2.1 Backend Choose (Pick ONE)
| Option | Cost | Difficulty |
|---|---|---|
| **PlayFab** | Free tier (100k MAU) | Easy |
| **Photon PUN** | Free 20 CCU | Easy |
| **Nakama** | Free (self-host) | Hard |
| **Firebase Realtime DB** | Free tier | Medium |
| **Custom Node.js server** | $5-20/mo | Hard |

**Recommendation:** PlayFab (free, complete feature set)

### A2.2 PlayFab Setup
- [ ] Account banao: https://playfab.com
- [ ] Unity SDK install
- [ ] Title ID copy karo
- [ ] Login flow:
  - [ ] Guest login (auto on first launch)
  - [ ] Google Sign-In (optional link)
  - [ ] Facebook login (optional link)
  - [ ] Apple Sign-In (iOS only)
- [ ] Player profile sync

### A2.3 Matchmaking System
- [ ] **Queue:**
  - [ ] Player clicks "Find Match"
  - [ ] Add to matchmaking queue
  - [ ] Server pings every 2 sec
  - [ ] Timeout: 8 seconds
- [ ] **Match found:**
  - [ ] Create shared session
  - [ ] Send both players: opponent info
  - [ ] Start countdown: 3-2-1
  - [ ] Sync grid generation (same seed both sides)
- [ ] **Bot fallback:**
  - [ ] Timeout → bot joins
  - [ ] Bot difficulty: player level based
  - [ ] Bot name/avatar randomized
- [ ] **Skill-based matching (advanced):**
  - [ ] Track player ELO/MMR
  - [ ] Match similar skill levels
  - [ ] ± 200 MMR range

### A2.4 Real-time Sync
- [ ] Grid generation synced (same seed)
- [ ] Letter selection sync (optional — for spectator)
- [ ] Word found event sync
- [ ] Score updates sync (every word)
- [ ] Timer sync (server time)
- [ ] Lag compensation (client-side prediction)
- [ ] Reconnection handling (10 sec grace)

### A2.5 Anti-Cheat
- [ ] Server-authoritative scoring
- [ ] Client time NOT trusted
- [ ] Word validation on server (not just client)
- [ ] Rate limiting (max 1 word per 500ms)
- [ ] Detect speedhacks
- [ ] Ban suspicious accounts

### A2.6 Friend System
- [ ] Friend request send
- [ ] Accept/reject
- [ ] Friend list UI
- [ ] Challenge friend (direct match)
- [ ] View friend's profile
- [ ] Remove friend
- [ ] Block user

### A2.7 Leaderboards
- [ ] Weekly leaderboard
- [ ] All-time leaderboard
- [ ] Friends-only leaderboard
- [ ] Country leaderboard
- [ ] Rewards for top 100

### A2.8 Tournaments
- [ ] Weekly tournament (bracket)
- [ ] Entry fee: 100 coins
- [ ] Prize pool: coins + gems
- [ ] Auto-match by skill
- [ ] Live bracket display
- [ ] Spectator mode for finals

### A2.9 Chat System
- [ ] In-match chat (quick messages)
- [ ] Friend chat
- [ ] Emoji reactions
- [ ] Report abuse
- [ ] Block user
- [ ] Profanity filter

---

## A3. Save System (Complete)

### A3.1 Local Save
- [ ] PlayerPrefs already used ✅
- [ ] **Encryption** — XOR + salt (tamper-proof)
- [ ] **Version field** — migrations handle karo
- [ ] **Auto-save:**
  - [ ] On every level complete
  - [ ] On every coin/gem change
  - [ ] On app pause
  - [ ] On app quit
- [ ] **Manual backup:**
  - [ ] Export save file (share)
  - [ ] Import save file

### A3.2 Cloud Save
- [ ] PlayFab player data
- [ ] Sync on login
- [ ] Sync on level complete
- [ ] Conflict resolution:
  - [ ] Server vs client timestamp
  - [ ] Latest wins
  - [ ] Merge if possible
- [ ] New device restore
- [ ] Multi-device sync

### A3.3 Save Data Structure
- [ ] Player progress (level, stars)
- [ ] Coins, gems
- [ ] Owned pets, skins
- [ ] Achievements unlocked
- [ ] Statistics (words found, time played)
- [ ] Settings
- [ ] Purchase history
- [ ] Daily streak data

---

## A4. IAP (In-App Purchases)

### A4.1 Products Define
- [ ] **Remove Ads** — ₹99 / $0.99 (one-time)
- [ ] **Starter Pack** — ₹149 / $1.49 (coins + gems + pet)
- [ ] **Coin packs:**
  - [ ] 1000 coins — ₹49
  - [ ] 5000 coins — ₹199
  - [ ] 15000 coins — ₹499
- [ ] **Gem packs:**
  - [ ] 50 gems — ₹99
  - [ ] 300 gems — ₹499
  - [ ] 1000 gems — ₹1499
- [ ] **Subscription (monthly):**
  - [ ] VIP — ₹199/mo (no ads + 500 gems/mo)
  - [ ] Pro — ₹499/mo (everything)

### A4.2 Setup
- [ ] Unity IAP package install
- [ ] Google Play Console → Products create
- [ ] Product IDs configure
- [ ] Test purchases (sandbox)
- [ ] Receipt validation
- [ ] Restore purchases button
- [ ] Handle failed purchases
- [ ] Refund handling

---

## A5. Audio (Real Files)

### A5.1 Sound Effects (15+ files)
- [ ] `letter-select.mp3` — 100ms
- [ ] `word-found.mp3` — 500ms
- [ ] `word-invalid.mp3` — 300ms
- [ ] `level-complete.mp3` — 2s
- [ ] `star-earned.mp3` — 500ms
- [ ] `button-click.mp3` — 100ms
- [ ] `coin-collect.mp3` — 300ms
- [ ] `gem-collect.mp3` — 300ms
- [ ] `popup-open.mp3` — 200ms
- [ ] `popup-close.mp3` — 200ms
- [ ] `error.mp3` — 400ms
- [ ] `whoosh.mp3` — 300ms
- [ ] `celebration.mp3` — 3s
- [ ] `countdown.mp3` — 1s
- [ ] `heartbeat.mp3` — loop for last 10s

### A5.2 Background Music (8+ files)
- [ ] `home-theme.mp3` — 60s loop
- [ ] `gameplay-soft.mp3` — 90s loop
- [ ] `victory-short.mp3` — 5s
- [ ] `world-1-meadow.mp3`
- [ ] `world-2-beach.mp3`
- [ ] `world-3-forest.mp3`
- [ ] `world-4-mountain.mp3`
- [ ] `world-5-desert.mp3`
- [ ] `world-6-sky.mp3`

### A5.3 Audio Manager
- [ ] Centralized audio control
- [ ] Music vs SFX channels
- [ ] Volume sliders
- [ ] Mute toggle
- [ ] Fade in/out
- [ ] Crossfade between scenes
- [ ] Audio focus handling (phone call)
- [ ] Background audio (app minimize)

### A5.4 Audio Sources
- [ ] **Freesound.org** — SFX (CC0)
- [ ] **Pixabay Music** — BGM (royalty-free)
- [ ] **Kenney Audio** — game SFX packs
- [ ] **OpenGameArt** — mixed

---

## A6. Legal & Compliance

### A6.1 Required Documents
- [ ] **Privacy Policy** page (hosted URL)
  - [ ] What data collected
  - [ ] Why collected
  - [ ] How stored
  - [ ] Third parties (ads, analytics)
  - [ ] User rights
  - [ ] Contact info
- [ ] **Terms of Service**
  - [ ] App usage rules
  - [ ] Account terms
  - [ ] Payment terms
  - [ ] Refund policy
  - [ ] Liability limitation
- [ ] **Cookie Policy** (if applicable)
- [ ] **Refund Policy**
- [ ] **Copyright notice** (in-game)
- [ ] **Open source licenses** (in-game credits)

### A6.2 Data Compliance
- [ ] **GDPR** (Europe):
  - [ ] Consent dialog on first launch
  - [ ] Data export option
  - [ ] Data deletion option
  - [ ] Privacy by design
- [ ] **CCPA** (California):
  - [ ] "Do not sell my data" option
- [ ] **COPPA** (kids):
  - [ ] Age gate (13+)
  - [ ] Parental consent if under 13
  - [ ] No targeted ads for kids
- [ ] **PIPEDA** (Canada)
- [ ] **LGPD** (Brazil)

### A6.3 Play Store Compliance
- [ ] **Data Safety form** (mandatory)
  - [ ] What data collected
  - [ ] Encrypted in transit
  - [ ] User can delete
- [ ] **Content rating** questionnaire
  - [ ] IARC rating
  - [ ] Age rating (likely 3+ or 7+)
- [ ] **Target audience** declaration
- [ ] **Ads declaration**
- [ ] **In-app purchases declaration**
- [ ] **App category:** Games → Word / Puzzle
- [ ] **App tags:** word search, puzzle, brain

### A6.4 Account Deletion (Required)
- [ ] In-app "Delete Account" option
- [ ] Web URL for deletion
- [ ] 30-day data retention policy
- [ ] Confirmation flow
- [ ] Play Store form: account deletion URL

---

## A7. Play Store Assets

### A7.1 Store Listing
- [ ] **App name:** Mera Word Search Journey
- [ ] **Short description** (80 chars)
- [ ] **Full description** (4000 chars)
- [ ] **Keywords** (ASO research)
- [ ] **What's New** text

### A7.2 Graphics
- [ ] **App Icon** (512x512)
- [ ] **Adaptive Icon** (foreground + background)
- [ ] **Feature Graphic** (1024x500)
- [ ] **Screenshots** (min 4, recommended 8):
  - [ ] Phone (16:9) — 8 screenshots
  - [ ] Tablet (16:10) — 8 screenshots
  - [ ] Landscape (optional)
- [ ] **Promo Video** (YouTube link, 30 sec)

### A7.3 Localization
- [ ] Store listing in English
- [ ] Store listing in Urdu (optional)
- [ ] Store listing in Hindi (optional)

---

## A8. Build Configuration

### A8.1 Unity Build Settings
- [ ] **Platform:** Android
- [ ] **Build format:** AAB (Android App Bundle)
- [ ] **Scripting backend:** IL2CPP
- [ ] **Target architectures:** ARM64 + ARMv7
- [ ] **Min API level:** 24 (Android 7.0)
- [ ] **Target API level:** 34 (Android 14)
- [ ] **Managed stripping level:** Medium
- [ ] **Code optimization:** Master

### A8.2 Signing
- [ ] **Keystore generate:**
  - [ ] 2048-bit RSA
  - [ ] 25+ year validity
  - [ ] Strong password
  - [ ] Multiple backups (USB, cloud, paper)
- [ ] **Upload keystore** to Play Console (App Signing)
- [ ] **Test signing** before upload
- [ ] **Keep keystore SAFE** — lose = can't update

### A8.3 Build Size Optimization
- [ ] Target: < 100 MB
- [ ] Compress textures (ASTC)
- [ ] Audio: MP3 (not WAV)
- [ ] Remove unused assets
- [ ] Asset bundles for large content
- [ ] Addressables system

### A8.4 Performance Targets
- [ ] **FPS:** 60 stable
- [ ] **Startup time:** < 5 sec
- [ ] **Memory:** < 300 MB
- [ ] **Battery drain:** low
- [ ] **APK size:** < 100 MB
- [ ] **Crash-free rate:** > 99%

---

## A9. Testing & QA

### A9.1 Device Matrix
- [ ] Android 7.0 (min)
- [ ] Android 10
- [ ] Android 12
- [ ] Android 14
- [ ] Small phone (5")
- [ ] Large phone (6.5")
- [ ] Tablet (10")
- [ ] Foldable (if possible)
- [ ] Low-end device (2GB RAM)
- [ ] High-end device

### A9.2 Test Cases
- [ ] **Core gameplay:**
  - [ ] Select letters
  - [ ] Find word
  - [ ] Complete level
  - [ ] Win/lose
  - [ ] Use hint
  - [ ] Timer runs
  - [ ] Score updates
- [ ] **UI:**
  - [ ] All buttons work
  - [ ] All screens navigate
  - [ ] No text overflow
  - [ ] No overlap
  - [ ] Portrait only
- [ ] **Edge cases:**
  - [ ] No internet
  - [ ] Slow internet
  - [ ] App background/foreground
  - [ ] Phone call during game
  - [ ] Low battery
  - [ ] Low storage
- [ ] **Multiplayer:**
  - [ ] Match found
  - [ ] Bot fallback
  - [ ] Disconnection
  - [ ] Reconnection

### A9.3 Beta Testing
- [ ] **Internal testing** (10 testers)
- [ ] **Closed testing** (100 testers)
- [ ] **Open testing** (public beta)
- [ ] Feedback form
- [ ] Bug report system

---

## A10. Analytics & Crash Reporting

### A10.1 Firebase Setup
- [ ] Firebase project banao
- [ ] Firebase Unity SDK install
- [ ] `google-services.json` add

### A10.2 Analytics Events
- [ ] `app_open`
- [ ] `level_start` (level_number)
- [ ] `level_complete` (level, time, stars)
- [ ] `level_fail` (level, reason)
- [ ] `word_found` (word, time)
- [ ] `hint_used`
- [ ] `ad_view` (type, placement)
- [ ] `ad_click`
- [ ] `iap_purchase` (product_id, price)
- [ ] `share` (platform)
- [ ] `settings_change`
- [ ] `daily_challenge` (streak)

### A10.3 Crash Reporting
- [ ] **Firebase Crashlytics** install
- [ ] Non-fatal errors track
- [ ] ANR tracking
- [ ] Custom keys (level, device)
- [ ] Stack trace symbolication

### A10.4 Remote Config
- [ ] Firebase Remote Config
- [ ] Feature flags
- [ ] Ad frequency tuning
- [ ] Difficulty tuning
- [ ] Content updates (no app update needed)

### A10.5 A/B Testing
- [ ] Test different UI
- [ ] Test different ad placements
- [ ] Test different difficulty
- [ ] Test different prices

---

# 🟡 SECTION B — POLISH & CONTENT

## B1. Tutorial & Onboarding

### B1.1 First-Time User Experience
- [ ] Splash screen (2s)
- [ ] Loading screen with tips
- [ ] Language selection
- [ ] Age gate (if required)
- [ ] Privacy consent (GDPR)
- [ ] Login prompt (guest ok)

### B1.2 Tutorial
- [ ] Step 1: "Ye grid hai"
- [ ] Step 2: "Drag karke letters select karo"
- [ ] Step 3: "Word dhundho"
- [ ] Step 4: "Hint use karo"
- [ ] Step 5: "Win screen"
- [ ] Skip button
- [ ] Replay option
- [ ] Help screen accessible
- [ ] Tutorial complete flag save

### B1.3 First Session Experience
- [ ] Free welcome gift (500 coins)
- [ ] Free starter pack
- [ ] Tutorial rewards
- [ ] Progressive difficulty (first 10 levels easy)

---

## B2. Real Art Polish

### B2.1 Backgrounds (6 Worlds)
- [ ] World 1: Green Meadows
- [ ] World 2: Sunny Beach
- [ ] World 3: Mystic Forest
- [ ] World 4: Crystal Mountains
- [ ] World 5: Ancient Desert
- [ ] World 6: Starlight Sky
- [ ] Each: 1 background + 1 gradient overlay

### B2.2 Tiles
- [ ] Wooden tile texture
- [ ] Gold tile texture
- [ ] Glass tile texture
- [ ] Selected state animation
- [ ] Found state animation
- [ ] Hint state animation
- [ ] Press animation (scale + shadow)
- [ ] Letter pop animation

### B2.3 UI Elements
- [ ] Button states (normal, hover, pressed, disabled)
- [ ] Progress bars with gradient
- [ ] Modal backgrounds with blur
- [ ] Avatar frames (10+ designs)
- [ ] Card designs
- [ ] Icon set (50+ icons)

### B2.4 Animations
- [ ] Screen transitions (slide, fade)
- [ ] Button press feedback
- [ ] Modal open/close
- [ ] Card flip (daily reward)
- [ ] Spin wheel (physics-based)
- [ ] Chest opening
- [ ] Level complete celebration
- [ ] Coin fly animation
- [ ] Confetti
- [ ] Particle effects

### B2.5 Pet Art (20+ pets)
- [ ] Pet designs
- [ ] Pet animations (idle, happy, sad)
- [ ] Pet evolution stages

### B2.6 AI Art Generation
- [ ] Use Gemini/DALL-E for placeholders
- [ ] Replace with real art later
- [ ] Consistent style guide
- [ ] Transparent backgrounds for UI

---

## B3. Daily Challenge (Real)

- [ ] Daily level generation (unique seed per day)
- [ ] Streak counter
- [ ] Streak rewards:
  - [ ] Day 1: 100 coins
  - [ ] Day 3: 50 gems
  - [ ] Day 7: 500 coins + booster
  - [ ] Day 30: rare pet
- [ ] Calendar UI (streak visualization)
- [ ] Streak break warning
- [ ] Push notification reminder
- [ ] Timezone handling
- [ ] Server time validation (anti-cheat)

---

## B4. Push Notifications

### B4.1 Setup
- [ ] Firebase Cloud Messaging
- [ ] Android notification channels
- [ ] Permission request flow
- [ ] Token registration

### B4.2 Notification Types
- [ ] Daily challenge ready
- [ ] Streak about to break
- [ ] New world unlocked
- [ ] Friend sent gift
- [ ] Tournament starting
- [ ] New seasonal event
- [ ] Comeback (inactive 3+ days)

### B4.3 Settings
- [ ] Per-category toggle
- [ ] Quiet hours
- [ ] Time zone respect

---

## B5. Social Features

### B5.1 Sharing
- [ ] Share win screenshot
- [ ] Share level progress
- [ ] Share achievement
- [ ] WhatsApp, FB, IG, Twitter
- [ ] Auto-generate share image (with level, time)

### B5.2 Referral System
- [ ] Unique referral code per player
- [ ] Share referral link (deep link)
- [ ] Referrer reward (100 coins)
- [ ] Referee reward (500 coins)
- [ ] Track referrals
- [ ] Anti-fraud

### B5.3 Deep Linking
- [ ] App opens specific level from link
- [ ] App opens from ad
- [ ] Deferred deep links (install → open)

---

## B6. Progression Systems

### B6.1 Player Level (XP)
- [ ] XP earn from levels
- [ ] Level up rewards
- [ ] Rank tiers:
  - [ ] Bronze (1-10)
  - [ ] Silver (11-25)
  - [ ] Gold (26-50)
  - [ ] Platinum (51-100)
  - [ ] Diamond (100+)
- [ ] Rank badge display

### B6.2 Achievements (50+)
- [ ] "First Word" — find first word
- [ ] "100 Words" — find 100
- [ ] "1000 Words" — find 1000
- [ ] "First Win" — win first level
- [ ] "Perfect Level" — no hints
- [ ] "Speed Demon" — level under 30s
- [ ] "7 Day Streak"
- [ ] "30 Day Streak"
- [ ] "First Purchase"
- [ ] "Reach Level 10"
- [ ] ... aur 40 more

### B6.3 Statistics
- [ ] Total words found
- [ ] Total time played
- [ ] Levels completed
- [ ] Perfect levels
- [ ] Longest streak
- [ ] Total coins earned
- [ ] Total ads watched
- [ ] Win/loss ratio (multiplayer)

---

## B7. Economy

### B7.1 Currencies
- [ ] **Coins** (soft currency)
  - [ ] Earn from levels
  - [ ] Spend on hints
  - [ ] Buy boosters
- [ ] **Gems** (hard currency)
  - [ ] Earn from achievements
  - [ ] Buy with real money
  - [ ] Premium items
- [ ] **Stars** (per level)
- [ ] **XP** (player level)

### B7.2 Boosters
- [ ] Hint — reveal one letter
- [ ] Reveal Word — reveal full word
- [ ] Time Freeze — pause timer 10s
- [ ] Shuffle — rearrange grid
- [ ] Double Coins — next level 2x
- [ ] Auto Solve — AI solves (premium)

### B7.3 Rewards
- [ ] Level complete rewards
- [ ] Daily login bonus
- [ ] Streak rewards
- [ ] Ad rewards
- [ ] Achievement rewards
- [ ] Referral rewards

---

## B8. Pet System (Complete)

### B8.1 Pets (20+)
- [ ] Pet 1: Cat
- [ ] Pet 2: Dog
- [ ] Pet 3: Dragon
- [ ] ... 17 more

### B8.2 Pet Mechanics
- [ ] Each pet: unique passive bonus
- [ ] +5% coins
- [ ] +1 hint per level
- [ ] Time bonus
- [ ] Rare word reveal
- [ ] Pet leveling
- [ ] Pet evolution
- [ ] Pet animations

### B8.3 Pet UI
- [ ] Pet collection screen
- [ ] Pet detail screen
- [ ] Pet upgrade screen
- [ ] Pet showcase (on home)

---

## B9. World Map System

### B9.1 Worlds (6)
- [ ] World 1: Green Meadows (Levels 1-40)
- [ ] World 2: Sunny Beach (41-80)
- [ ] World 3: Mystic Forest (81-120)
- [ ] World 4: Crystal Mountains (121-160)
- [ ] World 5: Ancient Desert (161-200)
- [ ] World 6: Starlight Sky (201+)

### B9.2 World Features
- [ ] Unique background
- [ ] Unique music
- [ ] Unique word bank
- [ ] Unique pet
- [ ] Boss level at end
- [ ] Unlock condition

### B9.3 World Map UI
- [ ] Visual world map
- [ ] Locked/unlocked worlds
- [ ] Progress per world
- [ ] Stars per world

---

## B10. Accessibility

- [ ] Font size adjust (3 levels)
- [ ] Color blind mode
  - [ ] Deuteranopia
  - [ ] Protanopia
  - [ ] Tritanopia
- [ ] High contrast mode
- [ ] Reduce motion toggle
- [ ] Left-hand mode (UI mirror)
- [ ] Haptic feedback toggle
- [ ] Screen reader support (TalkBack)
- [ ] Captions for audio

---

## B11. Localization

- [ ] English (current)
- [ ] Urdu (Nastaliq + Roman)
- [ ] Hindi
- [ ] Arabic (RTL)
- [ ] Spanish
- [ ] Indonesian
- [ ] Language selector
- [ ] RTL support
- [ ] Localized number/date formats
- [ ] Localized currency

---

# 🟢 SECTION C — ADVANCED FEATURES (Future)

## C1. Advanced Game Modes

- [ ] Time Attack (60 sec)
- [ ] Zen Mode (no timer)
- [ ] Puzzle Mode (specific pattern)
- [ ] Story Mode (narrative)
- [ ] Boss Battles (every 10th level)
- [ ] Weekly Tournament
- [ ] Endless Mode (procedural)
- [ ] Speed Run
- [ ] Multiplayer (2-4 players)

## C2. Advanced Multiplayer

- [ ] Real-time 2v2
- [ ] Team battles
- [ ] Clan wars
- [ ] Spectator mode
- [ ] Replay system
- [ ] Co-op mode
- [ ] Battle royale (10+ players)

## C3. Content Creation

- [ ] Level editor
- [ ] Share custom levels
- [ ] Community levels
- [ ] Level rating
- [ ] Featured levels
- [ ] Level of the day

## C4. AI/ML

- [ ] Adaptive difficulty (ML)
- [ ] Player behavior prediction
- [ ] Smart matchmaking (ML)
- [ ] Bot personalities (learning)
- [ ] Word suggestion AI
- [ ] Smart hint system

## C5. Live Ops

- [ ] Seasonal events
- [ ] Limited-time modes
- [ ] Battle pass (season)
- [ ] Daily/weekly missions
- [ ] Login rewards
- [ ] Flash sales

## C6. Advanced Analytics

- [ ] Funnel analysis
- [ ] Cohort retention
- [ ] LTV prediction
- [ ] Churn prediction
- [ ] Revenue attribution
- [ ] A/B testing framework
- [ ] Remote config for tuning

## C7. Performance Optimization

- [ ] Object pooling
- [ ] Atlas textures
- [ ] LOD system
- [ ] Occlusion culling
- [ ] Memory profiling
- [ ] Battery optimization
- [ ] Network efficiency
- [ ] Startup time optimization

## C8. Security

- [ ] Code obfuscation (ProGuard)
- [ ] Save encryption
- [ ] Server-side validation
- [ ] API rate limiting
- [ ] DDoS protection
- [ ] Anti-cheat
- [ ] Ban system
- [ ] Report abuse

## C9. Advanced Monetization

- [ ] Ad mediation (multiple networks)
- [ ] Ad revenue optimization
- [ ] Dynamic pricing (A/B test)
- [ ] Bundle offers
- [ ] Limited-time offers
- [ ] Subscription models
- [ ] Battle pass
- [ ] Loot boxes (with regulations)
- [ ] Crypto/NFT (not recommended)

---

# 📊 SECTION D — TECHNICAL DEBT

## D1. Code Quality

- [ ] Fix all `matchWidthOrHeight = 0.5f` → `0f`
- [ ] Remove duplicate CanvasScaler lines
- [ ] Implement `AchievementsUI` (currently stub)
- [ ] Implement `PetSystemUI` (currently stub)
- [ ] Real `CloudSaveManager`
- [ ] Real `NotificationManager`
- [ ] Refactor large files (split)
- [ ] Code comments (XML docs)
- [ ] Naming conventions consistent
- [ ] Remove dead code

## D2. Testing

- [ ] Unit tests (70% coverage)
- [ ] Integration tests
- [ ] UI tests
- [ ] Performance tests
- [ ] CI/CD pipeline
- [ ] Automated builds
- [ ] Automated deployments

## D3. Documentation

- [ ] Architecture doc
- [ ] API doc
- [ ] Contribution guide
- [ ] Setup guide
- [ ] Coding standards
- [ ] Deployment guide

---

# 💰 SECTION E — BUDGET & TIMELINE

## E1. Budget Estimate

| Item | Cost | Type |
|---|---|---|
| Play Console | $25 | One-time |
| Unity Personal | Free | — |
| PlayFab free tier | Free | — |
| PlayFab paid (if scale) | $99+/mo | Recurring |
| Sound effects (Fiverr) | $50 | One-time |
| Music (Fiverr) | $100 | One-time |
| Custom UI (Fiverr) | $200 | One-time |
| Marketing (ads) | $100-500 | Optional |
| **Total (launch)** | **~$500-1000** | — |

## E2. Timeline

| Phase | Weeks | Deliverable |
|---|---|---|
| 1. Core polish | 1-2 | Bot, save, tutorial |
| 2. Monetization | 3-4 | Ads, IAP |
| 3. Content | 5-6 | Worlds, levels |
| 4. Launch prep | 7-8 | Play Store assets |
| 5. Beta launch | 9-10 | Closed beta |
| 6. Public launch | 11-12 | Full release |
| 7. Multiplayer | 13-16 | Real backend |
| 8. Live ops | 17+ | Seasonal events |

---

# ✅ SECTION F — PRE-LAUNCH CHECKLIST

## F1. Before Internal Testing
- [ ] No compile errors
- [ ] No console errors
- [ ] All screens accessible
- [ ] Save/load works
- [ ] Ads shown correctly (test mode)
- [ ] IAP test purchases work

## F2. Before Closed Beta
- [ ] Privacy policy live
- [ ] ToS live
- [ ] Firebase Analytics working
- [ ] Crashlytics working
- [ ] Push notifications working
- [ ] 20+ beta testers

## F3. Before Public Launch
- [ ] Crash-free rate > 99%
- [ ] Performance good on low-end devices
- [ ] Store listing complete
- [ ] Screenshots ready
- [ ] Feature graphic ready
- [ ] Promo video ready
- [ ] Beta feedback addressed

## F4. Launch Day
- [ ] Submit AAB
- [ ] Monitor Play Console
- [ ] Respond to first reviews
- [ ] Monitor crash reports
- [ ] Social media announce

## F5. Post-Launch (Week 1)
- [ ] Fix critical bugs
- [ ] Update based on feedback
- [ ] Respond to all reviews
- [ ] Monitor metrics

---

# 📝 SECTION G — NOTES & REMINDERS

## G1. Golden Rules
1. **Never delete files** — move to `_archive/`
2. **Commit often** — small commits
3. **Test on real device** — not just editor
4. **User first** — no aggressive monetization
5. **Keep it simple** — feature creep is enemy

## G2. Key Metrics to Track
- Day 1 retention: target 40%
- Day 7 retention: target 15%
- Day 30 retention: target 5%
- Average session: 8-15 min
- Level completion rate: 70%
- Ad view rate: reasonable
- IAP conversion: 2-5%

## G3. Review Cadence
- Weekly: Check this TODO, update status
- Bi-weekly: Review analytics
- Monthly: User feedback review
- Quarterly: Big feature review

## G4. Emergency Contacts
- Backend down → PlayFab support
- Ads not showing → Unity Ads support
- Payment issues → Google Play support
- Legal issues → Lawyer

---

**END OF DOCUMENT**

**Total items:** 400+  
**Estimated time to complete:** 3-6 months (full-time)  
**Estimated time to MVP launch:** 6-8 weeks  
**Last updated:** 30 Sep 2026  
**Next review:** 14 Oct 2026