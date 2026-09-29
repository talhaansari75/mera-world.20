using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LevelProgressBarUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private Image _fillBar;
        private Text _levelText;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 0.5f);
        }

        private void Setup()
        {
            BuildCanvas();
            UpdateProgress();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LevelProgressCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 45;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var barObj = new GameObject("BarBg");
            barObj.transform.SetParent(_canvas.transform, false);
            var barImg = barObj.AddComponent<Image>();
            barImg.color = new Color(0.10f, 0.15f, 0.25f, 0.9f);
            barImg.raycastTarget = false;

            var barRt = barObj.GetComponent<RectTransform>();
            barRt.anchorMin = new Vector2(0.5f, 1f);
            barRt.anchorMax = new Vector2(0.5f, 1f);
            barRt.pivot = new Vector2(0.5f, 1f);
            barRt.anchoredPosition = new Vector2(0f, -180f);
            barRt.sizeDelta = new Vector2(800f, 30f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(barObj.transform, false);
            _fillBar = fillObj.AddComponent<Image>();
            _fillBar.color = new Color(0.35f, 0.70f, 0.95f);
            _fillBar.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(3f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -6f);

            var textObj = new GameObject("LevelText");
            textObj.transform.SetParent(barObj.transform, false);
            _levelText = textObj.AddComponent<Text>();
            _levelText.text = "0 / 20";
            _levelText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _levelText.fontSize = 22;
            _levelText.fontStyle = FontStyle.Bold;
            _levelText.color = Color.white;
            _levelText.alignment = TextAnchor.MiddleCenter;
            _levelText.raycastTarget = false;

            var textRt = textObj.GetComponent<RectTransform>();
            textRt.anchorMin = Vector2.zero;
            textRt.anchorMax = Vector2.one;
            textRt.offsetMin = Vector2.zero;
            textRt.offsetMax = Vector2.zero;
        }

        private void UpdateProgress()
        {
            if (Progress == null || _fillBar == null) return;

            int level = Progress.HighestLevelUnlocked;
            int total = 20;
            int clampedLevel = Mathf.Clamp(level, 0, total);
            float pct = (float)clampedLevel / total;
            float width = 794f * pct;

            _fillBar.rectTransform.sizeDelta = new Vector2(width, -6f);
            _levelText.text = $"{clampedLevel} / {total}";
        }
    }
}