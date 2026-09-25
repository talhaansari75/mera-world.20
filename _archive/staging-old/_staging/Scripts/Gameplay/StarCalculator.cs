namespace MeraWorld.Gameplay
{
    /// <summary>
    /// Calculates how many stars a player earned on a level.
    /// Max = 3 stars. Simple rules — can be tuned later.
    /// </summary>
    public static class StarCalculator
    {
        public const int MaxStars = 3;

        /// <summary>
        /// Rules:
        ///   1 star  = finished the level
        ///   2 stars = finished with 0 hints used
        ///   3 stars = finished with 0 hints AND under 60 seconds
        /// </summary>
        public static int Calculate(int timeSeconds, int hintsUsed, bool completed)
        {
            if (!completed) return 0;

            int stars = 1;

            if (hintsUsed == 0) stars++;
            if (hintsUsed == 0 && timeSeconds <= 60) stars++;

            return stars > MaxStars ? MaxStars : stars;
        }
    }
}