using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Saves and loads player progress (coins, level, stars).
    /// Single source of truth — sab systems yahan se data lete hain.
    /// </summary>
    public class PlayerProgressManager : MonoBehaviour
    {
        public static PlayerProgressManager Instance { get; private set; }

        private const string KEY_COINS        = "PlayerCoins";
        private const string KEY_CURRENT_LVL  = "CurrentLevel";
        private const string KEY_HIGHEST_LVL  = "HighestLevel";
        private const string KEY_TOTAL_STARS  = "TotalStars";
        private const string KEY_TOTAL_WORDS  = "TotalWordsFound";

        [Header("Runtime Data (auto-loaded)")]
        public int Coins;
        public int CurrentLevel = 1;
        public int HighestLevelUnlocked = 1;
        public int TotalStars;
        public int TotalWordsFound;

        public event System.Action<int> OnCoinsChanged;
        public event System.Action<int> OnLevelChanged;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            Load();

            Debug.Log($"[Progress] Loaded — Coins: {Coins}, Level: {CurrentLevel}, Highest: {HighestLevelUnlocked}");
        }

        public void Load()
        {
            Coins = PlayerPrefs.GetInt(KEY_COINS, 0);
            CurrentLevel = PlayerPrefs.GetInt(KEY_CURRENT_LVL, 1);
            HighestLevelUnlocked = PlayerPrefs.GetInt(KEY_HIGHEST_LVL, 1);
            TotalStars = PlayerPrefs.GetInt(KEY_TOTAL_STARS, 0);
            TotalWordsFound = PlayerPrefs.GetInt(KEY_TOTAL_WORDS, 0);
        }

        public void Save()
        {
            PlayerPrefs.SetInt(KEY_COINS, Coins);
            PlayerPrefs.SetInt(KEY_CURRENT_LVL, CurrentLevel);
            PlayerPrefs.SetInt(KEY_HIGHEST_LVL, HighestLevelUnlocked);
            PlayerPrefs.SetInt(KEY_TOTAL_STARS, TotalStars);
            PlayerPrefs.SetInt(KEY_TOTAL_WORDS, TotalWordsFound);
            PlayerPrefs.Save();
        }

        public void AddCoins(int amount)
        {
            Coins += amount;
            Save();
            OnCoinsChanged?.Invoke(Coins);
            Debug.Log($"[Progress] +{amount} coins → total {Coins}");
        }

        public bool SpendCoins(int amount)
        {
            if (Coins < amount) return false;
            Coins -= amount;
            Save();
            OnCoinsChanged?.Invoke(Coins);
            return true;
        }

        public void SetCurrentLevel(int level)
        {
            CurrentLevel = level;
            if (CurrentLevel > HighestLevelUnlocked)
                HighestLevelUnlocked = CurrentLevel;
            Save();
            OnLevelChanged?.Invoke(CurrentLevel);
        }

        public void AddWordFound()
        {
            TotalWordsFound++;
            Save();
        }

        public void AddStars(int stars)
        {
            TotalStars += stars;
            Save();
        }

        public void ResetAll()
        {
            PlayerPrefs.DeleteAll();
            Coins = 0;
            CurrentLevel = 1;
            HighestLevelUnlocked = 1;
            TotalStars = 0;
            TotalWordsFound = 0;
            Save();
        }
    }
}