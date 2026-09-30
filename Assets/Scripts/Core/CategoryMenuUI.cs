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
        private Text _offlineNoteText;
        private string _activeCategory = "";

        private class MenuItem
        {
            public string Label;
            public Color Color;
            public UnityEngine.Events.UnityAction OnClick;
            public bool RequiresOnline;
        }

        void Awake()
        {
            if (Instance != null && Instance != this) { Destroy(gameObject); return; }
            Instance = this;
        }

        void Start() { Invoke(nameof(Setup), 1.0f); }

        private void Setup() { BuildCanvas(); BuildPanel(); }

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
            bg.color = new Color(0.04f, 0.08f, 0.20f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title
            _titleText = CreateText(_panel.transform, "CATEGORY", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            // Back button
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Offline note
            _offlineNoteText = CreateText(_panel.transform, "", new Vector2(0f, 740f), 26,
                new Color(1f, 0.55f, 0.55f), FontStyle.Normal);
            _offlineNoteText.gameObject.SetActive(false);

            // Grid parent
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

        public void Show(string categoryId)
        {
            if (_gridParent == null)
            {
                Debug.LogError("[Category] Grid parent is NULL. BuildPanel not called yet?");
                return;
            }

            _activeCategory = categoryId;
            Debug.Log($"[Category] Show: {categoryId}");

            // Clear old items - use DestroyImmediate for reliable removal
            int cleared = 0;
            for (int i = _gridParent.transform.childCount - 1; i >= 0; i--)
            {
                DestroyImmediate(_gridParent.transform.GetChild(i).gameObject);
                cleared++;
            }
            Debug.Log($"[Category] Cleared {cleared} old items");

            // Update title
            string title = "MENU";
            switch (categoryId)
            {
                case "social": title = "ONLINE"; break;
                case "shop": title = "SHOP & STORE"; break;
                case "progress": title = "PROGRESS"; break;
            }
            _titleText.text = title;

            bool online = InternetChecker.QuickCheck();

            if (categoryId == "social" && !online)
            {
                _offlineNoteText.text = "You are offline. Online features disabled.";
                _offlineNoteText.gameObject.SetActive(true);
            }
            else
            {
                _offlineNoteText.gameObject.SetActive(false);
            }

            // Populate items
            var items = GetItemsForCategory(categoryId);
            Debug.Log($"[Category] Creating {items.Count} items");

            foreach (var item in items)
                CreateMenuItem(item, online);

            _panel.SetActive(true);
            Debug.Log($"[Category] Panel shown with {_gridParent.transform.childCount} children");
        }

        private System.Collections.Generic.List<MenuItem> GetItemsForCategory(string category)
        {
            var list = new System.Collections.Generic.List<MenuItem>();

            switch (category)
            {
                case "social":
                    list.Add(new MenuItem { Label = "ONLINE MATCH", Color = new Color(0.75f, 0.30f, 0.30f),
                        OnClick = () => OpenPanel<MultiplayerMenuUI>("ONLINE MATCH"), RequiresOnline = true });
                    list.Add(new MenuItem { Label = "FRIENDS", Color = new Color(0.35f, 0.75f, 0.55f),
                        OnClick = () => OpenPanel<FriendListUI>("FRIENDS"), RequiresOnline = true });
                    list.Add(new MenuItem { Label = "TOURNEY", Color = new Color(0.85f, 0.35f, 0.35f),
                        OnClick = () => OpenPanel<TournamentModeUI>("TOURNAMENT"), RequiresOnline = true });
                    list.Add(new MenuItem { Label = "INVITE", Color = new Color(0.85f, 0.30f, 0.50f),
                        OnClick = () => OpenPanel<ReferralSystemUI>("INVITE"), RequiresOnline = true });
                    break;

                case "shop":
                    list.Add(new MenuItem { Label = "SHOP", Color = new Color(0.90f, 0.55f, 0.20f),
                        OnClick = () => OpenPanel<ShopUI>("SHOP"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "SPIN WHEEL", Color = new Color(1f, 0.70f, 0.20f),
                        OnClick = () => OpenPanel<SpinWheelUI>("SPIN"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "SEASON PASS", Color = new Color(0.85f, 0.55f, 0.25f),
                        OnClick = () => OpenPanel<SeasonPassUI>("SEASON"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "FREE COINS", Color = new Color(0.30f, 0.75f, 0.55f),
                        OnClick = () => OpenPanel<AdRewardTiersUI>("FREE COINS"), RequiresOnline = false });
                    break;

                case "progress":
                    list.Add(new MenuItem { Label = "AWARDS", Color = new Color(0.85f, 0.40f, 0.55f),
                        OnClick = () => OpenPanel<AchievementsUI>("AWARDS"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "STATS", Color = new Color(0.30f, 0.65f, 0.80f),
                        OnClick = () => OpenPanel<StatisticsUI>("STATS"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "MISSIONS", Color = new Color(0.30f, 0.55f, 0.85f),
                        OnClick = () => OpenPanel<MissionsSystem>("MISSIONS"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "WORLDS", Color = new Color(0.50f, 0.70f, 0.95f),
                        OnClick = () => OpenPanel<WorldMapUI>("WORLDS"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "NEWS", Color = new Color(0.75f, 0.65f, 0.30f),
                        OnClick = () => OpenPanel<NewsFeedUI>("NEWS"), RequiresOnline = false });
                    list.Add(new MenuItem { Label = "NOTIFS", Color = new Color(0.65f, 0.45f, 0.75f),
                        OnClick = () => OpenPanel<NotificationCenterUI>("NOTIFS"), RequiresOnline = false });
                    break;
            }

            return list;
        }

        private T OpenPanel<T>(string label) where T : MonoBehaviour
        {
            Debug.Log($"[Category] Opening {label}");
            _panel.SetActive(false);

            var target = FindFirstObjectByType<T>();
            if (target == null)
            {
                Debug.LogWarning($"[Category] No {typeof(T).Name} found in scene!");
                return null;
            }

            var showMethod = typeof(T).GetMethod("Show",
                System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance,
                null, System.Type.EmptyTypes, null);

            if (showMethod != null) showMethod.Invoke(target, null);
            else target.gameObject.SetActive(true);

            return target;
        }

        private void CreateMenuItem(MenuItem item, bool online)
        {
            bool disabled = item.RequiresOnline && !online;

            var rootObj = new GameObject($"Item_{item.Label}");
            rootObj.transform.SetParent(_gridParent.transform, false);

            // RectTransform is set by GridLayoutGroup automatically, but ensure it exists
            if (rootObj.GetComponent<RectTransform>() == null)
                rootObj.AddComponent<RectTransform>();

            Color displayColor = disabled
                ? new Color(0.30f, 0.32f, 0.38f)
                : item.Color;

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
            txt.text = disabled ? $"{item.Label}\n(ONLINE)" : item.Label;
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