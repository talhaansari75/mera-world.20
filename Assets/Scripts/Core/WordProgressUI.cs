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

        void Start() { Invoke(nameof(Setup), 0.35f); }

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
            // 3D track
            var trackObj = new GameObject("Track");
            trackObj.transform.SetParent(_canvas.transform, false);

            var trackImg = trackObj.AddComponent<Image>();
            trackImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.08f, 0.12f, 0.22f), 256, 30);
            trackImg.type = Image.Type.Sliced;
            trackImg.color = Color.white;
            trackImg.raycastTarget = false;

            var trackRt = trackObj.GetComponent<RectTransform>();
            trackRt.anchorMin = new Vector2(0.5f, 1f);
            trackRt.anchorMax = new Vector2(0.5f, 1f);
            trackRt.pivot = new Vector2(0.5f, 1f);
            trackRt.anchoredPosition = new Vector2(0f, -140f);
            trackRt.sizeDelta = new Vector2(680f, 50f);

            // Fill
            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(trackObj.transform, false);

            _fillBar = fillObj.AddComponent<Image>();
            _fillBar.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.30f, 0.75f, 0.40f), 128, 20);
            _fillBar.type = Image.Type.Sliced;
            _fillBar.color = Color.white;
            _fillBar.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(5f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -10f);

            // Text on top
            var textObj = new GameObject("ProgressText");
            textObj.transform.SetParent(trackObj.transform, false);

            _progressText = textObj.AddComponent<Text>();
            _progressText.text = $"0 / {_totalWords}";
            _progressText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _progressText.fontSize = 28;
            _progressText.fontStyle = FontStyle.Bold;
            _progressText.color = Color.white;
            _progressText.alignment = TextAnchor.MiddleCenter;
            _progressText.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.65f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var textRt = textObj.GetComponent<RectTransform>();
            textRt.anchorMin = Vector2.zero;
            textRt.anchorMax = Vector2.one;
            textRt.offsetMin = Vector2.zero;
            textRt.offsetMax = Vector2.zero;
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
            float targetWidth = 670f * pct;

            _fillBar.rectTransform.sizeDelta = new Vector2(targetWidth, -10f);

            if (_progressText != null)
                _progressText.text = $"{found} / {_totalWords}";

            if (pct < 0.4f)
                _fillBar.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.30f, 0.75f, 0.40f), 128, 20);
            else if (pct < 0.8f)
                _fillBar.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.75f, 0.25f), 128, 20);
            else
                _fillBar.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.95f, 0.45f, 0.25f), 128, 20);

            _fillBar.type = Image.Type.Sliced;
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}