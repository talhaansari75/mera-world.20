using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class MissionsUI : MonoBehaviour
    {
        public static MissionsUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Transform _scrollContent;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.4f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("MissionsCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 920;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("Panel");
            _panel.transform.SetParent(_canvas.transform, false);
            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.04f, 0.08f, 0.20f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "MISSIONS", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), Hide);

            // Scroll view
            BuildScrollView();

            _panel.SetActive(false);
        }

        private void BuildScrollView()
        {
            var scrollObj = new GameObject("ScrollView");
            scrollObj.transform.SetParent(_panel.transform, false);
            var scrollRt = scrollObj.AddComponent<RectTransform>();
            scrollRt.anchorMin = new Vector2(0.5f, 0.5f);
            scrollRt.anchorMax = new Vector2(0.5f, 0.5f);
            scrollRt.pivot = new Vector2(0.5f, 0.5f);
            scrollRt.anchoredPosition = new Vector2(0f, -60f);
            scrollRt.sizeDelta = new Vector2(960f, 1350f);

            var scrollRect = scrollObj.AddComponent<ScrollRect>();
            scrollRect.horizontal = false;
            scrollRect.movementType = ScrollRect.MovementType.Clamped;

            var vp = new GameObject("Viewport");
            vp.transform.SetParent(scrollObj.transform, false);
            var vrt = vp.AddComponent<RectTransform>();
            vrt.anchorMin = Vector2.zero;
            vrt.anchorMax = Vector2.one;
            vrt.offsetMin = Vector2.zero;
            vrt.offsetMax = Vector2.zero;
            var vimg = vp.AddComponent<Image>();
            vimg.color = new Color(0f, 0f, 0f, 0.01f);
            vp.AddComponent<Mask>().showMaskGraphic = false;

            var content = new GameObject("Content");
            content.transform.SetParent(vp.transform, false);
            var crt = content.AddComponent<RectTransform>();
            crt.anchorMin = new Vector2(0f, 1f);
            crt.anchorMax = new Vector2(1f, 1f);
            crt.pivot = new Vector2(0.5f, 1f);
            crt.anchoredPosition = Vector2.zero;
            crt.sizeDelta = new Vector2(0f, 0f);

            var vlg = content.AddComponent<VerticalLayoutGroup>();
            vlg.childAlignment = TextAnchor.UpperCenter;
            vlg.spacing = 15f;
            vlg.padding = new RectOffset(20, 20, 20, 20);
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;
            vlg.childControlWidth = true;
            vlg.childControlHeight = true;

            var csf = content.AddComponent<ContentSizeFitter>();
            csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            _scrollContent = content.transform;
            scrollRect.viewport = vrt;
            scrollRect.content = crt;
        }

        public void Show()
        {
            if (_panel == null) return;
            Rebuild();
            _panel.SetActive(true);
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }

        private void Rebuild()
        {
            if (_scrollContent == null) return;

            for (int i = _scrollContent.childCount - 1; i >= 0; i--)
                DestroyImmediate(_scrollContent.GetChild(i).gameObject);

            if (MissionsManager.Instance == null)
            {
                CreateHeader("Missions system not loaded");
                return;
            }

            CreateHeader("── DAILY MISSIONS ──");
            foreach (var m in MissionsManager.Instance.GetDailyMissions())
                CreateMissionRow(m);

            CreateHeader("── WEEKLY MISSIONS ──");
            foreach (var m in MissionsManager.Instance.GetWeeklyMissions())
                CreateMissionRow(m);
        }

        private void CreateHeader(string title)
        {
            var obj = new GameObject("Header");
            obj.transform.SetParent(_scrollContent, false);
            var rt = obj.AddComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 70f);
            var le = obj.AddComponent<LayoutElement>();
            le.minHeight = 70f;
            le.preferredHeight = 70f;

            var txt = obj.AddComponent<Text>();
            txt.text = title;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 34;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.30f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
        }

        private void CreateMissionRow(MissionsManager.Mission m)
        {
            bool done = MissionsManager.Instance.IsComplete(m.Id);
            int progress = MissionsManager.Instance.GetProgress(m.Id);
            float pct = MissionsManager.Instance.GetProgressPercent(m.Id);

            var row = new GameObject($"Mission_{m.Id}");
            row.transform.SetParent(_scrollContent, false);

            var rt = row.AddComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 160f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 160f;
            le.preferredHeight = 160f;

            var bgImg = row.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(
                done ? new Color(0.20f, 0.45f, 0.25f) : new Color(0.14f, 0.18f, 0.28f),
                256, 30);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(row.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = m.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 30;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = done ? new Color(1f, 0.95f, 0.75f) : Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 0.6f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.pivot = new Vector2(0f, 1f);
            trt.anchoredPosition = new Vector2(30f, -15f);
            trt.sizeDelta = new Vector2(-60f, 40f);

            // Description
            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(row.transform, false);
            var descTxt = descObj.AddComponent<Text>();
            descTxt.text = m.Description;
            descTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            descTxt.fontSize = 22;
            descTxt.color = new Color(0.85f, 0.90f, 1f);
            descTxt.alignment = TextAnchor.UpperLeft;
            descTxt.raycastTarget = false;
            var drt = descObj.GetComponent<RectTransform>();
            drt.anchorMin = new Vector2(0f, 0.3f);
            drt.anchorMax = new Vector2(1f, 0.6f);
            drt.pivot = new Vector2(0f, 1f);
            drt.anchoredPosition = new Vector2(30f, 0f);
            drt.sizeDelta = new Vector2(-60f, 30f);

            // Progress text
            var progObj = new GameObject("Progress");
            progObj.transform.SetParent(row.transform, false);
            var progTxt = progObj.AddComponent<Text>();
            progTxt.text = done ? "COMPLETE ✓" : $"{progress} / {m.TargetCount}";
            progTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            progTxt.fontSize = 24;
            progTxt.fontStyle = FontStyle.Bold;
            progTxt.color = done ? new Color(0.55f, 1f, 0.55f) : new Color(0.75f, 0.85f, 1f);
            progTxt.alignment = TextAnchor.MiddleRight;
            progTxt.raycastTarget = false;
            var prt = progObj.GetComponent<RectTransform>();
            prt.anchorMin = new Vector2(0.5f, 0f);
            prt.anchorMax = new Vector2(1f, 0.35f);
            prt.pivot = new Vector2(1f, 0.5f);
            prt.anchoredPosition = new Vector2(-30f, 0f);
            prt.sizeDelta = new Vector2(-60f, 30f);

            // Reward
            var rewardObj = new GameObject("Reward");
            rewardObj.transform.SetParent(row.transform, false);
            var rewardTxt = rewardObj.AddComponent<Text>();
            string rewardStr = "";
            if (m.CoinReward > 0) rewardStr += $"+{m.CoinReward}💰 ";
            if (m.GemReward > 0) rewardStr += $"+{m.GemReward}💎";
            rewardTxt.text = rewardStr.Trim();
            rewardTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            rewardTxt.fontSize = 22;
            rewardTxt.fontStyle = FontStyle.Bold;
            rewardTxt.color = new Color(1f, 0.90f, 0.55f);
            rewardTxt.alignment = TextAnchor.MiddleLeft;
            rewardTxt.raycastTarget = false;
            var rrt = rewardObj.GetComponent<RectTransform>();
            rrt.anchorMin = new Vector2(0f, 0f);
            rrt.anchorMax = new Vector2(0.5f, 0.35f);
            rrt.pivot = new Vector2(0f, 0.5f);
            rrt.anchoredPosition = new Vector2(30f, 0f);
            rrt.sizeDelta = new Vector2(-60f, 30f);

            // Progress bar
            if (!done)
                CreateProgressBar(row.transform, pct);
        }

        private void CreateProgressBar(Transform parent, float pct)
        {
            var barBg = new GameObject("ProgressBarBg");
            barBg.transform.SetParent(parent, false);

            var bgImg = barBg.AddComponent<Image>();
            bgImg.color = new Color(0.10f, 0.15f, 0.25f, 0.9f);
            bgImg.raycastTarget = false;

            var bgRt = barBg.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0f, 0f);
            bgRt.anchorMax = new Vector2(1f, 0f);
            bgRt.pivot = new Vector2(0.5f, 0f);
            bgRt.anchoredPosition = new Vector2(15f, 15f);
            bgRt.sizeDelta = new Vector2(-30f, 12f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(barBg.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = new Color(0.35f, 0.75f, 0.95f);
            fillImg.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            fillRt.sizeDelta = new Vector2((bgRt.sizeDelta.x - 4f) * pct, -4f);
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
            rt.sizeDelta = new Vector2(900f, 100f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 80f);
            var t = new GameObject("Label");
            t.transform.SetParent(obj.transform, false);
            var txt = t.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = t.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}