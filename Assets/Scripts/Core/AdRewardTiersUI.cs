using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AdRewardTiersUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public AdsManager Ads;

        private Canvas _canvas;
        private GameObject _panel;

        private class RewardTier
        {
            public string Title;
            public int Coins;
            public int AdCount;
            public Color Color;
        }

        private static readonly RewardTier[] Tiers =
        {
            new RewardTier { Title = "QUICK", Coins = 50, AdCount = 1, Color = new Color(0.30f, 0.75f, 0.45f) },
            new RewardTier { Title = "BONUS", Coins = 150, AdCount = 1, Color = new Color(0.30f, 0.55f, 0.85f) },
            new RewardTier { Title = "MEGA", Coins = 500, AdCount = 1, Color = new Color(0.85f, 0.55f, 0.25f) },
            new RewardTier { Title = "LEGEND", Coins = 1000, AdCount = 1, Color = new Color(0.75f, 0.35f, 0.85f) },
        };

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Ads == null) Ads = AdsManager.Instance;
            Invoke(nameof(Setup), 1.5f);
        }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AdRewardCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 798;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("AdRewardPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "FREE COINS", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            CreateText(_panel.transform, "Watch a short ad to earn coins!",
                new Vector2(0f, 700f), 30, Color.white, FontStyle.Normal);

            float y = 450f;
            foreach (var tier in Tiers)
            {
                CreateTierCard(tier, y);
                y -= 220f;
            }

            _panel.SetActive(false);
        }

        private void CreateTierCard(RewardTier tier, float y)
        {
            var cardObj = new GameObject($"Tier_{tier.Title}");
            cardObj.transform.SetParent(_panel.transform, false);

            var img = cardObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(tier.Color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = cardObj.AddComponent<Button>();
            btn.onClick.AddListener(() => OnBuyTier(tier));

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(880f, 180f);

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(cardObj.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = tier.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 44;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var shadow = titleObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
            shadow.effectDistance = new Vector2(2f, -2f);
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 0.5f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.pivot = new Vector2(0f, 0.5f);
            trt.anchoredPosition = new Vector2(40f, 0f);
            trt.sizeDelta = new Vector2(-300f, 90f);

            // Reward
            var rewardObj = new GameObject("Reward");
            rewardObj.transform.SetParent(cardObj.transform, false);
            var rewardTxt = rewardObj.AddComponent<Text>();
            rewardTxt.text = $"+{tier.Coins} COINS";
            rewardTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            rewardTxt.fontSize = 32;
            rewardTxt.fontStyle = FontStyle.Bold;
            rewardTxt.color = new Color(1f, 0.92f, 0.55f);
            rewardTxt.alignment = TextAnchor.MiddleLeft;
            rewardTxt.raycastTarget = false;
            var rrt = rewardObj.GetComponent<RectTransform>();
            rrt.anchorMin = new Vector2(0f, 0f);
            rrt.anchorMax = new Vector2(1f, 0.5f);
            rrt.pivot = new Vector2(0f, 0.5f);
            rrt.anchoredPosition = new Vector2(40f, 0f);
            rrt.sizeDelta = new Vector2(-300f, 80f);

            // Watch button
            var watchObj = new GameObject("Watch");
            watchObj.transform.SetParent(cardObj.transform, false);
            var watchImg = watchObj.AddComponent<Image>();
            watchImg.color = new Color(0.25f, 0.75f, 0.35f);
            var wrRt = watchObj.GetComponent<RectTransform>();
            wrRt.anchorMin = new Vector2(1f, 0.5f);
            wrRt.anchorMax = new Vector2(1f, 0.5f);
            wrRt.pivot = new Vector2(1f, 0.5f);
            wrRt.anchoredPosition = new Vector2(-25f, 0f);
            wrRt.sizeDelta = new Vector2(230f, 120f);

            var watchTxtObj = new GameObject("Label");
            watchTxtObj.transform.SetParent(watchObj.transform, false);
            var watchTxt = watchTxtObj.AddComponent<Text>();
            watchTxt.text = "WATCH";
            watchTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            watchTxt.fontSize = 34;
            watchTxt.fontStyle = FontStyle.Bold;
            watchTxt.color = Color.white;
            watchTxt.alignment = TextAnchor.MiddleCenter;
            watchTxt.raycastTarget = false;
            var wtrt = watchTxtObj.GetComponent<RectTransform>();
            wtrt.anchorMin = Vector2.zero;
            wtrt.anchorMax = Vector2.one;
            wtrt.offsetMin = Vector2.zero;
            wtrt.offsetMax = Vector2.zero;
        }

        private void OnBuyTier(RewardTier tier)
        {
            // Grant coins directly (simulating ad watched)
            if (Progress != null) Progress.AddCoins(tier.Coins);

            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayCoinCollect();

            Debug.Log($"[AdReward] Earned {tier.Coins} coins");
            Hide();
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

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