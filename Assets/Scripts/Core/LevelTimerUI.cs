using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LevelTimerUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private Text _timerText;
        private float _startTime;
        private bool _stopped = false;

        void Start()
        {
            _startTime = Time.time;
            Invoke(nameof(Setup), 0.35f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            BuildCanvas();

            if (SelectionManager != null)
                SelectionManager.OnLevelComplete += OnLevelComplete;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LevelTimerCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 56;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var textObj = new GameObject("TimerText");
            textObj.transform.SetParent(_canvas.transform, false);

            _timerText = textObj.AddComponent<Text>();
            _timerText.text = "0:00";
            _timerText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _timerText.fontSize = 42;
            _timerText.fontStyle = FontStyle.Bold;
            _timerText.color = new Color(0.85f, 0.90f, 1f);
            _timerText.alignment = TextAnchor.MiddleCenter;

            var rt = textObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -185f);
            rt.sizeDelta = new Vector2(400f, 50f);
        }

        void Update()
        {
            if (_stopped || _timerText == null) return;

            float elapsed = Time.time - _startTime;
            int minutes = Mathf.FloorToInt(elapsed / 60f);
            int seconds = Mathf.FloorToInt(elapsed % 60f);

            _timerText.text = $"{minutes}:{seconds:00}";

            if (elapsed < 60f)
                _timerText.color = new Color(0.85f, 0.90f, 1f);
            else if (elapsed < 120f)
                _timerText.color = new Color(1f, 0.85f, 0.35f);
            else
                _timerText.color = new Color(1f, 0.5f, 0.4f);
        }

        private void OnLevelComplete()
        {
            _stopped = true;
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete -= OnLevelComplete;
        }
    }
}