# Mera Word Search Journey — Roadmap

## Vision

A hybrid Word Search + Light RPG for Android (Google Play Store).
Words become paths. Paths become adventures.

## Phase 1 — Foundation (in progress)

- [x] Migrate repo to C#-only stack
- [x] Archive old TypeScript/Vite web version
- [x] Core word search logic (grid, placement, validation, generation)
- [ ] Unity project setup
- [ ] First playable scene (8x8 grid, static)
- [ ] Tap-to-select letters
- [ ] Word found detection
- [ ] Win/lose screen

## Phase 2 — Core Gameplay

- [ ] 10 handcrafted levels
- [ ] Level progression system
- [ ] Save/load (PlayerPrefs)
- [ ] Hint system
- [ ] Sound effects + music
- [ ] Main menu + level select

## Phase 3 — Light RPG Layer

- [ ] Player profile (name, XP, level)
- [ ] Pet collection (unlock via words)
- [ ] Base building (simple resource system)
- [ ] Boss battles (milestone levels)

## Phase 4 — Content & Polish

- [ ] 6 worlds, 100+ levels total
- [ ] Daily challenges
- [ ] Adaptive difficulty
- [ ] Accessibility (font size, color blind mode)
- [ ] Localization (English + Urdu)

## Phase 5 — Launch

- [ ] Cloud save
- [ ] Google Play Games integration
- [ ] Analytics
- [ ] Beta testing
- [ ] Play Store release

## Tech Stack

- **Language:** C# (.NET)
- **Engine:** Unity 6.3 LTS
- **Target:** Android 8.0+ (API 26+)
- **Build:** Unity Android Build Pipeline

## Non-Goals

- No multiplayer (initially)
- No iOS (initially)
- No web version (archived for reference)

## Content Assets

- Levels designed: 5 (in `_staging/Data/Levels/`)
- Words defined: ~40
- Worlds: 0 (planned: 6)