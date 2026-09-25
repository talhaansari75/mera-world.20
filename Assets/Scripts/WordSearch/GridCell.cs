using System;

namespace MeraWorld.WordSearch
{
    /// <summary>
    /// Represents a single cell in the word search grid.
    /// Each cell holds one letter and tracks its position + state.
    /// </summary>
    public class GridCell
    {
        public int Row { get; private set; }
        public int Column { get; private set; }
        public char Letter { get; set; }
        public bool IsSelected { get; set; }
        public bool IsPartOfFoundWord { get; set; }

        public GridCell(int row, int column, char letter)
        {
            Row = row;
            Column = column;
            Letter = letter;
            IsSelected = false;
            IsPartOfFoundWord = false;
        }

        public void Reset()
        {
            IsSelected = false;
            IsPartOfFoundWord = false;
        }

        public override string ToString()
        {
            return $"[{Row},{Column}]={Letter}";
        }
    }
}