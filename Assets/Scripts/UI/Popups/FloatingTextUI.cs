using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class FloatingTextUI : MonoBehaviour
    {
        public static FloatingTextUI Instance { get; private set; }
        private Canvas _canvas;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            Invoke(nameof(BuildCanvas), 0.5f);
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("FloatingTextCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 320;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;
        }

        public void ShowFloatingText(string message, Color color, Vector2 pos)
        {
            if (_canvas == null) return;
            StartCoroutine(FloatRoutine(message, color, pos));
        }

        private IEnumerator FloatRoutine(string message, Color color, Vector2 startPos)
        {
            var obj = new GameObject("FloatText");
            obj.transform.SetParent(_canvas.transform, false);

            var txt = obj.AddComponent<Text>();
            txt.text = message;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 60;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var outline = obj.AddComponent<Outline>();
            outline.effectColor = new Color(0f, 0f, 0f, 0.8f);
            outline.effectDistance = new Vector2(2f, -2f);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = startPos;
            rt.sizeDelta = new Vector2(600f, 100f);

            float duration = 1.0f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                rt.anchoredPosition = Vector2.Lerp(startPos, startPos + new Vector2(0f, 200f), t);
                var c = txt.color; c.a = 1f - t; txt.color = c;
                yield return null;
            }

            if (obj != null) Destroy(obj);
        }
    }
}