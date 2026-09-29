using UnityEngine;

namespace MeraWorld.Core
{
    public class VibrationManager : MonoBehaviour
    {
        public static VibrationManager Instance { get; private set; }
        private const string KEY_VIBRATION = "Settings_Vibration";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        public void VibrateLight() { Vibrate(30); }
        public void VibrateMedium() { Vibrate(80); }
        public void VibrateHeavy() { Vibrate(150); }

        private void Vibrate(long ms)
        {
            if (PlayerPrefs.GetInt(KEY_VIBRATION, 1) != 1) return;
            #if UNITY_ANDROID && !UNITY_EDITOR
            try { Handheld.Vibrate(); } catch { }
            #endif
        }
    }
}