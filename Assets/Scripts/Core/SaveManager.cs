using System;
using System.Collections.Generic;
using System.Text;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Encrypted save system with version migration.
    /// Stores JSON encrypted with XOR + salt. Prevents casual tampering.
    /// </summary>
    public static class SaveManager
    {
        private const string SAVE_KEY = "EncryptedSave_v1";
        private const int CURRENT_VERSION = 2;
        private const string SALT = "MeraWorld_2026_TalhaAnsari";

        [Serializable]
        public class GameSave
        {
            public int Version = CURRENT_VERSION;
            public int CurrentLevel = 1;
            public int HighestLevelUnlocked = 1;
            public int Coins = 0;
            public int Gems = 0;
            public int TotalStars = 0;
            public int TotalWordsFound = 0;
            public long TotalPlayTimeSeconds = 0;
            public long LastSaveUnixSeconds = 0;

            // Per-level stars (index = level-1)
            public List<int> LevelStars = new List<int>();

            // Achievements unlocked
            public List<string> UnlockedAchievements = new List<string>();

            // Daily streak
            public int DailyStreak = 0;
            public long LastDailyPlayedUnix = 0;

            // Settings snapshot
            public bool MusicOn = true;
            public bool SFXOn = true;
            public bool VibrationOn = true;
        }

        private static GameSave _cached;

        // ---------------------------------------------------------------
        // Public API
        // ---------------------------------------------------------------

        public static GameSave Load()
        {
            if (_cached != null) return _cached;

            string encrypted = PlayerPrefs.GetString(SAVE_KEY, "");
            if (string.IsNullOrEmpty(encrypted))
            {
                _cached = new GameSave();
                Save(_cached);
                return _cached;
            }

            try
            {
                string json = Decrypt(encrypted);
                var save = JsonUtility.FromJson<GameSave>(json);

                if (save == null)
                {
                    Debug.LogWarning("[SaveManager] Corrupt save, creating new.");
                    _cached = new GameSave();
                }
                else
                {
                    _cached = Migrate(save);
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"[SaveManager] Failed to load: {e.Message}. Creating new save.");
                _cached = new GameSave();
            }

            return _cached;
        }

        public static void Save(GameSave save)
        {
            if (save == null) return;
            _cached = save;
            save.Version = CURRENT_VERSION;
            save.LastSaveUnixSeconds = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            string json = JsonUtility.ToJson(save);
            string encrypted = Encrypt(json);
            PlayerPrefs.SetString(SAVE_KEY, encrypted);
            PlayerPrefs.Save();
        }

        public static void Save() => Save(_cached ?? new GameSave());

        public static void DeleteAll()
        {
            PlayerPrefs.DeleteKey(SAVE_KEY);
            PlayerPrefs.Save();
            _cached = null;
        }

        public static bool HasSave() => PlayerPrefs.HasKey(SAVE_KEY);

        // ---------------------------------------------------------------
        // Convenience methods
        // ---------------------------------------------------------------

        public static void AddCoins(int amount)
        {
            var s = Load();
            s.Coins = Mathf.Max(0, s.Coins + amount);
            Save(s);
        }

        public static void AddGems(int amount)
        {
            var s = Load();
            s.Gems = Mathf.Max(0, s.Gems + amount);
            Save(s);
        }

        public static void SetLevelStars(int level, int stars)
        {
            var s = Load();
            while (s.LevelStars.Count < level) s.LevelStars.Add(0);
            if (stars > s.LevelStars[level - 1]) s.LevelStars[level - 1] = stars;

            // Recalculate total
            int total = 0;
            foreach (var st in s.LevelStars) total += st;
            s.TotalStars = total;

            Save(s);
        }

        public static int GetLevelStars(int level)
        {
            var s = Load();
            if (level < 1 || level > s.LevelStars.Count) return 0;
            return s.LevelStars[level - 1];
        }

        public static void UnlockAchievement(string id)
        {
            var s = Load();
            if (!s.UnlockedAchievements.Contains(id))
            {
                s.UnlockedAchievements.Add(id);
                Save(s);
            }
        }

        public static bool IsAchievementUnlocked(string id)
        {
            var s = Load();
            return s.UnlockedAchievements.Contains(id);
        }

        // ---------------------------------------------------------------
        // Version migration
        // ---------------------------------------------------------------

        private static GameSave Migrate(GameSave save)
        {
            if (save.Version == CURRENT_VERSION) return save;

            Debug.Log($"[SaveManager] Migrating save from v{save.Version} to v{CURRENT_VERSION}");

            // v1 → v2: added achievements + gems
            if (save.Version < 2)
            {
                if (save.UnlockedAchievements == null)
                    save.UnlockedAchievements = new List<string>();
                // gems already defaults to 0
            }

            save.Version = CURRENT_VERSION;
            Save(save);
            return save;
        }

        // ---------------------------------------------------------------
        // XOR encryption (light obfuscation, not crypto)
        // ---------------------------------------------------------------

        private static string Encrypt(string plain)
        {
            byte[] data = Encoding.UTF8.GetBytes(plain);
            byte[] key = Encoding.UTF8.GetBytes(SALT);

            for (int i = 0; i < data.Length; i++)
                data[i] = (byte)(data[i] ^ key[i % key.Length]);

            return Convert.ToBase64String(data);
        }

        private static string Decrypt(string encrypted)
        {
            byte[] data = Convert.FromBase64String(encrypted);
            byte[] key = Encoding.UTF8.GetBytes(SALT);

            for (int i = 0; i < data.Length; i++)
                data[i] = (byte)(data[i] ^ key[i % key.Length]);

            return Encoding.UTF8.GetString(data);
        }
    }
}