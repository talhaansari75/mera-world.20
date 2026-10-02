using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Advertisements;

namespace MeraWorld.Core
{
    public class AdsManager : MonoBehaviour,
        IUnityAdsInitializationListener,
        IUnityAdsLoadListener,
        IUnityAdsShowListener
    {
        public static AdsManager Instance { get; private set; }

        [Header("Settings")]
        public int InterstitialEveryNLevels = 3;
        public int RewardedCoinsAmount = 100;
        public int RewardedCooldownSeconds = 60;
        public bool TestMode = true;

        [Header("Unity Ads IDs")]
        private const string GAME_ID = "800384686";
        private const string BANNER_ID = "BP_Banner_Android";
        private const string INTERSTITIAL_ID = "BP_Interstitial_Android";
        private const string REWARDED_ID = "BP_Rewarded_Android";

        public event Action<int> OnRewardedCoinsEarned;

        private int _levelsSinceLastInterstitial = 0;
        private float _lastRewardedTime = -100f;
        private bool _initialized = false;
        private bool _bannerLoaded = false;
        private bool _interstitialLoaded = false;
        private bool _rewardedLoaded = false;
        private bool _isShowingAd = false;

        public bool AdsRemoved => PlayerPrefs.GetInt("RemoveAds", 0) == 1;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            InitializeAds();
        }

        // ===================== INITIALIZATION =====================

        private void InitializeAds()
        {
            if (AdsRemoved)
            {
                Debug.Log("[Ads] Ads removed - skipping init");
                return;
            }

            if (Advertisement.isInitialized)
            {
                _initialized = true;
                OnInitializationComplete();
                return;
            }

            Debug.Log("[Ads] Initializing Unity Ads...");
            Advertisement.Initialize(GAME_ID, TestMode, this);
        }

        public void OnInitializationComplete()
        {
            _initialized = true;
            Debug.Log("[Ads] Initialization complete");

            LoadInterstitial();
            LoadRewarded();
            StartCoroutine(LoadBannerDelayed());
        }

        public void OnInitializationFailed(UnityAdsInitializationError error, string message)
        {
            _initialized = false;
            Debug.LogWarning($"[Ads] Init failed: {error} - {message}");
        }

        // ===================== BANNER =====================

        private IEnumerator LoadBannerDelayed()
        {
            yield return new WaitForSeconds(2f);

            if (!_initialized || AdsRemoved) yield break;

            Advertisement.Banner.SetPosition(BannerPosition.BOTTOM_CENTER);
            var options = new BannerLoadOptions
            {
                loadCallback = () =>
                {
                    _bannerLoaded = true;
                    Debug.Log("[Ads] Banner loaded");
                    ShowBanner();
                },
                errorCallback = (msg) =>
                {
                    _bannerLoaded = false;
                    Debug.LogWarning($"[Ads] Banner load error: {msg}");
                }
            };
            Advertisement.Banner.Load(BANNER_ID, options);
        }

        public void ShowBanner()
        {
            if (!_initialized || AdsRemoved || !_bannerLoaded) return;

            var options = new BannerOptions
            {
                showCallback = () => Debug.Log("[Ads] Banner shown"),
                hideCallback = () => Debug.Log("[Ads] Banner hidden"),
                clickCallback = () => Debug.Log("[Ads] Banner clicked")
            };
            Advertisement.Banner.Show(BANNER_ID, options);
        }

        public void HideBanner()
        {
            if (!_initialized) return;
            Advertisement.Banner.Hide(false);
            Debug.Log("[Ads] Banner hide requested");
        }

        // ===================== INTERSTITIAL =====================

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
            if (!_initialized || AdsRemoved) return;
            if (!_interstitialLoaded)
            {
                Debug.Log("[Ads] Interstitial not loaded yet");
                LoadInterstitial();
                return;
            }
            if (_isShowingAd) return;

            _isShowingAd = true;
            Debug.Log("[Ads] Showing interstitial");
            Advertisement.Show(INTERSTITIAL_ID, this);
        }

        public void LoadInterstitial()
        {
            if (!_initialized || AdsRemoved) return;
            _interstitialLoaded = false;
            Advertisement.Load(INTERSTITIAL_ID, this);
        }

        // ===================== REWARDED =====================

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

        public void ShowRewarded()
        {
            if (!_initialized) return;
            if (!CanShowRewarded())
            {
                Debug.Log($"[Ads] Rewarded cooldown: {GetRewardedCooldownRemaining()}s");
                return;
            }
            if (!_rewardedLoaded)
            {
                Debug.Log("[Ads] Rewarded not loaded yet");
                LoadRewarded();
                return;
            }
            if (_isShowingAd) return;

            _isShowingAd = true;
            Debug.Log("[Ads] Showing rewarded");
            Advertisement.Show(REWARDED_ID, this);
        }

        public void LoadRewarded()
        {
            if (!_initialized || AdsRemoved) return;
            _rewardedLoaded = false;
            Advertisement.Load(REWARDED_ID, this);
        }

        // ===================== CALLBACKS =====================

        public void OnUnityAdsAdLoaded(string placementId)
        {
            Debug.Log($"[Ads] Loaded: {placementId}");
            if (placementId == INTERSTITIAL_ID) _interstitialLoaded = true;
            else if (placementId == REWARDED_ID) _rewardedLoaded = true;
        }

        public void OnUnityAdsFailedToLoad(string placementId, UnityAdsLoadError error, string message)
        {
            Debug.LogWarning($"[Ads] Load failed {placementId}: {error} - {message}");
            if (placementId == INTERSTITIAL_ID) _interstitialLoaded = false;
            else if (placementId == REWARDED_ID) _rewardedLoaded = false;
        }

        public void OnUnityAdsShowStart(string placementId)
        {
            Debug.Log($"[Ads] Show started: {placementId}");
        }

        public void OnUnityAdsShowClick(string placementId)
        {
            Debug.Log($"[Ads] Show clicked: {placementId}");
        }

        public void OnUnityAdsShowComplete(string placementId, UnityAdsShowCompletionState state)
        {
            _isShowingAd = false;
            Debug.Log($"[Ads] Show complete: {placementId} - {state}");

            if (placementId == INTERSTITIAL_ID)
            {
                LoadInterstitial();
            }
            else if (placementId == REWARDED_ID)
            {
                if (state == UnityAdsShowCompletionState.COMPLETED)
                {
                    GrantRewarded();
                }
                LoadRewarded();
            }
        }

        public void OnUnityAdsShowFailure(string placementId, UnityAdsShowError error, string message)
        {
            _isShowingAd = false;
            Debug.LogWarning($"[Ads] Show failed {placementId}: {error} - {message}");

            if (placementId == INTERSTITIAL_ID) LoadInterstitial();
            else if (placementId == REWARDED_ID) LoadRewarded();
        }

        private void GrantRewarded()
        {
            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(RewardedCoinsAmount);

            _lastRewardedTime = Time.unscaledTime;
            OnRewardedCoinsEarned?.Invoke(RewardedCoinsAmount);
            Debug.Log($"[Ads] Rewarded +{RewardedCoinsAmount} coins");
        }
    }
}