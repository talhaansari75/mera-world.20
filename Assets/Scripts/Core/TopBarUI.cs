using System.Collections;
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
        private RectTransform _coinsRect;

        void Start() { Invoke(nameof(BuildUI), 0.2f); }

        private void BuildUI()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            BuildCanvas();
            BuildBackground();
            BuildCoinsDisplay();
            BuildLevelDisplay();

            if (HomeScreenUI.IsHomeVisible && _canvas != null) _canvas.gameObject.SetActive(false);

            // Hide if home screen is visible
            if (HomeScreenUI.IsHomeVisible && _canvas != null)
                _canvas.gameObject.SetActive(false);

            if (Progress != null)
            {
                Progress.OnCoinsChanged += UpdateCoins;
                Progress.OnLevelChanged += UpdateLevel;
                UpdateCoins(Progress.Coins);
                UpdateLevel(Progress.CurrentLevel);
            }
        }

        public void Hide()
        {
            if (_canvas != null) _canvas.gameObject.SetActive(false);
        }

        public void Show()
        {
            if (_canvas != null) _canvas.gameObject.SetActive(true);
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
            // 3D top bar background
            var bgObj = new GameObject("TopBarBG");
            bgObj.transform.SetParent(_canvas.transform, false);

            var img = bgObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.10f, 0.16f, 0.30f), 256, 20);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var rt = bgObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(0f, 120f);

            // Gold bottom accent line
            var lineObj = new GameObject("GoldLine");
            lineObj.transform.SetParent(bgObj.transform, false);
            var lineImg = lineObj.AddComponent<Image>();
            lineImg.color = new Color(1f, 0.85f, 0.30f);
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
            // 3D coin icon container
            var iconContainer = new GameObject("CoinIconContainer");
            iconContainer.transform.SetParent(_canvas.transform, false);

            var containerImg = iconContainer.AddComponent<Image>();
            containerImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.85f, 0.60f, 0.15f), 128, 40);
            containerImg.type = Image.Type.Sliced;
            containerImg.color = Color.white;
            containerImg.raycastTarget = false;

            var cRt = iconContainer.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0f, 1f);
            cRt.anchorMax = new Vector2(0f, 1f);
            cRt.pivot = new Vector2(0f, 0.5f);
            cRt.anchoredPosition = new Vector2(30f, -60f);
            cRt.sizeDelta = new Vector2(80f, 80f);

            // Inner coin
            var coinObj = new GameObject("Coin");
            coinObj.transform.SetParent(iconContainer.transform, false);
            var coinImg = coinObj.AddComponent<Image>();
            coinImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.25f), 128);
            coinImg.raycastTarget = false;

            var coinRt = coinObj.GetComponent<RectTransform>();
            coinRt.anchorMin = new Vector2(0.5f, 0.5f);
            coinRt.anchorMax = new Vector2(0.5f, 0.5f);
            coinRt.pivot = new Vector2(0.5f, 0.5f);
            coinRt.anchoredPosition = Vector2.zero;
            coinRt.sizeDelta = new Vector2(60f, 60f);

            // Coin text (3D style)
            var textContainer = new GameObject("CoinsContainer");
            textContainer.transform.SetParent(_canvas.transform, false);

            var textBg = textContainer.AddComponent<Image>();
            textBg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.10f, 0.16f, 0.30f), 128, 20);
            textBg.type = Image.Type.Sliced;
            textBg.color = Color.white;
            textBg.raycastTarget = false;

            var tRt = textContainer.GetComponent<RectTransform>();
            tRt.anchorMin = new Vector2(0f, 1f);
            tRt.anchorMax = new Vector2(0f, 1f);
            tRt.pivot = new Vector2(0f, 0.5f);
            tRt.anchoredPosition = new Vector2(120f, -60f);
            tRt.sizeDelta = new Vector2(230f, 70f);

            var textObj = new GameObject("CoinsText");
            textObj.transform.SetParent(textContainer.transform, false);

            _coinsText = textObj.AddComponent<Text>();
            _coinsText.text = "0";
            _coinsText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _coinsText.fontSize = 44;
            _coinsText.fontStyle = FontStyle.Bold;
            _coinsText.color = new Color(1f, 0.90f, 0.55f);
            _coinsText.alignment = TextAnchor.MiddleCenter;
            _coinsText.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            shadow.effectDistance = new Vector2(2f, -2f);

            _coinsRect = textObj.GetComponent<RectTransform>();
            _coinsRect.anchorMin = Vector2.zero;
            _coinsRect.anchorMax = Vector2.one;
            _coinsRect.offsetMin = Vector2.zero;
            _coinsRect.offsetMax = Vector2.zero;
        }

        private void BuildLevelDisplay()
        {
            // 3D level container
            var container = new GameObject("LevelContainer");
            container.transform.SetParent(_canvas.transform, false);

            var containerImg = container.AddComponent<Image>();
            containerImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.70f, 0.50f, 0.15f), 128, 20);
            containerImg.type = Image.Type.Sliced;
            containerImg.color = Color.white;
            containerImg.raycastTarget = false;

            var rt = container.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 0.5f);
            rt.anchoredPosition = new Vector2(-30f, -60f);
            rt.sizeDelta = new Vector2(280f, 70f);

            var textObj = new GameObject("LevelText");
            textObj.transform.SetParent(container.transform, false);

            _levelText = textObj.AddComponent<Text>();
            _levelText.text = "LEVEL 1";
            _levelText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _levelText.fontSize = 38;
            _levelText.fontStyle = FontStyle.Bold;
            _levelText.color = Color.white;
            _levelText.alignment = TextAnchor.MiddleCenter;
            _levelText.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.65f);
            shadow.effectDistance = new Vector2(2f, -2f);

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

        void LateUpdate()
        {
            if (_canvas == null) return;
            if (HomeScreenUI.IsHomeVisible && _canvas.gameObject.activeSelf)
            {
                Debug.Log($"[TopBar] Hiding - HomeVisible={HomeScreenUI.IsHomeVisible}");
                _canvas.gameObject.SetActive(false);
            }
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