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
        Legend      // Very hard
    }

    public class BotOpponent
    {
        public string Name { get; private set; }
        public BotDifficulty Difficulty { get; private set; }
        public int FoundWords { get; private set; }
        public List<string> FoundWordList { get; private set; } = new List<string>();
        public bool IsFinished => FoundWords >= _targetWords.Count;

        private readonly List<string> _targetWords;
        private readonly System.Random _rng;

        // Speed parameters (seconds per word) — difficulty ke hisaab se
        private float _minTimePerWord;
        private float _maxTimePerWord;

        // Dynamic state
        private float _nextFindTime;
        private float _elapsed;
        private int _mistakesMade = 0;
        private const int MAX_MISTAKES = 2;   // Bot kitni baar "galti" karega (fake delay)

        public event Action<string> OnWordFound;

        public BotOpponent(string name, List<string> targetWords, BotDifficulty difficulty)
        {
            Name = name;
            _targetWords = targetWords;
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

        public void Update(float deltaTime)
        {
            if (IsFinished) return;

            _elapsed += deltaTime;
            if (_elapsed < _nextFindTime) return;

            var remaining = _targetWords.FindAll(w => !FoundWordList.Contains(w));
            if (remaining.Count == 0) return;

            // Bot ka "smart" pick: 
            // Harder difficulty = longer words pehle (zyada impressive lagta hai)
            string word;
            if (Difficulty == BotDifficulty.Champion || Difficulty == BotDifficulty.Legend)
            {
                // Pick the longest remaining word (harder for player to notice)
                word = remaining[0];
                for (int i = 1; i < remaining.Count; i++)
                    if (remaining[i].Length > word.Length) word = remaining[i];
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

        private float GetNextFindDelay(bool isFirstWord)
        {
            // Base random delay
            float baseDelay = Mathf.Lerp(_minTimePerWord, _maxTimePerWord, (float)_rng.NextDouble());

            // First word slightly faster (feels more natural)
            if (isFirstWord) baseDelay *= 0.7f;

            // Occasional mistake (fake "searching" delay)
            if (_mistakesMade < MAX_MISTAKES && _rng.NextDouble() < 0.15)
            {
                _mistakesMade++;
                baseDelay *= 1.6f; // extra delay = fake "looking"
            }

            // Catch-up logic: agar bot peeche hai, speed up
            int playerFound = 0;
            if (GameManager.Instance != null)
                playerFound = GetPlayerFoundCount();

            int diff = playerFound - FoundWords;
            if (diff >= 2)
                baseDelay *= 0.7f;  // Peeche ho to tez
            else if (diff <= -2)
                baseDelay *= 1.2f;  // Aage ho to slow (player ko chance do)

            return baseDelay;
        }

        private int GetPlayerFoundCount()
        {
            // SelectionManager ka found count use karo
            // Simple approach: EventSystem se track karo
            return 0; // Placeholder — bot race mode handle karega
        }

        /// <summary>
        /// Ek difficulty level upar upgrade karo (level progression ke liye).
        /// </summary>
        public static BotDifficulty GetDifficultyForLevel(int level)
        {
            if (level <= 10) return BotDifficulty.Rookie;
            if (level <= 30) return BotDifficulty.Skilled;
            if (level <= 60) return BotDifficulty.Champion;
            return BotDifficulty.Legend;
        }

        public static string GetRandomName()
        {
            string[] names = {
                "Alex", "Sam", "Riley", "Jordan", "Casey", "Morgan",
                "Taylor", "Aiden", "Emma", "Liam", "Maya", "Noah",
                "Zara", "Owen", "Aisha", "Rayan", "Hina", "Bilal",
                "Sara", "Hamza", "Fatima", "Usman", "Layla", "Daniyal",
                "Khan", "Ayesha", "Zain", "Maryam", "Hassan", "Sana"
            };
            return names[UnityEngine.Random.Range(0, names.Length)];
        }
    }
}