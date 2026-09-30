using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace MeraWorld.Core
{
    public class ShopUI : MonoBehaviour
    {
        public static ShopUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Transform _scrollContent;
        private Text _coinsText;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.3f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ShopCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 900;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("Panel");
            _panel.transform.SetParent(_canvas.transform, false);
            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.04f, 0.08f, 0.20f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "SHOP", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            _coinsText = CreateText(_panel.transform, "", new Vector2(0f, 750f), 32,
                Color.white, FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), Hide);

            // Scroll view
            var scrollObj = new GameObject("ScrollView");
            scrollObj.transform.SetParent(_panel.transform, false);
            var scrollRt = scrollObj.AddComponent<RectTransform>();
            scrollRt.anchorMin = new Vector2(0.5f, 0.5f);
            scrollRt.anchorMax = new Vector2(0.5f, 0.5f);
            scrollRt.pivot = new Vector2(0.5f, 0.5f);
            scrollRt.anchoredPosition = new Vector2(0f, -50f);
            scrollRt.sizeDelta = new Vector2(960f, 1350f);

            var scrollRect = scrollObj.AddComponent<ScrollRect>();
            scrollRect.horizontal = false;
            scrollRect.movementType = ScrollRect.MovementType.Clamped;

            var viewportObj = new GameObject("Viewport");
            viewportObj.transform.SetParent(scrollObj.transform, false);
            var vrt = viewportObj.AddComponent<RectTransform>();
            vrt.anchorMin = Vector2.zero;
            vrt.anchorMax = Vector2.one;
            vrt.offsetMin = Vector2.zero;
            vrt.offsetMax = Vector2.zero;
            var vimg = viewportObj.AddComponent<Image>();
            vimg.color = new Color(0f, 0f, 0f, 0.01f);
            viewportObj.AddComponent<Mask>().showMaskGraphic = false;

            var contentObj = new GameObject("Content");
            contentObj.transform.SetParent(viewportObj.transform, false);
            var crt = contentObj.AddComponent<RectTransform>();
            crt.anchorMin = new Vector2(0f, 1f);
            crt.anchorMax = new Vector2(1f, 1f);
            crt.pivot = new Vector2(0.5f, 1f);
            crt.anchoredPosition = Vector2.zero;
            crt.sizeDelta = new Vector2(0f, 0f);

            var vlg = contentObj.AddComponent<VerticalLayoutGroup>();
            vlg.childAlignment = TextAnchor.UpperCenter;
            vlg.spacing = 20f;
            vlg.padding = new RectOffset(20, 20, 20, 20);
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;
            vlg.childControlWidth = true;
            vlg.childControlHeight = true;

            var csf = contentObj.AddComponent<ContentSizeFitter>();
            csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            _scrollContent = contentObj.transform;
            scrollRect.viewport = vrt;
            scrollRect.content = crt;

            _panel.SetActive(false);
        }

        public void Show()
        {
            RefreshUI();
            _panel.SetActive(true);
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private void RefreshUI()
        {
            int coins = PlayerProgressManager.Instance != null ? PlayerProgressManager.Instance.Coins : 0;
            if (_coinsText != null) _coinsText.text = $"{coins} coins";

            // Clear old
            for (int i = _scrollContent.childCount - 1; i >= 0; i--)
                DestroyImmediate(_scrollContent.GetChild(i).gameObject);

            // Build list
            var items = ShopManager.GetShopItems();
            foreach (var item in items)
                CreateShopRow(item);
        }

        private void CreateShopRow(ShopManager.ShopItem item)
        {
            var row = new GameObject($"Item_{item.Id}");
            row.transform.SetParent(_scrollContent, false);
            var rt = row.AddComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 180f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 180f;
            le.preferredHeight = 180f;

            var bgImg = row.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.14f, 0.20f, 0.35f), 256, 30);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;

            // Icon (colored square)
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(row.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.sprite = UISpriteFactory.Create3DSphereSprite(item.Color, 128);
            iconImg.raycastTarget = false;
            var irt = iconObj.GetComponent<RectTransform>();
            irt.anchorMin = new Vector2(0f, 0.5f);
            irt.anchorMax = new Vector2(0f, 0.5f);
            irt.pivot = new Vector2(0f, 0.5f);
            irt.anchoredPosition = new Vector2(20f, 0f);
            irt.sizeDelta = new Vector2(100f, 100f);

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(row.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = item.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 34;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 0.5f);
            trt.anchorMax = new Vector2(0.6f, 1f);
            trt.pivot = new Vector2(0f, 1f);
            trt.anchoredPosition = new Vector2(140f, -20f);
            trt.sizeDelta = new Vector2(0f, 50f);

            // Description
            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(row.transform, false);
            var descTxt = descObj.AddComponent<Text>();
            descTxt.text = item.Description;
            descTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            descTxt.fontSize = 22;
            descTxt.color = new Color(0.80f, 0.85f, 1f);
            descTxt.alignment = TextAnchor.UpperLeft;
            descTxt.raycastTarget = false;
            var drt = descObj.GetComponent<RectTransform>();
            drt.anchorMin = new Vector2(0f, 0f);
            drt.anchorMax = new Vector2(0.6f, 0.5f);
            drt.pivot = new Vector2(0f, 0f);
            drt.anchoredPosition = new Vector2(140f, 20f);
            drt.sizeDelta = new Vector2(0f, 40f);

            // Buy button
            var btnObj = new GameObject("BuyBtn");
            btnObj.transform.SetParent(row.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.25f, 0.65f, 0.35f), 128, 30);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            string id = item.Id;
            btn.onClick.AddListener(() => OnBuyClicked(id));

            var brt = btnObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.65f, 0.15f);
            brt.anchorMax = new Vector2(1f, 0.85f);
            brt.offsetMin = new Vector2(0f, 0f);
            brt.offsetMax = new Vector2(-20f, 0f);

            // Buy label
            var bTxtObj = new GameObject("Label");
            bTxtObj.transform.SetParent(btnObj.transform, false);
            var bTxt = bTxtObj.AddComponent<Text>();
            bTxt.text = $"{item.Price}\nCOINS";
            bTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            bTxt.fontSize = 26;
            bTxt.fontStyle = FontStyle.Bold;
            bTxt.color = Color.white;
            bTxt.alignment = TextAnchor.MiddleCenter;
            bTxt.raycastTarget = false;
            var btRt = bTxtObj.GetComponent<RectTransform>();
            btRt.anchorMin = Vector2.zero;
            btRt.anchorMax = Vector2.one;
            btRt.offsetMin = Vector2.zero;
            btRt.offsetMax = Vector2.zero;
        }

        private void OnBuyClicked(string itemId)
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            bool ok = ShopManager.TryPurchase(itemId);
            if (ok) RefreshUI();
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
            rt.sizeDelta = new Vector2(900f, 100f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 128, 30);
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
            var t = new GameObject("Label");
            t.transform.SetParent(obj.transform, false);
            var txt = t.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = t.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}