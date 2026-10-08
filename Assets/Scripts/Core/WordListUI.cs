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
        private readonly Dictionary<string, Image> _wordBackgrounds = new Dictionary<string, Image>();
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
        }

        /// <summary>
        /// Scene reload ke baad forcefully rebuild karo.
        /// </summary>
        public void ForceRebuild()
        {
            Debug.Log("[WordListUI] ForceRebuild called");

            // Purana canvas destroy
            if (_canvas != null)
            {
                Destroy(_canvas.gameObject);
                _canvas = null;
            }

            // Dictionaries clear
            _wordTexts.Clear();
            _wordBackgrounds.Clear();
            _foundWords.Clear();
            _panelTransform = null;

            // Rebuild fresh
            BuildCanvas();
            BuildPanel();
            BuildTitle();
            BuildWords();

            // Re-subscribe
            if (SelectionManager != null)
            {
                SelectionManager.OnWordFound -= OnWordFound;
                SelectionManager.OnWordFound += OnWordFound;
            }

            Debug.Log("[WordListUI] ForceRebuild done, words=" + _wordTexts.Count);
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
            // Panel with 3D look
            var panelObj = new GameObject("Panel");
            panelObj.transform.SetParent(_canvas.transform, false);

            var panelImg = panelObj.AddComponent<Image>();
            var panelColor = MeraWorld.Core.TestModeTheme.IsActive 
                ? new Color(0.95f, 0.92f, 0.85f) 
                : new Color(0.22f, 0.10f, 0.45f);
            panelImg.sprite = UISpriteFactory.Create3DButtonSprite(panelColor, 256, 40);
            panelImg.type = Image.Type.Sliced;
            panelImg.color = Color.white;
            panelImg.raycastTarget = false;

            var rt = panelObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0f);
            rt.anchorMax = new Vector2(0.5f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = new Vector2(0f, 220f);
            rt.sizeDelta = new Vector2(940f, 220f);

            _panelTransform = panelObj.transform;
        }

        private void BuildTitle()
        {
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_panelTransform, false);

            var titleBg = titleObj.AddComponent<Image>();
            var titleColor = MeraWorld.Core.TestModeTheme.IsActive 
                   ? new Color(0.90f, 0.75f, 0.45f) 
                   : new Color(0.85f, 0.60f, 0.15f);
            titleBg.sprite = UISpriteFactory.Create3DButtonSprite(titleColor, 128, 30);
            titleBg.type = Image.Type.Sliced;
            titleBg.color = Color.white;
            titleBg.raycastTarget = false;

            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0.5f, 1f);
            titleRt.anchorMax = new Vector2(0.5f, 1f);
            titleRt.pivot = new Vector2(0.5f, 1f);
            titleRt.anchoredPosition = new Vector2(0f, -10f);
            titleRt.sizeDelta = new Vector2(340f, 45f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(titleObj.transform, false);
            var text = textObj.AddComponent<Text>();
            text.text = "WORDS TO FIND";
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.fontSize = 22;
            text.fontStyle = FontStyle.Bold;
            text.color = MeraWorld.Core.TestModeTheme.IsActive ? new Color(0.35f, 0.20f, 0.10f) : Color.white;
            text.alignment = TextAnchor.MiddleCenter;
            text.raycastTarget = false;

            var textShadow = textObj.AddComponent<Shadow>();
            textShadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            textShadow.effectDistance = new Vector2(2f, -2f);

            var textRt = textObj.GetComponent<RectTransform>();
            textRt.anchorMin = Vector2.zero;
            textRt.anchorMax = Vector2.one;
            textRt.offsetMin = Vector2.zero;
            textRt.offsetMax = Vector2.zero;
        }

        private void BuildWords()
        {
            int count = GameManager.Words.Count;
            int cols = 4;
            int rows = Mathf.CeilToInt((float)count / cols);

            float startY = -75f;
            float lineHeight = 55f;

            for (int i = 0; i < count; i++)
            {
                var word = GameManager.Words[i].ToUpperInvariant();
                int row = i / cols;
                int col = i % cols;

                CreateWordCell(word, row, col, cols, startY, lineHeight);
            }
        }

        private void CreateWordCell(string word, int row, int col, int cols, float startY, float lineHeight)
        {
            // Cell container
            var cellObj = new GameObject($"Word_{word}");
            cellObj.transform.SetParent(_panelTransform, false);

            var rt = cellObj.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(col / (float)cols, 1f);
            rt.anchorMax = new Vector2((col + 1) / (float)cols, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, startY - row * lineHeight);
            rt.sizeDelta = new Vector2(-10f, 50f);

            // 3D background
            var bgObj = new GameObject("BG");
            bgObj.transform.SetParent(cellObj.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            var pillColor = MeraWorld.Core.TestModeTheme.IsActive 
                  ? new Color(0.95f, 0.92f, 0.85f) 
                  : new Color(0.30f, 0.15f, 0.55f);
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(pillColor, 128, 20);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;
            bgImg.raycastTarget = false;

            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.05f, 0.05f);
            bgRt.anchorMax = new Vector2(0.95f, 0.95f);
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            // Word text
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(cellObj.transform, false);

            var text = textObj.AddComponent<Text>();
            text.text = word;
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.fontSize = 22;
            text.fontStyle = FontStyle.Bold;
            text.color = MeraWorld.Core.TestModeTheme.IsActive ? new Color(0.35f, 0.20f, 0.10f) : Color.white;
            text.alignment = TextAnchor.MiddleCenter;
            text.raycastTarget = false;

            var textShadow = textObj.AddComponent<Shadow>();
            textShadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            textShadow.effectDistance = new Vector2(2f, -2f);

            var textRt = textObj.GetComponent<RectTransform>();
            textRt.anchorMin = Vector2.zero;
            textRt.anchorMax = Vector2.one;
            textRt.offsetMin = Vector2.zero;
            textRt.offsetMax = Vector2.zero;

            _wordTexts[word] = text;
            _wordBackgrounds[word] = bgImg;
        }

        private void OnWordFound(string word)
        {
            if (string.IsNullOrEmpty(word)) return;
            word = word.ToUpperInvariant();
            if (_foundWords.Contains(word)) return;

            _foundWords.Add(word);

            // Change text color + add checkmark
            
            // NEW: Check if Text/BG are valid
            if (_wordTexts.TryGetValue(word, out var text))
            {
                text.text = "âœ“ " + word;
                text.color = MeraWorld.Core.TestModeTheme.IsActive ? new Color(0.10f, 0.55f, 0.20f) : new Color(0.60f, 1f, 0.60f);
            }

            // Change background to green
            if (_wordBackgrounds.TryGetValue(word, out var bg))
            {
                bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.20f, 0.55f, 0.30f), 128, 20);
                bg.type = Image.Type.Sliced;
            }

            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayWordFound();
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}



