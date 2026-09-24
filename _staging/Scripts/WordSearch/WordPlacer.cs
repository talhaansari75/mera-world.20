using System;

namespace MeraWorld.WordSearch
{
    /// <summary>
    /// Handles placing a single word into the grid at a given position and direction.
    /// Verifies the word fits and does not conflict with existing letters.
    /// </summary>
    public static class WordPlacer
    {
        /// <summary>
        /// Try to place a word in the grid. Returns true if successful.
        /// If it fails, no changes are made to the grid.
        /// </summary>
        public static bool TryPlace(WordGrid grid, string word, int startRow, int startCol, Direction direction)
        {
            if (grid == null) throw new ArgumentNullException(nameof(grid));
            if (string.IsNullOrWhiteSpace(word)) return false;

            word = word.ToUpperInvariant();
            var (dr, dc) = direction.ToOffset();

            // Calculate end position
            int endRow = startRow + dr * (word.Length - 1);
            int endCol = startCol + dc * (word.Length - 1);

            // Boundary check
            if (startRow < 0 || startCol < 0) return false;
            if (endRow < 0 || endRow >= grid.Rows) return false;
            if (endCol < 0 || endCol >= grid.Columns) return false;

            // Conflict check — every cell must be empty OR already have the same letter
            for (int i = 0; i < word.Length; i++)
            {
                int r = startRow + dr * i;
                int c = startCol + dc * i;
                var cell = grid.GetCell(r, c);

                if (cell.Letter != ' ' && cell.Letter != word[i])
                    return false;
            }

            // No conflict — commit the placement
            for (int i = 0; i < word.Length; i++)
            {
                int r = startRow + dr * i;
                int c = startCol + dc * i;
                grid.SetLetter(r, c, word[i]);
            }

            grid.RegisterPlacedWord(word);
            return true;
        }
    }
}