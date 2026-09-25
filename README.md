# Mera Word Search Journey (Ink & Starlight)

> Words become paths. Paths become adventures.

A hybrid **Word Search + Light RPG** mobile game built in **C# / Unity** for Android.

![Unity](https://img.shields.io/badge/Unity-2022.3%20LTS-black?logo=unity)
![C#](https://img.shields.io/badge/C%23-.NET-blue?logo=csharp)
![Platform](https://img.shields.io/badge/Platform-Android-green?logo=android)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## About

Classic word search mechanics meet light RPG progression. Explore magical worlds, solve puzzles, defeat bosses, collect pets, and build your base across 2000+ levels.

## Features

- 2000 Levels across multiple themed worlds
- Light RPG Systems - pets, base building, progression
- Boss Battles at world milestones
- Adaptive Difficulty
- Cloud Save and Sync
- Android First
- Ink and Starlight art direction

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Engine | Unity 2022.3 LTS |
| Language | C# (.NET) |
| Platform | Android |
| License | MIT |

## Project Structure

Assets/Scripts/Core/          GameManager, GridVisualizer, UI
Assets/Scripts/Data/          LevelData, WorldData, LevelDatabase
Assets/Scripts/Gameplay/      Level loading, save system
Assets/Scripts/WordSearch/    Grid generation, validation
Assets/Scripts/Auth/          Authentication
Assets/Scripts/Multiplayer/   Bot player, race match
Assets/Scripts/Session/       Game session state
Assets/Scenes/Main.unity      Primary scene
Assets/Tests/EditMode/        Unit tests

## Setup

git clone https://github.com/talhaansari75/mera-world.20.git
cd mera-world.20

Open Assets/Scenes/Main.unity in Unity editor.

## Roadmap

- [x] Core Word Search mechanic
- [x] Grid generation and validation
- [x] Level data system
- [ ] 6 Worlds content
- [ ] Pet system
- [ ] Boss battles
- [ ] Base building
- [ ] Beta on Play Store

## License

MIT - see LICENSE file.

## Author

Talha Ansari - @talhaansari75

Made with love in Karachi, Pakistan
