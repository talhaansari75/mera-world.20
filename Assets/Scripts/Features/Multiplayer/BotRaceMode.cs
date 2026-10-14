using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public partial class BotRaceMode : MonoBehaviour
    {
        public static bool IsActive { get; private set; } = false;
        private static float _lastRecheckTime = -999f;

        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;
        public PlayerProgressManager Progress;

        [Header("Race Settings")]
        public bool UseRandomBotName = true;
        public bool AutoDifficultyByLevel = true;

        private BotOpponent _bot;
        private Canvas _canvas;
        private GameObject _racePanel;
        private Text _playerScoreText;
        private Text _botScoreText;
        private Image _playerProgressFill;
        private Image _botProgressFill;
        private int _playerFoundCount = 0;
        private int _totalWords = 8;

        private const string PREF_BOT_NAME = "BotRace_OpponentName";
        private const string PREF_BOT_ENABLED = "BotRace_Enabled";

        void Start()
        {
            // FIX: Static timer reset karo scene reload pe
            _lastRecheckTime = -999f;

            Debug.Log("[BotRace] Start() called - checking for multiplayer flag...");
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            Invoke(nameof(Setup), 0.2f);
        }

        private void Setup()
        {
            if (IsActive)
            {
                Debug.Log("[BotRace] Setup skipped - race already active");
                return;
            }

            if (GameManager == null || SelectionManager == null)
            {
                Debug.LogWarning("[BotRace] Missing GameManager or SelectionManager.");
                return;
            }

            bool raceEnabled = PlayerPrefs.GetInt(PREF_BOT_ENABLED, 0) == 1;
            bool forceTest = PlayerPrefs.GetInt("ForceTestRace", 0) == 1;

            if (forceTest)
            {
                PlayerPrefs.DeleteKey("ForceTestRace");
                PlayerPrefs.Save();
                Debug.Log("[BotRace] ForceTestRace flag - starting test race");
                ForceStartRace();
                return;
            }

            if (!raceEnabled)
            {
                Debug.Log("[BotRace] Single player mode - no bot.");
                return;
            }

            int level = GameManager.CurrentLevel;

            if (GameManager.Words == null || GameManager.Words.Count == 0)
            {
                Debug.LogWarning("[BotRace] No words in GameManager. Skipping race.");
                return;
            }

            IsActive = true;
            _totalWords = GameManager.Words.Count;
            _playerFoundCount = 0;

            HideTopBar();

            string botName = PlayerPrefs.GetString(PREF_BOT_NAME, "");
            if (string.IsNullOrEmpty(botName) && UseRandomBotName)
                botName = BotOpponent.GetRandomName();

            PlayerPrefs.DeleteKey(PREF_BOT_NAME);
            PlayerPrefs.DeleteKey(PREF_BOT_ENABLED);
            PlayerPrefs.Save();

            BotDifficulty difficulty;
            if (AutoDifficultyByLevel)
                difficulty = BotOpponent.GetDifficultyForLevel(level);
            else
                difficulty = BotDifficulty.Skilled;

            _bot = new BotOpponent(botName, GameManager.Words, difficulty);
            _bot.OnWordFound += OnBotFoundWord;
            _bot.SetSpeedMultiplier(15f);

            BuildCanvas();
            BuildRacePanel();

            SelectionManager.OnWordFound += OnPlayerFoundWord;

            Debug.Log("[BotRace] Started vs '" + botName + "' (" + difficulty + ") on Level " + level + ". Words: " + _totalWords);
        }

        private void HideTopBar()
        {
            var topBar = FindFirstObjectByType<TopBarUI>();
            if (topBar == null) return;

            topBar.enabled = false;
            string[] hideNames = { "TopBarBG", "CoinIconContainer", "CoinsContainer", "LevelContainer" };

            Transform tbCanvas = null;
            foreach (Transform child in topBar.transform)
            {
                if (child.name == "TopBarCanvas") { tbCanvas = child; break; }
            }

            if (tbCanvas != null)
            {
                int hidden = 0;
                for (int i = 0; i < tbCanvas.childCount; i++)
                {
                    var child = tbCanvas.GetChild(i);
                    foreach (var n in hideNames)
                    {
                        if (child.name.StartsWith(n))
                        {
                            child.gameObject.SetActive(false);
                            hidden++;
                            break;
                        }
                    }
                }
                Debug.Log("[BotRace] TopBar hidden " + hidden + " elements");
            }
        }

        private void ResetRaceState()
        {
            Debug.Log("[BotRace] Resetting race state...");

            if (_bot != null)
            {
                _bot.OnWordFound -= OnBotFoundWord;
                _bot = null;
            }

            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnPlayerFoundWord;

            if (_canvas != null)
            {
                Destroy(_canvas.gameObject);
                _canvas = null;
            }

            _racePanel = null;
            _playerScoreText = null;
            _botScoreText = null;
            _playerProgressFill = null;
            _botProgressFill = null;

            IsActive = false;
            _playerFoundCount = 0;

            Debug.Log("[BotRace] Race state reset complete");
        }

        public void RecheckFlagsOnSceneReload()
        {
            if (Time.unscaledTime - _lastRecheckTime < 0.1f)
            {
                Debug.Log("[BotRace] Recheck skipped (too soon)");
                return;
            }
            _lastRecheckTime = Time.unscaledTime;

            bool forceTest = PlayerPrefs.GetInt("ForceTestRace", 0) == 1;

            if (forceTest)
            {
                PlayerPrefs.DeleteKey("ForceTestRace");
                PlayerPrefs.Save();
                Debug.Log("[BotRace] ForceTestRace flag detected - resetting and starting fresh");

                ResetRaceState();

                if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
                if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();
                if (Progress == null) Progress = PlayerProgressManager.Instance;

                if (GameManager == null || SelectionManager == null)
                {
                    Debug.LogError("[BotRace] Refs missing on reload");
                    return;
                }

                ForceStartRace();
                return;
            }

            if (IsActive && _bot != null)
            {
                Debug.Log("[BotRace] Race already active - skipping");
                return;
            }

            bool raceEnabled = PlayerPrefs.GetInt("BotRace_Enabled", 0) == 1;
            if (raceEnabled)
            {
                Debug.Log("[BotRace] Multiplayer flag detected on reload - starting race");
                if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
                if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();
                if (Progress == null) Progress = PlayerProgressManager.Instance;
                Setup();
            }
        }

        public void ForceStartRace()
        {
            Debug.Log("[BotRace] ForceStartRace called");

            if (IsActive || _bot != null)
            {
                Debug.Log("[BotRace] Already active - skipping");
                return;
            }

            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            if (GameManager == null || SelectionManager == null)
            {
                Debug.LogError("[BotRace] Missing refs");
                return;
            }

            if (GameManager.Words == null || GameManager.Words.Count == 0)
            {
                Debug.LogError("[BotRace] No words");
                return;
            }

            IsActive = true;
            _totalWords = GameManager.Words.Count;
            _playerFoundCount = 0;

            HideTopBar();

            string botName = BotOpponent.GetRandomName();
            BotDifficulty difficulty = BotOpponent.GetDifficultyForLevel(GameManager.CurrentLevel);
            _bot = new BotOpponent(botName, GameManager.Words, difficulty);
            _bot.OnWordFound += OnBotFoundWord;
            _bot.SetSpeedMultiplier(5f);

            BuildCanvas();
            BuildRacePanel();
            SelectionManager.OnWordFound += OnPlayerFoundWord;

            Debug.Log("[BotRace] Started vs " + botName + " - TEST MODE");
        }

        void Update()
        {
            if (!IsActive || _bot == null) return;
            _bot.Update(Time.deltaTime);
        }

        void OnDestroy()
        {
            if (SelectionManager != null)
                SelectionManager.OnWordFound -= OnPlayerFoundWord;
            if (_bot != null)
                _bot.OnWordFound -= OnBotFoundWord;
        }
    }
}