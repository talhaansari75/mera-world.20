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



