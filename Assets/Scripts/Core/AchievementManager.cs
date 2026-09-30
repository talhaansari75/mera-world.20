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

        private const string KEY_PROGRESS_PREFIX = "Achievement_Progress_";
        private const string KEY_UNLOCKED_PREFIX = "Achievement_Unlocked_";

        public event Action<AchievementDefinitions.Achievement> OnAchievementUnlocked;
        public event Action<AchievementDefinitions.Achievement, int, int> OnProgressChanged;

        private readonly Dictionary<string, int> _progress = new Dictionary<string, int>();
        private readonly HashSet<string> _unlocked = new HashSet<string>();

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;

            // Only works if this GameObject is a root object.
            if (transform.parent == null)
            {
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Debug.Log("[Achievements] Manager is a child object — skipping DontDestroyOnLoad.");
            }

            LoadFromPlayerPrefs();
        }

        // ---------------------------------------------------------------
        // Public API
        // ---------------------------------------------------------------

        public void AddProgress(string achievementId, int amount = 1)
        {
            var ach = AchievementDefinitions.GetById(achievementId);
            if (ach == null)
            {
                Debug.LogWarning($"[Achievements] Unknown achievement: {achievementId}");
                return;
            }

            if (_unlocked.Contains(achievementId)) return;

            int current = GetProgress(achievementId) + amount;
            current = Mathf.Clamp(current, 0, ach.TargetCount);

            _progress[achievementId] = current;
            SaveProgress(achievementId, current);

            OnProgressChanged?.Invoke(ach, current, ach.TargetCount);

            if (current >= ach.TargetCount)
                Unlock(ach);
        }

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

        public int GetUnlockedCount() => _unlocked.Count;
        public int GetTotalCount() => AchievementDefinitions.All.Count;
        public List<AchievementDefinitions.Achievement> GetAllAchievements() => AchievementDefinitions.All;

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

            if (PlayerProgressManager.Instance != null)
            {
                if (ach.CoinReward > 0)
                    PlayerProgressManager.Instance.AddCoins(ach.CoinReward);

                if (ach.GemReward > 0)
                {
                    var method = PlayerProgressManager.Instance.GetType().GetMethod("AddGems");
                    if (method != null)
                        method.Invoke(PlayerProgressManager.Instance, new object[] { ach.GemReward });
                }
            }

            OnAchievementUnlocked?.Invoke(ach);
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