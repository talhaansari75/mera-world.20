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

        private Canvas _canvas;
        private GameObject _panel;
        private Text _titleText;

        void Start()
        {
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
            _canvas.sortingOrder = 200;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            _panel = new GameObject("Overlay");
            _panel.transform.SetParent(_canvas.transform, false);

            var overlay = _panel.AddComponent<Image>();
            overlay.color = new Color(0f, 0f, 0f, 0.85f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            _titleText = CreateText(_panel.transform, "LEVEL 1 COMPLETE!",
                new Vector2(0f, 400f), 80, new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateText(_panel.transform, "All words found!",
                new Vector2(0f, 280f), 45, Color.white, FontStyle.Normal);

            CreateText(_panel.transform, "+100 coins",
                new Vector2(0f, 180f), 55, new Color(1f, 0.9f, 0.4f), FontStyle.Bold);

            CreateButton(_panel.transform, "NEXT LEVEL",
                new Vector2(0f, -80f), new Vector2(500f, 110f),
                new Color(0.25f, 0.7f, 0.35f), OnNextLevel);

            CreateButton(_panel.transform, "REPLAY",
                new Vector2(0f, -230f), new Vector2(500f, 110f),
                new Color(0.3f, 0.5f, 0.8f), OnReplay);

            CreateButton(_panel.transform, "HOME",
                new Vector2(0f, -380f), new Vector2(500f, 110f),
                new Color(0.5f, 0.5f, 0.55f), OnHome);

            _panel.SetActive(false);
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
            if (_panel != null)
            {
                if (_titleText != null && GameManager != null)
                    _titleText.text = $"LEVEL {GameManager.CurrentLevel} COMPLETE!";

                _panel.SetActive(true);
            }
        }

        private void OnNextLevel()
        {
            int currentLevel = GameManager != null ? GameManager.CurrentLevel : 1;
            int nextLevel = currentLevel + 1;

            Debug.Log($"[NEXT LEVEL] {currentLevel} -> {nextLevel}");

            if (PlayerProgressManager.Instance != null)
            {
                PlayerProgressManager.Instance.AddCoins(100);
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
            Debug.Log($"[REPLAY] Restarting level {GameManager?.CurrentLevel}");

            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void OnHome()
        {
            Debug.Log("[HOME] Returning to home screen");

            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();

            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete -= ShowWinScreen;
        }
    }
}