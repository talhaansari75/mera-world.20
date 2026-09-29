using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AchievementToastUI : MonoBehaviour
    {
        [Header("References")]
        public AchievementManager Manager;

        private Canvas _canvas;
        private RectTransform _toastRect;
        private Text _titleText;
        private Text _descText;
        private GameObject _toast;
        private readonly Queue<Achievement> _queue = new Queue<Achievement>();
        private bool _isShowing = false;

        void Start()
        {
            Invoke(nameof(Setup), 0.5f);
        }

        private void Setup()
        {
            if (Manager == null) Manager = AchievementManager.Instance;
            if (Manager == null) return;

            BuildCanvas();
            BuildToast();

            Manager.OnAchievementUnlocked += OnAchievementUnlocked;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AchievementToastCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 450;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildToast()
        {
            _toast = new GameObject("Toast");
            _toast.transform.SetParent(_canvas.transform, false);

            var bg = _toast.AddComponent<Image>();
            bg.color = new Color(0.15f, 0.45f, 0.25f, 0.98f);

            _toastRect = _toast.GetComponent<RectTransform>();
            _toastRect.anchorMin = new Vector2(0.5f, 1f);
            _toastRect.anchorMax = new Vector2(0.5f, 1f);
            _toastRect.pivot = new Vector2(0.5f, 1f);
            _toastRect.anchoredPosition = new Vector2(0f, 150f); // off-screen
            _toastRect.sizeDelta = new Vector2(900f, 180f);

            // Gold left border
            var border = new GameObject("Border");
            border.transform.SetParent(_toast.transform, false);
            var borderImg = border.AddComponent<Image>();
            borderImg.color = new Color(1f, 0.85f, 0.30f);
            var borderRt = border.GetComponent<RectTransform>();
            borderRt.anchorMin = new Vector2(0f, 0f);
            borderRt.anchorMax = new Vector2(0f, 1f);
            borderRt.pivot = new Vector2(0f, 0.5f);
            borderRt.anchoredPosition = Vector2.zero;
            borderRt.sizeDelta = new Vector2(12f, 0f);

            // Icon
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(_toast.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.color = new Color(1f, 0.85f, 0.30f);
            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0f, 0.5f);
            iconRt.anchoredPosition = new Vector2(30f, 0f);
            iconRt.sizeDelta = new Vector2(100f, 100f);

            var iconTxtObj = new GameObject("Trophy");
            iconTxtObj.transform.SetParent(iconObj.transform, false);
            var iconTxt = iconTxtObj.AddComponent<Text>();
            iconTxt.text = "★";
            iconTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            iconTxt.fontSize = 70;
            iconTxt.fontStyle = FontStyle.Bold;
            iconTxt.color = new Color(0.10f, 0.20f, 0.10f);
            iconTxt.alignment = TextAnchor.MiddleCenter;
            var iconTxtRt = iconTxtObj.GetComponent<RectTransform>();
            iconTxtRt.anchorMin = Vector2.zero;
            iconTxtRt.anchorMax = Vector2.one;
            iconTxtRt.offsetMin = Vector2.zero;
            iconTxtRt.offsetMax = Vector2.zero;

            // Small "UNLOCKED" text
            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(_toast.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = "ACHIEVEMENT UNLOCKED!";
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 26;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = new Color(1f, 0.85f, 0.30f);
            labelTxt.alignment = TextAnchor.MiddleLeft;
            var labelRt = labelObj.GetComponent<RectTransform>();
            labelRt.anchorMin = new Vector2(0f, 1f);
            labelRt.anchorMax = new Vector2(1f, 1f);
            labelRt.pivot = new Vector2(0f, 1f);
            labelRt.anchoredPosition = new Vector2(150f, -25f);
            labelRt.sizeDelta = new Vector2(-180f, 35f);

            // Title text
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_toast.transform, false);
            _titleText = titleObj.AddComponent<Text>();
            _titleText.text = "First Word";
            _titleText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _titleText.fontSize = 46;
            _titleText.fontStyle = FontStyle.Bold;
            _titleText.color = Color.white;
            _titleText.alignment = TextAnchor.MiddleLeft;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0f, 0.5f);
            titleRt.anchorMax = new Vector2(1f, 0.5f);
            titleRt.pivot = new Vector2(0f, 0.5f);
            titleRt.anchoredPosition = new Vector2(150f, 5f);
            titleRt.sizeDelta = new Vector2(-180f, 55f);

            // Reward text
            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(_toast.transform, false);
            _descText = descObj.AddComponent<Text>();
            _descText.text = "+10 coins";
            _descText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _descText.fontSize = 30;
            _descText.fontStyle = FontStyle.Bold;
            _descText.color = new Color(0.65f, 1f, 0.65f);
            _descText.alignment = TextAnchor.MiddleLeft;
            var descRt = descObj.GetComponent<RectTransform>();
            descRt.anchorMin = new Vector2(0f, 0f);
            descRt.anchorMax = new Vector2(1f, 0f);
            descRt.pivot = new Vector2(0f, 0f);
            descRt.anchoredPosition = new Vector2(150f, 25f);
            descRt.sizeDelta = new Vector2(-180f, 35f);

            _toast.SetActive(false);
        }

        private void OnAchievementUnlocked(Achievement a)
        {
            _queue.Enqueue(a);
            if (!_isShowing)
                StartCoroutine(ProcessQueue());
        }

        private IEnumerator ProcessQueue()
        {
            _isShowing = true;

            while (_queue.Count > 0)
            {
                var a = _queue.Dequeue();
                yield return ShowToast(a);
                yield return new WaitForSecondsRealtime(0.4f);
            }

            _isShowing = false;
        }

        private IEnumerator ShowToast(Achievement a)
        {
            _titleText.text = a.Title;
            _descText.text = $"+{a.RewardCoins} coins";

            _toast.SetActive(true);

            // Slide in
            float duration = 0.4f;
            float elapsed = 0f;
            Vector2 startPos = new Vector2(0f, 150f);
            Vector2 endPos = new Vector2(0f, -20f);

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float smoothT = Mathf.SmoothStep(0f, 1f, t);
                _toastRect.anchoredPosition = Vector2.Lerp(startPos, endPos, smoothT);
                yield return null;
            }

            // Hold
            yield return new WaitForSecondsRealtime(2.5f);

            // Slide out
            elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                float smoothT = Mathf.SmoothStep(0f, 1f, t);
                _toastRect.anchoredPosition = Vector2.Lerp(endPos, startPos, smoothT);
                yield return null;
            }

            _toast.SetActive(false);
        }

        void OnDestroy()
        {
            if (Manager != null)
                Manager.OnAchievementUnlocked -= OnAchievementUnlocked;
        }
    }
}