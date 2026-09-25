using System;
using System.Collections.Generic;

namespace MeraWorld.Gameplay
{
    /// <summary>
    /// Plain data class for player progress.
    /// No Unity dependencies — can be tested standalone.
    /// Later serialized by Unity's JsonUtility or similar.
    /// </summary>
    [Serializable]
    public class SaveData
    {
        public int CurrentLevel = 1;
        public int HighestLevelUnlocked = 1;
        public int TotalStars = 0;
        public int TotalWordsFound = 0;
        public int Coins = 0;
        public long LastPlayedUnixSeconds = 0;

        // Per-level best performance (level number -> stars 0-3)
        public List<LevelProgress> LevelProgresses = new List<LevelProgress>();
    }

    [Serializable]
    public class LevelProgress
    {
        public int LevelNumber;
        public int Stars;
        public int BestTimeSeconds;
        public int WordsFound;

        public LevelProgress() { }

        public LevelProgress(int levelNumber, int stars, int bestTime, int wordsFound)
        {
            LevelNumber = levelNumber;
            Stars = stars;
            BestTimeSeconds = bestTime;
            WordsFound = wordsFound;
        }
    }
}