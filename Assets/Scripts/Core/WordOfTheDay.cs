using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WordOfTheDay : MonoBehaviour
    {
        private Canvas _canvas;
        private Text _wordText;
        private Text _definitionText;

        private static readonly string[] Words = {
            "SERENDIPITY", "EPHEMERAL", "MELLIFLUOUS", "PETRICHOR", "ETHEREAL",
            "LUMINOUS", "SOLITUDE", "RESILIENCE", "ELOQUENT", "ZENITH"
        };

        private static readonly string[] Defs = {
            "Finding something good without looking for it.",
            "Lasting for a very short time.",
            "Sweet or musical; pleasant to hear.",
            "The pleasant smell of earth after rain.",
            "Extremely delicate and light; heavenly.",
            "Full of or shedding light; bright.",
            "The state of being alone; peaceful.",
            "The capacity to recover quickly.",
            "Fluent or persuasive in speaking.",
            "The highest point reached."
        };

        void Start() { Invoke(nameof(Setup), 1.1f); }

        private void Setup() { BuildCanvas(); BuildPanel(); UpdateWord(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("WordOfDayCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 512;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            var cardObj = new GameObject("WordOfDayCard");
            cardObj.transform.SetParent(_canvas.transform, false);

            var img = cardObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.20f, 0.35f, 0.60f), 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            // Neeche shift kiya — title ke saath overlap nahi hoga
            rt.anchoredPosition = new Vector2(0f, -440f);
            rt.sizeDelta = new Vector2(880f, 140f);

            CreateText(cardObj.transform, "WORD OF THE DAY", new Vector2(0f, 45f), 22,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            _wordText = CreateText(cardObj.transform, "SERENDIPITY", new Vector2(0f, 5f), 38,
                Color.white, FontStyle.Bold);

            _definitionText = CreateText(cardObj.transform, "", new Vector2(0f, -45f), 18,
                new Color(0.85f, 0.90f, 1f), FontStyle.Italic);

            var checker = cardObj.AddComponent<HomeVisibilityCheck>();
            checker.Target = cardObj;
        }

        private void UpdateWord()
        {
            int day = DateTime.UtcNow.DayOfYear;
            int idx = day % Words.Length;
            _wordText.text = Words[idx];
            _definitionText.text = Defs[idx];
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
            rt.sizeDelta = new Vector2(820f, 60f);
            return txt;
        }
    }

    public class HomeVisibilityCheck : MonoBehaviour
    {
        public GameObject Target;
        void Update()
        {
            if (Target != null)
            {
                bool shouldShow = HomeScreenUI.IsHomeVisible;
                if (Target.activeSelf != shouldShow)
                    Target.SetActive(shouldShow);
            }
        }
    }
}