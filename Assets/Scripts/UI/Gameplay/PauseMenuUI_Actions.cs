using UnityEngine;

namespace MeraWorld.Core
{
    public partial class PauseMenuUI
    {
        private void Restart()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();
            Debug.Log("[Pause] Restarting level");

            var gm = FindFirstObjectByType<GameManager>();
            if (gm != null) gm.ReloadFromProgress();
            var gv = FindFirstObjectByType<GridVisualizer>();
            if (gv != null) gv.BuildVisuals();
            var wl = FindFirstObjectByType<WordListUI>();
            if (wl != null) wl.ForceRebuild();
            var sm = FindFirstObjectByType<SelectionManager>();
            if (sm != null) sm.ResetProgress();

            Debug.Log("[Pause] In-place restart complete");

            if (_pauseButton != null && _pauseButton.scene.IsValid())
            {
                _pauseButton.SetActive(true);
                Debug.Log("[Pause] Pause button restored (cached ref)");
            }
            else
            {
                var found = GameObject.Find("PauseButton");
                if (found != null)
                {
                    _pauseButton = found;
                    found.SetActive(true);
                    Debug.Log("[Pause] Pause button re-found and enabled");
                }
                else
                {
                    Debug.LogError("[Pause] Pause button COMPLETELY GONE - cannot restore");
                }
            }

            if (_panel != null) _panel.SetActive(false);
            _isPaused = false;
        }

        private void OpenSettings()
        {
            Time.timeScale = 1f;
            var settings = FindFirstObjectByType<SettingsScreenUI>();
            if (settings != null)
            {
                settings.Show();
                _panel.SetActive(false);
            }
            else
            {
                Debug.LogWarning("[Pause] SettingsScreenUI not found");
            }
        }

        private void GoHome()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();
            Debug.Log("[Pause] Returning to home");

            HomeScreenUI.ForceShowHome();

            if (_panel != null) _panel.SetActive(false);
            if (_pauseButton != null) _pauseButton.SetActive(true);
            _isPaused = false;
        }
    }
}