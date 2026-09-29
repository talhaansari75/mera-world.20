using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ParticleTrailUI : MonoBehaviour
    {
        private Canvas _canvas;
        private Sprite _circleSprite;
        private float _lastSpawnTime = 0f;

        void Start()
        {
            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            _circleSprite = CreateCircleSprite(16);
            BuildCanvas();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("TrailCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 310;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        void Update()
        {
            if (!Input.GetMouseButton(0)) return;
            if (Time.unscaledTime - _lastSpawnTime < 0.04f) return;

            _lastSpawnTime = Time.unscaledTime;
            SpawnTrailParticle(Input.mousePosition);
        }

        private void SpawnTrailParticle(Vector3 screenPos)
        {
            if (_canvas == null) return;

            var p = new GameObject("Trail");
            p.transform.SetParent(_canvas.transform, false);

            var img = p.AddComponent<Image>();
            img.sprite = _circleSprite;
            img.color = new Color(1f, 0.85f, 0.30f, 0.65f);
            img.raycastTarget = false;

            var rt = p.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.zero;
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(screenPos.x, screenPos.y);
            rt.sizeDelta = new Vector2(20f, 20f);

            StartCoroutine(FadeParticle(img, rt));
        }

        private IEnumerator FadeParticle(Image img, RectTransform rt)
        {
            float duration = 0.5f;
            float elapsed = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;

                var c = img.color;
                c.a = 0.65f * (1f - t);
                img.color = c;

                float scale = 1f - t * 0.5f;
                rt.localScale = new Vector3(scale, scale, 1f);

                yield return null;
            }

            if (img != null) Destroy(img.gameObject);
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