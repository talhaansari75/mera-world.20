using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    public enum BotDifficulty
    {
        Rookie,
        Skilled,
        Champion,
        Legend
    }

    /// <summary>
    /// Bot opponent — 100% human-like behaviour.
    /// Human-like means:
    /// - Variable speed (not consistent)
    /// - Distraction pauses
    /// - Bursts of focus
    /// - Fatigue near end
    /// - Momentum when ahead
    /// - Panic when player is close to winning
    /// - Consistency within a single match
    /// </summary>
    public class BotOpponent
    {
        public string Name { get; private set; }
        public BotDifficulty Difficulty { get; private set; }
        public int FoundWords { get; private set; }
        public List<string> FoundWordList { get; private set; } = new List<string>();
        public bool IsFinished => FoundWords >= _targetWords.Count;

        private readonly List<string> _targetWords;
        private readonly System.Random _rng;

        // Base speed (seconds per word)
        private float _minTimePerWord;
        private float _maxTimePerWord;

        // Per-match "human" personality (locked at construction)
        private float _focusMultiplier;      // 0.85 - 1.15  (how focused today)
        private float _burstiness;           // 0 - 1        (how often bursts happen)
        private float _distractionChance;    // 0.03 - 0.10  (chance of long pause)
        private float _mistakeTendency;      // 0 - 1        (how often wrong attempts)

        // Runtime state
        private float _nextFindTime;
        private float _elapsed;
        private int _mistakesMade = 0;
        private const int MAX_MISTAKES = 3;

        // Player's found count — set by BotRaceMode
        private int _playerFoundCount = 0;
        private int _playerFoundAtLastBotWord = 0;
        private int _botWordStreak = 0;

        public event Action<string> OnWordFound;

        // ---------------------------------------------------------------
        // Construction
        // ---------------------------------------------------------------

        public BotOpponent(string name, List<string> targetWords, BotDifficulty difficulty)
        {
            Name = name;
            _targetWords = targetWords != null ? targetWords : new List<string>();
            _rng = new System.Random();
            Difficulty = difficulty;

            ConfigureDifficulty(difficulty);
            ConfigureHumanPersonality();

            _nextFindTime = GetNextFindDelay(isFirstWord: true);
        }

        private void ConfigureDifficulty(BotDifficulty diff)
        {
            switch (diff)
            {
                case BotDifficulty.Rookie:
                    _minTimePerWord = 6.0f;
                    _maxTimePerWord = 9.0f;
                    break;
                case BotDifficulty.Skilled:
                    _minTimePerWord = 4.0f;
                    _maxTimePerWord = 6.5f;
                    break;
                case BotDifficulty.Champion:
                    _minTimePerWord = 2.8f;
                    _maxTimePerWord = 4.5f;
                    break;
                case BotDifficulty.Legend:
                    _minTimePerWord = 1.8f;
                    _maxTimePerWord = 3.0f;
                    break;
            }
        }

        /// <summary>
        /// Set a random "human" personality for this match.
        /// This is locked for the whole match — same as a real player's mood today.
        /// </summary>
        private void ConfigureHumanPersonality()
        {
            // Focus: 0.85x to 1.15x speed swing
            _focusMultiplier = 0.85f + (float)_rng.NextDouble() * 0.30f;

            // Burstiness: 20% - 50% chance of burst after finding a word
            _burstiness = 0.20f + (float)_rng.NextDouble() * 0.30f;

            // Distraction: 3% - 10% chance of a long pause
            _distractionChance = 0.03f + (float)_rng.NextDouble() * 0.07f;

            // Mistakes: 0.3 - 0.8 tendency
            _mistakeTendency = 0.30f + (float)_rng.NextDouble() * 0.50f;
        }

        // ---------------------------------------------------------------
        // Player score sync (for catch-up and panic logic)
        // ---------------------------------------------------------------

        /// <summary>
        /// Testing ke liye bot ki speed badhao (1x = normal, 15x = super fast).
        /// </summary>
        public void SetSpeedMultiplier(float multiplier)
        {
            if (multiplier <= 0f) multiplier = 1f;
            _minTimePerWord /= multiplier;
            _maxTimePerWord /= multiplier;
            _focusMultiplier = 1f;   // personality slowdown off
            Debug.Log($"[Bot] Speed set to {multiplier}x (now {_minTimePerWord:F2}s - {_maxTimePerWord:F2}s per word)");
        }

        public void SetPlayerFoundCount(int count)
        {
            _playerFoundCount = count;
        }

        // ---------------------------------------------------------------
        // Update
        // ---------------------------------------------------------------

        public void Update(float deltaTime)
        {
            if (IsFinished) return;

            _elapsed += deltaTime;
            if (_elapsed < _nextFindTime) return;

            var remaining = _targetWords.FindAll(w => !FoundWordList.Contains(w));
            if (remaining.Count == 0) return;

            // Champion / Legend: pick longest word (feels smarter)
            string word;
            if (Difficulty == BotDifficulty.Champion || Difficulty == BotDifficulty.Legend)
            {
                word = remaining[0];
                for (int i = 1; i < remaining.Count; i++)
                {
                    if (remaining[i].Length > word.Length)
                        word = remaining[i];
                }
            }
            else
            {
                word = remaining[_rng.Next(remaining.Count)];
            }

            FoundWordList.Add(word);
            FoundWords++;

            // Track streak
            if (FoundWords - _playerFoundAtLastBotWord >= 1)
                _botWordStreak++;
            _playerFoundAtLastBotWord = _playerFoundCount;

            OnWordFound?.Invoke(word);

            _elapsed = 0f;
            _nextFindTime = GetNextFindDelay(isFirstWord: false);
        }

        // ---------------------------------------------------------------
        // Human-like delay calculation
        // ---------------------------------------------------------------

        private float GetNextFindDelay(bool isFirstWord)
        {
            // Base delay: random between min and max
            float baseDelay = Mathf.Lerp(
                _minTimePerWord,
                _maxTimePerWord,
                (float)_rng.NextDouble());

            // === 1. Focus multiplier (fixed for the match) ===
            baseDelay *= _focusMultiplier;

            // === 2. Warm-up: first word takes 25% longer (looking at the grid) ===
            if (isFirstWord)
                baseDelay *= 1.25f;

            // === 3. Fatigue: last 25% of words take 10% longer ===
            float progress = (float)FoundWords / Mathf.Max(1, _targetWords.Count);
            if (progress > 0.75f)
                baseDelay *= 1.10f;

            // === 4. Momentum: bot on a streak of 2+ → 15% faster ===
            if (_botWordStreak >= 2)
                baseDelay *= 0.85f;

            // === 5. Panic: player is 1 word from winning → 25% faster ===
            int playerRemaining = _targetWords.Count - _playerFoundCount;
            if (playerRemaining <= 1 && !IsFinished)
                baseDelay *= 0.75f;

            // === 6. Complacency: bot is 3+ words ahead → 15% slower (chill) ===
            int diff = FoundWords - _playerFoundCount;
            if (diff >= 3)
                baseDelay *= 1.15f;

            // === 7. Catch-up: player is 2+ ahead → 25% faster ===
            if (diff <= -2)
                baseDelay *= 0.75f;

            // === 8. Occasional mistakes (fake searching) ===
            if (_mistakesMade < MAX_MISTAKES && _rng.NextDouble() < _mistakeTendency * 0.3f)
            {
                _mistakesMade++;
                baseDelay *= 1.5f;
            }

            // === 9. Burst mode: after a word, sometimes the next one is fast ===
            if (!isFirstWord && _rng.NextDouble() < _burstiness)
            {
                baseDelay *= 0.55f;   // 45% faster — feels like "I see it!"
            }

            // === 10. Distraction: rare long pause (like a call came) ===
            if (_rng.NextDouble() < _distractionChance)
            {
                baseDelay *= 2.8f;
            }

            // Safety: never less than 0.4 seconds (super human)
            return Mathf.Max(0.4f, baseDelay);
        }

        // ---------------------------------------------------------------
        // Static helpers
        // ---------------------------------------------------------------

        public static BotDifficulty GetDifficultyForLevel(int level)
        {
            if (level <= 10) return BotDifficulty.Rookie;
            if (level <= 30) return BotDifficulty.Skilled;
            if (level <= 60) return BotDifficulty.Champion;
            return BotDifficulty.Legend;
        }

        private static readonly string[] BotNames = {
            "Alex", "Sam", "Riley", "Jordan", "Casey", "Morgan",
            "Taylor", "Aiden", "Emma", "Liam", "Maya", "Noah",
            "Zara", "Owen", "Aisha", "Rayan", "Hina", "Bilal",
            "Sara", "Hamza", "Fatima", "Usman", "Layla", "Daniyal",
            "Khan", "Ayesha", "Zain", "Maryam", "Hassan", "Sana"
        };

        public static string GetRandomName()
        {
            return BotNames[UnityEngine.Random.Range(0, BotNames.Length)];
        }
    }
}

