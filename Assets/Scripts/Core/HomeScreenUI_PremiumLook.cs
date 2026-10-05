using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public partial class HomeScreenUI
    {
        public void BuildPremiumHomeScreen()
        {
            EnsureEventSystem();
            BuildPremiumHomeCanvas();
            BuildLevelSelectCanvas();
            BuildPremiumTopStats();
            BuildPremiumTitle();
            BuildPremiumPlayButton();
            BuildPremiumCategoryButtons();
            BuildPremiumBottomBar();
        }

        private void BuildPremiumHomeCanvas()
        {
            var canvasObj = new GameObject("HomeCanvas");
            canvasObj.transform.SetParent(transform, false);
            _homeCanvas = canvasObj.AddComponent<Canvas>();
            _homeCanvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _homeCanvas.sortingOrder = 500;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();

            var bgObj = new GameObject("BackgroundImage");
            bgObj.transform.SetParent(_homeCanvas.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.sprite = Resources.Load<Sprite>(ThemeConfig.BackgroundPath);
            bgImg.preserveAspect = false;
            bgImg.raycastTarget = false;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;
             }

        private void BuildPremiumTopStats()
        {
            int coins = Progress != null ? Progress.Coins : 0;
            int stars = Progress != null ? Progress.TotalStars : 0;

            // Coins pill
            CreatePillStat(new Vector2(-200f, -50f), new Color(1f, 0.75f, 0.20f),
                "\u25CF", coins.ToString());

            // Stars pill
            CreatePillStat(new Vector2(200f, -50f), new Color(1f, 0.90f, 0.40f),
                "\u2605", stars.ToString());
        }

        private void CreatePillStat(Vector2 pos, Color color, string icon, string value)
        {
            var pillObj = new GameObject("PillStat");
            pillObj.transform.SetParent(_homeCanvas.transform, false);
            var pillImg = pillObj.AddComponent<Image>();
            pillImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.10f, 0.08f, 0.25f), 256, 80);
            pillImg.type = Image.Type.Sliced;
            pillImg.color = Color.white;
            pillImg.raycastTarget = false;
            var pillRt = pillObj.GetComponent<RectTransform>();
            pillRt.anchorMin = new Vector2(0.5f, 1f);
            pillRt.anchorMax = new Vector2(0.5f, 1f);
            pillRt.pivot = new Vector2(0.5f, 1f);
            pillRt.anchoredPosition = pos;
            pillRt.sizeDelta = new Vector2(340f, 90f);

            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(pillObj.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.sprite = UISpriteFactory.Create3DSphereSprite(color, 128);
            iconImg.raycastTarget = false;
            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0f, 0.5f);
            iconRt.anchoredPosition = new Vector2(15f, 0f);
            iconRt.sizeDelta = new Vector2(65f, 65f);

            var textObj = new GameObject("Value");
            textObj.transform.SetParent(pillObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = value;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 42;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleLeft;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 0f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.offsetMin = new Vector2(95f, 0f);
            trt.offsetMax = new Vector2(-15f, 0f);
        }

        private void BuildPremiumTitle()
        {
            var titleObj = new GameObject("TitleImage");
            titleObj.transform.SetParent(_homeCanvas.transform, false);
            var titleImg = titleObj.AddComponent<Image>();
            titleImg.sprite = Resources.Load<Sprite>(ThemeConfig.TitlePath);
            titleImg.preserveAspect = true;
            titleImg.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0.5f, 0.5f);
            titleRt.anchorMax = new Vector2(0.5f, 0.5f);
            titleRt.pivot = new Vector2(0.5f, 0.5f);
            titleRt.anchoredPosition = new Vector2(0f, 640f);
            titleRt.sizeDelta = new Vector2(950f, 400f);

            _titleGroup = titleObj;

            // Ornamental divider below title
            var divObj = new GameObject("Divider");
            divObj.transform.SetParent(_homeCanvas.transform, false);
            var divImg = divObj.AddComponent<Image>();
            divImg.color = new Color(1f, 0.85f, 0.35f, 0.9f);
            var divRt = divObj.GetComponent<RectTransform>();
            divRt.anchorMin = new Vector2(0.5f, 0.5f);
            divRt.anchorMax = new Vector2(0.5f, 0.5f);
            divRt.pivot = new Vector2(0.5f, 0.5f);
            divRt.anchoredPosition = new Vector2(0f, 440f);
            divRt.sizeDelta = new Vector2(550f, 8f);

            var diamondObj = new GameObject("Diamond");
            diamondObj.transform.SetParent(_homeCanvas.transform, false);
            var diaImg = diamondObj.AddComponent<Image>();
            diaImg.color = new Color(1f, 0.85f, 0.35f);
            var diaRt = diamondObj.GetComponent<RectTransform>();
            diaRt.anchorMin = new Vector2(0.5f, 0.5f);
            diaRt.anchorMax = new Vector2(0.5f, 0.5f);
            diaRt.pivot = new Vector2(0.5f, 0.5f);
            diaRt.anchoredPosition = new Vector2(0f, 440f);
            diaRt.sizeDelta = new Vector2(25f, 25f);
            diaRt.localRotation = Quaternion.Euler(0f, 0f, 45f);
        }

        private void BuildPremiumPlayButton()
        {
            var playObj = new GameObject("PlayButton");
            playObj.transform.SetParent(_homeCanvas.transform, false);
            var playImg = playObj.AddComponent<Image>();
            playImg.sprite = Resources.Load<Sprite>(ThemeConfig.PlayButtonPath);
            playImg.preserveAspect = true;
            var btn = playObj.AddComponent<Button>();
            btn.transition = Selectable.Transition.None;
            btn.onClick.AddListener(() =>
            {
                if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
                OnPlayClicked();
            });
            var playRt = playObj.GetComponent<RectTransform>();
            playRt.anchorMin = new Vector2(0.5f, 0.5f);
            playRt.anchorMax = new Vector2(0.5f, 0.5f);
            playRt.pivot = new Vector2(0.5f, 0.5f);
            playRt.anchoredPosition = new Vector2(0f, 100f);
            playRt.sizeDelta = new Vector2(950f, 400f);

            var textObj = new GameObject("PlayText");
            textObj.transform.SetParent(playObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = "PLAY";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 110;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.95f, 0.75f, 1f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var outline = textObj.AddComponent<Outline>();
            outline.effectColor = new Color(0.30f, 0.10f, 0.05f, 1f);
            outline.effectDistance = new Vector2(4f, -4f);
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void BuildPremiumCategoryButtons()
        {
            float xSpacing = 240f;
            float ySpacing = 330f;
            float centerY = -400f;

            CreatePremiumCategoryButton("SOCIAL", "icon_social",
                new Vector2(-xSpacing, centerY), () => OpenCategory("social"));
            CreatePremiumCategoryButton("SHOP", "icon_shop",
                new Vector2(xSpacing, centerY), () => OpenCategory("shop"));
            CreatePremiumCategoryButton("LEVELS", "icon_theme", new Vector2(-xSpacing, centerY - ySpacing), OnLevelsClicked);
            CreatePremiumCategoryButton("PROGRESS", "icon_progress",
                new Vector2(xSpacing, centerY - ySpacing), () => OpenCategory("progress"));
        }

        private void CreatePremiumCategoryButton(string label, string iconName,
            Vector2 pos, UnityEngine.Events.UnityAction onClick)
        {
            var rootObj = new GameObject("CatBtn_" + label);
            rootObj.transform.SetParent(_homeCanvas.transform, false);
            var rootRt = rootObj.AddComponent<RectTransform>();
            rootRt.anchorMin = new Vector2(0.5f, 0.5f);
            rootRt.anchorMax = new Vector2(0.5f, 0.5f);
            rootRt.pivot = new Vector2(0.5f, 0.5f);
            rootRt.anchoredPosition = pos;
            rootRt.sizeDelta = new Vector2(430f, 430f);

            var clickImg = rootObj.AddComponent<Image>();
            clickImg.color = new Color(0f, 0f, 0f, 0.01f);
            clickImg.raycastTarget = true;

            var frameObj = new GameObject("Frame");
            frameObj.transform.SetParent(rootObj.transform, false);
            var frameImg = frameObj.AddComponent<Image>();
            frameImg.sprite = Resources.Load<Sprite>(ThemeConfig.FramePath);
            frameImg.preserveAspect = true;
            frameImg.raycastTarget = false;
            var frameRt = frameObj.GetComponent<RectTransform>();
            frameRt.anchorMin = Vector2.zero;
            frameRt.anchorMax = Vector2.one;
            frameRt.offsetMin = Vector2.zero;
            frameRt.offsetMax = Vector2.zero;

            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(rootObj.transform, false);
            var iconImg = iconObj.AddComponent<Image>();
            iconImg.sprite = Resources.Load<Sprite>(ThemeConfig.IconPath(iconName));
            iconImg.preserveAspect = true;
            iconImg.raycastTarget = false;
            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0.5f, 0.5f);
            iconRt.anchorMax = new Vector2(0.5f, 0.5f);
            iconRt.pivot = new Vector2(0.5f, 0.5f);
            iconRt.anchoredPosition = new Vector2(0f, 30f);
            iconRt.sizeDelta = new Vector2(220f, 220f);

            var labelBgObj = new GameObject("LabelBg");
            labelBgObj.transform.SetParent(rootObj.transform, false);
            var labelBgImg = labelBgObj.AddComponent<Image>();
            labelBgImg.color = new Color(1f, 0.85f, 0.30f, 0.95f);
            var lbRt = labelBgObj.GetComponent<RectTransform>();
            lbRt.anchorMin = new Vector2(0.05f, 0.05f);
            lbRt.anchorMax = new Vector2(0.95f, 0.22f);
            lbRt.offsetMin = Vector2.zero;
            lbRt.offsetMax = Vector2.zero;

            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(labelBgObj.transform, false);
            var labelTxt = labelObj.AddComponent<Text>();
            labelTxt.text = label;
            labelTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            labelTxt.fontSize = 34;
            labelTxt.fontStyle = FontStyle.Bold;
            labelTxt.color = new Color(0.20f, 0.10f, 0.05f);
            labelTxt.alignment = TextAnchor.MiddleCenter;
            labelTxt.raycastTarget = false;
            var lblRt = labelObj.GetComponent<RectTransform>();
            lblRt.anchorMin = Vector2.zero;
            lblRt.anchorMax = Vector2.one;
            lblRt.offsetMin = Vector2.zero;
            lblRt.offsetMax = Vector2.zero;

            var btn = rootObj.AddComponent<Button>();
            btn.targetGraphic = clickImg;
            btn.transition = Selectable.Transition.None;
            btn.onClick.AddListener(() =>
            {
                if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
                onClick?.Invoke();
            });
        }

        private void BuildPremiumBottomBar()
        {
            // Settings button (left)
            CreateBottomSmallButton("SETTINGS", new Vector2(-250f, 20f), () =>
            {
                var s = FindFirstObjectByType<SettingsScreenUI>();
                if (s != null) s.Show();
            });

            // Exit button (right)
            CreateBottomSmallButton("EXIT", new Vector2(300f, 20f), () =>
            {
                Application.Quit();
                #if UNITY_EDITOR
                UnityEditor.EditorApplication.isPlaying = false;
                #endif
            });
        }

        private void CreateBottomSmallButton(string label, Vector2 pos, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject("Btn_" + label);
            obj.transform.SetParent(_homeCanvas.transform, false);
            var img = obj.AddComponent<Image>();
            img.color = new Color(0.10f, 0.05f, 0.25f, 0.9f);
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0f);
            rt.anchorMax = new Vector2(0.5f, 0f);
            rt.pivot = new Vector2(0.5f, 0f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(280f, 80f);

            var txtObj = new GameObject("Label");
            txtObj.transform.SetParent(obj.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.35f);
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}