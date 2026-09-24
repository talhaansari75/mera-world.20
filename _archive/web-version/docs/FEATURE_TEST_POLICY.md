# Mera World — Feature Test-First Policy

## Purpose
Every new feature is built and verified in the Feature Test Lab before it is exposed in the normal player navigation.

## Lifecycle
1. **TEST** — create the smallest complete usable implementation and add a Test Lab entry.
2. **FUNCTIONAL QA** — verify the real UI action, server/API action, database write/read, errors, loading states and recovery.
3. **DATA QA** — verify save/load, logout/login, refresh, new-device restore, conflict handling and migration where applicable.
4. **GUEST QA** — verify that guest access follows the documented limit and that guest gameplay data is not persisted across guest sessions.
5. **SECURITY QA** — test authorization server-side; hidden buttons are never considered access control.
6. **MONETIZATION QA** — verify purchase, webhook/idempotency, entitlement restore, invalid/replayed requests, refunds where supported, rewarded-ad limits and reward grants.
7. **NETWORK QA** — test offline, reconnect, timeout, duplicate requests and partial failures where applicable.
8. **MOBILE QA** — test touch targets, keyboard/focus, small screens, safe areas and rotation/responsive layout where applicable.
9. **ACCESSIBILITY QA** — keyboard navigation, labels, focus, contrast and reduced-motion behavior where applicable.
10. **ANALYTICS QA** — verify success/failure events do not contain secrets or unnecessary personal data.
11. **ABUSE QA** — test rate limits, replay, spam, fake referrals, reward farming and malformed input.
12. **RELEASE** — only after all required checks pass, move the feature to its permanent category.
13. **CLEANUP** — remove test-only controls, simulated rewards, debug labels, fixtures and temporary routes unless intentionally retained as a permanent QA tool.

## Required test states
Every Feature Test Lab item must report:
- Not tested
- Pass
- Fail
- Error / blocked by configuration

A rendered screen is not a passing test.

## Required evidence before release
For stateful/server features record:
- happy path
- validation failure
- unauthorized request
- duplicate/replay request
- refresh/reconnect
- persistence/restore
- guest behavior
- error recovery

For monetized features additionally record:
- successful purchase
- failed purchase
- verified webhook
- duplicate webhook
- entitlement restore
- reward cap
- refund/revocation behavior where supported

## Promotion rule
A feature may move from Test Lab to normal navigation only when its required checks are passing and its production configuration is documented.

## Test data
Use clearly marked test accounts/data. Never use production player balances, purchases or progress as fixtures.

## Production configuration
Features that require third-party credentials must remain marked **Blocked by configuration** until credentials, redirect URLs, webhook URLs, sender identities, or ad-network settings have been verified in the target environment.
