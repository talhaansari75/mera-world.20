using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class BotRaceMode
    {
        private void BuildVSCircle(Transform parent, Vector2 pos)
        {
            var vsOuter = new GameObject("VSOuter");
            vsOuter.transform.SetParent(parent, false);
            var vsOuterImg = vsOuter.AddComponent<Image>();
            vsOuterImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(0.10f, 0.05f, 0.20f), 256);
            vsOuterImg.color = Color.white;
            vsOuterImg.raycastTarget = false;
            var vsORt = vsOuter.GetComponent<RectTransform>();
            vsORt.anchorMin = new Vector2(0.5f, 1f);
            vsORt.anchorMax = new Vector2(0.5f, 1f);
            vsORt.pivot = new Vector2(0.5f, 1f);
            vsORt.anchoredPosition = pos;
            vsORt.sizeDelta = new Vector2(100f, 100f);

            var vsBg = new GameObject("VSGold");
            vsBg.transform.SetParent(vsOuter.transform, false);
            var vsBgImg = vsBg.AddComponent<Image>();
            vsBgImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.30f), 256);
            vsBgImg.color = Color.white;
            vsBgImg.raycastTarget = false;
            var vsBgRt = vsBg.GetComponent<RectTransform>();
            vsBgRt.anchorMin = Vector2.zero;
            vsBgRt.anchorMax = Vector2.one;
            vsBgRt.offsetMin = Vector2.zero;
            vsBgRt.offsetMax = Vector2.zero;

            var vsInner = new GameObject("VSInner");
            vsInner.transform.SetParent(vsBg.transform, false);
            var vsInnerImg = vsInner.AddComponent<Image>();
            vsInnerImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(0.90f, 0.55f, 0.15f), 256);
            vsInnerImg.color = Color.white;
            vsInnerImg.raycastTarget = false;
            var vsIRt = vsInner.GetComponent<RectTransform>();
            vsIRt.anchorMin = Vector2.zero;
            vsIRt.anchorMax = Vector2.one;
            vsIRt.offsetMin = new Vector2(10f, 10f);
            vsIRt.offsetMax = new Vector2(-10f, -10f);

            var vsTxtObj = new GameObject("VSText");
            vsTxtObj.transform.SetParent(vsInner.transform, false);
            var vsTxt = vsTxtObj.AddComponent<Text>();
            vsTxt.text = "VS";
            vsTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            vsTxt.fontSize = 52;
            vsTxt.fontStyle = FontStyle.Bold;
            vsTxt.color = new Color(0.20f, 0.10f, 0.05f);
            vsTxt.alignment = TextAnchor.MiddleCenter;
            vsTxt.raycastTarget = false;
            var vsTrt = vsTxtObj.GetComponent<RectTransform>();
            vsTrt.anchorMin = Vector2.zero;
            vsTrt.anchorMax = Vector2.one;
            vsTrt.offsetMin = Vector2.zero;
            vsTrt.offsetMax = Vector2.zero;
        }

        private void CreateAvatar(Transform parent, Vector2 pos, Vector2 size, Color color, string icon)
        {
            var frame = new GameObject("AvatarFrame");
            frame.transform.SetParent(parent, false);

            var frameImg = frame.AddComponent<Image>();
            frameImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(0.10f, 0.05f, 0.20f), 256);
            frameImg.color = Color.white;
            frameImg.raycastTarget = false;

            var frt = frame.GetComponent<RectTransform>();
            frt.anchorMin = new Vector2(0.5f, 1f);
            frt.anchorMax = new Vector2(0.5f, 1f);
            frt.pivot = new Vector2(0.5f, 1f);
            frt.anchoredPosition = pos;
            frt.sizeDelta = size;

            var border = new GameObject("GoldBorder");
            border.transform.SetParent(frame.transform, false);

            var borderImg = border.AddComponent<Image>();
            borderImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.30f), 256);
            borderImg.color = Color.white;
            borderImg.raycastTarget = false;

            var brt = border.GetComponent<RectTransform>();
            brt.anchorMin = Vector2.zero;
            brt.anchorMax = Vector2.one;
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            var avatar = new GameObject("AvatarCircle");
            avatar.transform.SetParent(border.transform, false);

            var avImg = avatar.AddComponent<Image>();
            avImg.sprite = UISpriteFactory.Create3DSphereSprite(color, 256);
            avImg.color = Color.white;
            avImg.raycastTarget = false;

            var art = avatar.GetComponent<RectTransform>();
            art.anchorMin = Vector2.zero;
            art.anchorMax = Vector2.one;
            art.offsetMin = new Vector2(8f, 8f);
            art.offsetMax = new Vector2(-8f, -8f);

            var shine = new GameObject("Shine");
            shine.transform.SetParent(avatar.transform, false);

            var shineImg = shine.AddComponent<Image>();
            shineImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 1f, 1f, 0.35f), 128);
            shineImg.color = Color.white;
            shineImg.raycastTarget = false;

            var srt = shine.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.15f, 0.55f);
            srt.anchorMax = new Vector2(0.45f, 0.85f);
            srt.offsetMin = Vector2.zero;
            srt.offsetMax = Vector2.zero;

            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(avatar.transform, false);

            var iconTxt = iconObj.AddComponent<Text>();
            iconTxt.text = icon;
            iconTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            iconTxt.fontSize = 48;
            iconTxt.fontStyle = FontStyle.Bold;
            iconTxt.color = Color.white;
            iconTxt.alignment = TextAnchor.MiddleCenter;
            iconTxt.raycastTarget = false;

            var irt = iconObj.GetComponent<RectTransform>();
            irt.anchorMin = Vector2.zero;
            irt.anchorMax = Vector2.one;
            irt.offsetMin = Vector2.zero;
            irt.offsetMax = Vector2.zero;
        }

        private Text CreateSideLabel(Transform parent, Vector2 pos, string text, Color color, TextAnchor align)
        {
            var obj = new GameObject("Label_" + text);
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 40;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = align;
            txt.raycastTarget = false;

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(300f, 60f);

            return txt;
        }

        private Image CreateSideProgressBar(Transform parent, Vector2 pos, Color color)
        {
            var bgObj = new GameObject("BarBg");
            bgObj.transform.SetParent(parent, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.15f, 0.08f, 0.25f, 0.8f);
            bgImg.raycastTarget = false;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.5f, 1f);
            bgRt.anchorMax = new Vector2(0.5f, 1f);
            bgRt.pivot = new Vector2(0.5f, 1f);
            bgRt.anchoredPosition = pos;
            bgRt.sizeDelta = new Vector2(260f, 14f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(bgObj.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = color;
            fillImg.raycastTarget = false;
            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -4f);

            return fillImg;
        }

        private Text CreateScoreText(Transform parent, string label, Vector2 pos, Color color)
        {
            var obj = new GameObject("Score");
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<Text>();
            txt.text = label + ": 0/" + _totalWords;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 28;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos + new Vector2(0f, 20f);
            rt.sizeDelta = new Vector2(280f, 60f);

            return txt;
        }

        private Image CreateProgressBar(Transform parent, Vector2 pos, Color color)
        {
            var bgObj = new GameObject("BarBg");
            bgObj.transform.SetParent(parent, false);

            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.20f, 0.12f, 0.35f);
            bgImg.raycastTarget = false;

            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.5f, 0.5f);
            bgRt.anchorMax = new Vector2(0.5f, 0.5f);
            bgRt.pivot = new Vector2(0.5f, 0.5f);
            bgRt.anchoredPosition = pos;
            bgRt.sizeDelta = new Vector2(240f, 18f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(bgObj.transform, false);

            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = color;
            fillImg.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -4f);

            return fillImg;
        }
    }
}