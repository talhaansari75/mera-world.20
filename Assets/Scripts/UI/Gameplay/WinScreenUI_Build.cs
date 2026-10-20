using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace MeraWorld.Core
{
    public partial class WinScreenUI
    {
        private void BuildHiddenPanel()
        {
            var canvasObj = new GameObject("WinCanvas");
            canvasObj.transform.SetParent(transform);

            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 220;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            _panel = new GameObject("Overlay");
            _panel.transform.SetParent(_canvas.transform, false);

            var overlay = _panel.AddComponent<Image>();
            overlay.color = new Color(0f, 0f, 0f, 0.88f);

            _panelGroup = _panel.AddComponent<CanvasGroup>();
            _panelGroup.alpha = 0f;
            _panelGroup.blocksRaycasts = false;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            BuildCenterPanel(_panel.transform);

            _panel.SetActive(false);
        }

        private void BuildCenterPanel(Transform parent)
        {
            var centerPanel = new GameObject("CenterPanel");
            centerPanel.transform.SetParent(parent, false);

            var panelImg = centerPanel.AddComponent<Image>();
            panelImg.sprite = UISpriteFactory.Create3DButtonSprite((ThemeManager.Instance != null ? ThemeManager.Instance.Colors.PanelTop : ThemePalette.Get("Classic").PanelTop), 512, 30);
            panelImg.type = Image.Type.Sliced;
            panelImg.color = Color.white;

            var cprt = centerPanel.GetComponent<RectTransform>();
            cprt.anchorMin = new Vector2(0.5f, 0.5f);
            cprt.anchorMax = new Vector2(0.5f, 0.5f);
            cprt.pivot = new Vector2(0.5f, 0.5f);
            cprt.anchoredPosition = Vector2.zero;
            cprt.sizeDelta = new Vector2(950f, 1400f);

            var borderObj = new GameObject("GoldBorder");
            borderObj.transform.SetParent(centerPanel.transform, false);
            var borderImg = borderObj.AddComponent<Image>();
            borderImg.sprite = UISpriteFactory.Create3DButtonSprite((ThemeManager.Instance != null ? ThemeManager.Instance.Colors.AccentColor : ThemePalette.Get("Classic").AccentColor), 512, 30);
            borderImg.type = Image.Type.Sliced;
            borderImg.raycastTarget = false;

            var brt = borderObj.GetComponent<RectTransform>();
            brt.anchorMin = Vector2.zero;
            brt.anchorMax = Vector2.one;
            brt.offsetMin = new Vector2(-8f, -8f);
            brt.offsetMax = new Vector2(8f, 8f);

            borderObj.transform.SetSiblingIndex(0);

            _titleText = CreateTMPText(centerPanel.transform, "LEVEL 1 COMPLETE!",
                new Vector2(0f, 540f), 85, true);

            CreateStarsRow(centerPanel.transform);

            _bonusText = CreateTMPText(centerPanel.transform, "+100 BONUS COINS",
                new Vector2(0f, 50f), 50, false);
            _bonusText.color = new Color(1f, 0.9f, 0.4f);
            _bonusText.outlineWidth = 0.18f;
            _bonusText.outlineColor = new Color32(80, 30, 0, 255);

            _buttons[0] = Create3DButton(centerPanel.transform, "NEXT LEVEL",
                new Vector2(0f, -180f), new Vector2(560f, 130f),
                new Color(0.20f, 0.65f, 0.25f), OnNextLevel);

            _buttons[1] = Create3DButton(centerPanel.transform, "REPLAY",
                new Vector2(0f, -340f), new Vector2(560f, 130f),
                new Color(0.20f, 0.45f, 0.80f), OnReplay);

            _buttons[2] = Create3DButton(centerPanel.transform, "HOME",
                new Vector2(0f, -500f), new Vector2(560f, 130f),
                new Color(0.35f, 0.35f, 0.42f), OnHome);
        }

        private void CreateStarsRow(Transform parent)
        {
            for (int i = 0; i < 3; i++)
            {
                var starObj = new GameObject("Star_" + i);
                starObj.transform.SetParent(parent, false);

                var img = starObj.AddComponent<Image>();
                img.color = new Color(0.25f, 0.25f, 0.30f);
                img.sprite = CreateStarSprite();

                var rt = starObj.GetComponent<RectTransform>();
                rt.anchorMin = new Vector2(0.5f, 0.5f);
                rt.anchorMax = new Vector2(0.5f, 0.5f);
                rt.pivot = new Vector2(0.5f, 0.5f);
                rt.anchoredPosition = new Vector2(-220f + i * 220f, 300f);
                rt.sizeDelta = new Vector2(180f, 180f);

                _starImages[i] = img;
            }
        }

        private TextMeshProUGUI CreateTMPText(Transform parent, string content, Vector2 pos,
            int size, bool goldGradient)
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
                txt.outlineWidth = 0.25f;
                txt.outlineColor = new Color32(70, 25, 0, 255);
            }
            else
            {
                txt.color = new Color(1f, 0.95f, 0.85f);
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 160f);

            return txt;
        }

        private Button Create3DButton(Transform parent, string label, Vector2 pos, Vector2 size,
            Color baseColor, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject("Button_" + label);
            obj.transform.SetParent(parent, false);

            var shadowObj = new GameObject("Shadow");
            shadowObj.transform.SetParent(obj.transform, false);
            var shadowImg = shadowObj.AddComponent<Image>();
            shadowImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(baseColor.r * 0.3f, baseColor.g * 0.3f, baseColor.b * 0.3f), 256, 20);
            shadowImg.type = Image.Type.Sliced;
            shadowImg.raycastTarget = false;
            var shr = shadowObj.GetComponent<RectTransform>();
            shr.anchorMin = Vector2.zero;
            shr.anchorMax = Vector2.one;
            shr.offsetMin = new Vector2(0f, -12f);
            shr.offsetMax = new Vector2(0f, -12f);

            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(baseColor, 256, 20);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);

            var txt = textObj.AddComponent<TextMeshProUGUI>();
            txt.text = label;
            if (_premiumFont != null) txt.font = _premiumFont;
            txt.fontSize = 55;
            txt.fontStyle = FontStyles.Bold;
            txt.color = Color.white;
            txt.alignment = TextAlignmentOptions.Center;
            txt.raycastTarget = false;
            txt.outlineWidth = 0.2f;
            txt.outlineColor = new Color32(0, 0, 0, 200);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            var highlightObj = new GameObject("Highlight");
            highlightObj.transform.SetParent(obj.transform, false);
            var highlightImg = highlightObj.AddComponent<Image>();
            highlightImg.color = new Color(1f, 1f, 1f, 0.18f);
            highlightImg.raycastTarget = false;
            var hrt = highlightObj.GetComponent<RectTransform>();
            hrt.anchorMin = new Vector2(0.05f, 0.65f);
            hrt.anchorMax = new Vector2(0.95f, 0.92f);
            hrt.offsetMin = Vector2.zero;
            hrt.offsetMax = Vector2.zero;

            return btn;
        }

        private Sprite CreateStarSprite()
        {
            int size = 128;
            var tex = new Texture2D(size, size, TextureFormat.RGBA32, false);
            tex.filterMode = FilterMode.Bilinear;
            var pixels = new Color[size * size];

            Vector2 center = new Vector2(size / 2f, size / 2f);
            float outerRadius = size * 0.48f;
            float innerRadius = size * 0.20f;

            for (int y = 0; y < size; y++)
            {
                for (int x = 0; x < size; x++)
                {
                    Vector2 point = new Vector2(x, y);
                    Vector2 dir = point - center;
                    float dist = dir.magnitude;
                    float angle = Mathf.Atan2(dir.y, dir.x) + Mathf.PI / 2f;
                    if (angle < 0) angle += 2f * Mathf.PI;

                    float segment = (2f * Mathf.PI) / 5f;
                    float halfSeg = segment / 2f;
                    float localAngle = angle % segment;

                    float targetRadius = (localAngle < halfSeg)
                        ? Mathf.Lerp(outerRadius, innerRadius, localAngle / halfSeg)
                        : Mathf.Lerp(innerRadius, outerRadius, (localAngle - halfSeg) / halfSeg);

                    float alpha = dist < targetRadius ? 1f : 0f;
                    if (dist > targetRadius - 2f && dist < targetRadius + 1f)
                        alpha = Mathf.Clamp01(targetRadius - dist + 1f);

                    pixels[y * size + x] = new Color(1f, 1f, 1f, alpha);
                }
            }

            tex.SetPixels(pixels);
            tex.Apply();
            return Sprite.Create(tex, new Rect(0, 0, size, size), new Vector2(0.5f, 0.5f), size);
        }
    }
}