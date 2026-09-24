# Test strategy

The repository test suite has two layers:

- `scripts/**/*.test.mjs` for repository/build/auth invariants.
- `src/lib/**/*.test.ts` for TypeScript unit and integration tests.

Run `npm test` to discover every test file recursively. The discovery script avoids shell-glob differences between operating systems and prevents newly added tests from silently being omitted.

## Quality rules

1. Use `node:assert/strict`; failed assertions must fail the process.
2. Keep tests deterministic by controlling time/randomness where practical.
3. Cover invalid input and boundary conditions, not only happy paths.
4. Test idempotency for state-changing operations.
5. Test authorization and privacy boundaries explicitly.
6. Never weaken assertions just to make CI green.
7. Add a regression test for every fixed production bug.
8. Keep browser/E2E tests separate from deterministic unit tests.
