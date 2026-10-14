using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class BotRaceMode
    {
        private void BuildCanvas()
        {
            var canvasObj = new GameObject("BotRaceCanvas");
            canvasObj.transform.SetParent(transform, false);

            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 800;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildRacePanel()
        {
            _racePanel = new GameObject("RacePanel");
            _racePanel.transform.SetParent(_canvas.transform, false);

            var bg = _racePanel.AddComponent<Image>();
            Color topColor, bottomColor;
            if (TestModeTheme.IsActive)
            {
                topColor = new Color(0.98f, 0.96f, 0.90f);
                bottomColor = new Color(0.92f, 0.88f, 0.82f);
            }
            else
            {
                topColor = new Color(0.08f, 0.15f, 0.28f);
                bottomColor = new Color(0.15f, 0.28f, 0.45f);
            }
            bg.sprite = UISpriteFactory.CreateGradientSprite(topColor, bottomColor, 32, 256);
            bg.type = Image.Type.Simple;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = _racePanel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(0f, 400f);

            var gl = new GameObject("GoldLine");
            gl.transform.SetParent(_racePanel.transform, false);
            var glImg = gl.AddComponent<Image>();
            glImg.color = TestModeTheme.IsActive ? new Color(0.55f, 0.40f, 0.20f, 0.5f) : new Color(1f, 0.85f, 0.30f);
            glImg.raycastTarget = false;
            var glRt = gl.GetComponent<RectTransform>();
            glRt.anchorMin = new Vector2(0f, 0f);
            glRt.anchorMax = new Vector2(1f, 0f);
            glRt.pivot = new Vector2(0.5f, 0f);
            glRt.sizeDelta = new Vector2(0f, 4f);
            glRt.anchoredPosition = Vector2.zero;

            // PLAYER (LEFT)
            BuildAvatarFrame(new Vector2(-420f, -160f), new Color(0.55f, 0.30f, 0.75f), "girl");
            BuildStarBadge(new Vector2(-515f, -40f), new Color(0.20f, 0.50f, 0.85f), "26");
            BuildTopRibbon(new Vector2(-420f, -40f));
            BuildLabelText("YOU", new Vector2(-260f, -120f), 46, Color.white, TextAnchor.MiddleLeft, false);
            _playerScoreText = BuildLabelText("0/8", new Vector2(-260f, -190f), 56, Color.white, TextAnchor.MiddleLeft, true);
            _playerProgressFill = BuildModernBar(new Vector2(-260f, -270f), new Color(1f, 0.85f, 0.30f));

            // BOT (RIGHT)
            string botLabel = _bot != null ? _bot.Name : "Bot";
            BuildAvatarFrame(new Vector2(420f, -160f), new Color(0.95f, 0.55f, 0.30f), "boy");
            BuildStarBadge(new Vector2(515f, -40f), new Color(1f, 0.75f, 0.20f), "23");
            BuildLabelText(botLabel, new Vector2(260f, -120f), 46, Color.white, TextAnchor.MiddleRight, false);
            _botScoreText = BuildLabelText("0/8", new Vector2(260f, -190f), 56, Color.white, TextAnchor.MiddleRight, true);
            _botProgressFill = BuildModernBar(new Vector2(260f, -270f), new Color(1f, 0.85f, 0.30f));
            BuildCoinsDisplay(new Vector2(440f, -320f));

            // CENTER
            BuildTrophyIcon(new Vector2(0f, -60f));
            BuildVSBadgeIcon(new Vector2(0f, -230f));
        }

        private void BuildAvatarFrame(Vector2 pos, Color color, string imgName)
        {
            var cont = new GameObject("AvatarCont");
            cont.transform.SetParent(_racePanel.transform, false);
            var crt = cont.AddComponent<RectTransform>();
            crt.anchorMin = new Vector2(0.5f, 1f);
            crt.anchorMax = new Vector2(0.5f, 1f);
            crt.pivot = new Vector2(0.5f, 0.5f);
            crt.anchoredPosition = pos;
            crt.sizeDelta = new Vector2(180f, 180f);

            var inner = new GameObject("Inner");
            inner.transform.SetParent(cont.transform, false);
            var iImg = inner.AddComponent<Image>();
            iImg.color = TestModeTheme.IsActive ? new Color(0.92f, 0.88f, 0.82f) : new Color(0.65f, 0.45f, 0.85f);
            iImg.raycastTarget = false;
            var irt = inner.GetComponent<RectTransform>();
            irt.anchorMin = Vector2.zero;
            irt.anchorMax = Vector2.one;
            irt.offsetMin = new Vector2(22f, 22f);
            irt.offsetMax = new Vector2(-22f, -22f);

            Sprite imgSprite = null;
            if (!string.IsNullOrEmpty(imgName))
                imgSprite = Resources.Load<Sprite>("UI/Avatars/" + imgName);

            if (imgSprite != null)
            {
                var imgObj = new GameObject("Img");
                imgObj.transform.SetParent(inner.transform, false);
                var img = imgObj.AddComponent<Image>();
                img.sprite = imgSprite;
                img.color = Color.white;
                img.raycastTarget = false;
                img.preserveAspect = true;
                var imRt = imgObj.GetComponent<RectTransform>();
                imRt.anchorMin = Vector2.zero;
                imRt.anchorMax = Vector2.one;
                imRt.offsetMin = Vector2.zero;
                imRt.offsetMax = Vector2.zero;
            }

            var frameObj = new GameObject("GoldFrame");
            frameObj.transform.SetParent(cont.transform, false);
            var fImg = frameObj.AddComponent<Image>();
            Sprite frameSprite = Resources.Load<Sprite>("UI/Multiplayer/gold_frame");
            Debug.Log("[BotRace] gold_frame loaded? " + (frameSprite != null));
            if (frameSprite != null)
            {
                fImg.sprite = frameSprite;
                fImg.preserveAspect = true;
            }
            else
            {
                fImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.85f, 0.30f), 128, 20);
                fImg.type = Image.Type.Sliced;
            }
            fImg.color = Color.white;
            fImg.raycastTarget = false;
            var frt = frameObj.GetComponent<RectTransform>();
            frt.anchorMin = Vector2.zero;
            frt.anchorMax = Vector2.one;
            frt.offsetMin = Vector2.zero;
            frt.offsetMax = Vector2.zero;
        }

        private void BuildStarBadge(Vector2 pos, Color color, string num)
        {
            var badge = new GameObject("Star");
            badge.transform.SetParent(_racePanel.transform, false);
            var brt = badge.AddComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 1f);
            brt.anchorMax = new Vector2(0.5f, 1f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = pos;
            brt.sizeDelta = new Vector2(62f, 62f);

            var img = badge.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DSphereSprite(color, 128);
            img.color = Color.white;
            img.raycastTarget = false;

            var txtObj = new GameObject("Num");
            txtObj.transform.SetParent(badge.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = num;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 30;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void BuildTopRibbon(Vector2 pos)
        {
            var rb = new GameObject("TopRibbon");
            rb.transform.SetParent(_racePanel.transform, false);
            var rrt = rb.AddComponent<RectTransform>();
            rrt.anchorMin = new Vector2(0.5f, 1f);
            rrt.anchorMax = new Vector2(0.5f, 1f);
            rrt.pivot = new Vector2(0.5f, 0f);
            rrt.anchoredPosition = pos;
            rrt.sizeDelta = new Vector2(110f, 55f);

            var img = rb.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.90f, 0.20f, 0.20f), 128, 8);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var txtObj = new GameObject("Txt");
            txtObj.transform.SetParent(rb.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = "TOP 1";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 22;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private Text BuildLabelText(string text, Vector2 pos, int size, Color color, TextAnchor align, bool bold)
        {
            var obj = new GameObject("Label");
            obj.transform.SetParent(_racePanel.transform, false);
            var txt = obj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = bold ? FontStyle.Bold : FontStyle.Normal;
            txt.color = TestModeTheme.IsActive ? new Color(0.35f, 0.20f, 0.10f) : color;
            txt.alignment = align;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(240f, 70f);
            return txt;
        }

        private Image BuildModernBar(Vector2 pos, Color fillColor)
        {
            var bgObj = new GameObject("BarBg");
            bgObj.transform.SetParent(_racePanel.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.20f, 0.35f), 64, 12);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;
            bgImg.raycastTarget = false;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.5f, 1f);
            bgRt.anchorMax = new Vector2(0.5f, 1f);
            bgRt.pivot = new Vector2(0.5f, 1f);
            bgRt.anchoredPosition = pos;
            bgRt.sizeDelta = new Vector2(280f, 24f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(bgObj.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.sprite = UISpriteFactory.Create3DButtonSprite(fillColor, 64, 10);
            fillImg.type = Image.Type.Sliced;
            fillImg.color = Color.white;
            fillImg.raycastTarget = false;
            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(3f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -6f);
            return fillImg;
        }

        private void BuildCoinsDisplay(Vector2 pos)
        {
            var coin = new GameObject("Coin");
            coin.transform.SetParent(_racePanel.transform, false);
            var cImg = coin.AddComponent<Image>();
            cImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.80f, 0.20f), 128);
            cImg.color = Color.white;
            cImg.raycastTarget = false;
            var cRt = coin.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0.5f, 1f);
            cRt.anchorMax = new Vector2(0.5f, 1f);
            cRt.pivot = new Vector2(0.5f, 0.5f);
            cRt.anchoredPosition = pos;
            cRt.sizeDelta = new Vector2(48f, 48f);

            var txtObj = new GameObject("CoinTxt");
            txtObj.transform.SetParent(_racePanel.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = "1000";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 34;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.30f);
            txt.alignment = TextAnchor.MiddleLeft;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 1f);
            trt.anchorMax = new Vector2(0.5f, 1f);
            trt.pivot = new Vector2(0f, 0.5f);
            trt.anchoredPosition = pos + new Vector2(35f, 0f);
            trt.sizeDelta = new Vector2(200f, 60f);
        }

        private void BuildTrophyIcon(Vector2 pos)
        {
            var tr = new GameObject("Trophy");
            tr.transform.SetParent(_racePanel.transform, false);
            var rt = tr.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(100f, 100f);

            var img = tr.AddComponent<Image>();
            Sprite trophySprite = Resources.Load<Sprite>("UI/Multiplayer/trophy");
            Debug.Log("[BotRace] trophy loaded? " + (trophySprite != null));
            if (trophySprite != null)
            {
                img.sprite = trophySprite;
                img.preserveAspect = true;
            }
            else
            {
                img.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.30f), 128);
            }
            img.color = Color.white;
            img.raycastTarget = false;
        }

        private void BuildVSBadgeIcon(Vector2 pos)
        {
            var vs = new GameObject("VS");
            vs.transform.SetParent(_racePanel.transform, false);
            var rt = vs.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(340f, 170f);

            var img = vs.AddComponent<Image>();
            Sprite vsSprite = Resources.Load<Sprite>("UI/Multiplayer/vs_badge");
            Debug.Log("[BotRace] vs_badge loaded? " + (vsSprite != null));
            if (vsSprite != null)
            {
                img.sprite = vsSprite;
                img.preserveAspect = true;
                img.color = Color.white;
                img.raycastTarget = false;
            }
            else
            {
                img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.80f, 0.20f), 128, 12);
                img.type = Image.Type.Sliced;
                img.color = Color.white;
                img.raycastTarget = false;

                var txtObj = new GameObject("Txt");
                txtObj.transform.SetParent(vs.transform, false);
                var txt = txtObj.AddComponent<Text>();
                txt.text = "VS";
                txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                txt.fontSize = 48;
                txt.fontStyle = FontStyle.Bold;
                txt.color = new Color(0.15f, 0.10f, 0.05f);
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
}