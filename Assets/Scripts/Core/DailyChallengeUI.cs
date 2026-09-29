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
        private GameObject _panel;

        private const string KEY_LAST_CHALLENGE = "DailyChallenge_LastDate";
        private const string KEY_CHALLENGE_STREAK = "DailyChallenge_Streak";
        private const string KEY_POPUP_SHOWN_DATE = "DailyChallenge_PopupShown";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;

            Invoke(nameof(Setup), 1.5f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
            TryShowPopup();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("DailyChallengeCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 520;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();

            if (UnityEngine.EventSystems.EventSystem.current == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            }
        }

        private void BuildPanel()
        {
            _panel = new GameObject("DailyChallengePanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.88f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            // Card
            var cardObj = new GameObject("Card");
            cardObj.transform.SetParent(_panel.transform, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.color = new Color(0.55f, 0.20f, 0.55f);

            var cardRt = cardObj.GetComponent<RectTransform>();
            cardRt.anchorMin = new Vector2(0.5f, 0.5f);
            cardRt.anchorMax = new Vector2(0.5f, 0.5f);
            cardRt.pivot = new Vector2(0.5f, 0.5f);
            cardRt.anchoredPosition = Vector2.zero;
            cardRt.sizeDelta = new Vector2(900f, 700f);

            CreateText(cardObj.transform, "DAILY CHALLENGE", new Vector2(0f, 250f), 70,
                new Color(1f, 0.90f, 0.55f), FontStyle.Bold);

            CreateText(cardObj.transform, "Complete today's challenge\nand earn 500 coins + 1 star!",
                new Vector2(0f, 100f), 36, Color.white, FontStyle.Normal);

            CreateText(cardObj.transform, GetTimerText(), new Vector2(0f, 0f), 28,
                new Color(0.90f, 0.90f, 1f), FontStyle.Normal);

            CreateButton(cardObj.transform, "PLAY NOW", new Vector2(0f, -160f),
                new Vector2(500f, 130f), new Color(0.25f, 0.75f, 0.35f), OnPlayClicked);

            CreateButton(cardObj.transform, "LATER", new Vector2(0f, -310f),
                new Vector2(500f, 100f), new Color(0.4f, 0.4f, 0.5f), OnDismiss);

            _panel.SetActive(false);
        }

        private string GetTimerText()
        {
            DateTime now = DateTime.UtcNow;
            DateTime midnight = now.Date.AddDays(1);
            TimeSpan remaining = midnight - now;
            return $"Resets in {remaining.Hours:D2}:{remaining.Minutes:D2}:{remaining.Seconds:D2}";
        }

        private void TryShowPopup()
        {
            if (!HomeScreenUI.IsHomeVisible) return;
            if (!CanPlayToday()) return;

            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            string lastShown = PlayerPrefs.GetString(KEY_POPUP_SHOWN_DATE, "");
            if (lastShown == today) return;

            _panel.SetActive(true);

            PlayerPrefs.SetString(KEY_POPUP_SHOWN_DATE, today);
            PlayerPrefs.Save();
        }

        private bool CanPlayToday()
        {
            string lastDate = PlayerPrefs.GetString(KEY_LAST_CHALLENGE, "");
            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            return lastDate != today;
        }

        private void OnPlayClicked()
        {
            if (Sound != null) Sound.PlayButtonClick();

            string today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            PlayerPrefs.SetString(KEY_LAST_CHALLENGE, today);

            int streak = PlayerPrefs.GetInt(KEY_CHALLENGE_STREAK, 0);

            string yesterday = DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd");
            string lastDate = PlayerPrefs.GetString(KEY_LAST_CHALLENGE, "");

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

            _panel.SetActive(false);

            PlayerPrefs.SetInt("SkipHome", 1);
            PlayerPrefs.SetInt("CurrentLevel", 1);
            PlayerPrefs.Save();

            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }

        private void OnDismiss()
        {
            _panel.SetActive(false);
        }

        private Text CreateText(Transform parent, string content, Vector2 pos, int size, Color color, FontStyle style)
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
            txt.supportRichText = true;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(800f, 200f);
            return txt;
        }

        private void CreateButton(Transform parent, string label, Vector2 pos, Vector2 size, Color color, UnityEngine.Events.UnityAction onClick)
        {
            var obj = new GameObject($"Btn_{label}");
            obj.transform.SetParent(parent, false);
            var img = obj.AddComponent<Image>();
            img.color = color;
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
            txt.fontSize = 40;
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