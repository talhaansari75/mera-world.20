using System;
using System.Collections;
using UnityEngine;
using GoogleMobileAds.Api;

namespace MeraWorld.Core
{
    public class AdsManager : MonoBehaviour
    {
        public static AdsManager Instance { get; private set; }

        [Header("Settings")]
        public int InterstitialEveryNLevels = 3;
        public int RewardedCoinsAmount = 100;
        public int RewardedCooldownSeconds = 60;

        [Header("AdMob IDs (REAL - Live)")]
        // Android
        private string BannerAdUnitId       = "ca-app-pub-4734715014990360/1963425065";
        private string InterstitialAdUnitId = "ca-app-pub-4734715014990360/4118815112";
        private string RewardedAdUnitId     = "ca-app-pub-4734715014990360/1156686413";

        public event Action<int> OnRewardedCoinsEarned;

        private int _levelsSinceLastInterstitial = 0;
        private float _lastRewardedTime = -100f;
        private bool _initialized = false;

        private BannerView _bannerView;
        private InterstitialAd _interstitialAd;
        private RewardedAd _rewardedAd;

        private bool _bannerLoaded = false;
        private bool _interstitialLoaded = false;
        private bool _rewardedLoaded = false;
        private bool _isShowingAd = false;
        private int _pendingRewardOverride = -1;

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

            Debug.Log("[Ads] Initializing AdMob...");
            MobileAds.Initialize((InitializationStatus initStatus) =>
            {
                _initialized = true;
                Debug.Log("[Ads] AdMob Initialization complete");

                LoadInterstitial();
                LoadRewarded();
                StartCoroutine(LoadBannerDelayed());
            });
        }

        // ===================== BANNER =====================

        private IEnumerator LoadBannerDelayed()
        {
            yield return new WaitForSeconds(2f);

            if (!_initialized || AdsRemoved) yield break;

            if (_bannerView != null) _bannerView.Destroy();

            _bannerView = new BannerView(BannerAdUnitId, AdSize.Banner, AdPosition.Bottom);

            _bannerView.OnBannerAdLoaded += () =>
            {
                _bannerLoaded = true;
                Debug.Log("[Ads] Banner loaded");
                ShowBanner();
            };

            _bannerView.OnBannerAdLoadFailed += (LoadAdError error) =>
            {
                _bannerLoaded = false;
                Debug.LogWarning($"[Ads] Banner load error: {error}");
            };

            _bannerView.LoadAd(new AdRequest());
        }

        public void ShowBanner()
        {
            if (!_initialized || AdsRemoved || !_bannerLoaded || _bannerView == null) return;
            _bannerView.Show();
            Debug.Log("[Ads] Banner shown");
        }

        public void HideBanner()
        {
            if (_bannerView != null)
            {
                _bannerView.Hide();
                Debug.Log("[Ads] Banner hide requested");
            }
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
            if (!_interstitialLoaded || _interstitialAd == null)
            {
                Debug.Log("[Ads] Interstitial not loaded yet");
                LoadInterstitial();
                return;
            }
            if (_isShowingAd) return;

            _isShowingAd = true;
            Debug.Log("[Ads] Showing interstitial");
            _interstitialAd.Show();
        }

        public void LoadInterstitial()
        {
            if (!_initialized || AdsRemoved) return;
            _interstitialLoaded = false;

            if (_interstitialAd != null)
            {
                _interstitialAd.Destroy();
                _interstitialAd = null;
            }

            InterstitialAd.Load(InterstitialAdUnitId, new AdRequest(),
                (InterstitialAd ad, LoadAdError error) =>
                {
                    if (error != null || ad == null)
                    {
                        Debug.LogWarning($"[Ads] Interstitial failed to load: {error}");
                        return;
                    }

                    Debug.Log("[Ads] Interstitial loaded");
                    _interstitialAd = ad;
                    _interstitialLoaded = true;

                    _interstitialAd.OnAdFullScreenContentClosed += () =>
                    {
                        _isShowingAd = false;
                        Debug.Log("[Ads] Interstitial closed");
                        LoadInterstitial();
                    };

                    _interstitialAd.OnAdFullScreenContentFailed += (AdError error) =>
                    {
                        _isShowingAd = false;
                        Debug.LogWarning($"[Ads] Interstitial failed to show: {error}");
                        LoadInterstitial();
                    };
                });
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

        public void ShowRewarded(int customRewardCoins = -1)
        {
            _pendingRewardOverride = customRewardCoins;
            if (!_initialized) return;

            if (!CanShowRewarded())
            {
                Debug.Log($"[Ads] Rewarded cooldown: {GetRewardedCooldownRemaining()}s");
                return;
            }

            if (!_rewardedLoaded || _rewardedAd == null)
            {
                Debug.Log("[Ads] Rewarded not loaded yet");
                LoadRewarded();
                return;
            }

            if (_isShowingAd) return;

            _isShowingAd = true;
            Debug.Log("[Ads] Showing rewarded");

            _rewardedAd.Show((Reward reward) =>
            {
                Debug.Log($"[Ads] User earned: {reward.Amount} {reward.Type}");
                GrantRewarded();
            });
        }

        public void LoadRewarded()
        {
            if (!_initialized || AdsRemoved) return;
            _rewardedLoaded = false;

            if (_rewardedAd != null)
            {
                _rewardedAd.Destroy();
                _rewardedAd = null;
            }

            RewardedAd.Load(RewardedAdUnitId, new AdRequest(),
                (RewardedAd ad, LoadAdError error) =>
                {
                    if (error != null || ad == null)
                    {
                        Debug.LogWarning($"[Ads] Rewarded failed to load: {error}");
                        return;
                    }

                    Debug.Log("[Ads] Rewarded loaded");
                    _rewardedAd = ad;
                    _rewardedLoaded = true;

                    _rewardedAd.OnAdFullScreenContentClosed += () =>
                    {
                        _isShowingAd = false;
                        Debug.Log("[Ads] Rewarded closed");
                        LoadRewarded();
                    };

                    _rewardedAd.OnAdFullScreenContentFailed += (AdError error) =>
                    {
                        _isShowingAd = false;
                        Debug.LogWarning($"[Ads] Rewarded failed: {error}");
                        LoadRewarded();
                    };
                });
        }

        // ===================== REWARD LOGIC =====================

        private void GrantRewarded()
        {
            int amount = _pendingRewardOverride > 0 ? _pendingRewardOverride : RewardedCoinsAmount;
            _pendingRewardOverride = -1;

            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.AddCoins(amount);

            _lastRewardedTime = Time.unscaledTime;
            OnRewardedCoinsEarned?.Invoke(amount);
            Debug.Log($"[Ads] Rewarded +{amount} coins granted");
        }
    }
}