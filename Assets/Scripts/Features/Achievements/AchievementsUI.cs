using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class AchievementsUI : MonoBehaviour
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
            Invoke(nameof(Setup), 1.5f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

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

            CreateText(_panel.transform, "ACHIEVEMENTS",
                new Vector2(0f, 830f), 60, new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            _summaryText = CreateText(_panel.transform, "",
                new Vector2(0f, 740f), 28, new Color(0.80f, 0.85f, 1f), FontStyle.Normal);

            CreateSmallButton(_panel.transform, "< BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), Hide);

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
            scrollRt.sizeDelta = new Vector2(960f, 1400f);

            var scrollRect = scrollObj.AddComponent<ScrollRect>();
            scrollRect.horizontal = false;
            scrollRect.vertical = true;
            scrollRect.movementType = ScrollRect.MovementType.Clamped;
            scrollRect.scrollSensitivity = 30f;

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

        private void RebuildList()
        {
            if (_scrollContent == null) return;

            foreach (Transform c in _scrollContent)
                Destroy(c.gameObject);

            if (AchievementManager.Instance == null)
            {
                Debug.LogWarning("[AchievementsUI] AchievementManager not found in scene.");
                CreateSectionHeader("No data - AchievementManager not in scene");
                return;
            }

            var all = AchievementManager.Instance.GetAllAchievements();

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

            _summaryText.text = "Unlocked: " + unlocked + " / " + total + "  (" + Mathf.RoundToInt(100f * unlocked / Mathf.Max(1, total)) + "%)";
        }
    }
}