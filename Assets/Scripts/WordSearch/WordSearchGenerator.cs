using System;
using System.Collections.Generic;

namespace MeraWorld.WordSearch
{
    /// <summary>
    /// Generates a complete word search puzzle from a list of words.
    /// Tries multiple random positions for each word until one fits.
    /// </summary>
    public static class WordSearchGenerator
    {
        public class Result
        {
            public WordGrid Grid { get; set; }
            public List<string> PlacedWords { get; set; } = new List<string>();
            public List<string> FailedWords { get; set; } = new List<string>();
        }

        public static Result Generate(int rows, int columns, IEnumerable<string> words, int seed = 0, int maxAttemptsPerWord = 200)
        {
            if (words == null) throw new ArgumentNullException(nameof(words));

            var rng = seed == 0 ? new Random() : new Random(seed);
            var grid = new WordGrid(rows, columns);
            var result = new Result { Grid = grid };

            foreach (var rawWord in words)
            {
                if (string.IsNullOrWhiteSpace(rawWord)) continue;
                var word = rawWord.ToUpperInvariant();

                if (word.Length > Math.Max(rows, columns))
                {
                    result.FailedWords.Add(word);
                    continue;
                }

                bool placed = false;
                for (int attempt = 0; attempt < maxAttemptsPerWord && !placed; attempt++)
                {
                    int r = rng.Next(rows);
                    int c = rng.Next(columns);
                    var dir = DirectionHelper.All()[rng.Next(8)];

                    if (WordPlacer.TryPlace(grid, word, r, c, dir))
                    {
                        result.PlacedWords.Add(word);
                        placed = true;
                    }
                }

                if (!placed)
                    result.FailedWords.Add(word);
            }

            grid.FillWithRandomLetters(rng);
            return result;
        }
    }
}