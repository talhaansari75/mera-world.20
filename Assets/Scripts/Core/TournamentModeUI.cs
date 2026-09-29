using System;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class TournamentModeUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;

        private Canvas _canvas;
        private GameObject _panel;

        private const string KEY_TOURNAMENT_SCORE = "Tournament_Score";
        private const string KEY_TOURNAMENT_WEEK = "Tournament_Week";

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            Invoke(nameof(Setup), 1.4f);
        }

        private void Setup()
        {
            CheckWeekReset();
            BuildCanvas();
            BuildPanel();
        }

        private void CheckWeekReset()
        {
            string thisWeek = GetWeekKey();
            string savedWeek = PlayerPrefs.GetString(KEY_TOURNAMENT_WEEK, "");
            if (savedWeek != thisWeek)
            {
                PlayerPrefs.SetString(KEY_TOURNAMENT_WEEK, thisWeek);
                PlayerPrefs.SetInt(KEY_TOURNAMENT_SCORE, 0);
                PlayerPrefs.Save();
                Debug.Log("[Tournament] New week — score reset");
            }
        }

        private string GetWeekKey()
        {
            var now = DateTime.UtcNow;
            return $"{now.Year}-W{System.Globalization.ISOWeek.GetWeekOfYear(now):D2}";
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("TournamentCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 780;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("TournamentPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "WEEKLY TOURNAMENT", new Vector2(0f, 830f), 60,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);
            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            int score = PlayerPrefs.GetInt(KEY_TOURNAMENT_SCORE, 0);
            int rank = EstimateRank(score);

            CreateText(_panel.transform, $"YOUR SCORE\n{score}",
                new Vector2(0f, 600f), 60, Color.white, FontStyle.Bold);
            CreateText(_panel.transform, $"ESTIMATED RANK\n#{rank}",
                new Vector2(0f, 400f), 50, new Color(1f, 0.90f, 0.55f), FontStyle.Bold);

            CreateText(_panel.transform, "Earn points by completing\nlevels during the week!",
                new Vector2(0f, 200f), 28, new Color(0.85f, 0.90f, 1f), FontStyle.Normal);

            // Top 10 preview
            CreateText(_panel.transform, "WEEKLY TOP",
                new Vector2(0f, 20f), 40, new Color(0.85f, 0.60f, 1f), FontStyle.Bold);

            string[] fakeTop = { "DragonSlayer99", "ProGamer42", "WordKing", "MysticMage",
                                  "QuickFingers", "FastFinder", "AlphaWolf", "NightOwl",
                                  "PuzzleMaster", "SilentStorm" };

            float y = -140f;
            for (int i = 0; i < 10; i++)
            {
                CreateLeaderRow(i + 1, fakeTop[i], (10 - i) * 250, y);
                y -= 90f;
            }

            _panel.SetActive(false);
        }

        private int EstimateRank(int score)
        {
            if (score >= 5000) return 1;
            if (score >= 4000) return 5;
            if (score >= 3000) return 12;
            if (score >= 2000) return 25;
            if (score >= 1000) return 50;
            if (score >= 500) return 100;
            return 250;
        }

        private void CreateLeaderRow(int rank, string name, int score, float y)
        {
            var rowObj = new GameObject($"Row_{rank}");
            rowObj.transform.SetParent(_panel.transform, false);

            var img = rowObj.AddComponent<Image>();
            img.color = new Color(0.15f, 0.20f, 0.35f, 0.75f);
            img.raycastTarget = false;

            var rt = rowObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(880f, 75f);

            var rankTxt = CreateRowText(rowObj.transform, $"#{rank}", new Vector2(-380f, 0f), 30,
                new Color(0.75f, 0.85f, 1f), TextAnchor.MiddleLeft);
            var nameTxt = CreateRowText(rowObj.transform, name, new Vector2(-200f, 0f), 28,
                Color.white, TextAnchor.MiddleLeft);
            var scoreTxt = CreateRowText(rowObj.transform, score.ToString(), new Vector2(380f, 0f), 30,
                new Color(1f, 0.85f, 0.30f), TextAnchor.MiddleRight);
        }

        private Text CreateRowText(Transform parent, string content, Vector2 pos, int size,
            Color color, TextAnchor anchor)
        {
            var obj = new GameObject("Text");
            obj.transform.SetParent(parent, false);
            var txt = obj.AddComponent<Text>();
            txt.text = content;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.fontSize = size;
            txt.fontStyle = FontStyle.Bold;
            txt.color = color;
            txt.alignment = anchor;
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(anchor == TextAnchor.MiddleLeft ? 0f : 1f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(300f, 60f);
            return txt;
        }

        public void AddTournamentScore(int amount)
        {
            int score = PlayerPrefs.GetInt(KEY_TOURNAMENT_SCORE, 0) + amount;
            PlayerPrefs.SetInt(KEY_TOURNAMENT_SCORE, score);
            PlayerPrefs.Save();
            Debug.Log($"[Tournament] +{amount} → total {score}");
        }

        public void Show() { if (_panel != null) _panel.SetActive(true); }
        public void Hide() { if (_panel != null) _panel.SetActive(false); }
        private void OnBack() { Hide(); }

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
            txt.raycastTarget = false;
            var rt = obj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(900f, 150f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color, UnityEngine.Events.UnityAction onClick)
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