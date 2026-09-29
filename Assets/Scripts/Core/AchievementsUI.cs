using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AchievementsUI : MonoBehaviour
    {
        [Header("References")]
        public AchievementManager Manager;

        private Canvas _canvas;
        private GameObject _panel;
        private Transform _listParent;

        void Start()
        {
            if (Manager == null) Manager = AchievementManager.Instance;

            Invoke(nameof(BuildUI), 0.3f);
        }

        private void BuildUI()
        {
            if (Manager == null) Manager = AchievementManager.Instance;
            if (Manager == null) return;

            BuildCanvas();
            BuildPanel();

            Manager.OnAchievementUnlocked += OnAchievementUnlocked;
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AchievementsCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 700; // ABOVE home screen (500)

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("AchievementsPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.05f, 0.08f, 0.20f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "ACHIEVEMENTS", new Vector2(0f, 800f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 800f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            _panel.SetActive(false);
        }

        private void BuildList()
        {
            if (_listParent != null) Destroy(_listParent.gameObject);

            _listParent = new GameObject("AchievementList").transform;
            _listParent.SetParent(_panel.transform, false);

            var rt = _listParent.gameObject.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, 0f);
            rt.sizeDelta = new Vector2(900f, 1300f);

            var list = _listParent.gameObject.AddComponent<VerticalLayoutGroup>();
            list.spacing = 15f;
            list.padding = new RectOffset(20, 20, 20, 20);
            list.childForceExpandHeight = false;
            list.childForceExpandWidth = true;
            list.childControlHeight = false;
            list.childControlWidth = true;

            var all = Manager.GetAll();
            foreach (var a in all)
                CreateAchievementCard(a);
        }

        private void CreateAchievementCard(Achievement a)
        {
            bool unlocked = Manager.IsUnlocked(a);
            int current = Manager.GetProgress(a);

            var cardObj = new GameObject($"Ach_{a.Id}");
            cardObj.transform.SetParent(_listParent, false);

            var img = cardObj.AddComponent<Image>();
            img.color = unlocked
                ? new Color(0.20f, 0.50f, 0.28f)
                : new Color(0.15f, 0.18f, 0.28f);

            var le = cardObj.AddComponent<LayoutElement>();
            le.preferredHeight = 130f;
            le.minHeight = 130f;

            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(cardObj.transform, false);

            var iconImg = iconObj.AddComponent<Image>();
            iconImg.color = unlocked
                ? new Color(1f, 0.85f, 0.25f)
                : new Color(0.4f, 0.4f, 0.45f);

            var iconRt = iconObj.GetComponent<RectTransform>();
            iconRt.anchorMin = new Vector2(0f, 0.5f);
            iconRt.anchorMax = new Vector2(0f, 0.5f);
            iconRt.pivot = new Vector2(0f, 0.5f);
            iconRt.anchoredPosition = new Vector2(20f, 0f);
            iconRt.sizeDelta = new Vector2(90f, 90f);

            var iconTxt = iconObj.AddComponent<Text>();
            iconTxt.text = unlocked ? "V" : "?";
            iconTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            iconTxt.fontSize = 55;
            iconTxt.fontStyle = FontStyle.Bold;
            iconTxt.color = Color.white;
            iconTxt.alignment = TextAnchor.MiddleCenter;

            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(cardObj.transform, false);

            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = a.Title;
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 34;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = Color.white;
            titleTxt.alignment = TextAnchor.MiddleLeft;

            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0f, 0.5f);
            titleRt.anchorMax = new Vector2(1f, 1f);
            titleRt.pivot = new Vector2(0f, 0.5f);
            titleRt.anchoredPosition = new Vector2(130f, -10f);
            titleRt.sizeDelta = new Vector2(-150f, 40f);

            var descObj = new GameObject("Desc");
            descObj.transform.SetParent(cardObj.transform, false);

            var descTxt = descObj.AddComponent<Text>();
            descTxt.text = unlocked
                ? $"Unlocked  •  +{a.RewardCoins} coins"
                : $"{a.Description}  •  {current}/{a.Target}";
            descTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            descTxt.fontSize = 26;
            descTxt.color = unlocked
                ? new Color(0.85f, 1f, 0.85f)
                : new Color(0.75f, 0.80f, 0.95f);
            descTxt.alignment = TextAnchor.MiddleLeft;

            var descRt = descObj.GetComponent<RectTransform>();
            descRt.anchorMin = new Vector2(0f, 0f);
            descRt.anchorMax = new Vector2(1f, 0.5f);
            descRt.pivot = new Vector2(0f, 0.5f);
            descRt.anchoredPosition = new Vector2(130f, 10f);
            descRt.sizeDelta = new Vector2(-150f, 40f);
        }

        private void OnAchievementUnlocked(Achievement a)
        {
            Debug.Log($"[AchievementsUI] New unlock: {a.Title}");
            if (_panel != null && _panel.activeSelf) BuildList();
        }

        public void Show()
        {
            if (_panel == null) return;
            BuildList();
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
            txt.supportRichText = true;

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

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        void OnDestroy()
        {
            if (Manager != null)
                Manager.OnAchievementUnlocked -= OnAchievementUnlocked;
        }
    }
}