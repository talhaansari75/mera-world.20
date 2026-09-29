using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class AvatarPickerUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private GameObject _gridParent;

        private const string KEY_AVATAR = "SelectedAvatar";

        private static readonly Color[] AvatarColors = {
            new Color(0.30f, 0.65f, 0.95f),
            new Color(0.85f, 0.35f, 0.35f),
            new Color(0.30f, 0.75f, 0.45f),
            new Color(0.95f, 0.65f, 0.20f),
            new Color(0.65f, 0.35f, 0.85f),
            new Color(0.85f, 0.45f, 0.65f),
            new Color(0.35f, 0.85f, 0.85f),
            new Color(0.95f, 0.85f, 0.35f),
            new Color(0.55f, 0.55f, 0.55f),
            new Color(0.15f, 0.25f, 0.45f),
            new Color(0.75f, 0.20f, 0.50f),
            new Color(0.20f, 0.50f, 0.30f),
        };

        void Start() { Invoke(nameof(Setup), 1.5f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("AvatarCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 792;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("AvatarPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "CHOOSE AVATAR", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            _gridParent = new GameObject("AvatarGrid");
            _gridParent.transform.SetParent(_panel.transform, false);
            var grt = _gridParent.AddComponent<RectTransform>();
            grt.anchorMin = new Vector2(0.5f, 0.5f);
            grt.anchorMax = new Vector2(0.5f, 0.5f);
            grt.pivot = new Vector2(0.5f, 0.5f);
            grt.anchoredPosition = new Vector2(0f, 0f);
            grt.sizeDelta = new Vector2(900f, 1200f);

            var grid = _gridParent.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(180f, 180f);
            grid.spacing = new Vector2(20f, 20f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 3;
            grid.padding = new RectOffset(20, 20, 20, 20);

            BuildAvatarCards();

            _panel.SetActive(false);
        }

        private void BuildAvatarCards()
        {
            foreach (Transform child in _gridParent.transform)
                Destroy(child.gameObject);

            int selected = PlayerPrefs.GetInt(KEY_AVATAR, 0);

            for (int i = 0; i < AvatarColors.Length; i++)
            {
                int index = i;
                var cardObj = new GameObject($"Avatar_{i}");
                cardObj.transform.SetParent(_gridParent.transform, false);

                var img = cardObj.AddComponent<Image>();
                img.sprite = UISpriteFactory.Create3DSphereSprite(AvatarColors[i], 128);
                img.color = Color.white;
                img.raycastTarget = true;

                var btn = cardObj.AddComponent<Button>();
                btn.onClick.AddListener(() => OnAvatarSelected(index));

                if (i == selected)
                {
                    // Highlight selected
                    var outline = cardObj.AddComponent<Outline>();
                    outline.effectColor = new Color(1f, 0.85f, 0.30f);
                    outline.effectDistance = new Vector2(8f, 8f);
                }
            }
        }

        private void OnAvatarSelected(int index)
        {
            PlayerPrefs.SetInt(KEY_AVATAR, index);
            PlayerPrefs.Save();

            if (SoundManager.Instance != null)
                SoundManager.Instance.PlayWordFound();

            Debug.Log($"[Avatar] Selected {index}");
            BuildAvatarCards();
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

        public static Color GetSelectedColor()
        {
            int idx = PlayerPrefs.GetInt(KEY_AVATAR, 0);
            return AvatarColors[Mathf.Clamp(idx, 0, AvatarColors.Length - 1)];
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