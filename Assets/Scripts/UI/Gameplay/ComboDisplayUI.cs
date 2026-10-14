using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ComboDisplayUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _comboPanel;
        private Text _comboText;
        private Text _bonusText;
        private Coroutine _hideRoutine;

        void Start()
        {
            Invoke(nameof(Setup), 0.5f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildComboPanel();

            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged += OnComboChanged;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ComboCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 285;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildComboPanel()
        {
            _comboPanel = new GameObject("ComboPanel");
            _comboPanel.transform.SetParent(_canvas.transform, false);

            var rt = _comboPanel.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 450f);
            rt.sizeDelta = new Vector2(600f, 200f);

            _comboText = CreateText(_comboPanel.transform, "x2 COMBO!", new Vector2(0f, 30f), 80,
                new Color(1f, 0.85f, 0.30f));

            _bonusText = CreateText(_comboPanel.transform, "+2 BONUS", new Vector2(0f, -60f), 40,
                new Color(0.65f, 1f, 0.65f));

            _comboPanel.SetActive(false);
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            // Add outline for readability
            var outline = obj.AddComponent<Outline>();
            outline.effectColor = new Color(0f, 0f, 0f, 0.75f);
            outline.effectDistance = new Vector2(3f, -3f);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(600f, 100f);

            return txt;
        }

        private void OnComboChanged(int combo, int bonus)
        {
            if (combo < 2)
            {
                if (_comboPanel.activeSelf) HideCombo();
                return;
            }

            if (_comboPanel == null) return;

            _comboText.text = $"x{combo} COMBO!";

            // Color changes with combo level
            if (combo == 2)
                _comboText.color = new Color(1f, 0.85f, 0.30f);
            else if (combo == 3)
                _comboText.color = new Color(1f, 0.65f, 0.20f);
            else if (combo == 4)
                _comboText.color = new Color(0.95f, 0.35f, 0.55f);
            else
                _comboText.color = new Color(0.85f, 0.45f, 1f);

            _bonusText.text = $"+{bonus} BONUS";

            if (!_comboPanel.activeSelf)
                _comboPanel.SetActive(true);

            StopAllCoroutines();
            StartCoroutine(PopAnimation());
        }

        private IEnumerator PopAnimation()
        {
            var rt = _comboPanel.GetComponent<RectTransform>();

            // Punch scale
            float duration = 0.35f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                float scale = 1f;
                if (t < 0.4f)
                    scale = Mathf.Lerp(0.3f, 1.3f, t / 0.4f);
                else
                    scale = Mathf.Lerp(1.3f, 1f, (t - 0.4f) / 0.6f);

                rt.localScale = new Vector3(scale, scale, 1f);

                // Shake horizontally at high combos
                if (ComboSystem.Instance != null && ComboSystem.Instance.GetCurrentCombo() >= 3)
                {
                    rt.anchoredPosition = new Vector2(
                        Mathf.Sin(t * 30f) * 8f * (1f - t),
                        450f);
                }

                yield return null;
            }

            rt.localScale = Vector3.one;
            rt.anchoredPosition = new Vector2(0f, 450f);

            // Auto-hide after 1.5s
            if (_hideRoutine != null) StopCoroutine(_hideRoutine);
            _hideRoutine = StartCoroutine(AutoHide());
        }

        private IEnumerator AutoHide()
        {
            yield return new WaitForSecondsRealtime(1.5f);
            HideCombo();
        }

        private void HideCombo()
        {
            if (_comboPanel != null)
                _comboPanel.SetActive(false);
        }

        void OnDestroy()
        {
            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged -= OnComboChanged;
        }
    }
}