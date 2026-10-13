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
        public bool CreateStreakButtonUI = true;
        public bool CreateDOTweenInitializer = true;
        public bool CreateGameplayPostFX = true;
        public bool AutoJuiceButtons = true;
        public bool CreateScreenShake = true;
        public bool CreateLoadingScreenUI = true;
        public bool CreateSpriteMaterialFixer = true;
        public bool CreateGlobalLight2D = true;
        public bool DisableGameplayPausePanel = true;

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

            // FIX: Duplicate GameManagers kill karo (DontDestroyOnLoad ne banaye ho sakte hain)
            var allGMs = FindObjectsByType<GameManager>(FindObjectsSortMode.None);
            if (allGMs.Length > 1)
            {
                GameManager keeper = null;
                foreach (var g in allGMs)
                {
                    if (keeper == null || g.CurrentLevel > keeper.CurrentLevel)
                        keeper = g;
                }
                int killed = 0;
                foreach (var g in allGMs)
                {
                    if (g != keeper && g != null)
                    {
                        Debug.LogWarning($"[Bootstrap] Killing DUPLICATE GameManager id={g.GetInstanceID()} level={g.CurrentLevel} (keeper={keeper.GetInstanceID()} level={keeper.CurrentLevel})");
                        Destroy(g.gameObject);
                        killed++;
                    }
                }
                if (LogSetup) Debug.Log($"[Bootstrap] Duplicate cleanup: killed={killed}");
            }

            // Camera aspect fixer
            if (Camera.main != null && Camera.main.GetComponent<CameraAspectFixer>() == null)
                Camera.main.gameObject.AddComponent<CameraAspectFixer>();

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
                    // gv.BuildVisuals();  // DISABLED — GridVisualizer.Start() already builds. Double call caused sprite wipeout.
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
            if (CreateStreakButtonUI) EnsureComponent<StreakButtonUI>("StreakButtonUI");
            if (CreateDOTweenInitializer) EnsureComponent<DOTweenInitializer>("DOTweenInitializer");

            // Post Processing FX
            if (CreateGameplayPostFX)
            {
                if (FindFirstObjectByType<GameplayPostFX>() == null)
                {
                    var fxGo = new GameObject("[GameplayPostFX]");
                    fxGo.AddComponent<GameplayPostFX>();
                    if (LogSetup) Debug.Log("[Bootstrap] GameplayPostFX created");
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

            // GameplayCosmicTheme force rebuild (DontDestroyOnLoad fix)
            var theme = FindFirstObjectByType<GameplayCosmicTheme>();
            if (theme != null)
            {
                theme.BuildBackground();
                Debug.Log("[Bootstrap] GameplayCosmicTheme rebuilt");
            }
            }

            if (LogSetup) // === Universal Button Juice ===
            if (CreateScreenShake)
            {
                if (FindFirstObjectByType<ScreenShake>() == null)
                {
                    var ss = new GameObject("[ScreenShake]");
                    ss.AddComponent<ScreenShake>();
                    if (LogSetup) Debug.Log("[Bootstrap] ScreenShake created");
                }
            }

            if (AutoJuiceButtons)
            {
                var buttons = FindObjectsByType<UnityEngine.UI.Button>(
                    FindObjectsInactive.Include, FindObjectsSortMode.None);
                int added = 0;
                foreach (var btn in buttons)
                {
                    if (btn.GetComponent<ButtonJuice>() == null)
                    {
                        btn.gameObject.AddComponent<ButtonJuice>();
                        added++;
                    }
                }
                if (LogSetup) Debug.Log($"[Bootstrap] ButtonJuice applied to {added} buttons");
            }

            // === Disable duplicate pause panel ===
            if (DisableGameplayPausePanel)
            {
                var dup = FindFirstObjectByType<GameplayPausePanel>();
                if (dup != null)
                {
                    Destroy(dup.gameObject);
                    if (LogSetup) Debug.Log("[Bootstrap] GameplayPausePanel destroyed (using PauseMenuUI)");
                }
            }

            // Create Global Light 2D for lit sprites
            if (CreateGlobalLight2D)
            {
                if (FindFirstObjectByType<GlobalLight2DSetup>() == null)
                {
                    var lightGo = new GameObject("[GlobalLight2DSetup]");
                    lightGo.AddComponent<GlobalLight2DSetup>();
                    if (LogSetup) Debug.Log("[Bootstrap] GlobalLight2DSetup created");
                }
            }

            // Fix sprite materials for 3D URP renderer
            if (CreateSpriteMaterialFixer)
            {
                if (FindFirstObjectByType<SpriteMaterialFixer>() == null)
                {
                    var fixGo = new GameObject("[SpriteMaterialFixer]");
                    fixGo.AddComponent<SpriteMaterialFixer>();
                    if (LogSetup) Debug.Log("[Bootstrap] SpriteMaterialFixer created");
                }
            }

            // Diagnostic dump
            if (FindFirstObjectByType<SceneDiagnosticDump>() == null)
            {
                var diagGo = new GameObject("[SceneDiagnosticDump]");
                diagGo.AddComponent<SceneDiagnosticDump>();
            }

            // Sprite tracker
            if (FindFirstObjectByType<SpriteTracker>() == null)
            {
                var trackerGo = new GameObject("[SpriteTracker]");
                trackerGo.AddComponent<SpriteTracker>();
            }

            // Grid persistence fix — cells must survive scene reload
            if (FindFirstObjectByType<GridPersistenceFix>() == null)
            {
                var fixGo = new GameObject("[GridPersistenceFix]");
                fixGo.AddComponent<GridPersistenceFix>();
                if (LogSetup) Debug.Log("[Bootstrap] GridPersistenceFix created");
            }

            // Loading Screen UI (persistent, for level transitions)
            if (CreateLoadingScreenUI)
            {
                if (FindFirstObjectByType<LoadingScreenUI>() == null)
                {
                    var lgo = new GameObject("[LoadingScreenUI]");
                    lgo.AddComponent<LoadingScreenUI>();
                    if (LogSetup) Debug.Log("[Bootstrap] LoadingScreenUI created");
                }
            }

            Debug.Log("[Bootstrap] === Scene setup complete ===");
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









