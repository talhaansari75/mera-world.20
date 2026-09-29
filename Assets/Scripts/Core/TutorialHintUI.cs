using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class TutorialHintUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;

        private Canvas _canvas;
        private GameObject _panel;

        void Start()
        {
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            Invoke(nameof(Setup), 1.2f);
        }

        private void Setup()
        {
            if (GameManager == null) return;
            if (GameManager.CurrentLevel != 1) return;

            BuildCanvas();
            BuildPanel();
            StartCoroutine(ShowTutorial());
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("TutorialCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 380;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("TutorialPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.10f, 0.15f, 0.30f, 0.95f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 0f);
            rt.sizeDelta = new Vector2(800f, 400f);

            CreateText(_panel.transform, "HOW TO PLAY", new Vector2(0f, 120f), 50,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateText(_panel.transform, "1. Swipe across letters\n" +
                "2. Form a word from the list\n" +
                "3. Find all words to win!",
                new Vector2(0f, -20f), 30, Color.white, FontStyle.Normal);

            _panel.SetActive(false);
        }

        private IEnumerator ShowTutorial()
        {
            yield return new WaitForSecondsRealtime(0.5f);
            _panel.SetActive(true);

            yield return new WaitForSecondsRealtime(4f);
            _panel.SetActive(false);

            if (_canvas != null) Destroy(_canvas.gameObject);
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
            rt.sizeDelta = new Vector2(700f, 200f);
            return txt;
        }
    }
}