using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ProfileUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public XPManager XP;
        public StatisticsTracker Stats;

        private Canvas _canvas;
        private GameObject _panel;
        private Image _xpFill;
        private Text _xpText;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (XP == null) XP = XPManager.Instance;
            if (Stats == null) Stats = StatisticsTracker.Instance;
            Invoke(nameof(Setup), 1f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();

            if (XP != null)
                XP.OnXPChanged += OnXPChanged;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ProfileCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 735;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("ProfilePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "PROFILE", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Avatar circle
            var avatarObj = new GameObject("Avatar");
            avatarObj.transform.SetParent(_panel.transform, false);
            var avatarImg = avatarObj.AddComponent<Image>();
            avatarImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(0.30f, 0.65f, 0.95f), 256);
            avatarImg.raycastTarget = false;
            var avatarRt = avatarObj.GetComponent<RectTransform>();
            avatarRt.anchorMin = new Vector2(0.5f, 0.5f);
            avatarRt.anchorMax = new Vector2(0.5f, 0.5f);
            avatarRt.pivot = new Vector2(0.5f, 0.5f);
            avatarRt.anchoredPosition = new Vector2(0f, 540f);
            avatarRt.sizeDelta = new Vector2(280f, 280f);

            // Initial
            var initObj = new GameObject("Initial");
            initObj.transform.SetParent(avatarObj.transform, false);
            var initTxt = initObj.AddComponent<Text>();
            initTxt.text = "P";
            initTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            initTxt.fontSize = 140;
            initTxt.fontStyle = FontStyle.Bold;
            initTxt.color = Color.white;
            initTxt.alignment = TextAnchor.MiddleCenter;
            initTxt.raycastTarget = false;
            var initRt = initObj.GetComponent<RectTransform>();
            initRt.anchorMin = Vector2.zero;
            initRt.anchorMax = Vector2.one;
            initRt.offsetMin = Vector2.zero;
            initRt.offsetMax = Vector2.zero;

            // Player name
            CreateText(_panel.transform, "PLAYER", new Vector2(0f, 350f), 50,
                Color.white, FontStyle.Bold);

            // Badge
            string badge = XP != null ? XP.Badge : "BEGINNER";
            CreateText(_panel.transform, badge, new Vector2(0f, 280f), 32,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            // XP bar
            CreateXPBar();

            // Stats summary
            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;
            int level = Progress != null ? Progress.HighestLevelUnlocked : 1;
            int words = Progress != null ? Progress.TotalWordsFound : 0;

            CreateStatRow(_panel.transform, "Highest Level", level.ToString(), 50f);
            CreateStatRow(_panel.transform, "Total Coins", coins.ToString(), -40f);
            CreateStatRow(_panel.transform, "Total Stars", stars.ToString(), -130f);
            CreateStatRow(_panel.transform, "Words Found", words.ToString(), -220f);

            _panel.SetActive(false);
        }

        private void CreateXPBar()
        {
            var trackObj = new GameObject("XPTrack");
            trackObj.transform.SetParent(_panel.transform, false);

            var trackImg = trackObj.AddComponent<Image>();
            trackImg.sprite = UISpriteFactory.CreateRoundedSprite(new Color(0.15f, 0.20f, 0.35f), 128, 20);
            trackImg.type = Image.Type.Sliced;
            trackImg.raycastTarget = false;

            var trackRt = trackObj.GetComponent<RectTransform>();
            trackRt.anchorMin = new Vector2(0.5f, 0.5f);
            trackRt.anchorMax = new Vector2(0.5f, 0.5f);
            trackRt.pivot = new Vector2(0.5f, 0.5f);
            trackRt.anchoredPosition = new Vector2(0f, 180f);
            trackRt.sizeDelta = new Vector2(700f, 50f);

            var fillObj = new GameObject("XPFill");
            fillObj.transform.SetParent(trackObj.transform, false);

            _xpFill = fillObj.AddComponent<Image>();
            _xpFill.sprite = UISpriteFactory.CreateGradientSprite(
                new Color(0.30f, 0.55f, 0.95f),
                new Color(0.50f, 0.80f, 1f), 32, 64);
            _xpFill.type = Image.Type.Sliced;
            _xpFill.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(6f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -12f);

            var textObj = new GameObject("XPText");
            textObj.transform.SetParent(trackObj.transform, false);
            _xpText = textObj.AddComponent<Text>();
            _xpText.text = "0 / 100 XP";
            _xpText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _xpText.fontSize = 26;
            _xpText.fontStyle = FontStyle.Bold;
            _xpText.color = Color.white;
            _xpText.alignment = TextAnchor.MiddleCenter;
            _xpText.raycastTarget = false;

            var textRt = textObj.GetComponent<RectTransform>();
            textRt.anchorMin = Vector2.zero;
            textRt.anchorMax = Vector2.one;
            textRt.offsetMin = Vector2.zero;
            textRt.offsetMax = Vector2.zero;

            UpdateXPBar();
        }

        private void UpdateXPBar()
        {
            if (XP == null) return;

            float pct = XP.GetProgress();
            float width = 688f * pct;

            if (_xpFill != null)
                _xpFill.rectTransform.sizeDelta = new Vector2(width, -12f);

            if (_xpText != null)
                _xpText.text = $"{XP.XP} / {XP.XPForNextLevel} XP";
        }

        private void OnXPChanged(int xp, int needed)
        {
            UpdateXPBar();
        }

        private void CreateStatRow(Transform parent, string label, string value, float y)
        {
            var rowObj = new GameObject($"Row_{label}");
            rowObj.transform.SetParent(parent, false);

            var bg = rowObj.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.20f, 0.35f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = rowObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(880f, 80f);

            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(rowObj.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 30;
            labelTxt.color = new Color(0.75f, 0.85f, 1f);
            labelTxt.alignment = TextAnchor.MiddleLeft;
            labelTxt.raycastTarget = false;
            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = Vector2.zero;
            lrt.anchorMax = Vector2.one;
            lrt.offsetMin = new Vector2(30f, 0f);
            lrt.offsetMax = Vector2.zero;

            var valueObj = new GameObject("Value");
            valueObj.transform.SetParent(rowObj.transform, false);
            var valueTxt = valueObj.AddComponent<Text>();
            valueTxt.text = value;
            valueTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            valueTxt.fontSize = 36;
            valueTxt.fontStyle = FontStyle.Bold;
            valueTxt.color = new Color(1f, 0.85f, 0.30f);
            valueTxt.alignment = TextAnchor.MiddleRight;
            valueTxt.raycastTarget = false;
            var vrt = valueObj.GetComponent<RectTransform>();
            vrt.anchorMin = Vector2.zero;
            vrt.anchorMax = Vector2.one;
            vrt.offsetMin = Vector2.zero;
            vrt.offsetMax = new Vector2(-30f, 0f);
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
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color,
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

        void OnDestroy()
        {
            if (XP != null)
                XP.OnXPChanged -= OnXPChanged;
        }
    }
}