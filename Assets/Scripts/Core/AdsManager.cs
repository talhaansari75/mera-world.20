using System;
using System.Collections;
using UnityEngine;

#if UNITY_ADS_INSTALLED
using UnityEngine.Advertisements;
#endif

namespace MeraWorld.Core
{
    public class AdsManager : MonoBehaviour
#if UNITY_ADS_INSTALLED
        , IUnityAdsInitializationListener,
          IUnityAdsLoadListener,
          IUnityAdsShowListener
#endif
    {
        public static AdsManager Instance { get; private set; }

        [Header("Unity Ads IDs (from Dashboard)")]
        public string AndroidGameId = "800384686";
        public string IOSGameId = "800384686";
        public string BannerAdUnitId = "BP_Banner_Android";
        public string InterstitialAdUnitId = "BP_Interstitial_Android";
        public string RewardedAdUnitId = "BP_Rewarded_Android";

        [Header("Settings")]
        public bool TestMode = true;
        public bool BannerAutoShow = true;
        public int InterstitialMinGapSeconds = 90;

        [Header("Level Pacing")]
        public int InterstitialEveryNLevels = 3;

        [Header("Rewarded")]
        public int RewardedCoinsAmount = 100;
        public int RewardedCooldownSeconds = 60;

        public bool AdsRemoved { get; private set; }
        private float _lastInterstitialTime = -999f;
        private float _lastRewardedTime = -999f;
        private int _levelsPlayedSinceInterstitial = 0;
        private bool _isInitialized = false;
        private bool _rewardedReady = false;
        private bool _interstitialReady = false;
        private Action _onRewardedComplete;

        public event Action<bool> OnAdsRemovedChanged;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;

            // Only works if this GameObject is a root object.
            if (transform.parent == null)
            {
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Debug.Log("[Ads] Manager is a child object — skipping DontDestroyOnLoad.");
            }

            AdsRemoved = PlayerPrefs.GetInt("Inv_RemoveAds", 0) == 1;
            _levelsPlayedSinceInterstitial = 0;
        }

        void Start() { InitializeAds(); }

        private void InitializeAds()
        {
#if UNITY_ADS_INSTALLED
            string gameId = Application.platform == RuntimePlatform.IPhonePlayer
                ? IOSGameId : AndroidGameId;

            if (!Advertisement.isInitialized)
            {
                Debug.Log($"[Ads] Initializing with gameId={gameId}, testMode={TestMode}");
                Advertisement.Initialize(gameId, TestMode, this);
            }
#else
            Debug.Log("[Ads] Unity Ads package not installed — simulation mode.");
            _isInitialized = true;
            _rewardedReady = true;
            _interstitialReady = true;
#endif
        }

        // ------- Banner -------

        public void ShowBanner()
        {
            if (AdsRemoved) return;
            if (Application.isEditor)
            {
                Debug.Log("[Ads] Banner skipped in Editor (device only).");
                return;
            }
#if UNITY_ADS_INSTALLED
            if (!_isInitialized) return;
            Advertisement.Banner.SetPosition(BannerPosition.BOTTOM_CENTER);
            var options = new BannerOptions
            {
                showCallback = () => Debug.Log("[Ads] Banner shown"),
                hideCallback = () => Debug.Log("[Ads] Banner hidden")
            };
            Advertisement.Banner.Show(BannerAdUnitId, options);
#else
            Debug.Log("[Ads] Banner shown (simulated)");
#endif
        }

        public void HideBanner()
        {
            if (Application.isEditor) return;
#if UNITY_ADS_INSTALLED
            Advertisement.Banner.Hide();
#else
            Debug.Log("[Ads] Banner hidden (simulated)");
#endif
        }

        // ------- Interstitial -------

        public void OnLevelCompleted()
        {
            if (AdsRemoved) return;
            _levelsPlayedSinceInterstitial++;
            if (_levelsPlayedSinceInterstitial >= InterstitialEveryNLevels)
            {
                _levelsPlayedSinceInterstitial = 0;
                ShowInterstitial();
            }
        }

        public bool CanShowInterstitial()
        {
            if (AdsRemoved) return false;
            if (Time.unscaledTime - _lastInterstitialTime < InterstitialMinGapSeconds) return false;
            return true;
        }

        public void ShowInterstitial()
        {
            if (!CanShowInterstitial())
            {
                Debug.Log("[Ads] Interstitial skipped (ad-free or cooldown).");
                return;
            }
            _lastInterstitialTime = Time.unscaledTime;
#if UNITY_ADS_INSTALLED
            if (_interstitialReady)
                Advertisement.Show(InterstitialAdUnitId, this);
            else
                Debug.Log("[Ads] Interstitial not ready yet.");
#else
            Debug.Log("[Ads] Interstitial shown (simulated)");
#endif
        }

        // ------- Rewarded -------

        public bool CanShowRewarded()
        {
            if (Time.unscaledTime - _lastRewardedTime < RewardedCooldownSeconds) return false;
            return true;
        }

        public void ShowRewarded(Action onComplete)
        {
            if (!CanShowRewarded())
            {
                Debug.Log("[Ads] Rewarded cooldown active.");
                return;
            }
            _lastRewardedTime = Time.unscaledTime;
            _onRewardedComplete = onComplete;
#if UNITY_ADS_INSTALLED
            if (_rewardedReady)
                Advertisement.Show(RewardedAdUnitId, this);
            else
            {
                LoadRewarded();
                _onRewardedComplete?.Invoke();
                _onRewardedComplete = null;
            }
#else
            Debug.Log("[Ads] Rewarded shown (simulated) — granting reward");
            _onRewardedComplete?.Invoke();
            _onRewardedComplete = null;
#endif
        }

        public void ShowRewardedForCoins()
        {
            ShowRewarded(() =>
            {
                if (PlayerProgressManager.Instance != null)
                    PlayerProgressManager.Instance.AddCoins(RewardedCoinsAmount);

                if (StatisticsManager.Instance != null)
                    StatisticsManager.Instance.AddCoinsEarned(RewardedCoinsAmount);

                Debug.Log($"[Ads] Reward granted: +{RewardedCoinsAmount} coins");
            });
        }

        public void RemoveAds()
        {
            AdsRemoved = true;
            PlayerPrefs.SetInt("Inv_RemoveAds", 1);
            PlayerPrefs.Save();
            HideBanner();
            OnAdsRemovedChanged?.Invoke(true);
            Debug.Log("[Ads] Ads removed permanently.");
        }

        // ------- Callbacks -------

#if UNITY_ADS_INSTALLED
        public void OnInitializationComplete()
        {
            Debug.Log("[Ads] SDK initialized.");
            _isInitialized = true;
            LoadInterstitial();
            LoadRewarded();
            if (BannerAutoShow && !AdsRemoved) ShowBanner();
        }

        public void OnInitializationFailed(UnityAdsInitializationError error, string message)
        {
            Debug.LogError($"[Ads] Init failed: {error} — {message}");
        }

        private void LoadInterstitial() => Advertisement.Load(InterstitialAdUnitId, this);
        private void LoadRewarded() => Advertisement.Load(RewardedAdUnitId, this);

        public void OnUnityAdsAdLoaded(string placementId)
        {
            Debug.Log($"[Ads] Loaded: {placementId}");
            if (placementId == InterstitialAdUnitId) _interstitialReady = true;
            else if (placementId == RewardedAdUnitId) _rewardedReady = true;
        }

        public void OnUnityAdsFailedToLoad(string placementId, UnityAdsLoadError error, string message)
        {
            Debug.LogWarning($"[Ads] Load failed ({placementId}): {error} — {message}");
            StartCoroutine(RetryLoadAfter(30f, placementId));
        }

        private IEnumerator RetryLoadAfter(float sec, string placementId)
        {
            yield return new WaitForSeconds(sec);
            if (placementId == InterstitialAdUnitId) LoadInterstitial();
            else if (placementId == RewardedAdUnitId) LoadRewarded();
        }

        public void OnUnityAdsShowStart(string placementId) => Debug.Log($"[Ads] Show start: {placementId}");
        public void OnUnityAdsShowClick(string placementId) => Debug.Log($"[Ads] Click: {placementId}");

        public void OnUnityAdsShowComplete(string placementId, UnityAdsShowCompletionState state)
        {
            Debug.Log($"[Ads] Complete ({placementId}): {state}");
            if (placementId == RewardedAdUnitId)
            {
                if (state == UnityAdsShowCompletionState.COMPLETED)
                    _onRewardedComplete?.Invoke();
                _onRewardedComplete = null;
                _rewardedReady = false;
                LoadRewarded();
            }
            if (placementId == InterstitialAdUnitId)
            {
                _interstitialReady = false;
                LoadInterstitial();
            }
        }

        public void OnUnityAdsShowFailure(string placementId, UnityAdsShowError error, string message)
        {
            Debug.LogWarning($"[Ads] Show failed ({placementId}): {error} — {message}");
            if (placementId == RewardedAdUnitId)
            {
                _onRewardedComplete?.Invoke();
                _onRewardedComplete = null;
            }
        }
#endif
    }
}