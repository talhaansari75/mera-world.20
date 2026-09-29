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

        private const string SKIP_HOME_KEY = "SkipHome";

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

                        if (PlayerPrefs.GetInt(SKIP_HOME_KEY, 0) == 1)
            {
                PlayerPrefs.SetInt(SKIP_HOME_KEY, 0);
                PlayerPrefs.Save();
                ShowGameplay();
                Debug.Log("[Home] Skipping home, going to gameplay");
            }
            else
            {
                ShowHome();
            }
        }

        // ===================== HOME SCREEN =====================

        private void BuildHomeCanvas()
        {
            // IMPORTANT: canvas is ROOT object, not a child of GameManager
            var canvasObj = new GameObject("HomeCanvas");

            _homeCanvas = canvasObj.AddComponent<Canvas>();
            _homeCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _homeCanvas.sortingOrder = 500;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            // Opaque dark background
            var bgObj = new GameObject("Background");
            bgObj.transform.SetParent(_homeCanvas.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.05f, 0.08f, 0.20f, 1f);

            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            // Title
            CreateText(_homeCanvas.transform, "MERA WORD", new Vector2(0f, 450f), 100,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateText(_homeCanvas.transform, "SEARCH JOURNEY", new Vector2(0f, 340f), 55,
                new Color(0.65f, 0.85f, 1f), FontStyle.Bold);

            // PLAY button
            CreateBigButton(_homeCanvas.transform, "▶  PLAY", new Vector2(0f, -100f),
                new Color(0.25f, 0.65f, 0.30f), OnPlayClicked);

            // LEVELS button
            CreateBigButton(_homeCanvas.transform, "LEVELS", new Vector2(0f, -280f),
                new Color(0.25f, 0.45f, 0.85f), OnLevelsClicked);

            // Footer
            CreateText(_homeCanvas.transform, "v1.0  •  Talha Ansari",
                new Vector2(0f, -800f), 28, new Color(0.6f, 0.6f, 0.7f), FontStyle.Normal);
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

        // ===================== LEVEL SELECT =====================

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
            bgImg.color = new Color(0.05f, 0.08f, 0.20f, 1f);

            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            CreateText(_levelSelectCanvas.transform, "SELECT LEVEL",
                new Vector2(0f, 750f), 70, new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_levelSelectCanvas.transform, "◀ BACK",
                new Vector2(-380f, 750f), new Color(0.5f, 0.5f, 0.55f), OnBackToHome);

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
            rt.anchoredPosition = new Vector2(0f, -50f);
            rt.sizeDelta = new Vector2(900f, 1200f);

            var grid = _levelGridParent.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(140f, 140f);
            grid.spacing = new Vector2(20f, 20f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 5;
            grid.padding = new RectOffset(30, 30, 30, 30);

            int highest = Progress != null ? Progress.HighestLevelUnlocked : 1;
            int totalLevels = Mathf.Max(highest + 10, 25);

            for (int i = 1; i <= totalLevels; i++)
            {
                int levelNum = i;
                bool unlocked = i <= highest;

                var btnObj = new GameObject($"Level_{i}");
                btnObj.transform.SetParent(_levelGridParent.transform, false);

                var img = btnObj.AddComponent<Image>();
                img.color = unlocked
                    ? new Color(0.25f, 0.55f, 0.90f)
                    : new Color(0.25f, 0.28f, 0.35f);

                var btn = btnObj.AddComponent<Button>();
                btn.interactable = unlocked;
                if (unlocked) btn.onClick.AddListener(() => OnLevelClicked(levelNum));

                var textObj = new GameObject("Num");
                textObj.transform.SetParent(btnObj.transform, false);
                var txt = textObj.AddComponent<Text>();
                txt.text = unlocked ? i.ToString() : "X";
                txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                txt.fontSize = 55;
                txt.fontStyle = FontStyle.Bold;
                txt.color = Color.white;
                txt.alignment = TextAnchor.MiddleCenter;

                var trt = textObj.GetComponent<RectTransform>();
                trt.anchorMin = Vector2.zero;
                trt.anchorMax = Vector2.one;
                trt.offsetMin = Vector2.zero;
                trt.offsetMax = Vector2.zero;
            }
        }

        private void OnLevelClicked(int level)
        {
            StartLevel(level);
        }

        private void OnBackToHome()
        {
            _levelSelectCanvas.gameObject.SetActive(false);
            _homeCanvas.gameObject.SetActive(true);
        }

        // ===================== GAMEPLAY CONTROL =====================

        private void StartLevel(int level)
        {
            if (Progress != null)
                Progress.SetCurrentLevel(level);
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

        // ===================== HELPERS =====================

        private void EnsureEventSystem()
        {
            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
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

            var img = btnObj.AddComponent<Image>();
            img.color = color;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(600f, 140f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);

            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 55;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;

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

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}