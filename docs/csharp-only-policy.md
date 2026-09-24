# C#-Only Coding Policy

All source code in this repository MUST be written in **C# (.NET / Unity)**.

## Why?

- Single language across gameplay, UI, and tools
- Target platform is **Android (Google Play Store)**
- Native C# support in Unity
- Easier onboarding for C# game developers

## Rules

1. ✅ All gameplay logic in C#
2. ✅ All UI code in C#
3. ✅ All editor tools in C#
4. ❌ No TypeScript, JavaScript, or Python source files
5. ❌ No Node.js dependencies

## Allowed Exceptions

- `.github/workflows/*.yml` — CI config (YAML)
- `*.md` — documentation
- `*.json` — Unity meta / package config
- `*.cmd`, `*.sh`, `*.ps1` — build automation scripts
- Unity `.asset`, `.prefab`, `.unity` files (they are YAML internally)

## Enforcement

The CI workflow at `.github/workflows/csharp-only.yml` blocks any PR that introduces non-C# source files outside the allowed exceptions.

## Migration Note

This project previously used TypeScript + Vite. As of the C#-only migration, all web code has been removed. See git history (branch `migrate-to-csharp`) for reference.