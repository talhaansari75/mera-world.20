using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Central settings manager. Reads/writes to PlayerPrefs.
    /// Integrates with AudioManager for volume control.
    /// </summary>
    public static class SettingsManager
    {
        private const string KEY_MUSIC_ON = "Settings_MusicOn";
        private const string KEY_SFX_ON = "Settings_SFXOn";
        private const string KEY_VIBRATION_ON = "Settings_VibrationOn";
        private const string KEY_LANGUAGE = "Settings_Language";

        public static bool MusicOn
        {
            get => PlayerPrefs.GetInt(KEY_MUSIC_ON, 1) == 1;
            set
            {
                PlayerPrefs.SetInt(KEY_MUSIC_ON, value ? 1 : 0);
                PlayerPrefs.Save();
                if (AudioManager.Instance != null)
                    AudioManager.Instance.SetMusicMuted(!value);
            }
        }

        public static bool SFXOn
        {
            get => PlayerPrefs.GetInt(KEY_SFX_ON, 1) == 1;
            set
            {
                PlayerPrefs.SetInt(KEY_SFX_ON, value ? 1 : 0);
                PlayerPrefs.Save();
                if (AudioManager.Instance != null)
                    AudioManager.Instance.SetSFXMuted(!value);
            }
        }

        public static bool VibrationOn
        {
            get => PlayerPrefs.GetInt(KEY_VIBRATION_ON, 1) == 1;
            set { PlayerPrefs.SetInt(KEY_VIBRATION_ON, value ? 1 : 0); PlayerPrefs.Save(); }
        }

        public static string Language
        {
            get => PlayerPrefs.GetString(KEY_LANGUAGE, "en");
            set { PlayerPrefs.SetString(KEY_LANGUAGE, value); PlayerPrefs.Save(); }
        }

        public static void ApplyAll()
        {
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.SetMusicMuted(!MusicOn);
                AudioManager.Instance.SetSFXMuted(!SFXOn);
            }
        }

        public static void Reset()
        {
            MusicOn = true;
            SFXOn = true;
            VibrationOn = true;
            Language = "en";
        }
    }
}