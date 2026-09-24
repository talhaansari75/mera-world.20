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
    /// Bot "finds" words at configurable speed based on difficulty.
    /// Pure C# — no Unity dependencies.
    /// </summary>
    public class BotPlayer
    {
        public string Name { get; set; }
        public BotDifficulty Difficulty { get; private set; }
        public List<string> FoundWords { get; private set; } = new List<string>();
        public bool IsFinished => FoundWords.Count >= _wordsToFind.Count;

        private readonly IReadOnlyList<string> _wordsToFind;
        private readonly Random _rng;
        private float _timeUntilNextFind;
        private readonly float _averageSecondsPerWord;

        // Per difficulty: average seconds the bot takes to find ONE word
        private static readonly Dictionary<BotDifficulty, float> BaseSpeed = new Dictionary<BotDifficulty, float>
        {
            { BotDifficulty.Easy,   8.0f },   // slow — player wins easily
            { BotDifficulty.Medium, 5.0f },   // balanced
            { BotDifficulty.Hard,   3.0f },   // fast — player must be sharp
            { BotDifficulty.Expert, 1.5f }    // very fast — for pros
        };

        public BotPlayer(string name, BotDifficulty difficulty, IReadOnlyList<string> wordsToFind, int seed = 0)
        {
            Name = name;
            Difficulty = difficulty;
            _wordsToFind = wordsToFind ?? throw new ArgumentNullException(nameof(wordsToFind));
            _rng = seed == 0 ? new Random() : new Random(seed);
            _averageSecondsPerWord = BaseSpeed[difficulty];
            _timeUntilNextFind = NextFindDelay();
        }

        /// <summary>
        /// Called every frame by the game loop with delta time (seconds).
        /// Returns the word the bot just found, or null if no find this frame.
        /// </summary>
        public string Update(float deltaSeconds)
        {
            if (IsFinished) return null;

            _timeUntilNextFind -= deltaSeconds;
            if (_timeUntilNextFind > 0f) return null;

            // Time to find the next word
            var remaining = RemainingWords();
            if (remaining.Count == 0) return null;

            var found = remaining[_rng.Next(remaining.Count)];
            FoundWords.Add(found);
            _timeUntilNextFind = NextFindDelay();

            return found;
        }

        /// <summary>
        /// Reset bot for a new match with the same word list.
        /// </summary>
        public void Reset()
        {
            FoundWords.Clear();
            _timeUntilNextFind = NextFindDelay();
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
        /// Adds randomness to bot speed — so it doesn't look robotic.
        /// ±30% variance around base speed.
        /// </summary>
        private float NextFindDelay()
        {
            float variance = 0.7f + (float)_rng.NextDouble() * 0.6f; // 0.7 to 1.3
            return _averageSecondsPerWord * variance;
        }
    }
}