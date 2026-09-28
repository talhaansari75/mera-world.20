# Setup Guide

## Requirements

- Unity Hub + Unity 2022.3 LTS (2022.3.40f1)
- Android Build Support (SDK, NDK, JDK)
- Git

## Steps

1. Clone the repo:
   git clone https://github.com/talhaansari75/mera-world.20.git
   cd mera-world.20

2. Unity Hub me Add project from disk
3. Unity 2022.3.40f1 select karo
4. Open project, wait for imports

## Project Structure

- Assets/Scripts/Core/          GameManager, GridVisualizer, UI
- Assets/Scripts/Data/          LevelData, WorldData, LevelDatabase
- Assets/Scripts/Gameplay/      Level loading, save system
- Assets/Scripts/WordSearch/    Grid generation, validation
- Assets/Scripts/Auth/          Authentication
- Assets/Scripts/Multiplayer/   Bot player, race match
- Assets/Scripts/Session/       Game session state
- Assets/Scenes/Main.unity      Primary scene
- Assets/Tests/EditMode/        Unit tests
- Assets/StreamingAssets/Data/  Level banks

## Level Data Setup

1. Assets/Scripts/Data/ folder me jaao
2. Right-click > Create > MeraWorld > World Data
3. Right-click > Create > MeraWorld > Level Database
4. LevelDatabase asset me saare WorldData drag karo

## Build Android

File > Build Settings > Android > Switch Platform > Build

## Tests

Window > General > Test Runner > EditMode > Run All
