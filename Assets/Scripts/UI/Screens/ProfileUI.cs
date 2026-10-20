using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

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
        private RectTransform _contentPanel;
        private Image _xpFill;
        private Text _xpText;

        // Premium Colors
        private Color _bgTop = new Color(13f/255f, 27f/255f, 42f/255f); // #0D1B2A
        private Color _bgBottom = new Color(27f/255f, 38f/255f, 59f/255f); // #1B263B
        private Color _glassWhite = new Color(1f, 1f, 1f, 0.08f);
        private Color _goldAccent = new Color(1f, 0.82f, 0.40f); // #FFD166
        private Color _textColor = new Color(0.95f, 0.95f, 0.95f);

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
            
            // Deep Midnight Navy Gradient Background
            bg.sprite = UISpriteFactory.CreateGradientSprite(_bgTop, _bgBottom, 32, 256);
            bg.type = Image.Type.Simple;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Back Button
            CreateGlassButton(_panel.transform, "< BACK", new Vector2(-380f, 830f), OnBack);

            // Title
            CreateText(_panel.transform, "PROFILE", new Vector2(0f, 830f), 70, _goldAccent, FontStyle.Bold, true);

            // === PREMIUM AVATAR ===
            var avatarRoot = new GameObject("AvatarRoot");
            avatarRoot.transform.SetParent(_panel.transform, false);
            var avatarRootRt = avatarRoot.AddComponent<RectTransform>();
            avatarRootRt.anchorMin = new Vector2(0.5f, 0.5f);
            avatarRootRt.anchorMax = new Vector2(0.5f, 0.5f);
            avatarRootRt.pivot = new Vector2(0.5f, 0.5f);
            avatarRootRt.anchoredPosition = new Vector2(0f, 560f);
            avatarRootRt.sizeDelta = new Vector2(280f, 280f);

            // Glow Ring
            var glowObj = new GameObject("Glow");
            glowObj.transform.SetParent(avatarRoot.transform, false);
            var glowImg = glowObj.AddComponent<Image>();
            glowImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.30f, 0.3f), 256);
            glowImg.raycastTarget = false;
            var glowRt = glowObj.GetComponent<RectTransform>();
            glowRt.anchorMin = Vector2.zero; glowRt.anchorMax = Vector2.one;
            glowRt.offsetMin = new Vector2(-20f, -20f); glowRt.offsetMax = new Vector2(20f, 20f);

            // Sphere
            var avatarObj = new GameObject("Avatar");
            avatarObj.transform.SetParent(avatarRoot.transform, false);
            var avatarImg = avatarObj.AddComponent<Image>();
            avatarImg.sprite = UISpriteFactory.Create3DSphereSprite(AvatarPickerUI.GetSelectedColor(), 256);
            avatarImg.raycastTarget = false;
            var avatarRt = avatarObj.GetComponent<RectTransform>();
            avatarRt.anchorMin = Vector2.zero; avatarRt.anchorMax = Vector2.one;
            avatarRt.offsetMin = new Vector2(15f, 15f); avatarRt.offsetMax = new Vector2(-15f, -15f);

            // Initial Text
            var initObj = new GameObject("Initial");
            initObj.transform.SetParent(avatarObj.transform, false);
            var initTxt = initObj.AddComponent<Text>();
            initTxt.text = "P";
            initTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            initTxt.fontSize = 120;
            initTxt.fontStyle = FontStyle.Bold;
            initTxt.color = Color.white;
            initTxt.alignment = TextAnchor.MiddleCenter;
            initTxt.raycastTarget = false;
            var initShadow = initObj.AddComponent<Shadow>();
            initShadow.effectColor = new Color(0f, 0f, 0f, 0.5f);
            initShadow.effectDistance = new Vector2(3f, -3f);
            var initRt = initObj.GetComponent<RectTransform>();
            initRt.anchorMin = Vector2.zero; initRt.anchorMax = Vector2.one;
            initRt.offsetMin = Vector2.zero; initRt.offsetMax = Vector2.zero;

            // Change Avatar Button
            CreateGlassButton(_panel.transform, "CHANGE", new Vector2(0f, 400f), OnChangeAvatarClicked);

            // Player Name
            CreateText(_panel.transform, "PLAYER", new Vector2(0f, 320f), 46, Color.white, FontStyle.Bold, true);
            
            // Badge
            string badge = XP != null ? XP.Badge : "BEGINNER";
            CreateText(_panel.transform, badge, new Vector2(0f, 250f), 28, _goldAccent, FontStyle.Bold, false);

            // XP Bar
            CreateXPBar();

            // Content Panel for Stats Cards
            var contentObj = new GameObject("StatsContent");
            contentObj.transform.SetParent(_panel.transform, false);
            _contentPanel = contentObj.AddComponent<RectTransform>();
            _contentPanel.anchorMin = new Vector2(0.5f, 0.5f);
            _contentPanel.anchorMax = new Vector2(0.5f, 0.5f);
            _contentPanel.pivot = new Vector2(0.5f, 0.5f);
            _contentPanel.anchoredPosition = new Vector2(0f, -270f);
            _contentPanel.sizeDelta = new Vector2(900f, 600f);

            var vLayout = contentObj.AddComponent<VerticalLayoutGroup>();
            vLayout.spacing = 30f;
            vLayout.childAlignment = TextAnchor.UpperCenter;
            vLayout.childControlHeight = false;
            vLayout.childControlWidth = false;

            // Create Stats Cards
            int level = Progress != null ? Progress.HighestLevelUnlocked : 1;
            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;
            int words = Progress != null ? Progress.TotalWordsFound : 0;

            CreateGlassCard(_contentPanel, "LVL", "Highest Level", level.ToString());
            CreateGlassCard(_contentPanel, "COIN", "Total Coins", coins.ToString("N0"));
            CreateGlassCard(_contentPanel, "STAR", "Total Stars", stars.ToString("N0"));
            CreateGlassCard(_contentPanel, "WRD", "Words Found", words.ToString("N0"));

            _panel.SetActive(false);
        }

        private void CreateGlassCard(Transform parent, string icon, string label, string value)
        {
            var cardObj = new GameObject($"Card_{label}");
            cardObj.transform.SetParent(parent, false);

            // Glass Background
            var bg = cardObj.AddComponent<Image>();
            bg.sprite = UISpriteFactory.CreateRoundedSprite(_glassWhite, 128, 24); // Rounded corners
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            // Subtle Gold Outline
            var outline = cardObj.AddComponent<Outline>();
            outline.effectColor = new Color(_goldAccent.r, _goldAccent.g, _goldAccent.b, 0.3f);
            outline.effectDistance = new Vector2(2f, -2f);

            var rt = cardObj.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(880f, 110f);

            // Icon
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(cardObj.transform, false);
            var iconTxt = iconObj.AddComponent<Text>();
            iconTxt.text = icon;
            iconTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            iconTxt.fontSize = 26; // Slightly smaller
            iconTxt.fontStyle = FontStyle.Bold;
            iconTxt.color = _goldAccent;
            iconTxt.alignment = TextAnchor.MiddleCenter;
            iconTxt.raycastTarget = false;
            iconTxt.horizontalOverflow = HorizontalWrapMode.Overflow; // Prevent wrapping
            iconTxt.verticalOverflow = VerticalWrapMode.Overflow;
            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0.5f, 0.5f);
            iconRt.anchoredPosition = new Vector2(80f, 0f);
            iconRt.sizeDelta = new Vector2(100f, 100f);

            // Label
            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(cardObj.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label.ToUpper();
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 28;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = _textColor;
            labelTxt.alignment = TextAnchor.MiddleLeft;
            labelTxt.raycastTarget = false;
            var labelRt = labelObj.GetComponent<RectTransform>();
            labelRt.anchorMin = new Vector2(0f, 0f);
            labelRt.anchorMax = new Vector2(0.5f, 1f);
            labelRt.offsetMin = new Vector2(140f, 0f);
            labelRt.offsetMax = Vector2.zero;

            // Value
            var valueObj = new GameObject("Value");
            valueObj.transform.SetParent(cardObj.transform, false);
            var valueTxt = valueObj.AddComponent<Text>();
            valueTxt.text = value;
            valueTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            valueTxt.fontSize = 42;
            valueTxt.fontStyle = FontStyle.Bold;
            valueTxt.color = _goldAccent;
            valueTxt.alignment = TextAnchor.MiddleRight;
            valueTxt.raycastTarget = false;
            var valueRt = valueObj.GetComponent<RectTransform>();
            valueRt.anchorMin = new Vector2(0.5f, 0f);
            valueRt.anchorMax = new Vector2(1f, 1f);
            valueRt.offsetMin = Vector2.zero;
            valueRt.offsetMax = new Vector2(-40f, 0f);
        }

        private void CreateXPBar()
        {
            var trackObj = new GameObject("XPTrack");
            trackObj.transform.SetParent(_panel.transform, false);

            var trackImg = trackObj.AddComponent<Image>();
            trackImg.sprite = UISpriteFactory.CreateRoundedSprite(new Color(0f, 0f, 0f, 0.4f), 128, 20);
            trackImg.type = Image.Type.Sliced;
            trackImg.raycastTarget = false;

            var trackRt = trackObj.GetComponent<RectTransform>();
            trackRt.anchorMin = new Vector2(0.5f, 0.5f);
            trackRt.anchorMax = new Vector2(0.5f, 0.5f);
            trackRt.pivot = new Vector2(0.5f, 0.5f);
            trackRt.anchoredPosition = new Vector2(0f, 160f);
            trackRt.sizeDelta = new Vector2(800f, 40f);

            var fillObj = new GameObject("XPFill");
            fillObj.transform.SetParent(trackObj.transform, false);

            _xpFill = fillObj.AddComponent<Image>();
            _xpFill.sprite = UISpriteFactory.CreateGradientSprite(new Color(0.02f, 0.84f, 0.62f), new Color(0.3f, 0.78f, 0.94f), 32, 64);
            _xpFill.type = Image.Type.Sliced;
            _xpFill.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(4f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -8f);

            var textObj = new GameObject("XPText");
            textObj.transform.SetParent(trackObj.transform, false);
            _xpText = textObj.AddComponent<Text>();
            _xpText.text = "0 / 100 XP";
            _xpText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _xpText.fontSize = 22;
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
            float width = 792f * pct;

            if (_xpFill != null)
                _xpFill.rectTransform.sizeDelta = new Vector2(width, -8f);

            if (_xpText != null)
                _xpText.text = $"{XP.XP} / {XP.XPForNextLevel} XP";
        }

        private void OnXPChanged(int xp, int needed) { UpdateXPBar(); }

        private void RefreshAvatar()
        {
            var avatarObj = _panel.transform.Find("AvatarRoot/Avatar");
            if (avatarObj != null)
            {
                var img = avatarObj.GetComponent<Image>();
                if (img != null)
                {
                    img.sprite = UISpriteFactory.Create3DSphereSprite(AvatarPickerUI.GetSelectedColor(), 256);
                    Debug.Log("[Profile] Avatar refreshed with new color");
                }
            }
        }

        private void OnChangeAvatarClicked()
        {
            var picker = FindFirstObjectByType<AvatarPickerUI>();
            if (picker != null) { Hide(); picker.Show(); }
            else Debug.LogWarning("[Profile] AvatarPickerUI not found in scene!");
        }

        public void Show()
        {
            if (_panel != null)
            {
                RefreshAvatar();
                _panel.SetActive(true);

                // DOTween Entrance Animation
                _panel.transform.localScale = Vector3.one * 0.85f;
                _panel.transform.DOScale(Vector3.one, 0.35f).SetEase(Ease.OutBack);
                
                var cg = _panel.GetComponent<CanvasGroup>();
                if (cg == null) cg = _panel.AddComponent<CanvasGroup>();
                cg.alpha = 0f;
                cg.DOFade(1f, 0.25f);
            }
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

        private void CreateGlassButton(Transform parent, string label, Vector2 pos, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.CreateRoundedSprite(_glassWhite, 128, 16); // Glass rounded
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
            txt.fontSize = 30;
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
            
            if (addShadow) {
                var shadow = obj.AddComponent<Shadow>();
                shadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
                shadow.effectDistance = new Vector2(2f, -2f);
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 100f);
            return txt;
        }

        void OnDestroy()
        {
            if (XP != null)
                XP.OnXPChanged -= OnXPChanged;
        }
    }
}