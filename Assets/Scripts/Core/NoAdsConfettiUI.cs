using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class NoAdsConfettiUI : MonoBehaviour
    {
        public static NoAdsConfettiUI Instance { get; private set; }

        private Canvas _canvas;
        private Sprite _squareSprite;
        private Sprite _circleSprite;

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
            _squareSprite = CreateSquareSprite();
            _circleSprite = CreateCircleSprite(32);
            BuildCanvas();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("NoAdsConfettiCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 810;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        public void Celebrate()
        {
            StartCoroutine(SpawnBurst(60));
            StartCoroutine(ShowMessage());
        }

        private IEnumerator ShowMessage()
        {
            var msgObj = new GameObject("NoAdsMessage");
            msgObj.transform.SetParent(_canvas.transform, false);

            var img = msgObj.AddComponent<Image>();
            img.color = new Color(0.10f, 0.55f, 0.30f, 0.98f);

            var rt = msgObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(800f, 250f);

            var txtObj = new GameObject("Text");
            txtObj.transform.SetParent(msgObj.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = "ADS REMOVED!\nEnjoy ad-free gaming";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 50;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            yield return new WaitForSecondsRealtime(4f);

            if (msgObj != null) Destroy(msgObj);
        }

        private IEnumerator SpawnBurst(int count)
        {
            Color[] colors = new Color[]
            {
                new Color(1f, 0.85f, 0.30f),
                new Color(0.35f, 0.85f, 0.45f),
                new Color(0.95f, 0.35f, 0.55f),
                new Color(0.30f, 0.65f, 1f),
            };

            for (int i = 0; i < count; i++)
            {
                StartCoroutine(LaunchParticle(colors[Random.Range(0, colors.Length)]));
                yield return new WaitForSecondsRealtime(0.03f);
            }
        }

        private IEnumerator LaunchParticle(Color color)
        {
            var p = new GameObject("Particle");
            p.transform.SetParent(_canvas.transform, false);

            var img = p.AddComponent<Image>();
            img.color = color;
            img.sprite = Random.value > 0.5f ? _squareSprite : _circleSprite;
            img.raycastTarget = false;

            var rt = p.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            float size = Random.Range(20f, 45f);
            rt.sizeDelta = new Vector2(size, size);

            float vx = Random.Range(-600f, 600f);
            float vy = Random.Range(400f, 1000f);
            float gravity = -1600f;
            float rot = Random.Range(-720f, 720f);
            float duration = Random.Range(2f, 3f);

            Vector2 pos = Vector2.zero;
            Vector2 vel = new Vector2(vx, vy);
            float rotation = 0f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                float dt = Time.unscaledDeltaTime;
                elapsed += dt;
                vel.y += gravity * dt;
                pos += vel * dt;
                rotation += rot * dt;

                rt.anchoredPosition = pos;
                rt.localRotation = Quaternion.Euler(0f, 0f, rotation);

                if (elapsed > duration - 0.5f)
                {
                    float fadeT = (elapsed - (duration - 0.5f)) / 0.5f;
                    var c = img.color; c.a = 1f - fadeT; img.color = c;
                }

                yield return null;
            }

            if (p != null) Destroy(p);
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
    }
}