using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    [Serializable]
    public class Mission
    {
        public string Id;
        public string Title;
        public string Description;
        public int Target;
        public int Reward;
        public string Type;
    }

    public partial class MissionsSystem : MonoBehaviour
    {
        public static MissionsSystem Instance { get; private set; }

        public event Action<Mission> OnMissionCompleted;

        private Canvas _canvas;
        private GameObject _panel;

        private const string KEY_DAILY_DATE = "Missions_DailyDate";
        private const string KEY_WEEKLY_WEEK = "Missions_WeeklyWeek";
        private const string KEY_PROGRESS_PREFIX = "Mission_";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            CheckResetPeriods();
            Invoke(nameof(Setup), 1.3f);
        }

        private void CheckResetPeriods()
        {
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string lastDaily = PlayerPrefs.GetString(KEY_DAILY_DATE, "");
            if (lastDaily != today)
            {
                PlayerPrefs.SetString(KEY_DAILY_DATE, today);
                foreach (var m in DailyMissions)
                    PlayerPrefs.DeleteKey(KEY_PROGRESS_PREFIX + m.Id);
                PlayerPrefs.Save();
                Debug.Log("[Missions] Daily missions reset");
            }

            string week = GetWeekKey();
            string lastWeek = PlayerPrefs.GetString(KEY_WEEKLY_WEEK, "");
            if (lastWeek != week)
            {
                PlayerPrefs.SetString(KEY_WEEKLY_WEEK, week);
                foreach (var m in WeeklyMissions)
                    PlayerPrefs.DeleteKey(KEY_PROGRESS_PREFIX + m.Id);
                PlayerPrefs.Save();
                Debug.Log("[Missions] Weekly missions reset");
            }
        }

        private string GetWeekKey()
        {
            var now = DateTime.UtcNow;
            var year = now.Year;
            var week = System.Globalization.ISOWeek.GetWeekOfYear(now);
            return year + "-W" + week.ToString("D2");
        }

        public void AddProgress(string missionId, int amount)
        {
            string key = KEY_PROGRESS_PREFIX + missionId;
            int current = PlayerPrefs.GetInt(key, 0);
            PlayerPrefs.SetInt(key, current + amount);
            PlayerPrefs.Save();
            Debug.Log("[Mission] " + missionId + ": " + (current + amount));
        }

        private void ClaimMission(Mission m)
        {
            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(m.Reward);

            PlayerPrefs.SetInt(KEY_PROGRESS_PREFIX + m.Id, m.Target + 1);
            PlayerPrefs.Save();

            Debug.Log("[Mission] Claimed " + m.Reward + " coins for " + m.Title);

            OnMissionCompleted?.Invoke(m);

            foreach (Transform child in _panel.transform)
                if (child.name.StartsWith("Mission_")) Destroy(child.gameObject);

            Invoke(nameof(RebuildMissions), 0.1f);
        }

        private void RebuildMissions()
        {
            float y = 500f;
            foreach (var m in DailyMissions) { CreateMissionCard(m, y); y -= 130f; }
            y = -250f;
            foreach (var m in WeeklyMissions) { CreateMissionCard(m, y); y -= 130f; }
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }
    }
}