using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class CoinPopupUI : MonoBehaviour
    {
        public static CoinPopupUI Instance { get; private set; }

        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        void Start()
        {
            Invoke(nameof(Setup), 0.35f);
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
            var canvasObj = new GameObject("CoinPopupCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 300;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void OnWordFound(string word)
        {
            int coins = SelectionManager != null ? SelectionManager.CoinsPerWord : 5;
            ShowCoinPopup(coins);
        }

        public void ShowCoinPopup(int amount)
        {
            if (_canvas == null) return;

            var popup = new GameObject("CoinPopup");
            popup.transform.SetParent(_canvas.transform, false);

            var txt = popup.AddComponent<Text>();
            txt.text = $"+{amount}";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 80;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.25f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.supportRichText = true;

            var rt = popup.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 0f);
            rt.sizeDelta = new Vector2(400f, 120f);

            StartCoroutine(AnimatePopup(rt, txt));
        }

        private IEnumerator AnimatePopup(RectTransform rt, Text txt)
        {
            float duration = 1.0f;
            float elapsed = 0f;

            Vector2 startPos = new Vector2(0f, -100f);
            Vector2 endPos   = new Vector2(0f, 300f);

            Color startColor = txt.color;
            Color endColor   = new Color(1f, 0.85f, 0.25f, 0f);

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                rt.anchoredPosition = Vector2.Lerp(startPos, endPos, t);
                txt.color = Color.Lerp(startColor, endColor, t);

                // Slight scale bounce at start
                float scale = 1f;
                if (t < 0.2f) scale = Mathf.Lerp(0.5f, 1.3f, t / 0.2f);
                else if (t < 0.4f) scale = Mathf.Lerp(1.3f, 1f, (t - 0.2f) / 0.2f);

                rt.localScale = new Vector3(scale, scale, 1f);

                yield return null;
            }

            if (rt != null && rt.gameObject != null)
                Destroy(rt.gameObject);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}