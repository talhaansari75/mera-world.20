using UnityEngine;

namespace MeraWorld.Core
{
    public partial class PauseSettingsUI
    {
        private void OnLanguageChange()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            int cur = PlayerPrefs.GetInt("Settings_Language", 0);
            PlayerPrefs.SetInt("Settings_Language", cur == 0 ? 1 : 0);
            PlayerPrefs.Save();
            if (_langValue != null) _langValue.text = (cur == 0) ? "URDU" : "ENGLISH";
        }

        private void OnMusicToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (AudioManager.Instance != null)
            {
                bool muted = !AudioManager.Instance.MusicMuted;
                AudioManager.Instance.SetMusicMuted(muted);
                _musicValue.text = muted ? "OFF" : "ON";
            }
        }

        private void OnSFXToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (AudioManager.Instance != null)
            {
                bool muted = !AudioManager.Instance.SFXMuted;
                AudioManager.Instance.SetSFXMuted(muted);
                _sfxValue.text = muted ? "OFF" : "ON";
            }
        }

        private void OnVibToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            int cur = PlayerPrefs.GetInt("Settings_Vibration", 1);
            PlayerPrefs.SetInt("Settings_Vibration", cur == 1 ? 0 : 1);
            PlayerPrefs.Save();
            if (_vibValue != null) _vibValue.text = (cur == 1) ? "OFF" : "ON";
        }

        private void OnHomeClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            Hide();
            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }
    }
}