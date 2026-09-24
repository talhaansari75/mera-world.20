using System;
using System.Collections.Generic;
using System.Linq;
using MeraWorld.WordSearch;

namespace MeraWorld.Gameplay
{
    /// <summary>
    /// Generates any level (1 to 2000+) procedurally from the word bank.
    /// Same level number always produces the same puzzle.
    /// </summary>
    public static class LevelGenerator
    {
        public class WordEntry
        {
            public string Word;
            public string Difficulty;
            public string Category;
        }

        public static int GetGridSizeForLevel(int levelNumber)
        {
            if (levelNumber <= 30) return 6;
            if (levelNumber <= 100) return 7;
            if (levelNumber <= 500) return 8;
            if (levelNumber <= 1500) return 9;
            return 10;
        }

        public static int GetWordCountForLevel(int levelNumber)
        {
            if (levelNumber <= 30) return 4;
            if (levelNumber <= 100) return 5;
            if (levelNumber <= 500) return 6;
            if (levelNumber <= 1500) return 7;
            return 8;
        }

        public static string GetDifficultyForLevel(int levelNumber)
        {
            if (levelNumber <= 100) return "easy";
            if (levelNumber <= 500) return "medium";
            return "hard";
        }

        public static List<string> GetWordsForLevel(int levelNumber, List<WordEntry> wordBank)
        {
            if (wordBank == null || wordBank.Count == 0)
                throw new ArgumentException("Word bank is empty.");

            var difficulty = GetDifficultyForLevel(levelNumber);
            var wordCount = GetWordCountForLevel(levelNumber);

            var pool = wordBank.Where(w => w.Difficulty == difficulty).ToList();

            if (pool.Count < wordCount)
                pool = wordBank.ToList();

            var rng = new Random(levelNumber * 7919);
            var shuffled = pool.OrderBy(_ => rng.Next()).ToList();

            return shuffled.Take(wordCount).Select(w => w.Word).ToList();
        }

        public static WordSearchGenerator.Result GenerateLevel(int levelNumber, List<WordEntry> wordBank)
        {
            int gridSize = GetGridSizeForLevel(levelNumber);
            var words = GetWordsForLevel(levelNumber, wordBank);
            return WordSearchGenerator.Generate(gridSize, gridSize, words, seed: levelNumber);
        }

        public static List<WordEntry> ParseWordBankCsv(string csvContent)
        {
            var result = new List<WordEntry>();
            var lines = csvContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 1; i < lines.Length; i++)
            {
                var parts = lines[i].Split(',');
                if (parts.Length < 2) continue;

                result.Add(new WordEntry
                {
                    Word = parts[0].Trim().ToUpperInvariant(),
                    Difficulty = parts[1].Trim().ToLowerInvariant(),
                    Category = parts.Length > 2 ? parts[2].Trim() : "general"
                });
            }

            return result;
        }
    }
}