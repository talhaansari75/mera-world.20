using System;
using System.Collections.Generic;
using System.Linq;

namespace MeraWorld.Achievements
{
    /// <summary>
    /// Tracks player progress toward achievements.
    /// Pure C# — no Unity dependencies.
    /// </summary>
    public class AchievementManager
    {
        private readonly Dictionary<string, AchievementProgress> _progress = new Dictionary<string, AchievementProgress>();

        public event Action<Achievement, int> OnAchievementUnlocked;

        public AchievementManager()
        {
            foreach (var achievement in AchievementDatabase.All)
            {
                _progress[achievement.Id] = new AchievementProgress(achievement.Id);
            }
        }

        /// <summary>
        /// Increment a counter. Returns list of newly unlocked achievements.
        /// </summary>
        public List<Achievement> AddProgress(string achievementId, int amount = 1)
        {
            var unlocked = new List<Achievement>();

            if (!_progress.ContainsKey(achievementId))
                return unlocked;

            var progress = _progress[achievementId];
            if (progress.Unlocked) return unlocked;

            progress.CurrentValue += amount;

            var definition = AchievementDatabase.GetById(achievementId);
            if (definition == null) return unlocked;

            if (progress.CurrentValue >= definition.TargetValue)
            {
                progress.Unlocked = true;
                progress.CurrentValue = definition.TargetValue;
                progress.UnlockedAtUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                unlocked.Add(definition);
                OnAchievementUnlocked?.Invoke(definition, definition.RewardCoins);
            }

            return unlocked;
        }

        public AchievementProgress GetProgress(string achievementId)
        {
            return _progress.TryGetValue(achievementId, out var p) ? p : null;
        }

        public bool IsUnlocked(string achievementId)
        {
            return GetProgress(achievementId)?.Unlocked ?? false;
        }

        public List<AchievementProgress> GetAllProgress()
        {
            return _progress.Values.ToList();
        }
    }
}