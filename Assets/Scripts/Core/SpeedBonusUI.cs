using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SpeedBonusUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private float _lastWordTime = -10f;
        private const string KEY_LABEL = "SpeedBonus";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            BuildCanvas();

            if (SelectionManager != null)
                SelectionManager.OnWordFound += OnWordFound;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("SpeedBonusCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 287;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void OnWordFound(string word)
        {
            float now = Time.time;
            float delta = now - _lastWordTime;
            _lastWordTime = now;

            // If found under 4 seconds - speed bonus
            if (delta < 4f && delta > 0.5f)
            {
                int bonus = 3;
                if (Progress != null) Progress.AddCoins(bonus);
                ShowBonus($"FAST +{bonus}");
            }
        }

        private void ShowBonus(string text)
        {
            if (_canvas == null) return;
            StartCoroutine(BonusRoutine(text));
        }

        private IEnumerator BonusRoutine(string message)
        {
            var obj = new GameObject(KEY_LABEL);
            obj.transform.SetParent(_canvas.transform, false);

            var txt = obj.AddComponent<Text>();
            txt.text = message;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 50;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(0.30f, 1f, 0.50f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var outline = obj.AddComponent<Outline>();
            outline.effectColor = new Color(0f, 0f, 0f, 0.75f);
            outline.effectDistance = new Vector2(2f, -2f);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, -100f);
            rt.sizeDelta = new Vector2(500f, 100f);

            float duration = 1.0f;
            float elapsed = 0f;
            Vector2 start = new Vector2(0f, -100f);
            Vector2 end = new Vector2(0f, -300f);

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                rt.anchoredPosition = Vector2.Lerp(start, end, t);
                var c = txt.color; c.a = 1f - t; txt.color = c;
                yield return null;
            }

            if (obj != null) Destroy(obj);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}