using UnityEngine;

namespace MeraWorld.Core
{
    public static class GameModeManager
    {
        public const string MODE_CLASSIC    = "classic";
        public const string MODE_TIMEATTACK = "timeattack";
        public const string MODE_ZEN        = "zen";

        private const string KEY = "GameMode";

        public static string CurrentMode
        {
            get { return PlayerPrefs.GetString(KEY, MODE_CLASSIC); }
        }

        public static void SetMode(string mode)
        {
            if (string.IsNullOrEmpty(mode)) return;
            PlayerPrefs.SetString(KEY, mode);
            PlayerPrefs.Save();
            Debug.Log("[GameMode] Set to: " + mode);
        }

        public static bool IsClassic    { get { return CurrentMode == MODE_CLASSIC; } }
        public static bool IsTimeAttack { get { return CurrentMode == MODE_TIMEATTACK; } }
        public static bool IsZen        { get { return CurrentMode == MODE_ZEN; } }

        public static bool HasTimer
        {
            get { return !IsZen; }
        }

        public static bool IsCountdown
        {
            get { return IsTimeAttack; }
        }

        public static float GetTimeLimit()
        {
            if (IsTimeAttack) return 60f;
            return -1f;
        }

        public static string GetDisplayName()
        {
            switch (CurrentMode)
            {
                case MODE_TIMEATTACK: return "TIME ATTACK";
                case MODE_ZEN:        return "ZEN";
                default:              return "CLASSIC";
            }
        }

        public static void ResetToClassic()
        {
            SetMode(MODE_CLASSIC);
        }
    }
}