using UnityEngine;

namespace MeraWorld.Core
{
    public partial class SettingsScreenUI
    {
        // AUDIO
        public const string KEY_MUSIC = "Audio_MusicVolume";  // matches AudioManager
        public const string KEY_SFX = "Audio_SFXVolume";  // matches AudioManager
        public const string KEY_VIBRATION = "Settings_Vibration_On";

        // GAMEPLAY
        public const string KEY_LANGUAGE = "Settings_Language";
        public const string KEY_THEME = "Settings_Theme";
        public const string KEY_AUTO_HINT = "Settings_AutoHint_On";
        public const string KEY_SHOW_TIMER = "Settings_ShowTimer_On";

        // NOTIFICATIONS
        public const string KEY_NOTIFICATIONS = "Settings_Notifications_On";
        public const string KEY_REMINDER_TIME = "Settings_ReminderTime";

        // ACCOUNT
        public const string KEY_LOGGED_IN = "Account_LoggedIn";
        public const string KEY_PROVIDER = "Account_Provider";

        // URLS
        private const string URL_RATE_US = "market://details?id=com.talha.meraword";
        private const string URL_SHARE_APP = "https://play.google.com/store/apps/details?id=com.talha.meraword";
        private const string URL_MORE_GAMES = "https://play.google.com/store/apps/developer?id=Talha+Ansari";
        private const string URL_HELP = "mailto:support@meraworld.game";
        private const string URL_TERMS = "https://meraworld.game/terms";
        private const string URL_PRIVACY = "https://meraworld.game/privacy";

        // COLORS
        private static Color ROW_BG => GetPaletteColor("PanelBottom", 0.92f);
        private static Color ROW_BG_PREMIUM => GetPaletteColor("PanelTop", 0.95f);
        private static Color HEADER_BG => GetPaletteColor("AccentColor", 1f);
        private static readonly Color GREEN = new Color(0.25f, 0.75f, 0.30f);
        private static readonly Color BLUE = new Color(0.20f, 0.45f, 0.90f);
        private static readonly Color RED = new Color(0.85f, 0.20f, 0.20f);
        private static readonly Color GREY = new Color(0.3f, 0.3f, 0.35f);

        private static Color GetPaletteColor(string which, float alpha)
        {
            var pal = (ThemeManager.Instance != null)
                ? ThemePalette.Get(ThemeManager.Instance.CurrentTheme)
                : ThemePalette.Get("Classic");
            Color c;
            if (which == "PanelTop") c = pal.PanelTop;
            else if (which == "PanelBottom") c = pal.PanelBottom;
            else c = pal.AccentColor;
            c.a = alpha;
            return c;
        }
        private static readonly Color GOLD = new Color(1f, 0.85f, 0.35f);
        private static readonly Color TEXT_GOLD = new Color(1f, 0.85f, 0.35f);
        private static readonly Color TRACK_BG = new Color(0.08f, 0.05f, 0.20f, 1f);
        private static readonly Color SLIDER_FILL = new Color(1f, 0.82f, 0.30f, 1f);
    }
}