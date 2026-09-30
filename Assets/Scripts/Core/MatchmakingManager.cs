using System;
using System.Collections;
using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Online-only matchmaking.
    /// 1. Check internet
    /// 2. Search for a real player for up to N seconds
    /// 3. If none found, send bot name back as fallback
    ///
    /// NOTE: This only returns the opponent NAME. The actual race is
    /// run by BotRaceMode in the gameplay scene. So we don't need to
    /// spawn any MonoBehaviour here.
    /// </summary>
    public class MatchmakingManager : MonoBehaviour
    {
        public static MatchmakingManager Instance { get; private set; }

        [Header("Settings")]
        public float SearchTimeoutSeconds = 5f;

        public event Action<MatchResult> OnMatchFound;
        public event Action<string> OnMatchmakingFailed;
        public event Action<float> OnSearchTick; // remaining seconds

        public class MatchResult
        {
            public bool IsBot;
            public string OpponentName;
        }

        private bool _isSearching = false;
        public bool IsSearching => _isSearching;

        private static readonly string[] BotNames = {
            "Alex", "Sam", "Riley", "Jordan", "Casey", "Morgan",
            "Taylor", "Aiden", "Emma", "Liam", "Maya", "Noah",
            "Zara", "Owen", "Aisha", "Rayan", "Hina", "Bilal",
            "Sara", "Hamza", "Fatima", "Usman", "Layla", "Daniyal"
        };

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        public void StartMatchmaking()
        {
            if (_isSearching) return;
            StartCoroutine(MatchmakingRoutine());
        }

        public void CancelMatchmaking()
        {
            StopAllCoroutines();
            _isSearching = false;
        }

        private IEnumerator MatchmakingRoutine()
        {
            _isSearching = true;

            // Step 1: Verify connection
            yield return InternetChecker.VerifyConnection();

            if (!InternetChecker.IsOnline)
            {
                _isSearching = false;
                OnMatchmakingFailed?.Invoke("You are offline. Multiplayer requires internet.");
                yield break;
            }

            // Step 2: Try to find a real player
            Debug.Log("[Matchmaking] Searching for real player...");
            float elapsed = 0f;

            // TODO: Replace with real backend call (PlayFab / Photon / custom server).
            // Right now no backend exists, so a real player will never be found.
            bool realPlayerFound = false;
            string opponentName = null;

            while (elapsed < SearchTimeoutSeconds)
            {
                elapsed += Time.unscaledDeltaTime;
                OnSearchTick?.Invoke(SearchTimeoutSeconds - elapsed);

                // Real matchmaking code would go here:
                // realPlayerFound = Lobby.FindOpponent(out opponentName);

                if (realPlayerFound) break;
                yield return null;
            }

            // Step 3: Fallback to bot
            if (!realPlayerFound)
            {
                Debug.Log("[Matchmaking] No real player found. Using bot fallback...");
                _isSearching = false;

                string botName = BotNames[UnityEngine.Random.Range(0, BotNames.Length)];
                OnMatchFound?.Invoke(new MatchResult
                {
                    IsBot = true,
                    OpponentName = botName
                });
                yield break;
            }

            Debug.Log($"[Matchmaking] Matched with real player: {opponentName}");
            _isSearching = false;
            OnMatchFound?.Invoke(new MatchResult
            {
                IsBot = false,
                OpponentName = opponentName
            });
        }
    }
}