using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    /// <summary>
    /// Race mode. Bot SIRF tab aata hai jab MatchmakingManager ne
    /// PlayerPrefs mein "BotRace_Enabled" = 1 set kiya ho.
    /// Single player mein bot bilkul nahi aata.
    /// </summary>
    public class BotRaceMode : MonoBehaviour
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
            Debug.Log("[BotRace] Start() called - checking for multiplayer flag...");
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            Invoke(nameof(Setup), 0.2f);
        }

        private void Setup()
        {
            // Agar already race chal rahi hai to skip
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

            // === BOT SIRF MULTIPLAYER MATCH MEIN ===
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

            // TopBarUI chhupao - script disable karo (GameObject NAHI)
            var topBar = FindFirstObjectByType<TopBarUI>();
            if (topBar != null)
            {
                topBar.enabled = false;

                // Sirf TopBar ke elements hide karo
                string[] hideNames = { "TopBarBG", "CoinIconContainer", "CoinsContainer", "LevelContainer" };

                Transform tbCanvas = null;
                foreach (Transform child in topBar.transform)
                {
                    if (child.name == "TopBarCanvas")
                    {
                        tbCanvas = child;
                        break;
                    }
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

            // Bot name - MatchmakingManager ne set kiya tha
            string botName = PlayerPrefs.GetString(PREF_BOT_NAME, "");
            if (string.IsNullOrEmpty(botName) && UseRandomBotName)
                botName = BotOpponent.GetRandomName();

            // Clean up flags
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

            // TEST MODE: Bot 15x fast
            _bot.SetSpeedMultiplier(15f);

            BuildCanvas();
            BuildRacePanel();

            SelectionManager.OnWordFound += OnPlayerFoundWord;

            Debug.Log($"[BotRace] Started vs '{botName}' ({difficulty}) on Level {level}. Words: {_totalWords}");
        }

        /// <summary>
        /// Scene reload ke bina directly race start karo. Test ke liye.
        /// </summary>
        /// <summary>
        /// Scene reload pe flags dobara check karo (kyunki Start() dobara nahi chalta).
        /// </summary>
        /// <summary>
        /// Scene reload pe purani race ki state saaf karo.
        /// </summary>
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
            // Guard: 1 second mein sirf ek baar
            if (Time.unscaledTime - _lastRecheckTime < 1.0f)
            {
                Debug.Log("[BotRace] Recheck skipped (too soon)");
                return;
            }
            _lastRecheckTime = Time.unscaledTime;

            bool forceTest = PlayerPrefs.GetInt("ForceTestRace", 0) == 1;

            // FORCE TEST: purani race reset karo aur naya start
            if (forceTest)
            {
                PlayerPrefs.DeleteKey("ForceTestRace");
                PlayerPrefs.Save();
                Debug.Log("[BotRace] ForceTestRace flag detected - resetting and starting fresh");

                // Purani race saaf karo
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

            // Normal active race skip
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

            // Guard
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

            // TopBar hide karo
            var topBar = FindFirstObjectByType<TopBarUI>();
            if (topBar != null)
            {
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

            // Bot create
            string botName = BotOpponent.GetRandomName();
            BotDifficulty difficulty = BotOpponent.GetDifficultyForLevel(GameManager.CurrentLevel);
            _bot = new BotOpponent(botName, GameManager.Words, difficulty);
            _bot.OnWordFound += OnBotFoundWord;

            // TEST: 5x speed
            _bot.SetSpeedMultiplier(5f);

            // UI banao
            BuildCanvas();
            BuildRacePanel();
            SelectionManager.OnWordFound += OnPlayerFoundWord;

            Debug.Log("[BotRace] Started vs " + botName + " - TEST MODE");
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("BotRaceCanvas");
            canvasObj.transform.SetParent(transform, false);

            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 800;   // Home screen se UPAR (500)

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildRacePanel()
        {
            // ===== TOP BAR - 8 Ball Pool Style =====
            _racePanel = new GameObject("RacePanel");
            _racePanel.transform.SetParent(_canvas.transform, false);

            var bg = _racePanel.AddComponent<Image>();
            Color topColor, bottomColor;
            if (TestModeTheme.IsActive)
            {
                topColor = new Color(0.98f, 0.96f, 0.90f);
                bottomColor = new Color(0.92f, 0.88f, 0.82f);
            }
            else
            {
                topColor = new Color(0.08f, 0.15f, 0.28f);
                bottomColor = new Color(0.15f, 0.28f, 0.45f);
            }
            bg.sprite = UISpriteFactory.CreateGradientSprite(topColor, bottomColor, 32, 256);
            bg.type = Image.Type.Simple;
            bg.color = Color.white;
            bg.raycastTarget = false;
            bg.raycastTarget = false;

            var rt = _racePanel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0f, 1f);
            rt.anchorMax = new Vector2(1f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(0f, 400f);

            // Gold line
            var gl = new GameObject("GoldLine");
            gl.transform.SetParent(_racePanel.transform, false);
            var glImg = gl.AddComponent<Image>();
            glImg.color = TestModeTheme.IsActive ? new Color(0.55f, 0.40f, 0.20f, 0.5f) : new Color(1f, 0.85f, 0.30f);
            glImg.raycastTarget = false;
            var glRt = gl.GetComponent<RectTransform>();
            glRt.anchorMin = new Vector2(0f, 0f);
            glRt.anchorMax = new Vector2(1f, 0f);
            glRt.pivot = new Vector2(0.5f, 0f);
            glRt.sizeDelta = new Vector2(0f, 4f);
            glRt.anchoredPosition = Vector2.zero;

            // ===== PLAYER (LEFT) =====
            BuildAvatarFrame(new Vector2(-420f, -160f), new Color(0.55f, 0.30f, 0.75f), "girl");
            BuildStarBadge(new Vector2(-515f, -40f), new Color(0.20f, 0.50f, 0.85f), "26");
            BuildTopRibbon(new Vector2(-420f, -40f));
            BuildLabelText("YOU", new Vector2(-260f, -120f), 46, Color.white, TextAnchor.MiddleLeft, false);
            _playerScoreText = BuildLabelText("0/8", new Vector2(-260f, -190f), 56, Color.white, TextAnchor.MiddleLeft, true);
            _playerProgressFill = BuildModernBar(new Vector2(-260f, -270f), new Color(1f, 0.85f, 0.30f));

            // ===== BOT (RIGHT) =====
            string botLabel = _bot != null ? _bot.Name : "Bot";
            BuildAvatarFrame(new Vector2(420f, -160f), new Color(0.95f, 0.55f, 0.30f), "boy");
            BuildStarBadge(new Vector2(515f, -40f), new Color(1f, 0.75f, 0.20f), "23");
            BuildLabelText(botLabel, new Vector2(260f, -120f), 46, Color.white, TextAnchor.MiddleRight, false);
            _botScoreText = BuildLabelText("0/8", new Vector2(260f, -190f), 56, Color.white, TextAnchor.MiddleRight, true);
            _botProgressFill = BuildModernBar(new Vector2(260f, -270f), new Color(1f, 0.85f, 0.30f));
            BuildCoinsDisplay(new Vector2(440f, -320f));

            // ===== CENTER =====
            BuildTrophyIcon(new Vector2(0f, -60f));
            BuildVSBadgeIcon(new Vector2(0f, -230f));
        }

        private void BuildAvatarFrame(Vector2 pos, Color color, string imgName)
        {
            var cont = new GameObject("AvatarCont");
            cont.transform.SetParent(_racePanel.transform, false);
            var crt = cont.AddComponent<RectTransform>();
            crt.anchorMin = new Vector2(0.5f, 1f);
            crt.anchorMax = new Vector2(0.5f, 1f);
            crt.pivot = new Vector2(0.5f, 0.5f);
            crt.anchoredPosition = pos;
            crt.sizeDelta = new Vector2(180f, 180f);

            // Inner image container
            var inner = new GameObject("Inner");
            inner.transform.SetParent(cont.transform, false);
            var iImg = inner.AddComponent<Image>();
            iImg.color = TestModeTheme.IsActive ? new Color(0.92f, 0.88f, 0.82f) : new Color(0.65f, 0.45f, 0.85f);
            iImg.raycastTarget = false;
            var irt = inner.GetComponent<RectTransform>();
            irt.anchorMin = Vector2.zero;
            irt.anchorMax = Vector2.one;
            irt.offsetMin = new Vector2(22f, 22f);
            irt.offsetMax = new Vector2(-22f, -22f);

            // Girl/Boy image
            Sprite imgSprite = null;
            if (!string.IsNullOrEmpty(imgName))
                imgSprite = Resources.Load<Sprite>("UI/Avatars/" + imgName);

            if (imgSprite != null)
            {
                var imgObj = new GameObject("Img");
                imgObj.transform.SetParent(inner.transform, false);
                var img = imgObj.AddComponent<Image>();
                img.sprite = imgSprite;
                img.color = Color.white;
                img.raycastTarget = false;
                img.preserveAspect = true;
                var imRt = imgObj.GetComponent<RectTransform>();
                imRt.anchorMin = Vector2.zero;
                imRt.anchorMax = Vector2.one;
                imRt.offsetMin = Vector2.zero;
                imRt.offsetMax = Vector2.zero;
            }

            // Gold frame overlay (upar)
            var frameObj = new GameObject("GoldFrame");
            frameObj.transform.SetParent(cont.transform, false);
            var fImg = frameObj.AddComponent<Image>();
            Sprite frameSprite = Resources.Load<Sprite>("UI/Multiplayer/gold_frame");
            Debug.Log("[BotRace] gold_frame loaded? " + (frameSprite != null));
            if (frameSprite != null)
            {
                fImg.sprite = frameSprite;
                fImg.preserveAspect = true;
            }
            else
            {
                fImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.85f, 0.30f), 128, 20);
                fImg.type = Image.Type.Sliced;
            }
            fImg.color = Color.white;
            fImg.raycastTarget = false;
            var frt = frameObj.GetComponent<RectTransform>();
            frt.anchorMin = Vector2.zero;
            frt.anchorMax = Vector2.one;
            frt.offsetMin = Vector2.zero;
            frt.offsetMax = Vector2.zero;
        }

        private void BuildStarBadge(Vector2 pos, Color color, string num)
        {
            var badge = new GameObject("Star");
            badge.transform.SetParent(_racePanel.transform, false);
            var brt = badge.AddComponent<RectTransform>();
            brt.anchorMin = new Vector2(0.5f, 1f);
            brt.anchorMax = new Vector2(0.5f, 1f);
            brt.pivot = new Vector2(0.5f, 0.5f);
            brt.anchoredPosition = pos;
            brt.sizeDelta = new Vector2(62f, 62f);

            var img = badge.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DSphereSprite(color, 128);
            img.color = Color.white;
            img.raycastTarget = false;

            var txtObj = new GameObject("Num");
            txtObj.transform.SetParent(badge.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = num;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 30;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void BuildTopRibbon(Vector2 pos)
        {
            var rb = new GameObject("TopRibbon");
            rb.transform.SetParent(_racePanel.transform, false);
            var rrt = rb.AddComponent<RectTransform>();
            rrt.anchorMin = new Vector2(0.5f, 1f);
            rrt.anchorMax = new Vector2(0.5f, 1f);
            rrt.pivot = new Vector2(0.5f, 0f);
            rrt.anchoredPosition = pos;
            rrt.sizeDelta = new Vector2(110f, 55f);

            var img = rb.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.90f, 0.20f, 0.20f), 128, 8);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            img.raycastTarget = false;

            var txtObj = new GameObject("Txt");
            txtObj.transform.SetParent(rb.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = "TOP 1";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 22;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private Text BuildLabelText(string text, Vector2 pos, int size, Color color, TextAnchor align, bool bold)
        {
            var obj = new GameObject("Label");
            obj.transform.SetParent(_racePanel.transform, false);
            var txt = obj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = bold ? FontStyle.Bold : FontStyle.Normal;
            txt.color = TestModeTheme.IsActive ? new Color(0.35f, 0.20f, 0.10f) : color;
            txt.alignment = align;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(240f, 70f);
            return txt;
        }

        private Image BuildModernBar(Vector2 pos, Color fillColor)
        {
            var bgObj = new GameObject("BarBg");
            bgObj.transform.SetParent(_racePanel.transform, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.20f, 0.35f), 64, 12);
            bgImg.type = Image.Type.Sliced;
            bgImg.color = Color.white;
            bgImg.raycastTarget = false;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.5f, 1f);
            bgRt.anchorMax = new Vector2(0.5f, 1f);
            bgRt.pivot = new Vector2(0.5f, 1f);
            bgRt.anchoredPosition = pos;
            bgRt.sizeDelta = new Vector2(280f, 24f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(bgObj.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.sprite = UISpriteFactory.Create3DButtonSprite(fillColor, 64, 10);
            fillImg.type = Image.Type.Sliced;
            fillImg.color = Color.white;
            fillImg.raycastTarget = false;
            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(3f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -6f);
            return fillImg;
        }

        private void BuildCoinsDisplay(Vector2 pos)
        {
            var coin = new GameObject("Coin");
            coin.transform.SetParent(_racePanel.transform, false);
            var cImg = coin.AddComponent<Image>();
            cImg.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.80f, 0.20f), 128);
            cImg.color = Color.white;
            cImg.raycastTarget = false;
            var cRt = coin.GetComponent<RectTransform>();
            cRt.anchorMin = new Vector2(0.5f, 1f);
            cRt.anchorMax = new Vector2(0.5f, 1f);
            cRt.pivot = new Vector2(0.5f, 0.5f);
            cRt.anchoredPosition = pos;
            cRt.sizeDelta = new Vector2(48f, 48f);

            var txtObj = new GameObject("CoinTxt");
            txtObj.transform.SetParent(_racePanel.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = "1000";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 34;
            txt.fontStyle = FontStyle.Bold;
            txt.color = new Color(1f, 0.85f, 0.30f);
            txt.alignment = TextAnchor.MiddleLeft;
            txt.raycastTarget = false;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 1f);
            trt.anchorMax = new Vector2(0.5f, 1f);
            trt.pivot = new Vector2(0f, 0.5f);
            trt.anchoredPosition = pos + new Vector2(35f, 0f);
            trt.sizeDelta = new Vector2(200f, 60f);
        }

        private void BuildTrophyIcon(Vector2 pos)
        {
            var tr = new GameObject("Trophy");
            tr.transform.SetParent(_racePanel.transform, false);
            var rt = tr.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(100f, 100f);

            var img = tr.AddComponent<Image>();
            Sprite trophySprite = Resources.Load<Sprite>("UI/Multiplayer/trophy");
            Debug.Log("[BotRace] trophy loaded? " + (trophySprite != null));
            if (trophySprite != null)
            {
                img.sprite = trophySprite;
                img.preserveAspect = true;
            }
            else
            {
                img.sprite = UISpriteFactory.Create3DSphereSprite(new Color(1f, 0.85f, 0.30f), 128);
            }
            img.color = Color.white;
            img.raycastTarget = false;
        }

        private void BuildVSBadgeIcon(Vector2 pos)
        {
            var vs = new GameObject("VS");
            vs.transform.SetParent(_racePanel.transform, false);
            var rt = vs.AddComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(340f, 170f);

            var img = vs.AddComponent<Image>();
            Sprite vsSprite = Resources.Load<Sprite>("UI/Multiplayer/vs_badge");
            Debug.Log("[BotRace] vs_badge loaded? " + (vsSprite != null));
            if (vsSprite != null)
            {
                img.sprite = vsSprite;
                img.preserveAspect = true;
                img.color = Color.white;
                img.raycastTarget = false;
            }
            else
            {
                img.sprite = UISpriteFactory.Create3DButtonSprite(new Color(1f, 0.80f, 0.20f), 128, 12);
                img.type = Image.Type.Sliced;
                img.color = Color.white;
                img.raycastTarget = false;

                var txtObj = new GameObject("Txt");
                txtObj.transform.SetParent(vs.transform, false);
                var txt = txtObj.AddComponent<Text>();
                txt.text = "VS";
                txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
                txt.fontSize = 48;
                txt.fontStyle = FontStyle.Bold;
                txt.color = new Color(0.15f, 0.10f, 0.05f);
                txt.alignment = TextAnchor.MiddleCenter;
                txt.raycastTarget = false;
                var trt = txtObj.GetComponent<RectTransform>();
                trt.anchorMin = Vector2.zero;
                trt.anchorMax = Vector2.one;
                trt.offsetMin = Vector2.zero;
                trt.offsetMax = Vector2.zero;
            }
        }

        private void BuildVSCircle(Transform parent, Vector2 pos)
        {
            // Outer dark ring
            var vsOuter = new GameObject("VSOuter");
            vsOuter.transform.SetParent(parent, false);
            var vsOuterImg = vsOuter.AddComponent<Image>();
            vsOuterImg.sprite = UISpriteFactory.Create3DSphereSprite(
                new Color(0.10f, 0.05f, 0.20f), 256);
            vsOuterImg.color = Color.white;
            vsOuterImg.raycastTarget = false;
            var vsORt = vsOuter.GetComponent<RectTransform>();
            vsORt.anchorMin = new Vector2(0.5f, 1f);
            vsORt.anchorMax = new Vector2(0.5f, 1f);
            vsORt.pivot = new Vector2(0.5f, 1f);
            vsORt.anchoredPosition = pos;
            vsORt.sizeDelta = new Vector2(100f, 100f);

            // Gold ring
            var vsBg = new GameObject("VSGold");
            vsBg.transform.SetParent(vsOuter.transform, false);
            var vsBgImg = vsBg.AddComponent<Image>();
            vsBgImg.sprite = UISpriteFactory.Create3DSphereSprite(
                new Color(1f, 0.85f, 0.30f), 256);
            vsBgImg.color = Color.white;
            vsBgImg.raycastTarget = false;
            var vsBgRt = vsBg.GetComponent<RectTransform>();
            vsBgRt.anchorMin = Vector2.zero;
            vsBgRt.anchorMax = Vector2.one;
            vsBgRt.offsetMin = Vector2.zero;
            vsBgRt.offsetMax = Vector2.zero;

            // Inner orange
            var vsInner = new GameObject("VSInner");
            vsInner.transform.SetParent(vsBg.transform, false);
            var vsInnerImg = vsInner.AddComponent<Image>();
            vsInnerImg.sprite = UISpriteFactory.Create3DSphereSprite(
                new Color(0.90f, 0.55f, 0.15f), 256);
            vsInnerImg.color = Color.white;
            vsInnerImg.raycastTarget = false;
            var vsIRt = vsInner.GetComponent<RectTransform>();
            vsIRt.anchorMin = Vector2.zero;
            vsIRt.anchorMax = Vector2.one;
            vsIRt.offsetMin = new Vector2(10f, 10f);
            vsIRt.offsetMax = new Vector2(-10f, -10f);

            // VS text
            var vsTxtObj = new GameObject("VSText");
            vsTxtObj.transform.SetParent(vsInner.transform, false);
            var vsTxt = vsTxtObj.AddComponent<Text>();
            vsTxt.text = "VS";
            vsTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            vsTxt.fontSize = 52;
            vsTxt.fontStyle = FontStyle.Bold;
            vsTxt.color = new Color(0.20f, 0.10f, 0.05f);
            vsTxt.alignment = TextAnchor.MiddleCenter;
            vsTxt.raycastTarget = false;
            var vsTrt = vsTxtObj.GetComponent<RectTransform>();
            vsTrt.anchorMin = Vector2.zero;
            vsTrt.anchorMax = Vector2.one;
            vsTrt.offsetMin = Vector2.zero;
            vsTrt.offsetMax = Vector2.zero;
        }

        private Text CreateSideLabel(Transform parent, Vector2 pos, string text, Color color, TextAnchor align)
        {
            var obj = new GameObject("Label_" + text);
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<Text>();
            txt.text = text;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 40;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = align;
            txt.raycastTarget = false;

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(300f, 60f);

            return txt;
        }

        private Image CreateSideProgressBar(Transform parent, Vector2 pos, Color color)
        {
            var bgObj = new GameObject("BarBg");
            bgObj.transform.SetParent(parent, false);
            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.15f, 0.08f, 0.25f, 0.8f);
            bgImg.raycastTarget = false;
            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.5f, 1f);
            bgRt.anchorMax = new Vector2(0.5f, 1f);
            bgRt.pivot = new Vector2(0.5f, 1f);
            bgRt.anchoredPosition = pos;
            bgRt.sizeDelta = new Vector2(260f, 14f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(bgObj.transform, false);
            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = color;
            fillImg.raycastTarget = false;
            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -4f);

            return fillImg;
        }

        private void CreateAvatar(Transform parent, Vector2 pos, Vector2 size, Color color, string icon)
        {
            // --- OUTER FRAME (dark ring) ---
            var frame = new GameObject("AvatarFrame");
            frame.transform.SetParent(parent, false);

            var frameImg = frame.AddComponent<Image>();
            frameImg.sprite = UISpriteFactory.Create3DSphereSprite(
                new Color(0.10f, 0.05f, 0.20f), 256);
            frameImg.color = Color.white;
            frameImg.raycastTarget = false;

            var frt = frame.GetComponent<RectTransform>();
            frt.anchorMin = new Vector2(0.5f, 1f);
            frt.anchorMax = new Vector2(0.5f, 1f);
            frt.pivot = new Vector2(0.5f, 1f);
            frt.anchoredPosition = pos;
            frt.sizeDelta = size;

            // --- GOLD BORDER RING ---
            var border = new GameObject("GoldBorder");
            border.transform.SetParent(frame.transform, false);

            var borderImg = border.AddComponent<Image>();
            borderImg.sprite = UISpriteFactory.Create3DSphereSprite(
                new Color(1f, 0.85f, 0.30f), 256);
            borderImg.color = Color.white;
            borderImg.raycastTarget = false;

            var brt = border.GetComponent<RectTransform>();
            brt.anchorMin = Vector2.zero;
            brt.anchorMax = Vector2.one;
            brt.offsetMin = Vector2.zero;
            brt.offsetMax = Vector2.zero;

            // --- INNER AVATAR CIRCLE ---
            var avatar = new GameObject("AvatarCircle");
            avatar.transform.SetParent(border.transform, false);

            var avImg = avatar.AddComponent<Image>();
            avImg.sprite = UISpriteFactory.Create3DSphereSprite(color, 256);
            avImg.color = Color.white;
            avImg.raycastTarget = false;

            var art = avatar.GetComponent<RectTransform>();
            art.anchorMin = Vector2.zero;
            art.anchorMax = Vector2.one;
            art.offsetMin = new Vector2(8f, 8f);   // frame ke andar
            art.offsetMax = new Vector2(-8f, -8f);

            // --- SHINE (top-left highlight) ---
            var shine = new GameObject("Shine");
            shine.transform.SetParent(avatar.transform, false);

            var shineImg = shine.AddComponent<Image>();
            shineImg.sprite = UISpriteFactory.Create3DSphereSprite(
                new Color(1f, 1f, 1f, 0.35f), 128);
            shineImg.color = Color.white;
            shineImg.raycastTarget = false;

            var srt = shine.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.15f, 0.55f);
            srt.anchorMax = new Vector2(0.45f, 0.85f);
            srt.offsetMin = Vector2.zero;
            srt.offsetMax = Vector2.zero;

            // --- ICON (center) ---
            var iconObj = new GameObject("Icon");
            iconObj.transform.SetParent(avatar.transform, false);

            var iconTxt = iconObj.AddComponent<Text>();
            iconTxt.text = icon;
            iconTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            iconTxt.fontSize = 48;
            iconTxt.fontStyle = FontStyle.Bold;
            iconTxt.color = Color.white;
            iconTxt.alignment = TextAnchor.MiddleCenter;
            iconTxt.raycastTarget = false;

            var irt = iconObj.GetComponent<RectTransform>();
            irt.anchorMin = Vector2.zero;
            irt.anchorMax = Vector2.one;
            irt.offsetMin = Vector2.zero;
            irt.offsetMax = Vector2.zero;
        }

        private Text CreateScoreText(Transform parent, string label, Vector2 pos, Color color)
        {
            var obj = new GameObject("Score");
            obj.transform.SetParent(parent, false);

            var txt = obj.AddComponent<Text>();
            txt.text = $"{label}: 0/{_totalWords}";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 28;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos + new Vector2(0f, 20f);
            rt.sizeDelta = new Vector2(280f, 60f);

            return txt;
        }

        private Image CreateProgressBar(Transform parent, Vector2 pos, Color color)
        {
            var bgObj = new GameObject("BarBg");
            bgObj.transform.SetParent(parent, false);

            var bgImg = bgObj.AddComponent<Image>();
            bgImg.color = new Color(0.20f, 0.12f, 0.35f);
            bgImg.raycastTarget = false;

            var bgRt = bgObj.GetComponent<RectTransform>();
            bgRt.anchorMin = new Vector2(0.5f, 0.5f);
            bgRt.anchorMax = new Vector2(0.5f, 0.5f);
            bgRt.pivot = new Vector2(0.5f, 0.5f);
            bgRt.anchoredPosition = pos;
            bgRt.sizeDelta = new Vector2(240f, 18f);

            var fillObj = new GameObject("Fill");
            fillObj.transform.SetParent(bgObj.transform, false);

            var fillImg = fillObj.AddComponent<Image>();
            fillImg.color = color;
            fillImg.raycastTarget = false;

            var fillRt = fillObj.GetComponent<RectTransform>();
            fillRt.anchorMin = new Vector2(0f, 0f);
            fillRt.anchorMax = new Vector2(0f, 1f);
            fillRt.pivot = new Vector2(0f, 0.5f);
            fillRt.anchoredPosition = new Vector2(2f, 0f);
            fillRt.sizeDelta = new Vector2(0f, -4f);

            return fillImg;
        }

        private void OnPlayerFoundWord(string word)
        {
            if (!IsActive) return;
            _playerFoundCount++;
            if (_bot != null)
                _bot.SetPlayerFoundCount(_playerFoundCount);
            if (_playerScoreText != null)
                _playerScoreText.text = $"YOU: {_playerFoundCount}/{_totalWords}";
            UpdateBar(_playerProgressFill, _playerFoundCount);

            // Player toast (green, left side)
            ShowToast(word, -370f, new Color(0.20f, 0.65f, 0.30f));

            CheckRaceEnd();
        }

        private void OnBotFoundWord(string word)
        {
            if (!IsActive || _bot == null) return;
            if (_botScoreText != null)
                _botScoreText.text = $"{_bot.Name}: {_bot.FoundWords}/{_totalWords}";
            UpdateBar(_botProgressFill, _bot.FoundWords);

            // Bot toast (orange, right side, below panel)
            ShowToast(word, 370f, new Color(0.85f, 0.35f, 0.20f));

            CheckRaceEnd();
        }

        /// <summary>
        /// Unified toast - player side (xPos negative) ya bot side (xPos positive).
        /// Position: VS panel ke thik neeche.
        /// </summary>
        private void ShowToast(string word, float xPos, Color color)
        {
            if (_canvas == null) return;

            var toast = new GameObject("WordToast");
            toast.transform.SetParent(_canvas.transform, false);

            var bg = toast.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(color, 128, 20);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = toast.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(xPos, -230f);   // panel ke thik neeche
            rt.sizeDelta = new Vector2(320f, 65f);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(toast.transform, false);

            var txt = textObj.AddComponent<Text>();
            txt.text = "+ " + word;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 38;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;

            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            StartCoroutine(FadeAndDestroy(toast, 1.6f));
        }

        private System.Collections.IEnumerator FadeAndDestroy(GameObject obj, float lifetime)
        {
            yield return new WaitForSeconds(lifetime * 0.66f);

            if (obj == null) yield break;

            var canvasGroup = obj.AddComponent<CanvasGroup>();
            float fadeTime = lifetime * 0.34f;
            float elapsed = 0f;

            while (elapsed < fadeTime)
            {
                elapsed += Time.deltaTime;
                canvasGroup.alpha = 1f - (elapsed / fadeTime);
                yield return null;
            }

            if (obj != null) Destroy(obj);
        }

        private void UpdateBar(Image fill, int count)
        {
            if (fill == null) return;
            float pct = Mathf.Clamp01((float)count / Mathf.Max(1, _totalWords));
            fill.rectTransform.sizeDelta = new Vector2(236f * pct, -4f);
        }

        private void CheckRaceEnd()
        {
            if (_bot == null) return;
            bool playerDone = _playerFoundCount >= _totalWords;
            bool botDone = _bot.FoundWords >= _totalWords;

            if (playerDone && botDone) EndRace("draw");
            else if (playerDone) EndRace("win");
            else if (botDone) EndRace("lose");
        }

        private void EndRace(string result)
        {
            IsActive = false;

            switch (result)
            {
                case "win":
                    Debug.Log("[BotRace] Player WON!");
                    if (Progress != null) Progress.AddCoins(50);
                    ShowResult("YOU WIN!", "+50 bonus coins",
                        new Color(0.25f, 0.75f, 0.35f));
                    break;
                case "lose":
                    Debug.Log("[BotRace] Bot won.");
                    ShowLoseScreen();
                    break;
                default:
                    Debug.Log("[BotRace] Draw.");
                    ShowResult("DRAW!", "Tie!",
                        new Color(0.85f, 0.75f, 0.30f));
                    break;
            }
        }

        private void ShowResult(string title, string subtitle, Color color)
        {
            if (_canvas == null) return;

            var panel = new GameObject("RaceResult");
            panel.transform.SetParent(_canvas.transform, false);

            var bg = panel.AddComponent<Image>();
            bg.color = new Color(color.r, color.g, color.b, 0.95f);

            var rt = panel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = Vector2.zero;
            rt.sizeDelta = new Vector2(700f, 350f);

            CreateText(panel.transform, title, new Vector2(0f, 60f), 65,
                Color.white, FontStyle.Bold);
            CreateText(panel.transform, subtitle, new Vector2(0f, -40f), 32,
                Color.white, FontStyle.Normal);

            Destroy(panel, 3f);
        }

        private void ShowLoseScreen()
        {
            if (_canvas == null) return;

            // Pause game
            Time.timeScale = 0f;

            var panel = new GameObject("LoseScreen");
            panel.transform.SetParent(_canvas.transform, false);

            var bg = panel.AddComponent<Image>();
            bg.color = new Color(0.15f, 0.05f, 0.10f, 0.98f);

            var rt = panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(panel.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = "YOU LOSE!";
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 90;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = new Color(0.95f, 0.35f, 0.35f);
            titleTxt.alignment = TextAnchor.MiddleCenter;
            var trt = titleObj.GetComponent<RectTransform>();
            trt.anchorMin = new Vector2(0.5f, 0.5f);
            trt.anchorMax = new Vector2(0.5f, 0.5f);
            trt.pivot = new Vector2(0.5f, 0.5f);
            trt.anchoredPosition = new Vector2(0f, 250f);
            trt.sizeDelta = new Vector2(800f, 150f);

            // Subtitle
            var subObj = new GameObject("Sub");
            subObj.transform.SetParent(panel.transform, false);
            var subTxt = subObj.AddComponent<Text>();
            subTxt.text = $"{_bot.Name} found all words first!";
            subTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            subTxt.fontSize = 36;
            subTxt.color = Color.white;
            subTxt.alignment = TextAnchor.MiddleCenter;
            var srt = subObj.GetComponent<RectTransform>();
            srt.anchorMin = new Vector2(0.5f, 0.5f);
            srt.anchorMax = new Vector2(0.5f, 0.5f);
            srt.pivot = new Vector2(0.5f, 0.5f);
            srt.anchoredPosition = new Vector2(0f, 130f);
            srt.sizeDelta = new Vector2(800f, 80f);

            // HOME button
            CreateResultButton(panel.transform, "HOME", new Vector2(0f, -50f),
                new Vector2(500f, 130f), new Color(0.25f, 0.45f, 0.85f), () =>
                {
                    Time.timeScale = 1f;
                    Destroy(panel);
                    HomeScreenUI.ForceShowHome();
                    var brm = FindFirstObjectByType<BotRaceMode>();
                    if (brm != null) Destroy(brm.gameObject);
                });

            // REPLAY button - scene reload karega
            CreateResultButton(panel.transform, "REPLAY", new Vector2(0f, -220f),
                new Vector2(500f, 130f), new Color(0.25f, 0.65f, 0.35f), () =>
                {
                    Time.timeScale = 1f;
                    PlayerPrefs.SetInt("SkipHome", 1);
                    PlayerPrefs.SetInt("ForceTestRace", 1);
                    PlayerPrefs.Save();
                    UnityEngine.SceneManagement.SceneManager.LoadScene(
                        UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
                });
        }

        private void CreateResultButton(Transform parent, string label, Vector2 pos,
            Vector2 size, Color color, System.Action onClick)
        {
            var obj = new GameObject("Btn_" + label);
            obj.transform.SetParent(parent, false);

            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(() => onClick());

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            var txtObj = new GameObject("Label");
            txtObj.transform.SetParent(obj.transform, false);
            var txt = txtObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 48;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            var trt = txtObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }

        private void CreateText(Transform parent, string content, Vector2 pos,
            int size, Color color, FontStyle style)
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
            rt.sizeDelta = new Vector2(600f, 100f);
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



































