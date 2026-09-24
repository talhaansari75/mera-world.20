# Authentication System — Integration Guide

## Overview

The auth system uses a **backend interface** (`IAuthBackend`) so we can swap providers easily.

Current stub implementation: none.
Recommended production provider: **Firebase Auth** (free up to 50k users).

## Features supported

| Feature | Status |
|---|---|
| Email + Password sign up | ✅ Interface ready |
| Email + Password sign in | ✅ Interface ready |
| Google sign in | ✅ Interface ready |
| Facebook sign in | ✅ Interface ready |
| Apple sign in | ✅ Interface ready |
| Forgot password (email reset) | ✅ Interface ready |
| Guest mode | ✅ Interface ready |
| Session persistence | 🔜 After Unity setup |
| Cloud save sync | 🔜 After Unity setup |

## Firebase setup (do this after Unity project is created)

1. Go to https://console.firebase.google.com
2. Create project: `mera-world`
3. Add Android app with package name `com.talhaansari.meraworld`
4. Download `google-services.json` → drop into `Assets/` folder
5. Enable Authentication → Sign-in methods:
   - Email/Password
   - Google
   - Facebook (needs Facebook app ID)
   - Apple (needs Apple developer account)
6. Install Firebase Unity SDK:
   - Download from https://firebase.google.com/download/unity
   - Import `FirebaseAuth.unitypackage`
   - Import `FirebaseAuth.Google.unitypackage` (etc. for other providers)

## Files

- `AuthModels.cs` — Data classes, validator
- `AuthManager.cs` — Orchestrator + `IAuthBackend` interface
- `FirebaseAuthBackend.cs` — (to be written after Firebase SDK installed)
- `GuestAuthBackend.cs` — (local-only stub for testing before Firebase)

## UI screens needed (in Unity)

1. **Welcome screen** — [Sign In] [Sign Up] [Continue as Guest]
2. **Sign Up screen** — Email, Password, Display Name, [Create Account]
3. **Sign In screen** — Email, Password, [Sign In], [Forgot Password?]
4. **Forgot Password screen** — Email, [Send Reset Link]
5. **Provider buttons** — Google, Facebook, X (Twitter), Apple

## Guest mode behavior

- No network call
- Generate local user ID like `guest_<random>`
- Progress saved locally only
- Banner shown: "Sign in to save your progress"
- Later: link guest account to real account (Firebase supports this)

## Password rules

- Minimum 8 characters
- At least 1 uppercase, 1 lowercase, 1 digit
- Strength meter 0-5 shown live as user types

## Error messages (Hindi/Urdu friendly)

| Code | User message (English) |
|---|---|
| InvalidEmail | Please enter a valid email address |
| WeakPassword | Password must be 8+ chars with letters & numbers |
| EmailAlreadyInUse | This email is already registered |
| UserNotFound | No account found with this email |
| WrongPassword | Incorrect password |
| NetworkError | Check your internet connection |
| Cancelled | Sign in cancelled |

Localize to Urdu later via i18n system.