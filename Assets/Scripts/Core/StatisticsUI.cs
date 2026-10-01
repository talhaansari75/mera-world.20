using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class StatisticsUI : MonoBehaviour
    {
        public static StatisticsUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Text _statsText;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("StatsCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 920;

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

            CreateText("STATISTICS", new Vector2(0f, 830f), 60, new Color(1f, 0.85f, 0.30f));
            CreateSmallButton("BACK", new Vector2(-380f, 830f), new Color(0.5f, 0.5f, 0.55f), Hide);

            var statsObj = new GameObject("StatsText");
            statsObj.transform.SetParent(_panel.transform, false);
            _statsText = statsObj.AddComponent<Text>();
            _statsText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _statsText.fontSize = 32;
            _statsText.color = Color.white;
            _statsText.alignment = TextAnchor.UpperCenter;
            _statsText.lineSpacing = 1.5f;
            _statsText.raycastTarget = false;
            var srt = statsObj.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 0.5f);
            srt.anchorMax = new Vector2(0.5f, 0.5f);
            srt.pivot = new Vector2(0.5f, 0.5f);
            srt.anchoredPosition = new Vector2(0f, 0f);
            srt.sizeDelta = new Vector2(900f, 1400f);

            _panel.SetActive(false);
        }

        public void Show()
        {
            if (_panel == null) return;
            RefreshStats();
            _panel.SetActive(true);
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private void RefreshStats()
        {
            var p = PlayerProgressManager.Instance;
            int coins = p != null ? p.Coins : 0;
            int level = p != null ? p.CurrentLevel : 1;
            int highest = p != null ? p.HighestLevelUnlocked : 1;
            int totalStars = p != null ? p.TotalStars : 0;

            int wordsFound = PlayerPrefs.GetInt("TotalWordsFound", 0);
            int gamesPlayed = PlayerPrefs.GetInt("GamesPlayed", 0);

            _statsText.text =
                "Total Coins: " + coins + "\n\n" +
                "Current Level: " + level + "\n\n" +
                "Highest Level: " + highest + "\n\n" +
                "Words Found: " + wordsFound + "\n\n" +
                "Total Stars: " + totalStars + "\n\n" +
                "Games Played: " + gamesPlayed;
        }

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
            var obj = new GameObject("Btn_" + label);
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
            rt.sizeDelta = new Vector2(220f, 80f);
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
