using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class SeasonPassUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _panel;

        private const string KEY_SEASON_XP = "Season_XP";

        private const int MAX_TIER = 30;
        private const int XP_PER_TIER = 100;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 1.3f);
        }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("SeasonCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 770;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("SeasonPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "SEASON PASS", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            int xp = PlayerPrefs.GetInt(KEY_SEASON_XP, 0);
            int tier = Mathf.Min(xp / XP_PER_TIER, MAX_TIER);

            CreateText(_panel.transform, $"TIER {tier} / {MAX_TIER}", new Vector2(0f, 650f), 55,
                new Color(1f, 0.90f, 0.55f), FontStyle.Bold);

            CreateText(_panel.transform, $"{xp % XP_PER_TIER} / {XP_PER_TIER} XP to next tier",
                new Vector2(0f, 580f), 28, Color.white, FontStyle.Normal);

            // Progress bar
            var barBg = new GameObject("BarBg");
            barBg.transform.SetParent(_panel.transform, false);
            var bbImg = barBg.AddComponent<Image>();
            bbImg.color = new Color(0.15f, 0.18f, 0.30f);
            bbImg.raycastTarget = false;
            var bbRt = barBg.GetComponent<RectTransform>();
            bbRt.anchorMin = new Vector2(0.5f, 0.5f);
            bbRt.anchorMax = new Vector2(0.5f, 0.5f);
            bbRt.pivot = new Vector2(0.5f, 0.5f);
            bbRt.anchoredPosition = new Vector2(0f, 520f);
            bbRt.sizeDelta = new Vector2(800f, 40f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(barBg.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = new Color(1f, 0.75f, 0.30f);
            fillImg.raycastTarget = false;
            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            float pct = (float)(xp % XP_PER_TIER) / XP_PER_TIER;
            fillRt.sizeDelta = new Vector2(796f * pct, -4f);

            // 30 tier rewards grid
            var gridObj = new GameObject("TierGrid");
            gridObj.transform.SetParent(_panel.transform, false);
            var gridRt = gridObj.AddComponent<RectTransform>();
            gridRt.anchorMin = new Vector2(0.5f, 0.5f);
            gridRt.anchorMax = new Vector2(0.5f, 0.5f);
            gridRt.pivot = new Vector2(0.5f, 0.5f);
            gridRt.anchoredPosition = new Vector2(0f, -150f);
            gridRt.sizeDelta = new Vector2(1000f, 1300f);

            var grid = gridObj.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(180f, 130f);
            grid.spacing = new Vector2(10f, 10f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 5;
            grid.padding = new RectOffset(20, 20, 20, 20);

            for (int i = 1; i <= MAX_TIER; i++)
            {
                CreateTierReward(gridObj.transform, i, i <= tier);
            }

            _panel.SetActive(false);
        }

        private void CreateTierReward(Transform parent, int tierNum, bool unlocked)
        {
            var obj = new GameObject($"Tier_{tierNum}");
            obj.transform.SetParent(parent, false);

            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(
                unlocked ? new Color(0.85f, 0.65f, 0.20f) : new Color(0.20f, 0.25f, 0.35f),
                128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = unlocked ? $"T{tierNum}\n✓" : $"T{tierNum}";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 24;
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

        public void AddSeasonXP(int amount)
        {
            int xp = PlayerPrefs.GetInt(KEY_SEASON_XP, 0) + amount;
            PlayerPrefs.SetInt(KEY_SEASON_XP, xp);
            PlayerPrefs.Save();
            Debug.Log($"[Season] +{amount} XP (Total: {xp})");
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
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