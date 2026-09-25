using System;
using System.Collections.Generic;
using System.Text;

namespace MeraWorld.WordSearch
{
    /// <summary>
    /// Validates whether a player's selection forms a real word in the grid.
    /// Selection must be a straight line (row, column, or diagonal).
    /// </summary>
    public static class WordValidator
    {
        /// <summary>
        /// Given a list of selected cells, returns the word they spell
        /// if they form a straight line — otherwise returns null.
        /// </summary>
        public static string ExtractWord(IReadOnlyList<GridCell> selectedCells)
        {
            if (selectedCells == null || selectedCells.Count < 2) return null;

            var first = selectedCells[0];
            var second = selectedCells[1];

            int dr = Math.Sign(second.Row - first.Row);
            int dc = Math.Sign(second.Column - first.Column);
            if (dr == 0 && dc == 0) return null;

            // Must be a straight line — either dr or dc (or both) is ±1
            if (Math.Abs(second.Row - first.Row) > 1 || Math.Abs(second.Column - first.Column) > 1)
                return null;

            // Verify all subsequent cells follow the same direction step
            var sb = new StringBuilder();
            sb.Append(first.Letter);

            for (int i = 1; i < selectedCells.Count; i++)
            {
                var prev = selectedCells[i - 1];
                var curr = selectedCells[i];

                if (curr.Row - prev.Row != dr || curr.Column - prev.Column != dc)
                    return null;

                sb.Append(curr.Letter);
            }

            return sb.ToString();
        }

        /// <summary>
        /// Checks if the selected cells spell a word that was placed in the grid.
        /// </summary>
        public static bool IsPlacedWord(WordGrid grid, IReadOnlyList<GridCell> selectedCells)
        {
            if (grid == null) return false;
            var word = ExtractWord(selectedCells);
            if (word == null) return false;

            var reversed = Reverse(word);
            foreach (var placed in grid.PlacedWords)
            {
                if (placed == word || placed == reversed)
                    return true;
            }
            return false;
        }

        private static string Reverse(string s)
        {
            var arr = s.ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }
    }
}