using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ComboTimerBarUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _bar;
        private Image _fill;

        void Start() { Invoke(nameof(Setup), 1f); }

        private void Setup()
        {
            BuildCanvas();
            BuildBar();
            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged += OnComboChanged;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ComboTimerCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 286;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBar()
        {
            _bar = new GameObject("ComboTimerBar");
            _bar.transform.SetParent(_canvas.transform, false);

            var bg = _bar.AddComponent<Image>();
            bg.color = new Color(0.20f, 0.10f, 0.05f, 0.9f);
            bg.raycastTarget = false;

            var rt = _bar.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -280f);
            rt.sizeDelta = new Vector2(500f, 20f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(_bar.transform, false);
            _fill = fillObj.AddComponent<Image>();
            _fill.color = new Color(1f, 0.65f, 0.20f);
            _fill.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -4f);

            _bar.SetActive(false);
        }

        private void OnComboChanged(int combo, int bonus)
        {
            if (combo < 2)
            {
                if (_bar != null) _bar.SetActive(false);
                return;
            }

            if (_bar != null) _bar.SetActive(true);
        }

        void Update()
        {
            if (_bar == null || !_bar.activeSelf) return;
            if (ComboSystem.Instance == null) return;

            // Track combo timer — countdown till combo expires
            // Approximate: show bar based on combo level
            float pct = Mathf.Clamp01(ComboSystem.Instance.GetCurrentCombo() / 8f);
            _fill.rectTransform.sizeDelta = new Vector2(496f * pct, -4f);
        }

        void OnDestroy()
        {
            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged -= OnComboChanged;
        }
    }
}