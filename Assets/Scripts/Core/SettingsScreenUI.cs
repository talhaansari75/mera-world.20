using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SettingsScreenUI : MonoBehaviour
    {
        public static SettingsScreenUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Transform _scrollContent;
        private Text _versionText;

        private static readonly Color WARM_BG = new Color(0.35f, 0.10f, 0.05f, 1f);
        private static readonly Color ROW_BG = new Color(0.55f, 0.20f, 0.10f, 1f);
        private static readonly Color HEADER_BG = new Color(0.95f, 0.50f, 0.10f, 1f);
        private static readonly Color GREEN = new Color(0.25f, 0.75f, 0.30f);
        private static readonly Color BLUE = new Color(0.20f, 0.45f, 0.90f);
        private static readonly Color RED = new Color(0.85f, 0.20f, 0.20f);
        private static readonly Color PURPLE = new Color(0.55f, 0.35f, 0.85f);

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

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

            // Fixed Title
            var titleBar = new GameObject("TitleBar", typeof(RectTransform));
            titleBar.transform.SetParent(_panel.transform, false);
            var tb = titleBar.AddComponent<Image>();
            tb.color = new Color(0.20f, 0.05f, 0.02f, 1f);
            var trt = titleBar.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 1f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.pivot = new Vector2(0.5f, 1f);
            trt.anchoredPosition = new Vector2(0f, 0f);
            trt.sizeDelta = new Vector2(0f, 180f);

            var title = MakeText(titleBar.transform, "Settings", new Vector2(0f, 0f), 60, Color.white);
            title.rectTransform.anchorMin = Vector2.zero;
            title.rectTransform.anchorMax = Vector2.one;
            title.rectTransform.offsetMin = Vector2.zero;
            title.rectTransform.offsetMax = Vector2.zero;

            // BACK button
            var backBtn = MakeButton(titleBar.transform, "◀", new Vector2(-460f, 0f), new Vector2(100f, 100f), GREEN);
            backBtn.onClick.AddListener(Hide);

            // Scroll view
            var scrollObj = new GameObject("ScrollView", typeof(RectTransform));
            scrollObj.transform.SetParent(_panel.transform, false);
            var scrollRt = scrollObj.GetComponent<RectTransform>();
            scrollRt.anchorMin = new Vector2(0f, 0f);
            scrollRt.anchorMax = new Vector2(1f, 1f);
            scrollRt.offsetMin = new Vector2(0f, 0f);
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
            crt.sizeDelta = new Vector2(0f, 0f);

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

            // Build all rows
            BuildSection("ACCOUNT");
            BuildActionRow("Login with Facebook", "LOGIN", BLUE, OnFacebookLogin);
            BuildActionRow("Login with Google", "LOGIN", GREEN, OnGoogleLogin);
            BuildActionRow("Logout", "LOGOUT", RED, OnLogout);
            BuildActionRow("Tutorial", "PLAY", GREEN, OnPlayTutorial);
            BuildActionRow("Practice Mode", "PLAY", GREEN, OnPracticeMode);

            BuildSection("SOCIAL");
            BuildActionRow("Follow us on Instagram  +10💎", "FOLLOW", GREEN, OnInstagram);
            BuildActionRow("Like our Facebook Page  +10💎", "LIKE", GREEN, OnFacebookLike);

            BuildSection("GAME OPTIONS");
            BuildActionRow("Language", "ENGLISH", GREEN, OnLanguageChange);
            BuildToggleRow("Sound Effects", "SFX_On", 1, OnSfxToggle);
            BuildToggleRow("Vibration", "Vibration_On", 1, OnVibrationToggle);
            BuildToggleRow("Notifications", "Notifications_On", 1, OnNotificationsToggle);
            BuildToggleRow("Pocket Effects", "PocketEffects_On", 1, OnPocketToggle);
            BuildToggleRow("Animated Strikers", "AnimatedStrikers_On", 1, OnStrikersToggle);

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

            _panel.SetActive(false);
        }

        private void BuildSection(string title)
        {
            var obj = new GameObject("Section_" + title, typeof(RectTransform));
            obj.transform.SetParent(_scrollContent, false);
            var rt = obj.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 90f);
            var le = obj.AddComponent<LayoutElement>();
            le.minHeight = 90f;
            le.preferredHeight = 90f;

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
            var row = new GameObject("Row", typeof(RectTransform));
            row.transform.SetParent(_scrollContent, false);
            var rt = row.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 130f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 130f;
            le.preferredHeight = 130f;

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var lbl = MakeText(row.transform, label, new Vector2(-220f, 0f), 30, Color.white);
            lbl.alignment = TextAnchor.MiddleLeft;
            lbl.rectTransform.anchorMin = new Vector2(0f, 0f);
            lbl.rectTransform.anchorMax = new Vector2(0.6f, 1f);
            lbl.rectTransform.offsetMin = new Vector2(30f, 0f);
            lbl.rectTransform.offsetMax = Vector2.zero;

            var btn = MakeButton(row.transform, btnText, new Vector2(270f, 0f), new Vector2(320f, 90f), btnColor);
            btn.onClick.AddListener(onClick);
        }

        private void BuildToggleRow(string label, string prefKey, int defaultValue, UnityEngine.Events.UnityAction onToggle)
        {
            var row = new GameObject("Row_" + prefKey, typeof(RectTransform));
            row.transform.SetParent(_scrollContent, false);
            var rt = row.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 130f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 130f;
            le.preferredHeight = 130f;

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var lbl = MakeText(row.transform, label, new Vector2(-220f, 0f), 30, Color.white);
            lbl.alignment = TextAnchor.MiddleLeft;
            lbl.rectTransform.anchorMin = new Vector2(0f, 0f);
            lbl.rectTransform.anchorMax = new Vector2(0.6f, 1f);
            lbl.rectTransform.offsetMin = new Vector2(30f, 0f);
            lbl.rectTransform.offsetMax = Vector2.zero;

            // Toggle background
            var toggleBg = new GameObject("ToggleBg", typeof(RectTransform));
            toggleBg.transform.SetParent(row.transform, false);
            var tbImg = toggleBg.AddComponent<Image>();
            tbImg.sprite = UISpriteFactory.Create3DButtonSprite(
                PlayerPrefs.GetInt(prefKey, defaultValue) == 1 ? GREEN : new Color(0.3f, 0.3f, 0.35f),
                128, 40);
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
            labelText.text = PlayerPrefs.GetInt(prefKey, defaultValue) == 1 ? "ON" : "OFF";
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
            btn.onClick.AddListener(() =>
            {
                if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
                int cur = PlayerPrefs.GetInt(prefKey, defaultValue);
                int next = cur == 1 ? 0 : 1;
                PlayerPrefs.SetInt(prefKey, next);
                PlayerPrefs.Save();
                tbImg.sprite = UISpriteFactory.Create3DButtonSprite(
                    next == 1 ? GREEN : new Color(0.3f, 0.3f, 0.35f), 128, 40);
                tbImg.type = Image.Type.Sliced;
                labelText.text = next == 1 ? "ON" : "OFF";
                onToggle?.Invoke();
            });
        }

        private void BuildInfoRow(string label, string value)
        {
            var row = new GameObject("Info_" + label, typeof(RectTransform));
            row.transform.SetParent(_scrollContent, false);
            var rt = row.GetComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 110f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 110f;
            le.preferredHeight = 110f;

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(ROW_BG, 256, 30);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var lbl = MakeText(row.transform, label, new Vector2(-220f, 0f), 28, Color.white);
            lbl.alignment = TextAnchor.MiddleLeft;
            lbl.rectTransform.anchorMin = new Vector2(0f, 0f);
            lbl.rectTransform.anchorMax = new Vector2(0.4f, 1f);
            lbl.rectTransform.offsetMin = new Vector2(30f, 0f);
            lbl.rectTransform.offsetMax = Vector2.zero;

            var val = MakeText(row.transform, value, new Vector2(200f, 0f), 22, new Color(1f, 0.95f, 0.75f));
            val.alignment = TextAnchor.MiddleRight;
            val.rectTransform.anchorMin = new Vector2(0.4f, 0f);
            val.rectTransform.anchorMax = new Vector2(1f, 1f);
            val.rectTransform.offsetMin = Vector2.zero;
            val.rectTransform.offsetMax = new Vector2(-30f, 0f);
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
            tx.fontSize = 32;
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
            return id;
        }

        // ---- Actions (stubs) ----
        private void OnFacebookLogin() { Debug.Log("[Settings] Facebook login"); }
        private void OnGoogleLogin() { Debug.Log("[Settings] Google login"); }
        private void OnLogout() { Debug.Log("[Settings] Logout"); }
        private void OnPlayTutorial() { TutorialManager.ResetTutorial(); Debug.Log("[Settings] Tutorial will show on next launch"); }
        private void OnPracticeMode() { Debug.Log("[Settings] Practice mode"); }
        private void OnInstagram() { Application.OpenURL("https://instagram.com"); }
        private void OnFacebookLike() { Application.OpenURL("https://facebook.com"); }
        private void OnLanguageChange()
        {
            int cur = PlayerPrefs.GetInt("Settings_Language", 0);
            PlayerPrefs.SetInt("Settings_Language", cur == 0 ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log("[Settings] Language toggled");
        }
        private void OnSfxToggle() { }
        private void OnVibrationToggle() { }
        private void OnNotificationsToggle() { }
        private void OnPocketToggle() { }
        private void OnStrikersToggle() { }
        private void OnMoreGames() { Debug.Log("[Settings] More games"); }
        private void OnHelpSupport() { Debug.Log("[Settings] Help & Support"); }
        private void OnTerms() { Debug.Log("[Settings] Terms"); }
        private void OnPrivacy() { Debug.Log("[Settings] Privacy"); }
        private void OnDeleteAccount() { Debug.Log("[Settings] Delete account"); }
        private void OnCredits() { Debug.Log("[Settings] Credits"); }
        private void OnMiniGames() { Debug.Log("[Settings] Mini games info"); }

        public void Show()
        {
            if (_panel == null) return;
            _panel.SetActive(true);
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
        }
    }
}