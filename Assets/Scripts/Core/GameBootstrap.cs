using UnityEngine;

namespace MeraWorld.Core
{
    /// <summary>
    /// Auto-setup helper v2 — creates missing components AND wires references.
    /// Attach to any empty GameObject in the gameplay scene.
    /// </summary>
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

        void Awake()
        {
            if (LogSetup) Debug.Log("[Bootstrap] === Starting scene setup ===");

            // Find shared dependencies
            var gameManager = FindFirstObjectByType<GameManager>();
            var selectionManager = FindFirstObjectByType<SelectionManager>();
            var progress = PlayerProgressManager.Instance;

            if (gameManager == null)
            {
                Debug.LogError("[Bootstrap] GameManager missing! Cannot continue.");
                return;
            }

            if (selectionManager == null)
                Debug.LogWarning("[Bootstrap] SelectionManager missing. Will try to create.");

            // ---- Create components in order ----

            if (CreateGridVisualizer)
            {
                var gv = EnsureComponent<GridVisualizer>("GridVisualizer");
                if (gv != null)
                {
                    gv.GameManager = gameManager;
                    gv.SelectionManager = selectionManager;
                    if (LogSetup) Debug.Log("[Bootstrap] GridVisualizer wired");
                }
            }

            if (CreateWordListUI)
            {
                var wl = EnsureComponent<WordListUI>("WordListUI");
                if (wl != null)
                {
                    wl.GameManager = gameManager;
                    wl.SelectionManager = selectionManager;
                    if (LogSetup) Debug.Log("[Bootstrap] WordListUI wired");
                }
            }

            if (CreateTopBarUI)
            {
                var tb = EnsureComponent<TopBarUI>("TopBarUI");
                if (tb != null)
                {
                    // TopBarUI usually finds Progress itself
                    if (LogSetup) Debug.Log("[Bootstrap] TopBarUI wired");
                }
            }

            if (CreateHintButtonUI)
            {
                var hb = EnsureComponent<HintButtonUI>("HintButtonUI");
                if (hb != null)
                {
                    if (LogSetup) Debug.Log("[Bootstrap] HintButtonUI wired");
                }
            }

            if (CreateWinScreenUI)
            {
                var ws = EnsureComponent<WinScreenUI>("WinScreenUI");
                if (ws != null)
                {
                    if (LogSetup) Debug.Log("[Bootstrap] WinScreenUI wired");
                }
            }

            if (CreateLevelTimerUI)
            {
                var lt = EnsureComponent<LevelTimerUI>("LevelTimerUI");
                if (lt != null)
                {
                    if (LogSetup) Debug.Log("[Bootstrap] LevelTimerUI wired");
                }
            }

            if (CreateBotRaceMode)
            {
                var br = EnsureComponent<BotRaceMode>("BotRaceMode");
                if (br != null)
                {
                    br.GameManager = gameManager;
                    br.SelectionManager = selectionManager;
                    br.Progress = progress;
                    if (LogSetup) Debug.Log("[Bootstrap] BotRaceMode wired");
                }
            }

            // HomeScreenUI goes LAST so it can overlay everything
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
                if (LogSetup) Debug.Log($"[Bootstrap] {typeof(T).Name} already exists on '{existing.gameObject.name}'");
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