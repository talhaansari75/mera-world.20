using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class NewsFeedUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;

        private class NewsItem
        {
            public string Date;
            public string Title;
            public string Body;
            public Color Color;
        }

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("NewsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 790;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("NewsPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "NEWS & UPDATES", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            var news = new List<NewsItem>
            {
                new NewsItem {
                    Date = "Sep 29, 2026",
                    Title = "Season 1 Launched!",
                    Body = "Earn rewards across 30 tiers. Rank up and unlock exclusive pets.",
                    Color = new Color(1f, 0.85f, 0.30f)
                },
                new NewsItem {
                    Date = "Sep 25, 2026",
                    Title = "Daily Challenge System",
                    Body = "Complete a new challenge every day for bonus coins!",
                    Color = new Color(0.55f, 0.35f, 0.85f)
                },
                new NewsItem {
                    Date = "Sep 20, 2026",
                    Title = "Bot Race Mode Added",
                    Body = "Race against AI opponents. Can you beat them all?",
                    Color = new Color(0.75f, 0.30f, 0.30f)
                },
                new NewsItem {
                    Date = "Sep 15, 2026",
                    Title = "50 Levels Available",
                    Body = "Dive into new worlds with 30 additional handcrafted levels.",
                    Color = new Color(0.30f, 0.65f, 0.85f)
                },
                new NewsItem {
                    Date = "Sep 10, 2026",
                    Title = "Welcome to Mera World!",
                    Body = "Thank you for playing. Your word search journey begins now.",
                    Color = new Color(0.30f, 0.75f, 0.40f)
                },
            };

            float y = 550f;
            foreach (var n in news)
            {
                CreateNewsCard(n, y);
                y -= 220f;
            }

            _panel.SetActive(false);
        }

        private void CreateNewsCard(NewsItem n, float y)
        {
            var cardObj = new GameObject("NewsCard");
            cardObj.transform.SetParent(_panel.transform, false);

            var img = cardObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.18f, 0.24f, 0.38f), 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(900f, 190f);

            // Colored accent line
            var accentObj = new GameObject("Accent");
            accentObj.transform.SetParent(cardObj.transform, false);
            var accentImg = accentObj.AddComponent<Image>();
            accentImg.color = n.Color;
            accentImg.raycastTarget = false;
            var accentRt = accentObj.GetComponent<RectTransform>();
            accentRt.anchorMin = new Vector2(0f, 0f);
            accentRt.anchorMax = new Vector2(0f, 1f);
            accentRt.pivot = new Vector2(0f, 0.5f);
            accentRt.anchoredPosition = Vector2.zero;
            accentRt.sizeDelta = new Vector2(8f, 0f);

            // Date
            var dateObj = new GameObject("Date");
            dateObj.transform.SetParent(cardObj.transform, false);
            var dateTxt = dateObj.AddComponent<Text>();
            dateTxt.text = n.Date;
            dateTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            dateTxt.fontSize = 22;
            dateTxt.fontStyle = FontStyle.Italic;
            dateTxt.color = new Color(0.75f, 0.85f, 1f);
            dateTxt.alignment = TextAnchor.MiddleLeft;
            dateTxt.raycastTarget = false;
            var dateRt = dateObj.GetComponent<RectTransform>();
            dateRt.anchorMin = new Vector2(0f, 1f);
            dateRt.anchorMax = new Vector2(1f, 1f);
            dateRt.pivot = new Vector2(0f, 1f);
            dateRt.anchoredPosition = new Vector2(30f, -15f);
            dateRt.sizeDelta = new Vector2(-60f, 30f);

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(cardObj.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = n.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 32;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = n.Color;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0f, 0.5f);
            titleRt.anchorMax = new Vector2(1f, 1f);
            titleRt.pivot = new Vector2(0f, 0.5f);
            titleRt.anchoredPosition = new Vector2(30f, 0f);
            titleRt.sizeDelta = new Vector2(-60f, 55f);

            // Body
            var bodyObj = new GameObject("Body");
            bodyObj.transform.SetParent(cardObj.transform, false);
            var bodyTxt = bodyObj.AddComponent<Text>();
            bodyTxt.text = n.Body;
            bodyTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            bodyTxt.fontSize = 22;
            bodyTxt.color = new Color(0.85f, 0.90f, 1f);
            bodyTxt.alignment = TextAnchor.UpperLeft;
            bodyTxt.raycastTarget = false;
            var bodyRt = bodyObj.GetComponent<RectTransform>();
            bodyRt.anchorMin = new Vector2(0f, 0f);
            bodyRt.anchorMax = new Vector2(1f, 0.5f);
            bodyRt.pivot = new Vector2(0f, 0.5f);
            bodyRt.anchoredPosition = new Vector2(30f, -5f);
            bodyRt.sizeDelta = new Vector2(-60f, 75f);
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