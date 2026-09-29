using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SettingsScreenUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _panel;
        private GameObject _contentParent;
        private string _activeTab = "audio";

        private const string KEY_SOUND = "Settings_Sound";
        private const string KEY_VIBRATION = "Settings_Vibration";
        private const string KEY_MUSIC = "Settings_Music";
        private const string KEY_NOTIFS = "Settings_Notifs";
        private const string KEY_COLOR_BLIND = "A11y_ColorBlind";
        private const string KEY_HIGH_CONTRAST = "A11y_HighContrast";
        private const string KEY_REDUCED_MOTION = "A11y_ReducedMotion";
        private const string KEY_DARK_MODE = "A11y_DarkMode";
        private const string KEY_FONT_SCALE = "A11y_FontScale";
        private const string KEY_AUTO_SYNC = "Cloud_AutoSync";
        private const string KEY_LANGUAGE = "AppLanguage";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;

            Invoke(nameof(BuildUI), 0.3f);
        }

        private void BuildUI()
        {
            BuildCanvas();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("SettingsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 700;

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
            _panel = new GameObject("SettingsPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title
            CreateText(_panel.transform, "SETTINGS", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Tabs row
            float tabY = 720f;
            float tabSpacing = 175f;
            CreateTabButton("AUDIO", new Vector2(-2f * tabSpacing, tabY), "audio");
            CreateTabButton("A11Y", new Vector2(-1f * tabSpacing, tabY), "a11y");
            CreateTabButton("CLOUD", new Vector2(0f, tabY), "cloud");
            CreateTabButton("GENERAL", new Vector2(1f * tabSpacing, tabY), "general");
            CreateTabButton("DATA", new Vector2(2f * tabSpacing, tabY), "data");

            // Content area
            _contentParent = new GameObject("ContentArea");
            _contentParent.transform.SetParent(_panel.transform, false);
            var crt = _contentParent.AddComponent<RectTransform>();
            crt.anchorMin = new Vector2(0f, 0f);
            crt.anchorMax = new Vector2(1f, 1f);
            crt.offsetMin = new Vector2(0f, 0f);
            crt.offsetMax = new Vector2(0f, -650f);

            ShowTab("audio");

            _panel.SetActive(false);
        }

        private void CreateTabButton(string label, Vector2 pos, string tabId)
        {
            var obj = new GameObject($"Tab_{tabId}");
            obj.transform.SetParent(_panel.transform, false);

            var img = obj.AddComponent<Image>();
            bool active = _activeTab == tabId;
            img.sprite = UISpriteFactory.Create3DButtonSprite(
                active ? new Color(0.30f, 0.65f, 0.95f) : new Color(0.20f, 0.25f, 0.40f),
                256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(() => ShowTab(tabId));

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(160f, 90f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 22;
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

        private void ShowTab(string tabId)
        {
            _activeTab = tabId;

            // Clear content
            foreach (Transform child in _contentParent.transform)
                Destroy(child.gameObject);

            // Refresh tab colors
            foreach (Transform child in _panel.transform)
                if (child.name.StartsWith("Tab_")) Destroy(child.gameObject);

            float tabY = 720f;
            float tabSpacing = 175f;
            CreateTabButton("AUDIO", new Vector2(-2f * tabSpacing, tabY), "audio");
            CreateTabButton("A11Y", new Vector2(-1f * tabSpacing, tabY), "a11y");
            CreateTabButton("CLOUD", new Vector2(0f, tabY), "cloud");
            CreateTabButton("GENERAL", new Vector2(1f * tabSpacing, tabY), "general");
            CreateTabButton("DATA", new Vector2(2f * tabSpacing, tabY), "data");

            switch (tabId)
            {
                case "audio": BuildAudioTab(); break;
                case "a11y": BuildAccessibilityTab(); break;
                case "cloud": BuildCloudTab(); break;
                case "general": BuildGeneralTab(); break;
                case "data": BuildDataTab(); break;
            }
        }

        // ===================== AUDIO TAB =====================

        private void BuildAudioTab()
        {
            float y = 300f;
            CreateSectionHeader("AUDIO & HAPTICS", y);
            y -= 100f;

            CreateToggleRow("SOUND EFFECTS", PlayerPrefs.GetInt(KEY_SOUND, 1) == 1, y, OnSoundToggled);
            y -= 130f;
            CreateToggleRow("MUSIC", PlayerPrefs.GetInt(KEY_MUSIC, 1) == 1, y, OnMusicToggled);
            y -= 130f;
            CreateToggleRow("VIBRATION", PlayerPrefs.GetInt(KEY_VIBRATION, 1) == 1, y, OnVibrationToggled);
            y -= 180f;

            CreateInfoText("All sounds can be toggled\noff at any time.", y);
        }

        // ===================== ACCESSIBILITY TAB =====================

        private void BuildAccessibilityTab()
        {
            float y = 300f;
            CreateSectionHeader("ACCESSIBILITY", y);
            y -= 100f;

            CreateToggleRow("COLOR BLIND MODE", PlayerPrefs.GetInt(KEY_COLOR_BLIND, 0) == 1, y, OnColorBlindToggled);
            y -= 130f;
            CreateToggleRow("HIGH CONTRAST", PlayerPrefs.GetInt(KEY_HIGH_CONTRAST, 0) == 1, y, OnHighContrastToggled);
            y -= 130f;
            CreateToggleRow("REDUCED MOTION", PlayerPrefs.GetInt(KEY_REDUCED_MOTION, 0) == 1, y, OnReducedMotionToggled);
            y -= 130f;
            CreateToggleRow("DARK MODE", PlayerPrefs.GetInt(KEY_DARK_MODE, 1) == 1, y, OnDarkModeToggled);
            y -= 180f;

            CreateInfoText("Accessibility options help\nmake the game easier to play.", y);
        }

        // ===================== CLOUD TAB =====================

        private void BuildCloudTab()
        {
            float y = 300f;
            CreateSectionHeader("CLOUD SAVE", y);
            y -= 100f;

            bool autoSync = PlayerPrefs.GetInt(KEY_AUTO_SYNC, 1) == 1;
            CreateToggleRow("AUTO SYNC", autoSync, y, OnAutoSyncToggled);
            y -= 150f;

            // Last sync info
            string lastSync = PlayerPrefs.GetString("Cloud_LastSync", "");
            if (!string.IsNullOrEmpty(lastSync))
            {
                var dt = System.DateTime.Parse(lastSync);
                CreateInfoText($"Last sync: {dt:MMM dd, HH:mm}", y);
            }
            else
            {
                CreateInfoText("Not synced yet", y);
            }
            y -= 100f;

            CreateMediumButton("FORCE SYNC NOW", new Vector2(0f, y), new Vector2(500f, 100f),
                new Color(0.30f, 0.55f, 0.85f), OnForceSync);

            y -= 180f;
            CreateInfoText("Progress is saved automatically\nand synced to the cloud.", y);
        }

        // ===================== GENERAL TAB =====================

        private void BuildGeneralTab()
        {
            float y = 300f;
            CreateSectionHeader("GENERAL", y);
            y -= 100f;

            CreateToggleRow("NOTIFICATIONS", PlayerPrefs.GetInt(KEY_NOTIFS, 1) == 1, y, OnNotifsToggled);
            y -= 140f;

            // Language
            string lang = PlayerPrefs.GetString(KEY_LANGUAGE, "en");
            CreateLabeledRow("LANGUAGE", lang.ToUpper(), y, OnLanguageClicked);
            y -= 140f;

            // Avatar
            CreateLabeledRow("AVATAR", "CHANGE", y, OnAvatarClicked);
            y -= 140f;

            // Theme
            CreateLabeledRow("THEME", "CHANGE", y, OnThemeClicked);
            y -= 180f;

            CreateInfoText("Customize your experience", y);
        }

        // ===================== DATA TAB =====================

        private void BuildDataTab()
        {
            float y = 300f;
            CreateSectionHeader("DATA & PRIVACY", y);
            y -= 120f;

            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;
            int level = Progress != null ? Progress.HighestLevelUnlocked : 1;

            CreateInfoRow("TOTAL COINS", coins.ToString(), y); y -= 90f;
            CreateInfoRow("TOTAL STARS", stars.ToString(), y); y -= 90f;
            CreateInfoRow("HIGHEST LEVEL", level.ToString(), y); y -= 90f;
            y -= 30f;

            CreateMediumButton("RESET PROGRESS", new Vector2(0f, y), new Vector2(500f, 100f),
                new Color(0.80f, 0.25f, 0.25f), OnResetProgress);
            y -= 140f;

            CreateMediumButton("PRIVACY POLICY", new Vector2(0f, y), new Vector2(500f, 100f),
                new Color(0.40f, 0.50f, 0.70f), OnPrivacyClicked);
            y -= 140f;

            CreateMediumButton("TERMS OF SERVICE", new Vector2(0f, y), new Vector2(500f, 100f),
                new Color(0.40f, 0.50f, 0.70f), OnTermsClicked);
            y -= 200f;

            CreateInfoText("Version 1.0  •  Talha Ansari", y);
        }

        // ===================== UI HELPERS =====================

        private void CreateSectionHeader(string text, float y)
        {
            var obj = new GameObject("Header");
            obj.transform.SetParent(_contentParent.transform, false);
            var txt = obj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 44;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.30f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(900f, 80f);
        }

        private void CreateInfoText(string text, float y)
        {
            var obj = new GameObject("Info");
            obj.transform.SetParent(_contentParent.transform, false);
            var txt = obj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 24;
            txt.fontStyle = FontStyle.Italic;
            txt.color = new Color(0.70f, 0.75f, 0.90f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(900f, 100f);
        }

        private void CreateToggleRow(string label, bool initialState, float y, UnityEngine.Events.UnityAction<bool> onChanged)
        {
            // Label
            var labelObj = new GameObject($"Label_{label}");
            labelObj.transform.SetParent(_contentParent.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 32;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = Color.white;
            labelTxt.alignment = TextAnchor.MiddleLeft;
            labelTxt.raycastTarget = false;
            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = new Vector2(0.5f, 0.5f);
            lrt.anchorMax = new Vector2(0.5f, 0.5f);
            lrt.pivot = new Vector2(0f, 0.5f);
            lrt.anchoredPosition = new Vector2(-400f, y);
            lrt.sizeDelta = new Vector2(500f, 80f);

            // Toggle
            var toggleObj = new GameObject($"Toggle_{label}");
            toggleObj.transform.SetParent(_contentParent.transform, false);
            var toggleImg = toggleObj.AddComponent<Image>();
            toggleImg.sprite = UISpriteFactory.Create3DButtonSprite(
                initialState ? new Color(0.25f, 0.75f, 0.35f) : new Color(0.5f, 0.25f, 0.25f),
                128, 30);
            toggleImg.type = Image.Type.Sliced;
            toggleImg.color = Color.white;

            var toggleBtn = toggleObj.AddComponent<Button>();

            var trt = toggleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 0.5f);
            trt.anchorMax = new Vector2(0.5f, 0.5f);
            trt.pivot = new Vector2(1f, 0.5f);
            trt.anchoredPosition = new Vector2(400f, y);
            trt.sizeDelta = new Vector2(200f, 90f);

            var toggleLabelObj = new GameObject("StateLabel");
            toggleLabelObj.transform.SetParent(toggleObj.transform, false);
            var toggleLabel = toggleLabelObj.AddComponent<Text>();
            toggleLabel.text = initialState ? "ON" : "OFF";
            toggleLabel.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            toggleLabel.fontSize = 32;
            toggleLabel.fontStyle = FontStyle.Bold;
            toggleLabel.color = Color.white;
            toggleLabel.alignment = TextAnchor.MiddleCenter;
            toggleLabel.raycastTarget = false;
            var tlrt = toggleLabelObj.GetComponent<RectTransform>();
            tlrt.anchorMin = Vector2.zero;
            tlrt.anchorMax = Vector2.one;
            tlrt.offsetMin = Vector2.zero;
            tlrt.offsetMax = Vector2.zero;

            bool currentState = initialState;
            toggleBtn.onClick.AddListener(() =>
            {
                currentState = !currentState;
                toggleImg.sprite = UISpriteFactory.Create3DButtonSprite(
                    currentState ? new Color(0.25f, 0.75f, 0.35f) : new Color(0.5f, 0.25f, 0.25f),
                    128, 30);
                toggleLabel.text = currentState ? "ON" : "OFF";
                onChanged?.Invoke(currentState);
            });
        }

        private void CreateLabeledRow(string label, string value, float y, UnityEngine.Events.UnityAction onClick)
        {
            // Label
            var labelObj = new GameObject($"Label_{label}");
            labelObj.transform.SetParent(_contentParent.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 32;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = Color.white;
            labelTxt.alignment = TextAnchor.MiddleLeft;
            labelTxt.raycastTarget = false;
            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = new Vector2(0.5f, 0.5f);
            lrt.anchorMax = new Vector2(0.5f, 0.5f);
            lrt.pivot = new Vector2(0f, 0.5f);
            lrt.anchoredPosition = new Vector2(-400f, y);
            lrt.sizeDelta = new Vector2(500f, 80f);

            // Value button
            var btnObj = new GameObject($"Btn_{label}");
            btnObj.transform.SetParent(_contentParent.transform, false);
            var img = btnObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.30f, 0.55f, 0.85f), 128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(1f, 0.5f);
            rt.anchoredPosition = new Vector2(400f, y);
            rt.sizeDelta = new Vector2(240f, 80f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = value;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 28;
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

        private void CreateInfoRow(string label, string value, float y)
        {
            var rowObj = new GameObject($"Info_{label}");
            rowObj.transform.SetParent(_contentParent.transform, false);

            var bg = rowObj.AddComponent<Image>();
            bg.color = new Color(0.15f, 0.20f, 0.35f, 0.75f);
            bg.raycastTarget = false;

            var rt = rowObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(880f, 75f);

            // Label
            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(rowObj.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 28;
            labelTxt.color = new Color(0.75f, 0.85f, 1f);
            labelTxt.alignment = TextAnchor.MiddleLeft;
            labelTxt.raycastTarget = false;
            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = Vector2.zero;
            lrt.anchorMax = Vector2.one;
            lrt.offsetMin = new Vector2(30f, 0f);
            lrt.offsetMax = Vector2.zero;

            // Value
            var valObj = new GameObject("Value");
            valObj.transform.SetParent(rowObj.transform, false);
            var valTxt = valObj.AddComponent<Text>();
            valTxt.text = value;
            valTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            valTxt.fontSize = 32;
            valTxt.fontStyle = FontStyle.Bold;
            valTxt.color = new Color(1f, 0.85f, 0.30f);
            valTxt.alignment = TextAnchor.MiddleRight;
            valTxt.raycastTarget = false;
            var vrt = valObj.GetComponent<RectTransform>();
            vrt.anchorMin = Vector2.zero;
            vrt.anchorMax = Vector2.one;
            vrt.offsetMin = Vector2.zero;
            vrt.offsetMax = new Vector2(-30f, 0f);
        }

        private void CreateMediumButton(string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(_contentParent.transform, false);
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
            rt.sizeDelta = size;
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 36;
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

        // ===================== CALLBACKS =====================

        private void OnSoundToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_SOUND, on ? 1 : 0);
            PlayerPrefs.Save();
            if (Sound != null) Sound.SfxVolume = on ? 0.5f : 0f;
        }

        private void OnMusicToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_MUSIC, on ? 1 : 0);
            PlayerPrefs.Save();
            if (MusicManager.Instance != null)
                MusicManager.Instance.SetMusicEnabled(on);
        }

        private void OnVibrationToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_VIBRATION, on ? 1 : 0);
            PlayerPrefs.Save();
        }

        private void OnColorBlindToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_COLOR_BLIND, on ? 1 : 0);
            PlayerPrefs.Save();
        }

        private void OnHighContrastToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_HIGH_CONTRAST, on ? 1 : 0);
            PlayerPrefs.Save();
        }

        private void OnReducedMotionToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_REDUCED_MOTION, on ? 1 : 0);
            PlayerPrefs.Save();
        }

        private void OnDarkModeToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_DARK_MODE, on ? 1 : 0);
            PlayerPrefs.Save();
        }

        private void OnAutoSyncToggled(bool on)
        {
            if (CloudSaveManager.Instance != null)
                CloudSaveManager.Instance.SetAutoSync(on);
        }

        private void OnForceSync()
        {
            if (CloudSaveManager.Instance != null)
                CloudSaveManager.Instance.ForceSync();

            ShowTab("cloud");
        }

        private void OnNotifsToggled(bool on)
        {
            PlayerPrefs.SetInt(KEY_NOTIFS, on ? 1 : 0);
            PlayerPrefs.Save();
        }

        private void OnLanguageClicked()
        {
            var lang = FindFirstObjectByType<LanguageSettingsUI>();
            if (lang != null) lang.Show();
        }

        private void OnAvatarClicked()
        {
            var av = FindFirstObjectByType<AvatarPickerUI>();
            if (av != null) av.Show();
        }

        private void OnThemeClicked()
        {
            var theme = FindFirstObjectByType<ThemePickerUI>();
            if (theme != null) theme.Show();
        }

        private void OnResetProgress()
        {
            var r = FindFirstObjectByType<ResetConfirmUI>();
            if (r != null) r.Show();
        }

        private void OnPrivacyClicked()
        {
            Application.OpenURL("https://github.com/talhaansari75/mera-world.20/blob/main/docs/legal/PRIVACY-POLICY.md");
        }

        private void OnTermsClicked()
        {
            Application.OpenURL("https://github.com/talhaansari75/mera-world.20");
        }

        public void Show()
        {
            if (_panel != null)
            {
                _panel.SetActive(true);
                ShowTab("audio");
            }
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
        }

        private void OnBack()
        {
            Hide();
        }
    }
}