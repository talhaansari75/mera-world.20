using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class PetSystemUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _panel;

        private static readonly string[] PetNames = { "Buddy", "Sparky", "Nova", "Coco", "Rex", "Luna" };
        private static readonly string[] PetEmojis = { "P", "S", "N", "C", "R", "L" };
        private static readonly int[] PetUnlockLevels = { 1, 5, 10, 15, 20, 30 };
        private static readonly int[] PetBonuses = { 5, 10, 15, 20, 30, 50 };

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("PetCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 730;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("PetPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "PETS", new Vector2(0f, 830f), 80,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateText(_panel.transform, "Unlock pets by leveling up!",
                new Vector2(0f, 730f), 32, new Color(0.75f, 0.85f, 1f), FontStyle.Normal);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            int highestLevel = Progress != null ? Progress.HighestLevelUnlocked : 1;

            for (int i = 0; i < PetNames.Length; i++)
            {
                float yPos = 500f - i * 220f;
                CreatePetCard(i, yPos, highestLevel);
            }

            _panel.SetActive(false);
        }

        private void CreatePetCard(int index, float yPos, int highestLevel)
        {
            bool unlocked = highestLevel >= PetUnlockLevels[index];

            var cardObj = new GameObject($"Pet_{index}");
            cardObj.transform.SetParent(_panel.transform, false);

            var bg = cardObj.AddComponent<Image>();
            bg.color = unlocked
                ? new Color(0.20f, 0.50f, 0.30f)
                : new Color(0.18f, 0.20f, 0.28f);

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, yPos);
            rt.sizeDelta = new Vector2(880f, 190f);

            // Emoji circle
            var circleObj = new GameObject("Circle");
            circleObj.transform.SetParent(cardObj.transform, false);
            var circleImg = circleObj.AddComponent<Image>();
            circleImg.color = unlocked
                ? new Color(1f, 0.85f, 0.30f)
                : new Color(0.4f, 0.4f, 0.45f);
            var circleRt = circleObj.GetComponent<RectTransform>();
            circleRt.anchorMin = new Vector2(0f, 0.5f);
            circleRt.anchorMax = new Vector2(0f, 0.5f);
            circleRt.pivot = new Vector2(0f, 0.5f);
            circleRt.anchoredPosition = new Vector2(20f, 0f);
            circleRt.sizeDelta = new Vector2(150f, 150f);

            var emojiObj = new GameObject("Emoji");
            emojiObj.transform.SetParent(circleObj.transform, false);
            var emojiTxt = emojiObj.AddComponent<Text>();
            emojiTxt.text = unlocked ? PetEmojis[index] : "?";
            emojiTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            emojiTxt.fontSize = 90;
            emojiTxt.fontStyle = FontStyle.Bold;
            emojiTxt.color = unlocked ? new Color(0.10f, 0.20f, 0.10f) : new Color(0.65f, 0.65f, 0.70f);
            emojiTxt.alignment = TextAnchor.MiddleCenter;
            emojiTxt.raycastTarget = false;
            var eRt = emojiObj.GetComponent<RectTransform>();
            eRt.anchorMin = Vector2.zero;
            eRt.anchorMax = Vector2.one;
            eRt.offsetMin = Vector2.zero;
            eRt.offsetMax = Vector2.zero;

            // Name
            var nameObj = new GameObject("Name");
            nameObj.transform.SetParent(cardObj.transform, false);
            var nameTxt = nameObj.AddComponent<Text>();
            nameTxt.text = PetNames[index];
            nameTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            nameTxt.fontSize = 45;
            nameTxt.fontStyle = FontStyle.Bold;
            nameTxt.color = Color.white;
            nameTxt.alignment = TextAnchor.MiddleLeft;
            nameTxt.raycastTarget = false;
            var nameRt = nameObj.GetComponent<RectTransform>();
            nameRt.anchorMin = new Vector2(0f, 0.5f);
            nameRt.anchorMax = new Vector2(1f, 1f);
            nameRt.pivot = new Vector2(0f, 0.5f);
            nameRt.anchoredPosition = new Vector2(200f, 0f);
            nameRt.sizeDelta = new Vector2(-250f, 80f);

            // Bonus / unlock condition
            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(cardObj.transform, false);
            var descTxt = descObj.AddComponent<Text>();
            descTxt.text = unlocked
                ? $"+{PetBonuses[index]}% coin bonus"
                : $"Unlocks at Level {PetUnlockLevels[index]}";
            descTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            descTxt.fontSize = 30;
            descTxt.fontStyle = FontStyle.Bold;
            descTxt.color = unlocked
                ? new Color(0.65f, 1f, 0.65f)
                : new Color(0.85f, 0.70f, 0.50f);
            descTxt.alignment = TextAnchor.MiddleLeft;
            descTxt.raycastTarget = false;
            var descRt = descObj.GetComponent<RectTransform>();
            descRt.anchorMin = new Vector2(0f, 0f);
            descRt.anchorMax = new Vector2(1f, 0.5f);
            descRt.pivot = new Vector2(0f, 0.5f);
            descRt.anchoredPosition = new Vector2(200f, 0f);
            descRt.sizeDelta = new Vector2(-250f, 60f);
        }

        public void Show()
        {
            // Rebuild to reflect current level
            foreach (Transform child in _panel.transform)
            {
                if (child.name.StartsWith("Pet_")) Destroy(child.gameObject);
            }

            int highestLevel = Progress != null ? Progress.HighestLevelUnlocked : 1;
            for (int i = 0; i < PetNames.Length; i++)
            {
                CreatePetCard(i, 500f - i * 220f, highestLevel);
            }

            _panel.SetActive(true);
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
        }

        private void OnBack()
        {
            Hide();
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
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.color = color;
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