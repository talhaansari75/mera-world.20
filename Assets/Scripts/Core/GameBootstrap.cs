using UnityEngine;

namespace MeraWorld.Core
{
    public class GameBootstrap : MonoBehaviour
    {
        [Header("Auto-Create Missing Components")]
        public bool CreateHomeScreenUI = true;
        public bool CreateGridVisualizer = true;
        public bool CreateWordListUI = true;
        public bool CreateTopBarUI = true;
        public bool CreateHintButtonUI = true;
        public bool CreateWinScreenUI = true;
        public bool CreateLevelTimerUI = true;
        public bool CreateBotRaceMode = true;

        [Header("Debug")]
        public bool LogSetup = true;

        // Guard: har scene pe sirf ek baar RunSetup chalega
        private static bool _hasRunThisScene = false;

        // Awake ab kuch nahi karta - MultiplayerSessionFlag scene load pe RunSetup call karega
        void Awake()
        {
            // Naya scene load hone pe reset
            _hasRunThisScene = false;
        }

        public void RunSetup()
        {
            // Guard: agar already chal chuka hai to skip
            if (_hasRunThisScene)
            {
                if (LogSetup) Debug.Log("[Bootstrap] Already ran this scene - skipping");
                return;
            }
            _hasRunThisScene = true;

            if (LogSetup) Debug.Log("[Bootstrap] === Starting scene setup ===");

            var gameManager = FindFirstObjectByType<GameManager>();
            var selectionManager = FindFirstObjectByType<SelectionManager>();
            var progress = PlayerProgressManager.Instance;

            if (gameManager == null)
            {
                Debug.LogError("[Bootstrap] GameManager missing! Cannot continue.");
                return;
            }

            if (selectionManager == null)
                Debug.LogWarning("[Bootstrap] SelectionManager missing.");

            // Scene reload pe level dobara load karo (DontDestroyOnLoad fix)
            gameManager.ReloadFromProgress();

            if (CreateGridVisualizer)
            {
                var gv = EnsureComponent<GridVisualizer>("GridVisualizer");
                if (gv != null)
                {
                    gv.GameManager = gameManager;
                    gv.SelectionManager = selectionManager;
                    gv.BuildVisuals();
                    if (LogSetup) Debug.Log("[Bootstrap] GridVisualizer wired + rebuilt");
                }
            }

            if (CreateWordListUI)
            {
                var wl = EnsureComponent<WordListUI>("WordListUI");
                if (wl != null)
                {
                    wl.GameManager = gameManager;
                    wl.SelectionManager = selectionManager;
                    wl.ForceRebuild();
                    if (LogSetup) Debug.Log("[Bootstrap] WordListUI wired + rebuilt");
                }
            }

            if (CreateTopBarUI) EnsureComponent<TopBarUI>("TopBarUI");
            if (CreateHintButtonUI) EnsureComponent<HintButtonUI>("HintButtonUI");
            if (CreateWinScreenUI)
            {
                var ws = EnsureComponent<WinScreenUI>("WinScreenUI");
                if (ws != null)
                {
                    if (ws.GameManager == null) ws.GameManager = gameManager;
                    if (ws.SelectionManager == null) ws.SelectionManager = selectionManager;
                    if (LogSetup) Debug.Log("[Bootstrap] WinScreenUI wired");
                }
            }
            if (CreateLevelTimerUI) EnsureComponent<LevelTimerUI>("LevelTimerUI");

            if (CreateBotRaceMode)
            {
                var br = EnsureComponent<BotRaceMode>("BotRaceMode");
                if (br != null)
                {
                    br.GameManager = gameManager;
                    br.SelectionManager = selectionManager;
                    br.Progress = progress;
                    if (LogSetup) Debug.Log("[Bootstrap] BotRaceMode wired");

                    // Scene reload pe flags check karo
                    br.RecheckFlagsOnSceneReload();
                }
            }

            if (CreateHomeScreenUI)
            {
                var hs = EnsureComponent<HomeScreenUI>("HomeScreenUI");
                if (hs != null)
                {
                    hs.Progress = progress;
                    if (LogSetup) Debug.Log("[Bootstrap] HomeScreenUI wired");
                }
            }

            // MultiplayerMenuUI panel ko hide karo (scene reload ke baad wapas show ho jata hai)
            var mmUI = FindFirstObjectByType<MultiplayerMenuUI>();
            if (mmUI != null)
            {
                mmUI.Hide();
                Debug.Log("[Bootstrap] MultiplayerMenuUI hidden");
            }

            if (LogSetup) Debug.Log("[Bootstrap] === Scene setup complete ===");
        }

        private T EnsureComponent<T>(string objectName) where T : MonoBehaviour
        {
            var existing = FindFirstObjectByType<T>();
            if (existing != null)
            {
                if (LogSetup) Debug.Log($"[Bootstrap] {typeof(T).Name} exists on '{existing.gameObject.name}'");
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




