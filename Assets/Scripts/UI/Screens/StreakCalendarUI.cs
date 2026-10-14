using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class StreakCalendarUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;

        private const string KEY_STREAK_DATA = "StreakData";

        void Start() { Invoke(nameof(Setup), 1.2f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("StreakCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 730;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("StreakPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "PLAY STREAK", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            int streak = PlayerPrefs.GetInt("Stats_DayStreak", 0);
            CreateText(_panel.transform, $"{streak} DAYS", new Vector2(0f, 650f), 80,
                new Color(1f, 0.90f, 0.55f), FontStyle.Bold);

            CreateText(_panel.transform, "Current streak",
                new Vector2(0f, 560f), 30, new Color(0.85f, 0.90f, 1f), FontStyle.Normal);

            // 7-day calendar row
            string streakData = PlayerPrefs.GetString(KEY_STREAK_DATA, "");
            string[] days = streakData.Split(',');

            for (int i = 0; i < 7; i++)
            {
                bool played = i < days.Length && days[i] == "1";
                CreateDayBox(i, played, 400f - i * 100f);
            }

            _panel.SetActive(false);
        }

        private void CreateDayBox(int index, bool played, float y)
        {
            var dayObj = new GameObject($"Day_{index}");
            dayObj.transform.SetParent(_panel.transform, false);

            var img = dayObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(
                played ? new Color(0.25f, 0.75f, 0.35f) : new Color(0.20f, 0.22f, 0.30f),
                128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var rt = dayObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(750f, 80f);

            var txtObj = new GameObject("Text");
            txtObj.transform.SetParent(dayObj.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = played ? $"DAY {index + 1}  ✓" : $"DAY {index + 1}";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
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
    }
}