using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class PauseSettingsUI : MonoBehaviour
    {
        public static PauseSettingsUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Text _musicValue;
        private Text _sfxValue;
        private Text _vibValue;
        private Text _langValue;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var c = new GameObject("PauseSettingsCanvas", typeof(RectTransform));
            c.transform.SetParent(transform, false);
            _canvas = c.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 970;
            var s = c.AddComponent<CanvasScaler>();
            s.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            s.referenceResolution = new Vector2(1080, 1920);
            s.matchWidthOrHeight = 0f;
            c.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            // Full overlay with warm gradient backdrop
            _panel = new GameObject("Panel", typeof(RectTransform));
            _panel.transform.SetParent(_canvas.transform, false);
            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.35f, 0.10f, 0.05f, 0.98f);
            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title bar (orange gradient banner)
            var titleBar = new GameObject("TitleBar", typeof(RectTransform));
            titleBar.transform.SetParent(_panel.transform, false);
            var tbImg = titleBar.AddComponent<Image>();
            tbImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.95f, 0.45f, 0.10f), 256, 40);
            tbImg.type = Image.Type.Sliced;
            var tbrt = titleBar.GetComponent<RectTransform>();
            tbrt.anchorMin = new Vector2(0.5f, 1f);
            tbrt.anchorMax = new Vector2(0.5f, 1f);
            tbrt.pivot = new Vector2(0.5f, 1f);
            tbrt.anchoredPosition = new Vector2(0f, -80f);
            tbrt.sizeDelta = new Vector2(900f, 140f);

            CreateText(titleBar.transform, "SETTINGS", 60, Color.white, FontStyle.Bold);

            // Social section
            CreateSectionHeader("SOCIAL", -260f);
            CreateRowWithButton("Follow us on Instagram", "+10 Gems", new Color(0.85f, 0.25f, 0.55f), -400f, null, out _);
            CreateRowWithButton("Like our Facebook Page", "+10 Gems", new Color(0.20f, 0.50f, 0.85f), -540f, null, out _);

            // Game options section
            CreateSectionHeader("GAME OPTIONS", -680f);

            // Language
            CreateRowWithButton("Language", "ENGLISH", new Color(0.25f, 0.65f, 0.35f), -820f, OnLanguageChange, out _langValue);

            // Music
            CreateRowWithToggle("Music", -940f, OnMusicToggle, out _musicValue);

            // Sound FX
            CreateRowWithToggle("Sound Effects", -1060f, OnSFXToggle, out _sfxValue);

            // Vibration
            CreateRowWithToggle("Vibration", -1180f, OnVibToggle, out _vibValue);

            // Resume / Home buttons at bottom
            CreateBottomButton("RESUME", -1500f, new Color(0.25f, 0.65f, 0.35f), Hide);
            CreateBottomButton("HOME", -1630f, new Color(0.85f, 0.30f, 0.30f), OnHomeClicked);

            _panel.SetActive(false);
        }

        private void CreateSectionHeader(string text, float y)
        {
            var obj = new GameObject("Header", typeof(RectTransform));
            obj.transform.SetParent(_panel.transform, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.95f, 0.50f, 0.10f), 256, 40);
            img.type = Image.Type.Sliced;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(920f, 80f);

            var t = new GameObject("T", typeof(RectTransform));
            t.transform.SetParent(obj.transform, false);
            var txt = t.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 38;
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

        private void CreateRowWithButton(string label, string buttonText, Color buttonColor, float y,
            UnityEngine.Events.UnityAction onClick, out Text valueText)
        {
            var row = new GameObject("Row", typeof(RectTransform));
            row.transform.SetParent(_panel.transform, false);
            var img = row.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.55f, 0.20f, 0.10f), 256, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var rt = row.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(920f, 120f);

            // Label
            var lbl = new GameObject("Label", typeof(RectTransform));
            lbl.transform.SetParent(row.transform, false);
            var lblTxt = lbl.AddComponent<Text>();
            lblTxt.text = label;
            lblTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            lblTxt.fontSize = 34;
            lblTxt.fontStyle = FontStyle.Bold;
            lblTxt.color = Color.white;
            lblTxt.alignment = TextAnchor.MiddleLeft;
            lblTxt.raycastTarget = false;
            var lrt = lbl.GetComponent<RectTransform>();
            lrt.anchorMin = new Vector2(0f, 0f);
            lrt.anchorMax = new Vector2(0.6f, 1f);
            lrt.offsetMin = new Vector2(30f, 0f);
            lrt.offsetMax = Vector2.zero;

            // Button
            var btnObj = new GameObject("Btn", typeof(RectTransform));
            btnObj.transform.SetParent(row.transform, false);
            var bImg = btnObj.AddComponent<Image>();
            bImg.sprite = UISpriteFactory.Create3DButtonSprite(buttonColor, 256, 40);
            bImg.type = Image.Type.Sliced;
            bImg.color = Color.white;
            var btn = btnObj.AddComponent<Button>();
            if (onClick != null) btn.onClick.AddListener(onClick);
            var brt = btnObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.62f, 0.15f);
            brt.anchorMax = new Vector2(0.98f, 0.85f);
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            var bt = new GameObject("T", typeof(RectTransform));
            bt.transform.SetParent(btnObj.transform, false);
            valueText = bt.AddComponent<Text>();
            valueText.text = buttonText;
            valueText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            valueText.fontSize = 30;
            valueText.fontStyle = FontStyle.Bold;
            valueText.color = Color.white;
            valueText.alignment = TextAnchor.MiddleCenter;
            valueText.raycastTarget = false;
            var btrt = bt.GetComponent<RectTransform>();
            btrt.anchorMin = Vector2.zero;
            btrt.anchorMax = Vector2.one;
            btrt.offsetMin = Vector2.zero;
            btrt.offsetMax = Vector2.zero;
        }

        private void CreateRowWithToggle(string label, float y, UnityEngine.Events.UnityAction onClick, out Text valueText)
        {
            CreateRowWithButton(label, "ON", new Color(0.25f, 0.65f, 0.35f), y, onClick, out valueText);
        }

        private void CreateBottomButton(string label, float y, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject("Btn_" + label, typeof(RectTransform));
            obj.transform.SetParent(_panel.transform, false);
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
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(700f, 120f);

            var t = new GameObject("T", typeof(RectTransform));
            t.transform.SetParent(obj.transform, false);
            var txt = t.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 44;
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

        private void CreateText(Transform parent, string content, int size, Color color, FontStyle style)
        {
            var obj = new GameObject("Text", typeof(RectTransform));
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
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
        }

        // ---- Actions ----

        private void OnLanguageChange()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            int cur = PlayerPrefs.GetInt("Settings_Language", 0);
            PlayerPrefs.SetInt("Settings_Language", cur == 0 ? 1 : 0);
            PlayerPrefs.Save();
            if (_langValue != null) _langValue.text = (cur == 0) ? "URDU" : "ENGLISH";
        }

        private void OnMusicToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (AudioManager.Instance != null)
            {
                bool muted = !AudioManager.Instance.MusicMuted;
                AudioManager.Instance.SetMusicMuted(muted);
                _musicValue.text = muted ? "OFF" : "ON";
            }
        }

        private void OnSFXToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (AudioManager.Instance != null)
            {
                bool muted = !AudioManager.Instance.SFXMuted;
                AudioManager.Instance.SetSFXMuted(muted);
                _sfxValue.text = muted ? "OFF" : "ON";
            }
        }

        private void OnVibToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            int cur = PlayerPrefs.GetInt("Settings_Vibration", 1);
            PlayerPrefs.SetInt("Settings_Vibration", cur == 1 ? 0 : 1);
            PlayerPrefs.Save();
            if (_vibValue != null) _vibValue.text = (cur == 1) ? "OFF" : "ON";
        }

        private void OnHomeClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            Hide();
            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        public void Show()
        {
            if (_panel == null) return;
            RefreshValues();
            _panel.SetActive(true);
            Time.timeScale = 0f;
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
            Time.timeScale = 1f;
        }

        private void RefreshValues()
        {
            if (AudioManager.Instance != null)
            {
                if (_musicValue != null) _musicValue.text = AudioManager.Instance.MusicMuted ? "OFF" : "ON";
                if (_sfxValue != null) _sfxValue.text = AudioManager.Instance.SFXMuted ? "OFF" : "ON";
            }
            if (_vibValue != null) _vibValue.text = PlayerPrefs.GetInt("Settings_Vibration", 1) == 1 ? "ON" : "OFF";
            if (_langValue != null) _langValue.text = PlayerPrefs.GetInt("Settings_Language", 0) == 0 ? "ENGLISH" : "URDU";
        }
    }
}