using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ThemeManager : MonoBehaviour
    {
        public static ThemeManager Instance { get; private set; }

        public enum Theme { Default, Golden, Ocean, Sunset }

        private const string KEY_THEME = "Theme_Current";

        public Theme CurrentTheme { get; private set; } = Theme.Default;

        public event System.Action<Theme> OnThemeChanged;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;

            transform.parent = null;
            DontDestroyOnLoad(gameObject);

            CurrentTheme = (Theme)PlayerPrefs.GetInt(KEY_THEME, 0);
            Debug.Log($"[Theme] Loaded: {CurrentTheme}");
        }

        public void SetTheme(Theme theme)
        {
            CurrentTheme = theme;
            PlayerPrefs.SetInt(KEY_THEME, (int)theme);
            PlayerPrefs.Save();
            ApplyTheme();
            OnThemeChanged?.Invoke(theme);
        }

        public Color GetPrimaryColor()
        {
            switch (CurrentTheme)
            {
                case Theme.Golden: return new Color(1f, 0.75f, 0.20f);
                case Theme.Ocean: return new Color(0.20f, 0.65f, 0.85f);
                case Theme.Sunset: return new Color(0.95f, 0.45f, 0.25f);
                default: return new Color(0.25f, 0.45f, 0.85f);
            }
        }

        public Color GetAccentColor()
        {
            switch (CurrentTheme)
            {
                case Theme.Golden: return new Color(1f, 0.90f, 0.55f);
                case Theme.Ocean: return new Color(0.55f, 0.85f, 1f);
                case Theme.Sunset: return new Color(1f, 0.75f, 0.45f);
                default: return new Color(0.70f, 0.85f, 1f);
            }
        }

        private void ApplyTheme()
        {
            var themed = FindObjectsByType<ThemedImage>(FindObjectsSortMode.None);
            foreach (var t in themed) t.Refresh();
        }

        public bool IsThemeUnlocked(Theme theme)
        {
            switch (theme)
            {
                case Theme.Default: return true;
                case Theme.Golden: return PlayerPrefs.GetInt("Theme_Golden_Unlocked", 0) == 1;
                case Theme.Ocean: return PlayerPrefs.GetInt("Theme_Ocean_Unlocked", 0) == 1;
                case Theme.Sunset: return PlayerPrefs.GetInt("Theme_Sunset_Unlocked", 0) == 1;
            }
            return false;
        }

        public void UnlockTheme(Theme theme)
        {
            PlayerPrefs.SetInt($"Theme_{theme}_Unlocked", 1);
            PlayerPrefs.Save();
        }
    }
}
