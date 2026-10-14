using UnityEngine;
using System;

namespace MeraWorld.Core
{
    public class ThemeManager : MonoBehaviour
    {
        public static ThemeManager Instance { get; private set; }

        public static event Action OnThemeChanged;

        public string CurrentTheme { get; private set; } = "Classic";

        private const string THEME_KEY = "Settings_Theme";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;

            CurrentTheme = PlayerPrefs.GetString(THEME_KEY, "Classic");
            Debug.Log("[Theme] Loaded: " + CurrentTheme);
        }

        public void SelectTheme(string themeName)
        {
            if (string.IsNullOrEmpty(themeName)) return;
            CurrentTheme = themeName;
            PlayerPrefs.SetString(THEME_KEY, themeName);
            PlayerPrefs.Save();
            Debug.Log("[Theme] Selected: " + themeName);

            OnThemeChanged?.Invoke();
        }

        public ThemeColors Colors => ThemePalette.Get(CurrentTheme);
    }
}