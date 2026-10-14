using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class NotificationBadgeUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _badge;

        void Start() { Invoke(nameof(Setup), 1.1f); }

        private void Setup()
        {
            BuildCanvas();
            BuildBadge();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("BadgeCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 515;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildBadge()
        {
            _badge = new GameObject("NewBadge");
            _badge.transform.SetParent(_canvas.transform, false);

            var img = _badge.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.25f, 0.25f), 128);
            img.raycastTarget = false;

            var rt = _badge.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(0f, 1f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(120f, -200f);
            rt.sizeDelta = new Vector2(50f, 50f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(_badge.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = "!";
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

            var checker = _badge.AddComponent<HomeVisibilityCheck>();
            checker.Target = _badge;

            UpdateBadge();
        }

        private void UpdateBadge()
        {
            if (_badge == null) return;

            bool hasNew = false;

            // Check if daily reward not claimed today
            string lastClaim = PlayerPrefs.GetString("Daily_LastClaim", "");
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            if (string.IsNullOrEmpty(lastClaim)) hasNew = true;

            // Check daily challenge
            string lastChallenge = PlayerPrefs.GetString("DailyChallenge_LastDate", "");
            if (lastChallenge != today) hasNew = true;

            _badge.SetActive(hasNew);
        }

        void Update()
        {
            if (Time.frameCount % 60 == 0) UpdateBadge();
        }
    }
}