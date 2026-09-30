using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public class HomeScreenUI : MonoBehaviour
    {
        public static bool IsHomeVisible { get; private set; } = false;

        [Header("References")]
        public PlayerProgressManager Progress;

        [Header("Timing")]
        [Tooltip("Kitne second baad home canvas hide karein (gameplay ke liye)")]
        public float HideHomeDelaySeconds = 2f;

        private Canvas _homeCanvas;
        private Canvas _levelSelectCanvas;
        private GameObject _starfieldParent;
        private GameObject _titleGroup;
        private Image[] _parallaxStars;

        private const string STARS_KEY_PREFIX = "Stars_Level_";

        private static bool _skipHomeForThisSession = false;
        private bool _showGameplayOnSetup = false;

        private static readonly Color BG_TOP = new Color(0.08f, 0.14f, 0.30f);
        private static readonly Color BG_BOTTOM = new Color(0.03f, 0.05f, 0.14f);
        private static readonly Color GOLD = new Color(1f, 0.85f, 0.30f);
        private static readonly Color GREEN = new Color(0.25f, 0.65f, 0.35f);
        private static readonly Color BLUE = new Color(0.25f, 0.45f, 0.85f);

        // =================================================================
        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            if (PlayerPrefs.HasKey("SkipHome"))
            {
                PlayerPrefs.DeleteKey("SkipHome");
                PlayerPrefs.Save();
            }

            IsHomeVisible = true;

            bool showGameplay = _skipHomeForThisSession;
            _skipHomeForThisSession = false;
            _showGameplayOnSetup = showGameplay;

            Debug.Log($"[HomeScreen] Start — showGameplay={showGameplay}");

            Invoke(nameof(Setup), 0.2f);
        }

        private void Setup()
        {
            // EnsureEventSystem() — DISABLED. Scene mein manually EventSystem rakha gaya hai.
            // Agar do EventSystem honge to UI clicks conflict karenge.

            BuildHomeCanvas();
            BuildLevelSelectCanvas();
            BuildStarfield();
            StartCoroutine(AnimateStars());
            StartCoroutine(FloatTitle());

            if (_showGameplayOnSetup)
            {
                Debug.Log("[HomeScreen] Showing GAMEPLAY (delayed hide).");
                ShowGameplay();
            }
            else
            {
                Debug.Log("[HomeScreen] Showing HOME screen.");
                ShowHome();
            }
        }

        // =================================================================
        // HOME CANVAS
        // =================================================================
        private void BuildHomeCanvas()
        {
            var canvasObj = new GameObject("HomeCanvas");
            _homeCanvas = canvasObj.AddComponent<Canvas>();
            _homeCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _homeCanvas.sortingOrder = 500;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var bgObj = new GameObject("BackgroundGradient");
            bgObj.transform.SetParent(_homeCanvas.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.CreateGradientSprite(BG_BOTTOM, BG_TOP, 32, 256);
            bgImg.type = Image.Type.Simple;
            bgImg.color = Color.white;
            bgImg.raycastTarget = false;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            var haloObj = new GameObject("TitleHalo");
            haloObj.transform.SetParent(_homeCanvas.transform, false);
            var haloImg = haloObj.AddComponent<Image>();
            haloImg.sprite = UISpriteFactory.CreateGlowSprite(new Color(1f, 0.75f, 0.25f, 0.45f), 256);
            haloImg.raycastTarget = false;
            var haloRt = haloObj.GetComponent<RectTransform>();
            haloRt.anchorMin = new Vector2(0.5f, 0.5f);
            haloRt.anchorMax = new Vector2(0.5f, 0.5f);
            haloRt.pivot = new Vector2(0.5f, 0.5f);
            haloRt.anchoredPosition = new Vector2(0f, 820f);
            haloRt.sizeDelta = new Vector2(1200f, 1200f);

            CreateIconButton(_homeCanvas.transform, new Vector2(-30f, -30f), new Vector2(110f, 110f),
                new Vector2(1f, 1f), new Vector2(1f, 1f),
                new Color(0.30f, 0.35f, 0.50f), "SET", 36, OnSettingsClicked);

            _titleGroup = new GameObject("TitleGroup");
            _titleGroup.transform.SetParent(_homeCanvas.transform, false);
            var tgr = _titleGroup.AddComponent<RectTransform>();
            tgr.anchorMin = new Vector2(0.5f, 0.5f);
            tgr.anchorMax = new Vector2(0.5f, 0.5f);
            tgr.pivot = new Vector2(0.5f, 0.5f);
            tgr.anchoredPosition = new Vector2(0f, 820f);
            tgr.sizeDelta = new Vector2(900f, 300f);

            CreateText(_titleGroup.transform, "MERA WORD", new Vector2(0f, 50f), 110, GOLD, FontStyle.Bold, true);
            CreateText(_titleGroup.transform, "SEARCH  JOURNEY", new Vector2(0f, -40f), 42, new Color(0.70f, 0.85f, 1f), FontStyle.Bold, true);

            var lineObj = new GameObject("Divider");
            lineObj.transform.SetParent(_titleGroup.transform, false);
            var lineImg = lineObj.AddComponent<Image>();
            lineImg.sprite = UISpriteFactory.Create3DButtonSprite(GOLD, 32, 8);
            lineImg.color = Color.white;
            lineImg.raycastTarget = false;
            var lineRt = lineObj.GetComponent<RectTransform>();
            lineRt.anchorMin = new Vector2(0.5f, 0.5f);
            lineRt.anchorMax = new Vector2(0.5f, 0.5f);
            lineRt.pivot = new Vector2(0.5f, 0.5f);
            lineRt.anchoredPosition = new Vector2(0f, -100f);
            lineRt.sizeDelta = new Vector2(500f, 6f);

            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;
            CreateStatsCard(_homeCanvas.transform, new Vector2(0f, 620f), coins, stars);

            Create3DButton(_homeCanvas.transform, "▶  PLAY", new Vector2(0f, 400f),
                new Vector2(700f, 170f), GREEN, 60, OnPlayClicked);

            Create3DButton(_homeCanvas.transform, "LEVELS", new Vector2(0f, 240f),
                new Vector2(700f, 130f), BLUE, 46, OnLevelsClicked);

            float catY = 60f;
            float spacing = 240f;
            Create3DButton(_homeCanvas.transform, "SOCIAL", new Vector2(-spacing, catY),
                new Vector2(220f, 180f), new Color(0.75f, 0.30f, 0.30f), 26, () => OpenCategory("social"));
            Create3DButton(_homeCanvas.transform, "SHOP", new Vector2(0f, catY),
                new Vector2(220f, 180f), new Color(0.90f, 0.55f, 0.20f), 26, () => OpenCategory("shop"));
            Create3DButton(_homeCanvas.transform, "PROGRESS", new Vector2(spacing, catY),
                new Vector2(220f, 180f), new Color(0.30f, 0.65f, 0.80f), 22, () => OpenCategory("progress"));

            CreateText(_homeCanvas.transform, "v1.0  •  Talha Ansari",
                new Vector2(0f, -850f), 26, new Color(0.55f, 0.60f, 0.75f), FontStyle.Normal, false);
        }

        private void OpenCategory(string categoryId)
        {
            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayButtonClick();

            if (categoryId == "social")
            {
                if (!InternetChecker.QuickCheck())
                {
                    ShowOfflineToast("Multiplayer requires internet.");
                    return;
                }
            }

            var menu = FindFirstObjectByType<CategoryMenuUI>();
            if (menu != null) menu.Show(categoryId);
        }

        private void ShowOfflineToast(string message)
        {
            Debug.LogWarning($"[Home] {message}");

            var canvasObj = new GameObject("OfflineToast");
            var canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 999;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();

            var panel = new GameObject("Panel");
            panel.transform.SetParent(canvas.transform, false);
            var img = panel.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.85f, 0.30f, 0.30f), 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var rt = panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(800f, 160f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(panel.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = message;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            Object.Destroy(canvasObj, 2.5f);
        }

        private void CreateStatsCard(Transform parent, Vector2 pos, int coins, int stars)
        {
            var shadowObj = new GameObject("StatsShadow");
            shadowObj.transform.SetParent(parent, false);
            var shadowImg = shadowObj.AddComponent<Image>();
            shadowImg.sprite = UISpriteFactory.CreateRoundedSprite(new Color(0f, 0f, 0f, 0.6f), 128, 24);
            shadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = new Vector2(0.5f, 0.5f);
            shRt.anchorMax = new Vector2(0.5f, 0.5f);
            shRt.pivot = new Vector2(0.5f, 0.5f);
            shRt.anchoredPosition = pos + new Vector2(0f, -8f);
            shRt.sizeDelta = new Vector2(680f, 130f);

            var cardObj = new GameObject("StatsCard");
            cardObj.transform.SetParent(parent, false);
            var cardImg = cardObj.AddComponent<Image>();
            cardImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.18f, 0.24f, 0.42f), 256, 40);
            cardImg.type = Image.Type.Sliced;
            cardImg.color = Color.white;
            cardImg.raycastTarget = false;
            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(680f, 130f);

            CreateIcon(cardObj.transform, new Vector2(-250f, 0f), new Vector2(70f, 70f),
                new Color(1f, 0.82f, 0.20f));

            CreateText(cardObj.transform, coins.ToString(), new Vector2(-140f, 0f), 48,
                GOLD, FontStyle.Bold, true);

            var divObj = new GameObject("Divider");
            divObj.transform.SetParent(cardObj.transform, false);
            var divImg = divObj.AddComponent<Image>();
            divImg.color = new Color(0.4f, 0.5f, 0.7f, 0.5f);
            divImg.raycastTarget = false;
            var divRt = divObj.GetComponent<RectTransform>();
            divRt.anchorMin = new Vector2(0.5f, 0.5f);
            divRt.anchorMax = new Vector2(0.5f, 0.5f);
            divRt.pivot = new Vector2(0.5f, 0.5f);
            divRt.anchoredPosition = Vector2.zero;
            divRt.sizeDelta = new Vector2(3f, 80f);

            CreateIcon(cardObj.transform, new Vector2(70f, 0f), new Vector2(70f, 70f),
                new Color(1f, 0.90f, 0.55f));

            CreateText(cardObj.transform, stars.ToString(), new Vector2(180f, 0f), 48,
                new Color(1f, 0.92f, 0.60f), FontStyle.Bold, true);
        }

        private Image CreateIcon(Transform parent, Vector2 pos, Vector2 size, Color color)
        {
            var obj = new GameObject("Icon");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DSphereSprite(color, 128);
            img.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;
            return img;
        }

        private void BuildStarfield()
        {
            _starfieldParent = new GameObject("Starfield");
            _starfieldParent.transform.SetParent(_homeCanvas.transform, false);
            _starfieldParent.transform.SetAsFirstSibling();

            var rt = _starfieldParent.AddComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var rng = new System.Random(42);
            int count = 90;
            _parallaxStars = new Image[count];

            for (int i = 0; i < count; i++)
            {
                var star = new GameObject($"Star_{i}");
                star.transform.SetParent(_starfieldParent.transform, false);

                var img = star.AddComponent<Image>();
                img.sprite = UISpriteFactory.Create3DSphereSprite(Color.white, 32);

                float brightness = (float)(rng.NextDouble() * 0.7 + 0.2);
                img.color = new Color(brightness, brightness, brightness, 0.9f);
                img.raycastTarget = false;

                var srt = star.GetComponent<RectTransform>();
                srt.anchorMin = new Vector2((float)rng.NextDouble(), (float)rng.NextDouble());
                srt.anchorMax = srt.anchorMin;
                srt.pivot = new Vector2(0.5f, 0.5f);
                srt.anchoredPosition = Vector2.zero;
                float size = (float)(rng.NextDouble() * 6 + 2);
                srt.sizeDelta = new Vector2(size, size);

                _parallaxStars[i] = img;
            }
        }

        private IEnumerator AnimateStars()
        {
            while (true)
            {
                float t = Time.unscaledTime;
                for (int i = 0; i < _parallaxStars.Length; i++)
                {
                    var img = _parallaxStars[i];
                    if (img == null) continue;
                    float phase = i * 0.5f;
                    float pulse = 0.7f + Mathf.Sin(t * 1.5f + phase) * 0.3f;
                    var c = img.color;
                    c.a = 0.3f + pulse * 0.6f;
                    img.color = c;
                }
                yield return null;
            }
        }

        private IEnumerator FloatTitle()
        {
            while (true)
            {
                if (_titleGroup != null)
                {
                    var rt = _titleGroup.GetComponent<RectTransform>();
                    float y = 820f + Mathf.Sin(Time.unscaledTime * 1.2f) * 8f;
                    rt.anchoredPosition = new Vector2(0f, y);
                }
                yield return null;
            }
        }

        private void Create3DButton(Transform parent, string label, Vector2 pos, Vector2 size,
            Color color, int fontSize, UnityEngine.Events.UnityAction onClick)
        {
            var rootObj = new GameObject($"Btn_{label}");
            rootObj.transform.SetParent(parent, false);
            var rootRt = rootObj.AddComponent<RectTransform>();
            rootRt.anchorMin = new Vector2(0.5f, 0.5f);
            rootRt.anchorMax = new Vector2(0.5f, 0.5f);
            rootRt.pivot = new Vector2(0.5f, 0.5f);
            rootRt.anchoredPosition = pos;
            rootRt.sizeDelta = size;

            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(rootObj.transform, false);
            var bShadowImg = shadowObj.AddComponent<Image>();
            bShadowImg.sprite = UISpriteFactory.Create3DButtonSprite(
                Color.Lerp(color, Color.black, 0.55f), 256, 40);
            bShadowImg.type = Image.Type.Sliced;
            bShadowImg.raycastTarget = false;
            var bsRt = bottomShadowSetup(shadowObj);
            bsRt.anchoredPosition = new Vector2(0f, -8f);

            var buttonObj = new GameObject("Button");
            buttonObj.transform.SetParent(rootObj.transform, false);
            var btnImg = buttonObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var button = buttonObj.AddComponent<Button>();
            button.onClick.AddListener(onClick);

            var btnRt = buttonObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 8f);

            var colors = button.colors;
            colors.normalColor = Color.white;
            colors.highlightedColor = new Color(1.1f, 1.1f, 1.1f);
            colors.pressedColor = new Color(0.85f, 0.85f, 0.85f);
            colors.fadeDuration = 0.05f;
            button.colors = colors;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(buttonObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = fontSize;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var outline = textObj.AddComponent<Shadow>();
            outline.effectColor = new Color(0f, 0f, 0f, 0.55f);
            outline.effectDistance = new Vector2(2f, -2f);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            button.onClick.AddListener(() => StartCoroutine(PressAnimation(btnRt)));
        }

        private RectTransform bottomShadowSetup(GameObject shadowObj)
        {
            var rt = shadowObj.GetComponent<RectTransform>();
            if (rt == null) rt = shadowObj.AddComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
            return rt;
        }

        private IEnumerator PressAnimation(RectTransform rt)
        {
            float duration = 0.12f;
            float elapsed = 0f;
            Vector2 start = new Vector2(0f, 8f);
            Vector2 end = new Vector2(0f, 0f);

            while (elapsed < duration / 2f)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / (duration / 2f);
                rt.offsetMax = Vector2.Lerp(start, end, t);
                yield return null;
            }

            elapsed = 0f;
            while (elapsed < duration / 2f)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / (duration / 2f);
                rt.offsetMax = Vector2.Lerp(end, start, t);
                yield return null;
            }
            rt.offsetMax = start;
        }

        private void CreateIconButton(Transform parent, Vector2 pos, Vector2 size,
            Vector2 anchorMin, Vector2 anchorMax, Color color, string label, int fontSize,
            UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Icon_{label}");
            obj.transform.SetParent(parent, false);

            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 60);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = anchorMin;
            rt.anchorMax = anchorMax;
            rt.pivot = new Vector2(anchorMin.x == 1f ? 1f : 0.5f,
                                   anchorMax.y == 1f ? 1f : 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = fontSize;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void ShowHome()
        {
            IsHomeVisible = true;
            _homeCanvas.gameObject.SetActive(true);
            _levelSelectCanvas.gameObject.SetActive(false);
        }

        private void OnPlayClicked()
        {
            int level = Progress != null ? Progress.HighestLevelUnlocked : 1;
            StartLevel(level);
        }

        private void OnLevelsClicked()
        {
            _homeCanvas.gameObject.SetActive(false);
            BuildLevelSelectContent();
            _levelSelectCanvas.gameObject.SetActive(true);
        }

        private void OnSettingsClicked()
        {
            var s = FindFirstObjectByType<SettingsScreenUI>();
            if (s != null) s.Show();
        }

        private void BuildLevelSelectCanvas()
        {
            var canvasObj = new GameObject("LevelSelectCanvas");
            _levelSelectCanvas = canvasObj.AddComponent<Canvas>();
            _levelSelectCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _levelSelectCanvas.sortingOrder = 501;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var bgObj = new GameObject("Background");
            bgObj.transform.SetParent(_levelSelectCanvas.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.CreateGradientSprite(BG_BOTTOM, BG_TOP, 32, 256);
            bgImg.color = Color.white;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            CreateText(_levelSelectCanvas.transform, "SELECT LEVEL",
                new Vector2(0f, 830f), 70, GOLD, FontStyle.Bold, true);

            CreateSmallButton(_levelSelectCanvas.transform, "◀ BACK",
                new Vector2(-380f, 830f), new Color(0.5f, 0.5f, 0.55f), OnBackToHome);

            _levelSelectCanvas.gameObject.SetActive(false);
        }

        private GameObject _levelGridParent;

        private void BuildLevelSelectContent()
        {
            if (_levelGridParent != null) Destroy(_levelGridParent);

            _levelGridParent = new GameObject("LevelGrid");
            _levelGridParent.transform.SetParent(_levelSelectCanvas.transform, false);

            var rt = _levelGridParent.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 0f);
            rt.sizeDelta = new Vector2(1000f, 1400f);

            var grid = _levelGridParent.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(170f, 200f);
            grid.spacing = new Vector2(15f, 15f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 5;
            grid.padding = new RectOffset(30, 30, 30, 30);

            int highest = Progress != null ? Progress.HighestLevelUnlocked : 1;
            int totalLevels = Mathf.Max(highest + 10, 60);

            for (int i = 1; i <= totalLevels; i++)
            {
                int levelNum = i;
                bool unlocked = i <= highest;
                int stars = PlayerPrefs.GetInt(STARS_KEY_PREFIX + i, 0);
                CreateLevelCard(i, unlocked, stars, () => OnLevelClicked(levelNum));
            }
        }

        private void CreateLevelCard(int level, bool unlocked, int stars, UnityEngine.Events.UnityAction onClick)
        {
            var cardObj = new GameObject($"Level_{level}");
            cardObj.transform.SetParent(_levelGridParent.transform, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.sprite = UISpriteFactory.Create3DButtonSprite(
                unlocked ? new Color(0.25f, 0.55f, 0.90f) : new Color(0.25f, 0.28f, 0.35f),
                256, 40);
            cardImg.type = Image.Type.Sliced;
            cardImg.color = Color.white;

            var btn = cardObj.AddComponent<Button>();
            btn.interactable = unlocked;
            if (unlocked) btn.onClick.AddListener(onClick);

            var numObj = new GameObject("Num");
            numObj.transform.SetParent(cardObj.transform, false);
            var numTxt = numObj.AddComponent<Text>();
            numTxt.text = unlocked ? level.ToString() : "X";
            numTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            numTxt.fontSize = 60;
            numTxt.fontStyle = FontStyle.Bold;
            numTxt.color = Color.white;
            numTxt.alignment = TextAnchor.MiddleCenter;
            numTxt.raycastTarget = false;
            var numShadow = numObj.AddComponent<Shadow>();
            numShadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
            numShadow.effectDistance = new Vector2(2f, -2f);

            var numRt = numObj.GetComponent<RectTransform>();
            numRt.anchorMin = new Vector2(0f, 0.3f);
            numRt.anchorMax = new Vector2(1f, 1f);
            numRt.offsetMin = Vector2.zero;
            numRt.offsetMax = Vector2.zero;

            if (unlocked)
            {
                for (int s = 0; s < 3; s++)
                {
                    var starObj = new GameObject($"Star_{s}");
                    starObj.transform.SetParent(cardObj.transform, false);
                    var starImg = starObj.AddComponent<Image>();
                    starImg.sprite = UISpriteFactory.Create3DSphereSprite(
                        s < stars ? new Color(1f, 0.85f, 0.25f) : new Color(0.30f, 0.35f, 0.45f), 64);
                    starImg.raycastTarget = false;
                    var starRt = starObj.GetComponent<RectTransform>();
                    starRt.anchorMin = new Vector2(0.5f, 0f);
                    starRt.anchorMax = new Vector2(0.5f, 0f);
                    starRt.pivot = new Vector2(0.5f, 0.5f);
                    starRt.anchoredPosition = new Vector2(-35f + s * 35f, 30f);
                    starRt.sizeDelta = new Vector2(28f, 28f);
                }
            }
        }

        private void OnLevelClicked(int level) { StartLevel(level); }

        private void OnBackToHome()
        {
            IsHomeVisible = true;
            _levelSelectCanvas.gameObject.SetActive(false);
            _homeCanvas.gameObject.SetActive(true);
        }

        private void StartLevel(int level)
        {
            if (Progress != null) Progress.SetCurrentLevel(level);
            else
            {
                PlayerPrefs.SetInt("CurrentLevel", level);
                PlayerPrefs.Save();
            }

            _skipHomeForThisSession = true;

            Debug.Log($"➡️ Loading Level {level}...");
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void ShowGameplay()
        {
            IsHomeVisible = false;
            StartCoroutine(HideHomeAfterDelay());
        }

        private IEnumerator HideHomeAfterDelay()
        {
            Debug.Log($"[HomeScreen] Delaying home hide by {HideHomeDelaySeconds}s so gameplay can build...");

            yield return new WaitForSeconds(HideHomeDelaySeconds);

            if (_homeCanvas != null) _homeCanvas.gameObject.SetActive(false);
            if (_levelSelectCanvas != null) _levelSelectCanvas.gameObject.SetActive(false);

            Debug.Log("[HomeScreen] Home canvas hidden — gameplay visible now.");
        }

        // =================================================================
        // TEXT HELPERS
        // =================================================================
        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color,
            FontStyle style, bool addShadow)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = style;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.supportRichText = true;
            txt.raycastTarget = false;

            if (addShadow)
            {
                var shadow = obj.AddComponent<Shadow>();
                shadow.effectColor = new Color(0f, 0f, 0f, 0.65f);
                shadow.effectDistance = new Vector2(3f, -3f);
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 160f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color,
            UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 80f);
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.5f);
            shadow.effectDistance = new Vector2(2f, -2f);
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}