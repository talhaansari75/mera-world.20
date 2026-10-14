using System.Collections;
using UnityEngine;

namespace MeraWorld.Core
{
    public partial class MultiplayerMenuUI
    {
        private IEnumerator VerifyInBackground()
        {
            yield return InternetChecker.VerifyConnection();
            bool online = InternetChecker.IsOnline;

            if (_statusText != null)
                _statusText.text = online
                    ? "You are ONLINE."
                    : "You are OFFLINE.\nMultiplayer requires internet.";

            if (_findMatchButton != null)
                _findMatchButton.interactable = online;

            _isOnline = online;
        }

        private void HandleOnlineStatusChanged(bool online)
        {
            _isOnline = online;
        }

        private void OnFindMatchClicked()
        {
            if (!InternetChecker.QuickCheck())
            {
                if (_statusText != null)
                    _statusText.text = "You are OFFLINE.\nMultiplayer requires internet.";
                return;
            }

            StartCoroutine(FindMatchRoutine());
        }

        private IEnumerator FindMatchRoutine()
        {
            if (MatchmakingManager.Instance == null)
            {
                var go = new GameObject("MatchmakingManager");
                go.AddComponent<MatchmakingManager>();
            }

            _findMatchButton.gameObject.SetActive(false);
            _searchingPanel.SetActive(true);

            bool done = false;
            MatchmakingManager.MatchResult result = null;
            string errorMsg = null;

            System.Action<MatchmakingManager.MatchResult> onFound = (r) =>
            {
                result = r;
                done = true;
            };
            System.Action<string> onFail = (e) =>
            {
                errorMsg = e;
                done = true;
            };
            System.Action<float> onTick = UpdateTimer;

            MatchmakingManager.Instance.OnMatchFound += onFound;
            MatchmakingManager.Instance.OnMatchmakingFailed += onFail;
            MatchmakingManager.Instance.OnSearchTick += onTick;

            MatchmakingManager.Instance.StartMatchmaking();

            while (!done)
                yield return null;

            MatchmakingManager.Instance.OnMatchFound -= onFound;
            MatchmakingManager.Instance.OnMatchmakingFailed -= onFail;
            MatchmakingManager.Instance.OnSearchTick -= onTick;

            _searchingPanel.SetActive(false);
            _findMatchButton.gameObject.SetActive(true);

            if (errorMsg != null)
            {
                if (_statusText != null) _statusText.text = errorMsg;
                yield break;
            }

            if (result != null)
            {
                Debug.Log("[Multiplayer] Match found: " + result.OpponentName + " (bot: " + result.IsBot + ")");

                PlayerPrefs.SetString("BotRace_OpponentName", result.OpponentName);
                PlayerPrefs.SetInt("BotRace_Enabled", 1);
                PlayerPrefs.Save();

                if (_statusText != null)
                    _statusText.text = "Matched with " + result.OpponentName + "! Starting...";

                yield return new WaitForSeconds(1.2f);

                Hide();
                StartBotRace();
            }
        }

        private void OnTestBotRaceClicked()
        {
            Debug.Log("[TEST] Test mode - reload scene with cream theme");

            TestModeTheme.Enable();
            Hide();

            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.SetInt("ForceTestRace", 1);
            PlayerPrefs.Save();

            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        private void UpdateTimer(float remaining)
        {
            if (_timerText != null)
                _timerText.text = Mathf.CeilToInt(remaining) + "s";
        }

        private void StartBotRace()
        {
            var progress = PlayerProgressManager.Instance;
            int level = progress != null ? progress.HighestLevelUnlocked : 1;

            if (progress != null) progress.SetCurrentLevel(level);
            else
            {
                PlayerPrefs.SetInt("CurrentLevel", level);
                PlayerPrefs.Save();
            }

            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            Debug.Log("[Multiplayer] Loading scene with SkipHome=1");

            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        private void OnBack() { Hide(); }
    }
}