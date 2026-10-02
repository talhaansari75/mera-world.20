using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class HomeScreenUI
    {
        private void CreateStatsCard(Transform parent, Vector2 pos, int coins, int stars)
        {
            var shadowObj = new GameObject("StatsShadow");
            shadowObj.transform.SetParent(parent, false);
            var shadowImg = shadowObj.AddComponent<Image>();
            shadowImg.sprite = UISpriteFactory.CreateRoundedSprite(new Color(0f, 0f, 0f, 0.6f), 128, 24);
            shadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = new Vector2(0.5f, 0.5f);
            shRt.anchorMax = new Vector2(0.5f, 0.5f);
            shRt.pivot = new Vector2(0.5f, 0.5f);
            shRt.anchoredPosition = pos + new Vector2(0f, -8f);
            shRt.sizeDelta = new Vector2(680f, 130f);

            var cardObj = new GameObject("StatsCard");
            cardObj.transform.SetParent(parent, false);
            var cardImg = cardObj.AddComponent<Image>();
            cardImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.22f, 0.28f, 0.50f), 256, 40);
            cardImg.type = Image.Type.Sliced;
            cardImg.color = Color.white;
            cardImg.raycastTarget = false;
            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(680f, 130f);

            var cGlow = new GameObject("CoinGlow", typeof(RectTransform));
            cGlow.transform.SetParent(cardObj.transform, false);
            var cGlowImg = cGlow.AddComponent<Image>();
            cGlowImg.sprite = UISpriteFactory.CreateGlowSprite(new Color(1f, 0.82f, 0.20f, 0.6f), 128);
            cGlowImg.raycastTarget = false;
            var cGlowRt = cGlow.GetComponent<RectTransform>();
            cGlowRt.anchorMin = new Vector2(0.5f, 0.5f);
            cGlowRt.anchorMax = new Vector2(0.5f, 0.5f);
            cGlowRt.pivot = new Vector2(0.5f, 0.5f);
            cGlowRt.anchoredPosition = new Vector2(-250f, 0f);
            cGlowRt.sizeDelta = new Vector2(115f, 115f);
            CreateIcon(cardObj.transform, new Vector2(-250f, 0f), new Vector2(70f, 70f),
                new Color(1f, 0.82f, 0.20f));

            CreateText(cardObj.transform, coins.ToString(), new Vector2(-140f, 0f), 48,
                GOLD, FontStyle.Bold, true);

            var divObj = new GameObject("Divider");
            divObj.transform.SetParent(cardObj.transform, false);
            var divImg = divObj.AddComponent<Image>();
            divImg.color = new Color(0.6f, 0.7f, 0.95f, 0.8f);
            divImg.raycastTarget = false;
            var divRt = divObj.GetComponent<RectTransform>();
            divRt.anchorMin = new Vector2(0.5f, 0.5f);
            divRt.anchorMax = new Vector2(0.5f, 0.5f);
            divRt.pivot = new Vector2(0.5f, 0.5f);
            divRt.anchoredPosition = Vector2.zero;
            divRt.sizeDelta = new Vector2(4f, 90f);

            var sGlow = new GameObject("StarGlow", typeof(RectTransform));
            sGlow.transform.SetParent(cardObj.transform, false);
            var sGlowImg = sGlow.AddComponent<Image>();
            sGlowImg.sprite = UISpriteFactory.CreateGlowSprite(new Color(1f, 0.90f, 0.55f, 0.6f), 128);
            sGlowImg.raycastTarget = false;
            var sGlowRt = sGlow.GetComponent<RectTransform>();
            sGlowRt.anchorMin = new Vector2(0.5f, 0.5f);
            sGlowRt.anchorMax = new Vector2(0.5f, 0.5f);
            sGlowRt.pivot = new Vector2(0.5f, 0.5f);
            sGlowRt.anchoredPosition = new Vector2(70f, 0f);
            sGlowRt.sizeDelta = new Vector2(115f, 115f);
            CreateIcon(cardObj.transform, new Vector2(70f, 0f), new Vector2(70f, 70f),
                new Color(1f, 0.90f, 0.55f));

            CreateText(cardObj.transform, stars.ToString(), new Vector2(180f, 0f), 48,
                new Color(1f, 0.92f, 0.60f), FontStyle.Bold, true);
        }

        private Image CreateIcon(Transform parent, Vector2 pos, Vector2 size, Color color)
        {
            var obj = new GameObject("Icon");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DSphereSprite(color, 128);
            img.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;
            return img;
        }

        private void Create3DButton(Transform parent, string label, Vector2 pos, Vector2 size,
            Color color, int fontSize, UnityEngine.Events.UnityAction onClick)
        {
            var rootObj = new GameObject($"Btn_{label}");
            rootObj.transform.SetParent(parent, false);
            var rootRt = rootObj.AddComponent<RectTransform>();
            rootRt.anchorMin = new Vector2(0.5f, 0.5f);
            rootRt.anchorMax = new Vector2(0.5f, 0.5f);
            rootRt.pivot = new Vector2(0.5f, 0.5f);
            rootRt.anchoredPosition = pos;
            rootRt.sizeDelta = size;

            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(rootObj.transform, false);
            var bShadowImg = shadowObj.AddComponent<Image>();
            bShadowImg.sprite = UISpriteFactory.Create3DButtonSprite(
                Color.Lerp(color, Color.black, 0.75f), 256, 40);
            bShadowImg.type = Image.Type.Sliced;
            bShadowImg.raycastTarget = false;
            var bsRt = bottomShadowSetup(shadowObj);
            bsRt.anchoredPosition = new Vector2(0f, -18f);

            var buttonObj = new GameObject("Button");
            buttonObj.transform.SetParent(rootObj.transform, false);
            var btnImg = buttonObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var button = buttonObj.AddComponent<Button>();
            button.onClick.AddListener(onClick);

            var btnRt = buttonObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 18f);

            var colors = button.colors;
            colors.normalColor = Color.white;
            colors.highlightedColor = new Color(1.1f, 1.1f, 1.1f);
            colors.pressedColor = new Color(0.85f, 0.85f, 0.85f);
            colors.fadeDuration = 0.05f;
            button.colors = colors;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(buttonObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = fontSize;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var outline = textObj.AddComponent<Shadow>();
            outline.effectColor = new Color(0f, 0f, 0f, 0.9f);
            outline.effectDistance = new Vector2(3f, -3f);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            button.onClick.AddListener(() => StartCoroutine(PressAnimation(btnRt)));
        }

        private RectTransform bottomShadowSetup(GameObject shadowObj)
        {
            var rt = shadowObj.GetComponent<RectTransform>();
            if (rt == null) rt = shadowObj.AddComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;
            return rt;
        }

        private IEnumerator PressAnimation(RectTransform rt)
        {
            float duration = 0.12f;
            float elapsed = 0f;
            Vector2 start = new Vector2(0f, 18f);
            Vector2 end = new Vector2(0f, 0f);

            while (elapsed < duration / 2f)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / (duration / 2f);
                rt.offsetMax = Vector2.Lerp(start, end, t);
                yield return null;
            }

            elapsed = 0f;
            while (elapsed < duration / 2f)
            {
                elapsed += Time.unscaledDeltaTime;
                float t = elapsed / (duration / 2f);
                rt.offsetMax = Vector2.Lerp(end, start, t);
                yield return null;
            }
            rt.offsetMax = start;
        }

        private void CreateIconButton(Transform parent, Vector2 pos, Vector2 size,
            Vector2 anchorMin, Vector2 anchorMax, Color color, string label, int fontSize,
            UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Icon_{label}");
            obj.transform.SetParent(parent, false);

            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 60);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = anchorMin;
            rt.anchorMax = anchorMax;
            rt.pivot = new Vector2(anchorMin.x == 1f ? 1f : 0.5f,
                                   anchorMax.y == 1f ? 1f : 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = fontSize;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.55f);
            shadow.effectDistance = new Vector2(2f, -2f);

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color,
            FontStyle style, bool addShadow)
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
            txt.supportRichText = true;
            txt.raycastTarget = false;

            if (addShadow)
            {
                var shadow = obj.AddComponent<Shadow>();
                shadow.effectColor = new Color(0f, 0f, 0f, 0.65f);
                shadow.effectDistance = new Vector2(3f, -3f);
            }

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 160f);
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
            var shadow = textObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.5f);
            shadow.effectDistance = new Vector2(2f, -2f);
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void ShowOfflineToast(string message)
        {
            Debug.LogWarning($"[Home] {message}");

            var canvasObj = new GameObject("OfflineToast");
            var canvas = canvasObj.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 999;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;
            canvasObj.AddComponent<GraphicRaycaster>();

            var panel = new GameObject("Panel");
            panel.transform.SetParent(canvas.transform, false);
            var img = panel.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.85f, 0.30f, 0.30f), 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var rt = panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(800f, 160f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(panel.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = message;
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

            Object.Destroy(canvasObj, 2.5f);
        }
    }
}