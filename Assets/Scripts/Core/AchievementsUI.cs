using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// Achievements screen — shows all achievements with progress bars.
    /// Grouped by category. Unlocked ones highlighted in gold.
    /// </summary>
    public class AchievementsUI : MonoBehaviour
    {
        public static AchievementsUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Transform _scrollContent;
        private Text _summaryText;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start()
        {
            Invoke(nameof(Setup), 1.4f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

        // ---------------------------------------------------------------
        // Canvas & Panel
        // ---------------------------------------------------------------

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AchievementsCanvas");
            canvasObj.transform.SetParent(transform, false);

            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 900;

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

            // Title
            CreateText(_panel.transform, "ACHIEVEMENTS",
                new Vector2(0f, 830f), 60, new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            // Summary
            _summaryText = CreateText(_panel.transform, "",
                new Vector2(0f, 745f), 28, new Color(0.80f, 0.85f, 1f), FontStyle.Normal);

            // Back button
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
            scrollRect.vertical = true;
            scrollRect.movementType = ScrollRect.MovementType.Clamped;
            scrollRect.scrollSensitivity = 30f;

            // Viewport
            var viewportObj = new GameObject("Viewport");
            viewportObj.transform.SetParent(scrollObj.transform, false);
            var viewportRt = viewportObj.AddComponent<RectTransform>();
            viewportRt.anchorMin = Vector2.zero;
            viewportRt.anchorMax = Vector2.one;
            viewportRt.offsetMin = Vector2.zero;
            viewportRt.offsetMax = Vector2.zero;
            var viewportImg = viewportObj.AddComponent<Image>();
            viewportImg.color = new Color(0f, 0f, 0f, 0.01f);
            viewportObj.AddComponent<Mask>().showMaskGraphic = false;

            // Content
            var contentObj = new GameObject("Content");
            contentObj.transform.SetParent(viewportObj.transform, false);
            var contentRt = contentObj.AddComponent<RectTransform>();
            contentRt.anchorMin = new Vector2(0f, 1f);
            contentRt.anchorMax = new Vector2(1f, 1f);
            contentRt.pivot = new Vector2(0.5f, 1f);
            contentRt.anchoredPosition = Vector2.zero;
            contentRt.sizeDelta = new Vector2(0f, 0f);

            var vlg = contentObj.AddComponent<VerticalLayoutGroup>();
            vlg.childAlignment = TextAnchor.UpperCenter;
            vlg.spacing = 14f;
            vlg.padding = new RectOffset(20, 20, 20, 20);
            vlg.childForceExpandWidth = true;
            vlg.childForceExpandHeight = false;
            vlg.childControlWidth = true;
            vlg.childControlHeight = true;

            var csf = contentObj.AddComponent<ContentSizeFitter>();
            csf.verticalFit = ContentSizeFitter.FitMode.PreferredSize;

            _scrollContent = contentObj.transform;
            scrollRect.viewport = viewportRt;
            scrollRect.content = contentRt;
        }

        // ---------------------------------------------------------------
        // Show / Hide
        // ---------------------------------------------------------------

        public void Show()
        {
            if (_panel == null) return;
            RebuildList();
            UpdateSummary();
            _panel.SetActive(true);
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
        }

        // ---------------------------------------------------------------
        // List building
        // ---------------------------------------------------------------

        private void RebuildList()
        {
            if (_scrollContent == null) return;

            // Clear existing items reliably
            for (int i = _scrollContent.childCount - 1; i >= 0; i--)
                DestroyImmediate(_scrollContent.GetChild(i).gameObject);

            if (AchievementManager.Instance == null)
            {
                Debug.LogWarning("[AchievementsUI] AchievementManager not found in scene.");
                CreateSectionHeader("No data — AchievementManager not in scene");
                return;
            }

            var all = AchievementManager.Instance.GetAllAchievements();

            // Group by category
            var byCategory = new Dictionary<string, List<AchievementDefinitions.Achievement>>();
            foreach (var a in all)
            {
                if (!byCategory.ContainsKey(a.Category))
                    byCategory[a.Category] = new List<AchievementDefinitions.Achievement>();
                byCategory[a.Category].Add(a);
            }

            string[] order = { "Words", "Levels", "Special", "Coins", "Social" };
            foreach (var cat in order)
            {
                if (!byCategory.ContainsKey(cat)) continue;

                CreateSectionHeader(cat.ToUpperInvariant());

                foreach (var ach in byCategory[cat])
                    CreateAchievementRow(ach);
            }
        }

        private void UpdateSummary()
        {
            if (_summaryText == null || AchievementManager.Instance == null) return;

            int unlocked = AchievementManager.Instance.GetUnlockedCount();
            int total = AchievementManager.Instance.GetTotalCount();

            _summaryText.text = $"Unlocked: {unlocked} / {total}  ({Mathf.RoundToInt(100f * unlocked / Mathf.Max(1, total))}%)";
        }

        // ---------------------------------------------------------------
        // Row creation
        // ---------------------------------------------------------------

        private void CreateSectionHeader(string title)
        {
            var obj = new GameObject("Header");
            obj.transform.SetParent(_scrollContent, false);

            var rt = obj.AddComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 60f);
            var le = obj.AddComponent<LayoutElement>();
            le.minHeight = 60f;
            le.preferredHeight = 60f;

            var txt = obj.AddComponent<Text>();
            txt.text = $"── {title} ──";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.30f);
            txt.alignment = TextAnchor.MiddleLeft;
            txt.raycastTarget = false;
        }

        private void CreateAchievementRow(AchievementDefinitions.Achievement ach)
        {
            bool unlocked = AchievementManager.Instance.IsUnlocked(ach.Id);
            int progress = AchievementManager.Instance.GetProgress(ach.Id);
            float pct = AchievementManager.Instance.GetProgressPercent(ach.Id);

            var row = new GameObject($"Ach_{ach.Id}");
            row.transform.SetParent(_scrollContent, false);

            var rowRt = row.AddComponent<RectTransform>();
            rowRt.sizeDelta = new Vector2(0f, 140f);

            var rowLe = row.AddComponent<LayoutElement>();
            rowLe.minHeight = 140f;
            rowLe.preferredHeight = 140f;

            // Background
            var bgImg = row.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(
                unlocked ? new Color(0.20f, 0.45f, 0.25f) : new Color(0.14f, 0.18f, 0.28f),
                256, 30);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;

            // Icon circle
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(row.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.sprite = UISpriteFactory.Create3DSphereSprite(
                unlocked ? new Color(1f, 0.85f, 0.30f) : new Color(0.35f, 0.40f, 0.50f),
                128);
            iconImg.raycastTarget = false;

            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0f, 0.5f);
            iconRt.anchoredPosition = new Vector2(20f, 0f);
            iconRt.sizeDelta = new Vector2(90f, 90f);

            // Icon label
            var iconLabel = new GameObject("IconLabel");
            iconLabel.transform.SetParent(iconObj.transform, false);
            var ilTxt = iconLabel.AddComponent<Text>();
            ilTxt.text = unlocked ? "★" : "?";
            ilTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            ilTxt.fontSize = 48;
            ilTxt.fontStyle = FontStyle.Bold;
            ilTxt.color = unlocked ? new Color(0.15f, 0.20f, 0.10f) : Color.white;
            ilTxt.alignment = TextAnchor.MiddleCenter;
            ilTxt.raycastTarget = false;
            var ilRt = iconLabel.GetComponent<RectTransform>();
            ilRt.anchorMin = Vector2.zero;
            ilRt.anchorMax = Vector2.one;
            ilRt.offsetMin = Vector2.zero;
            ilRt.offsetMax = Vector2.zero;

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(row.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = ach.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 30;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = unlocked ? new Color(1f, 0.95f, 0.75f) : Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0f, 0.5f);
            titleRt.anchorMax = new Vector2(1f, 1f);
            titleRt.pivot = new Vector2(0f, 1f);
            titleRt.anchoredPosition = new Vector2(130f, -15f);
            titleRt.sizeDelta = new Vector2(-150f, 40f);

            // Description
            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(row.transform, false);
            var descTxt = descObj.AddComponent<Text>();
            descTxt.text = ach.Description;
            descTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            descTxt.fontSize = 22;
            descTxt.fontStyle = FontStyle.Normal;
            descTxt.color = new Color(0.85f, 0.90f, 1f);
            descTxt.alignment = TextAnchor.UpperLeft;
            descTxt.raycastTarget = false;
            var descRt = descObj.GetComponent<RectTransform>();
            descRt.anchorMin = new Vector2(0f, 0.4f);
            descRt.anchorMax = new Vector2(1f, 0.7f);
            descRt.pivot = new Vector2(0f, 1f);
            descRt.anchoredPosition = new Vector2(130f, 5f);
            descRt.sizeDelta = new Vector2(-150f, 30f);

            // Progress text
            var progObj = new GameObject("Progress");
            progObj.transform.SetParent(row.transform, false);
            var progTxt = progObj.AddComponent<Text>();
            progTxt.text = unlocked ? "UNLOCKED ✓" : $"{progress} / {ach.TargetCount}";
            progTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            progTxt.fontSize = 22;
            progTxt.fontStyle = FontStyle.Bold;
            progTxt.color = unlocked ? new Color(0.55f, 1f, 0.55f) : new Color(0.75f, 0.85f, 1f);
            progTxt.alignment = TextAnchor.MiddleRight;
            progTxt.raycastTarget = false;
            var progRt = progObj.GetComponent<RectTransform>();
            progRt.anchorMin = new Vector2(0.6f, 0f);
            progRt.anchorMax = new Vector2(1f, 0.4f);
            progRt.pivot = new Vector2(1f, 0.5f);
            progRt.anchoredPosition = new Vector2(-20f, 0f);
            progRt.sizeDelta = new Vector2(-40f, 30f);

            // Progress bar (only if not unlocked)
            if (!unlocked)
                CreateProgressBar(row.transform, pct);

            // Rewards
            if (ach.CoinReward > 0 || ach.GemReward > 0)
            {
                var rewardObj = new GameObject("Reward");
                rewardObj.transform.SetParent(row.transform, false);
                var rewardTxt = rewardObj.AddComponent<Text>();
                string r = "";
                if (ach.CoinReward > 0) r += $"+{ach.CoinReward}💰 ";
                if (ach.GemReward > 0) r += $"+{ach.GemReward}💎";
                rewardTxt.text = r.Trim();
                rewardTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                rewardTxt.fontSize = 20;
                rewardTxt.fontStyle = FontStyle.Bold;
                rewardTxt.color = new Color(1f, 0.90f, 0.55f);
                rewardTxt.alignment = TextAnchor.MiddleLeft;
                rewardTxt.raycastTarget = false;
                var rrt = rewardObj.GetComponent<RectTransform>();
                rrt.anchorMin = new Vector2(0f, 0f);
                rrt.anchorMax = new Vector2(0.6f, 0.4f);
                rrt.pivot = new Vector2(0f, 0.5f);
                rrt.anchoredPosition = new Vector2(130f, 0f);
                rrt.sizeDelta = new Vector2(-150f, 30f);
            }
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

        // ---------------------------------------------------------------
        // Helpers
        // ---------------------------------------------------------------

        private Text CreateText(Transform parent, string content, Vector2 pos, int size,
            Color color, FontStyle style)
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

        private void CreateSmallButton(Transform parent, string label, Vector2 pos,
            Color color, UnityEngine.Events.UnityAction onClick)
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