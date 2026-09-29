using UnityEngine;

namespace MeraWorld.Core
{
    public class ThemeManager : MonoBehaviour
    {
        public static ThemeManager Instance { get; private set; }

        public const string THEME_DEFAULT = "default";
        public const string THEME_GOLDEN = "golden";
        public const string THEME_OCEAN = "ocean";
        public const string THEME_FOREST = "forest";
        public const string THEME_ROYAL = "royal";

        private const string KEY_THEME = "SelectedTheme";

        public string CurrentTheme => PlayerPrefs.GetString(KEY_THEME, THEME_DEFAULT);

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        public void SetTheme(string themeId)
        {
            PlayerPrefs.SetString(KEY_THEME, themeId);
            PlayerPrefs.Save();
            Debug.Log($"[Theme] Set to {themeId}");
        }

        public Color GetTileTop()
        {
            switch (CurrentTheme)
            {
                case THEME_GOLDEN: return new Color(1f, 0.85f, 0.30f);
                case THEME_OCEAN: return new Color(0.35f, 0.85f, 0.95f);
                case THEME_FOREST: return new Color(0.40f, 0.85f, 0.45f);
                case THEME_ROYAL: return new Color(0.75f, 0.40f, 0.95f);
                default: return new Color(0.42f, 0.68f, 1.00f);
            }
        }

        public Color GetTileMid()
        {
            switch (CurrentTheme)
            {
                case THEME_GOLDEN: return new Color(0.85f, 0.55f, 0.15f);
                case THEME_OCEAN: return new Color(0.15f, 0.55f, 0.75f);
                case THEME_FOREST: return new Color(0.20f, 0.55f, 0.25f);
                case THEME_ROYAL: return new Color(0.45f, 0.20f, 0.65f);
                default: return new Color(0.20f, 0.42f, 0.85f);
            }
        }

        public Color GetTileBottom()
        {
            switch (CurrentTheme)
            {
                case THEME_GOLDEN: return new Color(0.55f, 0.30f, 0.05f);
                case THEME_OCEAN: return new Color(0.05f, 0.25f, 0.45f);
                case THEME_FOREST: return new Color(0.08f, 0.25f, 0.12f);
                case THEME_ROYAL: return new Color(0.20f, 0.05f, 0.35f);
                default: return new Color(0.08f, 0.20f, 0.55f);
            }
        }

        public Color GetBackgroundTop()
        {
            switch (CurrentTheme)
            {
                case THEME_GOLDEN: return new Color(0.25f, 0.15f, 0.05f);
                case THEME_OCEAN: return new Color(0.05f, 0.15f, 0.30f);
                case THEME_FOREST: return new Color(0.05f, 0.15f, 0.10f);
                case THEME_ROYAL: return new Color(0.15f, 0.08f, 0.25f);
                default: return new Color(0.08f, 0.14f, 0.30f);
            }
        }

        public Color GetBackgroundBottom()
        {
            switch (CurrentTheme)
            {
                case THEME_GOLDEN: return new Color(0.10f, 0.05f, 0.02f);
                case THEME_OCEAN: return new Color(0.02f, 0.05f, 0.12f);
                case THEME_FOREST: return new Color(0.02f, 0.08f, 0.05f);
                case THEME_ROYAL: return new Color(0.06f, 0.02f, 0.12f);
                default: return new Color(0.03f, 0.05f, 0.14f);
            }
        }

        public Color GetAccentColor()
        {
            switch (CurrentTheme)
            {
                case THEME_GOLDEN: return new Color(1f, 0.85f, 0.30f);
                case THEME_OCEAN: return new Color(0.35f, 0.85f, 0.95f);
                case THEME_FOREST: return new Color(0.40f, 0.90f, 0.45f);
                case THEME_ROYAL: return new Color(0.85f, 0.50f, 1f);
                default: return new Color(1f, 0.85f, 0.30f);
            }
        }
    }
}