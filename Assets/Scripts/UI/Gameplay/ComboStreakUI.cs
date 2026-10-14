using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ComboStreakUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _streakPanel;
        private Text _streakText;

        void Start()
        {
            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildStreakPanel();

            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged += OnComboChanged;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ComboStreakCanvas");
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

        private void BuildStreakPanel()
        {
            _streakPanel = new GameObject("StreakPanel");
            _streakPanel.transform.SetParent(_canvas.transform, false);

            var bg = _streakPanel.AddComponent<Image>();
            bg.color = new Color(1f, 0.55f, 0.20f, 0.95f);

            var rt = _streakPanel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 1f);
            rt.anchoredPosition = new Vector2(-30f, -280f);
            rt.sizeDelta = new Vector2(300f, 90f);

            var textObj = new GameObject("StreakText");
            textObj.transform.SetParent(_streakPanel.transform, false);
            _streakText = textObj.AddComponent<Text>();
            _streakText.text = "STREAK x2";
            _streakText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _streakText.fontSize = 36;
            _streakText.fontStyle = FontStyle.Bold;
            _streakText.color = Color.white;
            _streakText.alignment = TextAnchor.MiddleCenter;
            _streakText.raycastTarget = false;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            _streakPanel.SetActive(false);
        }

        private void OnComboChanged(int combo, int bonus)
        {
            if (combo < 2)
            {
                if (_streakPanel.activeSelf)
                    _streakPanel.SetActive(false);
                return;
            }

            _streakText.text = $"STREAK x{combo}";

            // Color by combo level
            var img = _streakPanel.GetComponent<Image>();
            if (combo == 2) img.color = new Color(1f, 0.55f, 0.20f, 0.95f);
            else if (combo == 3) img.color = new Color(1f, 0.35f, 0.35f, 0.95f);
            else if (combo == 4) img.color = new Color(0.85f, 0.30f, 0.75f, 0.95f);
            else img.color = new Color(0.60f, 0.30f, 1f, 0.95f);

            _streakPanel.SetActive(true);
            StopAllCoroutines();
            StartCoroutine(PulseRoutine());
        }

        private IEnumerator PulseRoutine()
        {
            var rt = _streakPanel.GetComponent<RectTransform>();
            float duration = 0.3f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float scale = 1f + Mathf.Sin(t * Mathf.PI) * 0.25f;
                rt.localScale = new Vector3(scale, scale, 1f);
                yield return null;
            }
            rt.localScale = Vector3.one;
        }

        void OnDestroy()
        {
            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged -= OnComboChanged;
        }
    }
}