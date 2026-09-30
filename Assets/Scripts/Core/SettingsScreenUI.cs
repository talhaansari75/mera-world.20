using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SettingsScreenUI : MonoBehaviour
    {
        public static SettingsScreenUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Button _musicBtn, _sfxBtn, _vibBtn;
        private Text _musicLbl, _sfxLbl, _vibLbl;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.2f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("SettingsCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 910;

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

            CreateText("SETTINGS", new Vector2(0f, 830f), 60, new Color(1f, 0.85f, 0.30f));
            CreateSmallButton("◀ BACK", new Vector2(-380f, 830f), new Color(0.5f, 0.5f, 0.55f), Hide);

            // Music toggle
            _musicBtn = CreateToggle("MUSIC", new Vector2(0f, 400f), out _musicLbl);
            _musicBtn.onClick.AddListener(() => { SettingsManager.MusicOn = !SettingsManager.MusicOn; RefreshUI(); });

            // SFX toggle
            _sfxBtn = CreateToggle("SOUND EFFECTS", new Vector2(0f, 220f), out _sfxLbl);
            _sfxBtn.onClick.AddListener(() => { SettingsManager.SFXOn = !SettingsManager.SFXOn; RefreshUI(); });

            // Vibration toggle
            _vibBtn = CreateToggle("VIBRATION", new Vector2(0f, 40f), out _vibLbl);
            _vibBtn.onClick.AddListener(() => { SettingsManager.VibrationOn = !SettingsManager.VibrationOn; RefreshUI(); });

            // Reset button
            CreateSmallButton("RESET ALL", new Vector2(0f, -300f), new Color(0.75f, 0.30f, 0.30f), () =>
            {
                SettingsManager.Reset();
                RefreshUI();
            });

            CreateSmallButton("RESET TUTORIAL", new Vector2(0f, -450f), new Color(0.5f, 0.35f, 0.75f), () =>
            {
                TutorialManager.ResetTutorial();
                Debug.Log("[Settings] Tutorial will show on next launch.");
            });

            _panel.SetActive(false);
            RefreshUI();
        }

        private Button CreateToggle(string label, Vector2 pos, out Text valueLabel)
        {
            var row = new GameObject($"Row_{label}");
            row.transform.SetParent(_panel.transform, false);

            var rt = row.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 140f);

            // Label
            var lObj = new GameObject("Label");
            lObj.transform.SetParent(row.transform, false);
            var lt = lObj.AddComponent<Text>();
            lt.text = label;
            lt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            lt.fontSize = 38;
            lt.fontStyle = FontStyle.Bold;
            lt.color = Color.white;
            lt.alignment = TextAnchor.MiddleLeft;
            lt.raycastTarget = false;
            var lrt = lObj.GetComponent<RectTransform>();
            lrt.anchorMin = Vector2.zero;
            lrt.anchorMax = new Vector2(0.6f, 1f);
            lrt.offsetMin = new Vector2(30f, 0f);
            lrt.offsetMax = Vector2.zero;

            // Toggle button
            var btnObj = new GameObject("Toggle");
            btnObj.transform.SetParent(row.transform, false);
            var img = btnObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.25f, 0.65f, 0.35f), 128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            var brt = btnObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.6f, 0.15f);
            brt.anchorMax = new Vector2(1f, 0.85f);
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            var t = new GameObject("Label");
            t.transform.SetParent(btnObj.transform, false);
            valueLabel = t.AddComponent<Text>();
            valueLabel.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            valueLabel.fontSize = 34;
            valueLabel.fontStyle = FontStyle.Bold;
            valueLabel.color = Color.white;
            valueLabel.alignment = TextAnchor.MiddleCenter;
            valueLabel.raycastTarget = false;
            var trt = t.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            return btn;
        }

        private void RefreshUI()
        {
            if (_musicLbl != null) _musicLbl.text = SettingsManager.MusicOn ? "ON" : "OFF";
            if (_sfxLbl != null) _sfxLbl.text = SettingsManager.SFXOn ? "ON" : "OFF";
            if (_vibLbl != null) _vibLbl.text = SettingsManager.VibrationOn ? "ON" : "OFF";
        }

        public void Show() { if (_panel != null) { _panel.SetActive(true); RefreshUI(); } }
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
            rt.sizeDelta = new Vector2(320f, 80f);
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