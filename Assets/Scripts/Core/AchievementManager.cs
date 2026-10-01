using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Tracks achievement progress and unlocks.
    /// Auto-saves progress to PlayerPrefs.
    /// Fires events when achievements unlock (for toast notifications).
    /// </summary>
    public class AchievementManager : MonoBehaviour
    {
        public static AchievementManager Instance { get; private set; }

        // ---- PlayerPrefs keys ----
        private const string KEY_PROGRESS_PREFIX = "Achievement_Progress_";
        private const string KEY_UNLOCKED_PREFIX = "Achievement_Unlocked_";

        // ---- Events ----
        public event Action<AchievementDefinitions.Achievement> OnAchievementUnlocked;
        public event Action<AchievementDefinitions.Achievement, int, int> OnProgressChanged; // (ach, current, target)

        // ---- Runtime cache ----
        private readonly Dictionary<string, int> _progress = new Dictionary<string, int>();
        private readonly HashSet<string> _unlocked = new HashSet<string>();

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            transform.parent = null;
            DontDestroyOnLoad(gameObject);

            LoadFromPlayerPrefs();
        }

        // ---------------------------------------------------------------
        // Public API
        // ---------------------------------------------------------------

        /// <summary>
        /// Add progress to an achievement. Auto-unlocks when target reached.
        /// Safe to call even if achievement doesn't exist (just logs warning).
        /// </summary>
        public void AddProgress(string achievementId, int amount = 1)
        {
            var ach = AchievementDefinitions.GetById(achievementId);
            if (ach == null)
            {
                Debug.LogWarning($"[Achievements] Unknown achievement: {achievementId}");
                return;
            }

            if (_unlocked.Contains(achievementId))
                return; // already unlocked, no need to track further

            int current = GetProgress(achievementId) + amount;
            current = Mathf.Clamp(current, 0, ach.TargetCount);

            _progress[achievementId] = current;
            SaveProgress(achievementId, current);

            OnProgressChanged?.Invoke(ach, current, ach.TargetCount);

            if (current >= ach.TargetCount)
                Unlock(ach);
        }

        /// <summary>
        /// Force-set progress (useful for absolute counters like total coins).
        /// </summary>
        public void SetProgress(string achievementId, int value)
        {
            var ach = AchievementDefinitions.GetById(achievementId);
            if (ach == null) return;
            if (_unlocked.Contains(achievementId)) return;

            value = Mathf.Clamp(value, 0, ach.TargetCount);
            _progress[achievementId] = value;
            SaveProgress(achievementId, value);

            OnProgressChanged?.Invoke(ach, value, ach.TargetCount);

            if (value >= ach.TargetCount)
                Unlock(ach);
        }

        public int GetProgress(string achievementId)
        {
            if (_progress.TryGetValue(achievementId, out var v))
                return v;

            // Try PlayerPrefs
            int stored = PlayerPrefs.GetInt(KEY_PROGRESS_PREFIX + achievementId, 0);
            _progress[achievementId] = stored;
            return stored;
        }

        public bool IsUnlocked(string achievementId)
        {
            return _unlocked.Contains(achievementId);
        }

        public float GetProgressPercent(string achievementId)
        {
            var ach = AchievementDefinitions.GetById(achievementId);
            if (ach == null || ach.TargetCount <= 0) return 0f;
            return Mathf.Clamp01((float)GetProgress(achievementId) / ach.TargetCount);
        }

        public int GetUnlockedCount()
        {
            return _unlocked.Count;
        }

        public int GetTotalCount()
        {
            return AchievementDefinitions.All.Count;
        }

        public List<AchievementDefinitions.Achievement> GetAllAchievements()
        {
            return AchievementDefinitions.All;
        }

        // ---------------------------------------------------------------
        // Unlock
        // ---------------------------------------------------------------

        private void Unlock(AchievementDefinitions.Achievement ach)
        {
            if (_unlocked.Contains(ach.Id)) return;

            _unlocked.Add(ach.Id);
            PlayerPrefs.SetInt(KEY_UNLOCKED_PREFIX + ach.Id, 1);
            PlayerPrefs.Save();

            Debug.Log($"[Achievements] UNLOCKED: {ach.Title} (+{ach.CoinReward} coins, +{ach.GemReward} gems)");

            // Give rewards
            if (PlayerProgressManager.Instance != null)
            {
                if (ach.CoinReward > 0) PlayerProgressManager.Instance.AddCoins(ach.CoinReward);
                if (ach.GemReward > 0 && HasMethod(PlayerProgressManager.Instance, "AddGems"))
                    PlayerProgressManager.Instance.SendMessage("AddGems", ach.GemReward, SendMessageOptions.DontRequireReceiver);
            }

            OnAchievementUnlocked?.Invoke(ach);
        }

        private bool HasMethod(object obj, string methodName)
        {
            return obj.GetType().GetMethod(methodName) != null;
        }

        // ---------------------------------------------------------------
        // Persistence
        // ---------------------------------------------------------------

        private void LoadFromPlayerPrefs()
        {
            _progress.Clear();
            _unlocked.Clear();

            foreach (var ach in AchievementDefinitions.All)
            {
                int progress = PlayerPrefs.GetInt(KEY_PROGRESS_PREFIX + ach.Id, 0);
                if (progress > 0) _progress[ach.Id] = progress;

                if (PlayerPrefs.GetInt(KEY_UNLOCKED_PREFIX + ach.Id, 0) == 1)
                    _unlocked.Add(ach.Id);
            }

            Debug.Log($"[Achievements] Loaded: {_unlocked.Count}/{AchievementDefinitions.All.Count} unlocked");
        }

        private void SaveProgress(string id, int value)
        {
            PlayerPrefs.SetInt(KEY_PROGRESS_PREFIX + id, value);
            PlayerPrefs.Save();
        }

        // ---------------------------------------------------------------
        // Debug helpers (call from any script to test)
        // ---------------------------------------------------------------

        [ContextMenu("Reset All Achievements")]
        public void ResetAll()
        {
            foreach (var ach in AchievementDefinitions.All)
            {
                PlayerPrefs.DeleteKey(KEY_PROGRESS_PREFIX + ach.Id);
                PlayerPrefs.DeleteKey(KEY_UNLOCKED_PREFIX + ach.Id);
            }
            PlayerPrefs.Save();
            _progress.Clear();
            _unlocked.Clear();
            Debug.Log("[Achievements] All reset.");
        }
    }
}