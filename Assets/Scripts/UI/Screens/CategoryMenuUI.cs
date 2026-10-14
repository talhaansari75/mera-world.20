using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class CategoryMenuUI : MonoBehaviour
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

        public void Show(string categoryId)
        {
            if (_gridParent == null)
            {
                Debug.LogError("[Category] Grid parent is NULL. BuildPanel not called yet?");
                return;
            }

            _activeCategory = categoryId;
            Debug.Log("[Category] Show: " + categoryId);

            int cleared = 0;
            for (int i = _gridParent.transform.childCount - 1; i >= 0; i--)
            {
                DestroyImmediate(_gridParent.transform.GetChild(i).gameObject);
                cleared++;
            }
            Debug.Log("[Category] Cleared " + cleared + " old items");

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

            var items = GetItemsForCategory(categoryId);
            Debug.Log("[Category] Creating " + items.Count + " items");

            foreach (var item in items)
                CreateMenuItem(item, online);

            _panel.SetActive(true);
            Debug.Log("[Category] Panel shown with " + _gridParent.transform.childCount + " children");
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
            Debug.Log("[Category] Opening " + label);
            _panel.SetActive(false);

            var target = FindFirstObjectByType<T>();
            if (target == null)
            {
                Debug.LogWarning("[Category] No " + typeof(T).Name + " found in scene!");
                return null;
            }

            var showMethod = typeof(T).GetMethod("Show",
                System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance,
                null, System.Type.EmptyTypes, null);

            if (showMethod != null) showMethod.Invoke(target, null);
            else target.gameObject.SetActive(true);

            return target;
        }

        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }
    }
}