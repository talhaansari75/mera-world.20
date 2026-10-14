using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class MissionsSystem
    {
        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("MissionsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 765;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("MissionsPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "MISSIONS", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "< BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            CreateText(_panel.transform, "DAILY MISSIONS", new Vector2(0f, 650f), 40,
                new Color(1f, 0.90f, 0.55f), FontStyle.Bold);

            float y = 500f;
            foreach (var m in DailyMissions)
            {
                CreateMissionCard(m, y);
                y -= 130f;
            }

            CreateText(_panel.transform, "WEEKLY MISSIONS", new Vector2(0f, -100f), 40,
                new Color(0.85f, 0.60f, 1f), FontStyle.Bold);

            y = -250f;
            foreach (var m in WeeklyMissions)
            {
                CreateMissionCard(m, y);
                y -= 130f;
            }

            _panel.SetActive(false);
        }

        private void CreateMissionCard(Mission m, float y)
        {
            int progress = PlayerPrefs.GetInt(KEY_PROGRESS_PREFIX + m.Id, 0);
            bool completed = progress >= m.Target;

            var cardObj = new GameObject("Mission_" + m.Id);
            cardObj.transform.SetParent(_panel.transform, false);

            var img = cardObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(
                completed ? new Color(0.20f, 0.55f, 0.30f) : new Color(0.20f, 0.25f, 0.40f),
                256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(880f, 110f);

            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(cardObj.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = completed ? "OK - " + m.Title : m.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 32;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 0.5f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.pivot = new Vector2(0f, 0.5f);
            trt.anchoredPosition = new Vector2(30f, 0f);
            trt.sizeDelta = new Vector2(-250f, 55f);

            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(cardObj.transform, false);
            var descTxt = descObj.AddComponent<Text>();
            descTxt.text = m.Description + "  -  " + Mathf.Min(progress, m.Target) + "/" + m.Target + "  -  +" + m.Reward + " coins";
            descTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            descTxt.fontSize = 22;
            descTxt.color = new Color(0.85f, 0.90f, 1f);
            descTxt.alignment = TextAnchor.MiddleLeft;
            descTxt.raycastTarget = false;
            var drt = descObj.GetComponent<RectTransform>();
            drt.anchorMin = new Vector2(0f, 0f);
            drt.anchorMax = new Vector2(1f, 0.5f);
            drt.pivot = new Vector2(0f, 0.5f);
            drt.anchoredPosition = new Vector2(30f, 0f);
            drt.sizeDelta = new Vector2(-250f, 45f);

            if (completed && progress == m.Target)
            {
                var claimBtn = new GameObject("Claim");
                claimBtn.transform.SetParent(cardObj.transform, false);
                var cImg = claimBtn.AddComponent<Image>();
                cImg.color = new Color(0.25f, 0.75f, 0.35f);
                var cBtn = claimBtn.AddComponent<Button>();
                cBtn.onClick.AddListener(() => ClaimMission(m));
                var crt = claimBtn.GetComponent<RectTransform>();
                crt.anchorMin = new Vector2(1f, 0.5f);
                crt.anchorMax = new Vector2(1f, 0.5f);
                crt.pivot = new Vector2(1f, 0.5f);
                crt.anchoredPosition = new Vector2(-20f, 0f);
                crt.sizeDelta = new Vector2(180f, 80f);

                var cTextObj = new GameObject("Label");
                cTextObj.transform.SetParent(claimBtn.transform, false);
                var cTxt = cTextObj.AddComponent<Text>();
                cTxt.text = "CLAIM";
                cTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                cTxt.fontSize = 28;
                cTxt.fontStyle = FontStyle.Bold;
                cTxt.color = Color.white;
                cTxt.alignment = TextAnchor.MiddleCenter;
                cTxt.raycastTarget = false;
                var ctrt = cTextObj.GetComponent<RectTransform>();
                ctrt.anchorMin = Vector2.zero;
                ctrt.anchorMax = Vector2.one;
                ctrt.offsetMin = Vector2.zero;
                ctrt.offsetMax = Vector2.zero;
            }
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
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject("Btn_" + label);
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