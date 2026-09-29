using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class BotRaceMode : MonoBehaviour
    {
        public static bool IsActive { get; private set; } = false;

        [Header("References")]
        public GameManager GameManager;
        public SelectionManager SelectionManager;
        public PlayerProgressManager Progress;

        private BotOpponent _bot;
        private Canvas _canvas;
        private GameObject _racePanel;
        private Text _playerScoreText;
        private Text _botScoreText;
        private Text _botNameText;
        private Image _playerProgressFill;
        private Image _botProgressFill;
        private int _playerFoundCount = 0;
        private int _totalWords = 8;

        private static readonly string[] BotNames = {
            "Alex", "Sam", "Riley", "Jordan", "Casey", "Morgan",
            "Taylor", "Aiden", "Emma", "Liam", "Maya", "Noah",
            "Zara", "Owen", "Aisha", "Rayan", "Hina", "Bilal"
        };

        void Start()
        {
            if (GameManager == null) GameManager = FindFirstObjectByType<GameManager>();
            if (SelectionManager == null) SelectionManager = FindFirstObjectByType<SelectionManager>();
            if (Progress == null) Progress = PlayerProgressManager.Instance;

            Invoke(nameof(Setup), 1.2f);
        }

        private void Setup()
        {
            if (GameManager == null || SelectionManager == null) return;

            // Check if bot race should be active this level
            int level = GameManager.CurrentLevel;
            bool raceEnabled = PlayerPrefs.GetInt("BotRace_Enabled", 0) == 1;

            if (!raceEnabled)
            {
                // Random 30% chance per level
                raceEnabled = Random.Range(0, 100) < 30;
            }

            if (!raceEnabled) return;

            IsActive = true;
            _totalWords = GameManager.Words.Count;

            // Create bot with level-scaled difficulty
            float difficultyMult = Mathf.Lerp(1.3f, 0.6f, Mathf.Clamp01(level / 50f));
            string botName = BotNames[Random.Range(0, BotNames.Length)];
            _bot = new BotOpponent(botName, GameManager.Words, difficultyMult);
            _bot.OnWordFound += OnBotFoundWord;

            BuildCanvas();
            BuildRacePanel();

            SelectionManager.OnWordFound += OnPlayerFoundWord;

            Debug.Log($"[BotRace] Started against {botName} (difficulty {difficultyMult:F2})");
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("BotRaceCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 58;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildRacePanel()
        {
            _racePanel = new GameObject("RacePanel");
            _racePanel.transform.SetParent(_canvas.transform, false);

            var bg = _racePanel.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.10f, 0.15f, 0.28f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = _racePanel.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -270f);
            rt.sizeDelta = new Vector2(900f, 130f);

            // Player side (left)
            _playerScoreText = CreateScore(_racePanel.transform, "YOU", new Vector2(-320f, 0f), new Color(0.30f, 0.75f, 0.40f));
            _playerProgressFill = CreateProgressBar(_racePanel.transform, new Vector2(-160f, -35f), new Color(0.30f, 0.75f, 0.40f));

            // VS divider
            var vsObj = new GameObject("VS");
            vsObj.transform.SetParent(_racePanel.transform, false);
            var vsTxt = vsObj.AddComponent<Text>();
            vsTxt.text = "VS";
            vsTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            vsTxt.fontSize = 36;
            vsTxt.fontStyle = FontStyle.Bold;
            vsTxt.color = new Color(1f, 0.85f, 0.30f);
            vsTxt.alignment = TextAnchor.MiddleCenter;
            vsTxt.raycastTarget = false;
            var vsRt = vsObj.GetComponent<RectTransform>();
            vsRt.anchorMin = new Vector2(0.5f, 0.5f);
            vsRt.anchorMax = new Vector2(0.5f, 0.5f);
            vsRt.pivot = new Vector2(0.5f, 0.5f);
            vsRt.anchoredPosition = Vector2.zero;
            vsRt.sizeDelta = new Vector2(80f, 60f);

            // Bot side (right)
            _botNameText = CreateScore(_racePanel.transform, _bot.Name, new Vector2(320f, 0f), new Color(0.90f, 0.45f, 0.30f));
            _botProgressFill = CreateProgressBar(_racePanel.transform, new Vector2(160f, -35f), new Color(0.90f, 0.45f, 0.30f));
        }

        private Text CreateScore(Transform parent, string label, Vector2 pos, Color color)
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
            bgImg.color = new Color(0.15f, 0.18f, 0.28f);
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

            if (_playerScoreText != null)
                _playerScoreText.text = $"YOU: {_playerFoundCount}/{_totalWords}";

            UpdateBar(_playerProgressFill, _playerFoundCount);
            CheckRaceEnd();
        }

        private void OnBotFoundWord(string word)
        {
            if (_botScoreText != null && _bot != null)
                _botScoreText.text = $"{_bot.Name}: {_bot.FoundWords}/{_totalWords}";

            UpdateBar(_botProgressFill, _bot.FoundWords);
            CheckRaceEnd();
        }

        private void UpdateBar(Image fill, int count)
        {
            if (fill == null) return;
            float pct = (float)count / _totalWords;
            fill.rectTransform.sizeDelta = new Vector2(236f * pct, -4f);
        }

        private void CheckRaceEnd()
        {
            if (_playerFoundCount >= _totalWords && _bot.FoundWords >= _totalWords) EndRace("draw");
            else if (_playerFoundCount >= _totalWords) EndRace("win");
            else if (_bot.FoundWords >= _totalWords) EndRace("lose");
        }

        private void EndRace(string result)
        {
            IsActive = false;

            if (result == "win")
            {
                Debug.Log("[BotRace] Player WON!");
                if (Progress != null) Progress.AddCoins(50);
                ShowResult("YOU WIN!", "+50 bonus coins", new Color(0.25f, 0.75f, 0.35f));
            }
            else if (result == "lose")
            {
                Debug.Log("[BotRace] Bot won");
                ShowResult($"{_bot.Name} WINS!", "Better luck next time!", new Color(0.85f, 0.35f, 0.35f));
            }
            else
            {
                Debug.Log("[BotRace] Draw");
                ShowResult("DRAW!", "Tie!", new Color(0.85f, 0.75f, 0.30f));
            }
        }

        private void ShowResult(string title, string subtitle, Color color)
        {
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

            CreateText(panel.transform, title, new Vector2(0f, 60f), 65, Color.white, FontStyle.Bold);
            CreateText(panel.transform, subtitle, new Vector2(0f, -40f), 32, Color.white, FontStyle.Normal);

            Destroy(panel, 3f);
        }

        private void CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style)
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
        }
    }
}