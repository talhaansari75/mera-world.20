using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// Small streak counter — shows current combo as a pill on the side.
    /// </summary>
    public class ComboStreakUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _streakRoot;
        private Text _streakText;
        private Image _bgImage;

        void Start() { Invoke(nameof(Setup), 1.2f); }

        private void Setup()
        {
            BuildCanvas();
            BuildUI();

            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged += HandleComboChanged;

            TrySubscribe();
        }

        private bool _subscribed = false;

        private void TrySubscribe()
        {
            if (_subscribed) return;
            if (ComboSystem.Instance == null)
            {
                Invoke(nameof(TrySubscribe), 0.5f);
                return;
            }
            ComboSystem.Instance.OnComboChanged += HandleComboChanged;
            _subscribed = true;
        }

        void OnDestroy()
        {
            if (ComboSystem.Instance != null)
                ComboSystem.Instance.OnComboChanged -= HandleComboChanged;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ComboStreakCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 96;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildUI()
        {
            _streakRoot = new GameObject("StreakRoot");
            _streakRoot.transform.SetParent(_canvas.transform, false);

            var rt = _streakRoot.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 0.5f);
            rt.anchorMax = new Vector2(0f, 0.5f);
            rt.pivot = new Vector2(0f, 0.5f);
            rt.anchoredPosition = new Vector2(20f, 0f);
            rt.sizeDelta = new Vector2(140f, 140f);

            _bgImage = _streakRoot.AddComponent<Image>();
            _bgImage.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.95f, 0.65f, 0.20f), 128, 40);
            _bgImage.type = Image.Type.Sliced;
            _bgImage.color = Color.white;
            _bgImage.raycastTarget = false;

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(_streakRoot.transform, false);
            _streakText = textObj.AddComponent<Text>();
            _streakText.text = "x1";
            _streakText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _streakText.fontSize = 48;
            _streakText.fontStyle = FontStyle.Bold;
            _streakText.color = Color.white;
            _streakText.alignment = TextAnchor.MiddleCenter;
            _streakText.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            _streakRoot.SetActive(false);
        }

        private void HandleComboChanged(int combo)
        {
            if (_streakRoot == null) return;

            if (combo < 2)
            {
                _streakRoot.SetActive(false);
                return;
            }

            _streakRoot.SetActive(true);
            _streakText.text = $"x{combo}";

            // Change color by combo level
            Color c;
            if (combo >= 15) c = new Color(0.95f, 0.30f, 0.55f);       // pink (legendary)
            else if (combo >= 10) c = new Color(0.85f, 0.30f, 0.85f);  // purple
            else if (combo >= 5) c = new Color(0.30f, 0.65f, 0.95f);   // blue
            else c = new Color(0.95f, 0.65f, 0.20f);                    // orange

            _bgImage.sprite = UISpriteFactory.Create3DButtonSprite(c, 128, 40);
            _bgImage.type = Image.Type.Sliced;

            StartCoroutine(Punch());
        }

        private IEnumerator Punch()
        {
            var rt = _streakRoot.GetComponent<RectTransform>();
            Vector3 big = Vector3.one * 1.2f;
            Vector3 normal = Vector3.one;

            float t = 0f;
            while (t < 0.1f)
            {
                t += Time.unscaledDeltaTime;
                rt.localScale = Vector3.Lerp(normal, big, t / 0.1f);
                yield return null;
            }
            t = 0f;
            while (t < 0.1f)
            {
                t += Time.unscaledDeltaTime;
                rt.localScale = Vector3.Lerp(big, normal, t / 0.1f);
                yield return null;
            }
            rt.localScale = normal;
        }
    }
}