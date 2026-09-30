using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Auto-setup helper — creates ALL missing UI components and wires them.
    /// Attach to any empty GameObject in the gameplay scene.
    /// </summary>
    public class GameBootstrap : MonoBehaviour
    {
        [Header("Core Gameplay")]
        public bool CreateGridVisualizer = true;
        public bool CreateWordListUI = true;
        public bool CreateTopBarUI = true;
        public bool CreateHintButtonUI = true;
        public bool CreateWinScreenUI = true;
        public bool CreateLevelTimerUI = true;
        public bool CreateBotRaceMode = true;
        public bool CreateHomeScreenUI = true;

        [Header("Menus (critical for buttons!)")]
        public bool CreateCategoryMenuUI = true;
        public bool CreateSettingsScreenUI = true;

        [Header("Shop & Economy UIs")]
        public bool CreateShopUI = true;
        public bool CreateSpinWheelUI = true;
        public bool CreateSeasonPassUI = true;
        public bool CreateAdRewardTiersUI = true;

        [Header("Progress UIs")]
        public bool CreateAchievementsUI = true;
        public bool CreateStatisticsUI = true;
        public bool CreateLeaderboardUI = true;
        public bool CreateMissionsUI = true;

        [Header("Social UIs")]
        public bool CreateMultiplayerMenuUI = true;
        public bool CreateFriendListUI = true;
        public bool CreateTournamentModeUI = true;
        public bool CreateReferralSystemUI = true;

        [Header("Extra UIs")]
        public bool CreateDailyRewardUI = true;
        public bool CreateWorldMapUI = true;
        public bool CreateNewsFeedUI = true;
        public bool CreateNotificationCenterUI = true;

        [Header("Debug")]
        public bool LogSetup = true;

        void Awake()
        {
            if (LogSetup) Debug.Log("[Bootstrap] === Starting scene setup ===");

            var gameManager = FindFirstObjectByType<GameManager>();
            var selectionManager = FindFirstObjectByType<SelectionManager>();
            var progress = PlayerProgressManager.Instance;

            if (gameManager == null)
            {
                Debug.LogError("[Bootstrap] GameManager missing! Cannot continue.");
                return;
            }

            // ---- Core gameplay (wire references) ----
            if (CreateGridVisualizer)
            {
                var gv = EnsureComponent<GridVisualizer>("GridVisualizer");
                if (gv != null) { gv.GameManager = gameManager; gv.SelectionManager = selectionManager; }
            }

            if (CreateWordListUI)
            {
                var wl = EnsureComponent<WordListUI>("WordListUI");
                if (wl != null) { wl.GameManager = gameManager; wl.SelectionManager = selectionManager; }
            }

            if (CreateTopBarUI) EnsureComponent<TopBarUI>("TopBarUI");
            if (CreateHintButtonUI) EnsureComponent<HintButtonUI>("HintButtonUI");
            if (CreateWinScreenUI) EnsureComponent<WinScreenUI>("WinScreenUI");
            if (CreateLevelTimerUI) EnsureComponent<LevelTimerUI>("LevelTimerUI");

            if (CreateBotRaceMode)
            {
                var br = EnsureComponent<BotRaceMode>("BotRaceMode");
                if (br != null)
                {
                    br.GameManager = gameManager;
                    br.SelectionManager = selectionManager;
                    br.Progress = progress;
                }
            }

            // ---- Menus (the FIX for buttons) ----
            if (CreateCategoryMenuUI) EnsureComponent<CategoryMenuUI>("CategoryMenuUI");
            if (CreateSettingsScreenUI) EnsureComponent<SettingsScreenUI>("SettingsScreenUI");

            // ---- Shop UIs ----
            if (CreateShopUI) EnsureComponent<ShopUI>("ShopUI");
            if (CreateSpinWheelUI) EnsureComponent<SpinWheelUI>("SpinWheelUI");
            if (CreateSeasonPassUI) EnsureComponent<SeasonPassUI>("SeasonPassUI");
            if (CreateAdRewardTiersUI) EnsureComponent<AdRewardTiersUI>("AdRewardTiersUI");

            // ---- Progress UIs ----
            if (CreateAchievementsUI) EnsureComponent<AchievementsUI>("AchievementsUI");
            if (CreateStatisticsUI) EnsureComponent<StatisticsUI>("StatisticsUI");
            if (CreateLeaderboardUI) EnsureComponent<LeaderboardUI>("LeaderboardUI");
            if (CreateMissionsUI) EnsureComponent<MissionsUI>("MissionsUI");

            // ---- Social UIs ----
            if (CreateMultiplayerMenuUI) EnsureComponent<MultiplayerMenuUI>("MultiplayerMenuUI");
            if (CreateFriendListUI) EnsureComponent<FriendListUI>("FriendListUI");
            if (CreateTournamentModeUI) EnsureComponent<TournamentModeUI>("TournamentModeUI");
            if (CreateReferralSystemUI) EnsureComponent<ReferralSystemUI>("ReferralSystemUI");

            // ---- Extra UIs ----
            if (CreateDailyRewardUI) EnsureComponent<DailyRewardUI>("DailyRewardUI");
            if (CreateWorldMapUI) EnsureComponent<WorldMapUI>("WorldMapUI");
            if (CreateNewsFeedUI) EnsureComponent<NewsFeedUI>("NewsFeedUI");
            if (CreateNotificationCenterUI) EnsureComponent<NotificationCenterUI>("NotificationCenterUI");

            // ---- HomeScreenUI goes LAST (overlays everything) ----
            if (CreateHomeScreenUI)
            {
                var hs = EnsureComponent<HomeScreenUI>("HomeScreenUI");
                if (hs != null) hs.Progress = progress;
            }

            if (LogSetup) Debug.Log("[Bootstrap] === Scene setup complete ===");
        }

        private T EnsureComponent<T>(string objectName) where T : MonoBehaviour
        {
            var existing = FindFirstObjectByType<T>();
            if (existing != null)
            {
                if (LogSetup) Debug.Log($"[Bootstrap] {typeof(T).Name} already exists");
                return existing;
            }

            var go = new GameObject(objectName);
            go.transform.SetParent(transform, false);
            var comp = go.AddComponent<T>();

            if (LogSetup) Debug.Log($"[Bootstrap] Created {typeof(T).Name}");
            return comp;
        }
    }
}