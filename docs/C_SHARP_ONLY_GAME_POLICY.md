# C#-ONLY GAME CODING POLICY

This repository now has a strict C#-only rule for all new game coding.

- New game features, gameplay logic, UI logic, services, APIs, tests, and supporting code must be written in C#.
- New or modified `.ts` / `.tsx` files are prohibited.
- ChatGPT-generated game code must follow the same rule.
- Existing TypeScript is legacy code awaiting migration; this policy does not pretend the existing web codebase has already been converted.
- If a requested change requires TypeScript, stop and migrate the affected area to C# instead of adding TypeScript.
- The GitHub policy workflow rejects commits/PRs that add or modify TypeScript/TSX files.

The long-term migration target is a C# game codebase. Until that migration is complete, the current TypeScript web shell remains legacy and should not receive new logic.
