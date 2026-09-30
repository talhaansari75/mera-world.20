using System;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Tracks player statistics across the entire game.
    /// Auto-saves to PlayerPrefs. Singleton.
    /// </summary>
    public class StatisticsManager : MonoBehaviour
    {
        public static StatisticsManager Instance { get; private set; }

        private const string KEY_PREFIX = "Stats_";

        public int TotalWordsFound { get; private set; }
        public int TotalLevelsCompleted { get; private set; }
        public int TotalLevelsPlayed { get; private set; }
        public int PerfectLevels { get; private set; }
        public int TotalHintsUsed { get; private set; }
        public int TotalGamesPlayed { get; private set; }
        public int TotalCoinsEarned { get; private set; }
        public int MultiplayerWins { get; private set; }
        public int MultiplayerLosses { get; private set; }
        public int CurrentStreak { get; private set; }
        public int BestStreak { get; private set; }

        // Session stats
        private float _sessionStartTime;
        private int _sessionWordsFound;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            DontDestroyOnLoad(gameObject);
            Load();
            _sessionStartTime = Time.unscaledTime;
            TotalGamesPlayed++;
            Save();
        }

        public void AddWordFound() { TotalWordsFound++; _sessionWordsFound++; Save(); }
        public void AddLevelCompleted(bool perfect) { TotalLevelsCompleted++; if (perfect) PerfectLevels++; Save(); }
        public void AddLevelPlayed() { TotalLevelsPlayed++; Save(); }
        public void AddHintUsed() { TotalHintsUsed++; Save(); }
        public void AddCoinsEarned(int amount) { TotalCoinsEarned += amount; Save(); }
        public void AddMultiplayerWin() { MultiplayerWins++; Save(); }
        public void AddMultiplayerLoss() { MultiplayerLosses++; Save(); }

        public void RegisterDailyPlay()
        {
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string last = PlayerPrefs.GetString(KEY_PREFIX + "LastPlayDate", "");
            if (last == today) return;

            string yesterday = DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd");
            if (last == yesterday) CurrentStreak++;
            else CurrentStreak = 1;

            if (CurrentStreak > BestStreak) BestStreak = CurrentStreak;
            PlayerPrefs.SetString(KEY_PREFIX + "LastPlayDate", today);
            Save();
        }

        public TimeSpan GetTotalPlayTime() => TimeSpan.FromSeconds(PlayerPrefs.GetFloat(KEY_PREFIX + "TotalPlayTime", 0f));
        public int GetSessionWords() => _sessionWordsFound;
        public float GetSessionTime() => Time.unscaledTime - _sessionStartTime;

        private void Load()
        {
            TotalWordsFound = PlayerPrefs.GetInt(KEY_PREFIX + "TotalWords", 0);
            TotalLevelsCompleted = PlayerPrefs.GetInt(KEY_PREFIX + "LevelsCompleted", 0);
            TotalLevelsPlayed = PlayerPrefs.GetInt(KEY_PREFIX + "LevelsPlayed", 0);
            PerfectLevels = PlayerPrefs.GetInt(KEY_PREFIX + "PerfectLevels", 0);
            TotalHintsUsed = PlayerPrefs.GetInt(KEY_PREFIX + "HintsUsed", 0);
            TotalGamesPlayed = PlayerPrefs.GetInt(KEY_PREFIX + "GamesPlayed", 0);
            TotalCoinsEarned = PlayerPrefs.GetInt(KEY_PREFIX + "CoinsEarned", 0);
            MultiplayerWins = PlayerPrefs.GetInt(KEY_PREFIX + "MPWins", 0);
            MultiplayerLosses = PlayerPrefs.GetInt(KEY_PREFIX + "MPLosses", 0);
            CurrentStreak = PlayerPrefs.GetInt(KEY_PREFIX + "CurrentStreak", 0);
            BestStreak = PlayerPrefs.GetInt(KEY_PREFIX + "BestStreak", 0);
        }

        private void Save()
        {
            PlayerPrefs.SetInt(KEY_PREFIX + "TotalWords", TotalWordsFound);
            PlayerPrefs.SetInt(KEY_PREFIX + "LevelsCompleted", TotalLevelsCompleted);
            PlayerPrefs.SetInt(KEY_PREFIX + "LevelsPlayed", TotalLevelsPlayed);
            PlayerPrefs.SetInt(KEY_PREFIX + "PerfectLevels", PerfectLevels);
            PlayerPrefs.SetInt(KEY_PREFIX + "HintsUsed", TotalHintsUsed);
            PlayerPrefs.SetInt(KEY_PREFIX + "GamesPlayed", TotalGamesPlayed);
            PlayerPrefs.SetInt(KEY_PREFIX + "CoinsEarned", TotalCoinsEarned);
            PlayerPrefs.SetInt(KEY_PREFIX + "MPWins", MultiplayerWins);
            PlayerPrefs.SetInt(KEY_PREFIX + "MPLosses", MultiplayerLosses);
            PlayerPrefs.SetInt(KEY_PREFIX + "CurrentStreak", CurrentStreak);
            PlayerPrefs.SetInt(KEY_PREFIX + "BestStreak", BestStreak);
            PlayerPrefs.Save();
        }

        void OnApplicationQuit()
        {
            float total = PlayerPrefs.GetFloat(KEY_PREFIX + "TotalPlayTime", 0f);
            total += Time.unscaledTime - _sessionStartTime;
            PlayerPrefs.SetFloat(KEY_PREFIX + "TotalPlayTime", total);
            Save();
        }
    }
}