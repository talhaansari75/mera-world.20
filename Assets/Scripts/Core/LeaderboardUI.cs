using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace MeraWorld.Core
{
    public class LeaderboardUI : MonoBehaviour
    {
        [Header("References")]
        public PlayerProgressManager Progress;
        public XPManager XP;

        private Canvas _canvas;
        private GameObject _panel;

        private const string KEY_LEADERBOARD = "LocalLeaderboard";
        private const int MAX_ENTRIES = 10;

        void Start()
        {
            if (Progress == null) Progress = PlayerProgressManager.Instance;
            if (XP == null) XP = XPManager.Instance;
            Invoke(nameof(Setup), 1f);
        }

        private void Setup()
        {
            BuildCanvas();
            BuildPanel();
        }

        private void BuildCanvas()
        {
            var canvasObj = new GameObject("LeaderboardCanvas");
            canvasObj.transform.SetParent(transform);
            _canvas = canvasObj.AddComponent<Canvas>();
            _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            _canvas.sortingOrder = 745;

            var scaler = canvasObj.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080, 1920);
            scaler.matchWidthOrHeight = 0.5f;

            canvasObj.AddComponent<GraphicRaycaster>();
        }

        private void BuildPanel()
        {
            _panel = new GameObject("LeaderboardPanel");
            _panel.transform.SetParent(_canvas.transform, false);

            var bg = _panel.AddComponent<Image>();
            bg.color = new Color(0.06f, 0.10f, 0.24f, 1f);

            var rt = _panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = Vector2.zero;
            rt.offsetMax = Vector2.zero;

            CreateText(_panel.transform, "LEADERBOARD", new Vector2(0f, 830f), 70,
                new Color(1f, 0.85f, 0.3f), FontStyle.Bold);

            CreateSmallButton(_panel.transform, "◀ BACK", new Vector2(-380f, 830f),
                new Color(0.5f, 0.5f, 0.55f), OnBack);

            // Top 3 podium
            CreatePodium();

            // Rest of scores list
            var entries = GetEntries();

            for (int i = 3; i < Mathf.Min(MAX_ENTRIES, entries.Count); i++)
            {
                float y = 200f - (i - 3) * 100f;
                CreateRow(i + 1, entries[i], y);
            }

            if (entries.Count <= 3)
            {
                CreateText(_panel.transform, "Play more levels to fill the leaderboard!",
                    new Vector2(0f, 200f), 28, new Color(0.70f, 0.75f, 0.90f), FontStyle.Italic);
            }

            _panel.SetActive(false);
        }

        private void CreatePodium()
        {
            var entries = GetEntries();

            // 2nd place
            if (entries.Count > 1)
                CreatePodiumSlot(2, entries[1], new Vector2(-250f, 400f),
                    new Color(0.75f, 0.75f, 0.85f), 160f);

            // 1st place
            if (entries.Count > 0)
                CreatePodiumSlot(1, entries[0], new Vector2(0f, 480f),
                    new Color(1f, 0.85f, 0.30f), 200f);

            // 3rd place
            if (entries.Count > 2)
                CreatePodiumSlot(3, entries[2], new Vector2(250f, 350f),
                    new Color(0.85f, 0.55f, 0.30f), 140f);
        }

        private void CreatePodiumSlot(int rank, string entry, Vector2 pos, Color color, float size)
        {
            string[] parts = entry.Split('|');
            string name = parts.Length > 0 ? parts[0] : "Player";
            string score = parts.Length > 1 ? parts[1] : "0";

            var slot = new GameObject($"Podium_{rank}");
            slot.transform.SetParent(_panel.transform, false);

            var bg = slot.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(color, 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;

            var rt = slot.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(size, size);

            // Rank number
            var rankObj = new GameObject("Rank");
            rankObj.transform.SetParent(slot.transform, false);
            var rankTxt = rankObj.AddComponent<Text>();
            rankTxt.text = rank.ToString();
            rankTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            rankTxt.fontSize = 70;
            rankTxt.fontStyle = FontStyle.Bold;
            rankTxt.color = new Color(0.15f, 0.10f, 0.05f);
            rankTxt.alignment = TextAnchor.MiddleCenter;
            rankTxt.raycastTarget = false;
            var rankRt = rankObj.GetComponent<RectTransform>();
            rankRt.anchorMin = new Vector2(0f, 0.5f);
            rankRt.anchorMax = new Vector2(1f, 1f);
            rankRt.offsetMin = Vector2.zero;
            rankRt.offsetMax = Vector2.zero;

            // Name
            var nameObj = new GameObject("Name");
            nameObj.transform.SetParent(slot.transform, false);
            var nameTxt = nameObj.AddComponent<Text>();
            nameTxt.text = name;
            nameTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            nameTxt.fontSize = 22;
            nameTxt.fontStyle = FontStyle.Bold;
            nameTxt.color = Color.white;
            nameTxt.alignment = TextAnchor.MiddleCenter;
            nameTxt.raycastTarget = false;
            var nameRt = nameObj.GetComponent<RectTransform>();
            nameRt.anchorMin = new Vector2(0f, 0.3f);
            nameRt.anchorMax = new Vector2(1f, 0.5f);
            nameRt.offsetMin = Vector2.zero;
            nameRt.offsetMax = Vector2.zero;

            // Score
            var scoreObj = new GameObject("Score");
            scoreObj.transform.SetParent(slot.transform, false);
            var scoreTxt = scoreObj.AddComponent<Text>();
            scoreTxt.text = score;
            scoreTxt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            scoreTxt.fontSize = 28;
            scoreTxt.fontStyle = FontStyle.Bold;
            scoreTxt.color = new Color(0.15f, 0.10f, 0.05f);
            scoreTxt.alignment = TextAnchor.MiddleCenter;
            scoreTxt.raycastTarget = false;
            var scoreRt = scoreObj.GetComponent<RectTransform>();
            scoreRt.anchorMin = new Vector2(0f, 0f);
            scoreRt.anchorMax = new Vector2(1f, 0.3f);
            scoreRt.offsetMin = Vector2.zero;
            scoreRt.offsetMax = Vector2.zero;
        }

        private void CreateRow(int rank, string entry, float y)
        {
            string[] parts = entry.Split('|');
            string name = parts.Length > 0 ? parts[0] : "Player";
            string score = parts.Length > 1 ? parts[1] : "0";

            var rowObj = new GameObject($"Row_{rank}");
            rowObj.transform.SetParent(_panel.transform, false);

            var bg = rowObj.AddComponent<Image>();
            bg.sprite = UISpriteFactory.Create3DButtonSprite(new Color(0.15f, 0.20f, 0.35f), 256, 40);
            bg.type = Image.Type.Sliced;
            bg.color = Color.white;
            bg.raycastTarget = false;

            var rt = rowObj.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 0.5f);
            rt.anchorMax = new Vector2(0.5f, 0.5f);
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.anchoredPosition = new Vector2(0f, y);
            rt.sizeDelta = new Vector2(880f, 80f);

            CreateRowText(rowObj.transform, rank.ToString(), new Vector2(-380f, 0f), 36,
                new Color(0.70f, 0.80f, 1f), TextAnchor.MiddleLeft);

            CreateRowText(rowObj.transform, name, new Vector2(-100f, 0f), 32,
                Color.white, TextAnchor.MiddleLeft);

            CreateRowText(rowObj.transform, score, new Vector2(380f, 0f), 36,
                new Color(1f, 0.85f, 0.30f), TextAnchor.MiddleRight);
        }

        private void CreateRowText(Transform parent, string content, Vector2 pos, int size,
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
        }

        public List<string> GetEntries()
        {
            var result = new List<string>();
            string raw = PlayerPrefs.GetString(KEY_LEADERBOARD, "");

            if (string.IsNullOrEmpty(raw))
            {
                // Add default scores
                result.Add("Player|" + (Progress != null ? Progress.TotalStars * 100 + Progress.HighestLevelUnlocked * 50 : 100));
                return result;
            }

            var entries = raw.Split(';');
            foreach (var e in entries)
                if (!string.IsNullOrEmpty(e)) result.Add(e);

            return result;
        }

        public void AddScore(string playerName, int score)
        {
            var entries = GetEntries();
            entries.Add($"{playerName}|{score}");

            entries.Sort((a, b) =>
            {
                int sa = ParseScore(a);
                int sb = ParseScore(b);
                return sb.CompareTo(sa);
            });

            if (entries.Count > MAX_ENTRIES)
                entries.RemoveRange(MAX_ENTRIES, entries.Count - MAX_ENTRIES);

            PlayerPrefs.SetString(KEY_LEADERBOARD, string.Join(";", entries));
            PlayerPrefs.Save();
        }

        private int ParseScore(string entry)
        {
            var parts = entry.Split('|');
            if (parts.Length < 2) return 0;
            int s;
            return int.TryParse(parts[1], out s) ? s : 0;
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
            rt.sizeDelta = new Vector2(900f, 120f);
            return txt;
        }

        private void CreateSmallButton(Transform parent, string label, Vector2 pos, Color color,
            UnityEngine.Events.UnityAction onClick)
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