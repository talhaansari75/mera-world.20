using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class CoinFlyAnimation : MonoBehaviour
    {
        public static CoinFlyAnimation Instance { get; private set; }

        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private Sprite _coinSprite;

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

            _coinSprite = CreateCoinSprite();
            BuildCanvas();

            if (SelectionManager != null)
                SelectionManager.OnWordFound += OnWordFound;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("CoinFlyCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 290;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void OnWordFound(string word)
        {
            SpawnCoinBurst();
        }

        public void SpawnCoinBurst()
        {
            StartCoroutine(SpawnCoins(5));
        }

        private IEnumerator SpawnCoins(int count)
        {
            for (int i = 0; i < count; i++)
            {
                StartCoroutine(FlySingleCoin(i, count));
                yield return new WaitForSecondsRealtime(0.06f);
            }
        }

        private IEnumerator FlySingleCoin(int index, int total)
        {
            var coinObj = new GameObject($"Coin_{index}");
            coinObj.transform.SetParent(_canvas.transform, false);

            var img = coinObj.AddComponent<Image>();
            img.sprite = _coinSprite;
            img.color = new Color(1f, 0.85f, 0.20f);

            var rt = coinObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);

            // Start: from center, slight spread
            Vector2 startPos = new Vector2((index - total / 2f) * 40f, 0f);
            // End: top-left coin counter
            Vector2 endPos = new Vector2(-460f, 850f);

            rt.anchoredPosition = startPos;
            rt.sizeDelta = new Vector2(70f, 70f);
            rt.localScale = Vector3.one;

            float duration = 0.8f;
            float elapsed = 0f;

            // Random small pause before flight
            float delay = Random.Range(0f, 0.15f);
            yield return new WaitForSecondsRealtime(delay);

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                // Ease-in-out
                float eased = t < 0.5f ? 2f * t * t : 1f - Mathf.Pow(-2f * t + 2f, 2f) / 2f;

                // Bezier curve: up then over
                Vector2 midPoint = new Vector2(startPos.x, startPos.y + 300f);
                Vector2 pos = QuadraticBezier(startPos, midPoint, endPos, eased);
                rt.anchoredPosition = pos;

                // Scale down as it flies
                float scale = Mathf.Lerp(1f, 0.5f, eased);
                rt.localScale = new Vector3(scale, scale, 1f);

                // Fade out at the end
                if (t > 0.7f)
                {
                    float fadeT = (t - 0.7f) / 0.3f;
                    var c = img.color;
                    c.a = 1f - fadeT;
                    img.color = c;
                }

                yield return null;
            }

            if (coinObj != null)
                Destroy(coinObj);
        }

        private Vector2 QuadraticBezier(Vector2 p0, Vector2 p1, Vector2 p2, float t)
        {
            float u = 1f - t;
            return u * u * p0 + 2f * u * t * p1 + t * t * p2;
        }

        private Sprite CreateCoinSprite()
        {
            int size = 128;
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            float half = size / 2f;
            float outerR = size * 0.48f;
            float innerR = size * 0.34f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dx = x - half + 0.5f;
                    float dy = y - half + 0.5f;
                    float d = Mathf.Sqrt(dx * dx + dy * dy);

                    if (d < outerR)
                    {
                        float alpha = Mathf.Clamp01(outerR - d);
                        Color c = new Color(1f, 1f, 1f, alpha);

                        // Inner darker circle
                        if (d < innerR)
                            c = new Color(0.85f, 0.65f, 0.15f, alpha);

                        // Highlight at top-left
                        if (d > innerR - 3f && d < innerR + 3f)
                            c = Color.white;

                        pixels[y * size + x] = c;
                    }
                    else
                    {
                        pixels[y * size + x] = new Color(1f, 1f, 1f, 0f);
                    }
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}