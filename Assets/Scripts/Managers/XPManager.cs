using System;
using UnityEngine;

namespace MeraWorld.Core
{
    public class XPManager : MonoBehaviour
    {
        public static XPManager Instance { get; private set; }

        public event Action<int, int> OnXPChanged;
        public event Action<int> OnPlayerLevelUp;

        private const string KEY_XP = "Player_XP";
        private const string KEY_LEVEL = "Player_Level";
        private const string KEY_BADGE = "Player_Badge";

        public int XP => PlayerPrefs.GetInt(KEY_XP, 0);
        public int Level => PlayerPrefs.GetInt(KEY_LEVEL, 1);
        public string Badge => GetBadgeName(Level);

        public int XPForNextLevel => 100 + (Level - 1) * 50;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        public void AddXP(int amount)
        {
            int newXP = XP + amount;
            int currentLevel = Level;
            int needed = XPForNextLevel;

            while (newXP >= needed)
            {
                newXP -= needed;
                currentLevel++;
                needed = 100 + (currentLevel - 1) * 50;
                OnPlayerLevelUp?.Invoke(currentLevel);
                Debug.Log($"[XP] Player LEVEL UP to {currentLevel} ({Badge})");
            }

            PlayerPrefs.SetInt(KEY_XP, newXP);
            PlayerPrefs.SetInt(KEY_LEVEL, currentLevel);
            PlayerPrefs.Save();

            OnXPChanged?.Invoke(newXP, needed);
        }

        private string GetBadgeName(int level)
        {
            if (level >= 50) return "LEGEND";
            if (level >= 30) return "MASTER";
            if (level >= 20) return "EXPERT";
            if (level >= 10) return "ADVANCED";
            if (level >= 5) return "SKILLED";
            if (level >= 3) return "TRAINEE";
            return "BEGINNER";
        }

        public float GetProgress()
        {
            return (float)XP / XPForNextLevel;
        }
    }
}