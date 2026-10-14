using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ShopUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _panel;
        private Text _coinsText;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;

            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ShopCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 720;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private void BuildPanel()
        {
            _panel = new GameObject("ShopPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "SHOP", new Vector2(0f, 800f), 80,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            _coinsText = CreateText(_panel.transform, "0 coins", new Vector2(0f, 700f), 40,
                new Color(0.85f, 0.90f, 1f), FontStyle.Normal);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 800f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            CreateShopItem(_panel.transform, "10 HINTS", "500 coins", 500, 500f, OnBuyHints10);
            CreateShopItem(_panel.transform, "50 HINTS", "2000 coins", 2000, 300f, OnBuyHints50);
            CreateShopItem(_panel.transform, "100 HINTS", "3500 coins", 3500, 100f, OnBuyHints100);
            CreateShopItem(_panel.transform, "REMOVE ADS", "5000 coins", 5000, -100f, OnBuyRemoveAds);
            CreateShopItem(_panel.transform, "GOLDEN THEME", "10000 coins", 10000, -300f, OnBuyGoldenTheme);

            _panel.SetActive(false);
        }

        private void CreateShopItem(Transform parent, string name, string priceLabel, int price, float yPos, UnityEngine.Events.UnityAction onBuy)
        {
            var itemObj = new GameObject($"Item_{name}");
            itemObj.transform.SetParent(parent, false);

            var bg = itemObj.AddComponent<Image>();
            bg.color = new Color(0.15f, 0.20f, 0.35f);

            var rt = itemObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, yPos);
            rt.sizeDelta = new Vector2(900f, 150f);

            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(itemObj.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.color = new Color(1f, 0.85f, 0.30f);
            iconImg.raycastTarget = false;
            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0f, 0.5f);
            iconRt.anchoredPosition = new Vector2(25f, 0f);
            iconRt.sizeDelta = new Vector2(100f, 100f);

            var nameObj = new GameObject("Name");
            nameObj.transform.SetParent(itemObj.transform, false);
            var nameTxt = nameObj.AddComponent<Text>();
            nameTxt.text = name;
            nameTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            nameTxt.fontSize = 40;
            nameTxt.fontStyle = FontStyle.Bold;
            nameTxt.color = Color.white;
            nameTxt.alignment = TextAnchor.MiddleLeft;
            nameTxt.raycastTarget = false;
            var nameRt = nameObj.GetComponent<RectTransform>();
            nameRt.anchorMin = new Vector2(0f, 0.5f);
            nameRt.anchorMax = new Vector2(1f, 1f);
            nameRt.pivot = new Vector2(0f, 0.5f);
            nameRt.anchoredPosition = new Vector2(150f, 0f);
            nameRt.sizeDelta = new Vector2(-400f, 80f);

            var priceObj = new GameObject("Price");
            priceObj.transform.SetParent(itemObj.transform, false);
            var priceTxt = priceObj.AddComponent<Text>();
            priceTxt.text = priceLabel;
            priceTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            priceTxt.fontSize = 28;
            priceTxt.color = new Color(1f, 0.85f, 0.30f);
            priceTxt.alignment = TextAnchor.MiddleLeft;
            priceTxt.raycastTarget = false;
            var priceRt = priceObj.GetComponent<RectTransform>();
            priceRt.anchorMin = new Vector2(0f, 0f);
            priceRt.anchorMax = new Vector2(1f, 0.5f);
            priceRt.pivot = new Vector2(0f, 0.5f);
            priceRt.anchoredPosition = new Vector2(150f, 0f);
            priceRt.sizeDelta = new Vector2(-400f, 60f);

            var btnObj = new GameObject("BuyBtn");
            btnObj.transform.SetParent(itemObj.transform, false);

            var btnImg = btnObj.AddComponent<Image>();
            btnImg.color = new Color(0.25f, 0.70f, 0.35f);

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(() =>
            {
                if (Progress != null && Progress.SpendCoins(price))
                {
                    if (Sound != null) Sound.PlayCoinCollect();
                    onBuy?.Invoke();
                    UpdateCoinsDisplay();
                }
                else
                {
                    if (Sound != null) Sound.PlayWordInvalid();
                    Debug.Log("[Shop] Not enough coins");
                }
            });

            var btnRt = btnObj.GetComponent<RectTransform>();
            btnRt.anchorMin = new Vector2(1f, 0.5f);
            btnRt.anchorMax = new Vector2(1f, 0.5f);
            btnRt.pivot = new Vector2(1f, 0.5f);
            btnRt.anchoredPosition = new Vector2(-25f, 0f);
            btnRt.sizeDelta = new Vector2(160f, 100f);

            var btnLabelObj = new GameObject("Label");
            btnLabelObj.transform.SetParent(btnObj.transform, false);
            var btnLabel = btnLabelObj.AddComponent<Text>();
            btnLabel.text = "BUY";
            btnLabel.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            btnLabel.fontSize = 32;
            btnLabel.fontStyle = FontStyle.Bold;
            btnLabel.color = Color.white;
            btnLabel.alignment = TextAnchor.MiddleCenter;
            btnLabel.raycastTarget = false;
            var blRt = btnLabelObj.GetComponent<RectTransform>();
            blRt.anchorMin = Vector2.zero;
            blRt.anchorMax = Vector2.one;
            blRt.offsetMin = Vector2.zero;
            blRt.offsetMax = Vector2.zero;
        }

        private void OnBuyHints10()
        {
            int hints = PlayerPrefs.GetInt("PlayerHints", 0);
            PlayerPrefs.SetInt("PlayerHints", hints + 10);
            PlayerPrefs.Save();
            Debug.Log("[Shop] +10 hints");
        }

        private void OnBuyHints50()
        {
            int hints = PlayerPrefs.GetInt("PlayerHints", 0);
            PlayerPrefs.SetInt("PlayerHints", hints + 50);
            PlayerPrefs.Save();
            Debug.Log("[Shop] +50 hints");
        }

        private void OnBuyHints100()
        {
            int hints = PlayerPrefs.GetInt("PlayerHints", 0);
            PlayerPrefs.SetInt("PlayerHints", hints + 100);
            PlayerPrefs.Save();
            Debug.Log("[Shop] +100 hints");
        }

        private void OnBuyRemoveAds()
        {
            PlayerPrefs.SetInt("RemoveAds", 1);
            PlayerPrefs.Save();
            Debug.Log("[Shop] Ads removed");

            if (NoAdsConfettiUI.Instance != null)
                NoAdsConfettiUI.Instance.Celebrate();
        }

        private void OnBuyGoldenTheme()
        {
            PlayerPrefs.SetInt("GoldenTheme", 1);
            PlayerPrefs.Save();
            Debug.Log("[Shop] Golden theme unlocked");
        }

        private void UpdateCoinsDisplay()
        {
            if (_coinsText != null && Progress != null)
                _coinsText.text = $"{Progress.Coins} coins";
        }

        public void Show()
        {
            UpdateCoinsDisplay();
            if (_panel != null) _panel.SetActive(true);
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
        }

        private void OnBack()
        {
            Hide();
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = style;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.color = color;
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 80f);
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}