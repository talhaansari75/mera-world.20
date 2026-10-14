using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class CoinRainUI : MonoBehaviour
    {
        public static CoinRainUI Instance { get; private set; }

        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private Sprite _coinSprite;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            Invoke(nameof(Setup), 0.5f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            _coinSprite = CreateCoinSprite();
            BuildCanvas();

            if (SelectionManager != null)
                SelectionManager.OnLevelComplete += OnLevelComplete;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("CoinRainCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 230;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void OnLevelComplete()
        {
            StartCoroutine(SpawnCoinRain(30));
        }

        private IEnumerator SpawnCoinRain(int count)
        {
            for (int i = 0; i < count; i++)
            {
                StartCoroutine(FallCoin());
                yield return new WaitForSecondsRealtime(0.08f);
            }
        }

        private IEnumerator FallCoin()
        {
            var coinObj = new GameObject("Coin");
            coinObj.transform.SetParent(_canvas.transform, false);

            var img = coinObj.AddComponent<Image>();
            img.sprite = _coinSprite;
            img.color = Color.white;
            img.raycastTarget = false;

            var rt = coinObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            float xOffset = Random.Range(-450f, 450f);
            rt.anchoredPosition = new Vector2(xOffset, 100f);
            float size = Random.Range(40f, 80f);
            rt.sizeDelta = new Vector2(size, size);

            float duration = Random.Range(1.8f, 2.6f);
            float elapsed = 0f;
            float vx = Random.Range(-50f, 50f);
            float vy = Random.Range(-800f, -1200f);
            float gravity = -600f;
            float rotSpeed = Random.Range(-360f, 360f);

            Vector2 pos = rt.anchoredPosition;
            Vector2 vel = new Vector2(vx, vy);
            float rotation = 0f;

            while (elapsed < duration)
            {
                float dt = Time.unscaledDeltaTime;
                elapsed += dt;

                vel.y += gravity * dt;
                pos += vel * dt;
                rotation += rotSpeed * dt;

                rt.anchoredPosition = pos;
                rt.localRotation = Quaternion.Euler(0f, 0f, rotation);

                // Fade out near the end
                if (elapsed > duration - 0.5f)
                {
                    float fadeT = (elapsed - (duration - 0.5f)) / 0.5f;
                    var c = img.color;
                    c.a = 1f - fadeT;
                    img.color = c;
                }

                yield return null;
            }

            if (coinObj != null) Destroy(coinObj);
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
                        Color c = new Color(1f, 0.82f, 0.20f, alpha);

                        if (d < innerR)
                            c = new Color(0.95f, 0.70f, 0.15f, alpha);

                        if (d > innerR - 3f && d < innerR + 3f)
                            c = new Color(1f, 0.95f, 0.55f, alpha);

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
                SelectionManager.OnLevelComplete -= OnLevelComplete;
        }
    }
}