using UnityEngine;

namespace MeraWorld.Core
{
    public class BatteryOptimizer : MonoBehaviour
    {
        [Header("Settings")]
        public int ActiveFPS = 60;
        public int IdleFPS = 30;
        public int BackgroundFPS = 15;
        public float IdleTimeoutSeconds = 30f;

        private float _lastInteraction;

        void Start()
        {
            Application.targetFrameRate = ActiveFPS;
            QualitySettings.vSyncCount = 0;
            _lastInteraction = Time.time;
            Debug.Log($"[Battery] Target FPS set to {ActiveFPS}");
        }

        void Update()
        {
            if (Input.anyKey || Input.GetMouseButton(0))
                _lastInteraction = Time.time;

            float idleTime = Time.time - _lastInteraction;

            if (idleTime > IdleTimeoutSeconds)
            {
                if (Application.targetFrameRate != IdleFPS)
                {
                    Application.targetFrameRate = IdleFPS;
                    Debug.Log($"[Battery] Idle - FPS set to {IdleFPS}");
                }
            }
            else
            {
                if (Application.targetFrameRate != ActiveFPS)
                {
                    Application.targetFrameRate = ActiveFPS;
                    Debug.Log($"[Battery] Active - FPS set to {ActiveFPS}");
                }
            }
        }

        void OnApplicationPause(bool isPaused)
        {
            if (isPaused)
            {
                Application.targetFrameRate = BackgroundFPS;
                Debug.Log($"[Battery] Background - FPS set to {BackgroundFPS}");
            }
            else
            {
                Application.targetFrameRate = ActiveFPS;
                Debug.Log($"[Battery] Resumed - FPS set to {ActiveFPS}");
            }
        }
    }
}