using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WordListUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private readonly Dictionary<string, Text> _wordTexts = new Dictionary<string, Text>();
        private readonly HashSet<string> _foundWords = new HashSet<string>();
        private Transform _panelTransform;

        void Start()
        {
            Invoke(nameof(BuildUI), 0.2f);
        }

        private void BuildUI()
        {
            if (GameManager == null) return;

            BuildCanvas();
            BuildPanel();
            BuildTitle();
            BuildWords();

            if (SelectionManager != null)
                SelectionManager.OnWordFound += OnWordFound;

            Debug.Log($"WordListUI: Built with {GameManager.Words.Count} words.");
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("WordListCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 100;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            var panelObj = new GameObject("Panel");
            panelObj.transform.SetParent(_canvas.transform, false);

            var img = panelObj.AddComponent<Image>();
            img.color = new Color(0.08f, 0.14f, 0.28f, 0.95f);

            var rt = panelObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 0f);
            rt.anchorMax = new Vector2(1f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = new Vector2(0f, 180f);
            rt.sizeDelta = new Vector2(-40f, 230f);

            _panelTransform = panelObj.transform;
        }

        private void BuildTitle()
        {
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_panelTransform, false);

            var text = titleObj.AddComponent<Text>();
            text.text = "WORDS TO FIND";
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.fontSize = 30;
            text.fontStyle = FontStyle.Bold;
            text.color = new Color(1f, 0.85f, 0.3f);
            text.alignment = TextAnchor.MiddleCenter;
            text.supportRichText = true;

            var rt = titleObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -10f);
            rt.sizeDelta = new Vector2(0f, 45f);
        }

        private void BuildWords()
        {
            int count = GameManager.Words.Count;
            int cols = 4;

            for (int i = 0; i < count; i++)
            {
                var word = GameManager.Words[i].ToUpperInvariant();
                int row = i / cols;
                int col = i % cols;

                var lineObj = new GameObject($"Word_{word}");
                lineObj.transform.SetParent(_panelTransform, false);

                var text = lineObj.AddComponent<Text>();
                text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                text.text = $"[ ] {word}";
                text.fontSize = 26;
                text.color = Color.white;
                text.alignment = TextAnchor.MiddleCenter;
                text.supportRichText = true;

                var rt = lineObj.GetComponent<RectTransform>();
                rt.anchorMin = new Vector2(col / (float)cols, 1f);
                rt.anchorMax = new Vector2((col + 1) / (float)cols, 1f);
                rt.pivot = new Vector2(0.5f, 1f);
                rt.anchoredPosition = new Vector2(0f, -65f - row * 55f);
                rt.sizeDelta = new Vector2(0f, 50f);

                _wordTexts[word] = text;
            }
        }

        private void OnWordFound(string word)
        {
            if (string.IsNullOrEmpty(word)) return;
            word = word.ToUpperInvariant();
            if (_foundWords.Contains(word)) return;

            _foundWords.Add(word);

            if (_wordTexts.TryGetValue(word, out var text))
            {
                text.text = $"[X] {word}";
                text.color = new Color(0.45f, 0.90f, 0.45f);
            }
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}