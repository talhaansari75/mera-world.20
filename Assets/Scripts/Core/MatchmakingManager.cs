using System;
using System.Collections;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Handles online matchmaking.
    /// 1. Check internet
    /// 2. Search for real player (up to 5 seconds)
    /// 3. If none found, spawn bot as fallback
    /// </summary>
    public class MatchmakingManager : MonoBehaviour
    {
        public static MatchmakingManager Instance { get; private set; }

        [Header("Settings")]
        public float SearchTimeoutSeconds = 5f;

        public event Action<MatchResult> OnMatchFound;
        public event Action<string> OnMatchmakingFailed;

        public class MatchResult
        {
            public bool IsBot;
            public string OpponentName;
            public BotOpponent Bot;
        }

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        public void StartMatchmaking()
        {
            StartCoroutine(MatchmakingRoutine());
        }

        private IEnumerator MatchmakingRoutine()
        {
            // Step 1: Internet check
            yield return InternetChecker.VerifyConnection();

            if (!InternetChecker.IsOnline)
            {
                OnMatchmakingFailed?.Invoke("You are offline. Multiplayer requires internet.");
                yield break;
            }

            // Step 2: Search for real player
            Debug.Log("[Matchmaking] Searching for real player...");
            float elapsed = 0f;
            OnlineSession foundSession = null;

            // TODO: Replace this with real backend call (Photon, PlayFab, custom)
            // For now, simulate search — no real player available yet
            while (elapsed < SearchTimeoutSeconds)
            {
                elapsed += Time.unscaledDeltaTime;

                // Real matchmaking call goes here:
                // foundSession = OnlineLobby.FindOpponent();

                if (foundSession != null) break;

                yield return null;
            }

            // Step 3: If no real player, use bot
            if (foundSession == null)
            {
                Debug.Log("[Matchmaking] No real player found. Spawning bot...");
                var bot = SpawnBot();
                OnMatchFound?.Invoke(new MatchResult
                {
                    IsBot = true,
                    OpponentName = bot != null ? bot.DisplayName : "Bot",
                    Bot = bot
                });
                yield break;
            }

            // Real player found
            Debug.Log("[Matchmaking] Real player matched!");
            OnMatchFound?.Invoke(new MatchResult
            {
                IsBot = false,
                OpponentName = foundSession.PlayerName,
                Bot = null
            });
        }

        private BotOpponent SpawnBot()
        {
            var existing = FindFirstObjectByType<BotOpponent>();
            if (existing != null) return existing;

            var go = new GameObject("BotOpponent");
            return go.AddComponent<BotOpponent>();
        }

        public void CancelMatchmaking()
        {
            StopAllCoroutines();
        }
    }
}