using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AdRewardTiersUI : MonoBehaviour
    {
        public static AdRewardTiersUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;

        private class Tier
        {
            public string Title;
            public int Reward;
            public Color Color;
        }

        private readonly Tier[] _tiers = new Tier[]
        {
            new Tier { Title = "QUICK",  Reward = 50,   Color = new Color(0.30f, 0.75f, 0.40f) },
            new Tier { Title = "BONUS",  Reward = 150,  Color = new Color(0.30f, 0.60f, 0.85f) },
            new Tier { Title = "MEGA",   Reward = 500,  Color = new Color(0.90f, 0.60f, 0.25f) },
            new Tier { Title = "LEGEND", Reward = 1000, Color = new Color(0.65f, 0.40f, 0.85f) },
        };

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AdRewardCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 940;

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

            CreateText("FREE COINS", new Vector2(0f, 830f), 60, new Color(1f, 0.85f, 0.30f));
            CreateText("Watch a short ad to earn coins!", new Vector2(0f, 740f), 26, new Color(0.8f, 0.85f, 1f));

            CreateSmallButton("◀ BACK", new Vector2(-380f, 830f), new Color(0.5f, 0.5f, 0.55f), Hide);

            // Tiers
            float y = 500f;
            foreach (var tier in _tiers)
            {
                CreateTierRow(tier, y);
                y -= 200f;
            }

            _panel.SetActive(false);
        }

        private void CreateTierRow(Tier tier, float y)
        {
            var row = new GameObject($"Tier_{tier.Title}");
            row.transform.SetParent(_panel.transform, false);
            var rt = row.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(900f, 160f);

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(tier.Color, 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(row.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = tier.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 34;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 0.5f);
            trt.anchorMax = new Vector2(0.5f, 1f);
            trt.pivot = new Vector2(0f, 1f);
            trt.anchoredPosition = new Vector2(40f, -20f);
            trt.sizeDelta = new Vector2(0f, 50f);

            // Reward
            var rewObj = new GameObject("Reward");
            rewObj.transform.SetParent(row.transform, false);
            var rewTxt = rewObj.AddComponent<Text>();
            rewTxt.text = $"+{tier.Reward} COINS";
            rewTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            rewTxt.fontSize = 24;
            rewTxt.fontStyle = FontStyle.Bold;
            rewTxt.color = new Color(0.95f, 0.95f, 1f);
            rewTxt.alignment = TextAnchor.UpperLeft;
            rewTxt.raycastTarget = false;
            var rrt = rewObj.GetComponent<RectTransform>();
            rrt.anchorMin = new Vector2(0f, 0f);
            rrt.anchorMax = new Vector2(0.5f, 0.5f);
            rrt.pivot = new Vector2(0f, 0f);
            rrt.anchoredPosition = new Vector2(40f, 20f);
            rrt.sizeDelta = new Vector2(0f, 40f);

            // Watch button
            var btnObj = new GameObject("WatchBtn");
            btnObj.transform.SetParent(row.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.25f, 0.65f, 0.35f), 128, 30);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            int reward = tier.Reward;
            string id = tier.Title;
            btn.onClick.AddListener(() => OnWatchClicked(id, reward));

            var brt = btnObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.6f, 0.2f);
            brt.anchorMax = new Vector2(0.95f, 0.8f);
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            var bTxt = new GameObject("Label");
            bTxt.transform.SetParent(btnObj.transform, false);
            var txt = bTxt.AddComponent<Text>();
            txt.text = "WATCH";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 30;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var txtRt = bTxt.GetComponent<RectTransform>();
            txtRt.anchorMin = Vector2.zero;
            txtRt.anchorMax = Vector2.one;
            txtRt.offsetMin = Vector2.zero;
            txtRt.offsetMax = Vector2.zero;
        }

        private void OnWatchClicked(string tierId, int reward)
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();

            if (AdsManager.Instance == null)
            {
                Debug.LogError("[AdReward] AdsManager missing!");
                return;
            }

            AdsManager.Instance.ShowRewarded(() =>
            {
                // Reward granted
                if (PlayerProgressManager.Instance != null)
                    PlayerProgressManager.Instance.AddCoins(reward);

                if (StatisticsManager.Instance != null)
                    StatisticsManager.Instance.AddCoinsEarned(reward);

                Debug.Log($"[AdReward] Granted {reward} coins for {tierId}");
                if (SoundManager.Instance != null) SoundManager.Instance.PlayCoinCollect();
            });
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private Text CreateText(string content, Vector2 pos, int size, Color color)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(_panel.transform, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = FontStyle.Bold;
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

        private void CreateSmallButton(string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(_panel.transform, false);
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