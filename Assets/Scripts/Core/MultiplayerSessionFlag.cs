using UnityEngine;
using UnityEngine.SceneManagement;
using MeraWorld.Core;
public class MultiplayerSessionFlag : MonoBehaviour
{
    public static MultiplayerSessionFlag Instance { get; private set; }
    public static bool ShouldSkipHome { get; set; } = false;

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
    static void ResetOnPlayStart()
    {
        ShouldSkipHome = false;
        _subscribed = false;   // Reset subscribe flag
        Instance = null;

        // Purane stuck flags clear karo
        if (PlayerPrefs.HasKey("SkipHome"))
        {
            PlayerPrefs.DeleteKey("SkipHome");
            Debug.Log("[SessionFlag] Cleared stale SkipHome flag");
        }
        if (PlayerPrefs.HasKey("ForceTestRace"))
        {
            PlayerPrefs.DeleteKey("ForceTestRace");
            Debug.Log("[SessionFlag] Cleared stale ForceTestRace flag");
        }

        // TestMode bhi clear karo (warna single player cream theme mein chalega)
        if (PlayerPrefs.HasKey("TestMode"))
        {
            PlayerPrefs.DeleteKey("TestMode");
            Debug.Log("[SessionFlag] Cleared stale TestMode flag");
        }
        PlayerPrefs.Save();

        // Static events clear karo
        MeraWorld.Core.SelectionManager.ClearLevelCompleteListeners();

        Debug.Log("[SessionFlag] Play session started");
    }

    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    static void EnsureExists()
    {
        if (Instance != null) return;
        var go = new GameObject("[MultiplayerSessionFlag]");
        go.AddComponent<MultiplayerSessionFlag>();
        DontDestroyOnLoad(go);
        Debug.Log("[SessionFlag] Created persistent object");
    }

    private static bool _subscribed = false;

    void Awake()
    {
        if (Instance != null && Instance != this) { Destroy(gameObject); return; }
        Instance = this;

        // Sirf EK BAAR subscribe karo
        if (!_subscribed)
        {
            SceneManager.sceneLoaded += OnSceneLoaded;
            _subscribed = true;
            Debug.Log("[SessionFlag] Subscribed to sceneLoaded (once)");
        }
    }

    void OnDestroy()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
        if (Instance == this) Instance = null;
    }

    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        Debug.Log("[SessionFlag] Scene loaded: " + scene.name + " - running bootstrap");

        bool testMode = PlayerPrefs.GetInt("TestMode", 0) == 1;
        bool skipHome = PlayerPrefs.GetInt("SkipHome", 0) == 1;

        // 1) HOME SCREEN FORCE HIDE (kyunki HomeScreenUI.Start dobara nahi chalta)
        var home = FindFirstObjectByType<HomeScreenUI>();
        Debug.Log("[SessionFlag] OnSceneLoaded - homeNull=" + (home == null) + " skipHome=" + skipHome);
        if (home != null && skipHome)
        {
            home.ForceShowGameplay();
            Debug.Log("[SessionFlag] ForceShowGameplay called");
        }
        else
        {
            Debug.Log("[SessionFlag] SKIPPED - homeNull=" + (home == null) + " skipHome=" + skipHome);
        }

        // 2) GameplayCosmicTheme REBUILD (cream bg ke liye)
        var theme = FindFirstObjectByType<GameplayCosmicTheme>();
        if (theme != null && testMode)
        {
            theme.BuildBackground();
            Debug.Log("[SessionFlag] Cosmic theme rebuilt");
        }

        // 3) GridVisualizer REBUILD (white tiles ke liye)
        var grid = FindFirstObjectByType<GridVisualizer>();
        if (grid != null && testMode)
        {
            grid.BuildVisuals();
            Debug.Log("[SessionFlag] Grid rebuilt");
        }

        // 4) Bootstrap
        var bootstrap = FindFirstObjectByType<GameBootstrap>();
        if (bootstrap == null)
        {
            var go = new GameObject("[GameBootstrap]");
            bootstrap = go.AddComponent<GameBootstrap>();
        }
        bootstrap.RunSetup();

        // 5) DELAYED HIDE - HomeScreenUI.Setup() 0.2s baad chalta hai
        if (skipHome && Instance != null)
            Instance.StartCoroutine(DelayedHideHome(home));
    }

    private System.Collections.IEnumerator DelayedHideHome(HomeScreenUI home)
    {
        yield return new WaitForSeconds(0.5f);
        if (home != null)
        {
            home.ForceShowGameplay();
            Debug.Log("[SessionFlag] Delayed home hide executed");
        }
    }
}











