using UnityEngine;

namespace MeraWorld.Core
{
    public static class ThemeConfig
    {
        public const string THEME_KEY = "SelectedHomeTheme";
        public const int THEME_COSMIC = 0;
        public const int THEME_GOLDEN = 1;

        public static int CurrentTheme
        {
            get { return THEME_COSMIC; }
        }

        public static bool IsGolden { get { return false; } }

        public static void ToggleTheme()
        {
            int next = IsGolden ? THEME_COSMIC : THEME_GOLDEN;
            PlayerPrefs.SetInt(THEME_KEY, next);
            PlayerPrefs.Save();
        }

        public static string BackgroundPath
        {
            get { return IsGolden ? "UI/HomeScreen/Golden/Backgrounds/bg_golden" : "UI/HomeScreen/Backgrounds/bg_space"; }
        }

        public static string TitlePath
        {
            get { return IsGolden ? "UI/HomeScreen/Golden/Titles/title_golden" : "UI/HomeScreen/Titles/title_search_journey"; }
        }

        public static string PlayButtonPath
        {
            get { return IsGolden ? "UI/HomeScreen/Golden/Buttons/btn_play_golden" : "UI/HomeScreen/Buttons/btn_play"; }
        }

        public static string FramePath
        {
            get { return IsGolden ? "UI/HomeScreen/Golden/Frames/frame_category_golden" : "UI/HomeScreen/Frames/frame_category"; }
        }

        public static string IconPath(string iconName)
        {
            return IsGolden 
                ? "UI/HomeScreen/Golden/Icons/" + iconName + "_golden" 
                : "UI/HomeScreen/Icons/" + iconName;
        }
    }
}