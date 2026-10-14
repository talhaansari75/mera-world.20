using UnityEngine;
using UnityEngine.UI;
using TMPro;

namespace MeraWorld.Core
{
    public partial class PauseMenuUI
    {
        private void BuildCanvas()
        {
            var canvasObj = new GameObject("PauseCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 250;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPauseButton()
        {
            _pauseButton = new GameObject("PauseButton");
            _pauseButton.transform.SetParent(_canvas.transform, false);

            var img = _pauseButton.AddComponent<Image>();

            Sprite premiumPause = Resources.Load<Sprite>("UI/Premium/btn_pause");
            if (premiumPause != null)
            {
                img.sprite = premiumPause;
                img.color = Color.white;
                Debug.Log("[Pause] Premium pause button loaded!");
            }
            else
            {
                img.sprite = UISpriteFactory.Create3DButtonSprite(
                    new Color(1f, 0.85f, 0.30f), 256, 20);
                img.type = Image.Type.Sliced;
                img.color = Color.white;
            }

            var btn = _pauseButton.AddComponent<Button>();
            btn.targetGraphic = img;
            btn.onClick.AddListener(Pause);

            var rt = _pauseButton.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(1f, 1f);
            rt.anchoredPosition = new Vector2(-30f, -130f);
            rt.sizeDelta = new Vector2(120f, 120f);

            var bar1 = new GameObject("Bar1");
            bar1.transform.SetParent(_pauseButton.transform, false);
            var img1 = bar1.AddComponent<Image>();
            img1.color = new Color(0.95f, 0.75f, 0.25f);
            img1.raycastTarget = false;
            var rt1 = bar1.GetComponent<RectTransform>();
            rt1.anchorMin = new Vector2(0.5f, 0.5f);
            rt1.anchorMax = new Vector2(0.5f, 0.5f);
            rt1.pivot = new Vector2(0.5f, 0.5f);
            rt1.anchoredPosition = new Vector2(-18f, 0f);
            rt1.sizeDelta = new Vector2(16f, 60f);

            var bar2 = new GameObject("Bar2");
            bar2.transform.SetParent(_pauseButton.transform, false);
            var img2 = bar2.AddComponent<Image>();
            img2.color = new Color(0.95f, 0.75f, 0.25f);
            img2.raycastTarget = false;
            var rt2 = bar2.GetComponent<RectTransform>();
            rt2.anchorMin = new Vector2(0.5f, 0.5f);
            rt2.anchorMax = new Vector2(0.5f, 0.5f);
            rt2.pivot = new Vector2(0.5f, 0.5f);
            rt2.anchoredPosition = new Vector2(18f, 0f);
            rt2.sizeDelta = new Vector2(16f, 60f);
        }

        private void BuildPausePanel()
        {
            _panel = new GameObject("PausePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.88f);
            bg.raycastTarget = true;

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

            var borderObj = new GameObject("GoldBorder");
            borderObj.transform.SetParent(centerPanel.transform, false);
            var borderImg = borderObj.AddComponent<Image>();
            borderImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.85f, 0.55f, 0.10f), 512, 30);
            borderImg.type = Image.Type.Sliced;
            borderImg.raycastTarget = false;

            var brt = borderObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = Vector2.zero;
            brt.sizeDelta = new Vector2(720f, 960f);

            var panelObj = new GameObject("PanelBG");
            panelObj.transform.SetParent(centerPanel.transform, false);
            var panelImg = panelObj.AddComponent<Image>();
            panelImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.10f, 0.04f, 0.20f), 512, 30);
            panelImg.type = Image.Type.Sliced;
            panelImg.raycastTarget = false;

            var prt = panelObj.GetComponent<RectTransform>();
            prt.anchorMin = new Vector2(0.5f, 0.5f);
            prt.anchorMax = new Vector2(0.5f, 0.5f);
            prt.pivot = new Vector2(0.5f, 0.5f);
            prt.anchoredPosition = Vector2.zero;
            prt.sizeDelta = new Vector2(700f, 940f);

            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(centerPanel.transform, false);

            var titleTxt = titleObj.AddComponent<TextMeshProUGUI>();
            titleTxt.text = "PAUSED";
            if (_premiumFont != null) titleTxt.font = _premiumFont;
            titleTxt.fontSize = 100;
            titleTxt.fontStyle = FontStyles.Bold;
            titleTxt.alignment = TextAlignmentOptions.Center;
            titleTxt.raycastTarget = false;
            titleTxt.enableVertexGradient = true;
            titleTxt.colorGradient = new VertexGradient(
                new Color(1.0f, 0.98f, 0.60f),
                new Color(1.0f, 0.98f, 0.60f),
                new Color(0.95f, 0.55f, 0.08f),
                new Color(0.95f, 0.55f, 0.08f)
            );
            titleTxt.outlineWidth = 0.28f;
            titleTxt.outlineColor = new Color32(70, 25, 0, 255);

            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 0.5f);
            trt.anchorMax = new Vector2(0.5f, 0.5f);
            trt.pivot = new Vector2(0.5f, 0.5f);
            trt.anchoredPosition = new Vector2(0f, 360f);
            trt.sizeDelta = new Vector2(600f, 160f);

            _buttons[0] = Create3DButton(centerPanel.transform, "RESUME",
                new Vector2(0f, 160f), new Vector2(560f, 130f),
                new Color(0.20f, 0.65f, 0.25f), Resume);

            _buttons[1] = Create3DButton(centerPanel.transform, "RESTART",
                new Vector2(0f, 0f), new Vector2(560f, 130f),
                new Color(0.20f, 0.45f, 0.80f), Restart);

            _buttons[2] = Create3DButton(centerPanel.transform, "SETTINGS",
                new Vector2(0f, -160f), new Vector2(560f, 130f),
                new Color(0.50f, 0.30f, 0.70f), OpenSettings);

            _buttons[3] = Create3DButton(centerPanel.transform, "HOME",
                new Vector2(0f, -320f), new Vector2(560f, 130f),
                new Color(0.35f, 0.35f, 0.42f), GoHome);
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
            highlightImg.color = new Color(1f, 1f, 1f, 0.15f);
            highlightImg.raycastTarget = false;
            var hrt = highlightObj.GetComponent<RectTransform>();
            hrt.anchorMin = new Vector2(0.05f, 0.65f);
            hrt.anchorMax = new Vector2(0.95f, 0.92f);
            hrt.offsetMin = Vector2.zero;
            hrt.offsetMax = Vector2.zero;

            return btn;
        }
    }
}