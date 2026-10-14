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
        // (OnInstagram removed - moved to Home screen)
        // (OnFacebookLike removed - moved to Home screen)
        private void OnLanguageChange()
        {
            int cur = PlayerPrefs.GetInt(KEY_LANGUAGE, 0);
            string current = cur == 0 ? "English" : "Urdu";
            string[] langs = new string[] { "English", "Urdu", "Hindi", "Arabic" };
            ShowDropdown("SELECT LANGUAGE", langs, current, OnLanguageSelected);
        }

        private void OnLanguageSelected(string lang)
        {
            int idx = lang == "English" ? 0 : (lang == "Urdu" ? 1 : (lang == "Hindi" ? 2 : 3));
            PlayerPrefs.SetInt(KEY_LANGUAGE, idx);
            PlayerPrefs.SetString("Settings_LanguageName", lang);
            PlayerPrefs.Save();
            ShowToast("Language: " + lang);
            RefreshUI();
        }
        private void OnSfxToggle() { bool isOn = PlayerPrefs.GetInt(KEY_SFX, 1) == 1; if (AudioManager.Instance != null) AudioManager.Instance.SetSFXMuted(!isOn); ShowToast(isOn ? "Sound Effects ON" : "Sound Effects OFF"); }
        private void OnVibrationToggle() { bool isOn = PlayerPrefs.GetInt(KEY_VIBRATION, 1) == 1; if (isOn && Application.isMobilePlatform) { try { Handheld.Vibrate(); } catch { } } ShowToast(isOn ? "Vibration ON" : "Vibration OFF"); }
        private void OnNotificationsToggle() { bool isOn = PlayerPrefs.GetInt(KEY_NOTIFICATIONS, 1) == 1; ShowToast(isOn ? "Notifications ON" : "Notifications OFF"); }
        // ═══════════ AUDIO ═══════════
        private void OnMusicVolumeChanged(float v)
        {
            // 1. Modern AudioManager
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.SetMusicVolume(v);
                AudioManager.Instance.SetMusicMuted(v <= 0.01f);
            }

            // 2. MusicManager (actual background music)
            if (MusicManager.Instance != null)
            {
                MusicManager.Instance.SetVolume(v);
                MusicManager.Instance.SetMuted(v <= 0.01f);
            }
        }

        private void OnSFXVolumeChanged(float v)
        {
            // 1. Modern AudioManager
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.SetSFXVolume(v);
                AudioManager.Instance.SetSFXMuted(v <= 0.01f);
            }

            // 2. SoundManager (actual SFX tones)
            if (SoundManager.Instance != null)
            {
                SoundManager.Instance.SetVolume(v);
                SoundManager.Instance.SetMuted(v <= 0.01f);
            }

            // 3. Play test sound so user hears the change
            if (v > 0.05f && SoundManager.Instance != null)
                SoundManager.Instance.PlayButtonClick();
        }

        // ═══════════ GAMEPLAY ═══════════
        private void OnThemeChange()
        {
            string current = PlayerPrefs.GetString(KEY_THEME, "Classic");
            string[] themes = new string[] { "Classic", "Cosmic", "Ocean", "Sunset", "Forest", "Neon", "Ice", "Cherry", "Midnight" };
            ShowDropdown("SELECT THEME", themes, current, OnThemeSelected);
        }

        private void OnThemeSelected(string theme)
        {
            PlayerPrefs.SetString(KEY_THEME, theme);
            PlayerPrefs.Save();

            // Apply theme to game visuals
            if (ThemeManager.Instance != null)
                ThemeManager.Instance.SelectTheme(theme);

            // Rebuild cosmic background with new colors
            var cosmicTheme = FindFirstObjectByType<GameplayCosmicTheme>();
            if (cosmicTheme != null)
                cosmicTheme.BuildBackground();

            // Rebuild grid with new tile colors
            var grid = FindFirstObjectByType<GridVisualizer>();
            if (grid != null)
                grid.BuildVisuals();

            ShowToast("Theme: " + theme);
            RefreshUI();
        }

        private void OnAutoHintToggle()
        {
            bool isOn = PlayerPrefs.GetInt(KEY_AUTO_HINT, 0) == 1;
            ShowToast(isOn ? "Auto-Hint ON" : "Auto-Hint OFF");
        }

        private void OnShowTimerToggle()
        {
            bool isOn = PlayerPrefs.GetInt(KEY_SHOW_TIMER, 1) == 1;
            ShowToast(isOn ? "Timer Visible" : "Timer Hidden");
        }

        // ═══════════ SUPPORT US ═══════════
        private void OnRateUs()
        {
            Application.OpenURL(URL_RATE_US);
            ShowToast("Thanks for rating!");
        }

        private void OnShareApp()
        {
#if UNITY_ANDROID
            // Native Android share
            using (var intentClass = new AndroidJavaClass("android.content.Intent"))
            using (var unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
            {
                var intent = new AndroidJavaObject("android.content.Intent");
                intent.Call<AndroidJavaObject>("setAction", intentClass.GetStatic<string>("ACTION_SEND"));
                intent.Call<AndroidJavaObject>("setType", "text/plain");
                intent.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TEXT"),
                    "Check out Mera Word Search! " + URL_SHARE_APP);
                var currentActivity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
                currentActivity.Call("startActivity", intent);
            }
#else
            Application.OpenURL(URL_SHARE_APP);
#endif
        }

        // ═══════════ DANGER ZONE ═══════════
        private void OnResetProgress()
        {
            ShowConfirm("Reset Progress",
                "Are you sure? This will reset ALL your progress, coins, and achievements.\n\nThis cannot be undone.",
                () =>
                {
                    if (PlayerProgressManager.Instance != null)
                        PlayerProgressManager.Instance.ResetAll();
                    else
                    {
                        PlayerPrefs.DeleteAll();
                        PlayerPrefs.Save();
                    }
                    ShowToast("Progress reset. Restarting...");
                    Invoke(nameof(RestartGame), 2f);
                });
        }

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