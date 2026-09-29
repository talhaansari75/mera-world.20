using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ConfettiEffect : MonoBehaviour
    {
        public static ConfettiEffect Instance { get; private set; }

        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private Sprite _squareSprite;
        private Sprite _circleSprite;

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
            Invoke(nameof(Setup), 0.4f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            _squareSprite = CreateSquareSprite();
            _circleSprite = CreateCircleSprite(32);
            BuildCanvas();

            if (SelectionManager != null)
                SelectionManager.OnLevelComplete += OnLevelComplete;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ConfettiCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 240;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void OnLevelComplete()
        {
            StartCoroutine(SpawnConfettiBurst(50));
        }

        private IEnumerator SpawnConfettiBurst(int count)
        {
            Color[] colors = new Color[]
            {
                new Color(1f, 0.85f, 0.30f),
                new Color(0.35f, 0.85f, 0.45f),
                new Color(0.95f, 0.35f, 0.55f),
                new Color(0.30f, 0.65f, 1f),
                new Color(0.85f, 0.55f, 1f),
                new Color(1f, 0.65f, 0.25f),
            };

            for (int i = 0; i < count; i++)
            {
                StartCoroutine(LaunchConfetti(colors[Random.Range(0, colors.Length)]));
                yield return new WaitForSecondsRealtime(0.03f);
            }
        }

        private IEnumerator LaunchConfetti(Color color)
        {
            var piece = new GameObject("Confetti");
            piece.transform.SetParent(_canvas.transform, false);

            var img = piece.AddComponent<Image>();
            img.color = color;
            img.sprite = Random.value > 0.5f ? _squareSprite : _circleSprite;
            img.raycastTarget = false;

            var rt = piece.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 200f);
            float size = Random.Range(20f, 45f);
            rt.sizeDelta = new Vector2(size, size);

            float vx = Random.Range(-450f, 450f);
            float vy = Random.Range(400f, 900f);
            float gravity = -1600f;
            float rotSpeed = Random.Range(-720f, 720f);
            float duration = Random.Range(2.2f, 3.2f);

            Vector2 pos = new Vector2(0f, 200f);
            Vector2 vel = new Vector2(vx, vy);
            float rotation = 0f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                float dt = Time.unscaledDeltaTime;
                elapsed += dt;

                vel.y += gravity * dt;
                pos += vel * dt;
                rotation += rotSpeed * dt;

                rt.anchoredPosition = pos;
                rt.localRotation = Quaternion.Euler(0f, 0f, rotation);

                // Fade out at the end
                if (elapsed > duration - 0.6f)
                {
                    float fadeT = (elapsed - (duration - 0.6f)) / 0.6f;
                    var c = img.color;
                    c.a = 1f - fadeT;
                    img.color = c;
                }

                yield return null;
            }

            if (piece != null)
                Destroy(piece);
        }

        private Sprite CreateSquareSprite()
        {
            int size = 4;
            var tex = new Texture2D(size, size);
            var pixels = new Color[size * size];
            for (int i = 0; i < pixels.Length; i++) pixels[i] = Color.white;
            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        private Sprite CreateCircleSprite(int size)
        {
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];
            float half = size / 2f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    float dx = x - half + 0.5f;
                    float dy = y - half + 0.5f;
                    float d = Mathf.Sqrt(dx * dx + dy * dy);
                    float alpha = Mathf.Clamp01(half - d);
                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
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