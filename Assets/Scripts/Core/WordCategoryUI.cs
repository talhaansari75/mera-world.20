using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WordCategoryUI : MonoBehaviour
    {
        [Header("References")]
        public GameManager GameManager;

        private Canvas _canvas;
        private Text _categoryText;

        private static readonly Dictionary<string, string> CategoryMap = new Dictionary<string, string>
        {
            { "CAT", "ANIMALS" }, { "DOG", "ANIMALS" }, { "FISH", "ANIMALS" }, { "BIRD", "ANIMALS" },
            { "SUN", "NATURE" }, { "MOON", "NATURE" }, { "STAR", "NATURE" }, { "TREE", "NATURE" },
            { "BOOK", "OBJECTS" }, { "GAME", "OBJECTS" }, { "HOME", "OBJECTS" },
            { "APPLE", "FOOD" }, { "BREAD", "FOOD" }, { "HONEY", "FOOD" },
            { "DANCE", "ACTIONS" }, { "PLAY", "ACTIONS" }, { "LOVE", "FEELINGS" },
        };

        void Start()
        {
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            BuildCanvas();
            UpdateCategory();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("CategoryCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 57;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            var textObj = new GameObject("CategoryText");
            textObj.transform.SetParent(_canvas.transform, false);
            _categoryText = textObj.AddComponent<Text>();
            _categoryText.text = "WORDS";
            _categoryText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _categoryText.fontSize = 26;
            _categoryText.fontStyle = FontStyle.Bold;
            _categoryText.color = new Color(1f, 0.90f, 0.55f);
            _categoryText.alignment = TextAnchor.MiddleCenter;
            _categoryText.raycastTarget = false;

            // Gold shadow for premium look
            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.7f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var rt = textObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -230f);
            rt.sizeDelta = new Vector2(400f, 40f);
        }

        private void UpdateCategory()
        {
            if (GameManager == null || GameManager.Words == null || GameManager.Words.Count == 0)
                return;

            var categoryCounts = new Dictionary<string, int>();

            foreach (var w in GameManager.Words)
            {
                string word = w.ToUpperInvariant();
                string cat = CategoryMap.ContainsKey(word) ? CategoryMap[word] : "MIXED";
                if (categoryCounts.ContainsKey(cat)) categoryCounts[cat]++;
                else categoryCounts[cat] = 1;
            }

            string best = "WORDS";
            int bestCount = 0;
            foreach (var kv in categoryCounts)
            {
                if (kv.Value > bestCount) { bestCount = kv.Value; best = kv.Key; }
            }

            _categoryText.text = $"CATEGORY: {best}";
        }
    }
}
