using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WinScreenUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private GameObject _panel;

        void Start()
        {
            Invoke(nameof(Setup), 0.3f);
        }

        private void Setup()
        {
            BuildHiddenPanel();
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete += ShowWinScreen;
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
            scaler.referenceResolution = new Vector2(1920, 1080);
            scaler.matchWidthOrHeight = 0.5f;

            _panel = new GameObject("Overlay");
            _panel.transform.SetParent(_canvas.transform, false);

            var overlay = _panel.AddComponent<Image>();
            overlay.color = new Color(0f, 0f, 0f, 0.85f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title
            CreateText(_panel.transform, "LEVEL COMPLETE!",
                new Vector2(0f, 280f), 90, new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            // Subtitle
            CreateText(_panel.transform, "All words found!",
                new Vector2(0f, 180f), 45, Color.white, FontStyle.Normal);

            // Coins
            CreateText(_panel.transform, "+100 coins",
                new Vector2(0f, 90f), 55, new Color(1f, 0.9f, 0.4f), FontStyle.Bold);

            // Next Level button
            CreateButton(_panel.transform, "NEXT LEVEL",
                new Vector2(0f, -80f), new Vector2(500f, 100f),
                new Color(0.25f, 0.7f, 0.35f), OnNextLevel);

            // Replay button
            CreateButton(_panel.transform, "REPLAY",
                new Vector2(0f, -220f), new Vector2(500f, 100f),
                new Color(0.3f, 0.5f, 0.8f), OnReplay);

            _panel.SetActive(false);
        }

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
            rt.sizeDelta = new Vector2(1000f, 120f);
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
            txt.fontSize = 44;
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

        private void ShowWinScreen()
        {
            if (_panel != null) _panel.SetActive(true);
        }

        private void OnNextLevel()
        {
            if (_panel != null) _panel.SetActive(false);
            Debug.Log("NEXT LEVEL clicked — will load next level later");
        }

        private void OnReplay()
        {
            if (_panel != null) _panel.SetActive(false);
            Debug.Log("REPLAY clicked — restarting scene");
            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete -= ShowWinScreen;
        }
    }
}