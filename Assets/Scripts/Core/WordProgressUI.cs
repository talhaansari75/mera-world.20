using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WordProgressUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private Image _fillBar;
        private Text _progressText;
        private int _totalWords = 8;
        private int _foundWords = 0;

        void Start()
        {
            Invoke(nameof(Setup), 0.35f);
        }

        private void Setup()
        {
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();

            if (GameManager != null && GameManager.Words != null)
                _totalWords = GameManager.Words.Count;

            BuildCanvas();
            BuildProgressBar();

            if (SelectionManager != null)
                SelectionManager.OnWordFound += OnWordFound;

            UpdateProgress(0);
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ProgressCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 55;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildProgressBar()
        {
            // Background track
            var trackObj = new GameObject("Track");
            trackObj.transform.SetParent(_canvas.transform, false);

            var trackImg = trackObj.AddComponent<Image>();
            trackImg.color = new Color(0.08f, 0.12f, 0.22f, 0.90f);

            var trackRt = trackObj.GetComponent<RectTransform>();
            trackRt.anchorMin = new Vector2(0.5f, 1f);
            trackRt.anchorMax = new Vector2(0.5f, 1f);
            trackRt.pivot = new Vector2(0.5f, 1f);
            trackRt.anchoredPosition = new Vector2(0f, -130f);
            trackRt.sizeDelta = new Vector2(700f, 40f);

            // Fill bar
            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(trackObj.transform, false);

            _fillBar = fillObj.AddComponent<Image>();
            _fillBar.color = new Color(0.30f, 0.75f, 0.40f);

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = Vector2.zero;
            fillRt.offsetMin = new Vector2(4f, 4f);
            fillRt.offsetMax = new Vector2(4f, -4f);
            fillRt.sizeDelta = new Vector2(0f, -8f);

            // Progress text
            var textObj = new GameObject("ProgressText");
            textObj.transform.SetParent(_canvas.transform, false);

            _progressText = textObj.AddComponent<Text>();
            _progressText.text = $"0 / {_totalWords}";
            _progressText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _progressText.fontSize = 30;
            _progressText.fontStyle = FontStyle.Bold;
            _progressText.color = Color.white;
            _progressText.alignment = TextAnchor.MiddleCenter;

            var textRt = textObj.GetComponent<RectTransform>();
            textRt.anchorMin = new Vector2(0.5f, 1f);
            textRt.anchorMax = new Vector2(0.5f, 1f);
            textRt.pivot = new Vector2(0.5f, 1f);
            textRt.anchoredPosition = new Vector2(0f, -130f);
            textRt.sizeDelta = new Vector2(700f, 40f);
        }

        private void OnWordFound(string word)
        {
            _foundWords++;
            UpdateProgress(_foundWords);
        }

        private void UpdateProgress(int found)
        {
            if (_fillBar == null) return;

            float pct = _totalWords > 0 ? (float)found / _totalWords : 0f;
            float targetWidth = 692f * pct; // track width minus padding

            _fillBar.rectTransform.sizeDelta = new Vector2(targetWidth, -8f);

            if (_progressText != null)
                _progressText.text = $"{found} / {_totalWords}";

            // Change color as progress increases
            if (pct < 0.4f)
                _fillBar.color = new Color(0.30f, 0.75f, 0.40f);
            else if (pct < 0.8f)
                _fillBar.color = new Color(1f, 0.75f, 0.25f);
            else
                _fillBar.color = new Color(0.95f, 0.45f, 0.25f);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}