using System;
using System.Collections.Generic;
using MeraWorld.WordSearch;

namespace MeraWorld.Session
{
    /// <summary>
    /// Tracks one level play session — time, hints, words found.
    /// Pure C#, no Unity dependency.
    /// </summary>
    public class GameSession
    {
        public int LevelNumber { get; private set; }
        public WordGrid Grid { get; private set; }
        public IReadOnlyList<string> WordsToFind { get; private set; }

        public DateTime StartTime { get; private set; }
        public int HintsUsed { get; private set; }
        public List<string> FoundWords { get; private set; } = new List<string>();
        public bool IsComplete { get; private set; }
        public bool IsFailed { get; private set; }

        public int ElapsedSeconds => (int)(DateTime.UtcNow - StartTime).TotalSeconds;
        public int WordsRemaining => WordsToFind.Count - FoundWords.Count;

        public GameSession(int levelNumber, WordGrid grid, IReadOnlyList<string> wordsToFind)
        {
            LevelNumber = levelNumber;
            Grid = grid;
            WordsToFind = wordsToFind;
            StartTime = DateTime.UtcNow;
        }

        public bool RegisterFoundWord(string word)
        {
            if (IsComplete || IsFailed) return false;
            if (string.IsNullOrWhiteSpace(word)) return false;

            word = word.ToUpperInvariant();
            if (FoundWords.Contains(word)) return false;

            foreach (var target in WordsToFind)
            {
                if (target == word)
                {
                    FoundWords.Add(word);
                    if (WordsRemaining == 0) IsComplete = true;
                    return true;
                }
            }
            return false;
        }

        public void UseHint()
        {
            if (IsComplete || IsFailed) return;
            HintsUsed++;
        }

        public void MarkFailed()
        {
            if (IsComplete) return;
            IsFailed = true;
        }

        public int CalculateStars()
        {
            if (!IsComplete) return 0;
            int stars = 1;
            if (HintsUsed == 0) stars++;
            if (HintsUsed == 0 && ElapsedSeconds < 60) stars++;
            return stars > 3 ? 3 : stars;
        }
    }
}