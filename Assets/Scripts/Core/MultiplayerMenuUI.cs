using System.Collections;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class MultiplayerMenuUI : MonoBehaviour
    {
        private Canvas _canvas;
        private GameObject _panel;
        private Text _statusText;
        private Text _timerText;
        private Button _findMatchButton;
        private GameObject _searchingPanel;
        private bool _isOnline = false;

        void Start()
        {
            Invoke(nameof(Setup), 1f);
        }

        private void OnEnable()
        {
            InternetChecker.OnStatusChanged += HandleOnlineStatusChanged;
        }

        private void OnDisable()
        {
            InternetChecker.OnStatusChanged -= HandleOnlineStatusChanged;
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
            RefreshOnlineState();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("MultiplayerCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 755;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("MultiplayerPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.sprite = Resources.Load<Sprite>("UI/HomeScreen/Backgrounds/bg_space"); bg.color = new Color(1f, 1f, 1f, 0.92f); bg.type = Image.Type.Simple;

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Title
            CreateText(_panel.transform, "ONLINE MULTIPLAYER", new Vector2(0f, 830f),
                60, new Color(1f, 0.85f, 0.30f), FontStyle.Bold);

            // Back button
            CreateSmallButton(_panel.transform, "< BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Status text
            _statusText = CreateText(_panel.transform, "", new Vector2(0f, 700f),
                30, new Color(0.85f, 0.85f, 0.95f), FontStyle.Normal);

            // Info
            CreateText(_panel.transform,
                "Race against players worldwide.\nNo real player? A bot will join after 5 seconds.",
                new Vector2(0f, 400f), 26, new Color(0.75f, 0.80f, 0.95f), FontStyle.Normal);

            // Find Match button
            _findMatchButton = CreateBigButton(_panel.transform, "FIND MATCH",
                new Vector2(0f, 100f), new Vector2(700f, 180f),
                new Color(0.55f, 0.25f, 0.85f), 55, OnFindMatchClicked);

            // === TEST BUTTON (DEV ONLY) ===
            CreateBigButton(_panel.transform, "TEST BOT RACE (DEV)",
                new Vector2(0f, -150f), new Vector2(700f, 120f),
                new Color(0.85f, 0.30f, 0.30f), 32, OnTestBotRaceClicked);

            // Searching panel (hidden)
            BuildSearchingPanel();

            _panel.SetActive(false);
        }

        private void BuildSearchingPanel()
        {
            _searchingPanel = new GameObject("SearchingPanel");
            _searchingPanel.transform.SetParent(_panel.transform, false);
            var spRt = _searchingPanel.AddComponent<RectTransform>();
            spRt.anchorMin = new Vector2(0.5f, 0.5f);
            spRt.anchorMax = new Vector2(0.5f, 0.5f);
            spRt.pivot = new Vector2(0.5f, 0.5f);
            spRt.anchoredPosition = new Vector2(0f, 100f);
            spRt.sizeDelta = new Vector2(700f, 300f);

            var bg = _searchingPanel.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.20f, 0.35f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            CreateText(_searchingPanel.transform, "SEARCHING...", new Vector2(0f, 70f),
                48, new Color(1f, 0.90f, 0.40f), FontStyle.Bold);

            _timerText = CreateText(_searchingPanel.transform, "5s", new Vector2(0f, 0f),
                40, Color.white, FontStyle.Bold);

            CreateText(_searchingPanel.transform, "Looking for a real player...",
                new Vector2(0f, -70f), 22, new Color(0.80f, 0.85f, 1f), FontStyle.Normal);

            _searchingPanel.SetActive(false);
        }

        private void RefreshOnlineState()
        {
            _isOnline = InternetChecker.QuickCheck();

            if (!_isOnline)
            {
                if (_statusText != null)
                    _statusText.text = "You are OFFLINE.\nMultiplayer requires internet.";

                if (_findMatchButton != null)
                {
                    _findMatchButton.interactable = false;
                    var img = _findMatchButton.GetComponent<Image>();
                    if (img != null)
                    {
                        img.sprite = UISpriteFactory.Create3DButtonSprite(
                            new Color(0.30f, 0.30f, 0.35f), 256, 40);
                        img.type = Image.Type.Sliced;
                    }
                }
            }
            else
            {
                if (_statusText != null)
                    _statusText.text = "You are ONLINE.";

                if (_findMatchButton != null)
                {
                    _findMatchButton.interactable = true;
                    var img = _findMatchButton.GetComponent<Image>();
                    if (img != null)
                    {
                        img.sprite = UISpriteFactory.Create3DButtonSprite(
                            new Color(0.55f, 0.25f, 0.85f), 256, 40);
                        img.type = Image.Type.Sliced;
                    }
                }
            }

            // Real HTTP verify in background
            StartCoroutine(VerifyInBackground());
        }

        private IEnumerator VerifyInBackground()
        {
            yield return InternetChecker.VerifyConnection();
            bool online = InternetChecker.IsOnline;

            if (_statusText != null)
                _statusText.text = online
                    ? "You are ONLINE."
                    : "You are OFFLINE.\nMultiplayer requires internet.";

            if (_findMatchButton != null)
                _findMatchButton.interactable = online;

            _isOnline = online;
        }

        private void HandleOnlineStatusChanged(bool online)
        {
            _isOnline = online;
        }

        private void OnFindMatchClicked()
        {
            if (!InternetChecker.QuickCheck())
            {
                if (_statusText != null)
                    _statusText.text = "You are OFFLINE.\nMultiplayer requires internet.";
                return;
            }

            StartCoroutine(FindMatchRoutine());
        }

        private IEnumerator FindMatchRoutine()
        {
            // Ensure matchmaking manager exists
            if (MatchmakingManager.Instance == null)
            {
                var go = new GameObject("MatchmakingManager");
                go.AddComponent<MatchmakingManager>();
            }

            _findMatchButton.gameObject.SetActive(false);
            _searchingPanel.SetActive(true);

            bool done = false;
            MatchmakingManager.MatchResult result = null;
            string errorMsg = null;

            System.Action<MatchmakingManager.MatchResult> onFound = (r) =>
            {
                result = r;
                done = true;
            };
            System.Action<string> onFail = (e) =>
            {
                errorMsg = e;
                done = true;
            };
            System.Action<float> onTick = UpdateTimer;

            MatchmakingManager.Instance.OnMatchFound += onFound;
            MatchmakingManager.Instance.OnMatchmakingFailed += onFail;
            MatchmakingManager.Instance.OnSearchTick += onTick;

            MatchmakingManager.Instance.StartMatchmaking();

            while (!done)
                yield return null;

            // Unsubscribe
            MatchmakingManager.Instance.OnMatchFound -= onFound;
            MatchmakingManager.Instance.OnMatchmakingFailed -= onFail;
            MatchmakingManager.Instance.OnSearchTick -= onTick;

            _searchingPanel.SetActive(false);
            _findMatchButton.gameObject.SetActive(true);

            if (errorMsg != null)
            {
                if (_statusText != null) _statusText.text = errorMsg;
                yield break;
            }

            if (result != null)
            {
                Debug.Log($"[Multiplayer] Match found: {result.OpponentName} (bot: {result.IsBot})");

                PlayerPrefs.SetString("BotRace_OpponentName", result.OpponentName);
                PlayerPrefs.SetInt("BotRace_Enabled", 1);
                PlayerPrefs.Save();

                if (_statusText != null)
                    _statusText.text = $"Matched with {result.OpponentName}! Starting...";

                yield return new WaitForSeconds(1.2f);

                Hide();
                StartBotRace();
            }
        }

        private void OnTestBotRaceClicked()
        {
            Debug.Log("[TEST] Test mode - reload scene with cream theme");

            // TestMode enable
            TestModeTheme.Enable();

            // HIDE this menu before reload
            Hide();

            // Flags
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.SetInt("ForceTestRace", 1);
            PlayerPrefs.Save();

            // Scene reload
            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        private void UpdateTimer(float remaining)
        {
            if (_timerText != null)
                _timerText.text = $"{Mathf.CeilToInt(remaining)}s";
        }

        private void StartBotRace()
        {
            var progress = PlayerProgressManager.Instance;
            int level = progress != null ? progress.HighestLevelUnlocked : 1;

            if (progress != null) progress.SetCurrentLevel(level);
            else
            {
                PlayerPrefs.SetInt("CurrentLevel", level);
                PlayerPrefs.Save();
            }

            // SkipHome flag set karo - HomeScreenUI isko read karega
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.Save();

            Debug.Log("[Multiplayer] Loading scene with SkipHome=1");

            UnityEngine.SceneManagement.SceneManager.LoadScene(
                UnityEngine.SceneManagement.SceneManager.GetActiveScene().buildIndex);
        }

        public void Show()
        {
            if (_panel != null) _panel.SetActive(true);
            RefreshOnlineState();
        }

        public void Hide()
        {
            if (_panel != null) _panel.SetActive(false);
            if (MatchmakingManager.Instance != null)
                MatchmakingManager.Instance.CancelMatchmaking();
        }

        private void OnBack() { Hide(); }

        // --- UI helpers ---

        private Text CreateText(Transform parent, string content, Vector2 pos, int size,
            Color color, FontStyle style)
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
            rt.sizeDelta = new Vector2(900f, 100f);
            return txt;
        }

        private Button CreateBigButton(Transform parent, string label, Vector2 pos, Vector2 size,
            Color color, int fontSize, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            img.type = Image.Type.Sliced;
            img.color = Color.white;

            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);

            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = size;

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = fontSize;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;

            return btn;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos,
            Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.sprite = UISpriteFactory.Create3DButtonSprite(color, 128, 30);
            img.type = Image.Type.Sliced;
            img.color = Color.white;
            var btn = obj.AddComponent<Button>();
            btn.onClick.AddListener(onClick);
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(220f, 80f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(obj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = label;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 32;
            txt.fontStyle = FontStyle.Bold;
            txt.color = Color.white;
            txt.alignment = TextAnchor.MiddleCenter;
            txt.raycastTarget = false;
            var trt = textObj.GetComponent<RectTransform>();
            trt.anchorMin = Vector2.zero;
            trt.anchorMax = Vector2.one;
            trt.offsetMin = Vector2.zero;
            trt.offsetMax = Vector2.zero;
        }
    }
}

