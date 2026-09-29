using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class CoinDoublerUI : MonoBehaviour
    {
        public static CoinDoublerUI Instance { get; private set; }

        [Header("References")]
        public SelectionManager SelectionManager;
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _panel;
        private bool _active = false;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (SelectionManager == null)
                SelectionManager = FindFirstObjectByType<SelectionManager>();

            Invoke(nameof(Setup), 1f);

            if (SelectionManager != null)
                SelectionManager.OnLevelComplete += OnLevelComplete;
        }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("CoinDoublerCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 810;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("CoinDoublerPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.92f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var cardObj = new GameObject("Card");
            cardObj.transform.SetParent(_panel.transform, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.color = new Color(0.15f, 0.30f, 0.55f);

            var cardRt = cardObj.GetComponent<RectTransform>();
            cardRt.anchorMin = new Vector2(0.5f, 0.5f);
            cardRt.anchorMax = new Vector2(0.5f, 0.5f);
            cardRt.pivot = new Vector2(0.5f, 0.5f);
            cardRt.anchoredPosition = Vector2.zero;
            cardRt.sizeDelta = new Vector2(800f, 600f);

            CreateText(cardObj.transform, "DOUBLE YOUR COINS!", new Vector2(0f, 200f), 55,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);
            CreateText(cardObj.transform, "Watch a short ad to\nDOUBLE your last reward!",
                new Vector2(0f, 50f), 32, Color.white, FontStyle.Normal);

            CreateButton(cardObj.transform, "WATCH & DOUBLE", new Vector2(0f, -120f),
                new Vector2(600f, 130f), new Color(0.25f, 0.75f, 0.35f), OnDouble);
            CreateButton(cardObj.transform, "SKIP", new Vector2(0f, -260f),
                new Vector2(400f, 90f), new Color(0.4f, 0.4f, 0.5f), OnSkip);

            _panel.SetActive(false);
        }

        private void OnLevelComplete()
        {
            // Show doubler offer after level complete (only sometimes)
            if (_active) return;
            int roll = Random.Range(0, 100);
            if (roll > 40) return; // 40% chance
            _active = true;
            StartCoroutine(ShowDelayed());
        }

        private IEnumerator ShowDelayed()
        {
            yield return new WaitForSecondsRealtime(4f);
            if (_panel != null) _panel.SetActive(true);
        }

        private void OnDouble()
        {
            if (Progress != null)
            {
                Progress.AddCoins(200);
                Debug.Log("[Doubler] Doubled! +200 coins");
            }

            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayLevelComplete();

            _panel.SetActive(false);
            _active = false;
        }

        private void OnSkip()
        {
            _panel.SetActive(false);
            _active = false;
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

        private void CreateButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.color = color;
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
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnLevelComplete -= OnLevelComplete;
        }
    }
}