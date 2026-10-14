using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using DG.Tweening;

namespace MeraWorld.Core
{
    public class WordDefinitionUI : MonoBehaviour
    {
        [Header("References")]
        public SelectionManager SelectionManager;

        private Canvas _canvas;
        private GameObject _panel;
        private TextMeshProUGUI _wordText;
        private TextMeshProUGUI _definitionText;
        private Image _bgImage;
        private CanvasGroup _panelGroup;
        private TMP_FontAsset _premiumFont;

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
            { "PLAY", "Engage in activity for enjoyment." },
            { "FOOD", "Any substance eaten to provide nutrition." },
            { "HOME", "The place where one lives permanently." },
            { "LOVE", "An intense feeling of deep affection." },
            { "HOPE", "A feeling of expectation and desire." },
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

            _premiumFont = Resources.Load<TMP_FontAsset>("Fonts/Poppins-Bold SDF");
            if (_premiumFont == null) _premiumFont = TMP_Settings.defaultFontAsset;

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

            // Premium 3D dark purple panel
            _bgImage = _panel.AddComponent<Image>();
            _bgImage.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.08f, 0.30f), 512, 40);
            _bgImage.type = Image.Type.Sliced;
            _bgImage.color = Color.white;

            _panelGroup = _panel.AddComponent<CanvasGroup>();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0f);
            rt.anchorMax = new Vector2(0.5f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = new Vector2(0f, 300f);
            rt.sizeDelta = new Vector2(620f, 130f);

            // Gold border frame (behind)
            var borderObj = new GameObject("GoldBorder");
            borderObj.transform.SetParent(_panel.transform, false);
            borderObj.transform.SetAsFirstSibling();
            var borderImg = borderObj.AddComponent<Image>();
            borderImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.82f, 0.30f), 512, 40);
            borderImg.type = Image.Type.Sliced;
            borderImg.raycastTarget = false;
            var brt = borderObj.GetComponent<RectTransform>();
            brt.anchorMin = Vector2.zero;
            brt.anchorMax = Vector2.one;
            brt.offsetMin = new Vector2(-5f, -5f);
            brt.offsetMax = new Vector2(5f, 5f);

            // Word title (gold gradient)
            _wordText = CreateTMPText(_panel.transform, "WORD",
                new Vector2(0f, 32f), 40, true);

            // Definition (white)
            _definitionText = CreateTMPText(_panel.transform, "Definition...",
                new Vector2(0f, -20f), 22, false);
            _definitionText.fontStyle = FontStyles.Normal;
            _definitionText.color = new Color(1f, 0.95f, 0.85f);

            _panel.SetActive(false);
        }

        private TextMeshProUGUI CreateTMPText(Transform parent, string content, Vector2 pos, int size, bool goldGradient)
        {
            var obj = new GameObject("Text_" + content);
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<TextMeshProUGUI>();
            txt.text = content;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = size;
            txt.fontStyle = FontStyles.Bold;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;

            if (goldGradient)
            {
                txt.enableVertexGradient = true;
                txt.colorGradient = new VertexGradient(
                    new Color(1.0f, 0.98f, 0.55f),
                    new Color(1.0f, 0.98f, 0.55f),
                    new Color(0.95f, 0.55f, 0.08f),
                    new Color(0.95f, 0.55f, 0.08f)
                );
                txt.outlineWidth = 0.22f;
                txt.outlineColor = new Color32(70, 25, 0, 255);
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(850f, 120f);
            return txt;
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
            if (_panel == null || this == null || gameObject == null) yield break;
            if (_canvas == null) yield break;

            _wordText.text = word;
            _definitionText.text = Definitions[word];

            _panel.SetActive(true);
            _panelGroup.DOKill();
            _panelGroup.alpha = 0f;

            // Fade + scale in
            var rt = _panel.GetComponent<RectTransform>();
            rt.localScale = Vector3.one * 0.8f;

            float duration = 0.3f;
            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                _panelGroup.alpha = t;
                rt.localScale = Vector3.Lerp(Vector3.one * 0.8f, Vector3.one, t);
                yield return null;
            }
            _panelGroup.alpha = 1f;
            rt.localScale = Vector3.one;

            yield return new WaitForSecondsRealtime(2.5f);

            // Fade out
            elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / duration;
                _panelGroup.alpha = 1f - t;
                yield return null;
            }

            _panelGroup.alpha = 0f;
            _panel.SetActive(false);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnWordFound;
        }
    }
}