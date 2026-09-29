using System;
using System.Collections.Generic;
using UnityEngine;

namespace MeraWorld.Core
{
    [Serializable]
    public class Achievement
    {
        public string Id;
        public string Title;
        public string Description;
        public int Target;
        public int RewardCoins;

        public Achievement(string id, string title, string desc, int target, int reward)
        {
            Id = id; Title = title; Description = desc; Target = target; RewardCoins = reward;
        }
    }

    public class AchievementManager : MonoBehaviour
    {
        public static AchievementManager Instance { get; private set; }

        public event Action<Achievement> OnAchievementUnlocked;

        private const string KEY_PREFIX = "Ach_";

        private readonly List<Achievement> _achievements = new List<Achievement>
        {
            new Achievement("first_word", "First Word", "Find your first word", 1, 10),
            new Achievement("word_hunter", "Word Hunter", "Find 50 words", 50, 50),
            new Achievement("word_master", "Word Master", "Find 200 words", 200, 200),
            new Achievement("first_level", "Getting Started", "Complete your first level", 1, 25),
            new Achievement("level_5", "Adventurer", "Complete 5 levels", 5, 100),
            new Achievement("level_10", "Explorer", "Complete 10 levels", 10, 250),
            new Achievement("rich_player", "Rich Player", "Earn 1000 coins", 1000, 100),
            new Achievement("hint_master", "Hint Master", "Use 5 hints", 5, 75),
        };

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public List<Achievement> GetAll() => _achievements;

        public int GetProgress(Achievement a) => PlayerPrefs.GetInt(KEY_PREFIX + a.Id, 0);

        public bool IsUnlocked(Achievement a) => GetProgress(a) >= a.Target;

        public void AddProgress(string id, int amount)
        {
            var ach = _achievements.Find(a => a.Id == id);
            if (ach == null) return;

            if (IsUnlocked(ach)) return;

            int current = PlayerPrefs.GetInt(KEY_PREFIX + ach.Id, 0);
            current += amount;

            if (current > ach.Target) current = ach.Target;

            PlayerPrefs.SetInt(KEY_PREFIX + ach.Id, current);
            PlayerPrefs.Save();

            if (current >= ach.Target)
            {
                Debug.Log($"[Achievement] Unlocked: {ach.Title} (+{ach.RewardCoins} coins)");

                if (PlayerProgressManager.Instance != null)
                    PlayerProgressManager.Instance.AddCoins(ach.RewardCoins);

                OnAchievementUnlocked?.Invoke(ach);
            }
        }

        public void SetProgress(string id, int value)
        {
            var ach = _achievements.Find(a => a.Id == id);
            if (ach == null) return;

            int current = PlayerPrefs.GetInt(KEY_PREFIX + ach.Id, 0);
            if (value > current)
            {
                int delta = value - current;
                AddProgress(id, delta);
            }
        }

        public void ResetAll()
        {
            foreach (var a in _achievements)
                PlayerPrefs.DeleteKey(KEY_PREFIX + a.Id);
            PlayerPrefs.Save();
        }
    }
}