using UnityEngine;

namespace MeraWorld.Core
{
    public partial class SettingsScreenUI
    {
        public const string KEY_SFX = "Settings_SFX_On";
        public const string KEY_VIBRATION = "Settings_Vibration_On";
        public const string KEY_NOTIFICATIONS = "Settings_Notifications_On";
        public const string KEY_POCKET = "Settings_PocketEffects_On";
        public const string KEY_STRIKERS = "Settings_AnimatedStrikers_On";
        public const string KEY_LANGUAGE = "Settings_Language";
        public const string KEY_FOLLOWED_INSTA = "Social_FollowedInstagram";
        public const string KEY_LIKED_FB = "Social_LikedFacebook";
        public const string KEY_LOGGED_IN = "Account_LoggedIn";
        public const string KEY_PROVIDER = "Account_Provider";

        private const string URL_INSTAGRAM = "https://instagram.com/";
        private const string URL_FACEBOOK = "https://facebook.com/";
        private const string URL_MORE_GAMES = "https://play.google.com/store/apps";
        private const string URL_HELP = "mailto:support@meraworld.game";
        private const string URL_TERMS = "https://meraworld.game/terms";
        private const string URL_PRIVACY = "https://meraworld.game/privacy";

        private static readonly Color ROW_BG = new Color(0.10f, 0.08f, 0.25f, 0.92f);
        private static readonly Color HEADER_BG = new Color(0.80f, 0.55f, 0.15f, 1f);
        private static readonly Color GREEN = new Color(0.25f, 0.75f, 0.30f);
        private static readonly Color BLUE = new Color(0.20f, 0.45f, 0.90f);
        private static readonly Color RED = new Color(0.85f, 0.20f, 0.20f);
        private static readonly Color GREY = new Color(0.3f, 0.3f, 0.35f);
        private static readonly Color GOLD = new Color(1f, 0.85f, 0.35f);
        private static readonly Color TEXT_GOLD = new Color(1f, 0.85f, 0.35f);
    }
}