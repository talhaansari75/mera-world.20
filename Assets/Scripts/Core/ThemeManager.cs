using UnityEngine;
using System.Collections.Generic;

namespace MeraWorld.Core
{
    public class ThemeManager : MonoBehaviour
    {
        public static ThemeManager Instance { get; private set; }

        public List<GameTheme> allThemes = new List<GameTheme>();
        public GameTheme CurrentTheme { get; private set; }

        private const string THEME_KEY = "SelectedTheme";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            transform.parent = null;
            // DontDestroyOnLoad(gameObject); // Unity 6 warning fix

            int saved = PlayerPrefs.GetInt(THEME_KEY, 0);
            if (allThemes.Count > 0)
            {
                saved = Mathf.Clamp(saved, 0, allThemes.Count - 1);
                CurrentTheme = allThemes[saved];
            }
            Debug.Log($"[Theme] Loaded: {(CurrentTheme != null ? CurrentTheme.themeName : "None")}");
        }

        public void SelectTheme(int index)
        {
            if (index < 0 || index >= allThemes.Count) return;
            CurrentTheme = allThemes[index];
            PlayerPrefs.SetInt(THEME_KEY, index);
            PlayerPrefs.Save();

            if (HomeScreenUI.Instance != null)
                HomeScreenUI.Instance.ApplyTheme(CurrentTheme);

            Debug.Log($"[Theme] Selected: {CurrentTheme.themeName}");
        }
    }
}
