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

        private const string KEY_SOUND = "Settings_Sound";
        private const string KEY_VIBRATION = "Settings_Vibration";
        private const string KEY_MUSIC = "Settings_Music";

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
            bg.color = new Color(0.05f, 0.08f, 0.20f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "SETTINGS", new Vector2(0f, 820f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateButton(_panel.transform, "◀ BACK", new Vector2(-380f, 820f),
                new Vector2(220f, 80f), new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Sound
            bool soundOn = PlayerPrefs.GetInt(KEY_SOUND, 1) == 1;
            CreateToggleRow(_panel.transform, "SOUND", 550f, soundOn, OnSoundToggled);

            // Vibration
            bool vibrationOn = PlayerPrefs.GetInt(KEY_VIBRATION, 1) == 1;
            CreateToggleRow(_panel.transform, "VIBRATION", 380f, vibrationOn, OnVibrationToggled);

            // Music
            bool musicOn = PlayerPrefs.GetInt(KEY_MUSIC, 1) == 1;
            CreateToggleRow(_panel.transform, "MUSIC", 210f, musicOn, OnMusicToggled);

            // Reset button
            CreateButton(_panel.transform, "RESET PROGRESS", new Vector2(0f, -250f),
                new Vector2(500f, 100f), new Color(0.80f, 0.25f, 0.25f), OnResetProgress);

            // Version info
            CreateText(_panel.transform, "Mera Word Search Journey\nVersion 1.0\nBy Talha Ansari",
                new Vector2(0f, -700f), 28, new Color(0.55f, 0.60f, 0.75f), FontStyle.Normal);

            _panel.SetActive(false);
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private void OnSoundToggled(bool isOn)
        {
            PlayerPrefs.SetInt(KEY_SOUND, isOn ? 1 : 0);
            PlayerPrefs.Save();
            if (Sound != null) Sound.SfxVolume = isOn ? 0.5f : 0f;
            Debug.Log($"[Settings] Sound: {isOn}");
        }

        private void OnVibrationToggled(bool isOn)
        {
            PlayerPrefs.SetInt(KEY_VIBRATION, isOn ? 1 : 0);
            PlayerPrefs.Save();
            Debug.Log($"[Settings] Vibration: {isOn}");
        }

        private void OnMusicToggled(bool isOn)
        {
            PlayerPrefs.SetInt(KEY_MUSIC, isOn ? 1 : 0);
            PlayerPrefs.Save();
            if (MusicManager.Instance != null)
                MusicManager.Instance.SetMusicEnabled(isOn);
            Debug.Log($"[Settings] Music: {isOn}");
        }

        private void OnResetProgress()
        {
            var r = FindFirstObjectByType<ResetConfirmUI>();
            if (r != null) r.Show();
            else Debug.LogWarning("[Settings] ResetConfirmUI not found");
        }

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
            txt.supportRichText = true;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 250f);
            return txt;
        }

        private void CreateButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.color = color;
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
            txt.fontSize = 38;
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

        private void CreateToggleRow(Transform parent, string label, float yPos, bool initialState, UnityEngine.Events.UnityAction<bool> onChanged)
        {
            var labelObj = new GameObject($"Label_{label}");
            labelObj.transform.SetParent(parent, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 42;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = Color.white;
            labelTxt.alignment = TextAnchor.MiddleLeft;
            labelTxt.raycastTarget = false;
            var labelRt = labelObj.GetComponent<RectTransform>();
            labelRt.anchorMin = new Vector2(0.5f, 0.5f);
            labelRt.anchorMax = new Vector2(0.5f, 0.5f);
            labelRt.pivot = new Vector2(0f, 0.5f);
            labelRt.anchoredPosition = new Vector2(-400f, yPos);
            labelRt.sizeDelta = new Vector2(500f, 100f);

            var toggleObj = new GameObject($"Toggle_{label}");
            toggleObj.transform.SetParent(parent, false);
            var toggleImg = toggleObj.AddComponent<Image>();
            toggleImg.color = initialState
                ? new Color(0.25f, 0.75f, 0.35f)
                : new Color(0.5f, 0.25f, 0.25f);
            var toggleBtn = toggleObj.AddComponent<Button>();
            var toggleRt = toggleObj.GetComponent<RectTransform>();
            toggleRt.anchorMin = new Vector2(0.5f, 0.5f);
            toggleRt.anchorMax = new Vector2(0.5f, 0.5f);
            toggleRt.pivot = new Vector2(1f, 0.5f);
            toggleRt.anchoredPosition = new Vector2(400f, yPos);
            toggleRt.sizeDelta = new Vector2(200f, 90f);

            var toggleLabelObj = new GameObject("StateLabel");
            toggleLabelObj.transform.SetParent(toggleObj.transform, false);
            var toggleLabel = toggleLabelObj.AddComponent<Text>();
            toggleLabel.text = initialState ? "ON" : "OFF";
            toggleLabel.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            toggleLabel.fontSize = 38;
            toggleLabel.fontStyle = FontStyle.Bold;
            toggleLabel.color = Color.white;
            toggleLabel.alignment = TextAnchor.MiddleCenter;
            toggleLabel.raycastTarget = false;
            var tlRt = toggleLabelObj.GetComponent<RectTransform>();
            tlRt.anchorMin = Vector2.zero;
            tlRt.anchorMax = Vector2.one;
            tlRt.offsetMin = Vector2.zero;
            tlRt.offsetMax = Vector2.zero;

            bool currentState = initialState;
            toggleBtn.onClick.AddListener(() =>
            {
                currentState = !currentState;
                toggleImg.color = currentState
                    ? new Color(0.25f, 0.75f, 0.35f)
                    : new Color(0.5f, 0.25f, 0.25f);
                toggleLabel.text = currentState ? "ON" : "OFF";
                onChanged?.Invoke(currentState);
            });
        }
    }
}