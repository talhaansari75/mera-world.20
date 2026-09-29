using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

namespace MeraWorld.Core
{
    /// <summary>
    /// Detects whether the device has internet access.
    /// Caches result for a few seconds to avoid spamming checks.
    /// </summary>
    public static class InternetChecker
    {
        public static bool IsOnline { get; private set; } = false;
        public static event Action<bool> OnStatusChanged;

        private static float _lastCheckTime = -999f;
        private const float CACHE_SECONDS = 3f;
        private const string TEST_URL = "https://www.google.com/generate_204";

        /// <summary>
        /// Instant check using Unity's built-in reachability.
        /// Use for UI gating. Not 100% reliable but free.
        /// </summary>
        public static bool QuickCheck()
        {
            bool reachable = Application.internetReachability != NetworkReachability.NotReachable;
            SetStatus(reachable);
            return reachable;
        }

        /// <summary>
        /// Real HTTP check. Coroutine based. Reliable but slow.
        /// </summary>
        public static IEnumerator VerifyConnection()
        {
            if (Time.unscaledTime - _lastCheckTime < CACHE_SECONDS)
                yield break;

            _lastCheckTime = Time.unscaledTime;

            using (var req = UnityWebRequest.Head(TEST_URL))
            {
                req.timeout = 5;
                yield return req.SendWebRequest();

                bool ok = req.result == UnityWebRequest.Result.Success;
                SetStatus(ok);
            }
        }

        private static void SetStatus(bool online)
        {
            if (IsOnline != online)
            {
                IsOnline = online;
                OnStatusChanged?.Invoke(online);
            }
        }
    }
}