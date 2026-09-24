using System;
using System.Collections.Generic;

namespace MeraWorld.Multiplayer
{
    /// <summary>
    /// Records player behavior while playing levels.
    /// Data used to auto-tune bot difficulty.
    /// Pure C# — no Unity dependency.
    /// </summary>
    public class BehaviorTracker
    {
        [Serializable]
        public class LevelRecord
        {
            public int LevelNumber;
            public int TimeSeconds;
            public int WordsFound;
            public int HintsUsed;
            public int WrongSelections;
            public int StarsEarned;
            public long PlayedAtUnixSeconds;
        }

        [Serializable]
        public class PlayerProfile
        {
            public List<LevelRecord> Records = new List<LevelRecord>();
            public int TotalLevelsPlayed;
            public int TotalWordsFound;
            public int TotalHintsUsed;
            public int TotalWrongSelections;
            public int TotalTimeSeconds;

            // Averages — calculated on the fly
            public float AverageSecondsPerLevel =>
                TotalLevelsPlayed > 0 ? (float)TotalTimeSeconds / TotalLevelsPlayed : 30f;

            public float AverageHintsPerLevel =>
                TotalLevelsPlayed > 0 ? (float)TotalHintsUsed / TotalLevelsPlayed : 1f;

            public float AverageWrongSelectionsPerLevel =>
                TotalLevelsPlayed > 0 ? (float)TotalWrongSelections / TotalLevelsPlayed : 2f;
        }

        public PlayerProfile Profile { get; private set; } = new PlayerProfile();

        public event Action<LevelRecord> OnLevelCompleted;

        /// <summary>
        /// Called when a level finishes.
        /// </summary>
        public void RecordLevel(int levelNumber, int timeSeconds, int wordsFound,
            int hintsUsed, int wrongSelections, int starsEarned)
        {
            var record = new LevelRecord
            {
                LevelNumber = levelNumber,
                TimeSeconds = timeSeconds,
                WordsFound = wordsFound,
                HintsUsed = hintsUsed,
                WrongSelections = wrongSelections,
                StarsEarned = starsEarned,
                PlayedAtUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            };

            Profile.Records.Add(record);
            Profile.TotalLevelsPlayed++;
            Profile.TotalWordsFound += wordsFound;
            Profile.TotalHintsUsed += hintsUsed;
            Profile.TotalWrongSelections += wrongSelections;
            Profile.TotalTimeSeconds += timeSeconds;

            OnLevelCompleted?.Invoke(record);
        }

        /// <summary>
        /// Calculate bot difficulty multiplier based on player skill.
        /// Returns 0.5 (very easy bot) to 2.0 (very hard bot).
        /// </summary>
        public float GetBotDifficultyMultiplier(int lastNLevels = 5)
        {
            if (Profile.Records.Count == 0) return 1.0f;

            var recent = Profile.Records.Count > lastNLevels
                ? Profile.Records.GetRange(Profile.Records.Count - lastNLevels, lastNLevels)
                : Profile.Records;

            float avgStars = 0f;
            float avgHints = 0f;
            foreach (var r in recent)
            {
                avgStars += r.StarsEarned;
                avgHints += r.HintsUsed;
            }
            avgStars /= recent.Count;
            avgHints /= recent.Count;

            // High stars + low hints → player is skilled → bot faster
            float skill = (avgStars / 3f) + (1f - Math.Min(avgHints / 3f, 1f));
            skill /= 2f; // 0.0 to 1.0

            // Multiplier: 0.5 (easy) to 2.0 (hard)
            return 0.5f + skill * 1.5f;
        }

        /// <summary>
        /// Reset all recorded behavior.
        /// </summary>
        public void Reset()
        {
            Profile = new PlayerProfile();
        }
    }
}