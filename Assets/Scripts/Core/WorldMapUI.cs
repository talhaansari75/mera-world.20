using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class WorldMapUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _panel;

        private const string STARS_KEY_PREFIX = "Stars_Level_";

        private class WorldInfo
        {
            public string Name;
            public string Emoji;
            public Color Color;
            public int StartLevel;
            public int EndLevel;
        }

        private static readonly WorldInfo[] Worlds = new WorldInfo[]
        {
            new WorldInfo { Name = "GREEN MEADOWS", Emoji = "1", Color = new Color(0.30f, 0.75f, 0.40f), StartLevel = 1, EndLevel = 10 },
            new WorldInfo { Name = "SUNNY BEACH", Emoji = "2", Color = new Color(0.95f, 0.75f, 0.30f), StartLevel = 11, EndLevel = 20 },
            new WorldInfo { Name = "MYSTIC FOREST", Emoji = "3", Color = new Color(0.20f, 0.55f, 0.30f), StartLevel = 21, EndLevel = 30 },
            new WorldInfo { Name = "CRYSTAL MOUNTAINS", Emoji = "4", Color = new Color(0.55f, 0.75f, 0.95f), StartLevel = 31, EndLevel = 40 },
            new WorldInfo { Name = "ANCIENT DESERT", Emoji = "5", Color = new Color(0.90f, 0.60f, 0.30f), StartLevel = 41, EndLevel = 50 },
            new WorldInfo { Name = "STARLIGHT SKY", Emoji = "6", Color = new Color(0.55f, 0.35f, 0.85f), StartLevel = 51, EndLevel = 60 },
        };

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 1.5f);
        }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("WorldMapCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 788;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("WorldPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "WORLDS", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            int highestLevel = Progress != null ? Progress.HighestLevelUnlocked : 1;

            float y = 550f;
            foreach (var world in Worlds)
            {
                int worldStars = GetWorldStars(world);
                int worldTotalStars = (world.EndLevel - world.StartLevel + 1) * 3;
                bool unlocked = highestLevel >= world.StartLevel;

                CreateWorldCard(world, worldStars, worldTotalStars, unlocked, y);
                y -= 200f;
            }

            _panel.SetActive(false);
        }

        private void CreateWorldCard(WorldInfo world, int stars, int totalStars, bool unlocked, float y)
        {
            var cardObj = new GameObject($"World_{world.Emoji}");
            cardObj.transform.SetParent(_panel.transform, false);

            var img = cardObj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(
                unlocked ? world.Color : new Color(0.20f, 0.22f, 0.30f),
                256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = cardObj.AddComponent<Button>();
            btn.interactable = unlocked;
            if (unlocked) btn.onClick.AddListener(() => OnWorldClick(world.StartLevel));

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(900f, 180f);

            // Number badge circle
            var badgeObj = new GameObject("Badge");
            badgeObj.transform.SetParent(cardObj.transform, false);
            var badgeImg = badgeObj.AddComponent<Image>();
            badgeImg.sprite = UISpriteFactory.Create3DSphereSprite(
                unlocked ? Color.white : new Color(0.4f, 0.4f, 0.4f), 128);
            badgeImg.raycastTarget = false;
            var badgeRt = badgeObj.GetComponent<RectTransform>();
            badgeRt.anchorMin = new Vector2(0f, 0.5f);
            badgeRt.anchorMax = new Vector2(0f, 0.5f);
            badgeRt.pivot = new Vector2(0f, 0.5f);
            badgeRt.anchoredPosition = new Vector2(30f, 0f);
            badgeRt.sizeDelta = new Vector2(120f, 120f);

            var numObj = new GameObject("Num");
            numObj.transform.SetParent(badgeObj.transform, false);
            var numTxt = numObj.AddComponent<Text>();
            numTxt.text = world.Emoji;
            numTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            numTxt.fontSize = 70;
            numTxt.fontStyle = FontStyle.Bold;
            numTxt.color = unlocked ? new Color(0.15f, 0.10f, 0.05f) : new Color(0.7f, 0.7f, 0.7f);
            numTxt.alignment = TextAnchor.MiddleCenter;
            numTxt.raycastTarget = false;
            var numRt = numObj.GetComponent<RectTransform>();
            numRt.anchorMin = Vector2.zero;
            numRt.anchorMax = Vector2.one;
            numRt.offsetMin = Vector2.zero;
            numRt.offsetMax = Vector2.zero;

            // Name
            var nameObj = new GameObject("Name");
            nameObj.transform.SetParent(cardObj.transform, false);
            var nameTxt = nameObj.AddComponent<Text>();
            nameTxt.text = unlocked ? world.Name : "LOCKED";
            nameTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            nameTxt.fontSize = 38;
            nameTxt.fontStyle = FontStyle.Bold;
            nameTxt.color = Color.white;
            nameTxt.alignment = TextAnchor.MiddleLeft;
            nameTxt.raycastTarget = false;
            var shadow = nameObj.AddComponent<Shadow>();
            shadow.effectColor = new Color(0f, 0f, 0f, 0.6f);
            shadow.effectDistance = new Vector2(2f, -2f);
            var nameRt = nameObj.GetComponent<RectTransform>();
            nameRt.anchorMin = new Vector2(0f, 0.5f);
            nameRt.anchorMax = new Vector2(1f, 1f);
            nameRt.pivot = new Vector2(0f, 0.5f);
            nameRt.anchoredPosition = new Vector2(180f, 0f);
            nameRt.sizeDelta = new Vector2(-250f, 70f);

            // Level range
            var rangeObj = new GameObject("Range");
            rangeObj.transform.SetParent(cardObj.transform, false);
            var rangeTxt = rangeObj.AddComponent<Text>();
            rangeTxt.text = $"Levels {world.StartLevel} - {world.EndLevel}";
            rangeTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            rangeTxt.fontSize = 24;
            rangeTxt.color = new Color(1f, 1f, 1f, 0.85f);
            rangeTxt.alignment = TextAnchor.MiddleLeft;
            rangeTxt.raycastTarget = false;
            var rangeRt = rangeObj.GetComponent<RectTransform>();
            rangeRt.anchorMin = new Vector2(0f, 0f);
            rangeRt.anchorMax = new Vector2(1f, 0.5f);
            rangeRt.pivot = new Vector2(0f, 0.5f);
            rangeRt.anchoredPosition = new Vector2(180f, 0f);
            rangeRt.sizeDelta = new Vector2(-250f, 60f);

            // Star count
            if (unlocked)
            {
                var starsObj = new GameObject("Stars");
                starsObj.transform.SetParent(cardObj.transform, false);
                var starsTxt = starsObj.AddComponent<Text>();
                starsTxt.text = $"★ {stars}/{totalStars}";
                starsTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                starsTxt.fontSize = 32;
                starsTxt.fontStyle = FontStyle.Bold;
                starsTxt.color = new Color(1f, 0.92f, 0.55f);
                starsTxt.alignment = TextAnchor.MiddleRight;
                starsTxt.raycastTarget = false;
                var starsRt = starsObj.GetComponent<RectTransform>();
                starsRt.anchorMin = new Vector2(1f, 0.5f);
                starsRt.anchorMax = new Vector2(1f, 0.5f);
                starsRt.pivot = new Vector2(1f, 0.5f);
                starsRt.anchoredPosition = new Vector2(-30f, 0f);
                starsRt.sizeDelta = new Vector2(250f, 80f);
            }
        }

        private int GetWorldStars(WorldInfo world)
        {
            int total = 0;
            for (int i = world.StartLevel; i <= world.EndLevel; i++)
                total += PlayerPrefs.GetInt(STARS_KEY_PREFIX + i, 0);
            return total;
        }

        private void OnWorldClick(int startLevel)
        {
            Debug.Log($"[WorldMap] Loading level {startLevel}");

            if (Progress != null) Progress.SetCurrentLevel(startLevel);
            else
            {
                PlayerPrefs.SetInt("CurrentLevel", startLevel);
                PlayerPrefs.Save();
            }

            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();
            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

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
            rt.sizeDelta = new Vector2(900f, 100f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
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