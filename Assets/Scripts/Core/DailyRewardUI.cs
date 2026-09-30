using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class DailyRewardUI : MonoBehaviour
    {
        public static DailyRewardUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Text _streakText;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();

            // Auto-show if can claim
            if (DailyRewardManager.CanClaim())
                Invoke(nameof(Show), 0.5f);
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("DailyRewardCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 2000;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            // Dark overlay
            _panel = new GameObject("Panel");
            _panel.transform.SetParent(_canvas.transform, false);
            var overlay = _panel.AddComponent<Image>();
            overlay.color = new Color(0f, 0f, 0f, 0.85f);

            var ort = _panel.GetComponent<RectTransform>();
            ort.anchorMin = Vector2.zero;
            ort.anchorMax = Vector2.one;
            ort.offsetMin = Vector2.zero;
            ort.offsetMax = Vector2.zero;

            // Card
            var card = new GameObject("Card");
            card.transform.SetParent(_panel.transform, false);
            var cardImg = card.AddComponent<Image>();
            cardImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.12f, 0.18f, 0.32f), 256, 40);
            cardImg.type = Image.Type.Sliced;
            cardImg.color = Color.white;
            var crt = card.GetComponent<RectTransform>();
            crt.anchorMin = new Vector2(0.5f, 0.5f);
            crt.anchorMax = new Vector2(0.5f, 0.5f);
            crt.pivot = new Vector2(0.5f, 0.5f);
            crt.anchoredPosition = Vector2.zero;
            crt.sizeDelta = new Vector2(920f, 1300f);

            CreateText(card.transform, "DAILY REWARD", new Vector2(0f, 500f), 60,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            _streakText = CreateText(card.transform, "", new Vector2(0f, 420f), 28,
                new Color(0.80f, 0.85f, 1f), FontStyle.Normal);
            _streakText.text = $"Current Streak: {DailyRewardManager.CurrentStreak} days";

            // 7 day cells in 2 rows
            for (int i = 0; i < 7; i++)
            {
                float col = i % 4;
                float row = i / 4;
                float x = -330f + col * 220f;
                float y = 220f - row * 240f;

                CreateDayCell(card.transform, i, new Vector2(x, y));
            }

            // Claim button
            var claimBtn = CreateButton(card.transform, "CLAIM", new Vector2(0f, -400f),
                new Color(0.25f, 0.65f, 0.35f), OnClaimClicked);

            if (!DailyRewardManager.CanClaim())
            {
                claimBtn.interactable = false;
                var img = claimBtn.GetComponent<Image>();
                if (img != null)
                {
                    img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.30f, 0.30f, 0.35f), 256, 40);
                    img.type = Image.Type.Sliced;
                }
            }

            CreateButton(card.transform, "CLOSE", new Vector2(0f, -540f),
                new Color(0.5f, 0.5f, 0.55f), Hide);

            _panel.SetActive(false);
        }

        private void CreateDayCell(Transform parent, int dayIndex, Vector2 pos)
        {
            bool isToday = (dayIndex == DailyRewardManager.CurrentDayIndex);
            bool isPast = (dayIndex < DailyRewardManager.CurrentDayIndex);

            var cell = new GameObject($"Day_{dayIndex}");
            cell.transform.SetParent(parent, false);

            var bgImg = cell.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(
                isPast ? new Color(0.20f, 0.45f, 0.25f) :
                isToday ? new Color(0.85f, 0.60f, 0.20f) :
                new Color(0.20f, 0.25f, 0.40f),
                128, 20);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;

            var rt = cell.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(200f, 220f);

            var reward = DailyRewardManager.GetRewardForDay(dayIndex);

            // Day label
            CreateText(cell.transform, $"DAY {dayIndex + 1}", new Vector2(0f, 80f), 24,
                Color.white, FontStyle.Bold);

            // Coin icon
            var coinObj = new GameObject("Coin");
            coinObj.transform.SetParent(cell.transform, false);
            var coinImg = coinObj.AddComponent<Image>();
            coinImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.20f), 64);
            coinImg.raycastTarget = false;
            var crt = coinObj.GetComponent<RectTransform>();
            crt.anchorMin = new Vector2(0.5f, 0.5f);
            crt.anchorMax = new Vector2(0.5f, 0.5f);
            crt.pivot = new Vector2(0.5f, 0.5f);
            crt.anchoredPosition = new Vector2(-30f, 0f);
            crt.sizeDelta = new Vector2(50f, 50f);

            // Amount
            CreateText(cell.transform, reward.Coins.ToString(), new Vector2(25f, 0f), 26,
                new Color(1f, 0.95f, 0.75f), FontStyle.Bold);

            // Claimed checkmark
            if (isPast)
            {
                CreateText(cell.transform, "✓", new Vector2(0f, -70f), 40,
                    new Color(0.50f, 1f, 0.50f), FontStyle.Bold);
            }
            else if (isToday)
            {
                CreateText(cell.transform, "TODAY", new Vector2(0f, -70f), 20,
                    new Color(1f, 1f, 0.50f), FontStyle.Bold);
            }
        }

        private void OnClaimClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();

            if (DailyRewardManager.ClaimReward())
            {
                if (SoundManager.Instance != null) SoundManager.Instance.PlayCoinCollect();

                // Rebuild panel
                if (_panel != null) _panel.SetActive(false);
                foreach (Transform child in _panel.transform)
                    Destroy(child.gameObject);
                BuildPanel();
                Show();
            }
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size,
            Color color, FontStyle style)
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
            rt.sizeDelta = new Vector2(300f, 40f);
            return txt;
        }

        private Button CreateButton(Transform parent, string label, Vector2 pos, Color color,
            UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(600f, 100f);

            var t = new GameObject("Label");
            t.transform.SetParent(obj.transform, false);
            var txt = t.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 40;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = t.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            return btn;
        }
    }
}