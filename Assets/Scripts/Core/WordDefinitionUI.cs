using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WordDefinitionUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private GameObject _panel;
        private Text _wordText;
        private Text _definitionText;

        private static readonly Dictionary<string, string> Definitions = new Dictionary<string, string>
        {
            { "CAT", "A small domesticated carnivorous mammal." },
            { "DOG", "A domesticated carnivorous mammal." },
            { "SUN", "The star around which the earth orbits." },
            { "MOON", "The natural satellite of the earth." },
            { "STAR", "A fixed luminous point in the night sky." },
            { "FISH", "A limbless cold-blooded animal with gills." },
            { "BIRD", "A warm-blooded egg-laying vertebrate." },
            { "TREE", "A woody perennial plant with a trunk." },
            { "BOOK", "A written or printed work of pages." },
            { "GAME", "An activity engaged in for amusement." },
            { "HOME", "The place where one lives permanently." },
            { "LOVE", "An intense feeling of deep affection." },
            { "TIME", "The indefinite continued progress of existence." },
            { "APPLE", "A round fruit with red or green skin." },
            { "BREAD", "A staple food made of flour and water." },
            { "HONEY", "A sweet, sticky substance made by bees." },
            { "DREAM", "A series of thoughts during sleep." },
            { "OCEAN", "A very large expanse of sea." },
            { "MUSIC", "Vocal or instrumental sounds combined." },
            { "DANCE", "Move rhythmically to music." },
        };

        void Start()
        {
            Invoke(nameof(Setup), 0.8f);
        }

        private void Setup()
        {
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            BuildCanvas();
            BuildPanel();

            if (SelectionManager != null)
                SelectionManager.OnWordFound += OnWordFound;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("DefinitionCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 295;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("DefinitionPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.10f, 0.20f, 0.35f, 0.95f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0f);
            rt.anchorMax = new Vector2(0.5f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = new Vector2(0f, 400f);
            rt.sizeDelta = new Vector2(900f, 200f);

            _wordText = CreateText(_panel.transform, "WORD", new Vector2(0f, 60f), 40,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            _definitionText = CreateText(_panel.transform, "Definition...", new Vector2(0f, -40f), 26,
                Color.white, FontStyle.Normal);

            _panel.SetActive(false);
        }

        private void OnWordFound(string word)
        {
            if (string.IsNullOrEmpty(word)) return;
            word = word.ToUpperInvariant();
            if (!Definitions.ContainsKey(word)) return;

            StopAllCoroutines();
            StartCoroutine(ShowDefinition(word));
        }

        private IEnumerator ShowDefinition(string word)
        {
            _wordText.text = word;
            _definitionText.text = Definitions[word];

            _panel.SetActive(true);

            // Fade in
            float duration = 0.3f;
            float elapsed = 0f;
            var bg = _panel.GetComponent<Image>();

            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                var c = bg.color; c.a = 0.95f * t; bg.color = c;
                yield return null;
            }

            yield return new WaitForSecondsRealtime(3f);

            elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                var c = bg.color; c.a = 0.95f * (1f - t); bg.color = c;
                yield return null;
            }

            _panel.SetActive(false);
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
            rt.sizeDelta = new Vector2(850f, 100f);
            return txt;
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}