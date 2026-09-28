using System;
using System.Collections.Generic;
using MeraWorld.WordSearch;

namespace MeraWorld.Multiplayer
{
    public enum BotDifficulty
    {
        Easy,
        Medium,
        Hard,
        Expert
    }

    /// <summary>
    /// A bot that races against the player in word search.
    /// - Difficulty scales automatically with level number
    /// - Behaves like a human (random pauses, occasional mistakes)
    /// - Has a human-looking name
    /// </summary>
    public class BotPlayer
    {
        public string Name { get; private set; }
        public BotDifficulty Difficulty { get; private set; }
        public List<string> FoundWords { get; private set; } = new List<string>();
        public bool IsFinished => FoundWords.Count >= _wordsToFind.Count;

        private readonly IReadOnlyList<string> _wordsToFind;
        private readonly Random _rng;
        private float _timeUntilNextFind;
        private float _averageSecondsPerWord;
        private int _wordsTriedSinceLastFind;
        private readonly int _mistakeFrequency;

        // Human-looking names — no "Bot" in the name
        private static readonly string[] BotNames = new[]
        {
            "Alex", "Sam", "Riley", "Jordan", "Casey", "Morgan", "Taylor",
            "Aiden", "Emma", "Liam", "Maya", "Noah", "Zara", "Owen",
            "Aisha", "Rayan", "Hina", "Bilal", "Sana", "Hamza"
        };

        private static readonly Dictionary<BotDifficulty, float> BaseSpeed = new Dictionary<BotDifficulty, float>
        {
            { BotDifficulty.Easy,   8.0f },
            { BotDifficulty.Medium, 5.0f },
            { BotDifficulty.Hard,   3.0f },
            { BotDifficulty.Expert, 1.8f }
        };

        public BotPlayer(
            BotDifficulty difficulty,
            IReadOnlyList<string> wordsToFind,
            int? seed = null,
            string overrideName = null)
        {
            Difficulty = difficulty;
            _wordsToFind = wordsToFind ?? throw new ArgumentNullException(nameof(wordsToFind));
            _rng = seed.HasValue ? new Random(seed.Value) : new Random();
            _averageSecondsPerWord = BaseSpeed[difficulty];

            // Human-like random name
            Name = overrideName ?? BotNames[_rng.Next(BotNames.Length)];

            // Mistakes: easy bots "try" more before finding
            _mistakeFrequency = difficulty switch
            {
                BotDifficulty.Easy => 3,      // 1 mistake every 3 attempts
                BotDifficulty.Medium => 5,
                BotDifficulty.Hard => 10,
                BotDifficulty.Expert => 20,   // almost never
                _ => 5
            };

            _timeUntilNextFind = NextFindDelay();
        }

        /// <summary>
        /// Calculate difficulty based on player's level number.
        /// Level 1-10 → Easy, 11-50 → Medium, 51-200 → Hard, 200+ → Expert.
        /// </summary>
        public static BotDifficulty DifficultyForLevel(int levelNumber)
        {
            if (levelNumber <= 10) return BotDifficulty.Easy;
            if (levelNumber <= 50) return BotDifficulty.Medium;
            if (levelNumber <= 200) return BotDifficulty.Hard;
            return BotDifficulty.Expert;
        }

        /// <summary>
        /// Factory — create a bot appropriate for the player's current level.
        /// </summary>
        public static BotPlayer CreateForLevel(int levelNumber, IReadOnlyList<string> wordsToFind, int? seed = null)
        {
            var difficulty = DifficultyForLevel(levelNumber);
            return new BotPlayer(difficulty, wordsToFind, seed);
        }

        /// <summary>
        /// Called every frame. Returns the word the bot just found, or null.
        /// </summary>
        public string Update(float deltaSeconds)
        {
            if (IsFinished) return null;

            _timeUntilNextFind -= deltaSeconds;
            if (_timeUntilNextFind > 0f) return null;

            // Simulate "trying" a word that might be a mistake
            _wordsTriedSinceLastFind++;
            if (_wordsTriedSinceLastFind < _mistakeFrequency)
            {
                // Bot "failed" this attempt — small delay and try again
                _timeUntilNextFind = 0.5f + (float)_rng.NextDouble() * 1.5f;
                return null;
            }

            // Success this time
            _wordsTriedSinceLastFind = 0;

            var remaining = RemainingWords();
            if (remaining.Count == 0) return null;

            var found = remaining[_rng.Next(remaining.Count)];
            FoundWords.Add(found);
            _timeUntilNextFind = NextFindDelay();

            return found;
        }

        public void Reset()
        {
            FoundWords.Clear();
            _timeUntilNextFind = NextFindDelay();
            _wordsTriedSinceLastFind = 0;
        }

        private List<string> RemainingWords()
        {
            var remaining = new List<string>();
            foreach (var w in _wordsToFind)
                if (!FoundWords.Contains(w))
                    remaining.Add(w);
            return remaining;
        }

        /// <summary>
        /// ±30% variance so it looks human, not robotic.
        /// Occasionally longer "thinking" pause (5% chance).
        /// </summary>
        private float NextFindDelay()
        {
            float variance = 0.7f + (float)_rng.NextDouble() * 0.6f;
            float delay = _averageSecondsPerWord * variance;

            // 5% chance of a long pause (like human distracted)
            if (_rng.NextDouble() < 0.05)
                delay *= 2.5f;

            return delay;
        }
    }
}