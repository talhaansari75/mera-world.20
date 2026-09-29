using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class TopBarUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private Text _coinsText;
        private Text _levelText;

        void Start()
        {
            Invoke(nameof(BuildUI), 0.2f);
        }

        private void BuildUI()
        {
            if (Progress == null)
                Progress = PlayerProgressManager.Instance;

            BuildCanvas();
            BuildBackground();
            BuildCoinsDisplay();
            BuildLevelDisplay();

            if (Progress != null)
            {
                Progress.OnCoinsChanged += UpdateCoins;
                Progress.OnLevelChanged += UpdateLevel;

                UpdateCoins(Progress.Coins);
                UpdateLevel(Progress.CurrentLevel);
            }
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("TopBarCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 50;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBackground()
        {
            var bgObj = new GameObject("TopBarBG");
            bgObj.transform.SetParent(_canvas.transform, false);

            var img = bgObj.AddComponent<Image>();
            img.color = new Color(0.05f, 0.10f, 0.20f, 0.85f);

            var rt = bgObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(0f, 110f);
        }

        private void BuildCoinsDisplay()
        {
            // Coin icon (circle)
            var iconObj = new GameObject("CoinIcon");
            iconObj.transform.SetParent(_canvas.transform, false);

            var iconImg = iconObj.AddComponent<Image>();
            iconImg.color = new Color(1f, 0.82f, 0.20f);
            iconImg.sprite = CreateCircleSprite(64);
            iconImg.type = Image.Type.Simple;

            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 1f);
            iconRt.anchorMax = new Vector2(0f, 1f);
            iconRt.pivot = new Vector2(0.5f, 0.5f);
            iconRt.anchoredPosition = new Vector2(80f, -55f);
            iconRt.sizeDelta = new Vector2(60f, 60f);

            // Inner darker circle for depth
            var innerObj = new GameObject("CoinInner");
            innerObj.transform.SetParent(iconObj.transform, false);

            var innerImg = innerObj.AddComponent<Image>();
            innerImg.color = new Color(0.95f, 0.68f, 0.10f);
            innerImg.sprite = CreateCircleSprite(64);

            var innerRt = innerObj.GetComponent<RectTransform>();
            innerRt.anchorMin = new Vector2(0.5f, 0.5f);
            innerRt.anchorMax = new Vector2(0.5f, 0.5f);
            innerRt.pivot = new Vector2(0.5f, 0.5f);
            innerRt.anchoredPosition = Vector2.zero;
            innerRt.sizeDelta = new Vector2(42f, 42f);

            // Coin text
            var textObj = new GameObject("CoinsText");
            textObj.transform.SetParent(_canvas.transform, false);

            _coinsText = textObj.AddComponent<Text>();
            _coinsText.text = "0";
            _coinsText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _coinsText.fontSize = 48;
            _coinsText.fontStyle = FontStyle.Bold;
            _coinsText.color = Color.white;
            _coinsText.alignment = TextAnchor.MiddleLeft;

            var rt = textObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(0f, 1f);
            rt.pivot = new Vector2(0f, 0.5f);
            rt.anchoredPosition = new Vector2(120f, -55f);
            rt.sizeDelta = new Vector2(300f, 80f);
        }

        private void BuildLevelDisplay()
        {
            var textObj = new GameObject("LevelText");
            textObj.transform.SetParent(_canvas.transform, false);

            _levelText = textObj.AddComponent<Text>();
            _levelText.text = "LEVEL 1";
            _levelText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _levelText.fontSize = 44;
            _levelText.fontStyle = FontStyle.Bold;
            _levelText.color = new Color(1f, 0.90f, 0.55f);
            _levelText.alignment = TextAnchor.MiddleRight;

            var rt = textObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 0.5f);
            rt.anchoredPosition = new Vector2(-40f, -55f);
            rt.sizeDelta = new Vector2(400f, 80f);
        }

        private void UpdateCoins(int amount)
        {
            if (_coinsText != null)
                _coinsText.text = amount.ToString();
        }

        private void UpdateLevel(int level)
        {
            if (_levelText != null)
                _levelText.text = $"LEVEL {level}";
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
                    float alpha = Mathf.Clamp01(half - d - 1f);
                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }

        void OnDestroy()
        {
            if (Progress != null)
            {
                Progress.OnCoinsChanged -= UpdateCoins;
                Progress.OnLevelChanged -= UpdateLevel;
            }
        }
    }
}