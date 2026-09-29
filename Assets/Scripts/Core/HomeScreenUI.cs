using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public class HomeScreenUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _homeCanvas;
        private Canvas _levelSelectCanvas;
        private GameObject _starfieldParent;

        private const string SKIP_HOME_KEY = "SkipHome";
        private const string STARS_KEY_PREFIX = "Stars_Level_";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            Invoke(nameof(Setup), 0.2f);
        }

        private void Setup()
        {
            EnsureEventSystem();
            BuildHomeCanvas();
            BuildLevelSelectCanvas();
            BuildStarfield();

            if (PlayerPrefs.GetInt(SKIP_HOME_KEY, 0) == 1)
            {
                PlayerPrefs.SetInt(SKIP_HOME_KEY, 0);
                PlayerPrefs.Save();
                ShowGameplay();
            }
            else
            {
                ShowHome();
            }
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
            for (int i = 0; i < 80; i++)
            {
                var star = new GameObject($"Star_{i}");
                star.transform.SetParent(_starfieldParent.transform, false);

                var img = star.AddComponent<Image>();
                img.color = new Color(1f, 1f, 1f, (float)(rng.NextDouble() * 0.6 + 0.15));
                img.sprite = CreateCircleSprite(16);
                img.raycastTarget = false;

                var srt = star.GetComponent<RectTransform>();
                srt.anchorMin = new Vector2((float)rng.NextDouble(), (float)rng.NextDouble());
                srt.anchorMax = srt.anchorMin;
                srt.pivot = new Vector2(0.5f, 0.5f);
                srt.anchoredPosition = Vector2.zero;
                float size = (float)(rng.NextDouble() * 4 + 2);
                srt.sizeDelta = new Vector2(size, size);
            }
        }

        private void BuildHomeCanvas()
        {
            var canvasObj = new GameObject("HomeCanvas");
            _homeCanvas = canvasObj.AddComponent<Canvas>();
            _homeCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _homeCanvas.sortingOrder = 500;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var bgObj = new GameObject("Background");
            bgObj.transform.SetParent(_homeCanvas.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.06f, 0.10f, 0.24f, 1f);
            bgImg.raycastTarget = false;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            var glowObj = new GameObject("TitleGlow");
            glowObj.transform.SetParent(_homeCanvas.transform, false);
            var glowImg = glowObj.AddComponent<Image>();
            glowImg.color = new Color(1f, 0.75f, 0.25f, 0.10f);
            glowImg.sprite = CreateCircleSprite(128);
            glowImg.raycastTarget = false;
            var glowRt = glowObj.GetComponent<RectTransform>();
            glowRt.anchorMin = new Vector2(0.5f, 0.5f);
            glowRt.anchorMax = new Vector2(0.5f, 0.5f);
            glowRt.pivot = new Vector2(0.5f, 0.5f);
            glowRt.anchoredPosition = new Vector2(0f, 780f);
            glowRt.sizeDelta = new Vector2(900f, 900f);

            CreateText(_homeCanvas.transform, "MERA WORD", new Vector2(0f, 880f), 100,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateText(_homeCanvas.transform, "SEARCH  JOURNEY", new Vector2(0f, 780f), 42,
                new Color(0.65f, 0.85f, 1f), FontStyle.Bold);

            CreateLine(_homeCanvas.transform, new Vector2(0f, 720f), new Vector2(500f, 3f),
                new Color(1f, 0.85f, 0.30f, 0.55f));

            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;
            CreateStatsCard(_homeCanvas.transform, new Vector2(0f, 620f), coins, stars);

            CreateBigButton(_homeCanvas.transform, "▶  PLAY", new Vector2(0f, 350f),
                new Color(0.25f, 0.65f, 0.30f), OnPlayClicked);

            CreateBigButton(_homeCanvas.transform, "LEVELS", new Vector2(0f, 200f),
                new Color(0.25f, 0.45f, 0.85f), OnLevelsClicked);

            CreateMediumButton(_homeCanvas.transform, "SHOP", new Vector2(-200f, 40f),
                new Color(0.85f, 0.55f, 0.20f), OnShopClicked);

            CreateMediumButton(_homeCanvas.transform, "PETS", new Vector2(0f, 40f),
                new Color(0.55f, 0.35f, 0.75f), OnPetsClicked);

            CreateMediumButton(_homeCanvas.transform, "AWARDS", new Vector2(200f, 40f),
                new Color(0.75f, 0.45f, 0.55f), OnAchievementsClicked);

            CreateBigButton(_homeCanvas.transform, "SETTINGS", new Vector2(0f, -140f),
                new Color(0.45f, 0.35f, 0.65f), OnSettingsClicked);

            CreateText(_homeCanvas.transform, "v1.0  •  Talha Ansari",
                new Vector2(0f, -850f), 28, new Color(0.55f, 0.60f, 0.75f), FontStyle.Normal);
        }

        private void CreateStatsCard(Transform parent, Vector2 pos, int coins, int stars)
        {
            var cardObj = new GameObject("StatsCard");
            cardObj.transform.SetParent(parent, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.color = new Color(0.10f, 0.16f, 0.32f, 0.85f);
            cardImg.raycastTarget = false;

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(650f, 110f);

            CreateText(cardObj.transform, "COINS", new Vector2(-160f, 25f), 22,
                new Color(0.70f, 0.80f, 1f), FontStyle.Normal);
            CreateText(cardObj.transform, coins.ToString(), new Vector2(-160f, -20f), 42,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateLine(cardObj.transform, new Vector2(0f, 0f), new Vector2(3f, 70f),
                new Color(0.4f, 0.5f, 0.7f, 0.5f));

            CreateText(cardObj.transform, "STARS", new Vector2(160f, 25f), 22,
                new Color(0.70f, 0.80f, 1f), FontStyle.Normal);
            CreateText(cardObj.transform, stars.ToString(), new Vector2(160f, -20f), 42,
                new Color(1f, 0.90f, 0.55f), FontStyle.Bold);
        }

        private void ShowHome()
        {
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

        private void OnAchievementsClicked()
        {
            var a = FindFirstObjectByType<AchievementsUI>();
            if (a != null) a.Show();
        }

        private void OnShopClicked()
        {
            var s = FindFirstObjectByType<ShopUI>();
            if (s != null) s.Show();
        }

        private void OnPetsClicked()
        {
            var p = FindFirstObjectByType<PetSystemUI>();
            if (p != null) p.Show();
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
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var bgObj = new GameObject("Background");
            bgObj.transform.SetParent(_levelSelectCanvas.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.06f, 0.10f, 0.24f, 1f);
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            CreateText(_levelSelectCanvas.transform, "SELECT LEVEL",
                new Vector2(0f, 830f), 70, new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

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
            int totalLevels = Mathf.Max(highest + 10, 25);

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
            cardImg.color = unlocked
                ? new Color(0.25f, 0.55f, 0.90f)
                : new Color(0.25f, 0.28f, 0.35f);

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
                    starImg.color = s < stars
                        ? new Color(1f, 0.85f, 0.25f)
                        : new Color(0.30f, 0.35f, 0.45f);
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

            PlayerPrefs.SetInt(SKIP_HOME_KEY, 1);
            PlayerPrefs.Save();

            Debug.Log($"➡️ Loading Level {level}...");
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void ShowGameplay()
        {
            if (_homeCanvas != null) _homeCanvas.gameObject.SetActive(false);
            if (_levelSelectCanvas != null) _levelSelectCanvas.gameObject.SetActive(false);
        }

        private void EnsureEventSystem()
        {
            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private Sprite CreateCircleSprite(int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            float half = size / 2f;
            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dx = x - half + 0.5f;
                    float dy = y - half + 0.5f;
                    float d = Mathf.Sqrt(dx * dx + dy * dy);
                    float alpha = Mathf.Clamp01(half - d);
                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                }
            }
            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        private void CreateLine(Transform parent, Vector2 pos, Vector2 size, Color color)
        {
            var lineObj = new GameObject("Line");
            lineObj.transform.SetParent(parent, false);
            var img = lineObj.AddComponent<Image>();
            img.color = color;
            img.raycastTarget = false;
            var rt = lineObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style)
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
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 140f);
            return txt;
        }

        private void CreateBigButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var btnObj = new GameObject($"Btn_{label}");
            btnObj.transform.SetParent(parent, false);

            var shadowObj = new GameObject("Shadow");
            shadowObj.transform.SetParent(btnObj.transform, false);
            var shadowImg = shadowObj.AddComponent<Image>();
            shadowImg.color = new Color(0f, 0f, 0f, 0.40f);
            shadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = new Vector2(0.5f, 0.5f);
            shRt.anchorMax = new Vector2(0.5f, 0.5f);
            shRt.pivot = new Vector2(0.5f, 0.5f);
            shRt.anchoredPosition = new Vector2(0f, -6f);
            shRt.sizeDelta = new Vector2(620f, 120f);

            var img = btnObj.AddComponent<Image>();
            img.color = color;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(600f, 120f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 48;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void CreateMediumButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var btnObj = new GameObject($"Btn_{label}");
            btnObj.transform.SetParent(parent, false);

            var img = btnObj.AddComponent<Image>();
            img.color = color;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(180f, 120f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
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
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var btnObj = new GameObject($"Btn_{label}");
            btnObj.transform.SetParent(parent, false);
            var img = btnObj.AddComponent<Image>();
            img.color = color;
            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 80f);
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
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
        }
    }
}