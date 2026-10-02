using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public partial class HomeScreenUI : MonoBehaviour
    {
        public static bool IsHomeVisible { get; private set; } = false;
        public static HomeScreenUI Instance { get; private set; }

        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _homeCanvas;
        private Canvas _levelSelectCanvas;
        private GameObject _starfieldParent;
        private GameObject _titleGroup;
        private Image[] _parallaxStars;

        private const string STARS_KEY_PREFIX = "Stars_Level_";

        private static bool _skipHomeForThisSession = false;
        private bool _showGameplayOnSetup = false;

        private static readonly Color BG_TOP = new Color(0.16f, 0.08f, 0.34f);
        private static readonly Color BG_BOTTOM = new Color(0.02f, 0.02f, 0.08f);
        private static readonly Color GOLD = new Color(1f, 0.85f, 0.30f);
        private static readonly Color GREEN = new Color(0.25f, 0.65f, 0.35f);
        private static readonly Color BLUE = new Color(0.25f, 0.45f, 0.85f);

        void Start()
        {
            Instance = this;
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
            EnsureEventSystem();
            BuildHomeCanvas();
            BuildLevelSelectCanvas();
            BuildStarfield();
            StartCoroutine(AnimateStars());
            StartCoroutine(FloatTitle());

            if (_showGameplayOnSetup)
            {
                Debug.Log("[HomeScreen] Showing GAMEPLAY.");
                ShowGameplay();
            }
            else
            {
                Debug.Log("[HomeScreen] Showing HOME screen.");
                ShowHome();
            }
        }

        private void BuildHomeCanvas()
        {
            var canvasObj = new GameObject("HomeCanvas");
            canvasObj.transform.SetParent(transform, false);
            _homeCanvas = canvasObj.AddComponent<Canvas>();
            _homeCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _homeCanvas.sortingOrder = 500;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();

            // Background
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

            // Title halo
            var haloObj = new GameObject("TitleHalo");
            haloObj.transform.SetParent(_homeCanvas.transform, false);
            var haloImg = haloObj.AddComponent<Image>();
            haloImg.sprite = UISpriteFactory.CreateGlowSprite(new Color(1f, 0.85f, 0.35f, 0.65f), 256);
            haloImg.raycastTarget = false;
            var haloRt = haloObj.GetComponent<RectTransform>();
            haloRt.anchorMin = new Vector2(0.5f, 0.5f);
            haloRt.anchorMax = new Vector2(0.5f, 0.5f);
            haloRt.pivot = new Vector2(0.5f, 0.5f);
            haloRt.anchoredPosition = new Vector2(0f, 700f);
            haloRt.sizeDelta = new Vector2(1200f, 1200f);

            // Settings gear
            CreateIconButton(_homeCanvas.transform, new Vector2(-30f, -30f), new Vector2(110f, 110f),
                new Vector2(1f, 1f), new Vector2(1f, 1f),
                new Color(0.30f, 0.35f, 0.50f), "\u2699", 42, OnSettingsClicked);

            // Title
            _titleGroup = new GameObject("TitleGroup");
            _titleGroup.transform.SetParent(_homeCanvas.transform, false);
            var tgr = _titleGroup.AddComponent<RectTransform>();
            tgr.anchorMin = new Vector2(0.5f, 0.5f);
            tgr.anchorMax = new Vector2(0.5f, 0.5f);
            tgr.pivot = new Vector2(0.5f, 0.5f);
            tgr.anchoredPosition = new Vector2(0f, 700f);
            tgr.sizeDelta = new Vector2(900f, 300f);

            var titleTxt = CreateText(_titleGroup.transform, "MERA WORD", new Vector2(0f, 70f), 100, GOLD, FontStyle.Bold, true);
            var titleOl = titleTxt.gameObject.AddComponent<Outline>();
            titleOl.effectColor = new Color(0.45f, 0.15f, 0f, 0.95f);
            titleOl.effectDistance = new Vector2(3f, -3f);
            CreateText(_titleGroup.transform, "SEARCH  JOURNEY", new Vector2(0f, -50f), 36, new Color(0.70f, 0.85f, 1f), FontStyle.Bold, true);

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
            lineRt.anchoredPosition = new Vector2(0f, -110f);
            lineRt.sizeDelta = new Vector2(500f, 6f);

            // Stats card
            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;
            CreateStatsCard(_homeCanvas.transform, new Vector2(0f, 480f), coins, stars);

            // PLAY button
            Create3DButton(_homeCanvas.transform, "▶  PLAY", new Vector2(0f, 300f),
                new Vector2(780f, 200f), GREEN, 68, OnPlayClicked);

            // LEVELS button
            Create3DButton(_homeCanvas.transform, "\uD83C\uDFC6  LEVELS", new Vector2(0f, 160f),
                new Vector2(700f, 130f), BLUE, 46, OnLevelsClicked);

            // Categories
            float catY = -20f;
            float spacing = 240f;
            Create3DButton(_homeCanvas.transform, "\uD83D\uDC65  SOCIAL", new Vector2(-spacing, catY),
                new Vector2(220f, 180f), new Color(0.75f, 0.30f, 0.30f), 22, () => OpenCategory("social"));
            Create3DButton(_homeCanvas.transform, "\uD83D\uDECD  SHOP", new Vector2(0f, catY),
                new Vector2(220f, 180f), new Color(0.90f, 0.55f, 0.20f), 22, () => OpenCategory("shop"));
            Create3DButton(_homeCanvas.transform, "\uD83D\uDCCA  PROGRESS", new Vector2(spacing, catY),
                new Vector2(240f, 180f), new Color(0.30f, 0.65f, 0.80f), 15, () => OpenCategory("progress"));

            // Footer
            CreateText(_homeCanvas.transform, "v1.0  •  Talha Ansari",
                new Vector2(0f, -880f), 26, new Color(0.55f, 0.60f, 0.75f), FontStyle.Normal, false);
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
                    float y = 700f + Mathf.Sin(Time.unscaledTime * 1.2f) * 8f;
                    rt.anchoredPosition = new Vector2(0f, y);
                }
                yield return null;
            }
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

        public static void ForceShowHome()
        {
            _skipHomeForThisSession = false;
            if (Instance != null && Instance._homeCanvas != null)
            {
                Instance.ShowHome();
                Debug.Log("[HomeScreen] ForceShowHome - home shown");
            }
            else
            {
                Debug.LogWarning("[HomeScreen] ForceShowHome - Instance or canvas null");
            }
        }

        private void ShowGameplay()
        {
            IsHomeVisible = false;
            if (_homeCanvas != null) _homeCanvas.gameObject.SetActive(false);
            if (_levelSelectCanvas != null) _levelSelectCanvas.gameObject.SetActive(false);
        }

        private void EnsureEventSystem()
        {
            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.transform.SetParent(transform, false);
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();

                var newModuleType = System.Type.GetType(
                    "UnityEngine.InputSystem.UI.InputSystemUIInputModule, Unity.InputSystem");

                if (newModuleType != null)
                    es.AddComponent(newModuleType);
                else
                    es.AddComponent(typeof(UnityEngine.EventSystems.StandaloneInputModule));
            }
        }
    }
}