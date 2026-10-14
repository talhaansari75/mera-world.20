using System;
using UnityEngine;

namespace MeraWorld.Core
{
    public class CloudSaveManager : MonoBehaviour
    {
        public static CloudSaveManager Instance { get; private set; }

        public event Action<DateTime> OnSaveCompleted;

        private const string KEY_LAST_SYNC = "Cloud_LastSync";
        private const string KEY_AUTO_SYNC = "Cloud_AutoSync";
        private const float SYNC_INTERVAL = 60f;

        private float _lastSyncTime;

        public bool AutoSyncEnabled => PlayerPrefs.GetInt(KEY_AUTO_SYNC, 1) == 1;
        public DateTime LastSyncTime
        {
            get
            {
                string s = PlayerPrefs.GetString(KEY_LAST_SYNC, "");
                DateTime dt;
                return DateTime.TryParse(s, out dt) ? dt : DateTime.MinValue;
            }
        }

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            _lastSyncTime = 0f;
            Debug.Log("[Cloud] Manager started");
        }

        void Update()
        {
            if (!AutoSyncEnabled) return;

            _lastSyncTime += Time.unscaledDeltaTime;
            if (_lastSyncTime >= SYNC_INTERVAL)
            {
                _lastSyncTime = 0f;
                SaveToCloud();
            }
        }

        public void SaveToCloud()
        {
            // Placeholder — real implementation needs Firebase/PlayFab
            string now = DateTime.UtcNow.ToString("o");
            PlayerPrefs.SetString(KEY_LAST_SYNC, now);
            PlayerPrefs.Save();

            OnSaveCompleted?.Invoke(DateTime.UtcNow);
            Debug.Log($"[Cloud] Auto-saved at {now}");
        }

        public void ForceSync()
        {
            _lastSyncTime = 0f;
            SaveToCloud();
        }

        public void SetAutoSync(bool enabled)
        {
            PlayerPrefs.SetInt(KEY_AUTO_SYNC, enabled ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log($"[Cloud] Auto-sync: {enabled}");
        }

        void OnApplicationPause(bool paused)
        {
            if (paused) SaveToCloud();
        }

        void OnApplicationQuit()
        {
            SaveToCloud();
        }
    }
}