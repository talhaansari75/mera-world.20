using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

namespace MeraWorld.Core
{
    public class LeaderboardUI : MonoBehaviour
    {
        public static LeaderboardUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private Transform _scrollContent;
        private Text _playerRankText;

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.4f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LeaderboardCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 925;

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

            CreateText(_panel.transform, "LEADERBOARD", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            _playerRankText = CreateText(_panel.transform, "", new Vector2(0f, 745f), 28,
                new Color(0.80f, 0.85f, 1f), FontStyle.Normal);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
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
            vlg.spacing = 10f;
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

            var board = LeaderboardManager.GetLeaderboard(20);

            for (int i = 0; i < board.Count; i++)
                CreateRow(board[i], i + 1);

            if (_playerRankText != null)
                _playerRankText.text = $"Your Rank: #{LeaderboardManager.GetPlayerRank()}  (Best: {LeaderboardManager.PlayerHighScore})";
        }

        private void CreateRow(LeaderboardManager.Entry entry, int rank)
        {
            var row = new GameObject($"Rank_{rank}");
            row.transform.SetParent(_scrollContent, false);

            var rt = row.AddComponent<RectTransform>();
            rt.sizeDelta = new Vector2(0f, 100f);
            var le = row.AddComponent<LayoutElement>();
            le.minHeight = 100f;
            le.preferredHeight = 100f;

            Color bgColor = entry.IsPlayer
                ? new Color(0.85f, 0.60f, 0.20f)
                : (rank <= 3 ? new Color(0.20f, 0.35f, 0.55f) : new Color(0.14f, 0.18f, 0.28f));

            var bgImg = row.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(bgColor, 256, 30);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;

            // Rank
            CreateTextInRow(row.transform, "#" + rank, new Vector2(-400f, 0f), 32,
                Color.white, FontStyle.Bold, TextAnchor.MiddleLeft, 100f);

            // Name
            string nameText = entry.IsPlayer ? "YOU" : entry.Name;
            CreateTextInRow(row.transform, nameText, new Vector2(-180f, 0f), 30,
                entry.IsPlayer ? new Color(1f, 0.95f, 0.75f) : Color.white,
                entry.IsPlayer ? FontStyle.Bold : FontStyle.Normal,
                TextAnchor.MiddleLeft, 400f);

            // Score
            CreateTextInRow(row.transform, entry.Score.ToString(), new Vector2(380f, 0f), 32,
                new Color(1f, 0.90f, 0.55f), FontStyle.Bold, TextAnchor.MiddleRight, 200f);
        }

        private void CreateTextInRow(Transform parent, string content, Vector2 pos, int size,
            Color color, FontStyle style, TextAnchor align, float width)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = style;
            txt.color = color;
            txt.alignment = align;
            txt.raycastTarget = false;

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(width, 60f);
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