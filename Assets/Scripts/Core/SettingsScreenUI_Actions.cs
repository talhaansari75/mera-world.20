using UnityEngine;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public partial class SettingsScreenUI
    {
        private void PlayClick() { if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick(); }

        private void GiveGems(int amount, string reason)
        {
            if (PlayerProgressManager.Instance != null)
            {
                PlayerProgressManager.Instance.SendMessage("AddGems", amount, SendMessageOptions.DontRequireReceiver);
                ShowToast(reason + "  +" + amount + " gems!");
            }
            else ShowToast(reason);
        }

        private void OnFacebookLogin() { PlayerPrefs.SetInt(KEY_LOGGED_IN, 1); PlayerPrefs.SetString(KEY_PROVIDER, "Facebook"); PlayerPrefs.Save(); ShowToast("Logged in with Facebook"); RefreshUI(); }
        private void OnGoogleLogin() { PlayerPrefs.SetInt(KEY_LOGGED_IN, 1); PlayerPrefs.SetString(KEY_PROVIDER, "Google"); PlayerPrefs.Save(); ShowToast("Logged in with Google"); RefreshUI(); }
        private void OnLogout()
        {
            ShowConfirm("Logout", "Are you sure you want to logout?",
                () => { PlayerPrefs.DeleteKey(KEY_LOGGED_IN); PlayerPrefs.DeleteKey(KEY_PROVIDER); PlayerPrefs.Save(); ShowToast("Logged out"); RefreshUI(); });
        }
        private void OnPlayTutorial() { TutorialManager.ResetTutorial(); PlayerPrefs.Save(); ShowToast("Tutorial will show on next level"); }
        private void OnPracticeMode() { PlayerPrefs.SetInt("GameMode_Practice", 1); PlayerPrefs.Save(); ShowToast("Starting Practice Mode..."); Invoke(nameof(Hide), 1.2f); }
        private void OnInstagram() { Application.OpenURL(URL_INSTAGRAM); if (PlayerPrefs.GetInt(KEY_FOLLOWED_INSTA, 0) == 1) { ShowToast("Thanks for following!"); return; } PlayerPrefs.SetInt(KEY_FOLLOWED_INSTA, 1); PlayerPrefs.Save(); GiveGems(10, "Followed Instagram!"); RefreshUI(); }
        private void OnFacebookLike() { Application.OpenURL(URL_FACEBOOK); if (PlayerPrefs.GetInt(KEY_LIKED_FB, 0) == 1) { ShowToast("Thanks for liking!"); return; } PlayerPrefs.SetInt(KEY_LIKED_FB, 1); PlayerPrefs.Save(); GiveGems(10, "Liked Facebook!"); RefreshUI(); }
        private void OnLanguageChange() { int cur = PlayerPrefs.GetInt(KEY_LANGUAGE, 0); int next = cur == 0 ? 1 : 0; PlayerPrefs.SetInt(KEY_LANGUAGE, next); PlayerPrefs.Save(); ShowToast(next == 0 ? "Language: English" : "Language: Urdu"); RefreshUI(); }
        private void OnSfxToggle() { bool isOn = PlayerPrefs.GetInt(KEY_SFX, 1) == 1; if (AudioManager.Instance != null) AudioManager.Instance.SetSFXMuted(!isOn); ShowToast(isOn ? "Sound Effects ON" : "Sound Effects OFF"); }
        private void OnVibrationToggle() { bool isOn = PlayerPrefs.GetInt(KEY_VIBRATION, 1) == 1; if (isOn && Application.isMobilePlatform) { try { Handheld.Vibrate(); } catch { } } ShowToast(isOn ? "Vibration ON" : "Vibration OFF"); }
        private void OnNotificationsToggle() { bool isOn = PlayerPrefs.GetInt(KEY_NOTIFICATIONS, 1) == 1; ShowToast(isOn ? "Notifications ON" : "Notifications OFF"); }
        private void OnMoreGames() { Application.OpenURL(URL_MORE_GAMES); }
        private void OnHelpSupport() { Application.OpenURL(URL_HELP); }
        private void OnTerms() { Application.OpenURL(URL_TERMS); }
        private void OnPrivacy() { Application.OpenURL(URL_PRIVACY); }

        private void OnDeleteAccount()
        {
            ShowConfirm("Delete Account",
                "Are you sure? This will permanently erase ALL your progress.\n\nThis cannot be undone.",
                () =>
                {
                    PlayerProgressManager.Instance.ResetAll();
                    PlayerPrefs.DeleteAll();
                    PlayerPrefs.Save();
                    ShowToast("Account deleted. Restarting...");
                    Invoke(nameof(RestartGame), 2f);
                });
        }

        private void RestartGame() { SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex); }

        private void OnCredits()
        {
            ShowInfo("Credits",
                "Mera World v1.0\n\nDeveloped by:\n   Talha Ansari\n\nGame Design:\n   Talha Ansari\n\nProgramming:\n   Talha Ansari\n\nArt & UI:\n   Talha Ansari\n\nBuilt with Unity 6 LTS\n\nCopyright 2026 Mera World.");
        }

        private string GetUserId()
        {
            string id = PlayerPrefs.GetString("User_Id", "");
            if (string.IsNullOrEmpty(id))
            {
                id = System.Guid.NewGuid().ToString();
                PlayerPrefs.SetString("User_Id", id);
                PlayerPrefs.Save();
            }
            return id.Substring(0, System.Math.Min(20, id.Length)) + "...";
        }
    }
}