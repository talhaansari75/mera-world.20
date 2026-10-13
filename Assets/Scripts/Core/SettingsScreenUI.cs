using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class SettingsScreenUI : MonoBehaviour
    {
        public static SettingsScreenUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Transform _scrollContent;

        private GameObject _confirmDialog;
        private Text _confirmTitle, _confirmMsg;
        private System.Action _confirmYes, _confirmNo;

        private GameObject _infoPopup;
        private Text _infoTitle, _infoMsg;

        private GameObject _toastObj;
        private Text _toastText;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 0.5f); }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
            BuildConfirmDialog();
            BuildInfoPopup();
            BuildToast();
            RefreshUI();
        }

        private void BuildCanvas()
        {
            var c = new GameObject("SettingsCanvas", typeof(RectTransform));
            c.transform.SetParent(transform, false);
            _canvas = c.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 960;

            var s = c.AddComponent<CanvasScaler>();
            s.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            s.referenceResolution = new Vector2(1080, 1920);
            s.matchWidthOrHeight = 0f;
            c.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("Panel", typeof(RectTransform));
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.sprite = Resources.Load<Sprite>("UI/HomeScreen/Backgrounds/bg_space");
            bg.color = Color.white;
            bg.type = Image.Type.Simple;
            bg.preserveAspect = false;

            var prt = _panel.GetComponent<RectTransform>();
            prt.anchorMin = Vector2.zero;
            prt.anchorMax = Vector2.one;
            prt.offsetMin = Vector2.zero;
            prt.offsetMax = Vector2.zero;

            var overlay = new GameObject("Overlay", typeof(RectTransform));
            overlay.transform.SetParent(_panel.transform, false);
            var ovImg = overlay.AddComponent<Image>();
            ovImg.color = new Color(0f, 0f, 0.05f, 0.55f);
            ovImg.raycastTarget = false;
            var ovrt = overlay.GetComponent<RectTransform>();
            ovrt.anchorMin = Vector2.zero;
            ovrt.anchorMax = Vector2.one;
            ovrt.offsetMin = Vector2.zero;
            ovrt.offsetMax = Vector2.zero;

            var titleBar = new GameObject("TitleBar", typeof(RectTransform));
            titleBar.transform.SetParent(_panel.transform, false);
            var tb = titleBar.AddComponent<Image>();
            tb.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.10f, 0.25f), 256, 40);
            tb.type = Image.Type.Sliced;
            tb.color = Color.white;
            var trt = titleBar.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 1f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.pivot = new Vector2(0.5f, 1f);
            trt.anchoredPosition = Vector2.zero;
            trt.sizeDelta = new Vector2(0f, 180f);

            var goldLine = new GameObject("GoldLine", typeof(RectTransform));
            goldLine.transform.SetParent(titleBar.transform, false);
            var glImg = goldLine.AddComponent<Image>();
            glImg.color = TEXT_GOLD;
            var glrt = goldLine.GetComponent<RectTransform>();
            glrt.anchorMin = new Vector2(0f, 0f);
            glrt.anchorMax = new Vector2(1f, 0f);
            glrt.pivot = new Vector2(0.5f, 0f);
            glrt.anchoredPosition = Vector2.zero;
            glrt.sizeDelta = new Vector2(0f, 5f);

            var title = MakeText(titleBar.transform, "SETTINGS", Vector2.zero, 70, TEXT_GOLD);
            title.fontStyle = FontStyle.Bold;
            var tOutline = title.gameObject.AddComponent<Outline>();
            tOutline.effectColor = new Color(0.3f, 0.1f, 0f, 1f);
            tOutline.effectDistance = new Vector2(3f, -3f);
            title.rectTransform.anchorMin = Vector2.zero;
            title.rectTransform.anchorMax = Vector2.one;
            title.rectTransform.offsetMin = Vector2.zero;
            title.rectTransform.offsetMax = Vector2.zero;

            var backBtn = MakeButton(titleBar.transform, "<", new Vector2(-450f, 0f), new Vector2(100f, 100f), GREEN);
            backBtn.onClick.AddListener(Hide);

            var scrollObj = new GameObject("ScrollView", typeof(RectTransform));
            scrollObj.transform.SetParent(_panel.transform, false);
            var scrollRt = scrollObj.GetComponent<RectTransform>();
            scrollRt.anchorMin = new Vector2(0f, 0f);
            scrollRt.anchorMax = new Vector2(1f, 1f);
            scrollRt.offsetMin = Vector2.zero;
            scrollRt.offsetMax = new Vector2(0f, -180f);

            var scroll = scrollObj.AddComponent<ScrollRect>();
            scroll.horizontal = false;
            scroll.vertical = true;
            scroll.movementType = ScrollRect.MovementType.Clamped;
            scroll.scrollSensitivity = 30f;

            var vp = new GameObject("Viewport", typeof(RectTransform));
            vp.transform.SetParent(scrollObj.transform, false);
            var vprt = vp.GetComponent<RectTransform>();
            vprt.anchorMin = Vector2.zero;
            vprt.anchorMax = Vector2.one;
            vprt.offsetMin = Vector2.zero;
            vprt.offsetMax = Vector2.zero;
            var vpimg = vp.AddComponent<Image>();
            vpimg.color = new Color(0f, 0f, 0f, 0.01f);
            vp.AddComponent<Mask>().showMaskGraphic = false;

            var content = new GameObject("Content", typeof(RectTransform));
            content.transform.SetParent(vp.transform, false);
            var crt = content.GetComponent<RectTransform>();
            crt.anchorMin = new Vector2(0f, 1f);
            crt.anchorMax = new Vector2(1f, 1f);
            crt.pivot = new Vector2(0.5f, 1f);
            crt.anchoredPosition = Vector2.zero;
            crt.sizeDelta = Vector2.zero;

            var vlg = content.AddComponent<VerticalLayoutGroup>();
            vlg.childAlignment = TextAnchor.UpperCenter;
            vlg.spacing = 18f;
            vlg.padding = new RectOffset(40, 40, 40, 40);
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;
            vlg.childControlWidth = true;
            vlg.childControlHeight = false;

            var csf = content.AddComponent<ContentSizeFitter>();
            csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            _scrollContent = content.transform;
            scroll.viewport = vprt;
            scroll.content = crt;

            _panel.SetActive(false);
        }

        private void RefreshUI()
        {
            if (_scrollContent == null) return;
            for (int i = _scrollContent.childCount - 1; i >= 0; i--)
                Destroy(_scrollContent.GetChild(i).gameObject);
            BuildAllRows();
        }

        private void BuildAllRows()
        {
            bool loggedIn = PlayerPrefs.GetInt(KEY_LOGGED_IN, 0) == 1;
            string provider = PlayerPrefs.GetString(KEY_PROVIDER, "");

            // ═══════════ ACCOUNT ═══════════
            BuildSection("ACCOUNT");
            if (loggedIn)
            {
                BuildInfoRow("Status", "Logged in with " + provider);
                BuildActionRow("Logout", "LOGOUT", RED, OnLogout);
            }
            else
            {
                BuildActionRow("Login with Facebook", "LOGIN", BLUE, OnFacebookLogin);
                BuildActionRow("Login with Google", "LOGIN", GREEN, OnGoogleLogin);
            }
            BuildActionRow("Tutorial", "PLAY", GREEN, OnPlayTutorial);
            BuildActionRow("Practice Mode", "PLAY", GREEN, OnPracticeMode);

            // ═══════════ AUDIO ═══════════
            BuildSection("AUDIO");
            float musicVol = MusicManager.Instance != null ? MusicManager.Instance.MusicVolume : 0.6f;
            float sfxVol = SoundManager.Instance != null ? SoundManager.Instance.SfxVolume : 0.8f;
            BuildSliderRow("Music", KEY_MUSIC, musicVol, OnMusicVolumeChanged);
            BuildSliderRow("Sound FX", KEY_SFX, sfxVol, OnSFXVolumeChanged);
            BuildToggleRow("Vibration", KEY_VIBRATION, 1, OnVibrationToggle);

            // ═══════════ GAMEPLAY ═══════════
            BuildSection("GAMEPLAY");
            string langLabel = PlayerPrefs.GetInt(KEY_LANGUAGE, 0) == 0 ? "ENGLISH" : "URDU";
            BuildActionRow("Language", langLabel, GREEN, OnLanguageChange);
            string themeLabel = PlayerPrefs.GetString(KEY_THEME, "Classic").ToUpper();
            BuildActionRow("Theme", themeLabel, BLUE, OnThemeChange);
            BuildToggleRow("Auto-Hint", KEY_AUTO_HINT, 0, OnAutoHintToggle);
            BuildToggleRow("Show Timer", KEY_SHOW_TIMER, 1, OnShowTimerToggle);

            // ═══════════ NOTIFICATIONS ═══════════
            BuildSection("NOTIFICATIONS");
            BuildToggleRow("Daily Reminder", KEY_NOTIFICATIONS, 1, OnNotificationsToggle);

            // ═══════════ SUPPORT US ═══════════
            BuildSection("SUPPORT US");
            BuildActionRow("Rate Us", "RATE", GOLD, OnRateUs);
            BuildActionRow("Share App", "SHARE", BLUE, OnShareApp);
            BuildActionRow("More Games", "VIEW", BLUE, OnMoreGames);

            // ═══════════ LEGAL ═══════════
            BuildSection("LEGAL");
            BuildActionRow("Privacy Policy", "VIEW", GREEN, OnPrivacy);
            BuildActionRow("Terms of Service", "VIEW", GREEN, OnTerms);
            BuildActionRow("Help & Support", "VIEW", GREEN, OnHelpSupport);
            BuildActionRow("Credits", "VIEW", GREEN, OnCredits);

            // ═══════════ DANGER ZONE ═══════════
            BuildSection("DANGER ZONE");
            BuildActionRow("Reset Progress", "RESET", RED, OnResetProgress);
            BuildActionRow("Delete Account", "DELETE", RED, OnDeleteAccount);

            // ═══════════ INFO ═══════════
            BuildInfoRow("Version", "1.1.0");
            BuildInfoRow("User Id", GetUserId());
        }

        public void Show()
        {
            if (_panel == null) return;
            _panel.SetActive(true);
            RefreshUI();
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }
    }
}