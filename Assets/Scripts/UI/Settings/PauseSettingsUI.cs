using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class PauseSettingsUI : MonoBehaviour
    {
        public static PauseSettingsUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Text _musicValue;
        private Text _sfxValue;
        private Text _vibValue;
        private Text _langValue;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        public void Show()
        {
            if (_panel == null) return;
            RefreshValues();
            _panel.SetActive(true);
            Time.timeScale = 0f;
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
            Time.timeScale = 1f;
        }

        private void RefreshValues()
        {
            if (AudioManager.Instance != null)
            {
                if (_musicValue != null) _musicValue.text = AudioManager.Instance.MusicMuted ? "OFF" : "ON";
                if (_sfxValue != null) _sfxValue.text = AudioManager.Instance.SFXMuted ? "OFF" : "ON";
            }
            if (_vibValue != null) _vibValue.text = PlayerPrefs.GetInt("Settings_Vibration", 1) == 1 ? "ON" : "OFF";
            if (_langValue != null) _langValue.text = PlayerPrefs.GetInt("Settings_Language", 0) == 0 ? "ENGLISH" : "URDU";
        }
    }
}