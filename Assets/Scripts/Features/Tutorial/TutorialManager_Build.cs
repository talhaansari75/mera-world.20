using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class TutorialManager
    {
        private void BuildUI()
        {
            var canvasObj = new GameObject("TutorialCanvas");
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 2000;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();

            // Dark overlay
            var darkObj = new GameObject("DarkOverlay");
            darkObj.transform.SetParent(_canvas.transform, false);
            _darkPanel = darkObj.AddComponent<Image>();
            _darkPanel.color = new Color(0f, 0f, 0f, 0.85f);
            var drt = darkObj.GetComponent<RectTransform>();
            drt.anchorMin = Vector2.zero;
            drt.anchorMax = Vector2.one;
            drt.offsetMin = Vector2.zero;
            drt.offsetMax = Vector2.zero;

            // Main card
            _overlay = new GameObject("Card");
            _overlay.transform.SetParent(_canvas.transform, false);
            var cardImg = _overlay.AddComponent<Image>();
            cardImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.12f, 0.18f, 0.32f), 256, 40);
            cardImg.type = Image.Type.Sliced;
            cardImg.color = Color.white;

            var crt = _overlay.GetComponent<RectTransform>();
            crt.anchorMin = new Vector2(0.5f, 0.5f);
            crt.anchorMax = new Vector2(0.5f, 0.5f);
            crt.pivot = new Vector2(0.5f, 0.5f);
            crt.anchoredPosition = Vector2.zero;
            crt.sizeDelta = new Vector2(920f, 1100f);

            // Step counter (top)
            var stepObj = new GameObject("StepCounter");
            stepObj.transform.SetParent(_overlay.transform, false);
            _stepCounter = stepObj.AddComponent<Text>();
            _stepCounter.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _stepCounter.fontSize = 28;
            _stepCounter.fontStyle = FontStyle.Bold;
            _stepCounter.color = new Color(0.70f, 0.80f, 1f);
            _stepCounter.alignment = TextAnchor.MiddleCenter;
            _stepCounter.raycastTarget = false;
            var srt = stepObj.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 1f);
            srt.anchorMax = new Vector2(0.5f, 1f);
            srt.pivot = new Vector2(0.5f, 1f);
            srt.anchoredPosition = new Vector2(0f, -30f);
            srt.sizeDelta = new Vector2(200f, 40f);

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_overlay.transform, false);
            _titleText = titleObj.AddComponent<Text>();
            _titleText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _titleText.fontSize = 68;
            _titleText.fontStyle = FontStyle.Bold;
            _titleText.color = new Color(1f, 0.85f, 0.30f);
            _titleText.alignment = TextAnchor.MiddleCenter;
            _titleText.raycastTarget = false;
            var titrt = titleObj.GetComponent<RectTransform>();
            titrt.anchorMin = new Vector2(0.5f, 1f);
            titrt.anchorMax = new Vector2(0.5f, 1f);
            titrt.pivot = new Vector2(0.5f, 1f);
            titrt.anchoredPosition = new Vector2(0f, -100f);
            titrt.sizeDelta = new Vector2(860f, 100f);

            // Divider
            var divObj = new GameObject("Divider");
            divObj.transform.SetParent(_overlay.transform, false);
            var divImg = divObj.AddComponent<Image>();
            divImg.color = new Color(1f, 0.85f, 0.30f, 0.6f);
            var divrt = divObj.GetComponent<RectTransform>();
            divrt.anchorMin = new Vector2(0.5f, 1f);
            divrt.anchorMax = new Vector2(0.5f, 1f);
            divrt.pivot = new Vector2(0.5f, 1f);
            divrt.anchoredPosition = new Vector2(0f, -220f);
            divrt.sizeDelta = new Vector2(500f, 4f);

            // Body
            var bodyObj = new GameObject("Body");
            bodyObj.transform.SetParent(_overlay.transform, false);
            _bodyText = bodyObj.AddComponent<Text>();
            _bodyText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _bodyText.fontSize = 34;
            _bodyText.color = new Color(0.95f, 0.95f, 1f);
            _bodyText.alignment = TextAnchor.UpperCenter;
            _bodyText.horizontalOverflow = HorizontalWrapMode.Wrap;
            _bodyText.verticalOverflow = VerticalWrapMode.Overflow;
            _bodyText.raycastTarget = false;
            _bodyText.lineSpacing = 1.3f;

            var brt = bodyObj.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 0.5f);
            brt.anchorMax = new Vector2(0.5f, 0.5f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = new Vector2(0f, 60f);
            brt.sizeDelta = new Vector2(820f, 500f);

            // Next button
            var btnObj = new GameObject("NextButton");
            btnObj.transform.SetParent(_overlay.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(
                new Color(0.25f, 0.65f, 0.35f), 256, 40);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(OnNextClicked);

            var btnrt = btnObj.GetComponent<RectTransform>();
            btnrt.anchorMin = new Vector2(0.5f, 0f);
            btnrt.anchorMax = new Vector2(0.5f, 0f);
            btnrt.pivot = new Vector2(0.5f, 0f);
            btnrt.anchoredPosition = new Vector2(0f, 40f);
            btnrt.sizeDelta = new Vector2(720f, 130f);

            var btnTextObj = new GameObject("Label");
            btnTextObj.transform.SetParent(btnObj.transform, false);
            _nextButtonText = btnTextObj.AddComponent<Text>();
            _nextButtonText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _nextButtonText.fontSize = 44;
            _nextButtonText.fontStyle = FontStyle.Bold;
            _nextButtonText.color = Color.white;
            _nextButtonText.alignment = TextAnchor.MiddleCenter;
            _nextButtonText.raycastTarget = false;
            var btrt = btnTextObj.GetComponent<RectTransform>();
            btrt.anchorMin = Vector2.zero;
            btrt.anchorMax = Vector2.one;
            btrt.offsetMin = Vector2.zero;
            btrt.offsetMax = Vector2.zero;

            var btnShadow = btnTextObj.AddComponent<Shadow>();
            btnShadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            btnShadow.effectDistance = new Vector2(2f, -2f);

            // Skip button (top-right)
            var skipObj = new GameObject("SkipButton");
            skipObj.transform.SetParent(_overlay.transform, false);
            var skipImg = skipObj.AddComponent<Image>();
            skipImg.color = new Color(0.4f, 0.4f, 0.5f, 0.6f);
            var skipBtn = skipObj.AddComponent<Button>();
            skipBtn.onClick.AddListener(CompleteTutorial);

            var skipRt = skipObj.GetComponent<RectTransform>();
            skipRt.anchorMin = new Vector2(1f, 1f);
            skipRt.anchorMax = new Vector2(1f, 1f);
            skipRt.pivot = new Vector2(1f, 1f);
            skipRt.anchoredPosition = new Vector2(-20f, -20f);
            skipRt.sizeDelta = new Vector2(140f, 60f);

            var skipTextObj = new GameObject("Label");
            skipTextObj.transform.SetParent(skipObj.transform, false);
            var skipTxt = skipTextObj.AddComponent<Text>();
            skipTxt.text = "SKIP";
            skipTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            skipTxt.fontSize = 26;
            skipTxt.fontStyle = FontStyle.Bold;
            skipTxt.color = Color.white;
            skipTxt.alignment = TextAnchor.MiddleCenter;
            skipTxt.raycastTarget = false;
            var stxtrt = skipTextObj.GetComponent<RectTransform>();
            stxtrt.anchorMin = Vector2.zero;
            stxtrt.anchorMax = Vector2.one;
            stxtrt.offsetMin = Vector2.zero;
            stxtrt.offsetMax = Vector2.zero;
        }
    }
}