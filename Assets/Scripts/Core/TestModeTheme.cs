using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Sirf TEST MODE ke liye. Production game ko affect nahi karta.
    /// Jab TEST BOT RACE button dabaya jata hai, tab active hota hai.
    /// </summary>
    public static class TestModeTheme
    {
        public static bool IsActive
        {
            get { return PlayerPrefs.GetInt("TestMode", 0) == 1; }
        }

        public static void Enable()
        {
            PlayerPrefs.SetInt("TestMode", 1);
            PlayerPrefs.Save();
            Debug.Log("[TestModeTheme] Enabled");
        }

        public static void Disable()
        {
            PlayerPrefs.SetInt("TestMode", 0);
            PlayerPrefs.Save();
            Debug.Log("[TestModeTheme] Disabled");
        }

        // Test mode colors
        public static readonly Color CreamBG = new Color(0.98f, 0.96f, 0.90f);
        public static readonly Color WhiteTileTop = new Color(1.00f, 1.00f, 1.00f);
        public static readonly Color WhiteTileMid = new Color(0.96f, 0.94f, 0.98f);
        public static readonly Color WhiteTileBottom = new Color(0.88f, 0.86f, 0.92f);
        public static readonly Color BrownLetter = new Color(0.35f, 0.20f, 0.10f);
        public static readonly Color BrownShadow = new Color(0f, 0f, 0f, 0.15f);
    }
}
