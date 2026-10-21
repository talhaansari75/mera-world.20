using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AdminPanel : MonoBehaviour
    {
        public static AdminPanel Instance { get; private set; }
        public static bool GodMode = false;

        private Canvas _canvas;
        private GameObject _panel;
        private Text _godModeStatusText;
        private int _titleTaps = 0;
        private float _lastTapTime = 0f;
        private const float TAP_WINDOW = 2f;
        private const int REQUIRED_TAPS = 7;
        private const string KEY_GOD_MODE = "Admin_GodMode";

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
            GodMode = PlayerPrefs.GetInt(KEY_GOD_MODE, 0) == 1;
            Debug.Log("[AdminPanel] Awake called — Instance ready!");
        }

        public static void EnsureExists()
        {
            if (Instance == null)
            {
                var go = new GameObject("AdminPanel");
                go.AddComponent<AdminPanel>();
                DontDestroyOnLoad(go);
                Debug.Log("[AdminPanel] Created on-demand!");
            }
        }

        void Start() { Invoke(nameof(Setup), 0.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AdminCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 999;
            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("AdminPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var rt = _panel.AddComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.02f, 0.02f, 0.08f, 0.96f);

            CreateText(_panel.transform, "ADMIN PANEL", new Vector2(0f, 800f), 80, new Color(1f, 0.3f, 0.3f), FontStyle.Bold);
            CreateText(_panel.transform, "Developer Debug Mode", new Vector2(0f, 700f), 30, new Color(1f, 0.9f, 0.6f), FontStyle.Italic);

            float y = 500f;

            CreateGlassButton(_panel.transform, "+1000 COINS", new Vector2(0f, y), new Color(1f, 0.82f, 0.3f), () => {
                if (PlayerProgressManager.Instance != null) { PlayerProgressManager.Instance.AddCoins(1000); Debug.Log("[Admin] +1000 coins"); }
            });
            y -= 130f;

            CreateGlassButton(_panel.transform, "+100 GEMS", new Vector2(0f, y), new Color(0.5f, 0.8f, 1f), () => {
                if (PlayerProgressManager.Instance != null) { PlayerProgressManager.Instance.AddGems(100); Debug.Log("[Admin] +100 gems"); }
            });
            y -= 130f;

            CreateGlassButton(_panel.transform, "UNLOCK ALL LEVELS", new Vector2(0f, y), new Color(0.5f, 0.9f, 0.5f), () => {
                if (PlayerProgressManager.Instance != null) {
                    PlayerProgressManager.Instance.HighestLevelUnlocked = 100;
                    PlayerProgressManager.Instance.Save();
                    Debug.Log("[Admin] All levels unlocked");
                }
            });
            y -= 130f;

            CreateGlassButton(_panel.transform, "UNLOCK ALL AVATARS", new Vector2(0f, y), new Color(0.85f, 0.5f, 0.9f), () => {
                for (int i = 0; i < 12; i++) PlayerPrefs.SetInt("AvatarOwned_" + i, 1);
                PlayerPrefs.Save();
                Debug.Log("[Admin] All avatars unlocked");
            });
            y -= 130f;

            CreateGlassButton(_panel.transform, "GOD MODE TOGGLE", new Vector2(0f, y), new Color(1f, 0.5f, 0.5f), () => {
                GodMode = !GodMode;
                PlayerPrefs.SetInt(KEY_GOD_MODE, GodMode ? 1 : 0);
                PlayerPrefs.Save();
                if (_godModeStatusText != null) {
                    _godModeStatusText.text = "GOD MODE: " + (GodMode ? "ON" : "OFF");
                    _godModeStatusText.color = GodMode ? new Color(0.3f, 1f, 0.3f) : new Color(1f, 0.5f, 0.5f);
                }
                Debug.Log($"[Admin] God Mode = {GodMode}");
            });
            y -= 130f;

            CreateGlassButton(_panel.transform, "RESET ALL DATA", new Vector2(0f, y), new Color(0.9f, 0.2f, 0.2f), () => {
                if (PlayerProgressManager.Instance != null) { PlayerProgressManager.Instance.ResetAll(); Debug.Log("[Admin] All data reset"); }
            });
            y -= 150f;

            _godModeStatusText = CreateText(_panel.transform, "GOD MODE: " + (GodMode ? "ON" : "OFF"), new Vector2(0f, y), 36, GodMode ? new Color(0.3f, 1f, 0.3f) : new Color(1f, 0.5f, 0.5f), FontStyle.Bold);

            CreateGlassButton(_panel.transform, "CLOSE", new Vector2(0f, -600f), new Color(0.5f, 0.5f, 0.5f), Hide);

            _panel.SetActive(false);
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        public static void TryUnlock()
        {
            if (Instance == null) return;
            float now = Time.unscaledTime;
            if (now - Instance._lastTapTime > TAP_WINDOW) Instance._titleTaps = 0;
            Instance._lastTapTime = now;
            Instance._titleTaps++;

            if (Instance._titleTaps >= REQUIRED_TAPS)
            {
                Instance._titleTaps = 0;
                Instance.Show();
                Debug.Log("[Admin] Admin Panel Unlocked!");
            }
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

        private void CreateGlassButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.CreateRoundedSprite(Color.white, 128, 16);
            img.type = Image.Type.Sliced;
            img.color = new Color(0.1f, 0.15f, 0.25f, 0.9f);
            var outline = obj.AddComponent<Outline>();
            outline.effectColor = color;
            outline.effectDistance = new Vector2(2f, -2f);
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(700f, 110f);
            CreateText(obj.transform, label, Vector2.zero, 34, color, FontStyle.Bold);
        }
    }
}
