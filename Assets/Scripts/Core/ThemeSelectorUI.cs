using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class ThemeSelectorUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _gridParent;

        void Start()
        {
            BuildUI();
            if (_canvas != null) _canvas.gameObject.SetActive(false);
        }

        void BuildUI()
        {
            var canvasObj = new GameObject("ThemeSelectorCanvas");
            canvasObj.transform.SetParent(transform, false);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 600;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            canvasObj.AddComponent<GraphicRaycaster>();

            var bg = new GameObject("BG");
            bg.transform.SetParent(_canvas.transform, false);
            var bgImg = bg.AddComponent<Image>();
            bgImg.color = new Color(0, 0, 0, 0.85f);
            var bgRt = bg.GetComponent<RectTransform>();
            bgRt.anchorMin = Vector2.zero;
            bgRt.anchorMax = Vector2.one;
            bgRt.offsetMin = Vector2.zero;
            bgRt.offsetMax = Vector2.zero;

            var btn = bg.AddComponent<Button>();
            btn.onClick.AddListener(Hide);

            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(_canvas.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = "SELECT THEME";
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 60;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = new Color(1f, 0.85f, 0.30f);
            titleTxt.alignment = TextAnchor.MiddleCenter;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0.5f, 1f);
            titleRt.anchorMax = new Vector2(0.5f, 1f);
            titleRt.pivot = new Vector2(0.5f, 1f);
            titleRt.anchoredPosition = new Vector2(0f, -100f);
            titleRt.sizeDelta = new Vector2(800f, 100f);

            _gridParent = new GameObject("ThemeGrid");
            _gridParent.transform.SetParent(_canvas.transform, false);
            var rt = _gridParent.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(900, 1200);
            var grid = _gridParent.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(260, 260);
            grid.spacing = new Vector2(20, 20);
            grid.constraintCount = 3;
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;

            if (ThemeManager.Instance != null)
            {
                for (int i = 0; i < ThemeManager.Instance.allThemes.Count; i++)
                {
                    int idx = i;
                    var theme = ThemeManager.Instance.allThemes[i];
                    CreateThemeCard(theme, () => { ThemeManager.Instance.SelectTheme(idx); Hide(); });
                }
            }
        }

        void CreateThemeCard(GameTheme theme, System.Action onClick)
        {
            var card = new GameObject(theme.themeName);
            card.transform.SetParent(_gridParent.transform, false);
            var img = card.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(theme.bgTop, 256, 40);
            img.type = Image.Type.Sliced;
            var b = card.AddComponent<Button>();
            b.onClick.AddListener(() => onClick());

            var txtObj = new GameObject("Label");
            txtObj.transform.SetParent(card.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = theme.themeName;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 22;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.color = Color.white;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        public void Show()
        {
            if (_canvas == null) BuildUI();
            if (_canvas != null)
            {
                gameObject.SetActive(true);
                _canvas.gameObject.SetActive(true);
            }
        }

        public void Hide()
        {
            if (_canvas != null) _canvas.gameObject.SetActive(false);
        }
    }
}