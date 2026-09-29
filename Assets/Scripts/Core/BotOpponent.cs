using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    public class BotOpponent
    {
        public string Name { get; private set; }
        public int FoundWords { get; private set; }
        public List<string> FoundWordList { get; private set; } = new List<string>();
        public bool IsFinished => FoundWords >= _targetWords.Count;

        private readonly List<string> _targetWords;
        private readonly float _timePerWord;
        private float _nextFindTime;
        private float _elapsed;
        private readonly System.Random _rng;

        public BotOpponent(string name, List<string> targetWords, float difficultyMultiplier = 1f)
        {
            Name = name;
            _targetWords = targetWords;
            _rng = new System.Random();

            // Base: 6 seconds per word, easy
            // Difficulty multiplier: 1.0 = medium, 0.5 = fast, 1.5 = slow
            _timePerWord = 6f * difficultyMultiplier;

            _nextFindTime = GetNextFindDelay();
        }

        public event Action<string> OnWordFound;

        public void Update(float deltaTime)
        {
            if (IsFinished) return;

            _elapsed += deltaTime;
            if (_elapsed < _nextFindTime) return;

            // Find next unfound word
            var remaining = _targetWords.FindAll(w => !FoundWordList.Contains(w));
            if (remaining.Count == 0) return;

            string word = remaining[_rng.Next(remaining.Count)];
            FoundWordList.Add(word);
            FoundWords++;

            OnWordFound?.Invoke(word);

            _elapsed = 0f;
            _nextFindTime = GetNextFindDelay();
        }

        private float GetNextFindDelay()
        {
            // Random variance: 60% to 140% of base time
            float variance = 0.6f + (float)_rng.NextDouble() * 0.8f;
            return _timePerWord * variance;
        }
    }
}