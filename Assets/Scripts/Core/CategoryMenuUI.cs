using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class CategoryMenuUI : MonoBehaviour
    {
        public static CategoryMenuUI Instance { get; private set; }

        private Canvas _canvas;
        private GameObject _panel;
        private GameObject _gridParent;
        private Text _titleText;
        private string _activeCategory = "";

        private class MenuItem
        {
            public string Label;
            public Color Color;
            public UnityEngine.Events.UnityAction OnClick;
        }

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.3f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("CategoryCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 850;

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

        private void BuildPanel()
        {
            _panel = new GameObject("CategoryPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.04f, 0.08f, 0.20f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title
            _titleText = CreateText(_panel.transform, "CATEGORY", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Grid parent
            _gridParent = new GameObject("GridParent");
            _gridParent.transform.SetParent(_panel.transform, false);
            var grt = _gridParent.AddComponent<RectTransform>();
            grt.anchorMin = new Vector2(0.5f, 0.5f);
            grt.anchorMax = new Vector2(0.5f, 0.5f);
            grt.pivot = new Vector2(0.5f, 0.5f);
            grt.anchoredPosition = new Vector2(0f, 0f);
            grt.sizeDelta = new Vector2(900f, 1300f);

            var grid = _gridParent.AddComponent<GridLayoutGroup>();
            grid.cellSize = new Vector2(380f, 180f);
            grid.spacing = new Vector2(30f, 30f);
            grid.constraint = GridLayoutGroup.Constraint.FixedColumnCount;
            grid.constraintCount = 2;
            grid.padding = new RectOffset(40, 40, 40, 40);

            _panel.SetActive(false);
        }

        public void Show(string categoryId)
        {
            _activeCategory = categoryId;

            // Clear old items
            foreach (Transform child in _gridParent.transform)
                Destroy(child.gameObject);

            // Update title
            string title = "MENU";
            switch (categoryId)
            {
                case "social": title = "SOCIAL"; break;
                case "shop": title = "SHOP & STORE"; break;
                case "progress": title = "PROGRESS"; break;
            }
            _titleText.text = title;

            // Populate items
            var items = GetItemsForCategory(categoryId);
            foreach (var item in items)
                CreateMenuItem(item);

            _panel.SetActive(true);
        }

        private System.Collections.Generic.List<MenuItem> GetItemsForCategory(string category)
        {
            var list = new System.Collections.Generic.List<MenuItem>();

            switch (category)
            {
                case "social":
                    list.Add(new MenuItem {
                        Label = "VERSUS",
                        Color = new Color(0.75f, 0.30f, 0.30f),
                        OnClick = () => OpenPanel<MultiplayerMenuUI>("VERSUS")
                    });
                    list.Add(new MenuItem {
                        Label = "FRIENDS",
                        Color = new Color(0.35f, 0.75f, 0.55f),
                        OnClick = () => OpenPanel<FriendListUI>("FRIENDS")
                    });
                    list.Add(new MenuItem {
                        Label = "TOURNEY",
                        Color = new Color(0.85f, 0.35f, 0.35f),
                        OnClick = () => OpenPanel<TournamentModeUI>("TOURNAMENT")
                    });
                    list.Add(new MenuItem {
                        Label = "INVITE",
                        Color = new Color(0.85f, 0.30f, 0.50f),
                        OnClick = () => OpenPanel<ReferralSystemUI>("INVITE")
                    });
                    break;

                case "shop":
                    list.Add(new MenuItem {
                        Label = "SHOP",
                        Color = new Color(0.90f, 0.55f, 0.20f),
                        OnClick = () => OpenPanel<ShopUI>("SHOP")
                    });
                    list.Add(new MenuItem {
                        Label = "PETS",
                        Color = new Color(0.55f, 0.35f, 0.75f),
                        OnClick = () => OpenPanel<PetSystemUI>("PETS")
                    });
                    list.Add(new MenuItem {
                        Label = "SPIN",
                        Color = new Color(1f, 0.70f, 0.20f),
                        OnClick = () => OpenPanel<SpinWheelUI>("SPIN")
                    });
                    list.Add(new MenuItem {
                        Label = "SEASON",
                        Color = new Color(0.85f, 0.55f, 0.25f),
                        OnClick = () => OpenPanel<SeasonPassUI>("SEASON PASS")
                    });
                    list.Add(new MenuItem {
                        Label = "FREE COINS",
                        Color = new Color(0.30f, 0.75f, 0.55f),
                        OnClick = () => OpenPanel<AdRewardTiersUI>("FREE COINS")
                    });
                    break;

                case "progress":
                    list.Add(new MenuItem {
                        Label = "AWARDS",
                        Color = new Color(0.85f, 0.40f, 0.55f),
                        OnClick = () => OpenPanel<AchievementsUI>("AWARDS")
                    });
                    list.Add(new MenuItem {
                        Label = "STATS",
                        Color = new Color(0.30f, 0.65f, 0.80f),
                        OnClick = () => OpenPanel<StatisticsUI>("STATS")
                    });
                    list.Add(new MenuItem {
                        Label = "MISSIONS",
                        Color = new Color(0.30f, 0.55f, 0.85f),
                        OnClick = () => OpenPanel<MissionsSystem>("MISSIONS")
                    });
                    list.Add(new MenuItem {
                        Label = "WORLDS",
                        Color = new Color(0.50f, 0.70f, 0.95f),
                        OnClick = () => OpenPanel<WorldMapUI>("WORLDS")
                    });
                    list.Add(new MenuItem {
                        Label = "NEWS",
                        Color = new Color(0.75f, 0.65f, 0.30f),
                        OnClick = () => OpenPanel<NewsFeedUI>("NEWS")
                    });
                    list.Add(new MenuItem {
                        Label = "NOTIFS",
                        Color = new Color(0.65f, 0.45f, 0.75f),
                        OnClick = () => OpenPanel<NotificationCenterUI>("NOTIFICATIONS")
                    });
                    break;
            }

            return list;
        }

        private T OpenPanel<T>(string label) where T : MonoBehaviour
        {
            Debug.Log($"[Category] Opening {label}");
            _panel.SetActive(false);
            return FindFirstObjectByType<T>();
        }

        private void CreateMenuItem(MenuItem item)
        {
            var rootObj = new GameObject($"Item_{item.Label}");
            rootObj.transform.SetParent(_gridParent.transform, false);

            // Bottom shadow
            var shadowObj = new GameObject("BottomShadow");
            shadowObj.transform.SetParent(rootObj.transform, false);
            var bShadowImg = shadowObj.AddComponent<Image>();
            bShadowImg.sprite = UISpriteFactory.Create3DButtonSprite(
                Color.Lerp(item.Color, Color.black, 0.55f), 256, 40);
            bShadowImg.type = Image.Type.Sliced;
            bShadowImg.raycastTarget = false;
            var shRt = shadowObj.GetComponent<RectTransform>();
            shRt.anchorMin = Vector2.zero;
            shRt.anchorMax = Vector2.one;
            shRt.offsetMin = Vector2.zero;
            shRt.offsetMax = Vector2.zero;
            shRt.anchoredPosition = new Vector2(0f, -8f);

            // Main button
            var btnObj = new GameObject("Button");
            btnObj.transform.SetParent(rootObj.transform, false);
            var btnImg = btnObj.AddComponent<Image>();
            btnImg.sprite = UISpriteFactory.Create3DButtonSprite(item.Color, 256, 40);
            btnImg.type = Image.Type.Sliced;
            btnImg.color = Color.white;

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(() =>
            {
                if (SoundManager.Instance != null) SoundManager.Instance.PlayButtonClick();
                item.OnClick?.Invoke();
            });

            var btnRt = btnObj.GetComponent<RectTransform>();
            btnRt.anchorMin = Vector2.zero;
            btnRt.anchorMax = Vector2.one;
            btnRt.offsetMin = Vector2.zero;
            btnRt.offsetMax = new Vector2(0f, 8f);

            // Label
            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = item.Label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 40;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
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