using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ThemePickerUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;

        private class ThemeDef
        {
            public string Id;
            public string Name;
            public Color Color;
        }

        private static readonly List<ThemeDef> Themes = new List<ThemeDef>
        {
            new ThemeDef { Id = "default", Name = "DEFAULT", Color = new Color(0.25f, 0.55f, 0.95f) },
            new ThemeDef { Id = "golden", Name = "GOLDEN", Color = new Color(1f, 0.75f, 0.20f) },
            new ThemeDef { Id = "ocean", Name = "OCEAN", Color = new Color(0.20f, 0.75f, 0.85f) },
            new ThemeDef { Id = "forest", Name = "FOREST", Color = new Color(0.30f, 0.75f, 0.40f) },
            new ThemeDef { Id = "royal", Name = "ROYAL", Color = new Color(0.65f, 0.35f, 0.85f) },
        };

        void Start()
        {
            Invoke(nameof(Setup), 1f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("ThemePickerCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 725;

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
            _panel = new GameObject("ThemePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "THEMES", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            float y = 500f;
            foreach (var theme in Themes)
            {
                CreateThemeButton(theme, y);
                y -= 180f;
            }

            _panel.SetActive(false);
        }

        private void CreateThemeButton(ThemeDef theme, float y)
        {
            bool isSelected = ThemeManager.Instance != null &&
                              ThemeManager.Instance.CurrentTheme == theme.Id;

            var btnObj = new GameObject($"Theme_{theme.Id}");
            btnObj.transform.SetParent(_panel.transform, false);

            var img = btnObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(theme.Color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = isSelected ? Color.white : new Color(0.85f, 0.85f, 0.85f);

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(() => OnThemeSelected(theme.Id));

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(700f, 130f);

            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(btnObj.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = theme.Name + (isSelected ? "  ✓" : "");
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 46;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = Color.white;
            labelTxt.alignment = TextAnchor.MiddleCenter;
            labelTxt.raycastTarget = false;
            var shadow = labelObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.5f);
            shadow.effectDistance = new Vector2(2f, -2f);
            var lrt = labelObj.GetComponent<RectTransform>();
            lrt.anchorMin = Vector2.zero;
            lrt.anchorMax = Vector2.one;
            lrt.offsetMin = Vector2.zero;
            lrt.offsetMax = Vector2.zero;
        }

        private void OnThemeSelected(string themeId)
        {
            if (ThemeManager.Instance != null)
                ThemeManager.Instance.SetTheme(themeId);

            // Rebuild to refresh checkmarks
            foreach (Transform child in _panel.transform)
            {
                if (child.name.StartsWith("Theme_")) Destroy(child.gameObject);
            }

            Invoke(nameof(RebuildThemes), 0.05f);
        }

        private void RebuildThemes()
        {
            float y = 500f;
            foreach (var theme in Themes)
            {
                CreateThemeButton(theme, y);
                y -= 180f;
            }
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

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color,
            UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
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