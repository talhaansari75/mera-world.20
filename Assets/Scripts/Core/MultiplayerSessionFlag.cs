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
        PlayerPrefs.Save();

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

        var bootstrap = FindFirstObjectByType<GameBootstrap>();
        if (bootstrap == null)
        {
            var go = new GameObject("[GameBootstrap]");
            bootstrap = go.AddComponent<GameBootstrap>();
        }
        bootstrap.RunSetup();
    }
}





