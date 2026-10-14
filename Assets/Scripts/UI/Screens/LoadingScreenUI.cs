using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public partial class LoadingScreenUI : MonoBehaviour
    {
        public static LoadingScreenUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private RectTransform _titleRect;
        private RectTransform _spinnerRoot;
        private RectTransform _progressFillRect;
        private TextMeshProUGUI _tipText;
        private TextMeshProUGUI _loadingText;
        private Image[] _loadingDots;
        private TMP_FontAsset _premiumFont;
        private CanvasGroup _panelGroup;
        private GameObject _starsRoot;
        private float _elapsed;
        private bool _isShowing;
        private System.Action _onComplete;

        private static readonly string[] Tips = new string[]
        {
            "Tip: Fast finds earn combo bonuses!",
            "Tip: Use HINT when stuck",
            "Tip: Complete levels without hints for 3 stars",
            "Tip: Daily rewards give up to 500 coins!",
            "Tip: Watch rewarded ads for FREE coins",
            "Tip: Longer words are easier to spot first",
            "Tip: Diagonal words can go both directions",
            "Tip: Milestones unlock every 5 levels",
            "Tip: Collect pets to boost your coins!",
        };

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            Invoke(nameof(ForceDestroyIfStuck), 4f);
        }

        private void ForceDestroyIfStuck()
        {
            if (!_isShowing && _canvas != null)
            {
                Destroy(_canvas.gameObject);
                _canvas = null;
            }
        }

        public void Show(float duration = 1.5f, System.Action onComplete = null)
        {
            _onComplete = onComplete;
            CancelInvoke(nameof(ForceDestroyIfStuck));

            LoadPremiumFont();
            BuildCanvas();
            BuildBackground();
            BuildStars();
            BuildTitle();
            BuildSpinner();
            BuildLoadingText();
            BuildProgressBar();
            BuildTip();

            _panel.SetActive(true);
            _isShowing = true;
            PlayIntroAnimation();
            StartCoroutine(ShowFor(duration));
        }

        public void Hide()
        {
            if (_panelGroup != null)
                _panelGroup.DOFade(0f, 0.3f).SetUpdate(true);
            StartCoroutine(DestroyAfter(0.4f));
        }

        private IEnumerator DestroyAfter(float delay)
        {
            yield return new WaitForSecondsRealtime(delay);
            Cleanup();
        }

        private void Cleanup()
        {
            _isShowing = false;
            if (_panel != null) Destroy(_panel);
            if (_canvas != null) Destroy(_canvas.gameObject);
            _panel = null;
            _canvas = null;
        }

        private void LoadPremiumFont()
        {
            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null) _premiumFont = TMP_Settings.defaultFontAsset;
        }

        void OnDestroy()
        {
            if (Instance == this) Instance = null;
        }
    }

    public class SpinnerRotator : MonoBehaviour
    {
        public float Speed = 360f;
        void Update()
        {
            transform.Rotate(0f, 0f, -Speed * Time.unscaledDeltaTime);
        }
    }
}