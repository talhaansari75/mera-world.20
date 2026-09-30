using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class StatisticsUI : MonoBehaviour
    {
        public static StatisticsUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.4f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("StatisticsCanvas");
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

            CreateText(_panel.transform, "STATISTICS", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), Hide);

            _panel.SetActive(false);
        }

        public void Show()
        {
            RebuildContent();
            _panel.SetActive(true);
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private void RebuildContent()
        {
            // Remove old content (everything except title + back button)
            for (int i = _panel.transform.childCount - 1; i >= 0; i--)
            {
                var c = _panel.transform.GetChild(i);
                if (c.name == "Text" || c.name.StartsWith("Btn_")) continue;
                Destroy(c.gameObject);
            }

            var stats = StatisticsManager.Instance;
            if (stats == null) return;

            float y = 650f;
            float step = 90f;

            CreateStatRow("Words Found", stats.TotalWordsFound.ToString(), y); y -= step;
            CreateStatRow("Levels Completed", stats.TotalLevelsCompleted.ToString(), y); y -= step;
            CreateStatRow("Perfect Levels", stats.PerfectLevels.ToString(), y); y -= step;
            CreateStatRow("Hints Used", stats.TotalHintsUsed.ToString(), y); y -= step;
            CreateStatRow("Coins Earned", stats.TotalCoinsEarned.ToString(), y); y -= step;
            CreateStatRow("Multiplayer Wins", stats.MultiplayerWins.ToString(), y); y -= step;
            CreateStatRow("Multiplayer Losses", stats.MultiplayerLosses.ToString(), y); y -= step;
            CreateStatRow("Current Streak", stats.CurrentStreak + " days", y); y -= step;
            CreateStatRow("Best Streak", stats.BestStreak + " days", y); y -= step;
            CreateStatRow("Games Played", stats.TotalGamesPlayed.ToString(), y); y -= step;

            var ts = stats.GetTotalPlayTime();
            CreateStatRow("Total Playtime", $"{ts.Hours}h {ts.Minutes}m", y); y -= step;
        }

        private void CreateStatRow(string label, string value, float y)
        {
            var row = new GameObject("Row");
            row.transform.SetParent(_panel.transform, false);

            var bg = row.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.14f, 0.20f, 0.35f), 128, 20);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = row.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(900f, 70f);

            // Label (left)
            var lObj = new GameObject("Label");
            lObj.transform.SetParent(row.transform, false);
            var lt = lObj.AddComponent<Text>();
            lt.text = label;
            lt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            lt.fontSize = 30;
            lt.fontStyle = FontStyle.Normal;
            lt.color = new Color(0.85f, 0.90f, 1f);
            lt.alignment = TextAnchor.MiddleLeft;
            lt.raycastTarget = false;
            var lRt = lObj.GetComponent<RectTransform>();
            lRt.anchorMin = Vector2.zero;
            lRt.anchorMax = new Vector2(0.6f, 1f);
            lRt.offsetMin = new Vector2(30f, 0f);
            lRt.offsetMax = Vector2.zero;

            // Value (right)
            var vObj = new GameObject("Value");
            vObj.transform.SetParent(row.transform, false);
            var vt = vObj.AddComponent<Text>();
            vt.text = value;
            vt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            vt.fontSize = 32;
            vt.fontStyle = FontStyle.Bold;
            vt.color = new Color(1f, 0.85f, 0.30f);
            vt.alignment = TextAnchor.MiddleRight;
            vt.raycastTarget = false;
            var vRt = vObj.GetComponent<RectTransform>();
            vRt.anchorMin = new Vector2(0.4f, 0f);
            vRt.anchorMax = Vector2.one;
            vRt.offsetMin = Vector2.zero;
            vRt.offsetMax = new Vector2(-30f, 0f);
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