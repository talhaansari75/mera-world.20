# C#-Only Coding Policy

All source code in this repository MUST be written in **C# (.NET / Unity)**.

## Why

- Single language across gameplay, UI, tools
- Target: **Android (Google Play Store)**
- Native C# support in Unity

## Rules

1. ✅ Gameplay logic in C#
2. ✅ UI in C#
3. ✅ Editor tools in C#
4. ❌ No TypeScript, JavaScript, Python source files
5. ❌ No Node.js dependencies

## Allowed Exceptions

- `.github/workflows/*.yml` — CI config
- `*.md` — documentation
- `*.json` — Unity/package config
- `*.cmd`, `*.sh`, `*.ps1` — build scripts
- `_archive/**` — archived old code (reference only, not built)

## Enforcement

CI at `.github/workflows/csharp-only-policy.yml` blocks PRs adding non-C# source outside exceptions.

## Migration Note

This project was previously a TypeScript + Vite web app. All web code has been archived under `_archive/web-version/` for reference. Active development is now C#-only.