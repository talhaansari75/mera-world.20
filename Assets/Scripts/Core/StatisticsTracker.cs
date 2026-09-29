using System;
using UnityEngine;

namespace MeraWorld.Core
{
    public class StatisticsTracker : MonoBehaviour
    {
        public static StatisticsTracker Instance { get; private set; }

        private const string KEY_TOTAL_TIME = "Stats_TotalTime";
        private const string KEY_SESSIONS = "Stats_Sessions";
        private const string KEY_PERFECT_LEVELS = "Stats_PerfectLevels";
        private const string KEY_BEST_TIME = "Stats_BestTime";
        private const string KEY_LAST_PLAY_DATE = "Stats_LastPlayDate";
        private const string KEY_DAY_STREAK = "Stats_DayStreak";
        private const string KEY_TOTAL_HINTS = "Stats_TotalHints";

        public float TotalPlayTime => PlayerPrefs.GetFloat(KEY_TOTAL_TIME, 0f);
        public int TotalSessions => PlayerPrefs.GetInt(KEY_SESSIONS, 0);
        public int PerfectLevels => PlayerPrefs.GetInt(KEY_PERFECT_LEVELS, 0);
        public float BestLevelTime => PlayerPrefs.GetFloat(KEY_BEST_TIME, -1f);
        public int DayStreak => PlayerPrefs.GetInt(KEY_DAY_STREAK, 0);
        public int TotalHintsUsed => PlayerPrefs.GetInt(KEY_TOTAL_HINTS, 0);

        private float _sessionStartTime;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            _sessionStartTime = Time.time;

            // Increment sessions
            int sessions = PlayerPrefs.GetInt(KEY_SESSIONS, 0) + 1;
            PlayerPrefs.SetInt(KEY_SESSIONS, sessions);

            UpdateDayStreak();
            PlayerPrefs.Save();

            Debug.Log($"[Stats] Session #{sessions} started");
        }

        void Update()
        {
            // Save play time every 30 seconds
            if (Time.time - _sessionStartTime > 30f)
            {
                float elapsed = Time.time - _sessionStartTime;
                float total = PlayerPrefs.GetFloat(KEY_TOTAL_TIME, 0f) + elapsed;
                PlayerPrefs.SetFloat(KEY_TOTAL_TIME, total);
                PlayerPrefs.Save();
                _sessionStartTime = Time.time;
            }
        }

        void OnApplicationQuit()
        {
            SaveSessionTime();
        }

        void OnApplicationPause(bool paused)
        {
            if (paused) SaveSessionTime();
            else _sessionStartTime = Time.time;
        }

        private void SaveSessionTime()
        {
            float elapsed = Time.time - _sessionStartTime;
            if (elapsed < 1f) return;
            float total = PlayerPrefs.GetFloat(KEY_TOTAL_TIME, 0f) + elapsed;
            PlayerPrefs.SetFloat(KEY_TOTAL_TIME, total);
            PlayerPrefs.Save();
        }

        private void UpdateDayStreak()
        {
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string lastPlay = PlayerPrefs.GetString(KEY_LAST_PLAY_DATE, "");
            string yesterday = DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd");

            if (lastPlay == today) return;

            int streak = PlayerPrefs.GetInt(KEY_DAY_STREAK, 0);
            if (lastPlay == yesterday) streak++;
            else streak = 1;

            PlayerPrefs.SetInt(KEY_DAY_STREAK, streak);
            PlayerPrefs.SetString(KEY_LAST_PLAY_DATE, today);
        }

        public void RecordLevelComplete(float timeSeconds, int hintsUsed, bool isPerfect)
        {
            if (isPerfect)
            {
                int p = PlayerPrefs.GetInt(KEY_PERFECT_LEVELS, 0) + 1;
                PlayerPrefs.SetInt(KEY_PERFECT_LEVELS, p);
            }

            float best = PlayerPrefs.GetFloat(KEY_BEST_TIME, -1f);
            if (best < 0 || timeSeconds < best)
                PlayerPrefs.SetFloat(KEY_BEST_TIME, timeSeconds);

            int hints = PlayerPrefs.GetInt(KEY_TOTAL_HINTS, 0) + hintsUsed;
            PlayerPrefs.SetInt(KEY_TOTAL_HINTS, hints);

            PlayerPrefs.Save();
        }

        public string FormatPlayTime()
        {
            float total = TotalPlayTime;
            int hours = Mathf.FloorToInt(total / 3600f);
            int minutes = Mathf.FloorToInt((total % 3600f) / 60f);
            return $"{hours}h {minutes}m";
        }

        public string FormatBestTime()
        {
            float b = BestLevelTime;
            if (b < 0) return "—";
            int min = Mathf.FloorToInt(b / 60f);
            int sec = Mathf.FloorToInt(b % 60f);
            return $"{min}:{sec:D2}";
        }
    }
}