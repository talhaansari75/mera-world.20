using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class MultiplayerMenuUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private Text _statusText;

        private const string KEY_BOT_RACE = "BotRace_Enabled";

        void Start() { Invoke(nameof(Setup), 1f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("MultiplayerCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 755;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("MultiplayerPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "MULTIPLAYER", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Bot Race toggle
            bool botRace = PlayerPrefs.GetInt(KEY_BOT_RACE, 0) == 1;

            CreateText(_panel.transform, "BOT RACE MODE", new Vector2(0f, 500f), 42,
                Color.white, FontStyle.Bold);

            CreateText(_panel.transform, "Race against an AI opponent.\nBot's name and speed look real!",
                new Vector2(0f, 400f), 26, new Color(0.80f, 0.85f, 1f), FontStyle.Normal);

            CreateToggleButton(_panel.transform, botRace ? "ENABLED" : "DISABLED",
                new Vector2(0f, 250f), botRace ? new Color(0.25f, 0.75f, 0.35f) : new Color(0.4f, 0.4f, 0.5f),
                OnToggleBotRace);

            // Online PvP (Coming Soon)
            CreateText(_panel.transform, "ONLINE PVP", new Vector2(0f, 50f), 42,
                new Color(0.70f, 0.70f, 0.80f), FontStyle.Bold);

            CreateText(_panel.transform, "Coming in a future update!",
                new Vector2(0f, -50f), 28, new Color(0.85f, 0.75f, 0.55f), FontStyle.Italic);

            CreateText(_panel.transform, "Race against players worldwide\nwith matchmaking and ranking.",
                new Vector2(0f, -150f), 24, new Color(0.65f, 0.70f, 0.85f), FontStyle.Normal);

            _statusText = CreateText(_panel.transform, "", new Vector2(0f, -700f), 24,
                new Color(0.75f, 1f, 0.75f), FontStyle.Normal);

            _panel.SetActive(false);
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
            rt.sizeDelta = new Vector2(900f, 100f);
            return txt;
        }

        private void CreateToggleButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject("Toggle");
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
            rt.sizeDelta = new Vector2(500f, 120f);
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 40;
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

        private void OnToggleBotRace()
        {
            int current = PlayerPrefs.GetInt(KEY_BOT_RACE, 0);
            int next = current == 1 ? 0 : 1;
            PlayerPrefs.SetInt(KEY_BOT_RACE, next);
            PlayerPrefs.Save();

            // Rebuild to refresh button state
            foreach (Transform child in _panel.transform)
                if (child.name == "Toggle") Destroy(child.gameObject);

            bool botRace = next == 1;
            CreateToggleButton(_panel.transform, botRace ? "ENABLED" : "DISABLED",
                new Vector2(0f, 250f), botRace ? new Color(0.25f, 0.75f, 0.35f) : new Color(0.4f, 0.4f, 0.5f),
                OnToggleBotRace);

            if (_statusText != null)
                _statusText.text = botRace ? "Bot Race will be active!" : "Bot Race disabled";
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

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
    }
}