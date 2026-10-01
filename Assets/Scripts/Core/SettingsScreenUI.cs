using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SettingsScreenUI : MonoBehaviour
    {
        public static SettingsScreenUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Slider _musicSlider;
        private Slider _sfxSlider;
        private Text _musicValueText;
        private Text _sfxValueText;
        private Text _vibrationValueText;
        private Text _languageValueText;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); LoadSettings(); }

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
            bg.color = new Color(0.04f, 0.08f, 0.20f, 1f);
            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
            _panel.SetActive(false);

            CreateText("SETTINGS", new Vector2(0f, 830f), 60, new Color(1f, 0.85f, 0.30f));
            CreateSmallButton("BACK", new Vector2(-380f, 830f), new Color(0.5f, 0.5f, 0.55f), Hide);

            _musicSlider = CreateSlider("MUSIC", new Vector2(0f, 500f), out _musicValueText);
            _musicSlider.onValueChanged.AddListener(OnMusicChanged);

            _sfxSlider = CreateSlider("SOUND EFFECTS", new Vector2(0f, 280f), out _sfxValueText);
            _sfxSlider.onValueChanged.AddListener(OnSFXChanged);

            _vibrationValueText = CreateToggleRow("VIBRATION", new Vector2(0f, 60f), OnVibrationToggle);
            _languageValueText = CreateToggleRow("LANGUAGE", new Vector2(0f, -160f), OnLanguageToggle);

            CreateBigButton("RESET ALL", new Vector2(0f, -450f), new Color(0.75f, 0.30f, 0.30f), OnResetClicked);
            CreateBigButton("RESET TUTORIAL", new Vector2(0f, -580f), new Color(0.5f, 0.35f, 0.75f), OnResetTutorialClicked);
        }

        private Slider CreateSlider(string label, Vector2 pos, out Text valueText)
        {
            var row = new GameObject("Row_" + label, typeof(RectTransform));
            row.transform.SetParent(_panel.transform, false);
            var rt = row.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 180f);

            CreateTextAt(row.transform, label, new Vector2(-300f, 50f), 32, Color.white, TextAnchor.MiddleLeft);
            valueText = CreateTextAt(row.transform, "0%", new Vector2(220f, 50f), 28, new Color(1f, 0.85f, 0.30f), TextAnchor.MiddleRight);

            var sliderObj = new GameObject("Slider", typeof(RectTransform));
            sliderObj.transform.SetParent(row.transform, false);
            var srt = sliderObj.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 0.5f);
            srt.anchorMax = new Vector2(0.5f, 0.5f);
            srt.pivot = new Vector2(0.5f, 0.5f);
            srt.anchoredPosition = new Vector2(0f, -20f);
            srt.sizeDelta = new Vector2(800f, 40f);

            var slider = sliderObj.AddComponent<Slider>();

            var bgObj = new GameObject("Background", typeof(RectTransform));
            bgObj.transform.SetParent(sliderObj.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.15f, 0.20f, 0.35f);
            var bgrt = bgObj.GetComponent<RectTransform>();
            bgrt.anchorMin = new Vector2(0f, 0.3f);
            bgrt.anchorMax = new Vector2(1f, 0.7f);
            bgrt.offsetMin = Vector2.zero;
            bgrt.offsetMax = Vector2.zero;

            var fillArea = new GameObject("Fill Area", typeof(RectTransform));
            fillArea.transform.SetParent(sliderObj.transform, false);
            var fart = fillArea.GetComponent<RectTransform>();
            fart.anchorMin = new Vector2(0f, 0.3f);
            fart.anchorMax = new Vector2(1f, 0.7f);
            fart.offsetMin = new Vector2(5f, 0f);
            fart.offsetMax = new Vector2(-15f, 0f);

            var fill = new GameObject("Fill", typeof(RectTransform));
            fill.transform.SetParent(fillArea.transform, false);
            var fillImg = fill.AddComponent<Image>();
            fillImg.color = new Color(0.30f, 0.75f, 0.95f);
            var fillrt = fill.GetComponent<RectTransform>();
            fillrt.anchorMin = Vector2.zero;
            fillrt.anchorMax = Vector2.one;
            fillrt.offsetMin = Vector2.zero;
            fillrt.offsetMax = Vector2.zero;

            var handleArea = new GameObject("Handle Slide Area", typeof(RectTransform));
            handleArea.transform.SetParent(sliderObj.transform, false);
            var hart = handleArea.GetComponent<RectTransform>();
            hart.anchorMin = new Vector2(0f, 0f);
            hart.anchorMax = new Vector2(1f, 1f);
            hart.offsetMin = new Vector2(10f, 0f);
            hart.offsetMax = new Vector2(-10f, 0f);

            var handle = new GameObject("Handle", typeof(RectTransform));
            handle.transform.SetParent(handleArea.transform, false);
            var handleImg = handle.AddComponent<Image>();
            handleImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.30f), 64);
            var hrt = handle.GetComponent<RectTransform>();
            hrt.anchorMin = new Vector2(0f, 0f);
            hrt.anchorMax = new Vector2(0f, 1f);
            hrt.sizeDelta = new Vector2(40f, 0f);

            slider.fillRect = fillrt;
            slider.handleRect = hrt;
            slider.targetGraphic = handleImg;
            slider.direction = Slider.Direction.LeftToRight;
            slider.minValue = 0f;
            slider.maxValue = 1f;
            slider.value = 0.6f;

            return slider;
        }

        private Text CreateToggleRow(string label, Vector2 pos, UnityEngine.Events.UnityAction onClick)
        {
            var row = new GameObject("Row_" + label, typeof(RectTransform));
            row.transform.SetParent(_panel.transform, false);
            var rt = row.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 140f);

            CreateTextAt(row.transform, label, new Vector2(-300f, 0f), 32, Color.white, TextAnchor.MiddleLeft);

            var btnObj = new GameObject("Toggle", typeof(RectTransform));
            btnObj.transform.SetParent(row.transform, false);
            var img = btnObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.25f, 0.65f, 0.35f), 128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var brt = btnObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.6f, 0.2f);
            brt.anchorMax = new Vector2(1f, 0.8f);
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            var valueText = CreateTextAt(btnObj.transform, "ON", Vector2.zero, 30, Color.white, TextAnchor.MiddleCenter);
            valueText.rectTransform.anchorMin = Vector2.zero;
            valueText.rectTransform.anchorMax = Vector2.one;
            valueText.rectTransform.offsetMin = Vector2.zero;
            valueText.rectTransform.offsetMax = Vector2.zero;

            return valueText;
        }

        private void LoadSettings()
        {
            if (AudioManager.Instance != null)
            {
                _musicSlider.value = AudioManager.Instance.MusicMuted ? 0f : AudioManager.Instance.MusicVolume;
                _sfxSlider.value = AudioManager.Instance.SFXMuted ? 0f : AudioManager.Instance.SFXVolume;
            }
            RefreshLabels();
        }

        private void RefreshLabels()
        {
            if (_musicValueText != null)
                _musicValueText.text = Mathf.RoundToInt(_musicSlider.value * 100f) + "%";
            if (_sfxValueText != null)
                _sfxValueText.text = Mathf.RoundToInt(_sfxSlider.value * 100f) + "%";

            bool vib = PlayerPrefs.GetInt("Settings_Vibration", 1) == 1;
            if (_vibrationValueText != null)
                _vibrationValueText.text = vib ? "ON" : "OFF";

            bool urdu = PlayerPrefs.GetInt("Settings_Language", 0) == 1;
            if (_languageValueText != null)
                _languageValueText.text = urdu ? "URDU" : "ENGLISH";
        }

        private void OnMusicChanged(float v)
        {
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.SetMusicVolume(v);
                AudioManager.Instance.SetMusicMuted(v <= 0.01f);
            }
            RefreshLabels();
        }

        private void OnSFXChanged(float v)
        {
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.SetSFXVolume(v);
                AudioManager.Instance.SetSFXMuted(v <= 0.01f);
            }
            RefreshLabels();
        }

        private void OnVibrationToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            int cur = PlayerPrefs.GetInt("Settings_Vibration", 1);
            PlayerPrefs.SetInt("Settings_Vibration", cur == 1 ? 0 : 1);
            PlayerPrefs.Save();
            RefreshLabels();
        }

        private void OnLanguageToggle()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            int cur = PlayerPrefs.GetInt("Settings_Language", 0);
            PlayerPrefs.SetInt("Settings_Language", cur == 0 ? 1 : 0);
            PlayerPrefs.Save();
            RefreshLabels();
        }

        private void OnResetClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            if (AudioManager.Instance != null)
            {
                AudioManager.Instance.SetMusicVolume(0.6f);
                AudioManager.Instance.SetSFXVolume(0.8f);
                AudioManager.Instance.SetMusicMuted(false);
                AudioManager.Instance.SetSFXMuted(false);
            }
            PlayerPrefs.SetInt("Settings_Vibration", 1);
            PlayerPrefs.SetInt("Settings_Language", 0);
            PlayerPrefs.Save();
            LoadSettings();
        }

        private void OnResetTutorialClicked()
        {
            if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
            TutorialManager.ResetTutorial();
            Debug.Log("[Settings] Tutorial will show on next launch.");
        }

        public void Show() { if (_panel != null) { _panel.SetActive(true); LoadSettings(); } }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private Text CreateText(string s, Vector2 pos, int sz, Color c)
        {
            var o = new GameObject("T", typeof(RectTransform));
            o.transform.SetParent(_panel.transform, false);
            var t = o.AddComponent<Text>();
            t.text = s; t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            t.fontSize = sz; t.fontStyle = FontStyle.Bold; t.color = c;
            t.alignment = TextAnchor.MiddleCenter; t.raycastTarget = false;
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f); r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = pos; r.sizeDelta = new Vector2(900f, 100f);
            return t;
        }

        private Text CreateTextAt(Transform parent, string s, Vector2 pos, int sz, Color c, TextAnchor anchor)
        {
            var o = new GameObject("T", typeof(RectTransform));
            o.transform.SetParent(parent, false);
            var t = o.AddComponent<Text>();
            t.text = s; t.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            t.fontSize = sz; t.fontStyle = FontStyle.Bold; t.color = c;
            t.alignment = anchor; t.raycastTarget = false;
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f); r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = pos; r.sizeDelta = new Vector2(400f, 60f);
            return t;
        }

        private void CreateSmallButton(string s, Vector2 pos, Color c, UnityEngine.Events.UnityAction onClick)
        {
            var o = new GameObject("Btn_" + s, typeof(RectTransform));
            o.transform.SetParent(_panel.transform, false);
            var i = o.AddComponent<Image>();
            i.sprite = UISpriteFactory.Create3DButtonSprite(c, 128, 30);
            i.type = Image.Type.Sliced; i.color = Color.white;
            var b = o.AddComponent<Button>(); b.onClick.AddListener(onClick);
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f); r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = pos; r.sizeDelta = new Vector2(220f, 80f);
            var t = new GameObject("L", typeof(RectTransform));
            t.transform.SetParent(o.transform, false);
            var tx = t.AddComponent<Text>();
            tx.text = s; tx.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            tx.fontSize = 32; tx.fontStyle = FontStyle.Bold; tx.color = Color.white;
            tx.alignment = TextAnchor.MiddleCenter; tx.raycastTarget = false;
            var tr = t.GetComponent<RectTransform>();
            tr.anchorMin = Vector2.zero; tr.anchorMax = Vector2.one;
            tr.offsetMin = Vector2.zero; tr.offsetMax = Vector2.zero;
        }

        private void CreateBigButton(string s, Vector2 pos, Color c, UnityEngine.Events.UnityAction onClick)
        {
            var o = new GameObject("Btn_" + s, typeof(RectTransform));
            o.transform.SetParent(_panel.transform, false);
            var i = o.AddComponent<Image>();
            i.sprite = UISpriteFactory.Create3DButtonSprite(c, 256, 40);
            i.type = Image.Type.Sliced; i.color = Color.white;
            var b = o.AddComponent<Button>(); b.onClick.AddListener(onClick);
            var r = o.GetComponent<RectTransform>();
            r.anchorMin = new Vector2(0.5f, 0.5f); r.anchorMax = new Vector2(0.5f, 0.5f);
            r.pivot = new Vector2(0.5f, 0.5f);
            r.anchoredPosition = pos; r.sizeDelta = new Vector2(600f, 100f);
            var t = new GameObject("L", typeof(RectTransform));
            t.transform.SetParent(o.transform, false);
            var tx = t.AddComponent<Text>();
            tx.text = s; tx.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            tx.fontSize = 36; tx.fontStyle = FontStyle.Bold; tx.color = Color.white;
            tx.alignment = TextAnchor.MiddleCenter; tx.raycastTarget = false;
            var tr = t.GetComponent<RectTransform>();
            tr.anchorMin = Vector2.zero; tr.anchorMax = Vector2.one;
            tr.offsetMin = Vector2.zero; tr.offsetMax = Vector2.zero;
        }
    }
}