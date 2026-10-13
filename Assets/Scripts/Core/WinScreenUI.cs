using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public class WinScreenUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        [Header("Star Rating Settings")]
        public float ThreeStarMaxSeconds = 60f;
        public float TwoStarMaxSeconds = 120f;

        [HideInInspector] public int HintsUsed = 0;

        private Canvas _canvas;
        private GameObject _panel;
        private CanvasGroup _panelGroup;
        private TextMeshProUGUI _titleText;
        private Image[] _starImages = new Image[3];
        private TextMeshProUGUI _bonusText;
        private Button[] _buttons = new Button[4];
        private TMP_FontAsset _premiumFont;
        private float _levelStartTime;
        private int _starsEarned = 0;

        private const string STARS_KEY_PREFIX = "Stars_Level_";

        void Start()
        {
            _levelStartTime = Time.time;
            Invoke(nameof(Setup), 0.3f);
        }

        private void Setup()
        {
            EnsureEventSystem();
            LoadPremiumFont();
            BuildHiddenPanel();

            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();

            if (SelectionManager != null)
            {
                MeraWorld.Core.SelectionManager.OnLevelComplete -= ShowWinScreen;
                MeraWorld.Core.SelectionManager.OnLevelComplete += ShowWinScreen;
                Debug.Log("[WinScreen] Subscribed to OnLevelComplete");
            }
        }

        private void LoadPremiumFont()
        {
            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null)
                _premiumFont = TMP_Settings.defaultFontAsset;
        }

        private void EnsureEventSystem()
        {
            if (EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<EventSystem>();
                es.AddComponent<StandaloneInputModule>();
            }
        }

        private void BuildHiddenPanel()
        {
            var canvasObj = new GameObject("WinCanvas");
            canvasObj.transform.SetParent(transform);

            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 220;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            // === DARK OVERLAY ===
            _panel = new GameObject("Overlay");
            _panel.transform.SetParent(_canvas.transform, false);

            var overlay = _panel.AddComponent<Image>();
            overlay.color = new Color(0f, 0f, 0f, 0.88f);

            _panelGroup = _panel.AddComponent<CanvasGroup>();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // === ORNATE CENTER PANEL (3D look) ===
            BuildCenterPanel(_panel.transform);

            _panel.SetActive(false);
        }

        // === 3D Premium Center Panel ===
        private void BuildCenterPanel(Transform parent)
        {
            var centerPanel = new GameObject("CenterPanel");
            centerPanel.transform.SetParent(parent, false);

            var panelImg = centerPanel.AddComponent<Image>();
            // 3D button sprite with dark purple gradient
            panelImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.10f, 0.04f, 0.20f), 512, 30);
            panelImg.type = Image.Type.Sliced;
            panelImg.color = Color.white;

            var cprt = centerPanel.GetComponent<RectTransform>();
            cprt.anchorMin = new Vector2(0.5f, 0.5f);
            cprt.anchorMax = new Vector2(0.5f, 0.5f);
            cprt.pivot = new Vector2(0.5f, 0.5f);
            cprt.anchoredPosition = Vector2.zero;
            cprt.sizeDelta = new Vector2(950f, 1400f);

            // Gold border frame
            var borderObj = new GameObject("GoldBorder");
            borderObj.transform.SetParent(centerPanel.transform, false);
            var borderImg = borderObj.AddComponent<Image>();
            borderImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.85f, 0.55f, 0.10f), 512, 30);
            borderImg.type = Image.Type.Sliced;
            borderImg.raycastTarget = false;

            var brt = borderObj.GetComponent<RectTransform>();
            brt.anchorMin = Vector2.zero;
            brt.anchorMax = Vector2.one;
            brt.offsetMin = new Vector2(-8f, -8f);
            brt.offsetMax = new Vector2(8f, 8f);

            // Move border BEHIND panel
            borderObj.transform.SetSiblingIndex(0);

            // === TITLE TEXT (TMP with gold gradient) ===
            _titleText = CreateTMPText(centerPanel.transform, "LEVEL 1 COMPLETE!",
                new Vector2(0f, 540f), 85, true);

            // === STARS ===
            CreateStarsRow(centerPanel.transform);

            // === BONUS TEXT ===
            _bonusText = CreateTMPText(centerPanel.transform, "+100 BONUS COINS",
                new Vector2(0f, 50f), 50, false);
            _bonusText.color = new Color(1f, 0.9f, 0.4f);
            _bonusText.outlineWidth = 0.18f;
            _bonusText.outlineColor = new Color32(80, 30, 0, 255);

            // === 3D BUTTONS ===
            _buttons[0] = Create3DButton(centerPanel.transform, "NEXT LEVEL",
                new Vector2(0f, -180f), new Vector2(560f, 130f),
                new Color(0.20f, 0.65f, 0.25f), OnNextLevel);

            _buttons[1] = Create3DButton(centerPanel.transform, "REPLAY",
                new Vector2(0f, -340f), new Vector2(560f, 130f),
                new Color(0.20f, 0.45f, 0.80f), OnReplay);

            _buttons[2] = Create3DButton(centerPanel.transform, "HOME",
                new Vector2(0f, -500f), new Vector2(560f, 130f),
                new Color(0.35f, 0.35f, 0.42f), OnHome);
        }

        private void CreateStarsRow(Transform parent)
        {
            for (int i = 0; i < 3; i++)
            {
                var starObj = new GameObject($"Star_{i}");
                starObj.transform.SetParent(parent, false);

                var img = starObj.AddComponent<Image>();
                img.color = new Color(0.25f, 0.25f, 0.30f);
                img.sprite = CreateStarSprite();

                var rt = starObj.GetComponent<RectTransform>();
                rt.anchorMin = new Vector2(0.5f, 0.5f);
                rt.anchorMax = new Vector2(0.5f, 0.5f);
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.anchoredPosition = new Vector2(-220f + i * 220f, 300f);
                rt.sizeDelta = new Vector2(180f, 180f);

                _starImages[i] = img;
            }
        }

        // === TMP Text with optional gold gradient ===
        private TextMeshProUGUI CreateTMPText(Transform parent, string content, Vector2 pos,
            int size, bool goldGradient)
        {
            var obj = new GameObject("Text_" + content);
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<TextMeshProUGUI>();
            txt.text = content;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = size;
            txt.fontStyle = FontStyles.Bold;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;

            if (goldGradient)
            {
                txt.enableVertexGradient = true;
                txt.colorGradient = new VertexGradient(
                    new Color(1.0f, 0.98f, 0.55f),
                    new Color(1.0f, 0.98f, 0.55f),
                    new Color(0.95f, 0.55f, 0.08f),
                    new Color(0.95f, 0.55f, 0.08f)
                );
                txt.outlineWidth = 0.25f;
                txt.outlineColor = new Color32(70, 25, 0, 255);
            }
            else
            {
                txt.color = new Color(1f, 0.95f, 0.85f);
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 160f);

            return txt;
        }

        // === 3D Button ===
        private Button Create3DButton(Transform parent, string label, Vector2 pos, Vector2 size,
            Color baseColor, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Button_{label}");
            obj.transform.SetParent(parent, false);

            // Shadow layer (behind)
            var shadowObj = new GameObject("Shadow");
            shadowObj.transform.SetParent(obj.transform, false);
            var shadowImg = shadowObj.AddComponent<Image>();
            shadowImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(baseColor.r * 0.3f, baseColor.g * 0.3f, baseColor.b * 0.3f), 256, 20);
            shadowImg.type = Image.Type.Sliced;
            shadowImg.raycastTarget = false;
            var shr = shadowObj.GetComponent<RectTransform>();
            shr.anchorMin = Vector2.zero;
            shr.anchorMax = Vector2.one;
            shr.offsetMin = new Vector2(0f, -12f);
            shr.offsetMax = new Vector2(0f, -12f);

            // Main button
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(baseColor, 256, 20);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            // Label (TMP)
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);

            var txt = textObj.AddComponent<TextMeshProUGUI>();
            txt.text = label;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = 55;
            txt.fontStyle = FontStyles.Bold;
            txt.color = Color.white;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;
            txt.outlineWidth = 0.2f;
            txt.outlineColor = new Color32(0, 0, 0, 200);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            // Top highlight line (glossy feel)
            var highlightObj = new GameObject("Highlight");
            highlightObj.transform.SetParent(obj.transform, false);
            var highlightImg = highlightObj.AddComponent<Image>();
            highlightImg.color = new Color(1f, 1f, 1f, 0.18f);
            highlightImg.raycastTarget = false;
            var hrt = highlightObj.GetComponent<RectTransform>();
            hrt.anchorMin = new Vector2(0.05f, 0.65f);
            hrt.anchorMax = new Vector2(0.95f, 0.92f);
            hrt.offsetMin = Vector2.zero;
            hrt.offsetMax = Vector2.zero;

            return btn;
        }

        private void ShowWinScreen()
        {
            if (_panel == null) return;

            float elapsed = Time.time - _levelStartTime;
            _starsEarned = CalculateStars(elapsed, HintsUsed);

            Debug.Log($"[Level Complete] Time: {elapsed:F0}s, Hints: {HintsUsed}, Stars: {_starsEarned}");

            if (_titleText != null && GameManager != null)
                _titleText.text = $"LEVEL {GameManager.CurrentLevel} COMPLETE!";

            for (int i = 0; i < 3; i++)
            {
                if (_starImages[i] == null) continue;
                _starImages[i].color = i < _starsEarned
                    ? new Color(1f, 0.85f, 0.25f)
                    : new Color(0.25f, 0.25f, 0.30f);
            }

            if (GameManager != null)
            {
                int levelNum = GameManager.CurrentLevel;
                int previousStars = PlayerPrefs.GetInt(STARS_KEY_PREFIX + levelNum, 0);
                if (_starsEarned > previousStars)
                {
                    PlayerPrefs.SetInt(STARS_KEY_PREFIX + levelNum, _starsEarned);
                    PlayerPrefs.Save();
                }
            }

            _panel.SetActive(true);
            PlayWinScreenIntro();

            if (AdsManager.Instance != null)
                AdsManager.Instance.OnLevelCompleted();
        }

        private void PlayWinScreenIntro()
        {
            if (_panelGroup == null) return;

            _panelGroup.DOKill();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            Sequence intro = DOTween.Sequence();
            intro.Append(_panelGroup.DOFade(1f, 0.25f).SetEase(Ease.OutQuad));

            if (_titleText != null)
            {
                var titleRt = _titleText.rectTransform;
                titleRt.DOKill();
                titleRt.localScale = Vector3.one * 0.5f;
                intro.Join(titleRt.DOScale(1f, 0.4f).SetEase(Ease.OutBack));
            }

            for (int i = 0; i < 3; i++)
            {
                if (_starImages[i] == null) continue;
                _starImages[i].rectTransform.DOKill();
                _starImages[i].rectTransform.localScale = Vector3.zero;
            }

            float starStart = 0.35f;
            float starGap = 0.18f;

            for (int i = 0; i < 3; i++)
            {
                if (_starImages[i] == null) continue;
                var starRt = _starImages[i].rectTransform;

                if (i < _starsEarned)
                {
                    starRt.localScale = Vector3.zero;
                    starRt.localRotation = Quaternion.Euler(0, 0, -60f);
                    Sequence ss = DOTween.Sequence();
                    ss.AppendInterval(starStart + i * starGap);
                    ss.Append(starRt.DOScale(1.5f, 0.25f).SetEase(Ease.OutBack));
                    ss.Join(starRt.DORotate(Vector3.zero, 0.4f).SetEase(Ease.OutBack));
                    ss.Append(starRt.DOScale(1f, 0.15f).SetEase(Ease.OutQuad));
                }
                else
                {
                    starRt.localScale = Vector3.one * 0.7f;
                    Sequence ss = DOTween.Sequence();
                    ss.AppendInterval(starStart + i * starGap);
                    ss.Append(starRt.DOScale(1f, 0.25f).SetEase(Ease.OutQuad));
                }
            }

            if (_bonusText != null)
            {
                var brt = _bonusText.rectTransform;
                var bcg = _bonusText.GetComponent<CanvasGroup>();
                if (bcg == null) bcg = _bonusText.gameObject.AddComponent<CanvasGroup>();
                bcg.DOKill();
                bcg.alpha = 0f;
                Sequence bs = DOTween.Sequence();
                bs.AppendInterval(starStart + 3 * starGap);
                bs.Append(bcg.DOFade(1f, 0.3f));
                bs.Join(brt.DOPunchScale(Vector3.one * 0.15f, 0.4f, 8, 0.5f));
            }

            float btnStart = starStart + 3 * starGap + 0.2f;
            for (int i = 0; i < _buttons.Length; i++)
            {
                if (_buttons[i] == null) continue;
                var brt = _buttons[i].GetComponent<RectTransform>();
                var bcg = _buttons[i].GetComponent<CanvasGroup>();
                if (bcg == null) bcg = _buttons[i].gameObject.AddComponent<CanvasGroup>();
                bcg.DOKill();
                bcg.alpha = 0f;

                Vector2 target = brt.anchoredPosition;
                brt.anchoredPosition = target + new Vector2(0, -50f);

                Sequence bs = DOTween.Sequence();
                bs.AppendInterval(btnStart + i * 0.1f);
                bs.Append(bcg.DOFade(1f, 0.25f));
                bs.Join(brt.DOAnchorPos(target, 0.35f).SetEase(Ease.OutBack));
            }

            intro.OnComplete(() =>
            {
                if (_panelGroup != null) _panelGroup.blocksRaycasts = true;
            });
        }

        private int CalculateStars(float timeSeconds, int hints)
        {
            int stars = 1;
            if (timeSeconds <= ThreeStarMaxSeconds) stars = 3;
            else if (timeSeconds <= TwoStarMaxSeconds) stars = 2;

            if (hints >= 3) stars = Mathf.Min(stars, 1);
            else if (hints >= 1) stars = Mathf.Min(stars, 2);

            return Mathf.Clamp(stars, 1, 3);
        }

        private void OnNextLevel()
        {
            if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
            if (_panel != null) _panel.SetActive(false);

            // Show premium loading screen, then transition
            if (LoadingScreenUI.Instance != null)
            {
                LoadingScreenUI.Instance.Show(0.8f, DoNextLevelTransition);
            }
            else
            {
                DoNextLevelTransition();
            }
        }

        private void DoNextLevelTransition()
        {
                        if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
                        if (_panel != null) _panel.SetActive(false);
            
                        int currentLevel = GameManager != null ? GameManager.CurrentLevel : 1;
                        int nextLevel = currentLevel + 1;
            
                        if (PlayerProgressManager.Instance != null)
                        {
                            PlayerProgressManager.Instance.AddCoins(100);
                            PlayerProgressManager.Instance.AddStars(_starsEarned);
                            PlayerProgressManager.Instance.SetCurrentLevel(nextLevel);
                        }
                        else
                        {
                            PlayerPrefs.SetInt("CurrentLevel", nextLevel);
                            PlayerPrefs.Save();
                        }
            
                        PlayerPrefs.SetInt("SkipHome", 1);
                        PlayerPrefs.Save();
            
                        // Scene reload DISABLED - in-place next level load
                        var gm = FindFirstObjectByType<GameManager>();
                        if (gm != null) gm.ReloadFromProgress();
                        var gv = FindFirstObjectByType<GridVisualizer>();
                        if (gv != null) gv.BuildVisuals();
                        var wl = FindFirstObjectByType<WordListUI>();
                        if (wl != null) wl.ForceRebuild();
                        var sm = FindFirstObjectByType<SelectionManager>();
                        if (sm != null) sm.ResetProgress();
                        Debug.Log("[WinScreen] Next level loaded in-place");
        }

        private void OnReplay()
        {
            if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
            if (_panel != null) _panel.SetActive(false);
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();
            // SceneManager.LoadScene(...) DISABLED
            // Replay in-place (no scene reload)
            var gm = FindFirstObjectByType<GameManager>();
            if (gm != null) gm.ReloadFromProgress();
            var gv = FindFirstObjectByType<GridVisualizer>();
            if (gv != null) gv.BuildVisuals();
            var wl = FindFirstObjectByType<WordListUI>();
            if (wl != null) wl.ForceRebuild();
            var sm = FindFirstObjectByType<SelectionManager>();
            if (sm != null) sm.ResetProgress();
            Debug.Log("[WinScreen] Replay in-place");
        }

        private void OnHome()
        {
            if (_panelGroup != null) _panelGroup.blocksRaycasts = false;
            if (_panel != null) _panel.SetActive(false);
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();
            // SceneManager.LoadScene(...) DISABLED
            // Show home in-place (no scene reload)
            var hs = FindFirstObjectByType<HomeScreenUI>();
            if (hs != null) HomeScreenUI.ForceShowHome();
            Debug.Log("[WinScreen] Home shown in-place");
        }

        private Sprite CreateStarSprite()
        {
            int size = 128;
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            Vector2 center = new Vector2(size / 2f, size / 2f);
            float outerRadius = size * 0.48f;
            float innerRadius = size * 0.20f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    Vector2 point = new Vector2(x, y);
                    Vector2 dir = point - center;
                    float dist = dir.magnitude;
                    float angle = Mathf.Atan2(dir.y, dir.x) + Mathf.PI / 2f;
                    if (angle < 0) angle += 2f * Mathf.PI;

                    float segment = (2f * Mathf.PI) / 5f;
                    float halfSeg = segment / 2f;
                    float localAngle = angle % segment;

                    float targetRadius = (localAngle < halfSeg)
                        ? Mathf.Lerp(outerRadius, innerRadius, localAngle / halfSeg)
                        : Mathf.Lerp(innerRadius, outerRadius, (localAngle - halfSeg) / halfSeg);

                    float alpha = dist < targetRadius ? 1f : 0f;
                    if (dist > targetRadius - 2f && dist < targetRadius + 1f)
                        alpha = Mathf.Clamp01(targetRadius - dist + 1f);

                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                MeraWorld.Core.SelectionManager.OnLevelComplete -= ShowWinScreen;
        }
    }
}
