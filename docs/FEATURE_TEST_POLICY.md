# Feature Test Policy

All new Mera World features must follow this lifecycle.

1. **TEST ONLY**: Build the first usable version in the Feature Test Lab. Do not add it to the main dashboard/navigation yet.
2. **QA**: Add a Feature Test Lab entry with a real test path and explicit PASS/FAIL criteria.
3. **DATA**: Test save/load, cloud sync, logout/login, new device restore, and guest isolation where relevant.
4. **SECURITY**: Test authorization on both UI and server/API. Hiding a button is not security.
5. **MONETIZATION**: Test purchase verification, entitlement restore, refunds/invalid states, and rewarded-ad limits before release.
6. **MOBILE**: Test touch, small screens, offline/reconnect, and browser refresh.
7. **RELEASE**: Only after the feature passes QA should it be moved from the Test Lab into its final category.
8. **CLEANUP**: Remove test-only controls, mock rewards, debug labels, and test data before final release.

### Required test states

Every test feature should report:
- Not tested
- Pass
- Fail
- Error / blocked by configuration

A feature is not considered final merely because its screen renders.
