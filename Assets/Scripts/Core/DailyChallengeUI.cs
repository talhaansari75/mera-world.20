using System;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace MeraWorld.Core
{
    public class DailyChallengeUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private Text _timerText;
        private Text _statusText;
        private Button _playButton;

        private const string KEY_LAST_CHALLENGE = "DailyChallenge_LastDate";
        private const string KEY_CHALLENGE_STREAK = "DailyChallenge_Streak";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;

            Invoke(nameof(Setup), 0.6f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildCard();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("DailyChallengeCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 502;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildCard()
        {
            var cardObj = new GameObject("DailyChallengeCard");
            cardObj.transform.SetParent(_canvas.transform, false);

            var bg = cardObj.AddComponent<Image>();
            bg.color = new Color(0.55f, 0.20f, 0.55f, 0.95f);

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = new Vector2(0f, -130f);
            rt.sizeDelta = new Vector2(900f, 150f);

            // Title
            var titleObj = new GameObject("Title");
            titleObj.transform.SetParent(cardObj.transform, false);
            var titleTxt = titleObj.AddComponent<Text>();
            titleTxt.text = "DAILY CHALLENGE";
            titleTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            titleTxt.fontSize = 32;
            titleTxt.fontStyle = FontStyle.Bold;
            titleTxt.color = new Color(1f, 0.90f, 0.55f);
            titleTxt.alignment = TextAnchor.MiddleLeft;
            titleTxt.raycastTarget = false;
            var titleRt = titleObj.GetComponent<RectTransform>();
            titleRt.anchorMin = new Vector2(0f, 1f);
            titleRt.anchorMax = new Vector2(1f, 1f);
            titleRt.pivot = new Vector2(0f, 1f);
            titleRt.anchoredPosition = new Vector2(30f, -15f);
            titleRt.sizeDelta = new Vector2(-250f, 40f);

            // Timer
            var timerObj = new GameObject("Timer");
            timerObj.transform.SetParent(cardObj.transform, false);
            _timerText = timerObj.AddComponent<Text>();
            _timerText.text = "Resets in 24:00:00";
            _timerText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _timerText.fontSize = 24;
            _timerText.color = new Color(0.85f, 0.85f, 1f);
            _timerText.alignment = TextAnchor.MiddleLeft;
            _timerText.raycastTarget = false;
            var timerRt = timerObj.GetComponent<RectTransform>();
            timerRt.anchorMin = new Vector2(0f, 0.5f);
            timerRt.anchorMax = new Vector2(1f, 0.5f);
            timerRt.pivot = new Vector2(0f, 0.5f);
            timerRt.anchoredPosition = new Vector2(30f, 5f);
            timerRt.sizeDelta = new Vector2(-250f, 35f);

            // Status
            var statusObj = new GameObject("Status");
            statusObj.transform.SetParent(cardObj.transform, false);
            _statusText = statusObj.AddComponent<Text>();
            _statusText.text = "Ready!  •  +500 coins";
            _statusText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            _statusText.fontSize = 22;
            _statusText.fontStyle = FontStyle.Bold;
            _statusText.color = new Color(0.65f, 1f, 0.65f);
            _statusText.alignment = TextAnchor.MiddleLeft;
            _statusText.raycastTarget = false;
            var statusRt = statusObj.GetComponent<RectTransform>();
            statusRt.anchorMin = new Vector2(0f, 0f);
            statusRt.anchorMax = new Vector2(1f, 0f);
            statusRt.pivot = new Vector2(0f, 0f);
            statusRt.anchoredPosition = new Vector2(30f, 15f);
            statusRt.sizeDelta = new Vector2(-250f, 35f);

            // Play button
            var btnObj = new GameObject("PlayBtn");
            btnObj.transform.SetParent(cardObj.transform, false);

            var btnImg = btnObj.AddComponent<Image>();
            btnImg.color = new Color(0.25f, 0.75f, 0.35f);

            _playButton = btnObj.AddComponent<Button>();
            _playButton.onClick.AddListener(OnPlayClicked);

            var btnRt = btnObj.GetComponent<RectTransform>();
            btnRt.anchorMin = new Vector2(1f, 0.5f);
            btnRt.anchorMax = new Vector2(1f, 0.5f);
            btnRt.pivot = new Vector2(1f, 0.5f);
            btnRt.anchoredPosition = new Vector2(-25f, 0f);
            btnRt.sizeDelta = new Vector2(180f, 100f);

            var btnLabelObj = new GameObject("Label");
            btnLabelObj.transform.SetParent(btnObj.transform, false);
            var btnLabel = btnLabelObj.AddComponent<Text>();
            btnLabel.text = "PLAY";
            btnLabel.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            btnLabel.fontSize = 32;
            btnLabel.fontStyle = FontStyle.Bold;
            btnLabel.color = Color.white;
            btnLabel.alignment = TextAnchor.MiddleCenter;
            btnLabel.raycastTarget = false;
            var btnLabelRt = btnLabelObj.GetComponent<RectTransform>();
            btnLabelRt.anchorMin = Vector2.zero;
            btnLabelRt.anchorMax = Vector2.one;
            btnLabelRt.offsetMin = Vector2.zero;
            btnLabelRt.offsetMax = Vector2.zero;

            UpdateStatus();
        }

        void Update()
        {
            if (_timerText == null) return;

            DateTime now = DateTime.UtcNow;
            DateTime midnight = now.Date.AddDays(1);
            TimeSpan remaining = midnight - now;

            _timerText.text = $"Resets in {remaining.Hours:D2}:{remaining.Minutes:D2}:{remaining.Seconds:D2}";
        }

        private void UpdateStatus()
        {
            if (CanPlayToday())
            {
                _statusText.text = "Ready!  •  +500 coins";
                _playButton.interactable = true;
                _playButton.GetComponent<Image>().color = new Color(0.25f, 0.75f, 0.35f);
            }
            else
            {
                int streak = PlayerPrefs.GetInt(KEY_CHALLENGE_STREAK, 0);
                _statusText.text = $"Completed today  •  Streak: {streak} days";
                _playButton.interactable = false;
                _playButton.GetComponent<Image>().color = new Color(0.4f, 0.4f, 0.4f);
            }
        }

        private bool CanPlayToday()
        {
            string lastDate = PlayerPrefs.GetString(KEY_LAST_CHALLENGE, "");
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            return lastDate != today;
        }

        private void OnPlayClicked()
        {
            if (!CanPlayToday()) return;

            if (Sound != null) Sound.PlayButtonClick();

            // Mark as completed
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            PlayerPrefs.SetString(KEY_LAST_CHALLENGE, today);

            int streak = PlayerPrefs.GetInt(KEY_CHALLENGE_STREAK, 0);

            string yesterday = DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd");
            string lastDate = PlayerPrefs.GetString(KEY_LAST_CHALLENGE, "");

            // If last played was yesterday, keep streak; else reset
            if (lastDate == yesterday) streak++;
            else streak = 1;

            PlayerPrefs.SetInt(KEY_CHALLENGE_STREAK, streak);
            PlayerPrefs.Save();

            if (Progress != null)
            {
                Progress.AddCoins(500);
                Progress.AddStars(1);
            }

            Debug.Log($"[DailyChallenge] Played! Streak: {streak}, +500 coins");

            UpdateStatus();

            // Start level
            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.SetInt("CurrentLevel", 1);
            PlayerPrefs.Save();

            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }
    }
}