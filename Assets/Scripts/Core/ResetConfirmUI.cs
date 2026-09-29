using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ResetConfirmUI : MonoBehaviour
    {
        public static ResetConfirmUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            Invoke(nameof(Setup), 0.7f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ResetConfirmCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 800;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("ResetConfirmPanel");
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
            cardImg.color = new Color(0.15f, 0.10f, 0.20f, 1f);

            var cardRt = cardObj.GetComponent<RectTransform>();
            cardRt.anchorMin = new Vector2(0.5f, 0.5f);
            cardRt.anchorMax = new Vector2(0.5f, 0.5f);
            cardRt.pivot = new Vector2(0.5f, 0.5f);
            cardRt.anchoredPosition = Vector2.zero;
            cardRt.sizeDelta = new Vector2(800f, 700f);

            CreateText(cardObj.transform, "RESET PROGRESS?", new Vector2(0f, 240f), 60,
                new Color(1f, 0.4f, 0.4f), FontStyle.Bold);

            CreateText(cardObj.transform, "This will delete:\n\n" +
                "• All level progress\n" +
                "• All coins and stars\n" +
                "• All achievements\n\n" +
                "This cannot be undone!",
                new Vector2(0f, 40f), 30, new Color(0.9f, 0.9f, 0.95f), FontStyle.Normal);

            CreateButton(cardObj.transform, "CANCEL", new Vector2(-200f, -220f),
                new Vector2(320f, 100f), new Color(0.35f, 0.40f, 0.50f), OnCancel);

            CreateButton(cardObj.transform, "RESET", new Vector2(200f, -220f),
                new Vector2(320f, 100f), new Color(0.80f, 0.25f, 0.25f), OnConfirm);

            _panel.SetActive(false);
        }

        public void Show()
        {
            if (_panel != null) _panel.SetActive(true);
        }

        private void OnCancel()
        {
            if (_panel != null) _panel.SetActive(false);
        }

        private void OnConfirm()
        {
            if (PlayerProgressManager.Instance != null)
                PlayerProgressManager.Instance.ResetAll();

            if (AchievementManager.Instance != null)
                AchievementManager.Instance.ResetAll();

            PlayerPrefs.DeleteKey("Daily_LastClaim");
            PlayerPrefs.DeleteKey("Daily_Streak");
            PlayerPrefs.DeleteKey("DailyChallenge_LastDate");
            PlayerPrefs.DeleteKey("DailyChallenge_Streak");
            PlayerPrefs.SetInt("SkipHome", 0);
            PlayerPrefs.Save();

            Debug.Log("[Reset] All progress cleared");
            if (_panel != null) _panel.SetActive(false);
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
            rt.sizeDelta = new Vector2(700f, 300f);
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
    }
}