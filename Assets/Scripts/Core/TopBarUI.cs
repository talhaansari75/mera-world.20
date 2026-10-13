using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace MeraWorld.Core
{
    public class TopBarUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        [Header("Premium TMP Font (auto-loaded)")]
        public TMP_FontAsset PremiumFont;

        private Canvas _canvas;
        private TextMeshProUGUI _coinsText;
        private TextMeshProUGUI _levelText;
        private RectTransform _coinsRect;

        void Start() { Invoke(nameof(BuildUI), 0.2f); }

        private void BuildUI()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            // Load premium font
            if (PremiumFont == null)
                PremiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");

            if (PremiumFont == null)
            {
                Debug.LogWarning("[TopBar] Poppins-Bold SDF not found in Resources/Fonts/. Using TMP default.");
                PremiumFont = TMP_Settings.defaultFontAsset;
            }
            else
            {
                Debug.Log($"[TopBar] Premium TMP font loaded: {PremiumFont.name}");
            }

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
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.12f, 0.06f, 0.22f), 256, 20);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var rt = bgObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(0f, 120f);

            var lineObj = new GameObject("GoldLine");
            lineObj.transform.SetParent(bgObj.transform, false);
            var lineImg = lineObj.AddComponent<Image>();
            lineImg.color = new Color(1f, 0.80f, 0.20f);
            lineImg.raycastTarget = false;
            var lineRt = lineObj.GetComponent<RectTransform>();
            lineRt.anchorMin = new Vector2(0f, 0f);
            lineRt.anchorMax = new Vector2(1f, 0f);
            lineRt.pivot = new Vector2(0.5f, 0f);
            lineRt.anchoredPosition = Vector2.zero;
            lineRt.sizeDelta = new Vector2(0f, 5f);
        }

        private void BuildCoinsDisplay()
        {
            var iconContainer = new GameObject("CoinIconContainer");
            iconContainer.transform.SetParent(_canvas.transform, false);

            var containerImg = iconContainer.AddComponent<Image>();
            containerImg.sprite = null;
            containerImg.color = new Color(0f, 0f, 0f, 0f);
            containerImg.raycastTarget = false;

            var cRt = iconContainer.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0f, 1f);
            cRt.anchorMax = new Vector2(0f, 1f);
            cRt.pivot = new Vector2(0f, 0.5f);
            cRt.anchoredPosition = new Vector2(50f, -70f);
            cRt.sizeDelta = new Vector2(140f, 140f);

            var coinObj = new GameObject("Coin");
            coinObj.transform.SetParent(iconContainer.transform, false);
            var coinImg = coinObj.AddComponent<Image>();

            Sprite premiumCoin = Resources.Load<Sprite>("UI/Premium/coin_gold");
            if (premiumCoin != null)
            {
                coinImg.sprite = premiumCoin;
                coinImg.color = new Color(2.0f, 1.8f, 1.2f, 1f);
                Debug.Log("[TopBar] Premium coin loaded!");
            }
            else
            {
                coinImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.25f), 128);
                coinImg.color = new Color(2.0f, 1.8f, 1.2f, 1f);
            }
            coinImg.raycastTarget = false;

            var coinRt = coinObj.GetComponent<RectTransform>();
            coinRt.anchorMin = new Vector2(0.5f, 0.5f);
            coinRt.anchorMax = new Vector2(0.5f, 0.5f);
            coinRt.pivot = new Vector2(0.5f, 0.5f);
            coinRt.anchoredPosition = Vector2.zero;
            coinRt.sizeDelta = new Vector2(120f, 120f);

            var textContainer = new GameObject("CoinsContainer");
            textContainer.transform.SetParent(_canvas.transform, false);

            var textBg = textContainer.AddComponent<Image>();
            textBg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.18f, 0.10f, 0.32f), 128, 20);
            textBg.type = Image.Type.Sliced;
            textBg.color = Color.white;
            textBg.raycastTarget = false;

            var tRt = textContainer.GetComponent<RectTransform>();
            tRt.anchorMin = new Vector2(0f, 1f);
            tRt.anchorMax = new Vector2(0f, 1f);
            tRt.pivot = new Vector2(0f, 0.5f);
            tRt.anchoredPosition = new Vector2(120f, -60f);
            tRt.sizeDelta = new Vector2(230f, 70f);

            // ===== TMP COINS TEXT =====
            var textObj = new GameObject("CoinsText");
            textObj.transform.SetParent(textContainer.transform, false);

            _coinsText = textObj.AddComponent<TextMeshProUGUI>();
            _coinsText.text = "0";
            if (PremiumFont != null) _coinsText.font = PremiumFont;
            _coinsText.fontSize = 52;
            _coinsText.fontStyle = FontStyles.Bold;
            _coinsText.color = new Color(1f, 0.92f, 0.55f);
            _coinsText.alignment = TextAlignmentOptions.Center;
            _coinsText.raycastTarget = false;
            _coinsText.textWrappingMode = TMPro.TextWrappingModes.NoWrap;

            // Outline (TMP built-in — no Shadow component needed!)
            _coinsText.outlineWidth = 0.18f;
            _coinsText.outlineColor = new Color32(60, 20, 0, 255);

            _coinsRect = textObj.GetComponent<RectTransform>();
            _coinsRect.anchorMin = Vector2.zero;
            _coinsRect.anchorMax = Vector2.one;
            _coinsRect.offsetMin = Vector2.zero;
            _coinsRect.offsetMax = Vector2.zero;
        }

        private void BuildLevelDisplay()
        {
            var container = new GameObject("LevelContainer");
            container.transform.SetParent(_canvas.transform, false);

            var containerImg = container.AddComponent<Image>();
            containerImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.45f, 0.25f, 0.70f), 128, 20);
            containerImg.type = Image.Type.Sliced;
            containerImg.color = Color.white;
            containerImg.raycastTarget = false;

            var rt = container.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 0.5f);
            rt.anchoredPosition = new Vector2(-30f, -60f);
            rt.sizeDelta = new Vector2(280f, 70f);

            // ===== TMP LEVEL TEXT =====
            var textObj = new GameObject("LevelText");
            textObj.transform.SetParent(container.transform, false);

            _levelText = textObj.AddComponent<TextMeshProUGUI>();
            _levelText.text = "LEVEL 1";
            if (PremiumFont != null) _levelText.font = PremiumFont;
            _levelText.fontSize = 46;
            _levelText.fontStyle = FontStyles.Bold;
            _levelText.alignment = TextAlignmentOptions.Center;
            _levelText.raycastTarget = false;
            _levelText.textWrappingMode = TMPro.TextWrappingModes.NoWrap;

            // ===== GOLD GRADIENT — top bright, bottom darker =====
            _levelText.enableVertexGradient = true;
            _levelText.colorGradient = new VertexGradient(
                new Color(1.0f, 0.98f, 0.60f),   // Top-left: bright gold
                new Color(1.0f, 0.98f, 0.60f),   // Top-right: bright gold
                new Color(0.90f, 0.55f, 0.10f),  // Bottom-left: darker gold
                new Color(0.90f, 0.55f, 0.10f)   // Bottom-right: darker gold
            );

            // Outline for 3D depth
            _levelText.outlineWidth = 0.22f;
            _levelText.outlineColor = new Color32(70, 25, 0, 255);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void UpdateCoins(int amount)
        {
            if (_coinsText == null) return;
            _coinsText.text = amount.ToString();
            StopAllCoroutines();
            StartCoroutine(PunchCoins());
        }

        private IEnumerator PunchCoins()
        {
            float duration = 0.25f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float scale = 1f + Mathf.Sin(t * Mathf.PI) * 0.35f;
                _coinsRect.localScale = new Vector3(scale, scale, 1f);
                yield return null;
            }
            _coinsRect.localScale = Vector3.one;
        }

        private void UpdateLevel(int level)
        {
            if (_levelText != null)
                _levelText.text = $"LEVEL {level}";
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