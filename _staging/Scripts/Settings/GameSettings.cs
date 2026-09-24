using System;

namespace MeraWorld.Settings
{
    /// <summary>
    /// Player preferences — sound, vibration, language, etc.
    /// Pure data class, easily serialized.
    /// </summary>
    [Serializable]
    public class GameSettings
    {
        public bool SoundEnabled = true;
        public bool MusicEnabled = true;
        public bool VibrationEnabled = true;
        public float SoundVolume = 0.8f;
        public float MusicVolume = 0.6f;
        public string Language = "en";
        public bool ReduceMotion = false;
        public bool ColorBlindMode = false;

        public void ResetToDefaults()
        {
            SoundEnabled = true;
            MusicEnabled = true;
            VibrationEnabled = true;
            SoundVolume = 0.8f;
            MusicVolume = 0.6f;
            Language = "en";
            ReduceMotion = false;
            ColorBlindMode = false;
        }
    }
}