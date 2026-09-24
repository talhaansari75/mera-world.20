using System;

namespace MeraWorld.Achievements
{
    /// <summary>
    /// Definition of a single achievement.
    /// </summary>
    public class Achievement
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int TargetValue { get; set; }
        public int RewardCoins { get; set; }

        public Achievement(string id, string title, string description, int targetValue, int rewardCoins)
        {
            Id = id;
            Title = title;
            Description = description;
            TargetValue = targetValue;
            RewardCoins = rewardCoins;
        }
    }

    /// <summary>
    /// Runtime state of an achievement — how much progress player has made.
    /// </summary>
    [Serializable]
    public class AchievementProgress
    {
        public string Id;
        public int CurrentValue;
        public bool Unlocked;
        public long UnlockedAtUnixSeconds;

        public AchievementProgress() { }

        public AchievementProgress(string id)
        {
            Id = id;
            CurrentValue = 0;
            Unlocked = false;
            UnlockedAtUnixSeconds = 0;
        }
    }
}