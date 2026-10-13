using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Keeps the screen awake during gameplay.
    /// Allows sleep only on Home screen.
    /// </summary>
    public class ScreenAwakeManager : MonoBehaviour
    {
        private static ScreenAwakeManager _instance;

        void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }
            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        void Start()
        {
            // Default: keep awake
            SetAwake(true);
        }

        void OnApplicationPause(bool paused)
        {
            if (!paused)
            {
                // App resumed - restore based on current state
                bool isHome = HomeScreenUI.IsHomeVisible;
                SetAwake(!isHome);
            }
        }

        void OnApplicationFocus(bool focused)
        {
            if (focused)
            {
                bool isHome = HomeScreenUI.IsHomeVisible;
                SetAwake(!isHome);
            }
        }

        public static void SetAwake(bool awake)
        {
            Screen.sleepTimeout = awake 
                ? SleepTimeout.NeverSleep 
                : SleepTimeout.SystemSetting;

            Debug.Log($"[ScreenAwake] Sleep timeout: {(awake ? "Never Sleep" : "System Setting")}");
        }

        public static void OnGameplayStarted()
        {
            SetAwake(true);
        }

        public static void OnGameplayEnded()
        {
            // Home screen pe allow sleep (battery save)
            SetAwake(false);
        }
    }
}
