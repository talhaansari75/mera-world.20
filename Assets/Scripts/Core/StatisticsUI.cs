using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class StatisticsUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public StatisticsTracker Stats;

        private Canvas _canvas;
        private GameObject _panel;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Stats == null) Stats = StatisticsTracker.Instance;
            Invoke(nameof(Setup), 0.9f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("StatsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 740;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private void BuildPanel()
        {
            _panel = new GameObject("StatsPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "STATISTICS", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            float y = 600f;
            float gap = 110f;

            CreateRow(_panel.transform, "TOTAL PLAY TIME", Stats != null ? Stats.FormatPlayTime() : "0h 0m", y); y -= gap;
            CreateRow(_panel.transform, "SESSIONS", Stats != null ? Stats.TotalSessions.ToString() : "0", y); y -= gap;
            CreateRow(_panel.transform, "PERFECT LEVELS", Stats != null ? Stats.PerfectLevels.ToString() : "0", y); y -= gap;
            CreateRow(_panel.transform, "BEST TIME", Stats != null ? Stats.FormatBestTime() : "—", y); y -= gap;
            CreateRow(_panel.transform, "DAY STREAK", Stats != null ? Stats.DayStreak.ToString() : "0", y); y -= gap;
            CreateRow(_panel.transform, "HINTS USED", Stats != null ? Stats.TotalHintsUsed.ToString() : "0", y); y -= gap;
            CreateRow(_panel.transform, "TOTAL COINS", Progress != null ? Progress.Coins.ToString() : "0", y); y -= gap;
            CreateRow(_panel.transform, "TOTAL STARS", Progress != null ? Progress.TotalStars.ToString() : "0", y); y -= gap;
            CreateRow(_panel.transform, "WORDS FOUND", Progress != null ? Progress.TotalWordsFound.ToString() : "0", y); y -= gap;
            CreateRow(_panel.transform, "HIGHEST LEVEL", Progress != null ? Progress.HighestLevelUnlocked.ToString() : "1", y);

            _panel.SetActive(false);
        }

        private void CreateRow(Transform parent, string label, string value, float yPos)
        {
            var rowObj = new GameObject($"Row_{label}");
            rowObj.transform.SetParent(parent, false);

            var rowImg = rowObj.AddComponent<Image>();
            rowImg.color = new Color(0.10f, 0.15f, 0.28f, 0.75f);
            rowImg.raycastTarget = false;

            var rt = rowObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, yPos);
            rt.sizeDelta = new Vector2(880f, 90f);

            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(rowObj.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 32;
            labelTxt.fontStyle = FontStyle.Normal;
            labelTxt.color = new Color(0.75f, 0.85f, 1f);
            labelTxt.alignment = TextAnchor.MiddleLeft;
            labelTxt.raycastTarget = false;
            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = new Vector2(0f, 0f);
            lrt.anchorMax = new Vector2(1f, 1f);
            lrt.offsetMin = new Vector2(30f, 0f);
            lrt.offsetMax = Vector2.zero;

            var valueObj = new GameObject("Value");
            valueObj.transform.SetParent(rowObj.transform, false);
            var valueTxt = valueObj.AddComponent<Text>();
            valueTxt.text = value;
            valueTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            valueTxt.fontSize = 36;
            valueTxt.fontStyle = FontStyle.Bold;
            valueTxt.color = new Color(1f, 0.85f, 0.30f);
            valueTxt.alignment = TextAnchor.MiddleRight;
            valueTxt.raycastTarget = false;
            var vrt = valueObj.GetComponent<RectTransform>();
            vrt.anchorMin = new Vector2(0f, 0f);
            vrt.anchorMax = new Vector2(1f, 1f);
            vrt.offsetMin = Vector2.zero;
            vrt.offsetMax = new Vector2(-30f, 0f);
        }

        public void Show()
        {
            if (_panel != null) _panel.SetActive(true);
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
        }

        private void OnBack() { Hide(); }

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
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
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
            rt.sizeDelta = new Vector2(220f, 80f);
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
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