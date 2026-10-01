using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public class SettingsScreenUI : MonoBehaviour
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

        private static readonly Color WARM_BG = new Color(0.35f, 0.10f, 0.05f, 1f);
        private static readonly Color ROW_BG = new Color(0.55f, 0.20f, 0.10f, 1f);
        private static readonly Color HEADER_BG = new Color(0.95f, 0.50f, 0.10f, 1f);
        private static readonly Color GREEN = new Color(0.25f, 0.75f, 0.30f);
        private static readonly Color BLUE = new Color(0.20f, 0.45f, 0.90f);
        private static readonly Color RED = new Color(0.85f, 0.20f, 0.20f);
        private static readonly Color GREY = new Color(0.3f, 0.3f, 0.35f);
        private static readonly Color GOLD = new Color(0.95f, 0.75f, 0.15f);

        public const string KEY_SFX = "Settings_SFX_On";
        public const string KEY_VIBRATION = "Settings_Vibration_On";
        public const string KEY_NOTIFICATIONS = "Settings_Notifications_On";
        public const string KEY_POCKET = "Settings_PocketEffects_On";
        public const string KEY_STRIKERS = "Settings_AnimatedStrikers_On";
        public const string KEY_LANGUAGE = "Settings_Language";
        public const string KEY_FOLLOWED_INSTA = "Social_FollowedInstagram";
        public const string KEY_LIKED_FB = "Social_LikedFacebook";
        public const string KEY_LOGGED_IN = "Account_LoggedIn";
        public const string KEY_PROVIDER = "Account_Provider";

        private const string URL_INSTAGRAM = "https://instagram.com/";
        private const string URL_FACEBOOK = "https://facebook.com/";
        private const string URL_MORE_GAMES = "https://play.google.com/store/apps";
        private const string URL_HELP = "mailto:support@meraworld.game";
        private const string URL_TERMS = "https://meraworld.game/terms";
        private const string URL_PRIVACY = "https://meraworld.game/privacy";

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
            bg.color = WARM_BG;
            var prt = _panel.GetComponent<RectTransform>();
            prt.anchorMin = Vector2.zero;
            prt.anchorMax = Vector2.one;
            prt.offsetMin = Vector2.zero;
            prt.offsetMax = Vector2.zero;

            var titleBar = new GameObject("TitleBar", typeof(RectTransform));
            titleBar.transform.SetParent(_panel.transform, false);
            var tb = titleBar.AddComponent<Image>();
            tb.color = new Color(0.20f, 0.05f, 0.02f, 1f);
            var trt = titleBar.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 1f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.pivot = new Vector2(0.5f, 1f);
            trt.anchoredPosition = Vector2.zero;
            trt.sizeDelta = new Vector2(0f, 180f);

            var title = MakeText(titleBar.transform, "Settings", Vector2.zero, 60, Color.white);
            title.rectTransform.anchorMin = Vector2.zero;
            title.rectTransform.anchorMax = Vector2.one;
            title.rectTransform.offsetMin = Vector2.zero;
            title.rectTransform.offsetMax = Vector2.zero;

            var backBtn = MakeButton(titleBar.transform, "<", new Vector2(-460f, 0f), new Vector2(100f, 100f), GREEN);
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

            // ---- ACCOUNT ----
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

            // ---- SOCIAL ----
            BuildSection("SOCIAL");
            bool followedInsta = PlayerPrefs.GetInt(KEY_FOLLOWED_INSTA, 0) == 1;
            bool likedFb = PlayerPrefs.GetInt(KEY_LIKED_FB, 0) == 1;

            BuildActionRow(
                followedInsta ? "Instagram (Done)" : "Follow us on Instagram  +10",
                followedInsta ? "DONE" : "FOLLOW",
                followedInsta ? GREY : GREEN,
                OnInstagram);

            BuildActionRow(
                likedFb ? "Facebook Page (Done)" : "Like our Facebook Page  +10",
                likedFb ? "DONE" : "LIKE",
                likedFb ? GREY : GREEN,
                OnFacebookLike);

            // ---- GAME OPTIONS ----
            BuildSection("GAME OPTIONS");
            string langLabel = PlayerPrefs.GetInt(KEY_LANGUAGE, 0) == 0 ? "ENGLISH" : "URDU";
            BuildActionRow("Language", langLabel, GREEN, OnLanguageChange);
            BuildToggleRow("Sound Effects", KEY_SFX, 1, OnSfxToggle);
            BuildToggleRow("Vibration", KEY_VIBRATION, 1, OnVibrationToggle);
            BuildToggleRow("Notifications", KEY_NOTIFICATIONS, 1, OnNotificationsToggle);
            BuildToggleRow("Pocket Effects", KEY_POCKET, 1, OnPocketToggle);
            BuildToggleRow("Animated Strikers", KEY_STRIKERS, 1, OnStrikersToggle);

            // ---- INFO ----
            BuildSection("INFO");
            BuildActionRow("More Games", "VIEW", BLUE, OnMoreGames);
            BuildActionRow("Help & Support", "VIEW", GREEN, OnHelpSupport);
            BuildActionRow("Terms & Conditions", "VIEW", GREEN, OnTerms);
            BuildActionRow("Privacy Policy", "VIEW", GREEN, OnPrivacy);
            BuildActionRow("Delete Account", "DELETE", RED, OnDeleteAccount);
            BuildActionRow("Credits", "VIEW", GREEN, OnCredits);
            BuildActionRow("Mini-Games Information", "VIEW", GREEN, OnMiniGames);

            BuildInfoRow("Version", "1.0.0 (Production)");
            BuildInfoRow("User Id", GetUserId());
        }

        private void BuildSection(string title)
        {
            var obj = new GameObject("Section_" + title, typeof(RectTransform));
            obj.transform.SetParent(_scrollContent, false);
            obj.GetComponent<RectTransform>().sizeDelta = new Vector2(0f, 90f);
            var le = obj.AddComponent<LayoutElement>();
            le.minHeight = 90f; le.preferredHeight = 90f;

            var bg = obj.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(HEADER_BG, 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var t = MakeText(obj.transform, title, Vector2.zero, 44, Color.white);
            t.rectTransform.anchorMin = Vector2.zero;
            t.rectTransform.anchorMax = Vector2.one;
            t.rectTransform.offsetMin = Vector2.zero;
            t.rectTransform.offsetMax = Vector2.zero;
        }

        private void BuildActionRow(string label, string btnText, Color btnColor, UnityEngine.Events.UnityAction onClick)
        {
            var row = new GameObject("Row_" + label, typeof(RectTransform));
            row.transform.SetParent(_scrollContent, false);
            row.GetComponent<RectTransform>().sizeDelta = new Vector2(0f, 130f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 130f; le.preferredHeight = 130f;

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            // ORIGINAL SIZES — 30 fontSize, -220 x-pos, 0.6 width
            var lbl = MakeText(row.transform, label, new Vector2(-220f, 0f), 30, Color.white);
            lbl.alignment = TextAnchor.MiddleLeft;
            lbl.rectTransform.anchorMin = new Vector2(0f, 0f);
            lbl.rectTransform.anchorMax = new Vector2(0.6f, 1f);
            lbl.rectTransform.offsetMin = new Vector2(30f, 0f);
            lbl.rectTransform.offsetMax = Vector2.zero;

            // ORIGINAL SIZE — 320x90
            var btn = MakeButton(row.transform, btnText, new Vector2(270f, 0f), new Vector2(320f, 90f), btnColor);
            btn.onClick.AddListener(() =>
            {
                PlayClick();
                onClick?.Invoke();
            });
        }

        private void BuildToggleRow(string label, string prefKey, int defaultValue, UnityEngine.Events.UnityAction onToggle)
        {
            var row = new GameObject("Row_" + prefKey, typeof(RectTransform));
            row.transform.SetParent(_scrollContent, false);
            row.GetComponent<RectTransform>().sizeDelta = new Vector2(0f, 130f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 130f; le.preferredHeight = 130f;

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            // ORIGINAL SIZE — 30 fontSize, -220 x-pos
            var lbl = MakeText(row.transform, label, new Vector2(-220f, 0f), 30, Color.white);
            lbl.alignment = TextAnchor.MiddleLeft;
            lbl.rectTransform.anchorMin = new Vector2(0f, 0f);
            lbl.rectTransform.anchorMax = new Vector2(0.6f, 1f);
            lbl.rectTransform.offsetMin = new Vector2(30f, 0f);
            lbl.rectTransform.offsetMax = Vector2.zero;

            var toggleBg = new GameObject("ToggleBg", typeof(RectTransform));
            toggleBg.transform.SetParent(row.transform, false);
            var tbImg = toggleBg.AddComponent<Image>();
            int initVal = PlayerPrefs.GetInt(prefKey, defaultValue);
            tbImg.sprite = UISpriteFactory.Create3DButtonSprite(initVal == 1 ? GREEN : GREY, 128, 40);
            tbImg.type = Image.Type.Sliced;
            tbImg.color = Color.white;

            var tbrt = toggleBg.GetComponent<RectTransform>();
            tbrt.anchorMin = new Vector2(1f, 0.5f);
            tbrt.anchorMax = new Vector2(1f, 0.5f);
            tbrt.pivot = new Vector2(1f, 0.5f);
            tbrt.anchoredPosition = new Vector2(-30f, 0f);
            tbrt.sizeDelta = new Vector2(160f, 80f);

            var labelObj = new GameObject("Lbl", typeof(RectTransform));
            labelObj.transform.SetParent(toggleBg.transform, false);
            var labelText = labelObj.AddComponent<Text>();
            labelText.text = initVal == 1 ? "ON" : "OFF";
            labelText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelText.fontSize = 30;
            labelText.fontStyle = FontStyle.Bold;
            labelText.color = Color.white;
            labelText.alignment = TextAnchor.MiddleCenter;
            labelText.raycastTarget = false;
            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = Vector2.zero;
            lrt.anchorMax = Vector2.one;
            lrt.offsetMin = Vector2.zero;
            lrt.offsetMax = Vector2.zero;

            var btn = toggleBg.AddComponent<Button>();
            string capturedKey = prefKey;
            int capturedDefault = defaultValue;
            UnityEngine.Events.UnityAction capturedToggle = onToggle;

            btn.onClick.AddListener(() =>
            {
                PlayClick();
                int cur = PlayerPrefs.GetInt(capturedKey, capturedDefault);
                int next = cur == 1 ? 0 : 1;
                PlayerPrefs.SetInt(capturedKey, next);
                PlayerPrefs.Save();
                tbImg.sprite = UISpriteFactory.Create3DButtonSprite(next == 1 ? GREEN : GREY, 128, 40);
                tbImg.type = Image.Type.Sliced;
                labelText.text = next == 1 ? "ON" : "OFF";
                capturedToggle?.Invoke();
            });
        }

        private void BuildInfoRow(string label, string value)
        {
            var row = new GameObject("Info_" + label, typeof(RectTransform));
            row.transform.SetParent(_scrollContent, false);
            row.GetComponent<RectTransform>().sizeDelta = new Vector2(0f, 110f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 110f; le.preferredHeight = 110f;

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            // ORIGINAL SIZES — 28 fontSize
            var lbl = MakeText(row.transform, label, new Vector2(-220f, 0f), 28, Color.white);
            lbl.alignment = TextAnchor.MiddleLeft;
            lbl.rectTransform.anchorMin = new Vector2(0f, 0f);
            lbl.rectTransform.anchorMax = new Vector2(0.4f, 1f);
            lbl.rectTransform.offsetMin = new Vector2(30f, 0f);
            lbl.rectTransform.offsetMax = Vector2.zero;

            // ORIGINAL SIZE — 22 fontSize
            var val = MakeText(row.transform, value, new Vector2(200f, 0f), 22, new Color(1f, 0.95f, 0.75f));
            val.alignment = TextAnchor.MiddleRight;
            val.rectTransform.anchorMin = new Vector2(0.4f, 0f);
            val.rectTransform.anchorMax = new Vector2(1f, 1f);
            val.rectTransform.offsetMin = Vector2.zero;
            val.rectTransform.offsetMax = new Vector2(-30f, 0f);
        }

        private void BuildConfirmDialog()
        {
            _confirmDialog = new GameObject("ConfirmDialog", typeof(RectTransform));
            _confirmDialog.transform.SetParent(_canvas.transform, false);
            var rt = _confirmDialog.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero; rt.offsetMax = Vector2.zero;

            var dim = _confirmDialog.AddComponent<Image>();
            dim.color = new Color(0f, 0f, 0f, 0.75f);

            var box = new GameObject("Box", typeof(RectTransform));
            box.transform.SetParent(_confirmDialog.transform, false);
            var boxImg = box.AddComponent<Image>();
            boxImg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 40);
            boxImg.type = Image.Type.Sliced;
            var brt = box.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = Vector2.zero;
            brt.sizeDelta = new Vector2(880f, 700f);

            _confirmTitle = MakeText(box.transform, "Title", new Vector2(0f, 260f), 44, Color.white);
            _confirmMsg = MakeText(box.transform, "Message", new Vector2(0f, 30f), 30, new Color(1f, 0.95f, 0.85f));
            _confirmMsg.rectTransform.sizeDelta = new Vector2(800f, 340f);
            _confirmMsg.horizontalOverflow = HorizontalWrapMode.Wrap;
            _confirmMsg.verticalOverflow = VerticalWrapMode.Overflow;

            var yesBtn = MakeButton(box.transform, "YES", new Vector2(-190f, -250f), new Vector2(320f, 100f), RED);
            yesBtn.onClick.AddListener(() => { PlayClick(); _confirmDialog.SetActive(false); _confirmYes?.Invoke(); });

            var noBtn = MakeButton(box.transform, "CANCEL", new Vector2(190f, -250f), new Vector2(320f, 100f), GREY);
            noBtn.onClick.AddListener(() => { PlayClick(); _confirmDialog.SetActive(false); _confirmNo?.Invoke(); });

            _confirmDialog.SetActive(false);
        }

        private void BuildInfoPopup()
        {
            _infoPopup = new GameObject("InfoPopup", typeof(RectTransform));
            _infoPopup.transform.SetParent(_canvas.transform, false);
            var rt = _infoPopup.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero; rt.offsetMax = Vector2.zero;

            var dim = _infoPopup.AddComponent<Image>();
            dim.color = new Color(0f, 0f, 0f, 0.8f);

            var box = new GameObject("Box", typeof(RectTransform));
            box.transform.SetParent(_infoPopup.transform, false);
            var boxImg = box.AddComponent<Image>();
            boxImg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 40);
            boxImg.type = Image.Type.Sliced;
            var brt = box.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = Vector2.zero;
            brt.sizeDelta = new Vector2(920f, 1200f);

            _infoTitle = MakeText(box.transform, "Title", new Vector2(0f, 500f), 46, Color.white);
            _infoMsg = MakeText(box.transform, "Message", new Vector2(0f, 0f), 28, new Color(1f, 0.95f, 0.85f));
            _infoMsg.rectTransform.sizeDelta = new Vector2(840f, 880f);
            _infoMsg.horizontalOverflow = HorizontalWrapMode.Wrap;
            _infoMsg.verticalOverflow = VerticalWrapMode.Overflow;
            _infoMsg.alignment = TextAnchor.UpperLeft;

            var closeBtn = MakeButton(box.transform, "CLOSE", new Vector2(0f, -520f), new Vector2(400f, 100f), GREEN);
            closeBtn.onClick.AddListener(() => { PlayClick(); _infoPopup.SetActive(false); });

            _infoPopup.SetActive(false);
        }

        private void BuildToast()
        {
            _toastObj = new GameObject("Toast", typeof(RectTransform));
            _toastObj.transform.SetParent(_canvas.transform, false);
            var img = _toastObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.1f, 0.1f, 0.15f, 0.95f), 256, 40);
            img.type = Image.Type.Sliced;
            var rt = _toastObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -220f);
            rt.sizeDelta = new Vector2(880f, 110f);

            _toastText = MakeText(_toastObj.transform, "", Vector2.zero, 30, Color.white);
            _toastText.rectTransform.anchorMin = Vector2.zero;
            _toastText.rectTransform.anchorMax = Vector2.one;
            _toastText.rectTransform.offsetMin = Vector2.zero;
            _toastText.rectTransform.offsetMax = Vector2.zero;

            _toastObj.SetActive(false);
        }

        private void ShowToast(string msg)
        {
            if (_toastObj == null) return;
            _toastObj.SetActive(true);
            _toastText.text = msg;
            CancelInvoke(nameof(HideToast));
            Invoke(nameof(HideToast), 2.2f);
        }

        private void HideToast() { if (_toastObj != null) _toastObj.SetActive(false); }

        private void ShowConfirm(string title, string msg, System.Action onYes, System.Action onNo = null)
        {
            _confirmTitle.text = title;
            _confirmMsg.text = msg;
            _confirmYes = onYes;
            _confirmNo = onNo;
            _confirmDialog.SetActive(true);
        }

        private void ShowInfo(string title, string msg)
        {
            _infoTitle.text = title;
            _infoMsg.text = msg;
            _infoPopup.SetActive(true);
        }

        private Text MakeText(Transform parent, string s, Vector2 pos, int sz, Color c)
        {
            var o = new GameObject("T", typeof(RectTransform));
            o.transform.SetParent(parent, false);
            var t = o.AddComponent<Text>();
            t.text = s;
            t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            t.fontSize = sz;
            t.fontStyle = FontStyle.Bold;
            t.color = c;
            t.alignment = TextAnchor.MiddleCenter;
            t.raycastTarget = false;
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f);
            r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = pos;
            r.sizeDelta = new Vector2(700f, 80f);
            return t;
        }

        private Button MakeButton(Transform parent, string s, Vector2 pos, Vector2 size, Color c)
        {
            var o = new GameObject("Btn_" + s, typeof(RectTransform));
            o.transform.SetParent(parent, false);
            var img = o.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(c, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var b = o.AddComponent<Button>();
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f);
            r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = pos;
            r.sizeDelta = size;

            var t = new GameObject("L", typeof(RectTransform));
            t.transform.SetParent(o.transform, false);
            var tx = t.AddComponent<Text>();
            tx.text = s;
            tx.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            tx.fontSize = 32; // ORIGINAL
            tx.fontStyle = FontStyle.Bold;
            tx.color = Color.white;
            tx.alignment = TextAnchor.MiddleCenter;
            tx.raycastTarget = false;
            var tr = t.GetComponent<RectTransform>();
            tr.anchorMin = Vector2.zero;
            tr.anchorMax = Vector2.one;
            tr.offsetMin = Vector2.zero;
            tr.offsetMax = Vector2.zero;
            return b;
        }

        private string GetUserId()
        {
            string id = PlayerPrefs.GetString("User_Id", "");
            if (string.IsNullOrEmpty(id))
            {
                id = System.Guid.NewGuid().ToString();
                PlayerPrefs.SetString("User_Id", id);
                PlayerPrefs.Save();
            }
            return id.Substring(0, System.Math.Min(20, id.Length)) + "...";
        }

        private void PlayClick() { if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick(); }

        private void GiveGems(int amount, string reason)
        {
            if (PlayerProgressManager.Instance != null)
            {
                PlayerProgressManager.Instance.SendMessage("AddGems", amount, SendMessageOptions.DontRequireReceiver);
                ShowToast(reason + "  +" + amount + " gems!");
            }
            else ShowToast(reason);
        }

        private void OnFacebookLogin()
        {
            PlayerPrefs.SetInt(KEY_LOGGED_IN, 1);
            PlayerPrefs.SetString(KEY_PROVIDER, "Facebook");
            PlayerPrefs.Save();
            ShowToast("Logged in with Facebook");
            RefreshUI();
        }

        private void OnGoogleLogin()
        {
            PlayerPrefs.SetInt(KEY_LOGGED_IN, 1);
            PlayerPrefs.SetString(KEY_PROVIDER, "Google");
            PlayerPrefs.Save();
            ShowToast("Logged in with Google");
            RefreshUI();
        }

        private void OnLogout()
        {
            ShowConfirm("Logout", "Are you sure you want to logout?",
                () => {
                    PlayerPrefs.DeleteKey(KEY_LOGGED_IN);
                    PlayerPrefs.DeleteKey(KEY_PROVIDER);
                    PlayerPrefs.Save();
                    ShowToast("Logged out");
                    RefreshUI();
                });
        }

        private void OnPlayTutorial()
        {
            TutorialManager.ResetTutorial();
            PlayerPrefs.Save();
            ShowToast("Tutorial will show on next level");
        }

        private void OnPracticeMode()
        {
            PlayerPrefs.SetInt("GameMode_Practice", 1);
            PlayerPrefs.Save();
            ShowToast("Starting Practice Mode...");
            Invoke(nameof(Hide), 1.2f);
        }

        private void OnInstagram()
        {
            Application.OpenURL(URL_INSTAGRAM);
            if (PlayerPrefs.GetInt(KEY_FOLLOWED_INSTA, 0) == 1) { ShowToast("Thanks for following!"); return; }
            PlayerPrefs.SetInt(KEY_FOLLOWED_INSTA, 1);
            PlayerPrefs.Save();
            GiveGems(10, "Followed Instagram!");
            RefreshUI();
        }

        private void OnFacebookLike()
        {
            Application.OpenURL(URL_FACEBOOK);
            if (PlayerPrefs.GetInt(KEY_LIKED_FB, 0) == 1) { ShowToast("Thanks for liking!"); return; }
            PlayerPrefs.SetInt(KEY_LIKED_FB, 1);
            PlayerPrefs.Save();
            GiveGems(10, "Liked Facebook Page!");
            RefreshUI();
        }

        private void OnLanguageChange()
        {
            int cur = PlayerPrefs.GetInt(KEY_LANGUAGE, 0);
            int next = cur == 0 ? 1 : 0;
            PlayerPrefs.SetInt(KEY_LANGUAGE, next);
            PlayerPrefs.Save();
            ShowToast(next == 0 ? "Language: English" : "Language: Urdu");
            RefreshUI();
        }

        private void OnSfxToggle()
        {
            bool isOn = PlayerPrefs.GetInt(KEY_SFX, 1) == 1;
            if (AudioManager.Instance != null) AudioManager.Instance.SetSFXMuted(!isOn);
            ShowToast(isOn ? "Sound Effects ON" : "Sound Effects OFF");
        }

        private void OnVibrationToggle()
        {
            bool isOn = PlayerPrefs.GetInt(KEY_VIBRATION, 1) == 1;
            if (isOn && Application.isMobilePlatform) { try { Handheld.Vibrate(); } catch { } }
            ShowToast(isOn ? "Vibration ON" : "Vibration OFF");
        }

        private void OnNotificationsToggle()
        {
            bool isOn = PlayerPrefs.GetInt(KEY_NOTIFICATIONS, 1) == 1;
            ShowToast(isOn ? "Notifications ON" : "Notifications OFF");
        }

        private void OnPocketToggle()
        {
            bool isOn = PlayerPrefs.GetInt(KEY_POCKET, 1) == 1;
            ShowToast(isOn ? "Pocket Effects ON" : "Pocket Effects OFF");
        }

        private void OnStrikersToggle()
        {
            bool isOn = PlayerPrefs.GetInt(KEY_STRIKERS, 1) == 1;
            ShowToast(isOn ? "Animated Strikers ON" : "Animated Strikers OFF");
        }

        private void OnMoreGames() { Application.OpenURL(URL_MORE_GAMES); }
        private void OnHelpSupport() { Application.OpenURL(URL_HELP); }
        private void OnTerms() { Application.OpenURL(URL_TERMS); }
        private void OnPrivacy() { Application.OpenURL(URL_PRIVACY); }

        private void OnDeleteAccount()
        {
            ShowConfirm("Delete Account",
                "Are you sure? This will permanently erase ALL your progress:\n\n" +
                "Coins, Gems, Levels, Achievements, Statistics, Settings.\n\n" +
                "This cannot be undone.",
                () => {
                    PlayerProgressManager.Instance.ResetAll();
                    PlayerPrefs.DeleteAll();
                    PlayerPrefs.Save();

                    if (PlayerProgressManager.Instance != null) Destroy(PlayerProgressManager.Instance.gameObject);
                    if (AchievementManager.Instance != null) Destroy(AchievementManager.Instance.gameObject);
                    if (StatisticsManager.Instance != null) Destroy(StatisticsManager.Instance.gameObject);
                    if (AudioManager.Instance != null) Destroy(AudioManager.Instance.gameObject);
                    if (ThemeManager.Instance != null) Destroy(ThemeManager.Instance.gameObject);

                    ShowToast("Account deleted. Restarting...");
                    Invoke(nameof(RestartGame), 2f);
                });
        }

        private void RestartGame() { SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex); }

        private void OnCredits()
        {
            ShowInfo("Credits",
                "Mera World v1.0\n\n" +
                "Developed by:\n   Talha Ansari\n\n" +
                "Game Design:\n   Talha Ansari\n\n" +
                "Programming:\n   Talha Ansari\n\n" +
                "Art & UI:\n   Talha Ansari\n\n" +
                "Audio:\n   (Your Audio Artist)\n\n" +
                "Built with Unity 2022 LTS\n" +
                "Universal Render Pipeline (2D)\n\n" +
                "Copyright 2026 Mera World.\n" +
                "All rights reserved.");
        }

        private void OnMiniGames()
        {
            ShowInfo("Mini-Games Information",
                "CURRENT MINI-GAMES:\n\n" +
                "WORD SEARCH (Available)\n" +
                "   Find hidden words in the grid.\n" +
                "   Difficulty scales by level.\n\n" +
                "COMING SOON:\n\n" +
                "CROSSWORD\n" +
                "WORD SCRAMBLE\n" +
                "TRIVIA QUIZ\n" +
                "MULTIPLAYER RACE\n\n" +
                "Stay tuned for updates!");
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