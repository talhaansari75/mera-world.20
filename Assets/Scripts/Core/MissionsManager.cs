using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Daily and weekly missions with real progress tracking.
    /// Auto-resets daily/weekly.
    /// </summary>
    public class MissionsManager : MonoBehaviour
    {
        public static MissionsManager Instance { get; private set; }

        public class Mission
        {
            public string Id;
            public string Title;
            public string Description;
            public int TargetCount;
            public int CoinReward;
            public int GemReward;
            public bool IsWeekly;
        }

        private const string KEY_PREFIX = "Mission_";
        private const string KEY_LAST_DAILY_RESET = "Mission_LastDailyReset";
        private const string KEY_LAST_WEEKLY_RESET = "Mission_LastWeeklyReset";

        public event Action<Mission, int> OnMissionProgress;
        public event Action<Mission> OnMissionComplete;

        // ---- Mission definitions ----
        private readonly Mission[] _dailyMissions = new Mission[]
        {
            new Mission { Id = "daily_words_10", Title = "Word Finder", Description = "Find 10 words",
                TargetCount = 10, CoinReward = 50, GemReward = 0, IsWeekly = false },
            new Mission { Id = "daily_levels_2", Title = "Level Master", Description = "Complete 2 levels",
                TargetCount = 2, CoinReward = 75, GemReward = 0, IsWeekly = false },
            new Mission { Id = "daily_combo_3", Title = "Combo King", Description = "Reach x3 combo",
                TargetCount = 3, CoinReward = 100, GemReward = 0, IsWeekly = false },
            new Mission { Id = "daily_perfect_1", Title = "Perfectionist", Description = "Complete a level with 0 hints",
                TargetCount = 1, CoinReward = 150, GemReward = 1, IsWeekly = false },
        };

        private readonly Mission[] _weeklyMissions = new Mission[]
        {
            new Mission { Id = "weekly_words_100", Title = "Word Warrior", Description = "Find 100 words this week",
                TargetCount = 100, CoinReward = 500, GemReward = 5, IsWeekly = true },
            new Mission { Id = "weekly_levels_15", Title = "Level Champion", Description = "Complete 15 levels",
                TargetCount = 15, CoinReward = 750, GemReward = 8, IsWeekly = true },
            new Mission { Id = "weekly_combo_15", Title = "Combo Legend", Description = "Reach x15 combo",
                TargetCount = 15, CoinReward = 1000, GemReward = 10, IsWeekly = true },
        };

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;

            if (transform.parent == null)
                DontDestroyOnLoad(gameObject);

            CheckResets();
        }

        // ---------------------------------------------------------------
        // Reset handling
        // ---------------------------------------------------------------

        private void CheckResets()
        {
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string lastDaily = PlayerPrefs.GetString(KEY_LAST_DAILY_RESET, "");

            if (lastDaily != today)
            {
                ResetMissions(false);
                PlayerPrefs.SetString(KEY_LAST_DAILY_RESET, today);
                PlayerPrefs.Save();
                Debug.Log("[Missions] Daily missions reset.");
            }

            // Weekly: ISO week
            int year = DateTime.UtcNow.Year;
            int week = System.Globalization.ISOWeek.GetWeekOfYear(DateTime.UtcNow);
            string weekKey = $"{year}-W{week}";
            string lastWeekly = PlayerPrefs.GetString(KEY_LAST_WEEKLY_RESET, "");

            if (lastWeekly != weekKey)
            {
                ResetMissions(true);
                PlayerPrefs.SetString(KEY_LAST_WEEKLY_RESET, weekKey);
                PlayerPrefs.Save();
                Debug.Log("[Missions] Weekly missions reset.");
            }
        }

        private void ResetMissions(bool weekly)
        {
            var missions = weekly ? _weeklyMissions : _dailyMissions;
            foreach (var m in missions)
            {
                PlayerPrefs.DeleteKey(KEY_PREFIX + m.Id + "_Progress");
                PlayerPrefs.DeleteKey(KEY_PREFIX + m.Id + "_Done");
            }
            PlayerPrefs.Save();
        }

        // ---------------------------------------------------------------
        // Public API
        // ---------------------------------------------------------------

        public void AddProgress(string missionId, int amount = 1)
        {
            // Find in both daily and weekly
            var mission = FindMission(missionId);
            if (mission == null) return;

            if (IsComplete(missionId)) return;

            int current = GetProgress(missionId) + amount;
            current = Mathf.Clamp(current, 0, mission.TargetCount);

            PlayerPrefs.SetInt(KEY_PREFIX + missionId + "_Progress", current);
            PlayerPrefs.Save();

            OnMissionProgress?.Invoke(mission, current);

            if (current >= mission.TargetCount)
            {
                CompleteMission(mission);
            }
        }

        public void SetProgress(string missionId, int value)
        {
            var mission = FindMission(missionId);
            if (mission == null) return;
            if (IsComplete(missionId)) return;

            value = Mathf.Clamp(value, 0, mission.TargetCount);
            PlayerPrefs.SetInt(KEY_PREFIX + missionId + "_Progress", value);
            PlayerPrefs.Save();

            OnMissionProgress?.Invoke(mission, value);

            if (value >= mission.TargetCount)
                CompleteMission(mission);
        }

        public int GetProgress(string missionId) =>
            PlayerPrefs.GetInt(KEY_PREFIX + missionId + "_Progress", 0);

        public bool IsComplete(string missionId) =>
            PlayerPrefs.GetInt(KEY_PREFIX + missionId + "_Done", 0) == 1;

        public float GetProgressPercent(string missionId)
        {
            var m = FindMission(missionId);
            if (m == null || m.TargetCount <= 0) return 0f;
            return Mathf.Clamp01((float)GetProgress(missionId) / m.TargetCount);
        }

        public Mission[] GetDailyMissions() => _dailyMissions;
        public Mission[] GetWeeklyMissions() => _weeklyMissions;

        public Mission FindMission(string id)
        {
            foreach (var m in _dailyMissions) if (m.Id == id) return m;
            foreach (var m in _weeklyMissions) if (m.Id == id) return m;
            return null;
        }

        // ---------------------------------------------------------------
        // Completion
        // ---------------------------------------------------------------

        private void CompleteMission(Mission m)
        {
            if (IsComplete(m.Id)) return;

            PlayerPrefs.SetInt(KEY_PREFIX + m.Id + "_Done", 1);
            PlayerPrefs.Save();

            Debug.Log($"[Missions] COMPLETED: {m.Title} (+{m.CoinReward} coins, +{m.GemReward} gems)");

            if (PlayerProgressManager.Instance != null && m.CoinReward > 0)
                PlayerProgressManager.Instance.AddCoins(m.CoinReward);

            if (StatisticsManager.Instance != null)
                StatisticsManager.Instance.AddCoinsEarned(m.CoinReward);

            OnMissionComplete?.Invoke(m);
        }

        // ---------------------------------------------------------------
        // Hooks for gameplay (call these from SelectionManager etc.)
        // ---------------------------------------------------------------

        public void OnWordFound()
        {
            AddProgress("daily_words_10", 1);
            AddProgress("weekly_words_100", 1);
        }

        public void OnLevelCompleted(bool perfect)
        {
            AddProgress("daily_levels_2", 1);
            AddProgress("weekly_levels_15", 1);

            if (perfect)
                AddProgress("daily_perfect_1", 1);
        }

        public void OnComboReached(int combo)
        {
            if (combo >= 3)
                SetProgress("daily_combo_3", combo);
            if (combo >= 15)
                SetProgress("weekly_combo_15", combo);
        }

        [ContextMenu("Reset All Missions")]
        public void ResetAllDebug()
        {
            ResetMissions(false);
            ResetMissions(true);
            Debug.Log("[Missions] All reset (debug).");
        }
    }
}