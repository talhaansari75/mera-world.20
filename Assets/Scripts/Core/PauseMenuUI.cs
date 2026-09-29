using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public class PauseMenuUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private GameObject _pauseButton;
        private bool _isPaused = false;

        void Start()
        {
            Invoke(nameof(Setup), 0.4f);
        }

        void Update()
        {
            // ESC key toggles pause
            if (Input.GetKeyDown(KeyCode.Escape))
            {
                if (_isPaused) Resume();
                else Pause();
            }
        }

        private void Setup()
        {
            EnsureEventSystem();
            BuildCanvas();
            BuildPauseButton();
            BuildPausePanel();
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

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("PauseCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 250;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPauseButton()
        {
            _pauseButton = new GameObject("PauseButton");
            _pauseButton.transform.SetParent(_canvas.transform, false);

            var img = _pauseButton.AddComponent<Image>();
            img.color = new Color(1f, 0.85f, 0.30f, 0.95f);

            var btn = _pauseButton.AddComponent<Button>();
            btn.onClick.AddListener(Pause);

            var rt = _pauseButton.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 1f);
            rt.anchoredPosition = new Vector2(-30f, -130f);
            rt.sizeDelta = new Vector2(120f, 120f);

            // Pause icon (two vertical bars)
            var bar1 = new GameObject("Bar1");
            bar1.transform.SetParent(_pauseButton.transform, false);
            var img1 = bar1.AddComponent<Image>();
            img1.color = new Color(0.15f, 0.10f, 0.05f);
            var rt1 = bar1.GetComponent<RectTransform>();
            rt1.anchorMin = new Vector2(0.5f, 0.5f);
            rt1.anchorMax = new Vector2(0.5f, 0.5f);
            rt1.pivot = new Vector2(0.5f, 0.5f);
            rt1.anchoredPosition = new Vector2(-18f, 0f);
            rt1.sizeDelta = new Vector2(16f, 60f);

            var bar2 = new GameObject("Bar2");
            bar2.transform.SetParent(_pauseButton.transform, false);
            var img2 = bar2.AddComponent<Image>();
            img2.color = new Color(0.15f, 0.10f, 0.05f);
            var rt2 = bar2.GetComponent<RectTransform>();
            rt2.anchorMin = new Vector2(0.5f, 0.5f);
            rt2.anchorMax = new Vector2(0.5f, 0.5f);
            rt2.pivot = new Vector2(0.5f, 0.5f);
            rt2.anchoredPosition = new Vector2(18f, 0f);
            rt2.sizeDelta = new Vector2(16f, 60f);
        }

        private void BuildPausePanel()
        {
            _panel = new GameObject("PausePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.90f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title
            CreateText(_panel.transform, "PAUSED", new Vector2(0f, 500f), 90,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            // Buttons
            CreateButton(_panel.transform, "▶  RESUME", new Vector2(0f, 200f),
                new Vector2(600f, 130f), new Color(0.25f, 0.70f, 0.35f), Resume);

            CreateButton(_panel.transform, "↻  RESTART", new Vector2(0f, 40f),
                new Vector2(600f, 130f), new Color(0.30f, 0.50f, 0.80f), Restart);

            CreateButton(_panel.transform, "⚙  SETTINGS", new Vector2(0f, -120f),
                new Vector2(600f, 130f), new Color(0.45f, 0.35f, 0.65f), OpenSettings);

            CreateButton(_panel.transform, "🏠  HOME", new Vector2(0f, -280f),
                new Vector2(600f, 130f), new Color(0.50f, 0.50f, 0.55f), GoHome);

            _panel.SetActive(false);
        }

        // ===================== ACTIONS =====================

        public void Pause()
        {
            if (_isPaused) return;
            _isPaused = true;

            _panel.SetActive(true);
            _pauseButton.SetActive(false);

            Time.timeScale = 0f;
            Debug.Log("[Pause] Game paused");
        }

        public void Resume()
        {
            if (!_isPaused) return;
            _isPaused = false;

            _panel.SetActive(false);
            _pauseButton.SetActive(true);

            Time.timeScale = 1f;
            Debug.Log("[Pause] Game resumed");
        }

        private void Restart()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            Debug.Log("[Pause] Restarting level");
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void OpenSettings()
        {
            Time.timeScale = 1f;

            var settings = FindFirstObjectByType<SettingsScreenUI>();
            if (settings != null)
            {
                settings.Show();
                _panel.SetActive(false);
            }
            else
            {
                Debug.LogWarning("[Pause] SettingsScreenUI not found");
            }
        }

        private void GoHome()
        {
            Time.timeScale = 1f;
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();

            Debug.Log("[Pause] Returning to home");
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        void OnDestroy()
        {
            Time.timeScale = 1f;
        }

        // ===================== HELPERS =====================

        private void CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style)
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
        }

        private void CreateButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
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
            txt.supportRichText = true;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}