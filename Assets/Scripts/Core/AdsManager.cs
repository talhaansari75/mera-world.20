using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class AdsManager : MonoBehaviour
    {
        public static AdsManager Instance { get; private set; }

        [Header("Settings")]
        public int InterstitialEveryNLevels = 3;
        public int RewardedCoinsAmount = 100;
        public int RewardedCooldownSeconds = 60;

        public event Action<int> OnRewardedCoinsEarned;

        private int _levelsSinceLastInterstitial = 0;
        private float _lastRewardedTime = -100f;
        private int _pendingRewardAmount = 100;
        private Canvas _canvas;
        private GameObject _interstitialPanel;
        private GameObject _rewardedPanel;
        private Text _interstitialCountdown;

        public bool AdsRemoved => PlayerPrefs.GetInt("RemoveAds", 0) == 1;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            Invoke(nameof(Setup), 0.5f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildInterstitialPanel();
            BuildRewardedPanel();

            Debug.Log("[Ads] Manager ready. Ads removed: " + AdsRemoved);
        }

        public void OnLevelCompleted()
        {
            if (AdsRemoved) return;

            _levelsSinceLastInterstitial++;
            if (_levelsSinceLastInterstitial >= InterstitialEveryNLevels)
            {
                _levelsSinceLastInterstitial = 0;
                ShowInterstitial();
            }
        }

        public void ShowInterstitial()
        {
            if (AdsRemoved) return;
            if (_interstitialPanel == null) return;

            Debug.Log("[Ads] Showing interstitial");
            _interstitialPanel.SetActive(true);
            StartCoroutine(InterstitialCountdownRoutine());
        }

        public bool CanShowRewarded()
        {
            return (Time.unscaledTime - _lastRewardedTime) >= RewardedCooldownSeconds;
        }

        public int GetRewardedCooldownRemaining()
        {
            float elapsed = Time.unscaledTime - _lastRewardedTime;
            if (elapsed >= RewardedCooldownSeconds) return 0;
            return Mathf.CeilToInt(RewardedCooldownSeconds - elapsed);
        }

        public void ShowRewarded() { ShowRewarded(RewardedCoinsAmount); }

        public void ShowRewarded(int amountOverride)
        {
            if (_rewardedPanel == null) return;
            if (!CanShowRewarded())
            {
                Debug.Log("[Ads] Rewarded on cooldown: " + GetRewardedCooldownRemaining() + "s left");
                return;
            }

            _pendingRewardAmount = amountOverride;
            Debug.Log("[Ads] Showing rewarded ad for " + amountOverride + " coins");
            _rewardedPanel.SetActive(true);
            StartCoroutine(RewardedRoutine());
        }
    }
}