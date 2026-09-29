using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AchievementProgressBarUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;

        void Start() { Invoke(nameof(Setup), 1.1f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AchProgressCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 510;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("AchProgressPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.20f, 0.15f, 0.35f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            // Word of Day ke neeche
            rt.anchoredPosition = new Vector2(0f, -600f);
            rt.sizeDelta = new Vector2(880f, 80f);

            var checker = _panel.AddComponent<HomeVisibilityCheck>();
            checker.Target = _panel;

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_panel.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = "ACHIEVEMENTS";
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 22;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = new Color(1f, 0.85f, 0.30f);
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0f, 1f);
            trt.anchorMax = new Vector2(1f, 1f);
            trt.pivot = new Vector2(0f, 1f);
            trt.anchoredPosition = new Vector2(20f, -8f);
            trt.sizeDelta = new Vector2(-40f, 25f);

            // Progress
            var progressObj = new GameObject("Progress");
            progressObj.transform.SetParent(_panel.transform, false);
            var progressTxt = progressObj.AddComponent<Text>();
            int unlocked = CountUnlocked();
            int total = 8;
            progressTxt.text = $"{unlocked} / {total} unlocked";
            progressTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            progressTxt.fontSize = 28;
            progressTxt.fontStyle = FontStyle.Bold;
            progressTxt.color = Color.white;
            progressTxt.alignment = TextAnchor.MiddleRight;
            progressTxt.raycastTarget = false;
            var prt = progressObj.GetComponent<RectTransform>();
            prt.anchorMin = new Vector2(0f, 0f);
            prt.anchorMax = new Vector2(1f, 1f);
            prt.offsetMin = new Vector2(20f, 0f);
            prt.offsetMax = new Vector2(-20f, 0f);
        }

        private int CountUnlocked()
        {
            string[] ids = { "first_word", "word_hunter", "word_master", "first_level",
                             "level_5", "level_10", "rich_player", "hint_master" };
            int count = 0;
            foreach (var id in ids)
            {
                if (PlayerPrefs.GetInt("Ach_" + id, 0) > 0) count++;
            }
            return count;
        }
    }
}