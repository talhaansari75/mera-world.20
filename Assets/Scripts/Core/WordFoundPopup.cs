using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WordFoundPopup : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;

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
            var canvasObj = new GameObject("WordFoundCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 280;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void OnWordFound(string word)
        {
            if (string.IsNullOrEmpty(word)) return;
            StartCoroutine(ShowWordPopup(word));
        }

        private IEnumerator ShowWordPopup(string word)
        {
            var popup = new GameObject("WordPopup");
            popup.transform.SetParent(_canvas.transform, false);

            var bgImg = popup.AddComponent<Image>();
            bgImg.color = new Color(0.10f, 0.55f, 0.25f, 0.95f);

            var bgRt = popup.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.5f, 0.5f);
            bgRt.anchorMax = new Vector2(0.5f, 0.5f);
            bgRt.pivot = new Vector2(0.5f, 0.5f);
            bgRt.anchoredPosition = new Vector2(0f, 220f);
            bgRt.sizeDelta = new Vector2(600f, 150f);

            var txtObj = new GameObject("WordText");
            txtObj.transform.SetParent(popup.transform, false);

            var txt = txtObj.AddComponent<Text>();
            txt.text = word.ToUpperInvariant();
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 90;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;

            var txtRt = txtObj.GetComponent<RectTransform>();
            txtRt.anchorMin = Vector2.zero;
            txtRt.anchorMax = Vector2.one;
            txtRt.offsetMin = Vector2.zero;
            txtRt.offsetMax = Vector2.zero;

            float duration = 1.2f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                float scale = 1f;
                if (t < 0.2f) scale = Mathf.Lerp(0.3f, 1.15f, t / 0.2f);
                else if (t < 0.4f) scale = Mathf.Lerp(1.15f, 1f, (t - 0.2f) / 0.2f);

                bgRt.localScale = new Vector3(scale, scale, 1f);

                if (t > 0.7f)
                {
                    float fadeT = (t - 0.7f) / 0.3f;
                    var bg = bgImg.color;
                    bg.a = 0.95f * (1f - fadeT);
                    bgImg.color = bg;

                    var tc = txt.color;
                    tc.a = 1f - fadeT;
                    txt.color = tc;
                }

                yield return null;
            }

            if (popup != null)
                Destroy(popup);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}