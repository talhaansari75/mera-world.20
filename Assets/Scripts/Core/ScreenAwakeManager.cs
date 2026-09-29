using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Prevents the phone screen from going to sleep while the game is running.
    /// Also restores battery-friendly behavior when app is paused/backgrounded.
    /// </summary>
    public class ScreenAwakeManager : MonoBehaviour
    {
        void Awake()
        {
            // Keep screen on during gameplay
            Screen.sleepTimeout = SleepTimeout.NeverSleep;
            Debug.Log("[Screen] Sleep timeout disabled - screen will stay on");
        }

        void OnApplicationPause(bool isPaused)
        {
            if (isPaused)
            {
                // App in background - allow normal sleep
                Screen.sleepTimeout = SleepTimeout.SystemSetting;
                Debug.Log("[Screen] App paused - sleep timeout restored");
            }
            else
            {
                // App back in foreground - keep screen on
                Screen.sleepTimeout = SleepTimeout.NeverSleep;
                Debug.Log("[Screen] App resumed - sleep timeout disabled");
            }
        }

        void OnApplicationFocus(bool hasFocus)
        {
            if (hasFocus)
                Screen.sleepTimeout = SleepTimeout.NeverSleep;
        }

        void OnDestroy()
        {
            // Restore system default when this object destroyed
            Screen.sleepTimeout = SleepTimeout.SystemSetting;
        }
    }
}