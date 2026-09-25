using System;
using System.Collections.Generic;

namespace MeraWorld.WordSearch
{
    /// <summary>
    /// Manages a 2D grid of letters for the word search game.
    /// Handles grid creation, word placement, and cell access.
    /// </summary>
    public class WordGrid
    {
        private readonly int _rows;
        private readonly int _columns;
        private readonly GridCell[,] _cells;
        private readonly List<string> _placedWords = new List<string>();

        public int Rows => _rows;
        public int Columns => _columns;
        public IReadOnlyList<string> PlacedWords => _placedWords;

        public WordGrid(int rows, int columns)
        {
            if (rows <= 0 || columns <= 0)
                throw new ArgumentException("Grid dimensions must be positive.");

            _rows = rows;
            _columns = columns;
            _cells = new GridCell[rows, columns];

            for (int r = 0; r < rows; r++)
                for (int c = 0; c < columns; c++)
                    _cells[r, c] = new GridCell(r, c, ' ');
        }

        public GridCell GetCell(int row, int column)
        {
            if (row < 0 || row >= _rows || column < 0 || column >= _columns)
                return null;

            return _cells[row, column];
        }

        public void SetLetter(int row, int column, char letter)
        {
            var cell = GetCell(row, column);
            if (cell != null)
                cell.Letter = char.ToUpperInvariant(letter);
        }

        public void FillWithRandomLetters(Random rng)
        {
            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            for (int r = 0; r < _rows; r++)
                for (int c = 0; c < _columns; c++)
                    if (_cells[r, c].Letter == ' ')
                        _cells[r, c].Letter = alphabet[rng.Next(alphabet.Length)];
        }

        public void RegisterPlacedWord(string word)
        {
            if (!string.IsNullOrWhiteSpace(word) && !_placedWords.Contains(word.ToUpperInvariant()))
                _placedWords.Add(word.ToUpperInvariant());
        }

        public void ResetSelection()
        {
            for (int r = 0; r < _rows; r++)
                for (int c = 0; c < _columns; c++)
                    _cells[r, c].Reset();
        }

        public string ToDisplayString()
        {
            var sb = new System.Text.StringBuilder();
            for (int r = 0; r < _rows; r++)
            {
                for (int c = 0; c < _columns; c++)
                    sb.Append(_cells[r, c].Letter).Append(' ');
                sb.AppendLine();
            }
            return sb.ToString();
        }
    }
}