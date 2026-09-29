using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class DailyRewardUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public SoundManager Sound;

        private Canvas _canvas;
        private GameObject _panel;
        private bool _built = false;

        private const string KEY_LAST_CLAIM = "Daily_LastClaim";
        private const string KEY_STREAK = "Daily_Streak";

        private static readonly int[] Rewards = { 50, 75, 100, 150, 200, 300, 500 };
        private static readonly string[] DayNames = { "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7" };

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (Sound == null) Sound = SoundManager.Instance;

            Invoke(nameof(Setup), 0.8f);
        }

        private void Setup()
        {
            if (_built) return;
            _built = true;

            BuildCanvas();
            BuildPanel();
            CheckAndShow();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("DailyRewardCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 700;

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
            _panel = new GameObject("DailyRewardPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0f, 0f, 0f, 0.88f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            var cardObj = new GameObject("Card");
            cardObj.transform.SetParent(_panel.transform, false);

            var cardImg = cardObj.AddComponent<Image>();
            cardImg.color = new Color(0.10f, 0.16f, 0.32f, 1f);

            var cardRt = cardObj.GetComponent<RectTransform>();
            cardRt.anchorMin = new Vector2(0.5f, 0.5f);
            cardRt.anchorMax = new Vector2(0.5f, 0.5f);
            cardRt.pivot = new Vector2(0.5f, 0.5f);
            cardRt.anchoredPosition = Vector2.zero;
            cardRt.sizeDelta = new Vector2(880f, 1400f);

            CreateText(cardObj.transform, "DAILY REWARDS", new Vector2(0f, 600f), 65,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateText(cardObj.transform, "Come back every day for bigger rewards!",
                new Vector2(0f, 520f), 32, new Color(0.75f, 0.85f, 1f), FontStyle.Normal);

            int currentStreak = PlayerPrefs.GetInt(KEY_STREAK, 0);
            bool canClaim = CanClaimToday();

            for (int i = 0; i < 4; i++)
            {
                bool claimed = i < currentStreak;
                bool isToday = (i == currentStreak && canClaim);
                CreateDayCard(cardObj.transform, i, DayNames[i], Rewards[i],
                    new Vector2(-300f + i * 200f, 320f), claimed, isToday);
            }

            for (int i = 4; i < 7; i++)
            {
                bool claimed = i < currentStreak;
                bool isToday = (i == currentStreak && canClaim);
                CreateDayCard(cardObj.transform, i, DayNames[i], Rewards[i],
                    new Vector2(-150f + (i - 4) * 200f, 100f), claimed, isToday);
            }

            if (canClaim)
            {
                CreateClaimButton(cardObj.transform, currentStreak);
            }
            else
            {
                CreateText(cardObj.transform, "Come back tomorrow!",
                    new Vector2(0f, -200f), 40, new Color(0.7f, 0.7f, 0.8f), FontStyle.Italic);
            }

            CreateButton(cardObj.transform, "CLOSE", new Vector2(0f, -500f),
                new Vector2(300f, 90f), new Color(0.4f, 0.4f, 0.5f), OnClose);

            _panel.SetActive(false);
        }

        private void CreateDayCard(Transform parent, int index, string dayLabel, int coinAmount,
            Vector2 pos, bool claimed, bool isToday)
        {
            var cardObj = new GameObject($"Day_{index}");
            cardObj.transform.SetParent(parent, false);

            var img = cardObj.AddComponent<Image>();

            if (claimed) img.color = new Color(0.20f, 0.55f, 0.25f);
            else if (isToday) img.color = new Color(1f, 0.75f, 0.20f);
            else img.color = new Color(0.25f, 0.30f, 0.40f);

            var rt = cardObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(170f, 180f);

            var dayObj = new GameObject("Day");
            dayObj.transform.SetParent(cardObj.transform, false);
            var dayTxt = dayObj.AddComponent<Text>();
            dayTxt.text = dayLabel;
            dayTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            dayTxt.fontSize = 26;
            dayTxt.fontStyle = FontStyle.Bold;
            dayTxt.color = Color.white;
            dayTxt.alignment = TextAnchor.MiddleCenter;
            dayTxt.raycastTarget = false;

            var dayRt = dayObj.GetComponent<RectTransform>();
            dayRt.anchorMin = new Vector2(0f, 1f);
            dayRt.anchorMax = new Vector2(1f, 1f);
            dayRt.pivot = new Vector2(0.5f, 1f);
            dayRt.anchoredPosition = new Vector2(0f, -10f);
            dayRt.sizeDelta = new Vector2(0f, 35f);

            var amtObj = new GameObject("Amount");
            amtObj.transform.SetParent(cardObj.transform, false);
            var amtTxt = amtObj.AddComponent<Text>();
            amtTxt.text = claimed ? "OK" : coinAmount.ToString();
            amtTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            amtTxt.fontSize = 55;
            amtTxt.fontStyle = FontStyle.Bold;
            amtTxt.color = Color.white;
            amtTxt.alignment = TextAnchor.MiddleCenter;
            amtTxt.raycastTarget = false;

            var amtRt = amtObj.GetComponent<RectTransform>();
            amtRt.anchorMin = Vector2.zero;
            amtRt.anchorMax = Vector2.one;
            amtRt.offsetMin = Vector2.zero;
            amtRt.offsetMax = Vector2.zero;

            var labelObj = new GameObject("Label");
            labelObj.transform.SetParent(cardObj.transform, false);
            var lblTxt = labelObj.AddComponent<Text>();
            lblTxt.text = "coins";
            lblTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            lblTxt.fontSize = 20;
            lblTxt.color = new Color(1f, 1f, 1f, 0.75f);
            lblTxt.alignment = TextAnchor.MiddleCenter;
            lblTxt.raycastTarget = false;

            var lblRt = labelObj.GetComponent<RectTransform>();
            lblRt.anchorMin = new Vector2(0f, 0f);
            lblRt.anchorMax = new Vector2(1f, 0f);
            lblRt.pivot = new Vector2(0.5f, 0f);
            lblRt.anchoredPosition = new Vector2(0f, 8f);
            lblRt.sizeDelta = new Vector2(0f, 25f);
        }

        private void CreateClaimButton(Transform parent, int dayIndex)
        {
            int amount = Rewards[Mathf.Clamp(dayIndex, 0, Rewards.Length - 1)];

            var btnObj = new GameObject("ClaimButton");
            btnObj.transform.SetParent(parent, false);

            var img = btnObj.AddComponent<Image>();
            img.color = new Color(0.25f, 0.70f, 0.35f);

            var btn = btnObj.AddComponent<Button>();
            btn.onClick.AddListener(OnClaim);

            var rt = btnObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, -200f);
            rt.sizeDelta = new Vector2(600f, 130f);

            var textObj = new GameObject("Label");
            textObj.transform.SetParent(btnObj.transform, false);
            var txt = textObj.AddComponent<Text>();
            txt.text = $"CLAIM {amount} COINS";
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = 48;
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

        private bool CanClaimToday()
        {
            string lastClaimStr = PlayerPrefs.GetString(KEY_LAST_CLAIM, "");
            if (string.IsNullOrEmpty(lastClaimStr)) return true;

            long lastClaim;
            if (!long.TryParse(lastClaimStr, out lastClaim)) return true;

            long now = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            long daysSince = (now - lastClaim) / 86400;

            return daysSince >= 1;
        }

        private void OnClaim()
        {
            int streak = PlayerPrefs.GetInt(KEY_STREAK, 0);

            string lastClaimStr = PlayerPrefs.GetString(KEY_LAST_CLAIM, "");
            if (!string.IsNullOrEmpty(lastClaimStr))
            {
                long lastClaim;
                if (long.TryParse(lastClaimStr, out lastClaim))
                {
                    long now = System.DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                    long daysSince = (now - lastClaim) / 86400;
                    if (daysSince > 1) streak = 0;
                }
            }

            int dayIndex = Mathf.Clamp(streak, 0, Rewards.Length - 1);
            int amount = Rewards[dayIndex];

            if (Progress != null) Progress.AddCoins(amount);
            if (Sound != null) Sound.PlayWordFound();

            streak++;
            if (streak >= Rewards.Length) streak = 0;

            PlayerPrefs.SetInt(KEY_STREAK, streak);
            PlayerPrefs.SetString(KEY_LAST_CLAIM, System.DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString());
            PlayerPrefs.Save();

            Debug.Log($"[Daily] Claimed {amount} coins");

            OnClose();
        }

        private void CheckAndShow()
        {
            if (CanClaimToday())
                _panel.SetActive(true);
        }

        private void OnClose()
        {
            if (_panel != null)
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
            rt.sizeDelta = new Vector2(900f, 120f);
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
        }
    }
}