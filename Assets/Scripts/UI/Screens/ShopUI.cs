using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

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

        // Premium Colors
        private Color _bgTop = new Color(13f/255f, 27f/255f, 42f/255f); // #0D1B2A
        private Color _bgBottom = new Color(27f/255f, 38f/255f, 59f/255f); // #1B263B
        private Color _glassWhite = new Color(1f, 1f, 1f, 0.08f);
        private Color _goldAccent = new Color(1f, 0.82f, 0.40f); // #FFD166

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

            var rt = _panel.AddComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
            rt.pivot = new Vector2(0.5f, 0.5f);

            var bg = _panel.AddComponent<Image>();
            bg.sprite = UISpriteFactory.CreateGradientSprite(_bgTop, _bgBottom, 32, 256);
            bg.type = Image.Type.Simple;
            bg.raycastTarget = true; // Catch all clicks

            CreateText(_panel.transform, "SHOP", new Vector2(0f, 800f), 80, _goldAccent, FontStyle.Bold, true);
            _coinsText = CreateText(_panel.transform, "0 coins", new Vector2(0f, 700f), 40, new Color(0.85f, 0.90f, 1f), FontStyle.Normal, false);
            CreateGlassButton(_panel.transform, "< BACK", new Vector2(-380f, 800f), OnBack);

            CreateShopItem(_panel.transform, "10 HINTS", "500 coins", 500, 450f, OnBuyHints10);
            CreateShopItem(_panel.transform, "50 HINTS", "2000 coins", 2000, 250f, OnBuyHints50);
            CreateShopItem(_panel.transform, "100 HINTS", "3500 coins", 3500, 50f, OnBuyHints100);
            CreateShopItem(_panel.transform, "REMOVE ADS", "5000 coins", 5000, -150f, OnBuyRemoveAds);
            CreateShopItem(_panel.transform, "GOLDEN THEME", "10000 coins", 10000, -350f, OnBuyGoldenTheme);

            _panel.SetActive(false);
        }

        private void CreateShopItem(Transform parent, string name, string priceLabel, int price, float yPos, UnityEngine.Events.UnityAction onBuy)
        {
            var itemObj = new GameObject($"Item_{name}");
            itemObj.transform.SetParent(parent, false);

            var bg = itemObj.AddComponent<Image>();
            bg.sprite = UISpriteFactory.CreateRoundedSprite(Color.white, 128, 24);
            bg.type = Image.Type.Sliced;
            bg.color = new Color(0.1f, 0.15f, 0.25f, 0.85f); // Deep Navy Glass
            bg.raycastTarget = true;

            var outline = itemObj.AddComponent<Outline>();
            outline.effectColor = new Color(1f, 1f, 1f, 0.4f);
            outline.effectDistance = new Vector2(1f, -1f);

            var rt = itemObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, yPos);
            rt.sizeDelta = new Vector2(900f, 150f);

            var btn = itemObj.AddComponent<Button>();
            btn.onClick.AddListener(onBuy);

            CreateText(itemObj.transform, name, new Vector2(-200f, 0f), 40, Color.white, FontStyle.Bold, true);
            CreateText(itemObj.transform, priceLabel, new Vector2(200f, 0f), 36, _goldAccent, FontStyle.Bold, false);
        }

        public void Show()
        {
            if (_panel == null)
            {
                BuildCanvas();
                BuildPanel();
            }

            if (_panel != null)
            {
                if (Progress != null && _coinsText != null)
                    _coinsText.text = Progress.Coins.ToString("N0") + " coins";

                // GHOST CLICK FIX: Disable all buttons BEFORE opening
                foreach (var btn in _panel.GetComponentsInChildren<Button>(true))
                    btn.interactable = false;

                _panel.SetActive(true);

                // Re-enable after 0.5s using Unity's reliable Invoke
                CancelInvoke(nameof(EnableButtons));
                Invoke(nameof(EnableButtons), 0.5f);

                var cg = _panel.GetComponent<CanvasGroup>();
                if (cg == null) cg = _panel.AddComponent<CanvasGroup>();
                cg.alpha = 0f;
                cg.DOFade(1f, 0.25f);
            }
        }

        private void EnableButtons()
        {
            if (_panel != null && _panel.activeInHierarchy)
            {
                foreach (var btn in _panel.GetComponentsInChildren<Button>(true))
                    btn.interactable = true;
            }
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private void OnBack() { 
            Hide(); 
            if (CategoryMenuUI.Instance != null) CategoryMenuUI.Instance.Show("shop");
        }

        private void OnBuyHints10() { BuyItem(500, () => { /* Add hints logic */ }); }
        private void OnBuyHints50() { BuyItem(2000, () => { /* Add hints logic */ }); }
        private void OnBuyHints100() { BuyItem(3500, () => { /* Add hints logic */ }); }
        private void OnBuyRemoveAds() { BuyItem(5000, () => { /* Ads removed */ }); }
        private void OnBuyGoldenTheme() { BuyItem(10000, () => { /* Theme unlock */ }); }

        private void BuyItem(int price, System.Action onSuccess)
        {
            if (Progress == null) return;

            if (Progress.Coins >= price)
            {
                Progress.AddCoins(-price);
                onSuccess?.Invoke();
                Show(); // Refresh UI
                if (Sound != null) Sound.PlayWordFound();
                Debug.Log($"[Shop] Purchased item for {price} coins!");
            }
            else
            {
                Debug.LogWarning("[Shop] Not enough coins!");
                if (Sound != null) Sound.PlayWordInvalid();
            }
        }

        private void CreateGlassButton(Transform parent, string label, Vector2 pos, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.CreateRoundedSprite(_glassWhite, 128, 16);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 80f);

            CreateText(obj.transform, label, Vector2.zero, 30, Color.white, FontStyle.Bold, false);
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style, bool addShadow)
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

            if (addShadow)
            {
                var shadow = obj.AddComponent<Shadow>();
                shadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
                shadow.effectDistance = new Vector2(2f, -2f);
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(600f, 100f);
            return txt;
        }
    }
}