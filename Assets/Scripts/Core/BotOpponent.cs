using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    public enum BotDifficulty
    {
        Rookie,     // Easy
        Skilled,    // Medium
        Champion,   // Hard
        Legend      // Very Hard
    }

    /// <summary>
    /// Bot opponent — simulates a real player finding words.
    /// Difficulty affects speed, mistakes, and catch-up logic.
    /// This is a plain C# class (not MonoBehaviour).
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

        // Speed parameters (seconds per word)
        private float _minTimePerWord;
        private float _maxTimePerWord;

        // Runtime state
        private float _nextFindTime;
        private float _elapsed;
        private int _mistakesMade = 0;
        private const int MAX_MISTAKES = 2;

        // Player's current found count — set by BotRaceMode
        private int _playerFoundCount = 0;

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

        // ---------------------------------------------------------------
        // Player score sync (for catch-up logic)
        // ---------------------------------------------------------------

        public void SetPlayerFoundCount(int count)
        {
            _playerFoundCount = count;
        }

        private int GetPlayerFoundCount()
        {
            return _playerFoundCount;
        }

        // ---------------------------------------------------------------
        // Update — call from MonoBehaviour Update()
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

            OnWordFound?.Invoke(word);

            _elapsed = 0f;
            _nextFindTime = GetNextFindDelay(isFirstWord: false);
        }

        // ---------------------------------------------------------------
        // Delay calculation
        // ---------------------------------------------------------------

        private float GetNextFindDelay(bool isFirstWord)
        {
            float baseDelay = Mathf.Lerp(
                _minTimePerWord,
                _maxTimePerWord,
                (float)_rng.NextDouble());

            if (isFirstWord)
                baseDelay *= 0.7f;

            // Occasional "mistake" (fake searching delay)
            if (_mistakesMade < MAX_MISTAKES && _rng.NextDouble() < 0.15)
            {
                _mistakesMade++;
                baseDelay *= 1.6f;
            }

            // Catch-up / slowdown logic
            int diff = GetPlayerFoundCount() - FoundWords;
            if (diff >= 2)
                baseDelay *= 0.7f;   // Bot behind → speed up
            else if (diff <= -2)
                baseDelay *= 1.2f;   // Bot ahead → slow down (give player chance)

            return baseDelay;
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