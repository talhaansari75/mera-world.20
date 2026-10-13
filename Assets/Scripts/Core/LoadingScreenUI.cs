using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    /// <summary>
    /// Premium loading overlay.
    /// Used for level transitions AND first game start.
    /// Does NOT reload scene — pure overlay on existing scene.
    /// </summary>
    public class LoadingScreenUI : MonoBehaviour
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
            // Auto-hide after 4 seconds if Show() never called
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

        /// <summary>
        /// Show loading overlay for the given duration, then call onComplete.
        /// </summary>
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

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LoadingCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 950;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            _panel = new GameObject("LoadingPanel");
            _panel.transform.SetParent(_canvas.transform, false);
            var rt = _panel.AddComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            _panelGroup = _panel.AddComponent<CanvasGroup>();
            _panelGroup.alpha = 1f;
        }

        private void BuildBackground()
        {
            var baseObj = new GameObject("BG_Base");
            baseObj.transform.SetParent(_panel.transform, false);
            var baseImg = baseObj.AddComponent<Image>();
            baseImg.color = new Color(0.04f, 0.02f, 0.12f, 1f);
            baseImg.raycastTarget = false;
            var brt = baseObj.GetComponent<RectTransform>();
            brt.anchorMin = Vector2.zero;
            brt.anchorMax = Vector2.one;
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            var glowObj = new GameObject("BG_Glow");
            glowObj.transform.SetParent(_panel.transform, false);
            var glowImg = glowObj.AddComponent<Image>();
            glowImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(0.4f, 0.2f, 0.6f), 256);
            glowImg.color = new Color(0.5f, 0.3f, 0.9f, 0.35f);
            glowImg.raycastTarget = false;
            var grt = glowObj.GetComponent<RectTransform>();
            grt.anchorMin = new Vector2(0.5f, 0.5f);
            grt.anchorMax = new Vector2(0.5f, 0.5f);
            grt.pivot = new Vector2(0.5f, 0.5f);
            grt.anchoredPosition = new Vector2(0f, 350f);
            grt.sizeDelta = new Vector2(1400f, 1400f);
        }

        private void BuildStars()
        {
            _starsRoot = new GameObject("Stars");
            _starsRoot.transform.SetParent(_panel.transform, false);
            var srt = _starsRoot.AddComponent<RectTransform>();
            srt.anchorMin = Vector2.zero;
            srt.anchorMax = Vector2.one;
            srt.offsetMin = Vector2.zero;
            srt.offsetMax = Vector2.zero;

            for (int i = 0; i < 40; i++)
            {
                var star = new GameObject("Star_" + i);
                star.transform.SetParent(_starsRoot.transform, false);
                var sImg = star.AddComponent<Image>();
                sImg.sprite = UISpriteFactory.Create3DSphereSprite(Color.white, 16);
                sImg.color = new Color(1f, 0.95f, 0.7f, Random.Range(0.4f, 0.9f));
                sImg.raycastTarget = false;

                var rt = star.GetComponent<RectTransform>();
                rt.anchorMin = new Vector2(0.5f, 0.5f);
                rt.anchorMax = new Vector2(0.5f, 0.5f);
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.anchoredPosition = new Vector2(Random.Range(-500f, 500f), Random.Range(-900f, 900f));
                float size = Random.Range(4f, 10f);
                rt.sizeDelta = new Vector2(size, size);

                float dur = Random.Range(1.5f, 3f);
                Sequence s = DOTween.Sequence().SetUpdate(true);
                s.Append(sImg.DOFade(0.15f, dur * 0.5f).SetEase(Ease.InOutSine));
                s.Append(sImg.DOFade(Random.Range(0.5f, 0.9f), dur * 0.5f).SetEase(Ease.InOutSine));
                s.SetLoops(-1, LoopType.Restart);
                s.SetTarget(sImg);
            }
        }

        private void BuildTitle()
        {
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_panel.transform, false);
            var titleTxt = titleObj.AddComponent<TextMeshProUGUI>();
            titleTxt.text = "MERA\nWORLD";
            if (_premiumFont != null) titleTxt.font = _premiumFont;
            titleTxt.fontSize = 155;
            titleTxt.fontStyle = FontStyles.Bold;
            titleTxt.alignment = TextAlignmentOptions.Center;
            titleTxt.raycastTarget = false;
            titleTxt.lineSpacing = -20f;
            titleTxt.enableVertexGradient = true;
            titleTxt.colorGradient = new VertexGradient(
                new Color(1.0f, 0.98f, 0.55f),
                new Color(1.0f, 0.98f, 0.55f),
                new Color(0.95f, 0.55f, 0.08f),
                new Color(0.95f, 0.55f, 0.08f)
            );
            titleTxt.outlineWidth = 0.35f;
            titleTxt.outlineColor = new Color32(70, 25, 0, 255);
            titleTxt.characterSpacing = 4f;

            _titleRect = titleObj.GetComponent<RectTransform>();
            _titleRect.anchorMin = new Vector2(0.5f, 0.5f);
            _titleRect.anchorMax = new Vector2(0.5f, 0.5f);
            _titleRect.pivot = new Vector2(0.5f, 0.5f);
            _titleRect.anchoredPosition = new Vector2(0f, 480f);
            _titleRect.sizeDelta = new Vector2(1000f, 400f);
            _titleRect.localScale = Vector3.one;

            var subObj = new GameObject("Subtitle");
            subObj.transform.SetParent(_panel.transform, false);
            var subTxt = subObj.AddComponent<TextMeshProUGUI>();
            subTxt.text = "P R E M I U M   W O R D   G A M E";
            if (_premiumFont != null) subTxt.font = _premiumFont;
            subTxt.fontSize = 22;
            subTxt.color = new Color(0.75f, 0.60f, 1f, 0.9f);
            subTxt.alignment = TextAlignmentOptions.Center;
            subTxt.raycastTarget = false;

            var subRt = subObj.GetComponent<RectTransform>();
            subRt.anchorMin = new Vector2(0.5f, 0.5f);
            subRt.anchorMax = new Vector2(0.5f, 0.5f);
            subRt.pivot = new Vector2(0.5f, 0.5f);
            subRt.anchoredPosition = new Vector2(0f, 280f);
            subRt.sizeDelta = new Vector2(900f, 40f);
        }

        private void BuildSpinner()
        {
            var spinnerRoot = new GameObject("SpinnerRoot");
            spinnerRoot.transform.SetParent(_panel.transform, false);
            var srt = spinnerRoot.AddComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 0.5f);
            srt.anchorMax = new Vector2(0.5f, 0.5f);
            srt.pivot = new Vector2(0.5f, 0.5f);
            srt.anchoredPosition = new Vector2(0f, 40f);
            srt.sizeDelta = new Vector2(140f, 140f);

            for (int i = 0; i < 3; i++)
            {
                var arc = new GameObject("Arc_" + i);
                arc.transform.SetParent(spinnerRoot.transform, false);
                var arcImg = arc.AddComponent<Image>();
                arcImg.sprite = CreateRingSprite(128);
                arcImg.color = new Color(1f, 0.85f, 0.3f, 0.9f);
                arcImg.raycastTarget = false;

                var rt = arc.GetComponent<RectTransform>();
                rt.anchorMin = new Vector2(0.5f, 0.5f);
                rt.anchorMax = new Vector2(0.5f, 0.5f);
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.anchoredPosition = Vector2.zero;
                float scale = 1f - i * 0.22f;
                rt.sizeDelta = new Vector2(140f * scale, 140f * scale);

                var spinner = arc.AddComponent<SpinnerRotator>();
                spinner.Speed = 360f * (i + 1) * (i % 2 == 0 ? 1 : -1);
            }
        }

        private void BuildLoadingText()
        {
            var loadObj = new GameObject("LoadingText");
            loadObj.transform.SetParent(_panel.transform, false);
            _loadingText = loadObj.AddComponent<TextMeshProUGUI>();
            _loadingText.text = "LOADING";
            if (_premiumFont != null) _loadingText.font = _premiumFont;
            _loadingText.fontSize = 28;
            _loadingText.fontStyle = FontStyles.Bold;
            _loadingText.color = new Color(0.95f, 0.9f, 0.7f, 0.9f);
            _loadingText.alignment = TextAlignmentOptions.Center;
            _loadingText.raycastTarget = false;
            _loadingText.characterSpacing = 8f;

            var lt = loadObj.GetComponent<RectTransform>();
            lt.anchorMin = new Vector2(0.5f, 0.5f);
            lt.anchorMax = new Vector2(0.5f, 0.5f);
            lt.pivot = new Vector2(0.5f, 0.5f);
            lt.anchoredPosition = new Vector2(-25f, -100f);
            lt.sizeDelta = new Vector2(400f, 40f);

            _loadingDots = new Image[3];
            for (int i = 0; i < 3; i++)
            {
                var dot = new GameObject("Dot_" + i);
                dot.transform.SetParent(_panel.transform, false);
                var di = dot.AddComponent<Image>();
                di.sprite = UISpriteFactory.Create3DSphereSprite(Color.white, 32);
                di.color = new Color(1f, 0.85f, 0.3f, 0.5f);
                di.raycastTarget = false;

                var rt = dot.GetComponent<RectTransform>();
                rt.anchorMin = new Vector2(0.5f, 0.5f);
                rt.anchorMax = new Vector2(0.5f, 0.5f);
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.anchoredPosition = new Vector2(95f + i * 22f, -100f);
                rt.sizeDelta = new Vector2(12f, 12f);
                _loadingDots[i] = di;
            }
        }

        private void BuildProgressBar()
        {
            var barBgObj = new GameObject("ProgressBarBG");
            barBgObj.transform.SetParent(_panel.transform, false);
            var barBgImg = barBgObj.AddComponent<Image>();
            barBgImg.color = new Color(0.10f, 0.05f, 0.20f, 0.95f);
            barBgImg.raycastTarget = false;

            var outline = barBgObj.AddComponent<Outline>();
            outline.effectColor = new Color(1f, 0.75f, 0.20f, 1f);
            outline.effectDistance = new Vector2(2.5f, 2.5f);

            var brt = barBgObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = new Vector2(0f, -200f);
            brt.sizeDelta = new Vector2(640f, 22f);

            var fillObj = new GameObject("ProgressFill");
            fillObj.transform.SetParent(barBgObj.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = new Color(1f, 0.80f, 0.20f, 1f);
            fillImg.raycastTarget = false;

            _progressFillRect = fillObj.GetComponent<RectTransform>();
            _progressFillRect.anchorMin = new Vector2(0f, 0f);
            _progressFillRect.anchorMax = new Vector2(0f, 1f);
            _progressFillRect.pivot = new Vector2(0f, 0.5f);
            _progressFillRect.anchoredPosition = new Vector2(3f, 0f);
            _progressFillRect.sizeDelta = new Vector2(0f, -6f);

            var shine = new GameObject("Shine");
            shine.transform.SetParent(fillObj.transform, false);
            var shineImg = shine.AddComponent<Image>();
            shineImg.color = new Color(1f, 1f, 1f, 0.4f);
            shineImg.raycastTarget = false;
            var shr = shine.GetComponent<RectTransform>();
            shr.anchorMin = new Vector2(0f, 0.55f);
            shr.anchorMax = new Vector2(1f, 0.9f);
            shr.offsetMin = Vector2.zero;
            shr.offsetMax = Vector2.zero;
        }

        private void BuildTip()
        {
            var tipObj = new GameObject("Tip");
            tipObj.transform.SetParent(_panel.transform, false);
            _tipText = tipObj.AddComponent<TextMeshProUGUI>();
            _tipText.text = Tips[Random.Range(0, Tips.Length)];
            if (_premiumFont != null) _tipText.font = _premiumFont;
            _tipText.fontSize = 22;
            _tipText.fontStyle = FontStyles.Italic;
            _tipText.color = new Color(0.70f, 0.80f, 1f, 0.85f);
            _tipText.alignment = TextAlignmentOptions.Center;
            _tipText.raycastTarget = false;

            var trt = tipObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 0f);
            trt.anchorMax = new Vector2(0.5f, 0f);
            trt.pivot = new Vector2(0.5f, 0f);
            trt.anchoredPosition = new Vector2(0f, 260f);
            trt.sizeDelta = new Vector2(900f, 80f);
        }

        private void PlayIntroAnimation()
        {
            if (_titleRect == null) return;

            Sequence intro = DOTween.Sequence().SetUpdate(true);
            intro.Append(_titleRect.DOPunchScale(Vector3.one * 0.15f, 0.6f, 6, 0.5f));

            if (_progressFillRect != null)
            {
                _progressFillRect.sizeDelta = new Vector2(0f, -6f);
                intro.Join(_progressFillRect.DOSizeDelta(
                    new Vector2(634f, -6f), 1.2f).SetEase(Ease.OutQuad).SetUpdate(true));
            }
        }

        void Update()
        {
            _elapsed += Time.unscaledDeltaTime;

            if (_loadingDots != null)
            {
                for (int i = 0; i < _loadingDots.Length; i++)
                {
                    if (_loadingDots[i] == null) continue;
                    float phase = _elapsed * 3f - i * 0.3f;
                    float alpha = 0.3f + (Mathf.Sin(phase) * 0.5f + 0.5f) * 0.7f;
                    var c = _loadingDots[i].color;
                    c.a = alpha;
                    _loadingDots[i].color = c;
                }
            }
        }

        private IEnumerator ShowFor(float duration)
        {
            yield return new WaitForSecondsRealtime(duration);

            // Fade out
            if (_panelGroup != null)
            {
                _panelGroup.DOKill();
                _panelGroup.DOFade(0f, 0.35f).SetEase(Ease.InQuad).SetUpdate(true);
            }

            // Kill stars
            if (_starsRoot != null)
            {
                var starImgs = _starsRoot.GetComponentsInChildren<Image>(true);
                foreach (var img in starImgs)
                    if (img != null) DOTween.Kill(img, false);
            }

            yield return new WaitForSecondsRealtime(0.4f);

            Cleanup();

            _onComplete?.Invoke();
        }

        private Sprite CreateRingSprite(int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            float half = size / 2f;
            float outer = size * 0.48f;
            float inner = size * 0.38f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dx = x - half + 0.5f;
                    float dy = y - half + 0.5f;
                    float d = Mathf.Sqrt(dx * dx + dy * dy);
                    float angle = Mathf.Atan2(dy, dx) * Mathf.Rad2Deg;
                    bool inArc = angle > -45f && angle < 135f;

                    if (inArc && d < outer && d > inner)
                    {
                        float alpha = Mathf.Clamp01((outer - d) / 2f);
                        pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                    }
                    else
                    {
                        pixels[y * size + x] = new Color(1f, 1f, 1f, 0f);
                    }
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
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