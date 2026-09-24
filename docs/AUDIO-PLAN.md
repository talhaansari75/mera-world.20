# Audio Plan

## Free Audio Sources

- **Freesound.org** — free SFX (CC license)
- **Pixabay Music** — royalty-free background music
- **Kenney Audio** — free game SFX packs (CC0)
- **OpenGameArt.org** — mixed licenses

## SFX List (needed)

| Sound | When | Duration |
|---|---|---|
| letter-select | Each letter drag | 100ms |
| word-found | Valid word completes | 500ms |
| word-invalid | Invalid selection | 300ms |
| level-complete | All words found | 2s |
| star-earned | Star appears | 500ms each |
| button-click | Any UI button | 100ms |
| coin-collect | Coin added | 300ms |
| popup-open | Modal appears | 200ms |
| popup-close | Modal closes | 200ms |

## Music List (needed)

| Track | When | Loop |
|---|---|---|
| home-theme | Home screen | Yes, 60s |
| gameplay-soft | During puzzle | Yes, 90s |
| victory-short | Level complete | No, 5s |
| world-1-music | Green Meadows theme | Yes, 60s |
| world-2-music | Beach theme | Yes, 60s |
| (etc.) | per world | |

## Audio Rules

1. Music volume default: 60%
2. SFX volume default: 80%
3. User can toggle both in Settings
4. Music should never overpower SFX
5. All audio must be royalty-free or original

## Priority Order

1. letter-select, word-found, button-click (essential)
2. home-theme music
3. gameplay music
4. level-complete jingle
5. coin/star sounds
6. per-world music (last)