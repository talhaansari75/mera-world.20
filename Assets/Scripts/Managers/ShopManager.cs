using System;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Manages shop purchases (with coins) and inventory (hints, boosters, themes).
    /// </summary>
    public static class ShopManager
    {
        private const string KEY_HINTS = "Inv_Hints";
        private const string KEY_REMOVE_ADS = "Inv_RemoveAds";
        private const string KEY_GOLDEN_THEME = "Inv_GoldenTheme";
        private const string KEY_TIME_FREEZE = "Inv_TimeFreeze";
        private const string KEY_SHUFFLE = "Inv_Shuffle";

        public static event Action OnInventoryChanged;

        public static int Hints => PlayerPrefs.GetInt(KEY_HINTS, 3);
        public static bool RemoveAds => PlayerPrefs.GetInt(KEY_REMOVE_ADS, 0) == 1;
        public static bool GoldenTheme => PlayerPrefs.GetInt(KEY_GOLDEN_THEME, 0) == 1;
        public static int TimeFreeze => PlayerPrefs.GetInt(KEY_TIME_FREEZE, 0);
        public static int Shuffle => PlayerPrefs.GetInt(KEY_SHUFFLE, 0);

        public class ShopItem
        {
            public string Id;
            public string Title;
            public string Description;
            public int Price;
            public Color Color;
            public Action OnPurchase;
        }

        public static ShopItem[] GetShopItems()
        {
            return new ShopItem[]
            {
                new ShopItem {
                    Id = "hints_10", Title = "10 HINTS", Description = "10 hint tokens",
                    Price = 500, Color = new Color(0.95f, 0.85f, 0.30f),
                    OnPurchase = () => AddHints(10)
                },
                new ShopItem {
                    Id = "hints_50", Title = "50 HINTS", Description = "50 hint tokens (best value)",
                    Price = 2000, Color = new Color(0.95f, 0.75f, 0.20f),
                    OnPurchase = () => AddHints(50)
                },
                new ShopItem {
                    Id = "remove_ads", Title = "REMOVE ADS", Description = "No more banner/interstitial ads",
                    Price = 5000, Color = new Color(0.30f, 0.65f, 0.85f),
                    OnPurchase = () => { if (!RemoveAds) PlayerPrefs.SetInt(KEY_REMOVE_ADS, 1); PlayerPrefs.Save(); }
                },
                new ShopItem {
                    Id = "golden_theme", Title = "GOLDEN THEME", Description = "Golden UI theme",
                    Price = 10000, Color = new Color(1f, 0.75f, 0.20f),
                    OnPurchase = () => { PlayerPrefs.SetInt(KEY_GOLDEN_THEME, 1); PlayerPrefs.Save(); }
                },
                new ShopItem {
                    Id = "time_freeze_5", Title = "TIME FREEZE x5", Description = "Pause timer 10 sec, 5 uses",
                    Price = 800, Color = new Color(0.55f, 0.75f, 0.95f),
                    OnPurchase = () => AddTimeFreeze(5)
                },
                new ShopItem {
                    Id = "shuffle_5", Title = "SHUFFLE x5", Description = "Rearrange grid, 5 uses",
                    Price = 800, Color = new Color(0.75f, 0.55f, 0.95f),
                    OnPurchase = () => AddShuffle(5)
                },
            };
        }

        public static bool TryPurchase(string itemId)
        {
            var items = GetShopItems();
            ShopItem item = null;
            foreach (var i in items) if (i.Id == itemId) { item = i; break; }
            if (item == null) { Debug.LogWarning($"[Shop] Unknown item: {itemId}"); return false; }

            int coins = PlayerProgressManager.Instance != null ? PlayerProgressManager.Instance.Coins : 0;
            if (coins < item.Price)
            {
                Debug.Log($"[Shop] Not enough coins for {item.Title}");
                return false;
            }

            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(-item.Price);

            item.OnPurchase?.Invoke();
            PlayerPrefs.Save();
            OnInventoryChanged?.Invoke();

            if (SoundManager.Instance != null) SoundManager.Instance.PlayCoinCollect();
            Debug.Log($"[Shop] Purchased: {item.Title}");
            return true;
        }

        public static void AddHints(int amount)
        {
            PlayerPrefs.SetInt(KEY_HINTS, Hints + amount);
            PlayerPrefs.Save();
            OnInventoryChanged?.Invoke();
        }

        public static bool UseHint()
        {
            if (Hints <= 0) return false;
            PlayerPrefs.SetInt(KEY_HINTS, Hints - 1);
            PlayerPrefs.Save();
            OnInventoryChanged?.Invoke();
            return true;
        }

        public static void AddTimeFreeze(int amount) { PlayerPrefs.SetInt(KEY_TIME_FREEZE, TimeFreeze + amount); PlayerPrefs.Save(); }
        public static void AddShuffle(int amount) { PlayerPrefs.SetInt(KEY_SHUFFLE, Shuffle + amount); PlayerPrefs.Save(); }
    }
}