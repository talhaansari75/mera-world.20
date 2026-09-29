using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;

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
        private Text _titleText;
        private Image[] _starImages = new Image[3];
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
            BuildHiddenPanel();
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete += ShowWinScreen;
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

            _panel = new GameObject("Overlay");
            _panel.transform.SetParent(_canvas.transform, false);

            var overlay = _panel.AddComponent<Image>();
            overlay.color = new Color(0f, 0f, 0f, 0.88f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            _titleText = CreateText(_panel.transform, "LEVEL 1 COMPLETE!",
                new Vector2(0f, 500f), 75, new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateStarsRow(_panel.transform);

            CreateText(_panel.transform, "+100 bonus coins",
                new Vector2(0f, 100f), 45, new Color(1f, 0.9f, 0.4f), FontStyle.Bold);

            CreateButton(_panel.transform, "NEXT LEVEL",
                new Vector2(0f, -130f), new Vector2(500f, 110f),
                new Color(0.25f, 0.7f, 0.35f), OnNextLevel);

            CreateButton(_panel.transform, "REPLAY",
                new Vector2(0f, -280f), new Vector2(500f, 110f),
                new Color(0.3f, 0.5f, 0.8f), OnReplay);

            CreateButton(_panel.transform, "HOME",
                new Vector2(0f, -430f), new Vector2(500f, 110f),
                new Color(0.5f, 0.5f, 0.55f), OnHome);

            _panel.SetActive(false);
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
                rt.anchoredPosition = new Vector2(-200f + i * 200f, 250f);
                rt.sizeDelta = new Vector2(160f, 160f);

                _starImages[i] = img;
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
            rt.sizeDelta = new Vector2(1000f, 140f);

            return txt;
        }

        private void CreateButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Button_{label}");
            obj.transform.SetParent(parent, false);

            var img = obj.AddComponent<Image>();
            img.color = color;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);

            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 48;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
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

            // Save best stars for this level
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

            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void OnReplay()
        {
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void OnHome()
        {
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();

            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
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
                SelectionManager.OnLevelComplete -= ShowWinScreen;
        }
    }
}