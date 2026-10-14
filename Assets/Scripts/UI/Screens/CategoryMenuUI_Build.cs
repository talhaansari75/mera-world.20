using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class CategoryMenuUI
    {
        private void BuildCanvas()
        {
            var canvasObj = new GameObject("CategoryCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 850;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();

                var newModule = System.Type.GetType(
                    "UnityEngine.InputSystem.UI.InputSystemUIInputModule, Unity.InputSystem");
                if (newModule != null) es.AddComponent(newModule);
                else es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private void BuildPanel()
        {
            _panel = new GameObject("CategoryPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.sprite = Resources.Load<Sprite>("UI/HomeScreen/Backgrounds/bg_space");
            bg.color = new Color(1f, 1f, 1f, 0.92f);
            bg.type = Image.Type.Simple;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            _titleText = CreateText(_panel.transform, "CATEGORY", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "< BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            _offlineNoteText = CreateText(_panel.transform, "", new Vector2(0f, 740f), 26,
                new Color(1f, 0.55f, 0.55f), FontStyle.Normal);
            _offlineNoteText.gameObject.SetActive(false);

            _gridParent = new GameObject("GridParent");
            _gridParent.transform.SetParent(_panel.transform, false);
            var grt = _gridParent.AddComponent<RectTransform>();
            grt.anchorMin = new Vector2(0.5f, 0.5f);
            grt.anchorMax = new Vector2(0.5f, 0.5f);
            grt.pivot = new Vector2(0.5f, 0.5f);
            grt.anchoredPosition = new Vector2(0f, -80f);
            grt.sizeDelta = new Vector2(960f, 1300f);

            var grid = _gridParent.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(420f, 200f);
            grid.spacing = new Vector2(30f, 30f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 2;
            grid.padding = new RectOffset(30, 30, 30, 30);
            grid.childAlignment = TextAnchor.UpperCenter;

            _panel.SetActive(false);
        }

        private void CreateMenuItem(MenuItem item, bool online)
        {
            bool disabled = item.RequiresOnline && !online;

            var rootObj = new GameObject("Item_" + item.Label);
            rootObj.transform.SetParent(_gridParent.transform, false);

            if (rootObj.GetComponent<RectTransform>() == null)
                rootObj.AddComponent<RectTransform>();

            Color displayColor = disabled
                ? new Color(0.30f, 0.32f, 0.38f)
                : new Color(0.40f, 0.18f, 0.75f);

            // Bottom shadow (3D effect)
            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(rootObj.transform, false);
            var shImg = shadowObj.AddComponent<Image>();
            shImg.sprite = UISpriteFactory.Create3DButtonSprite(
                Color.Lerp(displayColor, Color.black, 0.55f), 256, 40);
            shImg.type = Image.Type.Sliced;
            shImg.color = Color.white;
            shImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = Vector2.zero;
            shRt.anchorMax = Vector2.one;
            shRt.offsetMin = new Vector2(0f, 0f);
            shRt.offsetMax = new Vector2(0f, -8f);

            // Main button
            var btnObj = new GameObject("Button");
            btnObj.transform.SetParent(rootObj.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(displayColor, 256, 40);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.interactable = !disabled;

            if (!disabled)
            {
                btn.onClick.AddListener(() =>
                {
                    if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
                    if (item.RequiresOnline && !InternetChecker.QuickCheck()) return;
                    item.OnClick?.Invoke();
                });
            }

            var btnRt = btnObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 8f);

            // Label
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = disabled ? item.Label + "\n(ONLINE)" : item.Label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = disabled ? 28 : 40;
            txt.fontStyle = FontStyle.Bold;
            txt.color = disabled ? new Color(0.75f, 0.75f, 0.80f) : Color.white;
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
            var t = new GameObject("Label");
            t.transform.SetParent(obj.transform, false);
            var txt = t.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = t.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}