using System;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Tracks consecutive word finds (combo). Resets on miss.
    /// Notifies UI and missions.
    /// </summary>
    public class ComboSystem : MonoBehaviour
    {
        public static ComboSystem Instance { get; private set; }

        [Header("Combo Settings")]
        [Tooltip("Kitne second ke andar word mila to combo count ho")]
        public float ComboWindowSeconds = 5f;

        public int CurrentCombo { get; private set; } = 0;
        public int BestCombo { get; private set; } = 0;

        private float _lastWordTime = -999f;

        public event Action<int> OnComboChanged;
        public event Action<int> OnComboReset;
        public event Action<int> OnComboMilestone;

        private const string KEY_BEST_COMBO = "Combo_Best";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;

            if (transform.parent == null)
                DontDestroyOnLoad(gameObject);

            BestCombo = PlayerPrefs.GetInt(KEY_BEST_COMBO, 0);
        }

        void Update()
        {
            // Auto-reset combo if window expired
            if (CurrentCombo > 0)
            {
                float elapsed = Time.unscaledTime - _lastWordTime;
                if (elapsed > ComboWindowSeconds)
                {
                    ResetCombo();
                }
            }
        }

        public void RegisterWordFound()
        {
            float elapsed = Time.unscaledTime - _lastWordTime;
            _lastWordTime = Time.unscaledTime;

            if (elapsed <= ComboWindowSeconds)
            {
                CurrentCombo++;
            }
            else
            {
                CurrentCombo = 1;
            }

            if (CurrentCombo > BestCombo)
            {
                BestCombo = CurrentCombo;
                PlayerPrefs.SetInt(KEY_BEST_COMBO, BestCombo);
                PlayerPrefs.Save();
            }

            Debug.Log($"[Combo] Word found → combo x{CurrentCombo}");

            OnComboChanged?.Invoke(CurrentCombo);

            // Milestone events (x3, x5, x10, x15, x20)
            if (CurrentCombo == 3 || CurrentCombo == 5 || CurrentCombo == 10 ||
                CurrentCombo == 15 || CurrentCombo == 20 || (CurrentCombo > 20 && CurrentCombo % 10 == 0))
            {
                OnComboMilestone?.Invoke(CurrentCombo);

                if (SoundManager.Instance != null)
                    SoundManager.Instance.PlayStarEarned();
            }

            // Missions hook
            if (MissionsManager.Instance != null)
                MissionsManager.Instance.OnComboReached(CurrentCombo);

            // Achievements hook
            if (AchievementManager.Instance != null && CurrentCombo >= 10)
            {
                AchievementManager.Instance.SetProgress("perfect_1", 1);
            }
        }

        public void ResetCombo()
        {
            if (CurrentCombo == 0) return;

            Debug.Log($"[Combo] Reset (was x{CurrentCombo})");
            int oldCombo = CurrentCombo;
            CurrentCombo = 0;
            OnComboReset?.Invoke(oldCombo);
        }

        public float GetTimeRemaining()
        {
            if (CurrentCombo == 0) return 0f;
            float elapsed = Time.unscaledTime - _lastWordTime;
            return Mathf.Max(0f, ComboWindowSeconds - elapsed);
        }

        public float GetComboProgress()
        {
            if (CurrentCombo == 0) return 0f;
            float remaining = GetTimeRemaining();
            return Mathf.Clamp01(remaining / ComboWindowSeconds);
        }
    }
}