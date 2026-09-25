namespace MeraWorld.WordSearch
{
    /// <summary>
    /// 8 possible directions a word can be placed in the grid.
    /// </summary>
    public enum Direction
    {
        Right,          // →
        Left,           // ←
        Down,           // ↓
        Up,             // ↑
        DownRight,      // ↘
        DownLeft,       // ↙
        UpRight,        // ↗
        UpLeft          // ↖
    }

    public static class DirectionHelper
    {
        public static (int dr, int dc) ToOffset(this Direction dir)
        {
            return dir switch
            {
                Direction.Right => (0, 1),
                Direction.Left => (0, -1),
                Direction.Down => (1, 0),
                Direction.Up => (-1, 0),
                Direction.DownRight => (1, 1),
                Direction.DownLeft => (1, -1),
                Direction.UpRight => (-1, 1),
                Direction.UpLeft => (-1, -1),
                _ => (0, 0)
            };
        }

        private static readonly Direction[] _all = (Direction[])System.Enum.GetValues(typeof(Direction));

        public static Direction[] All()
        {
            return _all;
        }
    }
}