using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class MilestoneRewardsUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _panel;
        private bool _shown = false;

        private const string KEY_LAST_MILESTONE = "LastMilestone";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;

            Invoke(nameof(CheckMilestone), 1.0f);
        }

        private void CheckMilestone()
        {
            if (Progress == null) return;

            int level = Progress.HighestLevelUnlocked;
            int lastClaimed = PlayerPrefs.GetInt(KEY_LAST_MILESTONE, 0);

            // Milestones: 5, 10, 15, 20, 25, 30, ...
            if (level >= 5 && level % 5 == 0 && level > lastClaimed)
            {
                ShowMilestone(level);
                PlayerPrefs.SetInt(KEY_LAST_MILESTONE, level);
                PlayerPrefs.Save();
            }
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("MilestoneCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 710;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private void BuildPanel(int level)
        {
            _panel = new GameObject("MilestonePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.90f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var cardObj = new GameObject("Card");
            cardObj.transform.SetParent(_panel.transform, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.color = new Color(0.85f, 0.55f, 0.15f);

            var cardRt = cardObj.GetComponent<RectTransform>();
            cardRt.anchorMin = new Vector2(0.5f, 0.5f);
            cardRt.anchorMax = new Vector2(0.5f, 0.5f);
            cardRt.pivot = new Vector2(0.5f, 0.5f);
            cardRt.anchoredPosition = Vector2.zero;
            cardRt.sizeDelta = new Vector2(820f, 900f);

            CreateText(cardObj.transform, "MILESTONE!", new Vector2(0f, 320f), 80,
                new Color(1f, 0.95f, 0.55f), FontStyle.Bold);

            CreateText(cardObj.transform, $"You reached Level {level}!",
                new Vector2(0f, 200f), 45, Color.white, FontStyle.Bold);

            CreateText(cardObj.transform, "REWARD", new Vector2(0f, 100f), 30,
                new Color(0.30f, 0.15f, 0.05f), FontStyle.Bold);

            int reward = level * 50;
            CreateText(cardObj.transform, $"+{reward} COINS", new Vector2(0f, 20f), 70,
                new Color(1f, 1f, 1f), FontStyle.Bold);

            CreateText(cardObj.transform, "+1 STAR", new Vector2(0f, -80f), 55,
                new Color(1f, 0.95f, 0.55f), FontStyle.Bold);

            CreateButton(cardObj.transform, "CLAIM", new Vector2(0f, -280f),
                new Vector2(500f, 130f), new Color(0.25f, 0.65f, 0.30f), () =>
                {
                    if (Progress != null)
                    {
                        Progress.AddCoins(reward);
                        Progress.AddStars(1);
                    }
                    if (Sound != null) Sound.PlayLevelComplete();
                    _panel.SetActive(false);
                });

            _panel.SetActive(false);
        }

        private void ShowMilestone(int level)
        {
            if (_shown) return;
            _shown = true;

            BuildCanvas();
            BuildPanel(level);
            _panel.SetActive(true);
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
            txt.supportRichText = true;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(800f, 130f);
            return txt;
        }

        private void CreateButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
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
            rt.sizeDelta = size;
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 48;
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