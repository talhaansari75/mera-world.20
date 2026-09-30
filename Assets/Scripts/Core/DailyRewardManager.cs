using System;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Daily login reward system with 7-day cycle.
    /// </summary>
    public static class DailyRewardManager
    {
        private const string KEY_LAST_CLAIM = "Daily_LastClaim";
        private const string KEY_STREAK = "Daily_Streak";
        private const int TOTAL_DAYS = 7;

        public struct DayReward
        {
            public int Coins;
            public int Gems;
            public bool IsBonus;
        }

        private static readonly DayReward[] Rewards = new DayReward[]
        {
            new DayReward { Coins = 100,  Gems = 0, IsBonus = false },
            new DayReward { Coins = 200,  Gems = 0, IsBonus = false },
            new DayReward { Coins = 300,  Gems = 1, IsBonus = false },
            new DayReward { Coins = 400,  Gems = 1, IsBonus = false },
            new DayReward { Coins = 500,  Gems = 2, IsBonus = false },
            new DayReward { Coins = 750,  Gems = 3, IsBonus = false },
            new DayReward { Coins = 1500, Gems = 5, IsBonus = true  },
        };

        public static int CurrentStreak => PlayerPrefs.GetInt(KEY_STREAK, 0);
        public static int CurrentDayIndex => CurrentStreak % TOTAL_DAYS;

        public static bool CanClaim()
        {
            string last = PlayerPrefs.GetString(KEY_LAST_CLAIM, "");
            if (string.IsNullOrEmpty(last)) return true;

            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            return last != today;
        }

        public static DayReward GetTodayReward()
        {
            return Rewards[CurrentDayIndex];
        }

        public static bool ClaimReward()
        {
            if (!CanClaim()) return false;

            var reward = GetTodayReward();

            if (PlayerProgressManager.Instance != null && reward.Coins > 0)
                PlayerProgressManager.Instance.AddCoins(reward.Coins);

            if (StatisticsManager.Instance != null)
                StatisticsManager.Instance.AddCoinsEarned(reward.Coins);

            int newStreak = CurrentStreak + 1;
            PlayerPrefs.SetInt(KEY_STREAK, newStreak);
            PlayerPrefs.SetString(KEY_LAST_CLAIM, DateTime.UtcNow.ToString("yyyy-MM-dd"));
            PlayerPrefs.Save();

            Debug.Log($"[Daily] Day {CurrentDayIndex + 1} claimed: +{reward.Coins} coins, +{reward.Gems} gems");
            return true;
        }

        public static void ResetAll()
        {
            PlayerPrefs.DeleteKey(KEY_LAST_CLAIM);
            PlayerPrefs.DeleteKey(KEY_STREAK);
            PlayerPrefs.Save();
        }

        public static DayReward GetRewardForDay(int dayIndex)
        {
            if (dayIndex < 0 || dayIndex >= TOTAL_DAYS) return Rewards[0];
            return Rewards[dayIndex];
        }

        public static int TotalDays => TOTAL_DAYS;
    }
}