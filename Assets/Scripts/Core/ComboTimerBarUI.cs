using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// Horizontal bar that depletes as the combo window expires.
    /// </summary>
    public class ComboTimerBarUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _barRoot;
        private Image _fillImage;
        private RectTransform _fillRect;

        private const float MAX_WIDTH = 400f;

        void Start() { Invoke(nameof(Setup), 1.2f); }

        private void Setup()
        {
            BuildCanvas();
            BuildBar();

            if (ComboSystem.Instance != null)
            {
                ComboSystem.Instance.OnComboChanged += HandleComboChanged;
                ComboSystem.Instance.OnComboReset += HandleComboReset;
            }
        }

        void Update()
        {
            if (ComboSystem.Instance == null || _fillRect == null) return;
            if (!_barRoot.activeSelf) return;

            float pct = ComboSystem.Instance.GetComboProgress();
            _fillRect.sizeDelta = new Vector2(MAX_WIDTH * pct - 4f, -4f);
        }

        void OnDestroy()
        {
            if (ComboSystem.Instance != null)
            {
                ComboSystem.Instance.OnComboChanged -= HandleComboChanged;
                ComboSystem.Instance.OnComboReset -= HandleComboReset;
            }
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ComboTimerCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 94;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBar()
        {
            _barRoot = new GameObject("BarRoot");
            _barRoot.transform.SetParent(_canvas.transform, false);

            var rt = _barRoot.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -290f);
            rt.sizeDelta = new Vector2(MAX_WIDTH, 16f);

            var bg = _barRoot.AddComponent<Image>();
            bg.color = new Color(0.10f, 0.15f, 0.25f, 0.9f);
            bg.raycastTarget = false;

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(_barRoot.transform, false);
            _fillImage = fillObj.AddComponent<Image>();
            _fillImage.color = new Color(0.95f, 0.65f, 0.20f);
            _fillImage.raycastTarget = false;

            _fillRect = fillObj.GetComponent<RectTransform>();
            _fillRect.anchorMin = new Vector2(0f, 0f);
            _fillRect.anchorMax = new Vector2(0f, 1f);
            _fillRect.pivot = new Vector2(0f, 0.5f);
            _fillRect.anchoredPosition = new Vector2(2f, 0f);
            _fillRect.sizeDelta = new Vector2(MAX_WIDTH - 4f, -4f);

            _barRoot.SetActive(false);
        }

        private void HandleComboChanged(int combo)
        {
            if (_barRoot == null) return;
            _barRoot.SetActive(combo > 1);
        }

        private void HandleComboReset(int oldCombo)
        {
            if (_barRoot != null)
                _barRoot.SetActive(false);
        }
    }
}