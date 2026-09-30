using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// Shows "COMBO xN" text with pop animation when combo increases.
    /// </summary>
    public class ComboDisplayUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _comboPanel;
        private Text _comboText;
        private Coroutine _punchRoutine;

        void Start() { Invoke(nameof(Setup), 1.2f); }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();

            // Subscribe to combo events
            if (ComboSystem.Instance != null)
            {
                ComboSystem.Instance.OnComboChanged += HandleComboChanged;
                ComboSystem.Instance.OnComboReset += HandleComboReset;
            }
            else
            {
                InvokeRepeating(nameof(TrySubscribe), 0.5f, 1f);
            }
        }

        private bool _subscribed = false;

        private void TrySubscribe()
        {
            if (_subscribed || ComboSystem.Instance == null) return;
            ComboSystem.Instance.OnComboChanged += HandleComboChanged;
            ComboSystem.Instance.OnComboReset += HandleComboReset;
            _subscribed = true;
            CancelInvoke(nameof(TrySubscribe));
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
            var canvasObj = new GameObject("ComboDisplayCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 95;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _comboPanel = new GameObject("ComboPanel");
            _comboPanel.transform.SetParent(_canvas.transform, false);

            var bg = _comboPanel.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.95f, 0.65f, 0.20f), 128, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = _comboPanel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -150f);
            rt.sizeDelta = new Vector2(400f, 120f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(_comboPanel.transform, false);
            _comboText = textObj.AddComponent<Text>();
            _comboText.text = "COMBO x1";
            _comboText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _comboText.fontSize = 60;
            _comboText.fontStyle = FontStyle.Bold;
            _comboText.color = Color.white;
            _comboText.alignment = TextAnchor.MiddleCenter;
            _comboText.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            _comboPanel.SetActive(false);
        }

        private void HandleComboChanged(int combo)
        {
            if (_comboPanel == null) return;

            if (combo <= 1)
            {
                _comboPanel.SetActive(false);
                return;
            }

            _comboPanel.SetActive(true);
            _comboText.text = $"COMBO x{combo}";

            if (_punchRoutine != null) StopCoroutine(_punchRoutine);
            _punchRoutine = StartCoroutine(PunchAnim());
        }

        private void HandleComboReset(int oldCombo)
        {
            if (_comboPanel != null)
                _comboPanel.SetActive(false);
        }

        private IEnumerator PunchAnim()
        {
            var rt = _comboPanel.GetComponent<RectTransform>();
            Vector3 start = Vector3.one * 0.7f;
            Vector3 peak = Vector3.one * 1.15f;
            Vector3 end = Vector3.one;

            float t = 0f;
            float dur = 0.15f;
            while (t < dur)
            {
                t += Time.unscaledDeltaTime;
                rt.localScale = Vector3.Lerp(start, peak, t / dur);
                yield return null;
            }
            t = 0f;
            while (t < dur)
            {
                t += Time.unscaledDeltaTime;
                rt.localScale = Vector3.Lerp(peak, end, t / dur);
                yield return null;
            }
            rt.localScale = end;
        }
    }
}