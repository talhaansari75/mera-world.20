using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class NotificationCenterUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _panel;

        private const string KEY_NOTIF_COUNT = "Notif_UnreadCount";

        public class NotifItem
        {
            public string Title;
            public string Body;
            public string Time;
            public Color Color;
        }

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 1.4f);
        }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("NotifCenterCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 785;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("NotifPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "NOTIFICATIONS", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            var notifications = new List<NotifItem>
            {
                new NotifItem {
                    Title = "Daily Reward Ready!",
                    Body = "Claim your daily coins now",
                    Time = "Just now",
                    Color = new Color(0.85f, 0.55f, 0.20f)
                },
                new NotifItem {
                    Title = "New Tournament Started",
                    Body = "Compete with players worldwide",
                    Time = "2 hours ago",
                    Color = new Color(0.75f, 0.30f, 0.30f)
                },
                new NotifItem {
                    Title = "Milestone Reached!",
                    Body = "You've unlocked new rewards",
                    Time = "Yesterday",
                    Color = new Color(0.30f, 0.65f, 0.85f)
                },
                new NotifItem {
                    Title = "Friend Request",
                    Body = "Alex_92 wants to be your friend",
                    Time = "2 days ago",
                    Color = new Color(0.55f, 0.35f, 0.75f)
                },
                new NotifItem {
                    Title = "Season Ends Soon",
                    Body = "3 days left — claim your rewards!",
                    Time = "3 days ago",
                    Color = new Color(0.85f, 0.55f, 0.25f)
                },
            };

            float y = 550f;
            foreach (var n in notifications)
            {
                CreateNotifCard(n, y);
                y -= 170f;
            }

            // Mark all as read
            CreateBigButton(_panel.transform, "MARK ALL READ", new Vector2(0f, -700f),
                new Vector2(500f, 100f), new Color(0.30f, 0.55f, 0.85f), OnMarkRead);

            _panel.SetActive(false);
        }

        private void CreateNotifCard(NotifItem n, float y)
        {
            var cardObj = new GameObject("Notif");
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
            rt.sizeDelta = new Vector2(880f, 140f);

            // Colored dot
            var dotObj = new GameObject("Dot");
            dotObj.transform.SetParent(cardObj.transform, false);
            var dotImg = dotObj.AddComponent<Image>();
            dotImg.sprite = UISpriteFactory.Create3DSphereSprite(n.Color, 48);
            dotImg.raycastTarget = false;
            var dotRt = dotObj.GetComponent<RectTransform>();
            dotRt.anchorMin = new Vector2(0f, 0.5f);
            dotRt.anchorMax = new Vector2(0f, 0.5f);
            dotRt.pivot = new Vector2(0f, 0.5f);
            dotRt.anchoredPosition = new Vector2(25f, 15f);
            dotRt.sizeDelta = new Vector2(40f, 40f);

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(cardObj.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = n.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 32;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0f, 0.5f);
            titleRt.anchorMax = new Vector2(1f, 1f);
            titleRt.pivot = new Vector2(0f, 0.5f);
            titleRt.anchoredPosition = new Vector2(80f, 0f);
            titleRt.sizeDelta = new Vector2(-100f, 60f);

            // Body
            var bodyObj = new GameObject("Body");
            bodyObj.transform.SetParent(cardObj.transform, false);
            var bodyTxt = bodyObj.AddComponent<Text>();
            bodyTxt.text = n.Body;
            bodyTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            bodyTxt.fontSize = 24;
            bodyTxt.color = new Color(0.80f, 0.85f, 1f);
            bodyTxt.alignment = TextAnchor.MiddleLeft;
            bodyTxt.raycastTarget = false;
            var bodyRt = bodyObj.GetComponent<RectTransform>();
            bodyRt.anchorMin = new Vector2(0f, 0f);
            bodyRt.anchorMax = new Vector2(1f, 0.5f);
            bodyRt.pivot = new Vector2(0f, 0.5f);
            bodyRt.anchoredPosition = new Vector2(80f, 0f);
            bodyRt.sizeDelta = new Vector2(-180f, 60f);

            // Time
            var timeObj = new GameObject("Time");
            timeObj.transform.SetParent(cardObj.transform, false);
            var timeTxt = timeObj.AddComponent<Text>();
            timeTxt.text = n.Time;
            timeTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            timeTxt.fontSize = 20;
            timeTxt.fontStyle = FontStyle.Italic;
            timeTxt.color = new Color(0.65f, 0.70f, 0.85f);
            timeTxt.alignment = TextAnchor.MiddleRight;
            timeTxt.raycastTarget = false;
            var timeRt = timeObj.GetComponent<RectTransform>();
            timeRt.anchorMin = new Vector2(1f, 0.5f);
            timeRt.anchorMax = new Vector2(1f, 0.5f);
            timeRt.pivot = new Vector2(1f, 0.5f);
            timeRt.anchoredPosition = new Vector2(-20f, 0f);
            timeRt.sizeDelta = new Vector2(200f, 40f);
        }

        private void OnMarkRead()
        {
            PlayerPrefs.SetInt(KEY_NOTIF_COUNT, 0);
            PlayerPrefs.Save();
            Debug.Log("[Notifications] All marked as read");
            Hide();
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

        private void CreateBigButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
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
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 36;
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